'use client'

import dynamic from 'next/dynamic'
import { useReducedMotion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { CircuitLines } from '@/components/ui/CircuitLines'
import { company } from '@/content/company'
import { motion, staggerItem } from '@/components/ui/Reveal'

// Loaded client-only, no SSR: the 3D hero circuit (see Circuit Map spec,
// beat 01) is a progressive enhancement over the CircuitLines SVG below —
// it decides for itself whether to mount based on viewport width and
// prefers-reduced-motion, and renders nothing while that decision and the
// WebGL context are still being set up, so the SVG is always the visible
// frame until the live scene is actually ready to draw.
const HeroScene = dynamic(() => import('@/components/three/HeroScene').then((m) => m.HeroScene), {
  ssr: false,
})

export function Hero() {
  const reduceMotion = useReducedMotion()

  return (
    <section className="relative overflow-hidden bg-petrol text-paper">
      <div className="absolute inset-0 bg-circuit-grid bg-grid opacity-40" />
      <CircuitLines className="pointer-events-none absolute -right-24 top-0 h-full w-[60%] text-paper/10 motion-safe:animate-[reveal-up_1.1s_ease-out]" />
      <div className="absolute -right-10 top-0 hidden h-full w-[55%] lg:block">
        <HeroScene />
      </div>

      <motion.div
        className="container-content relative py-24 md:py-32"
        initial={reduceMotion ? undefined : 'hidden'}
        animate={reduceMotion ? undefined : 'visible'}
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } } }}
      >
        <motion.h1
          variants={staggerItem}
          className="max-w-3xl font-display text-[clamp(2.75rem,6vw,5.25rem)] font-semibold leading-[0.98] tracking-[-0.01em] text-paper [text-wrap:balance]"
        >
          {company.tagline}
        </motion.h1>

        <motion.p variants={staggerItem} className="mt-6 max-w-xl text-lg leading-relaxed text-paper/70">
          {company.positioning}
        </motion.p>

        <motion.div variants={staggerItem} className="mt-10 flex flex-wrap gap-4">
          <Button href="/contact" variant="primary">
            Request a Quote
          </Button>
          <Button href="/services" variant="secondary">
            View Services
          </Button>
        </motion.div>

        {/* Credential readout — an instrument label, not a marketing kicker:
            sits below the ask, in the mono face reserved for data, echoing
            a panel nameplate rather than a badge above the headline. */}
        <motion.div
          variants={staggerItem}
          className="mt-16 inline-flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-copper/30 pt-6 font-mono text-[0.8125rem] text-paper/70"
        >
          <span className="text-copper">RC {company.rcNumber}</span>
          <span>{company.certifications.map((c) => c.name).join(' · ')} CERTIFIED</span>
          <span>{company.yearsExperience}+ YRS</span>
          <span>
            {company.trust.googleRating.toFixed(1)}★ / {company.trust.googleReviewCount} REVIEWS
          </span>
          <span>{company.serviceAreas.length} ZONES</span>
          <span className="text-yellow">24/7 RESPONSE</span>
        </motion.div>
      </motion.div>
    </section>
  )
}
