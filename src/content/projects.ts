// Real completed projects, supplied directly by the client (location,
// job scope, and year for each - session instruction: "add these jobs
// without mentioning their names"). Per that instruction and consistent
// with this file's long-standing policy, no client/property name is
// attached to any entry - locations are area-level only (no street
// address), and no contract values or prices appear anywhere. challenge/
// solution/outcome text is derived only from the scope and year actually
// supplied - nothing beyond that is invented.
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
    title: 'Prepaid Metering & Solar Lighting',
    sector: 'residential',
    serviceSlugs: ['panel-repair-upgrades', 'solar-inverter-systems'],
    location: 'Life Camp, Abuja',
    year: '2019 - 2020',
    summary:
      'Prepaid meter installation across more than 1,000 residential units, paired with solar street lighting for the estate\'s common areas.',
    challenge:
      'The estate needed prepaid metering rolled out across an entire multi-unit residential development, along with reliable street lighting for shared areas - both delivered without disrupting residents already living on site.',
    solution:
      'We installed prepaid meters across more than 1,000 houses on the estate and fitted solar street lights through the common areas, sequencing the work to minimize disruption to residents.',
    outcome:
      'The estate now runs on prepaid metering across its housing units, with solar street lighting covering shared common areas independent of grid supply.',
    image: '/images/photos/hero-control-panel.jpg',
  },
  {
    slug: 'electrical-wiring-conduit-jahi-2020',
    title: 'Wiring, Conduit & Network Cabling',
    sector: 'residential',
    serviceSlugs: ['electrical-wiring-installation'],
    location: 'Jahi, Abuja',
    year: '2020',
    summary:
      'Full electrical wiring, conduit piping, and internet cabling for a residential apartment building in Jahi.',
    challenge:
      'A residential apartment building needed its electrical wiring, conduit infrastructure, and internet cabling installed as one coordinated first-fix package.',
    solution:
      'We ran the full electrical wiring and conduit piping for the building, plus internet cabling, delivered together as a single scope.',
    outcome:
      'The apartments were handed over with complete electrical and network infrastructure in place, ready for occupation.',
    image: '/images/photos/service-detail-hero-wiring.jpg',
  },
  {
    slug: 'solar-installation-technical-college-kano',
    title: 'Solar System & Street Lighting',
    sector: 'commercial',
    serviceSlugs: ['solar-inverter-systems'],
    location: 'Tudun Wada, Kano',
    year: '2022',
    summary:
      'Solar power system and solar street lighting installed across a technical college campus in Kano.',
    challenge:
      'The campus needed a solar power installation alongside street lighting to improve power reliability and site lighting across its grounds.',
    solution:
      'We installed a solar power system for the campus along with solar street lights covering the site\'s grounds.',
    outcome:
      'The campus now has solar power capacity and independently-powered street lighting in place.',
    image: '/images/photos/solar-hero-panel-install.jpg',
  },
  {
    slug: 'hybrid-inverter-solar-jahi-2023',
    title: 'Hybrid Inverter & Solar Battery',
    sector: 'residential',
    serviceSlugs: ['solar-inverter-systems'],
    location: 'Jahi, Abuja',
    year: '2023',
    summary:
      'Installation of a 5kVA hybrid inverter, 10 solar panels, and a 10kWh lithium battery system for a residential apartment building.',
    challenge:
      'The property needed a hybrid solar and battery backup system installed to reduce reliance on grid power and generator use.',
    solution:
      'We installed a 5kVA hybrid inverter, 10 units of solar panels, and a 10kWh lithium battery bank, sized to the building\'s load.',
    outcome:
      'The property now runs on a hybrid solar and battery system for its day-to-day power needs.',
    image: '/images/photos/solar-roof-install.jpg',
  },
  {
    slug: 'electrical-finishing-cooperative-garki',
    title: 'Decking, Wiring & Fixtures',
    sector: 'commercial',
    serviceSlugs: ['electrical-wiring-installation', 'commercial-office-fitout'],
    location: 'Garki II, Abuja',
    year: 'November 2022 - May 2023',
    summary:
      'Full electrical decking, conduit piping, wiring, and fixture installation and finishing for a cooperative society\'s building in Garki II.',
    challenge:
      'The building required its complete electrical scope delivered end-to-end - from decking and conduit piping through to wiring and final fixture finishing.',
    solution:
      'We carried out all electrical decking piping, wiring, and fixture installation and finishing across the project.',
    outcome:
      'The building was handed over with its full electrical installation and finishing complete.',
    image: '/images/photos/services-substation.jpg',
  },
  {
    slug: 'electrical-hvac-manreng-estate-life-camp',
    title: 'Conduit, HVAC & Electrical Wiring',
    sector: 'residential',
    serviceSlugs: ['electrical-wiring-installation'],
    location: 'Kafe District, Life Camp, Abuja',
    year: '2023',
    summary:
      'Electrical conduit, HVAC and copper pipe installation, and full wiring and fixtures for a residential estate in Life Camp\'s Kafe District.',
    challenge:
      'The estate needed its electrical conduit, HVAC piping, and wiring and fixtures coordinated as a combined first-fix and finishing package.',
    solution:
      'We installed the electrical conduit, HVAC and copper piping, and completed the wiring and fixtures across the estate.',
    outcome:
      'The estate was delivered with complete electrical and HVAC piping infrastructure in place.',
    image: '/images/photos/hero-control-panel.jpg',
  },
  {
    slug: 'electrical-finishing-automation-gwarinpa',
    title: 'Finishing, Automation & Security',
    sector: 'residential',
    serviceSlugs: ['home-automation', 'automated-gates-access-control'],
    location: 'Gwarinpa, Abuja',
    year: '2023',
    summary:
      'Electrical finishing, home automation, and security system integration for an apartment building in Gwarinpa.',
    challenge:
      'The apartments needed electrical finishing paired with home automation and security system integration delivered as one coordinated scope.',
    solution:
      'We completed the electrical finishing and integrated home automation with the security system across the building.',
    outcome:
      'The apartments now operate with integrated home automation and security systems alongside their finished electrical installation.',
    image: '/images/photos/home-automation-hero-smart-panel.jpg',
  },
  {
    slug: 'solar-backup-government-facility-kaduna',
    title: 'Solar Backup System Installation',
    sector: 'commercial',
    serviceSlugs: ['solar-inverter-systems'],
    location: 'Tudun Nupawa, Kaduna',
    year: '2024',
    summary: 'Solar backup power system installed for a government facility in Kaduna.',
    challenge: 'The facility needed a dependable solar backup system to maintain power continuity.',
    solution: 'We installed a solar backup power system sized to the facility\'s requirements.',
    outcome: 'The facility now has solar backup power in place.',
    image: '/images/photos/solar-hero-panel-install.jpg',
  },
  {
    slug: 'solar-street-lighting-asokoro',
    title: 'Solar Street Lighting Installation',
    sector: 'commercial',
    serviceSlugs: ['solar-inverter-systems'],
    location: 'Asokoro District, Abuja',
    year: '2024',
    summary: 'Solar street lighting installed for a guest house facility in Asokoro.',
    challenge:
      'The facility needed reliable street lighting across its grounds, independent of grid supply.',
    solution: 'We installed solar street lights across the facility\'s grounds.',
    outcome: 'The facility now has solar-powered street lighting covering its grounds.',
    image: '/images/photos/maintenance-hero-solar-check.jpg',
  },
  {
    slug: 'solar-renovation-gwarinpa',
    title: 'Solar System & Building Renovation',
    sector: 'commercial',
    serviceSlugs: ['solar-inverter-systems', 'electrical-wiring-installation'],
    location: 'Gwarinpa, Abuja',
    summary:
      '10kWh solar system installation alongside building renovation, ceiling work, and electrical wiring for a commercial property in Gwarinpa.',
    challenge:
      'The property renovation required solar power installation coordinated with ceiling and general renovation works and a full electrical wiring upgrade.',
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
