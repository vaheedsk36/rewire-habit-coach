"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Coins,
  Cpu,
  ExternalLink,
  Loader2,
  Receipt,
} from "lucide-react";
import { toast } from "sonner";

import type { AdminModel } from "@/constants/openai-models";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface UsageSummary {
  totalCalls: number;
  totalInput: number;
  totalOutput: number;
  totalCost: number;
  byModel: {
    model: string;
    calls: number;
    inputTokens: number;
    outputTokens: number;
    cost: number;
  }[];
  byFeature: { feature: string; calls: number }[];
}

const usd = (n: number) =>
  n >= 1 ? `$${n.toFixed(2)}` : `$${n.toFixed(4)}`;
const num = (n: number) => n.toLocaleString();

export function AdminPanel({
  currentModel,
  models,
  summary,
}: {
  currentModel: string;
  models: AdminModel[];
  summary: UsageSummary;
}) {
  const router = useRouter();
  const [selected, setSelected] = useState(currentModel);
  const [saving, setSaving] = useState(false);

  const byId = new Map(models.map((m) => [m.id, m]));

  async function save() {
    setSaving(true);
    const res = await fetch("/api/admin/model", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: selected }),
    });
    setSaving(false);
    if (res.ok) {
      toast.success(`Model set to ${byId.get(selected)?.label ?? selected}`);
      router.refresh();
    } else {
      toast.error("Couldn't update the model.");
    }
  }

  return (
    <main className="mx-auto w-full max-w-3xl space-y-6 px-4 py-8 sm:px-6">
      <div>
        <Link
          href="/app"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Back to app
        </Link>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">Admin</h1>
        <p className="text-sm text-muted-foreground">
          Model, pricing, and usage — owner only.
        </p>
      </div>

      {/* Model picker */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/15">
              <Cpu className="size-4" aria-hidden />
            </span>
            <CardTitle>Model</CardTitle>
          </div>
          <CardDescription>
            The OpenAI model used for every AI feature. Applies immediately — no
            redeploy.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Select
              value={selected}
              onValueChange={(v) => v && setSelected(v)}
            >
              <SelectTrigger className="w-full sm:w-72">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {models.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={save} disabled={saving || selected === currentModel}>
              {saving ? <Loader2 className="animate-spin" aria-hidden /> : null}
              Save
            </Button>
          </div>
          {byId.get(selected)?.note && (
            <p className="text-sm text-muted-foreground">
              {byId.get(selected)?.note}
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            Current: <span className="font-medium">{currentModel}</span>
          </p>
        </CardContent>
      </Card>

      {/* Pricing */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/15">
              <Receipt className="size-4" aria-hidden />
            </span>
            <CardTitle>Pricing</CardTitle>
          </div>
          <CardDescription>
            Models are fetched live from your OpenAI key; prices are USD per 1M
            tokens (indicative — &ldquo;—&rdquo; means unpriced; verify at
            openai.com/pricing).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="py-2 pr-4 font-medium">Model</th>
                  <th className="py-2 pr-4 font-medium">Input</th>
                  <th className="py-2 font-medium">Output</th>
                </tr>
              </thead>
              <tbody>
                {models.map((m) => (
                  <tr
                    key={m.id}
                    className={m.id === currentModel ? "text-primary" : ""}
                  >
                    <td className="py-2 pr-4">
                      {m.label}
                      {m.id === currentModel && (
                        <span className="ml-1.5 text-xs">(active)</span>
                      )}
                    </td>
                    <td className="py-2 pr-4 tabular-nums">
                      {m.inputPer1M === null ? "—" : `$${m.inputPer1M.toFixed(2)}`}
                    </td>
                    <td className="py-2 tabular-nums">
                      {m.outputPer1M === null
                        ? "—"
                        : `$${m.outputPer1M.toFixed(2)}`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Usage & spend */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/15">
              <Coins className="size-4" aria-hidden />
            </span>
            <CardTitle>Usage &amp; estimated spend</CardTitle>
          </div>
          <CardDescription>
            Computed from tracked token usage. OpenAI doesn&apos;t expose your
            balance via API — check the dashboard for the actual figure.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat label="Est. spend" value={usd(summary.totalCost)} highlight />
            <Stat label="AI calls" value={num(summary.totalCalls)} />
            <Stat label="Input tokens" value={num(summary.totalInput)} />
            <Stat label="Output tokens" value={num(summary.totalOutput)} />
          </div>

          {summary.byModel.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="py-2 pr-4 font-medium">Model</th>
                    <th className="py-2 pr-4 font-medium">Calls</th>
                    <th className="py-2 pr-4 font-medium">Tokens (in/out)</th>
                    <th className="py-2 font-medium">Est. cost</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.byModel.map((m) => (
                    <tr key={m.model} className="border-b border-border/50">
                      <td className="py-2 pr-4">{m.model}</td>
                      <td className="py-2 pr-4 tabular-nums">{num(m.calls)}</td>
                      <td className="py-2 pr-4 tabular-nums">
                        {num(m.inputTokens)} / {num(m.outputTokens)}
                      </td>
                      <td className="py-2 tabular-nums">{usd(m.cost)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {summary.byFeature.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {summary.byFeature.map((f) => (
                <span
                  key={f.feature}
                  className="rounded-full border px-2.5 py-1 text-xs text-muted-foreground"
                >
                  {f.feature}: {num(f.calls)}
                </span>
              ))}
            </div>
          )}

          <a
            href="https://platform.openai.com/usage"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
          >
            Open OpenAI usage dashboard
            <ExternalLink className="size-3.5" aria-hidden />
          </a>
        </CardContent>
      </Card>
    </main>
  );
}

function Stat({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-lg border p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p
        className={`mt-1 text-lg font-semibold tabular-nums ${highlight ? "text-primary" : ""}`}
      >
        {value}
      </p>
    </div>
  );
}
