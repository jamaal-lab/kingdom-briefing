export const SITE = {
  name: 'Bridge Web',
  parent: 'Bridge to Better Solutions, LLC',
  statement: ['Beyond the website.', 'Into the experience.'] as const,
  promise: 'Intelligent by Design. Extraordinary by Experience.',
  positioning:
    'We create cinematic digital experiences and intelligent customer journeys that help ambitious businesses stand apart.',
  email: 'jamaal@bridge2bettersolutions.com',
} as const

export function mailto(subject: string, body = '') {
  const params = new URLSearchParams()
  params.set('subject', subject)
  if (body) params.set('body', body)
  // URLSearchParams encodes spaces as "+", which mail clients show literally.
  return `mailto:${SITE.email}?${params.toString().replace(/\+/g, '%20')}`
}

/** Live concept pages; the static preview build serves them as plain HTML files. */
export const CONCEPT_URLS = import.meta.env.VITE_STATIC_PREVIEW
  ? { after: './atelier-north.html', before: './atelier-north-before.html' }
  : { after: '/concepts/atelier-north', before: '/concepts/atelier-north/before' }
