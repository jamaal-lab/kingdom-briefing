# Visual-quality & performance report

Date: 2026-10-28 · Build: production (`vite build` + `vite preview`) unless noted.

## Test environment — read this first

All measurements come from a **headless Chromium in a cloud container with no GPU**. WebGL runs through SwiftShader (software rasterisation on the CPU). That has two consequences:

1. **Load metrics (LCP, CLS) are meaningful** as lab numbers.
2. **Frame rate and interaction latency in the 3D tiers are not meaningful here.** Software WebGL saturates the main thread, so any interaction measured while the canvas renders reports multi-second delays that a real GPU would not produce. Those runs are listed below for completeness and must be re-measured on real devices.

No field (CrUX/RUM) data exists yet. Targets (LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1) are treated as goals to verify, not claims.

## Measured results

| Run | LCP | LCP element | CLS | Worst scripted interaction* |
|---|---|---|---|---|
| Desktop 1440×900, no throttling, `poster` tier | 440 ms | Hero headline | 0 | 296 ms (pointerout over Lab stage while both concept iframes were loading; 3 ms input delay, 0 ms handler — presentation delay) |
| Desktop 1440×900, no throttling, `full` tier (auto-detected) | 632 ms | Hero headline | 0.103 → fixed, see below | not meaningful (software WebGL) |
| Desktop 1440×900, `lite` tier | 380 ms | Hero headline | 0.184 → fixed, see below | not meaningful (software WebGL) |
| Mobile 390×844 @3×, Fast-4G-like network + 4× CPU slowdown | 1,572 ms | Nav wordmark / headline | 0 | 1,456 ms (pointerover; runs while the WebGL tier and the Lab iframes boot) |

\* `scripts/qa-vitals.mjs` scrolls the page, runs the Intelligence demo, operates the Lab slider by keyboard and switches the Lab to Mobile, recording Event Timing entries ≥ 16 ms. This is an INP **proxy**, not INP.

**CLS fix.** The shifts above had a single source: switching the Lab from Desktop to Mobile changed the stage height. They followed a click, but in the CPU-starved container the re-layout landed outside the 500 ms input window. The stage now reserves one fixed height for both devices; re-measured, the content below the Lab moves by **0 px** when switching (top of the next section measured at 7027.06 px before and after the switch).

**Mobile interaction note.** The 1.46 s mobile figure is dominated by booting the 3D tier and two full concept-site iframes under 4× CPU throttling in software WebGL. On real phones the GPU takes the rendering load. Mitigations already in place: iframes mount only when the Lab nears the viewport; the canvas pauses when off-screen; adaptive DPR and tier step-down. Recommended follow-up: measure on a mid-range Android device; if needed, start phones on the `poster` tier with a "View in 3D" control.

## Bundle

| Chunk | Size (min) | gzip | Loaded |
|---|---|---|---|
| App shell (React, router, Start) | 317 kB | 103 kB | Always |
| Home route | 81 kB | 25 kB | Always |
| CSS | 73 kB | 13 kB | Always |
| GSAP + ScrollTrigger | 113 kB | 45 kB | After hydration, dynamic import |
| three / R3F / Drei / postprocessing | 1,227 kB | 368 kB | Only when a WebGL tier is chosen |
| Threshold scene | 35 kB | 13 kB | With the above |
| Atelier North (after / before) | 24 / 7 kB | 8 / 2 kB | Only inside the Lab iframes |

The initial HTML preloads only the shell, route and motion chunks; three.js is never on the critical path. The hero poster (AVIF) and headline are server-rendered and preloaded with `fetchpriority=high`.

## Accessibility

- **axe-core** (WCAG 2.0/2.1/2.2 A + AA rule sets), `scripts/qa-axe.mjs`: **0 violations** on `/`, `/concepts/atelier-north` and `/concepts/atelier-north/before`, after fixing 10 contrast issues, one accessible-name mismatch and an invalid `aria-label` on `<p>`. Elements that are invisible at audit time (Threshold chapters B–E) were checked by design review, not by axe.
- **Behaviour**, `scripts/qa-a11y-behaviour.mjs`: first Tab reaches "Skip to content"; the Lab divider is a keyboard slider (arrows, Shift+arrows, Home/End) with `aria-valuetext`; the preview dialog opens from the keyboard, closes on Escape and returns focus; the Intelligence demo announces each stage through a polite live region.
- **Reduced motion:** no WebGL canvas, no camera flight, no parallax; Threshold chapters still cross-fade with scroll (opacity only), and every reveal starts in its final state.
- Manual checks still required: VoiceOver/NVDA pass, 200 % zoom, Windows High Contrast.

## Visual review (screenshots in the session, regenerated with the QA scripts)

| Viewport | Reviewed |
|---|---|
| Desktop 1440×900 | Hero (poster + live `lite`), Threshold at 45 % and 80 %, Lab (desktop + mobile stage), Intelligence (idle, run, custom, passive), Standard, Offerings, Consultation, Footer |
| Phone 390×844 | All sections; Lab defaults to the phone stage on phones |
| Live 3D | Arrival, approach, crossing, network and resolve frames rendered from the live scene at 960–3840 px |

Issues found and fixed during review: beige-lit floor (environment over-contribution), woven-looking stone texture, lavender soffits, visible skylight bar in portrait, network lines rendering black before reveal, hard horizon seam, overlay text over bright metal (scrim added), 3D labels colliding with overlay copy on narrow screens (labels limited to ≥ 1200 px), mobile nav overflow, Lab stage alignment.

## Known gaps

- Imagery is real-time render quality, not path-traced photorealism — see `ASSET_INVENTORY.md` and `ASSET_PRODUCTION_SPEC.md`.
- No real-device GPU measurements yet (frame rate, INP, thermal behaviour on phones).
- Tablet (834–1024 px) was reviewed only through the preview dialog's tablet width, not a dedicated pass.
- The production server target is the default TanStack Start/Vite output; a hosting adapter (Netlify, Vercel, Node, etc.) still has to be chosen. Nothing has been deployed and no DNS was touched.
