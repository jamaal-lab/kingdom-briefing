import { useEffect, useRef, useState } from 'react'
import { Reveal, ImmersiveImage } from '~/motion'
import { MEDIA } from '~/lib/media'

const STAGES = [
  {
    id: 'direct',
    label: 'Direct',
    title: 'Find the story.',
    body: 'Before anything is designed, we decide what the website must make people feel, understand and do.',
    items: ['Brand and audience discovery', 'Narrative and page architecture', 'Customer-journey design', 'Copy guidance'],
    icon: 'M4 20l4-12 4 6 4-10 4 16',
  },
  {
    id: 'design',
    label: 'Design',
    title: 'Make it unmistakable.',
    body: 'Art direction, editorial layout and a motion language that belongs only to your brand.',
    items: ['Art direction and visual identity on the web', 'Responsive editorial layouts', 'Motion and interaction design', 'Imagery direction'],
    icon: 'M4 18h16M6 18V8l6-4 6 4v10',
  },
  {
    id: 'build',
    label: 'Build',
    title: 'Engineer it to last.',
    body: 'Production-grade code that is fast, accessible and maintainable — tested before it ships.',
    items: ['React, TypeScript and real-time 3D where it earns its place', 'Performance and accessibility', 'Responsive images and fallbacks', 'Analytics-ready events'],
    icon: 'M8 7l-5 5 5 5M16 7l5 5-5 5',
  },
  {
    id: 'intelligence',
    label: 'Intelligence',
    title: 'Answer like you expected them.',
    body: 'Journeys that gather context, understand intent and prepare the next step for your team.',
    items: ['Guided inquiries and intake', 'Classification and routing', 'Drafted follow-ups for review', 'Organised operator summaries'],
    icon: 'M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M6 18l2.5-2.5M15.5 8.5L18 6',
  },
] as const

/** Lifecycle rail: four stages on one line, the rail fills as the section scrolls into view. */
export function Solutions() {
  const [active, setActive] = useState(0)
  const rail = useRef<HTMLDivElement>(null)
  const [fill, setFill] = useState(0)

  useEffect(() => {
    const el = rail.current
    if (!el) return
    let raf = 0
    const update = () => {
      raf = 0
      const r = el.getBoundingClientRect()
      const p = Math.min(1, Math.max(0, (window.innerHeight * 0.85 - r.top) / (window.innerHeight * 0.6)))
      setFill(p)
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <section id="solutions" aria-labelledby="solutions-title" className="relative overflow-hidden bg-midnight px-5 py-24 sm:px-8 md:py-32 lg:px-12">
      {/* The journey network from the Threshold, drifting behind the stages. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-45">
        <ImmersiveImage asset={MEDIA.thresholdIntelligence} portrait={MEDIA.thresholdIntelligencePortrait} zoom={1.25} drift={14} className="h-full w-full" />
      </div>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-b from-midnight via-midnight/70 to-midnight" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
      <div className="relative mx-auto max-w-[1440px]">
        <p className="flex items-center gap-4 text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-champagne/80">
          <span className="h-px w-10 bg-gold" /> Digital solutions
        </p>
        <Reveal>
          <h2 id="solutions-title" className="v2-head mt-7 max-w-4xl text-[clamp(2.6rem,5.4vw,4.8rem)] text-ivory">
            More than a website.
            <span className="block">
              <span className="v2-accent">A complete digital experience.</span>
            </span>
          </h2>
        </Reveal>
        <Reveal delay={120}>
          <p className="mt-6 max-w-xl text-[1.05rem] leading-relaxed text-ivory/70">From the first impression to the next opportunity, direction, design, engineering and intelligence work as one.</p>
        </Reveal>

        <div ref={rail} className="relative mt-14 hidden md:block" aria-hidden="true">
          <div className="h-px w-full bg-champagne/15" />
          <div className="absolute left-0 top-0 h-px w-full origin-left bg-gradient-to-r from-gold to-champagne" style={{ transform: `scaleX(${fill})` }} />
          <div className="mt-4 grid grid-cols-4">
            {STAGES.map((s, i) => (
              <span key={s.id} className={`text-[0.66rem] font-semibold uppercase tracking-[0.26em] transition-colors ${fill >= i / 4 + 0.05 ? 'text-champagne' : 'text-ivory/60'}`}>
                {s.label}
              </span>
            ))}
          </div>
        </div>

        <ol className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {STAGES.map((s, i) => (
            <Reveal as="li" key={s.id} delay={i * 90}>
              <article
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                tabIndex={0}
                className={`h-full rounded-[16px] border p-6 transition-colors duration-500 ${active === i ? 'border-gold/60 bg-midnight/80 backdrop-blur-sm' : 'border-line bg-midnight/60 backdrop-blur-sm'}`}
              >
                <div className="flex items-start justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-champagne/30 text-champagne">
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
                      <path d={s.icon} />
                    </svg>
                  </span>
                  <span className="font-mono text-2xl text-ivory/50">0{i + 1}</span>
                </div>
                <p className="mt-6 text-[0.66rem] font-semibold uppercase tracking-[0.26em] text-gold">{s.label}</p>
                <h3 className="mt-2 text-[1.35rem] font-semibold tracking-tight text-ivory">{s.title}</h3>
                <p className="mt-3 text-[0.92rem] leading-relaxed text-ivory/70">{s.body}</p>
                <ul className="mt-6 space-y-2 border-t border-line pt-5">
                  {s.items.map((x) => (
                    <li key={x} className="flex gap-3 text-[0.86rem] text-ivory/85">
                      <span className="mt-[0.6em] h-px w-3 shrink-0 bg-gold" aria-hidden="true" />
                      {x}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
