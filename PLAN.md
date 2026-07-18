# Build Plan — Rewire

Hackathon build. **Three submissions allowed; the final one counts.** We ship a
working, deployable app at each stage and layer depth as time allows.

## Submission 1 — SHIPPED ✅ (local-first, no auth)

Live: https://rewire-habit-coach.vercel.app

- [x] Clone Next.js 15 + TS + Tailwind + shadcn base from the warmup, strip cooking code
- [x] Calm-green design system (`app/globals.css`), light + dark
- [x] Zod contracts in `types/` — `habitInputSchema`, `recoveryPlanSchema`, `sosInputSchema`/`sosResponseSchema`, tracking
- [x] `services/ai` — real LLM via `generateObject`: recovery plan + Craving SOS
- [x] Thin API routes `/api/plan`, `/api/sos` with shared validate→delegate→respond helper
- [x] Onboarding form (RHF + Zod), full lifecycle (loading/success/error/retry/timeout)
- [x] Dashboard: daily nudge, streak + check-in tracking (localStorage), plan view, Craving SOS overlay
- [x] typecheck + build pass; endpoints verified against the real LLM locally and in prod
- [x] Deployed to Vercel with server-only `OPENAI_API_KEY`

## Submission 2 — persistence + adaptive coaching (Supabase)

Goal: make it truly longitudinal and add the adaptive coach.

- [ ] Supabase schema + RLS: `profiles`, `habits`, `check_ins`, `plans` (own a fresh project — do NOT reuse the shared one)
- [ ] `services/db/` — server-only, RLS-scoped queries; migrate local journey → DB on first sign-in
- [ ] Auth (Supabase, email magic-link) with `@supabase/ssr` + middleware
- [ ] **Adaptive coach chat** — streaming (`streamText`), grounded in the user's real check-in history
- [ ] **Pattern-aware nudges** — regenerate the daily nudge from recent check-ins ("you tend to slip on evenings")
- [ ] Progress insights: trend of wins/slips over time

## Submission 3 — polish + depth (the tiebreakers)

- [ ] **Weekly reflection** — AI summarizes the week's data + sets one focused goal
- [ ] Relapse-recovery flow: a slip triggers a supportive AI reframe + get-back-on-track step
- [ ] Milestone celebration UI tied to streak/day progress
- [ ] Unit tests for pure logic (`lib/streak.ts`, prompt builders)
- [ ] Accessibility pass (focus trap in SOS overlay, keyboard nav, ARIA), reduced-motion
- [ ] Efficiency pass: Server Components where possible, dynamic import the SOS overlay

## Guardrails (all submissions)

- Real LLM only — never mock/hardcode AI output.
- API key stays server-only; `.env.local` git-ignored; `.env.example` current.
- One Zod schema per contract, reused across form + API + AI + UI.
- `pnpm typecheck` + `pnpm build` must pass before any "done".
