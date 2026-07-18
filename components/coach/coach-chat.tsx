"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, MessageCircle, Send, Sparkles } from "lucide-react";

import { useCoach } from "@/hooks/use-coach";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const SUGGESTIONS = [
  "How am I doing so far?",
  "I'm really struggling today.",
  "Why do I keep slipping in the evenings?",
];

/**
 * The adaptive coach. Every reply is grounded server-side in the user's real
 * check-in history, so the guidance changes as their progress does.
 */
export function CoachChat() {
  const { messages, streaming, error, send } = useCoach();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages]);

  function submit(text: string) {
    void send(text);
    setInput("");
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <MessageCircle className="size-5 text-primary" aria-hidden />
          <CardTitle>Your coach</CardTitle>
        </div>
        <CardDescription>
          Adaptive guidance based on your real progress.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div
          ref={scrollRef}
          className="max-h-72 space-y-3 overflow-y-auto"
          aria-live="polite"
        >
          {messages.length === 0 ? (
            <div className="rounded-lg bg-muted/60 p-3 text-sm text-muted-foreground">
              <div className="mb-1 flex items-center gap-1.5 font-medium text-foreground">
                <Sparkles className="size-4 text-primary" aria-hidden />
                Ask me anything
              </div>
              I can see your streak and check-ins — ask how you&apos;re doing, or
              tell me you&apos;re struggling.
            </div>
          ) : (
            messages.map((m, i) => (
              <div
                key={i}
                className={cn(
                  "flex",
                  m.role === "user" ? "justify-end" : "justify-start",
                )}
              >
                <div
                  className={cn(
                    "max-w-[85%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm",
                    m.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground",
                  )}
                >
                  {m.content ||
                    (streaming && i === messages.length - 1 ? (
                      <Loader2 className="size-4 animate-spin" aria-hidden />
                    ) : null)}
                </div>
              </div>
            ))
          )}
        </div>

        {messages.length === 0 && (
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                disabled={streaming}
                onClick={() => submit(s)}
                className="rounded-full border px-3 py-1.5 text-xs transition-colors hover:bg-muted disabled:opacity-50"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {error && (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}

        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            submit(input);
          }}
        >
          <label htmlFor="coach-input" className="sr-only">
            Message your coach
          </label>
          <input
            id="coach-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tell your coach what's going on…"
            disabled={streaming}
            className="min-w-0 flex-1 rounded-lg border bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50"
          />
          <Button type="submit" size="icon" disabled={streaming || !input.trim()}>
            {streaming ? (
              <Loader2 className="animate-spin" aria-hidden />
            ) : (
              <Send aria-hidden />
            )}
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
