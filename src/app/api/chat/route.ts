import { NextRequest, NextResponse } from 'next/server'
import { buildKnowledgeBase, uncertainResponseMessage } from '@/content/chatbot'
import { company } from '@/content/company'
import { createRateLimiter, getClientIp } from '@/lib/rateLimit'

export const runtime = 'nodejs'

// Each free-text turn costs a real Anthropic API call once ANTHROPIC_API_KEY
// is set, so this is stricter than the quote form's rate limit — a normal
// back-and-forth conversation stays well under 20 turns in 10 minutes, but
// a script hammering this endpoint gets cut off well before running up a
// meaningful bill.
const isRateLimited = createRateLimiter({ windowMs: 10 * 60 * 1000, max: 20 })

type ChatMessage = { role: 'user' | 'assistant'; content: string }

function isValidMessages(body: unknown): body is { messages: ChatMessage[] } {
  if (!body || typeof body !== 'object') return false
  const b = body as Record<string, unknown>
  return (
    Array.isArray(b.messages) &&
    b.messages.length > 0 &&
    b.messages.length <= 40 &&
    b.messages.every(
      (m) =>
        m &&
        typeof m === 'object' &&
        (m.role === 'user' || m.role === 'assistant') &&
        typeof m.content === 'string' &&
        m.content.length > 0 &&
        m.content.length <= 2000,
    )
  )
}

function buildSystemPrompt(): string {
  const kb = buildKnowledgeBase()

  return `You are Kell Assist, the website assistant for ${kb.company.name}, a COREN and NEMSA certified electrical engineering company based in ${kb.company.address}. Your subtitle is "Your Kell Electricals Service Assistant."

ROLE: first-line customer service, service discovery, lead qualification, and appointment assistant. You are NOT a licensed engineer and must never act like one.

HARD RULES — never break these:
1. Never invent company facts, certifications, prices, project statistics, staff names, or capabilities not listed in the KNOWLEDGE BASE below. If you don't know something, say exactly: "${uncertainResponseMessage}"
2. Never provide a final solar/inverter system size or specification. Solar questions must always end with: "An accurate system recommendation requires a proper load assessment and site assessment." and offer to book an assessment or connect to WhatsApp/phone.
3. For dangerous conditions (fire, smoke, sparking, burning smell, exposed live wires, shock risk), prioritize safety and direct to emergency contact — never give step-by-step electrical repair instructions.
4. Do not claim high-voltage, hazardous-area, Zone 1/2, or any other specialist certification unless it appears explicitly in the certifications list below.
5. Never ask more than one or two questions at a time — keep it conversational, not a form dump.
6. Keep responses concise (2-4 sentences typically). This is a chat widget, not an essay.
7. When a user wants a quote, consultation, or to speak with someone, guide them toward providing name, phone, and what they need, then mention they can also call ${kb.company.phone} or message on WhatsApp.

KNOWLEDGE BASE — only use facts from here:

Company:
- Name: ${kb.company.name} (${kb.company.legalName}, RC ${kb.company.rcNumber})
- Positioning: ${kb.company.positioning}
- Combined team engineering experience: ${kb.company.teamExperienceYears}+ years
- Certifications: ${kb.company.certifications.join(', ')}
- Address: ${kb.company.address}
- Service areas: all of Abuja (featured districts with a dedicated page: ${kb.company.serviceAreas.join(', ')} — do not imply coverage is limited to these)
- Also covers: ${kb.company.serviceRegion} (project work)
- Business hours: ${kb.company.businessHours.map((h) => `${h.days}: ${h.hours}`).join('; ')}
- Phone: ${kb.company.phone}
- Email: ${kb.company.email} (emergencies: ${kb.company.emergencyEmail})
- Emergency response target: ${kb.company.emergencyResponseTarget}
- WhatsApp: ${kb.company.whatsappHref}
- Google rating: ${kb.company.googleRating}/5 from ${kb.company.googleReviewCount}+ reviews

Services:
${kb.serviceLines.join('\n')}

Industries/property types served:
${kb.industryLines.join('\n')}

Careers:
${kb.careerLines.join('\n')}

Frequently asked questions:
${kb.faqLines.join('\n\n')}

If asked about anything outside this knowledge base (pricing specifics, project timelines for a specific job, technical design decisions), say you don't want to give incorrect information and offer to connect them with the team by phone or WhatsApp.`
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request)
  if (isRateLimited(ip)) {
    return NextResponse.json({ ok: false, reason: 'rate_limited' }, { status: 429 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ ok: false, reason: 'invalid_json' }, { status: 400 })
  }

  if (!isValidMessages(body)) {
    return NextResponse.json({ ok: false, reason: 'invalid_payload' }, { status: 422 })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    // Graceful degradation: the chatbot's guided quick-reply flows (service
    // routing, emergency safety message, solar question flow, lead capture)
    // all work without this key. Only free-text conversation needs it.
    return NextResponse.json({ ok: false, reason: 'not_configured' }, { status: 503 })
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 400,
        system: buildSystemPrompt(),
        messages: body.messages,
      }),
      signal: AbortSignal.timeout(15000),
    })

    if (!response.ok) {
      console.error('Anthropic API error', response.status, await response.text())
      return NextResponse.json({ ok: false, reason: 'upstream_error' }, { status: 502 })
    }

    const data = await response.json()
    const reply: string =
      data?.content?.find((block: { type: string }) => block.type === 'text')?.text ??
      uncertainResponseMessage

    return NextResponse.json({ ok: true, reply })
  } catch (error) {
    console.error('Chat request errored', error)
    return NextResponse.json({ ok: false, reason: 'request_errored' }, { status: 502 })
  }
}

// Exposed so the client can show the right phone/WhatsApp fallback without
// duplicating company facts.
export async function GET() {
  return NextResponse.json({
    configured: Boolean(process.env.ANTHROPIC_API_KEY),
    phoneHref: company.phoneHref,
    phone: company.phone,
    whatsappHref: company.whatsappHref,
  })
}
