import { test, expect } from '@playwright/test'
import { axe, noHorizontalOverflow, watchErrors } from './helpers'

test.describe('Navigation, offerings and consultation', () => {
  test('skip link is the first tab stop and nav anchors resolve', async ({ page }) => {
    await page.goto('/?tier=poster')
    await page.keyboard.press('Tab')
    await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused()
    for (const id of ['threshold', 'lab', 'intelligence', 'offerings', 'consult']) await expect(page.locator(`#${id}`)).toHaveCount(1)
  })

  test('mobile menu opens, traps Escape, and navigates @mobile', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'mobile only')
    await page.goto('/?tier=poster')
    await page.getByRole('button', { name: 'Open menu' }).click()
    const menu = page.getByRole('dialog', { name: 'Menu' })
    await expect(menu).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(menu).toBeHidden()
  })

  test('consultation builds a working mailto draft and offers the plain address', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write'])
    await page.goto('/?tier=poster')
    // A tier's "Discuss" link preselects that tier in the composer.
    await page.locator('#offerings').getByRole('link', { name: 'Discuss Signature' }).click()
    const consult = page.locator('#consult')
    await consult.getByText('An immersive / 3D experience').click()
    await consult.getByText('Within 1–3 months').click()
    const href = await consult.getByRole('link', { name: 'Open in your email app' }).getAttribute('href')
    expect(href).toMatch(/^mailto:CEO@Bridge2BetterSolutions\.com\?subject=/)
    const decoded = decodeURIComponent(href!)
    expect(decoded).toContain('Consultation request — An immersive / 3D experience (Signature)')
    expect(decoded).toContain('Timing: Within 1–3 months')
    expect(decoded).not.toContain('+')
    await expect(consult.getByRole('link', { name: 'CEO@Bridge2BetterSolutions.com' })).toBeVisible()
    await consult.getByRole('button', { name: 'Copy email address' }).click()
    await expect(consult.getByRole('button', { name: 'Address copied' })).toBeVisible()
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe('CEO@Bridge2BetterSolutions.com')
  })

  test('no horizontal overflow on any page @responsive', async ({ page }) => {
    for (const path of ['/?tier=poster', '/concepts/atelier-north', '/concepts/atelier-north/before']) {
      await page.goto(path)
      await page.waitForTimeout(600)
      expect(await noHorizontalOverflow(page), path).toBe(true)
    }
  })

  test('no console or CSP errors while scrolling the whole page @responsive', async ({ page }) => {
    const errors = watchErrors(page)
    await page.goto('/?tier=poster')
    for (let i = 0; i < 30; i++) {
      await page.mouse.wheel(0, 700)
      await page.waitForTimeout(80)
    }
    await page.waitForTimeout(1500)
    expect(errors).toEqual([])
  })
})

test.describe('Accessibility (axe-core, WCAG 2.x A/AA)', () => {
  for (const path of ['/?tier=poster', '/concepts/atelier-north', '/concepts/atelier-north/before']) {
    test(`${path} has no violations @responsive`, async ({ page }) => {
      await page.goto(path)
      expect(await axe(page)).toEqual([])
    })
  }
})

test.describe('Production server', () => {
  test('security and caching headers', async ({ request }) => {
    const home = await request.get('/')
    expect(home.headers()['content-security-policy']).toContain("default-src 'self'")
    expect(home.headers()['x-content-type-options']).toBe('nosniff')
    const concept = await request.get('/concepts/atelier-north')
    expect(concept.headers()['x-robots-tag']).toContain('noindex')
    const img = await request.get('/media/threshold/arrival-640.avif')
    expect(img.headers()['cache-control']).toContain('max-age=604800')
    const fictional = await request.get('/media/atelier/halden-640.webp')
    expect(fictional.headers()['x-robots-tag']).toBe('noindex')
  })

  test('inquiry and error endpoints stay off until enabled', async ({ request }) => {
    expect((await request.post('/api/inquiry', { data: { name: 'x' } })).status()).toBe(404)
    expect((await request.post('/api/client-errors', { data: {} })).status()).toBe(404)
  })

  test('render studio is not exposed in production', async ({ request }) => {
    const res = await request.get('/studio?scene=threshold&p=0&w=1600&h=900&tier=full&t=4.2&shot=halden')
    expect(res.status()).toBe(404)
  })

  test('SEO basics: robots.txt, sitemap, canonical, social image', async ({ request, page }) => {
    // Default builds are staging: crawlers are blocked and every page is noindex.
    const robots = await request.get('/robots.txt')
    expect(robots.status()).toBe(200)
    expect(await robots.text()).toContain('Disallow: /')
    expect(await (await request.get('/sitemap.xml')).text()).toContain('<loc>')
    await page.goto('/?tier=poster')
    const og = await page.locator('meta[property="og:image"]').getAttribute('content')
    expect(og).toMatch(/og-image\.jpg$/)
    expect((await request.get(new URL(og!, 'http://x').pathname)).status()).toBe(200)
    await expect(page.locator('meta[property="og:image:width"]')).toHaveAttribute('content', '1200')
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(1)
    await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(1)
    await expect(page.locator('meta[name="robots"]').first()).toHaveAttribute('content', /noindex/)
  })
})
