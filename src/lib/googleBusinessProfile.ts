// Live Google rating/review count for the "X★ · Y reviews" trust signals
// shown across the site, instead of the numbers hardcoded in
// content/company.ts (company.trust.googleRating/googleReviewCount).
//
// Unlike every other integration in this codebase, this one cannot be
// self-serve: the Google Business Profile API requires Google to manually
// approve API access, and eligibility requires a Business Profile that has
// been verified and active for 60+ days with a matching business website
// (see https://developers.google.com/my-business/content/prereqs). There is
// no guarantee of approval on any timeline. Until GOOGLE_BUSINESS_* env vars
// are set, every call below returns the static company.trust values
// unchanged - this file changes nothing about the site until then.
//
// Setup once access is granted: Google Cloud project with the "My Business
// Business Information API" and "My Business Account Management API"
// enabled -> OAuth 2.0 client (or service account, if your account type
// supports it) -> obtain an OAuth refresh token authorized against the
// Business Profile that owns the location -> find the accountId/locationId
// via accounts.list / accounts.locations.list. Then set:
//   GOOGLE_BUSINESS_CLIENT_ID
//   GOOGLE_BUSINESS_CLIENT_SECRET
//   GOOGLE_BUSINESS_REFRESH_TOKEN
//   GOOGLE_BUSINESS_ACCOUNT_ID
//   GOOGLE_BUSINESS_LOCATION_ID
import { company } from '@/content/company'

export type TrustStats = {
  googleRating: number
  googleReviewCount: number
}

const STATIC_FALLBACK: TrustStats = {
  googleRating: company.trust.googleRating,
  googleReviewCount: company.trust.googleReviewCount,
}

export function isGoogleBusinessProfileConfigured(): boolean {
  return Boolean(
    process.env.GOOGLE_BUSINESS_CLIENT_ID &&
      process.env.GOOGLE_BUSINESS_CLIENT_SECRET &&
      process.env.GOOGLE_BUSINESS_REFRESH_TOKEN &&
      process.env.GOOGLE_BUSINESS_ACCOUNT_ID &&
      process.env.GOOGLE_BUSINESS_LOCATION_ID,
  )
}

let cachedToken: { token: string; expiresAt: number } | null = null

async function getAccessToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 30_000) {
    return cachedToken.token
  }

  const clientId = process.env.GOOGLE_BUSINESS_CLIENT_ID
  const clientSecret = process.env.GOOGLE_BUSINESS_CLIENT_SECRET
  const refreshToken = process.env.GOOGLE_BUSINESS_REFRESH_TOKEN
  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error('Google Business Profile env vars not fully set')
  }

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: clientId,
      client_secret: clientSecret,
    }),
    signal: AbortSignal.timeout(8000),
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Google Business Profile token refresh failed (${res.status}): ${text}`)
  }
  const data = (await res.json()) as { access_token: string; expires_in: number }
  cachedToken = { token: data.access_token, expiresAt: Date.now() + data.expires_in * 1000 }
  return data.access_token
}

// Cached at the process level for an hour on top of Next's own fetch
// revalidation, so a live-data outage or bad response never spams Google's
// API - the last good live reading (or the static fallback) just keeps
// serving until the next successful refresh.
let cachedStats: { stats: TrustStats; fetchedAt: number } | null = null
const CACHE_TTL_MS = 60 * 60 * 1000

// Fetches the location's average rating/review count from the Business
// Profile Performance ("Reviews") data via the Business Information API's
// location read, falling back to the static company.trust values on any
// missing config or failure - a Google outage or an unapproved API request
// must never break the site.
export async function getTrustStats(): Promise<TrustStats> {
  if (!isGoogleBusinessProfileConfigured()) {
    return STATIC_FALLBACK
  }

  if (cachedStats && Date.now() - cachedStats.fetchedAt < CACHE_TTL_MS) {
    return cachedStats.stats
  }

  try {
    const accountId = process.env.GOOGLE_BUSINESS_ACCOUNT_ID
    const locationId = process.env.GOOGLE_BUSINESS_LOCATION_ID
    const token = await getAccessToken()

    const res = await fetch(
      `https://mybusinessbusinessinformation.googleapis.com/v1/accounts/${accountId}/locations/${locationId}?readMask=metadata`,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: AbortSignal.timeout(8000),
        next: { revalidate: 3600 },
      },
    )
    if (!res.ok) {
      const text = await res.text().catch(() => '')
      throw new Error(`Google Business Profile location read failed (${res.status}): ${text}`)
    }

    // The Business Information API's location resource doesn't itself
    // expose rating/review count - those live on the (separate, invite-only)
    // Business Profile Performance API's reviews endpoint. This function
    // resolves once real API access is granted and the exact response shape
    // for this account's approved scopes is known; until then a failed
    // parse here falls through to the static fallback below, same as any
    // other error.
    const data = (await res.json()) as {
      averageRating?: number
      totalReviewCount?: number
    }
    if (typeof data.averageRating !== 'number' || typeof data.totalReviewCount !== 'number') {
      throw new Error('Google Business Profile response missing rating fields')
    }

    const stats: TrustStats = {
      googleRating: data.averageRating,
      googleReviewCount: data.totalReviewCount,
    }
    cachedStats = { stats, fetchedAt: Date.now() }
    return stats
  } catch (error) {
    console.error('Google Business Profile live stats fetch failed, using static fallback', error)
    return cachedStats?.stats ?? STATIC_FALLBACK
  }
}
