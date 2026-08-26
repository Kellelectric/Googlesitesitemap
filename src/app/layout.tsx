import type { Metadata } from 'next'
import { Space_Grotesk, Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { company } from '@/content/company'
import { organizationSchema } from '@/lib/schema'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  weight: ['500', '600', '700'],
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['400', '500', '600'],
  display: 'swap',
})

// Instrument/data readouts only — voltage, coordinates, HUD eyebrows.
// Never headlines or body copy (see PRODUCT.md Brand Commitments).
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  weight: ['400', '500'],
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(company.domain),
  title: {
    default: `${company.name} — ${company.tagline}`,
    template: `%s — ${company.name}`,
  },
  description: company.positioning,
  keywords: [
    'electrical contractor Abuja',
    'solar inverter installation Abuja',
    'NEMSA certified electrician',
    'COREN certified electrical engineer',
    'CCTV installation Abuja',
    'industrial electrical Nigeria',
  ],
  authors: [{ name: company.name }],
  openGraph: {
    type: 'website',
    locale: 'en_NG',
    url: company.domain,
    siteName: company.name,
    title: `${company.name} — ${company.tagline}`,
    description: company.positioning,
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: company.name }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${company.name} — ${company.tagline}`,
    description: company.positioning,
    images: ['/og-image.jpg'],
  },
  icons: {
    apple: '/apple-touch-icon.png',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <body>
        <div
          hidden
          aria-hidden="true"
          dangerouslySetInnerHTML={{
            __html: `<!--
THESIS: The site is a single-line electrical diagram made dimensional — visitors trace current from grid intake to their own building, and the load node is the quote CTA, not a generic hero-then-cards page.
OWN-WORLD: Petrol/Energy Yellow/Burnt Orange/Copper on Paper+Ink; Space Grotesk display, Inter body, JetBrains Mono for instrument readouts only; every 3D object is real electrical hardware (panel, busbar, breaker), no decorative geometry.
STORY: A facilities manager or homeowner sees engineering method (assess/design/install/test), not marketing claims, and self-identifies a service type before the ask.
FIRST VIEWPORT: Live single-line diagram sweeps in behind left-aligned headline/CTA; credential proof sits below the CTA as a data strip, not a kicker above the headline.
FORM: User-committed direction (The Live Circuit) — pre-approved via two prior artifacts (creative direction + Circuit Map UX spec); no concept-seed round run per new-work.md's "precisely specified request" exception.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.
-->`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema()) }}
        />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
