import { z } from "zod";

/**
 * The AI's structured output contract for a personalized recovery plan.
 * `generateObject` constrains the model to exactly this shape, so the UI always
 * receives valid, fully-typed data — there is never any text to parse.
 *
 * `.describe()` carries the field-level instructions to the model, keeping the
 * prompt free of shape rules (no duplication between prompt and schema).
 */
export const recoveryPlanSchema = z.object({
  summary: z
    .string()
    .describe(
      "A warm, 1-2 sentence overview of the plan, personalized to the user's habit and their reason for change. Encouraging, never preachy.",
    ),
  firstStep: z
    .string()
    .describe(
      "The single most important, concrete action to take today. One short, doable sentence.",
    ),
  milestones: z
    .array(
      z.object({
        day: z
          .number()
          .int()
          .describe("Day number within the timeframe this milestone lands on."),
        title: z.string().describe("Short milestone label."),
        description: z
          .string()
          .describe("What reaching this milestone looks and feels like."),
      }),
    )
    .min(3)
    .max(6)
    .describe(
      "Progression milestones across the timeframe, ordered by day ascending.",
    ),
  copingStrategies: z
    .array(
      z.object({
        title: z.string().describe("Name of the coping strategy."),
        when: z
          .string()
          .describe("The trigger or moment this strategy is for."),
        description: z
          .string()
          .describe("How to actually do it, in 1-2 practical sentences."),
      }),
    )
    .min(3)
    .max(5)
    .describe(
      "Concrete coping strategies mapped to the user's specific triggers.",
    ),
  replacementBehaviors: z
    .array(
      z.object({
        behavior: z.string().describe("The healthier replacement action."),
        description: z
          .string()
          .describe("Why it helps and how it substitutes for the old habit."),
      }),
    )
    .min(2)
    .max(4)
    .describe("Positive behaviors that replace the old habit's role."),
  dailyNudge: z
    .string()
    .describe(
      "One intelligent nudge to keep the user on track today, tuned to their habit and triggers.",
    ),
  affirmation: z
    .string()
    .describe(
      "A short, sincere affirmation grounded in the user's stated motivation.",
    ),
});

export type RecoveryPlan = z.infer<typeof recoveryPlanSchema>;
