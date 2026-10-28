# Deployment & staging

Nothing in this repository deploys automatically, and nothing has been deployed. The production domain, its DNS, and the existing Bridge Executive OS are **not referenced or touched** anywhere in this project. Every step below is manual and needs approval before it runs.

## How the app is built

`npm run build` → Vite + TanStack Start + **Nitro** (the hosting adapter) → `.output/`

| Target | Build command | Output | Run |
|---|---|---|---|
| Node.js (default) | `npm run build` | `.output/` | `npm start` (`PORT` env, default 3000) |
| Vercel | `NITRO_PRESET=vercel npm run build` | `.vercel/output/` (Build Output API v3) | `vercel deploy --prebuilt` |
| Netlify / Cloudflare | `NITRO_PRESET=netlify` / `cloudflare_module` | per preset | per platform CLI |

Verified in this repo: the **Node** build runs and passes the full test suite; the **Vercel** preset builds and emits the security/caching headers into `.vercel/output/config.json`. Netlify and Cloudflare presets were **not** built or tested.

Security headers (CSP, nosniff, referrer policy, permissions policy, COOP) and cache rules live in `vite.config.ts` → `nitro({ routeRules })` and are applied identically on every preset.

## Environment

See `.env.example` for every variable. Two kinds:

- **Build-time, public (`VITE_*`)**: baked into the JavaScript. Changing one requires a rebuild. Never put secrets here.
- **Runtime, private**: read by the server per request. Set them in the host's dashboard/secret store, not in Git.

| Variable | Staging | Production |
|---|---|---|
| `VITE_SITE_URL` | `https://<staging-host>` | `https://<production-domain>` |
| `VITE_SITE_ENV` | `staging` (noindex, robots `Disallow: /`) | `production` |
| `STAGING_BASIC_AUTH` | `user:long-random-password` | *(unset)* |
| `INQUIRY_ENABLED` / `VITE_INQUIRY_FORM` | `1` / `1` only when testing the form | after approval only |
| `ERROR_REPORTING_ENABLED` / `VITE_ERROR_REPORTING` | `1` / `endpoint` | recommended |

There are **no secrets required today**. Future secrets (e.g. an email-provider API key for inquiry delivery) go in the host's secret store and are read with `process.env` inside server code only.

## Staging plan (recommended)

**Goal:** a private URL that matches production behaviour, never indexed, never public.

1. **Repository.** Restore GitHub access for the Claude app, push `claude/bridge-web-flagship-qer2fz`, open a PR into `main`. CI (`.github/workflows/ci.yml`) runs typecheck, build and the Playwright suite.
2. **Host.** Create a *new, separate* project — e.g. a new Vercel project named `bridge-web-staging` — linked to this repo. Do not attach it to any existing project or domain.
   - Build command: `NITRO_PRESET=vercel npm run build` · Install: `npm ci` · Node 22.
   - Turn on the platform's deployment protection (Vercel: *Deployment Protection → Vercel Authentication* for all deployments).
3. **Belt and braces.** Also set `STAGING_BASIC_AUTH`, `VITE_SITE_ENV=staging`, `VITE_SITE_URL=<the staging URL>`. The app then demands a password, sends `noindex`, and serves `robots.txt: Disallow: /` even if platform protection is misconfigured.
4. **Verify on staging** (see `docs/TESTING.md` → *Staging checklist*): run the Playwright suite against it (`E2E_BASE_URL`), and do the real-device pass.
5. **Domain.** Use the platform's generated URL, or a new subdomain such as `staging.<your-domain>` **only after approval**. Adding a subdomain record does not change the apex/production records, but it is still a DNS change and needs sign-off.
6. **Production** (separate approval): set `VITE_SITE_ENV=production`, the real `VITE_SITE_URL`, unset `STAGING_BASIC_AUTH`, rebuild, deploy, then point DNS.

### Alternative: any Node host / Docker

```bash
npm ci && npm run build
PORT=3000 STAGING_BASIC_AUTH='user:pass' node .output/server/index.mjs
```

A minimal `Dockerfile` is included. It was **not built or run in this environment** (no Docker available); treat it as a starting point.

Note: with Basic Auth only, static files under `/assets`, `/media`, `/fonts` are still reachable by direct URL (they contain nothing private). Platform-level protection covers those too.

## Rollback

Deployments are immutable on Vercel/Netlify: promote the previous deployment. On Node hosts, keep the previous `.output/` (or image tag) and restart it.

## Analytics (prepared, not connected)

`src/lib/analytics.ts` emits named events (`cta_click`, `lab_compare`, `intelligence_run`, `consult_mailto`, `tier_interest`, `inquiry_submitted`, `client_error`, …) to `window.dataLayer` and a `bridge:analytics` DOM event. No vendor script is loaded. To connect one after approval:

1. Choose a provider (a cookieless one such as Plausible or Fathom avoids a consent banner in most jurisdictions; GA4 requires consent handling).
2. Add its script host to the CSP `script-src`/`connect-src` in `vite.config.ts`.
3. Forward `bridge:analytics` events to the provider in one place (`analytics.ts`).

No personal data is ever put into events.

## Error monitoring (prepared, off by default)

- A React error boundary around the WebGL scene drops to the poster tier if the 3D chunk fails to load or WebGL throws.
- `src/lib/monitoring.ts` captures window errors and unhandled rejections, pushes `client_error` to the data layer, and — with `VITE_ERROR_REPORTING=endpoint` + `ERROR_REPORTING_ENABLED=1` — beacons a compact report to `/api/client-errors`, which writes one structured JSON log line (rate-limited, size-capped, no cookies).
- To use Sentry or similar later, replace `send()` in `monitoring.ts` and add the host to the CSP.
