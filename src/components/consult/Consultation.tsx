import { useEffect, useMemo, useState } from 'react'
import { SITE, mailto } from '~/lib/site'
import { track } from '~/lib/analytics'
import { ButtonLink, Button } from '~/components/site/Button'
import { Reveal, SplitText } from '~/motion'
import { InquiryForm } from './InquiryForm'

const PROJECT = ['A new website', 'Redesigning an existing site', 'An immersive / 3D experience', 'Intelligent inquiry & follow-up', 'Not sure yet'] as const
const TIER = ['Essential', 'Signature', 'Immersive Intelligence', 'Help me decide'] as const
const TIMING = ['As soon as possible', 'Within 1–3 months', 'Later this year', 'Exploring'] as const

function Chips<T extends string>({ legend, options, value, onChange }: { legend: string; options: readonly T[]; value: T | null; onChange: (v: T) => void }) {
  return (
    <fieldset>
      <legend className="text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-champagne/70">{legend}</legend>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((o) => (
          <label key={o} className={`cursor-pointer border px-3.5 py-2.5 text-[0.85rem] transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-champagne ${value === o ? 'border-gold bg-gold/10 text-ivory' : 'border-line text-ivory/75 hover:border-champagne/50'}`}>
            <input type="radio" className="sr-only" name={legend} value={o} checked={value === o} onChange={() => onChange(o)} />
            {o}
          </label>
        ))}
      </div>
    </fieldset>
  )
}

/**
 * Consultation. The composer only shapes a draft email; it opens the
 * visitor's own mail client via mailto: — nothing is stored or submitted.
 */
/**
 * `index` labels the section for another page edition. A `bridge:consult`
 * window event ({ project?, note? }) prefills the composer.
 */
export function Consultation({ index = '06' }: { index?: string } = {}) {
  const [project, setProject] = useState<(typeof PROJECT)[number] | null>(null)
  const [tier, setTier] = useState<(typeof TIER)[number] | null>(null)
  const [timing, setTiming] = useState<(typeof TIMING)[number] | null>(null)
  const [note, setNote] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const onTier = (e: Event) => {
      const name = (e as CustomEvent<string>).detail
      if ((TIER as readonly string[]).includes(name)) setTier(name as (typeof TIER)[number])
    }
    const onConsult = (e: Event) => {
      const d = (e as CustomEvent<{ project?: string; note?: string }>).detail ?? {}
      if (d.project && (PROJECT as readonly string[]).includes(d.project)) setProject(d.project as (typeof PROJECT)[number])
      if (d.note) setNote((n) => (n.trim() ? n : d.note!))
    }
    window.addEventListener('bridge:tier', onTier)
    window.addEventListener('bridge:consult', onConsult)
    return () => {
      window.removeEventListener('bridge:tier', onTier)
      window.removeEventListener('bridge:consult', onConsult)
    }
  }, [])

  const { subject, body } = useMemo(() => {
    const subject = `Consultation request — ${project ?? 'New project'}${tier && tier !== 'Help me decide' ? ` (${tier})` : ''}`
    const lines = [
      'Hello Bridge Web,',
      '',
      'I’d like to start a conversation about a project.',
      '',
      `Project: ${project ?? '—'}`,
      `Experience level: ${tier ?? '—'}`,
      `Timing: ${timing ?? '—'}`,
      '',
      note.trim() ? `About the business:\n${note.trim()}` : 'About the business: ',
      '',
      'Best times to talk:',
      '',
      'Thank you,',
    ]
    return { subject, body: lines.join('\n') }
  }, [project, tier, timing, note])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(SITE.email)
      setCopied(true)
      track('consult_copy_email')
      setTimeout(() => setCopied(false), 2400)
    } catch {
      setCopied(false)
    }
  }

  return (
    <section id="consult" aria-labelledby="consult-title" className="relative overflow-hidden bg-ink px-5 py-28 sm:px-8 md:py-40 lg:px-12">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
      <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-0 h-[520px] w-[900px] -translate-x-1/2 bg-[radial-gradient(ellipse_at_top,rgba(201,162,39,0.14),transparent_65%)]" />
      <div className="relative mx-auto max-w-[1440px]">
        <div className="grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Reveal className="flex items-center gap-4 text-champagne/70" variant="fade">
              <span className="font-mono text-[0.7rem] text-gold">{index}</span>
              <span className="h-px w-12 bg-champagne/30" />
              <span className="eyebrow">Consultation</span>
            </Reveal>
            <SplitText id="consult-title" lines={['Begin with', 'a conversation.']} className="display mt-7 text-[clamp(2.8rem,6.4vw,5.6rem)] text-ivory" lineClassName="[&:nth-child(2)]:italic [&:nth-child(2)]:text-champagne" />
            <Reveal delay={200}>
              <p className="mt-8 max-w-md text-[1.05rem] leading-relaxed text-mist">
                The best projects start with an honest conversation about your business, your customers and what the website must achieve. We’ll listen first, then tell
                you plainly what we’d recommend — including when a simpler approach is the right one.
              </p>
              <dl className="mt-10 space-y-6">
                <div>
                  <dt className="eyebrow text-champagne/70">We’re likely a strong fit if</dt>
                  <dd className="mt-3 space-y-2 text-[0.92rem] leading-relaxed text-ivory/85">
                    <p>— Your work is excellent, and your website doesn’t show it yet.</p>
                    <p>— You want customers to understand you faster and act with confidence.</p>
                    <p>— You value craft, and you’re ready to invest in it with a clear scope.</p>
                  </dd>
                </div>
                <div>
                  <dt className="eyebrow text-champagne/70">We may not be the right fit if</dt>
                  <dd className="mt-3 space-y-2 text-[0.92rem] leading-relaxed text-mist">
                    <p>— You need a site live within days with no time for direction.</p>
                    <p>— The brief is purely to copy a competitor.</p>
                  </dd>
                </div>
              </dl>
            </Reveal>
          </div>

          <Reveal className="lg:col-span-6 lg:col-start-7" delay={150}>
            <div className="border border-line bg-midnight/70 p-6 shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9)] backdrop-blur sm:p-10">
              <p className="display text-3xl text-ivory">Shape your note</p>
              <p className="mt-2 text-[0.85rem] text-mist">Three quick choices build a draft email. It opens in your own email app — nothing is stored or sent from this page.</p>
              <div className="mt-8 space-y-7">
                <Chips legend="What are you considering?" options={PROJECT} value={project} onChange={setProject} />
                <Chips legend="Level of experience" options={TIER} value={tier} onChange={setTier} />
                <Chips legend="Timing" options={TIMING} value={timing} onChange={setTiming} />
                <div>
                  <label htmlFor="consult-note" className="text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-champagne/70">
                    A line about your business <span className="normal-case tracking-normal text-mist">(optional)</span>
                  </label>
                  <textarea
                    id="consult-note"
                    value={note}
                    maxLength={600}
                    onChange={(e) => setNote(e.target.value)}
                    className="mt-3 h-24 w-full resize-none border border-line bg-ink/60 px-4 py-3 text-[0.92rem] text-ivory placeholder:text-mist/50 focus:border-champagne/60"
                    placeholder="What you do, who you serve, and what you’d like the website to change."
                  />
                </div>
              </div>

              <details className="mt-6 border-t border-line pt-4 text-[0.82rem] text-mist">
                <summary className="cursor-pointer text-champagne/80">Preview the draft</summary>
                <pre className="mt-3 whitespace-pre-wrap font-sans leading-relaxed text-ivory/80">
                  <span className="text-mist">Subject: </span>
                  {subject}
                  {'\n\n'}
                  {body}
                </pre>
              </details>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <ButtonLink href={mailto(subject, body)} magnetic onClick={() => track('consult_mailto', { project: project ?? 'none', tier: tier ?? 'none' })}>
                  Open in your email app
                </ButtonLink>
                <Button variant="ghost" onClick={copy} aria-live="polite">
                  {copied ? 'Address copied' : 'Copy email address'}
                </Button>
              </div>
              {import.meta.env.VITE_INQUIRY_FORM === '1' && <InquiryForm project={project} tier={tier} timing={timing} note={note} />}
              <p className="mt-6 text-[0.85rem] text-mist">
                Or write directly to{' '}
                <a href={`mailto:${SITE.email}`} className="text-champagne underline decoration-champagne/40 underline-offset-4 hover:decoration-champagne">
                  {SITE.email}
                </a>
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
