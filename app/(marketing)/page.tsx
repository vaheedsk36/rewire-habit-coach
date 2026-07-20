import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Bell,
  Brain,
  Heart,
  LifeBuoy,
  ListChecks,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Wand2,
} from "lucide-react";

import { GITHUB_URL, SITE_DESCRIPTION } from "@/constants/site";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FadeIn } from "@/components/motion/motion";
import { GithubIcon } from "@/components/icons/github";

export const metadata: Metadata = {
  title: { absolute: "Rewire — Break bad habits for good, with an AI coach" },
  description: SITE_DESCRIPTION,
};

const PILLARS = [
  {
    icon: ListChecks,
    title: "A personalized recovery plan",
    body: "Tell Rewire the habit and your why. A real LLM builds a staged plan — milestones, coping strategies mapped to your triggers, and replacement behaviors.",
  },
  {
    icon: MessageCircle,
    title: "An adaptive AI coach",
    body: "A coach that reads your real check-in history — your streak, wins, and slip patterns — and responds to your progress, not a script.",
  },
  {
    icon: LifeBuoy,
    title: "In-the-moment Craving SOS",
    body: "One tap during an urge returns grounding steps, a distraction, and a reframe of why you started — support exactly when it's hardest.",
  },
  {
    icon: BarChart3,
    title: "Progress that motivates",
    body: "Daily check-ins, streaks, a win-rate, and a heatmap — so change is visible and momentum compounds.",
  },
];

const FEATURES = [
  { icon: Wand2, title: "AI form autofill", body: "Type your habit; the AI pre-fills the rest of onboarding." },
  { icon: Heart, title: "Shame-free reframes", body: "A slip triggers a compassionate reset, because shame drives relapse." },
  { icon: Bell, title: "Daily nudges", body: "Intelligent, personalized nudges tuned to your habit and triggers." },
  { icon: ShieldCheck, title: "Private & secure", body: "Row-level security keeps your data yours. Accounts + Google sign-in." },
];

const SHOTS = [
  { src: "/screenshots/02-onboarding.png", alt: "Onboarding — define your habit" },
  { src: "/screenshots/04-plan.png", alt: "Your AI-built recovery plan" },
  { src: "/screenshots/05-today.png", alt: "Today — check-in and coach" },
  { src: "/screenshots/06-progress.png", alt: "Progress — streak and heatmap" },
];

const FAQ = [
  { q: "Is it free?", a: "Yes. Rewire is a free personal tool — create an account and start. No card, no catch." },
  { q: "What habits can it help with?", a: "Anything you define: screen time, doomscrolling, social media, smoking, vaping, junk food, and more. The AI adapts to whatever you pick." },
  { q: "Is the AI real?", a: "Every plan, nudge, coach reply, and SOS response is a live LLM call — no canned or mock content anywhere." },
  { q: "Is my data private?", a: "Your habits and check-ins are protected by row-level security — only you can read or write your own data." },
  { q: "Is this medical advice?", a: "No. Rewire is a supportive tool, not a substitute for professional care. For serious addiction, please seek qualified help." },
];

export default function LandingPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-16 sm:px-6 sm:pt-24">
          <FadeIn className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
              <Sparkles className="size-3.5" aria-hidden />
              GenAI-powered habit recovery
            </span>
            <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-6xl">
              Break bad habits{" "}
              <span className="text-gradient">for good</span>, with an AI coach
              that adapts to you.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
              Rewire turns your goal into a personalized recovery plan, coaches
              you through cravings, and tracks the progress that keeps you going
              — screen time, doomscrolling, vaping, and more.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/app"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "h-12 gap-2 bg-gradient-to-r from-primary to-emerald-500 px-6 text-base font-semibold shadow-lg shadow-primary/25 transition-shadow hover:shadow-primary/40",
                )}
              >
                Start free <ArrowRight className="size-4" aria-hidden />
              </Link>
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noreferrer"
                className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-12 gap-2 px-6 text-base")}
              >
                <GithubIcon className="size-4" aria-hidden />
                View on GitHub
              </a>
            </div>
          </FadeIn>

          <FadeIn delay={0.15} className="mx-auto mt-14 max-w-5xl">
            <div className="overflow-hidden rounded-2xl border shadow-2xl shadow-primary/5 ring-1 ring-border/50">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/screenshots/05-today.png"
                alt="Rewire dashboard — today's nudge, check-in, and adaptive coach"
                className="w-full"
                loading="eager"
              />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Problem */}
      <section className="border-y border-border/60 bg-muted/30">
        <div className="mx-auto w-full max-w-3xl px-4 py-16 text-center sm:px-6">
          <FadeIn>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Breaking a habit isn&apos;t an information problem.
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Everyone knows screen time is too high. Change is hard because it
              needs the right message at the right moment, tracking that
              reflects real progress, and support the instant a craving hits.
              Generic advice and static trackers don&apos;t adapt to{" "}
              <span className="font-medium text-foreground">you</span>. Rewire does.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="mx-auto w-full max-w-6xl scroll-mt-20 px-4 py-20 sm:px-6">
        <FadeIn className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            GenAI at the core — not bolted on
          </h2>
          <p className="mt-3 text-muted-foreground">
            Four ways Rewire uses a real LLM to drive sustained change.
          </p>
        </FadeIn>
        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {PILLARS.map((p, i) => (
            <FadeIn key={p.title} delay={i * 0.06}>
              <Card className="h-full transition-colors hover:border-primary/40">
                <CardContent className="flex gap-4 pt-6">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/15">
                    <p.icon className="size-5" aria-hidden />
                  </span>
                  <div>
                    <h3 className="font-display font-semibold">{p.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{p.body}</p>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Screenshots */}
      <section id="features" className="border-t border-border/60 bg-muted/30 scroll-mt-20">
        <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
          <FadeIn className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              A calm, focused product
            </h2>
            <p className="mt-3 text-muted-foreground">
              From onboarding to your plan to daily check-ins — designed to feel
              supportive, not clinical.
            </p>
          </FadeIn>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {SHOTS.map((s, i) => (
              <FadeIn key={s.src} delay={i * 0.05}>
                <div className="overflow-hidden rounded-xl border shadow-lg ring-1 ring-border/50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={s.src} alt={s.alt} className="w-full" loading="lazy" />
                </div>
              </FadeIn>
            ))}
          </div>

          <div className="mx-auto mt-12 grid max-w-4xl gap-4 sm:grid-cols-2">
            {FEATURES.map((f, i) => (
              <FadeIn key={f.title} delay={i * 0.05}>
                <div className="flex items-start gap-3 rounded-xl border bg-card p-4">
                  <f.icon className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
                  <div>
                    <p className="font-medium">{f.title}</p>
                    <p className="text-sm text-muted-foreground">{f.body}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto w-full max-w-3xl px-4 py-20 sm:px-6">
        <FadeIn className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Questions, answered
          </h2>
        </FadeIn>
        <div className="mt-10 space-y-3">
          {FAQ.map((item, i) => (
            <FadeIn key={item.q} delay={i * 0.04}>
              <details className="group rounded-xl border bg-card p-4 [&_summary]:cursor-pointer">
                <summary className="flex items-center justify-between font-medium marker:content-none">
                  {item.q}
                  <ArrowRight className="size-4 text-muted-foreground transition-transform group-open:rotate-90" aria-hidden />
                </summary>
                <p className="mt-2 text-sm text-muted-foreground">{item.a}</p>
              </details>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto w-full max-w-6xl px-4 pb-24 sm:px-6">
        <FadeIn>
          <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/15 via-primary/5 to-transparent px-6 py-16 text-center">
            <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary/15 text-primary ring-1 ring-primary/20">
              <Brain className="size-7" aria-hidden />
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Start rewiring today
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              Free, private, and built to adapt to you. Your first plan is
              minutes away.
            </p>
            <Link
              href="/app"
              className={cn(
                buttonVariants({ size: "lg" }),
                "mt-8 h-12 gap-2 bg-gradient-to-r from-primary to-emerald-500 px-6 text-base font-semibold shadow-lg shadow-primary/25 transition-shadow hover:shadow-primary/40",
              )}
            >
              Get started <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
        </FadeIn>
      </section>
    </>
  );
}
