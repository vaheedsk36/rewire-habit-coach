"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Sparkles } from "lucide-react";

import { habitInputSchema } from "@/types/habit";
import type { HabitInput } from "@/types";
import {
  GOAL_TYPES,
  HABIT_CATEGORIES,
  TIMEFRAME_OPTIONS,
  TRIGGER_OPTIONS,
} from "@/constants/habits";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field } from "@/components/shared/field";

const DEFAULT_VALUES: Partial<HabitInput> = {
  habitName: "",
  category: undefined,
  goalType: "reduce",
  currentAmount: "",
  targetAmount: "",
  motivation: "",
  triggers: [],
  timeframeDays: 30,
};

interface OnboardingFormProps {
  onSubmit: (input: HabitInput) => void;
  isLoading: boolean;
}

export function OnboardingForm({ onSubmit, isLoading }: OnboardingFormProps) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<HabitInput>({
    resolver: zodResolver(habitInputSchema),
    defaultValues: DEFAULT_VALUES as HabitInput,
  });

  const goalType = watch("goalType");

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
      noValidate
      aria-label="Set up your habit"
    >
      <Field
        label="What habit do you want to change?"
        htmlFor="habitName"
        hint="e.g. Instagram scrolling, evening vaping, late-night snacking"
        error={errors.habitName?.message}
      >
        <Input
          id="habitName"
          placeholder="Instagram scrolling"
          {...register("habitName")}
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Category"
          htmlFor="category"
          error={errors.category?.message}
        >
          <Controller
            control={control}
            name="category"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="category" className="w-full">
                  <SelectValue placeholder="Choose a category" />
                </SelectTrigger>
                <SelectContent>
                  {HABIT_CATEGORIES.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.emoji} {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </Field>

        <Field label="Goal" htmlFor="goalType" error={errors.goalType?.message}>
          <Controller
            control={control}
            name="goalType"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="goalType" className="w-full">
                  <SelectValue placeholder="Quit or cut down" />
                </SelectTrigger>
                <SelectContent>
                  {GOAL_TYPES.map((g) => (
                    <SelectItem key={g.value} value={g.value}>
                      {g.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </Field>

        <Field
          label="How much now?"
          htmlFor="currentAmount"
          hint="e.g. 4 hours/day"
          error={errors.currentAmount?.message}
        >
          <Input
            id="currentAmount"
            placeholder="4 hours/day"
            {...register("currentAmount")}
          />
        </Field>

        <Field
          label="Timeframe"
          htmlFor="timeframeDays"
          error={errors.timeframeDays?.message}
        >
          <Controller
            control={control}
            name="timeframeDays"
            render={({ field }) => (
              <Select
                value={String(field.value)}
                onValueChange={(v) => field.onChange(Number(v))}
              >
                <SelectTrigger id="timeframeDays" className="w-full">
                  <SelectValue placeholder="Pick a timeframe" />
                </SelectTrigger>
                <SelectContent>
                  {TIMEFRAME_OPTIONS.map((t) => (
                    <SelectItem key={t.value} value={String(t.value)}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </Field>
      </div>

      {goalType === "reduce" && (
        <Field
          label="Your target"
          htmlFor="targetAmount"
          hint="e.g. under 1 hour/day"
          error={errors.targetAmount?.message}
        >
          <Input
            id="targetAmount"
            placeholder="under 1 hour/day"
            {...register("targetAmount")}
          />
        </Field>
      )}

      <Field
        label="Why does this matter to you?"
        htmlFor="motivation"
        hint="Your 'why' powers every nudge. Be honest — it's just for you."
        error={errors.motivation?.message}
      >
        <Textarea
          id="motivation"
          rows={3}
          placeholder="I want to be present with my kids instead of my phone."
          {...register("motivation")}
        />
      </Field>

      <Controller
        control={control}
        name="triggers"
        render={({ field }) => (
          <Field
            label="What sets it off?"
            htmlFor="triggers"
            hint="Pick every trigger that applies — the plan targets these."
            error={errors.triggers?.message as string | undefined}
          >
            <div id="triggers" className="flex flex-wrap gap-2">
              {TRIGGER_OPTIONS.map((t) => {
                const selected = field.value?.includes(t.value);
                return (
                  <button
                    key={t.value}
                    type="button"
                    aria-pressed={selected}
                    onClick={() =>
                      field.onChange(
                        selected
                          ? field.value.filter((v: string) => v !== t.value)
                          : [...(field.value ?? []), t.value],
                      )
                    }
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-sm transition-colors",
                      selected
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background hover:bg-muted",
                    )}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>
          </Field>
        )}
      />

      <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="animate-spin" aria-hidden />
            Building your plan…
          </>
        ) : (
          <>
            <Sparkles aria-hidden />
            Build my recovery plan
          </>
        )}
      </Button>
    </form>
  );
}
