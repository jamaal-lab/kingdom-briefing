import type { MediaAsset } from '~/lib/media'

/**
 * The founder section. Fill this in and the section becomes personal:
 * name, portrait and story replace the studio voice automatically.
 * Leave a field undefined and that part falls back gracefully.
 * Nothing here should be invented — use your own words.
 *
 * Portrait: drop a high-resolution photo (3:4, ideally 2400×3200, subject on
 * a dark or neutral background) into media-masters/founder/portrait.png and
 * run the asset script, or ask Claude to add it.
 */
export type Founder = {
  name?: string
  role?: string
  portrait?: MediaAsset
  /** Two to four short paragraphs: why Bridge Web exists, in your voice. */
  story?: string[]
  /** One sentence you would put on the wall. */
  belief?: string
  /** How you sign off, e.g. a first name. */
  signature?: string
}

export const FOUNDER: Founder = {
  // name: 'Your name',
  // role: 'Founder & Creative Director, Bridge Web',
  // story: ['…', '…'],
  // belief: '…',
  // signature: '…',
}
