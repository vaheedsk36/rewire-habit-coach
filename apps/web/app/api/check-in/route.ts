import { NextResponse } from "next/server";
import { z } from "zod";
import { checkInSchema } from "@/types/tracking";
import { upsertCheckIn } from "@/services/db/journey";
import { createClient } from "@/lib/supabase/server";
import {
  parseBody,
  serverError,
  unauthorized,
} from "@/lib/api-response";

const bodySchema = z.object({
  habitId: z.string().uuid(),
  checkIn: checkInSchema,
});

/** POST /api/check-in — record today's check-in for the user's habit. */
export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return unauthorized();

  const parsed = await parseBody(request, bodySchema);
  if (!parsed.ok) return parsed.response;

  try {
    await upsertCheckIn(
      supabase,
      user.id,
      parsed.data.habitId,
      parsed.data.checkIn,
    );
    return NextResponse.json({ ok: true, data: {} });
  } catch {
    return serverError("Couldn't save your check-in. Try again.");
  }
}
