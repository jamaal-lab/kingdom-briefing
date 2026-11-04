import { useCallback, useRef } from 'react'
import { Picture } from '~/components/site/Picture'
import { MEDIA } from '~/lib/media'
import { useScrollProgress } from '~/motion'

/**
 * Pinned interlude: the screen holds while the camera pushes into the Wren
 * House interior and one line resolves. A pause between "what we do" and the
 * live proof. Under reduced motion it is a still, full-bleed image with the
 * line already in place.
 */
export function Interlude() {
  const track = useRef<HTMLElement>(null)
  const img = useRef<HTMLDivElement>(null)
  const lines = useRef<HTMLDivElement>(null)
  const shade = useRef<HTMLDivElement>(null)

  const onProgress = useCallback((raw: number) => {
    // Map the pinned stretch (track enters → track leaves) to 0..1.
    const el = track.current
    if (!el) return
    const vh = window.innerHeight
    const p = Math.min(1, Math.max(0, (raw * (el.offsetHeight + vh) - vh) / (el.offsetHeight - vh)))
    if (img.current) img.current.style.transform = `scale(${(1.32 - 0.32 * p).toFixed(4)})`
    if (shade.current) shade.current.style.opacity = (0.15 + 0.5 * p).toFixed(3)
    if (lines.current) {
      const t = Math.min(1, Math.max(0, (p - 0.25) / 0.4))
      lines.current.style.opacity = t.toFixed(3)
      lines.current.style.transform = `translate3d(0, ${((1 - t) * 30).toFixed(1)}px, 0)`
    }
  }, [])
  useScrollProgress(track, onProgress)

  return (
    <section ref={track} aria-label="Interlude" className="relative h-[220svh] bg-midnight motion-reduce:h-[100svh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <div ref={img} className="absolute inset-0 will-change-transform" style={{ transform: 'scale(1.32)' }}>
          <Picture asset={MEDIA.interior} alt={MEDIA.interior.alt} sizes="100vw" className="block h-full w-full" imgClassName="h-full w-full object-cover" />
        </div>
        <div ref={shade} className="absolute inset-0 bg-midnight opacity-15" />
        <div className="absolute inset-0 bg-[radial-gradient(80%_70%_at_50%_60%,transparent_30%,rgba(8,17,31,0.75)_100%)]" />
        <div ref={lines} className="absolute inset-0 flex items-center justify-center px-6 text-center opacity-0 motion-reduce:!opacity-100">
          <p className="v2-head max-w-4xl text-[clamp(2.4rem,6vw,5.4rem)] text-ivory">
            Every page is a room.
            <span className="block">
              <span className="v2-accent">Every visit, a sequence of moments.</span>
            </span>
          </p>
        </div>
        <p className="absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-[0.6rem] uppercase tracking-[0.2em] text-champagne/80">Wren House · fictional concept render</p>
      </div>
    </section>
  )
}
