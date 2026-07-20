import type { SupabaseClient } from "@supabase/supabase-js";

/** Token usage as reported by the AI SDK (fields may be absent). */
export interface TokenUsage {
  inputTokens?: number;
  outputTokens?: number;
}

/**
 * Records one LLM call's token usage so the admin portal can estimate spend.
 * Fire-and-forget and fully swallowed: usage logging must NEVER affect the
 * user-facing generation. RLS scopes the insert to the signed-in user.
 */
export async function logUsage(
  supabase: SupabaseClient,
  feature: string,
  model: string,
  usage: TokenUsage | undefined,
): Promise<void> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("rewire_ai_usage").insert({
      user_id: user.id,
      feature,
      model,
      input_tokens: Math.round(usage?.inputTokens ?? 0),
      output_tokens: Math.round(usage?.outputTokens ?? 0),
    });
  } catch {
    // Never let telemetry break a real request.
  }
}
