import { NextResponse } from "next/server";
import { habitInputSchema } from "@/types/habit";
import type { HabitResult } from "@/types";
import { generatePlan } from "@/services/ai/generate-plan";
import { createHabit, deleteHabit } from "@/services/db/journey";
import { sendPlanReadyEmail } from "@/services/email/welcome";
import { createClient } from "@/lib/supabase/server";
import {
  parseBody,
  resultResponse,
  serverError,
  unauthorized,
} from "@/lib/api-response";

/**
 * POST /api/habit
 * Auth-gated. Validate onboarding input → generate the plan with a real LLM →
 * persist the habit + plan (RLS-scoped to the user) → return the new habit id.
 * Fires a "plan ready" email fire-and-forget so it never blocks or breaks the response.
 */
export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return unauthorized();

  const parsed = await parseBody(request, habitInputSchema);
  if (!parsed.ok) return parsed.response;

  const plan = await generatePlan(parsed.data);
  if (!plan.ok) return resultResponse(plan);

  try {
    const habitId = await createHabit(supabase, user.id, parsed.data, plan.data);
    // Fire-and-forget: reuses the shared Resend secret via an edge function.
    void sendPlanReadyEmail(supabase, {
      habitName: parsed.data.habitName,
      plan: plan.data,
    }).catch(() => {});
    return NextResponse.json<HabitResult>({ ok: true, data: { habitId } });
  } catch {
    return serverError("We generated your plan but couldn't save it. Try again.");
  }
}

/** DELETE /api/habit?habitId=<id> — remove one habit (check-ins cascade). */
export async function DELETE(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return unauthorized();

  const habitId = new URL(request.url).searchParams.get("habitId");
  if (!habitId) return serverError("Missing habitId.");

  try {
    await deleteHabit(supabase, user.id, habitId);
    return NextResponse.json({ ok: true, data: {} });
  } catch {
    return serverError("Couldn't delete that habit. Try again.");
  }
}
