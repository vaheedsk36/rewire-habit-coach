import { describe, expect, it } from "vitest";
import { toAiError } from "./errors";

describe("toAiError", () => {
  it("maps a TimeoutError to code 'timeout'", () => {
    const err = new Error("timed out");
    err.name = "TimeoutError";
    expect(toAiError(err).code).toBe("timeout");
  });

  it("maps an AbortError to code 'timeout'", () => {
    const err = new Error("aborted");
    err.name = "AbortError";
    expect(toAiError(err).code).toBe("timeout");
  });

  it("maps any other error to code 'ai_failed'", () => {
    expect(toAiError(new Error("boom")).code).toBe("ai_failed");
    expect(toAiError("some string").code).toBe("ai_failed");
    expect(toAiError(undefined).code).toBe("ai_failed");
  });

  it("always returns a user-facing message", () => {
    expect(toAiError(new Error("x")).message.length).toBeGreaterThan(0);
  });
});
