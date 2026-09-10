'use client'

import Link from 'next/link'
import { ComponentPropsWithoutRef } from 'react'
import { trackEvent } from '@/lib/analytics'

type BaseProps = {
  variant?: 'primary' | 'secondary' | 'ghost'
  className?: string
  children: React.ReactNode
}

type ButtonAsLink = BaseProps &
  Omit<ComponentPropsWithoutRef<typeof Link>, 'href'> & { href: string }

type ButtonAsButton = BaseProps &
  ComponentPropsWithoutRef<'button'> & { href?: undefined }

type ButtonProps = ButtonAsLink | ButtonAsButton

const variantClasses: Record<NonNullable<BaseProps['variant']>, string> = {
  primary: 'bg-yellow text-ink hover:bg-yellow/90',
  secondary:
    'border border-paper/40 text-paper hover:bg-paper hover:text-ink data-[on-light=true]:border-ink/30 data-[on-light=true]:text-ink data-[on-light=true]:hover:bg-ink data-[on-light=true]:hover:text-paper',
  ghost: 'text-ink hover:text-petrol underline underline-offset-4',
}

const base =
  'inline-flex items-center justify-center gap-2 rounded px-6 py-3 text-sm font-semibold tracking-wide transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow'

export function Button({
  variant = 'primary',
  className = '',
  children,
  href,
  ...rest
}: ButtonProps) {
  const classes = `${base} ${variantClasses[variant]} ${className}`

  if (href) {
    // Conversion touchpoints (call/WhatsApp) aren't page views, so they'd
    // otherwise be invisible in GA4 — fire an event on click without
    // blocking the tel:/wa.me navigation itself.
    const conversionChannel = href.startsWith('tel:')
      ? 'phone'
      : href.includes('wa.me')
        ? 'whatsapp'
        : null

    return (
      <Link
        href={href}
        className={classes}
        onClick={(e) => {
          if (conversionChannel) trackEvent('contact', { channel: conversionChannel })
          ;(rest as { onClick?: (e: React.MouseEvent) => void }).onClick?.(e)
        }}
        {...(rest as Omit<ComponentPropsWithoutRef<typeof Link>, 'href' | 'onClick'>)}
      >
        {children}
      </Link>
    )
  }

  return (
    <button className={classes} {...(rest as ComponentPropsWithoutRef<'button'>)}>
      {children}
    </button>
  )
}
