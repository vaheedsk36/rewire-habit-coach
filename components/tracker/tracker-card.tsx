"use client";

import { useState } from "react";
import { Check, Flame, ThumbsDown, Trophy } from "lucide-react";
import { toast } from "sonner";

import type { CheckIn, Journey } from "@/types";
import { currentStreak, daysSince, todayISO, totalWins } from "@/lib/streak";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface TrackerCardProps {
  journey: Journey;
  onCheckIn: (checkIn: CheckIn) => void;
}

/** Daily check-in + streak tracking. Local-first: state is persisted by the parent. */
export function TrackerCard({ journey, onCheckIn }: TrackerCardProps) {
  const today = todayISO();
  const loggedToday = journey.checkIns.find((c) => c.date === today);
  const [note, setNote] = useState("");

  const streak = currentStreak(journey.checkIns);
  const wins = totalWins(journey.checkIns);
  const day = daysSince(journey.startedAt);

  const log = (status: CheckIn["status"]) => {
    onCheckIn({ date: today, status, note: note.trim() || undefined });
    setNote("");
    toast.success(
      status === "win"
        ? "Logged a win. Keep the streak alive 🔥"
        : "Logged — a slip isn't the end. Tomorrow's a fresh day.",
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Flame className="size-5 text-primary" aria-hidden />
          <CardTitle>Today&apos;s check-in</CardTitle>
        </div>
        <CardDescription>Day {day} of your journey</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Stat icon={Flame} label="Current streak" value={`${streak}d`} />
          <Stat icon={Trophy} label="Total wins" value={String(wins)} />
        </div>

        {loggedToday ? (
          <div className="flex items-center gap-2 rounded-lg bg-muted p-3 text-sm">
            <Check className="size-4 text-primary" aria-hidden />
            <span>
              {loggedToday.status === "win"
                ? "You logged a win today. Proud of you."
                : "You logged a slip today. Be kind to yourself — keep going."}
            </span>
          </div>
        ) : (
          <div className="space-y-3">
            <label htmlFor="checkin-note" className="sr-only">
              Optional note
            </label>
            <textarea
              id="checkin-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              placeholder="How did today go? (optional)"
              className="w-full resize-none rounded-lg border bg-transparent p-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            />
            <div className="flex gap-2">
              <Button className="flex-1" onClick={() => log("win")}>
                <Check aria-hidden />
                Stayed on track
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => log("slip")}
              >
                <ThumbsDown aria-hidden />
                Slipped up
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Flame;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border p-3">
      <div className="flex items-center gap-1.5 text-muted-foreground">
        <Icon className="size-4" aria-hidden />
        <span className="text-xs">{label}</span>
      </div>
      <p className="mt-1 text-2xl font-semibold tabular-nums">{value}</p>
    </div>
  );
}
