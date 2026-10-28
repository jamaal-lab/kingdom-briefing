# Development workflow

## Branches

- `main` — always deployable. Protected: changes arrive by pull request with green CI.
- `feat/<topic>`, `fix/<topic>`, `chore/<topic>` — short-lived branches from `main`.
- Staging deploys from `main` (or from PR previews); production deploys are manual promotions of a tested staging build.

## Every change

```bash
npm ci
npm run dev                  # http://localhost:3000
npm run typecheck
npm test                     # production build + full Playwright suite
```

Open a PR; CI runs the same checks. Include screenshots for visual changes (desktop and phone).

## Protecting the creative work

- **Do not change** `src/components/threshold/choreography.ts` (camera keys, chapter ranges, poster FOVs) without re-rendering posters (`npm run render:assets`) — stills and live frames must match.
- Visual changes to the Threshold: run `node scripts/qa-continuity.mjs` before and after, and attach both outputs.
- Keep every Atelier North and Intelligence-demo surface labelled as fictional. Tests enforce the notices.
- New colors/fonts go through the tokens in `src/styles/app.css`.

## Commits

Imperative, scoped subject lines (`Lab: keep stage height fixed across devices`). One concern per commit.

## Assets

Regenerate rather than hand-edit: `npm run render:assets` (needs `npm run dev`), `npm run render:og`. Masters land in `media-masters/` (git-ignored); derivatives in `public/media/` are committed. Record provenance in `docs/ASSET_INVENTORY.md`.
