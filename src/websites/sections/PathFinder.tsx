import { useRef, useState } from 'react'
import { track } from '~/lib/analytics'
import { FEATURES, PROJECT_TYPES } from '../intake/schema'
import { startProject } from './Chrome'

/**
 * "Find your path": a three-tap sample of the intake that answers the first
 * question visitors have ("which kind of help do I need?") and carries the
 * answers into the full intake. A recommendation, never a quote.
 */
const QUESTIONS = [
  {
    id: 'today',
    q: 'Where is your website today?',
    options: ['It works, but something specific needs attention', 'We have one, but it no longer reflects who we are', 'We don’t have a website yet', 'We want something truly exceptional'],
  },
  {
    id: 'goal',
    q: 'What would make the biggest difference?',
    options: ['Fixing or updating one thing', 'Looking more credible and polished', 'More inquiries, bookings or donations', 'Less admin through connected systems'],
  },
  {
    id: 'scope',
    q: 'How much needs to change?',
    options: ['One page or feature', 'A few pages', 'Most or all of it', 'Not sure yet'],
  },
] as const

type Picks = Partial<Record<(typeof QUESTIONS)[number]['id'], string>>
type Result = { path: 'A' | 'B'; title: string; why: string; involves: string[]; preset: Record<string, string | string[]> }

export function recommend(p: Picks): Result {
  const [works, outdated, none, exceptional] = QUESTIONS[0].options
  const systems = p.goal === QUESTIONS[1].options[3]
  const base: Record<string, string | string[]> = systems ? { features: [FEATURES[5], FEATURES[6]] } : {}
  const small = p.scope === QUESTIONS[2].options[0] || (p.goal === QUESTIONS[1].options[0] && p.scope !== QUESTIONS[2].options[2])
  if (p.today === works && small)
    return {
      path: 'A',
      title: 'A quick website job',
      why: 'Your site has a solid base; a focused, well-scoped fix is likely the fastest route to a better result.',
      involves: ['A quick look at the page or feature involved', 'A written scope, price and timing before work starts', 'The fix, tested on phones and desktops'],
      preset: { ...base, project_type: PROJECT_TYPES[0], has_website: 'Yes' },
    }
  if (p.today === none)
    return {
      path: 'B',
      title: 'A complete website buildout',
      why: 'Starting fresh is the moment to get structure, story and systems right from day one.',
      involves: ['Discovery: your audience, story and goals', 'Page architecture, design direction and build', 'Launch with analytics and search foundations'],
      preset: { ...base, project_type: PROJECT_TYPES[3], has_website: 'No' },
    }
  if (p.today === exceptional)
    return {
      path: 'B',
      title: 'A signature digital experience',
      why: 'You want a site that sets you apart — original direction, purposeful motion and journeys designed around your audience.',
      involves: ['Creative direction shaped around your brand', 'Custom design, motion and interactive moments where they earn their place', 'Connected intake, booking or CRM where it helps'],
      preset: { ...base, project_type: PROJECT_TYPES[4], has_website: 'Yes' },
    }
  return {
    path: 'B',
    title: p.today === outdated ? 'A thoughtful redesign' : 'A redesign of key pages',
    why: 'What exists is worth building on — the gains come from rethinking structure, design and the path to contact.',
    involves: ['A review of what works today and what must be kept', 'New structure and design for the pages that matter most', 'Clearer journeys from first visit to inquiry'],
    preset: { ...base, project_type: PROJECT_TYPES[2], has_website: 'Yes' },
  }
}

export function PathFinder() {
  const [picks, setPicks] = useState<Picks>({})
  const step = QUESTIONS.findIndex((q) => !picks[q.id])
  const done = step === -1
  const result = done ? recommend(picks) : null
  const live = useRef<HTMLHeadingElement>(null)

  const choose = (id: (typeof QUESTIONS)[number]['id'], v: string) => {
    const next = { ...picks, [id]: v }
    setPicks(next)
    if (QUESTIONS.every((q) => next[q.id])) {
      track('pathfinder_result', { path: recommend(next).path })
      requestAnimationFrame(() => live.current?.focus())
    }
  }

  return (
    <div id="find-your-path" className="mt-16 grid gap-10 rounded-[28px] border border-line bg-midnight/70 p-7 sm:p-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16 lg:p-14">
      <div>
        <p className="font-mono text-[0.68rem] uppercase tracking-[0.24em] text-mist">Not sure which path?</p>
        <h3 className="btbs-head mt-4 text-[2rem] leading-tight text-ivory sm:text-[2.5rem]">
          Find your path <span className="btbs-serif">in three taps.</span>
        </h3>
        <p className="mt-4 max-w-sm leading-relaxed text-ivory/70">Three quick questions, an honest recommendation, and your answers carry straight into the project intake.</p>
        <ol className="mt-8 flex gap-2" aria-label="Progress">
          {QUESTIONS.map((q, i) => (
            <li key={q.id} className={`h-1 flex-1 rounded-full ${done || i < step ? 'bg-ivory' : i === step ? 'bg-ivory/45' : 'bg-ivory/12'}`}>
              <span className="sr-only">
                Question {i + 1}
                {done || i < step ? ', answered' : ''}
              </span>
            </li>
          ))}
        </ol>
      </div>

      <div aria-live="polite">
        {!done && (
          <fieldset key={QUESTIONS[step].id}>
            <legend className="text-lg font-semibold text-ivory">
              <span className="mr-3 font-mono text-sm text-mist">{step + 1}/3</span>
              {QUESTIONS[step].q}
            </legend>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {QUESTIONS[step].options.map((o) => (
                <button
                  key={o}
                  type="button"
                  onClick={() => choose(QUESTIONS[step].id, o)}
                  className="min-h-16 rounded-2xl border border-ivory/15 bg-navy/60 px-5 py-4 text-left text-[0.95rem] text-ivory/90 transition-colors hover:border-ivory/50 hover:bg-navy focus-visible:border-ivory"
                >
                  {o}
                </button>
              ))}
            </div>
            {step > 0 && (
              <button type="button" onClick={() => setPicks((p) => ({ ...p, [QUESTIONS[step - 1].id]: undefined }))} className="mt-5 text-sm text-mist underline underline-offset-4 hover:text-ivory">
                ← Back
              </button>
            )}
          </fieldset>
        )}

        {result && (
          <div>
            <p className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-mist">Our recommendation · Path {result.path}</p>
            <h4 ref={live} tabIndex={-1} className="btbs-head mt-3 text-[1.9rem] leading-tight text-ivory outline-none">
              {result.title}
            </h4>
            <p className="mt-3 max-w-lg leading-relaxed text-ivory/75">{result.why}</p>
            <p className="mt-6 text-sm font-semibold text-ivory">What that usually involves</p>
            <ul className="mt-3 space-y-2.5">
              {result.involves.map((i) => (
                <li key={i} className="flex gap-3 text-[0.95rem] text-ivory/85">
                  <span aria-hidden="true" className="mt-[0.55rem] h-1.5 w-1.5 shrink-0 rotate-45 bg-ivory/45" />
                  {i}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#intake"
                onClick={() => startProject('pathfinder', result.preset as Record<string, string>)}
                className="inline-flex min-h-12 items-center gap-2 rounded-full bg-gold px-7 text-[0.85rem] font-semibold text-navy shadow-[0_18px_50px_-20px_rgba(201,162,74,0.9)] transition-transform hover:-translate-y-0.5"
              >
                Continue with this path <span aria-hidden="true">→</span>
              </a>
              <button type="button" onClick={() => setPicks({})} className="text-sm text-mist underline underline-offset-4 hover:text-ivory">
                Start over
              </button>
            </div>
            <p className="mt-5 text-xs text-mist">A starting point, not a quote — scope, timing and investment are always agreed in writing.</p>
          </div>
        )}
      </div>
    </div>
  )
}
