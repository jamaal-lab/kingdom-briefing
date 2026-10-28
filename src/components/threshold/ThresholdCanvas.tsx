import { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { PerformanceMonitor } from '@react-three/drei'
import * as THREE from 'three'
import { ThresholdContext, type ThresholdRuntime, type ProgressStore } from './scene/context'
import { ThresholdScene } from './scene/ThresholdScene'
import { fovForAspect, CAMERA_KEYS } from './choreography'

export type ThresholdCanvasProps = {
  tier: 'full' | 'lite'
  progress: ProgressStore
  pointer: { x: number; y: number }
  active: boolean
  onReady?: () => void
  /** Called when sustained frame times are poor; the host steps the tier down. */
  onDegrade?: () => void
  /** Studio: deterministic still for poster rendering. */
  frozenTime?: number | null
  preserveDrawingBuffer?: boolean
  className?: string
}

function ReadySignal({ onReady, frames = 3 }: { onReady?: () => void; frames?: number }) {
  const n = useRef(0)
  const done = useRef(false)
  useFrame(() => {
    if (done.current) return
    if (++n.current >= frames) {
      done.current = true
      onReady?.()
    }
  })
  return null
}

export default function ThresholdCanvas({
  tier,
  progress,
  pointer,
  active,
  onReady,
  onDegrade,
  frozenTime = null,
  preserveDrawingBuffer = false,
  className,
}: ThresholdCanvasProps) {
  const studio = frozenTime !== null
  const maxDpr = studio ? 1 : tier === 'full' ? 1.5 : 1.25
  const [dpr, setDpr] = useState(maxDpr)
  const runtime = useRef<ThresholdRuntime>({ tier, progress, pointer, frozenTime })
  runtime.current.tier = tier
  runtime.current.frozenTime = frozenTime

  // Cap at the device's real pixel ratio.
  useEffect(() => setDpr(Math.min(maxDpr, window.devicePixelRatio || 1)), [maxDpr])

  const k0 = CAMERA_KEYS[0]
  return (
    <ThresholdContext.Provider value={runtime.current}>
      <Canvas
        className={className}
        dpr={dpr}
        frameloop={active ? 'always' : 'never'}
        shadows={tier === 'full' ? 'soft' : false}
        gl={{
          antialias: tier === 'lite',
          alpha: false,
          stencil: false,
          powerPreference: 'high-performance',
          preserveDrawingBuffer,
        }}
        camera={{ fov: fovForAspect(16 / 9), near: 0.1, far: 420, position: [...k0.pos] }}
        onCreated={({ gl }) => {
          gl.toneMapping = tier === 'full' ? THREE.NoToneMapping : THREE.ACESFilmicToneMapping
          gl.toneMappingExposure = 1
          gl.domElement.addEventListener('webglcontextlost', (e) => {
            e.preventDefault()
            onDegrade?.()
          })
        }}
        aria-hidden="true"
      >
        {!studio && (
          <PerformanceMonitor
            flipflops={2}
            onDecline={() => setDpr((d) => Math.max(0.75, d - 0.25))}
            onFallback={() => onDegrade?.()}
          />
        )}
        <ThresholdScene />
        <ReadySignal onReady={onReady} frames={studio ? 10 : 3} />
      </Canvas>
    </ThresholdContext.Provider>
  )
}
