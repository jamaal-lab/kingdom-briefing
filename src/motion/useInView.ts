import { useEffect, useRef, useState } from 'react'

/** Fires once when the element crosses into view. */
export function useInView<T extends Element>(options: { rootMargin?: string; threshold?: number; once?: boolean } = {}) {
  const { rootMargin = '0px 0px -12% 0px', threshold = 0.12, once = true } = options
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!('IntersectionObserver' in window)) {
      setInView(true)
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          if (once) io.disconnect()
        } else if (!once) {
          setInView(false)
        }
      },
      { rootMargin, threshold },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [rootMargin, threshold, once])

  return [ref, inView] as const
}
