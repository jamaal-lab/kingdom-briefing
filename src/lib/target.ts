/**
 * Which site this build is. 'project' = the full repository build (flagship,
 * editions, concepts). 'websites' = the Bridge to Better Solutions
 * Web Design & Digital Experiences page, mounted at /websites.
 */
export const TARGET: 'project' | 'websites' = import.meta.env.VITE_SITE_TARGET === 'websites' ? 'websites' : 'project'

/** The build's base path, always ending in "/" ("/" or "/websites/"). */
export const BASE = import.meta.env.BASE_URL

/** A public file or endpoint under the build's base path: asset('og.jpg') → '/websites/og.jpg'. */
export function asset(path: string) {
  return `${BASE}${path.replace(/^\//, '')}`
}

/** Static preview builds (vite.preview*.config.ts) have no server routes: pages are .html files. */
export const STATIC_PREVIEW = import.meta.env.VITE_STATIC_PREVIEW === '1'

/** Pages linked from the /websites page, in either build. */
export const WEBSITES_PAGES = STATIC_PREVIEW
  ? { conceptAfter: 'websites-concept.html', conceptBefore: 'websites-concept-before.html', privacy: 'websites-privacy.html', home: 'websites.html' }
  : { conceptAfter: asset('concepts/atelier-north?brand=btbs'), conceptBefore: asset('concepts/atelier-north/before?brand=btbs'), privacy: asset('privacy'), home: BASE }
