import { redirect } from 'next/navigation'
import { getSession, roleAtLeast, type SessionPayload } from '@/lib/auth'
import type { AdminRole } from '@prisma/client'

export async function requireAdminSession(minimumRole: AdminRole = 'CUSTOMER_SERVICE'): Promise<SessionPayload> {
  const session = await getSession()
  if (!session) redirect('/admin')
  if (!roleAtLeast(session.role, minimumRole)) redirect('/admin/dashboard')
  return session
}
