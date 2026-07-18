"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { Bell, RotateCcw } from "lucide-react";
import { toast } from "sonner";

import type { CheckIn, JourneyRecord } from "@/types";
import { categoryLabel } from "@/constants/habits";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PlanView } from "@/components/plan/plan-view";
import { TrackerCard } from "@/components/tracker/tracker-card";
import { SosPanel } from "@/components/sos/sos-panel";
import { CoachChat } from "@/components/coach/coach-chat";
import { SignOutButton } from "@/components/auth/sign-out-button";

interface DashboardProps {
  journey: JourneyRecord;
}

/** The signed-in home once a journey exists: nudge, tracking, coach, plan, SOS. */
export function Dashboard({ journey }: DashboardProps) {
  const router = useRouter();
  const { habit, plan, habitId } = journey;

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
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">
            {categoryLabel(habit.category)} •{" "}
            {habit.goalType === "quit" ? "Quitting" : "Cutting down"}
          </p>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {habit.habitName}
          </h1>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={handleReset}>
            <RotateCcw aria-hidden />
            Change habit
          </Button>
          <SignOutButton />
        </div>
      </div>

      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="flex items-start gap-3 pt-6">
          <Bell className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
          <div>
            <p className="text-sm font-medium">Today&apos;s nudge</p>
            <p className="text-sm text-muted-foreground">{plan.dailyNudge}</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="space-y-4 lg:col-span-2">
          <TrackerCard journey={journey} onCheckIn={handleCheckIn} />
          <SosPanel habit={habit} />
          <CoachChat />
        </div>
        <div className="lg:col-span-3">
          <PlanView plan={plan} />
        </div>
      </div>
    </main>
  );
}
