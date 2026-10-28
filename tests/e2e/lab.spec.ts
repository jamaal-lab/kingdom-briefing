import { test, expect } from '@playwright/test'

test.describe('Transformation Lab', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/?tier=poster')
    await page.locator('#lab').scrollIntoViewIfNeeded()
    await expect(page.getByText('Loading both versions…')).toBeHidden({ timeout: 30_000 })
  })

  test('loads both fictional sites and is clearly labelled as a concept', async ({ page }) => {
    await expect(page.getByText('Fictional design concept · not a client case study')).toBeVisible()
    const before = page.frameLocator('iframe[title^="Before"]')
    const after = page.frameLocator('iframe[title^="After"]')
    await expect(before.getByRole('heading', { name: 'Welcome to Atelier North Architects!' })).toBeAttached()
    await expect(after.getByRole('heading', { level: 1 })).toContainText('Shaped by light')
    await expect(before.getByRole('note')).toContainText('Fictional design concept')
    await expect(after.getByRole('note')).toContainText('Fictional design concept')
  })

  test('divider works with the keyboard', async ({ page }) => {
    const slider = page.getByRole('slider', { name: 'Compare before and after' })
    await slider.focus()
    for (let i = 0; i < 5; i++) await page.keyboard.press('ArrowLeft')
    await expect(slider).toHaveAttribute('aria-valuenow', '40')
    await page.keyboard.press('Shift+ArrowRight')
    await expect(slider).toHaveAttribute('aria-valuenow', '50')
    await page.keyboard.press('Home')
    await expect(slider).toHaveAttribute('aria-valuenow', '0')
    await page.keyboard.press('End')
    await expect(slider).toHaveAttribute('aria-valuenow', '100')
  })

  test('switching device keeps the page from shifting and resizes the viewport', async ({ page }) => {
    const top = () => page.evaluate(() => document.querySelector('#intelligence')!.getBoundingClientRect().top + scrollY)
    const before = await top()
    await page.getByRole('radio', { name: /Mobile/ }).click()
    await expect(page.locator('iframe[title^="After"]')).toHaveAttribute('width', '390')
    expect(Math.abs((await top()) - before)).toBeLessThan(1)
  })

  test('section buttons scroll both sites to the same section', async ({ page }) => {
    await page.getByRole('group', { name: 'Compare a section' }).getByRole('button', { name: 'Work' }).click()
    for (const title of ['Before', 'After']) {
      const frame = page.frame({ url: title === 'Before' ? /before/ : /atelier-north$/ })!
      await expect.poll(() => frame.evaluate(() => Math.round(document.getElementById('work')!.getBoundingClientRect().top)), { timeout: 8000 }).toBeLessThan(5)
    }
  })

  test('full preview opens, switches device, and closes with Escape', async ({ page }) => {
    const opener = page.getByRole('button', { name: 'Enter full preview' })
    await opener.click()
    const dialog = page.getByRole('dialog', { name: /full preview/ })
    await expect(dialog).toBeVisible()
    await dialog.getByRole('radio', { name: 'mobile' }).click()
    await expect(dialog.locator('iframe')).toHaveAttribute('style', /390px/)
    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()
    await expect(opener).toBeFocused()
  })
})

test.describe('Atelier North concept pages', () => {
  test('after: gallery filter, lightbox keyboard navigation, guided inquiry', async ({ page }) => {
    await page.goto('/concepts/atelier-north')
    await expect(page.locator('meta[name="robots"]').first()).toHaveAttribute('content', /noindex/)
    await expect(page.getByRole('note')).toContainText('not a real firm')

    await page.getByRole('group', { name: 'Filter projects' }).getByRole('button', { name: 'Cultural' }).click()
    await expect(page.locator('#work ul > li')).toHaveCount(1)
    await page.getByRole('group', { name: 'Filter projects' }).getByRole('button', { name: 'All' }).click()
    await expect(page.locator('#work ul > li')).toHaveCount(5)

    await page.locator('#work').getByRole('button', { name: /Halden House/ }).click()
    const box = page.getByRole('dialog')
    await expect(box.getByRole('heading', { name: 'Halden House' })).toBeVisible()
    await page.keyboard.press('ArrowRight')
    await expect(box.getByRole('heading', { name: 'Kestrel Gallery' })).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(box).toBeHidden()

    await page.locator('#inquiry').scrollIntoViewIfNeeded()
    for (const option of ['A new home', 'I have a site', '6–12 months', '$2M – $5M']) await page.locator('#inquiry').getByRole('button', { name: option }).click()
    await expect(page.locator('#inquiry')).toContainText('Your brief, in brief.')
    await expect(page.locator('#inquiry')).toContainText('A site visit')
    await expect(page.locator('#inquiry')).toContainText('nothing is sent or stored')
  })

  test('before: example form is inert and says so', async ({ page }) => {
    await page.goto('/concepts/atelier-north/before')
    await expect(page.getByRole('note')).toContainText('Fictional design concept')
    await page.getByRole('button', { name: 'Submit' }).click()
    await expect(page.getByText('does not send anything')).toBeVisible()
  })
})
