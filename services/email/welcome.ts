import type { SupabaseClient } from "@supabase/supabase-js";
import type { RecoveryPlan } from "@/types";

/**
 * Sends the "your plan is ready" email by invoking the `rewire-send-email`
 * Supabase Edge Function, which reuses the project's existing Resend secret and
 * verified sender — so no email key ever lives in this app's env. The recipient
 * is derived from the caller's JWT inside the function (it can only email the
 * signed-in user). Never throws: email must never break the signup/plan flow.
 */
export async function sendPlanReadyEmail(
  supabase: SupabaseClient,
  params: { habitName: string; plan: RecoveryPlan },
): Promise<{ ok: boolean }> {
  try {
    const { error } = await supabase.functions.invoke("rewire-send-email", {
      body: { habitName: params.habitName, plan: params.plan },
    });
    return { ok: !error };
  } catch {
    return { ok: false };
  }
}
