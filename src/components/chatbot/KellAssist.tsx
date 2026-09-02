'use client'

import { FormEvent, useEffect, useRef, useState } from 'react'
import { company } from '@/content/company'
import { services } from '@/content/services'
import { industries } from '@/content/industries'
import {
  conversationStarters,
  emergencyKeywords,
  emergencySafetyMessage,
  solarFlowQuestions,
  solarAssessmentDisclaimer,
  uncertainResponseMessage,
} from '@/content/chatbot'
import { trackEvent } from '@/lib/analytics'

type Message = {
  id: string
  role: 'bot' | 'user'
  text: string
}

type QuickAction = {
  label: string
  onClick: () => void
  variant?: 'primary' | 'link'
}

type LeadContext = {
  serviceSlug?: string
  urgency?: 'standard' | 'urgent' | 'emergency'
  detailsPrefill?: string
  afterSubmit?: 'whatsapp' | 'none'
}

const WELCOME_MESSAGE =
  "Hi, I'm Kell Assist — how can I help with your electrical, solar, security, or automation needs today?"

let idCounter = 0
function nextId() {
  idCounter += 1
  return `m${idCounter}`
}

function isEmergencyText(text: string): boolean {
  const lower = text.toLowerCase()
  return emergencyKeywords.some((k) => lower.includes(k))
}

// Rough keyword routing to real service/industry summaries so quick-reply
// topics have a grounded fallback answer even when the LLM isn't configured
// (no ANTHROPIC_API_KEY set) — never invents content, only quotes summaries
// that already exist in the site's own content files.
function findRelevantSummaries(topic: string): string {
  const lower = topic.toLowerCase()
  const matchedServices = services.filter((s) =>
    lower.includes('cctv') || lower.includes('security')
      ? s.category === 'security-automation' && s.name.toLowerCase().includes('cctv')
      : lower.includes('smart home') || lower.includes('automation')
        ? s.slug === 'home-automation'
        : lower.includes('solar') || lower.includes('inverter')
          ? s.flagship === true
          : lower.includes('commercial')
            ? false
            : lower.includes('industrial')
              ? s.category === 'industrial'
              : false,
  )

  if (matchedServices.length > 0) {
    return matchedServices.map((s) => s.summary).join(' ')
  }

  if (lower.includes('commercial')) {
    const commercial = industries.find((i) => i.slug === 'commercial')
    if (commercial) return commercial.summary
  }
  if (lower.includes('industrial')) {
    const industrial = industries.find((i) => i.slug === 'industrial')
    if (industrial) return industrial.summary
  }

  return `We cover ${services.length} electrical service lines across residential, commercial, and industrial sites in Abuja and ${company.serviceRegion}.`
}

export function KellAssist() {
  const [open, setOpen] = useState(false)
  const [hasOpenedOnce, setHasOpenedOnce] = useState(false)
  const [apiConfigured, setApiConfigured] = useState<boolean | null>(null)
  const [messages, setMessages] = useState<Message[]>([{ id: nextId(), role: 'bot', text: WELCOME_MESSAGE }])
  const [quickActions, setQuickActions] = useState<QuickAction[]>([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [solarStep, setSolarStep] = useState<number | null>(null)
  const [leadFormContext, setLeadFormContext] = useState<LeadContext | null>(null)
  const [leadCaptured, setLeadCaptured] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch('/api/chat')
      .then((r) => r.json())
      .then((d) => setApiConfigured(Boolean(d?.configured)))
      .catch(() => setApiConfigured(false))
  }, [])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, quickActions, leadFormContext])

  function pushBot(text: string) {
    setMessages((prev) => [...prev, { id: nextId(), role: 'bot', text }])
  }
  function pushUser(text: string) {
    setMessages((prev) => [...prev, { id: nextId(), role: 'user', text }])
  }

  function handleOpen() {
    setOpen(true)
    if (!hasOpenedOnce) {
      trackEvent('chat_opened')
      setHasOpenedOnce(true)
    }
  }

  function showEmergencyFlow() {
    trackEvent('emergency_selected')
    pushBot(emergencySafetyMessage)
    setQuickActions([
      {
        label: 'CALL NOW',
        variant: 'primary',
        onClick: () => {
          trackEvent('call_clicked', { source: 'kell_assist' })
          window.location.href = company.phoneHref
        },
      },
      {
        label: 'WHATSAPP NOW',
        variant: 'primary',
        onClick: () => {
          trackEvent('whatsapp_clicked', { source: 'kell_assist' })
          window.open(company.whatsappHref, '_blank', 'noopener')
        },
      },
    ])
  }

  function openLeadForm(context: LeadContext) {
    setQuickActions([])
    setLeadFormContext(context)
  }

  function startSolarFlow() {
    trackEvent('service_selected', { service: 'solar' })
    pushUser('Solar & Inverter')
    setQuickActions([])
    setSolarStep(0)
    pushBot(solarFlowQuestions[0])
  }

  function finishSolarFlow() {
    setSolarStep(null)
    pushBot(solarAssessmentDisclaimer)
    setQuickActions([
      {
        label: 'Book Solar Assessment',
        variant: 'primary',
        onClick: () =>
          openLeadForm({
            serviceSlug: 'solar-inverter-systems',
            afterSubmit: 'none',
            detailsPrefill: 'Requesting a solar/inverter load and site assessment.',
          }),
      },
      {
        label: 'Talk to Engineer',
        onClick: () => openLeadForm({ serviceSlug: 'solar-inverter-systems', afterSubmit: 'whatsapp' }),
      },
      {
        label: 'WhatsApp Team',
        onClick: () => {
          trackEvent('whatsapp_clicked', { source: 'kell_assist' })
          window.open(company.whatsappHref, '_blank', 'noopener')
        },
      },
    ])
  }

  function handleStarterClick(starter: (typeof conversationStarters)[number]) {
    setQuickActions([])
    if (starter === 'Emergency') {
      pushUser('Emergency')
      showEmergencyFlow()
      return
    }
    if (starter === 'Solar & Inverter') {
      startSolarFlow()
      return
    }
    if (starter === 'Request a Quote') {
      trackEvent('quote_requested', { source: 'kell_assist' })
      pushUser('Request a Quote')
      pushBot('Happy to help — tell me a bit about the job and how to reach you.')
      openLeadForm({ afterSubmit: 'none' })
      return
    }

    trackEvent('service_selected', { service: starter })
    pushUser(starter)
    void respondTo(`I'm interested in ${starter}. Can you tell me more about what's included?`, () =>
      findRelevantSummaries(starter),
    )
  }

  async function respondTo(userText: string, fallback: () => string) {
    if (isEmergencyText(userText)) {
      showEmergencyFlow()
      return
    }

    if (apiConfigured === false) {
      pushBot(fallback())
      offerQuoteOrWhatsapp()
      return
    }

    setSending(true)
    try {
      const history = [...messages, { role: 'user' as const, text: userText }]
        .filter((m) => m.role === 'user' || m.role === 'bot')
        .slice(-12)
        .map((m) => ({ role: m.role === 'bot' ? ('assistant' as const) : ('user' as const), content: m.text }))

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
      })
      const data = await res.json()
      if (res.ok && data.ok) {
        pushBot(data.reply)
      } else {
        pushBot(uncertainResponseMessage)
        offerQuoteOrWhatsapp()
      }
    } catch {
      pushBot(uncertainResponseMessage)
      offerQuoteOrWhatsapp()
    } finally {
      setSending(false)
    }
  }

  function offerQuoteOrWhatsapp() {
    setQuickActions([
      { label: 'Request a Quote', variant: 'primary', onClick: () => openLeadForm({ afterSubmit: 'none' }) },
      {
        label: 'WhatsApp Us',
        onClick: () => {
          trackEvent('whatsapp_clicked', { source: 'kell_assist' })
          window.open(company.whatsappHref, '_blank', 'noopener')
        },
      },
    ])
  }

  function handleTalkToEngineer() {
    trackEvent('consultation_requested', { source: 'kell_assist' })
    if (leadCaptured) {
      trackEvent('whatsapp_clicked', { source: 'kell_assist' })
      window.open(company.whatsappHref, '_blank', 'noopener')
      return
    }
    openLeadForm({ afterSubmit: 'whatsapp' })
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const text = input.trim()
    if (!text || sending) return
    setInput('')

    if (isEmergencyText(text)) {
      pushUser(text)
      showEmergencyFlow()
      return
    }

    if (solarStep !== null) {
      pushUser(text)
      const next = solarStep + 1
      if (next < solarFlowQuestions.length) {
        setSolarStep(next)
        pushBot(solarFlowQuestions[next])
      } else {
        finishSolarFlow()
      }
      return
    }

    pushUser(text)
    void respondTo(text, () => findRelevantSummaries(text))
  }

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={handleOpen}
          aria-label="Open Kell Assist chat"
          className="fixed bottom-20 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-petrol text-paper transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow md:bottom-6 md:right-6"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6 fill-current">
            <path d="M4 4h16a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H9l-4.3 3.6A.5.5 0 0 1 4 20.2V17H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z" />
          </svg>
        </button>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex flex-col bg-paper sm:inset-auto sm:bottom-6 sm:right-6 sm:h-[640px] sm:w-[380px] sm:border sm:border-ink/10">
          <header className="flex shrink-0 items-center justify-between bg-petrol px-5 py-4 text-paper">
            <div>
              <p className="font-display text-sm font-semibold">Kell Assist</p>
              <p className="text-xs text-paper/60">Your Kell Electricals Service Assistant</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="flex h-8 w-8 items-center justify-center text-paper/70 hover:text-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow"
            >
              <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4 fill-current">
                <path d="M4.3 4.3a1 1 0 0 1 1.4 0L10 8.6l4.3-4.3a1 1 0 1 1 1.4 1.4L11.4 10l4.3 4.3a1 1 0 0 1-1.4 1.4L10 11.4l-4.3 4.3a1 1 0 0 1-1.4-1.4L8.6 10 4.3 5.7a1 1 0 0 1 0-1.4z" />
              </svg>
            </button>
          </header>

          <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <p
                  className={`max-w-[85%] whitespace-pre-line rounded px-4 py-2.5 text-sm leading-relaxed ${
                    m.role === 'user' ? 'bg-petrol text-paper' : 'bg-ink/5 text-ink'
                  }`}
                >
                  {m.text}
                </p>
              </div>
            ))}

            {sending && <p className="text-xs text-ink/50">Kell Assist is typing…</p>}

            {quickActions.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {quickActions.map((qa) => (
                  <button
                    key={qa.label}
                    type="button"
                    onClick={qa.onClick}
                    className={
                      qa.variant === 'primary'
                        ? 'rounded bg-yellow px-4 py-2 text-xs font-semibold text-ink hover:bg-yellow/90'
                        : 'rounded border border-ink/20 px-4 py-2 text-xs font-semibold text-ink hover:border-petrol hover:text-petrol'
                    }
                  >
                    {qa.label}
                  </button>
                ))}
              </div>
            )}

            {leadFormContext && (
              <LeadCaptureForm
                context={leadFormContext}
                onCancel={() => setLeadFormContext(null)}
                onSuccess={() => {
                  setLeadFormContext(null)
                  setLeadCaptured(true)
                  trackEvent('lead_submitted', { source: 'kell_assist' })
                  pushBot(
                    `Thanks — our team will follow up shortly. For anything urgent, call ${company.phone} directly.`,
                  )
                  if (leadFormContext.afterSubmit === 'whatsapp') {
                    trackEvent('whatsapp_clicked', { source: 'kell_assist' })
                    window.open(company.whatsappHref, '_blank', 'noopener')
                  }
                }}
              />
            )}

            {messages.length <= 1 && quickActions.length === 0 && !leadFormContext && (
              <div className="flex flex-wrap gap-2">
                {conversationStarters.map((starter) => (
                  <button
                    key={starter}
                    type="button"
                    onClick={() => handleStarterClick(starter)}
                    className="rounded border border-ink/20 px-3 py-2 text-xs font-semibold text-ink hover:border-petrol hover:text-petrol"
                  >
                    {starter}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="shrink-0 border-t border-ink/10 px-4 py-2">
            <button
              type="button"
              onClick={handleTalkToEngineer}
              className="link-underline text-xs font-semibold text-petrol"
            >
              Talk to a Kell Electricals Engineer &rarr;
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex shrink-0 gap-2 border-t border-ink/10 p-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message…"
              className="flex-1 border border-ink/15 bg-paper px-3 py-2 text-sm text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-petrol"
            />
            <button
              type="submit"
              disabled={sending || !input.trim()}
              className="rounded bg-petrol px-4 py-2 text-sm font-semibold text-paper disabled:opacity-50"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </>
  )
}

const propertyTypeOptions = ['Residential', 'Commercial', 'Industrial'] as const
const urgencyOptions = [
  { value: 'standard', label: 'Standard: planning ahead' },
  { value: 'urgent', label: 'Urgent: within a few days' },
  { value: 'emergency', label: 'Emergency: needs same-day response' },
] as const

function LeadCaptureForm({
  context,
  onCancel,
  onSuccess,
}: {
  context: LeadContext
  onCancel: () => void
  onSuccess: () => void
}) {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    location: '',
    propertyType: '',
    serviceSlug: context.serviceSlug ?? '',
    urgency: context.urgency ?? '',
    details: context.detailsPrefill ?? '',
  })
  const [status, setStatus] = useState<'idle' | 'submitting' | 'error' | 'not_configured'>('idle')
  const [renderedAt] = useState(() => Date.now())

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!form.name.trim() || !form.phone.trim() || !form.serviceSlug || !form.propertyType || !form.details.trim()) {
      setStatus('error')
      return
    }
    setStatus('submitting')
    try {
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, location: form.location || 'Not specified', channel: 'kell_assist_chatbot', renderedAt }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => null)
        setStatus(body?.reason === 'not_configured' ? 'not_configured' : 'error')
        return
      }
      onSuccess()
    } catch {
      setStatus('error')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 border border-ink/10 bg-paper p-4">
      <p className="text-xs font-semibold text-ink/70">Tell us how to reach you</p>
      <input
        type="text"
        placeholder="Full name"
        value={form.name}
        onChange={(e) => update('name', e.target.value)}
        className="w-full border border-ink/15 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-petrol"
      />
      <input
        type="tel"
        placeholder="Phone number"
        value={form.phone}
        onChange={(e) => update('phone', e.target.value)}
        className="w-full border border-ink/15 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-petrol"
      />
      <input
        type="email"
        placeholder="Email (optional)"
        value={form.email}
        onChange={(e) => update('email', e.target.value)}
        className="w-full border border-ink/15 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-petrol"
      />
      <select
        value={form.propertyType}
        onChange={(e) => update('propertyType', e.target.value)}
        className="w-full border border-ink/15 bg-paper px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-petrol"
      >
        <option value="">Property type</option>
        {propertyTypeOptions.map((p) => (
          <option key={p} value={p.toLowerCase()}>
            {p}
          </option>
        ))}
      </select>
      <select
        value={form.serviceSlug}
        onChange={(e) => update('serviceSlug', e.target.value)}
        className="w-full border border-ink/15 bg-paper px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-petrol"
      >
        <option value="">Service needed</option>
        {services.map((s) => (
          <option key={s.slug} value={s.slug}>
            {s.name}
          </option>
        ))}
        <option value="other">Other / not sure</option>
      </select>
      <input
        type="text"
        placeholder="Location (e.g. Wuse 2, Abuja)"
        value={form.location}
        onChange={(e) => update('location', e.target.value)}
        className="w-full border border-ink/15 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-petrol"
      />
      <textarea
        placeholder="Briefly describe the job"
        value={form.details}
        onChange={(e) => update('details', e.target.value)}
        rows={3}
        className="w-full border border-ink/15 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-petrol"
      />
      <select
        value={form.urgency}
        onChange={(e) => update('urgency', e.target.value)}
        className="w-full border border-ink/15 bg-paper px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-petrol"
      >
        <option value="">Urgency</option>
        {urgencyOptions.map((u) => (
          <option key={u.value} value={u.value}>
            {u.label}
          </option>
        ))}
      </select>

      {status === 'error' && (
        <p className="text-xs text-orange">Please fill in name, phone, property type, service, and a short description.</p>
      )}
      {status === 'not_configured' && (
        <p className="text-xs text-orange">
          Online submission isn&rsquo;t connected yet — please call {company.phone} or WhatsApp us directly.
        </p>
      )}

      <div className="flex gap-2 pt-1">
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="rounded bg-yellow px-4 py-2 text-xs font-semibold text-ink hover:bg-yellow/90 disabled:opacity-60"
        >
          {status === 'submitting' ? 'Sending…' : 'Submit'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded border border-ink/20 px-4 py-2 text-xs font-semibold text-ink hover:border-petrol"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
