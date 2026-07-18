import type { HabitInput, SosInput } from "@/types";
import { categoryLabel, triggerLabel } from "@/constants/habits";

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
