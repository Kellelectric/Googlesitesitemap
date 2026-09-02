'use client'

import { FormEvent, useMemo, useState } from 'react'
import { company } from '@/content/company'
import { engagementTypes, timeSlots, getUpcomingBusinessDays } from '@/content/booking'

type FormStatus = 'idle' | 'submitting' | 'success' | 'error' | 'not_configured'

type FormState = {
  name: string
  company: string
  phone: string
  email: string
  engagementSlug: string
  siteAddress: string
  preferredDate: string
  preferredTimeSlotId: string
  notes: string
  website: string
}

const initialState: FormState = {
  name: '',
  company: '',
  phone: '',
  email: '',
  engagementSlug: '',
  siteAddress: '',
  preferredDate: '',
  preferredTimeSlotId: '',
  notes: '',
  website: '',
}

function formatDayChip(date: Date) {
  return {
    weekday: date.toLocaleDateString('en-GB', { weekday: 'short' }),
    day: date.toLocaleDateString('en-GB', { day: '2-digit' }),
    month: date.toLocaleDateString('en-GB', { month: 'short' }),
    iso: date.toISOString().slice(0, 10),
  }
}

export function BookingForm() {
  const [form, setForm] = useState<FormState>(initialState)
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [status, setStatus] = useState<FormStatus>('idle')

  const days = useMemo(() => getUpcomingBusinessDays(10).map(formatDayChip), [])

  const selectedEngagement = engagementTypes.find((e) => e.slug === form.engagementSlug)
  const selectedDay = days.find((d) => d.iso === form.preferredDate)
  const selectedSlot = timeSlots.find((s) => s.id === form.preferredTimeSlotId)

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function validate(): boolean {
    const next: Partial<Record<keyof FormState, string>> = {}
    if (!form.engagementSlug) next.engagementSlug = 'Select what this appointment is for'
    if (!form.preferredDate) next.preferredDate = 'Select a preferred date'
    if (!form.preferredTimeSlotId) next.preferredTimeSlotId = 'Select a preferred time window'
    if (!form.name.trim()) next.name = 'Enter your name'
    if (!/^[+0-9\s()-]{7,}$/.test(form.phone.trim())) next.phone = 'Enter a valid phone number'
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      next.email = 'Enter a valid email address'
    }
    if (!form.siteAddress.trim()) next.siteAddress = 'Enter the site address'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!validate()) return

    setStatus('submitting')
    try {
      const res = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
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
      <div className="border border-copper/30 bg-petrol-700/50 p-8">
        <h3 className="font-display text-xl font-semibold text-paper">Appointment requested</h3>
        <p className="mt-3 text-sm leading-relaxed text-paper/70">
          We&rsquo;ll confirm your exact slot by phone or email within one
          business day. For anything time-sensitive, call{' '}
          <a href={company.phoneHref} className="link-underline font-semibold text-yellow">
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
        <h3 className="font-display text-xl font-semibold text-paper">
          Online booking isn&rsquo;t connected yet
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-paper/70">
          This form isn&rsquo;t wired to a destination yet — nothing was
          lost, but please call{' '}
          <a href={company.phoneHref} className="link-underline font-semibold text-yellow">
            {company.phone}
          </a>{' '}
          or WhatsApp us directly to reserve a slot.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px] lg:items-start">
      <form onSubmit={handleSubmit} noValidate className="space-y-10">
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

        {/* Step 1 — engagement type */}
        <fieldset>
          <legend className="font-mono text-[0.7rem] uppercase tracking-[0.1em] text-copper">
            01 · What&rsquo;s this appointment for
          </legend>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {engagementTypes.map((type) => {
              const active = form.engagementSlug === type.slug
              return (
                <button
                  key={type.slug}
                  type="button"
                  onClick={() => update('engagementSlug', type.slug)}
                  aria-pressed={active}
                  className={`border p-4 text-left transition-colors ${
                    active
                      ? 'border-yellow bg-yellow/10'
                      : 'border-paper/15 hover:border-paper/35'
                  }`}
                >
                  <span className="block font-display text-sm font-semibold text-paper">
                    {type.label}
                  </span>
                  <span className="mt-1.5 block text-xs leading-relaxed text-paper/60">
                    {type.description}
                  </span>
                </button>
              )
            })}
          </div>
          {errors.engagementSlug && <ErrorText>{errors.engagementSlug}</ErrorText>}
        </fieldset>

        {/* Step 2 — date */}
        <fieldset>
          <legend className="font-mono text-[0.7rem] uppercase tracking-[0.1em] text-copper">
            02 · Preferred date
          </legend>
          <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
            {days.map((d) => {
              const active = form.preferredDate === d.iso
              return (
                <button
                  key={d.iso}
                  type="button"
                  onClick={() => update('preferredDate', d.iso)}
                  aria-pressed={active}
                  className={`flex w-16 shrink-0 flex-col items-center border py-3 font-mono transition-colors ${
                    active
                      ? 'border-yellow bg-yellow/10 text-yellow'
                      : 'border-paper/15 text-paper/70 hover:border-paper/35'
                  }`}
                >
                  <span className="text-[0.7rem] uppercase tracking-wide">{d.weekday}</span>
                  <span className="mt-1 text-lg font-medium tabular-nums">{d.day}</span>
                  <span className="text-[0.7rem] uppercase tracking-wide">{d.month}</span>
                </button>
              )
            })}
          </div>
          {errors.preferredDate && <ErrorText>{errors.preferredDate}</ErrorText>}
        </fieldset>

        {/* Step 3 — time window */}
        <fieldset>
          <legend className="font-mono text-[0.7rem] uppercase tracking-[0.1em] text-copper">
            03 · Preferred time window
          </legend>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {timeSlots.map((slot) => {
              const active = form.preferredTimeSlotId === slot.id
              return (
                <button
                  key={slot.id}
                  type="button"
                  onClick={() => update('preferredTimeSlotId', slot.id)}
                  aria-pressed={active}
                  className={`border py-3 text-center font-mono text-sm tabular-nums transition-colors ${
                    active
                      ? 'border-yellow bg-yellow/10 text-yellow'
                      : 'border-paper/15 text-paper/70 hover:border-paper/35'
                  }`}
                >
                  {slot.label}
                </button>
              )
            })}
          </div>
          {errors.preferredTimeSlotId && <ErrorText>{errors.preferredTimeSlotId}</ErrorText>}
          <p className="mt-2 text-xs text-paper/50">
            A preferred window, not a live calendar — we confirm the exact
            slot within one business day.
          </p>
        </fieldset>

        {/* Step 4 — contact details */}
        <fieldset className="space-y-6">
          <legend className="font-mono text-[0.7rem] uppercase tracking-[0.1em] text-copper">
            04 · Contact &amp; site details
          </legend>

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
            <Field label="Company (optional)">
              <input
                type="text"
                value={form.company}
                onChange={(e) => update('company', e.target.value)}
                className={inputClass(false)}
                autoComplete="organization"
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
          </div>

          <Field label="Site address" error={errors.siteAddress}>
            <input
              type="text"
              value={form.siteAddress}
              onChange={(e) => update('siteAddress', e.target.value)}
              className={inputClass(!!errors.siteAddress)}
              placeholder="e.g. Plot 14, Gwarinpa, Abuja"
            />
          </Field>

          <Field label="Anything we should know before the visit? (optional)">
            <textarea
              value={form.notes}
              onChange={(e) => update('notes', e.target.value)}
              rows={4}
              className={inputClass(false)}
              placeholder="Site access, scope context, prior work done."
            />
          </Field>
        </fieldset>

        <button
          type="submit"
          disabled={status === 'submitting'}
          className="inline-flex items-center justify-center rounded bg-yellow px-8 py-3.5 text-sm font-semibold text-ink transition-colors hover:bg-yellow/90 disabled:opacity-60"
        >
          {status === 'submitting' ? 'Requesting…' : 'Request Appointment'}
        </button>

        {status === 'error' && (
          <p className="text-sm text-orange">
            Something went wrong. Please call {company.phone} instead.
          </p>
        )}
      </form>

      {/* Live summary — the appointment ticket, instrument-readout style */}
      <div className="sticky top-24 border border-copper/25 bg-petrol-700/50 p-6">
        <span className="font-mono text-[0.7rem] uppercase tracking-[0.1em] text-copper">
          Appointment request
        </span>
        <dl className="mt-4 space-y-4 font-mono text-sm">
          <TicketRow label="Type" value={selectedEngagement?.label ?? '—'} />
          <TicketRow label="Date" value={selectedDay ? `${selectedDay.weekday} ${selectedDay.day} ${selectedDay.month}` : '—'} />
          <TicketRow label="Window" value={selectedSlot?.label ?? '—'} />
          <TicketRow label="Contact" value={form.name || '—'} />
        </dl>
        <p className="mt-6 border-t border-paper/10 pt-4 text-xs leading-relaxed text-paper/50">
          Priority scheduling for commercial and industrial engagements.
          For an active hazard, call{' '}
          <a href={company.phoneHref} className="link-underline text-paper/70">
            {company.phone}
          </a>{' '}
          instead of booking.
        </p>
      </div>
    </div>
  )
}

function TicketRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-[0.7rem] uppercase tracking-wide text-paper/45">{label}</dt>
      <dd className="truncate text-right text-paper/85">{value}</dd>
    </div>
  )
}

function ErrorText({ children }: { children: React.ReactNode }) {
  return <p className="mt-2 text-xs text-orange">{children}</p>
}

function inputClass(hasError: boolean) {
  return `w-full border bg-petrol-700/40 px-4 py-3 text-sm text-paper placeholder:text-paper/35 focus:outline-none focus:ring-2 focus:ring-yellow ${
    hasError ? 'border-orange' : 'border-paper/15'
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
      <span className="font-mono text-[0.7rem] uppercase tracking-[0.06em] text-paper/50">{label}</span>
      <span className="mt-2 block">{children}</span>
      {error && <ErrorText>{error}</ErrorText>}
    </label>
  )
}
