import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/admin";
import { MODEL_BY_ID } from "@/constants/openai-models";
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
  if (!MODEL_BY_ID[parsed.data.model]) return serverError("Unknown model.");

  const { error } = await supabase
    .from("rewire_app_settings")
    .update({ openai_model: parsed.data.model, updated_at: new Date().toISOString() })
    .eq("id", 1);
  if (error) return serverError("Couldn't update the model.");

  return NextResponse.json({ ok: true, data: {} });
}
