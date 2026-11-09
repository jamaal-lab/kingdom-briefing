import { useCallback, useRef, type ReactNode } from 'react'
import { Picture } from '~/components/site/Picture'
import type { MediaAsset } from '~/lib/media'
import { useScrollProgress } from './useScrollProgress'

type Props = {
  asset: MediaAsset
  portrait?: MediaAsset
  alt?: string
  /** Scale at the start of the pass; settles to 1 as the image crosses the screen. */
  zoom?: number
  /** Vertical drift in % of height across the pass (parallax depth). */
  drift?: number
  objectPosition?: string
  className?: string
  children?: ReactNode
}

/**
 * Edge-to-edge image that behaves like a camera move: it starts slightly
 * pushed in and settles while drifting against the scroll, so the scene is
 * entered rather than looked at. Static under reduced motion.
 */
export function ImmersiveImage({ asset, portrait, alt = '', zoom = 1.18, drift = 10, objectPosition = '50% 50%', className, children }: Props) {
  const box = useRef<HTMLDivElement>(null)
  const layer = useRef<HTMLDivElement>(null)
  const onProgress = useCallback(
    (p: number) => {
      if (!layer.current) return
      const s = zoom - (zoom - 1) * Math.min(1, p * 1.6)
      const y = (0.5 - p) * drift
      layer.current.style.transform = `translate3d(0, ${y.toFixed(2)}%, 0) scale(${s.toFixed(4)})`
    },
    [zoom, drift],
  )
  useScrollProgress(box, onProgress)
  return (
    <div ref={box} className={`relative overflow-hidden ${className ?? ''}`}>
      <div ref={layer} data-motion-layer className="absolute -inset-y-[8%] inset-x-0 will-change-transform" style={{ transform: `scale(${zoom})` }}>
        <Picture asset={asset} portrait={portrait} alt={alt} sizes="100vw" className="block h-full w-full" imgClassName="h-full w-full object-cover" imgStyle={{ objectPosition }} />
      </div>
      {children}
    </div>
  )
}
