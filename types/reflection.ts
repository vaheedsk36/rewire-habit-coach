import { z } from "zod";
import type { Result } from "@/types";

/**
 * Weekly AI Reflection — the request the client sends to review a habit's recent
 * progress. We deliberately send ONLY the habit id: the server re-loads the real
 * journey (RLS-scoped) so the reflection is grounded in trusted data, never in
 * numbers the client could fabricate.
 */
export const reflectionRequestSchema = z.object({
  habitId: z
    .string()
    .uuid()
    .describe("The id of the habit whose recent check-ins should be reviewed."),
});

export type ReflectionRequest = z.infer<typeof reflectionRequestSchema>;

/**
 * The AI's structured weekly reflection. `generateObject` constrains the model to
 * exactly this shape, so the UI always gets valid, typed data — no text to parse.
 *
 * The three fields map to a deliberate arc: an honest read of the week, one thing
 * to feel proud of, and a single focus for next week. Kept small on purpose — an
 * honest summary plus ONE focused goal is more actionable (and less overwhelming)
 * than a long list. The `.describe()` calls carry the field-level tone/shape rules
 * so the prompt can stay about the situation, not the format.
 */
export const reflectionResponseSchema = z.object({
  summary: z
    .string()
    .describe(
      "An honest yet encouraging 2-3 sentence read of the past week, referencing the ACTUAL recent pattern in the check-ins (e.g. the streak, specific wins or slips, momentum or a rough patch). Truthful about setbacks, but never shaming.",
    ),
  highlight: z
    .string()
    .describe(
      "One specific thing that genuinely went well this week, drawn from the real data — a concrete win, a recovery after a slip, or consistency worth naming. Not generic praise.",
    ),
  focus: z
    .string()
    .describe(
      "One concrete, focused goal for the coming week: a single, doable behavior tuned to the pattern above. Specific and small enough to actually commit to — not a list.",
    ),
});

export type ReflectionResponse = z.infer<typeof reflectionResponseSchema>;

/** Discriminated result returned by the reflection service and API route. */
export type ReflectionResult = Result<ReflectionResponse>;
