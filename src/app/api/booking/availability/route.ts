import { NextRequest, NextResponse } from 'next/server'
import { getAvailableSlots } from '@/lib/booking'
import { rateLimit, clientKeyFromRequest } from '@/lib/rateLimit'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  const limit = rateLimit(clientKeyFromRequest(request, 'booking-availability'), 60, 60_000)
  if (!limit.allowed) {
    return NextResponse.json({ ok: false, reason: 'rate_limited' }, { status: 429 })
  }

  const { searchParams } = new URL(request.url)
  const service = searchParams.get('service')
  const date = searchParams.get('date')

  if (!service || !date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ ok: false, reason: 'invalid_params' }, { status: 400 })
  }

  const slots = await getAvailableSlots(service, date)
  return NextResponse.json({ ok: true, slots })
}
