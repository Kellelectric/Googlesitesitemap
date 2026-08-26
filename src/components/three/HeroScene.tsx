'use client'

import { useEffect, useState } from 'react'
import { HeroCircuitScene } from './HeroCircuitScene'

// Mobile / low-power fallback rule (Circuit Map spec, "Mobile & fallback
// states"): below this width the live WebGL canvas doesn't mount at all —
// the CircuitLines SVG already painted behind this component is the
// poster frame. Desktop always gets the live scene; prefers-reduced-motion
// gets the live scene frozen on its final frame instead of removed, since
// the geometry itself costs nothing extra to hold static.
const MIN_WIDTH_FOR_3D = 1024

export function HeroScene() {
  const [shouldRender3D, setShouldRender3D] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)

  useEffect(() => {
    const widthQuery = window.matchMedia(`(min-width: ${MIN_WIDTH_FOR_3D}px)`)
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    const update = () => {
      setShouldRender3D(widthQuery.matches)
      setReduceMotion(motionQuery.matches)
    }
    update()

    widthQuery.addEventListener('change', update)
    motionQuery.addEventListener('change', update)
    return () => {
      widthQuery.removeEventListener('change', update)
      motionQuery.removeEventListener('change', update)
    }
  }, [])

  if (!shouldRender3D) return null

  return <HeroCircuitScene reduceMotion={reduceMotion} />
}
