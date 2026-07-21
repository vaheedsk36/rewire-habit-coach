import {
  sosResponseSchema,
  type SosInput,
  type SosResponse,
} from '@rewire/core';

import { config } from '../config';
import { supabase } from './supabase';

/**
 * Calls a Rewire AI route handler on the deployed web app. The LLM key stays
 * server-side; mobile authenticates with the user's Supabase access token
 * (Bearer) instead of the web's cookies. Responses are validated with the SAME
 * Zod schema the server produced them with, so the contract can't silently drift.
 */
async function authedPost<T>(
  path: string,
  body: unknown,
  schema: { parse: (data: unknown) => T },
): Promise<T> {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    throw new Error('Not signed in.');
  }

  const res = await fetch(`${config.apiUrl}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify(body),
  });

  const json = (await res.json()) as {
    ok: boolean;
    data?: unknown;
    error?: { message: string };
  };
  if (!res.ok || !json.ok) {
    throw new Error(json.error?.message ?? `Request failed (${res.status}).`);
  }
  return schema.parse(json.data);
}

/** In-the-moment craving support. */
export function requestSos(input: SosInput): Promise<SosResponse> {
  return authedPost('/api/sos', input, sosResponseSchema);
}
