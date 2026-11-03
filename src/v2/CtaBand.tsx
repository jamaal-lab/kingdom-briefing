import { Picture } from '~/components/site/Picture'
import { MEDIA } from '~/lib/media'

/** Closing band over the network still, with a slow light sweep. */
export function CtaBand() {
  return (
    <section aria-labelledby="cta-title" className="relative overflow-hidden bg-midnight px-5 py-24 text-center sm:px-8 md:py-32">
      <Picture asset={MEDIA.thresholdIntelligence} portrait={MEDIA.thresholdIntelligencePortrait} sizes="100vw" className="absolute inset-0 block h-full w-full" imgClassName="h-full w-full object-cover opacity-55" />
      <div className="absolute inset-0 bg-gradient-to-b from-midnight via-midnight/40 to-midnight" />
      <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-champagne/15 to-transparent motion-safe:animate-[v2-sweep_7s_ease-in-out_infinite]" />
      <div className="relative mx-auto max-w-3xl">
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.3em] text-champagne/85">Ready when you are</p>
        <h2 id="cta-title" className="v2-head mt-6 text-[clamp(2.6rem,6vw,5.2rem)] text-ivory">
          Let’s create something <span className="v2-accent">unforgettable.</span>
        </h2>
        <p className="mx-auto mt-6 max-w-md text-[1.05rem] text-ivory/75">Start from a concept you love, or let’s build something entirely your own.</p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <a href="#collection" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-gradient-to-r from-gold to-champagne px-7 text-[0.85rem] font-semibold text-midnight">
            Browse the collection <span aria-hidden="true">→</span>
          </a>
          <a href="#consult" className="inline-flex min-h-12 items-center gap-2 rounded-full border border-champagne/50 px-7 text-[0.85rem] font-semibold text-ivory hover:bg-champagne/5">
            Begin a conversation
          </a>
        </div>
      </div>
    </section>
  )
}
