import { useEffect, useRef, useState } from 'react'
import { track } from '~/lib/analytics'

type Device = 'desktop' | 'tablet' | 'mobile'
const WIDTHS: Record<Device, number | null> = { desktop: null, tablet: 834, mobile: 390 }

/**
 * Full-screen, fully interactive preview of the concept. Native <dialog> for
 * focus containment and Escape-to-close; the iframe is live, so the visitor
 * can scroll, filter the gallery and complete the guided inquiry.
 */
export function PreviewDialog({ open, onClose, before, after }: { open: boolean; onClose: () => void; before: string; after: string }) {
  const ref = useRef<HTMLDialogElement>(null)
  const [device, setDevice] = useState<Device>('desktop')
  const [version, setVersion] = useState<'after' | 'before'>('after')

  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (open && !d.open) {
      d.showModal()
      document.documentElement.style.overflow = 'hidden'
    }
    if (!open && d.open) d.close()
    return () => {
      document.documentElement.style.overflow = ''
    }
  }, [open])

  const src = version === 'after' ? after : before
  const width = WIDTHS[device]

  return (
    <dialog
      ref={ref}
      onClose={() => {
        document.documentElement.style.overflow = ''
        onClose()
      }}
      aria-label="Atelier North full preview (fictional concept)"
      className="m-0 h-[100dvh] max-h-none w-screen max-w-none bg-[#05080e] p-0 text-ivory backdrop:bg-black/80"
    >
      {open && (
        <div className="flex h-full flex-col">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 py-3 sm:px-6">
            <p className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-champagne/80">
              Atelier North <span className="text-white/40">— fictional concept</span>
            </p>
            <div className="flex flex-wrap items-center gap-1">
              <div role="radiogroup" aria-label="Version" className="mr-3 flex">
                {(['after', 'before'] as const).map((v) => (
                  <button
                    key={v}
                    type="button"
                    role="radio"
                    aria-checked={version === v}
                    onClick={() => setVersion(v)}
                    className={`min-h-10 px-3 text-[0.62rem] font-semibold uppercase tracking-[0.18em] ${version === v ? 'bg-champagne text-midnight' : 'text-white/70 hover:text-white'}`}
                  >
                    {v === 'after' ? 'After' : 'Before'}
                  </button>
                ))}
              </div>
              <div role="radiogroup" aria-label="Device width" className="flex">
                {(['desktop', 'tablet', 'mobile'] as const).map((d) => (
                  <button
                    key={d}
                    type="button"
                    role="radio"
                    aria-checked={device === d}
                    onClick={() => {
                      setDevice(d)
                      track('lab_preview_device', { device: d })
                    }}
                    className={`min-h-10 px-3 text-[0.62rem] font-semibold uppercase tracking-[0.18em] ${device === d ? 'text-gold' : 'text-white/60 hover:text-white'}`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <a href={src} target="_blank" rel="noopener" className="hidden min-h-10 items-center px-3 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-white/70 hover:text-white sm:inline-flex">
                New tab ↗
              </a>
              <button type="button" onClick={() => ref.current?.close()} className="min-h-10 border border-white/25 px-4 text-[0.62rem] font-semibold uppercase tracking-[0.18em] hover:bg-white/10">
                Close
              </button>
            </div>
          </div>
          <div className="flex min-h-0 flex-1 justify-center overflow-hidden bg-[#0b0f16] p-0 sm:p-4">
            <iframe
              key={src}
              src={src}
              title={`Atelier North ${version} — interactive preview`}
              className="h-full border-0 bg-white transition-[width] duration-700 ease-[var(--ease-cinema)] sm:rounded-md"
              style={{ width: width ? `min(${width}px, 100%)` : '100%' }}
            />
          </div>
        </div>
      )}
    </dialog>
  )
}
