export type NavLink = {
  label: string
  href: string
}

// Intentionally limited to pages that exist in this build — see
// docs/sitemap-and-content-model.md "Build status" before adding links.
export const primaryNav: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Solar', href: '/solar-energy-systems' },
  { label: 'Contact', href: '/contact' },
]

export const footerNav: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Solar & Energy Systems', href: '/solar-energy-systems' },
  { label: 'Contact', href: '/contact' },
]
