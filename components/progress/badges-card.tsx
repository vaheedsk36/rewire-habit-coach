import {
  Award,
  CalendarCheck,
  CheckCircle2,
  Crown,
  Flame,
  Medal,
  Sparkles,
  Star,
  Target,
  Trophy,
  Zap,
  type LucideIcon,
} from "lucide-react";

import type { JourneyRecord } from "@/types";
import { computeAchievements } from "@/lib/achievements";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

/** Explicit allow-list mapping icon-name strings to lucide components. */
const ICONS: Record<string, LucideIcon> = {
  Sparkles,
  Flame,
  Trophy,
  Medal,
  Award,
  Star,
  Target,
  Crown,
  Zap,
  CheckCircle2,
  CalendarCheck,
};

/**
 * Earned/locked achievement badges for a journey. Pure/derived — reads only
 * from `journey` via computeAchievements.
 */
export function BadgesCard({ journey }: { journey: JourneyRecord }) {
  const achievements = computeAchievements(journey);
  const total = achievements.length;
  const earnedCount = achievements.filter((a) => a.earned).length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Award className="size-5 text-primary" aria-hidden />
          <CardTitle>Achievements</CardTitle>
        </div>
        <CardDescription>
          {earnedCount} of {total} earned
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {achievements.map((achievement) => {
            const Icon = ICONS[achievement.icon] ?? Award;
            return (
              <div
                key={achievement.id}
                title={achievement.description}
                aria-label={`${achievement.label}: ${achievement.description}${
                  achievement.earned ? " (earned)" : " (locked)"
                }`}
                className={`flex flex-col items-center gap-1.5 rounded-lg p-3 text-center ${
                  achievement.earned
                    ? "bg-primary/10 text-primary ring-1 ring-primary/20"
                    : "bg-muted text-muted-foreground opacity-60"
                }`}
              >
                <Icon className="size-6" aria-hidden />
                <span className="text-xs font-medium">{achievement.label}</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
