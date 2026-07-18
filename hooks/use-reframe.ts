"use client";

import { useCallback, useState } from "react";
import type {
  ReframeRequest,
  ReframeResponse,
  ReframeResult,
} from "@/types/reframe";

export type GenerationStatus = "idle" | "loading" | "success" | "error";

/**
 * Owns the Relapse Reframe request lifecycle (loading / success / error / reset).
 * Mirrors useSos so the tracker card can drive a slip the same way it drives an
 * SOS. `reset` lets the card dismiss the reframe once the user has read it.
 */
export function useReframe() {
  const [status, setStatus] = useState<GenerationStatus>("idle");
  const [response, setResponse] = useState<ReframeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const request = useCallback(async (input: ReframeRequest) => {
    setStatus("loading");
    setError(null);

    try {
      const res = await fetch("/api/reframe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const result = (await res.json()) as ReframeResult;

      if (result.ok) {
        setResponse(result.data);
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
    setResponse(null);
    setError(null);
  }, []);

  return { status, response, error, request, reset } as const;
}
