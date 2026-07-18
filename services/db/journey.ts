import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  CheckIn,
  HabitInput,
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

  const { data: checkIns, error: ciError } = await supabase
    .from("rewire_check_ins")
    .select("date,status,mood,note")
    .eq("habit_id", habit.id)
    .order("date", { ascending: true })
    .returns<CheckInRow[]>();

  if (ciError) throw ciError;

  return {
    habitId: habit.id,
    habit: toHabitInput(habit),
    plan: habit.plan,
    startedAt: habit.created_at,
    checkIns: (checkIns ?? []).map(toCheckIn),
  };
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

/** Delete all of the user's habits (check-ins cascade) so they can start over. */
export async function deleteJourney(
  supabase: SupabaseClient,
  userId: string,
): Promise<void> {
  const { error } = await supabase
    .from("rewire_habits")
    .delete()
    .eq("user_id", userId);

  if (error) throw error;
}
