import { generateObject } from "ai";
import type { JourneyRecord } from "@/types";
import {
  reflectionResponseSchema,
  type ReflectionResult,
} from "@/types/reflection";
import { categoryLabel } from "@/constants/habits";
import { currentStreak, daysSince, totalWins } from "@/lib/streak";
import { AI_TIMEOUT_MS, getModel } from "./client";
import { toAiError } from "./errors";

/**
 * Provider options passed to `generateObject`. Defined locally because the shared
 * AI client does not export one and these NEW files may not edit existing modules;
 * enabling OpenAI structured outputs makes the model honor the Zod schema natively
 * (rather than post-hoc parsing), which is exactly what a typed reflection needs.
 */
const AI_PROVIDER_OPTIONS = {
  openai: { structuredOutputs: true },
};

/**
 * The weekly-reflection coach's role and hard rules. Kept inline (not in
 * prompt.ts) so this feature owns its own tone contract. The non-negotiable:
 * be HONEST about the real pattern — a reflection that ignores slips is useless —
 * while staying encouraging, because shame is what makes people abandon a habit.
 */
const REFLECTION_SYSTEM_PROMPT = [
  "You are a warm, evidence-informed habit-change coach writing a short weekly reflection for someone in the Rewire app.",
  "Ground everything in the CONTEXT below — the user's REAL tracked check-ins. Reference the actual pattern you can see (streak, specific wins, slips, momentum, or a rough stretch); never invent progress that isn't there.",
  "Be honest AND encouraging: name setbacks plainly and kindly, and celebrate genuine progress specifically. Never shame, moralize, or catastrophize.",
  "Draw on self-compassion and relapse-prevention practice — a slip is a normal, recoverable part of change, not a failure.",
  "End with ONE focused, concrete goal for the coming week, tuned to what the data shows they most need next.",
  "You never give medical advice or diagnose; for severe struggles, gently suggest professional support.",
].join(" ");

/**
 * Compact, factual summary of the user's tracked progress for the reflection.
 * Written inline (rather than reusing buildCoachContext) so we can widen the
 * window to the last 14 check-ins — a weekly reflection reads better with the
 * full recent trend, not just the 7-day slice the live coach uses.
 */
function buildReflectionContext(journey: JourneyRecord): string {
  const { habit, checkIns } = journey;
  const streak = currentStreak(checkIns);
  const wins = totalWins(checkIns);
  const slips = checkIns.filter((c) => c.status === "slip").length;
  const day = daysSince(journey.startedAt);

  // Last up-to-14 entries, oldest→newest, so the model reads the recent trend in
  // chronological order (check-ins are already stored ascending by date).
  const recent = checkIns
    .slice(-14)
    .map((c) => `  ${c.date}: ${c.status}${c.note ? ` — "${c.note}"` : ""}`)
    .join("\n");

  return [
    "CONTEXT — the user's tracked progress (use this, don't ask for it):",
    `- Habit: ${habit.habitName} (${categoryLabel(habit.category)}), goal: ${habit.goalType}`,
    `- Their reason: ${habit.motivation}`,
    `- Day ${day} of a ${habit.timeframeDays}-day plan`,
    `- Current streak: ${streak} day(s); total wins: ${wins}; total slips: ${slips}`,
    recent
      ? `- Recent check-ins (up to last 14):\n${recent}`
      : "- No check-ins logged yet.",
  ].join("\n");
}

/**
 * Generates an honest, encouraging weekly reflection for a habit: a truthful read
 * of the past week, one highlight worth celebrating, and one focused goal for the
 * week ahead. Mirrors generateSos/generateReframe — structured output, warm
 * temperature, single retry, hard timeout, and any thrown value normalised to a
 * typed error so the API route stays thin.
 */
export async function generateReflection(
  journey: JourneyRecord,
): Promise<ReflectionResult> {
  try {
    const { object } = await generateObject({
      model: getModel(),
      schema: reflectionResponseSchema,
      system: REFLECTION_SYSTEM_PROMPT,
      prompt: buildReflectionContext(journey),
      temperature: 0.6,
      maxRetries: 1,
      abortSignal: AbortSignal.timeout(AI_TIMEOUT_MS),
      providerOptions: AI_PROVIDER_OPTIONS,
    });

    return { ok: true, data: object };
  } catch (error) {
    return { ok: false, error: toAiError(error) };
  }
}
