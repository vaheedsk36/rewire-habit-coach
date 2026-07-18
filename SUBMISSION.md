# Submission Details — copy-paste into the PromptWars form

> Keep this file current on EVERY change/redeploy. Each free-text field must stay
> ≤ 1024 characters (the form's limit). Update the "Last updated" date each time.

**Last updated:** 2026-07-18 · **Submission:** 1 of 3

---

### Challenge
Main Challenge

### Public GitHub Repository Link
https://github.com/vaheedsk36/rewire-habit-coach

### Deployed Link
https://rewire-habit-coach.vercel.app

---

### Describe the changes/updates made in the deployed version
Submission 1 (initial deploy). Rewire — a GenAI web app to reduce or overcome harmful habits & addictions (screen time, doomscrolling, smoking, vaping, junk food, and more).

Features:
- Onboarding: define your habit, goal (quit/reduce), current amount, motivation, triggers, and timeframe.
- AI recovery plan: a real LLM builds a personalized plan — summary, first step, milestones, coping strategies mapped to your triggers, replacement behaviors, a daily nudge, and an affirmation.
- Craving SOS: one tap during an urge returns immediate structured coping steps, a distraction, a reframe tied to your "why", and how long the urge should last.
- Tracking: daily check-ins (win/slip) with streaks and total wins, persisted locally.
- Full request lifecycle: loading, success, error, retry, timeout. Responsive, accessible, light/dark.

Stack: Next.js 15 (App Router), TypeScript (strict), Tailwind + shadcn/ui, React Hook Form + Zod, Vercel AI SDK. Deployed on Vercel.

### Mention the Gen AI services utilized in the submission, and where did you utilize it?
Gen AI service: OpenAI (model gpt-4o-mini) via the Vercel AI SDK (`ai` + `@ai-sdk/openai`), using `generateObject` with Zod schemas for guaranteed structured JSON output — no hardcoded or mock data.

Where it's used (all server-side, in services/ai):
1. Recovery plan — POST /api/plan → generatePlan(): turns onboarding input into a personalized recovery plan (milestones, trigger-specific coping strategies, replacement behaviors, daily nudge, affirmation).
2. Craving SOS — POST /api/sos → generateSos(): a real-time coping response during an urge (grounding steps, a distraction, a reframe tied to the user's motivation, and expected duration).

The API key is server-only (never exposed to the browser). Prompts live in services/ai/prompt.ts; output shape is enforced by Zod schemas in types/, so the UI always receives valid, fully-typed data.
