import Redis from "ioredis";

declare global {
  // eslint-disable-next-line no-var
  var __redis: Redis | undefined;
}

let redis: Redis;

if (process.env.REDIS_URL) {
  redis = global.__redis ?? new Redis(process.env.REDIS_URL, {
    maxRetriesPerRequest: 3,
    retryStrategy: (times) => Math.min(times * 50, 2000),
    enableReadyCheck: false,
    lazyConnect: true,
  });

  if (process.env.NODE_ENV !== "production") {
    global.__redis = redis;
  }
} else {
<<<<<<< HEAD
  // In-memory fallback for dev / Vercel without Redis
=======
  // In-memory fallback for dev
>>>>>>> 12c6bf03fe9795bf758f24028704f070af22a889
  const store = new Map<string, { value: string; expires?: number }>();

  redis = {
    get: async (key: string) => {
      const item = store.get(key);
      if (!item) return null;
      if (item.expires && Date.now() > item.expires) {
        store.delete(key);
        return null;
      }
      return item.value;
    },
    set: async (key: string, value: string, ...args: unknown[]) => {
      let expires: number | undefined;
<<<<<<< HEAD
=======
      // Handle EX option
>>>>>>> 12c6bf03fe9795bf758f24028704f070af22a889
      const exIdx = (args as string[]).findIndex((a: unknown) => a === "EX");
      if (exIdx >= 0) expires = Date.now() + Number((args as unknown[])[exIdx + 1]) * 1000;
      store.set(key, { value, expires });
      return "OK";
    },
    setex: async (key: string, seconds: number, value: string) => {
      store.set(key, { value, expires: Date.now() + seconds * 1000 });
      return "OK";
    },
    del: async (...keys: string[]) => {
      keys.forEach((k) => store.delete(k));
      return keys.length;
    },
    incr: async (key: string) => {
      const item = store.get(key);
      const n = parseInt(item?.value ?? "0") + 1;
      store.set(key, { value: String(n), expires: item?.expires });
      return n;
    },
    expire: async (key: string, seconds: number) => {
      const item = store.get(key);
      if (item) store.set(key, { ...item, expires: Date.now() + seconds * 1000 });
      return 1;
    },
    ttl: async (key: string) => {
      const item = store.get(key);
      if (!item?.expires) return -1;
      return Math.max(0, Math.floor((item.expires - Date.now()) / 1000));
    },
    exists: async (key: string) => (store.has(key) ? 1 : 0),
<<<<<<< HEAD
    // FIX #4: keys() supports glob patterns in the in-memory fallback
    keys: async (pattern: string) => {
      const regex = new RegExp("^" + pattern.replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*") + "$");
=======
    keys: async (pattern: string) => {
      const regex = new RegExp("^" + pattern.replace(/\*/g, ".*") + "$");
>>>>>>> 12c6bf03fe9795bf758f24028704f070af22a889
      return [...store.keys()].filter((k) => regex.test(k));
    },
  } as unknown as Redis;
}

export { redis };
export default redis;

// ─── Cache Helpers ──────────────────────────────────────────────────────

<<<<<<< HEAD
=======
/** Cache a value with TTL */
>>>>>>> 12c6bf03fe9795bf758f24028704f070af22a889
export async function cacheSet(key: string, value: unknown, ttl = 300): Promise<void> {
  await redis.setex(key, ttl, JSON.stringify(value));
}

<<<<<<< HEAD
=======
/** Get cached value */
>>>>>>> 12c6bf03fe9795bf758f24028704f070af22a889
export async function cacheGet<T>(key: string): Promise<T | null> {
  const raw = await redis.get(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

<<<<<<< HEAD
/** Delete a single key */
=======
/** Delete cached value */
>>>>>>> 12c6bf03fe9795bf758f24028704f070af22a889
export async function cacheDel(key: string): Promise<void> {
  await redis.del(key);
}

<<<<<<< HEAD
/** FIX #4: Delete all keys matching a glob pattern (e.g. "link:info:*") */
export async function cacheDelPattern(pattern: string): Promise<void> {
  try {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  } catch {
    // Silent fail — cache invalidation is best-effort
  }
}

=======
/** Get or set (cache-aside pattern) */
>>>>>>> 12c6bf03fe9795bf758f24028704f070af22a889
export async function cacheGetOrSet<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl = 300
): Promise<T> {
  const cached = await cacheGet<T>(key);
  if (cached !== null) return cached;
<<<<<<< HEAD
=======

>>>>>>> 12c6bf03fe9795bf758f24028704f070af22a889
  const fresh = await fetcher();
  await cacheSet(key, fresh, ttl);
  return fresh;
}

// ─── Rate Limiting ──────────────────────────────────────────────────────

export async function rateLimit(
  key: string,
  limit: number,
  windowSeconds: number
): Promise<{ allowed: boolean; remaining: number; reset: number }> {
  const redisKey = `rl:${key}`;
<<<<<<< HEAD
=======

>>>>>>> 12c6bf03fe9795bf758f24028704f070af22a889
  const current = await redis.incr(redisKey);
  if (current === 1) {
    await redis.expire(redisKey, windowSeconds);
  }
<<<<<<< HEAD
=======

>>>>>>> 12c6bf03fe9795bf758f24028704f070af22a889
  const ttl = await redis.ttl(redisKey);
  const allowed = current <= limit;
  const remaining = Math.max(0, limit - current);
  const reset = Date.now() + ttl * 1000;
<<<<<<< HEAD
=======

>>>>>>> 12c6bf03fe9795bf758f24028704f070af22a889
  return { allowed, remaining, reset };
}

// ─── Redirect Session ───────────────────────────────────────────────────

export async function setRedirectSession(
  sessionKey: string,
  data: { linkId: string; step: number; slug: string; ip?: string }
): Promise<void> {
<<<<<<< HEAD
  await cacheSet(`rs:${sessionKey}`, data, 300);
=======
  await cacheSet(`rs:${sessionKey}`, data, 300); // 5 minute TTL
>>>>>>> 12c6bf03fe9795bf758f24028704f070af22a889
}

export async function getRedirectSession(
  sessionKey: string
): Promise<{ linkId: string; step: number; slug: string; ip?: string } | null> {
  return cacheGet(`rs:${sessionKey}`);
}

export async function updateRedirectStep(
  sessionKey: string,
  step: number
): Promise<void> {
  const session = await getRedirectSession(sessionKey);
  if (session) {
    await cacheSet(`rs:${sessionKey}`, { ...session, step }, 300);
  }
}
