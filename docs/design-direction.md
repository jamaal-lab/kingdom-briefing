# Design Direction: "Harbor at Night"

Screenshots: `docs/design/hero-desktop.png`, `hero-mobile.png`, `menu-mobile.png`, `design-direction.png`.
Live style guide: run the app and open `/design`.

## Idea
The church is "The Ship," its mark is an anchor, and it has been in port at 45th & Princeton since 1959.
The site is a harbor at night: a near-black navy base, with the brand blue showing up as light on water
and white carrying the message. Legacy meets now: a condensed Chicago typeface for today, and an italic
serif with a brass accent for heritage moments (1950, The Ship, the timeline).

## Color
| Token | Hex | Role |
|---|---|---|
| Ink | #04070D | page base |
| Hull | #0A1424 | raised surfaces |
| Deep | #0F2240 | bands, cards |
| Brand Blue | #1F56B8 | **provisional**, to be replaced by the value sampled from `fmbc-blue-logo` |
| Signal Blue | #4D86EF | links/focus on dark (AA on Ink) |
| Tide | #9DB8E6 | secondary text (AA on Ink/Hull) |
| Foam | #F4F7FC | primary text |
| Brass | #D6B26A | heritage accent and live state only; under 5% of any screen |

## Type
- **Big Shoulders** (display): designed for the City of Chicago. Headlines, numbers, nav on mobile.
- **Instrument Serif Italic** (accent): "The Ship.", years, scripture.
- **Inter** (text): body, forms, UI.

## Hero
Full-screen (100svh). A muted YouTube background loops the channel's uploads playlist (it needs no video ID);
it loads after first paint and is skipped under reduced motion. A slow light-on-water gradient shows until
the video plays. The headline "WELCOME ABOARD / *The Ship.*" rises line by line. Plan Your Visit and Watch Online
CTAs and a glass service-times card with a live countdown ("Next in 3d 8h" / pulsing "LIVE NOW" on Sundays)
all sit above the fold on a 390×664 phone.

## Motion rules
Framer Motion. Easing `[0.16, 1, 0.3, 1]`. Hero parallax and fade on scroll; Our Story gets the
scroll-pinned timeline. Everything respects `prefers-reduced-motion` (no parallax, no autoplay video,
no line reveals).
