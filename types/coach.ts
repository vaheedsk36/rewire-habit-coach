import { z } from "zod";

/** One turn in the coach conversation. */
export const coachMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().trim().min(1).max(2000),
});

export type CoachMessage = z.infer<typeof coachMessageSchema>;

/**
 * A request to the adaptive coach. The server ignores any habit/progress data
 * from the client and loads it fresh from the DB (RLS-scoped) — the client only
 * supplies the conversation so far.
 */
export const coachRequestSchema = z.object({
  message: z.string().trim().min(1).max(2000),
  history: z.array(coachMessageSchema).max(20).default([]),
});

export type CoachRequest = z.infer<typeof coachRequestSchema>;
