'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { ReactNode } from 'react'

type RevealProps = {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
}

// Scroll-triggered fade/slide-in used across landing pages. Respects
// prefers-reduced-motion by rendering with no transform/opacity animation.
export function Reveal({ children, className, delay = 0, y = 20 }: RevealProps) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? undefined : { opacity: 0, y }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

type StaggerProps = {
  children: ReactNode
  className?: string
  stagger?: number
}

// Wraps a list of children (e.g. a card grid) and staggers each direct
// child's entrance. Children should be plain elements — this only needs
// to set variants on itself; each child picks them up via context-free
// CSS custom animation is avoided in favor of explicit item variants.
export function StaggerGroup({ children, className, stagger = 0.08 }: StaggerProps) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? undefined : 'hidden'}
      whileInView={reduceMotion ? undefined : 'visible'}
      viewport={{ once: true, margin: '-80px' }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger } },
      }}
    >
      {children}
    </motion.div>
  )
}

export const staggerItem = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
}

// Explicit named client-component export. Server components must import
// this directly rather than accessing `motion.div` on a re-exported
// namespace — the RSC client-reference manifest can't resolve a property
// access on a namespace import across the server/client boundary.
export const MotionDiv = motion.div

export { motion }
