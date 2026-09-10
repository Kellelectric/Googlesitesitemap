// Best-effort in-memory per-IP rate limiter, shared by /api/quote and
// /api/chat. Resets on cold start and does not share state across
// serverless instances, so it will not stop a distributed attack — it
// only stops a single script hammering an endpoint from one warm
// instance. Good enough to blunt casual abuse; add a real rate-limit
// service (Upstash, Vercel KV, etc.) if abuse becomes a real problem.
export function createRateLimiter({ windowMs, max }: { windowMs: number; max: number }) {
  const requestLog = new Map<string, number[]>()

  return function isRateLimited(ip: string): boolean {
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
