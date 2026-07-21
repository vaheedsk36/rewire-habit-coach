/** Barrel for the app's type contracts. Import shapes from `@/types`. */
export * from "./habit";
export * from "./plan";
export * from "./sos";
export * from "./tracking";
export * from "./coach";

import type { RecoveryPlan } from "./plan";
import type { SosResponse } from "./sos";

/** Typed error codes shared across API routes and the client. */
export type ErrorCode =
  | "invalid_input"
  | "unauthorized"
  | "ai_failed"
  | "timeout"
  | "unknown";

export interface ApiError {
  code: ErrorCode;
  message: string;
}

/** Discriminated result returned by services and API routes. */
export type Result<T> =
  | { ok: true; data: T }
  | { ok: false; error: ApiError };

export type PlanResult = Result<RecoveryPlan>;
export type SosResult = Result<SosResponse>;
export type HabitResult = Result<{ habitId: string }>;
