import { db } from '@/lib/db'

export type BusinessHours = { start: string; end: string; timezone: string }

const DEFAULTS = {
  business_hours: { start: '08:00', end: '18:00', timezone: 'Africa/Lagos' } as BusinessHours,
  booking_buffer_minutes: 30,
  booking_travel_minutes: 30,
  max_daily_appointments_per_engineer: 6,
  emergency_available: true,
  whatsapp_number: '2348140205895',
  notification_email: 'info@kellelectricals.com',
  currency: 'NGN',
} as const

export type SettingsMap = typeof DEFAULTS

export async function getSettings(): Promise<SettingsMap> {
  const rows = await db.setting.findMany()
  const map = { ...DEFAULTS } as Record<string, unknown>
  for (const row of rows) {
    if (row.key in map) {
      map[row.key] = row.value
    }
  }
  return map as SettingsMap
}

export async function getSetting<K extends keyof SettingsMap>(key: K): Promise<SettingsMap[K]> {
  const row = await db.setting.findUnique({ where: { key } })
  return (row ? (row.value as SettingsMap[K]) : DEFAULTS[key])
}
