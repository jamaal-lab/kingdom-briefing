import { createStart, createMiddleware } from '@tanstack/react-start'

/**
 * Staging gate. When STAGING_BASIC_AUTH="user:password" is set on the server,
 * every page and API request needs those credentials (HTTP Basic over HTTPS).
 * Unset in production. Static files (/assets, /media, /fonts) are served by
 * the platform without this check; they contain nothing private.
 */
const stagingGate = createMiddleware().server(async ({ next, request }) => {
  const expected = process.env.STAGING_BASIC_AUTH
  if (!expected) return next()
  const header = request.headers.get('authorization') ?? ''
  const [scheme, encoded] = header.split(' ')
  let supplied = ''
  try {
    supplied = scheme === 'Basic' && encoded ? atob(encoded) : ''
  } catch {
    supplied = ''
  }
  if (!timingSafeEqual(supplied, expected)) {
    throw new Response('Authentication required.', {
      status: 401,
      headers: { 'www-authenticate': 'Basic realm="Bridge Web staging", charset="UTF-8"', 'cache-control': 'no-store', 'x-robots-tag': 'noindex' },
    })
  }
  return next()
})

function timingSafeEqual(a: string, b: string) {
  const len = Math.max(a.length, b.length)
  let diff = a.length ^ b.length
  for (let i = 0; i < len; i++) diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0)
  return diff === 0
}

export const startInstance = createStart(() => ({
  requestMiddleware: [stagingGate],
}))
