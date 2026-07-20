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

## Submission 2 — SHIPPED ✅ (persistence + auth + adaptive coach)

Live: https://rewire-habit-coach.vercel.app · Demo: `demo@rewire.app` / `RewireDemo2026!`

- [x] Supabase schema + RLS: `rewire_habits`, `rewire_check_ins` (namespaced in the shared project; plan stored as JSONB; RLS = `TO authenticated` + `auth.uid()=user_id` + `WITH CHECK`)
- [x] `services/db/journey.ts` — server-only, RLS-scoped queries
- [x] Auth (Supabase email/password) with `@supabase/ssr`, session-refresh middleware, login page, seeded demo user
- [x] Data flow migrated off localStorage → auth-gated server component loads journey from DB
- [x] **Adaptive coach chat** — streaming (`streamText`) via `/api/coach`, grounded in the user's real check-in history
- [x] Verified full authenticated flow end-to-end in production (login → plan → check-in → coach → reset)

Deferred to Submission 3: pattern-aware nudge regeneration, cross-device is already covered by accounts.

## Submission 3 — SHIPPED ✅ (quality hardening — target the weak scores)

Prior eval: Testing 0, Efficiency 80 were the gaps (everything else 88–100).

- [x] **Testing 0 → covered** — Vitest suite, 34 tests: `lib/streak`, prompt builders, all Zod schemas, `toAiError`. `pnpm test`.
- [x] **Efficiency** — code-split + lazy-load the heavy client widgets (Craving SOS overlay, coach chat) via `next/dynamic`.
- [x] **Code quality** — removed dead code (unused `JourneyResult`), tightened types.
- [x] Re-verified full authenticated flow in production; redeployed.

Then expanded (same final submission), built with parallel subagents:
- [x] **UI/UX overhaul** — motion animations, ambient gradients, glass, light/dark theme toggle (next-themes), confetti on wins, hover micro-interactions, reduced-motion respected.
- [x] **AI form autofill** — `/api/suggest` prefills onboarding from the habit name.
- [x] **Progress visualization** — check-in heatmap + streak/win-rate + timeframe bar.
- [x] **AI relapse reframe** — `/api/reframe` turns a logged slip into a compassionate recovery moment.
- [x] Re-verified ALL flows (incl. suggest + reframe) end-to-end in production.

Not pursued (roadmap): weekly AI reflection, trigger analytics, reminders/notifications.

## Guardrails (all submissions)

- Real LLM only — never mock/hardcode AI output.
- API key stays server-only; `.env.local` git-ignored; `.env.example` current.
- One Zod schema per contract, reused across form + API + AI + UI.
- `pnpm typecheck` + `pnpm build` must pass before any "done".

---

# Productization roadmap (post-hackathon)

Turning Rewire from a submission into a real product. Positioning: **free personal tool**.

## Phase 1 — Public site + restructure — SHIPPED ✅
- [x] Move the app under `/app`; make `/` (landing) and `/about` public + SEO-indexable
- [x] Middleware gates only `/app/*`; post-login → `/app`, sign-out → `/`
- [x] Marketing chrome (shared header + footer), landing page (hero, problem, 4 pillars, screenshots, FAQ, CTA), about page (mission, AI, values, story)
- [x] SEO metadata + generated OpenGraph image + favicon/brand

## Phase 2 — Product depth (next)
- [ ] **Multiple habits** per user (today: one active) — switch/archive
- [ ] **Weekly AI reflection** over the week's data + one focused goal
- [ ] **Trigger analytics** — which triggers cause slips
- [ ] **Milestone celebrations** tied to streak/day progress
- [ ] **Reminders** (email or web push) + a **Settings/Profile** page

## Phase 3 — Infra & quality
- [ ] Dedicated Supabase project (off the shared one) + migrations in repo + RLS audit
- [ ] Auth hardening (email confirmation via SMTP; Google fully wired end-to-end)
- [ ] CI (lint/typecheck/test/build) + Playwright e2e; error monitoring; rate limiting; analytics
- [ ] Provider-switchable LLM (Gemini/OpenAI) — stashed WIP; needs a standard AI Studio key
- [ ] Accessibility + performance audits

## Phase 4 — Growth
- [ ] Blog/content + SEO, PWA/installable, optional waitlist
