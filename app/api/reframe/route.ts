import { reframeRequestSchema } from "@/types/reframe";
import { generateReframe } from "@/services/ai/reframe";
import { createClient } from "@/lib/supabase/server";
import { parseBody, resultResponse, unauthorized } from "@/lib/api-response";

/**
 * POST /api/reframe
 * Auth-gated. When a user logs a slip: confirm they're signed in → re-validate
 * the request → delegate to the AI service → return typed JSON. Thin by design.
 */
export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return unauthorized();

  const parsed = await parseBody(request, reframeRequestSchema);
  if (!parsed.ok) return parsed.response;

  const result = await generateReframe(parsed.data);
  return resultResponse(result);
}
