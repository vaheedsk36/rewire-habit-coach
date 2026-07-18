"use client";

import { useEffect, useState } from "react";
import { Brain, Check, Loader2, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";
import { motion } from "@/components/motion/motion";
import { Card, CardContent } from "@/components/ui/card";

const STEPS = [
  "Understanding your habit & triggers",
  "Mapping out your milestones",
  "Writing coping strategies",
  "Personalizing your daily nudge",
];

/**
 * The AI-generation experience. Purely cosmetic step-cycling to make the wait
 * feel intentional and premium while the real LLM request runs in the background.
 */
export function PlanGenerating() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setActive((a) => Math.min(a + 1, STEPS.length - 1)),
      1900,
    );
    return () => clearInterval(id);
  }, []);

  return (
    <Card className="overflow-hidden border-primary/30">
      <div className="relative bg-gradient-to-br from-primary/15 via-primary/5 to-transparent">
        {/* animated sheen */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent"
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        />
        <CardContent className="relative flex flex-col items-center gap-4 py-10 text-center">
          <div className="relative">
            <motion.span
              aria-hidden
              className="absolute inset-0 rounded-2xl bg-primary/30 blur-xl"
              animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            <span className="relative flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-emerald-500 text-primary-foreground shadow-lg shadow-primary/30">
              <Brain className="size-8" aria-hidden />
            </span>
          </div>
          <div>
            <h2 className="flex items-center justify-center gap-1.5 text-lg font-semibold">
              <Sparkles className="size-4 text-primary" aria-hidden />
              <span className="text-gradient">Crafting your recovery plan</span>
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Our AI coach is tailoring every step to you…
            </p>
          </div>
        </CardContent>
      </div>

      <CardContent className="space-y-2.5 pt-5">
        {STEPS.map((step, i) => {
          const done = i < active;
          const current = i === active;
          return (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: done || current ? 1 : 0.45, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="flex items-center gap-2.5 text-sm"
            >
              <span
                className={cn(
                  "flex size-5 shrink-0 items-center justify-center rounded-full",
                  done
                    ? "bg-primary text-primary-foreground"
                    : current
                      ? "bg-primary/15 text-primary"
                      : "bg-muted text-muted-foreground",
                )}
              >
                {done ? (
                  <Check className="size-3" aria-hidden />
                ) : current ? (
                  <Loader2 className="size-3 animate-spin" aria-hidden />
                ) : (
                  <span className="size-1.5 rounded-full bg-current" />
                )}
              </span>
              <span className={cn(current && "font-medium")}>{step}</span>
            </motion.div>
          );
        })}
      </CardContent>
    </Card>
  );
}
