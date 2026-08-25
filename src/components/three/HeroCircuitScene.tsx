'use client'

import { useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Line } from '@react-three/drei'
import * as THREE from 'three'

// Colors pulled straight from tailwind.config.ts — kept in sync manually
// since three.js materials can't read CSS custom properties.
const PETROL_500 = '#245349'
const YELLOW = '#F5B700'
const PETROL_700 = '#0E2621'

// A single-line-diagram path: grid intake -> transformer -> panel,
// mirroring the SVG trace used in the hero fallback and the creative
// direction doc. Orthogonal segments only — this is a schematic, not a
// sculpted object.
const PATH_POINTS: [number, number, number][] = [
  [-6.4, -1.6, 0],
  [-3.2, -1.6, 0],
  [-2.2, -0.8, 0.3],
  [-2.2, 0.6, 0.3],
  [0.4, 0.6, 0.3],
  [0.4, 1.9, 0.6],
  [3.2, 1.9, 0.6],
]

const NODE_FRACTIONS = [0, 0.42, 1]

function cumulativeFractions(points: [number, number, number][]) {
  const vecs = points.map((p) => new THREE.Vector3(...p))
  const lengths: number[] = [0]
  let total = 0
  for (let i = 1; i < vecs.length; i++) {
    total += vecs[i].distanceTo(vecs[i - 1])
    lengths.push(total)
  }
  return lengths.map((l) => l / total)
}

function Node({
  position,
  igniteAt,
  progress,
}: {
  position: [number, number, number]
  igniteAt: number
  progress: React.MutableRefObject<number>
}) {
  const ref = useRef<THREE.Mesh>(null)
  const materialRef = useRef<THREE.MeshStandardMaterial>(null)

  useFrame(() => {
    if (!ref.current || !materialRef.current) return
    const lit = progress.current >= igniteAt
    const targetScale = lit ? 1 : 0.55
    ref.current.scale.setScalar(THREE.MathUtils.lerp(ref.current.scale.x, targetScale, 0.15))
    const targetEmissive = lit ? 0.9 : 0
    materialRef.current.emissiveIntensity = THREE.MathUtils.lerp(
      materialRef.current.emissiveIntensity,
      targetEmissive,
      0.12,
    )
  })

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.11, 16, 16]} />
      <meshStandardMaterial
        ref={materialRef}
        color={PETROL_700}
        emissive={YELLOW}
        emissiveIntensity={0}
        roughness={0.4}
        metalness={0.3}
      />
    </mesh>
  )
}

function CircuitRig({ reduceMotion }: { reduceMotion: boolean }) {
  const progress = useRef(reduceMotion ? 1 : 0)
  const traceRef = useRef<any>(null)
  const groupRef = useRef<THREE.Group>(null)
  const { viewport } = useThree()

  const fractions = useMemo(() => cumulativeFractions(PATH_POINTS), [])
  const dashSize = 0.22
  const gapSize = 0.32
  const totalPathLength = useMemo(() => {
    const vecs = PATH_POINTS.map((p) => new THREE.Vector3(...p))
    let total = 0
    for (let i = 1; i < vecs.length; i++) total += vecs[i].distanceTo(vecs[i - 1])
    return total
  }, [])

  useFrame((state, delta) => {
    if (!reduceMotion && progress.current < 1) {
      progress.current = Math.min(1, progress.current + delta / 1.8)
    }
    if (traceRef.current) {
      const dashOffset = -(1 - progress.current) * totalPathLength * 1.4
      traceRef.current.material.dashOffset = dashOffset
    }
    if (groupRef.current) {
      // gentle desktop-only pointer parallax, capped small
      const targetX = (state.pointer.x * viewport.width) / 90
      const targetY = (state.pointer.y * viewport.height) / 140
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetX, 0.04)
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -targetY, 0.04)
    }
  })

  return (
    <group ref={groupRef}>
      {/* base trace — unpowered */}
      <Line points={PATH_POINTS} color={PETROL_500} lineWidth={2} />
      {/* live trace — sweeps in on load, then holds */}
      <Line
        ref={traceRef}
        points={PATH_POINTS}
        color={YELLOW}
        lineWidth={2.4}
        dashed
        dashScale={1 / (dashSize + gapSize)}
        dashSize={dashSize}
        gapSize={gapSize}
        transparent
        opacity={0.95}
      />
      {NODE_FRACTIONS.map((f, i) => (
        <Node key={i} position={PATH_POINTS[Math.round(f * (PATH_POINTS.length - 1))]} igniteAt={fractions[Math.round(f * (PATH_POINTS.length - 1))]} progress={progress} />
      ))}
    </group>
  )
}

export function HeroCircuitScene({ reduceMotion = false }: { reduceMotion?: boolean }) {
  const [ready, setReady] = useState(false)

  return (
    <div
      className="pointer-events-none absolute inset-0"
      aria-hidden="true"
      style={{ opacity: ready ? 1 : 0, transition: 'opacity 500ms ease-out' }}
    >
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, 8], fov: 32 }}
        gl={{ antialias: true, alpha: true }}
        onCreated={() => setReady(true)}
      >
        <color attach="background" args={[PETROL_700]} />
        <fog attach="fog" args={[PETROL_700, 6, 13]} />
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 4, 5]} intensity={0.8} color="#FFF6DE" />
        <CircuitRig reduceMotion={reduceMotion} />
      </Canvas>
    </div>
  )
}
