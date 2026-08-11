import type { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

// Shared by prisma/seed.ts (local/CI `npm run db:seed`) and
// /api/admin/bootstrap (a one-time, token-gated way to seed a freshly
// provisioned production database when there's no shell access to run the
// CLI script against it — see docs/assessment-platform-deployment.md).
// Every write here is an upsert or an existence check, so it is safe to
// run more than once: it will never overwrite admin-edited service
// pricing/availability on a re-run.

const categories = [
  { slug: 'assessment', name: 'Assessment & Consultancy', sortOrder: 0 },
  { slug: 'power', name: 'Power Systems', sortOrder: 1 },
  { slug: 'energy', name: 'Energy & Solar', sortOrder: 2 },
  { slug: 'security-automation', name: 'Security & Automation', sortOrder: 3 },
  { slug: 'industrial', name: 'Industrial', sortOrder: 4 },
  { slug: 'maintenance', name: 'Maintenance & Response', sortOrder: 5 },
] as const

// Kept in sync (by slug) with src/content/services.ts, which drives the
// public /services marketing pages. `electrical-site-assessment` is new —
// it is the generic recommended product referenced throughout the brief
// for customers who need a professional assessment before a scoped quote.
const services = [
  {
    slug: 'electrical-site-assessment',
    name: 'Electrical Site Assessment',
    category: 'assessment',
    description:
      'A qualified engineer inspects the existing installation on site, reviews load and circuit condition, notes safety observations, and gives you a clear, professional recommendation for next steps.',
    recommendationCopy:
      'Based on the information you\'ve provided, a professional assessment is the best next step. Our engineer will evaluate the existing installation, identify the requirements, and recommend the appropriate solution.',
    included: [
      'Site inspection',
      'Electrical condition assessment',
      'Load and circuit review',
      'Safety observations',
      'Professional recommendations',
      'Next-step report or quotation where applicable',
    ],
    priceFromNgn: 35000,
    inspectionFeeNgn: 35000,
    emergencySurchargeNgn: 20000,
    durationMinutes: 90,
    requiresAssessment: false,
  },
  {
    slug: 'fault-finding-diagnostics',
    name: 'Electrical Fault Finding & Diagnostics',
    category: 'maintenance',
    description:
      'Systematic fault tracing using proper test equipment — circuit tracing, insulation resistance testing, and thermal imaging — rather than replacing parts until something works.',
    recommendationCopy:
      'Based on the fault you\'ve described, we recommend a diagnostic visit so an engineer can trace the root cause with proper test equipment before any repair work begins.',
    included: [
      'Circuit tracing and continuity testing',
      'Insulation resistance and earth loop impedance testing',
      'Thermal imaging inspection',
      'Root-cause diagnosis and repair recommendation',
    ],
    priceFromNgn: 30000,
    inspectionFeeNgn: 30000,
    emergencySurchargeNgn: 20000,
    durationMinutes: 90,
    requiresAssessment: false,
  },
  {
    slug: 'electrical-wiring-installation',
    name: 'Electrical Wiring & Installation',
    category: 'power',
    description:
      'New-build and rewiring work engineered to NEMSA standard, from single-circuit runs to full building distribution, designed against the building\'s actual load profile.',
    recommendationCopy:
      'New installation work needs a design and installation assessment first, so the electrical system is sized correctly for the finished building rather than retrofitted afterwards.',
    included: [
      'Load assessment and circuit design',
      'Distribution board and consumer unit installation',
      'Socket, switch, and lighting circuit installation',
      'Earthing and bonding to NEMSA requirements',
      'As-built documentation and circuit schedule',
    ],
    priceFromNgn: null,
    inspectionFeeNgn: 35000,
    emergencySurchargeNgn: null,
    durationMinutes: 120,
    requiresAssessment: true,
  },
  {
    slug: 'panel-repair-upgrades',
    name: 'Panel Repair & Upgrades',
    category: 'power',
    description:
      'Diagnosis and upgrade of distribution boards and switchgear that are undersized, outdated, or failing.',
    recommendationCopy:
      'An inspection and upgrade assessment lets our engineer confirm your panel\'s current condition and capacity before recommending a repair or upgrade scope.',
    included: [
      'Panel inspection and thermal assessment',
      'Breaker and busbar repair or replacement',
      'Capacity upgrades and panel re-rating',
      'Surge protection device installation',
    ],
    priceFromNgn: null,
    inspectionFeeNgn: 30000,
    emergencySurchargeNgn: 20000,
    durationMinutes: 90,
    requiresAssessment: true,
  },
  {
    slug: 'solar-inverter-systems',
    name: 'Solar & Inverter Site Assessment',
    category: 'energy',
    description:
      'Full load analysis before a single panel is specified — sizing solar arrays, battery banks, and hybrid inverters to match real consumption patterns, backup priorities, and budget.',
    recommendationCopy:
      'Solar and inverter systems have to be sized against your actual consumption, not a generic package — a site assessment gives us the load data to size this correctly.',
    included: [
      'Load analysis and consumption audit',
      'System sizing (panels, battery bank, inverter capacity)',
      'Grid/solar/generator integration review',
      'Written system recommendation',
    ],
    priceFromNgn: 40000,
    inspectionFeeNgn: 40000,
    emergencySurchargeNgn: null,
    durationMinutes: 90,
    requiresAssessment: false,
  },
  {
    slug: 'preventive-maintenance-contracts',
    name: 'Preventive Electrical Maintenance Assessment',
    category: 'maintenance',
    description:
      'Scheduled inspection and maintenance that catches faults before they become outages — panel inspection, thermal imaging, testing, and generator/solar checks.',
    recommendationCopy:
      'A maintenance assessment lets us scope a contract around your property\'s actual condition and risk areas, rather than a one-size-fits-all schedule.',
    included: [
      'Scheduled panel and circuit inspection',
      'Thermal imaging surveys',
      'Generator and solar/inverter system checks',
      'Testing and compliance documentation',
    ],
    priceFromNgn: 25000,
    inspectionFeeNgn: 25000,
    emergencySurchargeNgn: null,
    durationMinutes: 90,
    requiresAssessment: false,
  },
  {
    slug: 'industrial-electrical-systems',
    name: 'Industrial Electrical Assessment',
    category: 'industrial',
    description:
      'Three-phase power distribution, motor control, and factory-floor electrical infrastructure engineered to spec — downtime is measured in production loss.',
    recommendationCopy:
      'Industrial electrical work carries higher stakes than residential — this assessment scopes three-phase distribution, motor control, and load requirements before any design work starts.',
    included: [
      'Three-phase power distribution review',
      'Motor control center (MCC) assessment',
      'Power factor review',
      'Single-line diagram and load schedule proposal',
    ],
    priceFromNgn: null,
    inspectionFeeNgn: 50000,
    emergencySurchargeNgn: 30000,
    durationMinutes: 120,
    requiresAssessment: true,
  },
  {
    slug: 'commercial-office-fitout',
    name: 'Commercial & Office Fit-Out Electrical Assessment',
    category: 'industrial',
    description:
      'Electrical scope for office and commercial fit-outs, coordinated with the wider build programme — power, data first-fix, lighting, and life-safety coordination.',
    recommendationCopy:
      'Commercial fit-out electrical work needs to be scoped against your build programme and other trades — this assessment gives us that scope before we design.',
    included: [
      'Power and data first-fix scope review',
      'Lighting and switching plan',
      'Coordination requirements with architects/M&E',
      'Fire alarm and emergency lighting coordination check',
    ],
    priceFromNgn: null,
    inspectionFeeNgn: 40000,
    emergencySurchargeNgn: null,
    durationMinutes: 120,
    requiresAssessment: true,
  },
  {
    slug: 'home-automation',
    name: 'Home Automation',
    category: 'security-automation',
    description:
      'Centralized control of lighting, climate, and access — integrated into the electrical design itself rather than bolted on afterwards.',
    recommendationCopy:
      'Automation works best when it\'s planned into the electrical circuits from the start — this assessment scopes your space so switches, circuits, and control systems work together.',
    included: [
      'Smart lighting and switch circuit review',
      'Centralized control panel and app integration options',
      'Climate control automation options',
      'Scope for existing wiring or new-build circuits',
    ],
    priceFromNgn: null,
    inspectionFeeNgn: 35000,
    emergencySurchargeNgn: null,
    durationMinutes: 90,
    requiresAssessment: true,
  },
  {
    slug: 'cctv-surveillance',
    name: 'CCTV & Security Systems',
    category: 'security-automation',
    description:
      'Camera systems positioned and cabled by engineers, with power and network infrastructure built to last — not just cameras mounted on a wall.',
    recommendationCopy:
      'A surveillance system is only as reliable as the electrical and network infrastructure behind it — this assessment covers site survey, camera placement, and power/cabling scope.',
    included: [
      'Site survey and camera placement design',
      'Structured cabling and PoE power review',
      'NVR/DVR and remote-access recommendation',
      'Integration options with gates and access control',
    ],
    priceFromNgn: null,
    inspectionFeeNgn: 35000,
    emergencySurchargeNgn: null,
    durationMinutes: 90,
    requiresAssessment: true,
  },
  {
    slug: 'emergency-electrical-response',
    name: 'Emergency Electrical Response',
    category: 'maintenance',
    description:
      'A standing emergency line for faults, outages, and safety hazards that can\'t wait for a scheduled callout.',
    recommendationCopy:
      'What you\'ve described is a safety concern that needs an immediate response, not a scheduled assessment.',
    included: [
      '24/7 emergency dispatch',
      'On-site fault diagnosis',
      'Temporary safe isolation where required',
      'Permanent repair or scoped follow-up work',
    ],
    priceFromNgn: null,
    inspectionFeeNgn: null,
    emergencySurchargeNgn: 20000,
    durationMinutes: 90,
    requiresAssessment: false,
  },
] as const

const SERVICE_AREAS = [
  'Maitama', 'Asokoro', 'Wuse', 'Garki', 'Jabi', 'Gwarinpa', 'Life Camp',
  'Katampe', 'Guzape', 'Apo', 'Lokogoma', 'Kubwa', 'Lugbe', 'Airport Road',
  'Karsana',
]

const settings: { key: string; value: unknown }[] = [
  { key: 'business_hours', value: { start: '08:00', end: '18:00', timezone: 'Africa/Lagos' } },
  { key: 'booking_buffer_minutes', value: 30 },
  { key: 'booking_travel_minutes', value: 30 },
  { key: 'max_daily_appointments_per_engineer', value: 6 },
  { key: 'emergency_available', value: true },
  { key: 'whatsapp_number', value: '2348140205895' },
  { key: 'notification_email', value: 'info@kellelectricals.com' },
  { key: 'currency', value: 'NGN' },
]

export type SeedOptions = {
  adminEmail?: string
  adminPassword?: string
}

export type SeedSummary = {
  categoriesUpserted: number
  servicesUpserted: number
  engineersEnsured: number
  settingsUpserted: number
  adminCreated: boolean
  adminEmail: string
}

export async function seedDatabase(prisma: PrismaClient, options: SeedOptions = {}): Promise<SeedSummary> {
  const categoryIds: Record<string, string> = {}
  for (const c of categories) {
    const row = await prisma.serviceCategory.upsert({
      where: { slug: c.slug },
      update: { name: c.name, sortOrder: c.sortOrder },
      create: c,
    })
    categoryIds[c.slug] = row.id
  }

  for (const [index, s] of services.entries()) {
    const { category, ...rest } = s
    const data = {
      ...rest,
      included: [...rest.included],
      serviceAreas: SERVICE_AREAS,
      categoryId: categoryIds[category],
      sortOrder: index,
    }
    await prisma.service.upsert({ where: { slug: s.slug }, update: data, create: data })
  }

  const engineers = [
    { name: 'Chidi Okafor', title: 'Senior Electrical Engineer', email: 'chidi@kellelectricals.com' },
    { name: 'Amina Bello', title: 'Electrical Engineer — Solar & Inverter', email: 'amina@kellelectricals.com' },
    { name: 'Tunde Adeyemi', title: 'Field Engineer', email: 'tunde@kellelectricals.com' },
  ]

  for (const e of engineers) {
    const existing = await prisma.engineer.findFirst({ where: { email: e.email } })
    const engineer = existing ?? (await prisma.engineer.create({ data: { ...e, active: true } }))

    const hasAvailability = await prisma.availability.findFirst({ where: { engineerId: engineer.id } })
    if (!hasAvailability) {
      const weekdayRows = [1, 2, 3, 4, 5].map((dayOfWeek) => ({
        engineerId: engineer.id,
        dayOfWeek,
        startTime: '08:00',
        endTime: '17:00',
        breakStart: '13:00',
        breakEnd: '14:00',
      }))
      await prisma.availability.createMany({ data: weekdayRows })
      // Saturday half-day for one engineer so the platform can show real
      // weekend availability without every engineer working weekends.
      if (e.name === 'Tunde Adeyemi') {
        await prisma.availability.create({
          data: { engineerId: engineer.id, dayOfWeek: 6, startTime: '09:00', endTime: '13:00' },
        })
      }
    }
  }

  for (const s of settings) {
    await prisma.setting.upsert({
      where: { key: s.key },
      update: { value: s.value as never },
      create: { key: s.key, value: s.value as never },
    })
  }

  const adminEmail = options.adminEmail ?? process.env.SEED_ADMIN_EMAIL ?? 'kellelectricals@gmail.com'
  const adminPassword = options.adminPassword ?? process.env.SEED_ADMIN_PASSWORD ?? 'ChangeMe-KellAdmin-2026'
  const existingAdmin = await prisma.adminUser.findUnique({ where: { email: adminEmail } })
  let adminCreated = false
  if (!existingAdmin) {
    await prisma.adminUser.create({
      data: {
        name: 'Kell Electricals Admin',
        email: adminEmail,
        passwordHash: await bcrypt.hash(adminPassword, 12),
        role: 'SUPER_ADMIN',
      },
    })
    adminCreated = true
  }

  return {
    categoriesUpserted: categories.length,
    servicesUpserted: services.length,
    engineersEnsured: engineers.length,
    settingsUpserted: settings.length,
    adminCreated,
    adminEmail,
  }
}
