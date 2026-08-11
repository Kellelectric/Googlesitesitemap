'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { ProgressBar } from './ProgressBar'
import { QuestionHeader } from './QuestionHeader'
import { SelectionCard } from './SelectionCard'
import { FieldWrapper, Select, TextArea, TextInput } from './FormField'
import {
  visibleSteps,
  projectSizeOptionsFor,
  abujaAreas,
  documentationOptions,
  appointmentTypeOptions,
  preferredContactOptions,
} from '@/lib/assessment/steps'
import type { AssessmentAnswers } from '@/lib/assessment/types'

const STORAGE_KEY = 'kell-assessment-v1'

function loadStored(): AssessmentAnswers {
  if (typeof window === 'undefined') return {}
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as AssessmentAnswers) : {}
  } catch {
    return {}
  }
}

function isStepComplete(key: string, answers: AssessmentAnswers): boolean {
  switch (key) {
    case 'need':
      return Boolean(answers.need)
    case 'propertyType':
      return Boolean(answers.propertyType)
    case 'issue':
      return Boolean(answers.issue)
    case 'installPlan':
      return Boolean(answers.installPlan)
    case 'solarGoal':
      return Boolean(answers.solarGoal)
    case 'urgency':
      return Boolean(answers.urgency)
    case 'location':
      return Boolean(answers.location?.city && answers.location?.area)
    case 'projectStage':
      return Boolean(answers.projectStage)
    case 'projectSize':
      return Boolean(answers.projectSize)
    case 'documentation':
      return true
    case 'primaryGoal':
      return Boolean(answers.primaryGoal)
    case 'contact':
      return Boolean(
        answers.contact?.name &&
          answers.contact?.phone &&
          /^[+0-9\s()-]{7,20}$/.test(answers.contact.phone) &&
          answers.contact?.preferredContact,
      )
    case 'additionalInfo':
      return true
    case 'appointment':
      return Boolean(answers.appointment?.type)
    default:
      return true
  }
}

export function AssessmentWizard() {
  const router = useRouter()
  const [answers, setAnswers] = useState<AssessmentAnswers>({ documentation: ['nothing-yet'] })
  const [stepKey, setStepKey] = useState('need')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [touched, setTouched] = useState(false)

  useEffect(() => {
    const stored = loadStored()
    if (Object.keys(stored).length > 0) setAnswers((prev) => ({ ...prev, ...stored }))
  }, [])

  useEffect(() => {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(answers))
  }, [answers])

  const steps = useMemo(() => visibleSteps(answers), [answers])
  const currentIndex = Math.max(
    0,
    steps.findIndex((s) => s.key === stepKey),
  )
  const step = steps[currentIndex] ?? steps[0]
  const isLast = currentIndex === steps.length - 1
  const complete = isStepComplete(step.key, answers)

  function goTo(index: number) {
    const target = steps[index]
    if (target) {
      setStepKey(target.key)
      setTouched(false)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  function handleNeedOrUrgencySelect(key: 'need' | 'urgency', value: string) {
    setAnswers((prev) => ({ ...prev, [key]: value }))
    if (key === 'urgency' && value === 'emergency') {
      router.push('/assessment/emergency')
      return
    }
  }

  async function handleSubmit() {
    setSubmitting(true)
    setSubmitError(null)
    try {
      const response = await fetch('/api/assessment/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      })
      const data = await response.json()
      if (!response.ok || !data.ok) {
        setSubmitError('Something went wrong sending your assessment. Please try again.')
        setSubmitting(false)
        return
      }
      window.sessionStorage.setItem(
        'kell-assessment-result',
        JSON.stringify({ answers, ...data }),
      )
      window.sessionStorage.removeItem(STORAGE_KEY)
      router.push('/assessment/result')
    } catch {
      setSubmitError('Something went wrong sending your assessment. Please check your connection and try again.')
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:py-16">
      <ProgressBar current={currentIndex + 1} total={steps.length} />
      <QuestionHeader question={step.question} supporting={step.supporting} />

      <div className="mb-24">
        <StepBody
          step={step}
          answers={answers}
          setAnswers={setAnswers}
          onNeedSelect={(v) => handleNeedOrUrgencySelect('need', v)}
          onUrgencySelect={(v) => handleNeedOrUrgencySelect('urgency', v)}
        />
        {touched && !complete && (
          <p role="alert" className="mt-4 text-sm text-orange">
            Please complete this step to continue.
          </p>
        )}
        {submitError && (
          <p role="alert" className="mt-4 text-sm text-orange">
            {submitError}
          </p>
        )}
      </div>

      <div className="fixed inset-x-0 bottom-0 border-t border-ink/10 bg-paper/95 px-4 py-4 backdrop-blur sm:static sm:border-0 sm:bg-transparent sm:px-0 sm:py-0">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-3">
          <Button
            type="button"
            variant="ghost"
            className="min-h-[44px]"
            onClick={() => goTo(currentIndex - 1)}
            disabled={currentIndex === 0}
            style={currentIndex === 0 ? { visibility: 'hidden' } : undefined}
          >
            <Icon name="arrowLeft" className="h-4 w-4" /> Back
          </Button>
          {isLast ? (
            <Button
              type="button"
              className="min-h-[44px]"
              disabled={submitting}
              onClick={() => {
                setTouched(true)
                if (isStepComplete(step.key, answers)) handleSubmit()
              }}
            >
              {submitting ? 'Sending…' : 'Get My Assessment'}
            </Button>
          ) : (
            <Button
              type="button"
              className="min-h-[44px]"
              onClick={() => {
                setTouched(true)
                if (isStepComplete(step.key, answers)) goTo(currentIndex + 1)
              }}
            >
              Continue <Icon name="arrowRight" className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

function StepBody({
  step,
  answers,
  setAnswers,
  onNeedSelect,
  onUrgencySelect,
}: {
  step: ReturnType<typeof visibleSteps>[number]
  answers: AssessmentAnswers
  setAnswers: React.Dispatch<React.SetStateAction<AssessmentAnswers>>
  onNeedSelect: (value: string) => void
  onUrgencySelect: (value: string) => void
}) {
  if (step.key === 'need') {
    return <OptionGrid options={step.options ?? []} value={answers.need} onSelect={onNeedSelect} name="need" />
  }
  if (step.key === 'urgency') {
    return <OptionGrid options={step.options ?? []} value={answers.urgency} onSelect={onUrgencySelect} name="urgency" />
  }
  if (step.key === 'propertyType') {
    return (
      <OptionGrid
        options={step.options ?? []}
        value={answers.propertyType}
        onSelect={(v) => setAnswers((prev) => ({ ...prev, propertyType: v as never }))}
        name="propertyType"
      />
    )
  }
  if (step.key === 'issue') {
    return <OptionGrid options={step.options ?? []} value={answers.issue} onSelect={(v) => setAnswers((p) => ({ ...p, issue: v }))} name="issue" />
  }
  if (step.key === 'installPlan') {
    return (
      <OptionGrid options={step.options ?? []} value={answers.installPlan} onSelect={(v) => setAnswers((p) => ({ ...p, installPlan: v }))} name="installPlan" />
    )
  }
  if (step.key === 'solarGoal') {
    return (
      <OptionGrid options={step.options ?? []} value={answers.solarGoal} onSelect={(v) => setAnswers((p) => ({ ...p, solarGoal: v }))} name="solarGoal" />
    )
  }
  if (step.key === 'projectStage') {
    return (
      <OptionGrid options={step.options ?? []} value={answers.projectStage} onSelect={(v) => setAnswers((p) => ({ ...p, projectStage: v }))} name="projectStage" />
    )
  }
  if (step.key === 'projectSize') {
    return (
      <OptionGrid
        options={projectSizeOptionsFor(answers.propertyType)}
        value={answers.projectSize}
        onSelect={(v) => setAnswers((p) => ({ ...p, projectSize: v }))}
        name="projectSize"
      />
    )
  }
  if (step.key === 'primaryGoal') {
    return (
      <OptionGrid options={step.options ?? []} value={answers.primaryGoal} onSelect={(v) => setAnswers((p) => ({ ...p, primaryGoal: v }))} name="primaryGoal" />
    )
  }
  if (step.key === 'documentation') {
    const selected = answers.documentation ?? []
    return (
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {documentationOptions.map((option) => (
          <SelectionCard
            key={option.value}
            option={option}
            selected={selected.includes(option.value)}
            multi
            name="documentation"
            onSelect={(v) =>
              setAnswers((prev) => {
                const current = prev.documentation ?? []
                const next = current.includes(v) ? current.filter((c) => c !== v) : [...current, v]
                return { ...prev, documentation: next }
              })
            }
          />
        ))}
      </div>
    )
  }
  if (step.key === 'location') {
    return <LocationForm answers={answers} setAnswers={setAnswers} />
  }
  if (step.key === 'contact') {
    return <ContactForm answers={answers} setAnswers={setAnswers} />
  }
  if (step.key === 'additionalInfo') {
    return (
      <TextArea
        rows={5}
        value={answers.additionalInfo ?? ''}
        onChange={(e) => setAnswers((p) => ({ ...p, additionalInfo: e.target.value }))}
        placeholder="Tell us anything that may help our engineer understand the project before we contact you."
      />
    )
  }
  if (step.key === 'appointment') {
    return <AppointmentForm answers={answers} setAnswers={setAnswers} />
  }
  return null
}

function OptionGrid({
  options,
  value,
  onSelect,
  name,
}: {
  options: { value: string; label: string; description?: string; icon?: string }[]
  value?: string
  onSelect: (value: string) => void
  name: string
}) {
  return (
    <div className="grid grid-cols-1 gap-3">
      {options.map((option) => (
        <SelectionCard key={option.value} option={option} selected={value === option.value} onSelect={onSelect} name={name} />
      ))}
    </div>
  )
}

function LocationForm({
  answers,
  setAnswers,
}: {
  answers: AssessmentAnswers
  setAnswers: React.Dispatch<React.SetStateAction<AssessmentAnswers>>
}) {
  const location = answers.location ?? { city: 'Abuja', area: '' }
  return (
    <div className="space-y-5">
      <FieldWrapper label="City" htmlFor="loc-city">
        <TextInput id="loc-city" value={location.city} onChange={(e) => setAnswers((p) => ({ ...p, location: { ...location, city: e.target.value } }))} />
      </FieldWrapper>
      <FieldWrapper label="Area / District" htmlFor="loc-area">
        <Select id="loc-area" value={location.area} onChange={(e) => setAnswers((p) => ({ ...p, location: { ...location, area: e.target.value } }))}>
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
      <FieldWrapper label="Property address" htmlFor="loc-address" optional>
        <TextInput
          id="loc-address"
          value={location.address ?? ''}
          onChange={(e) => setAnswers((p) => ({ ...p, location: { ...location, address: e.target.value } }))}
        />
      </FieldWrapper>
      <FieldWrapper label="Landmark" htmlFor="loc-landmark" optional>
        <TextInput
          id="loc-landmark"
          value={location.landmark ?? ''}
          onChange={(e) => setAnswers((p) => ({ ...p, location: { ...location, landmark: e.target.value } }))}
        />
      </FieldWrapper>
    </div>
  )
}

function ContactForm({
  answers,
  setAnswers,
}: {
  answers: AssessmentAnswers
  setAnswers: React.Dispatch<React.SetStateAction<AssessmentAnswers>>
}) {
  const contact = answers.contact ?? { name: '', phone: '', preferredContact: 'phone' as const }
  return (
    <div className="space-y-5">
      <FieldWrapper label="Full name" htmlFor="c-name">
        <TextInput id="c-name" value={contact.name} onChange={(e) => setAnswers((p) => ({ ...p, contact: { ...contact, name: e.target.value } }))} />
      </FieldWrapper>
      <FieldWrapper label="Phone number" htmlFor="c-phone">
        <TextInput
          id="c-phone"
          type="tel"
          placeholder="+234"
          value={contact.phone}
          onChange={(e) => setAnswers((p) => ({ ...p, contact: { ...contact, phone: e.target.value } }))}
        />
      </FieldWrapper>
      <FieldWrapper label="WhatsApp number" htmlFor="c-whatsapp" optional>
        <TextInput
          id="c-whatsapp"
          type="tel"
          value={contact.whatsapp ?? ''}
          onChange={(e) => setAnswers((p) => ({ ...p, contact: { ...contact, whatsapp: e.target.value } }))}
        />
      </FieldWrapper>
      <FieldWrapper label="Email" htmlFor="c-email" optional>
        <TextInput
          id="c-email"
          type="email"
          value={contact.email ?? ''}
          onChange={(e) => setAnswers((p) => ({ ...p, contact: { ...contact, email: e.target.value } }))}
        />
      </FieldWrapper>
      <FieldWrapper label="Company name" htmlFor="c-company" optional>
        <TextInput id="c-company" value={contact.company ?? ''} onChange={(e) => setAnswers((p) => ({ ...p, contact: { ...contact, company: e.target.value } }))} />
      </FieldWrapper>
      <FieldWrapper label="Preferred contact method" htmlFor="c-preferred">
        <div className="grid grid-cols-3 gap-3">
          {preferredContactOptions.map((option) => (
            <SelectionCard
              key={option.value}
              option={option}
              selected={contact.preferredContact === option.value}
              onSelect={(v) => setAnswers((p) => ({ ...p, contact: { ...contact, preferredContact: v as never } }))}
              name="preferredContact"
            />
          ))}
        </div>
      </FieldWrapper>
    </div>
  )
}

function AppointmentForm({
  answers,
  setAnswers,
}: {
  answers: AssessmentAnswers
  setAnswers: React.Dispatch<React.SetStateAction<AssessmentAnswers>>
}) {
  const appointment = answers.appointment ?? { type: 'on-site-assessment' as const }
  return (
    <div className="space-y-6">
      <OptionGrid
        options={appointmentTypeOptions}
        value={appointment.type}
        onSelect={(v) => setAnswers((p) => ({ ...p, appointment: { ...appointment, type: v as never } }))}
        name="appointmentType"
      />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <FieldWrapper label="Preferred date" htmlFor="apt-date" optional>
          <TextInput
            id="apt-date"
            type="date"
            min={new Date().toISOString().slice(0, 10)}
            value={appointment.preferredDate ?? ''}
            onChange={(e) => setAnswers((p) => ({ ...p, appointment: { ...appointment, preferredDate: e.target.value } }))}
          />
        </FieldWrapper>
        <FieldWrapper label="Preferred time" htmlFor="apt-time" optional>
          <TextInput
            id="apt-time"
            type="time"
            value={appointment.preferredTime ?? ''}
            onChange={(e) => setAnswers((p) => ({ ...p, appointment: { ...appointment, preferredTime: e.target.value } }))}
          />
        </FieldWrapper>
        <FieldWrapper label="Alternative date" htmlFor="apt-date-2" optional>
          <TextInput
            id="apt-date-2"
            type="date"
            min={new Date().toISOString().slice(0, 10)}
            value={appointment.alternativeDate ?? ''}
            onChange={(e) => setAnswers((p) => ({ ...p, appointment: { ...appointment, alternativeDate: e.target.value } }))}
          />
        </FieldWrapper>
        <FieldWrapper label="Alternative time" htmlFor="apt-time-2" optional>
          <TextInput
            id="apt-time-2"
            type="time"
            value={appointment.alternativeTime ?? ''}
            onChange={(e) => setAnswers((p) => ({ ...p, appointment: { ...appointment, alternativeTime: e.target.value } }))}
          />
        </FieldWrapper>
      </div>
    </div>
  )
}
