import { NextRequest, NextResponse } from 'next/server'
import { createHash, createHmac, randomUUID } from 'node:crypto'
import { createRateLimiter, getClientIp } from '@/lib/rateLimit'
import { verifyHCaptcha } from '@/lib/hcaptcha'
import { getCareerTrackBySlug } from '@/content/careers'
import { getCareerFormRoute } from '@/content/careerFormRouting'

export const runtime = 'nodejs'

// Same short-reference pattern as app/api/quote/route.ts.
function generateApplicationReference(): string {
  const year = new Date().getFullYear()
  const suffix = randomUUID().replace(/-/g, '').slice(0, 6).toUpperCase()
  return `KE-APP-${year}-${suffix}`
}

function signPayload(payload: string, secret: string): string {
  return createHmac('sha256', secret).update(payload).digest('hex')
}

// One-way hash, never the raw IP - enough to spot the same submitter
// retrying without storing anything that identifies them directly.
function hashIp(ip: string): string {
  return createHash('sha256').update(ip).digest('hex').slice(0, 16)
}

type ApplicationPayload = {
  trackSlug: string
  fullName: string
  email: string
  phone: string
  courseOrInstitution?: string
  roleAppliedFor?: string
  cvLink?: string
  message: string
  website?: string // honeypot
  renderedAt?: number
  captchaToken?: string
}

// The outgoing shape sent to CAREERS_WEBHOOK_URL (Zoho Flow, or directly a
// Google Apps Script Web App - see docs/careers-automation.md). Kept
// separate from ApplicationPayload (what the browser sends) since this one
// adds server-computed fields the client never provides.
type CareerApplicationWebhookPayload = {
  reference: string
  source: string
  trackSlug: string
  trackName: string
  fullName: string
  email: string
  phone: string
  courseOrInstitution?: string
  roleAppliedFor?: string
  cvLink?: string
  message: string
  submittedAt: string
  userAgent?: string
  ipHash?: string
}

// Best-effort duplicate guard: the same in-memory-cache tradeoff as
// createRateLimiter in lib/rateLimit.ts - resets on cold start, not shared
// across serverless instances, so it stops a double-click or an
// impatient-retry resubmit from one warm instance, not a determined
// distributed replay. A durable guard (Vercel KV, Zoho Flow's own
// dedupe-by-field feature, or a check inside the Google Apps Script
// against its response sheet) is the real fix if this becomes load-bearing -
// see docs/careers-automation.md.
const DUPLICATE_WINDOW_MS = 2 * 60 * 1000
const recentSubmissions = new Map<string, { reference: string; at: number }>()

function duplicateKey(trackSlug: string, email: string, phone: string): string {
  return createHash('sha256')
    .update(`${trackSlug}|${email.trim().toLowerCase()}|${phone.trim()}`)
    .digest('hex')
}

function findRecentDuplicate(key: string): string | null {
  const entry = recentSubmissions.get(key)
  if (!entry) return null
  if (Date.now() - entry.at > DUPLICATE_WINDOW_MS) {
    recentSubmissions.delete(key)
    return null
  }
  return entry.reference
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function isValidPayload(body: unknown): body is ApplicationPayload {
  if (!body || typeof body !== 'object') return false
  const b = body as Record<string, unknown>
  return (
    typeof b.trackSlug === 'string' &&
    b.trackSlug.trim().length > 0 &&
    typeof b.fullName === 'string' &&
    b.fullName.trim().length > 0 &&
    typeof b.email === 'string' &&
    EMAIL_RE.test(b.email.trim()) &&
    typeof b.phone === 'string' &&
    /^[+0-9\s()-]{7,}$/.test(b.phone.trim()) &&
    typeof b.message === 'string' &&
    b.message.trim().length > 0
  )
}

const MIN_SUBMIT_SECONDS = 3
const MAX_BODY_BYTES = 20_000 // generous for this form's fields; blocks abusive oversized payloads

const isRateLimited = createRateLimiter({ windowMs: 10 * 60 * 1000, max: 5 })

function isAllowedOrigin(request: NextRequest): boolean {
  const allowList = process.env.CAREERS_ALLOWED_ORIGINS
  if (!allowList) return true // unset = no enforcement, same as before this check existed
  const origin = request.headers.get('origin')
  if (!origin) return true // same-origin browser form posts often omit Origin; don't break those
  const allowed = allowList.split(',').map((o) => o.trim())
  return allowed.includes(origin)
}

// Forwards validated career applications to a configurable webhook
// (Zoho Flow, or directly a Google Apps Script Web App) set via
// CAREERS_WEBHOOK_URL - same pattern as QUOTE_WEBHOOK_URL in
// app/api/quote/route.ts. No destination is hardcoded.
// See docs/careers-automation.md for the full pipeline design
// (Zoho Flow -> Google Apps Script -> the correct Google Form ->
// its linked Google Sheet) and what still needs external configuration.
export async function POST(request: NextRequest) {
  const ip = getClientIp(request)
  if (isRateLimited(ip)) {
    return NextResponse.json({ ok: false, reason: 'rate_limited' }, { status: 429 })
  }

  if (!isAllowedOrigin(request)) {
    return NextResponse.json({ ok: false, reason: 'origin_not_allowed' }, { status: 403 })
  }

  const contentLength = Number(request.headers.get('content-length') ?? '0')
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json({ ok: false, reason: 'payload_too_large' }, { status: 413 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ ok: false, reason: 'invalid_json' }, { status: 400 })
  }

  if (!isValidPayload(body)) {
    return NextResponse.json({ ok: false, reason: 'invalid_payload' }, { status: 422 })
  }

  const track = getCareerTrackBySlug(body.trackSlug)
  if (!track) {
    return NextResponse.json({ ok: false, reason: 'invalid_payload' }, { status: 422 })
  }

  // Observability only, never blocking: every current track has a
  // confirmed entry in careerFormRouting.ts (apprenticeship,
  // industrial-training, and internship route to a real Google Form;
  // job-openings and nysc-placement are confirmed as staying on-site).
  // This only fires if a future new career track is added to careers.ts
  // without a matching careerFormRouting.ts entry - it still forwards to
  // CAREERS_WEBHOOK_URL as normal, this just surfaces the gap in Vercel's
  // logs rather than letting it land nowhere silently once Zoho Flow's
  // router is live.
  if (!getCareerFormRoute(body.trackSlug)) {
    console.warn(
      `Career application for unmapped track "${body.trackSlug}" (ref pending) - no Google Form route configured. See src/content/careerFormRouting.ts.`,
    )
  }

  if (body.website && body.website.trim().length > 0) {
    return NextResponse.json({ ok: true })
  }

  if (typeof body.renderedAt === 'number') {
    const elapsedSeconds = (Date.now() - body.renderedAt) / 1000
    if (elapsedSeconds < MIN_SUBMIT_SECONDS) {
      return NextResponse.json({ ok: true })
    }
  }

  const hcaptchaSecret = process.env.HCAPTCHA_SECRET_KEY
  if (hcaptchaSecret) {
    const token = typeof body.captchaToken === 'string' ? body.captchaToken : ''
    if (token && !(await verifyHCaptcha(token, hcaptchaSecret))) {
      return NextResponse.json({ ok: false, reason: 'captcha_failed' }, { status: 422 })
    }
  }

  const webhookUrl = process.env.CAREERS_WEBHOOK_URL
  if (!webhookUrl) {
    console.error(
      'CAREERS_WEBHOOK_URL is not configured - application was received but not forwarded anywhere.',
    )
    return NextResponse.json({ ok: false, reason: 'not_configured' }, { status: 503 })
  }

  // Best-effort duplicate guard, keyed on track + email + phone (see
  // findRecentDuplicate's comment) - a double-click, a slow-network retry,
  // or the applicant re-submitting the same details within the window
  // returns the existing reference instead of creating a second downstream
  // application.
  const dupKey = duplicateKey(body.trackSlug, body.email, body.phone)
  const existingReference = findRecentDuplicate(dupKey)
  if (existingReference) {
    return NextResponse.json({ ok: true, duplicate: true, reference: existingReference })
  }

  const reference = generateApplicationReference()

  // Built explicitly (not `...body`) so the honeypot field, the raw
  // hCaptcha response token, and renderedAt never leak into the
  // downstream payload - none of that is useful to Zoho Flow or the
  // Google Form, and the spec this pipeline follows is explicit that only
  // the fields actually needed should be sent.
  const webhookPayload: CareerApplicationWebhookPayload = {
    reference,
    source: 'kellelectricals.com careers application form',
    trackSlug: body.trackSlug,
    trackName: track.name,
    fullName: body.fullName,
    email: body.email,
    phone: body.phone,
    courseOrInstitution: body.courseOrInstitution,
    roleAppliedFor: body.roleAppliedFor,
    cvLink: body.cvLink,
    message: body.message,
    submittedAt: new Date().toISOString(),
    userAgent: request.headers.get('user-agent') ?? undefined,
    ipHash: ip !== 'unknown' ? hashIp(ip) : undefined,
  }
  const payload = JSON.stringify(webhookPayload)
  const secret = process.env.CAREERS_WEBHOOK_SECRET
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (secret) {
    headers['x-webhook-signature'] = signPayload(payload, secret)
  }

  const maxAttempts = 2
  let lastError: unknown
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const forwarded = await fetch(webhookUrl, {
        method: 'POST',
        headers,
        body: payload,
        signal: AbortSignal.timeout(8000),
      })

      if (forwarded.ok) {
        recentSubmissions.set(dupKey, { reference, at: Date.now() })
        return NextResponse.json({ ok: true, reference })
      }

      const responseText = await forwarded.text()
      console.error('Careers webhook forward failed', forwarded.status, responseText)
      if (forwarded.status < 500 || attempt === maxAttempts) {
        return NextResponse.json({ ok: false, reason: 'forward_failed' }, { status: 502 })
      }
    } catch (error) {
      lastError = error
      console.error(`Careers webhook forward errored (attempt ${attempt}/${maxAttempts})`, error)
    }

    if (attempt < maxAttempts) {
      await new Promise((resolve) => setTimeout(resolve, 500))
    }
  }

  if (lastError) {
    return NextResponse.json({ ok: false, reason: 'forward_errored' }, { status: 502 })
  }
  return NextResponse.json({ ok: false, reason: 'forward_failed' }, { status: 502 })
}
