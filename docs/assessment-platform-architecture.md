# Service Assessment & Booking Platform — Architecture

This document covers the platform added on top of the existing marketing
site: a guided electrical service assessment, a recommendation engine, a
real booking system, and an internal admin dashboard. It reuses the
existing brand (`docs/design-system.md`, `docs/brand-positioning.md`,
`src/content/company.ts`) rather than introducing a second brand system.

Scope decisions made before build (confirmed with the client):

- **Same app, new routes.** `/assessment`, `/book`, `/admin` live inside
  the existing Next.js site, not a separate deployment.
- **Real brand facts kept.** 15+ years experience, RC 1852579, and the
  existing Petrol/Yellow/Orange palette are used — not the generic
  "20+ years" / gold-accent figures from the original feature request.
- **A real local database now.** PostgreSQL via Prisma, migrated and
  seeded, so the assessment → recommendation → booking → admin flow
  actually persists and runs end-to-end today. Payment, WhatsApp
  Business API, and transactional email are built as provider
  abstractions with a working log/console implementation — swapping in
  Paystack/Flutterwave, the WhatsApp Business API, or Resend later is a
  matter of implementing one interface and setting env vars, not
  re-architecting.

## A. Sitemap

```
/                               existing homepage
/services, /services/[slug]     existing service catalogue
/contact                        existing contact/quote form

/assessment                     landing — "2-Minute Electrical Assessment"
/assessment/start               the full guided wizard (single route; steps are
                                 client-rendered and progress is kept in
                                 sessionStorage, not per-step sub-routes — see
                                 section C for why)
/assessment/emergency           emergency short-circuit path (skips remaining steps)
/assessment/result              recommendation + answer summary + CTAs

/book                           "Book a Service" — direct route, service picker
/book/[service]                 calendar + time slot + details for a known service
/book/[service]/confirmation    reference number, ICS download, WhatsApp CTA

/admin                          login
/admin/dashboard                metrics
/admin/leads, /admin/leads/[id] lead list + detail/status change
/admin/appointments             appointment list, status changes
/admin/services                 service + pricing CRUD
/admin/settings                 business hours, WhatsApp number, notification toggles
```

## B. Customer journey

Three entry paths, matching the brief:

1. **Emergency** — Q1 "Emergency Electrical Service" or Q4 urgency =
   "Emergency" short-circuits the wizard immediately to
   `/assessment/emergency`: name, phone, WhatsApp, location, issue
   description, optional photo. No further questions.
2. **Guided assessment** — full question flow → recommendation engine →
   `/assessment/result` → booking → confirmation.
3. **Direct booking** — customer already knows the service, skips the
   assessment via `/book`, picks a service, date/time, and details.

`/assessment` always keeps both **Start Assessment** (primary) and
**Book a Service Directly** (secondary) visible, per the brief's "two
conversion routes" requirement.

## C. Question architecture & conditional logic

Each question is a step component keyed by a stable `questionKey`,
answers stored both as a JSON blob on `Assessment.answers` (for the
wizard's own resume logic) and as individual `AssessmentAnswer` rows
(for analytics/audit). Steps:

| # | Key | Question | Always shown? |
|---|-----|----------|----------------|
| 1 | `need` | What can we help you with? | Yes |
| 2 | `propertyType` | Where is the work? | Yes |
| 3 | `issue` / `installPlan` / `solarGoal` | Conditional detail question | Only if `need` is repair, installation, or solar |
| 4 | `urgency` | How soon do you need assistance? | Yes — **Emergency answer exits to `/assessment/emergency` immediately** |
| 5 | `location` | Where is the property located? | Yes |
| 6 | `projectStage` | What stage is the project at? | Yes |
| 7 | `projectSize` | Property/project size | Yes — options branch on `propertyType` (residential/commercial/industrial option sets) |
| 8 | `documentation` | Existing documentation + optional upload | Yes |
| 9 | `goal` | Primary outcome | Yes |
| 10 | `contact` | Contact details | Yes |
| 11 | `notes` | Anything else? | Yes |
| 12 | `appointment` | How would you like us to help + date/time | Yes |

Conditional logic lives in `src/lib/assessment/steps.ts` as a single
ordered list with a `showIf(answers)` predicate per step — the wizard
(`src/components/assessment/AssessmentWizard.tsx`) filters the list on
every render, so the progress bar ("Question X of Y") reflects the
customer's actual path, not a fixed count. The whole wizard is one
client-rendered route (`/assessment/start`) rather than one Next.js
route per step: answers live in React state, mirrored to
`sessionStorage` so a refresh doesn't lose progress, and the "step" is
just an index into the filtered list. This was chosen over per-step
routes because the step list itself changes shape as answers change
(e.g. the repair/installation/solar detail question only exists for
one `need` value each) — a route per step would need to redirect
around itself constantly to stay in sync.

## D. Recommendation engine logic

Pure function, `src/lib/recommendation.ts`,
`recommendService(answers): { service, reasoning, leadScore }`.
Rule order (first match wins — most specific/urgent first):

1. `urgency === 'emergency'` **or** `issue` includes burning
   smell/sparks → **Emergency Electrical Response** (never reached via
   the normal wizard path since emergency exits early, but the function
   stays total for direct calls/tests).
2. `need === 'not-sure'` → **Professional Electrical Assessment**.
3. `need === 'solar'` and `solarGoal === 'inverter-fault'` →
   **Solar/Inverter Diagnostic Assessment** (`solar-inverter-systems`).
4. `need === 'solar'` (any other goal) → **Solar & Inverter Site
   Assessment** (`solar-inverter-systems`).
5. `need === 'repair'` and `propertyType === 'industrial'` →
   **Industrial Electrical Assessment** (`fault-finding-diagnostics`).
6. `need === 'repair'` → **Electrical Fault Diagnosis**
   (`fault-finding-diagnostics`), reasoning references the specific
   `issue` selected.
7. `need === 'installation'` and `projectStage === 'new-construction'`
   → **Electrical Design & Installation Assessment**
   (`electrical-wiring-installation`).
8. `need === 'installation'` and `propertyType` is commercial/industrial
   and `projectSize` is large → **Commercial/Industrial Electrical
   Design & Project Assessment** (`commercial-office-fitout` /
   `industrial-electrical-systems`).
9. `need === 'maintenance'` → **Preventive Electrical Maintenance
   Assessment** (`preventive-maintenance-contracts`).
10. `need === 'inspection'` or `goal === 'improve-safety'` →
    **Electrical Safety Inspection** (`fault-finding-diagnostics`).
11. `projectStage === 'existing-property'` and `goal === 'upgrade'` →
    **Electrical Inspection & Upgrade Assessment**
    (`panel-repair-upgrades`).
12. Default fallback → **Electrical Site Assessment**
    (`electrical-site-assessment`), the generic recommended product
    referenced throughout the brief.

Every branch returns a `reasoning: string[]` built from the actual
answers ("You told us this is a residential property with frequent
breaker trips" style sentences), not a static string, so
`/assessment/result` can show a genuine "why we recommend this"
section.

Lead scoring (`src/lib/leadScore.ts`) runs independently of the
recommendation and is never shown to the customer:

- +40 emergency, +25 industrial, +20 commercial, +20 new construction,
  +20 full installation, +20 solar installation, +15 design/consultancy,
  +15 maintenance contract, +15 large project size, +15 "today"/"24–48h"
  urgency.
- `score >= 60` → `HOT`, `score >= 30` → `WARM`, else `STANDARD`.

## E. Database architecture

See `prisma/schema.prisma` for the authoritative schema. Summary of
deliberate simplifications versus the brief's full table list:

- No separate `users`/`customers`/`locations` tables — the brief
  explicitly requires **no account creation**, so a lead's contact and
  location fields live directly on `Lead`. This avoids a duplicate
  identity system with nothing to key it on.
- `utm_sources` fields live directly on `Lead` rather than a separate
  table — there's one UTM tuple per lead, not a many-to-many relation.
- `quotes` exists as a minimal table (amount, status, notes) since
  pricing/quoting workflow itself is out of scope for this build —
  it's a placeholder an admin can attach a number to, not a quoting
  engine.

Core tables: `AdminUser`, `ServiceCategory`, `Service`, `Lead`,
`Assessment`, `AssessmentAnswer`, `Engineer`, `Availability`,
`AvailabilityBlock`, `Appointment`, `FileUpload`, `Notification`,
`AuditLog`, `Setting`, `Quote`.

All tables carry `createdAt`/`updatedAt`. `Lead` and `Appointment`
carry `deletedAt` for soft deletion.

## F. Booking architecture

`src/lib/booking.ts`:

- `getAvailableSlots(serviceId, date)`: reads `Service.durationMinutes`,
  the business's working hours/break/buffer/max-daily-appointments from
  `Setting`, each active `Engineer`'s weekly `Availability` rows for
  that weekday, subtracts `AvailabilityBlock` (holidays/one-off
  blocks) and already-booked `Appointment` rows (+ buffer time either
  side) for that engineer/day, and returns only slots with at least one
  free engineer. **A slot is never shown as available unless computed
  this way against real rows** — no client-side guessing.
- `createAppointment(...)` re-validates the requested slot server-side
  inside a transaction before insert, so two customers racing for the
  same slot can't both win it.
- Emergency requests bypass slot selection entirely — they're
  `REQUESTED` immediately for callback, per the brief.

Statuses: `REQUESTED`, `PENDING_CONFIRMATION`, `CONFIRMED`,
`RESCHEDULED`, `CANCELLED`, `COMPLETED`, `NO_SHOW`.

Currency `NGN`, timezone `Africa/Lagos` — both hardcoded as the business
is single-region; see `src/config/business.ts`.

## G. Admin architecture

Session auth via a signed, httpOnly cookie (HMAC-SHA256 over
`{ adminUserId, role, exp }`, no external session store needed at this
scale) — see `src/lib/auth.ts`. Passwords hashed with bcrypt.

`AdminUser.role` models the five roles from the brief
(`SUPER_ADMIN`, `ADMINISTRATOR`, `ENGINEER`, `TECHNICIAN`,
`CUSTOMER_SERVICE`) and every admin server action checks role via
`requireRole()`. **Built for this pass:** `SUPER_ADMIN`/`ADMINISTRATOR`
have full access to leads/appointments/services/settings, matching the
seeded admin user. Engineer/Technician/Customer-Service scoped views
(e.g. "engineer sees only assigned appointments") are modeled in the
schema and role-checked at the API layer, but the dashboard UI itself
currently renders the same views for any authenticated role — narrowing
the UI per role is flagged in the roadmap doc rather than built out,
since it's additional screens rather than new architecture.

Every mutation from the admin UI writes an `AuditLog` row
(`adminUserId`, `action`, `entityType`, `entityId`, `previousValue`,
`newValue`).

## H. Notifications, WhatsApp, payments — provider abstractions

- `src/lib/email.ts` — `sendEmail(...)` interface. Default provider logs
  to console and writes a `Notification` row; if `RESEND_API_KEY` is
  set, sends via Resend. No other code changes needed to go live.
- `src/lib/whatsapp.ts` — pure function generating a `wa.me` deep link
  with a prefilled, correctly-encoded message (name, service, property
  type, location, date/time, reference). This is what ships today.
  Wiring the WhatsApp **Business API** for proactive server-sent
  messages (booking confirmations, reminders) is documented as a
  follow-up requiring a Meta-approved business number and message
  templates — not something buildable without those credentials.
- `src/lib/payments.ts` — `PaymentProvider` interface
  (`initialize`, `verify`) with a `MockPaymentProvider`. Paystack/
  Flutterwave implementations are stubbed with clear TODOs for API key
  wiring; no card data ever touches this codebase.

## I. Security

- All API routes validate input with Zod before touching the database.
- File uploads (`src/lib/fileUpload.ts`, not yet wired to a route — see
  roadmap): type allow-list (jpg/png/webp/pdf/mp4/mov), 10MB cap,
  stored outside the public web root with a random filename, extension
  re-checked against the declared MIME type rather than trusting the
  client alone.
- `src/lib/rateLimit.ts` — in-memory sliding-window limiter applied to
  the assessment, booking, and admin-login API routes. Documented as
  in-memory-only (fine for a single instance; swap for Redis behind a
  multi-instance deploy).
- Admin login is rate-limited per IP+email and returns a generic error
  on failure (no user enumeration).
- `AuditLog` on every admin mutation.

## Roadmap (not built in this pass)

- Wiring `src/lib/fileUpload.ts` (already implemented — type/size
  validation, storage outside the public root) to an upload API route
  and to the assessment wizard's documentation step. Today that step
  only captures *which categories* of documentation exist as answer
  data, not the files themselves.
- Real Paystack/Flutterwave integration (needs live merchant keys).
- WhatsApp Business API for outbound proactive messages (needs Meta
  business verification).
- Per-role admin UI narrowing (engineer-only view, customer-service-only
  view) — schema/permissions exist, UI doesn't yet branch on role.
- Automated E2E browser tests (Playwright) — this pass ships unit tests
  for the recommendation engine, lead scoring, booking availability,
  and WhatsApp URL generation.
- Google Calendar-compatible export beyond the static `.ics` download
  already shipped (live two-way sync).
