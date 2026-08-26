export type ArticleSection = {
  heading: string
  body: string[]
}

export type Article = {
  slug: string
  title: string
  summary: string
  category: 'Solar & Energy' | 'Compliance' | 'Maintenance'
  sections: ArticleSection[]
}

export const articles: Article[] = [
  {
    slug: 'sizing-a-hybrid-inverter-system',
    title: 'How to Size a Hybrid Inverter System in Nigeria',
    summary:
      'Panel count and battery capacity mean nothing without a real load profile behind them. Here is the sizing logic we actually run.',
    category: 'Solar & Energy',
    sections: [
      {
        heading: 'Start with measured consumption, not a guess',
        body: [
          'Most oversized or undersized solar installs trace back to the same mistake: sizing from an assumed load instead of a measured one. A utility bill tells you total monthly consumption, not what actually runs during an outage, at what time of day, or for how long.',
          'A proper sizing process starts with circuit-level monitoring over at least a few days, capturing peak demand and the specific loads that need to stay on during a blackout: lighting, networking, security systems, refrigeration, and any equipment that cannot tolerate downtime.',
        ],
      },
      {
        heading: 'Separate backup load from full load',
        body: [
          'A backup-only system only needs to carry the circuits that matter during an outage, which is usually a fraction of total consumption. A system designed to materially reduce generator or grid dependence has to carry most of the daily load, including air conditioning and larger appliances, which changes the entire sizing calculation.',
          'Deciding which of these two you actually need, before specifying panel count or battery capacity, is the single decision that has the biggest effect on both system cost and whether it does what you expect.',
        ],
      },
      {
        heading: 'Match battery chemistry and cycling to duty cycle',
        body: [
          'A battery bank that only cycles occasionally during outages has a very different duty cycle than one cycling daily to offset generator hours. Chemistry and depth-of-discharge specifications that make sense for one are the wrong spec for the other.',
          'Panel array sizing follows from this: it has to recharge the battery bank within the available daylight hours for your specific cycling pattern, not a generic assumption about sun-hours.',
        ],
      },
      {
        heading: 'Commission with performance testing, not a visual check',
        body: [
          'A system that powers on is not the same as a system that delivers what it was sized to deliver. Commissioning should include performance testing against the design spec: does the battery bank actually carry the intended backup load for the intended duration, and does the panel array recharge it on schedule.',
          'Monitoring setup at commissioning means you can verify this ongoing, rather than finding out during the next extended outage.',
        ],
      },
    ],
  },
  {
    slug: 'nemsa-compliance-commercial-fitout',
    title: 'What NEMSA Compliance Actually Requires for a Commercial Fit-Out',
    summary:
      'Compliance is not a certificate you buy at the end. It is a set of documented decisions made throughout the electrical scope.',
    category: 'Compliance',
    sections: [
      {
        heading: 'Compliance starts at design, not inspection',
        body: [
          'NEMSA (Nigerian Electricity Management Services Agency) standards cover installation practice, from earthing and bonding to distribution board specification and cable sizing. Treating compliance as a final inspection step, after the electrical work is already installed, is how fit-outs end up with expensive rework.',
          'A compliant fit-out starts with the electrical design itself: load assessment, circuit design, and distribution board specification documented against NEMSA requirements before a single cable is pulled.',
        ],
      },
      {
        heading: 'Earthing and bonding are not optional line items',
        body: [
          'Proper earthing and bonding protect people and equipment, and they are also where a large share of NEMSA non-compliance findings originate. This covers earth electrode design, earth loop impedance testing, and bonding of exposed conductive parts, all of which need to be tested and documented, not just installed and assumed correct.',
        ],
      },
      {
        heading: 'Documentation is part of the deliverable',
        body: [
          'A commercial fit-out should leave the client with as-built drawings, a circuit schedule, and compliance test results, not just a working installation. This documentation is what a NEMSA inspection actually checks against, and it is what a facilities team needs for any future maintenance or fault-finding.',
          'Coordinating this with architects and M&E consultants during the fit-out, rather than reconstructing it afterward, is the difference between a straightforward compliance sign-off and a delayed one.',
        ],
      },
      {
        heading: 'Fire and emergency lighting coordination',
        body: [
          'Commercial fit-outs typically also need fire alarm and emergency lighting circuits coordinated with the main electrical scope, not installed as an afterthought by a separate trade. Getting this sequencing right the first time avoids the rework that comes from running fire-rated cabling after walls and ceilings are already closed up.',
        ],
      },
    ],
  },
  {
    slug: 'signs-your-panel-needs-upgrading',
    title: 'Signs Your Electrical Panel Needs Upgrading Before It Fails',
    summary:
      'A distribution panel rarely fails without warning. These are the signs worth acting on before it does.',
    category: 'Maintenance',
    sections: [
      {
        heading: 'Recurring tripped breakers',
        body: [
          'An occasional trip from an overloaded circuit is normal. A breaker that trips repeatedly under normal use, especially on a circuit that used to handle the same load without issue, usually means the panel is carrying more than it was sized for, or the breaker itself is degrading.',
        ],
      },
      {
        heading: 'Warm panel covers or a burning smell near the panel',
        body: [
          'A distribution panel should be cool to the touch during normal operation. Warmth on the panel cover, discoloration around breakers, or any burning smell are signs of a loose connection or an overloaded circuit generating heat, and should be treated as urgent rather than monitored.',
        ],
      },
      {
        heading: 'Adding major loads without reassessing capacity',
        body: [
          'Air conditioning units, EV chargers, and industrial equipment all draw sustained, high loads. A panel sized for a building\'s original demand decades ago rarely has headroom for these additions without a capacity reassessment, and installing a major new load without checking that first is how panels get pushed past safe operating margins.',
        ],
      },
      {
        heading: 'A pre-purchase or insurance inspection flags it',
        body: [
          'Panel condition is a common finding in pre-purchase electrical inspections and insurance-driven assessments. If an inspection has already flagged thermal issues, outdated breaker types, or capacity concerns, that is a documented reason to act rather than wait for a failure to force the issue.',
        ],
      },
      {
        heading: 'What a proper assessment looks like',
        body: [
          'A panel assessment should include thermal imaging to catch heat-related issues invisible to the eye, a capacity check against current and planned loads, and an inspection of breaker and busbar condition. The outcome should be a clear repair, re-rate, or replace recommendation, not a guess.',
        ],
      },
    ],
  },
]

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((article) => article.slug === slug)
}
