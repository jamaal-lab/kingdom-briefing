import { useEffect, useRef, useState } from 'react'
import { track } from '~/lib/analytics'
import { asset, WEBSITES_PAGES } from '~/lib/target'
import { COMPANY } from '../config'
import { deviceReducesMotion, setMotionOff, useMotionOff } from '../motion'

/**
 * The official Bridge to Better Solutions emblem, used exactly as published
 * on bridge2bettersolutions.com (only resized). The name beside it is set as
 * text, not drawn as a logo.
 */
export function BtbsLogo({ size = 44, withName = true, sub }: { size?: number; withName?: boolean; sub?: string }) {
  const src = (w: number, ext: string) => asset(`brand/btbs-emblem-${w}.${ext}`)
  const one = size <= 48 ? 96 : size <= 96 ? 192 : 384
  return (
    <span className="flex items-center gap-3">
      <picture className="shrink-0">
        <source type="image/webp" srcSet={`${src(one, 'webp')} 1x, ${src(one * 2, 'webp')} 2x`} />
        <img src={src(one, 'png')} width={size} height={size} alt={withName ? '' : COMPANY.legalName} className="block rounded-full" style={{ width: size, height: size }} />
      </picture>
      {withName && (
        <span className="leading-tight">
          <span className="block text-[0.9rem] font-semibold tracking-tight text-ivory">{COMPANY.shortName}</span>
          {sub && <span className="block text-[0.64rem] uppercase tracking-[0.18em] text-mist">{sub}</span>}
        </span>
      )}
    </span>
  )
}

export const NAV_LINKS = [
  { href: '#services', label: 'Services' },
  { href: '#transformation', label: 'Transformation' },
  { href: '#work', label: 'Work' },
  { href: '#process', label: 'Process' },
  { href: '#about', label: 'About' },
]

export function startProject(location: string, preset?: Record<string, string | string[]>) {
  track('cta_click', { location })
  if (preset) window.dispatchEvent(new CustomEvent('btbs:intake', { detail: preset }))
}

export function WebsitesNav() {
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
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:bg-ivory focus:px-4 focus:py-3 focus:text-navy">
        Skip to content
      </a>
      <header className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${solid || open ? 'border-b border-line bg-navy/92 backdrop-blur-md' : 'border-b border-transparent'}`}>
        <nav aria-label="Primary" className="mx-auto flex h-[4.25rem] max-w-[1440px] items-center justify-between px-5 sm:px-8 md:h-[4.75rem] lg:px-12">
          <a href="#top" className="-m-2 p-2">
            <BtbsLogo size={42} sub={COMPANY.service} />
          </a>
          <ul className="hidden items-center gap-8 lg:flex">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="text-[0.82rem] font-medium text-ivory/80 transition-colors hover:text-champagne">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-2">
            <MotionToggle className="hidden lg:inline-flex" />
            <a href="#intake" onClick={() => startProject('nav')} className="hidden items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-[0.78rem] font-semibold text-navy transition-transform hover:-translate-y-0.5 sm:inline-flex">
              Start Your Project <span aria-hidden="true">→</span>
            </a>
            <button
              ref={toggle}
              type="button"
              className="relative flex h-11 w-11 items-center justify-center lg:hidden"
              aria-expanded={open}
              aria-controls="btbs-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
              onClick={() => setOpen((o) => !o)}
            >
              <span className={`absolute h-px w-6 bg-ivory transition-transform duration-300 ${open ? 'rotate-45' : '-translate-y-1'}`} />
              <span className={`absolute h-px w-6 bg-ivory transition-transform duration-300 ${open ? '-rotate-45' : 'translate-y-1'}`} />
            </button>
          </div>
        </nav>
      </header>
      <div id="btbs-menu" ref={menu} role="dialog" aria-modal="true" aria-label="Menu" hidden={!open} className="fixed inset-0 z-40 overflow-y-auto bg-navy px-6 pb-10 pt-24 lg:hidden">
        <ul>
          {[...NAV_LINKS, { href: '#intake', label: 'Start Your Project' }].map((l) => (
            <li key={l.href} className="border-b border-line">
              <a href={l.href} onClick={() => setOpen(false)} className="block py-5 text-3xl font-semibold tracking-tight text-ivory">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <MotionToggle className="mt-8 inline-flex" />
        <p className="mt-8 text-sm text-mist">{COMPANY.tagline}</p>
      </div>
    </>
  )
}

export function WebsitesFooter() {
  return (
    <footer className="border-t border-line bg-midnight">
      <div className="mx-auto grid max-w-[1440px] gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr] lg:px-12">
        <div>
          <BtbsLogo size={64} withName={false} />
          <p className="mt-5 text-lg font-semibold text-ivory">{COMPANY.legalName}</p>
          <p className="mt-1 text-ivory/75">{COMPANY.tagline}</p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-mist">{COMPANY.service} · {COMPANY.location}</p>
        </div>
        <nav aria-label="Footer">
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-mist">This page</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            {[...NAV_LINKS, { href: '#intake', label: 'Start Your Project' }].map((l) => (
              <li key={l.href}>
                <a href={l.href} className="text-ivory/80 hover:text-champagne">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-mist">Contact</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <a href={`mailto:${COMPANY.email}`} className="break-all text-ivory/80 hover:text-champagne">
                {COMPANY.email}
              </a>
            </li>
            <li>
              <a href={COMPANY.parentUrl} className="text-ivory/80 hover:text-champagne">
                {COMPANY.shortName} home
              </a>
            </li>
            <li>
              <a href={WEBSITES_PAGES.privacy} className="text-ivory/80 hover:text-champagne">
                Intake privacy notice
              </a>
            </li>
            <li>
              <MotionToggle className="-ml-3 inline-flex" />
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line">
        <p className="mx-auto max-w-[1440px] px-5 py-6 text-xs text-mist sm:px-8 lg:px-12">
          © {new Date().getFullYear()} {COMPANY.legalName}. Design concepts shown on this page are illustrative and are not client projects.
        </p>
      </div>
    </footer>
  )
}

/**
 * Visible motion switch. Stills the live scene, scroll effects and reveals;
 * when the device already asks for reduced motion it says so instead.
 */
export function MotionToggle({ className = '' }: { className?: string }) {
  const off = useMotionOff()
  const byDevice = off && deviceReducesMotion()
  return (
    <button
      type="button"
      aria-pressed={off}
      disabled={byDevice}
      title={byDevice ? 'Your device is set to reduce motion' : undefined}
      onClick={() => {
        setMotionOff(!off)
        track('motion_toggle', { off: !off })
      }}
      className={`min-h-10 items-center gap-2 rounded-full px-3 text-[0.75rem] font-medium text-ivory/75 transition-colors hover:text-ivory disabled:cursor-default disabled:hover:text-ivory/75 ${className}`}
    >
      <span aria-hidden="true" className={`relative h-4 w-7 rounded-full border border-ivory/40 transition-colors ${off ? '' : 'bg-ivory/20'}`}>
        <span className={`absolute top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-ivory transition-[left] ${off ? 'left-0.5' : 'left-[0.85rem]'}`} />
      </span>
      {byDevice ? 'Motion reduced' : off ? 'Motion off' : 'Motion on'}
    </button>
  )
}
