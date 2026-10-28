import { createFileRoute } from '@tanstack/react-router'
import { ADAPTERS, clientKey, createRateLimiter, newReference, sameOrigin, validateInquiry } from '~/server/inquiry'

const allow = createRateLimiter(5, 10 * 60_000)
const json = (body: unknown, status = 200) => Response.json(body, { status, headers: { 'cache-control': 'no-store' } })

/** POST /api/inquiry — disabled unless INQUIRY_ENABLED=1 (read at request time). */
export const Route = createFileRoute('/api/inquiry')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (process.env.INQUIRY_ENABLED !== '1') return json({ ok: false, error: 'Inquiry form is not enabled.' }, 404)
        const deliver = ADAPTERS[process.env.INQUIRY_DELIVERY ?? 'log']
        if (!deliver) return json({ ok: false, error: 'Delivery is not configured.' }, 503)
        if (!sameOrigin(request)) return json({ ok: false, error: 'Forbidden.' }, 403)
        if (!request.headers.get('content-type')?.includes('application/json')) return json({ ok: false, error: 'Expected JSON.' }, 415)
        if (Number(request.headers.get('content-length') ?? 0) > 8_192) return json({ ok: false, error: 'Too large.' }, 413)
        if (!allow(clientKey(request))) return json({ ok: false, error: 'Too many requests. Please email us instead.' }, 429)

        let body: unknown
        try {
          body = JSON.parse((await request.text()).slice(0, 8_192))
        } catch {
          return json({ ok: false, error: 'Invalid JSON.' }, 400)
        }
        const result = validateInquiry(body)
        if (!result.ok) return json({ ok: false, errors: result.errors }, 422)

        const reference = newReference()
        try {
          await deliver(result.value, reference)
        } catch (e) {
          console.error(JSON.stringify({ level: 'error', event: 'inquiry_delivery_failed', reference, message: String(e) }))
          return json({ ok: false, error: 'We could not deliver your message. Please email us instead.' }, 502)
        }
        return json({ ok: true, reference })
      },
    },
  },
})
