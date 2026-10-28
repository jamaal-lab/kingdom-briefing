import { createFileRoute } from '@tanstack/react-router'
import { BeforeSite } from '~/concepts/atelier-north/BeforeSite'

export const Route = createFileRoute('/concepts/atelier-north/before')({
  head: () => ({
    meta: [
      { title: 'Atelier North (before) — fictional example by Bridge Web' },
      { name: 'robots', content: 'noindex' },
    ],
  }),
  component: BeforeSite,
})
