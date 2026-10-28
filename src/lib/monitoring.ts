/**
 * Client error monitoring, vendor-neutral and off-site by default.
 *  - Always: errors are pushed to the analytics data layer as `client_error`
 *    (no stack traces, no personal data) and logged in development.
 *  - VITE_ERROR_REPORTING=endpoint: also beacons a compact report to the
 *    first-party /api/client-errors route, which writes one structured log
 *    line. Swap in Sentry or similar later by replacing `send` only.
 */
import { track } from './analytics'

type Context = { area: string; detail?: string }

const MAX_REPORTS = 10
let sent = 0

function send(payload: Record<string, unknown>) {
  if (import.meta.env.VITE_ERROR_REPORTING !== 'endpoint' || sent >= MAX_REPORTS) return
  sent++
  const body = JSON.stringify(payload)
  try {
    if (!navigator.sendBeacon?.('/api/client-errors', new Blob([body], { type: 'application/json' }))) {
      void fetch('/api/client-errors', { method: 'POST', body, headers: { 'content-type': 'application/json' }, keepalive: true }).catch(() => {})
    }
  } catch {
    /* reporting must never throw */
  }
}

export function captureError(error: unknown, ctx: Context) {
  if (typeof window === 'undefined') return
  const message = error instanceof Error ? error.message : String(error)
  if (import.meta.env.DEV) console.error(`[${ctx.area}]`, error)
  track('client_error', { area: ctx.area, message: message.slice(0, 160) })
  send({
    area: ctx.area,
    detail: ctx.detail?.slice(0, 200),
    message: message.slice(0, 500),
    name: error instanceof Error ? error.name : 'Error',
    path: window.location.pathname,
    ua: navigator.userAgent.slice(0, 200),
  })
}

let installed = false
/** Global listeners for uncaught errors and promise rejections. */
export function installGlobalErrorHandlers() {
  if (installed || typeof window === 'undefined') return
  installed = true
  window.addEventListener('error', (e) => captureError(e.error ?? e.message, { area: 'window' }))
  window.addEventListener('unhandledrejection', (e) => captureError(e.reason, { area: 'promise' }))
}
