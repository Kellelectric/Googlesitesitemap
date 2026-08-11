import type { Metadata } from 'next'
import { revalidatePath } from 'next/cache'
import { requireAdminSession } from '@/lib/requireAdmin'
import { AdminShell } from '@/components/admin/AdminShell'
import { db } from '@/lib/db'
import { getSettings } from '@/lib/settings'
import { writeAuditLog } from '@/lib/auditLog'
import { getSession } from '@/lib/auth'

export const metadata: Metadata = { title: 'Settings', robots: { index: false, follow: false } }

export default async function AdminSettingsPage() {
  const session = await requireAdminSession('ADMINISTRATOR')
  const settings = await getSettings()

  async function updateSettings(formData: FormData) {
    'use server'
    const current = await getSession()
    const updates: { key: string; value: unknown }[] = [
      {
        key: 'business_hours',
        value: {
          start: formData.get('businessStart'),
          end: formData.get('businessEnd'),
          timezone: 'Africa/Lagos',
        },
      },
      { key: 'booking_buffer_minutes', value: Number(formData.get('bookingBuffer')) },
      { key: 'max_daily_appointments_per_engineer', value: Number(formData.get('maxDaily')) },
      { key: 'whatsapp_number', value: String(formData.get('whatsappNumber')) },
      { key: 'notification_email', value: String(formData.get('notificationEmail')) },
      { key: 'emergency_available', value: formData.get('emergencyAvailable') === 'on' },
    ]

    for (const update of updates) {
      await db.setting.upsert({
        where: { key: update.key },
        update: { value: update.value as never },
        create: { key: update.key, value: update.value as never },
      })
    }

    await writeAuditLog({
      adminUserId: current?.adminUserId,
      action: 'settings.update',
      entityType: 'Setting',
      entityId: 'business',
      newValue: updates,
    })

    revalidatePath('/admin/settings')
  }

  return (
    <AdminShell session={session}>
      <h1 className="font-display text-2xl font-semibold text-ink">Settings</h1>
      <p className="mt-1 text-sm text-ink/50">Business hours, booking rules, and notification routing.</p>

      <form action={updateSettings} className="mt-6 max-w-xl space-y-6 rounded border border-ink/10 bg-white p-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="businessStart" className="mb-1.5 block text-sm font-semibold text-ink">
              Business hours start
            </label>
            <input id="businessStart" name="businessStart" type="time" defaultValue={settings.business_hours.start} className="w-full rounded border border-ink/20 px-3 py-2.5 text-sm" />
          </div>
          <div>
            <label htmlFor="businessEnd" className="mb-1.5 block text-sm font-semibold text-ink">
              Business hours end
            </label>
            <input id="businessEnd" name="businessEnd" type="time" defaultValue={settings.business_hours.end} className="w-full rounded border border-ink/20 px-3 py-2.5 text-sm" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="bookingBuffer" className="mb-1.5 block text-sm font-semibold text-ink">
              Buffer between appointments (minutes)
            </label>
            <input id="bookingBuffer" name="bookingBuffer" type="number" defaultValue={settings.booking_buffer_minutes} className="w-full rounded border border-ink/20 px-3 py-2.5 text-sm" />
          </div>
          <div>
            <label htmlFor="maxDaily" className="mb-1.5 block text-sm font-semibold text-ink">
              Max daily appointments per engineer
            </label>
            <input id="maxDaily" name="maxDaily" type="number" defaultValue={settings.max_daily_appointments_per_engineer} className="w-full rounded border border-ink/20 px-3 py-2.5 text-sm" />
          </div>
        </div>
        <div>
          <label htmlFor="whatsappNumber" className="mb-1.5 block text-sm font-semibold text-ink">
            WhatsApp number (digits only, with country code)
          </label>
          <input id="whatsappNumber" name="whatsappNumber" defaultValue={settings.whatsapp_number} className="w-full rounded border border-ink/20 px-3 py-2.5 text-sm" />
        </div>
        <div>
          <label htmlFor="notificationEmail" className="mb-1.5 block text-sm font-semibold text-ink">
            Internal notification email
          </label>
          <input id="notificationEmail" name="notificationEmail" type="email" defaultValue={settings.notification_email} className="w-full rounded border border-ink/20 px-3 py-2.5 text-sm" />
        </div>
        <label className="flex items-center gap-2 text-sm font-semibold text-ink">
          <input type="checkbox" name="emergencyAvailable" defaultChecked={settings.emergency_available} className="h-4 w-4" />
          Emergency response currently available
        </label>
        <button type="submit" className="min-h-[44px] rounded bg-yellow px-6 text-sm font-semibold text-ink hover:bg-yellow/90">
          Save settings
        </button>
      </form>
    </AdminShell>
  )
}
