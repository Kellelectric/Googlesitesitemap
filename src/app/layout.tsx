import type { Metadata } from 'next'
import Script from 'next/script'
import { Space_Grotesk, Inter } from 'next/font/google'
import { SpeedInsights } from '@vercel/speed-insights/next'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { MobileCallBar } from '@/components/layout/MobileCallBar'
import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics'
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
        {/* Back on Botpress for now - Zoho SalesIQ needs a paid subscription
            the client hasn't taken out yet. The Zobot conversation design
            and Deluge script (docs/zoho-salesiq-zobot.md) and the
            ZohoSalesIQ component (src/components/chat/ZohoSalesIQ.tsx) are
            still in the repo, ready to swap back in once that subscription
            exists - don't delete either.
            strategy="lazyOnload" defers fetching and running this ~large
            third-party widget bundle until the browser is idle after the
            rest of the page has loaded - it was the single biggest driver
            of a 55/100 mobile PageSpeed Performance score despite 96-100 on
            every other category, since a chat widget isn't needed for the
            initial render or first interaction. */}
        <Script src="https://cdn.botpress.cloud/webchat/v5.0/inject.js" strategy="lazyOnload" />
        <Script
          src="https://files.bpcontent.cloud/2026/09/02/15/20260902152603-5BYI2T6Q.js"
          strategy="lazyOnload"
        />
        <SpeedInsights />
      </body>
    </html>
  )
}
