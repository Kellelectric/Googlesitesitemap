'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { buildIcsFile } from '@/lib/ics'
import { buildWhatsAppBookingMessage, buildWhatsAppUrl } from '@/lib/whatsapp'
import { company } from '@/content/company'

type ConfirmationData = {
  reference: string
  serviceName: string
  date: string
  time: string
  name: string
  phone: string
  location: string
}

export function BookingConfirmation() {
  const [data, setData] = useState<ConfirmationData | null>(null)

  useEffect(() => {
    const raw = window.sessionStorage.getItem('kell-booking-confirmation')
    if (raw) setData(JSON.parse(raw) as ConfirmationData)
  }, [])

  if (!data) {
    return (
      <div className="container-content py-20 text-center">
        <p className="text-ink/60">We couldn’t find a recent booking.</p>
        <Button href="/book" className="mt-6">
          Book a Service
        </Button>
      </div>
    )
  }

  function downloadIcs() {
    if (!data) return
    const [h, m] = data.time.split(':').map(Number)
    const startsAt = new Date(`${data.date}T00:00:00.000Z`)
    startsAt.setUTCHours(h, m, 0, 0)
    const ics = buildIcsFile({
      title: `${data.serviceName} — Kell Electricals`,
      description: `Reference ${data.reference}`,
      location: `${data.location}, ${company.address.city}, Nigeria`,
      startsAt,
      durationMinutes: 90,
      reference: data.reference,
    })
    const blob = new Blob([ics], { type: 'text/calendar' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `kell-electricals-${data.reference}.ics`
    a.click()
    URL.revokeObjectURL(url)
  }

  const whatsappMessage = buildWhatsAppBookingMessage({
    name: data.name,
    service: data.serviceName,
    location: data.location,
    preferredDate: data.date,
    preferredTime: data.time,
    reference: data.reference,
  })

  return (
    <section className="container-content py-16 sm:py-24">
      <div className="mx-auto max-w-lg text-center">
        <h1 className="font-display text-3xl font-semibold text-ink">Your request is with our team.</h1>
        <p className="mt-4 text-ink/60">
          Thank you. We’ve received your request for {data.serviceName}. We’ll contact you using your
          preferred contact method to confirm the appointment.
        </p>

        <dl className="mx-auto mt-8 max-w-sm space-y-3 rounded border border-ink/10 bg-white p-6 text-left">
          <Row label="Service" value={data.serviceName} />
          <Row label="Date" value={data.date} />
          <Row label="Time" value={data.time} />
          <Row label="Location" value={data.location} />
          <Row label="Reference" value={data.reference} />
        </dl>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button variant="primary" onClick={downloadIcs}>
            Add to Calendar
          </Button>
          <Button
            href={buildWhatsAppUrl(company.whatsappHref.replace('https://wa.me/', ''), whatsappMessage)}
            variant="secondary"
            target="_blank"
            rel="noopener noreferrer"
          >
            Continue on WhatsApp
          </Button>
          <Button href="/" variant="ghost">
            Back to Kell Electricals
          </Button>
        </div>
      </div>
    </section>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <dt className="text-ink/50">{label}</dt>
      <dd className="font-semibold text-ink">{value}</dd>
    </div>
  )
}
