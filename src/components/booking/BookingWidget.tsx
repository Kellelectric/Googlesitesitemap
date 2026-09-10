'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'
import { company } from '@/content/company'
import { isDateBookable } from '@/lib/bookingSlots'
import { trackEvent } from '@/lib/analytics'
import {
  SERVICE_CATEGORIES,
  inspectionAreas,
  getResidentialTier,
  describePrice,
  computeExactPrice,
  type ServiceCategory,
  type ReportChoice,
} from '@/content/inspectionPricing'

declare global {
  interface Window {
    hcaptcha?: {
      getResponse: (widgetId?: string) => string
      reset: (widgetId?: string) => void
    }
    PaystackPop?: {
      setup: (options: {
        key: string
        email: string
        amount: number
        currency: string
        ref: string
        onClose: () => void
        callback: (response: { reference: string }) => void
      }) => { openIframe: () => void }
    }
  }
}

const HCAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY
const PAYSTACK_PUBLIC_KEY = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY

// Step order: what do you need service for (and its price) comes first,
// per client direction - pricing should only appear once a visitor is
// actually booking and has picked their service type, not as a page
// section anyone can browse. 'payment' is only inserted between
// 'details' and the final submit when the selection pins down one exact
// fee and Paystack is configured - see computeExactPrice's comment.
type Step = 'category' | 'date' | 'time' | 'details' | 'payment' | 'success'
type LoadState = 'checking' | 'ready' | 'not_configured'

function nextDays(count: number): string[] {
  const out: string[] = []
  const start = new Date()
  for (let i = 0; out.length < count && i < count + 14; i += 1) {
    const d = new Date(start.getTime() + i * 24 * 60 * 60 * 1000)
    out.push(d.toISOString().slice(0, 10))
  }
  return out
}

function formatDateLabel(dateStr: string): { weekday: string; day: string; month: string } {
  const d = new Date(`${dateStr}T12:00:00Z`)
  return {
    weekday: d.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' }),
    day: d.toLocaleDateString('en-US', { day: 'numeric', timeZone: 'UTC' }),
    month: d.toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' }),
  }
}

function formatTimeLabel(hhmm: string): string {
  const [h, m] = hhmm.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const hour12 = h % 12 === 0 ? 12 : h % 12
  return `${hour12}:${String(m).padStart(2, '0')} ${period}`
}

// Real on-site booking backed by the client's actual Google Calendar (see
// lib/googleCalendar.ts) - no redirect to Google's own booking page. Falls
// back to the plain "open booking page" link if GOOGLE_CALENDAR_* env vars
// aren't set yet, so the page still works during setup.
export function BookingWidget() {
  const [loadState, setLoadState] = useState<LoadState>('checking')
  const [step, setStep] = useState<Step>('category')
  const [category, setCategory] = useState<ServiceCategory | null>(null)
  const [areaSlug, setAreaSlug] = useState<string | null>(null)
  const [reportChoice, setReportChoice] = useState<ReportChoice | null>(null)
  const [payError, setPayError] = useState<string | null>(null)
  const [paystackLoadFailed, setPaystackLoadFailed] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [slots, setSlots] = useState<string[]>([])
  const [slotsLoading, setSlotsLoading] = useState(false)
  const [noSlotsMessage, setNoSlotsMessage] = useState<string | null>(null)

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [notes, setNotes] = useState('')
  const [website, setWebsite] = useState('') // honeypot
  const [renderedAt] = useState(() => Date.now())
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [captchaError, setCaptchaError] = useState<string | undefined>()
  const [captchaLoadFailed, setCaptchaLoadFailed] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [reference, setReference] = useState<string | null>(null)

  const days = nextDays(10)

  // Fail open, not closed: if the hCaptcha script never loads (ad blocker,
  // privacy extension, a network that blocks hcaptcha.com outright — all
  // observed in the field), window.hcaptcha stays undefined forever and a
  // real customer would be stuck unable to book at all. Losing bot
  // protection to an infrastructure hiccup is a far smaller cost than
  // losing a real booking, and the honeypot/time-trap/rate-limit checks
  // still apply either way. Mirrors QuoteForm.tsx's same fix.
  useEffect(() => {
    if (!HCAPTCHA_SITE_KEY) return
    const timer = setTimeout(() => {
      if (!window.hcaptcha) setCaptchaLoadFailed(true)
    }, 6000)
    return () => clearTimeout(timer)
  }, [])

  // Probe availability for the first bookable day to learn whether the
  // calendar backend is configured at all, before showing any UI that
  // assumes it is.
  useEffect(() => {
    const firstBookable = days.find((d) => isDateBookable(d)) ?? days[0]
    fetch(`/api/availability?date=${firstBookable}`)
      .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        if (!ok && data?.reason === 'not_configured') {
          setLoadState('not_configured')
          return
        }
        setLoadState('ready')
      })
      .catch(() => setLoadState('not_configured'))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function selectDate(date: string) {
    setSelectedDate(date)
    setSelectedTime(null)
    setSlots([])
    setNoSlotsMessage(null)
    setStep('time')
    setSlotsLoading(true)
    fetch(`/api/availability?date=${date}`)
      .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        if (!ok) {
          setLoadState('not_configured')
          return
        }
        setSlots(data.slots ?? [])
        if (!data.slots || data.slots.length === 0) {
          setNoSlotsMessage('No available times on this date - try another day.')
        }
      })
      .catch(() => setNoSlotsMessage('Could not load times - please try again.'))
      .finally(() => setSlotsLoading(false))
  }

  function selectTime(time: string) {
    setSelectedTime(time)
    setStep('details')
    trackEvent('book_appointment_slot_selected')
  }

  function validate(): boolean {
    const next: Record<string, string> = {}
    if (!name.trim()) next.name = 'Enter your name'
    if (!/^[+0-9\s()-]{7,}$/.test(phone.trim())) next.phone = 'Enter a valid phone number'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      next.email = 'Enter a valid email address'
    }
    if (!address.trim()) next.address = 'Enter the job location'
    setFieldErrors(next)

    let captchaOk = true
    if (HCAPTCHA_SITE_KEY && !captchaLoadFailed) {
      const token = window.hcaptcha?.getResponse()
      captchaOk = !!token
      setCaptchaError(captchaOk ? undefined : "Verify you're not a robot")
    }

    return Object.keys(next).length === 0 && captchaOk
  }

  // Only the residential near tier (with a with/without-report choice
  // made) resolves to one exact figure - everything else is a range, so
  // there's nothing exact to charge upfront for it. See
  // content/inspectionPricing.ts's computeExactPrice for the full reasoning.
  const exactPrice = category ? computeExactPrice(category, areaSlug, reportChoice) : null
  const paymentRequired = exactPrice !== null && !!PAYSTACK_PUBLIC_KEY

  async function handleSubmit(paystackReference?: string) {
    if (!selectedDate || !selectedTime) return
    if (!paystackReference && !validate()) return

    setSubmitting(true)
    setSubmitError(null)
    try {
      const captchaToken = HCAPTCHA_SITE_KEY ? window.hcaptcha?.getResponse() : undefined
      const res = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phone,
          email,
          address,
          notes: notes || undefined,
          date: selectedDate,
          time: selectedTime,
          serviceCategory: category ?? undefined,
          areaSlug: areaSlug ?? undefined,
          reportChoice: reportChoice ?? undefined,
          paystackReference,
          website,
          renderedAt,
          captchaToken,
        }),
      })
      const data = await res.json().catch(() => null)
      window.hcaptcha?.reset()

      if (!res.ok) {
        if (data?.reason === 'slot_taken') {
          setSubmitError('That time was just booked by someone else - pick another.')
          setStep('time')
          selectDate(selectedDate)
          return
        }
        if (data?.reason === 'captcha_failed') {
          setCaptchaError('Verification failed - please try again')
          return
        }
        if (data?.reason === 'not_configured') {
          setLoadState('not_configured')
          return
        }
        if (data?.reason === 'payment_failed' || data?.reason === 'payment_required') {
          setPayError(
            'We could not confirm your payment. If you were charged, contact us with your payment reference and we will sort it out - otherwise please try paying again.',
          )
          setStep('payment')
          return
        }
        setSubmitError('Something went wrong. Please call or WhatsApp us instead.')
        return
      }

      trackEvent('book_appointment_confirmed', { date: selectedDate })
      setReference(data.reference ?? null)
      setStep('success')
    } catch {
      setSubmitError('Something went wrong. Please call or WhatsApp us instead.')
    } finally {
      setSubmitting(false)
    }
  }

  // From the details step: either go straight to submitting (no exact
  // price, or Paystack isn't configured yet - booking works exactly as
  // it did before payment existed) or, once a payment is actually
  // required, validate the details first and only then move to the
  // payment step - a visitor shouldn't pay before their details are
  // even valid.
  function continueFromDetails() {
    if (!paymentRequired) {
      handleSubmit()
      return
    }
    if (!validate()) return
    setPayError(null)
    setStep('payment')
  }

  function openPaystackCheckout() {
    if (!PAYSTACK_PUBLIC_KEY || exactPrice === null) return
    if (!window.PaystackPop) {
      setPayError('Payment could not load. Please refresh and try again, or call/WhatsApp us.')
      return
    }
    setPayError(null)
    const handler = window.PaystackPop.setup({
      key: PAYSTACK_PUBLIC_KEY,
      email,
      amount: exactPrice * 100, // Paystack expects kobo
      currency: 'NGN',
      ref: `KE-PAY-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
      onClose: () => {
        // Visitor closed the popup without paying - stay put, no error.
      },
      callback: (response) => {
        // The client-side callback firing is not proof of payment on its
        // own - app/api/book/route.ts re-verifies this reference against
        // Paystack's own API (status, amount, currency) before creating
        // the calendar event.
        handleSubmit(response.reference)
      },
    })
    handler.openIframe()
  }

  if (loadState === 'checking') {
    return (
      <div className="flex h-[400px] items-center justify-center border border-ink/10 bg-paper text-sm text-ink/60">
        Loading available times…
      </div>
    )
  }

  if (loadState === 'not_configured') {
    return (
      <div className="border border-ink/10 bg-paper">
        <iframe
          src={`${company.bookingUrl}?gv=true`}
          title="Book an appointment with Kell Electricals"
          className="h-[720px] w-full"
          loading="lazy"
        />
        <p className="p-4 text-sm text-ink/60">
          Having trouble with the calendar above?{' '}
          <a
            href={company.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="link-underline text-petrol"
            onClick={() => trackEvent('book_appointment_clicked')}
          >
            Open the booking page in a new tab
          </a>
          .
        </p>
      </div>
    )
  }

  if (step === 'payment' && category && exactPrice !== null) {
    const priceLabel = `₦${exactPrice.toLocaleString('en-NG')}`
    return (
      <div className="border border-ink/10 bg-paper p-8 text-center">
        {PAYSTACK_PUBLIC_KEY && (
          <Script
            src="https://js.paystack.co/v1/inline.js"
            strategy="afterInteractive"
            onError={() => setPaystackLoadFailed(true)}
          />
        )}
        <h3 className="text-xl font-semibold text-ink">Confirm and pay</h3>
        <p className="mt-3 text-sm leading-relaxed text-ink/70">
          Paying {priceLabel} confirms your appointment
          {selectedDate && selectedTime && (
            <>
              {' '}
              for{' '}
              {new Date(`${selectedDate}T12:00:00Z`).toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                timeZone: 'UTC',
              })}{' '}
              at {formatTimeLabel(selectedTime)}
            </>
          )}
          . We only add this to our calendar once payment succeeds.
        </p>
        <button
          type="button"
          disabled={submitting || paystackLoadFailed}
          onClick={openPaystackCheckout}
          className="mt-6 inline-flex items-center justify-center rounded bg-yellow px-8 py-3.5 text-sm font-semibold text-ink transition-colors hover:bg-yellow/90 disabled:opacity-60"
        >
          {submitting ? 'Confirming…' : `Pay ${priceLabel} to Confirm`}
        </button>
        {paystackLoadFailed && (
          <p className="mt-4 text-sm text-ink">
            Payment could not load. Please call {company.phone} or WhatsApp us to book
            directly.
          </p>
        )}
        {payError && <p className="mt-4 text-sm text-ink">{payError}</p>}
        <button
          type="button"
          onClick={() => setStep('details')}
          className="mt-4 text-sm text-ink/60 underline"
        >
          Back to your details
        </button>
      </div>
    )
  }

  if (step === 'success') {
    return (
      <div className="border border-ink/10 bg-paper p-8 text-center">
        <h3 className="text-xl font-semibold text-ink">Appointment confirmed</h3>
        <p className="mt-3 text-sm leading-relaxed text-ink/70">
          {selectedDate && selectedTime && (
            <>
              {new Date(`${selectedDate}T12:00:00Z`).toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                timeZone: 'UTC',
              })}{' '}
              at {formatTimeLabel(selectedTime)}
              <br />
            </>
          )}
          We&rsquo;ve added this to our calendar and sent you a confirmation email. If
          anything needs to change, call us at {company.phone}.
        </p>
        {reference && <p className="mt-4 text-xs text-ink/50">Reference: {reference}</p>}
      </div>
    )
  }

  const selectedAreaTier = areaSlug ? getResidentialTier(areaSlug) : undefined
  const priceLabel = category ? describePrice(category, areaSlug, reportChoice) : null
  const categoryComplete = category !== null && (category !== 'residential' || areaSlug !== null)

  return (
    <div className="border border-ink/10 bg-paper p-6 sm:p-8">
      <div>
        <span className="eyebrow text-petrol/70">Step 1 - What do you need service for?</span>
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {SERVICE_CATEGORIES.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => {
                setCategory(c.value)
                if (c.value !== 'residential') {
                  setAreaSlug(null)
                  setReportChoice(null)
                }
              }}
              className={`border px-3 py-3 text-sm font-semibold transition-colors ${
                category === c.value
                  ? 'border-petrol bg-petrol text-paper'
                  : 'border-ink/15 text-ink hover:border-petrol'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {category === 'residential' && (
          <div className="mt-4">
            <BookingField label="Your area">
              <select
                value={areaSlug ?? ''}
                onChange={(e) => {
                  setAreaSlug(e.target.value || null)
                  setReportChoice(null)
                }}
                className={fieldClass(false)}
              >
                <option value="">Select your area</option>
                {inspectionAreas.map((area) => (
                  <option key={area.slug} value={area.slug}>
                    {area.name}
                  </option>
                ))}
              </select>
            </BookingField>

            {areaSlug && selectedAreaTier === 'near' && (
              <div className="mt-4 flex flex-wrap gap-2">
                {(['without', 'with'] as const).map((choice) => (
                  <button
                    key={choice}
                    type="button"
                    onClick={() => setReportChoice(choice)}
                    className={`border px-3 py-2 text-sm transition-colors ${
                      reportChoice === choice
                        ? 'border-petrol bg-petrol text-paper'
                        : 'border-ink/15 text-ink hover:border-petrol'
                    }`}
                  >
                    {choice === 'without' ? 'Without a report' : 'With a custom report'}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {priceLabel && (
          <p className="mt-4 text-sm font-semibold text-ink">Price: {priceLabel}</p>
        )}

        {step === 'category' && (
          <button
            type="button"
            disabled={!categoryComplete}
            onClick={() => setStep('date')}
            className="mt-6 inline-flex items-center justify-center rounded bg-yellow px-8 py-3.5 text-sm font-semibold text-ink transition-colors hover:bg-yellow/90 disabled:opacity-60"
          >
            Continue
          </button>
        )}
      </div>

      {step !== 'category' && (
      <div className="mt-8">
        <span className="eyebrow text-petrol/70">Step 2 - Pick a date</span>
        <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
          {days.map((date) => {
            const bookable = isDateBookable(date)
            const label = formatDateLabel(date)
            const isSelected = date === selectedDate
            return (
              <button
                key={date}
                type="button"
                disabled={!bookable}
                onClick={() => selectDate(date)}
                className={`flex shrink-0 flex-col items-center rounded border px-4 py-3 text-sm transition-colors ${
                  isSelected
                    ? 'border-petrol bg-petrol text-paper'
                    : bookable
                      ? 'border-ink/15 text-ink hover:border-petrol'
                      : 'cursor-not-allowed border-ink/10 text-ink/30'
                }`}
              >
                <span className="text-xs">{label.weekday}</span>
                <span className="mt-1 text-lg font-semibold">{label.day}</span>
                <span className="text-xs">{label.month}</span>
              </button>
            )
          })}
        </div>
      </div>
      )}

      {(step === 'time' || step === 'details') && selectedDate && (
        <div className="mt-8">
          <span className="eyebrow text-petrol/70">Step 3 - Pick a time</span>
          {slotsLoading ? (
            <p className="mt-4 text-sm text-ink/60">Loading available times…</p>
          ) : noSlotsMessage ? (
            <p className="mt-4 text-sm text-ink/60">{noSlotsMessage}</p>
          ) : (
            <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4">
              {slots.map((time) => (
                <button
                  key={time}
                  type="button"
                  onClick={() => selectTime(time)}
                  className={`border px-3 py-2.5 text-sm transition-colors ${
                    time === selectedTime
                      ? 'border-petrol bg-petrol text-paper'
                      : 'border-ink/15 text-ink hover:border-petrol'
                  }`}
                >
                  {formatTimeLabel(time)}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {step === 'details' && (
        <div className="mt-8 space-y-6">
          <span className="eyebrow text-petrol/70">Step 4 - Your details</span>

          <input
            type="text"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="absolute left-[-9999px] h-0 w-0 opacity-0"
          />

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <BookingField label="Full name" error={fieldErrors.name}>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={fieldClass(!!fieldErrors.name)}
                autoComplete="name"
              />
            </BookingField>
            <BookingField label="Phone number" error={fieldErrors.phone}>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={fieldClass(!!fieldErrors.phone)}
                autoComplete="tel"
                placeholder="+234"
              />
            </BookingField>
            <BookingField label="Email" error={fieldErrors.email}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={fieldClass(!!fieldErrors.email)}
                autoComplete="email"
              />
            </BookingField>
            <BookingField label="Job address" error={fieldErrors.address}>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className={fieldClass(!!fieldErrors.address)}
                autoComplete="street-address"
                placeholder="e.g. Wuse 2, Abuja"
              />
            </BookingField>
          </div>

          <BookingField label="Notes (optional)">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className={fieldClass(false)}
              placeholder="Anything we should know ahead of the visit?"
            />
          </BookingField>

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
            type="button"
            disabled={submitting}
            onClick={() => continueFromDetails()}
            className="inline-flex items-center justify-center rounded bg-yellow px-8 py-3.5 text-sm font-semibold text-ink transition-colors hover:bg-yellow/90 disabled:opacity-60"
          >
            {submitting
              ? 'Booking…'
              : paymentRequired
                ? 'Continue to Payment'
                : 'Confirm Booking'}
          </button>

          {submitError && <p className="text-sm text-ink">{submitError}</p>}
        </div>
      )}
    </div>
  )
}

function fieldClass(hasError: boolean): string {
  return `w-full border bg-paper px-4 py-3 text-sm text-ink placeholder:text-ink/60 focus:outline-none focus:ring-2 focus:ring-petrol ${
    hasError ? 'border-orange' : 'border-ink/15'
  }`
}

function BookingField({
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
      {error && <span role="alert" className="mt-1.5 block text-xs font-semibold text-ink">{error}</span>}
    </label>
  )
}
