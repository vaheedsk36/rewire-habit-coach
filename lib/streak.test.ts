import { describe, expect, it } from "vitest";
import type { CheckIn } from "@/types";
import { currentStreak, daysSince, todayISO, totalWins } from "./streak";

const ci = (date: string, status: CheckIn["status"]): CheckIn => ({ date, status });

describe("currentStreak", () => {
  it("is 0 with no check-ins", () => {
    expect(currentStreak([], "2026-07-18")).toBe(0);
  });

  it("counts consecutive wins ending today", () => {
    const checkIns = [
      ci("2026-07-16", "win"),
      ci("2026-07-17", "win"),
      ci("2026-07-18", "win"),
    ];
    expect(currentStreak(checkIns, "2026-07-18")).toBe(3);
  });

  it("breaks the streak on a slip", () => {
    const checkIns = [
      ci("2026-07-16", "win"),
      ci("2026-07-17", "slip"),
      ci("2026-07-18", "win"),
    ];
    expect(currentStreak(checkIns, "2026-07-18")).toBe(1);
  });

  it("keeps yesterday's streak when today isn't logged yet", () => {
    const checkIns = [ci("2026-07-16", "win"), ci("2026-07-17", "win")];
    // today (18th) not logged — streak should still reflect the 16th+17th
    expect(currentStreak(checkIns, "2026-07-18")).toBe(2);
  });

  it("is 0 when the most recent relevant day is a slip", () => {
    const checkIns = [ci("2026-07-17", "slip")];
    expect(currentStreak(checkIns, "2026-07-18")).toBe(0);
  });

  it("ignores gaps (non-consecutive days break the streak)", () => {
    const checkIns = [ci("2026-07-14", "win"), ci("2026-07-18", "win")];
    expect(currentStreak(checkIns, "2026-07-18")).toBe(1);
  });
});

describe("totalWins", () => {
  it("counts only wins", () => {
    const checkIns = [
      ci("2026-07-16", "win"),
      ci("2026-07-17", "slip"),
      ci("2026-07-18", "win"),
    ];
    expect(totalWins(checkIns)).toBe(2);
  });
});

describe("daysSince", () => {
  it("is 1 on the start day (inclusive)", () => {
    expect(daysSince("2026-07-18T09:00:00Z", "2026-07-18")).toBe(1);
  });

  it("counts whole days elapsed inclusively", () => {
    expect(daysSince("2026-07-10T00:00:00Z", "2026-07-18")).toBe(9);
  });

  it("never returns less than 1", () => {
    expect(daysSince("2026-07-20T00:00:00Z", "2026-07-18")).toBeGreaterThanOrEqual(1);
  });
});

describe("todayISO", () => {
  it("returns a YYYY-MM-DD string", () => {
    expect(todayISO()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
