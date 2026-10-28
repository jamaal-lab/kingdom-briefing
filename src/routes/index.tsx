import { createFileRoute } from '@tanstack/react-router'
import { HomePage } from '~/components/site/HomePage'
import { MEDIA, srcSet } from '~/lib/media'

export const Route = createFileRoute('/')({
  head: () => ({
    links: [
      { rel: 'preload', as: 'image', type: 'image/avif', imageSrcSet: srcSet(MEDIA.thresholdArrival, 'avif'), imageSizes: '100vw', media: '(min-aspect-ratio: 1/1)', fetchPriority: 'high' },
      { rel: 'preload', as: 'image', type: 'image/avif', imageSrcSet: srcSet(MEDIA.thresholdArrivalPortrait, 'avif'), imageSizes: '100vw', media: '(max-aspect-ratio: 1/1)', fetchPriority: 'high' },
    ],
  }),
  component: HomePage,
})

