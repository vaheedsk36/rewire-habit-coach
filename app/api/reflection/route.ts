import { reflectionRequestSchema } from "@/types/reflection";
import { getJourney } from "@/services/db/journey";
import { generateReflection } from "@/services/ai/reflection";
import { createClient } from "@/lib/supabase/server";
import {
  parseBody,
  resultResponse,
  serverError,
  unauthorized,
} from "@/lib/api-response";

/**
 * POST /api/reflection
 * Auth-gated. Produces a weekly AI reflection for one habit: confirm the user is
 * signed in → re-validate the request → re-load the real journey server-side
 * (RLS-scoped, so the reflection is grounded in trusted data, not client input) →
 * delegate to the AI service → return typed JSON. Thin by design.
 */
export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return unauthorized();

  const parsed = await parseBody(request, reflectionRequestSchema);
  if (!parsed.ok) return parsed.response;

  const journey = await getJourney(supabase, parsed.data.habitId);
  if (!journey) return serverError("Habit not found.");

  const result = await generateReflection(journey);
  return resultResponse(result);
}
