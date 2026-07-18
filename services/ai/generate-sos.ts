import { generateObject } from "ai";
import { sosResponseSchema } from "@/types/sos";
import type { SosInput, SosResult } from "@/types";
import { AI_TIMEOUT_MS, getModel } from "./client";
import { buildSosPrompt, SOS_SYSTEM_PROMPT } from "./prompt";
import { toAiError } from "./errors";

/**
 * Generates an in-the-moment coping response for a craving. Uses a lower timeout
 * bias via temperature tuning for warmth, but the same structured-output guarantee.
 */
export async function generateSos(input: SosInput): Promise<SosResult> {
  try {
    const { object } = await generateObject({
      model: getModel(),
      schema: sosResponseSchema,
      system: SOS_SYSTEM_PROMPT,
      prompt: buildSosPrompt(input),
      temperature: 0.6,
      maxRetries: 1,
      abortSignal: AbortSignal.timeout(AI_TIMEOUT_MS),
    });

    return { ok: true, data: object };
  } catch (error) {
    return { ok: false, error: toAiError(error) };
  }
}
