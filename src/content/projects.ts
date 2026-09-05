// Real completed projects, supplied directly by the client. Real
// property/client names are now included - the client later supplied a
// full "Our Work" document naming each project directly (Paradise Phase
// 1, Drol Apartments, CBN Multipurpose Cooperative, Manreng Estate,
// Carton Gate Apartment, Kaduna State Government House, Navy Holdings
// Limited, Andromeda Beauty Locs), superseding an earlier session's
// "add these jobs without mentioning their names" instruction - this
// document IS the client's clearance to publish those names. Locations
// stay area-level only (no street address/Plus Code, even though the
// client's document included some) and no contract values or prices
// appear anywhere, consistent with this file's long-standing policy.
// challenge/solution/outcome text is derived only from the scope
// actually supplied - nothing beyond that is invented.
//
// No longer placeholder content: every entry below is real, so noIndex
// has been removed from app/projects/page.tsx and
// app/projects/[slug]/page.tsx, and these routes were added to
// sitemap.ts.
export type Project = {
  slug: string
  title: string
  sector: 'residential' | 'commercial' | 'industrial'
  serviceSlugs: string[]
  location: string
  year?: string
  summary: string
  challenge: string
  solution: string
  outcome: string
  image: string
}

export const projects: Project[] = [
  {
    slug: 'prepaid-meter-installation-life-camp',
    title: 'Paradise Phase 1, Life Camp Estate',
    sector: 'residential',
    serviceSlugs: ['panel-repair-upgrades', 'solar-inverter-systems'],
    location: 'Life Camp, Abuja',
    year: '2019 - 2020',
    summary:
      'Prepaid meter installation across more than 1,000 houses at Paradise Phase 1, paired with solar street lighting for the estate\'s common areas.',
    challenge:
      'Work at this scale meant standardizing prepaid meter installation across every unit while keeping each meter compliant and properly connected, and rolling out street lighting that would hold up across the estate\'s common areas without constant maintenance call-outs.',
    solution:
      'We installed prepaid meters across more than 1,000 houses on the estate and fitted solar street lights through the common areas, sequencing the work to minimize disruption to residents.',
    outcome:
      'The estate now runs on prepaid metering across its housing units, with solar street lighting covering shared common areas independent of grid supply.',
    image: '/images/photos/hero-control-panel.jpg',
  },
  {
    slug: 'electrical-wiring-conduit-jahi-2020',
    title: 'Drol Apartments, Jahi',
    sector: 'residential',
    serviceSlugs: ['electrical-wiring-installation'],
    location: 'Jahi, Abuja',
    year: '2020',
    summary:
      'Full electrical wiring, conduit piping, and internet cabling for Drol Apartments in Jahi - our first engagement at this property.',
    challenge:
      'The apartment complex needed its electrical wiring, conduit infrastructure, and internet cabling installed as one coordinated first-fix package, laying the groundwork for everything the building would need to run properly from day one.',
    solution:
      'We ran the full electrical wiring and conduit piping for the building, plus internet cabling, delivered together as a single scope.',
    outcome:
      'The apartments were handed over with complete electrical and network infrastructure in place, ready for occupation - and the client returned to us for a second phase of work (see the Drol Apartments hybrid inverter & solar project below).',
    image: '/images/photos/service-detail-hero-wiring.jpg',
  },
  {
    slug: 'solar-installation-technical-college-kano',
    title: 'Kano State College of Health Sciences and Technology',
    sector: 'commercial',
    serviceSlugs: ['solar-inverter-systems'],
    location: 'Tudun Wada, Kano',
    year: '2022',
    summary:
      'Solar power system and solar street lighting installed across the Kano State College of Health Sciences and Technology campus.',
    challenge:
      'Public and educational facilities need power they can depend on, and solar backup that doesn\'t just work on installation day but keeps working through years of daily use.',
    solution:
      'We installed a solar power system for the campus along with solar street lights covering the site\'s grounds.',
    outcome:
      'The campus now has solar power capacity and independently-powered street lighting in place.',
    image: '/images/photos/solar-hero-panel-install.jpg',
  },
  {
    slug: 'hybrid-inverter-solar-jahi-2023',
    title: 'Drol Apartments, Jahi - Phase 2',
    sector: 'residential',
    serviceSlugs: ['solar-inverter-systems'],
    location: 'Jahi, Abuja',
    year: '2023',
    summary:
      'A second phase of work at Drol Apartments: installing a 5kVA hybrid inverter, 10 solar panels, and a 10kWh lithium battery system.',
    challenge:
      'The property needed a hybrid solar and battery backup system installed to reduce reliance on grid power and generator use.',
    solution:
      'We installed a 5kVA hybrid inverter, 10 units of solar panels, and a 10kWh lithium battery bank, sized to the building\'s load.',
    outcome:
      'The property now runs on a hybrid solar and battery system for its day-to-day power needs - coming back to us for expanded work, rather than bringing in another contractor, says as much about the first phase as it does about this one.',
    image: '/images/photos/solar-roof-install.jpg',
  },
  {
    slug: 'electrical-finishing-cooperative-garki',
    title: 'CBN Multipurpose Cooperative',
    sector: 'commercial',
    serviceSlugs: ['electrical-wiring-installation', 'commercial-office-fitout'],
    location: 'Garki II, Abuja',
    year: 'November 2022 - May 2023',
    summary:
      'Full electrical decking, conduit piping, wiring, and fixture installation and finishing for the CBN Multipurpose Cooperative\'s building in Garki II.',
    challenge:
      'Work tied to a Central Bank facility leaves no margin for shortcuts at any stage, from the piping behind the walls to the switches and fittings clients actually see.',
    solution:
      'We carried out all electrical decking piping, wiring, and fixture installation and finishing across the project.',
    outcome:
      'The building was handed over with its full electrical installation and finishing complete.',
    image: '/images/photos/services-substation.jpg',
  },
  {
    slug: 'electrical-hvac-manreng-estate-life-camp',
    title: 'Manreng Estate, Kafe District',
    sector: 'residential',
    serviceSlugs: ['electrical-wiring-installation'],
    location: 'Kafe District, Life Camp, Abuja',
    year: '2023',
    summary:
      'Electrical conduit, HVAC and copper pipe installation, and full wiring and fixtures across Manreng Estate in Life Camp\'s Kafe District.',
    challenge:
      'Multi-unit estate work like this tests whether a team can hold the same standard across dozens of homes, not just one showcase unit.',
    solution:
      'We installed the electrical conduit, HVAC and copper piping, and completed the wiring and fixtures across the estate.',
    outcome:
      'The estate was delivered with complete electrical and HVAC piping infrastructure in place.',
    image: '/images/photos/hero-control-panel.jpg',
  },
  {
    slug: 'electrical-finishing-automation-gwarinpa',
    title: 'Carton Gate Apartment, Gwarinpa',
    sector: 'residential',
    serviceSlugs: ['home-automation', 'automated-gates-access-control'],
    location: 'Gwarinpa, Abuja',
    year: '2023',
    summary:
      'Electrical finishing, home automation, and security system integration for Carton Gate Apartment in Gwarinpa.',
    challenge:
      'Bringing the apartment\'s electrical backbone together with smart controls and a properly integrated security setup, rather than treating them as separate afterthoughts.',
    solution:
      'We completed the electrical finishing and integrated home automation with the security system across the building.',
    outcome:
      'The apartments now operate with integrated home automation and security systems alongside their finished electrical installation.',
    image: '/images/photos/home-automation-hero-smart-panel.jpg',
  },
  {
    slug: 'solar-backup-government-facility-kaduna',
    title: 'Kaduna State Government House',
    sector: 'commercial',
    serviceSlugs: ['solar-inverter-systems'],
    location: 'Tudun Nupawa, Kaduna',
    year: '2024',
    summary: 'Solar backup power system installed for the Kaduna State Government House.',
    challenge:
      'Public institutions can\'t afford power interruptions during official business, and that requirement shaped how the backup system was designed and installed.',
    solution: 'We installed a solar backup power system sized to the facility\'s requirements.',
    outcome: 'The facility now has solar backup power in place.',
    image: '/images/photos/solar-hero-panel-install.jpg',
  },
  {
    slug: 'solar-street-lighting-asokoro',
    title: 'Navy Holdings Limited',
    sector: 'commercial',
    serviceSlugs: ['solar-inverter-systems'],
    location: 'Asokoro District, Abuja',
    year: '2024',
    summary: 'Solar street light installation for the Command Guest House, Navy Holdings Limited.',
    challenge:
      'The facility needed reliable outdoor lighting across its grounds, independent of grid supply, for a site where security and visibility both matter.',
    solution: 'We installed solar street lights across the facility\'s grounds.',
    outcome: 'The facility now has solar-powered street lighting covering its grounds.',
    image: '/images/photos/maintenance-hero-solar-check.jpg',
  },
  {
    slug: 'solar-renovation-gwarinpa',
    title: 'Andromeda Beauty Locs, Gwarinpa',
    sector: 'commercial',
    serviceSlugs: ['solar-inverter-systems', 'electrical-wiring-installation'],
    location: 'Gwarinpa, Abuja',
    summary:
      '10kWh solar system installation alongside building renovation, ceiling work, and electrical wiring for Andromeda Beauty Locs in Gwarinpa.',
    challenge:
      'Fitting out a functioning beauty and wellness business meant coordinating structural, electrical, and finishing work so the space could open ready for clients, not half-done in one area while another lagged behind.',
    solution:
      'We installed a 10kWh solar system and gypsum board ceiling, and completed the building renovation and electrical wiring and installation as one coordinated scope.',
    outcome:
      'The property was delivered with a new 10kWh solar system, renovated interior, and updated electrical wiring.',
    image: '/images/photos/solar-roof-install.jpg',
  },
  {
    slug: 'industrial-factory-electrical-conversion',
    title: 'Industrial Electrical Conversion',
    sector: 'industrial',
    serviceSlugs: ['industrial-electrical-systems'],
    location: 'Abuja',
    summary:
      'Full electrical conversion for a manufacturing facility, from site assessment through commissioning.',
    challenge:
      'The facility needed its electrical infrastructure converted to reach full production readiness, with a clear scope and formal sign-off at each stage of the work.',
    solution:
      'We carried out a site evaluation and electrical load assessment, developed a Service Level Agreement covering project execution, completed the full electrical conversion works (including variation orders as requirements evolved), and closed out with a final inspection and Certificate of Commissioning.',
    outcome:
      "The facility's electrical system was successfully converted and commissioned, bringing the site up to operational readiness for manufacturing use.",
    image: '/images/photos/industry-detail-hero-control-room.jpg',
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
