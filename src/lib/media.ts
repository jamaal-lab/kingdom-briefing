/**
 * Responsive image manifest. Every entry is produced by scripts/render-assets.mjs
 * from a 3840px (or 2160×3840 portrait) master and published as AVIF + WebP
 * derivatives at the listed widths. Masters are reproducible from the studio
 * route; see docs/ASSET_INVENTORY.md for provenance.
 */
export type MediaAsset = {
  base: string
  widths: readonly number[]
  width: number
  height: number
  alt: string
}

/** Public files resolve against the build's base, so static previews can live in a subfolder. */
const M = `${import.meta.env.BASE_URL}media`

const LANDSCAPE = [640, 960, 1600, 2560, 3840] as const
const PORTRAIT = [540, 828, 1080, 1440] as const

export const MEDIA = {
  thresholdArrival: { base: `${M}/threshold/arrival`, widths: LANDSCAPE, width: 3840, height: 2160, alt: '' },
  thresholdArrivalPortrait: { base: `${M}/threshold/arrival-portrait`, widths: PORTRAIT, width: 2160, height: 3840, alt: '' },
  thresholdApproach: { base: `${M}/threshold/approach`, widths: LANDSCAPE, width: 3840, height: 2160, alt: '' },
  thresholdApproachPortrait: { base: `${M}/threshold/approach-portrait`, widths: PORTRAIT, width: 2160, height: 3840, alt: '' },
  thresholdIntelligence: { base: `${M}/threshold/intelligence`, widths: LANDSCAPE, width: 3840, height: 2160, alt: '' },
  thresholdIntelligencePortrait: { base: `${M}/threshold/intelligence-portrait`, widths: PORTRAIT, width: 2160, height: 3840, alt: '' },
  halden: { base: `${M}/atelier/halden`, widths: LANDSCAPE, width: 3840, height: 2160, alt: 'Halden House: a board-formed concrete residence cantilevered over a still lake at blue hour, its long glazed upper floor lit warm from within.' },
  kestrel: { base: `${M}/atelier/kestrel`, widths: LANDSCAPE, width: 3840, height: 2160, alt: 'Kestrel Gallery: a long, low stone gallery with a single slot window, lit by low dusk sun beside a reflecting pool.' },
  morrow: { base: `${M}/atelier/morrow`, widths: LANDSCAPE, width: 3840, height: 2160, alt: 'Morrow Pavilion: a thin timber roof plane on slender black columns over a glazed room, in a meadow at golden hour.' },
  nocturne: { base: `${M}/atelier/nocturne`, widths: LANDSCAPE, width: 3840, height: 2160, alt: 'Morrow Pavilion at blue hour, glowing from within beneath its deep timber roof.' },
  interior: { base: `${M}/atelier/interior`, widths: LANDSCAPE, width: 3840, height: 2160, alt: 'Interior of Wren House: timber floor, concrete walls and a full-height window framing hills and water at dusk.' },
} as const satisfies Record<string, MediaAsset>

export function srcSet(asset: MediaAsset, ext: 'avif' | 'webp') {
  return asset.widths.map((w) => `${asset.base}-${w}.${ext} ${w}w`).join(', ')
}

export function fallbackSrc(asset: MediaAsset, w = 1600) {
  const pick = asset.widths.reduce((a, b) => (Math.abs(b - w) < Math.abs(a - w) ? b : a))
  return `${asset.base}-${pick}.webp`
}
