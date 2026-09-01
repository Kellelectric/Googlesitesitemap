'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'
import Image from 'next/image'
import { useReducedMotion } from 'framer-motion'
import type { Partner } from '@/content/partners'
import { Reveal } from '@/components/ui/Reveal'

// Renders nothing until src/content/partners.ts has real entries — see that
// file's header comment. Do not pass placeholder/invented partners here.
//
// A continuously sliding marquee, not a step-based carousel like
// TestimonialCarousel — the standard pattern for a "brands we work with"
// logo strip. Seamless loop via a repeated item list + a CSS transform
// that travels exactly one set's width (via the --marquee-distance
// variable, measured in JS). With only a handful of logos, one repeated
// copy is often narrower than the viewport — translating by "half the
// track" in that case leaves a visible gap partway through the loop
// (verified via a real headless-browser screenshot before this fix), so
// the repeat count itself is computed to guarantee at least two full
// container-widths of content, however many logos there are. Pauses on
// hover/focus (mouse or keyboard) and falls back to a static wrapped row —
// no animation, no repetition — when the visitor has prefers-reduced-motion
// set.
export function PartnerLogos({ partners, dark = false }: { partners: Partner[]; dark?: boolean }) {
  const reduceMotion = useReducedMotion()
  const [paused, setPaused] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [repeat, setRepeat] = useState(2)
  const [setWidth, setSetWidth] = useState<number | null>(null)

  useEffect(() => {
    const container = containerRef.current
    const track = trackRef.current
    if (!container || !track || partners.length === 0) return
    const singleSetWidth = track.scrollWidth / repeat
    if (singleSetWidth === 0) return
    const needed = Math.max(2, Math.ceil((container.clientWidth * 2) / singleSetWidth))
    if (needed > repeat) {
      setRepeat(needed)
    } else {
      setSetWidth(singleSetWidth)
    }
    // Re-measure whenever repeat changes (DOM updates) or the logo list
    // itself changes (e.g. more partners added later).
  }, [repeat, partners.length])

  if (partners.length === 0) return null

  const logoClass = `h-10 w-auto object-contain grayscale transition-[filter] duration-200 hover:grayscale-0 ${dark ? 'brightness-0 invert hover:brightness-100 hover:invert-0' : ''}`

  function renderLogo(partner: Partner) {
    const logo = (
      <Image src={partner.logo} alt={partner.name} width={140} height={56} className={logoClass} />
    )
    return partner.url ? (
      <a href={partner.url} target="_blank" rel="noopener noreferrer" aria-label={partner.name}>
        {logo}
      </a>
    ) : (
      <span aria-label={partner.name}>{logo}</span>
    )
  }

  return (
    <section className={dark ? 'bg-petrol-700 py-16 text-paper' : 'border-y border-ink/10 bg-paper py-16'}>
      <div className="container-content">
        <Reveal>
          <span className={`eyebrow ${dark ? 'text-yellow' : 'text-petrol/70'}`}>
            Partners &amp; suppliers
          </span>
        </Reveal>

        {reduceMotion ? (
          <div className="mt-8 flex flex-wrap items-center gap-x-12 gap-y-8">
            {partners.map((partner) => (
              <div key={partner.name}>{renderLogo(partner)}</div>
            ))}
          </div>
        ) : (
          <div
            ref={containerRef}
            role="region"
            aria-label="Partner and supplier logos"
            className="relative mt-8 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
          >
            <div
              ref={trackRef}
              className="flex w-max items-center gap-16 animate-marquee"
              style={{
                animationDuration: `${(setWidth ? setWidth / 60 : partners.length * 4)}s`,
                animationPlayState: paused ? 'paused' : 'running',
                ...(setWidth ? ({ '--marquee-distance': `${setWidth}px` } as CSSProperties) : {}),
              }}
            >
              {Array.from({ length: repeat }, (_, setIndex) =>
                partners.map((partner) => (
                  <div key={`${partner.name}-${setIndex}`} className="shrink-0">
                    {renderLogo(partner)}
                  </div>
                )),
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
