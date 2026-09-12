import { Redis } from '@upstash/redis'

// Optional durable store, backing rate limiting (src/lib/rateLimit.ts) and
// the careers-application duplicate-submission guard. Without
// UPSTASH_REDIS_REST_URL/UPSTASH_REDIS_REST_TOKEN set, both fall back to
// their previous in-memory-only behavior (documented in each call site's
// own comment) - this file existing changes nothing until those two env
// vars are set.
//
// Setup: upstash.com -> create a Redis database (the free tier is enough
// for this site's volume) -> REST API section has both values, or install
// the "Upstash Redis" integration directly from the Vercel Marketplace,
// which sets both automatically.
let cached: Redis | null | undefined

export function getRedis(): Redis | null {
  if (cached !== undefined) return cached
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  cached = url && token ? new Redis({ url, token }) : null
  return cached
}

// Backs the careers-application duplicate-submission guard (a double-
// click, a slow-network retry, or an impatient resubmit should return the
// existing reference instead of creating a second downstream
// application). Deliberately a plain get-then-later-set pair, not an
// atomic claim - matches the in-memory Map fallback's existing semantics
// exactly (mark as seen only after a successful downstream forward, so a
// genuine failure doesn't block a real retry) rather than changing that
// behavior. The small check-then-set race this allows already existed in
// the in-memory version; Redis just makes the same guard durable across
// serverless instances and cold starts instead of changing its shape.
export async function getDuplicateReference(key: string): Promise<string | null> {
  const redis = getRedis()
  if (!redis) return null
  return redis.get<string>(key)
}

export async function markDuplicateReference(
  key: string,
  reference: string,
  ttlSeconds: number,
): Promise<void> {
  const redis = getRedis()
  if (!redis) return
  await redis.set(key, reference, { ex: ttlSeconds })
}
