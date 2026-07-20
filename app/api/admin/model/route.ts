import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/admin";
import { fetchChatModels } from "@/services/ai/openai-models";
import { parseBody, serverError, unauthorized } from "@/lib/api-response";

const bodySchema = z.object({ model: z.string().min(1) });

/** POST /api/admin/model — admin-only: set the app-wide OpenAI model. */
export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !isAdmin(user.email)) return unauthorized();

  const parsed = await parseBody(request, bodySchema);
  if (!parsed.ok) return parsed.response;

  // Validate against the models the key can actually access. If the live list
  // is unavailable (no key / API down) we don't hard-block — the admin is trusted.
  const liveIds = await fetchChatModels();
  if (liveIds.length && !liveIds.includes(parsed.data.model)) {
    return serverError("Unknown model.");
  }

  const { error } = await supabase
    .from("rewire_app_settings")
    .update({ openai_model: parsed.data.model, updated_at: new Date().toISOString() })
    .eq("id", 1);
  if (error) return serverError("Couldn't update the model.");

  return NextResponse.json({ ok: true, data: {} });
}
