import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { detectTier, type Tier } from '~/lib/capabilities'
import { MEDIA } from '~/lib/media'
import { Picture } from '~/components/site/Picture'
import { ErrorBoundary } from '~/components/site/ErrorBoundary'
import type { ProgressStore } from '~/components/threshold/scene/context'

const ThresholdCanvas = lazy(() => import('~/components/threshold/ThresholdCanvas'))

/**
 * The flagship's Threshold scene, framed as a cinematic window. Instead of
 * following scroll, the camera breathes slowly between arrival and approach
 * (a 26 s loop). Same tiers and fallbacks as the flagship: stills for
 * reduced motion, no WebGL, or when the 3D chunk fails.
 */
export function HeroWindow({ fullBleed = false, still = false }: { fullBleed?: boolean; /** Show the still only (visitor switched motion off). */ still?: boolean }) {
  const progress = useRef<ProgressStore>({ target: 0, current: 0 }).current
  const pointer = useRef({ x: 0, y: 0 }).current
  const box = useRef<HTMLDivElement>(null)
  const [tier, setTier] = useState<Tier | null>(null)
  const [ready, setReady] = useState(false)
  const [active, setActive] = useState(true)

  useEffect(() => setTier(detectTier()), [])

  useEffect(() => {
    if (still || (tier !== 'full' && tier !== 'lite')) return
    let raf = 0
    const t0 = performance.now()
    const loop = (now: number) => {
      const t = (now - t0) / 1000
      // 0 → 0.34 → 0, eased: a slow dolly toward the gate and back.
      progress.current = progress.target = 0.17 - 0.17 * Math.cos((t * 2 * Math.PI) / 26)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [tier, progress, still])

  useEffect(() => {
    const el = box.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting))
    io.observe(el)
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      const r = el.getBoundingClientRect()
      pointer.x = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width) * 2 - 1))
      pointer.y = Math.max(-1, Math.min(1, -(((e.clientY - r.top) / r.height) * 2 - 1)))
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      io.disconnect()
      window.removeEventListener('pointermove', onMove)
    }
  }, [pointer])

  const live = !still && (tier === 'full' || tier === 'lite')
  return (
    <div
      ref={box}
      className={fullBleed ? 'absolute inset-0 overflow-hidden bg-midnight' : 'relative aspect-[16/10] w-full overflow-hidden rounded-[18px] border border-champagne/20 bg-midnight shadow-[0_50px_120px_-40px_rgba(0,0,0,0.9)]'}
    >
      <Picture asset={MEDIA.thresholdArrival} portrait={fullBleed ? MEDIA.thresholdArrivalPortrait : undefined} priority sizes={fullBleed ? '100vw' : '(min-width: 1024px) 58vw, 100vw'} className="absolute inset-0 block h-full w-full" imgClassName="h-full w-full object-cover motion-safe:animate-[drift_26s_ease-in-out_infinite_alternate]" />
      {live && (
        <div className={`absolute inset-0 transition-opacity duration-[1400ms] ${ready ? 'opacity-100' : 'opacity-0'}`}>
          <ErrorBoundary area="v2-hero-canvas" fallback={null} onError={() => (setReady(false), setTier('poster'))}>
            <Suspense fallback={null}>
              <ThresholdCanvas tier={tier} progress={progress} pointer={pointer} active={active} onReady={() => setReady(true)} onDegrade={() => (setReady(false), setTier((t) => (t === 'full' ? 'lite' : 'poster')))} />
            </Suspense>
          </ErrorBoundary>
        </div>
      )}
      {!fullBleed && (
        <>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-midnight/70 via-transparent to-midnight/20" />
          <p className="pointer-events-none absolute bottom-4 left-5 font-mono text-[0.6rem] uppercase tracking-[0.2em] text-champagne/80">
            {live ? 'Live · The Threshold, rendered in your browser' : 'The Threshold'}
          </p>
        </>
      )}
      {fullBleed && live && <span className="sr-only">Live 3D scene rendered in your browser</span>}
    </div>
  )
}
