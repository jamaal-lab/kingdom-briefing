# Greater Harvest Church: content inventory

Source: https://www.gharvestchurch.com (WordPress 4.2.2, theme "First", site credit tbcreations.com), crawled 2026-11-20.
Raw page text is in `docs/greater-harvest/source-pages/`, including the events calendar feed (`events-feed.ics`).

## Pages crawled
| Page | URL | What's there |
|---|---|---|
| Home | `/` | Pastor's welcome, quote, 12 upcoming events, 4 photos, footer hours, address, phone, dial-in, email, socials |
| About us | `/about-us/` | Intro ("God loves everybody"), pastor bio, 18 articles of faith, vision |
| Church Directory | `/church-directory/` | 9 member listings with personal emails and phones (not reused, see notes) |
| Ministries | `/ministries/` | 15 ministries with descriptions and leaders |
| Calendar | `/events/` and `?ical=1` | Tribe Events calendar, Oct 26 to Nov 30, 2026 |
| Contact Us | `/contact-us/` | Address, phone, email, Facebook, a "Let Us Know You're Here" form (CCB) |
| Prayer Request | `/contact-us/prayer-request/` | One line: send requests to INFO@GHARVESTCHURCH.COM |
| Live | `/media/` | YouTube embed `N2gZSMfP9PE`, "Greater Harvest Live Stream" |
| Past Services | `/past-services/` | 3 YouTube videos (all now private or deleted), a SoundCloud embed, a 2015 to 2017 photo gallery (images return 404) |
| Testimonials | `/testimonials/` | 4 entries, one a test entry ("John Test") |

No sitemap.xml (it returns the home page). No WordPress REST API (WP 4.2). No `/wp-json/tribe/events/v1` endpoint; the iCal feed works.

## Core facts (used on the site)
- **Name:** Greater Harvest Church ("The Greater Harvest Church" in the copyright line). Tagline: "Saving the lost, maturing the saved."
- **Senior Pastor:** Rev. Sebrone O. Johnson (bio spells Sebrone O'Neil Johnson). First Lady Donna Johnson.
- **Address:** 121 Driving Park Ave, Rochester, NY 14613
- **Phone:** (585) 496-4647. **Email:** info@gharvestchurch.com
- **Dial-in:** (515) 739-1030, access code 652-698-914 (the site gives no label for what it's used for)
- **Service hours (footer):** Sunday School 9:30 AM, Morning Worship 10:30 AM, Bible Study Thursday 7:00 PM
- **Ministries page adds:** Children's Church on Sunday, Wednesday Noon Prayer
- **Giving:** Givelify, `https://www.givelify.com/givenow/1.0/?token=eyJvcmdfaWQiOiJNemM1TWd-fiIsImJhZGdlX2ltYWdlIjoiYjIucG5nIn0` ("Give in faith")
- **Livestream:** YouTube video `N2gZSMfP9PE`. The Media Team streams "each Sunday morning."
- **Social:** Facebook `greaterharvestchurchrochester`, Instagram `gharvestroc`, Twitter/X `GHarvestRoc`. Google+ is defunct and was dropped.
- **Mandate:** love God, love people and impact the world. **Offer:** hope, healing, restoration, salvation and liberation. **Pursuit:** excellence in service, consecration in worship, fortitude in faith.
- **Verse:** Galatians 6:9 NRSV, which closes the pastor's welcome.
- **Pastor quote:** "Being in the midst of an impossible problem means that you are in the middle of a miracle."

## Flyers read visually (event and ministry graphics)
| Flyer | What it says |
|---|---|
| `2026/09/Check-In-Corner.png` | Hospitality Ministry: 9:00 AM Sunday, light breakfast, hot coffee and fellowship before Sunday School and worship. #GHCBanquetHall #LowerLevel |
| `2026/08/Genesis.jpeg` | Genesis: "Today is your new beginning", "We feel, heal, deal!" Resources: food, clothing, housing, rent, mental health counseling, insurance. Every Monday at 6:00 PM, 30-minute workout 5:15 to 5:45 PM, light refreshments |
| `2026/08/Sister-In-Spirit.png` | Sisters in Spirit in-person gathering, Thursday at 6:00 PM, "All Ages Welcome, Come as You Are" |
| `2026/06/BS.jpeg` | Bible Study, Thursdays at 7:00 p.m. in the #GHC Lecture Hall |
| `2026/01/3rd.jpeg` / `4th.jpeg` | "Third Commentary Sunday" and "4th Contemporary Sunday", 10:30 AM |
| `2025/11/IMG_6999.png` | "Welcome! New Member Class" |
| `2025/01/Media.jpg` | Media Team livestream notice |
| `2026/01/CHL-2.png` | "Choose Healthy Life" logo |

## Events (from the calendar feed, as of 2026-11-20)
On the site, each card hides itself after its end date:
| Date | Event | Time | Place | Link |
|---|---|---|---|---|
| Sat Nov 21 | Harvest Feast | 2 to 5 PM | Greater Harvest Banquet Hall | /event/harvest-feast-3/ |
| Sun Nov 22 | Check-In Corner, Sunday School, Worship | 9 AM to 12 PM | Banquet Hall, then Sanctuary | /event/children-church-8/ |
| Sat Nov 28 | Happy Birthday Pastor! | 8 AM to 5 PM | Greater Harvest Church | /event/happy-birthday-pastor-2/ |
| Sun Nov 29 | Worship Services / Youth Sunday | 10:30 AM to 12 PM | Greater Harvest Church | /event/worship-servicesyouth-sunday/ |

Weekly items shown in an "Every week" card: Sun 9 AM Check-In Corner; Mon 6 PM Genesis; Wed 12 PM Noon Prayer; Wed 6 PM Choir Rehearsal; Thu 6 PM Sisters in Spirit; Thu 7 PM Bible Study.

**Left out:**
- Events already over: New Member's Class #1 and #2 (Nov 17, 19), CHL Wellness Wednesday (Nov 18), EORO Game Night (Nov 13), CHL Blueprint for Wellness (Nov 14), Truck or Treat (Oct 31) and earlier.
- Recurring meetings for leaders, not guests: Diaconate, Trustee and Executive Board.
- No event on the calendar has an RSVP or sign-up link, so every card links to the church's own event page.

## Ministries (18 on the new site)
These 15 are from `/ministries/`: Diaconate, Trustee, Greeters, Each One Reach One, Music, Marketing, Health and Fitness, Missionary, Youth & Young Adults (shown as "Youth Ministry"), GHC Watchmen, Youth Adult Ministry, Genesis, Media Team, Social Justice, Sister in Spirit.

These 3 come from the calendar's event organizers: Hospitality Ministry, Choose Healthy Life, Christian Education.

The age and interest tags for the filter are our grouping, not the church's.

## Photos
| File on DemoDrop | Source | Used for |
|---|---|---|
| sanctuary-pulpit.jpg | 2025/01/pic-161.jpg | Home hero (minister at the pulpit; not named in alt) |
| pastor-johnson.jpg | 2025/04/pic-12.jpg | Pastor portrait (featured image of the "Happy Birthday Pastor!" event) |
| pastor-preaching.jpg | 2025/04/pic-13.jpg | Watch hero (pastor in red robe) |
| church-exterior.jpg | 2015/10/Optimized-slide1.jpg | I'm New hero (1200x390, soft when enlarged) |
| youth-ministry.jpg | 2025/01/Pic-9.jpg | I'm New kids band (cropped to the photo inside the flyer frame) |
| pastor-reading-classroom.png | 2017/01/Johnson10.png | Home community impact |
| pastor-celebration.jpg | 2025/04/pic-51.jpg | Get Connected hero (pastor with an unnamed woman) |
| pastor-backdrop.jpg | 2025/04/pic-4.jpg | Our Story hero (pastor with an unnamed woman) |
| logo.png | 2016/10/logo.png (252x112) | Header and footer |
| logo-mark.jpg | 2025/11/IMG_0619.jpg | Our Story mark (cropped to remove the "Each One Reach One" script) |
| site-icon.png | 2016/10/GreaterHarvest2_modified-copy.png | Favicon |

**No stock photos are used anywhere.** The Give, Care and Contact page headers are type-led, with no photo.

Not used:
- Flyers (text baked in).
- Johnson6 and Johnson8 (2017, older portraits).
- Johnson-and-Wright and Johnson-and-NUL (group photos; people not identified).
- Djohnson.png (First Lady, 2017 phone selfie; the match is proven but the quality is low).
- ghcBanner (cut-out composite).
