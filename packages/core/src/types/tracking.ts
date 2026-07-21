import { z } from "zod";
import type { HabitInput } from "./habit";
import type { RecoveryPlan } from "./plan";

/** A single daily check-in. Validated on the API boundary before it hits the DB. */
export const checkInSchema = z.object({
  /** ISO date, day-granularity: YYYY-MM-DD. */
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  status: z.enum(["win", "slip"]),
  mood: z.number().int().min(1).max(5).optional(),
  note: z.string().trim().max(280).optional(),
});

export type CheckIn = z.infer<typeof checkInSchema>;

/**
 * A user's full journey as loaded from the database (RLS-scoped to them).
 * Assembled server-side from the `rewire_habits` row (habit + plan) and its
 * `rewire_check_ins`. Trusted after RLS, so it's a plain type, not a schema.
 */
export interface JourneyRecord {
  habitId: string;
  habit: HabitInput;
  plan: RecoveryPlan;
  startedAt: string;
  checkIns: CheckIn[];
}

/** Lightweight habit row for the habit switcher (no plan/check-ins). */
export interface HabitSummary {
  id: string;
  habitName: string;
  category: string;
  goalType: "quit" | "reduce";
  startedAt: string;
}
