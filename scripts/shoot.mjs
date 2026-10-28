// Page screenshots for QA: node scripts/shoot.mjs <path> <out.png> [width] [height] [scrollY|#id] [waitMs]
import { chromium } from '@playwright/test'
const [, , path = '/', out = 'shot.png', w = '1440', h = '900', scroll = '0', wait = '2500'] = process.argv
const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] })
const page = await browser.newPage({ viewport: { width: +w, height: +h }, deviceScaleFactor: 1 })
page.on('pageerror', (e) => console.log('[pageerror]', e.message))
page.on('console', (m) => m.type() === 'error' && !m.text().includes('unmount') && console.log('[console]', m.text()))
await page.goto(`http://localhost:${process.env.PORT ?? 3000}${path}`, { waitUntil: 'networkidle' })
if (scroll.startsWith('#')) await page.evaluate((s) => document.querySelector(s)?.scrollIntoView(), scroll)
else if (scroll.endsWith('%')) await page.evaluate((f) => { const el = document.querySelector('#threshold'); window.scrollTo(0, el.offsetTop + f * (el.offsetHeight - innerHeight)) }, parseFloat(scroll) / 100)
else await page.evaluate((y) => window.scrollTo(0, y), +scroll)
await page.waitForTimeout(+wait)
await page.screenshot({ path: out, timeout: 120000, animations: 'allow' })
await browser.close()
console.log('wrote', out)
