import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

import { ENV } from "./env";

// Mobile Supabase client. Unlike the web app (cookie-based @supabase/ssr), the
// session is persisted in AsyncStorage and auto-refreshed. RLS policies are
// identical across platforms — they key off auth.uid(), so no server change is
// needed for mobile to read the same rows.
export const supabase = createClient(ENV.supabaseUrl, ENV.supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    // No URL-based session detection on native (that's a web OAuth-redirect concern).
    detectSessionInUrl: false,
  },
});
