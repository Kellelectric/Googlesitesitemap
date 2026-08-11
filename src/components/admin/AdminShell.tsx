import { AdminSidebar } from './AdminSidebar'
import type { SessionPayload } from '@/lib/auth'

export function AdminShell({ session, children }: { session: SessionPayload; children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-paper">
      <AdminSidebar email={session.email} role={session.role} />
      <main className="flex-1 overflow-x-hidden px-6 py-8 sm:px-10 sm:py-10">{children}</main>
    </div>
  )
}
