import { createFileRoute } from '@tanstack/react-router'
import { V2Page } from '~/v2/V2Page'
import { MEDIA, srcSet } from '~/lib/media'

/** Studio Edition — an alternate take, kept out of search so it never competes with the flagship. */
export const Route = createFileRoute('/v2')({
  head: () => ({
    meta: [{ title: 'Bridge Web — Studio Edition' }, { name: 'robots', content: 'noindex, nofollow' }],
    links: [{ rel: 'preload', as: 'image', type: 'image/avif', imageSrcSet: srcSet(MEDIA.thresholdArrival, 'avif'), imageSizes: '(min-width: 1024px) 58vw, 100vw', fetchPriority: 'high' }],
  }),
  component: V2Page,
})
