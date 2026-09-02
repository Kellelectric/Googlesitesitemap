import { NextRequest, NextResponse } from 'next/server'
import { getBusyPeriods, isCalendarConfigured } from '@/lib/googleCalendar'
import {
  computeAvailableSlots,
  isDateBookable,
  localSlotToDate,
  MAX_ADVANCE_DAYS,
  SLOT_MINUTES,
} from '@/lib/bookingSlots'
import { createRateLimiter, getClientIp } from '@/lib/rateLimit'

export const runtime = 'nodejs'

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/

// Availability is read-only but still worth rate limiting - each request
// makes a real call to the Google Calendar API, and this endpoint has no
// other spam protection (no form to fill in yet, no honeypot to trip).
const isRateLimited = createRateLimiter({ windowMs: 60 * 1000, max: 30 })

export async function GET(request: NextRequest) {
  const ip = getClientIp(request)
  if (isRateLimited(ip)) {
    return NextResponse.json({ ok: false, reason: 'rate_limited' }, { status: 429 })
  }

  if (!isCalendarConfigured()) {
    return NextResponse.json({ ok: false, reason: 'not_configured' }, { status: 503 })
  }

  const date = request.nextUrl.searchParams.get('date') ?? ''
  if (!DATE_RE.test(date)) {
    return NextResponse.json({ ok: false, reason: 'invalid_date' }, { status: 400 })
  }

  const todayStr = new Date().toISOString().slice(0, 10)
  const maxDate = new Date(Date.now() + MAX_ADVANCE_DAYS * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10)
  if (date < todayStr || date > maxDate) {
    return NextResponse.json({ ok: false, reason: 'out_of_range' }, { status: 400 })
  }

  if (!isDateBookable(date)) {
    return NextResponse.json({ ok: true, slots: [] })
  }

  try {
    // Whole-day UTC window covering every possible business-hours slot
    // for this date, so a single freeBusy call covers the full grid
    // computeAvailableSlots then narrows against.
    const dayStart = localSlotToDate(date, 0).toISOString()
    const dayEnd = localSlotToDate(date, 24 * 60).toISOString()
    const busy = await getBusyPeriods(dayStart, dayEnd)
    const slots = computeAvailableSlots(date, busy)
    return NextResponse.json({ ok: true, slots, slotMinutes: SLOT_MINUTES })
  } catch (error) {
    console.error('Availability lookup failed', error)
    return NextResponse.json({ ok: false, reason: 'lookup_failed' }, { status: 502 })
  }
}
