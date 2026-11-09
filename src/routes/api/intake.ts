import { createFileRoute } from '@tanstack/react-router'
import { clientKey, createRateLimiter, sameOrigin } from '~/server/inquiry'
import { botCheck, buildSubmission, configuredAdapter } from '~/server/intake'
import { validateIntake } from '~/websites/intake/schema'

// Per instance, per client IP. INTAKE_RATE_LIMIT overrides the default of 4 per 15 minutes (tests raise it).
const allow = createRateLimiter(Number(process.env.INTAKE_RATE_LIMIT) || 4, 15 * 60_000)
const MAX = 48_000
const json = (body: unknown, status = 200) => Response.json(body, { status, headers: { 'cache-control': 'no-store' } })

/** POST /api/intake — the /websites project intake. Off (503) unless INTAKE_DELIVERY is configured. */
export const Route = createFileRoute('/api/intake')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const deliver = configuredAdapter()
        if (!deliver) return json({ ok: false, code: 'not_configured', error: 'Online submissions are not switched on yet.' }, 503)
        if (!sameOrigin(request)) return json({ ok: false, error: 'Forbidden.' }, 403)
        if (!request.headers.get('content-type')?.includes('application/json')) return json({ ok: false, error: 'Expected JSON.' }, 415)
        if (Number(request.headers.get('content-length') ?? 0) > MAX) return json({ ok: false, error: 'Too large.' }, 413)
        if (!allow(clientKey(request))) return json({ ok: false, code: 'rate_limited', error: 'Too many submissions. Please email us instead.' }, 429)

        let body: Record<string, unknown>
        try {
          const text = await request.text()
          if (text.length > MAX) return json({ ok: false, error: 'Too large.' }, 413)
          body = JSON.parse(text)
          if (!body || typeof body !== 'object') throw new Error('not an object')
        } catch {
          return json({ ok: false, error: 'Invalid JSON.' }, 400)
        }
        if (!botCheck(body)) return json({ ok: false, code: 'rejected', error: 'Submission rejected. Please email us instead.' }, 400)

        const result = validateIntake(body.answers === undefined ? body : { ...(body.answers as object), consent: body.consent })
        if (!result.ok) return json({ ok: false, code: 'invalid', errors: result.errors }, 422)

        const submission = buildSubmission(result.answers, result.path)
        try {
          await deliver(submission)
        } catch (e) {
          console.error(JSON.stringify({ level: 'error', event: 'intake_delivery_failed', reference: submission.reference, message: String(e) }))
          return json({ ok: false, code: 'delivery_failed', error: 'We could not deliver your submission.' }, 502)
        }
        return json({ ok: true, reference: submission.reference })
      },
    },
  },
})
