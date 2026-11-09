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
