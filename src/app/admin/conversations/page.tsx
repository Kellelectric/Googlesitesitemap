export default function AdminConversationsPage() {
  return (
    <div>
      <h1 className="mb-1 text-xl font-semibold">Conversations</h1>
      <p className="max-w-xl text-sm text-slate-400">
        Kell Assist chat transcripts are not yet persisted to the database — the chat widget
        (src/app/api/chat/route.ts) currently keeps conversation state only in the visitor&apos;s
        browser session. Wiring each turn into the <code>conversations</code>/<code>messages</code>{' '}
        tables (with human takeover, pause/resume, and staff notes) is the next stage of this
        platform. See docs/ai-receptionist-platform.md for the full status.
      </p>
    </div>
  )
}
