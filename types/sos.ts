import { z } from "zod";
import { HABIT_CATEGORIES } from "@/constants/habits";

const categoryValues = HABIT_CATEGORIES.map((c) => c.value) as [
  string,
  ...string[],
];

/**
 * Craving SOS — the in-the-moment support request. Sent when a user taps the
 * SOS button during an urge. Validated on both client and server.
 */
export const sosInputSchema = z.object({
  habitName: z.string().trim().min(1).max(80),
  category: z.enum(categoryValues),
  motivation: z.string().trim().min(1).max(280),
  trigger: z
    .string()
    .trim()
    .max(120)
    .optional()
    .or(z.literal("")),
  intensity: z
    .number()
    .int()
    .min(1)
    .max(5)
    .describe("How strong the urge is right now, 1 (mild) to 5 (overwhelming)."),
});

export type SosInput = z.infer<typeof sosInputSchema>;

/** The AI's structured coping response for a craving. */
export const sosResponseSchema = z.object({
  opener: z
    .string()
    .describe(
      "A calm, empathetic one-liner that meets the user where they are. No judgement.",
    ),
  steps: z
    .array(
      z.object({
        title: z.string().describe("Short imperative step label."),
        description: z
          .string()
          .describe("A single, immediately-doable action, present tense."),
      }),
    )
    .min(3)
    .max(4)
    .describe("Immediate grounding/coping steps to ride out the urge right now."),
  distraction: z
    .string()
    .describe("One quick alternative activity to redirect to for a few minutes."),
  reframe: z
    .string()
    .describe(
      "A reframe that reconnects the user to their motivation and future self.",
    ),
  ridesOutInMinutes: z
    .number()
    .int()
    .min(1)
    .max(30)
    .describe("Realistic minutes for this urge to peak and pass if they wait."),
});

export type SosResponse = z.infer<typeof sosResponseSchema>;
