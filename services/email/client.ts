import { Resend } from "resend";

/**
 * Lazily-constructed Resend client. The API key is read at call time (never at
 * module load) so importing this file has no side effects and a missing key only
 * surfaces where email is actually used. Server-only — never import client-side.
 */
let client: Resend | null = null;

export function getResend(): Resend {
  if (client) return client;

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not set. Cannot send email.");
  }

  client = new Resend(apiKey);
  return client;
}

/** The verified sender identity. Falls back to Resend's shared onboarding domain. */
export const FROM = process.env.RESEND_FROM ?? "Rewire <onboarding@resend.dev>";

/** Public app URL, used to build links inside emails. */
export const APP_URL = "https://rewire-habit-coach.vercel.app";
