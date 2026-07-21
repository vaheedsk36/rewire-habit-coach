"use client";

import { AlertTriangle, Loader2, RotateCcw, Sparkles, Star, Target } from "lucide-react";

import type { JourneyRecord } from "@/types";
import { useReflection } from "@/hooks/use-reflection";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

/**
 * On-demand weekly AI reflection: the LLM reviews the last two weeks of check-ins
 * and returns an honest summary, a highlight, and one focused goal.
 */
export function ReflectionCard({ journey }: { journey: JourneyRecord }) {
  const { status, reflection, error, generate, reset } = useReflection();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2.5">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/15">
            <Sparkles className="size-4" aria-hidden />
          </span>
          <CardTitle>Weekly reflection</CardTitle>
        </div>
        <CardDescription>
          An honest, encouraging look at how your week actually went.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {status === "success" && reflection ? (
          <div className="space-y-3">
            <p className="text-sm text-foreground/90">{reflection.summary}</p>
            <div className="flex items-start gap-2 rounded-lg bg-primary/5 p-3">
              <Star className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
              <p className="text-sm">
                <span className="font-medium">Highlight: </span>
                {reflection.highlight}
              </p>
            </div>
            <div className="flex items-start gap-2 rounded-lg border p-3">
              <Target className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
              <p className="text-sm">
                <span className="font-medium">This week&apos;s focus: </span>
                {reflection.focus}
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={reset}>
              <RotateCcw aria-hidden />
              Reflect again
            </Button>
          </div>
        ) : status === "error" ? (
          <div className="space-y-3">
            <p className="flex items-center gap-2 text-sm text-destructive" role="alert">
              <AlertTriangle className="size-4" aria-hidden />
              {error ?? "Couldn't generate a reflection."}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => generate(journey.habitId)}
            >
              <RotateCcw aria-hidden />
              Try again
            </Button>
          </div>
        ) : (
          <Button
            onClick={() => generate(journey.habitId)}
            disabled={status === "loading"}
          >
            {status === "loading" ? (
              <>
                <Loader2 className="animate-spin" aria-hidden />
                Reflecting…
              </>
            ) : (
              <>
                <Sparkles aria-hidden />
                Reflect on my week
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
