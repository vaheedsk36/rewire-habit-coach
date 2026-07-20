"use client";

import { useCallback, useState } from "react";
import type {
  ReflectionRequest,
  ReflectionResponse,
  ReflectionResult,
} from "@/types/reflection";

export type GenerationStatus = "idle" | "loading" | "success" | "error";

/**
 * Owns the Weekly Reflection request lifecycle (idle / loading / success / error).
 * Mirrors useReframe so the dashboard drives a reflection the same way it drives a
 * reframe. `generate` takes just the habit id — the server re-loads the real
 * progress — and `reset` lets the UI dismiss a reflection once it's been read.
 */
export function useReflection() {
  const [status, setStatus] = useState<GenerationStatus>("idle");
  const [reflection, setReflection] = useState<ReflectionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(async (habitId: string) => {
    setStatus("loading");
    setError(null);

    try {
      // The request body matches reflectionRequestSchema; the server re-validates
      // it, so an ill-formed id fails safely at the boundary rather than here.
      const body: ReflectionRequest = { habitId };
      const res = await fetch("/api/reflection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const result = (await res.json()) as ReflectionResult;

      if (result.ok) {
        setReflection(result.data);
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
    setReflection(null);
    setError(null);
  }, []);

  return { status, reflection, error, generate, reset } as const;
}
