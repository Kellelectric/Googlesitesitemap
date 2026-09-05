export type ServiceCategory =
  | 'power'
  | 'energy'
  | 'security-automation'
  | 'industrial'
  | 'maintenance'

export type Service = {
  slug: string
  name: string
  // Optional shorter name for the <title> tag / SERP snippet only — the
  // on-page H1/heading always uses `name` above, unchanged. Set this when
  // `name` (name + " - Kell Electricals Ltd") would push the rendered
  // <title> past Google's ~60-character display budget.
  seoTitle?: string
  category: ServiceCategory
  summary: string
  description: string
  scope: string[]
  useCases: string[]
  flagship?: boolean
}

export const categoryLabels: Record<ServiceCategory, string> = {
  power: 'Power Systems',
  energy: 'Energy & Solar',
  'security-automation': 'Security & Automation',
  industrial: 'Industrial',
  maintenance: 'Maintenance & Response',
}

export const services: Service[] = [
  {
    slug: 'electrical-wiring-installation',
    name: 'Electrical Wiring & Installation',
    category: 'power',
    summary:
      'New-build and rewiring work engineered to NEMSA standard, from single-circuit runs to full building distribution.',
    description:
      'Complete electrical wiring for new construction and full or partial rewires of existing buildings. Every installation is designed against the building\'s actual load profile, not a generic template, and documented with as-built drawings and a circuit schedule on handover.',
    scope: [
      'Load assessment and circuit design',
      'First-fix and second-fix wiring',
      'Distribution board and consumer unit installation',
      'Socket, switch, and lighting circuit installation',
      'Earthing and bonding to NEMSA requirements',
      'As-built documentation and circuit schedule',
    ],
    useCases: [
      'New residential or commercial construction',
      'Full rewire of an older property before resale or occupation',
      'Extension or renovation requiring new circuits',
    ],
  },
  {
    slug: 'panel-repair-upgrades',
    name: 'Panel Repair & Upgrades',
    category: 'power',
    summary:
      'Diagnosis and upgrade of distribution boards and switchgear that are undersized, outdated, or failing.',
    description:
      'Distribution panels sized for a building\'s original load rarely match its current demand after years of added appliances, air conditioning, or equipment. Our team assesses panel condition and capacity, then repairs, re-rates, or replaces switchgear to bring it back within safe operating margins.',
    scope: [
      'Panel inspection and thermal assessment',
      'Breaker and busbar repair or replacement',
      'Capacity upgrades and panel re-rating',
      'Surge protection device installation',
      'Labelling and circuit schedule updates',
    ],
    useCases: [
      'Recurring tripped breakers or warm panel covers',
      'Adding major loads (AC units, EV chargers, industrial equipment)',
      'Pre-purchase or insurance-driven electrical inspection findings',
    ],
  },
  {
    slug: 'solar-inverter-systems',
    name: 'Solar & Inverter Systems',
    // "Solar in Abuja" - kept distinct from /solar-energy-systems'
    // "Solar Company in Abuja" title so the two pages target related but
    // non-identical phrasing rather than competing for the same one.
    // Short by design - `name` + suffix alone would clear Google's ~60
    // char display budget, so this doesn't have room to also spell out
    // "Solar & Inverter Systems" again.
    seoTitle: 'Solar in Abuja',
    category: 'energy',
    flagship: true,
    summary:
      'Load-analyzed solar and hybrid inverter systems sized for Nigeria\'s grid reality, not a generic panel count.',
    description:
      'Reliable power in Nigeria means designing for the grid you actually have, not the one on paper. Our team runs a full load analysis before specifying a single panel, sizing solar arrays, battery banks, and hybrid inverters to match real consumption patterns, backup priorities, and budget, then installs and commissions the system with documented performance testing.',
    scope: [
      'Load analysis and consumption audit',
      'System sizing (panels, battery bank, inverter capacity)',
      'Hybrid inverter and battery installation',
      'Grid/solar/generator integration and automatic transfer',
      'Commissioning, performance testing, and monitoring setup',
      'Maintenance plans for panel cleaning and battery health checks',
    ],
    useCases: [
      'Homes and offices facing frequent grid outages',
      'Businesses looking to cut generator fuel spend',
      'New builds designed for solar from the ground up',
    ],
  },
  {
    slug: 'home-automation',
    name: 'Home Automation',
    category: 'security-automation',
    summary:
      'Centralized control of lighting, climate, and access, integrated at the electrical layer, not bolted on.',
    description:
      'Automation systems installed after the fact tend to fight the existing wiring. We integrate smart lighting, climate, and access control into the electrical design itself, so switches, circuits, and control systems work together rather than as a patchwork of retrofitted devices.',
    scope: [
      'Smart lighting and switch circuit design',
      'Centralized control panel and app integration',
      'Climate control automation',
      'Scene and scheduling configuration',
      'Integration with existing wiring or new-build circuits',
    ],
    useCases: [
      'New builds specifying whole-home automation',
      'Retrofitting smart control into an existing property',
      'Offices standardizing lighting/climate schedules for efficiency',
    ],
  },
  {
    slug: 'cctv-surveillance',
    name: 'CCTV & Surveillance Systems',
    category: 'security-automation',
    summary:
      'Camera systems positioned and cabled by engineers, with power and network infrastructure built to last.',
    description:
      'A surveillance system is only as reliable as the electrical and network infrastructure behind it. We design camera placement for actual coverage needs, run structured cabling and power correctly the first time, and configure recording and remote-access systems for real-world use.',
    scope: [
      'Site survey and camera placement design',
      'Structured cabling and PoE power installation',
      'NVR/DVR installation and configuration',
      'Remote viewing and alert setup',
      'Integration with gates and access control',
    ],
    useCases: [
      'Residential perimeter and entry monitoring',
      'Commercial premises and warehouse security',
      'Multi-site businesses needing centralized remote monitoring',
    ],
  },
  {
    slug: 'automated-gates-access-control',
    name: 'Automated Gates & Access Control',
    category: 'security-automation',
    summary:
      'Motorized gates, intercoms, and access control wired and commissioned as a single reliable system.',
    description:
      'From sliding and swing gate motors to intercom and card/biometric access control, we handle the full electrical and control integration, not just the motor installation, so the system works reliably under Abuja\'s power conditions, including backup during outages.',
    scope: [
      'Gate motor installation and wiring',
      'Intercom and video entry systems',
      'Card, keypad, or biometric access control',
      'Battery backup for outage continuity',
      'Integration with CCTV and home automation',
    ],
    useCases: [
      'New compound or estate perimeter security',
      'Replacing an unreliable or manual gate system',
      'Multi-tenant properties needing managed access control',
    ],
  },
  {
    slug: 'ev-charging-installation',
    name: 'EV Charger Installation',
    category: 'energy',
    summary:
      'Dedicated EV charging circuits sized correctly against existing panel capacity, not a generic add-on outlet.',
    description:
      'EV chargers draw sustained, high loads that most existing panels weren\'t designed for. We assess available capacity, upgrade supply where needed, and install a dedicated, correctly protected circuit, with load management where solar or generator integration is in play.',
    scope: [
      'Panel capacity assessment for EV load',
      'Dedicated circuit design and installation',
      'Charger mounting and commissioning',
      'Load management with solar/generator systems where applicable',
    ],
    useCases: [
      'Residential EV charger installation',
      'Commercial or fleet charging points',
      'New builds pre-wiring for future EV adoption',
    ],
  },
  {
    slug: 'generator-installation-maintenance',
    name: 'Generator Installation & Maintenance',
    category: 'power',
    summary:
      'Correctly sized generator installations with automatic transfer switching, plus ongoing maintenance contracts.',
    description:
      'A generator is only as good as the transfer system and maintenance behind it. We size and install generator systems with proper automatic transfer switching against the mains and solar supply, and offer scheduled maintenance to keep them ready before an outage, not after a failed start.',
    scope: [
      'Generator sizing against building load',
      'Automatic transfer switch (ATS) installation',
      'Integration with mains and solar/hybrid systems',
      'Scheduled maintenance and load testing',
      'Emergency repair callouts',
    ],
    useCases: [
      'New generator installation for homes or businesses',
      'Replacing manual changeover with automatic transfer',
      'Ongoing maintenance contracts for existing generator fleets',
    ],
  },
  {
    slug: 'energy-audits',
    name: 'Energy Audits',
    category: 'energy',
    summary:
      'Measured consumption analysis that identifies where power and money are actually being lost.',
    description:
      'Before recommending solar sizing, generator changes, or efficiency upgrades, we measure. An energy audit maps actual consumption by circuit and load, flags inefficiencies and unsafe conditions, and gives a prioritized, costed action plan rather than generic advice.',
    scope: [
      'Circuit-level consumption measurement',
      'Thermal imaging for fault and inefficiency detection',
      'Load profiling against tariff/generator cost',
      'Prioritized, costed recommendations report',
    ],
    useCases: [
      'Businesses looking to right-size solar or generator investment',
      'High electricity or generator fuel costs with unclear cause',
      'Pre-renovation planning for major electrical changes',
    ],
  },
  {
    slug: 'industrial-electrical-systems',
    name: 'Industrial Electrical Systems',
    category: 'industrial',
    summary:
      'Three-phase power distribution, motor control, and factory-floor electrical infrastructure engineered to spec.',
    description:
      'Industrial and factory electrical work carries different stakes than residential: downtime is measured in production loss. We design and install three-phase distribution, motor control centers, and factory-floor infrastructure to engineering spec, with documentation suited to plant maintenance teams.',
    scope: [
      'Three-phase power distribution design and installation',
      'Motor control center (MCC) installation',
      'Machine and production-line electrical connections',
      'Power factor correction',
      'Single-line diagrams and load schedules on handover',
    ],
    useCases: [
      'Factory or plant electrical fit-out and conversion',
      'Adding production lines or heavy machinery',
      'Upgrading legacy industrial electrical infrastructure',
    ],
  },
  {
    slug: 'emergency-electrical-response',
    name: '24/7 Emergency Response',
    category: 'maintenance',
    summary:
      'A standing emergency line for faults, outages, and safety hazards that can\'t wait for a scheduled callout.',
    description:
      'Electrical faults that pose a safety or business-continuity risk get a same-day, any-hour response. This isn\'t a general contact line. It\'s a dedicated emergency response service for genuine electrical hazards and critical outages.',
    scope: [
      '24/7 emergency dispatch',
      'On-site fault diagnosis',
      'Temporary safe isolation where required',
      'Permanent repair or scoped follow-up work',
    ],
    useCases: [
      'Burning smell, sparking, or exposed live wiring',
      'Total power loss affecting a business or critical equipment',
      'Storm or flood damage to electrical systems',
    ],
  },
  {
    slug: 'fault-finding-diagnostics',
    name: 'Electrical Fault Finding & Diagnostics',
    seoTitle: 'Fault Finding & Diagnostics',
    category: 'maintenance',
    summary:
      'Systematic fault tracing using proper test equipment, not a guess-and-replace approach.',
    description:
      'Intermittent faults, nuisance tripping, and "it works sometimes" problems get resolved with systematic diagnostics (circuit tracing, insulation resistance testing, and thermal imaging) rather than replacing parts until something works.',
    scope: [
      'Circuit tracing and continuity testing',
      'Insulation resistance and earth loop impedance testing',
      'Thermal imaging inspection',
      'Root-cause diagnosis and repair recommendation',
    ],
    useCases: [
      'Recurring nuisance tripping with no obvious cause',
      'Intermittent power loss to specific circuits or rooms',
      'Pre-purchase electrical condition reports',
    ],
  },
  {
    slug: 'lighting-design-installation',
    name: 'Lighting Design & Installation',
    category: 'power',
    summary:
      'Interior and exterior lighting engineered for the right levels, efficiency, and control, not just fixture placement.',
    description:
      'Lighting design starts with the space\'s actual use (task lighting, ambient levels, energy efficiency, and control zoning) and ends with correctly specified, energy-efficient fixtures wired to that plan.',
    scope: [
      'Lighting layout and lux-level design',
      'LED fixture specification and installation',
      'Interior, exterior, and facade lighting',
      'Zoning and scene/dimmer control',
    ],
    useCases: [
      'New commercial or residential fit-outs',
      'Retrofitting older buildings to efficient LED lighting',
      'Facade or landscape lighting for commercial properties',
    ],
  },
  {
    slug: 'earthing-lightning-protection',
    name: 'Earthing & Lightning Protection',
    category: 'power',
    summary:
      'Earthing systems and lightning protection installed and tested to protect people, equipment, and buildings.',
    description:
      'Proper earthing and lightning protection are non-negotiable safety infrastructure, particularly for buildings with sensitive equipment or exposed locations. We design, install, and test earthing systems and lightning protection to measured, documented standards.',
    scope: [
      'Earth electrode design and installation',
      'Earth loop impedance testing',
      'Lightning protection system design and installation',
      'Surge protection device installation',
      'Compliance testing and certification',
    ],
    useCases: [
      'New builds requiring compliant earthing before energization',
      'Buildings with recurring surge-related equipment damage',
      'Exposed or elevated structures needing lightning protection',
    ],
  },
  {
    slug: 'commercial-office-fitout',
    name: 'Commercial & Office Fit-Out Electrical',
    seoTitle: 'Commercial & Office Fit-Out',
    category: 'industrial',
    summary:
      'Electrical scope for office and commercial fit-outs, coordinated with the wider build programme.',
    description:
      'Fit-out electrical work has to coordinate with architects, M&E consultants, and construction timelines. We deliver the full electrical scope (power, data first-fix, lighting, and life-safety coordination) as part of a managed fit-out programme, not an isolated trade.',
    scope: [
      'Power and data first- and second-fix',
      'Lighting and switching installation',
      'Coordination with architects and M&E consultants',
      'Fire alarm and emergency lighting coordination',
      'Snagging and handover documentation',
    ],
    useCases: [
      'New office or retail fit-outs',
      'Multi-trade construction programmes needing a reliable electrical contractor',
      'Refurbishment of existing commercial space',
    ],
  },
  {
    slug: 'preventive-maintenance-contracts',
    name: 'Preventive Maintenance Contracts',
    category: 'maintenance',
    summary:
      'Scheduled inspection and maintenance that catches faults before they become outages.',
    description:
      'Most electrical failures are preventable with scheduled inspection. Maintenance contracts cover periodic panel inspection, thermal imaging, testing, and generator/solar system checks on a fixed schedule, with a documented report after every visit.',
    scope: [
      'Scheduled panel and circuit inspection',
      'Thermal imaging surveys',
      'Generator and solar/inverter system checks',
      'Testing and compliance documentation',
      'Priority response for contract holders',
    ],
    useCases: [
      'Commercial and industrial sites requiring documented compliance',
      'Property managers overseeing multiple sites',
      'Homeowners wanting proactive rather than reactive maintenance',
    ],
  },
]

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((service) => service.slug === slug)
}
