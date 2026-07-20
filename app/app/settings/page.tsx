import Link from "next/link";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { SettingsForm } from "@/components/settings/settings-form";

/** Derive a friendly display name from the auth user (metadata → email prefix). */
function displayName(meta: Record<string, unknown>, email: string): string {
  return (
    (typeof meta.full_name === "string" && meta.full_name) ||
    (typeof meta.name === "string" && meta.name) ||
    email.split("@")[0]
  );
}

/** Account settings: display name, email, appearance, and sign-out. */
export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const email = user.email ?? "";
  const name = displayName(user.user_metadata ?? {}, email);

  return (
    <main className="mx-auto w-full max-w-2xl space-y-6 px-4 py-8 sm:px-6">
      <Link
        href="/app"
        className="inline-flex items-center text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        ← Back to app
      </Link>
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Settings</h1>
      <SettingsForm initialName={name} email={email} />
    </main>
  );
}
