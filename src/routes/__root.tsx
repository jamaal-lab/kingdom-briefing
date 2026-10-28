import type { ReactNode } from 'react'
import { Outlet, createRootRoute, HeadContent, Scripts } from '@tanstack/react-router'
import appCss from '~/styles/app.css?url'
import { SITE } from '~/lib/site'
import { SITE_URL, INDEXABLE, absoluteUrl } from '~/lib/env'
import { NotFound } from '~/components/site/NotFound'

const TITLE = `${SITE.name} — Beyond the Website. Into the Experience.`
const DESCRIPTION = `${SITE.positioning} ${SITE.promise}`

const ORGANIZATION_JSON_LD = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE.name,
  slogan: SITE.promise,
  description: SITE.positioning,
  email: SITE.email,
  ...(SITE_URL ? { url: `${SITE_URL}/`, logo: `${SITE_URL}/favicon.svg` } : {}),
  parentOrganization: { '@type': 'Organization', name: SITE.parent },
})

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
      { name: 'theme-color', content: '#08111F' },
      { name: 'color-scheme', content: 'dark' },
      { title: TITLE },
      { name: 'description', content: DESCRIPTION },
      ...(INDEXABLE ? [] : [{ name: 'robots', content: 'noindex, nofollow' }]),
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: SITE.name },
      { property: 'og:title', content: TITLE },
      { property: 'og:description', content: DESCRIPTION },
      { property: 'og:image', content: absoluteUrl('/og-image.jpg') },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:image:alt', content: 'Bridge Web: a gold-lit monumental gateway in a dark stone pavilion, with the words Beyond the website. Into the experience.' },
      ...(SITE_URL ? [{ property: 'og:url', content: `${SITE_URL}/` }] : []),
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: TITLE },
      { name: 'twitter:description', content: DESCRIPTION },
      { name: 'twitter:image', content: absoluteUrl('/og-image.jpg') },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
      { rel: 'canonical', href: absoluteUrl('/') },
      { rel: 'preload', href: '/fonts/instrument-serif-latin-400-normal.woff2', as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' },
      { rel: 'preload', href: '/fonts/instrument-serif-latin-400-italic.woff2', as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' },
      { rel: 'preload', href: '/fonts/hanken-grotesk-latin-wght-normal.woff2', as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' },
    ],
  }),
  scripts: () => [{ type: 'application/ld+json', children: ORGANIZATION_JSON_LD }],
  component: RootComponent,
  notFoundComponent: NotFound,
})

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  )
}

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}
