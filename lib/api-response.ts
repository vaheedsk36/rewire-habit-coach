import { NextResponse } from "next/server";
import type { z } from "zod";
import type { ApiError, ErrorCode, Result } from "@/types";

/** Map typed error codes to HTTP status codes. Shared by every route. */
export const STATUS_BY_CODE: Record<ErrorCode, number> = {
  invalid_input: 400,
  ai_failed: 502,
  timeout: 504,
  unknown: 500,
};

function errorResponse(error: ApiError) {
  return NextResponse.json<Result<never>>(
    { ok: false, error },
    { status: STATUS_BY_CODE[error.code] },
  );
}

/**
 * Parses and validates a request body against a Zod schema, returning either the
 * typed data or a ready-to-return error response. Keeps route handlers thin: they
 * validate, delegate to a service, and return — no boilerplate, no business logic.
 */
export async function parseBody<T>(
  request: Request,
  schema: z.ZodType<T>,
): Promise<{ ok: true; data: T } | { ok: false; response: NextResponse }> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return {
      ok: false,
      response: errorResponse({
        code: "invalid_input",
        message: "Invalid request body.",
      }),
    };
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return {
      ok: false,
      response: errorResponse({
        code: "invalid_input",
        message: parsed.error.issues[0]?.message ?? "Invalid input.",
      }),
    };
  }

  return { ok: true, data: parsed.data };
}

/** Serialise a service `Result` into an HTTP response with the right status. */
export function resultResponse<T>(result: Result<T>): NextResponse {
  const status = result.ok ? 200 : STATUS_BY_CODE[result.error.code];
  return NextResponse.json(result, { status });
}
