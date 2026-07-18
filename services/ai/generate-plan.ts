import { generateObject } from "ai";
import { recoveryPlanSchema } from "@/types/plan";
import type { HabitInput, PlanResult } from "@/types";
import { AI_TIMEOUT_MS, getModel } from "./client";
import { buildPlanPrompt, PLAN_SYSTEM_PROMPT } from "./prompt";
import { toAiError } from "./errors";

/**
 * Generates a personalized recovery plan from validated onboarding input using a
 * real LLM call. `generateObject` + the Zod schema guarantees structured output,
 * so there is never any text to parse. Failures normalise into a typed result.
 */
export async function generatePlan(input: HabitInput): Promise<PlanResult> {
  try {
    const { object } = await generateObject({
      model: getModel(),
      schema: recoveryPlanSchema,
      system: PLAN_SYSTEM_PROMPT,
      prompt: buildPlanPrompt(input),
      temperature: 0.7,
      maxRetries: 1,
      abortSignal: AbortSignal.timeout(AI_TIMEOUT_MS),
    });

    return { ok: true, data: object };
  } catch (error) {
    return { ok: false, error: toAiError(error) };
  }
}
