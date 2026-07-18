import { CalendarDays, Flame, Percent, Trophy } from "lucide-react";

import type { CheckIn, JourneyRecord } from "@/types";
import { currentStreak, daysSince, todayISO, totalWins } from "@/lib/streak";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

/** Most-recent-days window to render if the timeframe is longer (5 weeks). */
const MAX_CELLS = 35;

/** Day-granular date math for building the calendar window. Mirrors the UTC
 *  approach in lib/streak so day boundaries line up with daysSince. */
function addDaysISO(iso: string, days: number): string {
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + days));
  const yy = dt.getUTCFullYear();
  const mm = String(dt.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(dt.getUTCDate()).padStart(2, "0");
  return `${yy}-${mm}-${dd}`;
}

function weekdayUTC(iso: string): number {
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

type Status = CheckIn["status"];

function cellClass(status: Status | null): string {
  if (status === "win") return "bg-primary";
  if (status === "slip") return "bg-destructive/70";
  return "bg-muted";
}

function statusLabel(status: Status | null): string {
  if (status === "win") return "win";
  if (status === "slip") return "slip";
  return "no check-in";
}

/**
 * At-a-glance progress for a journey: a check-in heatmap, headline stats, and a
 * timeframe progress bar. Pure/derived — reads only from `journey`.
 */
export function ProgressPanel({ journey }: { journey: JourneyRecord }) {
  const { checkIns, startedAt } = journey;
  const timeframe = journey.habit.timeframeDays;

  const statusByDate = new Map<string, Status>(
    checkIns.map((c) => [c.date, c.status]),
  );

  // Show the most recent min(timeframe, 35) days of the journey window.
  const shown = Math.min(timeframe, MAX_CELLS);
  const startOffset = timeframe - shown;
  const firstDate = addDaysISO(startedAt.slice(0, 10), startOffset);
  const today = todayISO();

  const cells = Array.from({ length: shown }, (_, i) => {
    const date = addDaysISO(firstDate, i);
    return {
      date,
      status: statusByDate.get(date) ?? null,
      future: date > today,
    };
  });

  // Pad the leading edge so columns align to weekdays (Sun-first).
  const leadPad = weekdayUTC(firstDate);

  const streak = currentStreak(checkIns);
  const wins = totalWins(checkIns);
  const total = checkIns.length;
  const winRate = total === 0 ? "—" : `${Math.round((wins / total) * 100)}%`;

  const day = daysSince(startedAt);
  const pct = Math.min(100, Math.max(0, (day / timeframe) * 100));

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CalendarDays className="size-5 text-primary" aria-hidden />
          <CardTitle>Your progress</CardTitle>
        </div>
        <CardDescription>
          Last {shown} {shown === 1 ? "day" : "days"} of check-ins
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Stat row */}
        <div className="grid grid-cols-3 gap-3">
          <Stat icon={Flame} label="Streak" value={`${streak}d`} />
          <Stat icon={Trophy} label="Wins" value={String(wins)} />
          <Stat icon={Percent} label="Win rate" value={winRate} />
        </div>

        {/* Heatmap */}
        <div className="space-y-2">
          <div
            className="grid grid-cols-7 gap-1"
            role="img"
            aria-label={`Check-in calendar for the last ${shown} days`}
          >
            {Array.from({ length: leadPad }, (_, i) => (
              <div key={`pad-${i}`} aria-hidden className="aspect-square" />
            ))}
            {cells.map((cell) => {
              const label = `${cell.date}: ${statusLabel(cell.status)}`;
              return (
                <div
                  key={cell.date}
                  title={label}
                  aria-label={label}
                  className={`aspect-square rounded-sm ring-1 ring-foreground/5 ${cellClass(
                    cell.status,
                  )} ${cell.future ? "opacity-40" : ""}`}
                />
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <LegendItem className="bg-primary" label="Win" />
            <LegendItem className="bg-destructive/70" label="Slip" />
            <LegendItem className="bg-muted" label="No entry" />
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium">
              Day {day} of {timeframe}
            </span>
            <span className="tabular-nums text-muted-foreground">
              {Math.round(pct)}%
            </span>
          </div>
          <div
            className="h-2 w-full overflow-hidden rounded-full bg-muted"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={timeframe}
            aria-valuenow={Math.min(day, timeframe)}
            aria-label="Journey progress"
          >
            <div
              className="h-full rounded-full bg-primary motion-safe:transition-[width] motion-safe:duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
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
      <p className="mt-1 text-xl font-semibold tabular-nums">{value}</p>
    </div>
  );
}

function LegendItem({ className, label }: { className: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span
        aria-hidden
        className={`size-3 rounded-sm ring-1 ring-foreground/5 ${className}`}
      />
      {label}
    </span>
  );
}
