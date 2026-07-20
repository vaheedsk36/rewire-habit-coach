import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/admin";
import { getConfiguredModelId } from "@/services/ai/client";
import { fetchChatModels } from "@/services/ai/openai-models";
import {
  estimateCost,
  mergeWithPricing,
  MODEL_BY_ID,
} from "@/constants/openai-models";
import { AdminPanel, type UsageSummary } from "@/components/admin/admin-panel";

interface UsageRow {
  feature: string;
  model: string;
  input_tokens: number;
  output_tokens: number;
}

/** Aggregate raw usage rows into the summary the panel renders. */
function summarize(rows: UsageRow[]): UsageSummary {
  const byModel = new Map<
    string,
    { model: string; calls: number; inputTokens: number; outputTokens: number; cost: number }
  >();
  const byFeature = new Map<string, number>();
  let totalInput = 0;
  let totalOutput = 0;
  let totalCost = 0;

  for (const r of rows) {
    totalInput += r.input_tokens;
    totalOutput += r.output_tokens;
    totalCost += estimateCost(r.model, r.input_tokens, r.output_tokens);

    const m = byModel.get(r.model) ?? {
      model: r.model,
      calls: 0,
      inputTokens: 0,
      outputTokens: 0,
      cost: 0,
    };
    m.calls += 1;
    m.inputTokens += r.input_tokens;
    m.outputTokens += r.output_tokens;
    m.cost += estimateCost(r.model, r.input_tokens, r.output_tokens);
    byModel.set(r.model, m);

    byFeature.set(r.feature, (byFeature.get(r.feature) ?? 0) + 1);
  }

  return {
    totalCalls: rows.length,
    totalInput,
    totalOutput,
    totalCost,
    byModel: [...byModel.values()].sort((a, b) => b.cost - a.cost),
    byFeature: [...byFeature.entries()]
      .map(([feature, calls]) => ({ feature, calls }))
      .sort((a, b) => b.calls - a.calls),
  };
}

/** /app/admin — owner-only control panel: model, pricing, and usage/spend. */
export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  if (!isAdmin(user.email)) redirect("/app");

  const currentModel = await getConfiguredModelId(supabase);

  // Live model list from OpenAI, overlaid with our maintained pricing.
  const liveIds = await fetchChatModels();
  const models = mergeWithPricing(liveIds);
  // Always include the current model in the picker, even if the live list misses it.
  if (!models.some((m) => m.id === currentModel)) {
    const p = MODEL_BY_ID[currentModel];
    models.unshift({
      id: currentModel,
      label: p?.label ?? currentModel,
      inputPer1M: p?.inputPer1M ?? null,
      outputPer1M: p?.outputPer1M ?? null,
      note: p?.note,
    });
  }

  const { data } = await supabase
    .from("rewire_ai_usage")
    .select("feature,model,input_tokens,output_tokens")
    .returns<UsageRow[]>();

  return (
    <AdminPanel
      currentModel={currentModel}
      models={models}
      summary={summarize(data ?? [])}
    />
  );
}
