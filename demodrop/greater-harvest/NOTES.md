# Greater Harvest Church: DemoDrop build notes

**Live demo:** https://greater-harvest-church.ddsites.co (DemoDrop site `st_c6ae9bc729df4571`, demo mode, `noindex` on every page)

**Generator:** `python3 demodrop/greater-harvest/gen.py` writes 8 pages to `out/`.
- `gen.py` is the engine, the Fellowship Chicago template re-skinned: CSS, JS modules, header, footer, per-page CSS pruning, JS module selection, line folding and a dash check.
- `pages.py` holds this church's data block (ministries, events, leaders, beliefs) and the page bodies.
- `beliefs.json` holds the 18 articles of faith, verbatim from `/about-us/`.

**Content inventory:** `docs/greater-harvest/content-inventory.md`, with raw page text in `docs/greater-harvest/source-pages/`.

## Design
- **Theme:** the "Harbor at Night" dark cinematic style, recolored "Harvest at Night":
  - plum-black base (#0d0a0b, #171113, #24151a)
  - crimson buttons and give band (#9b1c2c), from the logo's maroon cross (#670001)
  - wheat-gold highlights (#e0a93b, #e7be6a), from the logo's wheat
  - one white band per page
- **Fonts:** Adobe kit, freight-big-pro for headings (serif, mixed case, italic accents) and proxima-nova for body text. This is a different pairing from Fellowship. It fits a traditional ministry.
- **Logo:** the church's 252x112 PNG sits on a light chip in the header and footer, because its maroon script disappears on dark. The file itself is unaltered.
- **History:** there's no dated history to tell, so the sticky-year timeline module is reused for the 18 Articles of Faith, with a sticky Roman numeral and title.
- **Home "legacy" moment:** an outlined "6:9" with Galatians 6:9, the verse that closes the pastor's welcome.
- **Hero video:** a muted YouTube background (`N2gZSMfP9PE`) behind the hero photo. It fades in only when YouTube reports playback.

## QA done
- Local Playwright check at 390px and 1440px, all 8 pages: zero horizontal overflow, one h1 per page, no text under 14px, all tap targets 44px or larger, no console errors, no en or em dashes.
- Menu: opens, locks scroll, closes on Escape, and returns focus to the button.
- Filters: age plus interest combine; `?m=` preselects the ministry; "Join" links set the form.
- Event expiry, tested at Nov 20, Nov 23, Nov 29 and Dec 1: past cards hide.
- Countdown: shows "Live now" Sundays 10:30 to 12:00 Eastern.
- Sticky numeral tracks the article on screen.
- DemoDrop previews: homepage on phone and desktop; Our Story on desktop; Get Connected on phone. One fix round: raised the hero crop to the preacher's face and added labels to the service clock.

## For the church to confirm
### Conflicts between the church's own pages
1. **Bible Study day:** Thursday 7 PM (footer, ministries page, 2026 flyer, most calendar entries) vs. one calendar entry on Wed Nov 4. We use Thursday.
2. **Trustee chair:** "Trustee Joyce Johnson, Chair" (ministries page) vs. "LaTricia Johnson, Chairperson of Trustees" (directory). We use Joyce Johnson.
3. **Marketing Ministry president:** Deaconess Betty Knight (ministries page) vs. Marra Green (directory). The directory also lists Betty Knight as Women's Ministry president. We use the ministries page.
4. **Health and Fitness lead:** Sister Tamikyo Taylor (ministries page) vs. LaVerne Jones RN, President (directory). We use the ministries page.
5. **Phone number:** worship event pages list 585-458-5927, everything else says (585) 496-4647. We use 496-4647.
6. **Genesis location:** "Lower Level" (ministries page) vs. "Banquet Hall" (flyer and calendar). The hospitality flyer tags the Banquet Hall as the lower level, so these agree.
7. **Sunday flyers:** "3rd Commentary Sunday" and "4th Contemporary Sunday" art is attached to Nov 22 (4th Sunday) and Nov 29 (5th Sunday, "Youth Sunday"). The pattern is unclear, so the site only says some Sundays are special.
8. **Youth ministries:** "Youth & Young Adults" (described as youth) and "Youth Adult Ministry" (See Rev. Dudley) both exist. We show "Youth Ministry" and "Youth Adult Ministry".

### Missing facts (written around, never guessed)
- Parking. The site says "details coming soon, call the church."
- Office hours.
- Nursery and Children's Church age ranges, and kids check-in or safety.
- Dress code. We say "Come as you are," the Sisters in Spirit flyer's own words.
- Accessibility.
- Founding year, church history and the meaning of the logo.
- Denomination. The articles of faith read as Baptist, but the site never says so, so neither do we.
- The YouTube **channel** URL. Only one video ID is known, so the Watch page and footer link to that video. The three Past Services videos are private or deleted.
- Giving methods beyond Givelify (text-to-give, Cash App, mail).
- What the dial-in line is for.
- Recent sermon titles. No playlist is available.

### Photos and people
- **Pastor portrait** (pic-12): the featured image of the church's own "Happy Birthday Pastor!" event, and the face matches the Bible Study flyer and 2017 portraits. Confirm.
- **Woman beside the pastor** in pic-4 (Our Story hero) and pic-51 (Get Connected hero): very likely First Lady Donna Johnson, but she isn't named anywhere, so the alt text doesn't name her. Confirm her name for the alt text.
- **First Lady Donna Johnson's directory photo** (Djohnson.png) is a proven match: it sits in her directory card. It isn't used because it is a 2017 phone selfie.
- **Hero photo** (pic-161): a minister at the pulpit, not named, since we can't confirm it's Pastor Johnson. Confirm.
- **Leadership grid:** names and roles only, no headshots, because no staff photo is proven except the pastor's.
- **Exterior photo:** 1200x390, so it's soft on large screens. Ask for a higher-resolution exterior and a wide worship photo for the hero.
- **Logo:** a vector or larger PNG would sharpen the header.

## Left out on purpose
- **Church Directory:** personal emails and phone numbers of members. Not published; personal details are redacted in the saved source text too. Ministry leaders' personal cell numbers from the ministries page are also left off; sign-ups go through the form and the church office.
- **Testimonials:** one is a test entry and one includes a personal phone number. The agency's church rule also avoids testimonial sections. Real member quotes could be added with consent.
- **"Let Us Know You're Here" form (CCB):** its "I would like to" options (baptism, join the church) became the Contact form's topic menu.
- **SoundCloud embed:** points to a user profile we can't verify.
- **2015 to 2017 photo gallery:** every image returns 404 on the live site.
- **Google+:** defunct.

## Forms (DemoDrop `data-dd-form`)
Plan a Visit, Ministry Sign-Up, Prayer Request, Pastoral Care and Contact. Submissions are saved and emailed by the platform.

## Before launch
- Remove `noindex` from every page.
- Connect the church's domain.
- Add December and later events to `EVENTS` in `pages.py`. After Nov 29 only the weekly card shows.
- Replace the hero video ID with the church's channel uploads once the channel URL is known.
