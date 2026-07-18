import type { ApiError } from "@/types";

/**
 * Normalises any thrown value from an AI SDK call into a typed `ApiError` so
 * callers (the API routes) never deal with raw exceptions. Shared by every
 * generation service to keep error handling consistent.
 */
export function toAiError(error: unknown): ApiError {
  const isTimeout =
    error instanceof Error &&
    (error.name === "TimeoutError" || error.name === "AbortError");

  if (isTimeout) {
    return {
      code: "timeout",
      message: "That took too long. Take a breath and try again.",
    };
  }

  return {
    code: "ai_failed",
    message: "We couldn't reach the coach right now. Please try again in a moment.",
  };
}
