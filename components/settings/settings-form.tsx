"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { createClient } from "@/lib/supabase/client";
import { Field } from "@/components/shared/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { ThemeToggle } from "@/components/theme/theme-toggle";

interface SettingsFormProps {
  initialName: string;
  email: string;
}

/** Client-side account settings: profile name, email (read-only), theme, sign-out. */
export function SettingsForm({ initialName, email }: SettingsFormProps) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const trimmed = name.trim();
  const unchanged = trimmed === initialName.trim();

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    const { error: updateError } = await createClient().auth.updateUser({
      data: { full_name: trimmed },
    });
    setSaving(false);
    if (updateError) {
      setError(updateError.message);
      toast.error(updateError.message);
      return;
    }
    toast.success("Profile updated");
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Field
            label="Display name"
            htmlFor="display-name"
            error={error ?? undefined}
          >
            <Input
              id="display-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={saving}
              autoComplete="name"
            />
          </Field>
          <Field label="Email" htmlFor="email" hint="Email can't be changed here.">
            <Input id="email" value={email} readOnly disabled />
          </Field>
          <Button
            onClick={handleSave}
            disabled={saving || unchanged || trimmed.length === 0}
          >
            {saving ? "Saving…" : "Save"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Theme</span>
            <ThemeToggle />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
        </CardHeader>
        <CardContent>
          <SignOutButton />
        </CardContent>
      </Card>
    </div>
  );
}
