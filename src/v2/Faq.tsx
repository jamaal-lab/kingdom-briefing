import { SITE } from '~/lib/site'

const QA = [
  ['How much does a website cost?', 'Essential projects start at $1,000, Signature at $5,000, and Immersive Intelligence projects are custom, generally from $10,000–$15,000+. You receive a written scope and investment before any work begins.'],
  ['Are the concepts in the collection real clients?', 'No. Atelier North, Solace Clinic, Ridgeline Renovations and The Glasshouse are fictional businesses we created to demonstrate what we build. They are labelled as fictional everywhere they appear.'],
  ['Can you start from one of the concepts?', 'Yes. Choose a direction you like and we shape it around your brand, content, customers and goals. The result is your own site, not a template with a new logo.'],
  ['Is 3D or film included?', 'Immersive work is scoped per project. Original film production, custom 3D assets and complex integrations are quoted separately because they vary so much.'],
  ['What does the “intelligent” part actually do?', 'It can guide visitors through a few smart questions, classify the request, suggest a next step and prepare an organised summary and draft reply for your team. What it connects to — email, calendar, CRM — is agreed with you.'],
  ['Can you redesign my existing website?', 'Yes. Many projects begin as a redesign. We keep what works, rethink what doesn’t, and make sure nothing important is lost along the way.'],
  ['How long does a project take?', 'It depends on scope. Your written proposal includes a timeline, and you review the site in stages on a private staging link before launch.'],
  ['What do you need from me?', 'A conversation about your business, your logo and any brand guidelines, and the content you have. We guide you through the rest, including structure and copy.'],
] as const

/** Two-column FAQ using native <details> (keyboard and screen-reader friendly, no script). */
export function Faq() {
  const half = Math.ceil(QA.length / 2)
  return (
    <section id="faq" aria-labelledby="faq-title" className="v2-light bg-ivory px-5 py-24 text-ink sm:px-8 md:py-32 lg:px-12">
      <div className="mx-auto grid max-w-[1440px] gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <p className="flex items-center gap-4 text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-ink">
            <span className="h-px w-10 bg-gold-deep" /> FAQ
          </p>
          <h2 id="faq-title" className="v2-head mt-7 text-[clamp(2.6rem,5vw,4.2rem)]">
            Common <span className="v2-accent">questions.</span>
          </h2>
          <p className="mt-6 max-w-sm text-[1rem] leading-relaxed text-ink/75">Everything worth knowing before we begin.</p>
          <a href={`mailto:${SITE.email}`} className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-full bg-midnight px-7 text-[0.85rem] font-semibold text-ivory transition-colors hover:bg-navy">
            Still have questions? Email us <span aria-hidden="true">→</span>
          </a>
        </div>
        <div className="grid gap-x-10 md:grid-cols-2 lg:col-span-8">
          {[QA.slice(0, half), QA.slice(half)].map((col, c) => (
            <div key={c} className="border-t border-ink/15">
              {col.map(([q, a]) => (
                <details key={q} className="group border-b border-ink/15">
                  <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-6 py-4 text-[0.98rem] font-semibold [&::-webkit-details-marker]:hidden">
                    {q}
                    <span aria-hidden="true" className="text-xl text-gold-deep transition-transform duration-300 group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="pb-5 pr-8 text-[0.92rem] leading-relaxed text-ink/75">{a}</p>
                </details>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
