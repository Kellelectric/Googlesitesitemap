import { NextRequest, NextResponse } from 'next/server'
import { createRateLimiter, getClientIp } from '@/lib/rateLimit'
import {
  getPendingCareerApplication,
  clearPendingCareerApplication,
} from '@/lib/kv'
import { sendApplicantConfirmationEmail, isResendConfigured } from '@/lib/resendEmail'

export const runtime = 'nodejs'

// Called from careers/thank-you/page.tsx once the applicant finishes the
// Google Form embedded there (apprenticeship/industrial-training/
// internship/nysc-placement - see careerFormRouting.ts), detected via the
// embedded iframe reloading to its own "response recorded" confirmation
// page. Sends the applicant the same "application received" email the
// on-site-only tracks already get at submission time - deferred until now
// because they hadn't actually finished applying yet at the point the
// site's own short form was submitted.
const REFERENCE_RE = /^KE-APP-\d{4}-[A-Z0-9]{6}$/
const isRateLimited = createRateLimiter({ windowMs: 10 * 60 * 1000, max: 10 })

export async function POST(request: NextRequest) {
  const ip = getClientIp(request)
  if (await isRateLimited(ip)) {
    return NextResponse.json({ ok: false, reason: 'rate_limited' }, { status: 429 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ ok: false, reason: 'invalid_json' }, { status: 400 })
  }

  const reference =
    body && typeof body === 'object' && typeof (body as { reference?: unknown }).reference === 'string'
      ? (body as { reference: string }).reference
      : null

  if (!reference || !REFERENCE_RE.test(reference)) {
    return NextResponse.json({ ok: false, reason: 'invalid_payload' }, { status: 422 })
  }

  // Always 200 regardless of outcome - this only drives a best-effort
  // email, and telling the browser whether a reference was found/expired
  // would just be noise the thank-you page doesn't act on anyway.
  const pending = await getPendingCareerApplication(reference)
  if (!pending) {
    return NextResponse.json({ ok: true })
  }

  // Clear first, not after - a slow/failed email send should never leave
  // this claimable again (e.g. from a second onLoad-heuristic firing on
  // the same page), which would send the applicant a duplicate email.
  await clearPendingCareerApplication(reference)

  if (isResendConfigured()) {
    sendApplicantConfirmationEmail(pending).catch((error) => {
      console.error('Applicant confirmation email (best-effort, post-form) failed', error)
    })
  }

  return NextResponse.json({ ok: true })
}
