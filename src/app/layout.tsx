import type { Metadata } from 'next'
import { Space_Grotesk, Inter } from 'next/font/google'
import { SpeedInsights } from '@vercel/speed-insights/next'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { MobileCallBar } from '@/components/layout/MobileCallBar'
import { KellAssist } from '@/components/chatbot/KellAssist'
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
        <KellAssist />
        <SpeedInsights />
      </body>
    </html>
  )
}
