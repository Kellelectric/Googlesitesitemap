'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { primaryNav } from '@/content/nav'
import { company } from '@/content/company'
import { Button } from '@/components/ui/Button'
import { trackEvent } from '@/lib/analytics'

export function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-paper/10 bg-petrol">
      {/* Row 1 (lg+): logo, phone, primary CTA. Below lg — phones, tablets,
          and narrow laptop windows — this collapses to logo + hamburger,
          since the full nav plus phone plus CTA no longer fits one row
          once there are this many primary links; a squeezed single row
          was pushing the CTA off to the side rather than staying usable. */}
      <div className="container-content flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center" aria-label={`${company.name} home`}>
          <Image
            src="/brand/logo-on-dark.png"
            alt={company.name}
            width={220}
            height={102}
            priority
            className="h-9 w-auto md:h-10"
          />
        </Link>

        <div className="hidden items-center gap-4 lg:flex">
          <a
            href={company.phoneHref}
            onClick={() => trackEvent('contact', { channel: 'phone' })}
            className="eyebrow inline-flex items-center px-1 py-2 text-paper/80 outline-offset-2 hover:text-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow"
          >
            {company.phone}
          </a>
          <Button href="/contact" variant="primary" className="!py-2.5">
            Request a Quote
          </Button>
        </div>

        <button
          type="button"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="mobile-nav"
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow lg:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          <span
            className={`h-[2px] w-6 bg-paper transition-transform duration-200 ${open ? 'translate-y-2 rotate-45' : ''}`}
          />
          <span
            className={`h-[2px] w-6 bg-paper transition-opacity duration-200 ${open ? 'opacity-0' : ''}`}
          />
          <span
            className={`h-[2px] w-6 bg-paper transition-transform duration-200 ${open ? '-translate-y-2 -rotate-45' : ''}`}
          />
        </button>
      </div>

      {/* Row 2 (lg+ only): full-width nav on its own line below the logo
          row, instead of squeezed to one side of it. */}
      <nav className="hidden border-t border-paper/10 lg:block">
        <div className="container-content flex h-14 items-center justify-center gap-4 xl:gap-8">
          {primaryNav.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="link-underline eyebrow inline-flex items-center px-1 py-2 text-paper/80 hover:text-paper"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>

      {open && (
        <div id="mobile-nav" className="border-t border-paper/10 bg-petrol lg:hidden">
          <nav className="container-content flex flex-col gap-1 py-4">
            {primaryNav.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="eyebrow flex items-center py-3 text-paper/80 outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow"
              >
                {link.label}
              </Link>
            ))}
            <a
              href={company.phoneHref}
              onClick={() => trackEvent('contact', { channel: 'phone' })}
              className="eyebrow flex items-center py-3 text-paper/80 outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow"
            >
              {company.phone}
            </a>
            <Button href="/contact" variant="primary" className="mt-2 w-fit">
              Request a Quote
            </Button>
          </nav>
        </div>
      )}
    </header>
  )
}
