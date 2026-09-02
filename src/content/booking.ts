export type EngagementType = {
  slug: string
  label: string
  description: string
}

// Distinct from the general services list — these are the specific
// engagement types worth reserving a technician's time for, aimed at
// commercial/industrial decision-makers scoping a contractor before
// committing budget.
export const engagementTypes: EngagementType[] = [
  {
    slug: 'commercial-site-assessment',
    label: 'Commercial site assessment',
    description: 'Load audit, panel/switchgear review, and a scoped proposal for an office, retail, or hospitality site.',
  },
  {
    slug: 'industrial-site-assessment',
    label: 'Industrial site assessment',
    description: 'Three-phase distribution, motor control, and factory-floor electrical infrastructure review.',
  },
  {
    slug: 'solar-energy-consultation',
    label: 'Solar & energy consultation',
    description: 'Load analysis and system sizing for a hybrid inverter or solar installation.',
  },
  {
    slug: 'compliance-review',
    label: 'Compliance & safety review',
    description: 'COREN/NEMSA-standard earthing, lightning protection, and compliance documentation review.',
  },
]

export type TimeSlot = {
  id: string
  label: string
}

// Fixed business-hours windows, not a live calendar feed — see BookingForm
// for how this is worded to the visitor (a preferred window we confirm
// within one business day, not a guaranteed live booking).
export const timeSlots: TimeSlot[] = [
  { id: 'morning-early', label: '9:00 – 11:00' },
  { id: 'morning-late', label: '11:00 – 13:00' },
  { id: 'afternoon-early', label: '13:00 – 15:00' },
  { id: 'afternoon-late', label: '15:00 – 17:00' },
]

/** Next `count` weekdays starting tomorrow, skipping Sat/Sun. */
export function getUpcomingBusinessDays(count: number, from: Date = new Date()): Date[] {
  const days: Date[] = []
  const cursor = new Date(from)
  cursor.setHours(0, 0, 0, 0)
  cursor.setDate(cursor.getDate() + 1)

  while (days.length < count) {
    const day = cursor.getDay()
    if (day !== 0 && day !== 6) {
      days.push(new Date(cursor))
    }
    cursor.setDate(cursor.getDate() + 1)
  }
  return days
}
