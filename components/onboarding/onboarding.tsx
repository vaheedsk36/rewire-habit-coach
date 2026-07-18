"use client";

import { AlertTriangle, Brain, RotateCcw } from "lucide-react";

import { useOnboarding } from "@/hooks/use-onboarding";
import { OnboardingForm } from "@/components/onboarding/onboarding-form";
import { PlanGenerating } from "@/components/plan/plan-generating";
import { StatusPanel } from "@/components/shared/status-panel";
import { Button } from "@/components/ui/button";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { FadeIn } from "@/components/motion/motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

/** The first-run experience: define a habit → generate + save an AI plan. */
export function Onboarding() {
  const { status, error, submit, retry } = useOnboarding();

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-10 sm:px-6 lg:py-14">
      <div className="mb-4 flex items-center justify-end gap-1">
        <ThemeToggle />
        <SignOutButton />
      </div>

      <FadeIn className="mb-8 text-center">
        <div className="mx-auto mb-3 flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20">
          <Brain className="size-7" aria-hidden />
        </div>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          <span className="text-gradient">Rewire</span>
        </h1>
        <p className="mx-auto mt-3 max-w-md text-muted-foreground">
          Break a bad habit for good. Tell Rewire what you&apos;re changing and
          get a personalized, AI-built recovery plan with an adaptive coach.
        </p>
      </FadeIn>

      <FadeIn delay={0.05}>
        {status === "error" && (
          <StatusPanel
            icon={AlertTriangle}
            tone="error"
            title="Couldn't build your plan"
            message={error ?? "Please try again."}
          >
            <Button onClick={retry} variant="outline">
              <RotateCcw aria-hidden />
              Try again
            </Button>
          </StatusPanel>
        )}

        {status === "loading" ? (
          <PlanGenerating />
        ) : status !== "error" ? (
          <Card>
            <CardHeader>
              <CardTitle>Start your journey</CardTitle>
              <CardDescription>
                A few honest answers and we&apos;ll do the rest.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <OnboardingForm onSubmit={submit} isLoading={false} />
            </CardContent>
          </Card>
        ) : null}
      </FadeIn>
    </main>
  );
}
