'use client'

import { cloneElement, FormEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Script from 'next/script'
import { services } from '@/content/services'
import { company } from '@/content/company'
import { trackEvent } from '@/lib/analytics'

// hCaptcha exposes itself as a global once its script loads, not an npm
// package — matches this file's existing pattern of talking to gtag
// (see lib/analytics.ts) the same way.
declare global {
  interface Window {
    hcaptcha?: {
      getResponse: (widgetId?: string) => string
      reset: (widgetId?: string) => void
    }
  }
}

// Only set once a real hCaptcha site key exists in the deployment env —
// see docs/next-steps.md. Undefined here means the widget doesn't render
// and the server doesn't require a token either (see HCAPTCHA_SECRET_KEY
// in app/api/quote/route.ts), so the form works exactly as before until
// both are configured.
const HCAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY

// Set once on mount and sent back with the submission. The API rejects
// submissions completed faster than a human plausibly could — see
// MIN_SUBMIT_SECONDS in app/api/quote/route.ts.
function useFormRenderedAt() {
  const [renderedAt] = useState(() => Date.now())
  return renderedAt
}

type FormStatus = 'idle' | 'submitting' | 'error' | 'not_configured'

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

function makeInitialState(serviceSlug = ''): FormState {
  return {
    name: '',
    phone: '',
    email: '',
    serviceSlug,
    propertyType: '',
    urgency: '',
    location: '',
    details: '',
    website: '',
  }
}

// Field names mirror a Zoho Forms / Zoho Books contact schema
// (Name, Phone, Email, Service, Property_Type, Urgency, Location, Details)
// so this payload can be forwarded to a Zoho endpoint without remapping.
export function QuoteForm({ initialServiceSlug = '' }: { initialServiceSlug?: string }) {
  const router = useRouter()
  const [form, setForm] = useState<FormState>(() => makeInitialState(initialServiceSlug))
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [captchaError, setCaptchaError] = useState<string | undefined>()
  const [captchaLoadFailed, setCaptchaLoadFailed] = useState(false)
  const [status, setStatus] = useState<FormStatus>('idle')
  const renderedAt = useFormRenderedAt()

  // Fail open, not closed: if the hCaptcha script never loads (ad blocker,
  // privacy extension, a network that blocks hcaptcha.com outright — all
  // observed in the field), window.hcaptcha stays undefined forever and a
  // real customer would be stuck unable to submit at all. Losing bot
  // protection to an infrastructure hiccup is a far smaller cost than
  // losing a real lead, and the honeypot/time-trap/rate-limit checks still
  // apply either way.
  useEffect(() => {
    if (!HCAPTCHA_SITE_KEY) return
    const timer = setTimeout(() => {
      if (!window.hcaptcha) setCaptchaLoadFailed(true)
    }, 6000)
    return () => clearTimeout(timer)
  }, [])

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function validate(): boolean {
    const next: Partial<Record<keyof FormState, string>> = {}
    if (!form.name.trim()) next.name = 'Enter your name'
    if (!/^[+0-9\s()-]{7,}$/.test(form.phone.trim())) next.phone = 'Enter a valid phone number'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      next.email = 'Enter a valid email address'
    }
    if (!form.serviceSlug) next.serviceSlug = 'Select a service'
    if (!form.propertyType) next.propertyType = 'Select a property type'
    if (!form.location.trim()) next.location = 'Enter the job location'
    if (!form.details.trim()) next.details = 'Add a short description of the job'
    setErrors(next)

    let captchaOk = true
    if (HCAPTCHA_SITE_KEY && !captchaLoadFailed) {
      const token = window.hcaptcha?.getResponse()
      captchaOk = !!token
      setCaptchaError(captchaOk ? undefined : "Verify you're not a robot")
    }

    return Object.keys(next).length === 0 && captchaOk
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!validate()) return

    setStatus('submitting')
    try {
      const captchaToken = HCAPTCHA_SITE_KEY ? window.hcaptcha?.getResponse() : undefined
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, renderedAt, captchaToken }),
      })

      const resBody = await res.json().catch(() => null)

      if (!res.ok) {
        // A used/expired token can't be resubmitted — reset so the next
        // attempt (whatever the failure reason) gets a fresh one.
        window.hcaptcha?.reset()
        setStatus(
          resBody?.reason === 'not_configured'
            ? 'not_configured'
            : resBody?.reason === 'captcha_failed'
              ? 'idle'
              : 'error',
        )
        if (resBody?.reason === 'captcha_failed') {
          setCaptchaError('Verification failed - please try again')
        }
        return
      }

      // Fired before navigating so it lands even though the component
      // unmounts immediately after — a real page (not just a swapped-in
      // success message) is what lets this show up as a GA4/Google Ads
      // conversion goal by URL, and survives a refresh/bookmark.
      trackEvent('generate_lead', {
        service: form.serviceSlug || 'unspecified',
        urgency: form.urgency || 'unspecified',
      })
      setForm(makeInitialState())
      const params = new URLSearchParams({ urgency: form.urgency || '' })
      if (resBody?.reference) params.set('ref', resBody.reference)
      router.push(`/contact/thank-you?${params.toString()}`)
    } catch {
      setStatus('error')
    }
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

        <Field label="Email" error={errors.email}>
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
        <p className="border-l-2 border-orange bg-orange/5 px-4 py-3 text-sm text-ink">
          For active electrical hazards (sparking, burning smell, exposed
          live wiring), call {company.phone} directly rather than waiting
          for a form response.
        </p>
      )}

      {HCAPTCHA_SITE_KEY && !captchaLoadFailed && (
        <div>
          <Script
            src="https://js.hcaptcha.com/1/api.js"
            strategy="afterInteractive"
            async
            defer
            onError={() => setCaptchaLoadFailed(true)}
          />
          <div className="h-captcha" data-sitekey={HCAPTCHA_SITE_KEY} />
          {captchaError && (
            <span role="alert" className="mt-1.5 block text-xs font-semibold text-ink">
              {captchaError}
            </span>
          )}
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="inline-flex items-center justify-center rounded bg-yellow px-8 py-3.5 text-sm font-semibold text-ink transition-colors hover:bg-yellow/90 disabled:opacity-60"
      >
        {status === 'submitting' ? 'Submitting…' : 'Submit Request'}
      </button>

      {status === 'error' && (
        <p className="text-sm text-ink">
          Something went wrong. Please call {company.phone} instead.
        </p>
      )}
    </form>
  )
}

function inputClass(hasError: boolean) {
  return `w-full border bg-paper px-4 py-3 text-sm text-ink placeholder:text-ink/60 focus:outline-none focus:ring-2 focus:ring-petrol ${
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
  children: React.ReactElement<any>
}) {
  // Derived from the label rather than a new prop at every call site — every
  // label here is a fixed, unique string, so this stays stable and unique
  // without touching each Field usage individually.
  const errorId = `${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-error`
  return (
    <label className="block">
      <span className="eyebrow text-ink/60">{label}</span>
      <span className="mt-2 block">
        {cloneElement(children, {
          'aria-invalid': !!error,
          'aria-describedby': error ? errorId : undefined,
        })}
      </span>
      {error && (
        <span id={errorId} role="alert" className="mt-1.5 block text-xs font-semibold text-ink">
          {error}
        </span>
      )}
    </label>
  )
}
