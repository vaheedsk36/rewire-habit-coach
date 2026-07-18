# Submission Details — copy-paste into the PromptWars form

> Keep this file current on EVERY change/redeploy. Each free-text field must stay
> ≤ 1024 characters (the form's limit). Update the "Last updated" date each time.

**Last updated:** 2026-07-18 · **Submission:** 2 of 3

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
Submission 2. Added a real backend (accounts + cloud persistence) and an adaptive AI coach.

New in this version:
- Accounts via Supabase Auth (email/password) with a one-click "Use demo account" button. Test login: demo@rewire.app / RewireDemo2026!
- Cloud persistence: your habit, AI plan, and daily check-ins are stored in Postgres (Supabase) with Row-Level Security, so data is private per user and survives across sessions and devices.
- Adaptive AI coach (chat): a streaming coach grounded in your real check-in history — it references your current streak, wins/slips, and trigger patterns, so its guidance changes as you do.
- Carried over from Submission 1, now DB-backed: personalized recovery plan, streak tracking + check-ins, and the in-the-moment Craving SOS.

Every intelligent output is a real LLM call (no mock data). All inputs are validated on client and server. Deployed on Vercel.

### Mention the Gen AI services utilized in the submission, and where did you utilize it?
Gen AI service: OpenAI (gpt-4o-mini) via the Vercel AI SDK (`ai` + `@ai-sdk/openai`). Structured features use `generateObject` with Zod schemas (guaranteed JSON, no parsing); the coach uses `streamText` for a live token stream.

Where it's used (all server-side, in services/ai):
1. Recovery plan — POST /api/habit → generatePlan(): builds a personalized plan (milestones, trigger-specific coping strategies, replacement behaviors, daily nudge, affirmation).
2. Craving SOS — POST /api/sos → generateSos(): real-time coping steps, a distraction, a reframe, and expected duration during an urge.
3. Adaptive coach — POST /api/coach → streamCoachReply(): a streaming chat grounded in the user's real check-in history (streak, wins/slips, triggers), loaded from the DB under RLS.

The API key is server-only; output shape is enforced by Zod schemas in types/.
