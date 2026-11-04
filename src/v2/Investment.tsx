import { Reveal } from '~/motion'
import { openConsult } from './events'
import { track } from '~/lib/analytics'

const STEPS = [
  ['Start a conversation', 'Your business, your customers, and what the site must change.'],
  ['Agree the direction', 'A written scope, an art direction and the investment.'],
  ['Review as it’s built', 'The real site on a private staging link, in stages.'],
  ['Launch and evolve', 'Verified on real devices, and supported as you grow.'],
] as const

const TIERS = [
  {
    name: 'Essential',
    price: '$1,000',
    prefix: 'Starting at',
    lede: 'A focused, professionally designed digital foundation with defined scope.',
    items: ['A defined set of core pages', 'Responsive, accessible, fast', 'A clear, working contact route', 'Search-ready structure'],
    project: 'A new website',
  },
  {
    name: 'Signature',
    price: '$5,000',
    prefix: 'Starting at',
    lede: 'An elevated, strategically designed website with premium visual storytelling, intentional interactions and thoughtful conversion pathways.',
    items: ['Brand-led art direction', 'Story-driven page architecture', 'Intentional motion and interaction', 'Guided inquiries', 'Analytics-ready events'],
    project: 'Redesigning an existing site',
  },
  {
    name: 'Immersive Intelligence',
    price: '$10,000–$15,000+',
    prefix: 'Custom · generally from',
    lede: 'Advanced immersive interfaces, customized interactive experiences and intelligent functionality, where appropriately scoped.',
    items: ['Real-time 3D and cinematic WebGL', 'Interactive demonstrations', 'Intelligent intake, routing and follow-up', 'Integrations where appropriate'],
    project: 'An immersive / 3D experience',
    flagship: true,
  },
] as const

export function Investment() {
  return (
    <section id="investment" aria-labelledby="investment-title" className="v2-light bg-ivory px-5 py-24 text-ink sm:px-8 md:py-32 lg:px-12">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="flex items-center gap-4 text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-ink">
              <span className="h-px w-10 bg-gold-deep" /> Investment
            </p>
            <h2 id="investment-title" className="v2-head mt-7 text-[clamp(2.6rem,5.4vw,4.8rem)]">
              Three experiences.
              <span className="block">
                <span className="v2-accent">Each made to measure.</span>
              </span>
            </h2>
          </div>
          <p className="self-end text-[1rem] leading-relaxed text-ink/75 lg:col-span-4 lg:col-start-9">
            Every engagement starts with a conversation and a written scope. Tiers describe the level of craft — not a checklist every project receives.
          </p>
        </div>

        <ul className="mt-14 grid gap-5 lg:grid-cols-3">
          {TIERS.map((t, i) => (
            <Reveal
              as="li"
              key={t.name}
              delay={i * 100}
              className={`relative flex flex-col rounded-[18px] p-7 ${'flagship' in t && t.flagship ? 'bg-midnight text-ivory shadow-[0_40px_90px_-40px_rgba(8,17,31,0.9)]' : 'border border-ink/12 bg-white'}`}
            >
              {'flagship' in t && t.flagship && (
                <span className="absolute right-6 top-6 rounded-full bg-gradient-to-r from-gold to-champagne px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-midnight">The flagship</span>
              )}
              <h3 className="pr-28 text-[1.3rem] font-semibold tracking-tight">{t.name}</h3>
              <p className={`mt-5 text-[0.66rem] font-semibold uppercase tracking-[0.2em] ${'flagship' in t && t.flagship ? 'text-champagne/80' : 'text-ink/60'}`}>{t.prefix}</p>
              <p className="v2-head mt-1 text-[2.4rem]">{t.price}</p>
              <p className={`mt-4 text-[0.95rem] leading-relaxed ${'flagship' in t && t.flagship ? 'text-ivory/80' : 'text-ink/75'}`}>{t.lede}</p>
              <ul className={`mt-6 flex-1 space-y-2.5 border-t pt-6 ${'flagship' in t && t.flagship ? 'border-line' : 'border-ink/10'}`}>
                {t.items.map((x) => (
                  <li key={x} className="flex gap-3 text-[0.9rem]">
                    <span aria-hidden="true" className={'flagship' in t && t.flagship ? 'text-gold' : 'text-gold-deep'}>
                      ✦
                    </span>
                    {x}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => {
                  track('tier_interest', { tier: t.name, edition: 'v2' })
                  window.dispatchEvent(new CustomEvent('bridge:tier', { detail: t.name }))
                  openConsult({ project: t.project })
                }}
                className={`mt-8 min-h-12 rounded-full px-6 text-[0.82rem] font-semibold transition-colors ${'flagship' in t && t.flagship ? 'bg-gradient-to-r from-gold to-champagne text-midnight' : 'bg-midnight text-ivory hover:bg-navy'}`}
              >
                Discuss {t.name}
              </button>
            </Reveal>
          ))}
        </ul>
        {/* How an engagement runs — the process, once, where it matters: next to the investment. */}
        <div id="process" className="mt-16 rounded-[18px] border border-ink/10 bg-ivory-deep p-6 md:p-8">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-ink">How every engagement runs</p>
          <ol className="mt-6 grid gap-6 md:grid-cols-4 md:gap-4">
            {STEPS.map(([t, b], i) => (
              <li key={t} className="flex gap-4 md:flex-col md:gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-midnight text-[0.9rem] font-semibold text-champagne">{i + 1}</span>
                <span>
                  <span className="block text-[1rem] font-semibold">{t}</span>
                  <span className="mt-1 block text-[0.88rem] leading-relaxed text-ink/70">{b}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
        <div className="mt-8 grid gap-3 text-[0.85rem] leading-relaxed text-ink/70 md:grid-cols-2">
          <p>Original film production, custom 3D assets and complex integrations require separate scoping and may increase pricing.</p>
          <p>Hosting and ongoing care are discussed and quoted with each project, so you only pay for what your site actually needs.</p>
        </div>
      </div>
    </section>
  )
}
