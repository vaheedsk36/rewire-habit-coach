import {
  Flag,
  Footprints,
  Heart,
  LifeBuoy,
  Repeat,
  Sparkles,
} from "lucide-react";
import type { RecoveryPlan } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PlanViewProps {
  plan: RecoveryPlan;
}

/** Renders the AI-generated recovery plan as a set of focused cards. */
export function PlanView({ plan }: PlanViewProps) {
  return (
    <div className="space-y-4">
      <Card className="border-primary/30 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
        <CardHeader>
          <div className="flex items-center gap-2 text-primary">
            <Sparkles className="size-5" aria-hidden />
            <CardTitle>Your plan</CardTitle>
          </div>
          <CardDescription className="text-foreground/80">
            {plan.summary}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-3 rounded-lg bg-background/70 p-3">
            <Footprints className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
            <div>
              <p className="text-sm font-medium">Start here today</p>
              <p className="text-sm text-muted-foreground">{plan.firstStep}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Flag className="size-5 text-primary" aria-hidden />
            <CardTitle>Milestones</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <ol className="space-y-4">
            {plan.milestones.map((m, i) => (
              <li key={i} className="flex gap-3">
                <div className="flex size-10 shrink-0 flex-col items-center justify-center rounded-lg bg-muted text-center leading-none">
                  <span className="text-[0.6rem] uppercase text-muted-foreground">
                    Day
                  </span>
                  <span className="text-sm font-semibold">{m.day}</span>
                </div>
                <div>
                  <p className="font-medium">{m.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {m.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <LifeBuoy className="size-5 text-primary" aria-hidden />
              <CardTitle>Coping strategies</CardTitle>
            </div>
            <CardDescription>For your specific triggers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {plan.copingStrategies.map((s, i) => (
              <div
                key={i}
                className="rounded-lg border p-3 transition-colors hover:border-primary/40"
              >
                <div className="mb-1 flex items-center justify-between gap-2">
                  <p className="font-medium">{s.title}</p>
                  <Badge variant="secondary">{s.when}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{s.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Repeat className="size-5 text-primary" aria-hidden />
              <CardTitle>Replace the habit</CardTitle>
            </div>
            <CardDescription>Fill the gap it leaves behind</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {plan.replacementBehaviors.map((r, i) => (
              <div
                key={i}
                className="rounded-lg border p-3 transition-colors hover:border-primary/40"
              >
                <p className="font-medium">{r.behavior}</p>
                <p className="text-sm text-muted-foreground">{r.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="border-primary/20 bg-accent/40">
        <CardContent className="flex items-start gap-3 pt-6">
          <Heart className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
          <div>
            <p className="text-sm font-medium">A reminder for you</p>
            <p className="text-sm text-muted-foreground">{plan.affirmation}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
