"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import type { HabitInput, HabitResult } from "@/types";

export type OnboardingStatus = "idle" | "loading" | "error";

/**
 * Owns the onboarding request lifecycle. On success it refreshes the route so
 * the server re-renders with the newly-saved journey (swapping onboarding for
 * the dashboard) — the button stays in its loading state until that happens.
 */
export function useOnboarding() {
  const router = useRouter();
  const [status, setStatus] = useState<OnboardingStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [lastInput, setLastInput] = useState<HabitInput | null>(null);

  const submit = useCallback(
    async (input: HabitInput) => {
      setStatus("loading");
      setError(null);
      setLastInput(input);

      try {
        const res = await fetch("/api/habit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input),
        });
        const result = (await res.json()) as HabitResult;

        if (result.ok) {
          router.refresh();
        } else {
          setError(result.error.message);
          setStatus("error");
        }
      } catch {
        setError("Network error. Check your connection and try again.");
        setStatus("error");
      }
    },
    [router],
  );

  const retry = useCallback(() => {
    if (lastInput) void submit(lastInput);
  }, [lastInput, submit]);

  return { status, error, submit, retry } as const;
}
