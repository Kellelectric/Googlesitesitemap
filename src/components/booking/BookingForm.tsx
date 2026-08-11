'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { FieldWrapper, Select, TextArea, TextInput } from '@/components/assessment/FormField'
import { SelectionCard } from '@/components/assessment/SelectionCard'
import { abujaAreas, appointmentTypeOptions, preferredContactOptions } from '@/lib/assessment/steps'
import { formatNaira } from '@/config/business'

type ServiceSummary = {
  slug: string
  name: string
  description: string
  included: string[]
  priceFromNgn: number | null
  inspectionFeeNgn: number | null
  durationMinutes: number
}

export function BookingForm({ service, leadId }: { service: ServiceSummary; leadId?: string }) {
  const router = useRouter()
  const [appointmentType, setAppointmentType] = useState('on-site-assessment')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [slots, setSlots] = useState<{ time: string; label: string }[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [notes, setNotes] = useState('')
  const [contact, setContact] = useState({ name: '', phone: '', whatsapp: '', email: '', preferredContact: 'phone' as const })
  const [location, setLocation] = useState({ city: 'Abuja', area: '' })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!date) {
      setSlots([])
      return
    }
    setLoadingSlots(true)
    setTime('')
    fetch(`/api/booking/availability?service=${service.slug}&date=${date}`)
      .then((r) => r.json())
      .then((data) => setSlots(data.ok ? data.slots : []))
      .finally(() => setLoadingSlots(false))
  }, [date, service.slug])

  const requiresContact = !leadId
  const canSubmit =
    Boolean(date && time) &&
    (!requiresContact || (contact.name.trim().length > 1 && /^[+0-9\s()-]{7,20}$/.test(contact.phone) && location.area))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit) {
      setError('Please select a date, time, and complete your details.')
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      const response = await fetch('/api/booking/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId,
          serviceSlug: service.slug,
          appointmentType,
          date,
          time,
          notes: notes || undefined,
          ...(requiresContact ? { contact, location } : {}),
        }),
      })
      const data = await response.json()
      if (!response.ok || !data.ok) {
        setError(
          data.reason === 'slot_unavailable'
            ? 'That time was just booked by someone else — please choose another slot.'
            : 'Something went wrong. Please try again.',
        )
        setSubmitting(false)
        if (data.reason === 'slot_unavailable' && date) {
          fetch(`/api/booking/availability?service=${service.slug}&date=${date}`)
            .then((r) => r.json())
            .then((d) => setSlots(d.ok ? d.slots : []))
        }
        return
      }
      window.sessionStorage.setItem(
        'kell-booking-confirmation',
        JSON.stringify({
          reference: data.reference,
          serviceName: service.name,
          date,
          time,
          name: contact.name,
          phone: contact.phone,
          location: `${location.area}, ${location.city}`,
        }),
      )
      router.push(`/book/${service.slug}/confirmation`)
    } catch {
      setError('Something went wrong. Please check your connection and try again.')
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <p className="mb-3 text-sm font-semibold text-ink">How would you like us to help?</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {appointmentTypeOptions.map((option) => (
            <SelectionCard
              key={option.value}
              option={option}
              selected={appointmentType === option.value}
              onSelect={setAppointmentType}
              name="appointmentType"
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <FieldWrapper label="Preferred date" htmlFor="b-date">
          <TextInput id="b-date" type="date" min={new Date().toISOString().slice(0, 10)} value={date} onChange={(e) => setDate(e.target.value)} required />
        </FieldWrapper>
        <FieldWrapper label="Available time" htmlFor="b-time">
          {loadingSlots ? (
            <p className="py-2.5 text-sm text-ink/50">Checking availability…</p>
          ) : date && slots.length === 0 ? (
            <p className="py-2.5 text-sm text-ink/50">No availability that day — try another date.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {slots.map((slot) => (
                <button
                  key={slot.time}
                  type="button"
                  onClick={() => setTime(slot.time)}
                  className={`min-h-[44px] rounded border px-4 text-sm font-semibold transition-colors ${
                    time === slot.time ? 'border-petrol bg-petrol text-paper' : 'border-ink/20 text-ink hover:border-petrol/50'
                  }`}
                >
                  {slot.label}
                </button>
              ))}
            </div>
          )}
        </FieldWrapper>
      </div>

      {requiresContact && (
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <FieldWrapper label="Full name" htmlFor="b-name">
              <TextInput id="b-name" value={contact.name} onChange={(e) => setContact((p) => ({ ...p, name: e.target.value }))} required />
            </FieldWrapper>
            <FieldWrapper label="Phone number" htmlFor="b-phone">
              <TextInput id="b-phone" type="tel" placeholder="+234" value={contact.phone} onChange={(e) => setContact((p) => ({ ...p, phone: e.target.value }))} required />
            </FieldWrapper>
            <FieldWrapper label="WhatsApp number" htmlFor="b-whatsapp" optional>
              <TextInput id="b-whatsapp" type="tel" value={contact.whatsapp} onChange={(e) => setContact((p) => ({ ...p, whatsapp: e.target.value }))} />
            </FieldWrapper>
            <FieldWrapper label="Email" htmlFor="b-email" optional>
              <TextInput id="b-email" type="email" value={contact.email} onChange={(e) => setContact((p) => ({ ...p, email: e.target.value }))} />
            </FieldWrapper>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <FieldWrapper label="City" htmlFor="b-city">
              <TextInput id="b-city" value={location.city} onChange={(e) => setLocation((p) => ({ ...p, city: e.target.value }))} />
            </FieldWrapper>
            <FieldWrapper label="Area / District" htmlFor="b-area">
              <Select id="b-area" value={location.area} onChange={(e) => setLocation((p) => ({ ...p, area: e.target.value }))} required>
                <option value="" disabled>
                  Select an area
                </option>
                {abujaAreas.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </Select>
            </FieldWrapper>
          </div>
          <FieldWrapper label="Preferred contact method" htmlFor="b-preferred">
            <div className="grid grid-cols-3 gap-3">
              {preferredContactOptions.map((option) => (
                <SelectionCard
                  key={option.value}
                  option={option}
                  selected={contact.preferredContact === option.value}
                  onSelect={(v) => setContact((p) => ({ ...p, preferredContact: v as never }))}
                  name="preferredContact"
                />
              ))}
            </div>
          </FieldWrapper>
        </>
      )}

      <FieldWrapper label="Anything else we should know?" htmlFor="b-notes" optional>
        <TextArea id="b-notes" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />
      </FieldWrapper>

      <p className="text-xs text-ink/45">
        {service.name} — from {formatNaira(service.inspectionFeeNgn ?? service.priceFromNgn)}. Final pricing may
        depend on site conditions, measurements, materials, access and the scope confirmed by our engineer.
      </p>

      {error && (
        <p role="alert" className="text-sm text-orange">
          {error}
        </p>
      )}

      <Button type="submit" variant="primary" className="min-h-[44px] w-full justify-center sm:w-auto" disabled={submitting || !canSubmit}>
        {submitting ? 'Booking…' : `Book ${service.name}`}
      </Button>
    </form>
  )
}
