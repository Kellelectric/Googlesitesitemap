import { Redis } from '@upstash/redis'

// Optional durable store, backing rate limiting (src/lib/rateLimit.ts) and
// the careers-application duplicate-submission guard/pending-application
// stash. Without a Redis REST URL+token available (either naming below),
// all three fall back to their previous in-memory-only behavior
// (documented in each call site's own comment) - this file existing
// changes nothing until one of those is set.
//
// Setup: upstash.com -> create a Redis database (the free tier is enough
// for this site's volume) -> REST API section has UPSTASH_REDIS_REST_URL/
// TOKEN. OR: Vercel dashboard -> Storage -> Marketplace Database Providers
// -> "Upstash Redis" (or "Redis") -> once connected, Vercel instead sets
// KV_REST_API_URL/KV_REST_API_TOKEN (its own long-standing naming from the
// original first-party Vercel KV product, carried over to the Marketplace
// integration that replaced it) - accepted here as a fallback so either
// setup path works without hand-copying values into a second pair of vars.
let cached: Redis | null | undefined

export function getRedis(): Redis | null {
  if (cached !== undefined) return cached
  const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN
  cached = url && token ? new Redis({ url, token }) : null
  return cached
}

export function isRedisConfigured(): boolean {
  return Boolean(
    (process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL) &&
      (process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN),
  )
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

// Holds the data needed to send an applicant "your application has been
// received" confirmation email once they finish the embedded Google Form
// on the thank-you page (see careers-application/route.ts and
// careers/thank-you/page.tsx) - the initial form-submission response never
// carries the applicant's email/name back to the browser, so this is
// looked up server-side by reference instead of round-tripping PII through
// a URL query string. Requires Redis - without it, the confirmation email
// is simply not sent (the on-page "received" message still shows either
// way), same no-op-until-configured shape as everything else in kv.ts.
export type PendingCareerApplication = {
  reference: string
  trackName: string
  fullName: string
  email: string
  phone: string
  courseOrInstitution?: string
  roleAppliedFor?: string
  cvLink?: string
  message: string
  submittedAt: string
}

function pendingCareerApplicationKey(reference: string): string {
  return `pending-career-app:${reference}`
}

export async function getPendingCareerApplication(
  reference: string,
): Promise<PendingCareerApplication | null> {
  const redis = getRedis()
  if (!redis) return null
  return redis.get<PendingCareerApplication>(pendingCareerApplicationKey(reference))
}

export async function markPendingCareerApplication(
  data: PendingCareerApplication,
  ttlSeconds: number,
): Promise<void> {
  const redis = getRedis()
  if (!redis) return
  await redis.set(pendingCareerApplicationKey(data.reference), data, { ex: ttlSeconds })
}

export async function clearPendingCareerApplication(reference: string): Promise<void> {
  const redis = getRedis()
  if (!redis) return
  await redis.del(pendingCareerApplicationKey(reference))
}
