import type { ElementType } from 'react'
import { useInView } from './useInView'
import { stagger } from './tokens'

type Props = {
  as?: ElementType
  /** Each entry renders on its own line. */
  lines: readonly string[]
  className?: string
  lineClassName?: string
  delay?: number
  /** Controlled mode: reveal when true instead of on scroll. */
  play?: boolean
  id?: string
}

/**
 * Masked word-by-word headline reveal. Screen readers get the full sentence
 * once from a visually hidden copy; the animated fragments are hidden from them.
 */
export function SplitText({ as: Tag = 'h2', lines, className, lineClassName, delay = 0, play, id }: Props) {
  const [ref, inView] = useInView<HTMLElement>()
  let i = 0
  return (
    <Tag ref={ref} id={id} className={className} data-inview={play ?? inView}>
      {lines.map((line, li) => (
        <span key={li} className={`block ${lineClassName ?? ''}`} aria-hidden="true">
          {line.split(' ').map((word, wi) => {
            const d = delay + i++ * stagger.word + li * stagger.line
            return (
              <span key={wi} className="split-word">
                <span style={{ ['--d' as string]: `${d}ms` }}>{word}</span>
                {wi < line.split(' ').length - 1 ? ' ' : null}
              </span>
            )
          })}
        </span>
      ))}
      {/* Last child, so per-line :nth-child styling still counts lines from 1. */}
      <span className="sr-only">{lines.join(' ')}</span>
    </Tag>
  )
}
