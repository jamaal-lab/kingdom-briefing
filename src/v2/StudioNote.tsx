import { Picture } from '~/components/site/Picture'
import { LogoMark } from '~/components/site/Logo'
import { MEDIA } from '~/lib/media'
import { SITE } from '~/lib/site'
import { Reveal } from '~/motion'

/**
 * Behind the studio. Deliberately free of invented biography: it speaks for
 * the studio and its point of view. A founder portrait and personal story can
 * replace the image and first paragraphs when supplied.
 */
export function StudioNote() {
  return (
    <section id="studio" aria-labelledby="studio-title" className="relative overflow-hidden bg-midnight px-5 py-24 sm:px-8 md:py-32 lg:px-12">
      <div className="mx-auto grid max-w-[1440px] items-center gap-14 lg:grid-cols-12">
        <Reveal className="relative lg:col-span-5" variant="mask">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[18px] border border-champagne/15">
            <Picture asset={MEDIA.thresholdApproach} portrait={MEDIA.thresholdApproachPortrait} sizes="(min-width: 1024px) 40vw, 100vw" className="block h-full w-full" imgClassName="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-midnight/80 via-transparent to-transparent" />
          </div>
          <span className="absolute -bottom-4 left-6 rounded-full border border-line bg-midnight px-4 py-2 text-[0.72rem] font-semibold text-ivory">The Threshold — our flagship scene</span>
        </Reveal>
        <div className="lg:col-span-6 lg:col-start-7">
          <p className="flex items-center gap-4 text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-champagne/80">
            <span className="h-px w-10 bg-gold" /> Behind the studio
          </p>
          <h2 id="studio-title" className="v2-head mt-7 text-[clamp(2.4rem,4.6vw,4rem)] text-ivory">
            Built by people who <span className="v2-accent">care how it feels.</span>
          </h2>
          <div className="mt-8 space-y-5 text-[1.02rem] leading-relaxed text-ivory/75">
            <p>
              Bridge Web is the digital studio of {SITE.parent}. We make websites for businesses whose work is excellent — and whose online presence should finally say so.
            </p>
            <p>
              We treat a website the way an architect treats a building: a sequence of moments, each one designed. How someone arrives. What they understand first. How easy it is to take the next step.
            </p>
          </div>
          <blockquote className="mt-8 border-l-2 border-gold pl-6 text-[1.4rem] font-semibold leading-snug tracking-tight text-ivory">
            When your best client finds you tonight, <span className="v2-accent font-normal">will your website feel like the work you do?</span>
          </blockquote>
          <p className="mt-8 text-[1rem] leading-relaxed text-ivory/75">You focus on the business. We’ll make sure the first impression is worthy of it.</p>
          <div className="mt-8 flex items-center gap-4">
            <LogoMark className="h-9 w-9" />
            <p className="font-display text-2xl italic text-champagne">Bridge Web</p>
          </div>
        </div>
      </div>
    </section>
  )
}
