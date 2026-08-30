// Real team roster. Thelma's and Gabriel's names/titles/bios were first
// supplied via the client's June 2026 site audit report (correcting the
// previous live site's team section). Gabriel's title was corrected again
// directly by the client afterward: Founder & CEO, not Lead Electrical
// Engineer — his bio below reflects that update while keeping the
// COREN/experience facts, which the client has not retracted. Justina,
// Folashade, Anthony, and Sunday (names, titles, and photos) were supplied
// directly by the client; no bio detail beyond title was given for them,
// so their bios stay a plain restatement of the role — do not invent
// specifics (years of experience, certifications, past projects) for
// these four. Photos live in public/images/team/. Do not add additional
// team members without a similarly real source.
export type TeamMember = {
  name: string
  title: string
  bio: string
  photo?: string
}

export const team: TeamMember[] = [
  {
    name: 'Gabriel Ioryem',
    title: 'Founder & CEO',
    bio: 'Gabriel founded Kell Electricals and leads the company today as CEO. A COREN-registered electrical engineer with over 15 years of hands-on experience in residential, commercial, and industrial electrical systems, he has personally led some of Abuja’s largest housing estate, commercial office, and industrial control panel projects.',
    photo: '/images/team/gabriel-ioryem.jpg',
  },
  {
    name: 'Thelma Dogwoh',
    title: 'Managing Director',
    bio: 'Thelma leads the day-to-day operations of Kell Electricals, overseeing project delivery, client relations, financial management, and business development. She is the primary contact for client-facing correspondence and ensures every project is completed on time, within budget, and to the client’s satisfaction.',
  },
  {
    name: 'Justina',
    title: 'Procurement & Inventory Manager',
    bio: 'Justina manages procurement and inventory for Kell Electricals, making sure every job has the right materials and equipment on hand when it’s needed.',
    photo: '/images/team/justina.jpg',
  },
  {
    name: 'Folashade',
    title: 'Customer Relations Manager',
    bio: 'Folashade manages customer relations at Kell Electricals, the first point of contact for enquiries and ongoing client communication.',
    photo: '/images/team/folashade.jpg',
  },
  {
    name: 'Anthony',
    title: 'Interior Design & Finishing Expert',
    bio: 'Anthony leads interior design and finishing work at Kell Electricals, making sure installations are completed to a clean, professional standard.',
    photo: '/images/team/anthony.jpg',
  },
  {
    name: 'Sunday',
    title: 'Head of HVAC Systems',
    bio: 'Sunday heads HVAC systems at Kell Electricals, overseeing heating, ventilation, and air conditioning work across residential and commercial projects.',
    photo: '/images/team/sunday.jpg',
  },
]
