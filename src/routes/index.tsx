import { createFileRoute } from '@tanstack/react-router'
import { Nav } from '~/components/site/Nav'
import { Footer } from '~/components/site/Footer'
import { Threshold } from '~/components/threshold/Threshold'
import { TransformationLab } from '~/components/lab/TransformationLab'
import { IntelligenceExperience } from '~/components/intelligence/IntelligenceExperience'
import { Standard } from '~/components/offerings/Standard'
import { Offerings } from '~/components/offerings/Offerings'
import { Consultation } from '~/components/consult/Consultation'
import { MEDIA, srcSet } from '~/lib/media'

export const Route = createFileRoute('/')({
  head: () => ({
    links: [
      { rel: 'preload', as: 'image', type: 'image/avif', imageSrcSet: srcSet(MEDIA.thresholdArrival, 'avif'), imageSizes: '100vw', media: '(min-aspect-ratio: 1/1)', fetchPriority: 'high' },
      { rel: 'preload', as: 'image', type: 'image/avif', imageSrcSet: srcSet(MEDIA.thresholdArrivalPortrait, 'avif'), imageSizes: '100vw', media: '(max-aspect-ratio: 1/1)', fetchPriority: 'high' },
    ],
  }),
  component: Home,
})

function Home() {
  return (
    <div id="top">
      <Nav />
      <main id="main">
        <Threshold />
        <TransformationLab />
        <IntelligenceExperience />
        <Standard />
        <Offerings />
        <Consultation />
      </main>
      <Footer />
    </div>
  )
}
