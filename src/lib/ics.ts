export type IcsEventInput = {
  title: string
  description: string
  location: string
  startsAt: Date
  durationMinutes: number
  reference: string
}

function formatIcsDate(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
}

export function buildIcsFile(input: IcsEventInput): string {
  const end = new Date(input.startsAt.getTime() + input.durationMinutes * 60000)
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Kell Electricals//Assessment Platform//EN',
    'BEGIN:VEVENT',
    `UID:${input.reference}@kellelectricals.com`,
    `DTSTAMP:${formatIcsDate(new Date())}`,
    `DTSTART:${formatIcsDate(input.startsAt)}`,
    `DTEND:${formatIcsDate(end)}`,
    `SUMMARY:${input.title}`,
    `DESCRIPTION:${input.description.replace(/\n/g, '\\n')}`,
    `LOCATION:${input.location}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
}
