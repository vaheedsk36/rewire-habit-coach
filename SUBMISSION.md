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
Submission 3 (final). A polished, animated GenAI habit-recovery app — accounts, cloud persistence, adaptive coaching, plus new AI features and a full UI overhaul.

New in this version:
- UI/UX overhaul: motion animations, ambient gradients, glass surfaces, light/dark theme toggle, confetti on wins, responsive micro-interactions.
- AI form autofill: type your habit and AI prefills the whole onboarding form.
- Progress visualization: check-in heatmap, current streak, win-rate, timeframe bar.
- AI relapse reframe: logging a slip returns a compassionate reframe + a get-back-on-track step.
- Automated tests (Vitest, 34) + lazy-loaded heavy widgets for efficiency.

Core (all real LLM, DB-backed, RLS-secured): email/password accounts with one-click demo login, AI recovery plan, adaptive coach chat grounded in your check-ins, Craving SOS, streak tracking.

Validated end-to-end in production. All inputs validated client + server. Deployed on Vercel.

### Mention the Gen AI services utilized in the submission, and where did you utilize it?
Gen AI service: OpenAI (gpt-4o-mini) via the Vercel AI SDK (`ai` + `@ai-sdk/openai`). Structured features use `generateObject` + Zod (guaranteed JSON, no parsing); the coach uses `streamText`. No mock data.

Where it's used (all server-side, in services/ai):
1. Recovery plan — /api/habit → generatePlan(): milestones, trigger-specific coping strategies, replacement behaviors, daily nudge, affirmation.
2. Adaptive coach — /api/coach → streamCoachReply(): streaming chat grounded in the user's real check-in history (RLS-scoped).
3. Craving SOS — /api/sos → generateSos(): in-the-moment coping steps, distraction, reframe, duration.
4. Form autofill — /api/suggest → generateSuggestion(): infers onboarding values from the habit name.
5. Relapse reframe — /api/reframe → generateReframe(): compassionate reframe + next step after a slip.

API key is server-only; output shapes enforced by Zod schemas in types/.
