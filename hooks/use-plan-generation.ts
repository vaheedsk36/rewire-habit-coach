"use client";

import { useCallback, useState } from "react";
import type { HabitInput, PlanResult, RecoveryPlan } from "@/types";

export type GenerationStatus = "idle" | "loading" | "success" | "error";

/**
 * Owns the full request lifecycle for recovery-plan generation:
 * loading, success, failure, retry, and (server-driven) timeout messaging.
 */
export function usePlanGeneration() {
  const [status, setStatus] = useState<GenerationStatus>("idle");
  const [plan, setPlan] = useState<RecoveryPlan | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastInput, setLastInput] = useState<HabitInput | null>(null);

  const generate = useCallback(async (input: HabitInput) => {
    setStatus("loading");
    setError(null);
    setLastInput(input);

    try {
      const res = await fetch("/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const result = (await res.json()) as PlanResult;

      if (result.ok) {
        setPlan(result.data);
        setStatus("success");
      } else {
        setError(result.error.message);
        setStatus("error");
      }
    } catch {
      setError("Network error. Check your connection and try again.");
      setStatus("error");
    }
  }, []);

  const retry = useCallback(() => {
    if (lastInput) void generate(lastInput);
  }, [lastInput, generate]);

  const reset = useCallback(() => {
    setStatus("idle");
    setPlan(null);
    setError(null);
  }, []);

  return { status, plan, error, generate, retry, reset } as const;
}
