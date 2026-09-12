import { NextRequest, NextResponse } from 'next/server'
import { createHash, createHmac, randomUUID } from 'node:crypto'
import { createRateLimiter, getClientIp } from '@/lib/rateLimit'
import {
  getDuplicateReference,
  markDuplicateReference,
  markPendingCareerApplication,
} from '@/lib/kv'
import { getCareerTrackBySlug } from '@/content/careers'
import { buildPrefillUrl, getCareerFormRoute } from '@/content/careerFormRouting'
import { createCareerLead, isZohoCrmConfigured } from '@/lib/zohoCrm'
import { sendCareerSlackNotification, isSlackNotifyConfigured } from '@/lib/slackNotify'
import {
  sendApplicantConfirmationEmail,
  sendInternalNotificationEmail,
  isResendConfigured,
  isCareerNotifyEmailConfigured,
} from '@/lib/resendEmail'

export const runtime = 'nodejs'

// Google Apps Script Web Apps respond to a POST at .../exec with an empty
// 302 redirect to a one-time script.googleusercontent.com/macros/echo URL
// that carries the real response body. Node's fetch() `redirect: 'follow'`
// (the default) converts that redirect's method to GET per the WHATWG spec
// - normally harmless - but was confirmed during live testing this round to
// intermittently fail against this specific redirect chain (manually
// verified with curl: the redirect had to be followed as an explicit,
// separate GET request to come back reliably). Handled manually here so
// CAREERS_WEBHOOK_URL pointed at an Apps Script deployment works
// deterministically; a non-redirecting receiver (e.g. Zoho Flow) is
// unaffected since this only branches on a 3xx response.
async function postToWebhook(
  url: string,
  headers: Record<string, string>,
  body: string,
): Promise<Response> {
  const initial = await fetch(url, {
    method: 'POST',
    headers,
    body,
    redirect: 'manual',
    signal: AbortSignal.timeout(8000),
  })
  if (initial.status >= 300 && initial.status < 400) {
    const location = initial.headers.get('location')
    if (location) {
      return fetch(location, { method: 'GET', signal: AbortSignal.timeout(8000) })
    }
  }
  return initial
}

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
  // Only required/validated for the abujaOnly tracks (nysc-placement,
  // industrial-training, apprenticeship) - see careers.ts's `abujaOnly`
  // field and CareerApplicationForm's own gate, which already blocks a
  // non-Abuja submission client-side. Re-checked here since a client-side
  // gate is never a substitute for server-side validation.
  state?: string
  courseOrInstitution?: string
  roleAppliedFor?: string
  cvLink?: string
  message: string
  website?: string // honeypot
  renderedAt?: number
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
  state?: string
  courseOrInstitution?: string
  roleAppliedFor?: string
  cvLink?: string
  message: string
  submittedAt: string
  userAgent?: string
  ipHash?: string
  // Only present for apprenticeship/industrial-training/internship - lets
  // the Apps Script webhook send a "continue your application" email with
  // the same pre-filled link the applicant already sees on the thank-you
  // page, instead of a misleading "application received" (they haven't
  // finished the real form yet at this point).
  redirectUrl?: string
}

// Duplicate guard: Redis-backed (src/lib/kv.ts) when UPSTASH_REDIS_REST_URL/
// TOKEN are set - durable across serverless instances and cold starts, so
// it actually stops a double-click or impatient-retry resubmit no matter
// which instance handles which request. Falls back to the original
// in-memory Map otherwise (resets on cold start, not shared across
// instances - stops the same abuse from one warm instance, nothing more).
// Only marked as seen after a successful downstream forward (see the two
// markRecentSubmission() calls below) - a genuine failure shouldn't block
// a real retry.
const DUPLICATE_WINDOW_SECONDS = 2 * 60
// How long an applicant has to finish the embedded Google Form on the
// thank-you page (see PendingCareerApplication in kv.ts) before the
// "application received" confirmation email can no longer be sent for it
// - generous, since these forms require a photo, ID/documents, and a
// signature that not everyone has ready immediately.
const PENDING_APPLICATION_TTL_SECONDS = 48 * 60 * 60
const recentSubmissions = new Map<string, { reference: string; at: number }>()

function duplicateKey(trackSlug: string, email: string, phone: string): string {
  return createHash('sha256')
    .update(`dupguard|${trackSlug}|${email.trim().toLowerCase()}|${phone.trim()}`)
    .digest('hex')
}

async function findRecentDuplicate(key: string): Promise<string | null> {
  const redisValue = await getDuplicateReference(key)
  if (redisValue !== null) return redisValue

  const entry = recentSubmissions.get(key)
  if (!entry) return null
  if (Date.now() - entry.at > DUPLICATE_WINDOW_SECONDS * 1000) {
    recentSubmissions.delete(key)
    return null
  }
  return entry.reference
}

async function markRecentSubmission(key: string, reference: string): Promise<void> {
  await markDuplicateReference(key, reference, DUPLICATE_WINDOW_SECONDS)
  recentSubmissions.set(key, { reference, at: Date.now() })
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

// For apprenticeship/industrial-training/internship, hands back a
// pre-filled Google Form link (see careerFormRouting.ts) - that form's
// own linked Sheet is the record, no webhook is required. For
// job-openings/nysc-placement (no Google Form), forwards to a
// configurable webhook set via CAREERS_WEBHOOK_URL - same pattern as
// QUOTE_WEBHOOK_URL in app/api/quote/route.ts. No destination is
// hardcoded. See docs/careers-automation.md for the full design and what
// still needs external configuration.
export async function POST(request: NextRequest) {
  const ip = getClientIp(request)
  if (await isRateLimited(ip)) {
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

  // Server-side re-check of CareerApplicationForm's own client-side gate -
  // a client-side check alone can always be bypassed by posting directly
  // to this endpoint, and this is a real eligibility rule (client
  // direction: NYSC Placement/Industrial Training/Apprenticeship only
  // accept applicants currently based in Abuja), not just a UX nicety.
  if (track.abujaOnly && body.state !== 'FCT (Abuja)') {
    return NextResponse.json({ ok: false, reason: 'not_abuja' }, { status: 422 })
  }

  // Observability only, never blocking: every current track has a
  // confirmed entry in careerFormRouting.ts (apprenticeship,
  // industrial-training, and internship route to a real Google Form;
  // job-openings and nysc-placement are confirmed as staying on-site).
  // This only fires if a future new career track is added to careers.ts
  // without a matching careerFormRouting.ts entry.
  const formRoute = getCareerFormRoute(body.trackSlug)
  if (!formRoute) {
    console.warn(
      `Career application for unmapped track "${body.trackSlug}" (ref pending) - no route configured. See src/content/careerFormRouting.ts.`,
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

  // Best-effort duplicate guard, keyed on track + email + phone (see
  // findRecentDuplicate's comment) - a double-click, a slow-network retry,
  // or the applicant re-submitting the same details within the window
  // returns the existing reference instead of creating a second downstream
  // application.
  const dupKey = duplicateKey(body.trackSlug, body.email, body.phone)
  const existingReference = await findRecentDuplicate(dupKey)
  if (existingReference) {
    return NextResponse.json({ ok: true, duplicate: true, reference: existingReference })
  }

  const reference = generateApplicationReference()

  // apprenticeship / industrial-training / internship: the Google Form's
  // own pre-filled link IS the delivery mechanism here (see
  // careerFormRouting.ts for why - these forms have required file uploads
  // Apps Script can never submit programmatically). CAREERS_WEBHOOK_URL is
  // optional on this path, purely for an internal "application started"
  // notification if configured - its failure never blocks the applicant
  // from reaching the form, and it isn't retried.
  const redirectUrl = formRoute
    ? buildPrefillUrl(formRoute, {
        fullName: body.fullName,
        email: body.email,
        phone: body.phone,
        institution: body.courseOrInstitution,
      })
    : null

  // Built explicitly (not `...body`) so the honeypot field and renderedAt
  // never leak into the downstream payload - none of that is useful
  // downstream, and the spec this pipeline follows is explicit that only
  // the fields actually needed should be sent.
  const webhookPayload: CareerApplicationWebhookPayload = {
    reference,
    source: 'kellelectricals.com careers application form',
    trackSlug: body.trackSlug,
    trackName: track.name,
    fullName: body.fullName,
    email: body.email,
    phone: body.phone,
    state: body.state,
    courseOrInstitution: body.courseOrInstitution,
    roleAppliedFor: body.roleAppliedFor,
    cvLink: body.cvLink,
    message: body.message,
    submittedAt: new Date().toISOString(),
    userAgent: request.headers.get('user-agent') ?? undefined,
    ipHash: ip !== 'unknown' ? hashIp(ip) : undefined,
    redirectUrl: redirectUrl ?? undefined,
  }
  // Direct integrations, independent of CAREERS_WEBHOOK_URL - each one is
  // env-var gated (see src/lib/zohoCrm.ts, slackNotify.ts, resendEmail.ts)
  // and fires for every track, not just job-openings/nysc-placement, since
  // a CRM record / team notification is useful regardless of whether the
  // applicant also gets redirected to a Google Form. Fire-and-forget -
  // never awaited, never blocks or fails the applicant's own response.
  // hasFormRedirect (kept before webhookPayload was built - see
  // `redirectUrl` above) governs whether an *applicant-confirmation* email
  // makes sense here (the Apps Script webhook, if configured, sends its
  // own "finish the form" email instead for that path - see careers-
  // automation.md's duplicate-email note in careerApplicationRouter.gs).
  if (isZohoCrmConfigured()) {
    createCareerLead({
      fullName: body.fullName,
      email: body.email,
      phone: body.phone,
      trackName: track.name,
      roleAppliedFor: body.roleAppliedFor,
      courseOrInstitution: body.courseOrInstitution,
      cvLink: body.cvLink,
      message: body.message,
      reference,
    }).catch((error) => {
      console.error('Zoho CRM lead create (best-effort) failed', error)
    })
  }

  if (isSlackNotifyConfigured()) {
    sendCareerSlackNotification({
      reference,
      trackName: track.name,
      fullName: body.fullName,
      email: body.email,
      phone: body.phone,
      roleAppliedFor: body.roleAppliedFor,
      cvLink: body.cvLink,
    }).catch((error) => {
      console.error('Slack notification (best-effort) failed', error)
    })
  }

  if (isCareerNotifyEmailConfigured()) {
    sendInternalNotificationEmail({
      reference,
      trackName: track.name,
      fullName: body.fullName,
      email: body.email,
      phone: body.phone,
      courseOrInstitution: body.courseOrInstitution,
      roleAppliedFor: body.roleAppliedFor,
      cvLink: body.cvLink,
      message: body.message,
      submittedAt: webhookPayload.submittedAt,
    }).catch((error) => {
      console.error('Internal notification email (best-effort) failed', error)
    })
  }

  if (isResendConfigured() && !redirectUrl) {
    // Only for tracks without a Google Form redirect - the redirect
    // tracks' own applicant email is "finish your application", sent by
    // the Apps Script webhook if configured, not "received" (they haven't
    // finished yet). See the duplicate-email note above.
    sendApplicantConfirmationEmail({
      reference,
      trackName: track.name,
      fullName: body.fullName,
      email: body.email,
      phone: body.phone,
      courseOrInstitution: body.courseOrInstitution,
      roleAppliedFor: body.roleAppliedFor,
      cvLink: body.cvLink,
      message: body.message,
      submittedAt: webhookPayload.submittedAt,
    }).catch((error) => {
      console.error('Applicant confirmation email (best-effort) failed', error)
    })
  }

  const payload = JSON.stringify(webhookPayload)
  const secret = process.env.CAREERS_WEBHOOK_SECRET
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  let webhookUrl = process.env.CAREERS_WEBHOOK_URL
  if (secret) {
    const signature = signPayload(payload, secret)
    headers['x-webhook-signature'] = signature
    // Google Apps Script Web Apps cannot read custom HTTP headers on an
    // incoming request at all (no e.headers in doPost) - only Content-Type
    // and URL query parameters are visible to the script. The header above
    // is kept for any non-Apps-Script receiver (e.g. a Zoho Flow webhook)
    // that CAREERS_WEBHOOK_URL might point to instead, but the query param
    // below is what careerApplicationRouter.gs's doPost actually reads
    // (e.parameter['x-webhook-signature'], checked first in its
    // verifySignature branch).
    if (webhookUrl) {
      const urlWithSignature = new URL(webhookUrl)
      urlWithSignature.searchParams.set('x-webhook-signature', signature)
      webhookUrl = urlWithSignature.toString()
    }
  }

  if (redirectUrl) {
    if (webhookUrl) {
      postToWebhook(webhookUrl, headers, payload).catch((error) => {
        console.error('Careers webhook forward (best-effort, Google Form track) failed', error)
      })
    }
    await markRecentSubmission(dupKey, reference)
    // Best-effort - if Redis isn't configured this simply means the
    // "application received" email (POST /api/careers-application/
    // form-submitted, triggered once the applicant finishes the embedded
    // Google Form on the thank-you page) won't be sent; the on-page
    // confirmation still shows either way.
    markPendingCareerApplication(
      {
        reference,
        trackName: track.name,
        fullName: body.fullName,
        email: body.email,
        phone: body.phone,
        courseOrInstitution: body.courseOrInstitution,
        roleAppliedFor: body.roleAppliedFor,
        cvLink: body.cvLink,
        message: body.message,
        submittedAt: webhookPayload.submittedAt,
      },
      PENDING_APPLICATION_TTL_SECONDS,
    ).catch((error) => {
      console.error('Storing pending career application (best-effort) failed', error)
    })
    return NextResponse.json({ ok: true, reference, redirectUrl })
  }

  // job-openings / nysc-placement: no Google Form, so CAREERS_WEBHOOK_URL
  // is the only delivery path - required, and forwarding failures below
  // are fatal to the request (existing retry behavior).
  if (!webhookUrl) {
    console.error(
      'CAREERS_WEBHOOK_URL is not configured - application was received but not forwarded anywhere.',
    )
    return NextResponse.json({ ok: false, reason: 'not_configured' }, { status: 503 })
  }

  const maxAttempts = 2
  let lastError: unknown
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const forwarded = await postToWebhook(webhookUrl, headers, payload)

      if (forwarded.ok) {
        await markRecentSubmission(dupKey, reference)
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
