"use client";

import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Ban,
  Clock,
  Gauge,
  Heart,
  Loader2,
  Sparkles,
  Target,
  TrendingDown,
  Wand2,
} from "lucide-react";

import { habitInputSchema } from "@/types/habit";
import type { HabitInput } from "@/types";
import {
  HABIT_CATEGORIES,
  TIMEFRAME_OPTIONS,
  TRIGGER_OPTIONS,
} from "@/constants/habits";
import { cn } from "@/lib/utils";
import { useSuggest } from "@/hooks/use-suggest";
import { motion } from "@/components/motion/motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

/** A tactile, visual onboarding form — pickable cards and chips over dropdowns. */
export function OnboardingForm({ onSubmit, isLoading }: OnboardingFormProps) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<HabitInput>({
    resolver: zodResolver(habitInputSchema),
    defaultValues: DEFAULT_VALUES as HabitInput,
  });

  const goalType = watch("goalType");
  const habitName = watch("habitName");

  const { status: suggestStatus, suggestion, error: suggestError, suggest } =
    useSuggest();

  // When the AI returns suggestions, prefill every field except the habit name.
  useEffect(() => {
    if (!suggestion) return;
    const opts = { shouldValidate: true, shouldDirty: true } as const;
    setValue("category", suggestion.category, opts);
    setValue("goalType", suggestion.goalType, opts);
    setValue("currentAmount", suggestion.currentAmount, opts);
    setValue("targetAmount", suggestion.targetAmount, opts);
    setValue("motivation", suggestion.motivation, opts);
    setValue("triggers", suggestion.triggers, opts);
    setValue("timeframeDays", suggestion.timeframeDays, opts);
  }, [suggestion, setValue]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-7"
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
          className="h-11 text-base"
          {...register("habitName")}
        />
      </Field>

      {/* Flashy AI autofill CTA */}
      <motion.button
        type="button"
        whileTap={{ scale: 0.98 }}
        disabled={!habitName?.trim() || suggestStatus === "loading"}
        onClick={() => suggest(habitName)}
        className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-primary to-emerald-500 px-4 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-shadow hover:shadow-primary/40 disabled:opacity-50 disabled:shadow-none"
      >
        {suggestStatus === "loading" ? (
          <Loader2 className="size-4 animate-spin" aria-hidden />
        ) : (
          <Wand2 className="size-4 transition-transform group-hover:rotate-12" aria-hidden />
        )}
        Autofill the rest with AI
      </motion.button>
      {suggestStatus === "error" && (
        <p className="-mt-4 text-sm text-destructive" role="alert">
          {suggestError ?? "Couldn't generate suggestions. Try again."}
        </p>
      )}

      {/* Category — visual card grid */}
      <Controller
        control={control}
        name="category"
        render={({ field }) => (
          <Field
            label="Category"
            htmlFor="category"
            error={errors.category?.message}
          >
            <div id="category" className="grid grid-cols-3 gap-2">
              {HABIT_CATEGORIES.map((c) => {
                const selected = field.value === c.value;
                return (
                  <motion.button
                    key={c.value}
                    type="button"
                    whileTap={{ scale: 0.95 }}
                    aria-pressed={selected}
                    onClick={() => field.onChange(c.value)}
                    className={cn(
                      "flex flex-col items-center gap-1 rounded-xl border p-3 text-center transition-all",
                      selected
                        ? "border-primary bg-primary/10 shadow-sm ring-1 ring-primary"
                        : "border-border hover:border-primary/40 hover:bg-muted",
                    )}
                  >
                    <span className="text-2xl">{c.emoji}</span>
                    <span className="text-xs font-medium leading-tight">
                      {c.label}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </Field>
        )}
      />

      {/* Goal — segmented toggle */}
      <Controller
        control={control}
        name="goalType"
        render={({ field }) => (
          <Field label="Your goal" htmlFor="goalType" error={errors.goalType?.message}>
            <div id="goalType" className="grid grid-cols-2 gap-2">
              {[
                { value: "reduce", label: "Cut down", icon: TrendingDown },
                { value: "quit", label: "Quit completely", icon: Ban },
              ].map((g) => {
                const selected = field.value === g.value;
                return (
                  <motion.button
                    key={g.value}
                    type="button"
                    whileTap={{ scale: 0.97 }}
                    aria-pressed={selected}
                    onClick={() => field.onChange(g.value)}
                    className={cn(
                      "flex items-center justify-center gap-2 rounded-xl border px-3 py-3 text-sm font-medium transition-all",
                      selected
                        ? "border-primary bg-primary text-primary-foreground shadow-sm"
                        : "border-border hover:border-primary/40 hover:bg-muted",
                    )}
                  >
                    <g.icon className="size-4" aria-hidden />
                    {g.label}
                  </motion.button>
                );
              })}
            </div>
          </Field>
        )}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="How much now?"
          htmlFor="currentAmount"
          hint="e.g. 4 hours/day"
          error={errors.currentAmount?.message}
        >
          <div className="relative">
            <Gauge className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <Input
              id="currentAmount"
              placeholder="4 hours/day"
              className="h-11 pl-9"
              {...register("currentAmount")}
            />
          </div>
        </Field>

        {goalType === "reduce" ? (
          <Field
            label="Your target"
            htmlFor="targetAmount"
            hint="e.g. under 1 hour/day"
            error={errors.targetAmount?.message}
          >
            <div className="relative">
              <Target className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
              <Input
                id="targetAmount"
                placeholder="under 1 hour/day"
                className="h-11 pl-9"
                {...register("targetAmount")}
              />
            </div>
          </Field>
        ) : (
          <div className="hidden sm:block" aria-hidden />
        )}
      </div>

      {/* Timeframe — chips */}
      <Controller
        control={control}
        name="timeframeDays"
        render={({ field }) => (
          <Field
            label="Timeframe"
            htmlFor="timeframeDays"
            error={errors.timeframeDays?.message}
          >
            <div id="timeframeDays" className="flex flex-wrap gap-2">
              {TIMEFRAME_OPTIONS.map((t) => {
                const selected = field.value === t.value;
                return (
                  <motion.button
                    key={t.value}
                    type="button"
                    whileTap={{ scale: 0.95 }}
                    aria-pressed={selected}
                    onClick={() => field.onChange(t.value)}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm transition-all",
                      selected
                        ? "border-primary bg-primary text-primary-foreground shadow-sm"
                        : "border-border hover:border-primary/40 hover:bg-muted",
                    )}
                  >
                    <Clock className="size-3.5" aria-hidden />
                    {t.label}
                  </motion.button>
                );
              })}
            </div>
          </Field>
        )}
      />

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

      {/* Triggers — chips */}
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
                  <motion.button
                    key={t.value}
                    type="button"
                    whileTap={{ scale: 0.95 }}
                    aria-pressed={selected}
                    onClick={() =>
                      field.onChange(
                        selected
                          ? field.value.filter((v: string) => v !== t.value)
                          : [...(field.value ?? []), t.value],
                      )
                    }
                    className={cn(
                      "rounded-full border px-3.5 py-1.5 text-sm transition-all",
                      selected
                        ? "border-primary bg-primary text-primary-foreground shadow-sm"
                        : "border-border bg-background hover:border-primary/40 hover:bg-muted",
                    )}
                  >
                    {t.label}
                  </motion.button>
                );
              })}
            </div>
          </Field>
        )}
      />

      <motion.div whileTap={{ scale: 0.99 }}>
        <Button
          type="submit"
          size="lg"
          disabled={isLoading}
          className="h-12 w-full bg-gradient-to-r from-primary to-emerald-500 text-base font-semibold shadow-lg shadow-primary/20 transition-shadow hover:shadow-primary/40"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin" aria-hidden />
              Building your plan…
            </>
          ) : (
            <>
              <Heart aria-hidden />
              Build my recovery plan
            </>
          )}
        </Button>
      </motion.div>
    </form>
  );
}
