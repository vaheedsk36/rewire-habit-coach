"use client";

import { useCallback, useEffect, useState } from "react";
import { journeySchema, type CheckIn, type Journey } from "@/types";

const STORAGE_KEY = "rewire.journey.v1";

/** Safely read + validate the persisted journey. Corrupt data is discarded. */
function loadJourney(): Journey | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = journeySchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

/**
 * Owns the user's local-first journey: their habit, AI plan, and check-in log.
 * Persists to localStorage so the app behaves like a real tracker across visits
 * without a backend in this iteration. `hydrated` guards against SSR mismatch —
 * consumers render a stable shell until the client has read storage.
 */
export function useJourney() {
  const [journey, setJourney] = useState<Journey | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setJourney(loadJourney());
    setHydrated(true);
  }, []);

  const persist = useCallback((next: Journey | null) => {
    setJourney(next);
    if (typeof window === "undefined") return;
    if (next) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const start = useCallback(
    (data: Omit<Journey, "checkIns" | "startedAt">) => {
      persist({ ...data, startedAt: new Date().toISOString(), checkIns: [] });
    },
    [persist],
  );

  /** Upsert today's (or any date's) check-in — one entry per day. */
  const addCheckIn = useCallback(
    (checkIn: CheckIn) => {
      setJourney((prev) => {
        if (!prev) return prev;
        const checkIns = [
          ...prev.checkIns.filter((c) => c.date !== checkIn.date),
          checkIn,
        ].sort((a, b) => a.date.localeCompare(b.date));
        const next = { ...prev, checkIns };
        if (typeof window !== "undefined") {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        }
        return next;
      });
    },
    [],
  );

  const reset = useCallback(() => persist(null), [persist]);

  return { journey, hydrated, start, addCheckIn, reset } as const;
}
