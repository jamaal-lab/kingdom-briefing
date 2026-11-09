import { createFileRoute } from '@tanstack/react-router'
import { SITE_URL } from '~/lib/env'
import { BASE } from '~/lib/target'

/** Only the home page is public; the fictional concept pages are deliberately excluded. Paths follow the build's base (/ or /websites/). */
export const Route = createFileRoute('/sitemap.xml')({
  server: {
    handlers: {
      GET: ({ request }) => {
        const origin = SITE_URL || new URL(request.url).origin
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${origin}${BASE}</loc></url>\n</urlset>\n`
        return new Response(xml, { headers: { 'content-type': 'application/xml; charset=utf-8', 'cache-control': 'public, max-age=3600' } })
      },
    },
  },
})
