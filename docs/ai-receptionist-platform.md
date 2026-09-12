# AI Receptionist Platform — architecture, status, and setup

This documents the "full platform rebuild" requested for Kell Assist: a
dedicated Supabase database, staff authentication, an admin dashboard, and a
provider-agnostic AI layer, built on top of (not replacing) the existing
lean Next.js site and its Zoho CRM/WhatsApp/email/Google Calendar
integrations. Read this before extending any part of it.

## What's provisioned

A dedicated Supabase project, kept separate from this org's other two
Supabase projects (an unrelated field-operations app for engineers, and an
accounting project) so this platform's data never mixes with either:

- **Project:** `kell-ai-receptionist` (org: Kellelectric's Org, region
  eu-west-1)
- **URL:** `https://wobkggdayxgbngjtcokh.supabase.co`
- **Anon/publishable key** (safe to expose, used for `NEXT_PUBLIC_SUPABASE_ANON_KEY`):
  `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndvYmtnZ2RheXhnYm5nanRjb2toIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkyNDQ4NTgsImV4cCI6MjEwNDgyMDg1OH0.np7NBB75V8_9XN5yreajk2tmIUAY4tvcbe3BctdHcpk`
- **Service role key**: NOT captured here (Supabase never exposes it outside
  its own dashboard). Get it from the Supabase dashboard for this project →
  Settings → API → `service_role` secret key, and set it as
  `SUPABASE_SERVICE_ROLE_KEY` in your deployment platform's environment
  variables (never commit it, never expose it to the browser).

## Environment variables to set

See `.env.example` for the full block with inline comments. In short:

| Variable | Where it's used | Exposure |
|---|---|---|
| `SUPABASE_URL` | server-only, all lead/conversation writes | secret-safe (server only) |
| `SUPABASE_SERVICE_ROLE_KEY` | server-only, bypasses RLS | **secret — never expose** |
| `NEXT_PUBLIC_SUPABASE_URL` | admin dashboard sign-in + middleware | public |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | admin dashboard sign-in + middleware | public (RLS-restricted) |

Every existing integration (Zoho CRM, WhatsApp, Resend, Google Calendar)
keeps working completely independently of these — they were not touched.

## Database schema (applied)

Migration `init_receptionist_schema` (plus a follow-up hardening migration)
is already applied to the project above. Tables:

- `staff_users` — one row per `auth.users` member, with a `role` (super_admin,
  operations_manager, customer_care, engineer, sales, read_only) for RBAC.
- `customers`, `consent_records`
- `services`, `pricing` (every price has an `approval_status`, `effective_date`,
  `expiry_date`, `location_scope`, `last_updated_by` — the AI must only ever
  quote a price where `approval_status = 'approved'` and it hasn't expired)
- `leads` (source channel, intent, status pipeline, assignment)
- `conversations`, `messages`, `conversation_notes`
- `appointments`
- `knowledge_documents`, `knowledge_chunks` (pgvector-ready — embedding
  ingestion pipeline is not built yet, see Pending below)
- `escalations`, `audit_log`

Row Level Security is enabled on every table. Staff (rows in `staff_users`,
authenticated via Supabase Auth) can read/write per the `is_active_staff()`
policies. Server-side API routes use the `service_role` key, which bypasses
RLS entirely — that's how the public-facing quote/booking/careers/chat
routes can write leads without a signed-in session.

## What's built and working now

- **Lead capture → database**: quote requests, appointment bookings, and
  career applications each write a `customers` + `leads` row via
  `src/lib/leadsDb.ts`, in addition to (not instead of) their existing Zoho
  CRM/WhatsApp/email notifications. Matches existing customers by phone/email.
- **Conversation logging**: every Kell Assist free-text turn writes to
  `conversations`/`messages` via `src/lib/conversationsDb.ts`. The widget
  threads a `conversationId` across turns so a session lands in one row.
- **AI provider abstraction**: `src/lib/ai/provider.ts` defines a
  `ChatProvider` interface; `/api/chat` now depends only on that interface.
  Groq is the only implemented provider (behavior-identical to before this
  refactor) — adding Anthropic/OpenAI/Gemini means implementing the same
  interface and switching `getChatProvider()`, not touching the route.
- **Staff authentication**: Supabase Auth gates `/admin/*` via
  `src/middleware.ts`. Sign-in is email/password (`src/app/admin/login`).
- **Admin dashboard (v1)**: `/admin/leads` lists the 100 most recent leads
  with customer, intent, service, source, status, and timestamp — the start
  of the Lead Management feature from the spec. `/admin/conversations` is a
  placeholder describing what's pending (see below).

## Creating your first staff login

No staff user exists yet. To create one:

1. Supabase dashboard → this project → Authentication → Users → **Add user**
   (set an email and password for yourself).
2. SQL editor → run, using the UUID from the user you just created:
   ```sql
   insert into public.staff_users (id, full_name, role)
   values ('<the auth user's UUID>', 'Your Name', 'super_admin');
   ```
3. Sign in at `/admin/login` with that email/password.

## Pending — not yet built

Being explicit about this rather than overstating progress:

- **Knowledge base retrieval**: `knowledge_documents`/`knowledge_chunks`
  tables exist with pgvector, but there is no ingestion pipeline (chunking +
  embedding), no `search_knowledge_base` tool, and the chat route still
  builds its system prompt directly from the site's content files
  (`src/content/chatbot.ts`) rather than a retrieval step. That existing
  approach is not wrong — it guarantees the bot can't say anything the site
  doesn't — but it doesn't scale to the "structured knowledge base with
  version history and admin-editable documents" from the spec.
- **Tool-calling architecture**: no `create_lead`/`get_available_appointments`/
  `request_human_takeover` tool layer — the LLM does not yet call tools; the
  chat route is a single completion call per turn.
- **Human takeover / pause-resume**: `conversations.ai_enabled` and
  `assigned_staff_id` columns exist, but no admin UI or route toggles them,
  and the chat route doesn't check them before generating a reply.
- **Pricing management UI**: `pricing`/`services` tables exist; no admin UI
  to add/approve/expire prices yet, and nothing reads from them (inspection
  fees are still handled by `src/content/inspectionPricing.ts`, unchanged).
- **Conversation detail view, staff notes UI, escalation queue, analytics
  dashboard, RBAC-differentiated dashboard views**: tables exist, no UI yet.
- **WhatsApp Business Platform as a receptionist channel** (vs. today's
  outbound-only staff notifications), **voice**, and **customer-facing
  identity/consent flows**: architecture allows for these (channel columns,
  consent_records table) but none are implemented.

## Recommended next increment

Given how much surface area remains, the highest-value next slice is
probably: (1) a tool-calling layer so the AI can call `create_lead`/
`get_available_appointments` directly instead of the current
guided-quick-reply-flow-plus-separate-form pattern, and (2) the knowledge
base ingestion pipeline, since both compound — every other admin-dashboard
feature (pricing, escalations, analytics) is comparatively mechanical CRUD
once the schema exists.
