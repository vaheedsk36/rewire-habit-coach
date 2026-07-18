"use client";

import { useCallback, useState } from "react";
import type { CoachMessage } from "@/types";

/**
 * Owns the adaptive-coach conversation and its streaming request lifecycle.
 * Reads the plain-text stream from /api/coach and appends chunks to the last
 * assistant message so the reply types out live.
 */
export function useCoach() {
  const [messages, setMessages] = useState<CoachMessage[]>([]);
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || streaming) return;

      const history = messages;
      setMessages((prev) => [
        ...prev,
        { role: "user", content: trimmed },
        { role: "assistant", content: "" },
      ]);
      setStreaming(true);
      setError(null);

      try {
        const res = await fetch("/api/coach", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: trimmed, history }),
        });

        if (!res.ok || !res.body) {
          const body = (await res.json().catch(() => null)) as
            | { error?: { message?: string } }
            | null;
          throw new Error(body?.error?.message ?? "The coach is unavailable.");
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let acc = "";
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          acc += decoder.decode(value, { stream: true });
          setMessages((prev) => {
            const copy = [...prev];
            copy[copy.length - 1] = { role: "assistant", content: acc };
            return copy;
          });
        }
        if (!acc.trim()) throw new Error("Empty response from the coach.");
      } catch (e) {
        setError(e instanceof Error ? e.message : "Something went wrong.");
        // Drop the empty assistant placeholder so the UI doesn't show a blank bubble.
        setMessages((prev) =>
          prev.filter(
            (m, i) =>
              !(i === prev.length - 1 && m.role === "assistant" && !m.content),
          ),
        );
      } finally {
        setStreaming(false);
      }
    },
    [messages, streaming],
  );

  return { messages, streaming, error, send } as const;
}
