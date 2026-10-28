import { SectionHeader } from '~/components/site/SectionHeader'
import { ButtonLink } from '~/components/site/Button'
import { Reveal } from '~/motion'
import { track } from '~/lib/analytics'

const TIERS = [
  {
    id: 'essential',
    index: 'I',
    name: 'Essential',
    price: 'Starting at $1,000',
    lede: 'A focused, professionally designed digital foundation with defined scope.',
    includes: ['A defined set of core pages, scoped together', 'Responsive build with accessibility and performance baselines', 'A clear, working contact route', 'Search-ready structure and metadata'],
    bestFor: 'New or growing businesses that need a credible, well-made presence — quickly and without excess.',
    frames: 1,
  },
  {
    id: 'signature',
    index: 'II',
    name: 'Signature',
    price: 'Starting at $5,000',
    lede: 'An elevated, strategically designed website with premium visual storytelling, intentional interactions, and thoughtful customer conversion pathways.',
    includes: ['Art direction and editorial layout led by your brand', 'Story-driven page architecture and copy guidance', 'Intentional motion and interaction design', 'Conversion pathways such as guided inquiries', 'Analytics-ready events'],
    bestFor: 'Established businesses whose website should finally match the quality of their work.',
    frames: 2,
  },
  {
    id: 'immersive',
    index: 'III',
    name: 'Immersive Intelligence',
    price: 'Custom · generally from $10,000–$15,000+',
    lede: 'Advanced immersive interfaces, customized interactive experiences, and intelligent functionality where appropriately scoped.',
    includes: ['Real-time 3D and cinematic WebGL experiences', 'Interactive product or service demonstrations', 'Intelligent intake, routing and follow-up journeys', 'Integrations with your existing tools, where appropriate'],
    bestFor: 'Brands for whom the website is the flagship — the first, and most memorable, experience of the business.',
    frames: 3,
  },
] as const

/** Elevation drawing: one, two or three nested portals — the tier made visible. */
function Elevation({ frames, active }: { frames: number; active: boolean }) {
  const portals = [
    { x: 10, y: 8, w: 100, h: 132 },
    { x: 28, y: 30, w: 64, h: 110 },
    { x: 44, y: 52, w: 32, h: 88 },
  ].slice(0, frames)
  return (
    <svg viewBox="0 0 120 150" className="h-40 w-32" aria-hidden="true">
      <line x1="0" y1="140" x2="120" y2="140" stroke="#E7D2A0" strokeOpacity="0.35" strokeWidth="0.75" />
      {portals.map((p, i) => (
        <path
          key={i}
          d={`M${p.x} 140V${p.y}h${p.w}V140`}
          fill="none"
          stroke={i === portals.length - 1 && active ? '#C9A227' : '#E7D2A0'}
          strokeOpacity={i === portals.length - 1 ? 1 : 0.5}
          strokeWidth={i === portals.length - 1 ? 1.5 : 1}
          className="[stroke-dasharray:420] [stroke-dashoffset:420] transition-[stroke-dashoffset] duration-[1600ms] ease-[var(--ease-cinema)] group-data-[inview=true]:[stroke-dashoffset:0]"
          style={{ transitionDelay: `${300 + i * 220}ms` }}
        />
      ))}
      {frames === 3 && <rect x="56" y="74" width="8" height="66" fill="#C9A227" opacity="0.18" />}
    </svg>
  )
}

export function Offerings() {
  return (
    <section id="offerings" aria-labelledby="offer-title" className="bg-midnight px-5 py-28 sm:px-8 md:py-40 lg:px-12">
      <div className="mx-auto max-w-[1440px]">
        <SectionHeader id="offer-title" index="05" eyebrow="Offerings" title={['Three experiences,', 'each made to measure.']}>
          Every engagement begins with a conversation and a written scope. The tiers describe the level of craft and ambition — not a checklist of features every project
          receives.
        </SectionHeader>

        <ol className="mt-20 border-t border-line">
          {TIERS.map((t, i) => (
            <Reveal as="li" key={t.id} variant="fade" className="group border-b border-line" delay={i * 80}>
              <article className={`grid gap-8 py-12 md:grid-cols-12 md:gap-6 md:py-16 ${t.id === 'immersive' ? 'relative' : ''}`}>
                {t.id === 'immersive' && <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 -left-5 -right-5 bg-[linear-gradient(90deg,rgba(201,162,39,0.07),transparent_70%)] sm:-left-8 lg:-left-12" />}
                <div className="relative flex items-start gap-6 md:col-span-4">
                  <Elevation frames={t.frames} active={t.id === 'immersive'} />
                  <div>
                    <span className="font-mono text-[0.7rem] text-gold">{t.index}</span>
                    <h3 className={`display mt-3 text-[clamp(2.2rem,3.6vw,3.25rem)] ${t.id === 'immersive' ? 'gold-text' : 'text-ivory'}`}>{t.name}</h3>
                    <p className="mt-4 text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-champagne">{t.price}</p>
                  </div>
                </div>
                <div className="relative md:col-span-4">
                  <p className="text-[1.08rem] leading-relaxed text-ivory/90">{t.lede}</p>
                  <p className="mt-5 text-[0.88rem] leading-relaxed text-mist">
                    <span className="mr-2 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-champagne/60">Best for</span>
                    {t.bestFor}
                  </p>
                </div>
                <div className="relative md:col-span-4">
                  <p className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-champagne/60">Typically within scope</p>
                  <ul className="mt-4 space-y-2.5">
                    {t.includes.map((x) => (
                      <li key={x} className="flex gap-3 text-[0.92rem] leading-relaxed text-ivory/85">
                        <span className="mt-[0.6em] h-px w-3 shrink-0 bg-gold" aria-hidden="true" />
                        {x}
                      </li>
                    ))}
                  </ul>
                  <ButtonLink
                    href={`#consult`}
                    variant="text"
                    className="mt-6"
                    onClick={() => {
                      track('tier_interest', { tier: t.id })
                      window.dispatchEvent(new CustomEvent('bridge:tier', { detail: t.name }))
                    }}
                  >
                    Discuss {t.name}
                  </ButtonLink>
                </div>
              </article>
            </Reveal>
          ))}
        </ol>

        <Reveal className="mt-10 grid gap-4 text-[0.85rem] leading-relaxed text-mist md:grid-cols-2" variant="fade">
          <p>Original film production, custom 3D assets, and complex integrations require separate scoping and may increase pricing.</p>
          <p>Features listed are representative of each tier; not every feature is included in every project. Final scope, timeline and investment are agreed in writing before work begins.</p>
        </Reveal>
      </div>
    </section>
  )
}
