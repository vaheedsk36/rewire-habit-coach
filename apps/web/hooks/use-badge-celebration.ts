"use client";

import { useEffect } from "react";
import { toast } from "sonner";

import type { JourneyRecord } from "@/types";
import { computeAchievements } from "@/lib/achievements";
import { celebrate } from "@/lib/confetti";

const storageKey = (habitId: string) => `rewire.badges.${habitId}`;

/**
 * Celebrates achievements that became earned since the user last viewed this
 * habit. The set of "seen" earned badge ids is persisted per-habit in
 * localStorage, so each badge only ever triggers confetti + a toast once — and
 * the first-ever load records silently (no spam for already-earned badges).
 */
export function useBadgeCelebration(journey: JourneyRecord) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const earned = computeAchievements(journey).filter((a) => a.earned);
    const earnedIds = earned.map((a) => a.id);
    const key = storageKey(journey.habitId);
    const raw = window.localStorage.getItem(key);

    // First time we see this habit: record silently, celebrate nothing.
    if (raw === null) {
      window.localStorage.setItem(key, JSON.stringify(earnedIds));
      return;
    }

    let seen: string[] = [];
    try {
      seen = JSON.parse(raw) as string[];
    } catch {
      seen = [];
    }

    const fresh = earned.filter((a) => !seen.includes(a.id));
    if (fresh.length > 0) {
      celebrate();
      fresh.forEach((a, i) =>
        setTimeout(
          () => toast.success(`🏆 Achievement unlocked: ${a.label}`),
          i * 500,
        ),
      );
      window.localStorage.setItem(key, JSON.stringify(earnedIds));
    }
  }, [journey]);
}
