import { sosInputSchema } from "@/types/sos";
import { generateSos } from "@/services/ai/generate-sos";
import { parseBody, resultResponse } from "@/lib/api-response";

/**
 * POST /api/sos
 * Craving SOS: re-validate -> delegate to the AI service -> return typed JSON.
 */
export async function POST(request: Request) {
  const parsed = await parseBody(request, sosInputSchema);
  if (!parsed.ok) return parsed.response;

  const result = await generateSos(parsed.data);
  return resultResponse(result);
}
