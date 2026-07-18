import { z } from "zod";
import type { HabitInput } from "./habit";
import type { RecoveryPlan } from "./plan";

/**
 * Client-side tracking types. These persist locally (browser storage) so the
 * app behaves like a real habit tracker without a backend in this iteration.
 * Kept schema-validated so persisted data is always trusted on read.
 */
export const checkInSchema = z.object({
  /** ISO date, day-granularity: YYYY-MM-DD. */
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  status: z.enum(["win", "slip"]),
  mood: z.number().int().min(1).max(5).optional(),
  note: z.string().trim().max(280).optional(),
});

export type CheckIn = z.infer<typeof checkInSchema>;

export const journeySchema = z.object({
  habit: z.custom<HabitInput>(),
  plan: z.custom<RecoveryPlan>(),
  startedAt: z.string(),
  checkIns: z.array(checkInSchema),
});

/** The full locally-persisted state of a user's journey. */
export type Journey = z.infer<typeof journeySchema>;
