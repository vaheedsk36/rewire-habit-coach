import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { getHabits, getJourney } from "@/services/db/journey";
import { isAdmin } from "@/lib/admin";
import { Onboarding } from "@/components/onboarding/onboarding";
import { Dashboard } from "@/components/dashboard/dashboard";

/** Derive a friendly display name from the auth user (metadata → email → fallback). */
function displayName(meta: Record<string, unknown>, email?: string): string {
  const name =
    (typeof meta.full_name === "string" && meta.full_name) ||
    (typeof meta.name === "string" && meta.name) ||
    (email ? email.split("@")[0] : "");
  return name || "there";
}

/**
 * The authenticated product home (/app). Loads the user's habits (RLS-scoped),
 * picks the one to view (?habit=<id>, else most recent), and renders the
 * dashboard — or onboarding when the user has no habits yet.
 */
export default async function AppHome({
  searchParams,
}: {
  searchParams: Promise<{ habit?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const habits = await getHabits(supabase);
  if (habits.length === 0) return <Onboarding />;

  const { habit: requested } = await searchParams;
  const selectedId = habits.some((h) => h.id === requested)
    ? requested!
    : habits[0].id;

  const journey = await getJourney(supabase, selectedId);
  if (!journey) return <Onboarding />;

  return (
    <Dashboard
      journey={journey}
      habits={habits}
      name={displayName(user.user_metadata ?? {}, user.email ?? undefined)}
      isAdmin={isAdmin(user.email)}
    />
  );
}
