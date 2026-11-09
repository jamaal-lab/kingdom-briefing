# /websites — Phase 1: comparative audit & implementation plan

Prepared 2026-11-09 for Bridge to Better Solutions, LLC. Everything below was observed directly unless marked **unverified**.

## 1. What is live today

| Fact | Evidence |
|---|---|
| `bridge2bettersolutions.com` is a **Lovable** deployment (Cloudflare edge, Vite SPA). | Response headers (`server: cloudflare`, `x-deployment-id`); HTML canonical `https://system-truth-unveiled.lovable.app/`; Lovable analytics script. |
| The live home page is **BridgeOS** ("Fix the System Before Another Student Slips Through"), a charter-school systems product. | Page `<title>`/meta; routes `/`, `/systems-audit`, `/command-centers`, `/governance-command-center`, `/case-studies`, `*`. |
| `/websites` does **not** exist; the SPA serves its shell and falls to the client 404 route. | Identical 2.7 KB response for `/` and `/websites`. |
| The official **Bridge to Better Solutions emblem** is published there (`/assets/btbs-logo-*.png`, 1024² RGBA): "Systems Architecture & Innovation · Bridge to Better Solutions · Smarter Systems • Better Outcomes". | Downloaded to `brand-sources/btbs-emblem-original.png`. |
| Founder: **Jamaal T. Peavy**, "Founder & Lead Integrator" (Lovable); "Jamaal 'JP' Peavy — Founder, Bridge to Better Solutions" (live site). Based in Rochester, NY. | Copy on both sites. Portraits in `brand-sources/`. |

DNS: could not be resolved from the build environment (outbound DNS goes through a proxy). **Who hosts the DNS zone determines the deployment route — see §6.**

## 2. Source A — existing Claude implementation (this repo)

| Keep | Improve | Retire publicly |
|---|---|---|
| Live WebGL Threshold scene, poster/lite/full tiers, reduced-motion fallbacks, error boundary | Re-skin to the parent palette (#10243A / #C9A24A / #F5F1E8); breathing full-bleed hero instead of a 520 vh film (the page now has a job beyond the hero) | "Bridge Web", "Black Label", the nested-portal mark, Bridge Web OG image and favicon |
| Atelier North before/after concept sites (same business, real responsive pages) | New dedicated slider: static high-res frames by default (fast, Reel-ready), live sites on demand; intro nudge; phone comparison; "Illustrative Design Transformation" label | Copy that names Bridge Web inside the concept badges (switched by a `brand` parameter so the locked v1 stays identical) |
| Motion primitives (`Reveal`, `SplitText`, `ImmersiveImage`, `useScrollProgress`), responsive images, security headers, staging gate, tests | — | Public tier names/prices (Essential/Signature/Immersive): **not shown** until pricing is approved |
| Server-side inquiry pipeline (validation, honeypot, timing, rate limit, same-origin) | Generalised into the 8-step intake with a webhook adapter | — |

## 3. Source B — Lovable reference (bridgeweb.lovable.app)

Built on **TanStack Start** (same framework as this repo). Sections: hero · value statement · marquee · Digital Collection (8 illustrative concepts with category filter) · What We Build (4) · Black Label band · The Difference (4) · Process (4) · parent-company band · founder · Spotlight initiative · Website Care · FAQ (9) · inquiry form.

| Keep (adapted) | Why |
|---|---|
| Concept collection with category filter and "Illustrative Concept — Not a Client Project" labelling | Broad audience (beauty, home services, professional, nonprofit, faith, education, events, luxury) — matches the directive's "don't pigeonhole" |
| Concept preview images (8, 1280×800) | Only imagery available for most industries. **Provenance unverified** (appear AI-generated in Lovable) — owner to confirm licence |
| Discover → Architect naming; "scope, proposal and written agreement" honesty | Becomes the 6-step Discover → Architect → Design → Build → Launch → Improve |
| Founder framing ("closes the gap between the work and how the world experiences it online") | Owner's own words |
| FAQ honesty items ("Is a design concept a free website?", "Who owns the site?") | Prevent false expectations — answers need owner confirmation |
| Form: honeypot, consent wording, optional budget "Prefer to discuss" | Carried into the intake |

| Not carried over | Why |
|---|---|
| "BridgeWeb", "Black Label" category/band/project type | Retired publicly (§1 of directive) |
| Spotlight / nomination initiative | Not in the directive's architecture; owner decision |
| Website Care pricing claims | None stated; care is "separately scoped" |

The Lovable site has **no before/after slider** on its public page (searched the bundle); the slider comes from Source A.

The Lovable form posts to a private TanStack server function; **where those leads are stored is not visible** from outside (likely Lovable Cloud). Owner to confirm, so we do not split leads across systems.

## 4. Source C — DemoDrop

Connected account verified: agency **Bridge to Better Solutions, LLC** (`ag_a073…`), owner `jamaal@bridge2bettersolutions.com`, plan `drop_agency`.

| Finding | Detail |
|---|---|
| 24 sites | Mostly prospect demos for real local businesses (`mode: demo`); 2 `active` (Desmond D. Davis; Buddha's Burgers & Hots); 1 own site + 1 bonus build. **None are used publicly here without permission.** |
| Intake | Every site reports `intake_id: null`; no DemoDrop tool exposes an intake form definition. Demo pages capture forms natively (`data-dd-form="Consultation"`). |
| CRM | **Not connected** ("paste the sub-account's Location ID and Private Integration token") — i.e. a LeadConnector/GoHighLevel sub-account. |

**Blocked:** the actual DemoDrop client-intake questions. Needed: the intake URL, screenshots, or a question export. Until then the DemoDrop column below is empty rather than guessed.

## 5. Intake field map (source of truth)

Legend: C = this repo's earlier composer/inquiry, L = Lovable form, D = DemoDrop (pending), Dir = this directive.

| DemoDrop | Claude (C) | Lovable (L) | Final question | Action | Required |
|---|---|---|---|---|---|
| *pending export* | — | Full name | What is your name? | Keep (L) | Yes |
| *pending* | — | Organization | What is your business or organization called? | Keep (L) | Yes |
| *pending* | — | Email | Best email address | Keep (L) | Yes |
| *pending* | — | Phone (opt.) | Preferred contact method (+ phone when phone/text) | Merge L + Dir | Method yes; phone if chosen |
| *pending* | — | Current website (opt.) | Do you have a website? → URL | Merge L + Dir | Yes / URL if yes |
| *pending* | "What are you considering?" | Project type | What type of project? (6 options; drives branching) | Merge C + L + Dir | Yes |
| *pending* | — | Industry | Which best describes your organization? | Keep (L) | Yes |
| *pending* | Note "about the business" | Primary goal | What does your organization do? · Who do you serve? · Primary services/programs · What makes you different | Merge (C note, L goal → Step 3/5) | First two |
| — | — | — | Existing site: what works · what frustrates · top 3 improvements · must-keep functions | Add (Dir) | Frustrations, top 3 |
| — | — | — | New site: must accomplish · pages envisioned · problems to solve | Add (Dir) | Must accomplish |
| — | — | — | Quick job: exact task · page/feature · blocking customers? · real deadline? | Add (Dir) | Task, page, blocking |
| — | — | Design concept that inspired you | A concept from our collection that inspired you (opt.) | Keep (L) | No |
| — | — | — | Vision: feeling · 3 words · admired sites + why · assets on hand · styles to avoid | Add (Dir) | Feeling |
| — | — | Primary goal | Journey: most important action · questions to answer · what stops people · 90-day success | Merge L goal + Dir | Most important action |
| — | — | — | Features & systems (multi-select) · systems already used (no passwords) | Add (Dir) | No |
| — | Timing | Intended timeline | Target launch date · tied to an event? | Merge C + L + Dir | Timeline yes |
| — | Level of experience (tiers) | Budget range (opt.) | Investment range (configurable list, optional) | Merge; **tiers removed** | No |
| — | — | — | Who approves · content readiness · ongoing support wanted | Add (Dir) | Approver, readiness |
| — | — | Consent | Consent to store and contact + privacy notice | Keep (L) | Yes |
| — | Honeypot + timing | Honeypot (`company_fax`) | Hidden honeypot + minimum fill time | Keep | — |

"Who is your primary audience?" (Dir Step 5) is **merged** into "Who do you serve?" (Step 2) to avoid asking twice.

## 6. Architecture & deployment route

Built in this repo as a separate **build target**: `SITE_TARGET=websites npm run build:websites` → `.output-websites/`, with Vite `base`, router `basepath` and Nitro `baseURL` all set to `/websites`. Every route, asset, image, font and API endpoint lives under `/websites/…` (verified: page, concepts, media, fonts, CSS, robots, cache headers). It cannot collide with the Lovable app's `/assets/…`.

Options for putting it at `bridge2bettersolutions.com/websites`:

| Option | Needs | Risk | Recommendation |
|---|---|---|---|
| **A. Edge route** — a Cloudflare Worker on `bridge2bettersolutions.com/websites*` forwarding to the deployed `/websites` app; everything else stays on Lovable | The domain's DNS zone in **your** Cloudflare account (proxied records) | Low: one route, instant rollback, Lovable untouched | **Preferred**, if the zone is on your Cloudflare |
| B. Port the page into the Lovable project | Lovable project / its GitHub repo; Lovable is Vite + React | Medium: two codebases diverge; 3D/scene code must be ported | If DNS cannot move |
| C. `websites.bridge2bettersolutions.com` subdomain | One DNS record | Lowest, but not the requested path | Fallback/staging |

Staging first: deploy the websites target to its own project (e.g. Vercel, `NITRO_PRESET=vercel`) behind `STAGING_BASIC_AUTH`, then add the edge route only after approval. **No DNS, billing, contact routing or live content changes were made.**

## 7. Missing dependencies & approvals

1. **DemoDrop intake** questions (URL, screenshots or export) → completes parity (§5).
2. **Lead destination:** DemoDrop/LeadConnector CRM token, a LeadConnector inbound-webhook URL, or an email provider — the intake is built with a signed webhook adapter, off until configured.
3. **DNS host** for bridge2bettersolutions.com (decides option A vs B).
4. **Logo confirmation:** the emblem from the live site is used as-is (no redraw).
5. **Imagery licence:** Lovable concept images (provenance unknown).
6. **Budget ranges** (default = Lovable's list) and **FAQ answers** (ownership, care, timelines).
7. **Founder copy & portrait** approval (taken from your live/Lovable sites).
8. **Permission** before featuring any real DemoDrop client site.
9. GitHub push access (still 403) — work is committed locally and delivered as bundles.
