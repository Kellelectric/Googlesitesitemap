// Minimal AI-provider abstraction so Kell Assist's conversational model can
// be swapped (or a second, cheaper model used for a different task) without
// rewriting src/app/api/chat/route.ts. Every provider implements the same
// narrow interface; callers depend only on that interface, never on a
// specific vendor's SDK or request shape.
//
// Currently only Groq is implemented (matches the existing GROQ_API_KEY/
// GROQ_MODEL behavior exactly - this is a refactor, not a behavior change).
// Anthropic/OpenAI/Gemini adapters can be added here later by implementing
// the same ChatProvider interface and selecting them in getChatProvider()
// below, e.g. via an AI_PROVIDER env var.

export type ChatMessage = { role: 'user' | 'assistant'; content: string }

export type ChatCompletionResult =
  | { ok: true; reply: string }
  | { ok: false; reason: 'not_configured' | 'upstream_error' | 'request_errored' }

export interface ChatProvider {
  isConfigured(): boolean
  complete(systemPrompt: string, messages: ChatMessage[]): Promise<ChatCompletionResult>
}

class GroqChatProvider implements ChatProvider {
  isConfigured(): boolean {
    return Boolean(process.env.GROQ_API_KEY)
  }

  async complete(systemPrompt: string, messages: ChatMessage[]): Promise<ChatCompletionResult> {
    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) return { ok: false, reason: 'not_configured' }

    try {
      // Groq's API is OpenAI-compatible: a `chat/completions` endpoint with
      // a `system` message as the first item in `messages` rather than
      // Anthropic's separate top-level `system` field.
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          // Groq deprecated the Llama 3.3 70B model on 2026-08-16; this is
          // their recommended migration target - still open-weight, still
          // hosted on Groq, just not Llama-branded. See
          // https://console.groq.com/docs/deprecations for current status.
          model: process.env.GROQ_MODEL || 'openai/gpt-oss-120b',
          max_tokens: 400,
          messages: [{ role: 'system', content: systemPrompt }, ...messages],
        }),
        signal: AbortSignal.timeout(15000),
      })

      if (!response.ok) {
        console.error('Groq API error', response.status, await response.text())
        return { ok: false, reason: 'upstream_error' }
      }

      const data = await response.json()
      const reply: string | undefined = data?.choices?.[0]?.message?.content
      if (!reply) return { ok: false, reason: 'upstream_error' }

      return { ok: true, reply }
    } catch (error) {
      console.error('Chat request errored', error)
      return { ok: false, reason: 'request_errored' }
    }
  }
}

let cachedProvider: ChatProvider | undefined

// Single selection point for which provider backs Kell Assist's free-text
// replies. Swap or branch on process.env.AI_PROVIDER here when a second
// provider is added - nothing else in the codebase needs to change.
export function getChatProvider(): ChatProvider {
  if (!cachedProvider) cachedProvider = new GroqChatProvider()
  return cachedProvider
}
