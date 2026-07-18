import { z } from "zod";
import type { Result } from "@/types";

/**
 * Relapse Reframe — the request sent when a user logs a SLIP. We keep only the
 * minimum the model needs to respond compassionately: what they slipped on,
 * their own reason for change (to reconnect them to it), and an optional trigger.
 * Validated on both client and server; the client is never trusted.
 */
export const reframeRequestSchema = z.object({
  habitName: z
    .string()
    .trim()
    .min(1)
    .max(80)
    .describe("The habit the user is working to change and just slipped on."),
  motivation: z
    .string()
    .trim()
    .min(1)
    .max(280)
    .describe("The user's own reason for change, to reconnect them to their 'why'."),
  trigger: z
    .string()
    .trim()
    .max(120)
    .optional()
    .describe("What led to the slip, if known — used to make the next step relevant."),
});

export type ReframeRequest = z.infer<typeof reframeRequestSchema>;

/**
 * The AI's structured reframe of a slip. Deliberately small so a slip becomes a
 * recovery moment: validate the feeling, hand them one doable action, and remind
 * them why they started. The `.describe()` calls carry the field-level shape and
 * tone rules so the prompt stays focused on the situation, not the format.
 */
export const reframeResponseSchema = z.object({
  message: z
    .string()
    .describe(
      "A compassionate, validating reframe in 1-2 sentences. Treat the slip as a normal, human, recoverable part of change. Never shame or scold.",
    ),
  nextStep: z
    .string()
    .describe(
      "One concrete, doable get-back-on-track action the user can take right now — small enough that it feels easy, not a lecture.",
    ),
  affirmation: z
    .string()
    .describe(
      "A short, sincere line that reconnects the user to their stated motivation and future self.",
    ),
});

export type ReframeResponse = z.infer<typeof reframeResponseSchema>;

/** Discriminated result returned by the reframe service and API route. */
export type ReframeResult = Result<ReframeResponse>;
