# Master Prompt: Premium Church Website (DemoDrop)

Fill in the [BRACKETS], delete lines that don't apply, and paste everything below the line into a new session.

---

Build a premium demo website for [CHURCH FULL NAME] ("[SHORT NAME]"), [SENIOR PASTOR NAME AND TITLE], at [ADDRESS]. It replaces their current site at [CURRENT SITE URL]. Publish it to DemoDrop as a demo site with slug [slug]. Use the Fellowship Chicago build (https://fellowship-chicago.ddsites.co, generator in `demodrop/gen.py` and `demodrop/pages.py` of jamaal-lab/kingdom-briefing) as the template: same structure, components, motion and quality bar, re-skinned for this church.

FACTS I'VE VERIFIED (use these; take everything else only from the church's own site, flyers and forms; never invent)
- Service times: [ ]
- Midweek / other gatherings: [ ]
- Kids and youth: [ ]
- Phone / email / office hours: [ ]
- Giving link (primary) and other methods: [ ]
- Livestream: [YouTube channel URL], [Facebook]
- Social: [ ]
- Vision / mission / framework: [ ]
- Leadership (name, title): [ ]
- Logo files / brand colors, if known: [ ]
- Anything to feature or avoid: [ ]

STEP 1: ACCESS (do this first, before any building)
- Test whether this session can reach the church site. If it can't, call get_environment and propose adding BOTH the bare domain and www (a church's certificate often covers only one). When you find sign-up links, also request their hosts (often the church's ShelbyNext/ChMS subdomain plus forms.ministryforms.net, docs.google.com, the church's zoom.us subdomain, www.dropbox.com, Eventbrite, Planning Center). One approval prompt per batch.
- If the site still can't be reached, remember that DemoDrop's add_image fetches from its own servers: use it with exact image URLs for logos and photos.

STEP 2: CONTENT INVENTORY
- Scrape the homepage, sitemap and every page in the main menu (about, history, founder, beliefs, values, vision, leadership, ministries, new here, give, events, prayer, care). Save raw text to `docs/source-pages/` and write `docs/content-inventory.md`.
- Homepage "flyers": find every slider button and flyer graphic, follow each link and read the real date, time, place and sign-up URL. For JavaScript forms, render them with Playwright through the proxy and read the embedded iframe. Read flyer images visually. Check for an events calendar feed (WordPress `/wp-json/tribe/events/v1/events`).
- Turn every current event into a text card (date, time, place, short line, the church's own RSVP link) with a `data-end` date so it hides itself after it ends. Leave out ended or unpublished events and closed forms, and list them in the notes.
- Ministries: import the full list with the church's own descriptions, schedules, leaders and contacts. Add age and interest tags for the filter, and note that they're my grouping.
- Record every conflict between the church's own pages (service times, age ranges) and anything missing (parking, nursery, dress, service length). Never guess.

STEP 3: PHOTOS AND PEOPLE
- Use the church's own photos first: the best wide worship or sanctuary shot for the cinematic hero, plus real ministry or outreach photos. Never repeat a photo on the same page. Use DemoDrop stock only to fill gaps, and flag each one.
- Staff headshots: post a photo only when the page structure proves the match (the photo sits in the same card as the name, in consistent order). Check visually that faces are plausible for the names. Anyone without a proven match gets name only. List the matches in the notes for the church to confirm.
- Archive or history photos: caption them only with what the source says (the year in the alt text, for example).

STEP 4: BUILD (DemoDrop)
- get_build_rules first and follow the agency rules: Adobe kit fonts (never Inter, Roboto or Arial), no em or en dashes anywhere, at most one eyebrow label, no section numbers, no marquees, pill buttons, custom inline SVG icons drawn for the real things, data-dd-form forms, footer credit "Website by Bridge to Better Solutions, LLC", church owns name, logo and photos.
- Exceptions I approve: the dark cinematic "Harbor at Night" style (one light band per page) recolored to this church's brand, a heritage accent color if the church has a legacy story, and a muted YouTube background behind the hero photo that fades in only when YouTube reports playback.
- Pages: Home (cinematic hero with service times and Plan Your Visit above the fold, live-now/countdown strip, service clock, latest message, five doors, mission, community impact with a real photo, pastor, legacy teaser, dated events with RSVP buttons, give band), I'm New (times, location, parking, kids, first-time FAQ, Plan a Visit form), Watch (countdown/live player, recent sermons playlist, midweek service, music, TV), Get Connected (filterable ministry finder plus sign-up form with ?m= preselect), Our Story (founder, sticky-year scroll timeline with inline archive photos, anniversary moment if any, logo meaning, mission, beliefs and values, pastor and leadership grid), Give (primary button plus every real method with copy buttons), Care (crisis lines first, prayer form, grief support), Contact (address, phone, hours, map, form). Mobile sticky bar with Plan Your Visit and Give.
- Generate pages from the template generator: fill one data block for this church, prune unused CSS per page, include only the JS modules each page uses, and fold lines outside the script so pages can be read back.
- Add noindex on every page until the church approves.

STEP 5: CHECK, PUBLISH, REPORT
- Local QA at 390px and 1440px: zero horizontal overflow, one h1 per page, no text under 14px, tap targets at least 44px, no console errors, no dash characters. Test the menu (Escape and focus return), filters, preselect, event expiry and the countdown.
- DemoDrop previews: one phone and one desktop pass on the homepage, plus spot checks on Our Story and Get Connected. Fix everything in one edit round, preview the changes once more, then publish all pages and call set_seo for each one.
- Use edit_page for small changes to live pages; re-upload a whole page only when most of it changed.
- Commit the generator, content inventory and NOTES.md on the working branch and push.
- Final summary for me: the live link; what's real and where it came from; every placeholder and stock photo; conflicts and missing facts for the church; anything you left out and why; anything that failed.
