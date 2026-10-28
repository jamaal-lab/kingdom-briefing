import { test, expect } from '@playwright/test'
import { watchErrors, scrollThreshold, overlayOpacity } from './helpers'

test.describe('The Threshold', () => {
  test('server-renders the headline and the poster image @responsive', async ({ page }) => {
    const res = await page.request.get('/')
    const html = await res.text()
    expect(html).toContain('Beyond the website.')
    expect(html).toContain('Into the experience.')
    expect(html).toMatch(/arrival-\d+\.avif/)
    // HTML attribute names are case-insensitive; React emits fetchPriority.
    expect(html).toMatch(/<img[^>]*arrival[^>]*fetchpriority="high"/i)
    expect(html).toMatch(/<link rel="preload" as="image"[^>]*imagesrcset="[^"]*arrival-640\.avif/i)
  })

  test('poster tier: chapters follow scroll, no canvas, no errors @responsive', async ({ page }) => {
    const errors = watchErrors(page)
    await page.goto('/?tier=poster')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await expect(page.locator('#threshold canvas')).toHaveCount(0)
    expect(await overlayOpacity(page, 'arrival')).toBeGreaterThan(0.95)

    // Each chapter becomes fully visible inside its scroll window, in order.
    for (const [f, id] of [
      [0.3, 'approach'],
      [0.545, 'transition'],
      [0.8, 'intelligence'],
      [0.99, 'experience'],
    ] as const) {
      await scrollThreshold(page, f)
      await expect.poll(() => overlayOpacity(page, id), { timeout: 8000 }).toBeGreaterThan(0.95)
      expect(await overlayOpacity(page, 'arrival')).toBeLessThan(0.05)
    }
    // Poster stills crossfade: by the intelligence chapter the third still dominates.
    const weights = await page.locator('[data-poster]').evaluateAll((els) => els.map((e) => Number((e as HTMLElement).style.opacity || 1)))
    expect(weights).toHaveLength(3)
    expect(weights[2]).toBeGreaterThan(0.9)
    expect(errors).toEqual([])
  })

  test('chapter rail jumps to a chapter and marks it current', async ({ page }) => {
    await page.goto('/?tier=poster')
    await page.getByRole('navigation', { name: 'Threshold chapters' }).getByRole('button', { name: 'Intelligence' }).click()
    await expect(page.getByRole('navigation', { name: 'Threshold chapters' }).getByRole('button', { name: 'Intelligence' })).toHaveAttribute('aria-current', 'step', { timeout: 10_000 })
  })

  test('WebGL tier boots a canvas and fades it in over the poster', async ({ page }) => {
    test.slow() // software WebGL in CI
    const errors = watchErrors(page)
    await page.goto('/?tier=lite')
    const canvas = page.locator('#threshold canvas')
    await expect(canvas).toHaveCount(1, { timeout: 30_000 })
    // The canvas wrapper switches to opacity-100 once frames are rendering.
    await expect(canvas.locator('xpath=ancestor::div[contains(@class,"transition-opacity")][1]')).toHaveClass(/opacity-100/, { timeout: 45_000 })
    expect(errors).toEqual([])
  })

  test('reduced motion: no WebGL, chapters still readable without animation', async ({ browser }) => {
    const ctx = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 1280, height: 800 } })
    const page = await ctx.newPage()
    await page.goto('/')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await page.waitForTimeout(800)
    await expect(page.locator('#threshold canvas')).toHaveCount(0)
    await scrollThreshold(page, 0.3)
    // No damping lag under reduced motion: the chapter is fully shown immediately.
    await expect.poll(() => overlayOpacity(page, 'approach'), { timeout: 2000 }).toBeGreaterThan(0.95)
    const transform = await page.locator('[data-overlay="approach"]').evaluate((e) => (e as HTMLElement).style.transform)
    expect(transform).toBe('')
    await ctx.close()
  })

  test('no-WebGL devices fall back to the poster tier', async ({ page }) => {
    await page.addInitScript(() => {
      const orig = HTMLCanvasElement.prototype.getContext
      // @ts-expect-error simulate a browser without WebGL2
      HTMLCanvasElement.prototype.getContext = function (type: string, ...rest: unknown[]) {
        if (type === 'webgl2') return null
        return orig.call(this, type as '2d', ...(rest as []))
      }
    })
    await page.goto('/')
    await expect(page.getByText('Still frames · interactive 3D on capable devices')).toBeVisible()
    await expect(page.locator('#threshold canvas')).toHaveCount(0)
  })
})

test.describe('Threshold resilience', () => {
  test('headline and copy appear without JavaScript (CSS-only intro) @mobile', async ({ browser }) => {
    const ctx = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1280, height: 800 } })
    const page = await ctx.newPage()
    await page.goto('/')
    await page.waitForTimeout(3000) // longest intro: 1.1 s delay + 1.4 s
    const visible = await page.evaluate(() => {
      const words = [...document.querySelectorAll<HTMLElement>('.split-intro .split-word > span')]
      const copy = document.querySelector<HTMLElement>('.intro-rise')!
      return { words: words.length, risen: words.every((w) => ['none', 'matrix(1, 0, 0, 1, 0, 0)'].includes(getComputedStyle(w).transform)), copy: Number(getComputedStyle(copy).opacity) }
    })
    expect(visible.words).toBeGreaterThan(4)
    expect(visible.risen).toBe(true)
    expect(visible.copy).toBe(1)
    await ctx.close()
  })

  test('a failed 3D chunk leaves the poster and the page working', async ({ page }) => {
    await page.route(/ThresholdCanvas-.*\.js$/, (r) => r.abort())
    await page.goto('/?tier=lite')
    await expect(page.getByText('Still frames · interactive 3D on capable devices')).toBeVisible({ timeout: 20_000 })
    await expect(page.locator('#threshold canvas')).toHaveCount(0)
    await page.locator('#intelligence').scrollIntoViewIfNeeded()
    await expect(page.locator('#intelligence').getByRole('button', { name: 'Run the journey' })).toBeEnabled()
  })
})
