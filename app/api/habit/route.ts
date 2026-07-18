import { NextResponse } from "next/server";
import { habitInputSchema } from "@/types/habit";
import type { HabitResult } from "@/types";
import { generatePlan } from "@/services/ai/generate-plan";
import { createHabit, deleteJourney } from "@/services/db/journey";
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
    return NextResponse.json<HabitResult>({ ok: true, data: { habitId } });
  } catch {
    return serverError("We generated your plan but couldn't save it. Try again.");
  }
}

/** DELETE /api/habit — clear the user's journey so they can start a new habit. */
export async function DELETE() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return unauthorized();

  try {
    await deleteJourney(supabase, user.id);
    return NextResponse.json({ ok: true, data: {} });
  } catch {
    return serverError("Couldn't reset your journey. Try again.");
  }
}
