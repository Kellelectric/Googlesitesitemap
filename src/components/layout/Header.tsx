'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { primaryNav } from '@/content/nav'
import { company } from '@/content/company'
import { Button } from '@/components/ui/Button'

export function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-paper/10 bg-petrol">
      <div className="container-content flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center" aria-label={`${company.name} — home`}>
          <Image
            src="/brand/logo-on-dark.png"
            alt={company.name}
            width={220}
            height={102}
            priority
            className="h-9 w-auto md:h-10"
          />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {primaryNav.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="link-underline eyebrow text-paper/80 hover:text-paper"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <a
            href={company.phoneHref}
            className="eyebrow text-paper/80 hover:text-paper"
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
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
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

      {open && (
        <div className="border-t border-paper/10 bg-petrol md:hidden">
          <nav className="container-content flex flex-col gap-1 py-4">
            {primaryNav.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="eyebrow py-3 text-paper/80"
              >
                {link.label}
              </Link>
            ))}
            <a href={company.phoneHref} className="eyebrow py-3 text-paper/80">
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
