import { habitInputSchema } from "@/types/habit";
import { generatePlan } from "@/services/ai/generate-plan";
import { parseBody, resultResponse } from "@/lib/api-response";

/**
 * POST /api/plan
 * Thin handler: re-validate input with the shared Zod schema (never trust the
 * client) -> delegate to the AI service -> return typed JSON.
 */
export async function POST(request: Request) {
  const parsed = await parseBody(request, habitInputSchema);
  if (!parsed.ok) return parsed.response;

  const result = await generatePlan(parsed.data);
  return resultResponse(result);
}
