"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import {
  Bell,
  CalendarDays,
  ListChecks,
  RotateCcw,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";

import type { CheckIn, JourneyRecord } from "@/types";
import { categoryLabel, HABIT_CATEGORIES } from "@/constants/habits";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { FadeIn } from "@/components/motion/motion";
import { PlanView } from "@/components/plan/plan-view";
import { TrackerCard } from "@/components/tracker/tracker-card";
import { ProgressPanel } from "@/components/progress/progress-panel";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { ThemeToggle } from "@/components/theme/theme-toggle";

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

type Tab = "today" | "plan" | "progress";

const TABS: { id: Tab; label: string; icon: typeof Bell }[] = [
  { id: "today", label: "Today", icon: CalendarDays },
  { id: "plan", label: "My plan", icon: ListChecks },
  { id: "progress", label: "Progress", icon: TrendingUp },
];

/** Tabbed home so each view fits a screen instead of one long scroll. */
export function Dashboard({ journey }: DashboardProps) {
  const router = useRouter();
  const { habit, plan, habitId } = journey;
  // Just onboarded (no check-ins yet)? Open on the plan — it's what they just
  // built. Returning users who've started tracking land on Today.
  const [tab, setTab] = useState<Tab>(
    journey.checkIns.length === 0 ? "plan" : "today",
  );
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
    if (res.ok) router.refresh();
    else toast.error("Couldn't reset. Try again.");
  }, [router]);

  return (
    <main className="mx-auto w-full max-w-6xl space-y-5 px-4 py-8 sm:px-6">
      <FadeIn className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-2xl shadow-sm ring-1 ring-primary/15">
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

      {/* Tab bar */}
      <div
        role="tablist"
        aria-label="Dashboard sections"
        className="flex gap-1 overflow-x-auto rounded-xl border bg-card p-1"
      >
        {TABS.map((t) => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              role="tab"
              aria-selected={active}
              onClick={() => setTab(t.id)}
              className={cn(
                "flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors",
                active
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <t.icon className="size-4" aria-hidden />
              {t.label}
            </button>
          );
        })}
      </div>

      {tab === "today" && (
        <FadeIn key="today" className="space-y-5">
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

          <div className="grid gap-5 lg:grid-cols-2">
            <div className="space-y-4">
              <TrackerCard journey={journey} onCheckIn={handleCheckIn} />
              <SosPanel habit={habit} />
            </div>
            <CoachChat />
          </div>
        </FadeIn>
      )}

      {tab === "plan" && (
        <FadeIn key="plan">
          <PlanView plan={plan} />
        </FadeIn>
      )}

      {tab === "progress" && (
        <FadeIn key="progress">
          <ProgressPanel journey={journey} />
        </FadeIn>
      )}
    </main>
  );
}
