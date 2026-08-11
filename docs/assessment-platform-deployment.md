# Deploying the Assessment & Booking Platform

Companion to `docs/assessment-platform-architecture.md`. This covers what's
needed to take the assessment, booking, and admin routes from this
sandbox to production on `kellelectricals.com`.

## 1. Database

Any managed PostgreSQL works — Neon, Supabase, or Railway are the
simplest for a Vercel deployment (all have a free tier sufficient for
this workload).

1. Create a database, copy its connection string.
2. Set `DATABASE_URL` (see `.env.example`).
3. Run migrations: `npx prisma migrate deploy` (production-safe —
   applies existing migrations, doesn't generate new ones).
4. Seed reference data once: `npm run db:seed`. This creates the service
   catalogue, three engineers with weekly availability, default
   settings, and one `SUPER_ADMIN` user.

**Change the seeded admin password immediately** — either set
`SEED_ADMIN_EMAIL`/`SEED_ADMIN_PASSWORD` env vars before seeding
production, or seed with the default and then update the `AdminUser`
row's `passwordHash` (bcrypt) directly. There is currently no
in-app "change password" screen — see roadmap.

## 2. Environment variables

Copy `.env.example` to `.env` (local) or set these in Vercel's project
settings (production). Only `DATABASE_URL` and `ADMIN_SESSION_SECRET`
are required for the platform to function; everything else has a
working fallback:

| Variable | Required | Fallback if unset |
|---|---|---|
| `DATABASE_URL` | Yes | — |
| `ADMIN_SESSION_SECRET` | Yes | — (admin login throws without it) |
| `UPLOADS_DIR` | No | `.uploads` (local disk — see note below) |
| `RESEND_API_KEY` | No | Emails log to console + `Notification` table |
| `EMAIL_FROM` | No | Generic sender address |
| `INTERNAL_NOTIFICATION_EMAIL` | No | Falls back to the `notification_email` Setting (editable in `/admin/settings`) |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | No | Falls back to the `whatsapp_number` Setting |
| `PAYSTACK_SECRET_KEY` / `FLUTTERWAVE_SECRET_KEY` | No | Payments architecture only, not wired to a live checkout |

Generate `ADMIN_SESSION_SECRET` with `openssl rand -hex 32`.

**File uploads:** `src/lib/fileUpload.ts` and the `FileUpload` table
implement secure server-side storage (type/extension allow-list, 10MB
cap, random filename, stored outside the public web root) for the
"upload drawings/BOQ/photos" requirement, but this pass does not wire
them to a route or to the assessment wizard's UI — the wizard's
"Do you already have any project information?" step only captures
*which categories* of documentation exist (drawings, BOQ, photos, etc.)
as answer data, not the files themselves. Wiring an upload endpoint is
the remaining step, and on Vercel it should point `fileUpload.ts` at
S3/Cloudinary/Vercel Blob rather than local disk — local disk storage
(`.uploads/`) does not persist on serverless/edge deployments, since
each invocation gets a fresh filesystem.

## 3. Build & deploy (Vercel)

```
npm install
npx prisma generate
npm run build
```

Vercel runs this automatically on push once the project is linked.
Add a `postinstall` script if Prisma Client generation isn't picked up
automatically: `"postinstall": "prisma generate"`.

Domain/HTTPS: same as the existing marketing site (`docs/next-steps.md`)
— this platform ships as new routes on the same Next.js app, not a
separate deployment.

## 4. Admin user guide

- Sign in at `/admin` with the seeded (or since-created) admin account.
- **Dashboard** — daily/weekly lead and booking counts, emergency
  requests, hot leads, top recommended services, leads by property
  type.
- **Leads** — every completed assessment and direct booking becomes a
  lead here. Open one to see the full answer set, the reasoning behind
  its recommended service, change its CRM status, assign it to an
  engineer/technician (drawn from admin users with those roles), and
  leave internal notes.
- **Appointments** — every booking, with a per-row status changer
  (`REQUESTED` → `CONFIRMED` → `COMPLETED`, or `CANCELLED`/`NO_SHOW`/
  `RESCHEDULED` as needed).
- **Services** — toggle a service active/inactive (inactive services
  disappear from `/book` and stop being bookable) and edit its
  inspection fee. Requires `ADMINISTRATOR` role or above.
- **Settings** — business hours, appointment buffer, max daily
  appointments per engineer, WhatsApp number, internal notification
  email, and an emergency-availability toggle. Requires
  `ADMINISTRATOR` role or above.

Every save from Leads/Appointments/Services/Settings writes an
`AuditLog` row (who, what changed, before/after) — there's no UI for
browsing the audit log yet (query it directly via `prisma studio` /
`npm run db:studio`), which is the one CRM feature left for the
roadmap rather than this pass.

## 5. What's genuinely live vs. architected-only

Live today: assessment wizard, recommendation engine, real
availability-checked booking, lead capture and scoring, admin CRM,
WhatsApp click-to-chat links, console-logged (or Resend, if configured)
transactional email, ICS calendar download.

Architected but not connected to a live third party (see
`docs/assessment-platform-architecture.md` section H and the roadmap
at the end of that document for why): Paystack/Flutterwave checkout,
WhatsApp Business API proactive messaging, per-role admin UI
narrowing, Playwright E2E coverage, live two-way calendar sync.
