import { describe, expect, it } from "vitest";
import type { HabitInput, JourneyRecord, RecoveryPlan, SosInput } from "@/types";
import {
  buildCoachContext,
  buildPlanPrompt,
  buildSosPrompt,
} from "./prompt";

const habit: HabitInput = {
  habitName: "Instagram scrolling",
  category: "social_media",
  goalType: "reduce",
  currentAmount: "4 hours/day",
  targetAmount: "under 1 hour/day",
  motivation: "be present with my family",
  triggers: ["boredom", "evenings"],
  timeframeDays: 30,
};

describe("buildPlanPrompt", () => {
  it("includes the habit, motivation, timeframe, and trigger labels", () => {
    const p = buildPlanPrompt(habit);
    expect(p).toContain("Instagram scrolling");
    expect(p).toContain("be present with my family");
    expect(p).toContain("30");
    expect(p).toContain("Boredom"); // trigger label, not raw value
    expect(p).toContain("Evenings");
  });

  it("states the target when reducing", () => {
    expect(buildPlanPrompt(habit)).toContain("under 1 hour/day");
  });
});

describe("buildSosPrompt", () => {
  const sos: SosInput = {
    habitName: "vaping",
    category: "vaping",
    motivation: "protect my lungs",
    trigger: "stress",
    intensity: 5,
  };

  it("includes the habit, intensity, and trigger", () => {
    const p = buildSosPrompt(sos);
    expect(p).toContain("vaping");
    expect(p).toContain("5/5");
    expect(p).toContain("stress");
  });
});

describe("buildCoachContext", () => {
  const plan = {} as RecoveryPlan;
  const journey: JourneyRecord = {
    habitId: "h1",
    habit,
    plan,
    startedAt: "2026-07-16T00:00:00Z",
    checkIns: [
      { date: "2026-07-16", status: "win" },
      { date: "2026-07-17", status: "slip", note: "rough day" },
    ],
  };

  it("summarizes streak, wins, slips, and the habit", () => {
    const ctx = buildCoachContext(journey);
    expect(ctx).toContain("Instagram scrolling");
    expect(ctx).toContain("total wins: 1");
    expect(ctx).toContain("total slips: 1");
    expect(ctx).toContain("rough day");
  });
});
