import { createFileRoute } from '@tanstack/react-router'
import { Nav } from '~/components/site/Nav'
import { Threshold } from '~/components/threshold/Threshold'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <div id="top">
      <Nav />
      <main id="main">
        <Threshold />
        <section id="lab" className="h-screen" />
      </main>
    </div>
  )
}
