# Page bodies for Greater Harvest Church. Executed inside gen.py (shares its helpers).
# Every fact here comes from gharvestchurch.com (pages saved in docs/greater-harvest/source-pages/).
import datetime as _dt

HERE = pathlib.Path(__file__).parent
BELIEFS = json.load(open(HERE / "beliefs.json"))  # the 18 articles, verbatim from /about-us/

PASTOR = "Rev. Sebrone O. Johnson"
# Leaders as the church lists them. Ministries page first; directory where the ministries page is silent.
# (name, role). No staff headshots: only the pastor's photos are proven. See NOTES.
LEADERS = [
    ("Donna Johnson", "First Lady"),
    ("Rhashard Watkins", "Chairman, Diaconate Ministry"),
    ("Joyce Johnson", "Trustee Chair"),
    ("Joyce Mack", "Church Clerk"),
    ("Bryan Rogers", "Musical Director"),
    ("Rev. Al Knight", "GHC Watchmen Ministry"),
    ("Pastor Wanda Wilson", "President, Social Justice Ministry"),
    ("Rev. Dudley", "Youth Adult Ministry"),
    ("Deaconess Betty Knight", "President, Marketing Ministry"),
    ("Deaconess Lola Emerson", "Genesis Ministry"),
    ("Monique Franklin-McDuffie", "President, Sister in Spirit Ministry"),
    ("LaQuisha Bridges", "Media Team"),
    ("Deacon Tim Johnson", "Media Team"),
    ("Ella Rush", "Greeters Ministry"),
    ("Nancy Walker", "Each One Reach One Ministry"),
    ("Tamikyo Taylor", "Health and Fitness Ministry"),
]
OFFERS = [("H", "Hope"), ("H", "Healing"), ("R", "Restoration"), ("S", "Salvation"), ("L", "Liberation")]

A = "Young Adults|Adults|Seniors"
# (name, description from the church's own words, ages, interests, leader, when). Age and interest tags are our grouping.
MINISTRIES = [
    ("Hospitality Ministry", "The GHC Check-In Corner: a light breakfast, a hot cup of coffee and fellowship just before Sunday School and worship.", "All Ages", "Hospitality|Fellowship", "", "Sundays, 9:00 AM, Banquet Hall (lower level)"),
    ("Greeters Ministry", "For most guests, the first people they meet. Greeters create a welcoming atmosphere so every worshiper feels loved, cared for and at ease.", "Youth|" + A, "Hospitality", "Sister Ella Rush", ""),
    ("Youth Ministry", "Young people are the lifeblood of the church's future: Children's Church, junior greeters, youth choir, spoken word and devotion.", "Children|Youth", "Worship and Music|Learning", "", "Children's Church during Sunday worship"),
    ("Youth Adult Ministry", "A ministry for young adults at Greater Harvest. Ask Rev. Dudley how to get involved.", "Young Adults", "Fellowship|Learning", "Rev. Dudley", ""),
    ("Music Ministry", "Sharing the gospel through song on keyboard, organ, drums and voices, with adult and youth choirs. There is a place for your gift.", "Youth|" + A, "Worship and Music", "Brother Bryan Rogers", "Choir rehearsal, Wednesdays 6:00 to 8:00 PM"),
    ("Media Team", "Each Sunday morning the Media Team brings live worship to GHC online members and friends by livestream.", "Youth|" + A, "Media", "Sister LaQuisha Bridges and Deacon Tim Johnson", ""),
    ("Marketing Ministry", "Social media, still photography, video and electronic communication that help people connect with Greater Harvest.", A, "Media", "Deaconess Betty Knight, President", ""),
    ("Each One Reach One Ministry", "Making and keeping spiritual connections through outreach and in-reach, from neighbors to game nights for the whole family.", "All Ages", "Outreach|Fellowship", "Sister Nancy Walker", ""),
    ("Missionary Ministry", "Visiting the sick, sponsoring clothing and food drives, and equipping the church for evangelism at home and around the world.", A, "Outreach|Care", "", ""),
    ("Genesis Ministry", "Today is your new beginning. Conquering any and all struggles through Jesus Christ, with help for food, clothing, housing, rent, mental health counseling and insurance.", A, "Care|Outreach", "Deaconess Lola Emerson", "Mondays, 6:00 to 7:00 PM, with a 30-minute workout at 5:15 PM"),
    ("Social Justice Ministry", "Faith in Action, Justice for All.", A, "Justice|Outreach", "Pastor Wanda Wilson, President", ""),
    ("Diaconate Ministry", "Together with the Pastor, the deacons care for worship and the ordinances, assist in visitation and counseling, and keep a watchful eye over the needy, the sick and the afflicted.", A, "Care|Serving", "Rhashard Watkins, Chairman", ""),
    ("Trustee Ministry", "Oversight of church property and finances, with volunteers always welcome on the Building and Grounds and Security teams.", A, "Serving", "Trustee Joyce Johnson, Chair", ""),
    ("GHC Watchmen Ministry", "Helping men be the godly men God calls us to be: resources to build godly character and influence our world for Christ.", A, "Fellowship|Learning", "Reverend Al Knight", ""),
    ("Sister in Spirit Ministry", "Women of Greater Harvest gathering in person. All ages welcome, come as you are.", "All Ages", "Fellowship|Learning", "Sister Monique Franklin-McDuffie, President", "Thursdays, 6:00 PM, Lecture Hall"),
    ("Health and Fitness Ministry", "Physical wholeness is an integral part of spiritual wholeness: diet, exercise and healthy life choices for the Body of Christ.", A, "Wellness", "Sister Tamikyo Taylor", ""),
    ("Choose Healthy Life", "Wellness Wednesday sessions and the Blueprint for Wellness workshop in the Greater Harvest Banquet Hall.", A, "Wellness", "", "Wellness Wednesday, 6:00 to 7:30 PM, select Wednesdays"),
    ("Christian Education", "Sunday School, the Thursday Bible/Life Study series and the New Member's Class.", "All Ages", "Learning", "", "Sunday School 9:30 AM, Bible Study Thursdays 7:00 PM"),
]
# Dated events from the church's own calendar (events feed, read 2026-11-20). Past ones hide by end date.
EVENTS = [
    ("2026-11-21", "2026-11-21", "Harvest Feast", "A Saturday afternoon of food and fellowship with the Greater Harvest family.", "2:00 to 5:00 PM", "Greater Harvest Banquet Hall", "https://www.gharvestchurch.com/event/harvest-feast-3/", "Event Details"),
    ("2026-11-22", "2026-11-22", "Check-In Corner and Worship", "Light breakfast and coffee at 9:00, Sunday School at 9:30, then worship together at 10:30.", "9:00 AM to 12:00 PM", "Banquet Hall, then the Sanctuary", "https://www.gharvestchurch.com/event/children-church-8/", "Event Details"),
    ("2026-11-28", "2026-11-28", "Happy Birthday, Pastor!", "The church calendar marks the day to celebrate Pastor Johnson.", "All day", "Greater Harvest Church", "https://www.gharvestchurch.com/event/happy-birthday-pastor-2/", "Event Details"),
    ("2026-11-29", "2026-11-29", "Youth Sunday", "Worship services led with our young people. Come early for coffee at the Check-In Corner.", "10:30 AM to 12:00 PM", "Greater Harvest Church", "https://www.gharvestchurch.com/event/worship-servicesyouth-sunday/", "Event Details"),
]
WEEKLY = [("Sun", "9:00 AM", "GHC Check-In Corner, Banquet Hall"), ("Mon", "6:00 PM", "Genesis Ministry"),
          ("Wed", "12:00 PM", "Noon Prayer"), ("Wed", "6:00 PM", "Choir Rehearsal"),
          ("Thu", "6:00 PM", "Sisters in Spirit"), ("Thu", "7:00 PM", "Bible Study, Lecture Hall")]


def event_cards():
    out = []
    for st, en, title, blurb, time, where, url, cta in EVENTS:
        a = _dt.date.fromisoformat(st)
        out.append(f'<li class="rv" data-end="{en}"><div class="dt"><span class="n">{a.day}</span><span class="m">{a.strftime("%b")} {a.year}<br>{a.strftime("%a")}</span></div><h3>{title}</h3><span class="tm">{time}</span><p class="muted">{blurb}</p><p class="where">{ic("pin")}<span>{where}</span></p><a class="btn btn-light ecta" href="{url}">{cta}</a></li>')
    return "".join(out)


weekly = "".join(f'<li><strong>{d} {t}</strong><span>{n}</span></li>' for d, t, n in WEEKLY)
CLOCK = ('<p class="clock" aria-label="Sunday School at 9:30 AM and Morning Worship at 10:30 AM">'
         '<span class="t">9:30<small>AM, Sunday School</small></span><span class="sep" aria-hidden="true">/</span>'
         '<span class="t">10:30<small>AM, Worship</small></span></p>')

# ------------------------------------------------------------------ HOME
home = f"""
<section class="hero" aria-labelledby="h1">
 <div class="hero-media">
  <img src="/images/sanctuary-pulpit.jpg" alt="A minister preaching from the Greater Harvest pulpit, the church crest on the lectern and the American flag beside him" width="3024" height="4032" loading="eager" fetchpriority="high" style="object-position:50% 18%">
  <div class="hero-vid" aria-hidden="true"></div>
 </div>
 <div class="scrim"></div>
 <div class="wrap"><span data-sentinel></span>
  <h1 id="h1" class="rise">Saving the lost,<span class="accent">maturing the saved.</span></h1>
  <p class="sub rise d1">Greater Harvest Church, a family of faith on Driving Park Avenue in Rochester, New York.</p>
  <div class="btns rise d2"><a class="btn btn-light" href="visit.html#plan">Plan Your Visit</a><a class="btn btn-ghost" href="watch.html">Watch Online</a></div>
  <p class="times rise d3">Sunday School 9:30 AM, Worship 10:30 AM <span>| Bible Study Thursdays 7 PM</span></p>
 </div>
</section>

<section class="live" aria-label="Livestream status">
 <div class="wrap"><p data-live aria-live="polite">Next livestream: <strong>Sunday 10:30 AM</strong></p><a class="btn btn-ghost" style="min-height:46px" href="watch.html" data-live-btn>Go to Watch</a></div>
</section>

<section class="band b-white" id="visit" aria-labelledby="vh">
 <div class="wrap poster">
  <div class="rv">
   <h2 id="vh">Your Sunday, start to finish</h2>
   {CLOCK}
  </div>
  <ul class="vlist rv" data-i="1">
   <li><span class="tile">{ic("cup")}</span><div><strong>9:00 AM, coffee first</strong><p>The Hospitality Ministry's Check-In Corner serves a light breakfast and hot coffee in the Banquet Hall, lower level.</p></div></li>
   <li><span class="tile">{ic("kids")}</span><div><strong>Children's Church at 10:30</strong><p>Kids worship and learn in Children's Church while you are in the morning service.</p></div></li>
   <li><span class="tile">{ic("pin")}</span><div><strong><a class="ulink" href="{MAPS}">{ADDR}</a></strong><p>Look for the red brick church on Driving Park. Tap the address for directions.</p></div></li>
  </ul>
  <div class="rv"><a class="btn btn-dark" href="visit.html#plan">Plan Your Visit</a></div>
 </div>
</section>

<section class="band b-ink" id="message" aria-labelledby="mh">
 <div class="wrap split">
  <div class="rv">
   <h2 id="mh">Worship with us from anywhere</h2>
   <p class="lede">Every Sunday morning our Media Team streams worship live for GHC online members and friends. Press play, or join the countdown on the Watch page.</p>
   <div class="btns"><a class="btn btn-light" href="watch.html">Watch Now</a><a class="btn btn-ghost" href="{FB}">On Facebook</a></div>
  </div>
  <div class="frame rv" data-i="1"><div class="vid"><iframe title="Greater Harvest Live Stream" src="{LIVE}" loading="lazy" allow="encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe></div></div>
 </div>
</section>

<section class="band b-hull" id="doors" aria-labelledby="dh">
 <div class="wrap">
  <h2 id="dh" class="rv">Five doors in</h2>
  <ul class="doors">
   <li class="rv"><a href="visit.html"><span><span class="t">I'm New</span><span class="d">Service times, kids, directions and what to expect.</span></span>{ic("arrow")}</a></li>
   <li class="rv" data-i="1"><a href="watch.html"><span><span class="t">Watch</span><span class="d">The Sunday livestream, Bible Study and how to dial in.</span></span>{ic("arrow")}</a></li>
   <li class="rv" data-i="2"><a href="connect.html"><span><span class="t">Get Connected</span><span class="d">Eighteen ministries. Find the one with your name on it.</span></span>{ic("arrow")}</a></li>
   <li class="rv" data-i="3"><a href="our-story.html"><span><span class="t">Our Story</span><span class="d">Who we are, what we believe and who leads us.</span></span>{ic("arrow")}</a></li>
   <li class="rv" data-i="4"><a href="give.html"><span><span class="t">Give</span><span class="d">Give in faith, securely online through Givelify.</span></span>{ic("arrow")}</a></li>
  </ul>
 </div>
</section>

<section class="band b-deep" id="mission" aria-labelledby="sh">
 <div class="wrap">
  <h2 id="sh" class="ship rv">Love God. Love people. <b>Impact the world.</b></h2>
  <p class="lede rv">We hold dear the mandate of Jesus Christ. As a changed people, changing our community, we offer in a contemporary context:</p>
  <ol class="letters">{"".join(f'<li class="rv" data-i="{i}"><span class="L" aria-hidden="true">{l}</span><span class="W">{w}</span></li>' for i,(l,w) in enumerate(OFFERS))}</ol>
 </div>
</section>

<section class="band b-ink" id="impact" aria-labelledby="ih">
 <div class="wrap">
  <h2 id="ih" class="rv">Changing our community</h2>
  <p class="lede rv">Charitable deeds through Christian service, from Driving Park to the classroom.</p>
  <figure class="frame rvi feat" style="margin:40px 0 0"><div><img src="/images/pastor-reading-classroom.png" alt="Pastor Sebrone O. Johnson reading a picture book to a classroom of children seated on the floor" width="960" height="720" loading="lazy" style="object-position:center 45%"></div></figure>
  <ul class="rows">
   <li class="rv"><span class="tile">{ic("seed")}</span><h3>Genesis Ministry</h3><p>A new beginning, every Monday at 6 PM. Help with food, clothing, housing, rent, counseling and insurance.</p><a class="ulink" href="connect.html?m=Genesis+Ministry#join">Get involved</a></li>
   <li class="rv" data-i="1"><span class="tile">{ic("bread")}</span><h3>Missionary Ministry</h3><p>Visiting the sick and sponsoring clothing and food drives for our neighbors.</p><a class="ulink" href="connect.html?m=Missionary+Ministry#join">Get involved</a></li>
   <li class="rv" data-i="2"><span class="tile">{ic("scales")}</span><h3>Social Justice</h3><p>Faith in Action, Justice for All.</p><a class="ulink" href="connect.html?m=Social+Justice+Ministry#join">Get involved</a></li>
  </ul>
 </div>
</section>

<section class="band b-hull" id="pastor" aria-labelledby="ph2">
 <div class="wrap pastor">
  <figure class="frame rvi" style="margin:0"><div><img src="/images/pastor-johnson.jpg" alt="Rev. Sebrone O. Johnson, Senior Pastor, smiling in a navy blazer" width="1424" height="2048" loading="lazy"></div></figure>
  <div class="rv">
   <p class="muted" style="font-weight:700">Senior Pastor</p>
   <h2 id="ph2" class="pname" style="margin-top:10px">Rev. Sebrone O. Johnson</h2>
   <p class="lede"><span class="accent" style="font-size:1.45em">"Being in the midst of an impossible problem means that you are in the middle of a miracle."</span></p>
   <p class="lede">Our sincere hope is that when you enter you will be able to say, "I am glad to be here!" Pastor Johnson serves alongside First Lady Donna Johnson.</p>
   <div class="btns"><a class="btn btn-light" href="our-story.html#leadership">Meet our leaders</a></div>
  </div>
 </div>
</section>

<section class="band b-ink" id="legacy" aria-labelledby="lh">
 <div class="wrap split" style="align-items:end">
  <p class="legacy-year rv" aria-hidden="true">6:9</p>
  <div class="rv" data-i="1">
   <h2 id="lh"><span class="accent" style="font-size:.72em">"Let us not grow weary in doing what is right, for we will reap at harvest time, if we do not give up."</span></h2>
   <p class="lede">Galatians 6:9, the verse that closes Pastor Johnson's welcome. It is the heart of our name.</p>
   <div class="btns"><a class="btn btn-light" href="our-story.html">Read Our Story</a></div>
  </div>
 </div>
</section>

<section class="band b-hull" id="events" aria-labelledby="eh">
 <div class="wrap">
  <h2 id="eh" class="rv">Coming up at Greater Harvest</h2>
  <ul class="ev evx">{event_cards()}<li class="rv evp"><div class="dt"><span class="n">7</span><span class="m">Days<br>A week</span></div><div><h3 style="margin-top:0">Every week</h3><ul class="wk">{weekly}</ul></div><a class="btn btn-light ecta" href="{EVENTS_URL}">Full Calendar</a></li></ul>
 </div>
</section>

<section class="band b-brand" id="give" aria-labelledby="gh">
 <div class="wrap give-in">
  <div class="rv"><h2 id="gh">Give in faith</h2><p class="lede">Your generosity keeps the doors open on Driving Park and the harvest growing in Rochester.</p></div>
  <div class="btns rv" data-i="1" style="margin-top:0"><a class="btn btn-light" href="{GIVE}">Give Online</a><a class="btn btn-ghost" href="care.html#prayer">Prayer Request</a></div>
 </div>
</section>
"""
page("index.html", "Church in Rochester, NY | Greater Harvest Church",
     "Greater Harvest Church at 121 Driving Park Ave, Rochester, NY. Sunday School 9:30 AM, Morning Worship 10:30 AM, Bible Study Thursdays 7 PM. Saving the lost, maturing the saved.",
     "index.html", home)

# ------------------------------------------------------------------ VISIT
visit = phero("/images/church-exterior.jpg", "The red brick Greater Harvest Church building on Driving Park Avenue under a blue sky", "Your first Sunday at Greater Harvest",
              "Come as you are. You will be greeted at the door, offered coffee, and welcomed back every time.", "58% 50%") + f"""
<section class="band b-white" aria-labelledby="t1">
 <div class="wrap poster">
  <div class="rv"><h2 id="t1">Service times</h2>
   {CLOCK}
   <p style="margin-top:18px;color:#3d3337;font-size:1.125rem">Sunday School at 9:30 AM, Morning Worship at 10:30 AM. Bible Study meets Thursdays at 7:00 PM in the Lecture Hall.</p>
  </div>
  <ul class="vlist rv" data-i="1">
   <li><span class="tile">{ic("pin")}</span><div><strong><a class="ulink" href="{MAPS}">{ADDR}</a></strong><p>The red brick church on Driving Park. Tap the address for directions.</p></div></li>
   <li><span class="tile">{ic("car")}</span><div><strong>Parking</strong><p>Parking details are coming soon. Call the church at <a class="ulink" href="{TEL}">{PHONE}</a> with questions.</p></div></li>
   <li><span class="tile">{ic("cup")}</span><div><strong>Coffee at 9:00 AM</strong><p>The Check-In Corner in the Banquet Hall, lower level: light breakfast, hot coffee and fellowship before Sunday School.</p></div></li>
  </ul>
 </div>
</section>

<section class="band b-hull" id="kids" aria-labelledby="t4">
 <div class="wrap split">
  <div class="rv"><span class="tile">{ic("kids")}</span><h2 id="t4" style="margin-top:20px">For your kids and teens</h2>
   <p class="lede">Children's Church meets during the 10:30 worship service. Our young people step up and are heard through junior greeters, the youth choir, spoken word and devotion.</p>
   <div class="btns"><a class="btn btn-light" href="connect.html?m=Youth+Ministry#join">Youth Ministry</a></div></div>
  <figure class="frame rv" data-i="1" style="margin:0"><div class="feat"><img src="/images/youth-ministry.jpg" alt="Children and teens of the GHC Youth Ministry dressed up and smiling together with a youth leader" width="1080" height="1080" loading="lazy" style="object-position:50% 56%;transform:scale(1.08)"></div></figure>
 </div>
</section>

<section class="band b-ink" aria-labelledby="t2">
 <div class="wrap two">
  <div class="rv"><h2 id="t2">First-time questions</h2><p class="lede">Straight answers before you walk in.</p></div>
  <div class="faq rv" data-i="1">
   <details><summary>How long is worship?</summary><p>The church calendar lists Sunday worship from 10:30 AM to 12:00 PM. Sunday School runs from 9:30 to 10:10 AM.</p></details>
   <details><summary>What should I wear?</summary><p>Come as you are. If you have a question before you visit, call the church at {PHONE}.</p></details>
   <details><summary>Where do my kids go?</summary><p>Children's Church meets during the 10:30 AM worship service.</p></details>
   <details><summary>Can I watch online first?</summary><p>Yes. Sunday worship streams live every Sunday morning. Visit the Watch page or our Facebook page.</p></details>
   <details><summary>Are some Sundays special?</summary><p>Yes. The church calendar marks Communion Sunday, Youth Sunday and other special services. See what is coming up on the home page.</p></details>
   <details><summary>Is there anything during the week?</summary><p>Bible Study on Thursdays at 7:00 PM, Noon Prayer on Wednesdays, and ministries like Genesis on Mondays at 6:00 PM and Sisters in Spirit on Thursdays at 6:00 PM.</p></details>
   <details><summary>How do I become a member?</summary><p>Greater Harvest offers a New Member's Class through Christian Education. Let us know on the form below and we will share the next dates.</p></details>
  </div>
 </div>
</section>

<section class="band b-deep" id="plan" aria-labelledby="t3">
 <div class="wrap two">
  <div class="rv"><h2 id="t3">Plan your visit</h2><p class="lede">Tell us when you are coming and we will have someone ready to welcome you and help your kids get settled.</p></div>
  <div class="card rv" data-i="1">{form("Plan a Visit", [
      ("text","first_name","First name","req","half","ac:given-name"),("text","last_name","Last name","half","ac:family-name"),
      ("email","email","Email","req","half","ac:email"),("tel","phone","Phone","half","ac:tel"),
      ("date","visit_date","Sunday you plan to visit","req","half"),("select","service","I plan to attend",["Sunday School, 9:30 AM","Morning Worship, 10:30 AM","Both"],"half"),
      ("number","adults","Adults","half"),("number","children","Children","half"),
      ("text","children_ages","Children's ages"),("chk","new_member","I'd like information about the New Member's Class"),("textarea","questions","Anything we should know?")], "Plan My Visit")}</div>
 </div>
</section>
"""
page("visit.html", "Plan Your Visit, Rochester NY Church | Greater Harvest",
     "Plan your first Sunday at Greater Harvest Church, 121 Driving Park Ave, Rochester, NY. Coffee at 9:00, Sunday School 9:30, worship and Children's Church 10:30.",
     "visit.html", visit)

# ------------------------------------------------------------------ WATCH
watch = phero("/images/pastor-preaching.jpg", "Pastor Sebrone O. Johnson in a red robe, smiling as he preaches from the Greater Harvest pulpit", "Watch",
              "Worship live every Sunday at 10:30 AM, wherever you are.", "50% 22%") + f"""
<section class="band b-ink" aria-labelledby="w1">
 <div class="wrap">
  <h2 id="w1" class="rv" data-next-label>Next livestream</h2>
  <div class="frame rv" style="margin-top:28px"><div class="vid" id="player">
   <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:20px;padding:20px;text-align:center;background:radial-gradient(80% 80% at 50% 30%,#24151a,#0d0a0b)">
    <p data-big-cd style="font-family:var(--font-heading);font-weight:700;font-size:clamp(2.6rem,9vw,7rem);line-height:1;font-variant-numeric:tabular-nums">Sunday 10:30 AM</p>
    <div class="btns" style="margin:0;justify-content:center">
     <button class="btn btn-light" type="button" data-play="https://www.youtube-nocookie.com/embed/{LIVE_ID}?autoplay=1&rel=0" data-title="Greater Harvest Live Stream">Open Live Player</button>
     <a class="btn btn-ghost" href="{FB}">Watch on Facebook</a>
    </div>
   </div>
  </div></div>
  <p class="muted" style="margin-top:16px">Live worship is brought to you each Sunday by the GHC Media Team. Also on <a class="ulink" href="{FB}">Facebook</a> and <a class="ulink" href="{YTW}">YouTube</a>.</p>
 </div>
</section>

<section class="band b-hull" aria-labelledby="w2">
 <div class="wrap split">
  <div class="rv"><h2 id="w2">Thursday Bible Study</h2><p class="lede">Bible/Life Study meets Thursdays at 7:00 PM in the GHC Lecture Hall, led by Christian Education. Bring a Bible and a friend.</p><div class="btns"><a class="btn btn-light" href="visit.html#plan">Plan Your Visit</a></div></div>
  <div class="rv" data-i="1"><p class="legacy-year" aria-hidden="true" style="font-size:clamp(5rem,18vw,13rem)">7 PM</p></div>
 </div>
</section>

<section class="band b-deep" aria-labelledby="w3">
 <div class="wrap">
  <ul class="rows" style="margin-top:0">
   <li class="rv"><span class="tile">{ic("phone")}</span><h3 id="w3">Dial in</h3><p>Join by phone at {DIAL}, access code {DIAL_CODE}.</p><a class="ulink" href="{DIAL_TEL}">Call the line</a></li>
   <li class="rv" data-i="1"><span class="tile">{ic("music")}</span><h3>Music</h3><p>Keyboard, organ, drums and voices, with adult and youth choirs leading us in worship.</p><a class="ulink" href="connect.html?m=Music+Ministry#join">Join the choir</a></li>
   <li class="rv" data-i="2"><span class="tile">{ic("play")}</span><h3>Media Team</h3><p>Help bring Sunday worship to our online members and friends.</p><a class="ulink" href="connect.html?m=Media+Team#join">Serve on Media</a></li>
  </ul>
 </div>
</section>
"""
page("watch.html", "Watch Church Online, Rochester NY | Greater Harvest Live",
     "Worship live with Greater Harvest Church every Sunday at 10:30 AM. Watch the livestream, join Thursday Bible Study at 7 PM, or dial in by phone.",
     "watch.html", watch)

# ------------------------------------------------------------------ CONNECT
ages = ["Children", "Youth", "Young Adults", "Adults", "Seniors"]
ints = ["Hospitality", "Worship and Music", "Outreach", "Care", "Learning", "Fellowship", "Wellness", "Media", "Justice", "Serving"]
chips = lambda key, opts: f'<div class="chips" data-f="{key}">' + "".join(
    f'<button type="button" aria-pressed="{"true" if o=="All" else "false"}">{o}</button>' for o in ["All"] + opts) + "</div>"
cards = "".join(
    f'<li data-age="{a}" data-int="{t}"><h3>{n}</h3><p>{s}</p>' +
    (f'<p class="lead"><strong>Leader:</strong> {l}</p>' if l else "") +
    (f'<p class="lead"><strong>When:</strong> {w}</p>' if w else "") +
    f'<p class="who">For {a.replace("|", ", ")}</p><a class="ulink" href="#join" data-join="{n}">Join {n}</a></li>'
    for n, s, a, t, l, w in MINISTRIES)
connect = phero("/images/pastor-celebration.jpg", "Pastor Sebrone O. Johnson smiling and holding hands with a woman at a Greater Harvest gathering", "There is a place for your gift",
                "Filter by who it is for and what you love, then join a team.", "50% 18%") + f"""
<section class="band b-ink" aria-labelledby="c1">
 <div class="wrap">
  <h2 id="c1" class="rv">Ministries</h2>
  <div class="two" style="margin-top:28px;gap:24px">
   <fieldset class="fs"><legend>Who it's for</legend>{chips("age", ages)}</fieldset>
   <fieldset class="fs"><legend>Interest</legend>{chips("int", ints)}</fieldset>
  </div>
  <p class="muted" data-count aria-live="polite" style="margin-top:24px">Showing {len(MINISTRIES)} ministries</p>
  <ul class="mins">{cards}</ul>
  <p class="muted" style="margin-top:24px">Not sure where you fit? Choose "Not sure yet" below, or call the church at <a class="ulink" href="{TEL}">{PHONE}</a>.</p>
 </div>
</section>
<section class="band b-deep" id="join" aria-labelledby="c2">
 <div class="wrap two">
  <div class="rv"><h2 id="c2">Count me in</h2><p class="lede">Leave your info and the ministry leader will reach out with next steps.</p></div>
  <div class="card rv" data-i="1">{form("Ministry Sign-Up", [
      ("select","ministry","Ministry",[m[0] for m in MINISTRIES]+["Not sure yet"],"req"),
      ("text","name","Full name","req","ac:name"),("email","email","Email","req","half","ac:email"),("tel","phone","Phone","half","ac:tel"),
      ("chk","member","I am a member of Greater Harvest"),("textarea","note","Anything you'd like the team to know?")], "Join the Team")}</div>
 </div>
</section>
"""
page("connect.html", "Church Ministries in Rochester, NY | Greater Harvest",
     "Find your place at Greater Harvest Church: Youth, Music, Greeters, Genesis, Sister in Spirit, Watchmen, Social Justice and more. Filter by age and interest.",
     "connect.html", connect)

# ------------------------------------------------------------------ STORY
bl_items = "".join(f'<li data-y="{b["n"]}" data-t="{b["t"]}"><span class="yr">{b["n"]}</span><h3>{b["t"]}</h3><p>{b["b"]}</p></li>' for b in BELIEFS)
crew = "".join(f'<li class="rv" data-i="{i%6}"><strong>{n}</strong><span>{r}</span></li>' for i, (n, r) in enumerate(LEADERS))
story = phero("/images/pastor-backdrop.jpg", "Pastor Sebrone O. Johnson and a woman in front of a Greater Harvest Church logo backdrop", "God loves everybody",
              "A beacon of hope to all people, whether in the mainstream or on the margins.", "50% 20%") + f"""
<section class="band b-ink" id="who" aria-labelledby="s1">
 <div class="wrap two">
  <div class="rv"><h2 id="s1">From the mountain and the plains</h2></div>
  <div class="rv" data-i="1">
   <p class="lede" style="margin-top:0">Jesus proclaimed a universal message to those of mammoth means as well as to those who were distraught and destitute. He trumpeted truth both from the mountain and the plains.</p>
   <p class="lede">Likewise, this church stands as a beacon of hope to all people, with one central message: God loves everybody.</p>
   <p class="lede">At Greater Harvest, we pursue excellence in service, consecration in worship and fortitude in faith. As a body of believers we support the edification of our minds through teaching, and charitable deeds through Christian service.</p>
  </div>
 </div>
</section>

<section class="band b-deep" id="vision" aria-labelledby="s4">
 <div class="wrap">
  <h2 id="s4" class="ship rv">Saving the lost. <b>Maturing the saved.</b></h2>
  <p class="lede rv">The vision of Greater Harvest Church remains steadfast on leading God's people to a place of wholeness in Jesus Christ, through the training of the mind, body and spirit. As a body in Christ we shall persevere through every obstacle to touch and transform communities by the power of God's Holy Spirit, and we hold quality education as more than a lofty goal.</p>
 </div>
</section>

<section class="band b-white" id="verse" aria-labelledby="s3">
 <div class="wrap two" style="align-items:center">
  <div class="rv"><img src="/images/logo-mark.jpg" alt="The Greater Harvest Church mark: a crimson cross rising from a golden field inside a wreath of wheat" width="750" height="670" loading="lazy" style="width:min(340px,75%);height:auto;aspect-ratio:750/556;object-fit:cover;object-position:50% 100%;border-radius:16px"></div>
  <div class="rv" data-i="1"><h2 id="s3">We will reap at harvest time</h2>
   <p class="lede" style="color:#3d3337">"Let us not grow weary in doing what is right, for we will reap at harvest time, if we do not give up." Galatians 6:9, NRSV.</p>
   <ul class="vlist" style="margin-top:28px">
    <li><span class="tile">{ic("cross")}</span><div><strong>Love God</strong><p>Consecration in worship.</p></div></li>
    <li><span class="tile">{ic("hands")}</span><div><strong>Love people</strong><p>Excellence in service.</p></div></li>
    <li><span class="tile">{ic("wheat")}</span><div><strong>Impact the world</strong><p>Fortitude in faith.</p></div></li>
   </ul>
  </div>
 </div>
</section>

<section class="band b-hull" id="beliefs" aria-labelledby="s7">
 <div class="wrap">
  <h2 id="s7" class="rv">What we believe</h2>
  <p class="lede rv">Our eighteen articles of faith, in full.</p>
  <div class="tl">
   <div class="tl-year" aria-hidden="true"><p class="y">I</p><p class="g">The Scriptures</p></div>
   <ol>{bl_items}</ol>
  </div>
 </div>
</section>

<section class="band b-ink" id="leadership" aria-labelledby="s5">
 <div class="wrap">
  <div class="pastor">
   <figure class="frame rvi" style="margin:0"><div><img src="/images/pastor-johnson.jpg" alt="Rev. Sebrone O. Johnson, Senior Pastor" width="1424" height="2048" loading="lazy"></div></figure>
   <div class="rv"><p class="muted" style="font-weight:700">Senior Pastor</p><h2 id="s5" class="pname" style="margin-top:10px">Rev. Sebrone O'Neil Johnson</h2>
    <p class="lede">CEO of EDceptional of Rochester. A graduate of Union College and St. John Fisher College in Applied Mathematics and Economics, with a Master of Divinity from Colgate Rochester Crozer Divinity School and the executive ELP from Duke University.</p>
    <p class="lede">He is ecumenical chairperson of the Rochester Black Leadership Commission on AIDS, sits on the boards of E3 Rochester and Vertus Charter School, and is a proud family man to his wife, <strong>First Lady Donna Johnson</strong>, and their sons Bryan and Darius. But most of all, he is a servant to the Glory of God.</p></div>
  </div>
  <h3 class="rv" style="margin-top:72px;font-size:clamp(2rem,4vw,3rem)">Serving alongside him</h3>
  <ul class="crew">{crew}</ul>
 </div>
</section>
"""
page("our-story.html", "Our Story and Beliefs, Rochester NY | Greater Harvest",
     "Meet Greater Harvest Church in Rochester, NY: our vision, our eighteen articles of faith, Senior Pastor Rev. Sebrone O. Johnson and the leaders who serve with him.",
     "our-story.html", story)

# ------------------------------------------------------------------ GIVE
give = f"""
<section class="phero" aria-labelledby="ph" style="min-height:56svh;background:radial-gradient(90% 80% at 85% 0%,rgba(155,28,44,.55),transparent 60%),var(--ink)">
 <div class="wrap"><span data-sentinel></span><h1 id="ph" class="rise">Give in faith</h1><p class="lede rise d1">We will reap at harvest time, if we do not give up. Thank you for sowing into the work at Greater Harvest.</p></div>
</section>
<section class="band b-brand" aria-labelledby="g1">
 <div class="wrap give-in">
  <div class="rv"><h2 id="g1">Give online</h2><p class="lede">Tithes and offerings, by card or bank, through the church's secure Givelify page.</p></div>
  <div class="rv" data-i="1"><a class="btn btn-light" style="min-height:60px;font-size:1.2rem;padding:0 36px" href="{GIVE}">Give Online</a></div>
 </div>
</section>
<section class="band b-ink" aria-labelledby="g2">
 <div class="wrap">
  <h2 id="g2" class="rv">Other ways to give</h2>
  <ul class="ways">
   <li class="rv"><h3>Givelify link</h3><p class="v" style="font-size:1.6rem">givelify.com</p><p style="margin-top:10px">Save or share the church's giving link.</p><div class="btns" style="margin-top:16px"><button class="btn btn-ghost" type="button" data-copy="{GIVE}" style="min-height:46px">{ic("copy")}<span>Copy link</span></button></div></li>
   <li class="rv" data-i="1"><h3>Questions about giving</h3><p class="v"><a href="{TEL}">{PHONE}</a></p><p style="margin-top:10px">Or email <a class="ulink" href="mailto:{EMAIL}">{EMAIL}</a>.</p></li>
   <li class="rv" data-i="2"><h3>Our address</h3><p style="margin-top:10px">Greater Harvest Church<br>{ADDR}</p><div class="btns" style="margin-top:16px"><button class="btn btn-ghost" type="button" data-copy="Greater Harvest Church, {ADDR}" style="min-height:46px">{ic("copy")}<span>Copy</span></button></div></li>
  </ul>
 </div>
</section>
"""
page("give.html", "Give to a Rochester, NY Church | Greater Harvest Giving",
     "Give to Greater Harvest Church in Rochester, NY securely online through Givelify. Tithes and offerings by card or bank. Questions? Call (585) 496-4647.",
     "give.html", give)

# ------------------------------------------------------------------ CARE
crisis = [("Emergency", "If you or someone else is in immediate danger.", "tel:911", "Call 911"),
          ("988 Suicide and Crisis Lifeline", "Free, confidential support, 24 hours a day.", "tel:988", "Call or text 988"),
          ("National Domestic Violence Hotline", "Support, safety planning and referrals, 24/7.", "tel:+18007997233", "1-800-799-7233"),
          ("NYS Domestic and Sexual Violence Hotline", "New York State's free, confidential hotline, 24/7.", "tel:+18009426906", "1-800-942-6906"),
          ("211", "Local help with food, housing, utilities and more.", "tel:211", "Dial 211")]
care = f"""
<section class="phero" aria-labelledby="ph" style="min-height:56svh;background:radial-gradient(90% 80% at 85% 0%,rgba(155,28,44,.5),transparent 60%),var(--ink)">
 <div class="wrap"><span data-sentinel></span><h1 id="ph" class="rise">You don't have to carry it alone</h1><p class="lede rise d1">Hope, healing and restoration. Prayer, pastoral care and help for life's hardest seasons.</p></div>
</section>
<section class="band b-hull" aria-labelledby="k0" style="padding:56px 0">
 <div class="wrap"><h2 id="k0" style="font-size:clamp(2rem,5vw,3rem)">In crisis right now?</h2>
  <ul class="crisis">{"".join(f'<li><strong>{n}</strong><p class="muted" style="margin-top:6px">{d}</p><a class="ulink" href="{h}">{a}</a></li>' for n,d,h,a in crisis)}</ul>
 </div>
</section>
<section class="band b-ink" id="prayer" aria-labelledby="k1">
 <div class="wrap two">
  <div class="rv"><span class="tile">{ic("heart")}</span><h2 id="k1" style="margin-top:20px">Request prayer</h2><p class="lede">Share what's on your heart. Prayer requests go to Rev. Johnson and the Ministerial Staff.</p><p class="lede">You can also email <a class="ulink" href="mailto:{EMAIL}">{EMAIL}</a>, or join Noon Prayer on Wednesdays.</p></div>
  <div class="card rv" data-i="1">{form("Prayer Request", [
      ("text","first_name","First name","req","half","ac:given-name"),("email","email","Email, for follow-up","half","ac:email"),
      ("textarea","request","Your prayer request","req"),("chk","contact_me","I'd like a pastor to contact me"),("chk","private","Keep this private to the pastoral staff")], "Send Prayer Request")}</div>
 </div>
</section>
<section class="band b-deep" id="visit-care" aria-labelledby="k2">
 <div class="wrap two">
  <div class="rv"><span class="tile">{ic("hands")}</span><h2 id="k2" style="margin-top:20px">A visit, a call, a new beginning</h2><p class="lede">Our deacons assist the Pastor in visitation and counseling and keep a watchful eye over the sick and the afflicted. The Missionary Ministry visits the sick.</p><p class="lede">Facing a hard season? Genesis Ministry meets Mondays at 6:00 PM, with resources for food, clothing, housing, rent, mental health counseling and insurance.</p><div class="btns"><a class="btn btn-light" href="connect.html?m=Genesis+Ministry#join">Connect with Genesis</a></div></div>
  <div class="card rv" data-i="1">{form("Pastoral Care", [
      ("text","name","Your name","req","half","ac:name"),("tel","phone","Best phone number","req","half","ac:tel"),
      ("select","need","How can we help?",["A phone call","A visit at home or in the hospital","Grief and loss","Something else"]),("textarea","note","Tell us a little more")], "Request Care")}</div>
 </div>
</section>
"""
page("care.html", "Prayer and Pastoral Care in Rochester, NY | Greater Harvest",
     "Send a prayer request to Rev. Johnson and the Ministerial Staff, request a pastoral visit, find crisis lines, or join Genesis Ministry at Greater Harvest Church.",
     "care.html", care)

# ------------------------------------------------------------------ CONTACT
contact = f"""
<section class="phero" aria-labelledby="ph" style="min-height:48svh;background:radial-gradient(90% 80% at 85% 0%,rgba(155,28,44,.5),transparent 60%),var(--ink)">
 <div class="wrap"><span data-sentinel></span><h1 id="ph" class="rise">Get in touch</h1><p class="lede rise d1">Let us know you're here. We would love to hear from you.</p></div>
</section>
<section class="band b-ink" aria-labelledby="ct">
 <div class="wrap two">
  <div class="rv">
   <ul class="vlist">
    <li><span class="tile">{ic("pin")}</span><div><strong>Visit</strong><p><a class="ulink" href="{MAPS}">{ADDR}</a></p></div></li>
    <li><span class="tile">{ic("phone")}</span><div><strong>Call</strong><p><a class="ulink" href="{TEL}">{PHONE}</a></p></div></li>
    <li><span class="tile">{ic("mail")}</span><div><strong>Email</strong><p><a class="ulink" href="mailto:{EMAIL}">{EMAIL}</a></p></div></li>
    <li><span class="tile">{ic("clock")}</span><div><strong>Service hours</strong><p>Sunday School 9:30 AM, Morning Worship 10:30 AM, Bible Study Thursday 7:00 PM.</p></div></li>
   </ul>
   <div class="map" style="margin-top:28px"><iframe title="Map to Greater Harvest Church" loading="lazy" src="https://www.google.com/maps?q=121+Driving+Park+Ave,+Rochester,+NY+14613&output=embed"></iframe></div>
  </div>
  <div class="card rv" data-i="1"><h2 id="ct" style="font-size:clamp(2.2rem,5vw,3.4rem);margin-bottom:24px">Send a message</h2>{form("Contact", [
      ("text","name","Name","req","half","ac:name"),("email","email","Email","req","half","ac:email"),("tel","phone","Phone","half","ac:tel"),
      ("select","topic","I would like to",["Ask a question","Be water baptized","Join the church","Join a ministry","Share a prayer request","Something else"],"half"),
      ("textarea","message","Message","req")], "Send Message")}</div>
 </div>
</section>
"""
page("contact.html", "Contact a Church in Rochester, NY | Greater Harvest Church",
     "Contact Greater Harvest Church at 121 Driving Park Ave, Rochester, NY 14613. Call (585) 496-4647 or email info@gharvestchurch.com.",
     "contact.html", contact)
print("pages:", sorted(p.name for p in OUT.iterdir()))
