"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  Bell,
  CalendarDays,
  ListChecks,
  Plus,
  Trash2,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";

import type { CheckIn, HabitSummary, JourneyRecord } from "@/types";
import { categoryLabel, HABIT_CATEGORIES } from "@/constants/habits";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { FadeIn } from "@/components/motion/motion";
import { PlanView } from "@/components/plan/plan-view";
import { TrackerCard } from "@/components/tracker/tracker-card";
import { ProgressPanel } from "@/components/progress/progress-panel";
import { BadgesCard } from "@/components/progress/badges-card";
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
  habits: HabitSummary[];
  name: string;
}

type Tab = "today" | "plan" | "progress";

const TABS: { id: Tab; label: string; icon: typeof Bell }[] = [
  { id: "today", label: "Today", icon: CalendarDays },
  { id: "plan", label: "My plan", icon: ListChecks },
  { id: "progress", label: "Progress", icon: TrendingUp },
];

const emojiFor = (category: string) =>
  HABIT_CATEGORIES.find((c) => c.value === category)?.emoji ?? "🎯";

/** Tabbed home with a habit switcher — track and switch between multiple habits. */
export function Dashboard({ journey, habits, name }: DashboardProps) {
  const router = useRouter();
  const { habit, plan, habitId } = journey;
  const [tab, setTab] = useState<Tab>(
    journey.checkIns.length === 0 ? "plan" : "today",
  );
  const [deleting, setDeleting] = useState(false);

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

  const switchHabit = useCallback(
    (id: string) => {
      if (id !== habitId) router.push(`/app?habit=${id}`);
    },
    [habitId, router],
  );

  const handleDelete = useCallback(async () => {
    if (
      !window.confirm(
        `Delete "${habit.habitName}" and its check-ins? This can't be undone.`,
      )
    )
      return;
    setDeleting(true);
    const res = await fetch(`/api/habit?habitId=${habitId}`, {
      method: "DELETE",
    });
    if (res.ok) {
      router.push("/app");
      router.refresh();
    } else {
      setDeleting(false);
      toast.error("Couldn't delete that habit. Try again.");
    }
  }, [habit.habitName, habitId, router]);

  return (
    <main className="mx-auto w-full max-w-6xl space-y-5 px-4 py-8 sm:px-6">
      {/* Greeting + account controls */}
      <FadeIn className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Hi, <span className="font-medium text-foreground">{name}</span> 👋
        </p>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <SignOutButton />
        </div>
      </FadeIn>

      {/* Habit switcher */}
      <FadeIn delay={0.03} className="flex flex-wrap items-center gap-2">
        {habits.map((h) => {
          const active = h.id === habitId;
          return (
            <button
              key={h.id}
              onClick={() => switchHabit(h.id)}
              aria-current={active}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors",
                active
                  ? "border-primary bg-primary/10 font-medium text-primary"
                  : "border-border hover:border-primary/40 hover:bg-muted",
              )}
            >
              <span>{emojiFor(h.category)}</span>
              <span className="max-w-[12rem] truncate">{h.habitName}</span>
            </button>
          );
        })}
        <Link
          href="/app/new"
          className="inline-flex items-center gap-1.5 rounded-full border border-dashed px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
        >
          <Plus className="size-4" aria-hidden />
          Add habit
        </Link>
      </FadeIn>

      {/* Current habit title */}
      <FadeIn delay={0.05} className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-2xl shadow-sm ring-1 ring-primary/15">
            {emojiFor(habit.category)}
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
        <Button
          variant="ghost"
          size="sm"
          disabled={deleting}
          onClick={handleDelete}
          className="text-muted-foreground hover:text-destructive"
        >
          <Trash2 aria-hidden />
          Delete
        </Button>
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
        <FadeIn key="progress" className="space-y-5">
          <ProgressPanel journey={journey} />
          <BadgesCard journey={journey} />
        </FadeIn>
      )}
    </main>
  );
}
