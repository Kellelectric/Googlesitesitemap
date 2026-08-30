// Real team roster, supplied via the client's site audit report (June
// 2026) correcting the previous live site's team section (which had
// Thelma's title wrong). Names, titles, and bios below are real —
// sourced from the client, not invented. Do not add additional team
// members without a similar real source.
export type TeamMember = {
  name: string
  title: string
  bio: string
}

export const team: TeamMember[] = [
  {
    name: 'Thelma Dogwoh',
    title: 'Managing Director',
    bio: 'Thelma leads the day-to-day operations of Kell Electricals, overseeing project delivery, client relations, financial management, and business development. She is the primary contact for client-facing correspondence and ensures every project is completed on time, within budget, and to the client’s satisfaction.',
  },
  {
    name: 'Gabriel Ioryem',
    title: 'Lead Electrical Engineer',
    bio: 'Gabriel is a COREN-registered Lead Electrical Engineer with over 15 years of hands-on experience in residential, commercial, and industrial electrical systems. He heads Kell Electricals’ technical operations, from initial design and load analysis through installation supervision and sign-off, and has personally led some of Abuja’s largest housing estate, commercial office, and industrial control panel projects.',
  },
]
