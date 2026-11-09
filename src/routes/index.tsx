import { createFileRoute } from '@tanstack/react-router'
import { HomePage } from '~/components/site/HomePage'
import { WebsitesPage } from '~/websites/WebsitesPage'
import { websitesHead } from '~/websites/head'
import { MEDIA, srcSet } from '~/lib/media'

// The /websites build (SITE_TARGET=websites) serves the Bridge to Better Solutions page at its root.
const WEBSITES = import.meta.env.VITE_SITE_TARGET === 'websites'

export const Route = createFileRoute('/')({
  head: () =>
    WEBSITES
      ? websitesHead()
      : {
          links: [
            { rel: 'preload', as: 'image', type: 'image/avif', imageSrcSet: srcSet(MEDIA.thresholdArrival, 'avif'), imageSizes: '100vw', media: '(min-aspect-ratio: 1/1)', fetchPriority: 'high' },
            { rel: 'preload', as: 'image', type: 'image/avif', imageSrcSet: srcSet(MEDIA.thresholdArrivalPortrait, 'avif'), imageSizes: '100vw', media: '(max-aspect-ratio: 1/1)', fetchPriority: 'high' },
          ],
        },
  component: WEBSITES ? WebsitesPage : HomePage,
})
