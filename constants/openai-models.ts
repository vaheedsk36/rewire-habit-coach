/**
 * Curated list of OpenAI chat models Rewire can use, with published pricing.
 * OpenAI does not expose pricing via API, so these rates (USD per 1M tokens) are
 * maintained here and are indicative — verify against openai.com/pricing.
 */
export interface OpenAiModel {
  id: string;
  label: string;
  /** USD per 1M input tokens. */
  inputPer1M: number;
  /** USD per 1M output tokens. */
  outputPer1M: number;
  note?: string;
}

export const OPENAI_MODELS: OpenAiModel[] = [
  {
    id: "gpt-4o-mini",
    label: "GPT-4o mini",
    inputPer1M: 0.15,
    outputPer1M: 0.6,
    note: "Fast & very cheap — the default.",
  },
  {
    id: "gpt-4.1-nano",
    label: "GPT-4.1 nano",
    inputPer1M: 0.1,
    outputPer1M: 0.4,
    note: "Cheapest; best for simple, high-volume calls.",
  },
  {
    id: "gpt-4.1-mini",
    label: "GPT-4.1 mini",
    inputPer1M: 0.4,
    outputPer1M: 1.6,
    note: "Stronger than 4o-mini, still inexpensive.",
  },
  {
    id: "gpt-4.1",
    label: "GPT-4.1",
    inputPer1M: 2.0,
    outputPer1M: 8.0,
    note: "High quality; pricier.",
  },
  {
    id: "gpt-4o",
    label: "GPT-4o",
    inputPer1M: 2.5,
    outputPer1M: 10.0,
    note: "Flagship multimodal.",
  },
  {
    id: "o4-mini",
    label: "o4-mini (reasoning)",
    inputPer1M: 1.1,
    outputPer1M: 4.4,
    note: "Reasoning model; slower, higher output cost.",
  },
];

export const MODEL_BY_ID: Record<string, OpenAiModel> = Object.fromEntries(
  OPENAI_MODELS.map((m) => [m.id, m]),
);

/** Estimate USD cost for a given model and token counts. Unknown models → 0. */
export function estimateCost(
  modelId: string,
  inputTokens: number,
  outputTokens: number,
): number {
  const m = MODEL_BY_ID[modelId];
  if (!m) return 0;
  return (
    (inputTokens / 1_000_000) * m.inputPer1M +
    (outputTokens / 1_000_000) * m.outputPer1M
  );
}
