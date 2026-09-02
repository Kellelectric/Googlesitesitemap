export type FaqItem = {
  question: string
  answer: string
}

export const homeFaq: FaqItem[] = [
  {
    question: 'What areas of Abuja do you cover?',
    answer:
      'Wuse 2, Gwarinpa, Central Business District, Guzape, Asokoro, Maitama, and Katampe as standing service zones, with wider Nigeria coverage for larger commercial and industrial contracts.',
  },
  {
    question: 'How fast is the 24/7 emergency response?',
    answer:
      'The emergency line is for genuine electrical hazards and critical outages — sparking, burning smell, exposed live wiring, or total power loss affecting a business. Call directly rather than submitting the contact form; a technician is dispatched the same day, any hour.',
  },
  {
    question: 'Do you size solar systems, or just install panels?',
    answer:
      'We run a full load and consumption audit before specifying a single panel — sizing arrays, battery banks, and hybrid inverters to your actual usage and backup priorities, then commission and test the system on handover.',
  },
  {
    question: 'What does COREN / NEMSA certification actually mean for my job?',
    answer:
      'COREN (Council for the Regulation of Engineering in Nigeria) and NEMSA (Nigerian Electricity Management Services Agency) certification means our team and our work meet the national standard for engineering practice and electrical safety compliance — the same standard a procurement officer or insurer will check for on a commercial job.',
  },
  {
    question: 'Do you offer maintenance contracts, or one-off callouts only?',
    answer:
      'Both. Preventive maintenance contracts cover scheduled panel inspection, thermal imaging, and generator/solar checks with a documented report after every visit — plus priority response for contract holders. One-off callouts and fault-finding are available without a contract.',
  },
  {
    question: 'How is a quote priced — flat fee or after site assessment?',
    answer:
      'Every quote follows the same process: assess, then design and price against the actual load and site conditions. We don’t price sight-unseen — submit the form and our team scopes the job before quoting.',
  },
]
