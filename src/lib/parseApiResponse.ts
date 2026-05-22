type RecordLike = Record<string, unknown>;

function isRecord(value: unknown): value is RecordLike {
  return typeof value === 'object' && value !== null;
}

/** Unwrap `{ success, data }` envelopes or return the payload as-is. */
export function unwrapApiData<T = unknown>(payload: unknown): T | null {
  if (!isRecord(payload)) {
    return (payload ?? null) as T | null;
  }

  if (payload.success === true && 'data' in payload) {
    return (payload.data ?? null) as T | null;
  }

  return payload as T;
}

/** Normalize list payloads from mixed API response shapes. */
export function unwrapApiList<T = unknown>(payload: unknown, keys: string[] = []): T[] {
  const unwrapped = unwrapApiData<unknown>(payload) ?? payload;

  if (Array.isArray(unwrapped)) {
    return unwrapped as T[];
  }

  if (!isRecord(unwrapped)) {
    return [];
  }

  const lookupKeys = [...keys, 'sessions', 'challenges', 'badges', 'items', 'results', 'users', 'leaderboard', 'heatmapData'];

  for (const key of lookupKeys) {
    const value = unwrapped[key];
    if (Array.isArray(value)) {
      return value as T[];
    }
  }

  return [];
}
