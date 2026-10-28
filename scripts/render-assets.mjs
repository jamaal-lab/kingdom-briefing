/**
 * Renders master stills from the live scenes (via the /studio route on the dev
 * server) and publishes responsive AVIF + WebP derivatives into public/media.
 *
 *   npm run dev            # in another terminal
 *   node scripts/render-assets.mjs [filter]
 *
 * Masters (PNG, full resolution) are written to media-masters/ (git-ignored;
 * reproducible from this script). These are real-time WebGL renders, not
 * path-traced photography — see docs/ASSET_INVENTORY.md.
 */
import { createRequire } from 'node:module'
import { mkdirSync, writeFileSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import sharp from 'sharp'

const { chromium } = createRequire(import.meta.url)('playwright')
const PORT = process.env.PORT ?? 3000
const LANDSCAPE = [640, 960, 1600, 2560, 3840]
const PORTRAIT = [540, 828, 1080, 1440]

const SHOTS = [
  { out: 'threshold/arrival', query: 'scene=threshold&p=0&w=3840&h=2160', widths: LANDSCAPE },
  { out: 'threshold/arrival-portrait', query: 'scene=threshold&p=0&w=2160&h=3840', widths: PORTRAIT },
  { out: 'threshold/approach', query: 'scene=threshold&p=0.3&w=3840&h=2160', widths: LANDSCAPE },
  { out: 'threshold/approach-portrait', query: 'scene=threshold&p=0.3&w=2160&h=3840', widths: PORTRAIT },
  { out: 'threshold/intelligence', query: 'scene=threshold&p=0.84&w=3840&h=2160&t=9.5', widths: LANDSCAPE },
  { out: 'threshold/intelligence-portrait', query: 'scene=threshold&p=0.84&w=2160&h=3840&t=9.5', widths: PORTRAIT },
  { out: 'atelier/halden', query: 'scene=architecture&shot=halden&w=3840&h=2160', widths: LANDSCAPE },
  { out: 'atelier/kestrel', query: 'scene=architecture&shot=kestrel&w=3840&h=2160', widths: LANDSCAPE },
  { out: 'atelier/morrow', query: 'scene=architecture&shot=morrow&w=3840&h=2160', widths: LANDSCAPE },
  { out: 'atelier/nocturne', query: 'scene=architecture&shot=nocturne&w=3840&h=2160', widths: LANDSCAPE },
  { out: 'atelier/interior', query: 'scene=architecture&shot=interior&w=3840&h=2160', widths: LANDSCAPE },
]

const filter = process.argv[2]
const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] })

for (const shot of SHOTS) {
  if (filter && !shot.out.includes(filter)) continue
  const q = new URLSearchParams(shot.query)
  const w = +q.get('w')
  const h = +q.get('h')
  const started = Date.now()
  const page = await browser.newPage({ viewport: { width: w, height: h } })
  page.on('pageerror', (e) => console.log('  [pageerror]', e.message))
  await page.goto(`http://localhost:${PORT}/studio?${shot.query}`)
  await page.waitForFunction(() => window.__studioDone === true, null, { timeout: 900_000, polling: 1000 })
  const data = await page.evaluate(() => document.querySelector('#studio-frame canvas').toDataURL('image/png'))
  await page.close()

  const master = Buffer.from(data.split(',')[1], 'base64')
  const masterPath = join('media-masters', `${shot.out}.png`)
  mkdirSync(dirname(masterPath), { recursive: true })
  writeFileSync(masterPath, master)

  const outDir = join('public', 'media', dirname(shot.out))
  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true })
  for (const width of shot.widths) {
    const img = sharp(master).resize({ width, withoutEnlargement: true })
    await img.clone().avif({ quality: width >= 2560 ? 58 : 52, effort: 6, chromaSubsampling: '4:4:4' }).toFile(join('public', 'media', `${shot.out}-${width}.avif`))
    await img.clone().webp({ quality: width >= 2560 ? 82 : 78, effort: 6 }).toFile(join('public', 'media', `${shot.out}-${width}.webp`))
  }
  console.log(`${shot.out}: ${w}×${h} in ${((Date.now() - started) / 1000).toFixed(1)}s`)
}
await browser.close()
