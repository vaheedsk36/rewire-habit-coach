import { generateObject } from "ai";
import type { SupabaseClient } from "@supabase/supabase-js";
import { recoveryPlanSchema } from "@/types/plan";
import type { HabitInput, PlanResult } from "@/types";
import { AI_TIMEOUT_MS, getConfiguredModelId, getModel } from "./client";
import { buildPlanPrompt, PLAN_SYSTEM_PROMPT } from "./prompt";
import { logUsage } from "./usage";
import { toAiError } from "./errors";

/**
 * Generates a personalized recovery plan from validated onboarding input using a
 * real LLM call. `generateObject` + the Zod schema guarantees structured output,
 * so there is never any text to parse. Uses the admin-configured model and logs
 * token usage. Failures normalise into a typed result.
 */
export async function generatePlan(
  supabase: SupabaseClient,
  input: HabitInput,
): Promise<PlanResult> {
  try {
    const model = await getConfiguredModelId(supabase);
    const { object, usage } = await generateObject({
      model: getModel(model),
      schema: recoveryPlanSchema,
      system: PLAN_SYSTEM_PROMPT,
      prompt: buildPlanPrompt(input),
      temperature: 0.7,
      maxRetries: 1,
      abortSignal: AbortSignal.timeout(AI_TIMEOUT_MS),
    });

    await logUsage(supabase, "plan", model, usage);
    return { ok: true, data: object };
  } catch (error) {
    return { ok: false, error: toAiError(error) };
  }
}
