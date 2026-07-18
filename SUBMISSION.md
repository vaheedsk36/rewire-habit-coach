# Submission Details — copy-paste into the PromptWars form

> Keep this file current on EVERY change/redeploy. Each free-text field must stay
> ≤ 1024 characters (the form's limit). Update the "Last updated" date each time.

**Last updated:** 2026-07-18 · **Submission:** 3 of 3 (final)

### Test credentials (for evaluators)
Email: `demo@rewire.app` · Password: `RewireDemo2026!`
(Or click **"Use demo account"** on the login screen — one tap, no typing.)

---

### Challenge
Main Challenge

### Public GitHub Repository Link
https://github.com/vaheedsk36/rewire-habit-coach

### Deployed Link
https://rewire-habit-coach.vercel.app

---

### Describe the changes/updates made in the deployed version
Submission 3 (final). Full GenAI habit-recovery app with accounts, cloud persistence, and an adaptive AI coach — plus this round's quality hardening.

New in this version:
- Automated test suite (Vitest, 34 tests) covering streak logic, prompt builders, Zod validation, and error mapping.
- Efficiency: heavy client widgets (Craving SOS, coach chat) are code-split and lazy-loaded to shrink the initial bundle.
- Code-quality cleanup: removed dead code, tightened types.

Core features (all real LLM, DB-backed, secured with row-level security):
- Email/password accounts with a one-click "Use demo account" button.
- AI recovery plan: milestones, trigger-specific coping strategies, replacement behaviors, daily nudge, affirmation.
- Adaptive coach chat grounded in your real check-in history (streak, wins/slips, triggers).
- Craving SOS for in-the-moment urges; streak tracking + daily check-ins.

Validated end-to-end in production. All inputs validated client + server. Deployed on Vercel.

### Mention the Gen AI services utilized in the submission, and where did you utilize it?
Gen AI service: OpenAI (gpt-4o-mini) via the Vercel AI SDK (`ai` + `@ai-sdk/openai`). Structured features use `generateObject` with Zod schemas (guaranteed JSON, no parsing); the coach uses `streamText` for a live token stream.

Where it's used (all server-side, in services/ai):
1. Recovery plan — POST /api/habit → generatePlan(): builds a personalized plan (milestones, trigger-specific coping strategies, replacement behaviors, daily nudge, affirmation).
2. Craving SOS — POST /api/sos → generateSos(): real-time coping steps, a distraction, a reframe, and expected duration during an urge.
3. Adaptive coach — POST /api/coach → streamCoachReply(): a streaming chat grounded in the user's real check-in history (streak, wins/slips, triggers), loaded from the DB under RLS.

The API key is server-only; output shape is enforced by Zod schemas in types/.
