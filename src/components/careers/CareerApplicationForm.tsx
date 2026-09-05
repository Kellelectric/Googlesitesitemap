'use client'

import { cloneElement, FormEvent, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Script from 'next/script'
import Link from 'next/link'
import { company } from '@/content/company'
import { trackEvent } from '@/lib/analytics'

declare global {
  interface Window {
    hcaptcha?: {
      getResponse: (widgetId?: string) => string
      reset: (widgetId?: string) => void
    }
  }
}

const HCAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY

function useFormRenderedAt() {
  const [renderedAt] = useState(() => Date.now())
  return renderedAt
}

type FormStatus = 'idle' | 'submitting' | 'error' | 'not_configured'

type FormState = {
  fullName: string
  email: string
  phone: string
  courseOrInstitution: string
  roleAppliedFor: string
  cvLink: string
  message: string
  website: string // honeypot
}

function makeInitialState(): FormState {
  return {
    fullName: '',
    email: '',
    phone: '',
    courseOrInstitution: '',
    roleAppliedFor: '',
    cvLink: '',
    message: '',
    website: '',
  }
}

type CareerApplicationFormProps = {
  trackSlug: string
  trackName: string
  // Only job-openings currently lists specific roles to choose from - any
  // other track leaves this empty and the field doesn't render.
  roleOptions?: string[]
}

// Collects the fields common to every career track on-site. Follows the
// same submit/spam-protection pattern as QuoteForm.tsx (see
// app/api/careers-application/route.ts): honeypot, time-trap, optional
// hCaptcha.
//
// For apprenticeship/industrial-training/internship, the API route hands
// back a pre-filled link to that track's official Google Form (see
// src/content/careerFormRouting.ts for why this is a redirect rather than
// a silent server-side submission) - the thank-you page surfaces it as
// the next step. job-openings/nysc-placement have no Google Form and stay
// fully on-site.
export function CareerApplicationForm({
  trackSlug,
  trackName,
  roleOptions,
}: CareerApplicationFormProps) {
  const router = useRouter()
  const [form, setForm] = useState<FormState>(makeInitialState)
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [captchaError, setCaptchaError] = useState<string | undefined>()
  const [captchaLoadFailed, setCaptchaLoadFailed] = useState(false)
  const [status, setStatus] = useState<FormStatus>('idle')
  const renderedAt = useFormRenderedAt()
  const startedTracked = useRef(false)

  useEffect(() => {
    if (!HCAPTCHA_SITE_KEY) return
    const timer = setTimeout(() => {
      if (!window.hcaptcha) setCaptchaLoadFailed(true)
    }, 6000)
    return () => clearTimeout(timer)
  }, [])

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    if (!startedTracked.current) {
      startedTracked.current = true
      trackEvent('career_application_started', { track: trackSlug })
    }
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function validate(): boolean {
    const next: Partial<Record<keyof FormState, string>> = {}
    if (!form.fullName.trim()) next.fullName = 'Enter your full name'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      next.email = 'Enter a valid email address'
    }
    if (!/^[+0-9\s()-]{7,}$/.test(form.phone.trim())) next.phone = 'Enter a valid phone number'
    if (roleOptions && roleOptions.length > 0 && !form.roleAppliedFor) {
      next.roleAppliedFor = 'Select the role you’re applying for'
    }
    if (!form.message.trim()) next.message = 'Add a short note on why you’re applying'
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
    trackEvent('career_application_submitted', { track: trackSlug })
    try {
      const captchaToken = HCAPTCHA_SITE_KEY ? window.hcaptcha?.getResponse() : undefined
      const res = await fetch('/api/careers-application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, trackSlug, renderedAt, captchaToken }),
      })

      const resBody = await res.json().catch(() => null)

      if (!res.ok) {
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
        } else if (resBody?.reason !== 'not_configured') {
          trackEvent('career_application_error', {
            track: trackSlug,
            reason: resBody?.reason ?? 'unknown',
          })
        }
        return
      }

      trackEvent('career_application_success', { track: trackSlug })
      trackEvent('generate_lead', { track: trackSlug, source: 'careers_application' })
      setForm(makeInitialState())
      const params = new URLSearchParams({ track: trackSlug })
      if (resBody?.reference) params.set('ref', resBody.reference)
      // apprenticeship/industrial-training/internship: the applicant still
      // has to finish the official Google Form (photo, DOB, consent - see
      // careerFormRouting.ts) - carried through as a query param so the
      // thank-you page can show it as the next step, not silently drop it.
      if (resBody?.redirectUrl) params.set('continue', resBody.redirectUrl)
      router.push(`/careers/thank-you?${params.toString()}`)
    } catch {
      setStatus('error')
      trackEvent('career_application_error', { track: trackSlug, reason: 'network' })
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
          lost, but please email your application to{' '}
          <a href={`mailto:${company.email}`} className="link-underline font-semibold">
            {company.email}
          </a>{' '}
          or call {company.phone} directly.
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
        <Field label="Full name" error={errors.fullName}>
          <input
            type="text"
            value={form.fullName}
            onChange={(e) => update('fullName', e.target.value)}
            className={inputClass(!!errors.fullName)}
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

        <Field label="Course of study / institution (if applicable)">
          <input
            type="text"
            value={form.courseOrInstitution}
            onChange={(e) => update('courseOrInstitution', e.target.value)}
            className={inputClass(false)}
            placeholder="e.g. Electrical Engineering, University of Abuja"
          />
        </Field>
      </div>

      {roleOptions && roleOptions.length > 0 && (
        <Field label={`Role you're applying for`} error={errors.roleAppliedFor}>
          <select
            value={form.roleAppliedFor}
            onChange={(e) => update('roleAppliedFor', e.target.value)}
            className={inputClass(!!errors.roleAppliedFor)}
          >
            <option value="">Select a role</option>
            {roleOptions.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
            <option value="other">Other / not listed</option>
          </select>
        </Field>
      )}

      <Field label="Link to your CV (Google Drive, Dropbox, etc. - optional)">
        <input
          type="url"
          value={form.cvLink}
          onChange={(e) => update('cvLink', e.target.value)}
          className={inputClass(false)}
          placeholder="https://"
        />
      </Field>

      <Field label={`Why do you want to join Kell Electricals for ${trackName}?`} error={errors.message}>
        <textarea
          value={form.message}
          onChange={(e) => update('message', e.target.value)}
          rows={5}
          className={inputClass(!!errors.message)}
          placeholder="A short note on your background and why you're applying."
        />
      </Field>

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

      <p className="text-xs leading-relaxed text-ink/60">
        By submitting, you agree that the information above is collected to
        assess your application for this programme, per our{' '}
        <Link href="/legal/privacy" className="link-underline">
          Privacy Policy
        </Link>
        .
      </p>

      <button
        type="submit"
        disabled={status === 'submitting'}
        aria-busy={status === 'submitting'}
        className="inline-flex items-center justify-center rounded bg-yellow px-8 py-3.5 text-sm font-semibold text-ink transition-colors hover:bg-yellow/90 disabled:opacity-60"
      >
        {status === 'submitting' ? 'Submitting…' : 'Submit Application'}
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
