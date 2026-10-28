import { defineConfig, devices } from '@playwright/test'

/**
 * End-to-end tests run against the real production server (`npm run build`
 * then `npm start`), not the dev server. Install the browser once with
 * `npx playwright install chromium` (see docs/TESTING.md).
 *
 * WebGL: headless Chromium falls back to SwiftShader (software GL), so tests
 * check that the 3D tiers boot and fall back correctly. They do not judge
 * frame rate.
 */
const PORT = Number(process.env.E2E_PORT ?? 4400)
/** Point the suite at a deployed staging URL instead of a local server. */
const BASE_URL = process.env.E2E_BASE_URL
const [user, pass] = (process.env.STAGING_BASIC_AUTH ?? '').split(':')

export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  expect: { timeout: 15_000 },
  fullyParallel: true,
  workers: process.env.CI ? 2 : 3,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'playwright-report' }]],
  use: {
    baseURL: BASE_URL ?? `http://localhost:${PORT}`,
    httpCredentials: user ? { username: user, password: pass ?? '' } : undefined,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    launchOptions: { args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] },
  },
  webServer: BASE_URL
    ? undefined
    : {
    command: process.env.E2E_SKIP_BUILD ? 'npm start' : 'npm run build && npm start',
    url: `http://localhost:${PORT}/`,
    env: { PORT: String(PORT) },
    timeout: 180_000,
    reuseExistingServer: !process.env.CI,
      },
  projects: [
    { name: 'unit', testDir: './tests/unit' },
    { name: 'desktop', testDir: './tests/e2e', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
    { name: 'tablet', testDir: './tests/e2e', grep: /@responsive/, use: { ...devices['Desktop Chrome'], viewport: { width: 834, height: 1112 }, hasTouch: true } },
    { name: 'mobile', testDir: './tests/e2e', grep: /@responsive|@mobile/, use: { ...devices['Pixel 7'] } },
  ],
})
