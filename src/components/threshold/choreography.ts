/**
 * The Threshold — a single source of truth for the cinematic sequence.
 * Camera keyframes, chapter ranges and scene state are all functions of one
 * scroll progress value p ∈ [0, 1]. The DOM overlays, the WebGL scene and the
 * offline poster renderer all read from here, so they can never drift apart.
 */
import { range, window4 } from '~/motion/tokens'

export type ChapterId = 'arrival' | 'approach' | 'transition' | 'intelligence' | 'experience'

export const CHAPTERS: ReadonlyArray<{ id: ChapterId; index: string; label: string; start: number; end: number }> = [
  { id: 'arrival', index: 'A', label: 'Arrival', start: 0, end: 0.14 },
  { id: 'approach', index: 'B', label: 'Approach', start: 0.14, end: 0.46 },
  { id: 'transition', index: 'C', label: 'Transition', start: 0.46, end: 0.62 },
  { id: 'intelligence', index: 'D', label: 'Intelligence', start: 0.62, end: 0.9 },
  { id: 'experience', index: 'E', label: 'Experience', start: 0.9, end: 1 },
]

type V3 = readonly [number, number, number]
type Key = { p: number; pos: V3; look: V3 }

export const CAMERA_KEYS: readonly Key[] = [
  { p: 0.0, pos: [0, 1.8, 37], look: [0, 8.6, 0] },
  { p: 0.12, pos: [0, 1.8, 33.5], look: [0, 8.3, 0] },
  { p: 0.3, pos: [-4.6, 3, 22], look: [0.6, 7.4, 0] },
  { p: 0.46, pos: [-0.9, 2.0, 7.8], look: [0, 4.6, -2] },
  { p: 0.56, pos: [0, 1.9, 0.6], look: [0, 2.8, -14] },
  { p: 0.63, pos: [0, 2.3, -10], look: [0, 3.4, -36] },
  { p: 0.74, pos: [-3, 3.6, -30], look: [0, 3.8, -60] },
  { p: 0.86, pos: [7, 5.6, -44], look: [-2, 3.6, -62] },
  { p: 1.0, pos: [0, 10.5, -30], look: [0, 3, -62] },
]

/** Keyframe → [segmentIndex, local t]. Linear inside a segment; the rig damps velocity. */
export function cameraSegment(p: number): [number, number] {
  const keys = CAMERA_KEYS
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i]
    const b = keys[i + 1]
    if (p <= b.p) return [i, Math.max(0, (p - a.p) / (b.p - a.p))]
  }
  return [keys.length - 2, 1]
}

/**
 * Poster images are rendered at 16:9 (landscape) and 9:16 (portrait). The live
 * camera mimics CSS object-fit: cover against whichever poster is showing, so
 * the WebGL frame lands on the same composition when it crossfades in.
 */
export const POSTER_LANDSCAPE = { aspect: 16 / 9, fov: 42 }
export const POSTER_PORTRAIT = { aspect: 9 / 16, fov: 64 }

export function fovForAspect(aspect: number) {
  const poster = aspect >= 1 ? POSTER_LANDSCAPE : POSTER_PORTRAIT
  if (aspect <= poster.aspect) return poster.fov
  const half = (poster.fov * Math.PI) / 360
  return (Math.atan((Math.tan(half) * poster.aspect) / aspect) * 360) / Math.PI
}

/** Scene state as a pure function of progress. */
export function sceneState(p: number) {
  const crossing = window4(p, 0.5, 0.56, 0.58, 0.66)
  return {
    /** Lift as the camera crosses the opening; the destination light floods in. */
    exposure: 1 + crossing * 0.2,
    /** 0 inside the pavilion, 1 once through the gate. */
    outside: range(p, 0.54, 0.66),
    /** Pavilion fog thins once we are outside, so the network carries distance. */
    fogDensity: 0.021 - range(p, 0.56, 0.72) * 0.009,
    /** Warm dawn on the far side of the gate: strongest at the crossing, calmer behind the network. */
    dawn: 0.6 + crossing * 0.35 - range(p, 0.7, 0.86) * 0.25,
    /** Network draws itself in across chapter D. */
    network: range(p, 0.6, 0.84),
    /** Final resolve: network fully lit and the journey packet visible. */
    resolve: range(p, 0.86, 1),
    /** Gate light channels breathe up during the approach. */
    channels: 0.75 + range(p, 0.14, 0.46) * 0.6,
  }
}

/** CSS-matching arrival curve (cubic-bezier(.16,1,.3,1) ≈ expo out) over 2.6s. */
export function arrival(ms: number) {
  const t = Math.min(1, Math.max(0, ms / 2600))
  return 0.15 + 0.85 * (t === 1 ? 1 : 1 - Math.pow(2, -10 * t))
}

export const JOURNEY_STAGES = [
  'Visitor request',
  'Context gathered',
  'Classified',
  'Next step',
  'Follow-up drafted',
  'Operator brief',
] as const
