/**
 * Fetches the chat-capable models your OpenAI key can actually access, live from
 * the API — so the admin picker isn't a hardcoded list. Pricing still comes from
 * the maintained map in constants/openai-models.ts (OpenAI exposes no price API).
 */

// Keep only conversational/completion models; drop embeddings, audio, image, etc.
const CHAT_RE = /^(gpt-|o[1345]|chatgpt)/i;
const EXCLUDE_RE =
  /(audio|realtime|transcribe|tts|embedding|image|dall-e|whisper|moderation|search|instruct|codex)/i;

export async function fetchChatModels(): Promise<string[]> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return [];
  try {
    const res = await fetch("https://api.openai.com/v1/models", {
      headers: { Authorization: `Bearer ${key}` },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return [];
    const json = (await res.json()) as { data?: { id: string }[] };
    const ids = (json.data ?? [])
      .map((m) => m.id)
      .filter((id) => CHAT_RE.test(id) && !EXCLUDE_RE.test(id));
    return [...new Set(ids)].sort();
  } catch {
    return [];
  }
}
