import { generateObject } from "ai";
import type { SupabaseClient } from "@supabase/supabase-js";
import { sosResponseSchema } from "@/types/sos";
import type { SosInput, SosResult } from "@/types";
import { AI_TIMEOUT_MS, getConfiguredModelId, getModel } from "./client";
import { buildSosPrompt, SOS_SYSTEM_PROMPT } from "./prompt";
import { logUsage } from "./usage";
import { toAiError } from "./errors";

/**
 * Generates an in-the-moment coping response for a craving. Uses the
 * admin-configured model, logs usage, and keeps the structured-output guarantee.
 */
export async function generateSos(
  supabase: SupabaseClient,
  input: SosInput,
): Promise<SosResult> {
  try {
    const model = await getConfiguredModelId(supabase);
    const { object, usage } = await generateObject({
      model: getModel(model),
      schema: sosResponseSchema,
      system: SOS_SYSTEM_PROMPT,
      prompt: buildSosPrompt(input),
      temperature: 0.6,
      maxRetries: 1,
      abortSignal: AbortSignal.timeout(AI_TIMEOUT_MS),
    });

    void logUsage(supabase, "sos", model, usage);
    return { ok: true, data: object };
  } catch (error) {
    return { ok: false, error: toAiError(error) };
  }
}
