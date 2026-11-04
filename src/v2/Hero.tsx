import { HeroWindow } from './HeroWindow'
import { SITE } from '~/lib/site'
import { track } from '~/lib/analytics'

const CAPABILITIES = ['Direction', 'Design', 'Build', 'Intelligence']

/**
 * Full-bleed hero: the live Threshold scene fills the screen and breathes
 * toward the gate; the statement sits over a directional scrim.
 */
export function Hero() {
  return (
    <section aria-labelledby="v2-hero" className="relative flex min-h-[100svh] items-end overflow-hidden bg-midnight">
      <HeroWindow fullBleed />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(8,17,31,0.92)_0%,rgba(8,17,31,0.6)_38%,rgba(8,17,31,0)_70%)]" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-midnight via-midnight/50 to-transparent" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-midnight/80 to-transparent" />

      <div className="relative mx-auto w-full max-w-[1440px] px-5 pb-16 pt-32 sm:px-8 md:pb-24 lg:px-12">
        <p className="intro-fade flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-champagne/90" style={{ ['--d' as string]: '100ms', ['--dur' as string]: '1200ms' }}>
          {CAPABILITIES.map((c, i) => (
            <span key={c} className="flex items-center gap-3">
              {i > 0 && <span aria-hidden="true" className="h-3 w-px bg-champagne/40" />}
              {c}
            </span>
          ))}
        </p>
        <h1 id="v2-hero" className="intro-rise v2-head mt-7 max-w-4xl text-[clamp(3rem,7.2vw,7rem)] text-ivory" style={{ ['--d' as string]: '200ms', ['--dur' as string]: '1300ms' }}>
          Beyond the website.
          <span className="mt-1 block">
            <span className="v2-accent">Into the experience.</span>
          </span>
        </h1>
        <div className="intro-rise mt-8 flex flex-col gap-8 md:flex-row md:items-end md:justify-between" style={{ ['--d' as string]: '600ms', ['--dur' as string]: '1200ms' }}>
          <p className="max-w-md text-[1.05rem] leading-relaxed text-ivory/80">{SITE.positioning}</p>
          <div className="flex flex-wrap gap-3">
            <a
              href="#collection"
              onClick={() => track('cta_click', { location: 'v2_hero_collection' })}
              className="inline-flex min-h-12 items-center gap-2 rounded-full bg-gradient-to-r from-gold to-champagne px-7 text-[0.85rem] font-semibold text-midnight shadow-[0_18px_50px_-18px_rgba(201,162,39,0.85)] transition-transform hover:-translate-y-0.5"
            >
              Explore the collection <span aria-hidden="true">→</span>
            </a>
            <a href="#consult" onClick={() => track('cta_click', { location: 'v2_hero_consult' })} className="inline-flex min-h-12 items-center gap-2 rounded-full border border-champagne/50 bg-midnight/30 px-7 text-[0.85rem] font-semibold text-ivory backdrop-blur-sm transition-colors hover:border-champagne">
              Start a project
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
