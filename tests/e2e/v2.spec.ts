import { test, expect } from '@playwright/test'
import { axe, noHorizontalOverflow, watchErrors } from './helpers'

test.describe('Studio Edition (/v2)', () => {
  test('renders every section without errors @responsive', async ({ page }) => {
    const errors = watchErrors(page)
    await page.goto('/v2?tier=poster')
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Beyond the website.')
    for (const id of ['collection', 'solutions', 'process', 'lab', 'intelligence', 'investment', 'studio', 'faq', 'consult']) await expect(page.locator(`#${id}`)).toHaveCount(1)
    await expect(page.locator('meta[name="robots"]').first()).toHaveAttribute('content', /noindex/)
    for (let i = 0; i < 30; i++) {
      await page.mouse.wheel(0, 800)
      await page.waitForTimeout(60)
    }
    expect(await noHorizontalOverflow(page)).toBe(true)
    expect(errors).toEqual([])
  })

  test('every collection concept is labelled fictional', async ({ page }) => {
    await page.goto('/v2?tier=poster')
    const cards = page.locator('#collection li').filter({ has: page.getByRole('button', { name: 'Make it yours' }) })
    await expect(cards).toHaveCount(4)
    for (const card of await cards.all()) await expect(card.getByText('Fictional', { exact: true })).toBeVisible()
  })

  test('"Make it yours" prefills the consultation; "See it think" opens that business in the demo', async ({ page }) => {
    await page.goto('/v2?tier=poster')
    const glasshouse = page.locator('#collection li', { hasText: 'The Glasshouse' })
    await glasshouse.getByRole('button', { name: 'Make it yours' }).click()
    await expect(page.locator('#consult-note')).toHaveValue(/Events & Venues direction \(The Glasshouse\)/)
    const href = await page.locator('#consult').getByRole('link', { name: 'Open in your email app' }).getAttribute('href')
    expect(decodeURIComponent(href!)).toContain('Project: A new website')

    await glasshouse.getByRole('button', { name: 'See it think' }).click()
    await expect(page.locator('#intelligence input[name="business"][value="venue"]')).toBeChecked()
  })

  test('Atelier North concept opens in the full preview', async ({ page }) => {
    await page.goto('/v2?tier=poster')
    await page.locator('#collection li', { hasText: 'Atelier North' }).getByRole('button', { name: 'View concept' }).click()
    const dialog = page.getByRole('dialog', { name: /full preview/ })
    await expect(dialog).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()
  })

  test('tier buttons preselect the tier in the composer', async ({ page }) => {
    await page.goto('/v2?tier=poster')
    await page.locator('#investment').getByRole('button', { name: 'Discuss Immersive Intelligence' }).click()
    await expect(page.locator('#consult input[value="Immersive Intelligence"]')).toBeChecked()
    await expect(page.locator('#consult input[value="An immersive / 3D experience"]')).toBeChecked()
  })

  test('FAQ items open and close with the keyboard', async ({ page }) => {
    await page.goto('/v2?tier=poster')
    const q = page.locator('#faq summary', { hasText: 'How much does a website cost?' })
    await q.focus()
    await page.keyboard.press('Enter')
    await expect(page.locator('#faq details').first()).toHaveAttribute('open', '')
  })

  test('has no axe violations @responsive', async ({ page }) => {
    await page.goto('/v2?tier=poster')
    expect(await axe(page)).toEqual([])
  })

  test('the hero window boots the live 3D scene', async ({ page }) => {
    test.slow()
    await page.goto('/v2?tier=lite')
    await expect(page.locator('main canvas')).toHaveCount(1, { timeout: 30_000 })
    await expect(page.getByText('Live · The Threshold, rendered in your browser')).toBeVisible()
  })
})
