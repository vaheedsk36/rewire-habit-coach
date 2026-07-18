import { suggestRequestSchema } from "@/types/suggest";
import { generateSuggestion } from "@/services/ai/suggest";
import { createClient } from "@/lib/supabase/server";
import { parseBody, resultResponse, unauthorized } from "@/lib/api-response";

/**
 * POST /api/suggest
 * Auth-gated. Validate the habit name → ask the LLM for prefill values →
 * return typed JSON. Thin: no persistence, no business logic.
 */
export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return unauthorized();

  const parsed = await parseBody(request, suggestRequestSchema);
  if (!parsed.ok) return parsed.response;

  const result = await generateSuggestion(parsed.data);
  return resultResponse(result);
}
