// In-memory sliding-window rate limiter. Fine for a single Next.js
// instance; swap the store for Redis if this ever runs multi-instance —
// see docs/assessment-platform-architecture.md section I.

type Bucket = { count: number; windowStart: number }

const buckets = new Map<string, Bucket>()

export type RateLimitResult = { allowed: boolean; remaining: number }

export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now()
  const bucket = buckets.get(key)

  if (!bucket || now - bucket.windowStart > windowMs) {
    buckets.set(key, { count: 1, windowStart: now })
    return { allowed: true, remaining: limit - 1 }
  }

  if (bucket.count >= limit) {
    return { allowed: false, remaining: 0 }
  }

  bucket.count += 1
  return { allowed: true, remaining: limit - bucket.count }
}

export function clientKeyFromRequest(request: Request, scope: string): string {
  const forwardedFor = request.headers.get('x-forwarded-for')
  const ip = forwardedFor?.split(',')[0]?.trim() ?? 'unknown'
  return `${scope}:${ip}`
}
