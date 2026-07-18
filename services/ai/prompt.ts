import type { HabitInput, JourneyRecord, SosInput } from "@/types";
import { categoryLabel, triggerLabel } from "@/constants/habits";
import { currentStreak, daysSince, totalWins } from "@/lib/streak";

/**
 * System prompts define the coach's role and hard rules. Field-level shape rules
 * live in the Zod schemas' `.describe()` calls, so they are not duplicated here.
 */
export const PLAN_SYSTEM_PROMPT = [
  "You are a warm, evidence-informed behavior-change coach specializing in breaking bad habits and addiction.",
  "You draw on proven techniques: habit-loop disruption, implementation intentions, urge surfing, and self-compassion.",
  "You are encouraging and realistic — never preachy, never shaming, never clinical.",
  "You never give medical advice or diagnose; for severe addiction you gently encourage seeking professional support.",
  "Every strategy must be specific and actionable, tuned to THIS person's habit, triggers, and reason for change.",
].join(" ");

export const SOS_SYSTEM_PROMPT = [
  "You are a calm crisis-moment coach helping someone ride out a craving RIGHT NOW.",
  "Be brief, grounding, and kind. Speak in the present tense.",
  "Assume the person has seconds of attention — every word must earn its place.",
  "Never shame. Reconnect them to their own reason for change and remind them the urge will pass.",
].join(" ");

export const COACH_SYSTEM_PROMPT = [
  "You are the user's personal habit-change coach inside the Rewire app.",
  "You ADAPT to their real tracked progress — reference their streak, recent wins/slips, and trigger patterns in the CONTEXT below.",
  "Be concise (2-4 short paragraphs max), warm, specific, and practical. Talk like a supportive human, not a textbook.",
  "When they've slipped, respond with compassion and a concrete next step — never shame.",
  "When they're doing well, name the specific progress you can see in their data.",
  "You never give medical advice or diagnose; for severe addiction, gently suggest professional support.",
].join(" ");

/** Compact, factual summary of the user's tracked progress for the coach. */
export function buildCoachContext(journey: JourneyRecord): string {
  const { habit, checkIns } = journey;
  const streak = currentStreak(checkIns);
  const wins = totalWins(checkIns);
  const slips = checkIns.filter((c) => c.status === "slip").length;
  const day = daysSince(journey.startedAt);
  const recent = checkIns
    .slice(-7)
    .map(
      (c) =>
        `  ${c.date}: ${c.status}${c.note ? ` — "${c.note}"` : ""}`,
    )
    .join("\n");

  return [
    "CONTEXT — the user's tracked progress (use this, don't ask for it):",
    `- Habit: ${habit.habitName} (${categoryLabel(habit.category)}), goal: ${habit.goalType}`,
    `- Their reason: ${habit.motivation}`,
    `- Known triggers: ${habit.triggers.map(triggerLabel).join(", ")}`,
    `- Day ${day} of a ${habit.timeframeDays}-day plan`,
    `- Current streak: ${streak} day(s); total wins: ${wins}; total slips: ${slips}`,
    recent ? `- Recent check-ins:\n${recent}` : "- No check-ins logged yet.",
  ].join("\n");
}

/** Builds the recovery-plan prompt from validated onboarding input. */
export function buildPlanPrompt(input: HabitInput): string {
  const triggers = input.triggers.map(triggerLabel).join(", ");
  const goal =
    input.goalType === "quit"
      ? `quit "${input.habitName}" completely`
      : `reduce "${input.habitName}"`;
  const target =
    input.targetAmount && input.targetAmount.length > 0
      ? `Their target: ${input.targetAmount}.`
      : "";

  return [
    `Create a personalized ${input.timeframeDays}-day plan to help someone ${goal}.`,
    "",
    `- Habit category: ${categoryLabel(input.category)}`,
    `- Current amount: ${input.currentAmount}`,
    target,
    `- Their reason for change (their "why"): ${input.motivation}`,
    `- Their known triggers: ${triggers}`,
    `- Timeframe: ${input.timeframeDays} days`,
    "",
    "Produce:",
    "1. A short, encouraging summary personalized to their why.",
    "2. The single most important first step to take today.",
    `3. ${Math.min(6, Math.max(3, Math.round(input.timeframeDays / 10)))} milestones spread across the timeframe, ordered by day.`,
    "4. Coping strategies mapped directly to their listed triggers.",
    "5. Replacement behaviors that fill the role the habit currently plays.",
    "6. One intelligent nudge for today.",
    "7. A sincere affirmation grounded in their stated motivation.",
  ]
    .filter(Boolean)
    .join("\n");
}

/** Builds the in-the-moment SOS prompt from a validated craving request. */
export function buildSosPrompt(input: SosInput): string {
  const trigger =
    input.trigger && input.trigger.length > 0
      ? `Right now they are triggered by: ${input.trigger}.`
      : "";

  return [
    `Someone is fighting an urge to ${input.habitName} right now.`,
    `Urge intensity: ${input.intensity}/5.`,
    trigger,
    `Their reason for wanting to change: ${input.motivation}.`,
    "",
    "Give them an immediate way to ride out this urge: a calm opener, 3-4 grounding steps they can do this minute, one quick distraction, a reframe tied to their reason, and a realistic time for the urge to pass.",
  ]
    .filter(Boolean)
    .join("\n");
}
