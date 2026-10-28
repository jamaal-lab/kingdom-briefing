import { useEffect, useMemo, useRef, useState } from 'react'
import { SectionHeader } from '~/components/site/SectionHeader'
import { Button } from '~/components/site/Button'
import { Reveal, useReducedMotion } from '~/motion'
import { track } from '~/lib/analytics'
import { JOURNEY_STAGES } from '~/components/threshold/choreography'
import { BUSINESSES, type FieldKey } from './scenarios'
import { FIELD_LABEL, questionsFor, runJourney, type Journey } from './engine'

/**
 * THE INTELLIGENCE EXPERIENCE — an educational, fully client-side demo of an
 * intelligent customer journey. Visitor picks a fictional business and an
 * inquiry (or writes one); the rules engine gathers context, classifies,
 * recommends, drafts a follow-up and briefs the operator. No network calls,
 * no storage, no real business, no model.
 */

const STAGE_MS = 1050
type Mode = 'intelligent' | 'passive'

export function IntelligenceExperience() {
  const reduce = useReducedMotion()
  const [bizId, setBizId] = useState(BUSINESSES[0].id)
  const biz = BUSINESSES.find((b) => b.id === bizId)!
  const [presetId, setPresetId] = useState<string | 'custom'>(biz.presets[0].id)
  const [custom, setCustom] = useState('')
  const [customAnswers, setCustomAnswers] = useState<Partial<Record<FieldKey, string>>>({})
  const [stage, setStage] = useState(-1) // -1 idle, 0..5 revealed through
  const [awaiting, setAwaiting] = useState(false)
  const [mode, setMode] = useState<Mode>('intelligent')
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const announcer = useRef<HTMLParagraphElement>(null)

  const preset = biz.presets.find((p) => p.id === presetId)
  const message = presetId === 'custom' ? custom : (preset?.message ?? '')
  const answers = presetId === 'custom' ? customAnswers : (preset?.answers ?? {})
  const journey: Journey | null = useMemo(() => (message.trim().length >= 8 ? runJourney(biz, message, answers) : null), [biz, message, answers])
  const pendingQuestions = presetId === 'custom' ? questionsFor(message).filter((k) => !(k in customAnswers)) : []

  const clear = () => {
    if (timer.current) clearTimeout(timer.current)
    timer.current = null
  }
  const reset = () => {
    clear()
    setStage(-1)
    setAwaiting(false)
    setCustomAnswers({})
  }
  useEffect(() => clear, [])

  // Auto-advance through the stages; pause at "context" if the visitor must answer.
  useEffect(() => {
    if (stage < 0 || stage >= 5 || awaiting) return
    if (stage === 1 && pendingQuestions.length > 0) {
      setAwaiting(true)
      return
    }
    timer.current = setTimeout(() => setStage((s) => s + 1), reduce ? 0 : STAGE_MS)
    return clear
  }, [stage, awaiting, pendingQuestions.length, reduce])

  useEffect(() => {
    if (stage < 0 || !journey || !announcer.current) return
    const msgs = [
      'Request received.',
      awaiting ? 'The site is asking a follow-up question.' : `Context gathered: ${journey.facts.length} details.`,
      `Classified as ${journey.intent}, ${journey.priority} priority.`,
      `Recommended next step: ${journey.nextStep.title}.`,
      'Follow-up drafted, not sent.',
      'Operator brief ready.',
    ]
    announcer.current.textContent = `Stage ${stage + 1} of 6. ${msgs[stage]}`
  }, [stage, awaiting, journey])

  const run = () => {
    if (!journey) return
    clear()
    setAwaiting(false)
    setStage(reduce ? 5 : 0)
    track('intelligence_run', { business: biz.id, inquiry: presetId })
  }

  const answer = (key: FieldKey, value: string) => {
    const next = { ...customAnswers, [key]: value }
    setCustomAnswers(next)
    if (questionsFor(message).every((k) => k in next)) setAwaiting(false)
  }

  return (
    <section id="intelligence" aria-labelledby="intel-title" className="relative overflow-hidden bg-ink px-5 py-28 sm:px-8 md:py-40 lg:px-12">
      <div aria-hidden="true" className="pointer-events-none absolute -right-40 top-20 h-[620px] w-[620px] rounded-full bg-[radial-gradient(circle,rgba(31,56,100,0.55),transparent_65%)]" />
      <div className="relative mx-auto max-w-[1440px]">
        <SectionHeader id="intel-title" index="03" eyebrow="The Intelligence Experience" title={['A website that', 'understands the request.']}>
          <p>
            A passive website collects a message and waits. An intelligent one gathers context, understands intent and prepares the next step — before anyone on your
            team opens their inbox. Try it.
          </p>
          <p className="mt-4 text-[0.82rem] text-mist/80">
            Educational demonstration. Fictional businesses; a transparent rules engine running in your browser. Nothing is sent, stored or connected to a real CRM or AI
            model.
          </p>
        </SectionHeader>

        <div className="mt-16 grid gap-10 lg:grid-cols-12 lg:gap-12">
          {/* ── Controls ── */}
          <div className="lg:col-span-4">
            <fieldset>
              <legend className="eyebrow text-champagne/70">1 · Choose a business</legend>
              <div className="mt-4 grid gap-2">
                {BUSINESSES.map((b) => (
                  <label key={b.id} className={`group flex cursor-pointer items-center justify-between gap-4 border px-4 py-3 transition-colors ${bizId === b.id ? 'border-gold/70 bg-gold/[0.06]' : 'border-line hover:border-champagne/40'}`}>
                    <input
                      type="radio"
                      name="business"
                      value={b.id}
                      checked={bizId === b.id}
                      onChange={() => {
                        setBizId(b.id)
                        setPresetId(b.presets[0].id)
                        reset()
                      }}
                      className="sr-only"
                    />
                    <span>
                      <span className="block text-[0.95rem] text-ivory">{b.name}</span>
                      <span className="block text-[0.75rem] text-mist">{b.kind} · fictional</span>
                    </span>
                    <span className={`h-2 w-2 rotate-45 ${bizId === b.id ? 'bg-gold' : 'border border-champagne/30'}`} aria-hidden="true" />
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset className="mt-10">
              <legend className="eyebrow text-champagne/70">2 · Choose an inquiry</legend>
              <div className="mt-4 grid gap-2">
                {biz.presets.map((p) => (
                  <label key={p.id} className={`cursor-pointer border px-4 py-3 transition-colors ${presetId === p.id ? 'border-gold/70 bg-gold/[0.06]' : 'border-line hover:border-champagne/40'}`}>
                    <input type="radio" name="inquiry" value={p.id} checked={presetId === p.id} onChange={() => (setPresetId(p.id), reset())} className="sr-only" />
                    <span className="block text-[0.9rem] text-ivory">{p.label}</span>
                    <span className="mt-1 line-clamp-2 block text-[0.78rem] leading-relaxed text-mist">“{p.message}”</span>
                  </label>
                ))}
                <label className={`cursor-pointer border px-4 py-3 transition-colors ${presetId === 'custom' ? 'border-gold/70 bg-gold/[0.06]' : 'border-line hover:border-champagne/40'}`}>
                  <input type="radio" name="inquiry" value="custom" checked={presetId === 'custom'} onChange={() => (setPresetId('custom'), reset())} className="sr-only" />
                  <span className="block text-[0.9rem] text-ivory">Write your own</span>
                  <span className="mt-1 block text-[0.75rem] text-mist">Processed only in this browser tab. Please don’t include personal details.</span>
                </label>
                {presetId === 'custom' && (
                  <div>
                    <label htmlFor="custom-msg" className="sr-only">
                      Your inquiry
                    </label>
                    <textarea
                      id="custom-msg"
                      value={custom}
                      maxLength={400}
                      onChange={(e) => {
                        setCustom(e.target.value)
                        if (stage >= 0) reset()
                      }}
                      placeholder={`e.g. “We’re planning something around $80k and would like to start in a couple of months.”`}
                      className="h-28 w-full resize-none border border-line bg-midnight/60 px-4 py-3 text-[0.9rem] text-ivory placeholder:text-mist/60 focus:border-champagne/60"
                    />
                    <p className="mt-1 text-right font-mono text-[0.6rem] text-mist">{custom.length}/400</p>
                  </div>
                )}
              </div>
            </fieldset>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button onClick={run} disabled={!journey} arrow magnetic>
                {stage >= 0 ? 'Run again' : 'Run the journey'}
              </Button>
              {stage >= 0 && (
                <Button variant="text" onClick={reset}>
                  Reset
                </Button>
              )}
            </div>
          </div>

          {/* ── Visualisation ── */}
          <div className="lg:col-span-8">
            <div role="radiogroup" aria-label="Compare" className="mb-6 inline-flex border border-line p-1">
              {(['intelligent', 'passive'] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  role="radio"
                  aria-checked={mode === m}
                  onClick={() => (setMode(m), track('intelligence_mode', { mode: m }))}
                  className={`min-h-10 px-4 text-[0.65rem] font-semibold uppercase tracking-[0.2em] transition-colors ${mode === m ? 'bg-champagne text-midnight' : 'text-ivory/70 hover:text-ivory'}`}
                >
                  {m === 'intelligent' ? 'Intelligent website' : 'Passive website'}
                </button>
              ))}
            </div>

            <p ref={announcer} aria-live="polite" className="sr-only" />

            {mode === 'passive' ? (
              <Passive message={message} business={biz.name} />
            ) : (
              <>
                <Rail stage={stage} awaiting={awaiting} />
                <div className="mt-8 min-h-[420px] space-y-4">
                  {stage < 0 && (
                    <div className="flex min-h-[420px] items-center justify-center border border-dashed border-line px-6 text-center">
                      <p className="max-w-sm text-[0.95rem] leading-relaxed text-mist">
                        Choose a business and an inquiry, then <span className="text-champagne">run the journey</span> to watch each stage happen.
                      </p>
                    </div>
                  )}
                  {journey && stage >= 0 && (
                    <>
                      <StageCard n={1} title="Visitor request" shown={stage >= 0}>
                        <div className="flex items-start gap-4">
                          <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy text-[0.65rem] font-semibold text-ivory" aria-hidden="true">
                            V
                          </span>
                          <div>
                            <p className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-mist">Website inquiry · {biz.name} · just now</p>
                            <p className="mt-2 text-[1rem] leading-relaxed text-ivory">“{journey.message}”</p>
                          </div>
                        </div>
                      </StageCard>

                      <StageCard n={2} title="Context gathered" shown={stage >= 1}>
                        {journey.asked.length > 0 && (
                          <ul className="mb-5 space-y-3">
                            {journey.asked.map((q) => (
                              <li key={q.key} className="grid gap-1 sm:grid-cols-[1fr_auto] sm:gap-4">
                                <span className="text-[0.88rem] text-mist">
                                  <span className="mr-2 font-mono text-[0.6rem] uppercase tracking-[0.16em] text-gold">Site asks</span>
                                  {q.question}
                                </span>
                                <span className="text-[0.88rem] text-ivory sm:text-right">{q.answer}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                        {awaiting && pendingQuestions[0] && (
                          <div className="mb-5 border border-gold/40 bg-gold/[0.05] p-4">
                            <p className="text-[0.92rem] text-ivory">
                              <span className="mr-2 font-mono text-[0.6rem] uppercase tracking-[0.16em] text-gold">Site asks</span>
                              {biz.questions[pendingQuestions[0]].ask}
                            </p>
                            <div className="mt-3 flex flex-wrap gap-2">
                              {biz.questions[pendingQuestions[0]].options.map((o) => (
                                <button key={o} type="button" onClick={() => answer(pendingQuestions[0], o)} className="min-h-10 border border-champagne/40 px-3 text-[0.8rem] text-ivory hover:bg-champagne/10">
                                  {o}
                                </button>
                              ))}
                              <button type="button" onClick={() => answer(pendingQuestions[0], 'Skipped')} className="min-h-10 px-3 text-[0.8rem] text-mist underline underline-offset-4">
                                Skip
                              </button>
                            </div>
                          </div>
                        )}
                        <dl className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
                          {(['scope', 'budget', 'timeline', 'location', 'decision'] as FieldKey[]).map((k) => {
                            const f = journey.facts.find((x) => x.key === k)
                            return (
                              <div key={k} className="flex items-baseline justify-between gap-3 border-b border-line py-2">
                                <dt className="text-[0.78rem] text-mist">{FIELD_LABEL[k]}</dt>
                                <dd className="text-right text-[0.85rem]">
                                  {f && f.value !== 'Skipped' ? (
                                    <>
                                      <span className="text-ivory">{f.value}</span>
                                      <span className="ml-2 font-mono text-[0.55rem] uppercase tracking-[0.14em] text-champagne/50">{f.source === 'message' ? 'from message' : 'asked'}</span>
                                    </>
                                  ) : (
                                    <span className="text-mist/60">Unknown</span>
                                  )}
                                </dd>
                              </div>
                            )
                          })}
                        </dl>
                      </StageCard>

                      <StageCard n={3} title="Classified & prioritised" shown={stage >= 2}>
                        <div className="flex flex-wrap gap-2">
                          {[journey.intent, journey.service.label + (journey.serviceConfident ? '' : ' (tentative)'), journey.fit].map((c) => (
                            <span key={c} className="border border-champagne/30 px-3 py-1.5 text-[0.75rem] text-ivory">
                              {c}
                            </span>
                          ))}
                          <span className={`px-3 py-1.5 text-[0.75rem] font-semibold ${journey.priority === 'High' ? 'bg-gold text-midnight' : journey.priority === 'Medium' ? 'bg-champagne/80 text-midnight' : 'bg-white/10 text-ivory'}`}>
                            {journey.priority} priority
                          </span>
                        </div>
                        <div className="mt-5 flex items-center gap-4">
                          <div className="h-1.5 flex-1 bg-white/10" role="meter" aria-valuemin={0} aria-valuemax={100} aria-valuenow={journey.score} aria-label="Priority score">
                            <div className="h-full origin-left bg-gradient-to-r from-champagne to-gold transition-transform duration-[1200ms] ease-[var(--ease-cinema)]" style={{ transform: `scaleX(${stage >= 2 ? journey.score / 100 : 0})` }} />
                          </div>
                          <span className="font-mono text-sm text-champagne">{journey.score}</span>
                        </div>
                        <ul className="mt-4 grid gap-1.5 sm:grid-cols-2">
                          {journey.reasons.map((r) => (
                            <li key={r.text} className="flex justify-between gap-3 text-[0.78rem] text-mist">
                              <span>{r.text}</span>
                              <span className={`font-mono ${r.delta < 0 ? 'text-[#d98f7a]' : 'text-champagne/80'}`}>{r.delta > 0 ? `+${r.delta}` : r.delta}</span>
                            </li>
                          ))}
                        </ul>
                      </StageCard>

                      <StageCard n={4} title="Next-step recommendation" shown={stage >= 3}>
                        <p className="display text-3xl text-ivory">{journey.nextStep.title}</p>
                        <p className="mt-2 max-w-2xl text-[0.92rem] leading-relaxed text-mist">{journey.nextStep.detail}</p>
                      </StageCard>

                      <StageCard n={5} title="Follow-up prepared" shown={stage >= 4}>
                        <div className="relative border border-line bg-midnight/60 p-5">
                          <span className="absolute right-4 top-4 rotate-3 border border-gold/60 px-2 py-0.5 font-mono text-[0.58rem] uppercase tracking-[0.16em] text-gold">Draft · not sent</span>
                          <p className="pr-24 text-[0.8rem] text-mist">
                            Subject: <span className="text-ivory">{journey.draft.subject}</span>
                          </p>
                          <pre className="mt-4 whitespace-pre-wrap font-sans text-[0.88rem] leading-relaxed text-ivory/90">{journey.draft.body}</pre>
                        </div>
                      </StageCard>

                      <StageCard n={6} title="Operator brief" shown={stage >= 5} highlight>
                        <OperatorBrief journey={journey} business={biz.name} />
                      </StageCard>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

function Rail({ stage, awaiting }: { stage: number; awaiting: boolean }) {
  return (
    <ol className="relative grid grid-cols-6 gap-1" aria-label="Journey stages">
      <span aria-hidden="true" className="absolute left-[8%] right-[8%] top-[9px] h-px bg-white/10" />
      <span
        aria-hidden="true"
        className="absolute left-[8%] top-[9px] h-px origin-left bg-gold transition-transform duration-700 ease-[var(--ease-cinema)]"
        style={{ width: '84%', transform: `scaleX(${Math.max(0, stage) / 5})` }}
      />
      {JOURNEY_STAGES.map((s, i) => {
        const state = i < stage ? 'done' : i === stage ? (awaiting ? 'waiting' : 'active') : 'todo'
        return (
          <li key={s} className="relative flex flex-col items-center text-center" aria-current={i === stage ? 'step' : undefined}>
            <span
              className={`relative z-10 block h-[19px] w-[19px] rotate-45 border transition-colors duration-500 ${state === 'todo' ? 'border-white/20 bg-ink' : state === 'waiting' ? 'border-gold bg-ink motion-safe:animate-[pulse-dot_1.2s_ease-in-out_infinite]' : 'border-gold bg-gold'}`}
            />
            <span className={`mt-3 hidden text-[0.6rem] font-semibold uppercase leading-tight tracking-[0.14em] sm:block ${state === 'todo' ? 'text-white/55' : 'text-ivory'}`}>{s}</span>
          </li>
        )
      })}
    </ol>
  )
}

function StageCard({ n, title, shown, highlight, children }: { n: number; title: string; shown: boolean; highlight?: boolean; children: React.ReactNode }) {
  if (!shown) return null
  return (
    <article className={`motion-safe:animate-[stage-in_700ms_var(--ease-cinema)_both] border p-5 sm:p-6 ${highlight ? 'border-gold/60 bg-gradient-to-br from-gold/[0.08] to-transparent' : 'border-line bg-white/[0.015]'}`}>
      <h3 className="mb-4 flex items-center gap-3 text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-champagne/80">
        <span className="font-mono text-gold">0{n}</span>
        {title}
      </h3>
      {children}
    </article>
  )
}

function OperatorBrief({ journey, business }: { journey: Journey; business: string }) {
  const rows: [string, string][] = [
    ['Intent', journey.intent],
    ['Service line', journey.service.label],
    ['Fit', journey.fit],
    ['Priority', `${journey.priority} · score ${journey.score}`],
    ['Respond', journey.responseTarget],
    ['Owner', journey.owner],
    ['Known', journey.facts.filter((f) => f.value !== 'Skipped').map((f) => `${FIELD_LABEL[f.key]}: ${f.value}`).join(' · ') || '—'],
    ['Still to learn', journey.missing.map((k) => FIELD_LABEL[k]).join(', ') || 'Nothing essential'],
  ]
  return (
    <div>
      <p className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-mist">To: {business} team · organised inquiry</p>
      <dl className="mt-4 grid gap-x-8 sm:grid-cols-2">
        {rows.map(([k, v]) => (
          <div key={k} className="flex justify-between gap-4 border-b border-line py-2.5">
            <dt className="text-[0.78rem] text-mist">{k}</dt>
            <dd className="text-right text-[0.85rem] text-ivory">{v}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-5 text-[0.9rem] text-ivory">
        <span className="mr-2 font-mono text-[0.6rem] uppercase tracking-[0.16em] text-gold">Recommended</span>
        {journey.nextStep.title} — reply draft is ready for review.
      </p>
    </div>
  )
}

function Passive({ message, business }: { message: string; business: string }) {
  return (
    <Reveal variant="fade" className="grid gap-4 md:grid-cols-2">
      <div className="border border-line p-6">
        <p className="eyebrow text-mist">What the visitor sees</p>
        <div className="mt-6 border border-white/10 bg-white/[0.03] p-6 text-center">
          <p className="text-lg text-ivory">Thanks! We’ll be in touch.</p>
          <p className="mt-2 text-[0.8rem] text-mist">No timeline. No next step. No sense of being understood.</p>
        </div>
      </div>
      <div className="border border-line p-6">
        <p className="eyebrow text-mist">What the owner receives</p>
        <pre className="mt-6 whitespace-pre-wrap border border-white/10 bg-black/30 p-5 font-mono text-[0.75rem] leading-relaxed text-ivory/80">
          {`From: website@${business.toLowerCase().replace(/[^a-z]/g, '')}.example\nSubject: New contact form submission\n\nMessage:\n${message || '(empty)'}\n\n—\nSent from your website`}
        </pre>
        <p className="mt-4 text-[0.8rem] leading-relaxed text-mist">Someone must read it, guess the intent, chase missing details and write a reply from scratch — often a day later.</p>
      </div>
    </Reveal>
  )
}
