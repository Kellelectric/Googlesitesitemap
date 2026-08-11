import type { Metadata } from 'next'
import { requireAdminSession } from '@/lib/requireAdmin'
import { AdminShell } from '@/components/admin/AdminShell'
import { db } from '@/lib/db'

export const metadata: Metadata = { title: 'Dashboard', robots: { index: false, follow: false } }

function startOfDay(date: Date) {
  const d = new Date(date)
  d.setUTCHours(0, 0, 0, 0)
  return d
}
function startOfWeek(date: Date) {
  const d = startOfDay(date)
  const day = d.getUTCDay()
  d.setUTCDate(d.getUTCDate() - day)
  return d
}

export default async function AdminDashboardPage() {
  const session = await requireAdminSession()
  const now = new Date()
  const todayStart = startOfDay(now)
  const weekStart = startOfWeek(now)

  const [
    newLeadsToday,
    leadsThisWeek,
    bookingsToday,
    upcomingAppointments,
    emergencyRequests,
    hotLeads,
    totalLeads,
    wonLeads,
    leadsByPropertyType,
    topServiceGroups,
  ] = await Promise.all([
    db.lead.count({ where: { createdAt: { gte: todayStart }, deletedAt: null } }),
    db.lead.count({ where: { createdAt: { gte: weekStart }, deletedAt: null } }),
    db.appointment.count({ where: { createdAt: { gte: todayStart }, deletedAt: null } }),
    db.appointment.count({ where: { startsAt: { gte: now }, status: { in: ['REQUESTED', 'PENDING_CONFIRMATION', 'CONFIRMED'] }, deletedAt: null } }),
    db.lead.count({ where: { isEmergency: true, createdAt: { gte: weekStart }, deletedAt: null } }),
    db.lead.count({ where: { scoreCategory: 'HOT', deletedAt: null } }),
    db.lead.count({ where: { deletedAt: null } }),
    db.lead.count({ where: { status: 'WON', deletedAt: null } }),
    db.lead.groupBy({ by: ['propertyType'], _count: true, where: { deletedAt: null } }),
    db.lead.groupBy({ by: ['recommendedServiceId'], _count: true, where: { deletedAt: null, recommendedServiceId: { not: null } }, orderBy: { _count: { recommendedServiceId: 'desc' } }, take: 5 }),
  ])

  const serviceIds = topServiceGroups.map((g) => g.recommendedServiceId).filter(Boolean) as string[]
  const services = await db.service.findMany({ where: { id: { in: serviceIds } } })
  const serviceNameById = new Map(services.map((s) => [s.id, s.name]))

  const conversionRate = totalLeads > 0 ? Math.round((wonLeads / totalLeads) * 100) : 0

  const metrics = [
    { label: 'New leads today', value: newLeadsToday },
    { label: 'Leads this week', value: leadsThisWeek },
    { label: 'Bookings today', value: bookingsToday },
    { label: 'Upcoming appointments', value: upcomingAppointments },
    { label: 'Emergency requests (7d)', value: emergencyRequests },
    { label: 'Hot leads', value: hotLeads },
    { label: 'Total leads', value: totalLeads },
    { label: 'Lead → won conversion', value: `${conversionRate}%` },
  ]

  return (
    <AdminShell session={session}>
      <h1 className="font-display text-2xl font-semibold text-ink">Dashboard</h1>
      <p className="mt-1 text-sm text-ink/50">Welcome back, {session.email}.</p>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {metrics.map((m) => (
          <div key={m.label} className="rounded border border-ink/10 bg-white p-5">
            <p className="text-2xl font-semibold text-petrol">{m.value}</p>
            <p className="mt-1 text-xs text-ink/50">{m.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded border border-ink/10 bg-white p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-ink/50">Top recommended services</h2>
          <ul className="mt-4 space-y-2">
            {topServiceGroups.map((g) => (
              <li key={g.recommendedServiceId} className="flex items-center justify-between text-sm text-ink/80">
                <span>{serviceNameById.get(g.recommendedServiceId as string) ?? 'Unknown'}</span>
                <span className="font-semibold text-petrol">{g._count}</span>
              </li>
            ))}
            {topServiceGroups.length === 0 && <p className="text-sm text-ink/40">No data yet.</p>}
          </ul>
        </div>
        <div className="rounded border border-ink/10 bg-white p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-ink/50">Leads by property type</h2>
          <ul className="mt-4 space-y-2">
            {leadsByPropertyType.map((g) => (
              <li key={g.propertyType} className="flex items-center justify-between text-sm text-ink/80">
                <span className="capitalize">{g.propertyType.replace('-', ' ')}</span>
                <span className="font-semibold text-petrol">{g._count}</span>
              </li>
            ))}
            {leadsByPropertyType.length === 0 && <p className="text-sm text-ink/40">No data yet.</p>}
          </ul>
        </div>
      </div>
    </AdminShell>
  )
}
