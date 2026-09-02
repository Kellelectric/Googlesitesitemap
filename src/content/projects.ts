// ⚠️ PLACEHOLDER CONTENT — INVENTED, NOT REAL CASE STUDIES ⚠️
//
// Every project below is fabricated for structural/layout purposes only,
// at the client's explicit request (session instruction: "Build Real
// content that are still missing, you can invent everything and I'll
// make changes later"). This directly overrides the anti-fabrication
// rule that governs the rest of this codebase's content files — do not
// use this file as a precedent for inventing content elsewhere.
//
// No location, scope detail, sector, or outcome here is confirmed real.
// Locations are generic area names (not specific addresses) and no
// client/company names are attached to any project, since naming a real
// or real-sounding business as a "client" without their confirmation
// would misrepresent an actual third party. No contract values or prices
// appear anywhere, consistent with the client's standing direction never
// to publish project financials.
//
// Every one of these pages is `noindex` (see app/projects/[slug]/page.tsx
// and app/projects/page.tsx) so none of this fabricated detail is
// searchable/indexed until the client reviews and replaces it with real
// project data. Remove noindex only once real data replaces this.
export type Project = {
  slug: string
  title: string
  sector: 'residential' | 'commercial' | 'industrial'
  serviceSlugs: string[]
  location: string
  summary: string
  challenge: string
  solution: string
  outcome: string
  image: string
}

export const projects: Project[] = [
  {
    slug: 'residential-estate-rewire-wuse-2',
    title: 'Full Electrical Rewire - 50-Unit Residential Estate',
    sector: 'residential',
    serviceSlugs: ['electrical-wiring-installation', 'panel-repair-upgrades'],
    location: 'Wuse 2, Abuja',
    summary:
      'Complete rewire of an aging 50-unit residential estate, replacing undersized distribution and decades-old wiring with a NEMSA-compliant system sized for current appliance loads.',
    challenge:
      'The estate\'s original wiring and distribution boards were installed decades earlier and had never been reassessed against modern appliance and air-conditioning loads. Residents were reporting recurring tripped breakers, and a pre-purchase inspection on one unit flagged multiple non-compliant circuits.',
    solution:
      'Our team ran a unit-by-unit load assessment, then re-designed the distribution architecture: new consumer units sized against measured (not assumed) demand, updated circuit schedules, and earthing brought up to current standard across all 50 units. Work was phased block by block to keep residents in their homes with minimal disruption.',
    outcome:
      'All 50 units now carry NEMSA-compliant wiring with as-built documentation and circuit schedules on file. Reported nuisance tripping across the estate dropped to isolated cases, each traced to appliance-specific faults rather than panel capacity.',
    image: '/images/photos/hero-control-panel.jpg',
  },
  {
    slug: 'office-fitout-power-data-cbd',
    title: 'Electrical Fit-Out - Multi-Floor Office Building',
    sector: 'commercial',
    serviceSlugs: ['commercial-office-fitout', 'lighting-design-installation'],
    location: 'Central Business District, Abuja',
    summary:
      'Full power, data first-fix, and lighting fit-out for a multi-floor office building, coordinated against a live construction programme.',
    challenge:
      'The building\'s fit-out programme involved multiple trades working to a tight handover date, with the electrical scope needing to coordinate closely with the architect\'s floor plan changes and the M&E consultant\'s fire and emergency lighting requirements.',
    solution:
      'We ran power and data first- and second-fix floor by floor, coordinating weekly with the architect and M&E consultant to absorb late layout changes without delaying the programme. LED lighting was zoned and dimmer-controlled per floor for efficiency, with fire alarm and emergency lighting circuits sequenced ahead of ceiling close-up.',
    outcome:
      'The electrical scope was delivered to the construction programme\'s handover date, with full as-built documentation, circuit schedules, and compliance test results provided to the facilities team at handover.',
    image: '/images/photos/services-substation.jpg',
  },
  {
    slug: 'hybrid-solar-install-gwarinpa',
    title: 'Hybrid Solar & Battery System - Residential Property',
    sector: 'residential',
    serviceSlugs: ['solar-inverter-systems', 'energy-audits'],
    location: 'Gwarinpa, Abuja',
    summary:
      'Load-analyzed hybrid solar and battery installation sized to carry a household\'s essential circuits through extended grid outages.',
    challenge:
      'The homeowner was relying on a generator for several hours most days and wanted to materially cut fuel spend without losing backup capacity during longer outages.',
    solution:
      'We measured actual circuit-level consumption over a full week to build a real load profile, then sized a hybrid solar-battery-generator system: solar and battery as the default day-to-day source, generator as automatic backup for extended or high-load periods. The system was commissioned with performance testing against the design spec, not just a visual check.',
    outcome:
      'The household now runs primarily on solar and battery day-to-day, with the generator reserved for extended outages - reducing routine generator runtime and fuel spend. Monitoring was set up at commissioning so performance can be verified on an ongoing basis.',
    image: '/images/photos/solar-roof-install.jpg',
  },
  {
    slug: 'industrial-panel-upgrade-idu',
    title: 'Three-Phase Distribution Upgrade - Manufacturing Facility',
    sector: 'industrial',
    serviceSlugs: ['industrial-electrical-systems', 'panel-repair-upgrades'],
    location: 'Idu Industrial Area, Abuja',
    summary:
      'Upgraded three-phase power distribution and motor control infrastructure for a manufacturing facility adding a new production line.',
    challenge:
      'The facility\'s existing distribution board was sized for its original production line and had no documented headroom for a second line the client wanted to add, with plant management needing certainty on capacity before committing to new machinery.',
    solution:
      'We conducted a full load survey across all three phases (catching a phase imbalance that was going unnoticed on total-consumption readings alone), then designed and installed an upgraded distribution board and motor control center sized for both the existing and new production lines, with power factor correction included.',
    outcome:
      'The facility commissioned its new production line on the upgraded infrastructure with documented spare capacity for future growth. Single-line diagrams and load schedules were handed over to the plant\'s maintenance team.',
    image: '/images/photos/industry-detail-hero-control-room.jpg',
  },
  {
    slug: 'cctv-security-upgrade-retail-plaza',
    title: 'CCTV & Access Control - Retail Plaza',
    sector: 'commercial',
    serviceSlugs: ['cctv-surveillance', 'automated-gates-access-control'],
    location: 'Wuse, Abuja',
    summary:
      'Structured-cabling CCTV and access control upgrade for a multi-unit retail plaza, replacing an unreliable legacy camera system.',
    challenge:
      'The plaza\'s existing camera system suffered frequent outages traced to undersized cabling and power runs, and management had no remote-viewing capability across the property\'s multiple entry points.',
    solution:
      'We surveyed actual sightlines and entry points rather than defaulting to a generic camera count, replaced the cabling and PoE power runs to spec, and installed NVR recording with remote-access configuration. Gate access control was integrated onto the same cabling infrastructure during the same visit.',
    outcome:
      'The plaza\'s management now has reliable, camera-stopped-working-free coverage of all entry points with remote viewing, and integrated gate access control installed on the same infrastructure at a fraction of the cost of a separate future project.',
    image: '/images/photos/cctv-hero-camera-install.jpg',
  },
  {
    slug: 'smart-home-integration-asokoro',
    title: 'Whole-Home Automation - New-Build Residence',
    sector: 'residential',
    serviceSlugs: ['home-automation', 'lighting-design-installation'],
    location: 'Asokoro, Abuja',
    summary:
      'Smart lighting, climate, and access control integrated at the electrical design stage of a new-build residence, rather than retrofitted after the fact.',
    challenge:
      'The homeowner wanted centralized control of lighting, air conditioning, gates, and security from a single app, specified early enough in the build that the electrical design could be built around it rather than patched together afterward.',
    solution:
      'We integrated smart lighting circuits, climate control, and access control into the electrical design from first-fix stage, configuring scenes and schedules and integrating the gate and CCTV systems onto the same control platform.',
    outcome:
      'The property operates on a single centralized control app for lighting, climate, gates, and security, with circuits and switches designed for the automation system from the start rather than retrofitted around existing wiring.',
    image: '/images/photos/home-automation-hero-smart-panel.jpg',
  },
]

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug)
}

export const sectorLabels: Record<Project['sector'], string> = {
  residential: 'Residential',
  commercial: 'Commercial',
  industrial: 'Industrial',
}
