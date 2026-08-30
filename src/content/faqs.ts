import { company } from '@/content/company'

export type FAQ = {
  question: string
  answer: string
}

export type FAQCategory = {
  category: string
  items: FAQ[]
}

export const servicesFAQs: FAQ[] = [
  {
    question: 'What services does Kell Electricals provide?',
    answer:
      'We offer a comprehensive range of electrical services, including electrical contracting, panel building, industrial automation, energy audits, maintenance, and project consultation for various industries.',
  },
  {
    question: 'Where is Kell Electricals located?',
    answer:
      '741 Alexandria Crescent, Wuse 2, Abuja, Nigeria. We serve clients across regional and national boundaries depending on project scale and requirements.',
  },
  {
    question: 'How can I contact Kell Electricals?',
    answer:
      'Use the contact form on this site, email info@kellelectricals.com, or call +234 814 020 5895.',
  },
  {
    question: 'Do you take on commercial or residential projects?',
    answer:
      'Yes, both commercial and selective residential projects, based on scope.',
  },
]

export const faqCategories: FAQCategory[] = [
  {
    category: 'General',
    items: [
      {
        question: 'What areas do you serve?',
        answer: `We're based in ${company.address.district}, ${company.address.city}, and serve ${company.serviceAreas.slice(0, -1).join(', ')}, and ${company.serviceAreas[company.serviceAreas.length - 1]} directly, with project work extending across ${company.serviceRegion.replace('Abuja and ', '')} depending on scope.`,
      },
      {
        question: 'Are you licensed and certified?',
        answer: `Yes. ${company.legalName} (RC ${company.rcNumber}) is certified by ${company.certifications.map((c) => `${c.name} (${c.fullName})`).join(' and ')}.`,
      },
      {
        question: 'What are your business hours?',
        answer: `${company.businessHours.map((b) => `${b.days}: ${b.hours}`).join('. ')}. For genuine electrical emergencies outside these hours, call ${company.phone} directly.`,
      },
      {
        question: 'How do I get a quote?',
        answer: `Submit the form on our Contact page, call ${company.phone}, or message us on WhatsApp. We respond with a scoped assessment rather than a rough estimate over the phone.`,
      },
    ],
  },
  {
    category: 'Services & scheduling',
    items: [
      {
        question: 'What services does Kell Electricals provide?',
        answer:
          'A full range of electrical engineering services: wiring and installation, panel repair and upgrades, solar and hybrid inverter systems, home automation, CCTV and security, generator installation and maintenance, industrial electrical systems, and scheduled preventive maintenance. The full list is on our Services page.',
      },
      {
        question: 'Do you offer ongoing maintenance, or only one-off jobs?',
        answer:
          'Both. We handle one-off installation and repair work, and also offer scheduled preventive maintenance contracts (panel inspection, thermal imaging, generator and solar system checks) for clients who want faults caught before they become outages.',
      },
      {
        question: 'Do you work on both residential and commercial projects?',
        answer:
          'Yes, and industrial too. Scope, documentation, and compliance requirements differ by property type, which is why we treat residential, commercial, and industrial work as distinct engineering problems rather than the same job at different sizes.',
      },
      {
        question: 'Can you work alongside my architect or contractor on a fit-out?',
        answer:
          'Yes. Commercial and office fit-out electrical work is a regular part of our scope, coordinated with architects, M&E consultants, and the wider construction timeline rather than run as an isolated trade.',
      },
    ],
  },
  {
    category: 'Emergency & safety',
    items: [
      {
        question: 'How fast do you respond to emergencies?',
        answer: `We aim to respond to emergency call-outs ${company.emergencyResponseTarget}. Call ${company.phone} directly for active hazards (sparking, burning smell, exposed live wiring) rather than submitting the contact form.`,
      },
      {
        question: 'What counts as an electrical emergency?',
        answer:
          'Active hazards: sparking, a burning smell, exposed live wiring, or total power loss affecting safety-critical equipment. Recurring tripped breakers or a warm panel cover are worth calling about too, even if not urgent the same hour.',
      },
      {
        question: 'Is there an emergency contact outside business hours?',
        answer: `Yes. Call ${company.phone} or email ${company.emergencyEmail} for urgent issues outside our normal business hours.`,
      },
    ],
  },
  {
    category: 'Home Automation',
    items: [
      {
        question: 'Can automation be added to an existing property, or only new builds?',
        answer:
          'Both. New builds let us design the wiring and control layout together from the start, which is cleaner, but retrofitting smart lighting, climate, and access control into an existing property is a regular part of our scope too — it just needs a site assessment first to plan around the existing circuits.',
      },
      {
        question: 'Will a power outage disable the automation system?',
        answer:
          'Depends on the setup. Most smart lighting and control panels need power to function, same as any electrical system, so we discuss backup priorities (generator or inverter integration) as part of the design if outage resilience matters to you.',
      },
      {
        question: 'Do you work with a specific smart home platform?',
        answer:
          "We design the electrical and control-panel infrastructure to work with your chosen app/platform rather than locking you into one — tell us what you're trying to control (lighting, climate, access, scenes) and we scope the electrical side accordingly.",
      },
    ],
  },
  {
    category: 'CCTV & Security',
    items: [
      {
        question: 'How many cameras do I need?',
        answer:
          "Depends on the property and what you're trying to cover (entry points, perimeter, specific assets). We do a site survey and propose camera placement for actual coverage needs rather than a fixed package.",
      },
      {
        question: 'Can I view footage remotely?',
        answer:
          'Yes — remote viewing and alert setup on your phone or computer is part of a standard installation, alongside the NVR/DVR recording setup on site.',
      },
      {
        question: 'Can CCTV be integrated with gates or access control?',
        answer:
          'Yes, integration with automated gates and access control is a regular part of our security and automation scope — worth mentioning upfront if you want them working together rather than as separate systems.',
      },
    ],
  },
]
