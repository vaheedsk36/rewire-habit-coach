/**
 * Admin allow-list. Defaults to the owner; override with the ADMIN_EMAILS env
 * var (comma-separated). Server-only — the DB also enforces admin writes via RLS
 * on the email claim, so this is the app-layer gate, not the only line of defence.
 */
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? "vaheedsk36@gmail.com")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export function isAdmin(email?: string | null): boolean {
  return !!email && ADMIN_EMAILS.includes(email.toLowerCase());
}
