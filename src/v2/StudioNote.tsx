import { Picture } from '~/components/site/Picture'
import { LogoMark } from '~/components/site/Logo'
import { MEDIA } from '~/lib/media'
import { SITE } from '~/lib/site'
import { Reveal, ImmersiveImage } from '~/motion'
import { FOUNDER } from './founder'

const PRINCIPLES = [
  ['Studio attention', 'You work directly with the people making your site.'],
  ['Cinematic craft', 'Light, motion and type directed like a film — each with a reason.'],
  ['Intelligent by design', 'Inquiries arrive organised and ready to answer.'],
  ['Scope you can trust', 'A written scope and investment before work begins.'],
] as const

const STUDIO_STORY = [
  `Bridge Web is the digital studio of ${SITE.parent}. We make websites for businesses whose work is excellent — and whose online presence should finally say so.`,
  'We treat a website the way an architect treats a building: a sequence of moments, each one designed. How someone arrives. What they understand first. How easy it is to take the next step.',
]

/**
 * Behind the studio — the founder's section. The scene runs edge to edge
 * behind the story; with a portrait supplied, the founder stands in front of
 * it. Also carries the studio's four principles (formerly a separate band).
 */
export function StudioNote() {
  const f = FOUNDER
  const personal = Boolean(f.name)
  return (
    <section id="studio" aria-labelledby="studio-title" className="relative overflow-hidden bg-midnight">
      <div aria-hidden="true" className="absolute inset-0">
        <ImmersiveImage asset={MEDIA.thresholdApproach} portrait={MEDIA.thresholdApproachPortrait} zoom={1.22} drift={16} objectPosition="30% 50%" className="h-full w-full brightness-[1.35] saturate-[1.1]" />
      </div>
      <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,17,31,0.05)_0%,rgba(8,17,31,0.55)_42%,rgba(8,17,31,0.94)_66%)]" />
      {/* Text runs full width on small screens: deepen the scene behind it there. */}
      <div aria-hidden="true" className="absolute inset-0 bg-midnight/75 lg:hidden" />
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-midnight to-transparent" />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-midnight to-transparent" />

      <div className="relative mx-auto grid min-h-[100svh] max-w-[1440px] items-center gap-12 px-5 py-28 sm:px-8 lg:grid-cols-12 lg:px-12">
        <div className="hidden lg:col-span-5 lg:block">
          {f.portrait && (
            <Reveal variant="mask" className="relative mx-auto aspect-[3/4] max-w-md overflow-hidden rounded-[18px]">
              <Picture asset={f.portrait} alt={f.name ? `Portrait of ${f.name}` : ''} sizes="(min-width: 1024px) 34vw, 90vw" className="block h-full w-full" imgClassName="h-full w-full object-cover" />
            </Reveal>
          )}
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          {f.portrait && (
            <div className="mb-10 aspect-[3/4] w-40 overflow-hidden rounded-[14px] lg:hidden">
              <Picture asset={f.portrait} alt="" sizes="160px" className="block h-full w-full" imgClassName="h-full w-full object-cover" />
            </div>
          )}
          <p className="flex items-center gap-4 text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-champagne/85">
            <span className="h-px w-10 bg-gold" /> {personal ? f.role ?? 'Behind the studio' : 'Behind the studio'}
          </p>
          <h2 id="studio-title" className="v2-head mt-7 text-[clamp(2.4rem,4.8vw,4.2rem)] text-ivory">
            {personal ? (
              <>
                Hello, I’m <span className="v2-accent">{f.name}.</span>
              </>
            ) : (
              <>
                Built by people who <span className="v2-accent">care how it feels.</span>
              </>
            )}
          </h2>
          <div className="mt-8 space-y-5 text-[1.02rem] leading-relaxed text-ivory/80">
            {(f.story?.length ? f.story : STUDIO_STORY).map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>
          <blockquote className="mt-8 border-l-2 border-gold pl-6 text-[1.35rem] font-semibold leading-snug tracking-tight text-ivory">
            {f.belief ?? (
              <>
                When your best client finds you tonight, <span className="v2-accent font-normal">will your website feel like the work you do?</span>
              </>
            )}
          </blockquote>
          <ul className="mt-10 grid gap-x-8 gap-y-5 border-t border-line pt-8 sm:grid-cols-2">
            {PRINCIPLES.map(([t, b]) => (
              <li key={t}>
                <p className="text-[0.95rem] font-semibold text-ivory">{t}</p>
                <p className="mt-1 text-[0.88rem] leading-relaxed text-ivory/70">{b}</p>
              </li>
            ))}
          </ul>
          <div className="mt-10 flex items-center gap-4">
            <LogoMark className="h-9 w-9" />
            <p className="font-display text-2xl italic text-champagne">{f.signature ?? 'Bridge Web'}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
