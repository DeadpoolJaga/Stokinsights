type CacheEntry<T> = { value: T; expiresAt: number };

const globalForCache = globalThis as unknown as {
  __cache?: Map<string, CacheEntry<unknown>>;
};

const cache = globalForCache.__cache ?? new Map<string, CacheEntry<unknown>>();
globalForCache.__cache = cache;

export function cacheGet<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }
  return entry.value as T;
}

export function cacheSet<T>(key: string, value: T, ttlMs: number) {
  cache.set(key, { value, expiresAt: Date.now() + ttlMs });
}
