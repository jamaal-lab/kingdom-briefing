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
import { Process } from './Process'
import { Why } from './Why'
import { Investment } from './Investment'
import { StudioNote } from './StudioNote'
import { Faq } from './Faq'
import { CtaBand } from './CtaBand'
import { V2Footer } from './V2Footer'

/**
 * Bridge Web — Studio Edition (v2). A second take on the flagship: a boutique
 * studio flow (collection → solutions → process → proof → investment → story
 * → FAQ), alternating midnight and ivory grounds, with the flagship's 3D scene,
 * Transformation Lab and Intelligence demo reused unchanged.
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
        <Process />
        <TransformationLab index="Live" />
        <Why />
        <IntelligenceExperience index="Live" />
        <Investment />
        <StudioNote />
        <Faq />
        <CtaBand />
        <Consultation index="Begin" />
      </main>
      <V2Footer />
    </div>
  )
}
