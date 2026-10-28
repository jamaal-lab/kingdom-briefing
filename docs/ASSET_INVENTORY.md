# Asset inventory — Bridge Web Black Label 4.0

Status key: **Complete** = production-ready for its stated purpose · **Provisional** = shipping and art-directed, but should be replaced or upgraded by the production asset described in [`ASSET_PRODUCTION_SPEC.md`](ASSET_PRODUCTION_SPEC.md) · **Missing** = not produced; the site uses the stated alternative.

No stock photography, AI-generated imagery or third-party 3D models are used anywhere on the site.

## A. Monumental architectural sculpture (The Threshold)

| Asset | Status | Source / provenance | Licence |
|---|---|---|---|
| Real-time Threshold scene (gateway, pavilion, network, lighting, shaders) | **Complete** as a real-time scene | Authored in code for this project: `src/components/threshold/scene/*` | Original work, owned by Bridge to Better Solutions, LLC |
| Procedural material maps (brushed metal, honed stone, floor slabs, horizon fade) | **Complete** | Generated at runtime from seeded noise: `scene/textures.ts` | Original |
| Poster stills — arrival / approach / intelligence, 3840×2160 + 2160×3840 portrait | **Provisional** | Rendered from the live scene via `/studio` + `scripts/render-assets.mjs` (headless Chromium, SwiftShader WebGL) | Original |
| Bespoke sculpted GLB of the gateway (sculpted detail, baked AO, PBR texture sets) | **Missing** | Gateway is procedural geometry (extrusions, bevelled boxes). See spec §1 | — |
| Path-traced 4K hero stills / film | **Missing** | Current stills are real-time renders, not ray-traced. See spec §2 | — |

**Honest quality note:** the real-time renders are cinematic and consistent with the brand, but they are not photorealistic architectural visualisation. Reflections are planar + environment-based (no ray tracing), geometry is clean CG without sculpted micro-detail, and the light shafts are shader approximations.

## B. Digital transformation (Atelier North)

| Asset | Status | Source / provenance | Licence |
|---|---|---|---|
| Atelier North "after" site (live route `/concepts/atelier-north`) | **Complete** | Designed and built for this project | Original |
| Atelier North "before" site (live route `/concepts/atelier-north/before`) | **Complete** | Deliberately generic template, built for comparison | Original |
| Architecture stills: Halden House, Kestrel Gallery, Morrow Pavilion (day + evening), Wren House interior — 3840×2160 | **Provisional** | Procedural real-time scenes in `src/components/studio/ArchitectureStill.tsx`, rendered via `/studio` | Original |

All Atelier North projects, places and copy are fictional and labelled as such on every page.

## C. Intelligent technology

| Asset | Status | Source | Licence |
|---|---|---|---|
| Luminous journey network (Sequence D) | **Complete** (real-time) | `scene/Network.tsx` | Original |
| Intelligence Experience UI and rules engine | **Complete** | `src/components/intelligence/*` | Original |

## D. Luxury digital interfaces

| Asset | Status | Source | Licence |
|---|---|---|---|
| Desktop browser frame + phone frame presentations | **Complete** | Live iframes of the concept routes at true 1440px / 390px viewports, framed in CSS | Original |
| Photoreal device renders (studio-lit laptop/phone hardware) | **Missing** | Not produced; the live, interactive frames are used instead. See spec §4 | — |

## E. Cinematic transitional elements

| Asset | Status | Source | Licence |
|---|---|---|---|
| Gold light channels, pulses, shafts, dust, crossing flash, mask/clip reveals | **Complete** | Shaders + CSS motion primitives (`src/motion/*`, `app.css`) | Original |
| Original film / video loops | **Missing** | Not produced. See spec §2 | — |

## Typography and marks

| Asset | Status | Source | Licence |
|---|---|---|---|
| Instrument Serif (display), Hanken Grotesk (UI), JetBrains Mono (labels), Cormorant Garamond (Atelier North) | **Complete** | Self-hosted Latin WOFF2 subsets from Fontsource 5.3.0 packages | SIL Open Font License 1.1 — full texts in `licenses/fonts/` |
| Bridge Web nested-portal mark, favicon | **Complete** (proposal) | Drawn in SVG for this project (`src/components/site/Logo.tsx`, `public/favicon.svg`) | Original — confirm against any existing brand guidelines |

| Social sharing image `public/og-image.jpg` (1200×630) | **Complete** | Composed from the arrival poster + site fonts by `scripts/render-og.mjs` | Original |

## Software licences (production dependencies)

Audit run with `license-checker-rseidelsohn --production` on 2026-10-28: 175 packages — MIT 145 (+1 marked MIT*), ISC 10, Apache-2.0 7, BSD-3-Clause 4, MPL-2.0 3, Zlib 1, CC-BY-4.0 1, Unlicense 1, Python-2.0 1, and **GSAP's "Standard no-charge licence"**.

- **GSAP** is free for commercial use, including client work, under its own licence (https://gsap.com/standard-license). The notable restriction is that it may not be used to build a product that competes with Webflow's visual animation tooling. Bridge Web's client sites are fine; re-check if Bridge Web ever ships a no-code animation builder.
- MPL-2.0 packages are used unmodified (file-level copyleft only applies if their files are modified).
- No GPL/AGPL code ships to the browser or server.

## Delivery formats

- Masters: PNG at 3840×2160 (or 2160×3840), written to `media-masters/` (git-ignored, reproducible with `node scripts/render-assets.mjs`).
- Delivered: AVIF + WebP at 640 / 960 / 1600 / 2560 / 3840 px (landscape) and 540 / 828 / 1080 / 1440 px (portrait) in `public/media/`. Browsers choose via `<picture>` + `srcset`/`sizes`; the 4K files are only fetched by very large / high-density displays.
