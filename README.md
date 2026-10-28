# Bridge Web — Black Label 4.0

**Beyond the website. Into the experience.**
Flagship site for Bridge Web, a service of Bridge to Better Solutions, LLC.

## What's here

| Section | What it is | Code |
|---|---|---|
| **The Threshold** | Real-time WebGL architectural hero. A scroll-driven camera approaches a monumental gateway, passes through it, and resolves into a luminous customer-journey network. Poster stills for devices without WebGL2. | `src/components/threshold/` |
| **Transformation Lab** | Before/after slider over two *live* sites for the fictional practice Atelier North, at true desktop (1440) and phone (390) viewports, plus a full-screen interactive preview. | `src/components/lab/`, `src/concepts/atelier-north/` |
| **Intelligence Experience** | In-browser demo of an intelligent inquiry journey: request → context → classification → next step → drafted follow-up → operator brief, compared with a passive form. | `src/components/intelligence/` |
| **The Standard / Offerings** | What the page demonstrates; Essential, Signature and Immersive Intelligence tiers. | `src/components/offerings/` |
| **Consultation** | Composer that builds a draft email and opens the visitor's mail client (`mailto:` to CEO@Bridge2BetterSolutions.com). Nothing is stored or submitted. | `src/components/consult/` |

## Stack

React 19 · TypeScript · TanStack Start (SSR) · Tailwind CSS v4 · three.js / React Three Fiber / Drei · postprocessing · GSAP ScrollTrigger.

## Run

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production build (client + SSR)
npx vite preview     # serve the production build on :4173
```

Force a rendering tier for testing: `/?tier=full`, `/?tier=lite`, `/?tier=poster`.

## Architecture notes

- **One progress value.** `ScrollTrigger` measures the Threshold track; a single GSAP ticker damps it and writes overlay styles; the R3F camera reads the same value. Camera keyframes, chapter ranges and scene state live in `choreography.ts`, which the poster renderer also uses, so stills and live frames match.
- **Tiers.** `lib/capabilities.ts` picks `full` (reflections, shadows, bloom, MSAA), `lite` (same scene, lighter pipeline, lower DPR) or `poster` (no WebGL2, reduced motion, or Save-Data). Drei's `PerformanceMonitor` lowers DPR and then steps the tier down at runtime; WebGL context loss falls back to posters.
- **SSR safety.** The canvas, GSAP and all browser APIs load lazily after hydration. The poster image and headline are server-rendered (the LCP candidates) and preloaded with `fetchpriority=high`.
- **Motion primitives.** `src/motion/` — `Reveal` (fade-up, mask, wipe, rule), `SplitText` (masked word reveal), `Parallax`, `Magnetic`, `useInView`, `useReducedMotion`, shared easing/timing tokens mirrored as CSS variables. Everything collapses to its final state under `prefers-reduced-motion`.
- **Analytics-ready.** `lib/analytics.ts` pushes named events to `window.dataLayer` (if present) and dispatches `bridge:analytics` DOM events. No vendor is installed and no personal data is included.
- **Studio.** `/studio` (development only) renders deterministic stills of the live scenes; `scripts/render-assets.mjs` captures 4K masters and writes AVIF/WebP derivatives.

## QA scripts

```bash
node scripts/qa-axe.mjs                 # axe-core WCAG A/AA audit of the three pages (dev server on :3000)
node scripts/qa-intel.mjs <outdir>      # drives the Intelligence demo, saves screenshots
node scripts/sections.mjs 1440 900 out  # section screenshots at a given viewport
node scripts/qa-vitals.mjs desktop      # lab LCP / CLS / interaction latency against vite preview (:4173)
node scripts/qa-vitals.mjs mobile throttle
```

## Documentation

- [`docs/VISUAL_QUALITY_REPORT.md`](docs/VISUAL_QUALITY_REPORT.md) — what was verified, measured results, known gaps.
- [`docs/ASSET_INVENTORY.md`](docs/ASSET_INVENTORY.md) — completed, provisional and missing 4K/3D assets with provenance.
- [`docs/ASSET_PRODUCTION_SPEC.md`](docs/ASSET_PRODUCTION_SPEC.md) — what to commission for a fully photoreal finish.

## Honesty notes

Atelier North and every business in the Intelligence demo are fictional and labelled as such. There are no testimonials, client results, booking links or CRM integrations. Imagery is rendered in-house from real-time 3D scenes — not photography, not stock, not AI-generated.
