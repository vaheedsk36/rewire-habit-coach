import type { LucideIcon } from "lucide-react";
import {
  Flag,
  Footprints,
  Heart,
  LifeBuoy,
  Repeat,
  Sparkles,
  Zap,
} from "lucide-react";
import type { RecoveryPlan } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface PlanViewProps {
  plan: RecoveryPlan;
}

/** Gradient icon chip used in every section header for a consistent, polished look. */
function SectionIcon({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/15">
      <Icon className="size-4" aria-hidden />
    </span>
  );
}

/** Renders the AI-generated recovery plan as a set of focused cards. */
export function PlanView({ plan }: PlanViewProps) {
  return (
    <div className="space-y-4">
      <Card className="border-primary/30 bg-gradient-to-br from-primary/12 via-primary/5 to-transparent">
        <CardHeader>
          <div className="flex items-center gap-2.5">
            <SectionIcon icon={Sparkles} />
            <CardTitle>Your plan</CardTitle>
          </div>
          <CardDescription className="text-foreground/80">
            {plan.summary}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-3 rounded-xl bg-background/70 p-3 ring-1 ring-border/60">
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
          <div className="flex items-center gap-2.5">
            <SectionIcon icon={Flag} />
            <CardTitle>Milestones</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <ol className="space-y-5">
            {plan.milestones.map((m, i) => (
              <li key={i} className="relative flex gap-4">
                {i < plan.milestones.length - 1 && (
                  <span
                    aria-hidden
                    className="absolute left-5 top-11 -bottom-5 w-px bg-border"
                  />
                )}
                <div className="z-10 flex size-10 shrink-0 flex-col items-center justify-center rounded-full bg-gradient-to-br from-primary to-emerald-500 text-center leading-none text-primary-foreground shadow-sm">
                  <span className="text-[0.55rem] font-medium uppercase opacity-80">
                    Day
                  </span>
                  <span className="text-sm font-bold">{m.day}</span>
                </div>
                <div className="pt-0.5">
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
            <div className="flex items-center gap-2.5">
              <SectionIcon icon={LifeBuoy} />
              <CardTitle>Coping strategies</CardTitle>
            </div>
            <CardDescription>Matched to your specific triggers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {plan.copingStrategies.map((s, i) => (
              <div
                key={i}
                className="rounded-xl border p-3.5 transition-colors hover:border-primary/40"
              >
                <p className="font-medium">{s.title}</p>
                <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                  <Zap className="size-3" aria-hidden />
                  {s.when}
                </span>
                <p className="mt-2 text-sm text-muted-foreground">
                  {s.description}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2.5">
              <SectionIcon icon={Repeat} />
              <CardTitle>Replace the habit</CardTitle>
            </div>
            <CardDescription>Fill the gap it leaves behind</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {plan.replacementBehaviors.map((r, i) => (
              <div
                key={i}
                className="rounded-xl border p-3.5 transition-colors hover:border-primary/40"
              >
                <p className="font-medium">{r.behavior}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {r.description}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="border-primary/20 bg-gradient-to-br from-accent/50 to-transparent">
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
