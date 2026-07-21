"use client";

import { useCallback, useState } from "react";
import type { Suggestion, SuggestResult } from "@/types/suggest";

export type GenerationStatus = "idle" | "loading" | "success" | "error";

/** Owns the autofill request lifecycle (loading / success / error). */
export function useSuggest() {
  const [status, setStatus] = useState<GenerationStatus>("idle");
  const [suggestion, setSuggestion] = useState<Suggestion | null>(null);
  const [error, setError] = useState<string | null>(null);

  const suggest = useCallback(async (habitName: string) => {
    setStatus("loading");
    setError(null);

    try {
      const res = await fetch("/api/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ habitName }),
      });
      const result = (await res.json()) as SuggestResult;

      if (result.ok) {
        setSuggestion(result.data);
        setStatus("success");
      } else {
        setError(result.error.message);
        setStatus("error");
      }
    } catch {
      setError("Network error. Try again.");
      setStatus("error");
    }
  }, []);

  const reset = useCallback(() => {
    setStatus("idle");
    setSuggestion(null);
    setError(null);
  }, []);

  return { status, suggestion, error, suggest, reset } as const;
}
