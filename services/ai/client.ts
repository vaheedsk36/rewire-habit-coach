import { createOpenAI, type OpenAIProvider } from "@ai-sdk/openai";

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

/** The chat model used for generation, overridable via env. */
export function getModel() {
  return getProvider()(process.env.OPENAI_MODEL ?? "gpt-4o-mini");
}

/** How long to wait for the model before giving up (ms). */
export const AI_TIMEOUT_MS = 45_000;
