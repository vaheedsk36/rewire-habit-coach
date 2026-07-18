# Submission Details — copy-paste into the PromptWars form

> Keep this file current on EVERY change/redeploy. Each free-text field must stay
> ≤ 1024 characters (the form's limit). Update the "Last updated" date each time.

**Last updated:** 2026-07-18 · **Submission:** 3 of 3 (final)

### Test credentials (for evaluators)
Email: `demo@rewire.app` · Password: `RewireDemo2026!`
(Or click **"Use demo account"** on the login screen — one tap, no typing.)
Google sign-in is also available.

---

### Challenge
Main Challenge

### Public GitHub Repository Link
https://github.com/vaheedsk36/rewire-habit-coach

### Deployed Link
https://rewire-habit-coach.vercel.app

---

### Describe the changes/updates made in the deployed version
Submission 3 (final). A polished, animated GenAI habit-recovery app.

Auth: email/password, one-click demo, and Google sign-in (OAuth).

Highlights:
- Tabbed dashboard (Today / My plan / Progress) — each view fits one screen.
- Premium animated AI-generation experience while your plan is built.
- AI recovery plan: milestone timeline, trigger-matched coping strategies, replacement behaviors, daily nudge.
- Adaptive AI coach chat grounded in your real check-in history.
- Craving SOS, AI relapse reframe on a slip, AI form autofill, streak + heatmap progress.
- Light/dark themes, motion, confetti on wins, fully responsive.
- 34 automated tests; Supabase Postgres + Auth + Row-Level Security; all inputs validated client + server.

Every intelligent output is a real LLM call (no mock data). Validated end-to-end in production. Deployed on Vercel.

### Mention the Gen AI services utilized in the submission, and where did you utilize it?
Gen AI service: OpenAI (gpt-4o-mini) via the Vercel AI SDK (`ai` + `@ai-sdk/openai`). Structured features use `generateObject` + Zod (guaranteed JSON, no parsing); the coach uses `streamText`. No mock data.

Where it's used (all server-side, in services/ai):
1. Recovery plan — /api/habit → generatePlan(): milestones, trigger-specific coping strategies, replacement behaviors, daily nudge, affirmation.
2. Adaptive coach — /api/coach → streamCoachReply(): streaming chat grounded in the user's real check-in history (RLS-scoped).
3. Craving SOS — /api/sos → generateSos(): in-the-moment coping steps, distraction, reframe, duration.
4. Form autofill — /api/suggest → generateSuggestion(): infers onboarding values from the habit name.
5. Relapse reframe — /api/reframe → generateReframe(): compassionate reframe + next step after a slip.

API key is server-only; output shapes enforced by Zod schemas in types/.
