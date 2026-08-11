'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { FieldWrapper, TextInput } from '@/components/assessment/FormField'

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    const response = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    if (!response.ok) {
      setError('Invalid email or password.')
      setSubmitting(false)
      return
    }
    router.push('/admin/dashboard')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-5 rounded border border-ink/10 bg-white p-8">
      <FieldWrapper label="Email" htmlFor="a-email">
        <TextInput id="a-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoFocus />
      </FieldWrapper>
      <FieldWrapper label="Password" htmlFor="a-password">
        <TextInput id="a-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </FieldWrapper>
      {error && (
        <p role="alert" className="text-sm text-orange">
          {error}
        </p>
      )}
      <Button type="submit" variant="primary" className="w-full min-h-[44px] justify-center" disabled={submitting}>
        {submitting ? 'Signing in…' : 'Sign in'}
      </Button>
    </form>
  )
}
