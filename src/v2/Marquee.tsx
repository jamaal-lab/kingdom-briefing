const ITEMS = ['Cinematic websites', 'Interactive 3D', 'Intelligent customer journeys', 'Editorial storytelling', 'Guided inquiries', 'Accessible by default', 'Built to perform']

/** Slow capability ticker between hero and collection. Static under reduced motion. */
export function Marquee() {
  const row = (
    <ul className="flex shrink-0 items-center gap-10 pr-10">
      {ITEMS.map((t) => (
        <li key={t} className="flex items-center gap-10 whitespace-nowrap text-[0.78rem] font-semibold uppercase tracking-[0.26em] text-midnight">
          {t}
          <span aria-hidden="true" className="block h-1.5 w-1.5 rotate-45 bg-midnight/60" />
        </li>
      ))}
    </ul>
  )
  return (
    <div className="v2-marquee relative overflow-hidden bg-gradient-to-r from-gold via-champagne to-gold py-4">
      <div className="v2-marquee-track flex w-max">
        {row}
        <div aria-hidden="true">{row}</div>
      </div>
    </div>
  )
}
