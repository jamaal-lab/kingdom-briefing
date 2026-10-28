/**
 * Analytics-ready event hook. No vendor is wired in and nothing leaves the
 * browser: events are pushed to window.dataLayer (if a tag manager is later
 * installed) and dispatched as a DOM event for any listener to consume.
 * Never pass personal information in props.
 */
type Props = Record<string, string | number | boolean>

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>
  }
}

export function track(event: string, props: Props = {}) {
  if (typeof window === 'undefined') return
  window.dataLayer?.push({ event, ...props })
  window.dispatchEvent(new CustomEvent('bridge:analytics', { detail: { event, ...props } }))
}
