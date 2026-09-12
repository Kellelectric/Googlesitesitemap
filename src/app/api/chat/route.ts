import { NextRequest, NextResponse } from 'next/server'
import { buildKnowledgeBase, uncertainResponseMessage } from '@/content/chatbot'
import { company } from '@/content/company'
import { createRateLimiter, getClientIp } from '@/lib/rateLimit'
import { getChatProvider } from '@/lib/ai/provider'
import { logConversationTurn } from '@/lib/conversationsDb'

export const runtime = 'nodejs'

// Each free-text turn costs a real Groq API call once GROQ_API_KEY is set,
// so this is stricter than the quote form's rate limit — a normal
// back-and-forth conversation stays well under 20 turns in 10 minutes, but
// a script hammering this endpoint gets cut off well before running up a
// meaningful bill.
const isRateLimited = createRateLimiter({ windowMs: 10 * 60 * 1000, max: 20 })

type ChatMessage = { role: 'user' | 'assistant'; content: string }

function isValidMessages(
  body: unknown,
): body is { messages: ChatMessage[]; conversationId?: string } {
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
    ) &&
    (b.conversationId === undefined || typeof b.conversationId === 'string')
  )
}

async function buildSystemPrompt(): Promise<string> {
  const kb = await buildKnowledgeBase()

  return `You are Kell Assist, the website assistant for ${kb.company.name}, a COREN and NEMSA certified electrical engineering company based in ${kb.company.address}. Your subtitle is "Your Kell Electricals Service Assistant."

ROLE: first-line customer service, service discovery, lead qualification, and appointment assistant. You are NOT a licensed engineer and must never act like one.

HARD RULES - never break these:
1. Never invent company facts, certifications, prices, project statistics, staff names, or capabilities not listed in the KNOWLEDGE BASE below. If you don't know something, say exactly: "${uncertainResponseMessage}"
2. Never provide a final solar/inverter system size or specification. Solar questions must always end with: "An accurate system recommendation requires a proper load assessment and site assessment." and offer to book an assessment or connect to WhatsApp/phone.
3. For dangerous conditions (fire, smoke, sparking, burning smell, exposed live wires, shock risk), prioritize safety and direct to emergency contact - never give step-by-step electrical repair instructions.
4. Do not claim high-voltage, hazardous-area, Zone 1/2, or any other specialist certification unless it appears explicitly in the certifications list below.
5. Never ask more than one or two questions at a time - keep it conversational, not a form dump.
6. Keep responses concise (2-4 sentences typically). This is a chat widget, not an essay.
7. When a user wants a quote, consultation, or to speak with someone, guide them toward providing name, phone, and what they need, then mention they can also call ${kb.company.phone} or message on WhatsApp.

KNOWLEDGE BASE - only use facts from here:

Company:
- Name: ${kb.company.name} (${kb.company.legalName}, RC ${kb.company.rcNumber})
- Positioning: ${kb.company.positioning}
- Combined team engineering experience: ${kb.company.teamExperienceYears}+ years
- Certifications: ${kb.company.certifications.join(', ')}
- Address: ${kb.company.address}
- Service areas: all of Abuja (featured districts with a dedicated page: ${kb.company.serviceAreas.join(', ')} - do not imply coverage is limited to these)
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
  if (await isRateLimited(ip)) {
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

  const provider = getChatProvider()
  if (!provider.isConfigured()) {
    // Graceful degradation: the chatbot's guided quick-reply flows (service
    // routing, emergency safety message, solar question flow, lead capture)
    // all work without a configured provider. Only free-text conversation
    // needs it.
    return NextResponse.json({ ok: false, reason: 'not_configured' }, { status: 503 })
  }

  const result = await provider.complete(await buildSystemPrompt(), body.messages)

  if (!result.ok) {
    return NextResponse.json({ ok: false, reason: result.reason }, { status: 502 })
  }

  // Best-effort, additive durable record of the turn - never blocks or
  // delays the reply itself (awaited only so the resulting conversationId
  // can be handed back for the widget to resend on the next turn; on
  // failure or when Supabase isn't configured this resolves to null and the
  // reply is returned exactly as before). See src/lib/conversationsDb.ts.
  const logged = await logConversationTurn({
    conversationId: body.conversationId,
    userMessage: body.messages[body.messages.length - 1]?.content ?? '',
    assistantReply: result.reply,
  }).catch((error) => {
    console.error('Supabase logConversationTurn (best-effort) failed', error)
    return null
  })

  return NextResponse.json({
    ok: true,
    reply: result.reply,
    conversationId: logged?.conversationId ?? body.conversationId,
  })
}

// Exposed so the client can show the right phone/WhatsApp fallback without
// duplicating company facts.
export async function GET() {
  return NextResponse.json({
    configured: Boolean(process.env.GROQ_API_KEY),
    phoneHref: company.phoneHref,
    phone: company.phone,
    whatsappHref: company.whatsappHref,
  })
}
