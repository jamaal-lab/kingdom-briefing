import { Reveal } from '~/motion'

const VALUES = [
  { title: 'Studio attention', body: 'A small studio’s focus on every project. You work with the people making your site.', icon: 'M12 4l2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 16.4 7.2 18.9l.9-5.4L4.2 9.7l5.4-.8z' },
  { title: 'Cinematic craft', body: 'Light, motion and typography directed like a film — every effect has a reason to be there.', icon: 'M4 6h16v12H4zM9 9l6 3-6 3z' },
  { title: 'Intelligent by design', body: 'Inquiries that arrive organised, prioritised and ready to answer — not a raw form email.', icon: 'M12 3a6 6 0 016 6c0 2.2-1.2 3.7-2.4 4.8-.6.6-.9 1.3-.9 2.2H9.3c0-.9-.3-1.6-.9-2.2C7.2 12.7 6 11.2 6 9a6 6 0 016-6zM9.5 19h5M10.5 21h3' },
  { title: 'Scope you can trust', body: 'A written scope and investment before any work begins. No surprises, no invented promises.', icon: 'M7 3h7l5 5v13H7zM14 3v5h5M10 13h6M10 17h6' },
]

/** "We listen" band: rhythmic statement on the left, four principles on the right. */
export function Why() {
  return (
    <section aria-labelledby="why-title" className="v2-light bg-ivory-deep px-5 py-24 text-ink sm:px-8 md:py-28 lg:px-12">
      <div className="mx-auto grid max-w-[1440px] gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="flex items-center gap-4 text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-ink">
            <span className="h-px w-10 bg-gold-deep" /> Why Bridge Web
          </p>
          <h2 id="why-title" className="v2-head mt-7 text-[clamp(2.6rem,5vw,4.4rem)]">
            We listen.
            <br />
            We direct.
            <br />
            <span className="v2-accent">We build what lasts.</span>
          </h2>
          <p className="mt-6 max-w-sm text-[1rem] leading-relaxed text-ink/75">Every project gets personal attention, a clear point of view, and engineering that holds up long after launch.</p>
          <a href="#consult" className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-full bg-midnight px-7 text-[0.85rem] font-semibold text-ivory transition-colors hover:bg-navy">
            Get started <span aria-hidden="true">→</span>
          </a>
        </div>
        <ul className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
          {VALUES.map((v, i) => (
            <Reveal as="li" key={v.title} delay={i * 90} className="rounded-[16px] border border-ink/10 bg-white p-6 shadow-[0_20px_50px_-40px_rgba(8,17,31,0.5)]">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-midnight text-champagne">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
                  <path d={v.icon} />
                </svg>
              </span>
              <h3 className="mt-5 text-[1.12rem] font-semibold tracking-tight">{v.title}</h3>
              <p className="mt-2 text-[0.92rem] leading-relaxed text-ink/70">{v.body}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
