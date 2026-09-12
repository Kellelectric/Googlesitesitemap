'use client'

import { cloneElement, FormEvent, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { company } from '@/content/company'
import { trackEvent } from '@/lib/analytics'

// Nigeria's 36 states + the FCT, for the "current state" field shown when
// a track is Abuja-only (see careers.ts's `abujaOnly` field). "FCT (Abuja)"
// is the value that satisfies the Abuja-only gate below.
const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue',
  'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu',
  'FCT (Abuja)', 'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina',
  'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo',
  'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara',
]

const ABUJA_STATE_VALUE = 'FCT (Abuja)'
// Applied to the "Why do you want to join Kell Electricals for X?" field -
// stops a one-word non-answer ("Money", "Job") from passing as a real
// motivation statement, without demanding an essay.
const MIN_MESSAGE_LENGTH = 50

function useFormRenderedAt() {
  const [renderedAt] = useState(() => Date.now())
  return renderedAt
}

type FormStatus = 'idle' | 'submitting' | 'error' | 'not_configured'

type FormState = {
  fullName: string
  email: string
  phone: string
  state: string
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
    state: '',
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
  // NYSC Placement, Industrial Training, and Apprenticeship only - see
  // careers.ts's `abujaOnly` field. Makes "current state" required and
  // blocks submission (with an explanatory error, not a silent reject)
  // when the applicant isn't based in the FCT.
  requiresAbuja?: boolean
}

// Collects the fields common to every career track on-site. Follows the
// same submit/spam-protection pattern as QuoteForm.tsx (see
// app/api/careers-application/route.ts): honeypot + time-trap. No captcha -
// deliberately removed (see git history) after it was blocking legitimate
// applicants from submitting.
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
  requiresAbuja,
}: CareerApplicationFormProps) {
  const router = useRouter()
  const [form, setForm] = useState<FormState>(makeInitialState)
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [status, setStatus] = useState<FormStatus>('idle')
  const [showValidationSummary, setShowValidationSummary] = useState(false)
  const renderedAt = useFormRenderedAt()
  const startedTracked = useRef(false)
  const formRef = useRef<HTMLFormElement>(null)

  // Runs after errors/showValidationSummary have actually committed to the
  // DOM (an effect, not inline in handleSubmit - see its comment), so the
  // aria-invalid="true" attributes this queries for are guaranteed present.
  useEffect(() => {
    if (!showValidationSummary) return
    const firstInvalid = formRef.current?.querySelector<HTMLElement>(
      '[aria-invalid="true"]',
    )
    firstInvalid?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    firstInvalid?.focus()
  }, [showValidationSummary, errors])

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
    if (requiresAbuja) {
      if (!form.state) {
        next.state = 'Select your current state'
      } else if (form.state !== ABUJA_STATE_VALUE) {
        next.state = `We're only able to accept ${trackName} applicants currently based in the FCT (Abuja) - sorry, we can't proceed with this application.`
      }
    }
    if (roleOptions && roleOptions.length > 0 && !form.roleAppliedFor) {
      next.roleAppliedFor = 'Select the role you’re applying for'
    }
    if (form.message.trim().length < MIN_MESSAGE_LENGTH) {
      next.message = `Tell us a bit more - at least ${MIN_MESSAGE_LENGTH} characters (${form.message.trim().length}/${MIN_MESSAGE_LENGTH} so far)`
    }
    setErrors(next)

    return Object.keys(next).length === 0
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!validate()) {
      // Without this, an invalid field above the fold (Full name, Phone,
      // Email - all higher up than the message field/submit button on a
      // long form) fails validation silently: errors[] updates, but
      // nothing visible happens anywhere near the button the applicant
      // just tapped. On mobile especially, that reads as "the submit
      // button doesn't work" rather than "a field above needs fixing" -
      // this is a real reported symptom, not a hypothetical. Setting this
      // flag triggers the scroll-to-first-invalid-field effect below
      // (deferred to an effect, not done here, since setErrors() inside
      // validate() hasn't committed to the DOM yet at this point in the
      // same event handler - querying aria-invalid synchronously here
      // would always miss, finding last render's DOM).
      setShowValidationSummary(true)
      return
    }

    setShowValidationSummary(false)
    setStatus('submitting')
    trackEvent('career_application_submitted', { track: trackSlug })
    try {
      const res = await fetch('/api/careers-application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, trackSlug, renderedAt }),
      })

      const resBody = await res.json().catch(() => null)

      if (!res.ok) {
        setStatus(
          resBody?.reason === 'not_configured'
            ? 'not_configured'
            : resBody?.reason === 'not_abuja'
              ? 'idle'
              : 'error',
        )
        if (resBody?.reason === 'not_abuja') {
          // Defense-in-depth: the client-side gate in validate() already
          // stops this in the normal flow - this only fires if that check
          // was somehow bypassed (stale state, a direct API call).
          setErrors((prev) => ({
            ...prev,
            state: `We're only able to accept ${trackName} applicants currently based in the FCT (Abuja) - sorry, we can't proceed with this application.`,
          }))
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
    <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-6">
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

        {requiresAbuja && (
          <Field label="Your current state" error={errors.state}>
            <select
              value={form.state}
              onChange={(e) => update('state', e.target.value)}
              className={inputClass(!!errors.state)}
            >
              <option value="">Select your state</option>
              {NIGERIAN_STATES.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </Field>
        )}
      </div>

      {requiresAbuja && (
        <p className="border-l-2 border-yellow bg-petrol/5 px-4 py-3 text-sm leading-relaxed text-ink/75">
          {trackName} is only open to applicants currently based in Abuja
          (FCT) - we&rsquo;re not able to accept applications from other
          states for this programme.
        </p>
      )}

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
          minLength={MIN_MESSAGE_LENGTH}
          className={inputClass(!!errors.message)}
          placeholder="A short note on your background and why you're applying."
        />
      </Field>
      {!errors.message && (
        <p className="-mt-3 text-xs text-ink/50">
          {form.message.trim().length}/{MIN_MESSAGE_LENGTH} characters minimum
        </p>
      )}

      <p className="text-xs leading-relaxed text-ink/60">
        By submitting, you agree that the information above is collected to
        assess your application for this programme, per our{' '}
        <Link href="/legal/privacy" className="link-underline">
          Privacy Policy
        </Link>
        .
      </p>

      {showValidationSummary && Object.keys(errors).length > 0 && (
        <p role="alert" className="text-sm font-semibold text-orange">
          Please fix the highlighted field{Object.keys(errors).length > 1 ? 's' : ''}{' '}
          above before submitting.
        </p>
      )}

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
