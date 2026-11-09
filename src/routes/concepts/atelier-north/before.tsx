import { createFileRoute } from '@tanstack/react-router'
import { BeforeSite } from '~/concepts/atelier-north/BeforeSite'
import { conceptBrand } from '~/concepts/atelier-north/brand'

export const Route = createFileRoute('/concepts/atelier-north/before')({
  validateSearch: (s: Record<string, unknown>) => ({ brand: s.brand === 'btbs' ? ('btbs' as const) : undefined }),
  head: ({ match }) => ({
    meta: [
      { title: `Atelier North (before) — ${import.meta.env.VITE_SITE_TARGET === 'websites' || conceptBrand(match.search.brand) === 'btbs' ? 'illustrative example by Bridge to Better Solutions' : 'fictional example by Bridge Web'}` },
      { name: 'robots', content: 'noindex' },
    ],
  }),
  component: Page,
})

function Page() {
  const { brand } = Route.useSearch()
  return <BeforeSite brand={conceptBrand(brand)} />
}
