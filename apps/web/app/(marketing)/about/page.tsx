import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Cpu,
  HeartHandshake,
  Lock,
  Sparkles,
  Target,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FadeIn } from "@/components/motion/motion";

export const metadata: Metadata = {
  title: "About",
  description:
    "Why Rewire exists, the behavior-change philosophy behind it, and how it uses Generative AI as a core component to help people break bad habits for good.",
};

const VALUES = [
  {
    icon: HeartHandshake,
    title: "Supportive, never shaming",
    body: "Slips are part of change. Rewire meets them with a compassionate reframe and a next step — because shame is what drives relapse, not recovery.",
  },
  {
    icon: Sparkles,
    title: "Adaptive by design",
    body: "Guidance is grounded in your real check-in history — your streak, wins, and trigger patterns — so it changes as you do.",
  },
  {
    icon: Lock,
    title: "Private by default",
    body: "Your habits and check-ins are protected by row-level security. Only you can ever read or write your own data.",
  },
  {
    icon: Cpu,
    title: "Honest AI",
    body: "Every plan, nudge, coach reply, and SOS response is a real LLM call. No canned scripts, no mock data — anywhere.",
  },
];

const PILLARS = [
  "A personalized, staged recovery plan with milestones, coping strategies, and replacement behaviors.",
  "An adaptive coach that reads your progress and responds to it.",
  "Craving SOS — structured, in-the-moment support during an urge.",
  "Tracking that makes progress visible: streaks, win-rate, and a check-in heatmap.",
];

export default function AboutPage() {
  return (
    <>
      <section className="mx-auto w-full max-w-3xl px-4 pb-10 pt-16 sm:px-6 sm:pt-24">
        <FadeIn>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
            <Target className="size-3.5" aria-hidden />
            Our mission
          </span>
          <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">
            Make lasting change{" "}
            <span className="text-gradient">actually achievable</span>.
          </h1>
          <p className="mt-5 text-lg text-muted-foreground">
            Most habit apps hand you a counter and a streak and wish you luck.
            Rewire is built on a simple belief: breaking a habit is a
            behavior-change problem, not an information problem. It takes the
            right nudge at the right moment, coaching that remembers your story,
            and support the instant a craving hits. That&apos;s what we set out
            to build.
          </p>
        </FadeIn>
      </section>

      {/* How the AI works */}
      <section className="border-y border-border/60 bg-muted/30">
        <div className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6">
          <FadeIn>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Generative AI at the core
            </h2>
            <p className="mt-4 text-muted-foreground">
              Rewire uses a real large language model as the engine of the
              experience — with structured, schema-validated outputs so the app
              always receives clean, typed data. Four ways it shows up:
            </p>
            <ul className="mt-6 space-y-3">
              {PILLARS.map((p) => (
                <li key={p} className="flex items-start gap-3">
                  <span className="mt-1 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                    <Sparkles className="size-3" aria-hidden />
                  </span>
                  <span className="text-sm text-foreground/90">{p}</span>
                </li>
              ))}
            </ul>
          </FadeIn>
        </div>
      </section>

      {/* Values */}
      <section className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
        <FadeIn className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            What we stand for
          </h2>
        </FadeIn>
        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {VALUES.map((v, i) => (
            <FadeIn key={v.title} delay={i * 0.06}>
              <Card className="h-full transition-colors hover:border-primary/40">
                <CardContent className="flex gap-4 pt-6">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/15">
                    <v.icon className="size-5" aria-hidden />
                  </span>
                  <div>
                    <h3 className="font-display font-semibold">{v.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{v.body}</p>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Story */}
      <section className="border-t border-border/60 bg-muted/30">
        <div className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6">
          <FadeIn>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              The story
            </h2>
            <p className="mt-4 text-muted-foreground">
              Rewire began as a build at <strong>PromptWars</strong> — an
              in-person <strong>Build with AI</strong> challenge by Google for
              Developers and Hack2Skill in Hyderabad — around the theme of
              breaking bad habits and addiction. It&apos;s since grown into a
              real, free product: a calm, adaptive coach anyone can use to change
              a habit that&apos;s holding them back.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
        <FadeIn className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to start?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            It&apos;s free and private. Define a habit and get your first
            AI-built plan in minutes.
          </p>
          <Link
            href="/app"
            className={cn(
              buttonVariants({ size: "lg" }),
              "mt-8 h-12 gap-2 bg-gradient-to-r from-primary to-emerald-500 px-6 text-base font-semibold shadow-lg shadow-primary/25 transition-shadow hover:shadow-primary/40",
            )}
          >
            Open Rewire <ArrowRight className="size-4" aria-hidden />
          </Link>
        </FadeIn>
      </section>
    </>
  );
}
