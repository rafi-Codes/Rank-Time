type CacheEntry<T> = {
  value: T;
  expiresAt: number;
};

declare global {
  // eslint-disable-next-line no-var
  var _rankTimeMemoryCache: Map<string, CacheEntry<unknown>> | undefined;
}

const cache = global._rankTimeMemoryCache ?? new Map<string, CacheEntry<unknown>>();
global._rankTimeMemoryCache = cache;

export async function getCachedValue<T>(key: string): Promise<T | null> {
  const entry = cache.get(key);
  if (!entry) return null;

  if (entry.expiresAt <= Date.now()) {
    cache.delete(key);
    return null;
  }

  return entry.value as T;
}

export async function setCachedValue<T>(key: string, value: T, ttlSeconds: number) {
  cache.set(key, {
    value,
    expiresAt: Date.now() + ttlSeconds * 1000,
  });
}

export async function deleteCachedValues(prefix: string) {
  for (const key of Array.from(cache.keys())) {
    if (key.startsWith(prefix)) {
      cache.delete(key);
    }
  }
}
