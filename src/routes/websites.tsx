import { createFileRoute, notFound } from '@tanstack/react-router'
import { WebsitesPage } from '~/websites/WebsitesPage'
import { websitesHead } from '~/websites/head'

/**
 * Preview of the /websites page inside the full project build. The real page
 * is the SITE_TARGET=websites build, where it is served at the root of /websites.
 */
export const Route = createFileRoute('/websites')({
  beforeLoad: () => {
    if (import.meta.env.VITE_SITE_TARGET === 'websites') throw notFound()
  },
  head: () => websitesHead({ preview: true }),
  component: WebsitesPage,
})
