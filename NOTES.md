# NOTES: TODOs and Assumptions

Living list. Every placeholder or unconfirmed fact in the build is listed here.

## Blockers
- [ ] **Network access**: `fellowshipchicago.com`, `www.youtube.com`, `i.ytimg.com`, `web.archive.org` are
      denied in the build environment. Without them: no scraped copy, logos, photos, or sermon list.

## Facts to confirm with the church
- [ ] Third Sunday service: 1:00 PM or 1:15 PM? Using **1:15 PM** (`content/site.ts`).
- [ ] Is Refuel currently in season? (`getNextService(includeSeasonal)` toggle)
- [ ] Public email inbox for Contact / footer.
- [ ] Zelle recipient, text-to-give number + keyword, PayPal link, mail payee name.
- [ ] Map pin location (no coordinates included; maps link uses the street address).

## Assets
- [ ] Download the 4 logos into `/public/brand/`; replace the text wordmark in `components/Header.tsx`.
- [ ] Sample exact brand blue from `fmbc-blue-logo` → update `--brand` in `app/globals.css`.
- [ ] Hero footage: when supplied, set `HERO_VIDEO` in `components/Hero.tsx` (YouTube embed is the interim).
- [ ] Leadership photos: download and verify each face matches the name before publishing.
- [ ] Pastor welcome video for I'm New (placeholder slot).

## Assumptions
- Hero tagline "Welcome aboard The Ship." and the sub-line are new marketing copy built from verified facts
  (1950, five generations, vision statement). They are not quotes. Church to approve.
- "South Side" is used as a general location descriptor.
- Brass accent is a design addition (not in the brand), used sparingly for heritage cues.
- Site is `noindex, nofollow` (demo) via root metadata. Remove at launch.
