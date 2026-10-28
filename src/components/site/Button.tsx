import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'
import { Magnetic } from '~/motion'

type Variant = 'gold' | 'ghost' | 'text'

const base =
  'group relative inline-flex items-center justify-center gap-3 whitespace-nowrap text-[0.72rem] font-semibold uppercase tracking-[0.24em] transition-[color,background-color,border-color,box-shadow] duration-500 ease-[var(--ease-cinema)] disabled:opacity-40 disabled:pointer-events-none'

const variants: Record<Variant, string> = {
  gold: 'min-h-12 px-7 bg-gold text-midnight hover:bg-champagne shadow-[0_0_0_1px_rgba(231,210,160,0.35),0_18px_50px_-20px_rgba(201,162,39,0.7)]',
  ghost: 'min-h-12 px-7 text-ivory border border-champagne/30 hover:border-champagne/70 hover:bg-champagne/5',
  text: 'min-h-11 px-1 text-champagne hover:text-ivory !whitespace-normal text-left',
}

function Arrow() {
  return (
    <svg viewBox="0 0 24 12" className="h-3 w-6 transition-transform duration-500 ease-[var(--ease-cinema)] group-hover:translate-x-1" aria-hidden="true">
      <path d="M0 6h22M17 1l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  )
}

type Common = { variant?: Variant; arrow?: boolean; magnetic?: boolean; children: ReactNode }

export function ButtonLink({ variant = 'gold', arrow = true, magnetic = false, children, className, ...rest }: Common & AnchorHTMLAttributes<HTMLAnchorElement>) {
  const el = (
    <a {...rest} className={`${base} ${variants[variant]} ${className ?? ''}`}>
      <span>{children}</span>
      {arrow && <Arrow />}
    </a>
  )
  return magnetic ? <Magnetic>{el}</Magnetic> : el
}

export function Button({ variant = 'gold', arrow = false, magnetic = false, children, className, ...rest }: Common & ButtonHTMLAttributes<HTMLButtonElement>) {
  const el = (
    <button type="button" {...rest} className={`${base} ${variants[variant]} ${className ?? ''}`}>
      <span>{children}</span>
      {arrow && <Arrow />}
    </button>
  )
  return magnetic ? <Magnetic>{el}</Magnetic> : el
}
