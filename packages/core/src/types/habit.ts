import { z } from "zod";
import { HABIT_CATEGORIES, TRIGGER_OPTIONS } from "../constants/habits";

const categoryValues = HABIT_CATEGORIES.map((c) => c.value) as [
  string,
  ...string[],
];
const triggerValues = TRIGGER_OPTIONS.map((t) => t.value) as [
  string,
  ...string[],
];

/**
 * The onboarding contract. This SAME schema validates the client form (via RHF)
 * and the API boundary — the client is never trusted. All AI prompts derive from
 * the parsed, typed value, so there is a single source of truth for what a habit is.
 */
export const habitInputSchema = z.object({
  habitName: z
    .string()
    .trim()
    .min(2, "Give your habit a short name.")
    .max(80, "Keep the name under 80 characters."),
  category: z.enum(categoryValues, {
    message: "Choose a category.",
  }),
  goalType: z.enum(["quit", "reduce"], {
    message: "Choose whether you want to quit or cut down.",
  }),
  currentAmount: z
    .string()
    .trim()
    .min(1, "Describe how much you do this now (e.g. 4 hours/day).")
    .max(60),
  targetAmount: z.string().trim().max(60).optional().or(z.literal("")),
  motivation: z
    .string()
    .trim()
    .min(5, "Your 'why' fuels the plan — add a sentence.")
    .max(280, "Keep your reason under 280 characters."),
  triggers: z
    .array(z.enum(triggerValues))
    .min(1, "Pick at least one trigger.")
    .max(triggerValues.length),
  timeframeDays: z
    .number({ message: "Choose a timeframe." })
    .int()
    .min(7)
    .max(90),
});

export type HabitInput = z.infer<typeof habitInputSchema>;
