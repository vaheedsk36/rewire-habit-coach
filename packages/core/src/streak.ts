import type { CheckIn } from "./types";

/** Today's date as a YYYY-MM-DD string (local time). */
export function todayISO(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function shiftISO(iso: string, days: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(y, m - 1, d + days);
  const yy = dt.getFullYear();
  const mm = String(dt.getMonth() + 1).padStart(2, "0");
  const dd = String(dt.getDate()).padStart(2, "0");
  return `${yy}-${mm}-${dd}`;
}

/**
 * Current streak = consecutive days ending today (or yesterday, if today isn't
 * logged yet) that are "win" check-ins. A slip breaks the streak. Pure and
 * testable — no dates read from outside the argument except `todayISO`.
 */
export function currentStreak(checkIns: CheckIn[], today = todayISO()): number {
  const byDate = new Map(checkIns.map((c) => [c.date, c.status]));

  // Start from today if logged, otherwise yesterday, so an un-logged today
  // doesn't zero out a streak the user is still keeping.
  let cursor = byDate.has(today) ? today : shiftISO(today, -1);
  let streak = 0;

  while (byDate.get(cursor) === "win") {
    streak += 1;
    cursor = shiftISO(cursor, -1);
  }
  return streak;
}

/** Total logged wins, all-time. */
export function totalWins(checkIns: CheckIn[]): number {
  return checkIns.filter((c) => c.status === "win").length;
}

/** Whole days elapsed since the journey started, inclusive of today. */
export function daysSince(startISO: string, today = todayISO()): number {
  const [sy, sm, sd] = startISO.slice(0, 10).split("-").map(Number);
  const [ty, tm, td] = today.split("-").map(Number);
  const start = Date.UTC(sy, sm - 1, sd);
  const end = Date.UTC(ty, tm - 1, td);
  return Math.max(0, Math.round((end - start) / 86_400_000)) + 1;
}
