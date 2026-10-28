import { test, expect } from '@playwright/test'

test.describe('Intelligence Experience', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/?tier=poster')
    await page.locator('#intelligence').scrollIntoViewIfNeeded()
  })

  test('preset journey runs all six stages and briefs the operator @mobile', async ({ page }) => {
    const section = page.locator('#intelligence')
    await section.getByRole('button', { name: 'Run the journey' }).click()
    const live = section.locator('p[aria-live="polite"]')
    await expect(live).toHaveText(/Stage 6 of 6\. Operator brief ready\./, { timeout: 15_000 })
    await expect(section).toContainText('Offer a site visit')
    await expect(section).toContainText('Draft · not sent')
    await expect(section).toContainText('High priority')
  })

  test('custom message: site asks follow-ups, classifies an urgent repair', async ({ page }) => {
    const section = page.locator('#intelligence')
    await section.locator('label', { hasText: 'Ridgeline Renovations' }).click()
    await section.locator('label', { hasText: 'Write your own' }).click()
    await page.fill('#custom-msg', 'Our basement flooded last night and there is water damage to the drywall. Can you help?')
    await section.getByRole('button', { name: /Run the journey|Run again/ }).click()
    for (const answer of ['Small', 'Under $40k', 'ASAP']) await section.getByRole('button', { name: answer, exact: true }).click()
    await expect(section.locator('p[aria-live="polite"]')).toHaveText(/Stage 6 of 6/, { timeout: 15_000 })
    await expect(section).toContainText('Urgent request')
    await expect(section).toContainText('Same-day call and site visit')
  })

  test('passive comparison shows the raw form email', async ({ page }) => {
    const section = page.locator('#intelligence')
    await section.getByRole('radio', { name: 'Passive website' }).click()
    await expect(section).toContainText('Thanks! We’ll be in touch.')
    await expect(section).toContainText('New contact form submission')
  })
})
