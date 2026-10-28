/**
 * Camera continuity check. Renders the live Threshold scene (via the dev-only
 * /studio route) at evenly spaced scroll positions and measures the mean
 * per-pixel change between neighbouring frames. A smooth camera path shows
 * steady values; a cut or pop shows as an outlier.
 *   npm run dev   (other terminal)
 *   node scripts/qa-continuity.mjs [steps=40] [tier=lite]
 */
import { chromium } from '@playwright/test'
import sharp from 'sharp'

const steps = Number(process.argv[2] ?? 40)
const tier = process.argv[3] ?? 'lite'
const W = 384, H = 216
const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] })
const frames = []
for (let i = 0; i <= steps; i++) {
  const p = +(i / steps).toFixed(4)
  const page = await browser.newPage({ viewport: { width: W, height: H } })
  await page.goto(`http://localhost:${process.env.PORT ?? 3000}/studio?scene=threshold&p=${p}&w=${W}&h=${H}&tier=${tier}&t=4.2`)
  await page.waitForFunction(() => window.__studioDone === true, null, { timeout: 120_000 })
  const url = await page.evaluate(() => document.querySelector('#studio-frame canvas').toDataURL('image/png'))
  await page.close()
  const { data } = await sharp(Buffer.from(url.split(',')[1], 'base64')).removeAlpha().raw().toBuffer({ resolveWithObject: true })
  frames.push({ p, data })
}
await browser.close()
const diffs = []
for (let i = 1; i < frames.length; i++) {
  const a = frames[i - 1].data, b = frames[i].data
  let sum = 0
  for (let k = 0; k < a.length; k++) sum += Math.abs(a[k] - b[k])
  diffs.push({ from: frames[i - 1].p, to: frames[i].p, meanAbsDiff: +(sum / a.length).toFixed(2) })
}
// A pop/cut is a step that changes far more than BOTH neighbours (a spike), not
// merely a large change: passing close to geometry is legitimately fast.
const isSpike = (i) => {
  const d = diffs[i].meanAbsDiff
  const prev = diffs[i - 1]?.meanAbsDiff ?? d
  const next = diffs[i + 1]?.meanAbsDiff ?? d
  return d > 2 * Math.max(prev, next) && d > 5
}
const sorted = diffs.map((d) => d.meanAbsDiff).sort((x, y) => x - y)
const median = sorted[Math.floor(sorted.length / 2)]
diffs.forEach((d, i) => console.log(`${d.from.toFixed(3)} → ${d.to.toFixed(3)}  Δ=${d.meanAbsDiff.toString().padStart(6)} ${isSpike(i) ? ' ◀ SPIKE (discontinuity)' : ''}`))
const spikes = diffs.filter((_, i) => isSpike(i)).length
console.log(`median Δ ${median}, max Δ ${sorted.at(-1)} (${(sorted.at(-1) / median).toFixed(1)}× median), spikes ${spikes}/${diffs.length}`)
process.exitCode = spikes ? 1 : 0
