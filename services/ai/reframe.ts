import { generateObject } from "ai";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  reframeResponseSchema,
  type ReframeRequest,
  type ReframeResult,
} from "@/types/reframe";
import { AI_TIMEOUT_MS, getConfiguredModelId, getModel } from "./client";
import { logUsage } from "./usage";
import { toAiError } from "./errors";

/**
 * The reframe coach's role and hard rules. Kept inline (not in prompt.ts) so this
 * feature owns its own tone contract. The one non-negotiable: a slip is normal and
 * recoverable, so we NEVER shame — shaming a relapse is what turns a slip into a
 * full relapse, which is exactly what this feature exists to prevent.
 */
const REFRAME_SYSTEM_PROMPT = [
  "You are a warm, evidence-informed relapse-recovery coach helping someone who JUST logged a slip.",
  "Draw on self-compassion research and relapse-prevention practice: a slip is a normal, expected part of behavior change, not a failure — and never a reason to give up.",
  "Be brief, kind, and validating. Speak in the present tense, like a supportive human.",
  "NEVER shame, scold, moralize, or catastrophize. No 'you should have', no guilt, no lecturing.",
  "Reframe the slip as a recovery moment, hand them one small doable next step, and reconnect them to their own reason for change.",
].join(" ");

/** Builds the reframe prompt from a validated slip request. */
function buildReframePrompt(input: ReframeRequest): string {
  // Only mention the trigger when we actually have one, so an empty value never
  // leaks into the prompt as a dangling, contextless line.
  const trigger =
    input.trigger && input.trigger.length > 0
      ? `What led to it: ${input.trigger}.`
      : "";

  return [
    `Someone just slipped on their goal to change "${input.habitName}".`,
    trigger,
    `Their reason for wanting to change: ${input.motivation}.`,
    "",
    "Respond with compassion: validate that a slip is normal and recoverable, give them one concrete step to get back on track right now, and remind them of their why.",
  ]
    .filter(Boolean)
    .join("\n");
}

/**
 * Turns a logged slip into a recovery moment: a compassionate reframe, one
 * concrete get-back-on-track step, and an affirmation tied to their motivation.
 * Mirrors generateSos — structured output, warm temperature, single retry, hard
 * timeout, and any thrown value normalised to a typed error for the caller.
 */
export async function generateReframe(
  supabase: SupabaseClient,
  input: ReframeRequest,
): Promise<ReframeResult> {
  try {
    const model = await getConfiguredModelId(supabase);
    const { object, usage } = await generateObject({
      model: getModel(model),
      schema: reframeResponseSchema,
      system: REFRAME_SYSTEM_PROMPT,
      prompt: buildReframePrompt(input),
      temperature: 0.6,
      maxRetries: 1,
      abortSignal: AbortSignal.timeout(AI_TIMEOUT_MS),
    });

    void logUsage(supabase, "reframe", model, usage);
    return { ok: true, data: object };
  } catch (error) {
    return { ok: false, error: toAiError(error) };
  }
}
