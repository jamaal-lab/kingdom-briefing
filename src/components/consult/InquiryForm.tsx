import { useRef, useState } from 'react'
import { track } from '~/lib/analytics'
import { asset } from '~/lib/target'
import { SITE } from '~/lib/site'

type Status = { kind: 'idle' | 'sending' | 'sent' | 'error'; text?: string }

/**
 * Optional first-party submission, shown only when built with VITE_INQUIRY_FORM=1
 * (and served with INQUIRY_ENABLED=1). The mailto action stays alongside it as
 * the fallback.
 */
export function InquiryForm({ project, tier, timing, note }: { project: string | null; tier: string | null; timing: string | null; note: string }) {
  const renderedAt = useRef(Date.now())
  const [status, setStatus] = useState<Status>({ kind: 'idle' })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    setStatus({ kind: 'sending' })
    setErrors({})
    try {
      const res = await fetch(asset('api/inquiry'), {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name: f.get('name'),
          email: f.get('email'),
          company: f.get('company'),
          website: f.get('website'),
          project: project ?? 'Not sure yet',
          tier: tier ?? undefined,
          timing: timing ?? undefined,
          message: note,
          renderedAt: renderedAt.current,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok && data.ok) {
        setStatus({ kind: 'sent', text: `Received. Your reference is ${data.reference}. We’ll reply to you by email.` })
        track('inquiry_submitted', { project: project ?? 'none' })
        return
      }
      if (data.errors) setErrors(data.errors)
      const fieldErrors = Object.keys(data.errors ?? {}).filter((k) => k !== 'form')
      setStatus({ kind: 'error', text: data.error ?? (fieldErrors.length ? 'Please check the highlighted fields.' : `We could not accept this submission. Please email ${SITE.email}.`) })
    } catch {
      setStatus({ kind: 'error', text: `We could not reach the server. Please email ${SITE.email} instead.` })
    }
  }

  if (status.kind === 'sent')
    return (
      <p role="status" className="mt-8 border border-gold/50 bg-gold/10 p-4 text-[0.92rem] text-ivory">
        {status.text}
      </p>
    )

  const field = 'mt-2 w-full border border-line bg-ink/60 px-4 py-3 text-[0.92rem] text-ivory focus:border-champagne/60'
  return (
    <form onSubmit={submit} noValidate className="mt-8 grid gap-4 border-t border-line pt-6 sm:grid-cols-2">
      <p className="text-[0.85rem] text-mist sm:col-span-2">Or send it from here. We use your details only to reply.</p>
      <label className="text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-champagne/70">
        Name
        <input id="inq-name" name="name" autoComplete="name" required className={field} aria-invalid={!!errors.name} aria-describedby={errors.name ? 'inq-name-err' : undefined} />
        {errors.name && <span id="inq-name-err" className="mt-1 block normal-case tracking-normal text-[#e8a593]">{errors.name}</span>}
      </label>
      <label className="text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-champagne/70">
        Email
        <input id="inq-email" name="email" type="email" autoComplete="email" required className={field} aria-invalid={!!errors.email} aria-describedby={errors.email ? 'inq-email-err' : undefined} />
        {errors.email && <span id="inq-email-err" className="mt-1 block normal-case tracking-normal text-[#e8a593]">{errors.email}</span>}
      </label>
      <label className="text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-champagne/70 sm:col-span-2">
        Company <span className="normal-case tracking-normal text-mist">(optional)</span>
        <input id="inq-company" name="company" autoComplete="organization" className={field} />
      </label>
      {/* Honeypot: hidden from people and assistive tech; bots fill it. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
        <button type="submit" disabled={status.kind === 'sending'} className="min-h-12 border border-champagne/50 px-7 text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-ivory hover:bg-champagne/10 disabled:opacity-50">
          {status.kind === 'sending' ? 'Sending…' : 'Send to Bridge Web'}
        </button>
        <p aria-live="polite" className="text-[0.85rem] text-[#e8a593]">
          {status.kind === 'error' ? status.text : ''}
        </p>
      </div>
    </form>
  )
}
