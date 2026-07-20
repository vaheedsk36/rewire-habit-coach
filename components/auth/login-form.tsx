"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Brain, Check, Eye, EyeOff, Loader2, LogIn, X } from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { motion } from "@/components/motion/motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field } from "@/components/shared/field";

// Gated so we never render a Google button until the provider is actually
// enabled in Supabase (otherwise clicking it would error). Flip the env flag
// once the Google provider is configured.
const GOOGLE_ENABLED =
  process.env.NEXT_PUBLIC_GOOGLE_OAUTH_ENABLED === "true";

type Mode = "sign_in" | "sign_up";

function GoogleIcon() {
  return (
    <svg className="size-4" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1Z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.26 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38Z"
      />
    </svg>
  );
}

/** Password rules enforced on sign-up (client-side; Supabase also enforces server-side). */
function passwordChecks(pw: string) {
  return [
    { label: "At least 8 characters", ok: pw.length >= 8 },
    { label: "A letter", ok: /[a-zA-Z]/.test(pw) },
    { label: "A number", ok: /\d/.test(pw) },
  ];
}

export function LoginForm() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("sign_in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const checks = useMemo(() => passwordChecks(password), [password]);
  const pwStrong = checks.every((c) => c.ok);

  async function authenticate(creds: { email: string; password: string }) {
    setLoading(true);
    setError(null);
    setNotice(null);
    const supabase = createClient();

    if (mode === "sign_up") {
      const { data, error } = await supabase.auth.signUp(creds);
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
      // Email-confirmation flow: user created but no active session yet.
      if (!data.session) {
        setMode("sign_in");
        setPassword("");
        setConfirm("");
        setNotice(
          "Account created. Check your email to confirm, then sign in.",
        );
        setLoading(false);
        return;
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword(creds);
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
    }
    router.replace("/app");
    router.refresh();
  }

  async function signInWithGoogle() {
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    }
    // On success the browser is redirected to Google.
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (mode === "sign_up") {
      if (!pwStrong) {
        setError("Please choose a stronger password.");
        return;
      }
      if (password !== confirm) {
        setError("Passwords don't match.");
        return;
      }
    }
    void authenticate({ email, password });
  }

  return (
    <Card className="glass w-full max-w-sm shadow-xl ring-1 ring-border/50">
      <CardHeader className="text-center">
        <div className="mx-auto mb-2 flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20">
          <Brain className="size-7" aria-hidden />
        </div>
        <CardTitle className="text-2xl">
          Welcome to <span className="text-gradient">Rewire</span>
        </CardTitle>
        <CardDescription>
          {mode === "sign_in"
            ? "Sign in to continue your journey."
            : "Create an account to start."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={onSubmit} noValidate>
          <Field label="Email" htmlFor="email">
            <Input
              id="email"
              type="email"
              autoComplete="email"
              className="h-11"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Field>

          <Field label="Password" htmlFor="password">
            <div className="relative">
              <Input
                id="password"
                type={showPw ? "text" : "password"}
                autoComplete={
                  mode === "sign_in" ? "current-password" : "new-password"
                }
                className="h-11 pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                aria-label={showPw ? "Hide password" : "Show password"}
                onClick={() => setShowPw((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPw ? (
                  <EyeOff className="size-4" aria-hidden />
                ) : (
                  <Eye className="size-4" aria-hidden />
                )}
              </button>
            </div>
          </Field>

          {mode === "sign_up" && (
            <>
              <ul className="space-y-1">
                {checks.map((c) => (
                  <li
                    key={c.label}
                    className={cn(
                      "flex items-center gap-1.5 text-xs",
                      c.ok ? "text-primary" : "text-muted-foreground",
                    )}
                  >
                    {c.ok ? (
                      <Check className="size-3.5" aria-hidden />
                    ) : (
                      <X className="size-3.5" aria-hidden />
                    )}
                    {c.label}
                  </li>
                ))}
              </ul>

              <Field label="Confirm password" htmlFor="confirm">
                <Input
                  id="confirm"
                  type={showPw ? "text" : "password"}
                  autoComplete="new-password"
                  className="h-11"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                />
              </Field>
              {confirm.length > 0 && confirm !== password && (
                <p className="text-xs text-destructive">
                  Passwords don&apos;t match.
                </p>
              )}
            </>
          )}

          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}
          {notice && (
            <p className="rounded-lg bg-primary/10 p-2.5 text-sm text-primary" role="status">
              {notice}
            </p>
          )}

          <motion.div whileTap={{ scale: 0.99 }}>
            <Button
              type="submit"
              disabled={loading}
              className="h-11 w-full bg-gradient-to-r from-primary to-emerald-500 font-semibold shadow-lg shadow-primary/20 transition-shadow hover:shadow-primary/40"
            >
              {loading ? (
                <Loader2 className="animate-spin" aria-hidden />
              ) : (
                <LogIn aria-hidden />
              )}
              {mode === "sign_in" ? "Sign in" : "Create account"}
            </Button>
          </motion.div>
        </form>

        {GOOGLE_ENABLED && (
          <>
            <div className="my-4 flex items-center gap-3 text-xs text-muted-foreground">
              <span className="h-px flex-1 bg-border" />
              or
              <span className="h-px flex-1 bg-border" />
            </div>
            <Button
              variant="outline"
              className="h-11 w-full"
              disabled={loading}
              onClick={() => void signInWithGoogle()}
            >
              <GoogleIcon />
              Continue with Google
            </Button>
          </>
        )}

        <button
          type="button"
          className="mt-4 w-full text-center text-sm text-muted-foreground hover:text-foreground"
          onClick={() => {
            setMode((m) => (m === "sign_in" ? "sign_up" : "sign_in"));
            setError(null);
            setNotice(null);
          }}
        >
          {mode === "sign_in"
            ? "Don't have an account? Sign up"
            : "Already have an account? Sign in"}
        </button>
      </CardContent>
    </Card>
  );
}
