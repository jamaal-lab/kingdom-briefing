import { useCallback, useEffect, useRef, useState } from 'react'
import { SectionHeader } from '~/components/site/SectionHeader'
import { Button } from '~/components/site/Button'
import { Reveal, useInView } from '~/motion'
import { track } from '~/lib/analytics'
import { PreviewDialog } from './PreviewDialog'

const AFTER = '/concepts/atelier-north'
const BEFORE = '/concepts/atelier-north/before'

type Device = 'desktop' | 'mobile'
const VIEWPORT: Record<Device, { w: number; h: number }> = {
  desktop: { w: 1440, h: 900 },
  mobile: { w: 390, h: 844 },
}

const SECTIONS = [
  { id: 'arrival', label: 'Arrival' },
  { id: 'services', label: 'Storytelling' },
  { id: 'work', label: 'Work' },
  { id: 'inquiry', label: 'Inquiry' },
] as const

const CHANGES = [
  { area: 'Arrival', section: 'arrival', before: 'A stretched banner, “Welcome to…”, and a bright blue “Learn More”.', after: 'A full-bleed cinematic hero with a point of view and two clear paths: begin a project, or see the work.' },
  { area: 'Navigation', section: 'arrival', before: 'Six generic links — including “News” with no news — and a phone banner.', after: 'Four meaningful destinations that track where you are, plus one consistent primary action.' },
  { area: 'Storytelling', section: 'services', before: 'Three emoji cards: Residential, Commercial, Interiors.', after: 'Disciplines told as a scroll-linked story, each with its own image and point of view.' },
  { area: 'The work', section: 'work', before: 'The same photographs, as tiny thumbnails labelled “Project 1”.', after: 'An editorial, filterable gallery with project narratives and a keyboard-friendly lightbox.' },
  { area: 'Conversion', section: 'inquiry', before: 'One contact form. The visitor does all the work, then waits.', after: 'A guided four-question brief that recommends a specific next step.' },
  { area: 'Motion', section: 'arrival', before: 'None — or an auto-rotating carousel.', after: 'Mask reveals, slow drift and section continuity; restrained, and off for reduced-motion users.' },
] as const

/** A same-origin iframe rendered at a real device viewport and scaled to fit. */
function DeviceFrame({ src, device, scale, title, frameRef, onLoad }: { src: string; device: Device; scale: number; title: string; frameRef?: (el: HTMLIFrameElement | null) => void; onLoad?: () => void }) {
  const vp = VIEWPORT[device]
  return (
    <iframe
      ref={frameRef}
      src={src}
      title={title}
      tabIndex={-1}
      aria-hidden="true"
      onLoad={onLoad}
      width={vp.w}
      height={vp.h}
      className="pointer-events-none absolute left-0 top-0 origin-top-left border-0 bg-white"
      style={{ width: vp.w, height: vp.h, transform: `scale(${scale})` }}
    />
  )
}

export function TransformationLab() {
  const [device, setDevice] = useState<Device>('desktop')
  const [pos, setPos] = useState(50)
  const [scale, setScale] = useState(0.5)
  const [loaded, setLoaded] = useState(0)
  const [section, setSection] = useState<string>('arrival')
  const [preview, setPreview] = useState(false)
  const [near, nearInView] = useInView<HTMLDivElement>({ rootMargin: '900px 0px', threshold: 0 })
  const viewport = useRef<HTMLDivElement>(null)
  const frames = useRef<(HTMLIFrameElement | null)[]>([])
  const dragging = useRef(false)

  // Phones start on the phone view; it is what their visitors would see.
  useEffect(() => {
    if (window.innerWidth < 640) setDevice('mobile')
  }, [])

  // Fit the virtual device viewport to the available width.
  useEffect(() => {
    const el = viewport.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => setScale(e.contentRect.width / VIEWPORT[device].w))
    ro.observe(el)
    return () => ro.disconnect()
  }, [device, nearInView])

  const fromPointer = useCallback((clientX: number) => {
    const r = viewport.current?.getBoundingClientRect()
    if (!r) return
    setPos(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)))
  }, [])

  const jump = (id: string) => {
    setSection(id)
    track('lab_jump', { section: id, device })
    for (const f of frames.current) {
      const doc = f?.contentDocument
      const target = doc?.getElementById(id)
      if (!doc || !target) continue
      const top = target.getBoundingClientRect().top + (f.contentWindow?.scrollY ?? 0)
      f.contentWindow?.scrollTo({ top, behavior: 'smooth' })
    }
  }

  const onKey = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 10 : 2
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') setPos((p) => Math.max(0, p - step))
    else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') setPos((p) => Math.min(100, p + step))
    else if (e.key === 'Home') setPos(0)
    else if (e.key === 'End') setPos(100)
    else return
    e.preventDefault()
  }

  const vp = VIEWPORT[device]
  const ready = loaded >= 2

  return (
    <section id="lab" aria-labelledby="lab-title" className="relative bg-midnight px-5 py-28 sm:px-8 md:py-40 lg:px-12">
      <div className="mx-auto max-w-[1440px]">
        <SectionHeader id="lab-title" index="02" eyebrow="Transformation Lab" title={['Same business.', 'Different experience.']}>
          <p>
            <strong className="font-semibold text-ivory">Atelier North</strong> is a fictional architecture practice we created to show what changes when a website is
            designed as an experience. Same photographs, same services. Drag the divider to compare.
          </p>
          <p className="mt-5 inline-flex items-center gap-2 border border-gold/40 px-3 py-1.5 font-mono text-[0.66rem] uppercase tracking-[0.16em] text-champagne">
            <span className="h-1.5 w-1.5 rounded-full bg-gold" aria-hidden="true" /> Fictional design concept · not a client case study
          </p>
        </SectionHeader>

        {/* Controls */}
        <Reveal className="mt-14 flex flex-col gap-4 border-y border-line py-4 lg:flex-row lg:items-center lg:justify-between" variant="fade">
          <div role="radiogroup" aria-label="Device" className="flex gap-1">
            {(['desktop', 'mobile'] as const).map((d) => (
              <button
                key={d}
                type="button"
                role="radio"
                aria-checked={device === d}
                onClick={() => {
                  setDevice(d)
                  track('lab_device', { device: d })
                }}
                className={`min-h-11 px-4 text-[0.68rem] font-semibold uppercase tracking-[0.2em] transition-colors ${device === d ? 'bg-champagne text-midnight' : 'text-ivory/70 hover:text-ivory'}`}
              >
                {d === 'desktop' ? 'Desktop · 1440' : 'Mobile · 390'}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-x-1 gap-y-2" role="group" aria-label="Compare a section">
            <span className="mr-2 text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-mist">Compare</span>
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                type="button"
                aria-pressed={section === s.id}
                onClick={() => jump(s.id)}
                disabled={!ready}
                className={`min-h-11 px-3 text-[0.68rem] font-semibold uppercase tracking-[0.18em] transition-colors disabled:opacity-40 ${section === s.id ? 'text-gold' : 'text-ivory/70 hover:text-ivory'}`}
              >
                {s.label}
              </button>
            ))}
          </div>
          <Button
            variant="ghost"
            arrow
            className="!min-h-11"
            onClick={() => {
              setPreview(true)
              track('lab_preview_open', { device })
            }}
          >
            Enter full preview
          </Button>
        </Reveal>

        {/* Stage */}
        <div ref={near} className={`mx-auto mt-10 ${device === 'mobile' ? 'max-w-[380px]' : ''}`}>
          <div className={device === 'desktop' ? 'overflow-hidden rounded-[10px] border border-white/10 bg-charcoal shadow-[0_60px_120px_-40px_rgba(0,0,0,0.8)]' : 'rounded-[46px] border border-white/15 bg-[#05080e] p-3 shadow-[0_60px_120px_-40px_rgba(0,0,0,0.85)]'}>
            {device === 'desktop' && (
              <div className="flex h-9 items-center gap-2 border-b border-white/10 px-4" aria-hidden="true">
                <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                <span className="mx-auto rounded bg-white/5 px-10 py-1 font-mono text-[10px] text-white/65">atelier-north · concept</span>
              </div>
            )}
            <div
              ref={viewport}
              className={`relative touch-none select-none overflow-hidden bg-[#111] ${device === 'mobile' ? 'rounded-[34px]' : ''}`}
              style={{ aspectRatio: `${vp.w} / ${vp.h}` }}
              onPointerDown={(e) => {
                dragging.current = true
                ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
                fromPointer(e.clientX)
              }}
              onPointerMove={(e) => dragging.current && fromPointer(e.clientX)}
              onPointerUp={() => {
                dragging.current = false
                track('lab_compare', { device, position: Math.round(pos) })
              }}
            >
              {nearInView && (
                <>
                  <DeviceFrame src={BEFORE} device={device} scale={scale} title="Before: Atelier North template site (fictional)" frameRef={(el) => void (frames.current[0] = el)} onLoad={() => setLoaded((n) => n + 1)} />
                  <div className="absolute inset-0" style={{ clipPath: `inset(0 0 0 ${pos}%)` }}>
                    <DeviceFrame src={AFTER} device={device} scale={scale} title="After: Atelier North concept site (fictional)" frameRef={(el) => void (frames.current[1] = el)} onLoad={() => setLoaded((n) => n + 1)} />
                  </div>
                </>
              )}
              {!ready && (
                <div className="absolute inset-0 flex items-center justify-center bg-charcoal">
                  <span className="font-mono text-[0.66rem] uppercase tracking-[0.2em] text-champagne/60 motion-safe:animate-[pulse-dot_1.6s_ease-in-out_infinite]">Loading both versions…</span>
                </div>
              )}

              <span className="pointer-events-none absolute left-3 top-3 bg-black/70 px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-white">Before</span>
              <span className="pointer-events-none absolute right-3 top-3 bg-champagne px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-midnight">After</span>

              {/* Divider + handle */}
              <div className="pointer-events-none absolute inset-y-0 w-px bg-champagne shadow-[0_0_24px_rgba(231,210,160,0.6)]" style={{ left: `${pos}%` }} />
              <div
                role="slider"
                tabIndex={0}
                aria-label="Compare before and after"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(pos)}
                aria-valuetext={`${Math.round(100 - pos)}% showing the redesigned site`}
                onKeyDown={onKey}
                className="absolute top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-full border border-champagne bg-midnight/90 text-champagne shadow-lg backdrop-blur"
                style={{ left: `${pos}%` }}
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                  <path d="M9 6l-5 6 5 6M15 6l5 6-5 6" fill="none" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </div>
            </div>
          </div>
          <p className="mt-4 text-center text-[0.72rem] text-mist">
            Live pages, not screenshots — rendered at a real {vp.w}px viewport. Use the arrow keys on the divider, or drag.
          </p>
        </div>

        {/* What changed */}
        <div className="mt-24">
          <Reveal as="h3" className="eyebrow text-champagne/70" variant="fade">
            What actually changed
          </Reveal>
          <div className="mt-6 hidden grid-cols-12 gap-6 border-b border-line pb-3 text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-mist md:grid" aria-hidden="true">
            <span className="col-span-2">Area</span>
            <span className="col-span-4">Before</span>
            <span className="col-span-5">After</span>
          </div>
          <ul>
            {CHANGES.map((c, i) => (
              <Reveal as="li" key={c.area} delay={i * 60} className="border-b border-line">
                <button type="button" onClick={() => jump(c.section)} disabled={!ready} className="group grid w-full gap-2 py-6 text-left md:grid-cols-12 md:gap-6">
                  <span className="display text-2xl text-ivory md:col-span-2">{c.area}</span>
                  <span className="text-[0.95rem] leading-relaxed text-mist md:col-span-4">
                    <span className="mr-2 font-mono text-[0.6rem] uppercase tracking-[0.2em] text-white/40 md:hidden">Before</span>
                    {c.before}
                  </span>
                  <span className="text-[0.95rem] leading-relaxed text-ivory/90 md:col-span-5">
                    <span className="mr-2 font-mono text-[0.6rem] uppercase tracking-[0.2em] text-gold md:hidden">After</span>
                    {c.after}
                  </span>
                  <span className="hidden self-center text-right font-mono text-[0.6rem] uppercase tracking-[0.2em] text-champagne/0 transition-colors group-hover:text-champagne/80 group-focus-visible:text-champagne/80 md:col-span-1 md:block">
                    View →
                  </span>
                </button>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>

      <PreviewDialog open={preview} onClose={() => setPreview(false)} before={BEFORE} after={AFTER} />
    </section>
  )
}
