import { coachRequestSchema } from "@/types/coach";
import { getActiveJourney } from "@/services/db/journey";
import { streamCoachReply } from "@/services/ai/coach";
import { createClient } from "@/lib/supabase/server";
import { parseBody, serverError, unauthorized } from "@/lib/api-response";

/**
 * POST /api/coach
 * Streams an adaptive coaching reply. Loads the user's real progress from the
 * DB server-side (RLS-scoped) and grounds the coach in it — the client only
 * sends the conversation, never the progress data.
 */
export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return unauthorized();

  const parsed = await parseBody(request, coachRequestSchema);
  if (!parsed.ok) return parsed.response;

  try {
    const journey = await getActiveJourney(supabase);
    if (!journey) return serverError("Start a habit before chatting with your coach.");

    const result = await streamCoachReply(
      supabase,
      journey,
      parsed.data.message,
      parsed.data.history,
    );
    return result.toTextStreamResponse();
  } catch {
    return serverError("The coach is unavailable right now. Try again.");
  }
}
