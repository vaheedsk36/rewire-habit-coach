"use client";

import { useCallback, useState } from "react";
import type { SosInput, SosResponse, SosResult } from "@/types";
import type { GenerationStatus } from "./use-plan-generation";

/** Owns the Craving SOS request lifecycle (loading / success / error / retry). */
export function useSos() {
  const [status, setStatus] = useState<GenerationStatus>("idle");
  const [response, setResponse] = useState<SosResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastInput, setLastInput] = useState<SosInput | null>(null);

  const request = useCallback(async (input: SosInput) => {
    setStatus("loading");
    setError(null);
    setLastInput(input);

    try {
      const res = await fetch("/api/sos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const result = (await res.json()) as SosResult;

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

  const retry = useCallback(() => {
    if (lastInput) void request(lastInput);
  }, [lastInput, request]);

  const reset = useCallback(() => {
    setStatus("idle");
    setResponse(null);
    setError(null);
  }, []);

  return { status, response, error, request, retry, reset } as const;
}
