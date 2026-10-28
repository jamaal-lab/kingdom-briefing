import { createFileRoute } from '@tanstack/react-router'
import { clientKey, createRateLimiter } from '~/server/inquiry'

const allow = createRateLimiter(30, 60_000)
const str = (v: unknown, max: number) => (typeof v === 'string' ? v.slice(0, max) : undefined)

/** POST /api/client-errors — first-party error beacon. Disabled unless ERROR_REPORTING_ENABLED=1. */
export const Route = createFileRoute('/api/client-errors')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (process.env.ERROR_REPORTING_ENABLED !== '1') return new Response(null, { status: 404 })
        if (!allow(clientKey(request))) return new Response(null, { status: 429 })
        try {
          const b = JSON.parse((await request.text()).slice(0, 4_096))
          console.warn(
            JSON.stringify({
              level: 'warn',
              event: 'client_error',
              area: str(b.area, 60),
              name: str(b.name, 60),
              message: str(b.message, 500),
              detail: str(b.detail, 200),
              path: str(b.path, 200),
              ua: str(b.ua, 200),
            }),
          )
        } catch {
          return new Response(null, { status: 400 })
        }
        return new Response(null, { status: 204 })
      },
    },
  },
})
