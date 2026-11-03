import { useEffect, useRef, useState } from 'react'
import { Logo } from '~/components/site/Logo'
import { track } from '~/lib/analytics'

const LINKS = [
  { href: '#collection', label: 'The Collection' },
  { href: '#solutions', label: 'Solutions' },
  { href: '#process', label: 'Process' },
  { href: '#investment', label: 'Investment' },
  { href: '#faq', label: 'FAQ' },
]

/** Studio-edition navigation: compact bar, pill CTA, full-screen phone menu. */
export function V2Nav() {
  const [solid, setSolid] = useState(false)
  const [open, setOpen] = useState(false)
  const toggle = useRef<HTMLButtonElement>(null)
  const menu = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    menu.current?.querySelector<HTMLElement>('a')?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      setOpen(false)
      toggle.current?.focus()
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
      <header className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${solid || open ? 'border-b border-line bg-midnight/90 backdrop-blur-md' : 'border-b border-transparent'}`}>
        <nav aria-label="Primary" className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-5 sm:px-8 md:h-[4.5rem] lg:px-12">
          <a href="#top" className="-m-2 p-2">
            <Logo />
          </a>
          <ul className="hidden items-center gap-8 lg:flex">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="text-[0.82rem] font-medium text-ivory/80 transition-colors hover:text-champagne">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-2">
            <a
              href="#consult"
              onClick={() => track('cta_click', { location: 'v2_nav' })}
              className="hidden items-center gap-2 rounded-full bg-gradient-to-r from-gold to-champagne px-5 py-2.5 text-[0.78rem] font-semibold text-midnight shadow-[0_10px_30px_-12px_rgba(201,162,39,0.8)] transition-transform hover:-translate-y-0.5 sm:inline-flex"
            >
              Start a project <span aria-hidden="true">→</span>
            </a>
            <button
              ref={toggle}
              type="button"
              className="flex h-11 w-11 items-center justify-center lg:hidden"
              aria-expanded={open}
              aria-controls="v2-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
              onClick={() => setOpen((o) => !o)}
            >
              <span className={`absolute h-px w-6 bg-ivory transition-transform duration-300 ${open ? 'rotate-45' : '-translate-y-1'}`} />
              <span className={`absolute h-px w-6 bg-ivory transition-transform duration-300 ${open ? '-rotate-45' : 'translate-y-1'}`} />
            </button>
          </div>
        </nav>
      </header>
      <div id="v2-menu" ref={menu} role="dialog" aria-modal="true" aria-label="Menu" hidden={!open} className="fixed inset-0 z-40 bg-midnight px-6 pt-24 lg:hidden">
        <ul className="space-y-1">
          {[...LINKS, { href: '#consult', label: 'Start a project' }].map((l) => (
            <li key={l.href} className="border-b border-line">
              <a href={l.href} onClick={() => setOpen(false)} className="block py-5 text-3xl font-semibold tracking-tight text-ivory">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
