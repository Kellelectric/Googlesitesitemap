import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { requireAdminSession } from '@/lib/requireAdmin'
import { AdminShell } from '@/components/admin/AdminShell'
import { db } from '@/lib/db'
import { writeAuditLog } from '@/lib/auditLog'
import { getSession } from '@/lib/auth'

export const metadata: Metadata = { title: 'Lead', robots: { index: false, follow: false } }

const LEAD_STATUSES = ['NEW', 'CONTACTED', 'QUALIFIED', 'SITE_VISIT_BOOKED', 'QUOTATION_SENT', 'NEGOTIATION', 'WON', 'LOST', 'FOLLOW_UP']

export default async function AdminLeadDetailPage({ params }: { params: { id: string } }) {
  const session = await requireAdminSession()
  const lead = await db.lead.findUnique({
    where: { id: params.id },
    include: { recommendedService: true, appointments: { include: { service: true, engineer: true } }, files: true, assignedEngineer: true },
  })
  if (!lead) notFound()

  const engineers = await db.adminUser.findMany({ where: { role: { in: ['ENGINEER', 'TECHNICIAN'] }, active: true } })
  const location = lead.location as { city?: string; area?: string; address?: string; landmark?: string }

  async function updateLead(formData: FormData) {
    'use server'
    const current = await getSession()
    const status = formData.get('status') as string
    const assignedEngineerId = (formData.get('assignedEngineerId') as string) || null
    const notes = (formData.get('notes') as string) || null

    const before = await db.lead.findUnique({ where: { id: params.id } })
    const updated = await db.lead.update({
      where: { id: params.id },
      data: { status: status as never, assignedEngineerId, notes },
    })

    await writeAuditLog({
      adminUserId: current?.adminUserId,
      action: 'lead.update',
      entityType: 'Lead',
      entityId: params.id,
      previousValue: { status: before?.status, assignedEngineerId: before?.assignedEngineerId, notes: before?.notes },
      newValue: { status: updated.status, assignedEngineerId: updated.assignedEngineerId, notes: updated.notes },
    })

    revalidatePath(`/admin/leads/${params.id}`)
  }

  return (
    <AdminShell session={session}>
      <div className="flex items-center justify-between">
        <div>
          <p className="eyebrow text-ink/40">Lead {lead.reference}</p>
          <h1 className="mt-1 font-display text-2xl font-semibold text-ink">{lead.name}</h1>
        </div>
        <span className="rounded bg-ink/10 px-3 py-1.5 text-xs font-semibold text-ink/60">{lead.scoreCategory} · score {lead.score}</span>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <section className="rounded border border-ink/10 bg-white p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-ink/50">Contact</h2>
            <dl className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <Field label="Phone" value={lead.phone} />
              <Field label="WhatsApp" value={lead.whatsapp ?? '—'} />
              <Field label="Email" value={lead.email ?? '—'} />
              <Field label="Company" value={lead.company ?? '—'} />
              <Field label="Preferred contact" value={lead.preferredContact} />
              <Field label="Source" value={lead.source} />
            </dl>
          </section>

          <section className="rounded border border-ink/10 bg-white p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-ink/50">Project</h2>
            <dl className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <Field label="Need" value={lead.need} />
              <Field label="Property type" value={lead.propertyType} />
              <Field label="Issue detail" value={lead.issueDetail ?? '—'} />
              <Field label="Urgency" value={lead.urgency} />
              <Field label="Project stage" value={lead.projectStage ?? '—'} />
              <Field label="Project size" value={lead.projectSize ?? '—'} />
              <Field label="Primary goal" value={lead.primaryGoal ?? '—'} />
              <Field label="Recommended service" value={lead.recommendedService?.name ?? '—'} />
              <Field label="Location" value={`${location.area ?? ''}, ${location.city ?? ''}${location.address ? ` — ${location.address}` : ''}`} />
            </dl>
            {lead.additionalInfo && (
              <div className="mt-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-ink/40">Additional info</p>
                <p className="mt-1 text-sm text-ink/70">{lead.additionalInfo}</p>
              </div>
            )}
            {lead.recommendationReasons.length > 0 && (
              <div className="mt-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-ink/40">Why this was recommended</p>
                <ul className="mt-1 list-disc space-y-1 pl-4 text-sm text-ink/70">
                  {lead.recommendationReasons.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
              </div>
            )}
          </section>

          {lead.appointments.length > 0 && (
            <section className="rounded border border-ink/10 bg-white p-6">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-ink/50">Appointments</h2>
              <ul className="mt-4 space-y-3">
                {lead.appointments.map((a) => (
                  <li key={a.id} className="flex items-center justify-between text-sm">
                    <span className="text-ink/80">
                      {a.service.name} — {a.startsAt.toLocaleString('en-NG', { dateStyle: 'medium', timeStyle: 'short' })}
                    </span>
                    <span className="text-ink/50">{a.status.replace(/_/g, ' ').toLowerCase()}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <form action={updateLead} className="space-y-5 self-start rounded border border-ink/10 bg-white p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-ink/50">CRM</h2>
          <div>
            <label htmlFor="status" className="mb-1.5 block text-sm font-semibold text-ink">
              Status
            </label>
            <select id="status" name="status" defaultValue={lead.status} className="w-full rounded border border-ink/20 px-3 py-2.5 text-sm">
              {LEAD_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="assignedEngineerId" className="mb-1.5 block text-sm font-semibold text-ink">
              Assigned to
            </label>
            <select id="assignedEngineerId" name="assignedEngineerId" defaultValue={lead.assignedEngineerId ?? ''} className="w-full rounded border border-ink/20 px-3 py-2.5 text-sm">
              <option value="">Unassigned</option>
              {engineers.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="notes" className="mb-1.5 block text-sm font-semibold text-ink">
              Internal notes
            </label>
            <textarea id="notes" name="notes" rows={4} defaultValue={lead.notes ?? ''} className="w-full rounded border border-ink/20 px-3 py-2.5 text-sm" />
          </div>
          <button type="submit" className="min-h-[44px] w-full rounded bg-yellow px-4 text-sm font-semibold text-ink hover:bg-yellow/90">
            Save changes
          </button>
        </form>
      </div>
    </AdminShell>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-ink/40">{label}</dt>
      <dd className="mt-0.5 text-ink/80">{value}</dd>
    </div>
  )
}
