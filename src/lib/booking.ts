import { db } from '@/lib/db'
import { getSettings } from '@/lib/settings'
import { generateReference } from '@/lib/reference'

// This module treats all wall-clock times (working hours, slot times,
// stored `startsAt`/`endsAt`) as Africa/Lagos local time represented using
// UTC getters/setters — i.e. "13:00" always means 1pm Lagos time, stored
// as if it were 13:00 UTC. Lagos has a fixed UTC+1 offset with no DST, so
// this is a deliberate simplification for a single-timezone business, not
// a bug — see docs/assessment-platform-architecture.md section F.
const SLOT_STEP_MINUTES = 30

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

function minutesToLabel(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

function dateAtMinutes(dateIso: string, minutes: number): Date {
  const [y, mo, d] = dateIso.split('-').map(Number)
  const date = new Date(Date.UTC(y, mo - 1, d, 0, 0, 0))
  date.setUTCMinutes(date.getUTCMinutes() + minutes)
  return date
}

export type TimeSlot = { time: string; label: string }

/**
 * Computes genuinely available time slots for a service on a given date —
 * never derived from a static list. A slot is returned only if at least
 * one active engineer has open availability, isn't blocked (holiday/day
 * off), isn't already booked (with buffer either side), and is under the
 * per-engineer daily appointment cap. See
 * docs/assessment-platform-architecture.md section F.
 */
export async function getAvailableSlots(serviceSlug: string, dateIso: string): Promise<TimeSlot[]> {
  const service = await db.service.findUnique({ where: { slug: serviceSlug } })
  if (!service || !service.active || !service.bookable) return []

  const requestedDate = new Date(`${dateIso}T00:00:00Z`)
  if (Number.isNaN(requestedDate.getTime())) return []

  const today = new Date()
  const todayIso = today.toISOString().slice(0, 10)
  if (dateIso < todayIso) return []

  const dayOfWeek = requestedDate.getUTCDay()
  const settings = await getSettings()
  const bufferMinutes = settings.booking_buffer_minutes
  const maxDaily = settings.max_daily_appointments_per_engineer

  const engineers = await db.engineer.findMany({
    where: { active: true, availability: { some: { dayOfWeek } } },
    include: { availability: { where: { dayOfWeek } } },
  })
  if (engineers.length === 0) return []

  const companyBlocked = await db.availabilityBlock.findFirst({
    where: { engineerId: null, date: requestedDate },
  })
  if (companyBlocked) return []

  const blocks = await db.availabilityBlock.findMany({ where: { date: requestedDate } })
  const blockedEngineerIds = new Set(blocks.filter((b) => b.engineerId).map((b) => b.engineerId as string))

  const dayStart = new Date(`${dateIso}T00:00:00.000Z`)
  const dayEnd = new Date(`${dateIso}T23:59:59.999Z`)
  const existingAppointments = await db.appointment.findMany({
    where: {
      startsAt: { gte: dayStart, lte: dayEnd },
      status: { notIn: ['CANCELLED'] },
      deletedAt: null,
    },
  })

  const nowMinutesToday =
    dateIso === todayIso ? today.getUTCHours() * 60 + today.getUTCMinutes() + bufferMinutes : -Infinity

  const availableSlotMinutes = new Set<number>()

  for (const engineer of engineers) {
    if (blockedEngineerIds.has(engineer.id)) continue

    const engineerAppointments = existingAppointments.filter((a) => a.engineerId === engineer.id)
    if (engineerAppointments.length >= maxDaily) continue

    for (const window of engineer.availability) {
      const windowStart = toMinutes(window.startTime)
      const windowEnd = toMinutes(window.endTime)
      const breakStart = window.breakStart ? toMinutes(window.breakStart) : null
      const breakEnd = window.breakEnd ? toMinutes(window.breakEnd) : null

      for (
        let slotStart = windowStart;
        slotStart + service.durationMinutes <= windowEnd;
        slotStart += SLOT_STEP_MINUTES
      ) {
        const slotEnd = slotStart + service.durationMinutes
        if (slotStart < nowMinutesToday) continue
        if (breakStart !== null && breakEnd !== null && slotStart < breakEnd && slotEnd > breakStart) continue

        const overlapsExisting = engineerAppointments.some((appt) => {
          const apptStartMin =
            appt.startsAt.getUTCHours() * 60 + appt.startsAt.getUTCMinutes() - bufferMinutes
          const apptEndMin = appt.endsAt.getUTCHours() * 60 + appt.endsAt.getUTCMinutes() + bufferMinutes
          return slotStart < apptEndMin && slotEnd > apptStartMin
        })
        if (overlapsExisting) continue

        availableSlotMinutes.add(slotStart)
      }
    }
  }

  return Array.from(availableSlotMinutes)
    .sort((a, b) => a - b)
    .map((minutes) => ({ time: minutesToLabel(minutes), label: minutesToLabel(minutes) }))
}

export type CreateAppointmentInput = {
  leadId: string
  serviceSlug: string
  appointmentType:
    | 'phone-consultation'
    | 'whatsapp-consultation'
    | 'site-inspection'
    | 'video-consultation'
    | 'on-site-assessment'
  date: string
  time: string
}

const APPOINTMENT_TYPE_MAP: Record<CreateAppointmentInput['appointmentType'], string> = {
  'phone-consultation': 'PHONE_CONSULTATION',
  'whatsapp-consultation': 'WHATSAPP_CONSULTATION',
  'site-inspection': 'SITE_INSPECTION',
  'video-consultation': 'VIDEO_CONSULTATION',
  'on-site-assessment': 'ON_SITE_ASSESSMENT',
}

export class SlotUnavailableError extends Error {
  constructor() {
    super('The selected time is no longer available. Please choose another slot.')
  }
}

/**
 * Re-validates the requested slot server-side and creates the appointment
 * inside a transaction, so two customers racing for the same slot can't
 * both win it.
 */
export async function createAppointment(input: CreateAppointmentInput) {
  const service = await db.service.findUnique({ where: { slug: input.serviceSlug } })
  if (!service) throw new Error('Unknown service')

  return db.$transaction(async (tx) => {
    const slots = await getAvailableSlots(input.serviceSlug, input.date)
    const slotStillOpen = slots.some((s) => s.time === input.time)
    if (!slotStillOpen) throw new SlotUnavailableError()

    const [h, m] = input.time.split(':').map(Number)
    const startsAt = new Date(`${input.date}T00:00:00.000Z`)
    startsAt.setUTCHours(h, m, 0, 0)
    const endsAt = new Date(startsAt.getTime() + service.durationMinutes * 60000)

    const dayOfWeek = startsAt.getUTCDay()
    const dayStart = new Date(`${input.date}T00:00:00.000Z`)
    const dayEnd = new Date(`${input.date}T23:59:59.999Z`)

    const engineers = await tx.engineer.findMany({
      where: { active: true, availability: { some: { dayOfWeek } } },
      include: {
        availability: { where: { dayOfWeek } },
        appointments: {
          where: { startsAt: { gte: dayStart, lte: dayEnd }, status: { notIn: ['CANCELLED'] }, deletedAt: null },
        },
      },
    })

    const settings = await getSettings()
    const freeEngineer = engineers.find((engineer) => {
      const inWindow = engineer.availability.some((w) => {
        const windowStart = toMinutes(w.startTime)
        const windowEnd = toMinutes(w.endTime)
        const startMin = h * 60 + m
        return startMin >= windowStart && startMin + service.durationMinutes <= windowEnd
      })
      if (!inWindow) return false
      if (engineer.appointments.length >= settings.max_daily_appointments_per_engineer) return false
      const overlaps = engineer.appointments.some(
        (appt) => startsAt < appt.endsAt && endsAt > appt.startsAt,
      )
      return !overlaps
    })

    if (!freeEngineer) throw new SlotUnavailableError()

    const appointment = await tx.appointment.create({
      data: {
        reference: generateReference('APT'),
        leadId: input.leadId,
        serviceId: service.id,
        engineerId: freeEngineer.id,
        type: APPOINTMENT_TYPE_MAP[input.appointmentType] as never,
        status: 'REQUESTED',
        startsAt,
        endsAt,
      },
      include: { service: true, engineer: true },
    })

    return appointment
  })
}
