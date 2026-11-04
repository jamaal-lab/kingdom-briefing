import { Logo } from '~/components/site/Logo'
import { SITE } from '~/lib/site'

const LINKS = [
  ['#collection', 'The Concept Collection'],
  ['#solutions', 'Digital Solutions'],
  ['#lab', 'Transformation Lab'],
  ['#intelligence', 'Intelligence demo'],
  ['#investment', 'Investment & process'],
  ['#studio', 'Behind the studio'],
  ['#faq', 'FAQ'],
]

export function V2Footer() {
  return (
    <footer className="border-t border-line bg-[#060d18] px-5 pb-10 pt-16 sm:px-8 lg:px-12">
      <div className="mx-auto grid max-w-[1440px] gap-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <Logo />
          <p className="mt-6 max-w-sm text-[0.92rem] leading-relaxed text-ivory/70">{SITE.positioning}</p>
        </div>
        <nav aria-label="Footer" className="md:col-span-3">
          <p className="text-[0.85rem] font-semibold text-ivory">Quick links</p>
          <ul className="mt-4 space-y-2 text-[0.9rem] text-ivory/70">
            {LINKS.map(([h, l]) => (
              <li key={h}>
                <a href={h} className="hover:text-champagne">
                  {l}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="md:col-span-4">
          <p className="text-[0.85rem] font-semibold text-ivory">Get in touch</p>
          <a href={`mailto:${SITE.email}`} className="mt-4 block break-all text-[0.95rem] text-ivory hover:text-champagne">
            {SITE.email}
          </a>
          <p className="mt-8 font-display text-[1.8rem] italic leading-tight text-champagne">
            Beyond the website.
            <br />
            <span className="text-gold">Into the experience.</span>
          </p>
        </div>
      </div>
      <div className="mx-auto mt-14 flex max-w-[1440px] flex-col gap-2 border-t border-line pt-6 text-[0.75rem] text-ivory/60 md:flex-row md:justify-between">
        <p>
          © {new Date().getFullYear()} {SITE.parent}. {SITE.promise}
        </p>
        <p>All concept businesses shown are fictional. Imagery is rendered in-house.</p>
      </div>
    </footer>
  )
}
