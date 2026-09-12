import { getSupabaseServerClient } from '@/lib/supabaseServer'

export const dynamic = 'force-dynamic'

const STATUS_COLORS: Record<string, string> = {
  new: 'bg-blue-900 text-blue-200',
  qualified: 'bg-emerald-900 text-emerald-200',
  unqualified: 'bg-slate-800 text-slate-400',
  contacted: 'bg-amber-900 text-amber-200',
  inspection_requested: 'bg-purple-900 text-purple-200',
  inspection_scheduled: 'bg-purple-900 text-purple-200',
  quote_requested: 'bg-amber-900 text-amber-200',
  quote_sent: 'bg-amber-900 text-amber-200',
  won: 'bg-emerald-900 text-emerald-200',
  lost: 'bg-red-900 text-red-200',
  follow_up_required: 'bg-orange-900 text-orange-200',
}

type LeadRow = {
  id: string
  status: string
  intent: string | null
  source_channel: string
  service_interest: string | null
  description: string | null
  urgency: string | null
  created_at: string
  customers: { full_name: string | null; phone: string | null; email: string | null } | null
}

export default async function AdminLeadsPage() {
  const supabase = await getSupabaseServerClient()

  const { data: leads, error } = await supabase
    .from('leads')
    .select(
      'id, status, intent, source_channel, service_interest, description, urgency, created_at, customers(full_name, phone, email)',
    )
    .order('created_at', { ascending: false })
    .limit(100)
    .returns<LeadRow[]>()

  return (
    <div>
      <h1 className="mb-1 text-xl font-semibold">Leads</h1>
      <p className="mb-6 text-sm text-slate-400">Most recent 100 leads, newest first.</p>

      {error && (
        <p className="rounded border border-red-800 bg-red-950 px-4 py-3 text-sm text-red-300">
          Could not load leads: {error.message}
        </p>
      )}

      {!error && (!leads || leads.length === 0) && (
        <p className="text-sm text-slate-400">
          No leads yet. New quote requests, inspection bookings, and career applications from the
          website will appear here automatically.
        </p>
      )}

      {!error && leads && leads.length > 0 && (
        <div className="overflow-x-auto rounded border border-slate-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-900 text-slate-400">
              <tr>
                <th className="px-4 py-2">Customer</th>
                <th className="px-4 py-2">Intent</th>
                <th className="px-4 py-2">Service</th>
                <th className="px-4 py-2">Source</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Received</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-900/50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-white">{lead.customers?.full_name ?? '—'}</div>
                    <div className="text-xs text-slate-500">
                      {lead.customers?.phone ?? lead.customers?.email ?? ''}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-300">{lead.intent ?? '—'}</td>
                  <td className="px-4 py-3 text-slate-300">{lead.service_interest ?? '—'}</td>
                  <td className="px-4 py-3 text-slate-400">{lead.source_channel}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded px-2 py-0.5 text-xs ${STATUS_COLORS[lead.status] ?? 'bg-slate-800 text-slate-300'}`}
                    >
                      {lead.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-400">
                    {new Date(lead.created_at).toLocaleString('en-GB', { timeZone: 'Africa/Lagos' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
