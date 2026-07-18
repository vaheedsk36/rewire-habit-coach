"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Brain, RotateCcw, Sparkles } from "lucide-react";

import type { HabitInput } from "@/types";
import { useJourney } from "@/hooks/use-journey";
import { usePlanGeneration } from "@/hooks/use-plan-generation";
import { OnboardingForm } from "@/components/onboarding/onboarding-form";
import { PlanSkeleton } from "@/components/plan/plan-skeleton";
import { Dashboard } from "@/components/dashboard/dashboard";
import { StatusPanel } from "@/components/shared/status-panel";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  const { journey, hydrated, start, addCheckIn, reset } = useJourney();
  const { status, plan, error, generate, retry, reset: resetGen } =
    usePlanGeneration();
  const [pendingHabit, setPendingHabit] = useState<HabitInput | null>(null);

  // Once the AI plan lands, persist the journey and switch to the dashboard.
  useEffect(() => {
    if (status === "success" && plan && pendingHabit) {
      start({ habit: pendingHabit, plan });
      setPendingHabit(null);
      resetGen();
    }
  }, [status, plan, pendingHabit, start, resetGen]);

  function handleGenerate(input: HabitInput) {
    setPendingHabit(input);
    void generate(input);
  }

  // Stable shell until the client has read local storage (no hydration flash).
  if (!hydrated) {
    return <main className="mx-auto min-h-screen w-full max-w-6xl px-4 py-12" />;
  }

  if (journey) {
    return (
      <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
        <Dashboard journey={journey} onCheckIn={addCheckIn} onReset={reset} />
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
      <header className="mb-8 text-center">
        <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Brain className="size-6" aria-hidden />
        </div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Rewire</h1>
        <p className="mx-auto mt-2 max-w-xl text-muted-foreground">
          Break a bad habit for good. Tell Rewire what you&apos;re changing and
          get a personalized, AI-built recovery plan — with nudges, coping
          strategies, and in-the-moment support.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Card className="lg:sticky lg:top-6">
            <CardHeader>
              <CardTitle>Start your journey</CardTitle>
              <CardDescription>
                A few honest answers and we&apos;ll do the rest.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <OnboardingForm
                onSubmit={handleGenerate}
                isLoading={status === "loading"}
              />
            </CardContent>
          </Card>
        </div>

        <section className="lg:col-span-3" aria-live="polite">
          {status === "idle" && (
            <StatusPanel
              icon={Sparkles}
              title="Your recovery plan will appear here"
              message="Fill in your habit and we'll build a personalized plan with milestones, coping strategies, and daily nudges."
            />
          )}

          {status === "loading" && <PlanSkeleton />}

          {status === "error" && (
            <StatusPanel
              icon={AlertTriangle}
              tone="error"
              title="Something went wrong"
              message={error ?? "Please try again."}
            >
              <Button onClick={retry} variant="outline">
                <RotateCcw aria-hidden />
                Try again
              </Button>
            </StatusPanel>
          )}
        </section>
      </div>
    </main>
  );
}
