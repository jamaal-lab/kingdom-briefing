import { createFileRoute } from '@tanstack/react-router'
import { INDEXABLE, SITE_URL } from '~/lib/env'
import { BASE } from '~/lib/target'

export const Route = createFileRoute('/robots.txt')({
  server: {
    handlers: {
      GET: ({ request }) => {
        const origin = SITE_URL || new URL(request.url).origin
        const body = INDEXABLE
          ? ['User-agent: *', 'Allow: /', `Disallow: ${BASE}concepts/`, `Disallow: ${BASE}studio`, '', `Sitemap: ${origin}${BASE}sitemap.xml`, ''].join('\n')
          : ['# Staging build: not for indexing (set VITE_SITE_ENV=production to allow).', 'User-agent: *', 'Disallow: /', ''].join('\n')
        return new Response(body, { headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'public, max-age=3600' } })
      },
    },
  },
})
