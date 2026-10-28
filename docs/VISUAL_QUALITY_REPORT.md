# Visual-quality & performance report

Date: 2026-10-28 · Build: production Node server (`npm run build && npm start`, Nitro) unless noted.

## Test environment — read this first

All measurements come from **headless Chromium 1.63 (Playwright) in a cloud container with no GPU**. WebGL runs through SwiftShader (software rendering on the CPU).

1. **Load metrics (LCP, CLS) and interaction latency in the poster tier are meaningful** as lab numbers.
2. **Anything involving the WebGL tiers' frame rate or interaction latency is not meaningful here.** Software WebGL saturates the CPU; real GPUs do not behave this way. Those runs are reported but must be re-measured on real devices (`docs/TESTING.md` → Staging checklist).
3. **No real-hardware testing has been done.** No field (RUM/CrUX) data exists.

Targets: LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1 — treated as goals to verify, not claims.

## Measured results (after hardening)

`scripts/qa-vitals.mjs`: loads `/`, waits 4 s, scrolls the whole page, runs the Intelligence demo, changes business, operates the Lab slider by keyboard and switches the Lab to Mobile. "Worst interaction" = longest Event Timing entry with an `interactionId` (clicks, taps, keys — the events INP uses). Three runs each.

| Profile | Tier | LCP | CLS | Worst interaction |
|---|---|---|---|---|
| Desktop 1440×900, unthrottled | poster | **312 – 368 ms** | **0** | **88 – 152 ms** |
| Desktop 1440×900, unthrottled | full (auto) | 296 – 356 ms | **0** | 168 ms – 6.2 s (software WebGL presentation delay — not meaningful) |
| Mobile 390×844 @3×, Fast-4G-like network, 4× CPU slowdown | lite (auto) | **920 – 952 ms** | **0** | **128 – 152 ms** |
| Mobile, same throttling | poster | 952 – 964 ms | 0 | 112 – 240 ms (one of two runs above 200 ms) |

### What changed to get there (all measured before and after)

| Problem found | Cause | Fix | Before → after |
|---|---|---|---|
| Desktop LCP 2.86 s | The hero copy faded in only after JavaScript hydrated (a React state flag), with a 1.1 s delay. The dark poster image does not count for LCP (Chrome excludes low-detail images). | Hero intro moved to **CSS keyframes** that start at first paint; same timings (0.3 s / 0.35 s + word stagger / 1.1 s). Also makes the headline appear even if JavaScript fails. | 2.86 s → 0.31–0.37 s |
| CLS 0.12 (intermittent) | Intelligence stage cards were inserted one by one on timers, pushing later sections outside the input grace window. | All six cards are laid out when Run is pressed and revealed in place. | 0.12 → 0 (new regression test) |
| CLS 0.10–0.18 | Lab stage changed height when switching Desktop ↔ Mobile. | Fixed-height stage. | → 0 px movement (regression test) |
| Mobile "1.46 s interaction" | Measurement error: hover events were counted. | Proxy now counts only real interactions. | — |
| Long tasks while scrolling past the Lab | Two live concept sites hydrate on the same main thread. | Mount when within 300 px (was 900 px) and in an idle callback. | — |

### Camera continuity

`scripts/qa-continuity.mjs` rendered the live scene at 41 evenly spaced scroll positions (384×216, `lite` tier) and measured mean per-pixel change between neighbours.

- **No discontinuities**: no step changes more than 2× both neighbours (0 spikes / 40).
- Change rises smoothly from Δ≈2.8 at arrival to a peak of **Δ≈47 (5.1× the median of 9.3) between 40 % and 57 %** of the track — the close pass through the telescoping frames — then falls to Δ≈4 once through the gate.
- **Interpretation:** continuity is intact, but the crossing is the fastest-moving stretch per unit of scroll. If real-device review finds it rushed, widen the 0.46 → 0.56 keyframe gap in `choreography.ts` (a creative decision — not changed here).

## Automated test suite (`npm test`)

Two consecutive full runs on the production server (CI mode, 1 retry allowed): **59 passed, 0 failed, 0 flaky, 1 skipped** each time (the skip is the mobile-menu test in the desktop project, by design). Unit tests: 12 of the 59. Coverage in `docs/TESTING.md`. Highlights:

- Threshold chapters appear in order with scroll; WebGL tier boots and fades in; reduced motion → no WebGL; no-WebGL2 → stills; failed 3D chunk → poster, page still works; headline visible with JavaScript disabled.
- Lab: both fictional sites load and are labelled; keyboard slider; no layout shift on device switch; synced section jumps; preview dialog focus handling.
- Intelligence: preset and custom journeys; no layout shift while running.
- Consultation `mailto:` content and encoding; copy address; tier preselection.
- axe-core WCAG 2.x A/AA: **0 violations** on all three pages at 1440, 834 and 412 px (one mobile-only contrast issue found and fixed during this pass).
- No horizontal overflow; no console/CSP errors while scrolling the whole page.
- Headers, `/studio` 404, endpoints off by default, robots/sitemap/canonical/OG/JSON-LD.

## Bundle (production build)

| Chunk | Min | Gzip | Loaded |
|---|---|---|---|
| App shell (React, router, Start) | 321 kB | 103 kB | Always |
| Home route | 81 kB | 25 kB | Always |
| CSS | 76 kB | 13 kB | Always |
| GSAP + ScrollTrigger | 113 kB | 45 kB | After hydration |
| three / R3F / Drei / postprocessing | 1,227 kB | 366 kB | Only when a WebGL tier is chosen |
| Threshold scene | 35 kB | 13 kB | With the above |

## Accessibility notes

Automated: axe-core (above) plus behaviour tests (skip link, slider semantics, dialog focus return, live-region announcements, mobile menu Escape). **Not done:** a real screen-reader pass (VoiceOver/NVDA), 200 % zoom, Windows High Contrast.

## Visual features verified unchanged

The Threshold scene, materials, lighting, camera keys, chapter timing, overlays, poster crossfade, Lab, Atelier North sites, Intelligence UI, offerings, consultation and footer render as before. The hero intro keeps its original delays and durations; it is now driven by CSS instead of JavaScript.

## Known gaps

- No real-GPU or real-phone measurements (frame rate, INP under real rendering, thermals, Safari/WebKit).
- Imagery is real-time render quality, not path-traced photorealism (`docs/CINEMATIC_ROADMAP.md`).
- Only Chromium was tested.
