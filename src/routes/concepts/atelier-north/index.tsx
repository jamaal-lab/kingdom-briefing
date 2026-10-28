import { createFileRoute } from '@tanstack/react-router'
import { AfterSite } from '~/concepts/atelier-north/AfterSite'

export const Route = createFileRoute('/concepts/atelier-north/')({
  head: () => ({
    meta: [
      { title: 'Atelier North — fictional design concept by Bridge Web' },
      { name: 'description', content: 'A fictional architecture practice designed by Bridge Web to demonstrate a premium website transformation. Not a real firm.' },
      { name: 'robots', content: 'noindex' },
    ],
  }),
  component: AfterSite,
})
