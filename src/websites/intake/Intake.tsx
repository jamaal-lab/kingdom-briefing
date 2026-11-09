import { useEffect, useMemo, useRef, useState } from 'react'
import { track } from '~/lib/analytics'
import { asset, STATIC_PREVIEW, WEBSITES_PAGES } from '~/lib/target'
import { COMPANY } from '../config'
import { CONSENT_TEXT, pathOf, resolve, stepErrors, summarize, visibleFields, visibleSteps, type Answers, type Field } from './schema'

const DRAFT_KEY = 'btbs-intake-draft-v1'
type Status = 'editing' | 'submitting' | 'sent' | 'offline' | 'error'

function loadDraft(): { answers: Answers; step: number } | null {
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function mailtoHref(a: Answers) {
  const body = `${summarize(a)}\n\n(Sent from the project intake on ${COMPANY.pageUrl})`
  // Mail clients truncate very long mailto links; the copy button carries the full text.
  return `mailto:${COMPANY.email}?subject=${encodeURIComponent(`Website project — ${typeof a.organization === 'string' ? a.organization : 'new inquiry'}`)}&body=${encodeURIComponent(body.slice(0, 1800))}`
}

/** The Intelligent Project Intake: branching, eight steps at most, review before submit. */
export function Intake() {
  const [answers, setAnswers] = useState<Answers>({})
  const [stepIndex, setStepIndex] = useState(0)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [consent, setConsent] = useState(false)
  const [status, setStatus] = useState<Status>('editing')
  const [reference, setReference] = useState('')
  const [copied, setCopied] = useState(false)
  const [restored, setRestored] = useState(false)
  const startedAt = useRef(Date.now())
  const heading = useRef<HTMLHeadingElement>(null)
  const errorSummary = useRef<HTMLDivElement>(null)
  const touched = useRef(false)
  const honeypot = useRef<HTMLInputElement>(null)

  const steps = useMemo(() => visibleSteps(answers), [answers])
  const total = steps.length + 1 // + review
  const onReview = stepIndex >= steps.length
  const step = steps[Math.min(stepIndex, steps.length - 1)]

  useEffect(() => {
    const d = loadDraft()
    if (d && Object.keys(d.answers ?? {}).length) {
      setAnswers(d.answers)
      setStepIndex(Math.min(d.step ?? 0, visibleSteps(d.answers).length))
      setRestored(true)
    }
  }, [])

  useEffect(() => {
    if (status === 'sent') return
    try {
      if (Object.keys(answers).length) sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ answers, step: stepIndex }))
    } catch {
      /* storage unavailable: the form still works, it just won't survive a reload */
    }
  }, [answers, stepIndex, status])

  // "Two ways we can help" pre-selects the project type.
  useEffect(() => {
    const onPick = (e: Event) => {
      const preset = (e as CustomEvent<Record<string, string | string[]>>).detail ?? {}
      // Fill only answers the visitor hasn't given yet.
      setAnswers((a) => ({ ...Object.fromEntries(Object.entries(preset).filter(([k]) => !a[k])), ...a }))
    }
    window.addEventListener('btbs:intake', onPick)
    return () => window.removeEventListener('btbs:intake', onPick)
  }, [])

  // Move focus to the new step's heading (not on first render).
  useEffect(() => {
    if (!touched.current) return
    heading.current?.focus()
  }, [stepIndex, status])

  const set = (id: string, v: string | string[]) => {
    setAnswers((a) => ({ ...a, [id]: v }))
    if (errors[id]) setErrors(({ [id]: _, ...rest }) => rest)
  }

  const go = (i: number) => {
    touched.current = true
    setErrors({})
    setStepIndex(i)
    const target = i >= steps.length ? 'review' : steps[i].id
    track('intake_step', { step: target, index: i + 1 })
    document.getElementById('intake')?.scrollIntoView({ block: 'start', behavior: 'smooth' })
  }

  const next = () => {
    if (!onReview) {
      const e = stepErrors(step, answers)
      if (Object.keys(e).length) {
        setErrors(e)
        requestAnimationFrame(() => errorSummary.current?.focus())
        return
      }
    }
    if (stepIndex === 0) track('intake_start', { path: pathOf(answers) })
    go(stepIndex + 1)
  }

  const submit = async () => {
    // Re-check every step: answers may have been edited from the review screen.
    for (let i = 0; i < steps.length; i++) {
      const e = stepErrors(steps[i], answers)
      if (Object.keys(e).length) {
        setErrors(e)
        go(i)
        setErrors(e)
        return
      }
    }
    if (!consent) {
      setErrors({ consent: 'Please confirm consent so we can reply.' })
      requestAnimationFrame(() => errorSummary.current?.focus())
      return
    }
    touched.current = true
    track('intake_submit', { path: pathOf(answers) })
    // A static preview has no server: say so honestly, exactly as a switched-off endpoint would.
    if (STATIC_PREVIEW) {
      setStatus('offline')
      return
    }
    setStatus('submitting')
    try {
      const res = await fetch(asset('api/intake'), {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ answers, consent, startedAt: startedAt.current, company_fax: honeypot.current?.value ?? '' }),
      })
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; reference?: string; code?: string; errors?: Record<string, string> }
      if (res.ok && data.ok && data.reference) {
        setReference(data.reference)
        setStatus('sent')
        track('intake_complete', { path: pathOf(answers) })
        try {
          sessionStorage.removeItem(DRAFT_KEY)
        } catch {
          /* ignore */
        }
        return
      }
      if (res.status === 422 && data.errors) {
        setStatus('editing')
        setErrors(data.errors)
        const i = steps.findIndex((s) => s.fields.some((f) => data.errors && f.id in data.errors))
        if (i >= 0) go(i)
        setErrors(data.errors)
        return
      }
      track('intake_fallback', { reason: data.code ?? `http_${res.status}` })
      setStatus(res.status === 503 ? 'offline' : 'error')
    } catch {
      track('intake_fallback', { reason: 'network' })
      setStatus('error')
    }
  }

  const copySummary = async () => {
    try {
      await navigator.clipboard.writeText(summarize(answers))
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  const reset = () => {
    try {
      sessionStorage.removeItem(DRAFT_KEY)
    } catch {
      /* ignore */
    }
    setAnswers({})
    setConsent(false)
    setRestored(false)
    setErrors({})
    setStatus('editing')
    touched.current = true
    setStepIndex(0)
  }

  if (status === 'sent')
    return (
      <Panel>
        <h3 ref={heading} tabIndex={-1} className="btbs-head text-3xl text-ivory outline-none sm:text-4xl">
          Thank you. Your project details have been received.
        </h3>
        <p className="mt-5 max-w-xl leading-relaxed text-ivory/80">
          Your reference is <strong className="font-mono text-ivory">{reference}</strong>. {COMPANY.founder.name.split(' ')[0]} reviews every submission personally and will reply by your preferred contact method to arrange a short discovery conversation.
        </p>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-mist">
          Nothing is decided yet: scope, timeline and investment are agreed together in a written proposal after that conversation. If anything changes before then, email{' '}
          <a className="text-champagne underline underline-offset-4" href={`mailto:${COMPANY.email}?subject=${encodeURIComponent(reference)}`}>
            {COMPANY.email}
          </a>{' '}
          and include your reference.
        </p>
      </Panel>
    )

  if (status === 'offline' || status === 'error')
    return (
      <Panel>
        <h3 ref={heading} tabIndex={-1} className="btbs-head text-3xl text-ivory outline-none sm:text-4xl">
          {status === 'offline' ? 'Online submission isn’t switched on yet.' : 'Your details could not be sent.'}
        </h3>
        <p className="mt-5 max-w-xl leading-relaxed text-ivory/80">
          <strong className="text-ivory">Nothing has been submitted.</strong> Your answers are still here — send them by email instead and they will reach {COMPANY.founder.name.split(' ')[0]} directly.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href={mailtoHref(answers)} onClick={() => track('intake_mailto', {})} className="inline-flex min-h-12 items-center gap-2 rounded-full bg-gold px-7 text-[0.85rem] font-semibold text-navy">
            Email my answers <span aria-hidden="true">→</span>
          </a>
          <button type="button" onClick={copySummary} className="inline-flex min-h-12 items-center rounded-full border border-ivory/30 px-7 text-[0.85rem] font-semibold text-ivory hover:border-ivory/70">
            {copied ? 'Copied ✓' : 'Copy my answers'}
          </button>
          <button type="button" onClick={() => setStatus('editing')} className="inline-flex min-h-12 items-center px-3 text-[0.85rem] font-semibold text-mist underline underline-offset-4 hover:text-ivory">
            Back to review
          </button>
        </div>
        <p className="mt-4 text-xs text-mist" role="status">
          {copied ? 'Your full answers are on the clipboard — paste them into an email to ' + COMPANY.email + '.' : 'Some email apps shorten long messages; “Copy my answers” keeps everything.'}
        </p>
      </Panel>
    )

  const errorList = Object.entries(errors)
  const fields = onReview ? [] : visibleFields(step, answers)
  const label = (id: string) => (id === 'consent' ? 'Consent' : (fields.find((f) => f.id === id)?.label ?? id))

  return (
    <Panel>
      <form
        noValidate
        aria-labelledby="intake-step-title"
        onSubmit={(e) => {
          e.preventDefault()
          onReview ? submit() : next()
        }}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-mist">
            Step {Math.min(stepIndex + 1, total)} of {total}
          </p>
          {Object.keys(answers).length > 0 && (
            <button type="button" onClick={reset} className="text-xs text-mist underline underline-offset-4 hover:text-ivory">
              Start over
            </button>
          )}
        </div>
        <div className="mt-3 h-[3px] w-full overflow-hidden rounded-full bg-ivory/10" role="progressbar" aria-label="Intake progress" aria-valuemin={1} aria-valuemax={total} aria-valuenow={stepIndex + 1} aria-valuetext={`Step ${stepIndex + 1} of ${total}`}>
          <div className="h-full rounded-full bg-ivory transition-[width] duration-500" style={{ width: `${((stepIndex + 1) / total) * 100}%` }} />
        </div>
        {restored && stepIndex === 0 && (
          <p className="mt-4 text-xs text-mist" role="status">
            We restored the answers you started in this browser tab.
          </p>
        )}

        <h3 id="intake-step-title" ref={heading} tabIndex={-1} className="btbs-head mt-8 text-[1.9rem] leading-tight text-ivory outline-none sm:text-[2.4rem]">
          {onReview ? 'Review & submit' : resolve(step.title, answers)}
        </h3>
        <p className="mt-3 max-w-xl leading-relaxed text-mist">{onReview ? 'Check everything reads the way you intended. Edit any section before sending.' : resolve(step.intro, answers)}</p>

        {errorList.length > 0 && (
          <div ref={errorSummary} tabIndex={-1} role="alert" className="mt-6 rounded-xl border border-[#e8a598]/50 bg-[#e8a598]/10 p-4 text-sm text-ivory outline-none">
            <p className="font-semibold">Please check {errorList.length === 1 ? 'one answer' : `${errorList.length} answers`}:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {errorList.map(([id, msg]) => (
                <li key={id}>
                  <a href={`#f-${id}`} className="underline underline-offset-2">
                    {label(id)}
                  </a>{' '}
                  — {msg}
                </li>
              ))}
            </ul>
          </div>
        )}

        {!onReview && (
          <div className="mt-8 grid gap-7">
            {fields.map((f) => (
              <FieldControl key={f.id} field={f} value={answers[f.id]} error={errors[f.id]} required={!!resolve(f.required ?? false, answers)} onChange={(v) => set(f.id, v)} />
            ))}
          </div>
        )}

        {onReview && (
          <div className="mt-8 grid gap-4">
            {steps.map((s, i) => {
              const filled = visibleFields(s, answers).filter((f) => {
                const v = answers[f.id]
                return Array.isArray(v) ? v.length : typeof v === 'string' && v.trim()
              })
              return (
                <section key={s.id} aria-labelledby={`rv-${s.id}`} className="rounded-2xl border border-line bg-midnight/40 p-5">
                  <div className="flex items-baseline justify-between gap-4">
                    <h4 id={`rv-${s.id}`} className="text-sm font-semibold text-ivory">
                      {resolve(s.title, answers)}
                    </h4>
                    <button type="button" onClick={() => go(i)} className="shrink-0 text-xs font-semibold text-champagne underline underline-offset-4" aria-label={`Edit: ${resolve(s.title, answers)}`}>
                      Edit
                    </button>
                  </div>
                  {filled.length ? (
                    <dl className="mt-3 grid gap-3 text-sm">
                      {filled.map((f) => (
                        <div key={f.id}>
                          <dt className="text-mist">{f.label}</dt>
                          <dd className="mt-0.5 whitespace-pre-line break-words text-ivory/90">{Array.isArray(answers[f.id]) ? (answers[f.id] as string[]).join(', ') : (answers[f.id] as string)}</dd>
                        </div>
                      ))}
                    </dl>
                  ) : (
                    <p className="mt-2 text-sm text-mist">Skipped</p>
                  )}
                </section>
              )
            })}
            <div id="f-consent" className="rounded-2xl border border-line p-5">
              <label className="flex cursor-pointer gap-3 text-sm leading-relaxed text-ivory/90">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => {
                    setConsent(e.target.checked)
                    if (e.target.checked) setErrors(({ consent: _, ...rest }) => rest)
                  }}
                  aria-invalid={!!errors.consent}
                  aria-describedby="consent-note"
                  className="mt-1 h-5 w-5 shrink-0 accent-[#f5f1e8]"
                />
                <span>{CONSENT_TEXT}</span>
              </label>
              <p id="consent-note" className="mt-3 pl-8 text-xs leading-relaxed text-mist">
                Read how we handle it in the{' '}
                <a href={WEBSITES_PAGES.privacy} className="text-champagne underline underline-offset-4">
                  intake privacy notice
                </a>
                . Please don’t include passwords or login details anywhere in this form.
              </p>
            </div>
          </div>
        )}

        {/* Honeypot: hidden from people and assistive tech, tempting to bots. */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label>
            Company fax
            <input ref={honeypot} type="text" name="company_fax" tabIndex={-1} autoComplete="off" defaultValue="" />
          </label>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-3 border-t border-line pt-6">
          {stepIndex > 0 && (
            <button type="button" onClick={() => go(stepIndex - 1)} className="inline-flex min-h-12 items-center rounded-full border border-ivory/25 px-6 text-[0.85rem] font-semibold text-ivory hover:border-ivory/60">
              <span aria-hidden="true">←&nbsp;</span>Back
            </button>
          )}
          <button
            type="submit"
            disabled={status === 'submitting'}
            className="inline-flex min-h-12 items-center gap-2 rounded-full bg-gold px-7 text-[0.85rem] font-semibold text-navy transition-transform hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-70"
          >
            {status === 'submitting' ? 'Sending…' : onReview ? 'Submit project details' : stepIndex === steps.length - 1 ? 'Review answers' : 'Continue'}
            {status !== 'submitting' && <span aria-hidden="true">→</span>}
          </button>
          <p className="ml-auto text-xs text-mist">Your answers are kept only in this tab until you submit.</p>
        </div>
        <p className="sr-only" aria-live="polite">
          {status === 'submitting' ? 'Sending your project details.' : ''}
        </p>
      </form>
    </Panel>
  )
}

function Panel({ children }: { children: React.ReactNode }) {
  return <div className="relative rounded-[28px] border border-ivory/12 bg-ink/85 p-6 shadow-[0_60px_120px_-60px_rgba(0,0,0,0.9)] backdrop-blur-sm sm:p-10 lg:p-14">{children}</div>
}

const inputCls =
  'mt-2 block w-full rounded-xl border bg-midnight/60 px-4 py-3.5 text-[1rem] text-ivory placeholder:text-mist/60 transition-colors focus:border-ivory/70 focus:outline-none focus:ring-2 focus:ring-ivory/20'

function FieldControl({ field: f, value, error, required, onChange }: { field: Field; value: Answers[string]; error?: string; required: boolean; onChange: (v: string | string[]) => void }) {
  const id = `f-${f.id}`
  const describedBy = [f.help && `${id}-help`, error && `${id}-err`].filter(Boolean).join(' ') || undefined
  const border = error ? 'border-[#e8a598]' : 'border-ivory/15'
  const str = typeof value === 'string' ? value : ''
  const list = Array.isArray(value) ? value : []
  const labelEl = (
    <>
      {f.label}
      {required ? <span className="text-ivory/60"> *</span> : <span className="ml-2 text-xs font-normal text-mist">Optional</span>}
    </>
  )
  const helpEl = f.help && (
    <p id={`${id}-help`} className="mt-1.5 text-xs leading-relaxed text-mist">
      {f.help}
    </p>
  )
  const errEl = error && (
    <p id={`${id}-err`} className="mt-2 text-sm text-[#f0b8ac]">
      {error}
    </p>
  )

  if (f.type === 'radio' || f.type === 'checkboxes')
    return (
      <fieldset id={id} tabIndex={-1} aria-describedby={describedBy} aria-invalid={f.type === 'radio' ? !!error : undefined} className="outline-none">
        <legend className="text-[0.95rem] font-semibold text-ivory">{labelEl}</legend>
        {helpEl}
        <div className={`mt-3 grid gap-2 ${f.options && f.options.length > 4 ? 'sm:grid-cols-2' : 'sm:grid-cols-3'}`}>
          {f.options?.map((o) => {
            const checked = f.type === 'radio' ? str === o : list.includes(o)
            return (
              <label key={o} className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm transition-colors ${checked ? 'border-ivory bg-ivory/[0.07] text-ivory' : 'border-ivory/15 text-ivory/80 hover:border-ivory/40'}`}>
                <input
                  type={f.type === 'radio' ? 'radio' : 'checkbox'}
                  name={f.id}
                  value={o}
                  checked={checked}
                  onChange={() => onChange(f.type === 'radio' ? o : checked ? list.filter((x) => x !== o) : [...list, o])}
                  className="h-4 w-4 shrink-0 accent-[#f5f1e8]"
                />
                {o}
              </label>
            )
          })}
        </div>
        {errEl}
      </fieldset>
    )

  return (
    <div>
      <label htmlFor={id} className="text-[0.95rem] font-semibold text-ivory">
        {labelEl}
      </label>
      {helpEl}
      {f.type === 'textarea' ? (
        <textarea id={id} value={str} maxLength={f.max} rows={4} onChange={(e) => onChange(e.target.value)} aria-invalid={!!error} aria-required={required} aria-describedby={describedBy} placeholder={f.placeholder} className={`${inputCls} ${border} min-h-28 resize-y`} />
      ) : f.type === 'select' ? (
        <select id={id} value={str} onChange={(e) => onChange(e.target.value)} aria-invalid={!!error} aria-required={required} aria-describedby={describedBy} className={`${inputCls} ${border}`}>
          <option value="">Choose…</option>
          {f.options?.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={id}
          type={f.type === 'url' ? 'text' : f.type}
          inputMode={f.type === 'url' ? 'url' : undefined}
          value={str}
          maxLength={f.max}
          autoComplete={f.autoComplete}
          placeholder={f.placeholder}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={!!error}
          aria-required={required}
          aria-describedby={describedBy}
          className={`${inputCls} ${border}`}
        />
      )}
      {errEl}
    </div>
  )
}
