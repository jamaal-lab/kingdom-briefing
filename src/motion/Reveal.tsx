import type { CSSProperties, ElementType, ReactNode } from 'react'
import { useInView } from './useInView'

export type RevealVariant = 'fade-up' | 'fade' | 'mask' | 'wipe' | 'rule'

type Props = {
  as?: ElementType
  variant?: RevealVariant
  delay?: number
  className?: string
  style?: CSSProperties
  children?: ReactNode
  id?: string
}

/** Scroll-entry reveal. Visual states live in app.css under [data-reveal]. */
export function Reveal({ as: Tag = 'div', variant = 'fade-up', delay = 0, className, style, children, id }: Props) {
  const [ref, inView] = useInView<HTMLElement>()
  return (
    <Tag
      ref={ref}
      id={id}
      data-reveal={variant}
      data-inview={inView}
      className={className}
      style={{ ...style, ['--d' as string]: `${delay}ms` }}
    >
      {children}
    </Tag>
  )
}
