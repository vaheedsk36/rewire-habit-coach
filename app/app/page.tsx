import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { getActiveJourney } from "@/services/db/journey";
import { Onboarding } from "@/components/onboarding/onboarding";
import { Dashboard } from "@/components/dashboard/dashboard";

/**
 * The authenticated product home (/app). A Server Component: it authenticates,
 * loads the user's journey from the DB (RLS-scoped), and renders onboarding or
 * the dashboard. Middleware gates /app/*; the check here is defence in depth.
 */
export default async function AppHome() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const journey = await getActiveJourney(supabase);

  return journey ? <Dashboard journey={journey} /> : <Onboarding />;
}
