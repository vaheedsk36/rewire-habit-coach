import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  CheckIn,
  HabitInput,
  HabitSummary,
  JourneyRecord,
  RecoveryPlan,
} from "@/types";

/**
 * Data-access layer for a user's journey. Every query relies on Row-Level
 * Security to scope rows to the signed-in user — the client passed in already
 * carries their session, so a user can never read or write another's data.
 */

interface HabitRow {
  id: string;
  habit_name: string;
  category: string;
  goal_type: "quit" | "reduce";
  current_amount: string;
  target_amount: string | null;
  motivation: string;
  triggers: string[];
  timeframe_days: number;
  plan: RecoveryPlan;
  created_at: string;
}

interface CheckInRow {
  date: string;
  status: "win" | "slip";
  mood: number | null;
  note: string | null;
}

function toHabitInput(row: HabitRow): HabitInput {
  return {
    habitName: row.habit_name,
    category: row.category,
    goalType: row.goal_type,
    currentAmount: row.current_amount,
    targetAmount: row.target_amount ?? "",
    motivation: row.motivation,
    triggers: row.triggers,
    timeframeDays: row.timeframe_days,
  };
}

function toCheckIn(row: CheckInRow): CheckIn {
  return {
    date: row.date,
    status: row.status,
    mood: row.mood ?? undefined,
    note: row.note ?? undefined,
  };
}

/** Assemble a full JourneyRecord for a habit row by loading its check-ins. */
async function buildJourney(
  supabase: SupabaseClient,
  habit: HabitRow,
): Promise<JourneyRecord> {
  const { data: checkIns, error } = await supabase
    .from("rewire_check_ins")
    .select("date,status,mood,note")
    .eq("habit_id", habit.id)
    .order("date", { ascending: true })
    .returns<CheckInRow[]>();

  if (error) throw error;

  return {
    habitId: habit.id,
    habit: toHabitInput(habit),
    plan: habit.plan,
    startedAt: habit.created_at,
    checkIns: (checkIns ?? []).map(toCheckIn),
  };
}

/** All of the user's habits (newest first) — lightweight, for the switcher. */
export async function getHabits(
  supabase: SupabaseClient,
): Promise<HabitSummary[]> {
  const { data, error } = await supabase
    .from("rewire_habits")
    .select("id,habit_name,category,goal_type,created_at")
    .order("created_at", { ascending: false })
    .returns<
      Pick<
        HabitRow,
        "id" | "habit_name" | "category" | "goal_type" | "created_at"
      >[]
    >();

  if (error) throw error;
  return (data ?? []).map((h) => ({
    id: h.id,
    habitName: h.habit_name,
    category: h.category,
    goalType: h.goal_type,
    startedAt: h.created_at,
  }));
}

/** Load a specific habit's journey, or null if it isn't the user's / doesn't exist. */
export async function getJourney(
  supabase: SupabaseClient,
  habitId: string,
): Promise<JourneyRecord | null> {
  const { data: habit, error } = await supabase
    .from("rewire_habits")
    .select("*")
    .eq("id", habitId)
    .maybeSingle<HabitRow>();

  if (error) throw error;
  if (!habit) return null;
  return buildJourney(supabase, habit);
}

/** Load the user's most recent habit and its check-ins, or null if none. */
export async function getActiveJourney(
  supabase: SupabaseClient,
): Promise<JourneyRecord | null> {
  const { data: habit, error } = await supabase
    .from("rewire_habits")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle<HabitRow>();

  if (error) throw error;
  if (!habit) return null;
  return buildJourney(supabase, habit);
}

/** Persist a new habit + its generated plan; returns the new habit id. */
export async function createHabit(
  supabase: SupabaseClient,
  userId: string,
  input: HabitInput,
  plan: RecoveryPlan,
): Promise<string> {
  const { data, error } = await supabase
    .from("rewire_habits")
    .insert({
      user_id: userId,
      habit_name: input.habitName,
      category: input.category,
      goal_type: input.goalType,
      current_amount: input.currentAmount,
      target_amount: input.targetAmount || null,
      motivation: input.motivation,
      triggers: input.triggers,
      timeframe_days: input.timeframeDays,
      plan,
    })
    .select("id")
    .single<{ id: string }>();

  if (error) throw error;
  return data.id;
}

/** Insert or update today's (or any day's) check-in — one per habit per date. */
export async function upsertCheckIn(
  supabase: SupabaseClient,
  userId: string,
  habitId: string,
  checkIn: CheckIn,
): Promise<void> {
  const { error } = await supabase.from("rewire_check_ins").upsert(
    {
      habit_id: habitId,
      user_id: userId,
      date: checkIn.date,
      status: checkIn.status,
      mood: checkIn.mood ?? null,
      note: checkIn.note ?? null,
    },
    { onConflict: "habit_id,date" },
  );

  if (error) throw error;
}

/** Delete a single habit (its check-ins cascade). RLS + user_id scope it. */
export async function deleteHabit(
  supabase: SupabaseClient,
  userId: string,
  habitId: string,
): Promise<void> {
  const { error } = await supabase
    .from("rewire_habits")
    .delete()
    .eq("user_id", userId)
    .eq("id", habitId);

  if (error) throw error;
}
