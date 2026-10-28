import { useEffect, useRef, type ReactNode } from 'react'
import { prefersReducedMotion } from '~/lib/capabilities'

type Props = { speed?: number; className?: string; children: ReactNode }

/**
 * Layered parallax: translates children relative to their position in the
 * viewport. speed 0.1 = subtle background drift, negative = moves against scroll.
 * Uses one rAF per instance only while on screen.
 */
export function Parallax({ speed = 0.12, className, children }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion()) return
    let raf = 0
    let visible = false
    const update = () => {
      raf = 0
      const r = el.getBoundingClientRect()
      const center = r.top + r.height / 2 - window.innerHeight / 2
      el.style.transform = `translate3d(0, ${(-center * speed).toFixed(2)}px, 0)`
    }
    const onScroll = () => {
      if (visible && !raf) raf = requestAnimationFrame(update)
    }
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      if (visible) onScroll()
    }, { rootMargin: '20% 0px' })
    io.observe(el)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      io.disconnect()
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [speed])

  return (
    <div ref={ref} className={className} style={{ willChange: 'transform' }}>
      {children}
    </div>
  )
}
