"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Brain, Loader2, LogIn } from "lucide-react";

import { createClient } from "@/lib/supabase/client";
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

const DEMO = { email: "demo@rewire.app", password: "RewireDemo2026!" };

type Mode = "sign_in" | "sign_up";

export function LoginForm() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("sign_in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function authenticate(creds: { email: string; password: string }) {
    setLoading(true);
    setError(null);
    const supabase = createClient();

    const { error } =
      mode === "sign_in"
        ? await supabase.auth.signInWithPassword(creds)
        : await supabase.auth.signUp(creds);

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    router.replace("/");
    router.refresh();
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
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            void authenticate({ email, password });
          }}
          noValidate
        >
          <Field label="Email" htmlFor="email">
            <Input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Field>
          <Field label="Password" htmlFor="password">
            <Input
              id="password"
              type="password"
              autoComplete={
                mode === "sign_in" ? "current-password" : "new-password"
              }
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Field>

          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <Loader2 className="animate-spin" aria-hidden />
            ) : (
              <LogIn aria-hidden />
            )}
            {mode === "sign_in" ? "Sign in" : "Create account"}
          </Button>
        </form>

        <Button
          variant="outline"
          className="mt-3 w-full"
          disabled={loading}
          onClick={() => {
            setMode("sign_in");
            setEmail(DEMO.email);
            setPassword(DEMO.password);
            void authenticate(DEMO);
          }}
        >
          Use demo account
        </Button>

        <button
          type="button"
          className="mt-4 w-full text-center text-sm text-muted-foreground hover:text-foreground"
          onClick={() => {
            setMode((m) => (m === "sign_in" ? "sign_up" : "sign_in"));
            setError(null);
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
