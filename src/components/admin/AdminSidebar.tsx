'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { company } from '@/content/company'

const links = [
  { href: '/admin/dashboard', label: 'Dashboard' },
  { href: '/admin/leads', label: 'Leads' },
  { href: '/admin/appointments', label: 'Appointments' },
  { href: '/admin/services', label: 'Services' },
  { href: '/admin/settings', label: 'Settings' },
]

export function AdminSidebar({ email, role }: { email: string; role: string }) {
  const pathname = usePathname()
  const router = useRouter()

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin')
    router.refresh()
  }

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-paper/10 bg-petrol text-paper">
      <div className="border-b border-paper/10 px-6 py-6">
        <p className="text-sm font-semibold">{company.name}</p>
        <p className="mt-1 text-xs uppercase tracking-wide text-paper/50">Admin</p>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-6">
        {links.map((link) => {
          const active = pathname === link.href || pathname?.startsWith(link.href + '/')
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`block rounded px-3 py-2.5 text-sm font-medium transition-colors ${
                active ? 'bg-paper/10 text-paper' : 'text-paper/60 hover:bg-paper/5 hover:text-paper'
              }`}
            >
              {link.label}
            </Link>
          )
        })}
      </nav>
      <div className="border-t border-paper/10 px-6 py-5">
        <p className="truncate text-xs text-paper/60">{email}</p>
        <p className="text-xs text-paper/40">{role.replace('_', ' ')}</p>
        <button type="button" onClick={logout} className="mt-3 text-xs font-semibold text-yellow hover:underline">
          Sign out
        </button>
      </div>
    </aside>
  )
}
