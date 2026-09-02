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
  { label: 'Industries', href: '/industries' },
  { label: 'Projects', href: '/projects' },
  { label: 'Resources', href: '/resources' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Testimonials', href: '/testimonials' },
  { label: 'Careers', href: '/careers' },
  { label: 'Contact', href: '/contact' },
]

export const footerNav: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Solar & Energy Systems', href: '/solar-energy-systems' },
  { label: '24/7 Emergency Electrical', href: '/emergency-electrical-services' },
  { label: 'Home Automation', href: '/home-automation' },
  { label: 'CCTV & Security Systems', href: '/cctv-security-systems' },
  { label: 'Certifications & Compliance', href: '/certifications-compliance' },
  { label: 'Industries', href: '/industries' },
  { label: 'Projects', href: '/projects' },
  { label: 'Load & Solar Calculators', href: '/calculators' },
  { label: 'Resources', href: '/resources' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Testimonials', href: '/testimonials' },
  { label: 'Careers', href: '/careers' },
  { label: 'Contact', href: '/contact' },
]

export const legalNav: NavLink[] = [
  { label: 'Terms & Conditions', href: '/legal/terms' },
  { label: 'Privacy Policy', href: '/legal/privacy' },
  { label: 'Sitemap', href: '/site-map' },
]
