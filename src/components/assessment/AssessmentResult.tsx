'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { formatNaira } from '@/config/business'
import { company } from '@/content/company'
import {
  needOptions,
  propertyTypeOptions,
  urgencyOptions,
  issueOptions,
  installPlanOptions,
  solarGoalOptions,
  primaryGoalOptions,
} from '@/lib/assessment/steps'
import { buildWhatsAppBookingMessage, buildWhatsAppUrl } from '@/lib/whatsapp'
import type { AssessmentAnswers } from '@/lib/assessment/types'

type ResultPayload = {
  answers: AssessmentAnswers
  reference: string
  leadId: string
  recommendation: { serviceSlug: string; headline: string; reasoning: string[] }
  service: {
    slug: string
    name: string
    description: string
    included: string[]
    priceFromNgn: number | null
    inspectionFeeNgn: number | null
    durationMinutes: number
  } | null
}

function labelFor(options: { value: string; label: string }[], value?: string) {
  return options.find((o) => o.value === value)?.label
}

export function AssessmentResult() {
  const router = useRouter()
  const [data, setData] = useState<ResultPayload | null>(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    const raw = window.sessionStorage.getItem('kell-assessment-result')
    if (!raw) {
      setNotFound(true)
      return
    }
    setData(JSON.parse(raw) as ResultPayload)
  }, [])

  if (notFound) {
    return (
      <div className="container-content py-20 text-center">
        <p className="text-ink/60">We couldn’t find a recent assessment.</p>
        <Button href="/assessment" className="mt-6">
          Start Assessment
        </Button>
      </div>
    )
  }

  if (!data) return null

  const { answers, recommendation, service, reference, leadId } = data
  const issueDetail =
    labelFor(issueOptions, answers.issue) ?? labelFor(installPlanOptions, answers.installPlan) ?? labelFor(solarGoalOptions, answers.solarGoal)

  const whatsappMessage = buildWhatsAppBookingMessage({
    name: answers.contact?.name ?? '',
    service: service?.name ?? recommendation.headline,
    propertyType: labelFor(propertyTypeOptions, answers.propertyType),
    location: answers.location ? `${answers.location.area}, ${answers.location.city}` : '',
    preferredDate: answers.appointment?.preferredDate,
    preferredTime: answers.appointment?.preferredTime,
    reference,
  })

  function editAnswers() {
    window.sessionStorage.setItem('kell-assessment-v1', JSON.stringify(answers))
    router.push('/assessment/start')
  }

  return (
    <section className="container-content py-12 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <p className="eyebrow text-petrol">Your Recommendation</p>
        <h1 className="mt-3 font-display text-3xl font-semibold text-ink sm:text-4xl">
          Our recommendation: {service ? service.name : recommendation.headline}.
        </h1>
        <p className="mt-4 max-w-xl text-ink/60">
          Based on the information you’ve provided, a professional assessment is the best next step. Our
          engineer will evaluate the existing installation, identify the requirements, and recommend the
          appropriate solution.
        </p>

        {service && (
          <div className="mt-10 rounded border border-petrol/20 bg-white p-6 sm:p-8">
            <p className="eyebrow text-ink/40">Recommended Service</p>
            <h2 className="mt-2 font-display text-2xl font-semibold text-ink">{service.name}</h2>
            <p className="mt-3 text-ink/60">{service.description}</p>
            <p className="mt-4 text-sm font-semibold text-petrol">
              From {formatNaira(service.inspectionFeeNgn ?? service.priceFromNgn)}
            </p>
            <p className="mt-1 text-xs text-ink/45">
              Final pricing may depend on site conditions, measurements, materials, access and the scope
              confirmed by our engineer.
            </p>

            <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-ink/50">What&apos;s included</p>
            <ul className="mt-3 space-y-2">
              {service.included.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-ink/70">
                  <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-yellow" />
                  {item}
                </li>
              ))}
            </ul>

            <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-ink/50">Why we recommend it</p>
            <ul className="mt-3 space-y-2">
              {recommendation.reasoning.map((reason) => (
                <li key={reason} className="text-sm text-ink/70">
                  {reason}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-8 flex flex-wrap gap-4">
          {service && (
            <Button href={`/book/${service.slug}?leadId=${leadId}`} variant="primary">
              Book {service.name}
            </Button>
          )}
          <Button href={`tel:${company.phoneHref.replace('tel:', '')}`} variant="secondary">
            Talk to an Engineer
          </Button>
          <Button href={buildWhatsAppUrl(company.whatsappHref.replace('https://wa.me/', ''), whatsappMessage)} variant="ghost" target="_blank" rel="noopener noreferrer">
            Book on WhatsApp
          </Button>
        </div>

        <div className="mt-14 rounded border border-ink/10 bg-white p-6 sm:p-8">
          <div className="flex items-center justify-between">
            <p className="eyebrow text-ink/40">Your Assessment</p>
            <button type="button" onClick={editAnswers} className="link-underline text-sm font-semibold text-petrol">
              Edit answers
            </button>
          </div>
          <dl className="mt-4 grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
            <SummaryItem label="Service" value={labelFor(needOptions, answers.need)} />
            <SummaryItem label="Property" value={labelFor(propertyTypeOptions, answers.propertyType)} />
            <SummaryItem
              label="Location"
              value={answers.location ? `${answers.location.area}, ${answers.location.city}` : undefined}
            />
            <SummaryItem label="Detail" value={issueDetail} />
            <SummaryItem label="Urgency" value={labelFor(urgencyOptions, answers.urgency)} />
            <SummaryItem label="Goal" value={labelFor(primaryGoalOptions, answers.primaryGoal)} />
            <SummaryItem label="Preferred appointment" value={answers.appointment?.preferredDate ? `${answers.appointment.preferredDate} ${answers.appointment.preferredTime ?? ''}` : undefined} />
            <SummaryItem label="Reference" value={reference} />
          </dl>
        </div>
      </div>
    </section>
  )
}

function SummaryItem({ label, value }: { label: string; value?: string }) {
  if (!value) return null
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-ink/40">{label}</dt>
      <dd className="mt-1 text-sm text-ink/80">{value}</dd>
    </div>
  )
}
