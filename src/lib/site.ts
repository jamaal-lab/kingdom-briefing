export const SITE = {
  name: 'Bridge Web',
  parent: 'Bridge to Better Solutions, LLC',
  statement: ['Beyond the website.', 'Into the experience.'] as const,
  promise: 'Intelligent by Design. Extraordinary by Experience.',
  positioning:
    'We create cinematic digital experiences and intelligent customer journeys that help ambitious businesses stand apart.',
  email: 'CEO@Bridge2BetterSolutions.com',
} as const

export function mailto(subject: string, body = '') {
  const params = new URLSearchParams()
  params.set('subject', subject)
  if (body) params.set('body', body)
  // URLSearchParams encodes spaces as "+", which mail clients show literally.
  return `mailto:${SITE.email}?${params.toString().replace(/\+/g, '%20')}`
}
