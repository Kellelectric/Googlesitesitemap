// Real capability, confirmed directly by the client: Kell Electricals
// manages client invoices, quotes, and project records through its
// existing Zoho Books client portal — this is not a custom portal built
// into the website, and the website must not duplicate it. No portal
// login URL was supplied, so CLIENT_PORTAL_URL stays undefined rather
// than inventing one; the CTA falls back to "contact us to get set up"
// until a real URL is configured (see src/content/company.ts).
export const clientPortal = {
  eyebrow: 'Work with us from anywhere',
  heading: 'Electronic invoicing and project records via Zoho Books',
  body: "Existing clients can review and approve invoices and quotes online, and follow a project's progress from anywhere in the world, through our Zoho Books client portal — instead of chasing paperwork.",
  features: [
    'Electronic invoices and quotes, reviewed and approved online',
    'Project progress and records, visible wherever you are',
    'One transparent record of every decision and approval',
    'Useful for clients managing a project remotely, including from outside Nigeria',
  ],
}
