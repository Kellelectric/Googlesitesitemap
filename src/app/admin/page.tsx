import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { LoginForm } from '@/components/admin/LoginForm'
import { company } from '@/content/company'

export const metadata: Metadata = { title: 'Admin Sign In', robots: { index: false, follow: false } }

export default async function AdminLoginPage() {
  const session = await getSession()
  if (session) redirect('/admin/dashboard')

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-4">
      <div className="flex flex-col items-center">
        <p className="eyebrow mb-8 text-petrol">{company.name} · Admin</p>
        <LoginForm />
      </div>
    </div>
  )
}
