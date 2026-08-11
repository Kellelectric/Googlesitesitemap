'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { FieldWrapper, Select, TextArea, TextInput } from './FormField'
import { SelectionCard } from './SelectionCard'
import { abujaAreas, preferredContactOptions } from '@/lib/assessment/steps'
import { buildWhatsAppBookingMessage, buildWhatsAppUrl } from '@/lib/whatsapp'

type FormState = {
  name: string
  phone: string
  whatsapp: string
  city: string
  area: string
  issueDescription: string
  preferredContact: 'phone' | 'whatsapp' | 'email'
}

const initial: FormState = {
  name: '',
  phone: '',
  whatsapp: '',
  city: 'Abuja',
  area: '',
  issueDescription: '',
  preferredContact: 'phone',
}

export function EmergencyForm() {
  const [form, setForm] = useState<FormState>(initial)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<{ reference: string; whatsappNumber: string } | null>(null)

  const valid = form.name.trim().length > 1 && /^[+0-9\s()-]{7,20}$/.test(form.phone) && form.area && form.issueDescription.trim().length > 4

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!valid) {
      setError('Please complete all required fields.')
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      const response = await fetch('/api/assessment/emergency', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          whatsapp: form.whatsapp || undefined,
          location: { city: form.city, area: form.area },
          issueDescription: form.issueDescription,
          preferredContact: form.preferredContact,
        }),
      })
      const data = await response.json()
      if (!response.ok || !data.ok) {
        setError('We couldn\'t send your request. Please call us directly.')
        setSubmitting(false)
        return
      }
      setResult({ reference: data.reference, whatsappNumber: data.whatsappNumber })
    } catch {
      setError('We couldn\'t send your request. Please call us directly.')
      setSubmitting(false)
    }
  }

  if (result) {
    const whatsappMessage = buildWhatsAppBookingMessage({
      name: form.name,
      service: 'Emergency Electrical Response',
      location: `${form.area}, ${form.city}`,
      reference: result.reference,
    })
    return (
      <div className="rounded border border-orange/30 bg-white p-8 text-center">
        <h2 className="font-display text-2xl font-semibold text-ink">We’ve received your emergency request.</h2>
        <p className="mt-3 text-ink/60">
          Reference <strong>{result.reference}</strong>. Our team will contact you as soon as possible.
        </p>
        <p className="mx-auto mt-6 max-w-md text-sm text-ink/60">
          If there is an immediate electrical safety concern, keep people away from the affected area and
          avoid touching exposed electrical components.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button href={buildWhatsAppUrl(result.whatsappNumber, whatsappMessage)} variant="primary" target="_blank" rel="noopener noreferrer">
            Continue on WhatsApp
          </Button>
          <Button href={`tel:${form.phone}`} variant="secondary">
            We’ll call {form.phone}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded border border-orange/30 bg-white p-6 sm:p-8">
      <FieldWrapper label="Full name" htmlFor="e-name">
        <TextInput id="e-name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required />
      </FieldWrapper>
      <FieldWrapper label="Phone number" htmlFor="e-phone">
        <TextInput id="e-phone" type="tel" placeholder="+234" value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} required />
      </FieldWrapper>
      <FieldWrapper label="WhatsApp number" htmlFor="e-whatsapp" optional>
        <TextInput id="e-whatsapp" type="tel" value={form.whatsapp} onChange={(e) => setForm((p) => ({ ...p, whatsapp: e.target.value }))} />
      </FieldWrapper>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <FieldWrapper label="City" htmlFor="e-city">
          <TextInput id="e-city" value={form.city} onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))} required />
        </FieldWrapper>
        <FieldWrapper label="Area / District" htmlFor="e-area">
          <Select id="e-area" value={form.area} onChange={(e) => setForm((p) => ({ ...p, area: e.target.value }))} required>
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
      <FieldWrapper label="Describe what's happening" htmlFor="e-issue">
        <TextArea id="e-issue" rows={4} value={form.issueDescription} onChange={(e) => setForm((p) => ({ ...p, issueDescription: e.target.value }))} required />
      </FieldWrapper>
      <FieldWrapper label="Preferred contact method" htmlFor="e-contact">
        <div className="grid grid-cols-3 gap-3">
          {preferredContactOptions.map((option) => (
            <SelectionCard
              key={option.value}
              option={option}
              selected={form.preferredContact === option.value}
              onSelect={(v) => setForm((p) => ({ ...p, preferredContact: v as never }))}
              name="preferredContact"
            />
          ))}
        </div>
      </FieldWrapper>
      {error && (
        <p role="alert" className="text-sm text-orange">
          {error}
        </p>
      )}
      <Button type="submit" variant="primary" className="w-full min-h-[44px] justify-center" disabled={submitting}>
        {submitting ? 'Sending…' : 'Request Emergency Assistance'}
      </Button>
    </form>
  )
}
