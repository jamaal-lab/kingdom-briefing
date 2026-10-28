// Quick single still for development: node scripts/still.mjs "<studio query>" out.png
import { chromium } from '@playwright/test'
const [, , query, out] = process.argv
const params = new URLSearchParams(query)
const w = Number(params.get('w') ?? 1600)
const h = Number(params.get('h') ?? 900)
const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] })
const page = await browser.newPage({ viewport: { width: w, height: h } })
page.on('console', (m) => m.type() === 'error' && console.log('[console]', m.text()))
page.on('pageerror', (e) => console.log('[pageerror]', e.message))
await page.goto(`http://localhost:${process.env.PORT ?? 3000}/studio?${query}`)
await page.waitForFunction(() => window.__studioDone === true, null, { timeout: 600_000 })
const data = await page.evaluate(() => document.querySelector('#studio-frame canvas').toDataURL('image/png'))
const { writeFileSync } = await import('node:fs')
writeFileSync(out, Buffer.from(data.split(',')[1], 'base64'))
await browser.close()
console.log('wrote', out)
