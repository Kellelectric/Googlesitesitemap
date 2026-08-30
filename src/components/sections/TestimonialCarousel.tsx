'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { TestimonialCard } from '@/components/sections/TestimonialCard'
import type { Testimonial } from '@/content/testimonials'

const AUTOPLAY_INTERVAL_MS = 3000

export function TestimonialCarousel({ items }: { items: Testimonial[] }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [paused, setPaused] = useState(false)
  const reduceMotion = useReducedMotion()

  // Doubled so autoplay/scroll can loop seamlessly: once we've scrolled past
  // the first copy, we silently (no animation) rewind by exactly one copy's
  // width, which reads as an infinite loop without cloning DOM on the fly.
  const loopItems = [...items, ...items]

  const scrollByCards = useCallback(
    (direction: 1 | -1) => {
      const track = trackRef.current
      if (!track) return
      const card = track.querySelector<HTMLElement>('[data-card]')
      const cardWidth = card ? card.offsetWidth + 24 : track.clientWidth
      track.scrollBy({ left: direction * cardWidth, behavior: reduceMotion ? 'auto' : 'smooth' })
    },
    [reduceMotion],
  )

  useEffect(() => {
    if (reduceMotion || paused) return
    const id = setInterval(() => scrollByCards(1), AUTOPLAY_INTERVAL_MS)
    return () => clearInterval(id)
  }, [paused, reduceMotion, scrollByCards])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    function handleScroll() {
      if (!track) return
      const singleSetWidth = track.scrollWidth / 2
      if (track.scrollLeft >= singleSetWidth) {
        track.scrollLeft -= singleSetWidth
      } else if (track.scrollLeft < 0) {
        track.scrollLeft += singleSetWidth
      }
    }
    track.addEventListener('scroll', handleScroll, { passive: true })
    return () => track.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Customer testimonials"
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div
        ref={trackRef}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') {
            e.preventDefault()
            setPaused(true)
            scrollByCards(1)
          } else if (e.key === 'ArrowLeft') {
            e.preventDefault()
            setPaused(true)
            scrollByCards(-1)
          }
        }}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {loopItems.map((testimonial, i) => (
          <div
            key={`${testimonial.id}-${i}`}
            data-card
            className="w-[85%] shrink-0 snap-start sm:w-[48%] lg:w-[31%]"
          >
            <TestimonialCard testimonial={testimonial} />
          </div>
        ))}
      </div>
    </div>
  )
}
