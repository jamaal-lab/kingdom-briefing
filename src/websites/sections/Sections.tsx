import { useState } from 'react'
import { HeroWindow } from '~/v2/HeroWindow'
import { Picture } from '~/components/site/Picture'
import { Reveal } from '~/motion'
import { ImmersiveImage } from '~/motion/ImmersiveImage'
import { MEDIA, type MediaAsset } from '~/lib/media'
import { WEBSITES_PAGES } from '~/lib/target'
import { track } from '~/lib/analytics'
import { COMPANY } from '../config'
import { PROJECT_TYPES } from '../intake/schema'
import { Intake } from '../intake/Intake'
import { TransformationSlider } from './TransformationSlider'
import { BtbsLogo, startProject } from './Chrome'
import { PathFinder } from './PathFinder'
import { useMotionOff } from '../motion'

const W = 'mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12'

function Eyebrow({ index, children }: { index: string; children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-3 font-mono text-[0.68rem] uppercase tracking-[0.24em] text-mist">
      <span className="text-ivory/70">{index}</span>
      <span aria-hidden="true" className="h-px w-8 bg-ivory/25" />
      {children}
    </p>
  )
}

const goldBtn = 'inline-flex min-h-12 items-center gap-2 rounded-full bg-gold px-7 text-[0.85rem] font-semibold text-navy shadow-[0_18px_50px_-20px_rgba(201,162,74,0.9)] transition-transform hover:-translate-y-0.5'
const ghostBtn = 'inline-flex min-h-12 items-center gap-2 rounded-full border border-ivory/30 bg-navy/30 px-7 text-[0.85rem] font-semibold text-ivory backdrop-blur-sm transition-colors hover:border-ivory/70'

/* 01 ─ Hero: three layers. Back = the live Threshold (the one thing that moves),
   middle = words (readable instantly, no entrance animation), front = the lifted
   transformation card that hangs into the next section. */
const T = `${import.meta.env.BASE_URL}media/transformation`

export function Hero() {
  const still = useMotionOff()
  return (
    <section id="top" aria-labelledby="hero-title" className="relative z-10 bg-midnight">
      <div className="relative flex min-h-[100svh] items-end overflow-hidden">
        <HeroWindow fullBleed still={still} />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(11,26,43,0.95)_0%,rgba(11,26,43,0.7)_42%,rgba(11,26,43,0.08)_78%)]" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-navy via-navy/60 to-transparent" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-midnight/80 to-transparent" />

        <div className={`${W} relative pb-24 pt-36 md:pb-40`}>
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.26em] text-mist">For businesses, nonprofits, ministries &amp; schools</p>
          <h1 id="hero-title" className="btbs-head mt-6 max-w-5xl text-[clamp(2.7rem,7.4vw,7.2rem)] uppercase leading-[0.92] text-ivory">
            We build websites.
            <span className="mt-2 block text-ivory/60">And make good ones better.</span>
          </h1>
          <div className="mt-9 max-w-[36rem]">
            <p className="text-[1.25rem] font-medium leading-snug text-ivory">From quick website upgrades to complete digital transformations.</p>
            <p className="mt-3 leading-relaxed text-ivory/70">From focused upgrades to extraordinary digital experiences, we help organizations look better, connect better, and operate smarter online.</p>
            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
              <a href="#intake" onClick={() => startProject('hero')} className={`${goldBtn} min-h-14 px-8 text-[0.9rem] shadow-[0_24px_60px_-18px_rgba(201,162,74,0.85)]`}>
                Start Your Project <span aria-hidden="true">→</span>
              </a>
              <span className="text-sm text-mist">A short, guided intake. No obligation.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Front layer: breaks the hero's bottom edge. */}
      <div className={`${W} relative -mt-20 md:pointer-events-none md:absolute md:inset-x-0 md:bottom-0 md:mt-0 md:flex md:translate-y-1/2 md:justify-end`}>
        <a
          href="#transformation"
          onClick={() => track('cta_click', { location: 'hero_possible' })}
          className="group pointer-events-auto block w-full overflow-hidden rounded-[22px] border border-ivory/15 bg-ink shadow-[0_40px_90px_-30px_rgba(0,0,0,0.95)] transition-transform duration-500 hover:-translate-y-1 md:w-[400px]"
        >
          <div className="relative aspect-[16/9] overflow-hidden">
            <img src={`${T}/after-desktop-960.webp`} alt="" width={960} height={600} loading="lazy" className="absolute inset-0 h-full w-full object-cover object-top" />
            <div className="absolute inset-y-0 left-0 w-1/2 overflow-hidden border-r border-ivory/70">
              <img src={`${T}/before-desktop-960.webp`} alt="" width={960} height={600} loading="lazy" className="h-full w-[200%] max-w-none object-cover object-left-top" />
            </div>
            <span className="absolute left-2.5 top-2.5 rounded-full bg-midnight/85 px-2.5 py-1 font-mono text-[0.56rem] uppercase tracking-[0.18em] text-ivory">Before</span>
            <span className="absolute right-2.5 top-2.5 rounded-full bg-ivory px-2.5 py-1 font-mono text-[0.56rem] uppercase tracking-[0.18em] text-navy">After</span>
          </div>
          <div className="flex items-center justify-between gap-4 px-5 py-4">
            <span>
              <span className="block text-[0.95rem] font-semibold text-ivory">See What’s Possible</span>
              <span className="block text-xs text-mist">Illustrative design transformation</span>
            </span>
            <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold text-gold transition-colors group-hover:bg-gold group-hover:text-navy">
              ↓
            </span>
          </div>
        </a>
      </div>
    </section>
  )
}

/* 02 ─ The problem */
const SIGNS = [
  ['It was built for an earlier chapter.', 'Your services, audience or ambitions have moved on, and the website hasn’t caught up.'],
  ['Visitors have to work too hard.', 'The answers people need are there somewhere, but not where they look first.'],
  ['It struggles on a phone.', 'Most first visits happen on a small screen. Cramped menus and slow pages quietly turn people away.'],
  ['Inquiries arrive without context.', 'A bare contact form means extra back-and-forth before you can even tell whether it’s a good fit.'],
]

export function Problem() {
  return (
    <section aria-labelledby="problem-title" className="bg-navy pb-24 pt-20 md:pb-36 md:pt-48">
      <div className={`${W} grid gap-14 lg:grid-cols-[1fr_1.15fr] lg:gap-24`}>
        <Reveal>
          <Eyebrow index="02">The gap</Eyebrow>
          <h2 id="problem-title" className="btbs-head mt-6 text-[clamp(2.2rem,4.6vw,4rem)] leading-[1.02] text-ivory">
            Your work has grown. <span className="btbs-serif">Has your website?</span>
          </h2>
          <p className="mt-6 max-w-md text-[1.05rem] leading-relaxed text-ivory/75">
            Most websites aren’t bad — they were simply built for a moment that has passed. When the site stops reflecting the quality of the work behind it, people notice, even if they never say so.
          </p>
        </Reveal>
        <ol className="grid gap-px overflow-hidden rounded-[22px] border border-line bg-line sm:grid-cols-2">
          {SIGNS.map(([t, b], i) => (
            <li key={t} className="bg-navy p-7 sm:p-8">
              <span className="font-mono text-[0.7rem] text-mist">0{i + 1}</span>
              <h3 className="mt-4 text-lg font-semibold text-ivory">{t}</h3>
              <p className="mt-2 text-[0.95rem] leading-relaxed text-mist">{b}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

/* 03 ─ Two ways we can help */
const QUICK = ['Fix broken pages, links or forms', 'Update content, photos and offers', 'Improve the mobile experience', 'Add booking, contact or lead capture', 'Speed, accessibility and SEO clean-up', 'A focused landing page or microsite']
const FULL = ['Strategy, messaging and page architecture', 'Custom design built around your brand', 'Responsive development and launch', 'Intelligent intake, booking and CRM connections', 'Analytics, accessibility and search foundations', 'Optional ongoing care and improvement']

export function TwoPaths() {
  return (
    <section id="services" aria-labelledby="paths-title" className="relative bg-ink py-24 md:py-36">
      <div className={W}>
        <Reveal className="max-w-3xl">
          <Eyebrow index="03">Two ways we can help</Eyebrow>
          <h2 id="paths-title" className="btbs-head mt-6 text-[clamp(2.2rem,4.6vw,4rem)] leading-[1.02] text-ivory">
            A focused fix, or a <span className="btbs-serif">complete transformation.</span>
          </h2>
          <p className="mt-6 text-[1.05rem] leading-relaxed text-ivory/75">Start wherever you are. Many relationships begin with one well-done upgrade.</p>
        </Reveal>

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          <PathCard
            index="A"
            title="Quick Website Jobs & Upgrades"
            lead="For a site that mostly works but needs specific, well-defined improvements."
            items={QUICK}
            note="Small jobs can often move quickly. We confirm scope, price and timing in writing once we’ve seen what’s involved."
            actions={
              <a href="#intake" onClick={() => startProject('path_quick', { project_type: PROJECT_TYPES[0] })} className={goldBtn}>
                Request a quick job <span aria-hidden="true">→</span>
              </a>
            }
          />
          <PathCard
            index="B"
            title="Complete Website Buildouts"
            lead="For a new website, or a redesign that rethinks how your organization shows up online."
            items={FULL}
            note="Every buildout begins with discovery and a written proposal. Timelines are agreed together — never assumed."
            actions={
              <>
                <a href="#intake" onClick={() => startProject('path_new', { project_type: PROJECT_TYPES[3] })} className={goldBtn}>
                  Plan a new website <span aria-hidden="true">→</span>
                </a>
                <a href="#intake" onClick={() => startProject('path_redesign', { project_type: PROJECT_TYPES[2] })} className={ghostBtn}>
                  Redesign my site
                </a>
              </>
            }
            featured
          />
        </div>
        <PathFinder />
      </div>
    </section>
  )
}

function PathCard({ index, title, lead, items, note, actions, featured }: { index: string; title: string; lead: string; items: string[]; note: string; actions: React.ReactNode; featured?: boolean }) {
  return (
    <div className={`flex flex-col rounded-[26px] border p-7 sm:p-10 ${featured ? 'border-ivory/20 bg-[radial-gradient(120%_80%_at_100%_0%,rgba(245,241,232,0.07),transparent_60%),#132b45] shadow-[0_40px_100px_-50px_rgba(0,0,0,0.9)]' : 'border-line bg-navy'}`}>
      <span className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-mist">Path {index}</span>
      <h3 className="btbs-head mt-4 text-[1.9rem] leading-tight text-ivory sm:text-[2.2rem]">{title}</h3>
      <p className="mt-3 leading-relaxed text-ivory/75">{lead}</p>
      <ul className="mt-8 grid gap-3 sm:grid-cols-2">
        {items.map((i) => (
          <li key={i} className="flex gap-3 text-[0.95rem] text-ivory/90">
            <span aria-hidden="true" className="mt-[0.55rem] h-1.5 w-1.5 shrink-0 rotate-45 bg-ivory/45" />
            {i}
          </li>
        ))}
      </ul>
      <p className="mt-8 border-t border-line pt-6 text-sm leading-relaxed text-mist">{note}</p>
      <div className="mt-8 flex flex-wrap gap-3">{actions}</div>
    </div>
  )
}

/* 04 ─ Transformation */
export function Transformation() {
  return (
    <section id="transformation" aria-labelledby="transformation-title" className="relative overflow-hidden bg-midnight py-24 md:py-36">
      <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-0 h-[60vh] w-[90vw] -translate-x-1/2 bg-[radial-gradient(closest-side,rgba(245,241,232,0.07),transparent)]" />
      <div className={`${W} relative`}>
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-ivory/20 px-4 py-1.5 font-mono text-[0.64rem] uppercase tracking-[0.22em] text-mist">04 · Illustrative Design Transformation</p>
          <h2 id="transformation-title" className="btbs-head mt-7 text-[clamp(2.2rem,4.8vw,4.2rem)] leading-[1.02] text-ivory">
            Same business. <span className="btbs-serif">A better digital experience.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl leading-relaxed text-ivory/75">
            Drag across Atelier North — a fictional architecture practice we created to show the difference — from a typical template site to a website designed around its work.
          </p>
        </Reveal>
        <Reveal className="mt-14" variant="fade">
          <TransformationSlider />
        </Reveal>
        <p className="mt-6 text-center text-xs text-mist">Atelier North is not a real firm or a client project. Photography is computer-generated for this demonstration.</p>
      </div>
    </section>
  )
}

/* 05 ─ Outcomes */
const OUTCOMES = [
  ['Clear structure', 'Pages organised around what visitors actually come to find, so the right people get to the right next step.', 'Fewer “where do I find…?” moments'],
  ['Distinctive design', 'A visual identity carried through every page with the care your work deserves.', 'A first impression that earns trust'],
  ['Built for every screen', 'Layouts designed for phones first, then refined for tablets and large displays.', 'Reach people where they browse'],
  ['Purposeful journeys', 'Calls to action, booking and inquiry paths placed where decisions happen.', 'More meaningful conversations'],
  ['Connected systems', 'Thoughtful intake, scheduling, CRM and follow-up connections where they genuinely help — scoped per project.', 'Less manual admin'],
  ['Strong foundations', 'Performance, accessibility, analytics and search basics built in from the start, not bolted on.', 'Easier to find, use and grow'],
]

export function Outcomes() {
  return (
    <section aria-labelledby="outcomes-title" className="bg-ivory py-24 text-navy md:py-36 btbs-light">
      <div className={W}>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:items-end">
          <Reveal>
            <p className="flex items-center gap-3 font-mono text-[0.68rem] uppercase tracking-[0.24em] text-navy/65">
              <span>05</span>
              <span aria-hidden="true" className="h-px w-8 bg-navy/30" />
              Designed around outcomes
            </p>
            <h2 id="outcomes-title" className="btbs-head mt-6 text-[clamp(2.2rem,4.6vw,4rem)] leading-[1.02]">
              Websites designed around <span className="btbs-serif">outcomes.</span>
            </h2>
          </Reveal>
          <Reveal>
            <p className="max-w-xl text-[1.05rem] leading-relaxed text-navy/75 lg:ml-auto">Every capability earns its place by what it does for your visitors and your team — not because it’s fashionable.</p>
          </Reveal>
        </div>
        <ul className="mt-16 grid gap-px overflow-hidden rounded-[24px] border border-navy/10 bg-navy/10 sm:grid-cols-2 lg:grid-cols-3">
          {OUTCOMES.map(([t, b, r], i) => (
            <li key={t} className="flex flex-col bg-ivory p-7 sm:p-9">
              <span className="font-mono text-[0.7rem] text-navy/70">0{i + 1}</span>
              <h3 className="mt-5 text-xl font-semibold">{t}</h3>
              <p className="mt-3 flex-1 leading-relaxed text-navy/70">{b}</p>
              <p className="mt-6 border-t border-navy/10 pt-4 text-sm font-semibold text-navy">→ {r}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* 06 ─ Selected work & demonstrations */
const C = `${import.meta.env.BASE_URL}media/concepts`
const concept = (slug: string, alt: string): MediaAsset => ({ base: `${C}/concept-${slug}`, widths: [640, 960, 1280], width: 1280, height: 800, alt })

const CONCEPTS = [
  { name: 'Serene Bloom', cat: 'Beauty & Wellness', img: concept('beauty', 'Serene Bloom concept: a soft, light skincare website with product photography and the headline “Radiant Skin. A Calmer You.”') },
  { name: 'Summit Renovations', cat: 'Home & Property Services', img: concept('home', 'Summit Renovations concept: a dark, bold home-renovation website with a dusk photograph of a craftsman house.') },
  { name: 'Evergreen Counsel', cat: 'Professional Services', img: concept('professional', 'Evergreen Counsel concept: a calm law-and-strategy firm website in cream and forest green.') },
  { name: 'Riverside Community', cat: 'Nonprofits & Community', img: concept('nonprofit', 'Riverside Community concept: a warm nonprofit website with volunteers and the headline “Real People. Lasting Change.”') },
  { name: 'Grace Hill', cat: 'Faith & Ministries', img: concept('faith', 'Grace Hill concept: a church website with a candle-lit worship photograph and the headline “Worship. Grow. Make a Difference.”') },
  { name: 'Ignite Academy', cat: 'Education & Youth', img: concept('education', 'Ignite Academy concept: a bright STEM academy website with students building a robot.') },
  { name: 'Lumen Studio', cat: 'Events & Creatives', img: concept('events', 'Lumen Studio concept: a dramatic black events-and-photography studio website with a spotlit performer.') },
  { name: 'Vérité', cat: 'Luxury & Product Launch', img: concept('luxury', 'Vérité concept: a dark luxury fragrance launch website with a gold-lit bottle.') },
]

export function Work() {
  const cats = ['All', ...CONCEPTS.map((c) => c.cat)]
  const [cat, setCat] = useState('All')
  const shown = cat === 'All' ? CONCEPTS : CONCEPTS.filter((c) => c.cat === cat)
  return (
    <section id="work" aria-labelledby="work-title" className="bg-navy py-24 md:py-36">
      <div className={W}>
        <Reveal className="max-w-3xl">
          <Eyebrow index="06">Selected demonstrations</Eyebrow>
          <h2 id="work-title" className="btbs-head mt-6 text-[clamp(2.2rem,4.6vw,4rem)] leading-[1.02] text-ivory">
            Built for many kinds of <span className="btbs-serif">meaningful work.</span>
          </h2>
          <p className="mt-6 leading-relaxed text-ivory/75">Design directions created to show range across industries. Each one is an illustrative concept — not a client project — and a starting point for a conversation.</p>
        </Reveal>
      </div>

      {/* Featured: the full Atelier North concept */}
      <Reveal variant="fade" className="mt-14">
        <ImmersiveImage asset={MEDIA.halden} alt={MEDIA.halden.alt} zoom={1.14} drift={8} className="h-[78svh] min-h-[520px] md:h-[86vh]">
          <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(11,26,43,0.95)_0%,rgba(11,26,43,0.35)_45%,rgba(11,26,43,0.1)_100%)]" />
          <div className={`${W} absolute inset-x-0 bottom-0 pb-10 md:pb-16`}>
            <p className="font-mono text-[0.64rem] uppercase tracking-[0.22em] text-ivory/75">Full concept website · Illustrative — not a real firm</p>
            <h3 className="btbs-head mt-4 text-[clamp(2.4rem,6vw,5.4rem)] leading-[0.95] text-ivory">Atelier North</h3>
            <p className="mt-4 max-w-lg leading-relaxed text-ivory/80">A complete, responsive website for a fictional architecture practice — explore it as a visitor would.</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href={WEBSITES_PAGES.conceptAfter} target="_blank" rel="noopener" onClick={() => track('concept_open', { concept: 'atelier-north' })} className={goldBtn}>
                Explore the concept site <span aria-hidden="true">↗</span>
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </div>
          </div>
        </ImmersiveImage>
      </Reveal>

      <div className={`${W} mt-16`}>
        <div role="group" aria-label="Filter concepts by industry" className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-2 sm:mx-0 sm:flex-wrap sm:px-0">
          {cats.map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={cat === c}
              onClick={() => setCat(c)}
              className={`min-h-10 shrink-0 rounded-full border px-4 text-[0.8rem] font-medium transition-colors ${cat === c ? 'border-ivory bg-ivory text-navy' : 'border-ivory/15 text-ivory/75 hover:border-ivory/40'}`}
            >
              {c}
            </button>
          ))}
        </div>
        <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {shown.map((c) => (
            <li key={c.name} className="group flex flex-col overflow-hidden rounded-[20px] border border-line bg-ink">
              <div className="relative overflow-hidden">
                <Picture asset={c.img} sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" className="block" imgClassName="aspect-[16/10] w-full object-cover object-top transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06]" />
                <span className="absolute left-3 top-3 rounded-full bg-midnight/85 px-2.5 py-1 font-mono text-[0.58rem] uppercase tracking-[0.16em] text-ivory backdrop-blur">Illustrative concept</span>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <p className="text-xs text-mist">{c.cat}</p>
                <h3 className="mt-1 text-lg font-semibold text-ivory">{c.name}</h3>
                <a
                  href="#intake"
                  onClick={() => startProject('concept_card', { inspired_concept: c.name })}
                  className="mt-auto pt-5 text-sm font-semibold text-ivory/85 underline decoration-champagne/40 underline-offset-4 hover:text-champagne"
                >
                  Start with this direction<span className="sr-only">: {c.name}</span> →
                </a>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* 07 ─ How we work */
const STEPS = [
  ['Discover', 'We learn your organization, audience, goals and what isn’t working today.', 'Share your story, priorities and any existing materials.'],
  ['Architect', 'We shape the message, page structure, journeys and the systems it should connect to.', 'Confirm priorities and review the plan.'],
  ['Design', 'We create the visual direction and key pages, then refine them with you.', 'Give focused feedback within the agreed review rounds.'],
  ['Build', 'We develop the responsive site, connect agreed tools and test across devices.', 'Supply final content and test the experience.'],
  ['Launch', 'We go live carefully, with redirects, analytics and checks in place.', 'Give final approval and spread the word.'],
  ['Improve', 'We review how it’s used and recommend what to refine next.', 'Tell us what you’re hearing from visitors.'],
]

export function Process() {
  return (
    <section id="process" aria-labelledby="process-title" className="bg-ink py-24 md:py-36">
      <div className={W}>
        <Reveal className="max-w-3xl">
          <Eyebrow index="07">How we work</Eyebrow>
          <h2 id="process-title" className="btbs-head mt-6 text-[clamp(2.2rem,4.6vw,4rem)] leading-[1.02] text-ivory">
            Six clear moves. <span className="btbs-serif">You’re part of every one.</span>
          </h2>
          <p className="mt-6 leading-relaxed text-ivory/75">Every engagement starts with scope, a proposal and a written agreement. Timelines and review rounds are defined together — never assumed.</p>
        </Reveal>
        <ol className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {STEPS.map(([t, us, you], i) => (
            <li key={t} className="relative rounded-[22px] border border-line bg-navy p-7 sm:p-8">
              <div className="flex items-baseline justify-between">
                <h3 className="btbs-head text-2xl text-ivory">{t}</h3>
                <span className="font-mono text-[0.75rem] text-mist">0{i + 1}</span>
              </div>
              <p className="mt-4 leading-relaxed text-ivory/80">{us}</p>
              <p className="mt-6 border-t border-line pt-4 text-sm leading-relaxed text-mist">
                <span className="font-semibold text-ivory">Your role · </span>
                {you}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

/* About — the founder */
const PORTRAIT: MediaAsset = {
  base: `${import.meta.env.BASE_URL}media/founder/jamaal-peavy`,
  widths: [480, 720, 960],
  width: 960,
  height: 1200,
  alt: 'Jamaal T. Peavy, founder of Bridge to Better Solutions, LLC.',
}

export function Founder() {
  return (
    <section id="about" aria-labelledby="about-title" className="bg-navy py-24 md:py-36">
      <div className={`${W} grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20`}>
        <Reveal className="relative mx-auto w-full max-w-[460px]">
          <Picture asset={PORTRAIT} sizes="(min-width: 1024px) 460px, 90vw" className="block overflow-hidden rounded-[26px]" imgClassName="aspect-[4/5] w-full object-cover" />
        </Reveal>
        <Reveal>
          <Eyebrow index="—">Behind the work</Eyebrow>
          <h2 id="about-title" className="btbs-head mt-6 text-[clamp(2.1rem,4.2vw,3.6rem)] leading-[1.04] text-ivory">
            A different kind of <span className="btbs-serif">digital partner.</span>
          </h2>
          <p className="mt-6 max-w-xl text-[1.05rem] leading-relaxed text-ivory/80">
            {COMPANY.founder.name} founded {COMPANY.legalName} to close the gap between the extraordinary work organizations do and the way the world experiences it online.
          </p>
          <p className="mt-4 max-w-xl leading-relaxed text-ivory/70">The approach pairs creative vision with systems thinking — so your presence looks exceptional and works with purpose.</p>
          <p className="mt-8 text-ivory">
            <span className="font-semibold">{COMPANY.founder.name}</span>
            <span className="text-mist"> · {COMPANY.founder.role}</span>
          </p>
          <p className="mt-1 text-sm text-mist">{COMPANY.tagline}</p>
        </Reveal>
      </div>
    </section>
  )
}

/* 08 ─ Intake */
export function IntakeSection() {
  return (
    <section id="intake" aria-labelledby="intake-title" className="relative scroll-mt-20 overflow-hidden bg-midnight py-24 md:py-32">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-50">
        <Picture asset={MEDIA.thresholdApproach} sizes="100vw" className="block h-full w-full" imgClassName="h-full w-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-midnight via-midnight/80 to-midnight" />
      </div>
      <div className={`${W} relative grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16`}>
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Eyebrow index="08">Intelligent project intake</Eyebrow>
          <h2 id="intake-title" className="btbs-head mt-6 text-[clamp(2.2rem,4.4vw,3.8rem)] leading-[1.02] text-ivory">
            Tell us about <span className="btbs-serif">your project.</span>
          </h2>
          <p className="mt-6 max-w-md leading-relaxed text-ivory/75">The questions adapt to what you need — a quick fix gets a short path, a full build gets the depth it deserves. You can go back at any point.</p>
          <ul className="mt-8 space-y-3 text-sm text-ivory/80">
            {['Reviewed personally — not by a sales team', 'A reply to arrange a short discovery conversation', 'No obligation, and no passwords ever requested'].map((t) => (
              <li key={t} className="flex gap-3">
                <span aria-hidden="true" className="mt-[0.45rem] h-1.5 w-1.5 shrink-0 rotate-45 bg-ivory/45" />
                {t}
              </li>
            ))}
          </ul>
          <p className="mt-8 text-sm text-mist">
            Prefer email?{' '}
            <a href={`mailto:${COMPANY.email}`} className="text-champagne underline underline-offset-4">
              {COMPANY.email}
            </a>
          </p>
        </div>
        <Intake />
      </div>
    </section>
  )
}

/* 09 ─ Final CTA */
export function FinalCta() {
  return (
    <section aria-labelledby="final-title" className="relative overflow-hidden">
      <ImmersiveImage asset={MEDIA.nocturne} alt="" zoom={1.16} drift={10} className="min-h-[82svh]">
        <div className="absolute inset-0 bg-[radial-gradient(90%_70%_at_50%_60%,rgba(11,26,43,0.55),rgba(11,26,43,0.94))]" />
        <div className={`${W} relative flex min-h-[82svh] flex-col items-center justify-center py-24 text-center`}>
          <BtbsLogo size={72} withName={false} />
          <h2 id="final-title" className="btbs-head mt-10 max-w-4xl text-[clamp(2.2rem,5vw,4.6rem)] leading-[1.02] text-ivory">
            Your work deserves a digital experience that <span className="btbs-serif">reflects its value.</span>
          </h2>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <a href="#intake" onClick={() => startProject('final')} className={goldBtn}>
              Let’s Build Something Better <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </ImmersiveImage>
    </section>
  )
}
