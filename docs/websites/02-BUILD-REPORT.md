# /websites — build report, deployment checklist & approvals

Prepared 2026-11-09. Everything marked ✅ was run in this environment. Nothing has been deployed, and no DNS, billing, contact routing or live content was changed.

## What was built

`SITE_TARGET=websites npm run build:websites` → `.output-websites/` serves the **Web Design & Digital Experiences** page for Bridge to Better Solutions, LLC under `/websites`.

| # | Section | Notes |
|---|---|---|
| 01 | Hero | Live Threshold scene (poster/lite/full tiers, reduced-motion still). "WE BUILD WEBSITES. / AND MAKE GOOD ONES BETTER." · supporting lines · Start Your Project / See What's Possible |
| 02 | The gap | Four respectful "signs your site has fallen behind" |
| 03 | Two ways we can help | Quick Website Jobs & Upgrades / Complete Website Buildouts. No 24/48-hour promise: timing is "confirmed in writing". CTAs pre-select the intake path |
| 04 | Transformation | Draggable/touch/keyboard ARIA slider. Desktop + phone comparisons from rendered frames, optional live pages, one intro nudge (none under reduced motion), "Illustrative Design Transformation" label, the required microcopy, fictional-business disclaimer |
| 05 | Outcomes | Six capabilities, each with a plain benefit and no numbers |
| 06 | Selected demonstrations | Atelier North full concept (immersive) + 8 concepts with an industry filter, each badged "Illustrative concept". "Vérité" category renamed **Luxury & Product Launch**. No DemoDrop client sites |
| 07 | How we work | Discover → Architect → Design → Build → Launch → Improve, with "Your role" for each |
| — | About | Jamaal T. Peavy, Founder & Lead Integrator. Copy adapted from the owner's own Lovable text, portrait from the owner's site |
| 08 | Intelligent project intake | See `INTAKE.md` |
| 09 | Final CTA | "Your Work Deserves a Digital Experience That Reflects Its Value." / "Let's Build Something Better." |
| — | Footer, `/websites/privacy`, branded 404 | "Bridge to Better Solutions, LLC / Smarter Systems. Better Outcomes." |

Official emblem: the file published on bridge2bettersolutions.com, resized only (`scripts/prepare-brand-assets.mjs`). Palette: navy #10243A, gold #C9A24A, off-white #F5F1E8 (scoped `.btbs` theme).

## Preserved

- **Locked v1 flagship** (`/`, `/concepts/atelier-north`, `/before`): normalised SSR markup is identical to the lock baseline. The only differences are the contact email you asked for and the hydration manifest's chunk list.
- `/v2` Studio Edition is unchanged; all of its tests pass.
- The parent site (Lovable) and DemoDrop were read only. Nothing was written, published or connected.
- Retired names: "BridgeWeb", "Bridge to Better Studio" and "Black Label" appear nowhere in the /websites build's HTML or client scripts (tested). Flagship-only routes are excluded from that build (`/v2`, `/studio` → 404).

## Verification

| Check | Result |
|---|---|
| `npm run typecheck` | ✅ clean |
| `npm run build`, `npm run build:websites` | ✅ |
| Full Playwright suite (unit + v1 + v2 + websites, desktop/tablet/phone) | ✅ 100 passed, 2 intentional skips |
| /websites e2e: sections, retired names, images, emblem, JSON-LD facts, axe WCAG 2.2 AA (desktop + phone), slider keyboard/drag/phone/live, intake validation/branching/edit/draft/success with reference/503 fallback/bot & origin rejection, analytics carry no PII, privacy page | ✅ |
| Unit: schema branching, validation, hidden-branch dropping, webhook HMAC signature, adapter config | ✅ |
| Visual review of full-page desktop (1440) and phone (390) screenshots | ✅ (portrait reveal bug found and fixed) |
| Real webhook delivery to a CRM | ❌ **not tested**: no destination exists yet (simulated in unit tests only) |
| Cloudflare edge route / production deploy | ❌ **not done**: needs approval and DNS access |
| Real-device performance (LCP/INP) | ❌ not measured for /websites; only headless checks ran |

## Deployment checklist

1. Approve the content and decisions below.
2. Choose the intake destination (`INTAKE.md`). Set `INTAKE_DELIVERY=webhook`, `INTAKE_WEBHOOK_URL` and `INTAKE_WEBHOOK_SECRET` as platform secrets. Send one test submission and confirm it lands.
3. Build: `SITE_TARGET=websites VITE_SITE_URL=https://bridge2bettersolutions.com VITE_SITE_ENV=staging npm run build:websites` (add `NITRO_PRESET=vercel` or `cloudflare_module` for those hosts).
4. Deploy to a **staging** project behind `STAGING_BASIC_AUTH`. Run `E2E_WEBSITES_URL=https://<staging>/websites/ npx playwright test --project=websites-desktop --project=websites-mobile`.
5. Confirm where the DNS zone lives. If it is on your Cloudflare: add a Worker route `bridge2bettersolutions.com/websites*` → staging origin (Option A, `01-AUDIT-AND-PLAN.md §6`). Otherwise choose Option B or C.
6. Rebuild with `VITE_SITE_ENV=production`, remove the staging password, and switch the route. Rollback = delete the Worker route.
7. Add `https://bridge2bettersolutions.com/websites` to the parent site's navigation and sitemap (that is a Lovable change and needs separate approval).

## Owner approvals & blocked items

| Item | Status |
|---|---|
| DemoDrop intake questions (URL, screenshots or export) | **Blocked**: needed for full field parity |
| Lead destination: LeadConnector webhook / CRM token, or email provider | **Blocked**: intake runs on the honest email fallback until then |
| DNS host for bridge2bettersolutions.com | **Blocked**: decides the deployment route |
| Emblem use as-is in nav, footer, favicon, social card | Approve |
| Licence/provenance of the 8 Lovable concept images (look AI-generated) | Confirm |
| Budget ranges in the intake (default: your Lovable list) | Approve, or set `SHOW_BUDGET_RANGES=false` |
| Founder copy & portrait; privacy-notice retention wording | Approve |
| Process wording ("review rounds", "written proposal") and the quick-job timing line | Approve |
| Permission before featuring any real DemoDrop client | Required before adding any |
| GitHub push access (still 403) | Work is committed locally |
