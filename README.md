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

React 19 · TypeScript · TanStack Start (SSR) + Nitro · Tailwind CSS v4 · three.js / React Three Fiber / Drei · postprocessing · GSAP ScrollTrigger.

## Run

```bash
nvm use                # Node 22 (see .nvmrc)
npm ci
npm run dev            # http://localhost:3000
npm run build          # production build → .output/ (Nitro, Node preset)
npm start              # serve the production build (PORT, default 3000)
npm test               # build + Playwright suite (run `npx playwright install chromium` once)
```

Force a rendering tier for testing: `/?tier=full`, `/?tier=lite`, `/?tier=poster`.
Configuration lives in environment variables — see `.env.example` and `docs/DEPLOYMENT.md`.

## Architecture notes

- **One progress value.** `ScrollTrigger` measures the Threshold track; a single GSAP ticker damps it and writes overlay styles; the R3F camera reads the same value. Camera keyframes, chapter ranges and scene state live in `choreography.ts`, which the poster renderer also uses, so stills and live frames match.
- **Tiers.** `lib/capabilities.ts` picks `full` (reflections, shadows, bloom, MSAA), `lite` (same scene, lighter pipeline, lower DPR) or `poster` (no WebGL2, reduced motion, or Save-Data). Drei's `PerformanceMonitor` lowers DPR and then steps the tier down at runtime; WebGL context loss falls back to posters.
- **SSR safety.** The canvas, GSAP and all browser APIs load lazily after hydration. The poster image and headline are server-rendered (the LCP candidates) and preloaded with `fetchpriority=high`.
- **Motion primitives.** `src/motion/` — `Reveal` (fade-up, mask, wipe, rule), `SplitText` (masked word reveal), `Parallax`, `Magnetic`, `useInView`, `useReducedMotion`, shared easing/timing tokens mirrored as CSS variables. Everything collapses to its final state under `prefers-reduced-motion`.
- **Analytics-ready.** `lib/analytics.ts` pushes named events to `window.dataLayer` (if present) and dispatches `bridge:analytics` DOM events. No vendor is installed and no personal data is included.
- **Hosting.** Nitro builds a self-contained server (`.output/`); `NITRO_PRESET=vercel|netlify|…` targets a platform. Security headers and cache rules are route rules in `vite.config.ts`. `src/start.ts` adds an optional HTTP Basic gate for staging.
- **Resilience.** An error boundary around the WebGL scene falls back to the poster tier; global error hooks feed `src/lib/monitoring.ts`. The hero intro is CSS-only, so the headline renders even without JavaScript.
- **Studio.** `/studio` (development only; 404 in production) renders deterministic stills of the live scenes; `scripts/render-assets.mjs` captures 4K masters and writes AVIF/WebP derivatives.

## Testing

`npm test` runs unit tests and the Playwright end-to-end suite (desktop, tablet, mobile) against the production server. Diagnostic scripts (`qa-continuity.mjs`, `qa-vitals.mjs`, screenshot helpers) are described in `docs/TESTING.md`.

## Documentation

- [`docs/VISUAL_QUALITY_REPORT.md`](docs/VISUAL_QUALITY_REPORT.md) — what was verified, measured results, known gaps.
- [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) — hosting adapter, environment, staging plan, analytics and monitoring.
- [`docs/TESTING.md`](docs/TESTING.md) — test commands, coverage, real-device checklist.
- [`docs/INQUIRY_ARCHITECTURE.md`](docs/INQUIRY_ARCHITECTURE.md) — first-party inquiry endpoint (built, disabled).
- [`docs/CINEMATIC_ROADMAP.md`](docs/CINEMATIC_ROADMAP.md) — highest-impact 3D and imagery upgrades.
- [`CONTRIBUTING.md`](CONTRIBUTING.md) — Git workflow and rules for protecting the creative work.
- [`docs/ASSET_INVENTORY.md`](docs/ASSET_INVENTORY.md) — completed, provisional and missing 4K/3D assets with provenance.
- [`docs/ASSET_PRODUCTION_SPEC.md`](docs/ASSET_PRODUCTION_SPEC.md) — what to commission for a fully photoreal finish.

## Honesty notes

Atelier North and every business in the Intelligence demo are fictional and labelled as such. There are no testimonials, client results, booking links or CRM integrations. Imagery is rendered in-house from real-time 3D scenes — not photography, not stock, not AI-generated.
