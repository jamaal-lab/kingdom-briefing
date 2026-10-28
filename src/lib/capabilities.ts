/**
 * Decides how much of the cinematic layer a device receives.
 *  - "full":   WebGL2, desktop-class device → reflections, shadows, post-processing.
 *  - "lite":   WebGL2 on phones/tablets or modest hardware → same scene, lighter pipeline.
 *  - "poster": no WebGL2, reduced motion, or data-saver → rendered stills + CSS motion.
 * Runtime frame-time monitoring can still step "full" down to "lite" and "lite" to "poster".
 */
export type Tier = 'full' | 'lite' | 'poster'

export function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function hasWebGL2() {
  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl2')
    if (!gl) return false
    gl.getExtension('WEBGL_lose_context')?.loseContext()
    return true
  } catch {
    return false
  }
}

export function detectTier(): Tier {
  if (typeof window === 'undefined') return 'poster'
  const params = new URLSearchParams(window.location.search)
  const forced = params.get('tier')
  if (forced === 'full' || forced === 'lite' || forced === 'poster') return forced

  const nav = navigator as Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number }
  if (prefersReducedMotion() || nav.connection?.saveData || !hasWebGL2()) return 'poster'

  const coarse = window.matchMedia('(pointer: coarse)').matches
  const small = Math.min(window.innerWidth, window.innerHeight) < 700
  const lowMemory = (nav.deviceMemory ?? 8) < 4
  const fewCores = (navigator.hardwareConcurrency ?? 8) < 4
  if (lowMemory && fewCores) return 'poster'
  if (coarse || small || lowMemory || fewCores) return 'lite'
  return 'full'
}
