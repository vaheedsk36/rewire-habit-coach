import { streamText } from "ai";
import type { CoachMessage, JourneyRecord } from "@/types";
import { AI_TIMEOUT_MS, getModel } from "./client";
import { buildCoachContext, COACH_SYSTEM_PROMPT } from "./prompt";

/**
 * Streams an adaptive coaching reply. The coach is grounded in the user's real
 * tracked progress (loaded from the DB, never trusted from the client) so its
 * guidance changes as they do — this is the "adaptive coaching" core of Rewire.
 */
export function streamCoachReply(
  journey: JourneyRecord,
  message: string,
  history: CoachMessage[],
) {
  return streamText({
    model: getModel(),
    system: `${COACH_SYSTEM_PROMPT}\n\n${buildCoachContext(journey)}`,
    messages: [...history, { role: "user", content: message }],
    temperature: 0.7,
    maxRetries: 1,
    abortSignal: AbortSignal.timeout(AI_TIMEOUT_MS),
  });
}
