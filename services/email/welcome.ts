import type { RecoveryPlan } from "@/types/plan";
import { APP_URL, FROM, getResend } from "./client";

/**
 * Escapes a string for safe interpolation into HTML. `habitName` (and, defensively,
 * every other interpolated value) originates outside our control, so we neutralise
 * the five significant characters to prevent any markup injection into the email.
 */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Sends the warm "your recovery plan is ready" email after a user creates a habit.
 *
 * This is a fire-and-forget notification: it MUST NOT throw or reject, because a
 * failed email should never break the habit-creation flow. Every failure path
 * returns `{ ok: false }` and nothing sensitive is logged.
 */
export async function sendPlanReadyEmail(params: {
  to: string;
  habitName: string;
  plan: RecoveryPlan;
}): Promise<{ ok: boolean }> {
  try {
    const { to, habitName, plan } = params;

    const safeHabit = escapeHtml(habitName);
    const safeFirstStep = escapeHtml(plan.firstStep);
    const milestones = plan.milestones.slice(0, 3);

    const milestonesHtml = milestones
      .map((m) => {
        const title = escapeHtml(m.title);
        return `
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0;">
              <span style="display: inline-block; min-width: 64px; font-size: 13px; font-weight: 600; color: #16a34a;">Day ${m.day}</span>
              <span style="font-size: 15px; color: #111827;">${title}</span>
            </td>
          </tr>`;
      })
      .join("");

    const html = `<!doctype html>
<html lang="en">
  <body style="margin: 0; padding: 0; background-color: #f6f7f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f6f7f9; padding: 24px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 560px; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #eaecef;">
            <tr>
              <td style="background-color: #16a34a; height: 6px; line-height: 6px; font-size: 6px;">&nbsp;</td>
            </tr>
            <tr>
              <td style="padding: 32px 32px 8px 32px;">
                <p style="margin: 0 0 4px 0; font-size: 13px; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; color: #16a34a;">Rewire</p>
                <h1 style="margin: 0 0 16px 0; font-size: 22px; line-height: 1.3; color: #111827;">Your recovery plan is ready 🌱</h1>
                <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #374151;">
                  Hi there — great news. Your personalized Rewire plan for <strong style="color: #111827;">${safeHabit}</strong> is ready and waiting for you. You took the first step just by showing up, and we're right here with you.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding: 0 32px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px;">
                  <tr>
                    <td style="padding: 16px 20px;">
                      <p style="margin: 0 0 4px 0; font-size: 12px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; color: #16a34a;">Your first step</p>
                      <p style="margin: 0; font-size: 16px; line-height: 1.5; color: #14532d;">${safeFirstStep}</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding: 24px 32px 8px 32px;">
                <p style="margin: 0 0 8px 0; font-size: 13px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; color: #6b7280;">First milestones</p>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  ${milestonesHtml}
                </table>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding: 28px 32px 32px 32px;">
                <a href="${APP_URL}/app" style="display: inline-block; background-color: #16a34a; color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; padding: 14px 32px; border-radius: 8px;">View my plan</a>
                <p style="margin: 20px 0 0 0; font-size: 13px; line-height: 1.5; color: #9ca3af;">You've got this. One small step at a time.</p>
              </td>
            </tr>
          </table>
          <p style="max-width: 560px; margin: 16px auto 0 auto; font-size: 12px; line-height: 1.5; color: #9ca3af; text-align: center;">
            You're receiving this because you started a habit journey on Rewire.
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>`;

    const textMilestones = milestones
      .map((m) => `  Day ${m.day} — ${m.title}`)
      .join("\n");

    const text = `Your Rewire plan for "${habitName}" is ready.

Hi there — your personalized plan is ready and waiting.

Your first step:
${plan.firstStep}

First milestones:
${textMilestones}

View your full plan: ${APP_URL}/app

You've got this. One small step at a time.
— Rewire`;

    const resend = getResend();
    const { error } = await resend.emails.send({
      from: FROM,
      to,
      subject: `Your Rewire plan for ${habitName} is ready 🌱`,
      html,
      text,
    });

    if (error) return { ok: false };
    return { ok: true };
  } catch {
    // Never throw: a failed notification must not break habit creation.
    return { ok: false };
  }
}
