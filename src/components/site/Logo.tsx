/** Bridge Web mark: three nested portals, echoing the Threshold gateway. */
export function LogoMark({ className = 'h-7 w-7' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true" fill="none" strokeLinecap="square">
      <path d="M4.5 28.5V4.5h23v24" stroke="#C9A227" strokeWidth="1.5" />
      <path d="M9.5 28.5V9.5h13v19" stroke="#E7D2A0" strokeWidth="1.2" opacity="0.85" />
      <path d="M14 28.5V14h4v14.5" stroke="#C9A227" strokeWidth="1.1" />
      <path d="M2 28.5h28" stroke="#E7D2A0" strokeWidth="0.8" opacity="0.5" />
    </svg>
  )
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-3 ${className ?? ''}`}>
      <LogoMark />
      <span className="flex flex-col leading-none">
        <span className="text-[0.8rem] font-semibold tracking-[0.42em] text-ivory">BRIDGE WEB</span>
        <span className="mt-1 text-[0.55rem] tracking-[0.32em] text-champagne/60 uppercase">Black Label</span>
      </span>
    </span>
  )
}
