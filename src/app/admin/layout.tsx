import Link from 'next/link'
import { getSupabaseServerClient } from '@/lib/supabaseServer'
import SignOutButton from './SignOutButton'

// The whole /admin section reads the signed-in staff member's session on
// every request (via cookies) and depends on Supabase env vars that aren't
// available at build time - never statically prerender any page under here.
export const dynamic = 'force-dynamic'

// Shared chrome for every /admin/* page. Auth enforcement itself lives in
// middleware.ts (runs before this ever renders); this layout only reads
// the already-verified session to show who's signed in and their role.
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let roleLabel = ''
  if (user) {
    const { data: staff } = await supabase
      .from('staff_users')
      .select('full_name, role')
      .eq('id', user.id)
      .maybeSingle()
    if (staff) roleLabel = `${staff.full_name} · ${staff.role}`
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
        <div className="flex items-center gap-6">
          <span className="font-semibold">Kell Electricals Admin</span>
          <nav className="flex gap-4 text-sm text-slate-300">
            <Link href="/admin/leads" className="hover:text-white">
              Leads
            </Link>
            <Link href="/admin/conversations" className="hover:text-white">
              Conversations
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4 text-sm text-slate-400">
          {roleLabel && <span>{roleLabel}</span>}
          <SignOutButton />
        </div>
      </header>
      <main className="px-6 py-8">{children}</main>
    </div>
  )
}
