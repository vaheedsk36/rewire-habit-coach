import { describe, expect, it } from "vitest";
import { habitInputSchema } from "./habit";
import { checkInSchema } from "./tracking";
import { sosInputSchema } from "./sos";
import { coachRequestSchema } from "./coach";

const validHabit = {
  habitName: "Instagram scrolling",
  category: "social_media",
  goalType: "reduce",
  currentAmount: "4 hours/day",
  targetAmount: "under 1 hour/day",
  motivation: "I want to be present with my family.",
  triggers: ["boredom", "evenings"],
  timeframeDays: 30,
};

describe("habitInputSchema", () => {
  it("accepts valid onboarding input", () => {
    expect(habitInputSchema.safeParse(validHabit).success).toBe(true);
  });

  it("rejects an empty habit name", () => {
    const r = habitInputSchema.safeParse({ ...validHabit, habitName: "" });
    expect(r.success).toBe(false);
  });

  it("rejects an unknown category", () => {
    const r = habitInputSchema.safeParse({ ...validHabit, category: "nope" });
    expect(r.success).toBe(false);
  });

  it("requires at least one trigger", () => {
    const r = habitInputSchema.safeParse({ ...validHabit, triggers: [] });
    expect(r.success).toBe(false);
  });

  it("rejects an out-of-range timeframe", () => {
    expect(habitInputSchema.safeParse({ ...validHabit, timeframeDays: 3 }).success).toBe(false);
    expect(habitInputSchema.safeParse({ ...validHabit, timeframeDays: 365 }).success).toBe(false);
  });

  it("rejects a too-short motivation", () => {
    const r = habitInputSchema.safeParse({ ...validHabit, motivation: "x" });
    expect(r.success).toBe(false);
  });
});

describe("checkInSchema", () => {
  it("accepts a valid win", () => {
    expect(checkInSchema.safeParse({ date: "2026-07-18", status: "win" }).success).toBe(true);
  });

  it("rejects a malformed date", () => {
    expect(checkInSchema.safeParse({ date: "18-07-2026", status: "win" }).success).toBe(false);
  });

  it("rejects an invalid status", () => {
    expect(checkInSchema.safeParse({ date: "2026-07-18", status: "meh" }).success).toBe(false);
  });

  it("rejects mood outside 1-5", () => {
    expect(checkInSchema.safeParse({ date: "2026-07-18", status: "win", mood: 9 }).success).toBe(false);
  });
});

describe("sosInputSchema", () => {
  it("accepts a valid urge report", () => {
    const r = sosInputSchema.safeParse({
      habitName: "vaping",
      category: "vaping",
      motivation: "protect my lungs",
      intensity: 4,
    });
    expect(r.success).toBe(true);
  });

  it("rejects intensity outside 1-5", () => {
    const r = sosInputSchema.safeParse({
      habitName: "vaping",
      category: "vaping",
      motivation: "protect my lungs",
      intensity: 7,
    });
    expect(r.success).toBe(false);
  });
});

describe("coachRequestSchema", () => {
  it("defaults history to an empty array", () => {
    const r = coachRequestSchema.safeParse({ message: "How am I doing?" });
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.history).toEqual([]);
  });

  it("rejects an empty message", () => {
    expect(coachRequestSchema.safeParse({ message: "" }).success).toBe(false);
  });

  it("rejects a message over the max length", () => {
    expect(coachRequestSchema.safeParse({ message: "x".repeat(2001) }).success).toBe(false);
  });
});
