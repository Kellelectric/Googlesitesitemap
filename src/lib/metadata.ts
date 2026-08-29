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
}): Metadata {
  const { title, description, path, noIndex } = params
  const fullTitle = `${title} - ${company.name}`

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: fullTitle,
      description,
      url: `${company.domain}${path}`,
    },
    twitter: {
      title: fullTitle,
      description,
    },
    ...(noIndex ? { robots: { index: false, follow: true } } : {}),
  }
}
