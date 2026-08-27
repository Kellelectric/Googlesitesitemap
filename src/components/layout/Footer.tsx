import Link from 'next/link'
import Image from 'next/image'
import { company } from '@/content/company'
import { services } from '@/content/services'
import { footerNav, legalNav } from '@/content/nav'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-paper/10 bg-petrol-700 text-paper">
      <div className="container-content grid grid-cols-1 gap-12 py-16 md:grid-cols-4">
        <div>
          <Image
            src="/brand/logo-on-dark.png"
            alt={company.name}
            width={220}
            height={102}
            className="h-9 w-auto"
          />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-paper/60">
            {company.positioning}
          </p>
          <div className="mt-6 flex gap-2 text-xs text-paper/60">
            <span>{company.certifications.map((c) => c.name).join(' · ')} certified</span>
          </div>
        </div>

        <div>
          <span className="eyebrow text-paper/60">Site</span>
          <ul className="mt-4 space-y-3">
            {footerNav.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="link-underline inline-flex -my-2 items-center py-2 text-sm text-paper/80"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <span className="eyebrow text-paper/60">Services</span>
          <ul className="mt-4 space-y-3">
            {services.slice(0, 6).map((service) => (
              <li key={service.slug}>
                <Link
                  href={`/services/${service.slug}`}
                  className="link-underline text-sm text-paper/80"
                >
                  {service.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <span className="eyebrow text-paper/60">Contact</span>
          <address className="mt-4 space-y-3 text-sm not-italic text-paper/80">
            <p>{company.address.full}</p>
            <p>
              <a
                href={company.phoneHref}
                className="link-underline inline-flex -my-2 items-center py-2"
              >
                {company.phone}
              </a>
            </p>
            <p>
              <a
                href={`mailto:${company.email}`}
                className="link-underline inline-flex -my-2 items-center py-2"
              >
                {company.email}
              </a>
            </p>
          </address>
        </div>
      </div>

      <div className="border-t border-paper/10">
        <div className="container-content flex flex-col gap-2 py-6 text-xs text-paper/60 md:flex-row md:items-center md:justify-between">
          <p>
            &copy; {year} {company.legalName}. RC {company.rcNumber}.
          </p>
          <div className="flex flex-wrap gap-6">
            <span>{company.address.city}, {company.address.country}</span>
            <span>
              {company.trust.googleRating}★ · {company.trust.googleReviewCount} Google reviews
            </span>
            {legalNav.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="link-underline inline-flex -my-2 items-center py-2"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
