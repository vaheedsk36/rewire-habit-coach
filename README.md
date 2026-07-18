# 🧠 Rewire — AI Habit & Addiction Recovery Coach

**Rewire** is a GenAI web app that helps people reduce or overcome harmful habits — excessive screen time, doomscrolling, smoking, vaping, junk food, and other addictions. It pairs longitudinal tracking with a Generative-AI core that delivers **intelligent nudges, personalized tracking, adaptive coaching, and in-the-moment support** to drive *sustained* behavior change — not a one-off tip.

> Built for the PromptWars Main Challenge: **Breaking Bad Habits & Addiction**.
> See `CLAUDE.md` for build conventions, `PLAN.md` for the build order.

---

## The problem

Breaking a habit isn't an information problem — everyone knows screen time is too high. It's a *behavior-change* problem: it requires the right message at the right moment, tracking that reflects real progress, coaching that remembers your history, and support the instant a craving hits. Generic advice and static habit trackers fail because they don't adapt to *you*.

## How Rewire uses Generative AI (the core, not a bolt-on)

Every intelligent output is produced by a **real LLM** through the Vercel AI SDK's `generateObject` with Zod schemas, so the UI always receives valid, fully-typed structured data — no text parsing, no mock responses.

- **Personalized recovery plan** — from your habit, motivation, baseline, and triggers, the AI generates a staged quit-or-reduce plan: milestones, coping strategies, and replacement behaviors tailored to *your* habit.
- **Intelligent nudges** — the AI reads your check-in history and surfaces contextual nudges ("you tend to slip on Friday evenings — here's a plan for tonight") instead of generic reminders.
- **Craving SOS** — one tap during an urge returns an instant, structured coping response: grounding steps, a distraction, and a reframe of *why you started*.
- **Adaptive coach (chat)** — a streaming AI coach grounded in your real tracking data — it knows your streak, your triggers, and your last slip, and coaches accordingly.
- **Weekly reflection** — the AI analyzes the week's data and produces an honest, encouraging summary with one focused goal for the week ahead.

## Features

- **Habit-agnostic onboarding** — define any habit (with excessive screen time as the flagship example): whether to *quit* or *reduce*, your target, your baseline, your "why", and your known triggers.
- **Daily check-ins** — log status (win / slip / relapse), screen-time minutes or count, mood, trigger, and a note. Fast, low-friction, one screen.
- **Streaks & trends** — real streak tracking, relapse-aware, with progress trends over time (not just a naive counter).
- **Relapse recovery, not shame** — a slip triggers a supportive AI reframe and a get-back-on-track step, because shame drives relapse.
- **Milestones** — celebrate meaningful progress markers the plan defines.
- **Consumer-grade UX** — "ChatGPT meets Notion": cards, progress indicators, skeleton loaders, empty states, and a full request lifecycle (loading, success, failure, retry, timeout).

## Tech stack

- **Next.js 15** (App Router) + **TypeScript** (strict)
- **TailwindCSS** + **shadcn/ui**
- **React Hook Form** + **Zod** — one schema validates the form *and* the AI output
- **Vercel AI SDK** — `generateObject` for structured outputs + streaming for the coach chat, backed by a **real LLM**
- **Supabase** — Postgres + Auth + Row-Level Security for per-user data
- Deployed on **Vercel**

## Architecture

Typed, one-directional flow. Zod schemas in `types/` are the single source of truth — the same schema validates the form input, the API boundary, and the AI's structured output. RLS guarantees a user can only ever read or write their own rows.

```
Auth (Supabase)
  → Form (RHF + Zod)
    → POST /api/*  (Route Handler re-validates with the SAME Zod schema)
      → services/ai   (build prompt, generateObject with Zod OUTPUT schema)   ← real LLM
      → services/db   (Supabase, RLS-scoped to the signed-in user)
        → validated, typed data
          → rendered in Server/Client components
```

```
app/            Routes, layouts, API route handlers (thin)
components/      Feature UI          components/ui/  shadcn primitives
hooks/          Client hooks        lib/  utils/    Helpers & pure logic
services/ai/    LLM client, prompt builders, structured generation
services/db/    Supabase client & queries (server-only, RLS-scoped)
types/          Zod schemas + inferred types (single source of truth)
constants/      Habit types, trigger options, config
```

Full conventions and rationale live in `CLAUDE.md`.

## Data model (Supabase)

Per-user, protected by Row-Level Security:

- **`profiles`** — one row per user.
- **`habits`** — the habit(s) being changed: type, quit-or-reduce, target, baseline, motivation, triggers, start date.
- **`check_ins`** — daily logs: date, status (win/slip/relapse), amount (e.g. screen-time minutes), mood, trigger, note.
- **`plans`** — the AI-generated recovery plan: milestones, coping strategies, replacement behaviors.

Streaks, trends, and milestone progress are derived from `check_ins` — never stored redundantly.

## Getting started

### Prerequisites

- Node.js 18.18+ (or 20+)
- pnpm
- A Supabase project (URL + keys)
- An API key for the LLM provider

### Setup

```bash
pnpm install
cp .env.example .env.local   # then fill in your keys
pnpm dev                     # http://localhost:3000
```

### Scripts

```bash
pnpm dev         # start dev server
pnpm build       # production build
pnpm start       # run the production build
pnpm lint        # lint
pnpm typecheck   # tsc --noEmit
```

## Environment variables

Copy `.env.example` to `.env.local` and set:

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Supabase project URL (public). |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Supabase anon/publishable key (public, RLS-protected). |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Service-role key. **Server-only** — never exposed to the client. |
| `OPENAI_API_KEY` | ✅ | LLM API key. **Server-only** — used exclusively inside `services/ai`. |
| `OPENAI_MODEL` | optional | Model id override. |

> The LLM and service-role keys are used exclusively on the server. They are never sent to the browser and never committed — `.env.local` is git-ignored.

## Security

- **Every input is validated** on both client and server with the same Zod schema.
- **Row-Level Security** on all tables — a user can only access their own habits and check-ins.
- Secrets are **server-only**; the browser only ever sees the RLS-protected anon key.
- Every API path handles errors explicitly — loading, success, failure, retry, and timeout.

## Deployment (Vercel)

1. Push the repo to GitHub.
2. Import the project in Vercel.
3. Add the environment variables from the table above in **Project → Settings → Environment Variables**.
4. Deploy. The App Router build is Vercel-ready out of the box.

## Notes

- **No mock data.** Every plan, nudge, SOS response, and reflection is generated by a real LLM request — there are no hardcoded or placeholder AI responses anywhere in the app.
- **Structured output is enforced by Zod**, so the UI always receives valid, fully-typed data.
- **Supportive by design.** Rewire reframes slips instead of shaming them, because shame drives relapse — the coaching tone is a product decision, not an accident.
