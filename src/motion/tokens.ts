/** Shared timing language. CSS mirrors these as --ease-* in app.css. */
export const ease = {
  cinema: 'expo.out',
  settle: 'power3.inOut',
  lift: 'power4.out',
} as const

export const duration = {
  micro: 0.24,
  short: 0.6,
  base: 1.1,
  long: 1.6,
  arrival: 2.6,
} as const

export const stagger = {
  word: 70,
  line: 120,
  item: 90,
} as const

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v))

/** 0→1 over [a,b] with smoothstep easing. */
export function range(p: number, a: number, b: number) {
  const t = clamp01((p - a) / (b - a))
  return t * t * (3 - 2 * t)
}

/** Fade in over [a,b], hold, fade out over [c,d]. */
export function window4(p: number, a: number, b: number, c: number, d: number) {
  return Math.min(range(p, a, b), 1 - range(p, c, d))
}
