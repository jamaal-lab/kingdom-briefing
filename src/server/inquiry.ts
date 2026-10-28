/**
 * First-party inquiry intake — architecture in place, delivery NOT connected.
 *
 * Request path:  browser form → POST /api/inquiry → validate → abuse checks →
 *                deliver(adapter) → { ok, reference }
 *
 * Off by default. INQUIRY_ENABLED=1 turns the endpoint on; INQUIRY_DELIVERY
 * picks the adapter. Only the 'log' adapter exists, and it writes a redacted
 * line (no name, email or message text) so the pipeline can be tested on
 * staging without storing or sending personal data. Email/CRM adapters are
 * intentionally absent until approved (see docs/INQUIRY_ARCHITECTURE.md).
 */

export const PROJECT_TYPES = ['A new website', 'Redesigning an existing site', 'An immersive / 3D experience', 'Intelligent inquiry & follow-up', 'Not sure yet'] as const
export const TIERS = ['Essential', 'Signature', 'Immersive Intelligence', 'Help me decide'] as const
export const TIMINGS = ['As soon as possible', 'Within 1–3 months', 'Later this year', 'Exploring'] as const

export type Inquiry = {
  name: string
  email: string
  company?: string
  project: (typeof PROJECT_TYPES)[number]
  tier?: (typeof TIERS)[number]
  timing?: (typeof TIMINGS)[number]
  message?: string
}

export type ValidationResult = { ok: true; value: Inquiry } | { ok: false; errors: Record<string, string> }

const EMAIL = /^[^\s@<>()[\]\\,;:"]{1,64}@[^\s@<>()[\]\\,;:"]{1,253}\.[a-z]{2,}$/i
const CONTROL = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g

function clean(v: unknown, max: number) {
  return typeof v === 'string' ? v.replace(CONTROL, '').trim().slice(0, max) : ''
}

/**
 * Validates untrusted input. Also enforces the two bot checks: the hidden
 * honeypot field must be empty and the form must have been on screen for at
 * least 3 seconds (`renderedAt` is a client timestamp, so it is a speed bump,
 * not a security boundary).
 */
export function validateInquiry(input: unknown, now = Date.now()): ValidationResult {
  const errors: Record<string, string> = {}
  const o = (input && typeof input === 'object' ? input : {}) as Record<string, unknown>

  if (clean(o.website, 200)) errors.form = 'Rejected'
  const renderedAt = Number(o.renderedAt)
  if (!Number.isFinite(renderedAt) || now - renderedAt < 3000 || now - renderedAt > 24 * 3600_000) errors.form = 'Rejected'

  const name = clean(o.name, 120)
  const email = clean(o.email, 254)
  const company = clean(o.company, 160)
  const message = clean(o.message, 2000)
  const project = clean(o.project, 80)
  const tier = clean(o.tier, 80)
  const timing = clean(o.timing, 80)

  if (name.length < 2) errors.name = 'Please add your name.'
  if (!EMAIL.test(email)) errors.email = 'Please enter a valid email address.'
  if (!(PROJECT_TYPES as readonly string[]).includes(project)) errors.project = 'Please choose what you are considering.'
  if (tier && !(TIERS as readonly string[]).includes(tier)) errors.tier = 'Unknown option.'
  if (timing && !(TIMINGS as readonly string[]).includes(timing)) errors.timing = 'Unknown option.'

  if (Object.keys(errors).length) return { ok: false, errors }
  return {
    ok: true,
    value: {
      name,
      email,
      company: company || undefined,
      project: project as Inquiry['project'],
      tier: (tier || undefined) as Inquiry['tier'],
      timing: (timing || undefined) as Inquiry['timing'],
      message: message || undefined,
    },
  }
}

/** Fixed-window limiter. In-memory, so per instance: use a shared store (KV/Redis) when running more than one. */
export function createRateLimiter(limit: number, windowMs: number) {
  const hits = new Map<string, { count: number; reset: number }>()
  return (key: string, now = Date.now()) => {
    const h = hits.get(key)
    if (!h || h.reset <= now) {
      hits.set(key, { count: 1, reset: now + windowMs })
      if (hits.size > 5000) for (const [k, v] of hits) if (v.reset <= now) hits.delete(k)
      return true
    }
    h.count++
    return h.count <= limit
  }
}

export type DeliveryAdapter = (inquiry: Inquiry, reference: string) => Promise<void>

/** Redacted structured log line. Proves the pipeline without retaining personal data. */
export const logAdapter: DeliveryAdapter = async (inquiry, reference) => {
  console.log(
    JSON.stringify({
      level: 'info',
      event: 'inquiry_received',
      reference,
      project: inquiry.project,
      tier: inquiry.tier ?? null,
      timing: inquiry.timing ?? null,
      hasCompany: Boolean(inquiry.company),
      messageLength: inquiry.message?.length ?? 0,
      emailDomain: inquiry.email.split('@')[1],
    }),
  )
}

export const ADAPTERS: Record<string, DeliveryAdapter> = { log: logAdapter }

export function newReference(now = new Date()) {
  const rand = Array.from(crypto.getRandomValues(new Uint8Array(3)), (b) => b.toString(16).padStart(2, '0')).join('')
  return `BW-${now.toISOString().slice(0, 10).replace(/-/g, '')}-${rand.toUpperCase()}`
}

/** True when the request's Origin (or Referer) matches the host it was sent to. */
export function sameOrigin(request: Request) {
  const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host')
  const origin = request.headers.get('origin') ?? request.headers.get('referer')
  if (!host || !origin) return false
  try {
    return new URL(origin).host === host
  } catch {
    return false
  }
}

export function clientKey(request: Request) {
  return (request.headers.get('x-forwarded-for')?.split(',')[0] ?? request.headers.get('x-real-ip') ?? 'unknown').trim()
}
