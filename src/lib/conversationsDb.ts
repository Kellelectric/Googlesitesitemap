import { getSupabaseAdmin, isSupabaseConfigured } from '@/lib/supabaseAdmin'

export { isSupabaseConfigured }

type LogTurnInput = {
  conversationId?: string
  userMessage: string
  assistantReply: string
}

// Best-effort, additive durable record of each Kell Assist free-text turn -
// independent of the reply itself (the visitor already has their answer by
// the time this runs). Creates a new `conversations` row on the first turn
// of a session when no conversationId is supplied; the caller is
// responsible for persisting the returned id (e.g. in the browser) and
// sending it back on later turns so they land in the same conversation.
// No-ops entirely when Supabase isn't configured - the chat widget's guided
// flows and free-text replies work identically either way.
export async function logConversationTurn(input: LogTurnInput): Promise<{ conversationId: string } | null> {
  const supabase = getSupabaseAdmin()
  if (!supabase) return null

  try {
    let conversationId = input.conversationId

    if (!conversationId) {
      const { data: conversation, error } = await supabase
        .from('conversations')
        .insert({ channel: 'website' })
        .select('id')
        .single()
      if (error) throw error
      conversationId = conversation.id as string
    } else {
      await supabase
        .from('conversations')
        .update({ last_message_at: new Date().toISOString() })
        .eq('id', conversationId)
    }

    await supabase.from('messages').insert([
      { conversation_id: conversationId, role: 'user', content: input.userMessage },
      { conversation_id: conversationId, role: 'assistant', content: input.assistantReply },
    ])

    return { conversationId }
  } catch (error) {
    console.error('Supabase logConversationTurn (best-effort) failed', error)
    return null
  }
}
