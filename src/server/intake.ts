/**
 * Project intake delivery for the /websites page.
 *
 * Path: browser → POST /api/intake → same-origin, size, rate limit, bot checks
 *       → validateIntake (shared schema) → adapter → { ok, reference }
 *
 * INTAKE_DELIVERY selects the adapter:
 *   (unset)   intake is OFF; the endpoint answers 503 and the page offers an
 *             email fallback — it never pretends a submission was received.
 *   'log'     redacted line only (no names, emails or free text). Staging tests.
 *   'webhook' POST JSON to INTAKE_WEBHOOK_URL, signed with HMAC-SHA256 of the body
 *             using INTAKE_WEBHOOK_SECRET (header x-btbs-signature: sha256=<hex>).
 *             Works with a LeadConnector/GoHighLevel inbound webhook, Zapier,
 *             Make, or a small mail function. Success = 2xx from the receiver.
 * See docs/websites/INTAKE.md.
 */
import { summarize, type Answers, type Path } from '~/websites/intake/schema'

export type Submission = { reference: string; receivedAt: string; path: Path; answers: Answers; summary: string; source: string }
export type IntakeAdapter = (s: Submission) => Promise<void>

export const intakeLogAdapter: IntakeAdapter = async (s) => {
  const a = s.answers
  console.log(
    JSON.stringify({
      level: 'info',
      event: 'intake_received',
      reference: s.reference,
      path: s.path,
      projectType: a.project_type ?? null,
      industry: a.industry ?? null,
      timeline: a.timeline ?? null,
      budget: a.budget ?? null,
      features: Array.isArray(a.features) ? a.features.length : 0,
      fields: Object.keys(a).length,
      emailDomain: typeof a.email === 'string' ? a.email.split('@')[1] : null,
    }),
  )
}

async function hmac(secret: string, body: string) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(body))
  return Array.from(new Uint8Array(sig), (b) => b.toString(16).padStart(2, '0')).join('')
}

export function webhookAdapter(url: string, secret: string, fetcher: typeof fetch = fetch): IntakeAdapter {
  return async (s) => {
    const a = s.answers
    const body = JSON.stringify({
      type: 'website_project_intake',
      reference: s.reference,
      received_at: s.receivedAt,
      source: s.source,
      path: s.path,
      // Flat contact fields so CRMs can map them without parsing.
      name: a.name,
      email: a.email,
      phone: a.phone ?? null,
      organization: a.organization,
      contact_method: a.contact_method,
      website: a.website_url ?? null,
      project_type: a.project_type,
      answers: a,
      summary: s.summary,
    })
    const res = await fetcher(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-btbs-signature': `sha256=${await hmac(secret, body)}`, 'x-btbs-reference': s.reference },
      body,
      signal: AbortSignal.timeout(10_000),
    })
    if (!res.ok) throw new Error(`webhook responded ${res.status}`)
  }
}

/** Resolve the configured adapter at request time, or null when intake is off/misconfigured. */
export function configuredAdapter(env: Record<string, string | undefined> = process.env): IntakeAdapter | null {
  const mode = env.INTAKE_DELIVERY
  if (mode === 'log') return intakeLogAdapter
  if (mode === 'webhook') {
    const url = env.INTAKE_WEBHOOK_URL
    const secret = env.INTAKE_WEBHOOK_SECRET
    if (!url || !/^https:\/\//.test(url) || !secret || secret.length < 16) return null
    return webhookAdapter(url, secret)
  }
  return null
}

export function intakeReference(now = new Date()) {
  const rand = Array.from(crypto.getRandomValues(new Uint8Array(3)), (b) => b.toString(16).padStart(2, '0')).join('')
  return `BTBS-${now.toISOString().slice(0, 10).replace(/-/g, '')}-${rand.toUpperCase()}`
}

export function buildSubmission(answers: Answers, path: Path, now = new Date()): Submission {
  return { reference: intakeReference(now), receivedAt: now.toISOString(), path, answers, summary: summarize(answers), source: 'bridge2bettersolutions.com/websites' }
}

/** Bot speed-bump: honeypot empty and 8 s – 24 h between render and submit. */
export function botCheck(o: Record<string, unknown>, now = Date.now()) {
  if (typeof o.company_fax === 'string' && o.company_fax.trim()) return false
  const t = Number(o.startedAt)
  return Number.isFinite(t) && now - t >= 8000 && now - t <= 24 * 3600_000
}
