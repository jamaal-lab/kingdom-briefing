// QA: screenshot each homepage section. node scripts/sections.mjs <width> <height> <outdir> [query]
import { createRequire } from 'node:module'
const { chromium } = createRequire(import.meta.url)('playwright')
const [, , w = '1440', h = '900', out = 'shots', query = 'tier=poster'] = process.argv
const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] })
const page = await browser.newPage({ viewport: { width: +w, height: +h } })
page.on('pageerror', (e) => console.log('[pageerror]', e.message))
page.on('console', (m) => m.type() === 'error' && !m.text().includes('unmount') && console.log('[console]', m.text()))
await page.goto(`http://localhost:${process.env.PORT ?? 3000}/?${query}`, { waitUntil: 'networkidle' })
await page.waitForTimeout(2500)
await page.screenshot({ path: `${out}/s0-hero.png` })
for (const [name, sel, extra] of [
  ['s1-lab', '#lab', 0],
  ['s1b-lab-stage', '#lab', 0.55],
  ['s2-intel', '#intelligence', 0],
  ['s3-standard', '#standard-title', -0.15],
  ['s4-offer', '#offerings', 0],
  ['s4b-offer', '#offerings', 0.9],
  ['s5-consult', '#consult', 0],
  ['s6-footer', 'footer', 0],
]) {
  await page.evaluate(([s, f]) => { const el = document.querySelector(s); window.scrollTo(0, el.getBoundingClientRect().top + scrollY + f * innerHeight) }, [sel, extra])
  await page.waitForTimeout(name.startsWith('s1b') ? 6000 : 1800)
  await page.screenshot({ path: `${out}/${name}.png` })
}
await browser.close()
