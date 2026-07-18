import { generateObject } from "ai";
import { suggestionSchema } from "@/types/suggest";
import type { SuggestRequest, SuggestResult } from "@/types/suggest";
import { AI_TIMEOUT_MS, getModel } from "./client";
import { toAiError } from "./errors";

// Prompts are inline (not in prompt.ts) because this feature owns a single short
// prompt — keeping it here avoids editing the shared prompt module.
const SUGGEST_SYSTEM_PROMPT =
  "You help someone start breaking a habit by pre-filling an onboarding form. " +
  "Given only the habit they named, infer sensible, realistic values for each " +
  "field. Be warm and non-judgemental. The user can edit everything, so favour " +
  "helpful concrete defaults over vague ones.";

/**
 * Suggests onboarding form values from the raw habit name a real LLM call, with
 * the same structured-output + timeout + typed-result contract as generatePlan.
 */
export async function generateSuggestion(
  input: SuggestRequest,
): Promise<SuggestResult> {
  try {
    const { object } = await generateObject({
      model: getModel(),
      schema: suggestionSchema,
      system: SUGGEST_SYSTEM_PROMPT,
      prompt: `The habit the user wants to change: "${input.habitName}". Suggest form values.`,
      temperature: 0.5,
      maxRetries: 1,
      abortSignal: AbortSignal.timeout(AI_TIMEOUT_MS),
    });

    return { ok: true, data: object };
  } catch (error) {
    return { ok: false, error: toAiError(error) };
  }
}
