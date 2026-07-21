import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { Linking } from 'react-native';
import type { Session } from '@supabase/supabase-js';

import { config } from '../config';
import { supabase } from './supabase';

interface AuthState {
  session: Session | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthState>({
  session: null,
  loading: true,
  signInWithGoogle: async () => {},
  signOut: async () => {},
});

/** Exchange the `?code=…` from the OAuth deep-link redirect for a session. */
async function completeOAuth(url: string): Promise<void> {
  const code = new URL(url).searchParams.get('code');
  if (code) {
    await supabase.auth.exchangeCodeForSession(code);
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const { data } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
    });

    // Handle the deep link both when the app is already open and on cold start.
    const sub = Linking.addEventListener('url', ({ url }) => {
      void completeOAuth(url);
    });
    Linking.getInitialURL().then((url) => {
      if (url) void completeOAuth(url);
    });

    return () => {
      data.subscription.unsubscribe();
      sub.remove();
    };
  }, []);

  const signInWithGoogle = useCallback(async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: config.authRedirect, skipBrowserRedirect: true },
    });
    if (error) throw error;
    if (data?.url) await Linking.openURL(data.url);
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  return (
    <AuthContext.Provider value={{ session, loading, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
