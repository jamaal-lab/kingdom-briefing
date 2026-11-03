import { chromium } from '@playwright/test'
const [, , w, h, tag, q = '?tier=poster'] = process.argv
const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] })
const p = await b.newPage({ viewport: { width: +w, height: +h } })
const errs = []; p.on('pageerror', (e) => errs.push(e.message)); p.on('console', (m) => m.type() === 'error' && !m.text().includes('unmount') && errs.push(m.text()))
await p.goto('http://localhost:4400/v2' + q, { waitUntil: 'networkidle' }); await p.waitForTimeout(2500)
await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 400) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)) } scrollTo(0, 0) })
await p.waitForTimeout(1200)
const H = await p.evaluate(() => document.documentElement.scrollHeight)
console.log('height', H, 'overflow', await p.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1))
let i = 0
for (let y = 0; y < H; y += +h) { await p.evaluate((yy) => scrollTo(0, yy), y); await p.waitForTimeout(500); await p.screenshot({ path: `/tmp/claude-0/shots/v2-${tag}-${String(i++).padStart(2, '0')}.png` }) }
console.log('shots', i, 'errors', errs)
await b.close()
