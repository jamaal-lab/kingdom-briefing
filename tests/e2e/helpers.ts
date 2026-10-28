import type { Page } from '@playwright/test'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const axeSource = readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8')

/** Collect uncaught errors and console errors (including CSP violations). */
export function watchErrors(page: Page) {
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`))
  page.on('console', (m) => {
    if (m.type() !== 'error') return
    const t = m.text()
    // Known benign: drei <Html> unmount warning under React 19 during teardown.
    if (t.includes('synchronously unmount a root')) return
    errors.push(`console: ${t}`)
  })
  return errors
}

/** Scroll the Threshold track to a fraction of its scroll length. */
export async function scrollThreshold(page: Page, fraction: number) {
  await page.evaluate((f) => {
    const el = document.querySelector<HTMLElement>('#threshold')!
    window.scrollTo(0, el.offsetTop + f * (el.offsetHeight - window.innerHeight))
  }, fraction)
}

export async function overlayOpacity(page: Page, id: string) {
  return page.evaluate((i) => {
    const el = document.querySelector<HTMLElement>(`[data-overlay="${i}"]`)
    return el ? Number(getComputedStyle(el).opacity) : 0
  }, id)
}

/** Run axe-core WCAG 2.x A/AA rules after revealing scroll-triggered content. */
export async function axe(page: Page) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) {
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 40))
    }
    window.scrollTo(0, 0)
  })
  await page.waitForTimeout(1200)
  await page.addScriptTag({ content: axeSource })
  return page.evaluate(async () => {
    // @ts-expect-error injected global
    const res = await window.axe.run(document, { runOnly: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] })
    return res.violations.map((v: { id: string; nodes: { target: string[] }[] }) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`)
  })
}

export async function noHorizontalOverflow(page: Page) {
  return page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)
}
