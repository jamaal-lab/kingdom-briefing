// QA: drive the Intelligence Experience. node scripts/qa-intel.mjs <outdir>
import { chromium } from '@playwright/test'
const out = process.argv[2] ?? '.'
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } })
page.on('pageerror', (e) => console.log('[pageerror]', e.message))
await page.goto(`http://localhost:${process.env.PORT ?? 3000}/?tier=poster#intelligence`, { waitUntil: 'networkidle' })
await page.locator('#intelligence').scrollIntoViewIfNeeded()
await page.getByRole('button', { name: 'Run the journey' }).click()
await page.waitForTimeout(7500)
await page.evaluate(() => document.querySelector('#intelligence ol[aria-label="Journey stages"]').scrollIntoView())
await page.screenshot({ path: `${out}/intel-run.png`, fullPage: false })
console.log('announce:', await page.locator('#intelligence [aria-live="polite"]').first().textContent())
await page.evaluate(() => window.scrollBy(0, 900))
await page.screenshot({ path: `${out}/intel-run2.png` })

// Custom message on the renovation contractor
await page.locator('label', { hasText: 'Ridgeline Renovations' }).click()
await page.locator('label', { hasText: 'Write your own' }).click()
await page.fill('#custom-msg', 'Our basement flooded last night and there is water damage to the drywall. Can you help?')
await page.getByRole('button', { name: /Run the journey|Run again/ }).click()
await page.waitForTimeout(2600)
for (let i = 0; i < 3; i++) {
  const btn = page.locator('#intelligence button', { hasText: /^(City|Yes|Medium|Small|ASAP|Under \$40k)$/ }).first()
  if (await btn.count()) { await btn.click(); await page.waitForTimeout(400) }
}
await page.waitForTimeout(6000)
await page.evaluate(() => document.querySelector('#intelligence ol[aria-label="Journey stages"]').scrollIntoView())
await page.screenshot({ path: `${out}/intel-custom.png` })
await page.getByRole('radio', { name: 'Passive website' }).click()
await page.waitForTimeout(800)
await page.screenshot({ path: `${out}/intel-passive.png` })
await browser.close()
