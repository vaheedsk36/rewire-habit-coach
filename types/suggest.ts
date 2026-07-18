import { z } from "zod";
import {
  HABIT_CATEGORIES,
  TIMEFRAME_OPTIONS,
  TRIGGER_OPTIONS,
} from "@/constants/habits";
import type { Result } from "@/types";

// Derive the allowed enum values from the constants — same pattern as
// types/habit.ts — so the AI's output can only ever use values the form accepts.
const categoryValues = HABIT_CATEGORIES.map((c) => c.value) as [
  string,
  ...string[],
];
const triggerValues = TRIGGER_OPTIONS.map((t) => t.value) as [
  string,
  ...string[],
];
// Kept as a plain number[] so `.includes()` accepts an arbitrary int at runtime;
// the literal tuple type would otherwise reject the model's raw number.
const timeframeValues: readonly number[] = TIMEFRAME_OPTIONS.map(
  (t) => t.value,
);

/**
 * The autofill request: only the free-text habit name the user typed. Same
 * trim/min/max bounds as `habitInputSchema.habitName` so the two agree.
 */
export const suggestRequestSchema = z.object({
  habitName: z
    .string()
    .trim()
    .min(2, "Give your habit a short name.")
    .max(80, "Keep the name under 80 characters."),
});

/**
 * The AI's suggested prefill. Every field maps 1:1 onto an onboarding form
 * field, and the `.describe()`s are the model's only instruction for each — they
 * live here (not the prompt) so the schema is the single source of intent.
 */
export const suggestionSchema = z.object({
  category: z
    .enum(categoryValues)
    .describe("The single best-fitting habit category for the named habit."),
  goalType: z
    .enum(["quit", "reduce"])
    .describe(
      "Whether quitting outright or cutting down is the more sensible goal for this habit.",
    ),
  currentAmount: z
    .string()
    .describe(
      "A realistic example of how much someone might currently do this habit (e.g. '4 hours/day', '10 cigarettes/day'). The user will edit it.",
    ),
  targetAmount: z
    .string()
    .describe(
      "A sensible target amount. Empty string when the goal is to quit completely.",
    ),
  motivation: z
    .string()
    .describe(
      "An empathetic, first-person example reason for wanting to change, phrased so the user can keep or edit it. One sentence.",
    ),
  triggers: z
    .array(z.enum(triggerValues))
    .min(2)
    .max(4)
    .describe(
      "The 2-4 triggers MOST LIKELY to drive this specific habit, chosen only from the allowed trigger values.",
    ),
  timeframeDays: z
    .number()
    .int()
    .refine((n) => timeframeValues.includes(n), {
      message: "Pick a supported timeframe.",
    })
    .describe(
      "A sensible timeframe in days for this goal. MUST be exactly one of: 7, 14, 21, 30, 60, 90.",
    ),
});

export type SuggestRequest = z.infer<typeof suggestRequestSchema>;
export type Suggestion = z.infer<typeof suggestionSchema>;
export type SuggestResult = Result<Suggestion>;
