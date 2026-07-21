import type { CheckIn, JourneyRecord } from "./types";
import { daysSince, totalWins } from "./streak";

/**
 * A single earnable badge. `icon` is a lucide icon *name* (string) — the UI maps
 * it to the actual component — so this module stays pure and React-free.
 */
export type Achievement = {
  id: string;
  label: string;
  description: string;
  icon: string;
  earned: boolean;
};

/**
 * Longest run of consecutive "win" days, all-time (order-independent).
 * A slip or a gap breaks the run. Uses day-granular UTC math to mirror
 * lib/streak's day boundaries.
 */
function longestWinStreak(checkIns: CheckIn[]): number {
  const winDays = checkIns
    .filter((c) => c.status === "win")
    .map((c) => {
      const [y, m, d] = c.date.slice(0, 10).split("-").map(Number);
      return Date.UTC(y, m - 1, d) / 86_400_000;
    })
    .sort((a, b) => a - b);

  let best = 0;
  let run = 0;
  let prev: number | null = null;
  for (const day of winDays) {
    if (prev !== null && day === prev) continue; // ignore duplicate dates
    run = prev !== null && day === prev + 1 ? run + 1 : 1;
    if (run > best) best = run;
    prev = day;
  }
  return best;
}

/**
 * Derive the full badge catalog for a journey, with `earned` computed from the
 * user's check-ins and plan. Pure — reads only from `journey`.
 */
export function computeAchievements(journey: JourneyRecord): Achievement[] {
  const { checkIns, plan, startedAt } = journey;

  const hasCheckIn = checkIns.length > 0;
  const hasWin = checkIns.some((c) => c.status === "win");
  const wins = totalWins(checkIns);
  const best = longestWinStreak(checkIns);
  const elapsed = daysSince(startedAt);

  const streakThresholds: { id: string; n: number; icon: string }[] = [
    { id: "streak-3", n: 3, icon: "Flame" },
    { id: "streak-7", n: 7, icon: "Zap" },
    { id: "streak-14", n: 14, icon: "Star" },
    { id: "streak-30", n: 30, icon: "Crown" },
  ];

  const achievements: Achievement[] = [
    {
      id: "first-checkin",
      label: "First check-in",
      description: "Logged your very first check-in.",
      icon: "CheckCircle2",
      earned: hasCheckIn,
    },
    {
      id: "first-win",
      label: "First win",
      description: "Recorded your first winning day.",
      icon: "Sparkles",
      earned: hasWin,
    },
    ...streakThresholds.map<Achievement>(({ id, n, icon }) => ({
      id,
      label: `${n}-day streak`,
      description: `Reached a best streak of ${n} days in a row.`,
      icon,
      earned: best >= n,
    })),
    {
      id: "wins-10",
      label: "10 wins",
      description: "Logged 10 winning days in total.",
      icon: "Medal",
      earned: wins >= 10,
    },
    {
      id: "wins-25",
      label: "25 wins",
      description: "Logged 25 winning days in total.",
      icon: "Trophy",
      earned: wins >= 25,
    },
    ...plan.milestones.map<Achievement>((milestone) => ({
      id: `milestone-${milestone.day}`,
      label: milestone.title,
      description: `Reached day ${milestone.day} of your journey.`,
      icon: "Target",
      earned: elapsed >= milestone.day,
    })),
  ];

  return achievements;
}
