"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Bell, RotateCcw } from "lucide-react";
import { toast } from "sonner";

import type { CheckIn, JourneyRecord } from "@/types";
import { categoryLabel, HABIT_CATEGORIES } from "@/constants/habits";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { FadeIn } from "@/components/motion/motion";
import { PlanView } from "@/components/plan/plan-view";
import { TrackerCard } from "@/components/tracker/tracker-card";
import { ProgressPanel } from "@/components/progress/progress-panel";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { ThemeToggle } from "@/components/theme/theme-toggle";

// Below-the-fold, interaction-only widgets — lazy-loaded so they stay out of the
// initial dashboard bundle. Neither needs SSR (both are purely client-interactive).
const SosPanel = dynamic(
  () => import("@/components/sos/sos-panel").then((m) => m.SosPanel),
  { ssr: false, loading: () => <Skeleton className="h-10 w-full rounded-lg" /> },
);
const CoachChat = dynamic(
  () => import("@/components/coach/coach-chat").then((m) => m.CoachChat),
  { ssr: false, loading: () => <Skeleton className="h-64 w-full rounded-xl" /> },
);

interface DashboardProps {
  journey: JourneyRecord;
}

/** The signed-in home once a journey exists: nudge, tracking, coach, plan, SOS. */
export function Dashboard({ journey }: DashboardProps) {
  const router = useRouter();
  const { habit, plan, habitId } = journey;
  const emoji =
    HABIT_CATEGORIES.find((c) => c.value === habit.category)?.emoji ?? "🎯";

  const handleCheckIn = useCallback(
    async (checkIn: CheckIn) => {
      const res = await fetch("/api/check-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ habitId, checkIn }),
      });
      if (!res.ok) throw new Error("check-in failed");
      router.refresh();
    },
    [habitId, router],
  );

  const handleReset = useCallback(async () => {
    const res = await fetch("/api/habit", { method: "DELETE" });
    if (res.ok) {
      router.refresh();
    } else {
      toast.error("Couldn't reset. Try again.");
    }
  }, [router]);

  return (
    <main className="mx-auto w-full max-w-6xl space-y-6 px-4 py-10 sm:px-6 lg:py-14">
      <FadeIn className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-2xl shadow-sm">
            {emoji}
          </div>
          <div>
            <p className="text-sm text-muted-foreground">
              {categoryLabel(habit.category)} •{" "}
              {habit.goalType === "quit" ? "Quitting" : "Cutting down"}
            </p>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {habit.habitName}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <Button variant="ghost" size="sm" onClick={handleReset}>
            <RotateCcw aria-hidden />
            Change habit
          </Button>
          <SignOutButton />
        </div>
      </FadeIn>

      <FadeIn delay={0.05}>
        <Card className="overflow-hidden border-primary/30 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
          <CardContent className="flex items-start gap-3 pt-6">
            <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
              <Bell className="size-5" aria-hidden />
            </span>
            <div>
              <p className="text-sm font-medium">Today&apos;s nudge</p>
              <p className="text-sm text-muted-foreground">{plan.dailyNudge}</p>
            </div>
          </CardContent>
        </Card>
      </FadeIn>

      <div className="grid gap-6 lg:grid-cols-5">
        <FadeIn delay={0.1} className="space-y-4 lg:col-span-2">
          <TrackerCard journey={journey} onCheckIn={handleCheckIn} />
          <SosPanel habit={habit} />
          <CoachChat />
        </FadeIn>
        <FadeIn delay={0.15} className="space-y-4 lg:col-span-3">
          <ProgressPanel journey={journey} />
          <PlanView plan={plan} />
        </FadeIn>
      </div>
    </main>
  );
}
