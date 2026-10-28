// Accessibility audit with axe-core (WCAG 2.0/2.1/2.2 A + AA rules). node scripts/qa-axe.mjs [path...]
import { createRequire } from 'node:module'
import { readFileSync } from 'node:fs'
const require = createRequire(import.meta.url)
const { chromium } = require('playwright')
const axeSource = readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8')
const paths = process.argv.slice(2).length ? process.argv.slice(2) : ['/?tier=poster', '/concepts/atelier-north', '/concepts/atelier-north/before']
const browser = await chromium.launch()
for (const path of paths) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  await page.goto(`http://localhost:${process.env.PORT ?? 3000}${path}`, { waitUntil: 'networkidle' })
  // Reveal everything that animates in on scroll before auditing.
  await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)) } window.scrollTo(0, 0) })
  await page.waitForTimeout(1500)
  await page.addScriptTag({ content: axeSource })
  const res = await page.evaluate(() => window.axe.run(document, { runOnly: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] }))
  console.log(`\n${path}: ${res.violations.length} violation types, ${res.passes.length} passing rules`)
  for (const v of res.violations) { console.log(`  [${v.impact}] ${v.id}: ${v.help} (${v.nodes.length})`); if (process.env.VERBOSE) for (const n of v.nodes) console.log(`     ${n.target.join(" ")} — ${n.failureSummary?.split("\n")[1]?.trim()}`); else console.log(`     e.g. ${v.nodes[0].target.join(" ")}`) }
  await page.close()
}
await browser.close()
