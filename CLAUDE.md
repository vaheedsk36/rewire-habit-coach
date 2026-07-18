# CLAUDE.md

Operating manual for Claude Code on the **PromptWars Main Challenge — Breaking Bad Habits & Addiction**.
Full brief is the challenge image/statement; `README.md` is the product description, `PLAN.md` the build order.
This file is how we build and what we optimize for.

> Portable note: the workflow, conventions, and guardrails below transfer to any project.
> Sections 2 (Stack), 3 (Architecture), and 4 (Eval Priorities) are tuned to this challenge — swap them per project.

---

## 1. Project

- **Name:** Rewire — AI Habit & Addiction Recovery Coach
- **What it does:** Users define a harmful habit (excessive screen time, doomscrolling, smoking, vaping, junk food, etc.) → a real LLM builds a personalized recovery plan, intelligent nudges, coping strategies, and in-the-moment Craving SOS support → progress is tracked over time to drive *sustained* behavior change.
- **Challenge fit:** GenAI is the CORE — nudges, personalized tracking, adaptive coaching, and support mechanisms are all LLM-driven, not bolted on.
- **Status:** Hackathon — 3 submissions allowed, final one counts. Ship a working deployable app at every stage (see `PLAN.md`). Must feel like a polished consumer product.
- **North star:** Score on the eval rubric (see §4). Quality over feature count.

---

## 2. Stack

- **Framework:** Next.js 15 (App Router) + TypeScript (strict)
- **UI:** TailwindCSS + shadcn/ui (base-ui primitives), calm-green design system in `app/globals.css`
- **Forms:** React Hook Form + Zod (single source of truth for validation)
- **Backend:** Next.js Route Handlers; Server Components wherever possible
- **AI:** A **real LLM API** — never mock, never hardcode, never placeholder data
- **AI integration:** Vercel AI SDK (`ai`) with `generateObject` + Zod schemas → guaranteed structured JSON (no text parsing); `streamText` for the coach chat (submission 2)
- **Persistence:** Submission 1 is local-first (localStorage). Submission 2+ adds **Supabase** (Postgres + Auth + RLS) for longitudinal, cross-device history — own a fresh Supabase project; do NOT reuse the shared one already linked to the MCP.
- **Deploy:** Vercel (live at rewire-habit-coach.vercel.app)

---

## 3. Architecture

```
app/                Routes, layouts, pages (thin). Server Components by default.
  api/plan/route.ts   Route Handler: validate → generatePlan → typed JSON
  api/sos/route.ts    Route Handler: validate → generateSos → typed JSON
components/          Composed feature UI (onboarding, dashboard, plan, tracker, sos)
components/ui/       shadcn/base-ui primitives only
components/shared/   Cross-feature UI (Field, StatusPanel)
hooks/              Client hooks (useJourney, usePlanGeneration, useSos)
lib/                Framework-agnostic helpers (streak calc, api-response, utils)
services/           External-world logic. services/ai/ = LLM client, prompt builders, generation + error normalisation
types/              Shared TS types + Zod schemas (input AND output schemas)
constants/          Form options (habit categories, triggers, timeframes)
```

**Data flow (one direction, typed end to end):**

```
Onboarding form (RHF + Zod input schema)
  → POST /api/plan  (Route Handler re-validates with the SAME Zod schema)
    → services/ai   (build prompt, generateObject with Zod OUTPUT schema)   ← real LLM
      → validated RecoveryPlan
        → persisted (localStorage now, Supabase later) → rendered in components
Craving SOS button → POST /api/sos → services/ai → validated SosResponse → overlay
```

**Rules that protect Code Quality (the highest-weight score):**
- Zod schemas in `types/` are the contract. The AI response, the API return type, and the UI props all derive from them (`z.infer`) — one definition, no drift.
- UI never calls the LLM directly. Components → hook → route → `services/ai`.
- No duplicated logic. Shared helpers live in `lib/`; error normalisation in `services/ai/errors.ts`; route boilerplate in `lib/api-response.ts`.
- Route Handlers stay thin: validate → delegate to a service → return. No business logic in routes or components.
- Prompts live in one place (`services/ai/prompt.ts`), typed and composable — never inlined at the call site.
- Field-level output rules live in the schema's `.describe()` calls, not duplicated in the prompt.

---

## 4. Evaluation Priorities (optimize every decision for this)

Final score = sum of all 6 parameters; **none is ignored**. Ranked by weight:

**🟢 High Impact — win these first:**
- **Code Quality** — clean architecture, reusable/modular components, strong typing, zero duplicated logic, proper folder structure, readable. This is the single biggest lever.
- **Problem Statement Alignment** — every feature must directly improve the cooking assistant. Ruthlessly avoid feature creep. All 6 outputs (breakfast/lunch/dinner, grocery, substitutions, budget) must be present and correct.

**🟡 Medium Impact — don't leak points:**
- **Security** — validate ALL inputs (client + server), secure API routes, never expose the API key (server-only env), proper error handling on every path.
- **Efficiency** — Server Components by default, dynamic imports where useful, optimized rendering & bundle size, image optimization.

**⚪ Low Impact — the tiebreakers when scores are close:**
- **Testing** — structure code to be testable (pure functions, injected deps, isolated services). Don't leave these points on the table.
- **Accessibility** — semantic HTML, keyboard support, ARIA labels, mobile responsive.

When trading off, protect High over Medium over Low — but never drop a Low entirely; close races are decided there.

---

## 5. Product requirements (must all ship)

**Input (Step 1):** number of people, dietary preference, allergies, cooking time, budget, available ingredients, skill level, preferred cuisine.

**Output (structured JSON only):**
- **Meals** — breakfast, lunch, dinner; each with recipe name, ingredients, cooking time, calorie estimate, prep steps.
- **Grocery list** — grouped by category: Vegetables, Fruits, Dairy, Protein, Spices, Pantry.
- **Substitutions** — for unavailable ingredients, allergies, vegetarian, vegan.
- **Budget** — estimated grocery cost, fits-budget verdict, cheaper alternatives if over.

**UX — "ChatGPT meets Notion":** cards, progress indicator, smooth transitions, loading + skeleton states, empty states, polished typography. Don't overuse animations.

**Error handling — every request covers:** loading, success, failure, retry, timeout.

**Deliverables:** README, env-var docs (`.env.example`), production-ready responsive & accessible UI, Vercel-ready.

---

## 6. Commands

Fill in once the app is scaffolded; prefer these over guessing.

```bash
‹pnpm dev›          # run locally
‹pnpm build›        # production build — MUST pass before "done"
‹pnpm lint›         # lint
‹pnpm typecheck›    # tsc --noEmit — MUST pass
```

---

## 7. Development Workflow

Before writing code:

1. Understand the feature completely.
2. Break it into tasks.
3. Identify reusable components.
4. Think about performance.
5. Think about accessibility.
6. Think about edge cases.
7. Then implement.

When implementing:

- Never rush.
- Prefer refactoring over duplication.
- Explain the implementation plan; wait for approval before major architectural decisions.
- Explain tradeoffs when multiple approaches exist; suggest better architecture when you see it.
- Match existing patterns, naming, and style; read before editing.
- Work in small, verifiable steps. Report honestly — if build/typecheck fails or a step was skipped, say so with the output.

After every completed feature, run through this checklist mentally:

- Type-safe · Responsive · Accessible · Production ready
- No TODOs · No placeholders · No mock/hardcoded AI data
- Error handled · Loading handled · Empty state handled
- `typecheck` + `build` pass · Works on Vercel

Only then consider the feature complete.

---

## 8. Conventions

- **TypeScript strict.** No `any` — use `unknown` + narrowing. Derive types from Zod schemas (`z.infer`).
- **Server-first.** Default to Server Components; add `"use client"` only for state/effects/browser APIs (the form, interactive results).
- **Errors:** fail loud in dev, handle gracefully in UI. No swallowed catches.
- **Naming:** components `PascalCase`, functions/vars `camelCase`, files `kebab-case`, constants `UPPER_SNAKE`.
- **Comments** explain *why*, not *what*. Match surrounding density.

---

## 9. Guardrails

- **Never** ship fake/hardcoded/mock/placeholder AI data — every plan comes from a real LLM request. This is a hard fail condition.
- **Never** expose the LLM API key — server-only env var, keep `.env.example` current, never commit `.env.local`.
- Don't commit or push unless asked. If on the default branch, branch first.
- Don't add dependencies for trivial things; check what's already installed.
- Prefer editing existing files over creating new ones; don't scatter one-off scripts.
