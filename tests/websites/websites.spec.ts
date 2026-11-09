import { test, expect, type Page } from '@playwright/test'
import { axe, watchErrors } from '../e2e/helpers'

// Relative paths resolve under the /websites/ base URL.
const HOME = './?tier=poster'
const RETIRED = /bridge\s?web|black\s?label/i

async function revealAll(page: Page) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 500) {
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 60))
    }
  })
}

test.describe('Web Design & Digital Experiences page', () => {
  test('renders every section with the approved positioning and no errors @responsive', async ({ page }) => {
    const errors = watchErrors(page)
    await page.goto(HOME)
    await expect(page).toHaveTitle('Web Design & Digital Experiences | Bridge to Better Solutions, LLC')
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(/We build websites\.\s*And make good ones better\./i)
    await expect(page.getByText('From quick website upgrades to complete digital transformations.')).toBeVisible()
    for (const id of ['services', 'transformation', 'work', 'process', 'about', 'intake']) await expect(page.locator(`#${id}`)).toHaveCount(1)
    await expect(page.getByRole('heading', { name: /Your work deserves a digital experience that reflects its value/i })).toHaveCount(1)
    await expect(page.getByRole('link', { name: /Let’s Build Something Better/ })).toHaveAttribute('href', '#intake')
    await expect(page.locator('footer')).toContainText('Bridge to Better Solutions, LLC')
    await expect(page.locator('footer')).toContainText('Smarter Systems. Better Outcomes.')
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
    expect(overflow).toBeLessThanOrEqual(0)
    expect(errors).toEqual([])
  })

  test('never shows retired names, in the page or its scripts', async ({ page, request }) => {
    await page.goto(HOME)
    await revealAll(page)
    expect(await page.locator('body').innerText()).not.toMatch(RETIRED)
    expect(await page.content()).not.toMatch(RETIRED)
    const scripts = await page.evaluate(() => [...new Set(performance.getEntriesByType('resource').map((e) => e.name).filter((n) => n.endsWith('.js')))])
    expect(scripts.length).toBeGreaterThan(0)
    for (const src of scripts) expect(await (await request.get(src)).text(), src).not.toMatch(RETIRED)
    for (const p of ['concepts/atelier-north', 'concepts/atelier-north/before', 'privacy']) {
      await page.goto(`./${p}`)
      expect(await page.content(), p).not.toMatch(RETIRED)
    }
  })

  test('uses the official emblem and every image loads', async ({ page }) => {
    await page.goto(HOME)
    await expect(page.locator('link[rel="icon"]')).toHaveAttribute('href', '/websites/brand/favicon-32.png')
    const emblem = page.locator('header img').first()
    await expect(emblem).toHaveAttribute('src', /\/websites\/brand\/btbs-emblem-\d+\.png$/)
    await revealAll(page)
    await page.waitForLoadState('networkidle')
    const broken = await page.evaluate(() => [...document.images].filter((i) => i.loading !== 'lazy' || i.complete).filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.currentSrc || i.src))
    expect(broken).toEqual([])
  })

  test('other flagship routes are not part of this build', async ({ request }) => {
    expect((await request.get('./v2')).status()).toBe(404)
    expect((await request.get('./studio')).status()).toBe(404)
    const robots = await request.get('./robots.txt')
    expect(robots.status()).toBe(200)
  })

  test('structured data names only published facts', async ({ page }) => {
    await page.goto(HOME)
    const ld = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent()) ?? '{}')
    const org = ld['@graph'].find((n: { '@type': string }) => n['@type'] === 'Organization')
    expect(org).toMatchObject({ name: 'Bridge to Better Solutions, LLC', email: 'jamaal@bridge2bettersolutions.com', slogan: 'Smarter Systems. Better Outcomes.' })
    expect(JSON.stringify(ld)).not.toMatch(/aggregateRating|review|priceRange|telephone/i)
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://bridge2bettersolutions.com/websites')
  })

  test('accessibility: no WCAG A/AA violations @responsive', async ({ page }) => {
    await page.goto(HOME)
    expect(await axe(page)).toEqual([])
  })
})

test.describe('Transformation slider', () => {
  test('labels, keyboard and drag', async ({ page }) => {
    await page.goto(HOME)
    const section = page.locator('#transformation')
    await expect(section).toContainText('Illustrative Design Transformation')
    await expect(section).toContainText('Same business. A better digital experience.')
    await expect(section).toContainText('Drag to explore the transformation.')
    const slider = section.getByRole('slider')
    await slider.scrollIntoViewIfNeeded()
    await page.waitForTimeout(2400) // let the one-time intro nudge finish
    await expect(slider).toHaveAttribute('aria-valuenow', '50')
    await slider.focus()
    await page.keyboard.press('ArrowRight')
    await page.keyboard.press('ArrowRight')
    await expect(slider).toHaveAttribute('aria-valuenow', '54')
    await page.keyboard.press('Home')
    await expect(slider).toHaveAttribute('aria-valuenow', '0')
    await page.keyboard.press('End')
    await expect(slider).toHaveAttribute('aria-valuenow', '100')

    const box = (await slider.locator('xpath=..').boundingBox())!
    await page.mouse.move(box.x + box.width * 0.5, box.y + box.height / 2)
    await page.mouse.down()
    await page.mouse.move(box.x + box.width * 0.25, box.y + box.height / 2, { steps: 6 })
    await page.mouse.up()
    expect(Number(await slider.getAttribute('aria-valuenow'))).toBeLessThan(30)
    await expect(section.getByText('Before', { exact: true })).toHaveCount(1)
    await expect(section.getByText('After', { exact: true })).toHaveCount(1)
  })

  test('phone comparison and live pages', async ({ page }) => {
    await page.goto(HOME)
    const section = page.locator('#transformation')
    await section.getByRole('button', { name: 'Phone' }).click()
    await expect(section.getByRole('button', { name: 'Phone' })).toHaveAttribute('aria-pressed', 'true')
    await expect(section.locator('img[src*="before-mobile"]')).toHaveCount(1)
    await section.getByRole('button', { name: 'Explore the live pages' }).click()
    await expect(section.locator('iframe')).toHaveCount(2)
    await expect(section.locator('iframe').first()).toHaveAttribute('src', '/websites/concepts/atelier-north?brand=btbs')
  })

  test('opens on the phone comparison on phones @responsive', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'phone only')
    await page.goto(HOME)
    await expect(page.locator('#transformation').getByRole('button', { name: 'Phone' })).toHaveAttribute('aria-pressed', 'true')
  })
})

async function fillStart(page: Page, type: string) {
  const intake = page.locator('#intake')
  await intake.getByLabel('What is your name?').fill('Test Person')
  await intake.getByLabel('What is your business or organization called?').fill('Test Org')
  await intake.getByLabel('Best email address').fill('test.person@example.com')
  await intake.getByRole('radio', { name: 'Email' }).check()
  await intake.getByRole('group', { name: /existing website/ }).getByRole('radio', { name: 'Yes' }).check()
  await intake.getByLabel('Website address').fill('example.com')
  await intake.getByRole('radio', { name: type }).check()
  await intake.getByRole('button', { name: 'Continue' }).click()
}

async function fillOrganization(page: Page) {
  const intake = page.locator('#intake')
  await intake.getByLabel('Which best describes your organization?').selectOption('Professional Services')
  await intake.getByLabel('What does your organization do?').fill('We help people.')
  await intake.getByLabel('Who do you serve?').fill('Our community.')
  await intake.getByRole('button', { name: 'Continue' }).click()
}

async function fillScope(page: Page) {
  const intake = page.locator('#intake')
  await intake.getByRole('radio', { name: 'Flexible / exploring' }).check()
  await intake.getByRole('radio', { name: 'Just me' }).check()
  await intake.getByRole('radio', { name: 'Partly ready' }).check()
  await intake.getByRole('button', { name: 'Review answers' }).click()
}

test.describe('Project intake', () => {
  test('validates accessibly and keeps answers when going back', async ({ page }) => {
    await page.goto(HOME)
    const intake = page.locator('#intake')
    await intake.getByRole('button', { name: 'Continue' }).click()
    const alert = intake.getByRole('alert')
    await expect(alert).toContainText('Please check')
    await expect(alert).toBeFocused()
    await expect(intake.getByLabel('What is your name?')).toHaveAttribute('aria-invalid', 'true')
    await intake.getByLabel('Best email address').fill('not-an-email')
    await intake.getByRole('button', { name: 'Continue' }).click()
    await expect(intake.locator('#f-email-err')).toHaveText('Please enter a valid email address.')
    await fillStart(page, 'A completely new website')
    await expect(intake.getByRole('heading', { name: 'Tell us about your organization' })).toBeFocused()
    await intake.getByRole('button', { name: 'Back' }).click()
    await expect(intake.getByLabel('What is your name?')).toHaveValue('Test Person')
  })

  test('quick-job path: short branch, review, edit, submit with a real reference', async ({ page }) => {
    const events: Record<string, unknown>[] = []
    await page.exposeFunction('__ev', (e: Record<string, unknown>) => events.push(e))
    await page.addInitScript(() => window.addEventListener('bridge:analytics', (e) => (window as unknown as { __ev: (d: unknown) => void }).__ev((e as CustomEvent).detail)))
    await page.goto(HOME)
    // The "Two ways" CTA pre-selects the quick path.
    await page.getByRole('link', { name: /Request a quick job/ }).click()
    const intake = page.locator('#intake')
    await expect(intake.getByRole('radio', { name: 'A quick website fix or update' })).toBeChecked()
    await fillStart(page, 'A quick website fix or update')
    await fillOrganization(page)
    await expect(intake.getByRole('heading', { name: 'What needs attention?' })).toBeVisible()
    await intake.getByLabel('Describe the exact task').fill('The contact form does not send.')
    await intake.getByLabel('Which page or feature is affected?').fill('Contact page')
    await intake.getByRole('radio', { name: 'Not sure' }).check()
    await intake.getByRole('button', { name: 'Continue' }).click()
    // Quick jobs skip Vision and Journey.
    await expect(intake.getByRole('heading', { name: 'Features, systems & intelligence' })).toBeVisible()
    await expect(intake).toContainText('Step 4 of 6')
    await intake.getByRole('button', { name: 'Continue' }).click()
    await fillScope(page)

    await expect(intake.getByRole('heading', { name: 'Review & submit' })).toBeVisible()
    await expect(intake).toContainText('The contact form does not send.')
    await intake.getByRole('button', { name: 'Edit: What needs attention?' }).click()
    await intake.getByLabel('Which page or feature is affected?').fill('Contact and booking pages')
    for (let i = 0; i < 3; i++) await intake.getByRole('button', { name: /Continue|Review answers/ }).click()
    await expect(intake).toContainText('Contact and booking pages')

    await intake.getByRole('button', { name: 'Submit project details' }).click()
    await expect(intake.getByRole('alert')).toContainText('Consent')
    await intake.getByRole('checkbox').check()
    await expect(intake.getByRole('link', { name: 'intake privacy notice' })).toHaveAttribute('href', '/websites/privacy')
    await page.waitForTimeout(8500) // the server rejects submissions completed in under 8 s
    const [res] = await Promise.all([page.waitForResponse((r) => r.url().endsWith('/websites/api/intake')), intake.getByRole('button', { name: 'Submit project details' }).click()])
    expect(res.status()).toBe(200)
    await expect(intake.getByRole('heading', { name: /Your project details have been received/ })).toBeVisible()
    await expect(intake).toContainText(/BTBS-\d{8}-[0-9A-F]{6}/)
    expect(await page.evaluate(() => sessionStorage.getItem('btbs-intake-draft-v1'))).toBeNull()

    // Analytics carry step names and paths only — never contact details or free text.
    const sent = JSON.stringify(events)
    expect(events.map((e) => e.event)).toEqual(expect.arrayContaining(['intake_start', 'intake_step', 'intake_submit', 'intake_complete']))
    for (const pii of ['Test Person', 'test.person@example.com', 'Test Org', 'example.com', 'contact form']) expect(sent).not.toContain(pii)
  })

  test('new-website path asks vision and journey questions', async ({ page }) => {
    await page.goto(HOME)
    await fillStart(page, 'A completely new website')
    await fillOrganization(page)
    const intake = page.locator('#intake')
    await expect(intake.getByRole('heading', { name: 'What should the new website do?' })).toBeVisible()
    await intake.getByLabel('What must your new website accomplish?').fill('Bookings')
    await intake.getByRole('button', { name: 'Continue' }).click()
    await expect(intake.getByRole('heading', { name: 'Your vision' })).toBeVisible()
    await expect(intake).toContainText('Step 4 of 8')
  })

  test('draft survives a reload in the same tab', async ({ page }) => {
    await page.goto(HOME)
    await page.locator('#intake').getByLabel('What is your name?').fill('Draft Person')
    await page.reload()
    await expect(page.locator('#intake').getByLabel('What is your name?')).toHaveValue('Draft Person')
    await expect(page.locator('#intake')).toContainText('We restored the answers')
  })

  test('when online submission is off, it says so and offers email — no false success', async ({ page }) => {
    await page.route('**/websites/api/intake', (r) => r.fulfill({ status: 503, contentType: 'application/json', body: JSON.stringify({ ok: false, code: 'not_configured' }) }))
    await page.goto(HOME)
    await fillStart(page, 'A quick website fix or update')
    await fillOrganization(page)
    const intake = page.locator('#intake')
    await intake.getByLabel('Describe the exact task').fill('Update photos')
    await intake.getByLabel('Which page or feature is affected?').fill('Gallery')
    await intake.getByRole('radio', { name: 'No', exact: true }).check()
    await intake.getByRole('button', { name: 'Continue' }).click()
    await intake.getByRole('button', { name: 'Continue' }).click()
    await fillScope(page)
    await intake.getByRole('checkbox').check()
    await intake.getByRole('button', { name: 'Submit project details' }).click()
    await expect(intake.getByRole('heading', { name: /isn’t switched on yet/ })).toBeVisible()
    await expect(intake).toContainText('Nothing has been submitted.')
    await expect(intake).not.toContainText('received')
    const mail = intake.getByRole('link', { name: /Email my answers/ })
    await expect(mail).toHaveAttribute('href', /^mailto:jamaal@bridge2bettersolutions\.com\?subject=/)
    expect(decodeURIComponent((await mail.getAttribute('href')) ?? '')).toContain('Update photos')
  })

  test('server rejects bots and malformed submissions', async ({ request, baseURL }) => {
    const origin = new URL(baseURL!).origin
    const post = (data: unknown, headers: Record<string, string> = { origin }) => request.post('./api/intake', { data, headers })
    expect((await post({ answers: {}, consent: true, startedAt: Date.now() - 20_000 }, { origin: 'https://evil.test' })).status()).toBe(403)
    expect((await post({ answers: {}, consent: true, startedAt: Date.now() })).status()).toBe(400)
    expect((await post({ answers: {}, consent: true, startedAt: Date.now() - 20_000, company_fax: 'spam' })).status()).toBe(400)
    const invalid = await post({ answers: { name: 'x' }, consent: true, startedAt: Date.now() - 20_000 })
    expect(invalid.status()).toBe(422)
    expect((await invalid.json()).errors).toHaveProperty('email')
  })
})

test('privacy notice is reachable and branded', async ({ page }) => {
  await page.goto('./privacy')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Project intake privacy notice')
  await expect(page.locator('main')).toContainText('never ask for passwords')
  expect(await axe(page)).toEqual([])
})
