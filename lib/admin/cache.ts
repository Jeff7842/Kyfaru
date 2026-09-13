import { getRedis } from '@/lib/admin/redis'

// Falls back to calling fn() uncached whenever Redis isn't configured (no
// UPSTASH_* env vars yet) or the request fails - dashboard reads must never
// break because of the cache.
export async function cachedJson<T>(key: string, ttlSeconds: number, fn: () => Promise<T>): Promise<T> {
  const redis = getRedis()
  if (!redis) return fn()
  try {
    const cached = await redis.get<T>(key)
    if (cached !== null) return cached
  } catch {
    return fn()
  }
  const fresh = await fn()
  try {
    await redis.set(key, fresh, { ex: ttlSeconds })
  } catch {
    // cache write failures are non-fatal
  }
  return fresh
}
