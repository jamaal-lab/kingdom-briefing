import { HeroWindow } from './HeroWindow'
import { Picture } from '~/components/site/Picture'
import { MEDIA } from '~/lib/media'
import { SITE } from '~/lib/site'
import { track } from '~/lib/analytics'

const CAPABILITIES = ['Direction', 'Design', 'Build', 'Intelligence']

export function Hero() {
  return (
    <section aria-labelledby="v2-hero" className="relative overflow-hidden bg-midnight pt-28 md:pt-32">
      <div aria-hidden="true" className="pointer-events-none absolute -left-40 top-10 h-[640px] w-[640px] rounded-full bg-[radial-gradient(circle,rgba(31,56,100,0.7),transparent_65%)]" />
      <div aria-hidden="true" className="pointer-events-none absolute right-0 top-40 h-[520px] w-[720px] bg-[radial-gradient(ellipse,rgba(201,162,39,0.16),transparent_65%)]" />
      <div className="relative mx-auto grid max-w-[1440px] items-center gap-12 px-5 pb-20 sm:px-8 lg:grid-cols-12 lg:gap-8 lg:px-12 lg:pb-28">
        <div className="lg:col-span-6 xl:col-span-5">
          <p className="intro-fade flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-champagne/85" style={{ ['--d' as string]: '100ms', ['--dur' as string]: '1200ms' }}>
            {CAPABILITIES.map((c, i) => (
              <span key={c} className="flex items-center gap-3">
                {i > 0 && <span aria-hidden="true" className="h-3 w-px bg-champagne/40" />}
                {c}
              </span>
            ))}
          </p>
          <h1 id="v2-hero" className="intro-rise v2-head mt-7 text-[clamp(2.9rem,5.6vw,5.4rem)] text-ivory" style={{ ['--d' as string]: '200ms', ['--dur' as string]: '1300ms' }}>
            Beyond the website.
            <span className="mt-1 block">
              <span className="v2-accent">Into the experience.</span>
            </span>
          </h1>
          <p className="intro-rise mt-7 max-w-md text-[1.05rem] leading-relaxed text-ivory/75" style={{ ['--d' as string]: '500ms', ['--dur' as string]: '1200ms' }}>
            {SITE.positioning}
          </p>
          <div className="intro-rise mt-9 flex flex-wrap gap-3" style={{ ['--d' as string]: '700ms', ['--dur' as string]: '1200ms' }}>
            <a
              href="#collection"
              onClick={() => track('cta_click', { location: 'v2_hero_collection' })}
              className="inline-flex min-h-12 items-center gap-2 rounded-full bg-gradient-to-r from-gold to-champagne px-7 text-[0.85rem] font-semibold text-midnight shadow-[0_18px_50px_-18px_rgba(201,162,39,0.85)] transition-transform hover:-translate-y-0.5"
            >
              Explore the collection <span aria-hidden="true">→</span>
            </a>
            <a href="#consult" onClick={() => track('cta_click', { location: 'v2_hero_consult' })} className="inline-flex min-h-12 items-center gap-2 rounded-full border border-champagne/40 px-7 text-[0.85rem] font-semibold text-ivory transition-colors hover:border-champagne hover:bg-champagne/5">
              Start a project
            </a>
          </div>
        </div>

        {/* Cinematic window + phone: the work, shown on the devices it lives on. */}
        <div className="intro-rise relative lg:col-span-6 xl:col-span-7" style={{ ['--d' as string]: '350ms', ['--dur' as string]: '1600ms' }}>
          <HeroWindow />
          <figure className="absolute -bottom-10 right-3 w-[30%] max-w-[210px] rounded-[26px] border border-white/15 bg-[#05080e] p-1.5 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)] sm:right-6">
            <div className="relative aspect-[9/19] overflow-hidden rounded-[21px]">
              <Picture asset={MEDIA.halden} sizes="210px" className="block h-full w-full" imgClassName="h-full w-full object-cover object-[62%_50%]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/30" />
              <div className="absolute inset-x-2.5 bottom-3 text-[#F6F1E8]">
                <p className="font-atelier text-[0.95rem] leading-tight">
                  Shaped by light, <em>land.</em>
                </p>
                <p className="mt-1 text-[0.5rem] uppercase tracking-[0.16em] text-white/75">Atelier North · fictional concept</p>
              </div>
            </div>
          </figure>
          <p aria-hidden="true" className="absolute -top-7 right-2 hidden font-display text-[1.35rem] italic text-champagne/90 sm:block lg:-top-9">
            Your first impression, <span className="text-gold">in motion.</span>
          </p>
        </div>
      </div>
    </section>
  )
}
