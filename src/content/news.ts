// News & Updates — shorter, dated posts (project spotlights on already-
// confirmed real work from src/content/projects.ts, plus general seasonal/
// safety advisories) distinct from /resources' evergreen how-to guides.
//
// Anti-fabrication rule, same as every other content file in this repo:
// a "Project Spotlight" post may only restate facts already present in
// projects.ts (via relatedProjectSlug) — no new scope, dates, or outcomes
// invented here. An "Advisory" post carries general professional guidance
// in the same register as /resources' articles (no invented statistics,
// no claimed specific regulatory changes, no claimed specific company
// activity/dates beyond this post's own `date`, which is this post's
// publish date, not a claim about when any underlying work happened).
export type NewsCategory = 'Project Spotlight' | 'Advisory'

export type NewsSection = {
  heading: string
  body: string[]
}

export type NewsPost = {
  slug: string
  title: string
  seoTitle?: string
  category: NewsCategory
  date: string // ISO yyyy-mm-dd — this post's publish date
  summary: string
  sections: NewsSection[]
  relatedProjectSlug?: string
  relatedServiceSlugs?: string[]
  image: string
}

export const news: NewsPost[] = [
  {
    slug: 'solar-backup-kaduna-state-government-house',
    title: 'Project Spotlight: Solar Backup Power at Kaduna State Government House',
    seoTitle: 'Spotlight: Kaduna State Government House Solar Backup',
    category: 'Project Spotlight',
    date: '2026-08-18',
    summary:
      'A look back at the solar backup power system we installed for Kaduna State Government House - see the full case study for scope details.',
    sections: [
      {
        heading: 'Why this one stood out',
        body: [
          'Public institutions can\'t afford power interruptions during official business, and that requirement shaped how this backup system was designed and installed at the Government House in Tudun Nupawa, Kaduna.',
          'We installed a solar backup power system sized to the facility\'s requirements - the facility now has solar backup power in place.',
        ],
      },
    ],
    relatedProjectSlug: 'solar-backup-government-facility-kaduna',
    relatedServiceSlugs: ['solar-inverter-systems'],
    image: '/images/photos/solar-hero-panel-install.jpg',
  },
  {
    slug: 'solar-street-lighting-navy-holdings',
    title: 'Project Spotlight: Solar Street Lighting for Navy Holdings Limited',
    seoTitle: 'Spotlight: Navy Holdings Solar Street Lighting',
    category: 'Project Spotlight',
    date: '2026-07-22',
    summary:
      'Solar street light installation for the Command Guest House, Navy Holdings Limited, in Asokoro - see the full case study for scope details.',
    sections: [
      {
        heading: 'The brief',
        body: [
          'The facility needed reliable outdoor lighting across its grounds, independent of grid supply, for a site where security and visibility both matter.',
          'We installed solar street lights across the facility\'s grounds - it now has solar-powered street lighting covering its grounds, run independent of mains supply.',
        ],
      },
    ],
    relatedProjectSlug: 'solar-street-lighting-asokoro',
    relatedServiceSlugs: ['solar-inverter-systems'],
    image: '/images/photos/maintenance-hero-solar-check.jpg',
  },
  {
    slug: 'rainy-season-backup-power-checklist',
    title: 'Getting Backup Power Ready Before the Rainy Season',
    seoTitle: 'Rainy Season Backup Power Checklist',
    category: 'Advisory',
    date: '2026-06-02',
    summary:
      'A short pre-season checklist for solar/inverter and generator backup systems, before outages and storm-related grid disruptions pick up.',
    sections: [
      {
        heading: 'Before the outages pick up',
        body: [
          'Grid disruptions tend to cluster around Nigeria\'s rainy season - storm damage to feeders, transformer trips, and utility load-shedding all increase. A backup system that hasn\'t been checked since last dry season is the wrong time to find out a battery has degraded or a changeover switch is sticking.',
          'A basic pre-season check covers: battery state of health (not just voltage at rest, but under load), inverter changeover timing, earthing continuity on any exposed outdoor equipment (solar street lighting, external panels), and clearing any accumulated dust or debris from ventilation on inverter/battery enclosures.',
        ],
      },
      {
        heading: 'What we look for on a site visit',
        body: [
          'Our inspection process on a pre-season check is the same one we run for any electrical safety inspection: panel and connection checks, load testing where relevant, and a written summary of anything that needs attention before it becomes a failure during an actual outage.',
          'If it has been more than a year since your system was last inspected, or you cannot remember the last time it was, that is usually the clearest signal it is due.',
        ],
      },
    ],
    relatedServiceSlugs: ['solar-inverter-systems', 'preventive-maintenance-contracts'],
    image: '/images/photos/hse-hero-site-safety.jpg',
  },
]

export function getNewsBySlug(slug: string): NewsPost | undefined {
  return news.find((n) => n.slug === slug)
}
