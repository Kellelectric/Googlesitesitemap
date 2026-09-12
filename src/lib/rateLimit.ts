import { Ratelimit } from '@upstash/ratelimit'
import { getRedis } from '@/lib/kv'

// Rate limiter shared by every write/lookup API route on the site. Two
// backends, chosen automatically:
//
// - Redis (Upstash), when configured (see src/lib/kv.ts) - a real sliding
//   window shared across every serverless instance and surviving cold
//   starts. This is what actually stops a distributed abuser.
// - In-memory Map, otherwise - the original behavior, kept as a fallback
//   so the site works identically before Upstash is set up. Resets on
//   cold start and doesn't share state across instances - blunts a single
//   script hammering one warm instance, nothing more.
//
// Call sites already await every isRateLimited() call (route handlers are
// async), so making this async here to support the Redis path is not a
// breaking change to any of them.
export function createRateLimiter({ windowMs, max }: { windowMs: number; max: number }) {
  const requestLog = new Map<string, number[]>()
  // One Ratelimit instance per createRateLimiter() call, not per-request -
  // matches how each call site already declares its limiter once at
  // module scope with its own windowMs/max.
  let redisLimiter: Ratelimit | null | undefined

  function getRedisLimiter(): Ratelimit | null {
    if (redisLimiter !== undefined) return redisLimiter
    const redis = getRedis()
    redisLimiter = redis
      ? new Ratelimit({
          redis,
          limiter: Ratelimit.slidingWindow(max, `${Math.max(1, Math.round(windowMs / 1000))} s`),
          // Every limiter using the same Redis instance needs a distinct
          // prefix, or two routes with different max/windowMs would share
          // counters under the same key - length included since it's the
          // one property guaranteed to differ between this site's actual
          // limiter configs (5/10min, 20/10min, 30/1min).
          prefix: `ratelimit:${windowMs}:${max}`,
        })
      : null
    return redisLimiter
  }

  return async function isRateLimited(ip: string): Promise<boolean> {
    const limiter = getRedisLimiter()
    if (limiter) {
      const { success } = await limiter.limit(ip)
      return !success
    }

    const now = Date.now()
    const recent = (requestLog.get(ip) ?? []).filter((t) => now - t < windowMs)
    recent.push(now)
    requestLog.set(ip, recent)
    return recent.length > max
  }
}

export function getClientIp(request: Request): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
}
