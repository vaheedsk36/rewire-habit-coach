import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { Onboarding } from "@/components/onboarding/onboarding";

/** /app/new — add another habit (onboarding, even when others already exist). */
export default async function NewHabitPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return <Onboarding />;
}
