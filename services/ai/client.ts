import { createOpenAI, type OpenAIProvider } from "@ai-sdk/openai";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Lazily creates the OpenAI provider. The key is read from the server-only
 * environment at request time (not module load), so a missing key never breaks
 * the build — it surfaces as a handled runtime error instead. The key stays in
 * this module and can never be bundled into client code.
 */
let provider: OpenAIProvider | null = null;

function getProvider(): OpenAIProvider {
  if (provider) return provider;
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "OPENAI_API_KEY is not set. Add it to .env.local (see .env.example).",
    );
  }
  provider = createOpenAI({ apiKey });
  return provider;
}

/** The default model, overridable via env, and finally by the DB setting. */
export const DEFAULT_MODEL = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

/** Build a chat model instance for a given model id (defaults to DEFAULT_MODEL). */
export function getModel(modelId: string = DEFAULT_MODEL) {
  return getProvider()(modelId);
}

/**
 * The admin-selected model from `rewire_app_settings` (RLS-readable by any
 * signed-in user). Falls back to DEFAULT_MODEL if unset or on any error, so a
 * config hiccup never breaks generation.
 */
export async function getConfiguredModelId(
  supabase: SupabaseClient,
): Promise<string> {
  try {
    const { data } = await supabase
      .from("rewire_app_settings")
      .select("openai_model")
      .eq("id", 1)
      .maybeSingle<{ openai_model: string }>();
    return data?.openai_model || DEFAULT_MODEL;
  } catch {
    return DEFAULT_MODEL;
  }
}

/** How long to wait for the model before giving up (ms). */
export const AI_TIMEOUT_MS = 45_000;
