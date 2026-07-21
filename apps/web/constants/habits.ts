/**
 * Form options for onboarding. These are the single source of the allowed
 * enum values — the Zod schemas in `types/` derive their `.enum()`s from here,
 * so options and validation never drift.
 */
export const HABIT_CATEGORIES = [
  { value: "screen_time", label: "Screen time", emoji: "📱" },
  { value: "social_media", label: "Social media", emoji: "💬" },
  { value: "smoking", label: "Smoking", emoji: "🚬" },
  { value: "vaping", label: "Vaping", emoji: "💨" },
  { value: "alcohol", label: "Alcohol", emoji: "🍺" },
  { value: "junk_food", label: "Junk food / sugar", emoji: "🍔" },
  { value: "gambling", label: "Gambling", emoji: "🎰" },
  { value: "caffeine", label: "Caffeine", emoji: "☕" },
  { value: "other", label: "Something else", emoji: "🎯" },
] as const;

export type HabitCategory = (typeof HABIT_CATEGORIES)[number]["value"];

/** Common relapse triggers, multi-select in onboarding. */
export const TRIGGER_OPTIONS = [
  { value: "stress", label: "Stress" },
  { value: "boredom", label: "Boredom" },
  { value: "loneliness", label: "Loneliness" },
  { value: "social_pressure", label: "Social pressure" },
  { value: "habit_cue", label: "Habit / routine cue" },
  { value: "evenings", label: "Evenings" },
  { value: "after_meals", label: "After meals" },
  { value: "phone_nearby", label: "Phone within reach" },
  { value: "tiredness", label: "Tiredness" },
  { value: "celebration", label: "Celebrating" },
] as const;

export type TriggerValue = (typeof TRIGGER_OPTIONS)[number]["value"];

export const GOAL_TYPES = [
  { value: "quit", label: "Quit completely" },
  { value: "reduce", label: "Cut down" },
] as const;

export const TIMEFRAME_OPTIONS = [
  { value: 7, label: "1 week" },
  { value: 14, label: "2 weeks" },
  { value: 21, label: "21 days" },
  { value: 30, label: "30 days" },
  { value: 60, label: "60 days" },
  { value: 90, label: "90 days" },
] as const;

/** Lookup label for a category value (used in prompts and UI). */
export function categoryLabel(value: string): string {
  return HABIT_CATEGORIES.find((c) => c.value === value)?.label ?? value;
}

/** Lookup label for a trigger value. */
export function triggerLabel(value: string): string {
  return TRIGGER_OPTIONS.find((t) => t.value === value)?.label ?? value;
}
