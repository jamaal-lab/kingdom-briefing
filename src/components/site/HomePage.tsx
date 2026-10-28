import { Nav } from '~/components/site/Nav'
import { Footer } from '~/components/site/Footer'
import { Threshold } from '~/components/threshold/Threshold'
import { TransformationLab } from '~/components/lab/TransformationLab'
import { IntelligenceExperience } from '~/components/intelligence/IntelligenceExperience'
import { Standard } from '~/components/offerings/Standard'
import { Offerings } from '~/components/offerings/Offerings'
import { Consultation } from '~/components/consult/Consultation'

export function HomePage() {
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
