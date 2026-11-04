import { useEffect, type RefObject } from 'react'
import { prefersReducedMotion } from '~/lib/capabilities'

/**
 * Calls `onProgress(p)` with the element's progress through the viewport:
 * 0 when its top meets the bottom of the screen, 1 when its bottom leaves the
 * top. One rAF per instance, only while on screen; nothing under reduced motion.
 */
export function useScrollProgress(ref: RefObject<HTMLElement | null>, onProgress: (p: number) => void) {
  useEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion()) return
    let raf = 0
    let visible = false
    const update = () => {
      raf = 0
      const r = el.getBoundingClientRect()
      const total = r.height + window.innerHeight
      onProgress(Math.min(1, Math.max(0, (window.innerHeight - r.top) / total)))
    }
    const onScroll = () => {
      if (visible && !raf) raf = requestAnimationFrame(update)
    }
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      if (visible) onScroll()
    })
    io.observe(el)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    update()
    return () => {
      io.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [ref, onProgress])
}
