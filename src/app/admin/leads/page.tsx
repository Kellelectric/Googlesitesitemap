import type { Metadata } from 'next'
import Link from 'next/link'
import { requireAdminSession } from '@/lib/requireAdmin'
import { AdminShell } from '@/components/admin/AdminShell'
import { db } from '@/lib/db'

export const metadata: Metadata = { title: 'Leads', robots: { index: false, follow: false } }

const scoreBadge: Record<string, string> = {
  HOT: 'bg-orange/15 text-orange',
  WARM: 'bg-yellow/20 text-ink',
  STANDARD: 'bg-ink/10 text-ink/60',
}

export default async function AdminLeadsPage() {
  const session = await requireAdminSession()
  const leads = await db.lead.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: 'desc' },
    take: 100,
    include: { recommendedService: true },
  })

  return (
    <AdminShell session={session}>
      <h1 className="font-display text-2xl font-semibold text-ink">Leads</h1>
      <p className="mt-1 text-sm text-ink/50">{leads.length} most recent leads.</p>

      <div className="mt-6 overflow-x-auto rounded border border-ink/10 bg-white">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="border-b border-ink/10 text-xs uppercase tracking-wide text-ink/40">
            <tr>
              <th className="px-4 py-3">Reference</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Service</th>
              <th className="px-4 py-3">Urgency</th>
              <th className="px-4 py-3">Priority</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Received</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id} className="border-b border-ink/5 hover:bg-petrol/5">
                <td className="px-4 py-3">
                  <Link href={`/admin/leads/${lead.id}`} className="font-semibold text-petrol hover:underline">
                    {lead.reference}
                  </Link>
                </td>
                <td className="px-4 py-3 text-ink/80">{lead.name}</td>
                <td className="px-4 py-3 text-ink/60">{lead.recommendedService?.name ?? '—'}</td>
                <td className="px-4 py-3 text-ink/60">{lead.urgency.replace(/_/g, ' ').toLowerCase()}</td>
                <td className="px-4 py-3">
                  <span className={`rounded px-2 py-1 text-xs font-semibold ${scoreBadge[lead.scoreCategory]}`}>
                    {lead.scoreCategory}
                  </span>
                </td>
                <td className="px-4 py-3 text-ink/60">{lead.status.replace(/_/g, ' ').toLowerCase()}</td>
                <td className="px-4 py-3 text-ink/40">{lead.createdAt.toLocaleString('en-NG', { dateStyle: 'medium', timeStyle: 'short' })}</td>
              </tr>
            ))}
            {leads.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-ink/40">
                  No leads yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminShell>
  )
}
