import { sosInputSchema } from "@/types/sos";
import { generateSos } from "@/services/ai/generate-sos";
import { createClient } from "@/lib/supabase/server";
import { parseBody, resultResponse, unauthorized } from "@/lib/api-response";

/**
 * POST /api/sos
 * Craving SOS: auth-gate -> re-validate -> delegate to the AI service -> typed JSON.
 */
export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return unauthorized();

  const parsed = await parseBody(request, sosInputSchema);
  if (!parsed.ok) return parsed.response;

  const result = await generateSos(supabase, parsed.data);
  return resultResponse(result);
}
