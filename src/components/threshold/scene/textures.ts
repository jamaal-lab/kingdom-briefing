/**
 * Procedural material maps, generated once on the client from seeded noise.
 * Small (512²), tileable, and free of licensing questions. They break up the
 * perfect CG surfaces: brushed streaks for metal, mottling for stone, slab
 * seams for the floor's reflection.
 */
import * as THREE from 'three'

function mulberry32(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Tileable value noise, fBm over a few octaves. Returns 0..1 per pixel. */
function fbm(size: number, seed: number, octaves = 5, base = 4) {
  const rand = mulberry32(seed)
  const out = new Float32Array(size * size)
  let amp = 1
  let total = 0
  for (let o = 0; o < octaves; o++) {
    const cells = base << o
    const grid = new Float32Array(cells * cells).map(() => rand())
    for (let y = 0; y < size; y++) {
      const gy = (y / size) * cells
      const y0 = Math.floor(gy)
      const fy = gy - y0
      const sy = fy * fy * (3 - 2 * fy)
      for (let x = 0; x < size; x++) {
        const gx = (x / size) * cells
        const x0 = Math.floor(gx)
        const fx = gx - x0
        const sx = fx * fx * (3 - 2 * fx)
        const x1 = (x0 + 1) % cells
        const y1 = (y0 + 1) % cells
        const a = grid[y0 * cells + x0]
        const b = grid[y0 * cells + x1]
        const c = grid[y1 * cells + x0]
        const d = grid[y1 * cells + x1]
        out[y * size + x] += amp * (a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy)
      }
    }
    total += amp
    amp *= 0.5
  }
  for (let i = 0; i < out.length; i++) out[i] /= total
  return out
}

function toTexture(canvas: HTMLCanvasElement, repeat: [number, number], color = false) {
  const tex = new THREE.CanvasTexture(canvas)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(...repeat)
  tex.anisotropy = 8
  tex.colorSpace = color ? THREE.SRGBColorSpace : THREE.NoColorSpace
  tex.needsUpdate = true
  return tex
}

function canvasFrom(size: number, fill: (x: number, y: number) => number) {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')!
  const img = ctx.createImageData(size, size)
  for (let y = 0; y < size; y++)
    for (let x = 0; x < size; x++) {
      const v = Math.max(0, Math.min(255, fill(x, y) * 255))
      const i = (y * size + x) * 4
      img.data[i] = img.data[i + 1] = img.data[i + 2] = v
      img.data[i + 3] = 255
    }
  ctx.putImageData(img, 0, 0)
  return canvas
}

/** Brushed metal: long horizontal streaks over a faint mottle. Used as roughness. */
export function brushedMetal(repeat: [number, number] = [1, 6]) {
  const size = 512
  const rand = mulberry32(7)
  const rows = new Float32Array(size).map(() => rand())
  const mottle = fbm(size, 11, 4, 3)
  const canvas = canvasFrom(size, (x, y) => {
    const streak = rows[y] * 0.6 + rows[(y + 1) % size] * 0.4
    return 0.42 + (streak - 0.5) * 0.22 + (mottle[y * size + x] - 0.5) * 0.18 + Math.sin(x * 0.09 + rows[y] * 6) * 0.015
  })
  return toTexture(canvas, repeat)
}

/** Honed black stone: soft mottling with sparse lighter veins. */
export function stone(repeat: [number, number] = [2, 2], seed = 3) {
  const size = 512
  const n = fbm(size, seed, 6, 3)
  const v = fbm(size, seed + 40, 3, 2)
  const canvas = canvasFrom(size, (x, y) => {
    const i = y * size + x
    const vein = Math.pow(1 - Math.abs(Math.sin((v[i] * 9 + n[i] * 2) * Math.PI)), 40) * 0.16
    return 0.52 + (n[i] - 0.5) * 0.3 + vein
  })
  return toTexture(canvas, repeat)
}

/**
 * Radial alpha for the floor: opaque around the architecture, dissolving
 * toward the horizon so the polished floor meets the sky without a seam.
 */
export function horizonFade(innerUv: number, outerUv: number) {
  const size = 512
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const g = canvas.getContext('2d')!
  const grad = g.createRadialGradient(size / 2, size / 2, innerUv * size, size / 2, size / 2, outerUv * size)
  grad.addColorStop(0, '#fff')
  grad.addColorStop(0.55, '#5a5a5a')
  grad.addColorStop(1, '#000')
  g.fillStyle = grad
  g.fillRect(0, 0, size, size)
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.NoColorSpace
  return tex
}

/** Floor slabs: 4 slabs per tile with fine darker seams; seams read clearly in reflections. */
export function floorSlabs(repeat: [number, number]) {
  const size = 512
  const n = fbm(size, 19, 6, 4)
  const slab = size / 4
  const canvas = canvasFrom(size, (x, y) => {
    const sx = x % slab
    const sy = y % slab
    const seam = sx < 2 || sy < 2 ? 1 : 0
    const perSlab = ((Math.floor(x / slab) * 7 + Math.floor(y / slab) * 13) % 5) / 5
    return seam ? 0.6 : 0.3 + perSlab * 0.08 + (n[y * size + x] - 0.5) * 0.35
  })
  return toTexture(canvas, repeat)
}
