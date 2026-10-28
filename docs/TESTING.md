# Testing

## Setup

```bash
npm ci
npx playwright install chromium          # once per machine; add --with-deps on Linux CI
```

`@playwright/test` is pinned to an exact version (1.63.0) so the browser build matches. If you change the version, reinstall the browser.

## Commands

| Command | What it does |
|---|---|
| `npm run typecheck` | TypeScript, no emit |
| `npm test` | Builds the production server, starts it on :4400, runs unit + desktop + tablet + mobile projects |
| `npm run test:unit` | Engine and inquiry-validation unit tests only (no browser) |
| `npm run test:e2e` | Browser projects only |
| `E2E_SKIP_BUILD=1 npm test` | Reuse the existing `.output/` build |
| `E2E_BASE_URL=https://staging… STAGING_BASIC_AUTH=user:pass npm run test:e2e` | Run against a deployed staging site |
| `npx playwright show-report` | Open the HTML report |

## What the suite covers (tests/)

- **Threshold:** SSR headline + LCP poster with `fetchpriority=high` and preload; chapter overlays appear in order across the scroll track; chapter rail navigation; WebGL tier boots a canvas and fades it in; reduced motion disables WebGL and motion transforms; a browser without WebGL2 falls back to stills.
- **Transformation Lab:** both fictional sites load and carry the "fictional concept" notice; keyboard slider (arrows, Shift, Home/End); device switch causes no layout shift; section jump scrolls both sites; full preview opens, switches width, closes on Escape and returns focus.
- **Atelier North pages:** noindex; gallery filter; lightbox arrow-key navigation; guided inquiry produces a recommendation and states nothing is sent; "before" form is inert and says so.
- **Intelligence:** preset journey reaches stage 6 (live-region announcement); custom message with follow-up questions classifies an urgent repair; passive comparison.
- **Site:** skip link first; mobile menu + Escape; consultation `mailto:` contents and encoding; tier preselection; copy-to-clipboard; no horizontal overflow at 1440 / 834 / 412; no console or CSP errors while scrolling the whole page.
- **Accessibility:** axe-core WCAG 2.0/2.1/2.2 A + AA on all three pages, at every viewport.
- **Server:** security and cache headers; noindex on concept pages and fictional imagery; `/studio` is 404; inquiry and error endpoints are off by default; robots/sitemap/canonical/OG/JSON-LD.
- **Unit:** intelligence engine (extraction, scoring arithmetic, routing) and inquiry validation (honeypot, timing, enums, rate limiter, same-origin).

## Diagnostic scripts (scripts/)

| Script | Needs | Purpose |
|---|---|---|
| `qa-continuity.mjs` | dev server | Renders the live scene along the scroll path and reports frame-to-frame change, to catch camera pops |
| `qa-vitals.mjs` | production server on :4173/`PORT` | Lab LCP / CLS / longest interaction |
| `render-assets.mjs`, `render-og.mjs` | dev server (assets) | Regenerate posters, project stills, social image |

## Known limits of automated testing here

- Headless Chromium uses **software WebGL (SwiftShader)**. Tests prove the 3D tiers boot, render and fall back; they say nothing about frame rate, GPU memory or thermals.
- Screen-reader behaviour is checked structurally (roles, names, live regions) — not with a real screen reader.
- Only Chromium is installed. Safari/WebKit and Firefox are untested.

## Staging checklist (manual, real hardware)

Record device, browser version and results in `docs/VISUAL_QUALITY_REPORT.md`.

1. **Desktop GPU (Mac + Windows):** scroll the Threshold slowly and quickly; confirm smooth camera, no hitching at the gate crossing (≈ 55 % of the track), pointer light responds. Chrome DevTools → Performance: frame time, long tasks.
2. **Mid-range Android + recent iPhone:** confirm `lite` tier, no overheating over 2 minutes, chapters readable, Lab defaults to phone view.
3. **Safari:** AVIF/WebP pictures, `<dialog>`, `svh` units, WebGL2.
4. **Screen readers:** VoiceOver (Safari) and NVDA (Firefox/Chrome): headings order, Lab slider value text, Intelligence stage announcements, dialog focus.
5. **Field vitals:** Chrome DevTools Lighthouse (mobile) and the Web Vitals extension on staging; INP during Lab drag and Intelligence run.
6. **Reduced motion / Save-Data / no WebGL** (disable hardware acceleration): stills and readable chapters.
