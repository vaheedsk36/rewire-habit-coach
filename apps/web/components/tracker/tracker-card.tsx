"use client";

import { useState } from "react";
import {
  ArrowRight,
  Check,
  Flame,
  Heart,
  Loader2,
  Sparkles,
  ThumbsDown,
  Trophy,
  X,
} from "lucide-react";
import { toast } from "sonner";

import type { CheckIn, JourneyRecord } from "@/types";
import { currentStreak, daysSince, todayISO, totalWins } from "@/lib/streak";
import { celebrate } from "@/lib/confetti";
import { useReframe } from "@/hooks/use-reframe";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface TrackerCardProps {
  journey: JourneyRecord;
  onCheckIn: (checkIn: CheckIn) => Promise<void>;
}

/** Daily check-in + streak tracking, with confetti on wins and an AI reframe on slips. */
export function TrackerCard({ journey, onCheckIn }: TrackerCardProps) {
  const today = todayISO();
  const loggedToday = journey.checkIns.find((c) => c.date === today);
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const reframe = useReframe();

  const streak = currentStreak(journey.checkIns);
  const wins = totalWins(journey.checkIns);
  const day = daysSince(journey.startedAt);

  async function log(status: CheckIn["status"]) {
    setSubmitting(true);
    const trimmedNote = note.trim() || undefined;
    try {
      await onCheckIn({ date: today, status, note: trimmedNote });
      setNote("");
      if (status === "win") {
        celebrate();
        toast.success("Logged a win. Keep the streak alive 🔥");
      } else {
        toast("Logged. A slip isn't the end — let's reframe it.");
        // Turn the slip into a compassionate, adaptive recovery moment.
        void reframe.request({
          habitName: journey.habit.habitName,
          motivation: journey.habit.motivation,
          trigger: trimmedNote?.slice(0, 120),
        });
      }
    } catch {
      toast.error("Couldn't save your check-in. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

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
              <Button
                className="flex-1"
                disabled={submitting}
                onClick={() => log("win")}
              >
                {submitting ? (
                  <Loader2 className="animate-spin" aria-hidden />
                ) : (
                  <Check aria-hidden />
                )}
                Stayed on track
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                disabled={submitting}
                onClick={() => log("slip")}
              >
                <ThumbsDown aria-hidden />
                Slipped up
              </Button>
            </div>
          </div>
        )}

        {(reframe.status === "loading" || reframe.status === "success") && (
          <ReframePanel reframe={reframe} />
        )}
      </CardContent>
    </Card>
  );
}

function ReframePanel({ reframe }: { reframe: ReturnType<typeof useReframe> }) {
  if (reframe.status === "loading") {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 p-3 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin text-primary" aria-hidden />
        Finding a kinder way to look at this…
      </div>
    );
  }

  const r = reframe.response;
  if (!r) return null;

  return (
    <div className="space-y-3 rounded-lg border border-primary/30 bg-primary/5 p-3">
      <div className="flex items-start justify-between gap-2">
        <p className="flex items-center gap-1.5 text-sm font-medium text-primary">
          <Heart className="size-4" aria-hidden />
          A gentler take
        </p>
        <button
          type="button"
          aria-label="Dismiss"
          onClick={reframe.reset}
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="size-4" aria-hidden />
        </button>
      </div>
      <p className="text-sm text-foreground/90">{r.message}</p>
      <div className="flex items-start gap-2 rounded-md bg-background/70 p-2.5">
        <ArrowRight className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
        <p className="text-sm">
          <span className="font-medium">Try this now: </span>
          {r.nextStep}
        </p>
      </div>
      <p className="flex items-start gap-1.5 text-sm text-muted-foreground italic">
        <Sparkles className="mt-0.5 size-3.5 shrink-0 text-primary" aria-hidden />
        {r.affirmation}
      </p>
    </div>
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
    <div className="rounded-lg border p-3 transition-colors hover:border-primary/40">
      <div className="flex items-center gap-1.5 text-muted-foreground">
        <Icon className="size-4" aria-hidden />
        <span className="text-xs">{label}</span>
      </div>
      <p className="mt-1 text-2xl font-semibold tabular-nums">{value}</p>
    </div>
  );
}
