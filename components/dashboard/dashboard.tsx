"use client";

import { Bell, RotateCcw } from "lucide-react";

import type { CheckIn, Journey } from "@/types";
import { categoryLabel } from "@/constants/habits";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PlanView } from "@/components/plan/plan-view";
import { TrackerCard } from "@/components/tracker/tracker-card";
import { SosPanel } from "@/components/sos/sos-panel";

interface DashboardProps {
  journey: Journey;
  onCheckIn: (checkIn: CheckIn) => void;
  onReset: () => void;
}

/** The signed-in-style home once a journey exists: nudge, tracking, plan, SOS. */
export function Dashboard({ journey, onCheckIn, onReset }: DashboardProps) {
  const { habit, plan } = journey;

  return (
    <div className="space-y-6">
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
        <Button variant="ghost" size="sm" onClick={onReset}>
          <RotateCcw aria-hidden />
          Change habit
        </Button>
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
          <div className="lg:sticky lg:top-6 lg:space-y-4">
            <TrackerCard journey={journey} onCheckIn={onCheckIn} />
            <SosPanel habit={habit} />
          </div>
        </div>
        <div className="lg:col-span-3">
          <PlanView plan={plan} />
        </div>
      </div>
    </div>
  );
}
