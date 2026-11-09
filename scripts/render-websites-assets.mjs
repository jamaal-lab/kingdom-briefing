/**
 * Renders the /websites page's generated imagery from the code that runs the site:
 *   - Transformation slider frames: the Atelier North "before" and "after"
 *     concept pages, desktop (1200×750 @2x) and phone (390×844 @3x)
 *   - Social card og-websites.jpg (1200×630)
 * Usage: npm run build:websites && PORT=4410 npm run start:websites &
 *        npm run render:websites   (WEBSITES_URL defaults to http://localhost:4410/websites/)
 */
import { chromium } from 'playwright'
import sharp from 'sharp'
import { mkdirSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const URL_ = process.env.WEBSITES_URL ?? 'http://localhost:4410/websites/'
const OUT = `${ROOT}public/media/transformation`
mkdirSync(OUT, { recursive: true })

const shots = [
  { name: 'before-desktop', path: 'concepts/atelier-north/before', viewport: { width: 1200, height: 750 }, scale: 2, widths: [960, 1600, 2400] },
  { name: 'after-desktop', path: 'concepts/atelier-north', viewport: { width: 1200, height: 750 }, scale: 2, widths: [960, 1600, 2400] },
  { name: 'before-mobile', path: 'concepts/atelier-north/before', viewport: { width: 390, height: 844 }, scale: 3, widths: [390, 780, 1170], mobile: true },
  { name: 'after-mobile', path: 'concepts/atelier-north', viewport: { width: 390, height: 844 }, scale: 3, widths: [390, 780, 1170], mobile: true },
]

const browser = await chromium.launch()
for (const s of shots) {
  const ctx = await browser.newContext({ viewport: s.viewport, deviceScaleFactor: s.scale, isMobile: !!s.mobile, hasTouch: !!s.mobile, reducedMotion: 'reduce' })
  const page = await ctx.newPage()
  await page.goto(URL_ + s.path, { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(1500)
  const png = await page.screenshot({ type: 'png' })
  for (const w of s.widths) {
    const img = sharp(png).resize({ width: w })
    await img.clone().avif({ quality: 62, effort: 6 }).toFile(`${OUT}/${s.name}-${w}.avif`)
    await img.clone().webp({ quality: 84 }).toFile(`${OUT}/${s.name}-${w}.webp`)
  }
  console.log('frame', s.name)
  await ctx.close()
}

// Social card: Threshold still + official emblem + headline, set in the site's own fonts.
const bg = readFileSync(`${ROOT}public/media/threshold/arrival-1600.webp`).toString('base64')
const emblem = readFileSync(`${ROOT}public/brand/btbs-emblem-384.png`).toString('base64')
const font = (f) => readFileSync(`${ROOT}public/fonts/${f}`).toString('base64')
const html = `<!doctype html><html><head><style>
@font-face{font-family:H;src:url(data:font/woff2;base64,${font('hanken-grotesk-latin-wght-normal.woff2')}) format('woff2');font-weight:100 900}
html,body{margin:0;width:1200px;height:630px;overflow:hidden;background:#0b1a2b;font-family:H}
.bg{position:absolute;inset:0;background:url(data:image/webp;base64,${bg}) 70% 50%/cover}
.s{position:absolute;inset:0;background:linear-gradient(90deg,rgba(11,26,43,.96) 0%,rgba(11,26,43,.78) 48%,rgba(11,26,43,.1) 100%)}
.c{position:absolute;left:72px;top:64px;right:72px;bottom:60px;display:flex;flex-direction:column}
.brand{display:flex;align-items:center;gap:18px;color:#f5f1e8;font-weight:600;font-size:24px;letter-spacing:-.01em}
.brand img{width:76px;height:76px;border-radius:50%}
.brand small{display:block;color:#e3cc93;font-size:13px;letter-spacing:.2em;text-transform:uppercase;margin-top:4px}
h1{margin:auto 0 0;color:#f5f1e8;font-weight:760;font-size:74px;line-height:.95;letter-spacing:-.03em;text-transform:uppercase}
h1 span{display:block;color:#e3cc93}
p{margin:22px 0 0;color:rgba(245,241,232,.8);font-size:22px}
</style></head><body><div class="bg"></div><div class="s"></div><div class="c">
<div class="brand"><img src="data:image/png;base64,${emblem}"><div>Bridge to Better Solutions<small>Web Design &amp; Digital Experiences</small></div></div>
<h1>We build websites.<span>And make good ones better.</span></h1>
<p>Smarter Systems. Better Outcomes.</p></div></body></html>`
const ctx = await browser.newContext({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 })
const page = await ctx.newPage()
await page.setContent(html, { waitUntil: 'load' })
await page.evaluate(() => document.fonts.ready)
const og = await page.screenshot({ type: 'png' })
await sharp(og).jpeg({ quality: 88, mozjpeg: true }).toFile(`${ROOT}public/og-websites.jpg`)
console.log('og-websites.jpg')
await browser.close()
