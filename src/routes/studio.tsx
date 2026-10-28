import { createFileRoute } from '@tanstack/react-router'
import { lazy, Suspense, useEffect, useRef, useState } from 'react'

/**
 * Render studio (development only). Renders deterministic stills of the live
 * scenes at an exact pixel size so scripts/render-assets.mjs can capture
 * posters and derivatives from the same code the site runs.
 *   /studio?scene=threshold&p=0&w=3840&h=2160
 */
const ThresholdCanvas = lazy(() => import('~/components/threshold/ThresholdCanvas'))
const ArchitectureStill = lazy(() => import('~/components/studio/ArchitectureStill'))

declare global {
  interface Window {
    __studioDone?: boolean
  }
}

export const Route = createFileRoute('/studio')({
  head: () => ({ meta: [{ name: 'robots', content: 'noindex' }] }),
  validateSearch: (s: Record<string, unknown>) => ({
    scene: String(s.scene ?? 'threshold'),
    p: Number(s.p ?? 0),
    w: Number(s.w ?? 1600),
    h: Number(s.h ?? 900),
    tier: (s.tier === 'lite' ? 'lite' : 'full') as 'full' | 'lite',
    t: Number(s.t ?? 4.2),
    shot: String(s.shot ?? 'halden'),
  }),
  component: Studio,
})

function Studio() {
  const { scene, p, w, h, tier, t, shot } = Route.useSearch()
  const [mounted, setMounted] = useState(false)
  const [finished, setFinished] = useState(false)
  useEffect(() => setMounted(true), [])
  const progress = useRef({ target: p, current: p }).current
  if (!import.meta.env.DEV) return <p style={{ padding: 40 }}>Studio is available in development only.</p>
  if (!mounted) return null
  const done = () => {
    setFinished(true)
    setTimeout(() => (window.__studioDone = true), 200)
  }
  return (
    <div style={{ width: w, height: h, background: '#08111f' }} id="studio-frame">
      <Suspense fallback={null}>
        {scene === 'threshold' ? (
          <ThresholdCanvas
            tier={tier}
            progress={progress}
            pointer={{ x: 0, y: 0 }}
            active={!finished}
            frozenTime={t}
            preserveDrawingBuffer
            onReady={done}
          />
        ) : (
          <ArchitectureStill shot={shot} onDone={done} />
        )}
      </Suspense>
    </div>
  )
}
