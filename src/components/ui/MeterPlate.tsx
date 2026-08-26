'use client'

import { useEffect, useRef, useState } from 'react'

// A back-out ease: overshoots past the resting value, then settles — the
// motion of a real analog meter needle, not a marketing count-up. See
// Circuit Map spec, beat 02 ("Proof — Instrument bar").
function backOut(t: number) {
  const c1 = 1.70158
  const c3 = c1 + 1
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2)
}

function useSettleOnce(value: number, active: boolean) {
  const ref = useRef<HTMLDivElement>(null)
  const [display, setDisplay] = useState(0)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    if (!active) {
      setDisplay(value)
      return
    }
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started) setStarted(true)
      },
      { threshold: 0.4 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [started, active, value])

  useEffect(() => {
    if (!active) return
    if (!started) return
    const duration = 850
    const startTime = performance.now()
    function tick(now: number) {
      const progress = Math.min((now - startTime) / duration, 1)
      setDisplay(value * backOut(progress))
      if (progress < 1) requestAnimationFrame(tick)
      else setDisplay(value)
    }
    requestAnimationFrame(tick)
  }, [started, active, value])

  return { ref, display }
}

type MeterPlateProps = {
  value: number
  suffix?: string
  prefix?: string
  decimals?: number
  label: string
  reduceMotion?: boolean
  /** Renders a 5-light indicator ladder instead of the tick scale — for a
   * genuinely bounded 0–5 metric (the review rating) rather than an
   * arbitrary decorative gauge implying a false maximum. */
  ladderOf5?: boolean
  /** The panel's primary gauge — larger face, the other three read as
   * secondary meters beside it. Breaks the equal-card grid the craft floor
   * flags as the default "hero-metric" template. */
  lead?: boolean
}

export function MeterPlate({
  value,
  suffix = '',
  prefix = '',
  decimals = 0,
  label,
  reduceMotion = false,
  ladderOf5 = false,
  lead = false,
}: MeterPlateProps) {
  const { ref, display } = useSettleOnce(value, !reduceMotion)
  const clamped = decimals === 0 ? Math.round(display) : display
  const lit = Math.round((clamped / 5) * 5 * 2) / 2 // nearest half-light

  return (
    <div ref={ref} className={lead ? 'px-7 py-8 md:py-9' : 'px-6 py-6'}>
      <div
        className={
          lead
            ? 'font-mono font-medium leading-none tabular-nums text-yellow text-[2.75rem] md:text-[3.25rem]'
            : 'font-mono font-medium leading-none tabular-nums text-yellow text-[1.65rem] md:text-[1.85rem]'
        }
      >
        {prefix}
        {clamped.toFixed(decimals)}
        {suffix}
      </div>

      {ladderOf5 ? (
        <div className="mt-4 flex max-w-[220px] gap-2" role="img" aria-label={`${value} out of 5`}>
          {[0, 1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className="h-2 flex-1"
              style={{
                backgroundColor: i < lit ? '#F5B700' : 'rgba(247,245,240,0.12)',
                boxShadow: i < lit ? '0 0 8px rgba(245,183,0,0.55)' : 'none',
              }}
            />
          ))}
        </div>
      ) : (
        <div className="mt-3 flex gap-[3px]" aria-hidden="true">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} className="h-1 w-px bg-paper/15" />
          ))}
        </div>
      )}

      <div className={lead ? 'mt-4 font-body text-base text-paper/75' : 'mt-2.5 font-body text-[0.8125rem] text-paper/65'}>
        {label}
      </div>
    </div>
  )
}
