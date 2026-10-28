/**
 * Build-time deployment settings (Vite inlines VITE_* into both the client
 * and the server bundle). See docs/DEPLOYMENT.md for the full list.
 *
 *  VITE_SITE_URL  Absolute origin, e.g. https://staging.example.com — used for
 *                 canonical URLs, social images and the sitemap. If unset,
 *                 server routes fall back to the request's own origin.
 *  VITE_SITE_ENV  'production' allows indexing. Anything else (the default,
 *                 'staging') adds noindex everywhere and blocks all crawlers.
 */
export const SITE_URL = (import.meta.env.VITE_SITE_URL ?? '').replace(/\/$/, '')
export const SITE_ENV = import.meta.env.VITE_SITE_ENV === 'production' ? 'production' : 'staging'
export const INDEXABLE = SITE_ENV === 'production'

export function absoluteUrl(path: string, origin = SITE_URL) {
  return origin ? `${origin}${path}` : path
}
