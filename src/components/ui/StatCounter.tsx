'use client'

import { useEffect, useRef, useState } from 'react'

type StatCounterProps = {
  value: number
  suffix?: string
  prefix?: string
  decimals?: number
  label: string
  // Renders at a larger display size — used to give one stat real type-scale
  // hierarchy in a row instead of four visually equal boxes (StatsBar uses
  // this on exactly one of its four stats).
  featured?: boolean
}

export function StatCounter({
  value,
  suffix = '',
  prefix = '',
  decimals = 0,
  label,
  featured = false,
}: StatCounterProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [display, setDisplay] = useState(0)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started) {
          setStarted(true)
        }
      },
      { threshold: 0.4 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [started])

  useEffect(() => {
    if (!started) return
    const duration = 900
    const startTime = performance.now()

    function tick(now: number) {
      const progress = Math.min((now - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(value * eased)
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [started, value])

  return (
    <div ref={ref}>
      <div
        className={
          featured
            ? 'font-display text-6xl font-semibold text-yellow md:text-7xl'
            : 'font-display text-4xl font-semibold text-yellow md:text-5xl'
        }
      >
        {prefix}
        {display.toFixed(decimals)}
        {suffix}
      </div>
      <div className={`mt-2 text-sm text-paper/70 ${featured ? 'max-w-[16ch]' : ''}`}>{label}</div>
    </div>
  )
}
