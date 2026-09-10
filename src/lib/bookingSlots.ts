import { company } from '@/content/company'
import { expandDayRange, to24Hour } from '@/lib/businessHours'

// Type-only import (erased at compile time) so this module — used from
// both server routes and the client BookingWidget — never actually pulls
// in googleCalendar.ts's `node:crypto` usage into the browser bundle.
import type { BusyPeriod } from '@/lib/googleCalendar'

// Nigeria doesn't observe daylight saving, so Africa/Lagos is a fixed
// UTC+1 offset year-round - safe to hardcode rather than needing a full
// timezone library just to convert a wall-clock slot time to an instant.
const LAGOS_UTC_OFFSET_HOURS = 1
export const BOOKING_TIMEZONE = 'Africa/Lagos'
export const SLOT_MINUTES = 60
// A booking must start at least this far from "now" - keeps the last
// slot of the business day from being requestable one minute before
// it starts, giving the team a realistic amount of notice.
const MIN_LEAD_HOURS = 2
// How many days ahead the calendar can be booked.
export const MAX_ADVANCE_DAYS = 21

const dayOrderSundayFirst = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]

function parseMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

// Business hours for a given calendar date (YYYY-MM-DD), or null if the
// business is closed that day - derived from company.businessHours via
// the same parsing schema.org's markup uses, never a separate hardcoded
// schedule that could drift from what the site already states.
function getBusinessHoursForDate(dateStr: string): { opensMin: number; closesMin: number } | null {
  const [y, m, d] = dateStr.split('-').map(Number)
  const dayName = dayOrderSundayFirst[new Date(Date.UTC(y, m - 1, d)).getUTCDay()]
  const entry = company.businessHours.find((e) => expandDayRange(e.days).includes(dayName))
  if (!entry || entry.hours === 'Closed') return null
  const [openStr, closeStr] = entry.hours.split(/[–-]/).map((t) => to24Hour(t.trim()))
  return { opensMin: parseMinutes(openStr), closesMin: parseMinutes(closeStr) }
}

// Converts a calendar date + local wall-clock minute-of-day (Africa/Lagos)
// into a UTC Date - the single conversion point every other function in
// this file and the booking API routes build on.
export function localSlotToDate(dateStr: string, minuteOfDay: number): Date {
  const [y, m, d] = dateStr.split('-').map(Number)
  const utcMs =
    Date.UTC(y, m - 1, d, 0, minuteOfDay, 0) - LAGOS_UTC_OFFSET_HOURS * 60 * 60 * 1000
  return new Date(utcMs)
}

function nowUtcMs(): number {
  return Date.now()
}

// Every candidate slot start time (as "HH:mm" in Africa/Lagos) for a
// date, before checking the calendar's real busy periods - the full
// business-hours grid, not yet narrowed by anything.
function candidateSlotsForDate(dateStr: string): string[] {
  const hours = getBusinessHoursForDate(dateStr)
  if (!hours) return []
  const slots: string[] = []
  for (let start = hours.opensMin; start + SLOT_MINUTES <= hours.closesMin; start += SLOT_MINUTES) {
    slots.push(`${String(Math.floor(start / 60)).padStart(2, '0')}:${String(start % 60).padStart(2, '0')}`)
  }
  return slots
}

function slotOverlapsBusy(dateStr: string, minuteOfDay: number, busy: BusyPeriod[]): boolean {
  const slotStart = localSlotToDate(dateStr, minuteOfDay).getTime()
  const slotEnd = slotStart + SLOT_MINUTES * 60 * 1000
  return busy.some((period) => {
    const busyStart = new Date(period.start).getTime()
    const busyEnd = new Date(period.end).getTime()
    return slotStart < busyEnd && slotEnd > busyStart
  })
}

// Candidate slots minus whatever the calendar's real freeBusy response
// says is already booked, minus anything inside the minimum-lead window.
export function computeAvailableSlots(dateStr: string, busy: BusyPeriod[]): string[] {
  const candidates = candidateSlotsForDate(dateStr)
  const earliestBookable = nowUtcMs() + MIN_LEAD_HOURS * 60 * 60 * 1000
  return candidates.filter((hhmm) => {
    const minuteOfDay = parseMinutes(hhmm)
    if (localSlotToDate(dateStr, minuteOfDay).getTime() < earliestBookable) return false
    return !slotOverlapsBusy(dateStr, minuteOfDay, busy)
  })
}

export function isDateBookable(dateStr: string): boolean {
  return getBusinessHoursForDate(dateStr) !== null
}
