// Renders the 1200×630 social sharing image from scripts/og/og.html → public/og-image.jpg
import { chromium } from '@playwright/test'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 })
await page.goto(new URL('./og/og.html', import.meta.url).href)
await page.evaluate(() => document.fonts.ready)
await page.waitForTimeout(300)
const png = await page.screenshot({ type: 'png' })
await browser.close()
const out = fileURLToPath(new URL('../public/og-image.jpg', import.meta.url))
await sharp(png).jpeg({ quality: 86, mozjpeg: true }).toFile(out)
console.log('wrote', out)
