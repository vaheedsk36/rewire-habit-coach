import { streamText } from "ai";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { CoachMessage, JourneyRecord } from "@/types";
import { AI_TIMEOUT_MS, getConfiguredModelId, getModel } from "./client";
import { buildCoachContext, COACH_SYSTEM_PROMPT } from "./prompt";
import { logUsage } from "./usage";

/**
 * Streams an adaptive coaching reply. The coach is grounded in the user's real
 * tracked progress (loaded from the DB, never trusted from the client) so its
 * guidance changes as they do — this is the "adaptive coaching" core of Rewire.
 * Uses the admin-configured model and logs token usage once the stream finishes.
 */
export async function streamCoachReply(
  supabase: SupabaseClient,
  journey: JourneyRecord,
  message: string,
  history: CoachMessage[],
) {
  const model = await getConfiguredModelId(supabase);
  const result = streamText({
    model: getModel(model),
    system: `${COACH_SYSTEM_PROMPT}\n\n${buildCoachContext(journey)}`,
    messages: [...history, { role: "user", content: message }],
    temperature: 0.7,
    maxRetries: 1,
    abortSignal: AbortSignal.timeout(AI_TIMEOUT_MS),
  });

  // Usage resolves after the stream completes; log it without blocking the response.
  void (async () => {
    try {
      const usage = await result.usage;
      await logUsage(supabase, "coach", model, usage);
    } catch {
      // never let telemetry affect the stream
    }
  })();

  return result;
}
