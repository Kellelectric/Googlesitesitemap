'use client'

import { FormEvent, useState } from 'react'
import { services } from '@/content/services'
import { company } from '@/content/company'

// Set once on mount and sent back with the submission. The API rejects
// submissions completed faster than a human plausibly could — see
// MIN_SUBMIT_SECONDS in app/api/quote/route.ts.
function useFormRenderedAt() {
  const [renderedAt] = useState(() => Date.now())
  return renderedAt
}

type FormStatus = 'idle' | 'submitting' | 'success' | 'error' | 'not_configured'

type FormState = {
  name: string
  phone: string
  email: string
  serviceSlug: string
  propertyType: 'residential' | 'commercial' | 'industrial' | ''
  urgency: 'standard' | 'urgent' | 'emergency' | ''
  location: string
  details: string
  website: string // honeypot — kept empty by real users, hidden from view
}

const initialState: FormState = {
  name: '',
  phone: '',
  email: '',
  serviceSlug: '',
  propertyType: '',
  urgency: '',
  location: '',
  details: '',
  website: '',
}

// Field names mirror a Zoho Forms / Zoho Books contact schema
// (Name, Phone, Email, Service, Property_Type, Urgency, Location, Details)
// so this payload can be forwarded to a Zoho endpoint without remapping.
export function QuoteForm() {
  const [form, setForm] = useState<FormState>(initialState)
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [status, setStatus] = useState<FormStatus>('idle')
  const renderedAt = useFormRenderedAt()

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function validate(): boolean {
    const next: Partial<Record<keyof FormState, string>> = {}
    if (!form.name.trim()) next.name = 'Enter your name'
    if (!/^[+0-9\s()-]{7,}$/.test(form.phone.trim())) next.phone = 'Enter a valid phone number'
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      next.email = 'Enter a valid email address'
    }
    if (!form.serviceSlug) next.serviceSlug = 'Select a service'
    if (!form.propertyType) next.propertyType = 'Select a property type'
    if (!form.location.trim()) next.location = 'Enter the job location'
    if (!form.details.trim()) next.details = 'Add a short description of the job'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!validate()) return

    setStatus('submitting')
    try {
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, renderedAt }),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => null)
        setStatus(body?.reason === 'not_configured' ? 'not_configured' : 'error')
        return
      }

      setStatus('success')
      setForm(initialState)
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="border border-petrol/20 bg-petrol/5 p-8">
        <h3 className="text-xl font-semibold text-ink">Request received</h3>
        <p className="mt-3 text-sm leading-relaxed text-ink/70">
          Our team will review the job details and get back to you by phone
          or email. For anything urgent, call{' '}
          <a href={company.phoneHref} className="link-underline font-semibold">
            {company.phone}
          </a>{' '}
          directly.
        </p>
      </div>
    )
  }

  if (status === 'not_configured') {
    return (
      <div className="border border-orange/30 bg-orange/5 p-8">
        <h3 className="text-xl font-semibold text-ink">
          Online submission isn&rsquo;t connected yet
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-ink/70">
          This form isn&rsquo;t wired to a destination yet. Nothing was
          lost, but please call{' '}
          <a href={company.phoneHref} className="link-underline font-semibold">
            {company.phone}
          </a>{' '}
          or WhatsApp us directly so we can get your request right away.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <input
        type="text"
        name="website"
        value={form.website}
        onChange={(e) => update('website', e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
      />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Field label="Full name" error={errors.name}>
          <input
            type="text"
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            className={inputClass(!!errors.name)}
            autoComplete="name"
          />
        </Field>

        <Field label="Phone number" error={errors.phone}>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => update('phone', e.target.value)}
            className={inputClass(!!errors.phone)}
            autoComplete="tel"
            placeholder="+234"
          />
        </Field>

        <Field label="Email (optional)" error={errors.email}>
          <input
            type="email"
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            className={inputClass(!!errors.email)}
            autoComplete="email"
          />
        </Field>

        <Field label="Job location" error={errors.location}>
          <input
            type="text"
            value={form.location}
            onChange={(e) => update('location', e.target.value)}
            className={inputClass(!!errors.location)}
            placeholder="e.g. Wuse 2, Abuja"
          />
        </Field>
      </div>

      <Field label="Service needed" error={errors.serviceSlug}>
        <select
          value={form.serviceSlug}
          onChange={(e) => update('serviceSlug', e.target.value)}
          className={inputClass(!!errors.serviceSlug)}
        >
          <option value="">Select a service</option>
          {services.map((service) => (
            <option key={service.slug} value={service.slug}>
              {service.name}
            </option>
          ))}
          <option value="other">Other / not sure</option>
        </select>
      </Field>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Field label="Property type" error={errors.propertyType}>
          <select
            value={form.propertyType}
            onChange={(e) => update('propertyType', e.target.value as FormState['propertyType'])}
            className={inputClass(!!errors.propertyType)}
          >
            <option value="">Select property type</option>
            <option value="residential">Residential</option>
            <option value="commercial">Commercial</option>
            <option value="industrial">Industrial</option>
          </select>
        </Field>

        <Field label="Urgency">
          <select
            value={form.urgency}
            onChange={(e) => update('urgency', e.target.value as FormState['urgency'])}
            className={inputClass(false)}
          >
            <option value="">Select urgency</option>
            <option value="standard">Standard: planning ahead</option>
            <option value="urgent">Urgent: within a few days</option>
            <option value="emergency">Emergency: needs same-day response</option>
          </select>
        </Field>
      </div>

      <Field label="Job details" error={errors.details}>
        <textarea
          value={form.details}
          onChange={(e) => update('details', e.target.value)}
          rows={5}
          className={inputClass(!!errors.details)}
          placeholder="Describe what needs to be assessed, repaired, or installed."
        />
      </Field>

      {form.urgency === 'emergency' && (
        <p className="border-l-2 border-orange bg-orange/5 px-4 py-3 text-sm text-orange">
          For active electrical hazards (sparking, burning smell, exposed
          live wiring), call {company.phone} directly rather than waiting
          for a form response.
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="inline-flex items-center justify-center rounded bg-yellow px-8 py-3.5 text-sm font-semibold text-ink transition-colors hover:bg-yellow/90 disabled:opacity-60"
      >
        {status === 'submitting' ? 'Submitting…' : 'Submit Request'}
      </button>

      {status === 'error' && (
        <p className="text-sm text-orange">
          Something went wrong. Please call {company.phone} instead.
        </p>
      )}
    </form>
  )
}

function inputClass(hasError: boolean) {
  return `w-full border bg-paper px-4 py-3 text-sm text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-petrol ${
    hasError ? 'border-orange' : 'border-ink/15'
  }`
}

function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="eyebrow text-ink/60">{label}</span>
      <span className="mt-2 block">{children}</span>
      {error && <span className="mt-1.5 block text-xs text-orange">{error}</span>}
    </label>
  )
}
