import { createFileRoute } from '@tanstack/react-router'
import { AfterSite } from '~/concepts/atelier-north/AfterSite'
import { conceptBrand } from '~/concepts/atelier-north/brand'

export const Route = createFileRoute('/concepts/atelier-north/')({
  validateSearch: (s: Record<string, unknown>) => ({ brand: s.brand === 'btbs' ? ('btbs' as const) : undefined }),
  head: ({ match }) => {
    const btbs = import.meta.env.VITE_SITE_TARGET === 'websites' || conceptBrand(match.search.brand) === 'btbs'
    const by = btbs ? 'Bridge to Better Solutions' : 'Bridge Web'
    return {
      meta: [
        { title: `Atelier North — ${btbs ? 'illustrative design transformation' : 'fictional design concept'} by ${by}` },
        { name: 'description', content: `A fictional architecture practice designed by ${by} to demonstrate a premium website transformation. Not a real firm.` },
        { name: 'robots', content: 'noindex' },
      ],
    }
  },
  component: Page,
})

function Page() {
  const { brand } = Route.useSearch()
  return <AfterSite brand={conceptBrand(brand)} />
}
