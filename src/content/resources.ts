export type ArticleSection = {
  heading: string
  body: string[]
}

export type Article = {
  slug: string
  title: string
  // Optional shorter title for the <title> tag / SERP snippet only — the
  // on-page H1 always uses `title` above, unchanged. `title`'s descriptive,
  // full-sentence style reads well as a heading but pushes the rendered
  // <title> (title + " - Kell Electricals Ltd") past Google's ~60-character
  // display budget for several articles; set this when that's the case
  // rather than shortening the on-page heading itself.
  seoTitle?: string
  summary: string
  category: 'Solar & Energy' | 'Compliance' | 'Maintenance' | 'Security & Automation' | 'Industrial'
  sections: ArticleSection[]
  // Cross-references into services.ts — the service lines this guide's
  // subject matter is directly about, so a reader can jump straight from
  // the explainer to the relevant service page.
  relatedServiceSlugs: string[]
}

export const articles: Article[] = [
  {
    slug: 'sizing-a-hybrid-inverter-system',
    title: 'How to Size a Hybrid Inverter System in Nigeria',
    seoTitle: 'Sizing a Hybrid Inverter System',
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
    relatedServiceSlugs: ['solar-inverter-systems', 'energy-audits'],
  },
  {
    slug: 'nemsa-compliance-commercial-fitout',
    title: 'What NEMSA Compliance Actually Requires for a Commercial Fit-Out',
    seoTitle: 'Commercial Fit-Out NEMSA Compliance',
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
    relatedServiceSlugs: [
      'commercial-office-fitout',
      'electrical-wiring-installation',
      'earthing-lightning-protection',
    ],
  },
  {
    slug: 'signs-your-panel-needs-upgrading',
    title: 'Signs Your Electrical Panel Needs Upgrading Before It Fails',
    seoTitle: 'Signs Your Panel Needs Upgrading',
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
    relatedServiceSlugs: ['panel-repair-upgrades', 'fault-finding-diagnostics'],
  },
  {
    slug: 'generator-vs-solar-vs-hybrid',
    title: 'Generator vs. Solar vs. Hybrid: Choosing Backup Power',
    seoTitle: 'Generator vs Solar vs Hybrid Power',
    summary:
      'The right backup system depends on your outage pattern and budget, not which option sounds most modern.',
    category: 'Solar & Energy',
    sections: [
      {
        heading: 'Generators solve for depth, not cost per kWh',
        body: [
          'A correctly sized generator can carry a full building load indefinitely, limited only by fuel supply. That makes it the right call where outages are long but infrequent, or where a facility genuinely cannot afford any capacity shortfall. The tradeoff is running cost: fuel and maintenance add up fast under daily use.',
        ],
      },
      {
        heading: 'Solar-only solves for frequent, shorter outages',
        body: [
          'A solar-plus-battery system with no generator works well where outages are frequent but the backup load is modest, and where daylight hours reliably recharge the battery bank between events. It struggles with sustained high loads or extended cloudy-day outages unless significantly oversized.',
        ],
      },
      {
        heading: 'Hybrid systems trade complexity for coverage',
        body: [
          'A hybrid setup, solar and battery as the default source with generator or grid as automatic backup, covers the gap between the two: day-to-day outages run on solar, while a generator handles the rare extended event or high-load period. It costs more to install and commission than either option alone, and the payoff depends on how often that hybrid handoff actually gets used.',
        ],
      },
      {
        heading: 'The decision starts with your outage pattern, not the technology',
        body: [
          'Before comparing systems, we measure how often outages happen, how long they typically last, and what has to keep running during them. That data, not a preference for solar or skepticism about generators, is what actually determines the right answer for a given property.',
        ],
      },
    ],
    relatedServiceSlugs: [
      'generator-installation-maintenance',
      'solar-inverter-systems',
      'energy-audits',
    ],
  },
  {
    slug: 'cctv-camera-placement-and-cabling-basics',
    title: 'CCTV System Planning: Camera Placement and Cabling Basics',
    seoTitle: 'CCTV Camera Placement Basics',
    summary:
      'Camera count is the least important decision in a CCTV system. Placement and cabling are what actually determine whether it works.',
    category: 'Security & Automation',
    sections: [
      {
        heading: 'Coverage, not camera count, is the actual goal',
        body: [
          'A property with more cameras than it needs, aimed at the wrong angles, still has blind spots. Camera placement should start from a walk-through of actual entry points, sightlines, and choke points, not a default count based on property size.',
        ],
      },
      {
        heading: 'Power and network cabling decide reliability',
        body: [
          'Most CCTV failures trace back to cabling, not the camera itself: undersized PoE runs, cable routed without protection from weather or physical damage, or network infrastructure that wasn\'t designed to carry continuous video traffic. Getting this right at install avoids most of the "camera stopped working" callouts later.',
        ],
      },
      {
        heading: 'Recording and remote access need to match how you\'ll actually use it',
        body: [
          'A system with weeks of local recording but no remote viewing setup is a very different tool than one built for real-time monitoring from a phone. Deciding how the system will actually be used, reviewing footage after an incident vs. active monitoring, changes the NVR/DVR spec and network configuration needed.',
        ],
      },
      {
        heading: 'Integration multiplies the value of the same cabling work',
        body: [
          'Once structured cabling and power are in place for CCTV, integrating gate access control or intercom systems onto the same infrastructure is a much smaller step than running it as a separate project later. Planning for that integration during the initial cabling design avoids redoing work.',
        ],
      },
    ],
    relatedServiceSlugs: ['cctv-surveillance', 'automated-gates-access-control'],
  },
  {
    slug: 'three-phase-power-basics-for-facility-managers',
    title: 'Three-Phase Power Basics for Facility Managers',
    seoTitle: 'Three-Phase Power Basics',
    summary:
      'A working knowledge of three-phase power helps a facility manager ask the right questions before a fault becomes downtime.',
    category: 'Industrial',
    sections: [
      {
        heading: 'Why industrial sites run three-phase, not single-phase',
        body: [
          'Three-phase power delivers a steadier supply and carries heavier loads more efficiently than single-phase, which is why motors, industrial machinery, and large HVAC equipment are built to run on it. Understanding this is the baseline for understanding why industrial electrical faults behave differently than a household one.',
        ],
      },
      {
        heading: 'Phase imbalance is a common, often invisible, cause of equipment stress',
        body: [
          'When load isn\'t distributed evenly across the three phases, motors and equipment run hotter and wear faster, often without an obvious symptom until something fails. Regular load measurement across all three phases, not just total consumption, is what catches this before it causes damage.',
        ],
      },
      {
        heading: 'Power factor correction affects your actual electricity cost',
        body: [
          'Inductive loads, common in motors and industrial equipment, can pull power inefficiently in a way that shows up as a poor power factor. Correcting it (typically with capacitor banks) reduces wasted capacity and, on tariffs that penalize poor power factor, can directly reduce cost.',
        ],
      },
      {
        heading: 'What documentation a facilities team should actually have',
        body: [
          'Single-line diagrams, load schedules, and motor control center documentation aren\'t paperwork for its own sake, they\'re what lets a facilities team or an electrician diagnose a fault quickly instead of tracing an undocumented system from scratch during a production stoppage.',
        ],
      },
    ],
    relatedServiceSlugs: ['industrial-electrical-systems', 'preventive-maintenance-contracts'],
  },
  {
    slug: 'earthing-and-lightning-protection-what-to-know',
    title: 'Earthing and Lightning Protection: What Every Property Owner Should Know',
    seoTitle: 'Earthing and Lightning Protection',
    summary:
      'Earthing is invisible when it works, which is exactly why it gets overlooked until equipment starts failing.',
    category: 'Compliance',
    sections: [
      {
        heading: 'Earthing protects people first, equipment second',
        body: [
          'A correctly earthed system gives fault current a safe path to ground instead of through a person who touches a faulty appliance or exposed conductive part. This is the primary reason earthing is a safety requirement, not an optional upgrade, on any property.',
        ],
      },
      {
        heading: 'Poor earthing shows up as equipment damage, not obvious faults',
        body: [
          'Recurring, unexplained damage to electronics or appliances, especially after storms, is a common symptom of inadequate earthing or missing surge protection, not always a sign of a bad appliance. This is easy to misdiagnose without testing the earthing system itself.',
        ],
      },
      {
        heading: 'Lightning protection is a separate system, not a byproduct of earthing',
        body: [
          'A building\'s earthing system and a dedicated lightning protection system (air terminals, down conductors, and a proper strike-current path to ground) work together but aren\'t the same thing. Exposed or elevated structures, or buildings with a history of storm-related damage, need the dedicated system specifically assessed, not assumed to be covered by standard earthing.',
        ],
      },
      {
        heading: 'Testing is what turns "installed" into "working"',
        body: [
          'An earth electrode that was correctly installed years ago can still fail an earth loop impedance test today, soil conditions and connections change over time. Periodic testing, not a one-time installation, is what confirms the system still does its job.',
        ],
      },
    ],
    relatedServiceSlugs: ['earthing-lightning-protection', 'panel-repair-upgrades'],
  },
  {
    slug: 'ev-charger-installation-what-your-property-needs',
    title: 'EV Charger Installation: What Your Property Actually Needs First',
    seoTitle: 'EV Charger Installation Requirements',
    summary:
      'An EV charger is a sustained, high-current load. The question that matters before installation is whether your panel already has room for it.',
    category: 'Solar & Energy',
    sections: [
      {
        heading: 'An EV charger is not like plugging in another appliance',
        body: [
          'Most appliances draw power briefly or intermittently. A home EV charger draws a sustained, high-current load for hours at a stretch, often while other major loads (air conditioning, water heating) are also running. Panels sized for a typical household load profile were rarely designed with this in mind.',
          'The first question in any EV charger installation is not which charger to buy, it is whether the existing distribution board has the spare capacity to carry the load safely, and if not, what upgrade closes that gap.',
        ],
      },
      {
        heading: 'A load assessment comes before a charger recommendation',
        body: [
          'A proper installation starts with assessing the property\'s available capacity against its existing loads, the same load-assessment discipline used for any major electrical addition. This determines whether the charger can go on the existing supply, whether the panel needs upgrading first, or whether a dedicated circuit with its own protection is the right approach.',
          'Skipping this step is how installations end up with nuisance tripping, or with a charger that works until another major appliance runs at the same time.',
        ],
      },
      {
        heading: 'The circuit needs to be dedicated and correctly protected',
        body: [
          'A charger installation should run on its own dedicated circuit, sized and protected specifically for the sustained current it draws, not shared with other sockets or circuits. This includes correctly rated cable, breaker, and, where applicable, residual current protection specified for EV charging rather than general-purpose sockets.',
        ],
      },
      {
        heading: 'Solar or generator integration changes the picture further',
        body: [
          'On a property with solar, hybrid inverter, or generator backup already installed, an EV charger adds a large new load to that system\'s own capacity planning. Load management, scheduling charging outside peak demand periods, or coordinating with an existing hybrid system\'s battery cycling, needs to be part of the installation design, not an afterthought once the charger is already live.',
        ],
      },
    ],
    relatedServiceSlugs: ['ev-charging-installation', 'panel-repair-upgrades', 'solar-inverter-systems'],
  },
  {
    slug: 'how-to-size-a-backup-generator',
    title: 'How to Size a Backup Generator: kVA, Running Load, and Fuel Type',
    seoTitle: 'How to Size a Backup Generator',
    summary:
      'A generator sized from total connected wattage alone is usually wrong. Starting current and fuel logistics matter as much as running load.',
    category: 'Solar & Energy',
    sections: [
      {
        heading: 'kVA is not the same measurement as kW',
        body: [
          'Generators are rated in kVA (apparent power), while most appliance labels list kW (real power). The two are only equal at a power factor of 1.0, which motors, compressors, and other inductive loads rarely have. Sizing a generator from a kW total without converting for power factor is a common way installs end up undersized.',
          'A generator sized correctly on paper for running load can still trip or stall in practice if this conversion was skipped, because the true apparent power demand was higher than the kW figure suggested.',
        ],
      },
      {
        heading: 'Starting current, not running current, usually sets the minimum size',
        body: [
          'Motors, compressors, and pumps draw several times their running current for a brief moment at start-up, air conditioners and boreholes are common culprits. A generator sized only for steady-state running load can be overwhelmed the instant one of these loads switches on, even though it would carry the same load comfortably once running.',
          'The correct sizing approach adds up steady running load first, then checks whether the single largest starting surge (not all of them at once, in a well-sequenced system) still fits within the generator\'s surge capacity.',
        ],
      },
      {
        heading: 'Oversizing has a real running cost, not just an upfront one',
        body: [
          'A generator run well below its rated capacity for long periods runs inefficiently and can suffer from wet-stacking (unburned fuel fouling the engine), which shortens its service life. The instinct to "size up for safety" trades one problem (undersizing risk) for another (chronic light-loading) if it isn\'t paired with an actual load calculation.',
          'The right size is the smallest rating that comfortably clears the largest starting surge on top of running load, not the largest generator that fits the budget.',
        ],
      },
      {
        heading: 'Fuel type is a sizing input, not an afterthought',
        body: [
          'Diesel, petrol, and gas generators differ in run-time per fuel volume, refuelling logistics, and noise and emissions profile, which changes how practical a given capacity actually is for continuous or extended-outage use. A correctly sized generator on the wrong fuel type for the site\'s realistic refuelling access still fails the property during a long outage.',
          'This is why generator sizing and selection is done together with the same load assessment used for solar and hybrid systems, not as a separate, simpler calculation - the underlying discipline (measure the real load, then size to it) is the same regardless of which backup technology is chosen.',
        ],
      },
    ],
    relatedServiceSlugs: [
      'generator-installation-maintenance',
      'energy-audits',
      'preventive-maintenance-contracts',
    ],
  },
  {
    slug: 'understanding-cable-sizes-for-residential-electrical',
    title: 'Understanding Cable Sizes for Residential Electrical Installations',
    seoTitle: 'Understanding Residential Cable Sizes',
    summary:
      'The right cable size depends on load, run length, and installation method together - not a single lookup number for "a socket circuit."',
    category: 'Compliance',
    sections: [
      {
        heading: 'Cable size is a function of current, not just circuit type',
        body: [
          'A cable rated for a given current-carrying capacity has to be sized to the actual load it will carry, with a safety margin, not chosen from habit because "that\'s what goes on a socket circuit." Two circuits that look identical on a drawing can need different cable sizes if one feeds a run of general sockets and the other feeds a fixed high-draw appliance like an air conditioner or an electric water heater.',
          'Undersizing shows up as overheating under sustained load, well before it trips a correctly rated breaker - the breaker protects the cable from a fault current, not from a mismatch between cable size and normal operating load.',
        ],
      },
      {
        heading: 'Run length and voltage drop change the calculation',
        body: [
          'The same load run over a longer cable length needs a larger cable to keep voltage drop within an acceptable range, particularly for outbuildings, boreholes, or a garage some distance from the main distribution board. A cable sized correctly for a short run can still cause dimming, sluggish motor starting, or unreliable operation of sensitive electronics if used unchanged over a much longer run.',
          'This is why a cable schedule is a real engineering document, not a generic size list - it accounts for each circuit\'s actual length alongside its load.',
        ],
      },
      {
        heading: 'Installation method affects the derating',
        body: [
          'A cable bundled tightly with several others inside conduit, or buried underground, dissipates heat differently than one run singly in free air, which changes its safe current-carrying capacity for the same cross-sectional area. Sizing a cable schedule from a single generic table without accounting for how each run is actually installed is a common source of undersized circuits that look correct on paper.',
          'Ambient temperature matters too - a roof space or an enclosed panel room that runs hot reduces a cable\'s safe capacity compared to the same cable in a cooler location.',
        ],
      },
      {
        heading: 'Protective device sizing follows the cable, not the other way round',
        body: [
          'Once a cable is correctly sized for its load, run length, and installation method, the circuit breaker or fuse protecting it is selected to protect that specific cable from overload and fault current - an oversized breaker on an undersized cable defeats the protection it is meant to provide. This is one of the most common defects we find on inspection of existing installations: a cable that was adequate for its original load, with a breaker later upsized to stop nuisance tripping instead of correcting the underlying load mismatch.',
        ],
      },
    ],
    relatedServiceSlugs: ['electrical-wiring-installation', 'panel-repair-upgrades', 'fault-finding-diagnostics'],
  },
  {
    slug: 'common-solar-installation-mistakes-nigeria',
    title: 'Common Solar Installation Mistakes We See in Nigeria',
    seoTitle: 'Common Solar Installation Mistakes',
    summary:
      "Most underperforming solar systems weren't built with bad equipment - they were built without an engineering process behind it.",
    category: 'Solar & Energy',
    sections: [
      {
        heading: 'Sizing from a sales conversation instead of a load assessment',
        body: [
          "A system specified from a rough description of what a client wants to power, without measuring actual load and usage pattern, tends to land in one of two failure modes: undersized and unable to carry the intended backup load, or oversized in a way that wastes money on capacity that's rarely used. Both are avoidable with a proper site assessment before any equipment is specified.",
        ],
      },
      {
        heading: 'Ignoring shading and roof orientation at design stage',
        body: [
          'Partial shading on even a small portion of a panel string - from a water tank, a neighbouring structure, or a tree that grows over time - can drag down the output of an entire string, not just the shaded panels, depending on how the array is wired. A design that accounts for the site\'s actual shading pattern across the day, not just its condition at the moment of a single site visit, avoids this.',
          'Roof orientation and pitch affect realistic daily output too; a design that ignores this and applies a generic sun-hours assumption regardless of the specific roof tends to overpromise on performance.',
        ],
      },
      {
        heading: 'Under-specifying cabling and combiner protection for a DC array',
        body: [
          'Solar DC wiring runs at different voltage and fault characteristics than the household AC wiring most general electrical work deals with, and needs cable sizing, combiner boxes, and DC-rated protective devices selected accordingly - not AC-rated components repurposed for a DC circuit. This is a common corner cut on installs that were priced to compete purely on panel count and battery capacity, since it\'s not visible without inspecting behind the panels.',
        ],
      },
      {
        heading: 'No commissioning or monitoring at handover',
        body: [
          'A system that powers on the day of installation isn\'t verified to actually deliver its designed backup duration or recharge on schedule unless it\'s tested against that design at commissioning. Without monitoring in place from day one, a slowly degrading string, an underperforming inverter, or a battery not reaching full charge can go unnoticed for months - the first sign is often a backup that runs out sooner than expected during an extended outage, by which point the underlying fault has usually gotten worse.',
        ],
      },
    ],
    relatedServiceSlugs: ['solar-inverter-systems', 'energy-audits', 'preventive-maintenance-contracts'],
  },
  {
    slug: 'why-does-my-breaker-keep-tripping',
    title: 'Why Does Your Circuit Breaker Keep Tripping?',
    seoTitle: 'Why Does a Breaker Keep Tripping?',
    summary:
      'A breaker tripping is doing its job - the question is why it keeps having to. Here are the causes we actually find, from most to least common.',
    category: 'Maintenance',
    sections: [
      {
        heading: 'Overloaded circuit - too much running on one line',
        body: [
          'The most common cause by far: the combined load on a circuit exceeds what its breaker is rated to carry, so it trips as designed rather than letting the wiring overheat. This shows up most on circuits feeding several high-draw appliances at once - kitchens, workshops, or a room with an air conditioner and other loads sharing the same line.',
          'The fix usually isn\'t a bigger breaker. A breaker sized above the circuit\'s actual wiring rating just removes the protection - the fix is redistributing load across circuits, or running a dedicated circuit for the heaviest appliance.',
        ],
      },
      {
        heading: 'Short circuit - a hot wire touching a neutral or ground',
        body: [
          'A short circuit trips a breaker immediately and often repeatedly, sometimes the instant a specific appliance is plugged in or switched on. This points to damaged insulation somewhere in that circuit\'s wiring, a faulty appliance internally shorting, or a loose connection inside a socket or junction box.',
          'This isn\'t a load-balancing problem, and it isn\'t safe to keep resetting the breaker and hoping it stops - a short circuit is a fire risk that needs fault-finding, not a workaround.',
        ],
      },
      {
        heading: 'Ground fault - current leaking to earth',
        body: [
          'On circuits protected by a ground fault or earth leakage device, tripping usually means current is finding an unintended path to earth - commonly through moisture in an outdoor socket, a damaged appliance cord, or a fault inside an appliance itself. This is exactly the condition these devices exist to catch, since it\'s also a shock hazard.',
          'Isolating which single appliance or socket is causing it (by unplugging everything on that circuit and reintroducing one at a time) narrows this down quickly - but the fault itself still needs fixing or the item replacing, not just identifying.',
        ],
      },
      {
        heading: 'A worn or ageing breaker itself',
        body: [
          'Breakers don\'t last forever. One that trips at well below its rated load, or that fails to reset cleanly, may simply have worn internal contacts after years of service - this becomes more common on an older panel that hasn\'t had any breakers replaced since original installation.',
          'This is the one cause on this list that isn\'t about your wiring or appliances at all, and it\'s only distinguishable from the others with an actual panel inspection.',
        ],
      },
    ],
    relatedServiceSlugs: ['panel-repair-upgrades', 'fault-finding-diagnostics', 'emergency-electrical-response'],
  },
  {
    slug: 'how-often-you-need-an-electrical-safety-inspection',
    title: 'How Often You Actually Need an Electrical Safety Inspection',
    seoTitle: 'Electrical Inspection Frequency',
    summary:
      'Waiting for something to visibly fail means the inspection happens after the risk, not before it. Here is how to think about timing instead.',
    category: 'Maintenance',
    sections: [
      {
        heading: 'Inspection frequency depends on property type and age, not a fixed number',
        body: [
          'A newly wired residential property, a commercial space with heavy daily equipment use, and an ageing industrial panel don\'t carry the same risk profile, so they don\'t belong on the same inspection interval. Higher load, higher occupancy, and older infrastructure all shift toward more frequent checks - a single blanket recommendation for every property type isn\'t a useful answer.',
          'What matters more than hitting an exact interval is having a scheduled inspection at all, rather than relying on visible failure as the trigger.',
        ],
      },
      {
        heading: 'Specific events should trigger an inspection regardless of schedule',
        body: [
          'A change of property ownership or tenancy, a major renovation that added load without a corresponding review of the panel and circuits, any recent flooding or fire near electrical infrastructure, or the property changing to a higher-demand use than it was originally wired for - each of these is a reason to inspect immediately, independent of when the last scheduled check happened.',
          'Recurring symptoms are the other trigger: breakers tripping repeatedly, warm switches or sockets, flickering lights, or a burning smell near the panel are signs worth an inspection now, not at the next scheduled interval.',
        ],
      },
      {
        heading: 'What a real inspection actually covers',
        body: [
          'A proper inspection goes beyond a visual look at the panel: it includes testing earthing and bonding, checking insulation resistance on circuits, verifying breaker and RCD/earth-leakage function actually trips at the right threshold, and checking for loose connections and thermal hotspots that a visual check alone misses.',
          'A written report with findings and recommended actions, not just a verbal "looks fine," is what makes an inspection useful as a record - both for your own planning and, for commercial and industrial sites, as documentation for compliance purposes.',
        ],
      },
      {
        heading: 'A maintenance contract removes the guesswork on timing',
        body: [
          'For a commercial or industrial site in particular, a scheduled maintenance arrangement handles this timing question by design rather than leaving it to memory - inspections happen on a set schedule appropriate to that property\'s risk profile, with findings tracked over time so a developing issue shows up as a trend, not a surprise.',
        ],
      },
    ],
    relatedServiceSlugs: ['preventive-maintenance-contracts', 'fault-finding-diagnostics', 'earthing-lightning-protection'],
  },
]

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((article) => article.slug === slug)
}
