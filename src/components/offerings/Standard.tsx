import { SectionHeader } from '~/components/site/SectionHeader'
import { Reveal } from '~/motion'

const METHOD = [
  { n: '01', t: 'Discover', b: 'Your business, your customers, and the single impression the website must leave.' },
  { n: '02', t: 'Direct', b: 'Art direction, narrative and journey design — agreed before anything is built.' },
  { n: '03', t: 'Build', b: 'Production-grade engineering: fast, accessible, maintainable, and measured.' },
  { n: '04', t: 'Refine', b: 'Real-device testing, performance tuning, and the last ten percent that people feel.' },
]

const PROOF = [
  ['Real-time architecture', 'The Threshold is a live WebGL scene with physically based materials — not a video.', '#threshold'],
  ['Scroll-choreographed camera', 'Native scrolling drives a damped camera path and the editorial text in one timeline.', '#threshold'],
  ['Live transformation', 'The Lab compares two real, responsive websites at true device widths.', '#lab'],
  ['Intelligent journey', 'A working rules engine classifies, prioritises and drafts — in your browser.', '#intelligence'],
  ['Adaptive quality', 'Rendering steps down on modest devices; stills replace 3D where WebGL is unavailable.', '#threshold'],
  ['Inclusive by default', 'Keyboard-operable controls, reduced-motion support and semantic structure throughout.', '#main'],
] as const

export function Standard() {
  return (
    <section aria-labelledby="standard-title" className="relative bg-charcoal px-5 py-28 sm:px-8 md:py-40 lg:px-12">
      <div className="mx-auto max-w-[1440px]">
        <SectionHeader id="standard-title" index="04" eyebrow="The Standard" title={['This page', 'is the proof.']}>
          We don’t ask you to imagine what we could build. Everything described here is running on the page you’re reading.
        </SectionHeader>
        <div className="mt-20 grid gap-16 lg:grid-cols-12">
          <ul className="grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:col-span-7">
            {PROOF.map(([t, b, href], i) => (
              <Reveal as="li" key={t} delay={(i % 2) * 120}>
                <a href={href} className="group block border-t border-line pt-5">
                  <span className="flex items-center justify-between">
                    <span className="display text-[1.7rem] text-ivory">{t}</span>
                    <span className="font-mono text-[0.58rem] uppercase tracking-[0.16em] text-gold transition-colors group-hover:text-champagne">Live ↗</span>
                  </span>
                  <span className="mt-3 block text-[0.92rem] leading-relaxed text-mist">{b}</span>
                </a>
              </Reveal>
            ))}
          </ul>
          <div className="lg:col-span-4 lg:col-start-9">
            <Reveal as="p" className="eyebrow text-champagne/70" variant="fade">
              How we work
            </Reveal>
            <ol className="relative mt-8 space-y-9 border-l border-line pl-8">
              {METHOD.map((m, i) => (
                <Reveal as="li" key={m.n} delay={i * 110} className="relative">
                  <span className="absolute -left-[37px] top-1.5 block h-[9px] w-[9px] rotate-45 border border-gold bg-charcoal" aria-hidden="true" />
                  <span className="font-mono text-[0.7rem] text-gold">{m.n}</span>
                  <h3 className="display mt-1 text-3xl text-ivory">{m.t}</h3>
                  <p className="mt-2 text-[0.92rem] leading-relaxed text-mist">{m.b}</p>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  )
}
