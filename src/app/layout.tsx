import type { Metadata } from 'next'
import { Space_Grotesk, Inter } from 'next/font/google'
import { SpeedInsights } from '@vercel/speed-insights/next'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { MobileCallBar } from '@/components/layout/MobileCallBar'
import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics'
import { KellAssist } from '@/components/chatbot/KellAssist'
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

export const metadata: Metadata = {
  metadataBase: new URL(company.domain),
  title: {
    default: `${company.name} - ${company.tagline}`,
    template: `%s - ${company.name}`,
  },
  description: company.positioning,
  // Real, accurate phrases matching services and locations actually
  // covered by the site (see src/content/services.ts and areas.ts) -
  // Google largely ignores this tag today, but it costs nothing and
  // documents the phrases this site's on-page titles/descriptions
  // deliberately target (see the seoTitle fields in services.ts).
  keywords: [
    'electrician in Abuja',
    'electrical contractor Abuja',
    'emergency electrician Abuja',
    'solar company in Abuja',
    'solar inverter installation Abuja',
    'generator installation Abuja',
    'CCTV installation Abuja',
    'home automation Abuja',
    'panel repair Abuja',
    'industrial electrician Abuja',
    'commercial electrician Abuja',
    'NEMSA certified electrician',
    'COREN certified electrical engineer',
    'industrial electrical Nigeria',
  ],
  authors: [{ name: company.name }],
  openGraph: {
    type: 'website',
    locale: 'en_NG',
    url: company.domain,
    siteName: company.name,
    title: `${company.name} - ${company.tagline}`,
    description: company.positioning,
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: company.name }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${company.name} - ${company.tagline}`,
    description: company.positioning,
    images: ['/og-image.jpg'],
  },
  // Explicitly listing `icon` here (not just `apple`) is required: Next.js
  // auto-detects app/icon.png for the favicon <link>, but that detection
  // is skipped entirely once `metadata.icons` is set at all — without this,
  // apple-touch-icon rendered but the actual browser-tab favicon did not.
  icons: {
    icon: '/icon.png',
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
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <body className="pb-16 lg:pb-0">
        <GoogleAnalytics />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema()) }}
        />
        <Header />
        <main>{children}</main>
        <Footer />
        <MobileCallBar />
        {/* Custom AI-powered Kell Assist widget, restored per client
            direction - see src/components/chatbot/KellAssist.tsx and
            src/app/api/chat/route.ts. Its guided quick-reply flows
            (service routing, emergency safety message, solar question
            flow, lead capture via /api/quote) all work with zero
            configuration; free-text conversation additionally needs
            ANTHROPIC_API_KEY set (see that route's own comments).
            Previously replaced by Botpress/Zoho SalesIQ after an
            Anthropic Console billing lapse took it down - confirm
            billing is in good standing before relying on this in
            production again. Botpress's Script tags and the Zoho
            SalesIQ component (src/components/chat/ZohoSalesIQ.tsx,
            docs/zoho-salesiq-zobot.md) are left in the repo, not
            deleted, in case either is wanted again later. */}
        <KellAssist />
        <SpeedInsights />
      </body>
    </html>
  )
}
