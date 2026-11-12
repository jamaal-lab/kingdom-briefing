# NOTES: TODOs and Assumptions

Every placeholder, unconfirmed fact and integration gap in the demo. In the UI, placeholders show as
dashed brass boxes labelled **"Placeholder · …"** so reviewers can see what's missing.

## 0. Blockers in the build environment
- [ ] `fellowshipchicago.com`, `www.youtube.com`, `i.ytimg.com`, `web.archive.org` were refused by the
      network policy, so **no copy, logos, photos or sermons were scraped**. Everything below that says
      "import" depends on this.
- [ ] Git push to `jamaal-lab/kingdom-briefing` was refused (Claude GitHub App not authorized). Work is
      committed locally on `claude/fellowship-chicago-website-xcsibj`.

## 1. Facts to confirm with the church
- [ ] Third Sunday service: **1:15 PM** used; old site says both 1:00 and 1:15 (`content/site.ts`).
- [ ] Refuel season dates. The countdown ignores seasonal services (`getNextService(includeSeasonal)`).
- [ ] Ministry leaders were **inferred from staff titles** (Youth → Jillian Twiggs, Worship & Arts → Kevin
      Vasser, Membership → Wendy Irby). Confirm (`content/ministries.ts`).
- [ ] Public email address (Contact/footer): none shown.
- [ ] Giving: Zelle recipient, text-to-give number + keyword, PayPal link, mail payee name. Until then the
      Give page says "Details from the church office" instead of linking anywhere (no broken links).
- [ ] Cash App link `cash.app/$FellowshipChicago` is derived from the handle. Verify.
- [ ] Map pin: no coordinates stored; maps use the street address.

## 2. Content to import (once the site is reachable)
- [ ] ~27 ministries + descriptions from `/ministries/` → `content/ministries.ts` (9 from the brief are in now).
- [ ] Parking, nursery/check-in, service length, dress, accessibility from `/new-to-fellowship/` (I'm New placeholders).
- [ ] Timeline body copy from `/history/` → `content/story.ts` (titles only now).
- [ ] Clay Evans biography from `/meet-reverend-clay/`; civil-rights history section (placeholder; nothing
      beyond the verified timeline was written).
- [ ] Beliefs (`/our-beliefs/`) and core values (`/our-core-values/`): verbatim.
- [ ] Community impact copy for Food Giveaway / Community Table / Social Justice (one-line summaries now).
- [ ] Special events → `content/events.ts` as text. Upcoming cards currently show the real weekly services.
- [ ] Sermon series/scripture tags → `content/sermons.ts`. Scripture is auto-detected from video titles.
- [ ] Music playlist IDs → `content/sermons.ts`.
- [ ] Old-site URL list from its sitemap.xml → `lib/redirects.ts` (8 known paths + 4 guessed ones mapped).

## 3. Assets
- [ ] 4 logos → `/public/brand/`; replace the text wordmark in `components/Header.tsx` and `Footer.tsx`,
      and the logo placeholder on Our Story.
- [ ] Sample the exact brand blue from `fmbc-blue-logo` → `--brand` in `app/globals.css` (now #1F56B8, provisional).
- [ ] Favicon: `app/icon.svg` is a **temporary hand-drawn anchor**; replace with `cropped-site-icon-270x270.png`.
- [ ] Leadership photos (12): download from `/our-leadership/`, **verify each face matches the name**, set
      `photo`/`photoAlt` in `content/story.ts`. Cards show initials + "Photo pending" now.
- [ ] Pastor Sharpe full-size photo (original of `prws-photo-1-1-scaled-200x300.jpg`).
- [ ] Timeline photos 2–4 → `/public/history/`, add `image`/`imageAlt` on the matching entries.
- [ ] Clay Evans archive portrait; ministry photos for Community Impact cards.
- [ ] Hero footage: set `HERO_VIDEO` in `components/Hero.tsx`. Until then a muted embed of the channel's
      uploads playlist plays, revealed only after YouTube reports playback.
- [ ] Pastor welcome video (I'm New).

## 4. Quotes and copy written for the demo (church to approve)
- [ ] **No quotes from Pastor Sharpe were written.** Welcome message and bio are placeholders.
- [ ] New marketing copy built from verified facts: hero ("Welcome aboard The Ship." / "Five generations of
      faith on Chicago's South Side…"), section headlines ("Five doors in", "Gospel you can see", "Fuel the
      mission", "The crew", "Lost at sea" 404), short helper text on forms and pages.
- [ ] "South Side" used as a general location descriptor.
- [ ] First-time FAQ: two answers written from verified facts; three are placeholders.

## 5. Integrations
- [ ] `app/api/forms/route.ts` is a **stub**: validates, honeypot, logs (prayer/grief content redacted).
      TODO: visit + ministry sign-ups → ShelbyNext Membership; prayer/grief → pastoral care inbox; contact →
      office inbox (e.g. Resend/Postmark). Add rate limiting + Turnstile before launch.
- [ ] Sermon library uses the channel's public RSS (latest 15). For the full archive and pagination, use the
      YouTube Data API v3 (needs an API key in Vercel env).
- [ ] Live state is schedule-based (Sunday services + 100-minute window). For true live detection, use the
      YouTube Data API `eventType=live`.

## 6. Launch checklist
- [ ] Set `DEMO_NOINDEX=false` in Vercel. This removes the robots meta tag and the `X-Robots-Tag` header, and opens `robots.txt`.
- [ ] Delete or protect `/design` (internal style guide).
- [ ] Point DNS; verify redirects against the old sitemap.

## Design assumptions
- Brass accent (#D6B26A) is an addition to the blue/white brand, kept to heritage cues and the live state.
- Fonts: Big Shoulders (designed for Chicago), Instrument Serif, Inter, self-hosted via `next/font`.
