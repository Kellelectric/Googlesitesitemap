import type { Metadata } from 'next'
import { revalidatePath } from 'next/cache'
import { requireAdminSession } from '@/lib/requireAdmin'
import { AdminShell } from '@/components/admin/AdminShell'
import { db } from '@/lib/db'
import { writeAuditLog } from '@/lib/auditLog'
import { getSession } from '@/lib/auth'

export const metadata: Metadata = { title: 'Appointments', robots: { index: false, follow: false } }

const STATUSES = ['REQUESTED', 'PENDING_CONFIRMATION', 'CONFIRMED', 'RESCHEDULED', 'CANCELLED', 'COMPLETED', 'NO_SHOW']

export default async function AdminAppointmentsPage() {
  const session = await requireAdminSession()
  const appointments = await db.appointment.findMany({
    where: { deletedAt: null },
    orderBy: { startsAt: 'asc' },
    include: { service: true, engineer: true, lead: true },
    take: 100,
  })

  async function updateStatus(formData: FormData) {
    'use server'
    const current = await getSession()
    const id = formData.get('appointmentId') as string
    const status = formData.get('status') as string
    const before = await db.appointment.findUnique({ where: { id } })
    const updated = await db.appointment.update({ where: { id }, data: { status: status as never } })
    await writeAuditLog({
      adminUserId: current?.adminUserId,
      action: 'appointment.status_update',
      entityType: 'Appointment',
      entityId: id,
      previousValue: { status: before?.status },
      newValue: { status: updated.status },
    })
    revalidatePath('/admin/appointments')
  }

  return (
    <AdminShell session={session}>
      <h1 className="font-display text-2xl font-semibold text-ink">Appointments</h1>
      <p className="mt-1 text-sm text-ink/50">{appointments.length} upcoming and recent appointments.</p>

      <div className="mt-6 overflow-x-auto rounded border border-ink/10 bg-white">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="border-b border-ink/10 text-xs uppercase tracking-wide text-ink/40">
            <tr>
              <th className="px-4 py-3">Reference</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Service</th>
              <th className="px-4 py-3">Engineer</th>
              <th className="px-4 py-3">When</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((a) => (
              <tr key={a.id} className="border-b border-ink/5">
                <td className="px-4 py-3 font-semibold text-petrol">{a.reference}</td>
                <td className="px-4 py-3 text-ink/80">{a.lead.name}</td>
                <td className="px-4 py-3 text-ink/60">{a.service.name}</td>
                <td className="px-4 py-3 text-ink/60">{a.engineer?.name ?? '—'}</td>
                <td className="px-4 py-3 text-ink/60">{a.startsAt.toLocaleString('en-NG', { dateStyle: 'medium', timeStyle: 'short' })}</td>
                <td className="px-4 py-3">
                  <form action={updateStatus} className="flex items-center gap-2">
                    <input type="hidden" name="appointmentId" value={a.id} />
                    <select name="status" defaultValue={a.status} className="rounded border border-ink/20 px-2 py-1.5 text-xs">
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s.replace(/_/g, ' ')}
                        </option>
                      ))}
                    </select>
                    <button type="submit" className="text-xs font-semibold text-petrol hover:underline">
                      Save
                    </button>
                  </form>
                </td>
              </tr>
            ))}
            {appointments.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-ink/40">
                  No appointments yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminShell>
  )
}
