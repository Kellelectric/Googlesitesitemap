export type Industry = {
  slug: string
  name: string
  summary: string
  description: string
  challenges: string[]
  serviceSlugs: string[]
}

export const industries: Industry[] = [
  {
    slug: 'residential',
    name: 'Residential',
    summary:
      'Homes engineered for Nigeria\'s actual grid conditions, not just the day the wiring passes inspection.',
    description:
      'A home\'s electrical system gets tested every time the grid drops. We wire, upgrade, and back up residential properties so lights, security systems, and appliances keep working through outages, not just on a good day.',
    challenges: [
      'Unreliable grid power driving demand for solar and backup systems',
      'Aging wiring and undersized panels in older properties',
      'Security systems (CCTV, gates, access control) that need to work during an outage, not just when mains power is on',
      'Growing appliance and EV charging loads that older panels were never sized for',
    ],
    serviceSlugs: [
      'electrical-wiring-installation',
      'panel-repair-upgrades',
      'solar-inverter-systems',
      'home-automation',
      'cctv-surveillance',
      'automated-gates-access-control',
      'ev-charging-installation',
      'lighting-design-installation',
    ],
  },
  {
    slug: 'commercial',
    name: 'Commercial',
    summary:
      'Offices and retail fit-outs where an electrical fault means lost trading hours, not just an inconvenience.',
    description:
      'Commercial premises run on tighter margins for downtime than a home does. We handle fit-out electrical work, panel capacity, backup power, and ongoing maintenance so an outage or a fault doesn\'t become a closed sign on the door.',
    challenges: [
      'Business continuity: a power fault directly costs trading hours or billable time',
      'Fit-out electrical scope that has to coordinate with architects and construction timelines',
      'Rising generator fuel costs pushing interest in solar/hybrid offset',
      'Insurance and compliance documentation for panels, earthing, and fire/emergency lighting',
    ],
    serviceSlugs: [
      'commercial-office-fitout',
      'panel-repair-upgrades',
      'solar-inverter-systems',
      'generator-installation-maintenance',
      'cctv-surveillance',
      'lighting-design-installation',
      'energy-audits',
      'preventive-maintenance-contracts',
    ],
  },
  {
    slug: 'industrial',
    name: 'Industrial',
    summary:
      'Factory and plant electrical infrastructure where downtime is measured in production loss, not inconvenience.',
    description:
      'Industrial sites carry different stakes than any other property type: a tripped panel or a failed transfer switch stops a production line, not just a light. We design and install three-phase distribution, motor control, and backup systems to engineering spec, with documentation plant maintenance teams can actually use.',
    challenges: [
      'Production downtime cost far exceeding the cost of the electrical fault itself',
      'Three-phase distribution and motor control centers that need engineering-grade documentation',
      'Generator and hybrid integration sized against real measured industrial demand, not estimates',
      'Scheduled maintenance that catches faults before they become unplanned stoppages',
    ],
    serviceSlugs: [
      'industrial-electrical-systems',
      'panel-repair-upgrades',
      'generator-installation-maintenance',
      'energy-audits',
      'preventive-maintenance-contracts',
      'fault-finding-diagnostics',
      'earthing-lightning-protection',
      'emergency-electrical-response',
    ],
  },
  {
    slug: 'hospitality',
    name: 'Hospitality',
    summary:
      'Hotels, restaurants, and event venues where guests never see the electrical system, only whether it works.',
    description:
      'A hospitality property\'s electrical system is invisible when it works and impossible to ignore when it fails mid-service. We size backup power for kitchens and guest areas, wire ambiance and security lighting, and keep systems running through the outages that would otherwise show up as a bad review.',
    challenges: [
      'Zero tolerance for a power failure during guest-facing service',
      'Heavy kitchen and laundry loads on the same supply as guest-facing lighting and systems',
      'Security and access control across large, multi-building properties',
      'Backup power sized for sustained outages, not just a brief bridge',
    ],
    serviceSlugs: [
      'generator-installation-maintenance',
      'solar-inverter-systems',
      'lighting-design-installation',
      'cctv-surveillance',
      'automated-gates-access-control',
      'preventive-maintenance-contracts',
      'emergency-electrical-response',
      'panel-repair-upgrades',
    ],
  },
]

export function getIndustryBySlug(slug: string): Industry | undefined {
  return industries.find((industry) => industry.slug === slug)
}
