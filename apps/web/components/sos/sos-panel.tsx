"use client";

import { useEffect, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Clock,
  Heart,
  LifeBuoy,
  Loader2,
  RotateCcw,
  Sparkles,
  X,
} from "lucide-react";

import type { HabitInput, SosResponse } from "@/types";
import { categoryLabel } from "@/constants/habits";
import { useSos } from "@/hooks/use-sos";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SosPanelProps {
  habit: HabitInput;
}

const INTENSITY = [1, 2, 3, 4, 5];

/**
 * Craving SOS — the in-the-moment support mechanism. A prominent trigger opens
 * an accessible overlay where the user rates the urge; the AI returns immediate,
 * structured coping steps. Handles the full lifecycle (loading/success/error/retry).
 */
export function SosPanel({ habit }: SosPanelProps) {
  const [open, setOpen] = useState(false);
  const [intensity, setIntensity] = useState(3);
  const [trigger, setTrigger] = useState("");
  const { status, response, error, request, retry, reset } = useSos();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function close() {
    setOpen(false);
    reset();
    setTrigger("");
    setIntensity(3);
  }

  function submit() {
    void request({
      habitName: habit.habitName,
      category: habit.category,
      motivation: habit.motivation,
      trigger: trigger.trim() || undefined,
      intensity,
    });
  }

  return (
    <>
      <Button
        size="lg"
        variant="destructive"
        className="w-full"
        onClick={() => setOpen(true)}
      >
        <LifeBuoy aria-hidden />
        I&apos;m having a craving
      </Button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4"
          onClick={close}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="sos-title"
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-card p-6 shadow-xl sm:rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between">
              <div className="flex items-center gap-2">
                <LifeBuoy className="size-5 text-primary" aria-hidden />
                <h2 id="sos-title" className="text-lg font-semibold">
                  Ride it out
                </h2>
              </div>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={close}
                aria-label="Close"
              >
                <X aria-hidden />
              </Button>
            </div>

            {status === "idle" && (
              <div className="space-y-5">
                <p className="text-sm text-muted-foreground">
                  Urges peak and pass. Tell us how strong it is and we&apos;ll
                  help you get through the next few minutes.
                </p>
                <div>
                  <p className="mb-2 text-sm font-medium">
                    How strong is the urge?
                  </p>
                  <div className="flex gap-2">
                    {INTENSITY.map((n) => (
                      <button
                        key={n}
                        type="button"
                        aria-pressed={intensity === n}
                        onClick={() => setIntensity(n)}
                        className={cn(
                          "flex-1 rounded-lg border py-2 text-sm font-medium transition-colors",
                          intensity === n
                            ? "border-primary bg-primary text-primary-foreground"
                            : "hover:bg-muted",
                        )}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                  <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                    <span>Mild</span>
                    <span>Overwhelming</span>
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="sos-trigger"
                    className="mb-2 block text-sm font-medium"
                  >
                    What set it off? (optional)
                  </label>
                  <input
                    id="sos-trigger"
                    value={trigger}
                    onChange={(e) => setTrigger(e.target.value)}
                    placeholder="Bored, saw a notification…"
                    className="w-full rounded-lg border bg-transparent p-2.5 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                  />
                </div>
                <Button className="w-full" size="lg" onClick={submit}>
                  <Sparkles aria-hidden />
                  Help me through it
                </Button>
              </div>
            )}

            {status === "loading" && (
              <div className="flex min-h-48 flex-col items-center justify-center gap-3 text-center">
                <Loader2 className="size-6 animate-spin text-primary" aria-hidden />
                <p className="text-sm text-muted-foreground">
                  Breathe in… breathe out… we&apos;re with you.
                </p>
              </div>
            )}

            {status === "error" && (
              <div className="flex min-h-48 flex-col items-center justify-center gap-3 text-center">
                <AlertTriangle className="size-6 text-destructive" aria-hidden />
                <p className="text-sm text-muted-foreground">
                  {error ?? "Something went wrong."}
                </p>
                <Button variant="outline" onClick={retry}>
                  <RotateCcw aria-hidden />
                  Try again
                </Button>
              </div>
            )}

            {status === "success" && response && (
              <SosResult response={response} onDone={close} />
            )}

            <p className="mt-4 text-center text-xs text-muted-foreground">
              For {categoryLabel(habit.category).toLowerCase()} • This isn&apos;t
              medical advice. In crisis, reach out to a professional.
            </p>
          </div>
        </div>
      )}
    </>
  );
}

function SosResult({
  response,
  onDone,
}: {
  response: SosResponse;
  onDone: () => void;
}) {
  return (
    <div className="space-y-4">
      <p className="rounded-lg bg-accent/50 p-3 text-sm">{response.opener}</p>

      <ol className="space-y-2">
        {response.steps.map((s, i) => (
          <li key={i} className="flex gap-3 rounded-lg border p-3">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
              {i + 1}
            </span>
            <div>
              <p className="text-sm font-medium">{s.title}</p>
              <p className="text-sm text-muted-foreground">{s.description}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="flex items-start gap-3 rounded-lg border p-3">
        <ArrowRight className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
        <div>
          <p className="text-sm font-medium">Redirect to</p>
          <p className="text-sm text-muted-foreground">{response.distraction}</p>
        </div>
      </div>

      <div className="flex items-start gap-3 rounded-lg bg-primary/5 p-3">
        <Heart className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
        <p className="text-sm text-foreground/80">{response.reframe}</p>
      </div>

      <div className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
        <Clock className="size-4" aria-hidden />
        <span>This urge should pass in ~{response.ridesOutInMinutes} min.</span>
      </div>

      <Button className="w-full" onClick={onDone}>
        I&apos;m okay for now
      </Button>
    </div>
  );
}
