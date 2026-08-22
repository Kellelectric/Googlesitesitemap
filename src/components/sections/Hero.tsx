'use client'

import { useReducedMotion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { CircuitLines } from '@/components/ui/CircuitLines'
import { company } from '@/content/company'
import { motion, staggerItem } from '@/components/ui/Reveal'

export function Hero() {
  const reduceMotion = useReducedMotion()

  return (
    <section className="relative overflow-hidden bg-petrol text-paper">
      <div className="absolute inset-0 bg-circuit-grid bg-grid opacity-40" />
      <CircuitLines className="pointer-events-none absolute -right-24 top-0 h-full w-[60%] text-paper/10 motion-safe:animate-[reveal-up_1.1s_ease-out]" />

      <motion.div
        className="container-content relative py-24 md:py-32"
        initial={reduceMotion ? undefined : 'hidden'}
        animate={reduceMotion ? undefined : 'visible'}
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } } }}
      >
        <motion.span
          variants={staggerItem}
          className="eyebrow inline-block border border-paper/20 px-3 py-1.5 text-yellow"
        >
          RC {company.rcNumber} · {company.certifications.map((c) => c.name).join(' & ')} Certified
        </motion.span>

        <motion.h1
          variants={staggerItem}
          className="mt-8 max-w-3xl font-display text-[clamp(2.5rem,5vw,4.5rem)] font-semibold leading-[1.05] text-paper"
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

        <motion.div
          variants={staggerItem}
          className="mt-16 flex flex-wrap gap-x-10 gap-y-4 border-t border-paper/10 pt-8 text-sm text-paper/60"
        >
          <span>{company.yearsExperience}+ years in the field</span>
          <span>
            {company.trust.googleRating}★ rating · {company.trust.googleReviewCount} Google reviews
          </span>
          <span>{company.serviceAreas.length} service zones across Abuja</span>
          <span>24/7 emergency response</span>
        </motion.div>
      </motion.div>
    </section>
  )
}
