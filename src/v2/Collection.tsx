import { useState } from 'react'
import { Picture } from '~/components/site/Picture'
import { PreviewDialog } from '~/components/lab/PreviewDialog'
import { MEDIA } from '~/lib/media'
import { CONCEPT_URLS } from '~/lib/site'
import { track } from '~/lib/analytics'
import { Reveal } from '~/motion'
import { openConsult, openIntelligence } from './events'

/**
 * The Concept Collection. Every business here is fictional and labelled as
 * such. Atelier North is a full live concept site; the others are design
 * directions whose intelligent journeys run live in the Intelligence demo.
 */
type Direction = {
  id: string
  industry: string
  name: string
  line: string
  live: 'site' | 'journey'
  businessId?: string
  palette: string[]
  cover: 'image' | 'type'
  type?: { bg: string; fg: string; accent: string; font: string; mark: string }
}

const DIRECTIONS: Direction[] = [
  { id: 'atelier', industry: 'Architecture & Interiors', name: 'Atelier North', line: 'Cinematic arrival, a filterable portfolio and a guided project brief.', live: 'site', palette: ['#EEE9E1', '#1B1A17', '#9A6B4A', '#C9A27A'], cover: 'image' },
  {
    id: 'solace',
    industry: 'Health & Wellness',
    name: 'Solace Clinic',
    line: 'Calm, clinical clarity — and an inquiry flow that routes aftercare questions to a clinician.',
    live: 'journey',
    businessId: 'clinic',
    palette: ['#EEF1EC', '#2F3A34', '#8FA89A', '#D9C7B0'],
    cover: 'type',
    type: { bg: 'linear-gradient(160deg,#EEF1EC 0%,#D9E2DA 60%,#C7D4C9 100%)', fg: '#23302A', accent: '#4A6A5A', font: 'var(--font-atelier)', mark: 'Care that feels considered.' },
  },
  {
    id: 'ridgeline',
    industry: 'Home Services',
    name: 'Ridgeline Renovations',
    line: 'Project galleries by room, honest pricing ranges, and same-day routing for urgent repairs.',
    live: 'journey',
    businessId: 'renovation',
    palette: ['#1D1F22', '#E9E4DA', '#C8873B', '#5C6670'],
    cover: 'type',
    type: { bg: 'linear-gradient(150deg,#1D1F22 0%,#2A2D31 60%,#3A3226 100%)', fg: '#EFE9DF', accent: '#D79A4E', font: 'var(--font-sans)', mark: 'Built right. Built to last.' },
  },
  {
    id: 'glasshouse',
    industry: 'Events & Venues',
    name: 'The Glasshouse',
    line: 'Evening-light storytelling, live date requests, and packages that explain themselves.',
    live: 'journey',
    businessId: 'venue',
    palette: ['#0F1A2E', '#E7D2A0', '#F5F1E8', '#5E7AA8'],
    cover: 'type',
    type: { bg: 'radial-gradient(120% 90% at 70% 10%,#2B4470 0%,#0F1A2E 55%,#09111F 100%)', fg: '#F5F1E8', accent: '#E7D2A0', font: 'var(--font-display)', mark: 'Evenings worth remembering.' },
  },
]

function Cover({ d }: { d: Direction }) {
  if (d.cover === 'image')
    return (
      <div className="relative h-full w-full">
        <Picture asset={MEDIA.halden} sizes="(min-width: 1024px) 30vw, 90vw" className="block h-full w-full" imgClassName="h-full w-full object-cover transition-transform duration-[1400ms] ease-[var(--ease-cinema)] group-hover:scale-[1.05]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <p className="absolute bottom-4 left-4 right-4 font-atelier text-[1.5rem] leading-tight text-[#F6F1E8]">
          Shaped by light, <em>land, and the way you live.</em>
        </p>
      </div>
    )
  const t = d.type!
  return (
    <div className="relative flex h-full w-full flex-col justify-between p-5 transition-transform duration-[1400ms] ease-[var(--ease-cinema)] group-hover:scale-[1.03]" style={{ background: t.bg, color: t.fg }}>
      <div className="flex items-center justify-between text-[0.55rem] font-semibold uppercase tracking-[0.2em] opacity-80">
        <span>{d.name}</span>
        <span className="flex gap-3">
          <span>Work</span>
          <span>About</span>
          <span style={{ color: t.accent }}>Book</span>
        </span>
      </div>
      <p className="max-w-[85%] text-[1.6rem] leading-[1.05]" style={{ fontFamily: t.font, fontWeight: t.font.includes('sans') ? 700 : 400, letterSpacing: t.font.includes('sans') ? '-0.03em' : '0' }}>
        {t.mark}
      </p>
      <span className="inline-flex w-max rounded-full px-3 py-1 text-[0.55rem] font-semibold uppercase tracking-[0.16em]" style={{ background: t.accent, color: t.bg.includes('#EEF1EC') ? '#fff' : '#0B0F16' }}>
        Start an inquiry
      </span>
    </div>
  )
}

export function Collection() {
  const [preview, setPreview] = useState(false)
  return (
    <section id="collection" aria-labelledby="collection-title" className="v2-light bg-ivory px-5 py-24 text-ink sm:px-8 md:py-32 lg:px-12">
      <div className="mx-auto max-w-[1440px]">
        <div className="flex flex-col justify-between gap-6 border-b border-ink/15 pb-6 md:flex-row md:items-end">
          <p className="flex items-center gap-4 text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-ink">
            <span className="h-px w-10 bg-gold-deep" /> The Concept Collection
          </p>
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-ink/70">Different industries. One standard of craft.</p>
        </div>
        <div className="mt-12 grid gap-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-6">
            <h2 id="collection-title" className="v2-head text-[clamp(2.6rem,5.6vw,5rem)]">
              Start with a direction.
              <span className="block">
                <span className="v2-accent">Make it yours.</span>
              </span>
            </h2>
          </Reveal>
          <Reveal className="self-end text-[1.05rem] leading-relaxed text-ink/75 lg:col-span-5 lg:col-start-8" delay={150}>
            Fictional concepts created by Bridge Web for different industries. Explore one, then we shape the experience around your brand, your customers and your goals —
            never a template dropped in.
          </Reveal>
        </div>

        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {DIRECTIONS.map((d, i) => (
            <Reveal as="li" key={d.id} delay={i * 80} className="group flex flex-col rounded-[16px] border border-ink/10 bg-white p-3 shadow-[0_20px_50px_-35px_rgba(8,17,31,0.45)] transition-shadow hover:shadow-[0_30px_70px_-35px_rgba(8,17,31,0.6)]">
              <div className="flex items-center justify-between px-1 pb-3 pt-1">
                <h3 className="text-[1.02rem] font-semibold tracking-tight">{d.industry}</h3>
                <span className="rounded-full bg-ink/5 px-2 py-0.5 text-[0.58rem] font-semibold uppercase tracking-[0.12em] text-ink/70">Fictional</span>
              </div>
              <div className="aspect-[4/3] overflow-hidden rounded-[10px]">
                <Cover d={d} />
              </div>
              <div className="flex flex-1 flex-col px-1 pt-4">
                <p className="text-[0.9rem] font-semibold">{d.name}</p>
                <p className="mt-1.5 flex-1 text-[0.85rem] leading-relaxed text-ink/70">{d.line}</p>
                <div className="mt-3 flex gap-1.5" aria-hidden="true">
                  {d.palette.map((c) => (
                    <span key={c} className="h-3.5 w-3.5 rounded-full border border-ink/10" style={{ background: c }} />
                  ))}
                </div>
                <div className="mt-5 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      track('v2_collection_view', { concept: d.id })
                      if (d.live === 'site') setPreview(true)
                      else openIntelligence(d.businessId!)
                    }}
                    className="min-h-11 rounded-full border border-ink/25 px-3 text-[0.75rem] font-semibold transition-colors hover:border-ink"
                  >
                    {d.live === 'site' ? 'View concept' : 'See it think'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      track('v2_collection_make_yours', { concept: d.id })
                      openConsult({ project: 'A new website', note: `I like the ${d.industry} direction (${d.name}).` })
                    }}
                    className="min-h-11 rounded-full bg-midnight px-3 text-[0.75rem] font-semibold text-ivory transition-colors hover:bg-navy"
                  >
                    Make it yours
                  </button>
                </div>
              </div>
            </Reveal>
          ))}
          <Reveal as="li" delay={DIRECTIONS.length * 80} className="relative flex flex-col justify-between overflow-hidden rounded-[16px] bg-midnight p-8 text-ivory sm:col-span-2 lg:col-span-2 lg:flex-row lg:items-end lg:gap-10">
            <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(201,162,39,0.35),transparent_70%)]" />
            <div className="relative max-w-lg">
              <h3 className="v2-head text-[clamp(2rem,3.4vw,3rem)]">
                Don’t see <span className="v2-accent">your world?</span>
              </h3>
              <p className="mt-4 text-[0.92rem] font-semibold">Need something entirely your own?</p>
              <p className="mt-2 text-[0.88rem] leading-relaxed text-ivory/75">We design custom experiences around your brand, audience and goals — including immersive 3D and intelligent journeys.</p>
            </div>
            <button
              type="button"
              onClick={() => openConsult({ project: 'An immersive / 3D experience' })}
              className="relative mt-8 inline-flex min-h-12 w-max shrink-0 items-center gap-2 rounded-full bg-gradient-to-r from-gold to-champagne px-6 text-[0.82rem] font-semibold text-midnight lg:mt-0"
            >
              Start a custom project <span aria-hidden="true">→</span>
            </button>
          </Reveal>
        </ul>
      </div>
      <PreviewDialog open={preview} onClose={() => setPreview(false)} before={CONCEPT_URLS.before} after={CONCEPT_URLS.after} />
    </section>
  )
}
