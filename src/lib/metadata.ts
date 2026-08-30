import type { Metadata } from 'next'
import { company } from '@/content/company'

/**
 * Next.js does not deep-merge openGraph/twitter from the root layout with a
 * page's plain title/description — a page that only sets `title` and
 * `description` silently inherits the ROOT layout's openGraph/twitter
 * values (the homepage's), so every shared link showed the homepage's
 * title/description regardless of which page was actually shared. This
 * helper keeps title/description/openGraph/twitter in sync by construction.
 */
export function pageMetadata(params: {
  title: string
  description: string
  path: string
  noIndex?: boolean
  // Page-specific share image (one of the hero photos under
  // public/images/photos/, e.g. '/images/photos/solar-hero-panel-install.jpg').
  // Falls back to the site default so every page still gets a valid
  // og:image/twitter:image even before a hero photo exists for it.
  image?: string
}): Metadata {
  const { title, description, path, noIndex, image = '/og-image.jpg' } = params
  const fullTitle = `${title} - ${company.name}`
  // No hardcoded width/height: the hero photos passed in here vary in
  // aspect ratio, and crawlers read a fetched image's actual dimensions
  // anyway, so a hardcoded value would just be misleading if wrong.
  const images = [{ url: image, alt: fullTitle }]

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: fullTitle,
      description,
      url: `${company.domain}${path}`,
      images,
    },
    twitter: {
      title: fullTitle,
      description,
      images,
    },
    ...(noIndex ? { robots: { index: false, follow: true } } : {}),
  }
}
