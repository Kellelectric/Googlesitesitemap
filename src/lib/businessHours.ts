// Shared by lib/schema.ts (schema.org openingHoursSpecification) and the
// booking slot generator (lib/bookingSlots.ts) - business hours are
// authored as free text ("Monday – Friday", "8:00 AM – 5:00 PM") for
// human display in content/company.ts, and both consumers need the same
// day-list/24-hour-time parsing rather than two copies that could drift.
const dayOrder = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
]

export function expandDayRange(days: string): string[] {
  if (!days.includes('–') && !days.includes('-')) return [days.trim()]
  const [start, end] = days.split(/[–-]/).map((d) => d.trim())
  const startIdx = dayOrder.indexOf(start)
  const endIdx = dayOrder.indexOf(end)
  if (startIdx === -1 || endIdx === -1) return [days.trim()]
  return dayOrder.slice(startIdx, endIdx + 1)
}

export function to24Hour(time: string): string {
  const match = time.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i)
  if (!match) return time
  let [, hourStr, minute, meridiem] = match
  let hour = parseInt(hourStr, 10)
  if (meridiem.toUpperCase() === 'PM' && hour !== 12) hour += 12
  if (meridiem.toUpperCase() === 'AM' && hour === 12) hour = 0
  return `${String(hour).padStart(2, '0')}:${minute}`
}
