# Deploying the Assessment & Booking Platform

Companion to `docs/assessment-platform-architecture.md`. This covers what's
needed to take the assessment, booking, and admin routes from this
sandbox to production on `kellelectricals.com`.

## 0. This repo is already connected to Vercel

The GitHub repo is linked to Vercel project **`googlesitesitemap`**
(team: Gabby John's projects). It auto-deploys on every push — this
branch already has a preview deployment; `main` is production.
**There is no separate "connect to Vercel" step** — only the checklist
below to make a build actually succeed and go live.

## Go-live checklist

1. **Add a database.** In the Vercel dashboard → `googlesitesitemap`
   project → **Storage** tab → **Create Database** → **Postgres**
   (Neon-backed, free Hobby tier). Connect it to the project.
2. **Confirm/rename the connection env var to exactly `DATABASE_URL`.**
   Vercel's Postgres integration adds several (`POSTGRES_URL`,
   `POSTGRES_PRISMA_URL`, `POSTGRES_URL_NON_POOLING`, etc.) — Prisma
   here only reads `DATABASE_URL`. In Project Settings → Environment
   Variables, either rename one to `DATABASE_URL` or add a new variable
   named `DATABASE_URL` with the same value as `POSTGRES_PRISMA_URL`
   (the pooled connection string — preferred for serverless functions).
3. **Set `ADMIN_SESSION_SECRET`.** Any random 32+ char string —
   generate with `openssl rand -hex 32`. Required or admin login throws.
4. **Set `SEED_TOKEN`.** Any random string — `openssl rand -hex 24`.
   This is what lets you bootstrap reference data into the new database
   with no shell access to it (step 6).
5. **Redeploy.** Either push a new commit, or use Vercel's "Redeploy"
   button on the latest deployment for this branch. The build now runs
   `prisma migrate deploy` automatically (see section 3) — it will fail
   loudly and clearly if `DATABASE_URL` is still missing.
6. **Bootstrap reference data — once, after the deploy succeeds:**
   ```
   curl -X POST https://<your-deployment-url>/api/admin/bootstrap \
     -H "x-seed-token: <the SEED_TOKEN value>"
   ```
   This creates the service catalogue, three engineers with weekly
   availability, default settings, and the first `SUPER_ADMIN` admin
   user (`kellelectricals@gmail.com` / `ChangeMe-KellAdmin-2026` unless
   `SEED_ADMIN_EMAIL`/`SEED_ADMIN_PASSWORD` are also set — set those
   too before this step if you want a different first login). Safe to
   call more than once; it will never overwrite admin-edited service
   pricing on a re-run. **Change the admin password immediately after
   first login** — there's no in-app "change password" screen yet (see
   roadmap), so do this by updating the `AdminUser` row's `passwordHash`
   (bcrypt) via `prisma studio` until one exists.
7. **Verify:** visit `/assessment`, `/book`, and sign in at `/admin`.
   Consider unsetting `SEED_TOKEN` again once bootstrapped, since it's
   only needed for that one call.
8. **Promote to production**, when ready: merge this branch's PR into
   `main` — Vercel serves `main` as the production deployment for this
   project.

Everything below covers the same ground in more detail, plus what's
optional.

## 1. Database (detail)

Any managed PostgreSQL works — Vercel Postgres (used above), Neon,
Supabase, or Railway are all fine (all have a free tier sufficient for
this workload). If you provision one outside Vercel instead, the flow
is the same: copy its connection string into `DATABASE_URL`, then
either run `npx prisma migrate deploy && npm run db:seed` from a
machine that can reach it directly, or use the `/api/admin/bootstrap`
route from step 6 above once it's deployed and reachable.

## 2. Environment variables

Copy `.env.example` to `.env` (local) or set these in Vercel's project
settings (production). Only `DATABASE_URL` and `ADMIN_SESSION_SECRET`
are required for the platform to function; everything else has a
working fallback:

| Variable | Required | Fallback if unset |
|---|---|---|
| `DATABASE_URL` | Yes | — |
| `ADMIN_SESSION_SECRET` | Yes | — (admin login throws without it) |
| `SEED_TOKEN` | Only for the one-time bootstrap call | `/api/admin/bootstrap` returns 503 without it |
| `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` | No | First admin defaults to `kellelectricals@gmail.com` / `ChangeMe-KellAdmin-2026` |
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

`package.json` already wires this up — nothing to add:

- `"postinstall": "prisma generate"` — regenerates the Prisma Client
  after every `npm install`.
- `"build": "prisma migrate deploy && next build"` — applies any
  pending schema migrations before building, every deploy. This is
  production-safe (it only applies existing migration files, never
  generates new ones) and idempotent (a no-op if the schema is already
  current), so it's fine to run on every single build, including
  preview deployments that share the same database.

Vercel runs `npm install` then `npm run build` automatically on every
push once the project is linked — which this one already is (see
section 0).

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
