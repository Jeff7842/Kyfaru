import { Redis } from '@upstash/redis'

// Admin-only cache. Never import this from public routes (app/api/contact,
// app/api/quote, etc.) - the existing login rate-limiter is Postgres-backed
// and stays that way.
let client: Redis | null = null

export function getRedis(): Redis | null {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) return null
  if (!client) client = Redis.fromEnv()
  return client
}
