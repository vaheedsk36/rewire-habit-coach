import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser Supabase client for Client Components. Uses only public env vars
 * (URL + anon key) — RLS on the server enforces per-user access, so the anon
 * key is safe to ship to the browser.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
