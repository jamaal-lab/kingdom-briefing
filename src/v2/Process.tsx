import { useInView } from '~/motion'

const STEPS = [
  { title: 'Start a conversation', body: 'Tell us about the business, the customers you want, and what the website must change.' },
  { title: 'Agree the direction', body: 'We return a written scope and an art direction — what we will make, how, and the investment.' },
  { title: 'Review it as it’s built', body: 'You see the real site in a private staging link, in stages, and refine it with us.' },
  { title: 'Launch and evolve', body: 'We launch, verify it on real devices, and stay on hand as your business grows.' },
]

export function Process() {
  const [ref, inView] = useInView<HTMLOListElement>()
  return (
    <section id="process" aria-labelledby="process-title" className="v2-light bg-ivory px-5 py-24 text-ink sm:px-8 md:py-32 lg:px-12">
      <div className="mx-auto max-w-[1440px]">
        <p className="flex items-center gap-4 text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-ink">
          <span className="h-px w-10 bg-gold-deep" /> Our process
        </p>
        <h2 id="process-title" className="v2-head mt-7 text-[clamp(2.6rem,5.4vw,4.8rem)]">
          Your experience, in <span className="v2-accent">four deliberate steps.</span>
        </h2>
        <p className="mt-6 max-w-xl text-[1.05rem] leading-relaxed text-ink/75">From the first conversation to launch day, you always know what happens next.</p>
        <ol ref={ref} className="relative mt-16 grid gap-12 md:grid-cols-4 md:gap-6">
          <span aria-hidden="true" className={`absolute left-[12.5%] right-[12.5%] top-7 hidden h-px origin-left bg-ink/20 transition-transform duration-[1600ms] ease-[var(--ease-cinema)] md:block ${inView ? 'scale-x-100' : 'scale-x-0'}`} />
          {STEPS.map((s, i) => (
            <li key={s.title} className={`relative text-center transition-[opacity,transform] duration-1000 ease-[var(--ease-cinema)] ${inView ? 'opacity-100' : 'translate-y-4 opacity-0'}`} style={{ transitionDelay: `${200 + i * 150}ms` }}>
              <span className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-midnight text-lg font-semibold text-champagne ring-8 ring-ivory">{i + 1}</span>
              {i < STEPS.length - 1 && (
                <span aria-hidden="true" className="absolute right-[-12%] top-5 hidden text-xl text-gold-deep md:block">
                  →
                </span>
              )}
              <h3 className="mt-6 text-[1.15rem] font-semibold tracking-tight">{s.title}</h3>
              <p className="mx-auto mt-3 max-w-[16rem] text-[0.92rem] leading-relaxed text-ink/70">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
