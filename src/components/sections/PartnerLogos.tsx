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
// that travels exactly one set's width.
//
// Width is measured off a dedicated, invisible, unduplicated "measurer"
// row via ResizeObserver, not off the animated (duplicated) track's
// scrollWidth. An earlier version measured the track directly in a plain
// effect and locked that one snapshot into state — verified via a real
// headless-browser screenshot that it produced a visible mid-loop gap,
// because logo images and the SIASE/Vell.Max text-in-image logos hadn't
// necessarily finished their layout pass at the moment the effect ran, so
// the locked width silently went stale versus the track's real final
// width. ResizeObserver keeps both measurements live instead, so it stays
// correct regardless of image/font load timing or the logo count changing
// later.
//
// The measurer's own width is one set's items plus the GAP_PX gaps
// *between* them, but the actual loop-seamless "distance to travel" per
// set also needs the one further GAP_PX between the last item of one
// repeated set and the first item of the next in the continuous flex
// track — verified via exact child bounding-box measurements that
// omitting it left the translate distance ~64px short of where the next
// set actually starts, which is exactly what produced the gap above.
//
// Pauses on hover/focus (mouse or keyboard) and falls back to a static
// wrapped row — no animation, no repetition — when the visitor has
// prefers-reduced-motion set.
//
// Logos render in their real brand colors (no grayscale treatment) — per
// client direction. 48px (~0.5in at 96dpi/CSS-px) keeps every logo-to-logo
// gap comfortably under the "no more than 1 inch" ask with margin for
// browser zoom/DPI variance, while still reading as a deliberately even
// strip rather than crowded.
const GAP_PX = 48 // must match the gap-12 class used on both rows below
export function PartnerLogos({ partners, dark = false }: { partners: Partner[]; dark?: boolean }) {
  const reduceMotion = useReducedMotion()
  const [paused, setPaused] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const measureRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState(0)
  const [setWidth, setSetWidth] = useState(0)

  useEffect(() => {
    const container = containerRef.current
    const measurer = measureRef.current
    if (!container || !measurer) return

    const containerObserver = new ResizeObserver(([entry]) => {
      setContainerWidth(entry.contentRect.width)
    })
    const measurerObserver = new ResizeObserver(([entry]) => {
      setSetWidth(entry.contentRect.width)
    })
    containerObserver.observe(container)
    measurerObserver.observe(measurer)

    return () => {
      containerObserver.disconnect()
      measurerObserver.disconnect()
    }
  }, [])

  if (partners.length === 0) return null

  // Distance from the start of one repeated set to the start of the next
  // — see GAP_PX's comment above for why this isn't just setWidth.
  const setSlotWidth = setWidth > 0 ? setWidth + GAP_PX : 0

  // Guarantee the track is always at least two container-widths of
  // content, however many logos there are, so translating by exactly one
  // set's width never outruns the next set filling in behind it.
  const repeat =
    setSlotWidth > 0 ? Math.max(2, Math.ceil((containerWidth * 2) / setSlotWidth)) : 2

  function renderLogo(partner: Partner) {
    // Fixed box so every logo occupies the same visual footprint —
    // aspect ratio alone no longer decides rendered size (a wide
    // wordmark vs. a compact/square mark previously looked wildly
    // different in scale under plain h-10 w-auto).
    const image = (
      <div className="flex h-10 w-28 items-center justify-center">
        <Image
          src={partner.logo}
          alt={partner.name}
          width={140}
          height={56}
          className="max-h-full max-w-full object-contain"
        />
      </div>
    )
    // On the dark section variant, logos get a small white card so real
    // brand colors (many of which are dark text/marks) stay legible
    // against the petrol background, instead of forcing them to white.
    const logo = dark ? <div className="rounded bg-paper px-3 py-2">{image}</div> : image
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
            {/* Invisible, unduplicated, non-animated — exists purely so
                ResizeObserver can measure one true set's natural width. */}
            <div
              ref={measureRef}
              aria-hidden="true"
              className="pointer-events-none absolute left-0 top-0 flex w-max items-center gap-12 opacity-0"
            >
              {partners.map((partner) => (
                <div key={partner.name} className="shrink-0">
                  {renderLogo(partner)}
                </div>
              ))}
            </div>

            <div
              className="flex w-max items-center gap-12 animate-marquee"
              style={{
                animationDuration: `${setSlotWidth > 0 ? setSlotWidth / 60 : partners.length * 4}s`,
                animationPlayState: paused || setSlotWidth === 0 ? 'paused' : 'running',
                ...({ '--marquee-distance': `${setSlotWidth}px` } as CSSProperties),
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
