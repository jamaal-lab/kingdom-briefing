import { ErrorBoundary } from '~/components/site/ErrorBoundary'
import { WebsitesFooter, WebsitesNav } from './sections/Chrome'
import { FinalCta, Founder, Hero, IntakeSection, Outcomes, Problem, Process, Transformation, TwoPaths, Work } from './sections/Sections'

/** Bridge to Better Solutions — Web Design & Digital Experiences (/websites). */
export function WebsitesPage() {
  return (
    <div className="btbs min-h-screen bg-navy text-ivory">
      <WebsitesNav />
      <main id="main">
        <Hero />
        <Problem />
        <TwoPaths />
        <ErrorBoundary area="transformation" fallback={null}>
          <Transformation />
        </ErrorBoundary>
        <Outcomes />
        <Work />
        <Process />
        <Founder />
        <IntakeSection />
        <FinalCta />
      </main>
      <WebsitesFooter />
    </div>
  )
}
