import { useCallback, useEffect, useRef, useState } from 'react'
import { Picture } from '~/components/site/Picture'
import { useInView, useReducedMotion } from '~/motion'
import { track } from '~/lib/analytics'
import { WEBSITES_PAGES } from '~/lib/target'
import type { MediaAsset } from '~/lib/media'

const T = `${import.meta.env.BASE_URL}media/transformation`
const DESKTOP_W = [960, 1600, 2400] as const
const MOBILE_W = [390, 780, 1170] as const

export const FRAMES = {
  desktop: {
    before: { base: `${T}/before-desktop`, widths: DESKTOP_W, width: 2400, height: 1500, alt: 'Before: a generic template website for the fictional architecture firm Atelier North — crowded navigation, stock layout and a weak headline.' },
    after: { base: `${T}/after-desktop`, widths: DESKTOP_W, width: 2400, height: 1500, alt: 'After: the redesigned Atelier North website — a full-screen architectural photograph, a clear statement and one confident call to action.' },
  },
  mobile: {
    before: { base: `${T}/before-mobile`, widths: MOBILE_W, width: 1170, height: 2532, alt: 'Before, on a phone: the template site with a small, cluttered header and a cramped hero.' },
    after: { base: `${T}/after-mobile`, widths: MOBILE_W, width: 1170, height: 2532, alt: 'After, on a phone: the redesigned site with a full-height image, readable headline and a clear next step.' },
  },
} satisfies Record<string, Record<'before' | 'after', MediaAsset>>

type Device = 'desktop' | 'mobile'
const LIVE = { before: WEBSITES_PAGES.conceptBefore, after: WEBSITES_PAGES.conceptAfter }

/**
 * Before/after comparison of one fictional business. Drag, swipe, click, or
 * use the arrow keys. The divider is a real ARIA slider. Static frames by
 * default; the live pages load only on request.
 */
export function TransformationSlider() {
  const [pos, setPos] = useState(50)
  const [device, setDevice] = useState<Device>('desktop')
  const [live, setLive] = useState(false)
  const [dragging, setDragging] = useState(false)
  const stage = useRef<HTMLDivElement>(null)
  const handle = useRef<HTMLDivElement>(null)
  const interacted = useRef(false)
  const reduced = useReducedMotion()
  const [viewRef, inView] = useInView<HTMLDivElement>()

  // Phones open on the phone comparison: it's the one people can read at that size.
  useEffect(() => {
    if (window.matchMedia('(max-width: 639px)').matches) setDevice('mobile')
  }, [])

  const fromClientX = useCallback((x: number) => {
    const r = stage.current?.getBoundingClientRect()
    if (!r || !r.width) return
    setPos(Math.max(0, Math.min(100, ((x - r.left) / r.width) * 100)))
  }, [])

  const firstTouch = () => {
    if (interacted.current) return
    interacted.current = true
    track('transformation_interact', { device })
  }

  // One gentle nudge the first time the slider is seen, so people know it moves.
  useEffect(() => {
    if (!inView || reduced || interacted.current) return
    let raf = 0
    const t0 = performance.now()
    const run = (now: number) => {
      if (interacted.current) return
      const t = (now - t0) / 1600
      if (t >= 1) return setPos(50)
      setPos(50 - Math.sin(t * Math.PI * 2) * 14 * (1 - t))
      raf = requestAnimationFrame(run)
    }
    const timer = setTimeout(() => (raf = requestAnimationFrame(run)), 500)
    return () => {
      clearTimeout(timer)
      cancelAnimationFrame(raf)
    }
  }, [inView, reduced])

  const onKey = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 10 : 2
    const map: Record<string, number> = { ArrowLeft: pos - step, ArrowDown: pos - step, ArrowRight: pos + step, ArrowUp: pos + step, PageDown: pos - 10, PageUp: pos + 10, Home: 0, End: 100 }
    if (!(e.key in map)) return
    e.preventDefault()
    firstTouch()
    setPos(Math.max(0, Math.min(100, map[e.key])))
  }

  const frames = FRAMES[device]
  const mobile = device === 'mobile'

  return (
    <div ref={viewRef}>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <div role="group" aria-label="Device" className="inline-flex rounded-full border border-ivory/15 p-1">
          {(['desktop', 'mobile'] as const).map((d) => (
            <button
              key={d}
              type="button"
              aria-pressed={device === d}
              onClick={() => {
                setDevice(d)
                track('transformation_device', { device: d })
              }}
              className={`min-h-10 rounded-full px-5 text-[0.8rem] font-semibold capitalize transition-colors ${device === d ? 'bg-ivory text-navy' : 'text-ivory/75 hover:text-ivory'}`}
            >
              {d === 'desktop' ? 'Desktop' : 'Phone'}
            </button>
          ))}
        </div>
        <button
          type="button"
          aria-pressed={live}
          onClick={() => {
            setLive((l) => !l)
            track('transformation_live', { on: !live })
          }}
          className="min-h-10 text-[0.8rem] font-semibold text-champagne underline decoration-champagne/40 underline-offset-4 hover:decoration-champagne"
        >
          {live ? 'Show still frames' : 'Explore the live pages'}
        </button>
      </div>

      <div className={`relative mx-auto ${mobile ? 'max-w-[380px]' : 'max-w-none'}`}>
        <div
          ref={stage}
          className={`relative select-none overflow-hidden bg-midnight shadow-[0_60px_140px_-50px_rgba(0,0,0,0.95)] ${mobile ? 'aspect-[1170/2532] rounded-[42px] border-[10px] border-[#0a1522]' : 'aspect-[16/10] rounded-[20px] border border-champagne/20'}`}
          style={{ touchAction: live ? 'auto' : 'pan-y' }}
          onPointerDown={(e) => {
            if (live || e.button !== 0) return
            firstTouch()
            setDragging(true)
            e.currentTarget.setPointerCapture(e.pointerId)
            fromClientX(e.clientX)
          }}
          onPointerMove={(e) => dragging && fromClientX(e.clientX)}
          onPointerUp={() => setDragging(false)}
          onPointerCancel={() => setDragging(false)}
        >
          {/* After fills the frame; Before is revealed from the left. */}
          <Layer side="after" live={live} device={device} asset={frames.after} />
          <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
            <Layer side="before" live={live} device={device} asset={frames.before} />
          </div>

          <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-[#0b1a2b]/85 px-3 py-1.5 font-mono text-[0.62rem] uppercase tracking-[0.2em] text-ivory backdrop-blur" style={{ opacity: pos > 12 ? 1 : 0, transition: 'opacity .3s' }}>
            Before
          </span>
          <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-gold px-3 py-1.5 font-mono text-[0.62rem] uppercase tracking-[0.2em] text-navy" style={{ opacity: pos < 88 ? 1 : 0, transition: 'opacity .3s' }}>
            After
          </span>

          <div className="pointer-events-none absolute inset-y-0 w-px bg-champagne shadow-[0_0_18px_rgba(227,204,147,0.7)]" style={{ left: `${pos}%` }} />
          <div
            ref={handle}
            role="slider"
            tabIndex={0}
            aria-label="Before and after comparison. Use the arrow keys to move the divider."
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(pos)}
            aria-valuetext={`${Math.round(pos)}% before, ${Math.round(100 - pos)}% after`}
            onKeyDown={onKey}
            onPointerDown={(e) => {
              if (!live) return
              // With live pages the frame scrolls normally; only the handle drags.
              e.stopPropagation()
              firstTouch()
              setDragging(true)
              e.currentTarget.setPointerCapture(e.pointerId)
            }}
            onPointerMove={(e) => live && dragging && fromClientX(e.clientX)}
            onPointerUp={() => setDragging(false)}
            className={`absolute top-1/2 z-10 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-full border border-champagne bg-[#0b1a2b]/90 text-champagne shadow-[0_10px_40px_rgba(0,0,0,0.6)] backdrop-blur transition-transform focus-visible:scale-110 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-champagne ${dragging ? 'scale-110' : ''}`}
            style={{ left: `${pos}%`, touchAction: 'none' }}
          >
            <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M9 6 3 12l6 6M15 6l6 6-6 6" />
            </svg>
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-2 text-sm sm:flex-row sm:items-center sm:justify-between">
        <p className="text-ivory/85">Same business. A better digital experience.</p>
        <p className="text-mist">{live ? 'Scroll inside each side; drag the round handle to compare.' : 'Drag to explore the transformation.'}</p>
      </div>
    </div>
  )
}

function Layer({ side, live, device, asset: a }: { side: 'before' | 'after'; live: boolean; device: Device; asset: MediaAsset }) {
  if (live)
    return (
      <iframe
        title={side === 'before' ? 'Before: Atelier North template site (illustrative)' : 'After: Atelier North redesigned site (illustrative)'}
        src={LIVE[side]}
        loading="lazy"
        className="absolute inset-0 h-full w-full border-0 bg-white"
        style={device === 'desktop' ? { width: '200%', height: '200%', transform: 'scale(0.5)', transformOrigin: '0 0' } : undefined}
      />
    )
  return <Picture asset={a} sizes={device === 'mobile' ? '380px' : '(min-width: 1280px) 1200px, 100vw'} className="absolute inset-0 block h-full w-full" imgClassName="pointer-events-none h-full w-full object-cover object-top" />
}
