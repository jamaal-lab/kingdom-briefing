import { Logo } from './Logo'
import { SITE } from '~/lib/site'

export function Footer() {
  return (
    <footer className="border-t border-line bg-midnight px-5 pb-10 pt-20 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-6">
            <Logo />
            <p className="display mt-10 text-[clamp(2rem,4.4vw,3.8rem)] text-ivory">
              Beyond the website.
              <br />
              <em className="text-champagne">Into the experience.</em>
            </p>
            <p className="mt-5 eyebrow text-champagne/60">{SITE.promise}</p>
          </div>
          <div className="text-[0.9rem] text-mist md:col-span-3">
            <p className="eyebrow text-champagne/60">Explore</p>
            <ul className="mt-4 space-y-2">
              {[
                ['#threshold', 'The Threshold'],
                ['#lab', 'Transformation Lab'],
                ['#intelligence', 'Intelligence'],
                ['#offerings', 'Offerings'],
                ['#consult', 'Consultation'],
              ].map(([h, l]) => (
                <li key={h}>
                  <a href={h} className="hover:text-ivory">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="text-[0.9rem] text-mist md:col-span-3">
            <p className="eyebrow text-champagne/60">Contact</p>
            <a href={`mailto:${SITE.email}`} className="mt-4 block break-all text-ivory hover:text-champagne">
              {SITE.email}
            </a>
            <p className="mt-6">{SITE.parent}</p>
          </div>
        </div>
        <div className="mt-16 flex flex-col gap-3 border-t border-line pt-6 text-[0.75rem] text-mist/80 md:flex-row md:justify-between">
          <p>© {new Date().getFullYear()} {SITE.parent}. Bridge Web is a service of {SITE.parent}.</p>
          <p>Atelier North and the demo businesses are fictional. Imagery is rendered in-house from real-time 3D scenes.</p>
        </div>
      </div>
    </footer>
  )
}
