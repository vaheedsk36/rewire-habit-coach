import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

import { config } from '../config';

// Bare React Native Supabase client. Session lives in AsyncStorage and is
// auto-refreshed. PKCE flow is required for the mobile OAuth deep-link redirect
// (we exchange the returned code for a session). RLS is identical to web —
// policies key off auth.uid() — so no backend change is needed for mobile.
export const supabase = createClient(config.supabaseUrl, config.supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    flowType: 'pkce',
  },
});
