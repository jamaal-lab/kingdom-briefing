import { MEDIA, srcSet } from '~/lib/media'
import { INDEXABLE } from '~/lib/env'
import { COMPANY } from './config'

export const WEBSITES_TITLE = `${COMPANY.service} | ${COMPANY.legalName}`
export const WEBSITES_DESCRIPTION =
  'We build websites — and make good ones better. From quick website upgrades to complete digital transformations for organizations, by Bridge to Better Solutions, LLC. Smarter Systems. Better Outcomes.'

const OG_IMAGE = `${COMPANY.pageUrl}/og-websites.jpg`

/** Only facts published by the owner: name, tagline, email, location, founder, parent site. */
const JSON_LD = JSON.stringify({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${COMPANY.parentUrl}/#organization`,
      name: COMPANY.legalName,
      url: COMPANY.parentUrl,
      slogan: COMPANY.tagline,
      email: COMPANY.email,
      logo: `${COMPANY.pageUrl}/brand/btbs-emblem-768.png`,
      founder: { '@type': 'Person', name: COMPANY.founder.name, jobTitle: COMPANY.founder.role },
      address: { '@type': 'PostalAddress', addressLocality: 'Rochester', addressRegion: 'NY', addressCountry: 'US' },
    },
    {
      '@type': 'Service',
      '@id': `${COMPANY.pageUrl}#service`,
      name: COMPANY.service,
      serviceType: 'Website design and development',
      description: 'Quick website jobs and upgrades, and complete website buildouts.',
      url: COMPANY.pageUrl,
      provider: { '@id': `${COMPANY.parentUrl}/#organization` },
    },
    {
      '@type': 'WebPage',
      '@id': `${COMPANY.pageUrl}#webpage`,
      url: COMPANY.pageUrl,
      name: WEBSITES_TITLE,
      description: WEBSITES_DESCRIPTION,
      isPartOf: { '@type': 'WebSite', url: COMPANY.parentUrl, name: COMPANY.legalName },
      about: { '@id': `${COMPANY.pageUrl}#service` },
    },
  ],
})

/** Head for the Web Design & Digital Experiences page. `preview` marks a non-canonical copy (e.g. /websites inside the project build). */
export function websitesHead({ preview = false } = {}) {
  return {
    meta: [
      { title: WEBSITES_TITLE },
      { name: 'description', content: WEBSITES_DESCRIPTION },
      ...(preview && INDEXABLE ? [{ name: 'robots', content: 'noindex, nofollow' }] : []),
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: COMPANY.legalName },
      { property: 'og:title', content: WEBSITES_TITLE },
      { property: 'og:description', content: WEBSITES_DESCRIPTION },
      { property: 'og:url', content: COMPANY.pageUrl },
      { property: 'og:image', content: OG_IMAGE },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:image:alt', content: 'Bridge to Better Solutions — We build websites. And make good ones better.' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: WEBSITES_TITLE },
      { name: 'twitter:description', content: WEBSITES_DESCRIPTION },
      { name: 'twitter:image', content: OG_IMAGE },
    ],
    links: [
      { rel: 'canonical', href: COMPANY.pageUrl },
      { rel: 'preload', as: 'image', type: 'image/avif', imageSrcSet: srcSet(MEDIA.thresholdArrival, 'avif'), imageSizes: '100vw', media: '(min-aspect-ratio: 1/1)', fetchPriority: 'high' as const },
      { rel: 'preload', as: 'image', type: 'image/avif', imageSrcSet: srcSet(MEDIA.thresholdArrivalPortrait, 'avif'), imageSizes: '100vw', media: '(max-aspect-ratio: 1/1)', fetchPriority: 'high' as const },
    ],
    scripts: [{ type: 'application/ld+json', children: JSON_LD }],
  }
}
