import type { Metadata } from 'next'
import { revalidatePath } from 'next/cache'
import { requireAdminSession } from '@/lib/requireAdmin'
import { AdminShell } from '@/components/admin/AdminShell'
import { db } from '@/lib/db'
import { writeAuditLog } from '@/lib/auditLog'
import { getSession } from '@/lib/auth'
import { formatNaira } from '@/config/business'

export const metadata: Metadata = { title: 'Services', robots: { index: false, follow: false } }

export default async function AdminServicesPage() {
  const session = await requireAdminSession('ADMINISTRATOR')
  const services = await db.service.findMany({ orderBy: { sortOrder: 'asc' }, include: { category: true } })

  async function updateService(formData: FormData) {
    'use server'
    const current = await getSession()
    const id = formData.get('serviceId') as string
    const inspectionFeeRaw = formData.get('inspectionFeeNgn') as string
    const active = formData.get('active') === 'on'

    const before = await db.service.findUnique({ where: { id } })
    const updated = await db.service.update({
      where: { id },
      data: {
        inspectionFeeNgn: inspectionFeeRaw ? Number(inspectionFeeRaw) : null,
        active,
      },
    })
    await writeAuditLog({
      adminUserId: current?.adminUserId,
      action: 'service.update',
      entityType: 'Service',
      entityId: id,
      previousValue: { inspectionFeeNgn: before?.inspectionFeeNgn, active: before?.active },
      newValue: { inspectionFeeNgn: updated.inspectionFeeNgn, active: updated.active },
    })
    revalidatePath('/admin/services')
  }

  return (
    <AdminShell session={session}>
      <h1 className="font-display text-2xl font-semibold text-ink">Services</h1>
      <p className="mt-1 text-sm text-ink/50">Pricing and availability are configurable here — no code changes needed.</p>

      <div className="mt-6 space-y-3">
        {services.map((service) => (
          <form
            key={service.id}
            action={updateService}
            className="flex flex-wrap items-center gap-4 rounded border border-ink/10 bg-white p-4"
          >
            <input type="hidden" name="serviceId" value={service.id} />
            <div className="min-w-[220px] flex-1">
              <p className="text-sm font-semibold text-ink">{service.name}</p>
              <p className="text-xs text-ink/40">{service.category.name}</p>
            </div>
            <label className="flex items-center gap-2 text-xs text-ink/60">
              Inspection fee (₦)
              <input
                type="number"
                name="inspectionFeeNgn"
                defaultValue={service.inspectionFeeNgn ?? ''}
                className="w-28 rounded border border-ink/20 px-2 py-1.5 text-sm"
              />
            </label>
            <label className="flex items-center gap-2 text-xs font-semibold text-ink/60">
              <input type="checkbox" name="active" defaultChecked={service.active} className="h-4 w-4" />
              Active
            </label>
            <p className="text-xs text-ink/40">Currently {formatNaira(service.inspectionFeeNgn ?? service.priceFromNgn)}</p>
            <button type="submit" className="ml-auto rounded bg-petrol px-4 py-2 text-xs font-semibold text-paper hover:bg-petrol-600">
              Save
            </button>
          </form>
        ))}
      </div>
    </AdminShell>
  )
}
