import { SUPABASE_URL, SUPABASE_ANON_KEY, API_URL } from '@env';

// Public client config, inlined from .env at build time. These are NOT secrets:
// the Supabase anon key is public and RLS-guarded, and the API URL is the
// deployed web app. Never put the service-role or OpenAI key here.

function required(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(
      `Missing ${name}. Copy apps/mobile/.env.example to apps/mobile/.env and fill it in.`,
    );
  }
  return value;
}

export const config = {
  supabaseUrl: required('SUPABASE_URL', SUPABASE_URL),
  supabaseAnonKey: required('SUPABASE_ANON_KEY', SUPABASE_ANON_KEY),
  // The AI route handlers live on the deployed web app; overridable for local dev.
  apiUrl: API_URL ?? 'https://rewire-habit-coach.vercel.app',
  // Deep-link scheme for the OAuth redirect (matches app.json / native config).
  authRedirect: 'rewire://auth',
} as const;
