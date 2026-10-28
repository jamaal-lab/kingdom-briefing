import type { ReactNode } from 'react'
import { Reveal, SplitText } from '~/motion'

type Props = {
  index: string
  eyebrow: string
  title: readonly string[]
  children?: ReactNode
  align?: 'left' | 'split'
  id?: string
}

/** Editorial section opener: index numeral, hairline, eyebrow, display title, lede. */
export function SectionHeader({ index, eyebrow, title, children, align = 'split', id }: Props) {
  return (
    <header className={align === 'split' ? 'grid gap-10 lg:grid-cols-12 lg:gap-6' : 'max-w-3xl'}>
      <div className={align === 'split' ? 'lg:col-span-7' : ''}>
        <Reveal className="flex items-center gap-4 text-champagne/70" variant="fade">
          <span className="font-mono text-[0.7rem] text-gold">{index}</span>
          <span className="h-px w-12 bg-champagne/30" />
          <span className="eyebrow">{eyebrow}</span>
        </Reveal>
        <SplitText as="h2" id={id} lines={title} className="display mt-7 text-[clamp(2.5rem,6vw,5.25rem)] text-ivory" />
      </div>
      {children && (
        <Reveal className={align === 'split' ? 'self-end text-[1.05rem] leading-relaxed text-mist lg:col-span-5 lg:pb-3' : 'mt-6 text-lg leading-relaxed text-mist'} delay={200}>
          {children}
        </Reveal>
      )}
    </header>
  )
}
