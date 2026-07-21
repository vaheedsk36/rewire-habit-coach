import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { createClient as createTokenClient } from "@supabase/supabase-js";
import { cookies, headers } from "next/headers";

type CookieToSet = { name: string; value: string; options: CookieOptions };

/**
 * Server Supabase client for Server Components, Route Handlers, and Server
 * Actions. Authenticates as the signed-in user so RLS applies, supporting BOTH
 * clients:
 *
 * - Web (cookies) — the default: session read/written via Next's cookie store.
 * - Mobile / API (Bearer token) — when an `Authorization: Bearer <jwt>` header
 *   is present, we authenticate with that token instead. The bare React Native
 *   app has no cookies, so it sends the user's Supabase access token; every
 *   query then carries it and RLS sees the same `auth.uid()`. No route changes
 *   needed — callers keep using `createClient()` + `auth.getUser()`.
 */
export async function createClient() {
  const headerStore = await headers();
  const authHeader = headerStore.get("authorization");

  if (authHeader?.toLowerCase().startsWith("bearer ")) {
    return createTokenClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: { headers: { Authorization: authHeader } },
        // Token clients are stateless — never persist or refresh a session here.
        auth: { persistSession: false, autoRefreshToken: false },
      },
    );
  }

  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Called from a Server Component — safe to ignore; middleware refreshes.
          }
        },
      },
    },
  );
}
