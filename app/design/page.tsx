import type { Metadata } from "next";
import { mission } from "@/content/story";

export const metadata: Metadata = { title: "Design Direction (internal)" };

const swatches = [
  { name: "Ink", token: "--ink", hex: "#04070D", use: "Page base" },
  { name: "Hull", token: "--hull", hex: "#0A1424", use: "Raised surfaces" },
  { name: "Deep", token: "--deep", hex: "#0F2240", use: "Bands, cards" },
  { name: "Brand Blue", token: "--brand", hex: "#1F56B8", use: "Logo blue (provisional, to be sampled)" },
  { name: "Signal Blue", token: "--brand-bright", hex: "#4D86EF", use: "Links, focus on dark" },
  { name: "Tide", token: "--tide", hex: "#9DB8E6", use: "Secondary text" },
  { name: "Foam", token: "--foam", hex: "#F4F7FC", use: "Primary text, white" },
  { name: "Brass", token: "--brass", hex: "#D6B26A", use: "Heritage accent, sparingly" },
];

export default function DesignDirection() {
  return (
    <main id="main" className="mx-auto max-w-[1600px] px-5 py-16 sm:px-8 lg:px-12">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-tide">Internal · for church review</p>
      <h1 className="mt-3 font-display text-6xl font-black uppercase sm:text-8xl">Harbor at Night</h1>
      <p className="mt-4 max-w-2xl text-lg text-tide">
        A dark, cinematic base where the brand blue reads as light on water. White does the talking; brass is a
        rare heritage accent for legacy moments and the live state.
      </p>

      <section className="mt-14" aria-labelledby="c">
        <h2 id="c" className="text-xs font-semibold uppercase tracking-[0.24em] text-tide">Color</h2>
        <ul className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {swatches.map((s) => (
            <li key={s.token} className="overflow-hidden rounded-2xl border border-line">
              <div className="h-28" style={{ background: `var(${s.token})` }} />
              <div className="bg-hull p-4">
                <p className="font-semibold">{s.name}</p>
                <p className="font-mono text-sm text-tide">{s.hex}</p>
                <p className="mt-1 text-sm text-tide">{s.use}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-16 grid gap-10 lg:grid-cols-3" aria-labelledby="t">
        <h2 id="t" className="sr-only">Type</h2>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-tide">Display · Big Shoulders</p>
          <p className="mt-3 font-display text-7xl font-black uppercase leading-[0.85]">All aboard</p>
          <p className="mt-3 text-sm text-tide">
            Designed for the City of Chicago. Condensed and loud, it carries headlines and numbers.
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-tide">Accent · Instrument Serif</p>
          <p className="mt-3 font-serif text-6xl italic leading-none text-brass">Since 1950.</p>
          <p className="mt-3 text-sm text-tide">For legacy, scripture, and The Ship. Used sparingly.</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-tide">Text · Inter</p>
          <p className="mt-3 text-lg leading-relaxed">
            Clear, readable body copy at 17–20px, with service details, forms, and long reading on the history page.
          </p>
        </div>
      </section>

      <section className="mt-16" aria-labelledby="m">
        <h2 id="m" className="text-xs font-semibold uppercase tracking-[0.24em] text-tide">Mission treatment</h2>
        <ol className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-4 lg:grid-cols-7">
          {mission.map((m, i) => (
            <li key={i} className="bg-hull p-5">
              <span className="font-display text-6xl font-black text-brand-bright">{m.letter}</span>
              <span className="mt-2 block text-sm font-medium">{m.word}</span>
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}
