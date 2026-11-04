import { useEffect } from 'react'
import { installGlobalErrorHandlers } from '~/lib/monitoring'
import { TransformationLab } from '~/components/lab/TransformationLab'
import { IntelligenceExperience } from '~/components/intelligence/IntelligenceExperience'
import { Consultation } from '~/components/consult/Consultation'
import { V2Nav } from './V2Nav'
import { Hero } from './Hero'
import { Marquee } from './Marquee'
import { Collection } from './Collection'
import { Solutions } from './Solutions'
import { Interlude } from './Interlude'
import { Investment } from './Investment'
import { StudioNote } from './StudioNote'
import { Faq } from './Faq'
import { V2Footer } from './V2Footer'

/**
 * Bridge Web — Studio Edition (v2). A second take on the flagship: a boutique
 * studio flow (collection → solutions → interlude → live proof → investment and
 * process → founder → FAQ → consultation), alternating midnight and ivory
 * grounds. Imagery runs edge to edge and moves with the scroll. The flagship's
 * 3D scene, Transformation Lab and Intelligence demo are reused unchanged.
 */
export function V2Page() {
  useEffect(() => installGlobalErrorHandlers(), [])
  return (
    <div id="top" className="bg-midnight">
      <V2Nav />
      <main id="main">
        <Hero />
        <Marquee />
        <Collection />
        <Solutions />
        <Interlude />
        <TransformationLab index="Live" />
        <IntelligenceExperience index="Live" />
        <Investment />
        <StudioNote />
        <Faq />
        <Consultation index="Begin" />
      </main>
      <V2Footer />
    </div>
  )
}
