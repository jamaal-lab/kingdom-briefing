import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { CHAPTERS, JOURNEY_STAGES } from './choreography'
import { detectTier, type Tier } from '~/lib/capabilities'
import { MEDIA } from '~/lib/media'
import { SITE } from '~/lib/site'
import { track } from '~/lib/analytics'
import { Picture } from '~/components/site/Picture'
import { ButtonLink } from '~/components/site/Button'
import { SplitText, window4, range } from '~/motion'
import type { ProgressStore } from './scene/context'

const ThresholdCanvas = lazy(() => import('./ThresholdCanvas'))

/** Visibility windows [fadeInStart, fadeInEnd, fadeOutStart, fadeOutEnd] per overlay. */
const OVERLAY_WINDOWS: Record<string, [number, number, number, number]> = {
  arrival: [-1, -0.5, 0.05, 0.11],
  approach: [0.15, 0.21, 0.38, 0.44],
  transition: [0.47, 0.51, 0.58, 0.62],
  intelligence: [0.67, 0.72, 0.86, 0.9],
  experience: [0.91, 0.95, 2, 3],
}

/**
 * THE THRESHOLD — signature hero.
 * A tall scroll track with a sticky stage. Native scrolling drives one
 * progress value (ScrollTrigger), damped once on a shared ticker, and read by
 * the WebGL camera, the editorial overlays and the poster fallback alike.
 * No scroll hijacking: the page scrolls normally; the film follows it.
 */
export function Threshold() {
  const section = useRef<HTMLElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const progress = useRef<ProgressStore>({ target: 0, current: 0 }).current
  const pointer = useRef({ x: 0, y: 0 }).current
  const [tier, setTier] = useState<Tier | null>(null)
  const [ready, setReady] = useState(false)
  const [active, setActive] = useState(true)
  const [chapter, setChapter] = useState(0)
  const [introPlayed, setIntroPlayed] = useState(false)

  useEffect(() => {
    setTier(detectTier())
    const id = requestAnimationFrame(() => setIntroPlayed(true))
    return () => cancelAnimationFrame(id)
  }, [])

  // Progress: ScrollTrigger measures, a single ticker damps and paints overlays.
  useEffect(() => {
    const el = section.current
    const st = stage.current
    if (!el || !st) return
    let killed = false
    let cleanup = () => {}
    ;(async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger')])
      if (killed) return
      gsap.registerPlugin(ScrollTrigger)
      ScrollTrigger.config({ ignoreMobileResize: true })
      const trigger = ScrollTrigger.create({
        trigger: el,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
          progress.target = self.progress
        },
      })
      progress.target = trigger.progress

      const overlays = Array.from(st.querySelectorAll<HTMLElement>('[data-overlay]'))
      const flash = st.querySelector<HTMLElement>('[data-flash]')
      const posters = Array.from(st.querySelectorAll<HTMLElement>('[data-poster]'))
      const bar = st.querySelector<HTMLElement>('[data-progress]')
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      let lastChapter = -1

      const tick = (_t: number, deltaMs: number) => {
        const dt = Math.min(deltaMs / 1000, 0.05)
        progress.current = reduce ? progress.target : progress.current + (progress.target - progress.current) * (1 - Math.exp(-3.6 * dt))
        if (Math.abs(progress.current - progress.target) < 1e-5) progress.current = progress.target
        const p = progress.current

        for (const o of overlays) {
          const [a, b, c, d] = OVERLAY_WINDOWS[o.dataset.overlay!]
          const w = window4(p, a, b, c, d)
          o.style.opacity = w.toFixed(3)
          if (!reduce) o.style.transform = `translate3d(0, ${((1 - w) * (p < c ? 28 : -28)).toFixed(1)}px, 0)`
          const hidden = w < 0.02
          if (o.inert !== hidden) o.inert = hidden
          o.style.visibility = hidden ? 'hidden' : 'visible'
        }
        if (flash) flash.style.opacity = (window4(p, 0.5, 0.555, 0.57, 0.63) * 0.55).toFixed(3)
        if (bar) bar.style.transform = `scaleY(${p.toFixed(4)})`

        // Poster tier: crossfade stills and push in, approximating the camera.
        if (posters.length) {
          const weights = [1 - range(p, 0.2, 0.32), range(p, 0.2, 0.32) - range(p, 0.6, 0.7), range(p, 0.6, 0.7)]
          posters.forEach((el, i) => {
            el.style.opacity = weights[i].toFixed(3)
            const local = i === 0 ? range(p, 0, 0.3) : i === 1 ? range(p, 0.2, 0.62) : range(p, 0.6, 1)
            if (!reduce) el.style.transform = `scale(${(1 + local * 0.14).toFixed(4)})`
          })
        }

        const idx = CHAPTERS.findIndex((c) => p >= c.start && p < c.end + (c.end === 1 ? 0.01 : 0))
        if (idx !== lastChapter && idx >= 0) {
          lastChapter = idx
          setChapter(idx)
        }
      }
      gsap.ticker.add(tick)
      cleanup = () => {
        gsap.ticker.remove(tick)
        trigger.kill()
      }
    })()
    return () => {
      killed = true
      cleanup()
    }
  }, [progress, tier])

  // Pause rendering when the Threshold is off screen.
  useEffect(() => {
    const el = section.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { rootMargin: '100px 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // Pointer lean (fine pointers only).
  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return
    const onMove = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.y = -((e.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [pointer])

  const degrade = useCallback(() => {
    setReady(false)
    setTier((t) => {
      const next = t === 'full' ? 'lite' : 'poster'
      track('threshold_degrade', { from: t ?? 'unknown', to: next })
      return next
    })
  }, [])

  const jumpTo = (start: number) => {
    const el = section.current
    if (!el) return
    const top = el.offsetTop + (start + 0.012) * (el.offsetHeight - window.innerHeight)
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' })
  }

  const live = tier === 'full' || tier === 'lite'

  return (
    <section id="threshold" ref={section} aria-label="The Threshold" className="threshold-track relative h-[520svh]">
      <div ref={stage} className="threshold-stage sticky top-0 h-svh overflow-hidden bg-midnight">
        {/* Poster: always server-rendered as the LCP image and the no-WebGL experience. */}
        <div data-poster className="absolute inset-0 origin-center will-change-transform">
          <Picture
            asset={MEDIA.thresholdArrival}
            portrait={MEDIA.thresholdArrivalPortrait}
            priority
            className="block h-full w-full"
            imgClassName="threshold-arrival h-full w-full object-cover"
          />
        </div>
        {tier === 'poster' && (
          <>
            <div data-poster className="absolute inset-0 origin-center opacity-0 will-change-transform">
              <Picture asset={MEDIA.thresholdApproach} portrait={MEDIA.thresholdApproachPortrait} className="block h-full w-full" imgClassName="h-full w-full object-cover" />
            </div>
            <div data-poster className="absolute inset-0 origin-center opacity-0 will-change-transform">
              <Picture asset={MEDIA.thresholdIntelligence} portrait={MEDIA.thresholdIntelligencePortrait} className="block h-full w-full" imgClassName="h-full w-full object-cover" />
            </div>
          </>
        )}

        {live && (
          <div className={`absolute inset-0 transition-opacity duration-[1400ms] ease-[var(--ease-settle)] ${ready ? 'opacity-100' : 'opacity-0'}`}>
            <Suspense fallback={null}>
              <ThresholdCanvas tier={tier} progress={progress} pointer={pointer} active={active} onReady={() => setReady(true)} onDegrade={degrade} />
            </Suspense>
          </div>
        )}

        {/* Grade + legibility scrims */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_45%,transparent_40%,rgba(8,17,31,0.75)_100%)]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-midnight via-midnight/55 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-midnight/80 to-transparent" />
        <div data-flash className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_50%,rgba(245,225,180,0.9),rgba(231,210,160,0.15)_60%,transparent_80%)] opacity-0 mix-blend-screen" />

        {/* A — Arrival */}
        <div data-overlay="arrival" className="absolute inset-x-0 bottom-0 px-5 pb-[max(6svh,2.5rem)] sm:px-8 lg:px-12">
          <div className="mx-auto max-w-[1440px]">
            <p className={`eyebrow flex items-center gap-4 text-champagne/80 transition-opacity delay-300 duration-[1600ms] ${introPlayed ? 'opacity-100' : 'opacity-0'}`}>
              <span className="h-px w-10 bg-gold" />
              Bridge Web — Black Label
            </p>
            <SplitText
              as="h1"
              play={introPlayed}
              delay={350}
              lines={[SITE.statement[0], SITE.statement[1]]}
              className="display mt-6 text-[clamp(3rem,10.5vw,9.5rem)] text-ivory"
              lineClassName="[&:nth-child(2)]:italic [&:nth-child(2)]:text-champagne"
            />
            <div className={`mt-8 grid gap-8 transition-[opacity,transform] delay-[1100ms] duration-[1400ms] ease-[var(--ease-cinema)] md:grid-cols-12 ${introPlayed ? 'opacity-100' : 'translate-y-4 opacity-0'}`}>
              <p className="max-w-md text-base leading-relaxed text-ivory/75 md:col-span-5 md:text-[1.05rem]">{SITE.positioning}</p>
              <div className="flex flex-wrap items-center gap-4 md:col-span-7 md:justify-end">
                <ButtonLink href="#consult" magnetic onClick={() => track('cta_click', { location: 'hero' })}>
                  Begin a consultation
                </ButtonLink>
                <ButtonLink href="#lab" variant="ghost" arrow={false} onClick={() => track('cta_click', { location: 'hero_skip' })}>
                  Skip to the work
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>

        {/* B — Approach */}
        <Chapter id="approach" index="B" label="Approach" title={['Every threshold', 'is a decision.']} className="left-0 top-[22%] max-w-xl">
          Visitors decide in seconds whether a business feels considered. We design the approach itself — scale, light, pacing — so the first impression already
          feels like the work.
        </Chapter>

        {/* C — Transition */}
        <Chapter id="transition" index="C" label="Transition" title={['From presence', 'to experience.']} className="inset-x-0 bottom-[14%] mx-auto max-w-2xl text-center" center>
          A website informs. An experience moves people through it — with intent, at the right pace, toward a decision.
        </Chapter>

        {/* D — Intelligence */}
        <Chapter id="intelligence" index="D" label="Intelligence" title={['Every visitor,', 'understood.']} className="left-0 bottom-[10%] max-w-xl">
          Beneath the surface, an intelligent journey gathers context, classifies intent and prepares the next step — so the business answers as if it were expecting
          you.
          <ol className="mt-6 grid grid-cols-2 gap-x-6 gap-y-2 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-champagne/80 sm:grid-cols-3">
            {JOURNEY_STAGES.map((s, i) => (
              <li key={s}>
                <span className="text-gold">0{i + 1}</span> {s}
              </li>
            ))}
          </ol>
        </Chapter>

        {/* E — Experience */}
        <div data-overlay="experience" className="absolute inset-x-0 bottom-[12%] px-5 text-center opacity-0 sm:px-8">
          <p className="eyebrow text-champagne/70">
            <span className="font-mono text-gold">E</span> — Experience
          </p>
          <p className="display mx-auto mt-5 max-w-3xl text-[clamp(2.4rem,6vw,5rem)] text-ivory">
            Now, step inside <em className="text-champagne">the work.</em>
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <ButtonLink href="#lab">Transformation Lab</ButtonLink>
            <ButtonLink href="#intelligence" variant="ghost">
              Intelligence demo
            </ButtonLink>
          </div>
        </div>

        {/* Chapter rail */}
        <nav aria-label="Threshold chapters" className="absolute right-4 top-1/2 hidden -translate-y-1/2 md:block lg:right-10">
          <div className="absolute right-[5px] top-1 bottom-1 w-px bg-champagne/15">
            <div data-progress className="h-full w-full origin-top scale-y-0 bg-gold" />
          </div>
          <ol className="relative space-y-7">
            {CHAPTERS.map((c, i) => (
              <li key={c.id} className="flex justify-end">
                <button
                  type="button"
                  onClick={() => jumpTo(c.start)}
                  aria-current={chapter === i ? 'step' : undefined}
                  className="group flex items-center justify-end gap-3 py-1 text-right"
                >
                  <span className={`text-[0.62rem] font-semibold uppercase tracking-[0.24em] transition-all duration-500 ${chapter === i ? 'text-ivory' : 'text-ivory/0 group-hover:text-ivory/60 group-focus-visible:text-ivory/60'}`}>
                    {c.label}
                  </span>
                  <span className={`block h-[11px] w-[11px] rotate-45 border transition-colors duration-500 ${chapter === i ? 'border-gold bg-gold' : 'border-champagne/40 bg-midnight'}`} />
                </button>
              </li>
            ))}
          </ol>
          <p className="eyebrow mt-10 text-right text-[0.56rem] text-champagne/50">Scroll to enter</p>
        </nav>

        {tier === 'poster' && (
          <p className="absolute left-5 top-24 font-mono text-[0.6rem] uppercase tracking-[0.2em] text-champagne/40 sm:left-8 lg:left-12">Still frames · interactive 3D on capable devices</p>
        )}
      </div>
    </section>
  )
}

function Chapter({
  id,
  index,
  label,
  title,
  className,
  center,
  children,
}: {
  id: string
  index: string
  label: string
  title: [string, string]
  className?: string
  center?: boolean
  children: React.ReactNode
}) {
  return (
    <div data-overlay={id} className={`absolute px-5 opacity-0 sm:px-8 lg:px-12 ${className ?? ''}`}>
      <p className={`eyebrow flex items-center gap-3 text-champagne/70 ${center ? 'justify-center' : ''}`}>
        <span className="font-mono text-gold">{index}</span>
        <span className="h-px w-8 bg-champagne/30" />
        {label}
      </p>
      <h2 className="display mt-5 text-[clamp(2.4rem,5.6vw,4.75rem)] text-ivory">
        {title[0]}
        <br />
        <em className="text-champagne">{title[1]}</em>
      </h2>
      <div className="mt-6 text-[1.02rem] leading-relaxed text-ivory/75">{children}</div>
    </div>
  )
}
