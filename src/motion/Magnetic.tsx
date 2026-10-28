import { useRef, type ReactNode } from 'react'

/**
 * Premium hover micro-interaction: the child leans toward the pointer.
 * Only on fine pointers; motion is small and settles with the cinema ease.
 */
export function Magnetic({ strength = 0.22, children, className }: { strength?: number; children: ReactNode; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const move = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse' || !ref.current) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const r = ref.current.getBoundingClientRect()
    const x = (e.clientX - (r.left + r.width / 2)) * strength
    const y = (e.clientY - (r.top + r.height / 2)) * strength
    ref.current.style.transform = `translate3d(${x}px, ${y}px, 0)`
  }
  const leave = () => {
    if (ref.current) ref.current.style.transform = ''
  }
  return (
    <span
      ref={ref}
      onPointerMove={move}
      onPointerLeave={leave}
      className={`inline-block transition-transform duration-700 ease-[var(--ease-cinema)] ${className ?? ''}`}
    >
      {children}
    </span>
  )
}
