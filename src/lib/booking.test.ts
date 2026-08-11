import { describe, expect, it } from 'vitest'
import { getAvailableSlots } from './booking'

// Integration tests against the real seeded Postgres database (DATABASE_URL
// from .env) — availability must never be computed from a static list, so
// these exercise the actual query path rather than mocking it.

function nextDateForWeekday(targetDayOfWeek: number): string {
  const date = new Date()
  date.setDate(date.getDate() + 1) // start from tomorrow, never "today" with edge-of-day flakiness
  while (date.getUTCDay() !== targetDayOfWeek) {
    date.setDate(date.getDate() + 1)
  }
  return date.toISOString().slice(0, 10)
}

describe('getAvailableSlots', () => {
  it('returns real, correctly formatted slots on a weekday for a seeded service', async () => {
    const monday = nextDateForWeekday(1)
    const slots = await getAvailableSlots('electrical-site-assessment', monday)
    expect(slots.length).toBeGreaterThan(0)
    for (const slot of slots) {
      expect(slot.time).toMatch(/^\d{2}:\d{2}$/)
    }
  })

  it('returns no slots on a Sunday, since no seeded engineer works Sundays', async () => {
    const sunday = nextDateForWeekday(0)
    const slots = await getAvailableSlots('electrical-site-assessment', sunday)
    expect(slots).toEqual([])
  })

  it('returns no slots for a date in the past', async () => {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const slots = await getAvailableSlots('electrical-site-assessment', yesterday.toISOString().slice(0, 10))
    expect(slots).toEqual([])
  })

  it('returns no slots for an unknown service slug', async () => {
    const monday = nextDateForWeekday(1)
    const slots = await getAvailableSlots('not-a-real-service', monday)
    expect(slots).toEqual([])
  })

  it('excludes the lunch break window from returned slots', async () => {
    const monday = nextDateForWeekday(1)
    const slots = await getAvailableSlots('fault-finding-diagnostics', monday)
    // fault-finding-diagnostics is a 90-minute service; a slot starting at
    // 13:00 would run into every engineer's 13:00-14:00 break.
    expect(slots.some((s) => s.time === '13:00')).toBe(false)
  })
})
