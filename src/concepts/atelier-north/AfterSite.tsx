import { useEffect, useMemo, useRef, useState } from 'react'
import { Picture } from '~/components/site/Picture'
import { Reveal, SplitText, useInView } from '~/motion'
import { PROJECTS, DISCIPLINES, PROCESS, INQUIRY_STEPS, type ProjectType } from './data'
import { MEDIA } from '~/lib/media'

/**
 * ATELIER NORTH — "after". A fictional architecture practice, designed by
 * Bridge Web to show what a considered website does differently: cinematic
 * arrival, meaningful navigation, service storytelling, an interactive
 * gallery, and a guided inquiry that respects the visitor's time.
 */

const NAV = [
  { href: '#practice', label: 'Practice' },
  { href: '#services', label: 'Disciplines' },
  { href: '#work', label: 'Work' },
  { href: '#process', label: 'Process' },
]

export function AfterSite() {
  return (
    <div className="atelier min-h-screen bg-[#EEE9E1] font-sans text-[#1B1A17] antialiased">
      <ConceptBadge />
      <Header />
      <main>
        <Hero />
        <Practice />
        <Disciplines />
        <Work />
        <Process />
        <Inquiry />
      </main>
      <Footer />
    </div>
  )
}

export function ConceptBadge({ tone = 'light' }: { tone?: 'light' | 'plain' }) {
  return (
    <div
      role="note"
      className={`fixed bottom-3 left-3 z-[70] max-w-[calc(100%-1.5rem)] rounded-full px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] shadow-sm ${
        tone === 'light' ? 'bg-[#1B1A17]/85 text-[#EEE9E1] backdrop-blur' : 'bg-yellow-200 text-black'
      }`}
    >
      Fictional design concept by Bridge Web — not a real firm
    </div>
  )
}

function Header() {
  const [solid, setSolid] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    const sections = NAV.map((n) => document.querySelector(n.href)).filter(Boolean) as Element[]
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(`#${e.target.id}`)),
      { rootMargin: '-45% 0px -50% 0px' },
    )
    sections.forEach((s) => io.observe(s))
    return () => {
      window.removeEventListener('scroll', onScroll)
      io.disconnect()
    }
  }, [])

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-colors duration-700 ${solid || open ? 'bg-[#EEE9E1]/92 text-[#1B1A17] shadow-[0_1px_0_rgba(27,26,23,0.08)] backdrop-blur' : 'text-[#F6F1E8]'}`}>
      <nav aria-label="Atelier North" className="mx-auto flex h-16 max-w-[1320px] items-center justify-between px-5 md:h-20 md:px-10">
        <a href="#arrival" className="font-atelier text-[1.35rem] tracking-[0.06em] md:text-2xl">
          Atelier <span className="italic">North</span>
        </a>
        <ul className="hidden items-center gap-9 text-[13px] tracking-[0.04em] md:flex">
          {NAV.map((n) => (
            <li key={n.href}>
              <a href={n.href} aria-current={active === n.href ? 'true' : undefined} className="relative py-2 opacity-85 transition-opacity hover:opacity-100">
                {n.label}
                <span className={`absolute inset-x-0 -bottom-0.5 h-px origin-left bg-current transition-transform duration-500 ${active === n.href ? 'scale-x-100' : 'scale-x-0'}`} />
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <a href="#inquiry" className={`hidden rounded-full border px-5 py-2.5 text-[12px] font-semibold tracking-[0.06em] transition-colors md:inline-block ${solid ? 'border-[#1B1A17] hover:bg-[#1B1A17] hover:text-[#EEE9E1]' : 'border-white/60 hover:bg-white hover:text-[#1B1A17]'}`}>
            Begin a project
          </a>
          <button type="button" className="flex h-11 w-11 items-center justify-center md:hidden" aria-expanded={open} aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen((o) => !o)}>
            <span className="relative block h-3 w-6">
              <span className={`absolute left-0 h-px w-6 bg-current transition-transform ${open ? 'top-1.5 rotate-45' : 'top-0'}`} />
              <span className={`absolute left-0 h-px w-6 bg-current transition-transform ${open ? 'top-1.5 -rotate-45' : 'top-3'}`} />
            </span>
          </button>
        </div>
      </nav>
      {open && (
        <ul className="border-t border-black/10 px-5 pb-6 md:hidden">
          {[...NAV, { href: '#inquiry', label: 'Begin a project' }].map((n) => (
            <li key={n.href}>
              <a href={n.href} onClick={() => setOpen(false)} className="block border-b border-black/10 py-4 font-atelier text-2xl">
                {n.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </header>
  )
}

function Hero() {
  const [play, setPlay] = useState(false)
  useEffect(() => {
    const id = setTimeout(() => setPlay(true), 150)
    return () => clearTimeout(id)
  }, [])
  return (
    <section id="arrival" className="relative h-[100svh] min-h-[560px] overflow-hidden bg-[#1B1A17] text-[#F6F1E8]">
      <div className="absolute inset-0 motion-safe:animate-[drift_24s_linear_infinite_alternate]">
        <Picture asset={MEDIA.halden} priority alt="" className="block h-full w-full" imgClassName="h-full w-full object-cover object-[60%_50%]" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/35" />
      <div className="relative mx-auto flex h-full max-w-[1320px] flex-col justify-end px-5 pb-14 md:px-10 md:pb-20">
        <p className={`text-[11px] font-semibold uppercase tracking-[0.3em] transition-opacity delay-200 duration-1000 ${play ? 'opacity-90' : 'opacity-0'}`}>Architecture · Northern lake country</p>
        <SplitText
          as="h1"
          play={play}
          delay={250}
          lines={['Shaped by light,', 'land, and the way', 'you live.']}
          className="mt-5 max-w-4xl font-atelier text-[clamp(2.6rem,7.4vw,6.5rem)] font-light leading-[0.98] tracking-[-0.01em]"
          lineClassName="[&:nth-child(3)]:italic"
        />
        <div className={`mt-8 flex flex-col gap-6 transition-[opacity,transform] delay-[900ms] duration-1000 md:flex-row md:items-end md:justify-between ${play ? 'opacity-100' : 'translate-y-3 opacity-0'}`}>
          <p className="max-w-md text-[15px] leading-relaxed text-white/80">
            An independent practice designing homes, galleries and pavilions that belong to their landscape — and age well within it.
          </p>
          <div className="flex flex-wrap gap-3">
            <a href="#inquiry" className="rounded-full bg-[#F6F1E8] px-6 py-3.5 text-[13px] font-semibold text-[#1B1A17] transition-transform hover:-translate-y-0.5">
              Begin a project
            </a>
            <a href="#work" className="rounded-full border border-white/50 px-6 py-3.5 text-[13px] font-semibold transition-colors hover:bg-white/10">
              View the work
            </a>
          </div>
        </div>
        <p className="mt-10 border-t border-white/20 pt-4 text-[11px] uppercase tracking-[0.2em] text-white/60">Halden House — lakeside residence · concept</p>
      </div>
    </section>
  )
}

function Practice() {
  return (
    <section id="practice" className="mx-auto max-w-[1320px] px-5 py-24 md:px-10 md:py-36">
      <div className="grid gap-12 md:grid-cols-12">
        <Reveal className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#9A6B4A] md:col-span-3">The practice</Reveal>
        <div className="md:col-span-9">
          <SplitText
            as="p"
            lines={['We design buildings the way', 'good landscapes are made:', 'slowly, specifically, and for', 'the long term.']}
            className="font-atelier text-[clamp(1.9rem,4.2vw,3.6rem)] font-light leading-[1.08]"
          />
          <div className="mt-14 grid gap-10 sm:grid-cols-3">
            {[
              ['Site first', 'Every project begins with a season of observation — sun, wind, water and view.'],
              ['Light as material', 'Openings are composed for how light moves through a day, not for how a drawing looks.'],
              ['Built to age', 'Honest materials, chosen to weather well and to be repaired rather than replaced.'],
            ].map(([t, b], i) => (
              <Reveal key={t} delay={i * 120}>
                <h3 className="font-atelier text-2xl">{t}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-[#1B1A17]/70">{b}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function Disciplines() {
  const [current, setCurrent] = useState(0)
  const refs = useRef<(HTMLElement | null)[]>([])
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setCurrent(Number((e.target as HTMLElement).dataset.index))),
      { rootMargin: '-45% 0px -45% 0px' },
    )
    refs.current.forEach((r) => r && io.observe(r))
    return () => io.disconnect()
  }, [])

  return (
    <section id="services" className="bg-[#1B1A17] text-[#EEE9E1]">
      <div className="mx-auto grid max-w-[1320px] gap-10 px-5 py-24 md:grid-cols-2 md:gap-16 md:px-10 md:py-32">
        <div className="md:sticky md:top-24 md:h-[calc(100svh-8rem)]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#C9A27A]">Disciplines</p>
          <div className="relative mt-6 aspect-[4/5] overflow-hidden md:aspect-auto md:h-[calc(100%-3rem)]">
            {DISCIPLINES.map((d, i) => (
              <div key={d.id} className={`absolute inset-0 transition-[opacity,transform] duration-[1200ms] ease-[var(--ease-cinema)] ${current === i ? 'scale-100 opacity-100' : 'scale-105 opacity-0'}`} aria-hidden={current !== i}>
                <Picture asset={d.image} alt={d.image.alt} sizes="(min-width: 768px) 50vw, 100vw" className="block h-full w-full" imgClassName="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        </div>
        <ol className="md:py-[18vh]">
          {DISCIPLINES.map((d, i) => (
            <li
              key={d.id}
              ref={(el) => void (refs.current[i] = el)}
              data-index={i}
              className={`border-t border-white/15 py-12 transition-opacity duration-700 md:min-h-[52vh] ${current === i ? 'opacity-100' : 'md:opacity-40'}`}
            >
              <span className="font-mono text-xs text-[#C9A27A]">0{i + 1}</span>
              <h3 className="mt-4 font-atelier text-[clamp(2rem,4vw,3.4rem)] font-light leading-none">{d.title}</h3>
              <p className="mt-5 max-w-md text-lg leading-relaxed text-white/85">{d.lede}</p>
              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/60">{d.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

function Work() {
  const [filter, setFilter] = useState<'All' | ProjectType>('All')
  const [open, setOpen] = useState<number | null>(null)
  const shown = useMemo(() => PROJECTS.map((p, i) => ({ p, i })).filter(({ p }) => filter === 'All' || p.type === filter), [filter])

  return (
    <section id="work" className="mx-auto max-w-[1320px] px-5 py-24 md:px-10 md:py-36">
      <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#9A6B4A]">Selected work</p>
          <SplitText lines={['Five places,', 'each made for one site.']} className="mt-5 font-atelier text-[clamp(2.2rem,5vw,4.2rem)] font-light leading-[1.02]" lineClassName="[&:nth-child(2)]:italic" />
        </div>
        <div role="group" aria-label="Filter projects" className="flex flex-wrap gap-2">
          {(['All', 'Residential', 'Cultural', 'Pavilions'] as const).map((f) => (
            <button
              key={f}
              type="button"
              aria-pressed={filter === f}
              onClick={() => setFilter(f)}
              className={`rounded-full border px-4 py-2 text-[13px] transition-colors ${filter === f ? 'border-[#1B1A17] bg-[#1B1A17] text-[#EEE9E1]' : 'border-[#1B1A17]/25 hover:border-[#1B1A17]'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <ul className="mt-14 grid gap-x-8 gap-y-14 md:grid-cols-12">
        {shown.map(({ p, i }, k) => (
          <li key={p.id} className={k % 3 === 0 ? 'md:col-span-7' : k % 3 === 1 ? 'md:col-span-5 md:mt-24' : 'md:col-span-6 md:col-start-4'}>
            <button type="button" onClick={() => setOpen(i)} className="group block w-full text-left" aria-label={`Open ${p.name}`}>
              <div className={`overflow-hidden bg-[#d8d1c6] ${k % 3 === 1 ? 'aspect-[4/5]' : 'aspect-[16/10]'}`}>
                <Picture asset={p.image} alt={p.image.alt} sizes="(min-width: 768px) 55vw, 100vw" className="block h-full w-full" imgClassName="h-full w-full object-cover transition-transform duration-[1400ms] ease-[var(--ease-cinema)] group-hover:scale-[1.045]" />
              </div>
              <div className="mt-4 flex items-baseline justify-between gap-4 border-t border-[#1B1A17]/15 pt-4">
                <h3 className="font-atelier text-2xl md:text-[1.75rem]">{p.name}</h3>
                <span className="text-[11px] uppercase tracking-[0.2em] text-[#1B1A17]/55">{p.type}</span>
              </div>
              <p className="mt-2 max-w-lg text-[15px] leading-relaxed text-[#1B1A17]/70">{p.summary}</p>
            </button>
          </li>
        ))}
      </ul>
      <Lightbox index={open} onClose={() => setOpen(null)} onNavigate={setOpen} />
    </section>
  )
}

function Lightbox({ index, onClose, onNavigate }: { index: number | null; onClose: () => void; onNavigate: (i: number) => void }) {
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (index !== null && !d.open) d.showModal()
    if (index === null && d.open) d.close()
  }, [index])
  useEffect(() => {
    if (index === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') onNavigate((index + 1) % PROJECTS.length)
      if (e.key === 'ArrowLeft') onNavigate((index - 1 + PROJECTS.length) % PROJECTS.length)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [index, onNavigate])
  const p = index !== null ? PROJECTS[index] : null
  return (
    <dialog
      ref={ref}
      onClose={onClose}
      aria-label={p ? p.name : 'Project'}
      className="m-0 h-full max-h-none w-full max-w-none bg-[#141311] p-0 text-[#EEE9E1] backdrop:bg-black/70"
    >
      {p && (
        <div className="grid h-full md:grid-cols-[1fr_380px]">
          <div className="relative min-h-[45svh] overflow-hidden">
            <Picture key={p.id} asset={p.image} alt={p.image.alt} sizes="(min-width: 768px) 70vw, 100vw" className="block h-full w-full" imgClassName="h-full w-full object-cover motion-safe:animate-[arrival_1200ms_var(--ease-cinema)_both]" />
          </div>
          <div className="flex flex-col overflow-y-auto p-6 md:p-10">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#C9A27A]">{p.type}</span>
              <button type="button" onClick={onClose} className="rounded-full border border-white/25 px-4 py-2 text-[12px] hover:bg-white/10" autoFocus>
                Close
              </button>
            </div>
            <h3 className="mt-8 font-atelier text-4xl font-light">{p.name}</h3>
            <p className="mt-5 text-[15px] leading-relaxed text-white/75">{p.detail}</p>
            <dl className="mt-8 divide-y divide-white/10 border-y border-white/10 text-[13px]">
              {p.facts.map(([k, v]) => (
                <div key={k} className="flex justify-between gap-6 py-3">
                  <dt className="text-white/50">{k}</dt>
                  <dd className="text-right">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-auto flex items-center justify-between gap-3 pt-10">
              <button type="button" className="rounded-full border border-white/25 px-4 py-2.5 text-[12px] hover:bg-white/10" onClick={() => onNavigate((index! - 1 + PROJECTS.length) % PROJECTS.length)}>
                ← Previous
              </button>
              <a href="#inquiry" onClick={onClose} className="text-[12px] underline underline-offset-4">
                Discuss a similar project
              </a>
              <button type="button" className="rounded-full border border-white/25 px-4 py-2.5 text-[12px] hover:bg-white/10" onClick={() => onNavigate((index! + 1) % PROJECTS.length)}>
                Next →
              </button>
            </div>
          </div>
        </div>
      )}
    </dialog>
  )
}

function Process() {
  const [ref, inView] = useInView<HTMLOListElement>()
  return (
    <section id="process" className="bg-[#E4DDD2]">
      <div className="mx-auto max-w-[1320px] px-5 py-24 md:px-10 md:py-32">
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#9A6B4A]">How we work</p>
        <SplitText lines={['Four stages, one conversation.']} className="mt-5 font-atelier text-[clamp(2.2rem,4.6vw,3.8rem)] font-light" />
        <ol ref={ref} className="relative mt-16 grid gap-10 md:grid-cols-4 md:gap-8">
          <span aria-hidden="true" className={`absolute left-0 top-0 hidden h-px w-full origin-left bg-[#1B1A17]/30 transition-transform duration-[1800ms] ease-[var(--ease-cinema)] md:block ${inView ? 'scale-x-100' : 'scale-x-0'}`} />
          {PROCESS.map((s, i) => (
            <li key={s.step} className={`transition-[opacity,transform] duration-1000 ease-[var(--ease-cinema)] md:pt-8 ${inView ? 'opacity-100' : 'translate-y-4 opacity-0'}`} style={{ transitionDelay: `${300 + i * 140}ms` }}>
              <span className="font-mono text-xs text-[#9A6B4A]">{s.step}</span>
              <h3 className="mt-3 font-atelier text-[1.7rem]">{s.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-[#1B1A17]/70">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

type Answers = Partial<Record<(typeof INQUIRY_STEPS)[number]['id'], string>>

function recommendation(a: Answers) {
  if (a.stage === 'Just exploring') return { title: 'An introductory conversation', body: 'A relaxed 30-minute call to talk through ideas, sites and what a project like this involves — no preparation needed.' }
  if (a.project === 'A gallery or cultural space') return { title: 'A brief-development workshop', body: 'Cultural projects begin with the programme. We would suggest a half-day workshop with your team before any site work.' }
  if (a.stage === 'I have a site' || a.stage === 'I have planning permission') return { title: 'A site visit', body: 'We would walk the site with you, study its light and access, and follow up with an initial feasibility note.' }
  return { title: 'A design consultation', body: 'A focused session to agree scope, timeline and how we would approach the first concept.' }
}

function Inquiry() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Answers>({})
  const done = step >= INQUIRY_STEPS.length
  const current = INQUIRY_STEPS[Math.min(step, INQUIRY_STEPS.length - 1)]
  const headingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (step > 0) headingRef.current?.focus()
  }, [step])

  const choose = (value: string) => {
    setAnswers((a) => ({ ...a, [current.id]: value }))
    setStep((s) => s + 1)
  }
  const rec = recommendation(answers)

  return (
    <section id="inquiry" className="bg-[#1B1A17] text-[#EEE9E1]">
      <div className="mx-auto grid max-w-[1320px] gap-14 px-5 py-24 md:grid-cols-12 md:px-10 md:py-32">
        <div className="md:col-span-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#C9A27A]">Begin a project</p>
          <h2 className="mt-5 font-atelier text-[clamp(2.4rem,5vw,4.2rem)] font-light leading-[1.02]">
            Tell us a little.
            <br />
            <em>We&rsquo;ll suggest a first step.</em>
          </h2>
          <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-white/65">Four short questions. No forms to fill in until you&rsquo;re ready — and nothing here is stored or sent.</p>
        </div>

        <div className="md:col-span-7" aria-live="polite">
          <div className="flex gap-2" aria-hidden="true">
            {INQUIRY_STEPS.map((s, i) => (
              <span key={s.id} className={`h-0.5 flex-1 transition-colors duration-500 ${i < step ? 'bg-[#C9A27A]' : i === step ? 'bg-white/60' : 'bg-white/15'}`} />
            ))}
          </div>
          {!done ? (
            <div key={current.id} className="motion-safe:animate-[arrival_700ms_var(--ease-cinema)_both]">
              <p className="mt-8 font-mono text-xs text-[#C9A27A]">
                Question {step + 1} of {INQUIRY_STEPS.length}
              </p>
              <h3 ref={headingRef} tabIndex={-1} className="mt-3 font-atelier text-3xl outline-none md:text-4xl">
                {current.question}
              </h3>
              <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                {current.options.map((o) => (
                  <li key={o}>
                    <button
                      type="button"
                      onClick={() => choose(o)}
                      className={`w-full rounded-xl border px-5 py-4 text-left text-[15px] transition-colors ${answers[current.id] === o ? 'border-[#C9A27A] bg-white/5' : 'border-white/20 hover:border-white/60 hover:bg-white/5'}`}
                    >
                      {o}
                    </button>
                  </li>
                ))}
              </ul>
              {step > 0 && (
                <button type="button" className="mt-6 text-[13px] text-white/60 underline underline-offset-4 hover:text-white" onClick={() => setStep((s) => s - 1)}>
                  ← Back
                </button>
              )}
            </div>
          ) : (
            <div className="motion-safe:animate-[arrival_700ms_var(--ease-cinema)_both]">
              <h3 ref={headingRef} tabIndex={-1} className="mt-8 font-atelier text-3xl outline-none md:text-4xl">
                Your brief, in brief.
              </h3>
              <dl className="mt-6 divide-y divide-white/10 border-y border-white/10 text-[14px]">
                {INQUIRY_STEPS.map((s) => (
                  <div key={s.id} className="flex justify-between gap-6 py-3">
                    <dt className="text-white/50">{s.question}</dt>
                    <dd className="text-right">{answers[s.id]}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-8 rounded-2xl border border-[#C9A27A]/40 bg-[#C9A27A]/10 p-6">
                <p className="text-[11px] uppercase tracking-[0.25em] text-[#C9A27A]">Suggested first step</p>
                <p className="mt-3 font-atelier text-2xl">{rec.title}</p>
                <p className="mt-2 text-[15px] leading-relaxed text-white/75">{rec.body}</p>
              </div>
              <p className="mt-6 text-[13px] leading-relaxed text-white/55">
                In a live build, this is where the visitor would choose a time or send the brief to the studio. In this concept nothing is sent or stored.
              </p>
              <button type="button" className="mt-6 text-[13px] underline underline-offset-4" onClick={() => (setAnswers({}), setStep(0))}>
                Start again
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="bg-[#141311] px-5 py-12 text-[13px] text-white/55 md:px-10">
      <div className="mx-auto flex max-w-[1320px] flex-col justify-between gap-4 md:flex-row">
        <p className="font-atelier text-xl text-white/85">
          Atelier <span className="italic">North</span>
        </p>
        <p>A fictional practice created by Bridge Web as a design concept. Projects and imagery are illustrative renders.</p>
      </div>
    </footer>
  )
}
