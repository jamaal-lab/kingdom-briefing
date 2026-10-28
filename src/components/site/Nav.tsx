import { useEffect, useRef, useState } from 'react'
import { Logo } from './Logo'
import { ButtonLink } from './Button'
import { track } from '~/lib/analytics'

const LINKS = [
  { href: '#threshold', label: 'The Threshold' },
  { href: '#lab', label: 'Transformation Lab' },
  { href: '#intelligence', label: 'Intelligence' },
  { href: '#offerings', label: 'Offerings' },
]

export function Nav() {
  const [solid, setSolid] = useState(false)
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > window.innerHeight * 0.6)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    const first = menuRef.current?.querySelector<HTMLElement>('a')
    first?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        toggleRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:bg-ivory focus:px-4 focus:py-3 focus:text-midnight">
        Skip to content
      </a>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-700 ease-[var(--ease-cinema)] ${
          solid ? 'border-b border-line bg-midnight/80 backdrop-blur-md' : 'border-b border-transparent'
        }`}
      >
        <nav aria-label="Primary" className="mx-auto flex h-18 max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12" style={{ height: '4.5rem' }}>
          <a href="#top" aria-label="Bridge Web — back to top" className="-m-2 p-2">
            <Logo />
          </a>
          <ul className="hidden items-center gap-9 lg:flex">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="group relative py-2 text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-ivory/75 transition-colors hover:text-ivory">
                  {l.label}
                  <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-gold transition-transform duration-500 ease-[var(--ease-cinema)] group-hover:scale-x-100" />
                </a>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-3">
            <ButtonLink href="#consult" variant="ghost" arrow={false} className="hidden !min-h-10 !px-5 sm:inline-flex" onClick={() => track('cta_click', { location: 'nav' })}>
              Consultation
            </ButtonLink>
            <button
              ref={toggleRef}
              type="button"
              className="relative flex h-11 w-11 items-center justify-center lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
              onClick={() => setOpen((o) => !o)}
            >
              <span className={`absolute h-px w-6 bg-ivory transition-transform duration-500 ${open ? 'rotate-45' : '-translate-y-1'}`} />
              <span className={`absolute h-px w-6 bg-ivory transition-transform duration-500 ${open ? '-rotate-45' : 'translate-y-1'}`} />
            </button>
          </div>
        </nav>
      </header>

      <div
        id="mobile-menu"
        ref={menuRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        hidden={!open}
        className="fixed inset-0 z-40 bg-midnight/97 px-6 pt-28 backdrop-blur-lg lg:hidden"
      >
        <ul className="space-y-2">
          {[...LINKS, { href: '#consult', label: 'Consultation' }].map((l, i) => (
            <li key={l.href} className="border-b border-line">
              <a href={l.href} onClick={() => setOpen(false)} className="flex items-baseline gap-4 py-5 text-ivory">
                <span className="font-mono text-xs text-gold">0{i + 1}</span>
                <span className="display text-4xl">{l.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
