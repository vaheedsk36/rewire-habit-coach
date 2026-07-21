// Public client env. Expo inlines EXPO_PUBLIC_* vars at build time. These are
// not secrets (the Supabase anon key and the public API URL), so shipping them
// in the bundle is expected — never put the service-role key or OpenAI key here.

function required(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(
      `Missing ${name}. Copy apps/mobile/.env.example to apps/mobile/.env and fill it in.`,
    );
  }
  return value;
}

export const ENV = {
  supabaseUrl: required(
    "EXPO_PUBLIC_SUPABASE_URL",
    process.env.EXPO_PUBLIC_SUPABASE_URL,
  ),
  supabaseAnonKey: required(
    "EXPO_PUBLIC_SUPABASE_ANON_KEY",
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
  ),
  // Where the AI route handlers live (the deployed web app). Overridable for
  // local development against a dev server.
  apiUrl: process.env.EXPO_PUBLIC_API_URL ?? "https://rewire-habit-coach.vercel.app",
} as const;
