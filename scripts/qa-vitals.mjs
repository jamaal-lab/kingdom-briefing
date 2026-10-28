/**
 * Lab Web Vitals against a running production server (npm run build && npx vite preview).
 * Measures LCP, CLS and the longest event-processing duration for scripted
 * interactions (an INP proxy). Optional throttling via CDP. These are lab numbers
 * from a headless, GPU-less container — not field data.
 *   node scripts/qa-vitals.mjs [mobile|desktop] [throttle]
 */
import { createRequire } from 'node:module'
const { chromium } = createRequire(import.meta.url)('playwright')
const [, , profile = 'desktop', throttle] = process.argv
const PORT = process.env.PORT ?? 4173
const vp = profile === 'mobile' ? { width: 390, height: 844, deviceScaleFactor: 3, isMobile: true, hasTouch: true } : { width: 1440, height: 900, deviceScaleFactor: 1 }
const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] })
const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: vp.deviceScaleFactor, isMobile: vp.isMobile, hasTouch: vp.hasTouch })
const page = await ctx.newPage()
if (throttle) {
  const cdp = await ctx.newCDPSession(page)
  await cdp.send('Network.enable')
  // Roughly "Fast 4G": 9 Mbps down, 1.5 Mbps up, 60 ms RTT; CPU 4× slower.
  await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 60, downloadThroughput: (9e6 / 8), uploadThroughput: (1.5e6 / 8) })
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 })
}
await page.addInitScript(() => {
  window.__v = { lcp: 0, lcpEl: '', cls: 0, events: [] }
  new PerformanceObserver((l) => { for (const e of l.getEntries()) { window.__v.lcp = e.startTime; window.__v.lcpEl = (e.element?.tagName ?? '') + ' ' + (e.url || e.element?.textContent?.slice(0, 40) || '') } }).observe({ type: 'largest-contentful-paint', buffered: true })
  new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) { window.__v.cls += e.value; window.__v.shifts = (window.__v.shifts ?? []).concat({ v: +e.value.toFixed(4), t: Math.round(e.startTime), src: e.sources.map((x) => (x.node?.nodeName ?? '') + '.' + (x.node?.className?.toString?.().slice(0, 50) ?? '')) }) } }).observe({ type: 'layout-shift', buffered: true })
  new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__v.events.push({ name: e.name, d: e.duration, target: (e.target?.nodeName ?? '') + '.' + (e.target?.className?.toString?.().slice(0, 40) ?? ''), input: Math.round(e.processingStart - e.startTime), proc: Math.round(e.processingEnd - e.processingStart) }) }).observe({ type: 'event', durationThreshold: 16, buffered: true })
})
const t0 = Date.now()
await page.goto(`http://localhost:${PORT}/${process.env.Q ?? ''}`, { waitUntil: 'load' })
await page.waitForTimeout(4000)
const lcp = await page.evaluate(() => window.__v)
// Interactions: scroll through the page, run the intelligence demo, use the Lab slider.
for (let i = 0; i < 12; i++) { await page.mouse.wheel(0, 900); await page.waitForTimeout(250) }
await page.locator('#intelligence').scrollIntoViewIfNeeded()
await page.getByRole('button', { name: 'Run the journey' }).click()
await page.waitForTimeout(1500)
await page.locator('label', { hasText: 'Solace Clinic' }).click()
await page.locator('#lab').scrollIntoViewIfNeeded()
await page.getByRole('slider', { name: 'Compare before and after' }).focus()
await page.keyboard.press('ArrowLeft')
await page.keyboard.press('ArrowLeft')
await page.getByRole('radio', { name: /Mobile/ }).click()
await page.waitForTimeout(1500)
const v = await page.evaluate(() => window.__v)
const worst = v.events.sort((a, b) => b.d - a.d)[0]
console.log(JSON.stringify({ profile, throttle: !!throttle, LCP_ms: Math.round(lcp.lcp), LCP_element: lcp.lcpEl.trim(), CLS: +v.cls.toFixed(4), worstInteraction_ms: worst ? Math.round(worst.d) : '<16', worstInteraction: worst ? `${worst.name} on ${worst.target} (input delay ${worst.input}ms, processing ${worst.proc}ms)` : '-', shifts: process.env.VERBOSE ? v.shifts : undefined, loadedIn_ms: Date.now() - t0 }, null, 1))
await browser.close()
