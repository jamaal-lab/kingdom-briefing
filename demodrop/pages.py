# Page bodies. Executed inside gen.py (shares its helpers).

TIMELINE = [
    (1950, "Born in a funeral home", "September 10, 1950: Mount Carmel Missionary Baptist Church is born inside Winfred Harris Funeral Home at 49th and State. Founding members: Joseph Evans, Pharis Evans, Lou Della Evans-Reid, Robert Bond and Arthur Spraggins."),
    (1952, "Renamed Fellowship. On the radio", "February 14, 1952, the name becomes Fellowship Missionary Baptist Church. In October the first service airs on WWCA in Gary, Indiana, premiering \"What A Fellowship.\""),
    (1954, "A garage becomes a sanctuary", "Rev. Evans ordains Rev. Consuella York. Fellowship buys an old garage at 4621 S. State Street for $25,000, with no heat and a leaky roof, and transforms it."),
    (1959, "45th and Princeton", "November 15, 1959: the church buys the site at 45th Place and Princeton Avenue for $110,000."),
    (1965, "First LP. Jesse Jackson Sr. ordained", "The Fellowship Choir records its first LP. Rev. Evans ordains Rev. Jesse Jackson Sr., who later co-signs the mortgage for the current building."),
    (1973, "A building politics could not stop", "April 8, 1973: the new $500,000 church opens. Its steel frame had stood bare for seven years because construction was halted by downtown politics."),
    (1977, "On television. A credit union", "The What a Fellowship Hour airs on TV Channel 38, the choir tours U.S. cities, and Fellowship Credit Union is established."),
    (2000, "Rev. Dr. Clay Evans retires", "After grooming Rev. Charles Jenkins as his successor since 1998, Dr. Evans retires on December 8, 2000."),
    (2001, "Pastor Charles Jenkins", "January 14 to 21, 2001: the inauguration of Pastor Charles Jenkins."),
    (2003, "Fellowship Manor", "Groundbreaking for Fellowship Manor, a senior citizens building at 5041 S. Princeton."),
    (2007, "Live, worldwide", "Fellowship begins streaming services online."),
    (2009, "Fellowship Bible Academy", "Christian education courses begin in the fall of 2009."),
    (2013, "Five Stellar Awards", "Pastor Jenkins and Fellowship Chicago win five Stellar Awards for The Best of Both Worlds, including Song of the Year for \"Awesome.\""),
    (2018, "Sanctuary remodeled", "The main sanctuary at 45th and Princeton is renewed."),
    (2019, "Rev. Reginald W. Sharpe Jr.", "Named Associate Pastor, then Pastor, as Pastor Jenkins becomes Pastor Emeritus. #FollowingGod"),
    (2026, "Built to Last: 76 years", "Fellowship celebrates its 76th anniversary. Rooted in purpose, growing in focus."),
]
TL_PHOTOS = {1977: "/images/timeline-2.jpg", 2000: "/images/timeline-4.jpg"}
# (name, role, photo or None, email, phone). Photos matched by card structure on /our-leadership/.
LEADERS = [
    ("Brianna Sharpe", "First Lady", None, "", ""),
    ("Frazlier L. Pope III", "Executive Pastor", "/images/staff-frazlier-pope.jpg", "FPope@fellowshipchicago.com", "773-373-8535"),
    ("Kesha Brown", "Chief Financial Officer", "/images/staff-kesha-brown.jpg", "LBrown@fellowshipchicago.com", "773-451-3805"),
    ("Wendy Irby", "Director of Membership Services and Assimilation", "/images/staff-wendy-irby.jpg", "WIrby@fellowshipchicago.com", "773-373-8530"),
    ("Kevin Vasser", "Pastor of Worship and Arts", "/images/staff-kevin-vasser.jpg", "KVasser@fellowshipchicago.com", ""),
    ("Jillian Twiggs", "Youth Pastor", "/images/staff-jillian-twiggs.jpg", "JTwiggs@fellowshipchicago.com", ""),
    ("Debra Earl", "Executive Assistant to the Pastor", "/images/staff-debra-earl.jpg", "DEarl@fellowshipchicago.com", "773-373-8555"),
    ("Rafael Evans", "Office Coordinator", "/images/staff-rafael-evans.jpg", "REvans@fellowshipchicago.com", ""),
    ("Roxanne Montgomery", "Accounts Payable Manager", "/images/staff-roxanne-montgomery.jpg", "RMontgomery@fellowshipchicago.com", ""),
    ("Damien Martin", "Director of Ministry Operations", "/images/staff-damien-martin.jpg", "DMartin@fellowshipchicago.com", "773-451-3801"),
    ("Ashley Cheeks", "Digital Communications Strategist", "/images/staff-ashley-cheeks.jpg", "ACheeks@fellowshipchicago.com", "773-451-3816"),
]
MISSION = [("T", "Teaching"), ("H", "Hospitality"), ("E", "Engagement"), ("S", "Service"),
           ("H", "Holistic Ministry"), ("I", "Innovation"), ("P", "Praise and Worship")]
A = "Young Adults|Adults|Seniors"
MINISTRIES = [
    ("Kidz Zone Children's Ministry", "A setting for children from age 3 to worship, learn and grow as followers of Christ. Children must be potty-trained.", "Children", "Discipleship", "KidzZone@fellowshipchicago.com", "Sundays, 10:45 AM"),
    ("Wave Youth Ministry", "Reaching middle and high school students, ages 12 to 18, to live out their Christian faith.", "Youth", "Discipleship|Fellowship", "Jillian Twiggs, Youth Pastor", ""),
    ("Youth Student Ministries", "Middle and high school students, ages 12 to 18, growing in faith. Youth Recharge is their worship experience.", "Youth", "Discipleship|Fellowship", "StudentMinistry@fellowshipchicago.com", ""),
    ("Girl Scouts", "Ages 5 to 18. Building girls of courage, confidence and character. September through June.", "Children|Youth", "Fellowship|Service and Outreach", "", "2nd and 4th Saturdays"),
    ("The Crew Young Adult Ministry", "Edifying, empowering, encouraging and engaging adults 21 to 39 through events and experiences.", "Young Adults", "Fellowship|Discipleship", "", ""),
    ("Kings and Priest Men's Ministry", "Building kingdom men of purpose, promise and power through teaching, fellowship and accountability.", A, "Discipleship|Fellowship", "", ""),
    ("Sisters With Vision Women's Ministry", "Empowering women to walk in their royal status through teaching, fellowship and accountability.", A, "Discipleship|Fellowship", "", ""),
    ("Soulmates Marriage Ministry", "Giving couples tools and examples for marriages that thrive.", A, "Fellowship|Care", "", ""),
    ("Senior Care Ministry", "Resources and fellowship for Fellowship's seniors, in and outside the church.", "Seniors", "Care|Fellowship", "", ""),
    ("Fellowship Bible Academy", "Fellowship's Christian education courses, offered in terms each year.", A, "Discipleship", "", "Fall, spring and summer terms"),
    ("Intercessory Prayer Team", "Standing in the gap in prayer for members, the church and our leaders.", A, "Care|Discipleship", "", ""),
    ("Music Ministry", "Band, Praise Team, Sanctuary Choir, Men's Choir, Voices of Genesis Young Adult Choir and Women's Choir.", "Youth|" + A, "Worship and Arts", "Kevin Vasser, Pastor of Worship and Arts", ""),
    ("Movements of Praise Dance Ministry", "Worship through dance, creating an atmosphere of praise (Romans 12:1).", "Youth|" + A, "Worship and Arts", "", ""),
    ("Media Ministry", "All of Fellowship's telecommunication: radio, television and internet.", "Youth|" + A, "Media and Tech", "", ""),
    ("Media Sales", "The team responsible for product sales.", A, "Media and Tech", "", ""),
    ("Ambassadors", "The welcoming arm of the church body.", A, "Hospitality", "", ""),
    ("First Touch", "Our intake team that greets and welcomes new members.", A, "Hospitality", "", ""),
    ("Peacekeepers Security Ministry", "Securing the building during worship services and events.", A, "Hospitality|Service and Outreach", "", ""),
    ("Culinary Ministry", "Excellence in food service for programs, and care of the church kitchen.", A, "Hospitality|Service and Outreach", "", ""),
    ("V.I.B.E.", "Volunteer to Impact, Build and Empower: turning good intentions into great actions.", "Youth|" + A, "Service and Outreach", "", ""),
    ("Community Table", "Hot food for our community every Thursday.", "All Ages", "Service and Outreach|Hospitality", "", "Thursdays, 12 to 2 PM"),
    ("Freely Give", "Fellowship's food and clothing giveaway.", "All Ages", "Service and Outreach", "", "Wednesdays 7 to 10 AM, 4th Saturdays 8 to 11 AM"),
    ("Social Justice Ministry", "Meaningful change through advocacy, equity and systemic justice, grounded in the teachings of Christ.", A, "Justice|Service and Outreach", "", ""),
    ("Violence Support Ministry", "Support for families who have lost loved ones to violent crime.", A, "Care|Justice", "", ""),
    ("Congregational Care Ministry", "Regular visits, prayer and support for sick and immobile members.", A, "Care", "", ""),
    ("Bereavement Ministry", "Helping families arrange funerals at Fellowship and honoring members who have passed.", A, "Care", "", ""),
    ("Medical Ministry", "Health education and care from licensed team members, for members and community.", A, "Care|Service and Outreach", "", ""),
    ("Recovery Ministry", "Breaking the chains of addiction through faith and salvation.", A, "Care", "", ""),
    ("Membership and Assimilation", "Joining Fellowship and finding your place on board.", A, "Hospitality|Fellowship", "Wendy Irby, Director of Membership Services and Assimilation", ""),
    ("Credit Union", "Fellowship's member-owned, not-for-profit financial cooperative: people helping people.", A, "Service and Outreach", "", "Saturdays, 10 AM to 12 PM"),
    ("Refuel", "The midweek worship experience, in person and online.", "All Ages", "Discipleship|Worship and Arts", "", "Tuesdays, 7:00 PM (seasonal)"),
]
# Dated events from the church's own flyers and sign-up forms. Past events hide automatically.
EVENTS = [
    ("2026-11-16", "2026-11-24", "Holiday Decorating Team", "Volunteer shifts to deck the halls at Fellowship. Sign up for one or more.", "Shifts Nov 16 to 24", "Fellowship Chicago", "https://docs.google.com/forms/d/e/1FAIpQLSctbexmdmpEQCIPJoguAZ4GjP8QwEFumAdXjFxErQ2l3Kwgwg/viewform", "Volunteer"),
    ("2026-11-21", "2026-11-21", "Men's Prayer Breakfast", "Kings and Priests Men's Ministry: prayer, fellowship and brotherhood.", "10 AM to 12 PM", "Fellowship Chicago", "https://fellowshipchicago.shelbynextchms.com/external/form/29e12ac7-75d4-416e-8995-de14401a6857", "RSVP"),
    ("2026-11-21", "2026-11-21", "Jump for Joy", "A Double Dutch class for beginners and pros. Ages 12 and up. Spots are limited.", "12 to 1:30 PM", "Fellowship Chicago", "https://fellowshipchicago.shelbynextchms.com/external/form/fdf47711-f71b-4c74-8d68-45c64d05b3d1", "Register"),
    ("2027-01-29", "2027-01-30", "2027 Worship and Arts Workshop", "The Power of the Flow: two days for worship leaders, musicians, dancers, media teams and creatives.", "Fri 7 PM, Sat 7 AM to 3 PM", "Hilton Chicago/Oak Lawn", "https://fellowshipchicago.shelbynextchms.com/external/form/d2f52bd1-4d84-47c8-a568-a838be71218d", "Register"),
]
PRAYER_CALL = "Monday to Friday at 7 AM and Saturday at 12 PM Central. Dial 425-436-6200, access code 272251#."
GRIEF_ZOOM = "https://fellowshipchicago.zoom.us/meeting/register/w9f5CCFjRvaf1g5nuOYgOQ"
REFUEL_HANDOUT = "https://www.dropbox.com/scl/fo/si4fuvj5b4z21gdeng0uv/AGQ91SCoWG5gAgo3aN-PsJA?rlkey=y4jra60wu6cr6bb7ta87bdayl&st=y3o4dmga&dl=0"
MUSIC = "https://FMBC.lnk.to/TheFlow"
CU = "https://www.fellowshipchicagocu.com/"

import datetime as _dt
def _fmt(d):
    x=_dt.date.fromisoformat(d); return x
def event_cards():
    out=[]
    for st,en,title,blurb,time,where,url,cta in EVENTS:
        a=_fmt(st); b=_fmt(en)
        mon=a.strftime("%b"); day=str(a.day) if st==en else f"{a.day}-{b.day}" if a.month==b.month else str(a.day)
        dow=a.strftime("%a") if st==en else (a.strftime("%a")+" to "+b.strftime("%a") if (b-a).days<=2 else "Multiple days")
        out.append(f'<li class="rv" data-end="{en}"><div class="dt"><span class="n">{day}</span><span class="m">{mon} {a.year}<br>{dow}</span></div><h3>{title}</h3><span class="tm">{time}</span><p class="muted">{blurb}</p><p class="where">{ic("pin")}<span>{where}</span></p><a class="btn btn-light ecta" href="{url}">{cta}</a></li>')
    return "".join(out)

# ------------------------------------------------------------------ HOME
home = f"""
<section class="hero" aria-labelledby="h1">
 <div class="hero-media">
  <img src="/images/sanctuary-pastor.jpg" alt="Pastor Reginald W. Sharpe Jr. greeting members in the sanctuary beneath the stained glass" width="2560" height="1708" loading="eager" fetchpriority="high" style="object-position:65% 30%">
  <div class="hero-vid" aria-hidden="true"></div>
 </div>
 <div class="scrim"></div>
 <div class="wrap"><span data-sentinel></span>
  <h1 id="h1" class="rise">Welcome aboard<span class="accent">The Ship.</span></h1>
  <p class="sub rise d1">A Baptist church family at 45th and Princeton in Chicago, sharing the Gospel since 1950.</p>
  <div class="btns rise d2"><a class="btn btn-light" href="visit.html#plan">Plan Your Visit</a><a class="btn btn-ghost" href="watch.html">Watch Online</a></div>
  <p class="times rise d3">Sundays 8:00, 10:45 and 1:15 <span>| Refuel Tuesdays 7 PM, seasonal</span></p>
 </div>
</section>

<section class="live" aria-label="Livestream status">
 <div class="wrap"><p data-live aria-live="polite">Next livestream: <strong>Sunday 8:00 AM</strong></p><a class="btn btn-ghost" style="min-height:46px" href="watch.html" data-live-btn>Go to Watch</a></div>
</section>

<section class="band b-white" id="visit" aria-labelledby="vh">
 <div class="wrap poster">
  <div class="rv">
   <h2 id="vh">Your Sunday, on the clock</h2>
   <p class="clock" aria-label="Sunday services at 8:00 AM, 10:45 AM and 1:15 PM"><span class="t">8:00<small>AM</small></span><span class="sep" aria-hidden="true">/</span><span class="t">10:45<small>AM</small></span><span class="sep" aria-hidden="true">/</span><span class="t">1:15<small>PM</small></span></p>
  </div>
  <ul class="vlist rv" data-i="1">
   <li><span class="tile">{ic("pin")}</span><div><strong><a class="ulink" href="{MAPS}">{ADDR}</a></strong><p>At 45th and Princeton on the South Side. Tap for directions.</p></div></li>
   <li><span class="tile">{ic("kids")}</span><div><strong>Kidz Zone and Youth, 10:45 AM</strong><p>Children and students meet during the 10:45 service.</p></div></li>
   <li><span class="tile">{ic("play")}</span><div><strong>Can't make it in?</strong><p>Every service streams live on YouTube and Facebook. #TheVirtualShip</p></div></li>
  </ul>
  <div class="rv"><a class="btn btn-dark" href="visit.html#plan">Plan Your Visit</a></div>
 </div>
</section>

<section class="band b-ink" id="message" aria-labelledby="mh">
 <div class="wrap split">
  <div class="rv">
   <h2 id="mh">Catch the latest message</h2>
   <p class="lede">Missed Sunday, or want to hear it again? The newest sermons from Pastor Reginald W. Sharpe Jr. play right here.</p>
   <div class="btns"><a class="btn btn-light" href="watch.html">Watch Now</a><a class="btn btn-ghost" href="{YT}">Past Messages</a></div>
  </div>
  <div class="frame rv" data-i="1"><div class="vid"><iframe title="Latest sermons from Fellowship Chicago" src="https://www.youtube-nocookie.com/embed/videoseries?list={UPLOADS}&rel=0" loading="lazy" allow="encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe></div></div>
 </div>
</section>

<section class="band b-hull" id="doors" aria-labelledby="dh">
 <div class="wrap">
  <h2 id="dh" class="rv">Five doors in</h2>
  <ul class="doors">
   <li class="rv"><a href="visit.html"><span><span class="t">I'm New</span><span class="d">Service times, kids, directions and what to expect.</span></span>{ic("arrow")}</a></li>
   <li class="rv" data-i="1"><a href="watch.html"><span><span class="t">Watch</span><span class="d">The livestream, recent sermons, Refuel and music.</span></span>{ic("arrow")}</a></li>
   <li class="rv" data-i="2"><a href="connect.html"><span><span class="t">Get Connected</span><span class="d">Find a ministry for your age and calling.</span></span>{ic("arrow")}</a></li>
   <li class="rv" data-i="3"><a href="our-story.html"><span><span class="t">Our Story</span><span class="d">From Clay Evans in 1950 to The Ship today.</span></span>{ic("arrow")}</a></li>
   <li class="rv" data-i="4"><a href="give.html"><span><span class="t">Give</span><span class="d">Fuel the mission through ShelbyGiving and more.</span></span>{ic("arrow")}</a></li>
  </ul>
 </div>
</section>

<section class="band b-deep" id="mission" aria-labelledby="sh">
 <div class="wrap">
  <h2 id="sh" class="ship rv"><span class="sr" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)">Our mission, T.H.E. S.H.I.P.</span><span aria-hidden="true">T.H.E. <b>S.H.I.P.</b></span></h2>
  <p class="lede rv">Our vision: <span class="accent" style="font-size:1.35em">Sharing and showing the gospel of Jesus Christ through acts of love and generosity.</span></p>
  <ol class="letters">{"".join(f'<li class="rv" data-i="{i}"><span class="L" aria-hidden="true">{l}</span><span class="W">{w}</span></li>' for i,(l,w) in enumerate(MISSION))}</ol>
 </div>
</section>

<section class="band b-ink" id="impact" aria-labelledby="ih">
 <div class="wrap">
  <h2 id="ih" class="rv">Gospel you can see</h2>
  <p class="lede rv">Love in action across our South Side community, every week.</p>
  <figure class="frame rvi feat" style="margin:40px 0 0"><div><img src="/images/on-da-block.jpg" alt="Smiling Fellowship members in Fellowship On Da Block shirts at an outdoor community event" width="2560" height="1911" loading="lazy"></div></figure>
  <ul class="rows">
   <li class="rv"><span class="tile">{ic("bread")}</span><h3>Freely Give</h3><p>Food and clothing giveaway. Wednesdays 7 to 10 AM and 4th Saturdays 8 to 11 AM.</p><a class="ulink" href="connect.html?m=Freely+Give#join">Serve with us</a></li>
   <li class="rv" data-i="1"><span class="tile">{ic("table")}</span><h3>Community Table</h3><p>Hot food for our neighbors every Thursday, 12 to 2 PM.</p><a class="ulink" href="connect.html?m=Community+Table#join">Serve with us</a></li>
   <li class="rv" data-i="2"><span class="tile">{ic("scales")}</span><h3>Social Justice</h3><p>Advocacy, equity and systemic justice, grounded in the teachings of Christ.</p><a class="ulink" href="connect.html?m=Social+Justice+Ministry#join">Serve with us</a></li>
  </ul>
 </div>
</section>

<section class="band b-hull" id="pastor" aria-labelledby="ph2">
 <div class="wrap pastor">
  <figure class="frame rvi" style="margin:0"><div><img src="/images/pastor-sharpe.jpg" alt="Pastor Reginald W. Sharpe Jr." width="1200" height="1800" loading="lazy"></div></figure>
  <div class="rv">
   <p class="muted" style="font-weight:700">Senior Pastor since 2019</p>
   <h2 id="ph2" class="pname" style="margin-top:10px">Reginald W. Sharpe Jr.</h2>
   <p class="lede">The third pastor of Fellowship, following Rev. Dr. Clay Evans and Pastor Charles Jenkins. He serves alongside First Lady Brianna Sharpe.</p>
   <div class="btns"><a class="btn btn-light" href="our-story.html#leadership">Meet our leaders</a></div>
  </div>
 </div>
</section>

<section class="band b-ink" id="legacy" aria-labelledby="lh">
 <div class="wrap split" style="align-items:end">
  <p class="legacy-year rv" aria-hidden="true">1950</p>
  <div class="rv" data-i="1">
   <h2 id="lh"><span class="accent" style="font-size:.8em">Five generations of faith.</span></h2>
   <p class="lede">Founded by Rev. Dr. Clay Evans. Home to radio and TV broadcasts, gospel recordings, five Stellar Awards and the 1965 ordination of Jesse Jackson Sr.</p>
   <div class="btns"><a class="btn btn-light" href="our-story.html">Read Our Story</a></div>
  </div>
 </div>
</section>

<section class="band b-hull" id="events" aria-labelledby="eh">
 <div class="wrap">
  <h2 id="eh" class="rv">Coming up at The Ship</h2>
  <ul class="ev evx">{event_cards()}<li class="rv evp"><div class="dt"><span class="n">7</span><span class="m">AM CT<br>Mon to Fri</span></div><h3>Faith and Wisdom Prayer Call</h3><span class="tm">Weekdays 7 AM, Saturdays 12 PM</span><p class="muted">Pray with Pastor Sharpe and the Fellowship family by phone.</p><p class="where">{ic("phone")}<span>425-436-6200, code 272251#</span></p><a class="btn btn-light ecta" href="tel:+14254366200,,272251%23">Dial In</a></li></ul>
 </div>
</section>

<section class="band b-brand" id="give" aria-labelledby="gh">
 <div class="wrap give-in">
  <div class="rv"><h2 id="gh">Fuel the mission</h2><p class="lede">Your giving keeps the doors open, the tables full and the Gospel going out from 45th and Princeton.</p></div>
  <div class="btns rv" data-i="1" style="margin-top:0"><a class="btn btn-light" href="{SHELBY}">Give Online</a><a class="btn btn-ghost" href="care.html#prayer">Prayer Request</a></div>
 </div>
</section>
"""
page("index.html", "Baptist Church in Chicago, IL | Fellowship Chicago, The Ship",
     "Fellowship Missionary Baptist Church of Chicago, founded in 1950 by Rev. Dr. Clay Evans. Sunday worship at 8:00, 10:45 and 1:15 at 4543 S Princeton Ave.",
     "index.html", home)

# ------------------------------------------------------------------ VISIT
visit = phero("/images/stock-1.jpg", "A hand raised in worship under warm stage light", "Your first Sunday aboard",
              "Whether you've been in church your whole life or never set foot in one, there is a seat for you at The Ship.") + f"""
<section class="band b-white" aria-labelledby="t1">
 <div class="wrap poster">
  <div class="rv"><h2 id="t1">Service times</h2>
   <p class="clock" aria-label="Sunday services at 8:00 AM, 10:45 AM and 1:15 PM"><span class="t">8:00<small>AM</small></span><span class="sep" aria-hidden="true">/</span><span class="t">10:45<small>AM</small></span><span class="sep" aria-hidden="true">/</span><span class="t">1:15<small>PM</small></span></p>
   <p style="margin-top:18px;color:#33405a;font-size:1.125rem">Refuel, our midweek service, meets Tuesdays at 7:00 PM in season.</p>
  </div>
  <ul class="vlist rv" data-i="1">
   <li><span class="tile">{ic("pin")}</span><div><strong><a class="ulink" href="{MAPS}">{ADDR}</a></strong><p>Tap the address for directions.</p></div></li>
   <li><span class="tile">{ic("car")}</span><div><strong>Parking</strong><p>Parking details are coming soon. Call the office at <a class="ulink" href="{TEL}">{PHONE}</a> with questions.</p></div></li>
   <li><span class="tile">{ic("kids")}</span><div><strong>Kidz Zone, Sundays 10:45 AM</strong><p>For children from age 3 (potty-trained). Students meet for Youth Recharge. Email <a class="ulink" href="mailto:KidzZone@fellowshipchicago.com">KidzZone@fellowshipchicago.com</a> or <a class="ulink" href="mailto:StudentMinistry@fellowshipchicago.com">StudentMinistry@fellowshipchicago.com</a>.</p></div></li>
  </ul>
 </div>
</section>

<section class="band b-ink" aria-labelledby="t2">
 <div class="wrap two">
  <div class="rv"><h2 id="t2">First-time questions</h2><p class="lede">Straight answers before you walk in.</p></div>
  <div class="faq rv" data-i="1">
   <details><summary>Which service should I attend?</summary><p>All three Sunday services are open to everyone. If you are bringing kids, the 10:45 AM service is when Kidz Zone and youth meet.</p></details>
   <details><summary>Can I watch online first?</summary><p>Yes. Every Sunday service streams live on YouTube and Facebook. Visit the Watch page, or search #TheVirtualShip.</p></details>
   <details><summary>Where is the church?</summary><p>4543 S Princeton Ave, Chicago, IL 60609, at 45th and Princeton.</p></details>
   <details><summary>Is there anything during the week?</summary><p>Refuel meets Tuesdays at 7 PM in season. The Faith and Wisdom Prayer Call is weekdays at 7 AM and Saturdays at noon: dial 425-436-6200, code 272251#. Fellowship Bible Academy offers courses each fall and spring.</p></details>
   <details><summary>Who can I call with questions?</summary><p>The church office at {PHONE}, Tuesday to Friday, 9 AM to 5 PM.</p></details>
  </div>
 </div>
</section>

<section class="band b-deep" id="plan" aria-labelledby="t3">
 <div class="wrap two">
  <div class="rv"><h2 id="t3">Plan your visit</h2><p class="lede">Tell us when you are coming and we will have someone ready to welcome you and help your kids get settled.</p></div>
  <div class="card rv" data-i="1">{form("Plan a Visit", [
      ("text","first_name","First name","req","half","ac:given-name"),("text","last_name","Last name","half","ac:family-name"),
      ("email","email","Email","req","half","ac:email"),("tel","phone","Phone","half","ac:tel"),
      ("date","visit_date","Sunday you plan to visit","req","half"),("select","service","Service",["8:00 AM","10:45 AM","1:15 PM"],"half"),
      ("number","adults","Adults","half"),("number","children","Children","half"),
      ("text","children_ages","Children's ages"),("textarea","questions","Anything we should know?")], "Plan My Visit")}</div>
 </div>
</section>
"""
page("visit.html", "Plan Your Visit in Chicago, IL | Fellowship Chicago",
     "Plan your first visit to Fellowship Chicago at 4543 S Princeton Ave. Sunday worship at 8:00, 10:45 and 1:15, with Kidz Zone and youth at 10:45.",
     "visit.html", visit)

# ------------------------------------------------------------------ WATCH
watch = phero("/images/worship-team.jpg", "Three Fellowship worship team vocalists singing on stage", "Watch",
              "Worship live every Sunday at 8:00, 10:45 and 1:15, or catch a recent message on demand.") + f"""
<section class="band b-ink" aria-labelledby="w1">
 <div class="wrap">
  <h2 id="w1" class="rv" data-next-label>Next livestream</h2>
  <div class="frame rv" style="margin-top:28px"><div class="vid" id="player">
   <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:20px;padding:20px;text-align:center;background:radial-gradient(80% 80% at 50% 30%,#0f2343,#05080f)">
    <p data-big-cd style="font-family:var(--font-heading);font-weight:700;font-size:clamp(2.6rem,9vw,7rem);line-height:1;font-variant-numeric:tabular-nums">Sunday 8:00 AM</p>
    <div class="btns" style="margin:0;justify-content:center">
     <button class="btn btn-light" type="button" data-play="{LIVE}&autoplay=1" data-title="Fellowship Chicago live stream">Open Live Player</button>
     <button class="btn btn-ghost" type="button" data-play="https://www.youtube-nocookie.com/embed/videoseries?list={UPLOADS}&autoplay=1&rel=0" data-title="Recent sermons">Watch Recent</button>
    </div>
   </div>
  </div></div>
  <p class="muted" style="margin-top:16px">Also streaming on <a class="ulink" href="{FB}">Facebook</a> and <a class="ulink" href="{YT}">YouTube</a>. #TheVirtualShip</p>
 </div>
</section>

<section class="band b-hull" aria-labelledby="w2">
 <div class="wrap split">
  <div class="rv"><h2 id="w2">Recent sermons</h2><p class="lede">Browse the newest messages in the player, or open the full archive on YouTube.</p><div class="btns"><a class="btn btn-light" href="{YT}">Full Archive</a></div></div>
  <div class="frame rv" data-i="1"><div class="vid"><iframe title="Recent sermons playlist" src="https://www.youtube-nocookie.com/embed/videoseries?list={UPLOADS}&rel=0" loading="lazy" allow="encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe></div></div>
 </div>
</section>

<section class="band b-deep" aria-labelledby="w3">
 <div class="wrap">
  <ul class="rows" style="margin-top:0">
   <li class="rv"><span class="tile">{ic("bolt")}</span><h3 id="w3">Refuel</h3><p>Our midweek worship experience, Tuesdays at 7:00 PM in season. Recharge in person or online.</p><a class="ulink" href="{REFUEL_HANDOUT}">Refuel handout</a></li>
   <li class="rv" data-i="1"><span class="tile">{ic("music")}</span><h3>Music</h3><p>From the first LP in 1965 to five Stellar Awards in 2013, music has always carried the message at Fellowship.</p><a class="ulink" href="{MUSIC}">Listen to The Flow</a></li>
   <li class="rv" data-i="2"><span class="tile">{ic("play")}</span><h3>On television</h3><p>Watch Fellowship on Cable 25, Saturdays and Sundays at 9 AM.</p><a class="ulink" href="{YT}">Or stream on YouTube</a></li>
  </ul>
 </div>
</section>
"""
page("watch.html", "Watch Church Online in Chicago | Fellowship Chicago Live",
     "Worship live with Fellowship Chicago every Sunday at 8:00, 10:45 and 1:15 on YouTube and Facebook, and watch recent sermons on demand. #TheVirtualShip",
     "watch.html", watch)

# ------------------------------------------------------------------ CONNECT
ages = ["Children", "Youth", "Young Adults", "Adults", "Seniors"]
ints = ["Worship and Arts", "Service and Outreach", "Care", "Discipleship", "Fellowship", "Hospitality", "Media and Tech", "Justice"]
chips = lambda key, opts: f'<div class="chips" data-f="{key}">' + "".join(
    f'<button type="button" aria-pressed="{"true" if o=="All" else "false"}">{o}</button>' for o in ["All"] + opts) + "</div>"
cards = "".join(
    f'<li data-age="{a}" data-int="{t}"><h3>{n}</h3><p>{s}</p>' +
    ((f'<p class="lead"><strong>Contact: </strong><a class="ulink" href="mailto:{l}">{l}</a></p>' if "@" in l else f'<p class="lead"><strong>Leader:</strong> {l}</p>') if l else "") +
    (f'<p class="lead"><strong>When:</strong> {w}</p>' if w else "") +
    f'<p class="who">For {a.replace("|", ", ")}</p><a class="ulink" href="#join" data-join="{n}">Join {n}</a></li>'
    for n, s, a, t, l, w in MINISTRIES)
connect = phero("/images/on-da-block.jpg", "Smiling Fellowship members in Fellowship On Da Block shirts at an outdoor community event", "Find your place on deck",
                "Every hand on The Ship matters. Filter by who it is for and what you love, then join a team.") + f"""
<section class="band b-ink" aria-labelledby="c1">
 <div class="wrap">
  <h2 id="c1" class="rv">Ministries</h2>
  <div class="two" style="margin-top:28px;gap:24px">
   <fieldset class="fs"><legend>Who it's for</legend>{chips("age", ages)}</fieldset>
   <fieldset class="fs"><legend>Interest</legend>{chips("int", ints)}</fieldset>
  </div>
  <p class="muted" data-count aria-live="polite" style="margin-top:24px">Showing {len(MINISTRIES)} ministries</p>
  <ul class="mins">{cards}</ul>
  <p class="muted" style="margin-top:24px">Not sure where you fit? Choose "Not sure yet" below, or call the office at <a class="ulink" href="{TEL}">{PHONE}</a>.</p>
 </div>
</section>
<section class="band b-deep" id="join" aria-labelledby="c2">
 <div class="wrap two">
  <div class="rv"><h2 id="c2">Count me in</h2><p class="lede">Leave your info and the ministry team will reach out with next steps.</p></div>
  <div class="card rv" data-i="1">{form("Ministry Sign-Up", [
      ("select","ministry","Ministry",[m[0] for m in MINISTRIES]+["Not sure yet"],"req"),
      ("text","name","Full name","req","ac:name"),("email","email","Email","req","half","ac:email"),("tel","phone","Phone","half","ac:tel"),
      ("chk","member","I am a member of Fellowship"),("textarea","note","Anything you'd like the team to know?")], "Join the Team")}</div>
 </div>
</section>
"""
page("connect.html", "Church Ministries in Chicago, IL | Fellowship Chicago",
     "Find one of 31 ministries at Fellowship Chicago by age and interest: Kidz Zone, Wave Youth, The Crew, Kings and Priests, Sisters With Vision, Freely Give and more.",
     "connect.html", connect)

# ------------------------------------------------------------------ STORY
tl_items = "".join(f'<li data-y="{y}"><span class="yr">{y}</span><h3>{t}</h3>{f"<p>{b}</p>" if b else ""}' + (f'<figure class="tlimg rvi"><img src="{TL_PHOTOS[y]}" alt="Archive photograph of Fellowship, {y}" width="1024" height="1024" loading="lazy"><figcaption>Fellowship, {y}</figcaption></figure>' if y in TL_PHOTOS else "") + '</li>' for y, t, b in TIMELINE)
crew = "".join(f'<li class="rv" data-i="{i%6}"><img src="{ph}" alt="{n}, {r}" width="400" height="400" loading="lazy"><strong>{n}</strong><span>{r}</span>' + (f'<a class="ulink" href="mailto:{e}">{e}</a>' if e else "") + '</li>' for i,(n,r,ph,e,t) in enumerate(LEADERS) if ph)
story = phero("/images/timeline-3.jpg", "Archive photograph of Fellowship in 1954", "Since 1950, and still sailing",
              "Fellowship began with Rev. Dr. Clay Evans. Five generations later, it is still a family sharing the Gospel through acts of love and generosity.") + f"""
<section class="band b-ink" id="clay-evans" aria-labelledby="s1">
 <div class="wrap two">
  <div class="rv"><h2 id="s1">Rev. Dr. Clay Evans</h2></div>
  <div class="rv" data-i="1">
   <p class="lede" style="margin-top:0">Born June 23, 1925 in Brownsville, Tennessee, and ordained in 1950, Rev. Evans founded the church that became Fellowship. He launched the ministerial careers of 93 people, including Mother Consuella York, the first woman ordained in the Baptist denomination in Chicago.</p>
   <p class="lede">A leader in the Civil Rights Movement from 1965, he was founding national board chairman of the Rainbow (PUSH) Coalition from 1971 to 1976, and founding president of the Broadcast Ministers' Alliance of Chicago. His voice carried on decades of recordings with the Fellowship choirs, and in books including From Plough Handle to Pulpit.</p>
   <p class="lede">He passed the mantle to Rev. Charles Jenkins on December 8, 2000, and went home to glory in November 2019.</p>
   <p class="lede"><span class="accent" style="font-size:1.4em">When downtown politics halted construction, the steel frame stood bare for seven years. Fellowship finished it anyway.</span></p>
  </div>
 </div>
</section>

<section class="band b-hull" id="timeline" aria-labelledby="s2">
 <div class="wrap">
  <h2 id="s2" class="rv">The voyage</h2>
  <div class="tl">
   <div class="tl-year" aria-hidden="true"><p class="y">1950</p><p class="muted g">Year one</p></div>
   <ol>{tl_items}</ol>
  </div>
  </div>
</section>

<section class="band b-deep" id="built-to-last" aria-labelledby="s6">
 <div class="wrap btl">
  <figure class="frame rvi" style="margin:0"><div><img src="/images/built-to-last.jpg" alt="Built to Last: Fellowship Chicago 76th anniversary artwork with a gold 76 and an anchor" width="1080" height="1440" loading="lazy"></div></figure>
  <div class="rv">
   <h2 id="s6">Built to last</h2>
   <p class="lede"><span class="accent" style="font-size:1.35em">Rooted in purpose, growing in focus.</span></p>
   <p class="lede">In September 2026 Fellowship celebrated 76 years with three Sundays of thanksgiving.</p>
   <ul class="btl-list">
    <li><strong>September 6</strong><span>Welcome back Pastor Sharpe and Lady Bri</span></li>
    <li><strong>September 13</strong><span>Happy 76th anniversary, Fellowship. Deacon Emeriti and Anchors acknowledgement at 10:45, Hero Award Ceremony at 1:15</span></li>
    <li><strong>September 20</strong><span>Legacy Sunday honoring Pastor Charles Jenkins, Dr. Tara Jenkins, the Jenkins family and the Evans children</span></li>
   </ul>
  </div>
 </div>
</section>

<section class="band b-white" id="logo" aria-labelledby="s3">
 <div class="wrap two" style="align-items:center">
  <div class="rv"><img src="/images/logo-mark.png" alt="The Fellowship Chicago logo mark" width="800" height="800" loading="lazy" style="width:min(320px,70%);height:auto"></div>
  <div class="rv" data-i="1"><h2 id="s3">What our mark means</h2>
   <ul class="vlist" style="margin-top:28px">
    <li><span class="tile">{ic("anchor")}</span><div><strong>The anchor</strong><p>Stability in Christ.</p></div></li>
    <li><span class="tile">{ic("ankh")}</span><div><strong>The ankh</strong><p>Our African history.</p></div></li>
    <li><span class="tile">{ic("rope")}</span><div><strong>The five-strand rope</strong><p>Family across five generations since 1950.</p></div></li>
    <li><span class="tile">{ic("cross")}</span><div><strong>The crown of thorns and cross beam</strong><p>The price Jesus paid.</p></div></li>
   </ul>
  </div>
 </div>
</section>

<section class="band b-deep" id="mission" aria-labelledby="s4">
 <div class="wrap">
  <h2 id="s4" class="ship rv"><span style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)">Our mission, T.H.E. S.H.I.P.</span><span aria-hidden="true">T.H.E. <b>S.H.I.P.</b></span></h2>
  <p class="lede rv">Fellowship Chicago is a historic multigenerational church committed to sharing and showing the gospel of Jesus Christ through acts of love and generosity, with a dedication to individual growth and social transformation through worship, arts and intentional ministry.</p>
  <ol class="letters">{"".join(f'<li class="rv" data-i="{i}"><span class="L" aria-hidden="true">{l}</span><span class="W">{w}</span></li>' for i,(l,w) in enumerate(MISSION))}</ol>
 </div>
</section>

<section class="band b-hull" id="beliefs" aria-labelledby="s7">
 <div class="wrap">
  <h2 id="s7" class="rv">What we believe</h2>
  <ul class="sym">
   <li class="rv"><h3>God</h3><p>The Creator and Ruler of the universe, eternally existing as the Father, the Son and the Holy Spirit: three coequal, and one God.</p></li>
   <li class="rv" data-i="1"><h3>Jesus Christ</h3><p>The Son of God, who lived a sinless life, died on a cross for the sins of all people, rose after three days, and will return to reign as King.</p></li>
   <li class="rv" data-i="2"><h3>The Holy Spirit</h3><p>Present in the world to make us aware of our need for Christ. He lives in every Christian from salvation, giving power, understanding, guidance and spiritual gifts.</p></li>
   <li class="rv" data-i="3"><h3>Salvation</h3><p>God's free gift, received by trusting in Jesus Christ, not earned by good works. Eternal life begins the moment we receive Him by faith.</p></li>
  </ul>
  <p class="lede rv" style="margin-top:40px"><strong>Our core values:</strong> Education. Worship. Fellowship. Evangelism. Generosity.</p>
 </div>
</section>

<section class="band b-ink" id="leadership" aria-labelledby="s5">
 <div class="wrap">
  <div class="pastor">
   <figure class="frame rvi" style="margin:0"><div><img src="/images/pastor-sharpe.jpg" alt="Pastor Reginald W. Sharpe Jr." width="1200" height="1800" loading="lazy"></div></figure>
   <div class="rv"><p class="muted" style="font-weight:700">Senior Pastor since 2019</p><h2 id="s5" class="pname" style="margin-top:10px">Reginald W. Sharpe Jr.</h2>
    <p class="lede">A native of Lithonia, Georgia, and a son of The Greater Travelers Rest Baptist Church in Atlanta, Rev. Sharpe is the third pastor of Fellowship, after Rev. Dr. Clay Evans and Pastor Charles Jenkins.</p>
    <p class="lede">He serves alongside <strong>First Lady Brianna Sharpe</strong>, "Lady Bri," a native of Stone Mountain, Georgia, and a 2010 graduate in Sacred Music of Johnson C. Smith University.</p></div>
  </div>
  <h3 class="rv" style="margin-top:72px;font-size:clamp(2rem,4vw,3rem)">Our leadership team</h3>
  <ul class="crew crewp">{crew}</ul>
 </div>
</section>
"""
page("our-story.html", "Historic Baptist Church in Chicago | Our Story, Fellowship",
     "The story of Fellowship Missionary Baptist Church of Chicago, from Rev. Dr. Clay Evans in 1950 to Pastor Reginald W. Sharpe Jr. today, plus our mission and leaders.",
     "our-story.html", story)

# ------------------------------------------------------------------ GIVE
give = phero("/images/stock-6.jpg", "A wooden cross against a blue sky", "Generosity is the Gospel in motion",
             "Our vision is to share the Gospel through acts of love and generosity. Thank you for fueling it.", "center 30%") + f"""
<section class="band b-brand" aria-labelledby="g1">
 <div class="wrap give-in">
  <div class="rv"><h2 id="g1">Give online</h2><p class="lede">One-time or recurring gifts, tithes and offerings, by card or bank, through our secure ShelbyGiving page.</p></div>
  <div class="rv" data-i="1"><a class="btn btn-light" style="min-height:60px;font-size:1.2rem;padding:0 36px" href="{SHELBY}">Give Online</a></div>
 </div>
</section>
<section class="band b-ink" aria-labelledby="g2">
 <div class="wrap">
  <h2 id="g2" class="rv">Other ways to give</h2>
  <ul class="ways">
   <li class="rv"><h3>Cash App</h3><p class="v">$FellowshipChicago</p><div class="btns" style="margin-top:16px"><button class="btn btn-ghost" type="button" data-copy="$FellowshipChicago" style="min-height:46px">{ic("copy")}<span>Copy</span></button><a class="btn btn-ghost" style="min-height:46px" href="https://cash.app/$FellowshipChicago">Open Cash App</a></div></li>
   <li class="rv" data-i="1"><h3>Zelle</h3><p class="v">Give@fellowshipchicago.com</p><div class="btns" style="margin-top:16px"><button class="btn btn-ghost" type="button" data-copy="Give@fellowshipchicago.com" style="min-height:46px">{ic("copy")}<span>Copy</span></button></div></li>
   <li class="rv" data-i="2"><h3>Text to give</h3><p class="v"><a href="sms:+17735701318">773-570-1318</a></p><p style="margin-top:10px">Text the giving category and amount, for example: Offering $20.</p></li>
   <li class="rv" data-i="3"><h3>PayPal</h3><p class="v" style="font-size:1.6rem">paypal.fellowshipchicago.com</p><div class="btns" style="margin-top:16px"><a class="btn btn-ghost" style="min-height:46px" href="https://paypal.fellowshipchicago.com">Give with PayPal</a></div></li>
   <li class="rv" data-i="4"><h3>ShelbyNext Giving app</h3><p style="margin-top:10px">Give from your phone. Search Fellowship in the app.</p><div class="btns" style="margin-top:16px"><a class="btn btn-ghost" style="min-height:46px" href="https://apps.apple.com/us/app/shelbynext-giving/id1022857191">iPhone</a><a class="btn btn-ghost" style="min-height:46px" href="https://play.google.com/store/apps/details?id=com.shelbyinc.giving&amp;hl=en_US">Android</a></div></li>
   <li class="rv" data-i="5"><h3>By mail</h3><p style="margin-top:10px">Fellowship M.B. Church<br>{ADDR}</p></li>
  </ul>
 </div>
</section>
"""
page("give.html", "Give to a Chicago Church | Fellowship Chicago Online Giving",
     "Give to Fellowship Missionary Baptist Church of Chicago securely online through ShelbyGiving, or by Cash App, Zelle, text, PayPal or mail.",
     "give.html", give)

# ------------------------------------------------------------------ CARE
crisis = [("Emergency", "If you or someone else is in immediate danger.", "tel:911", "Call 911"),
          ("988 Suicide and Crisis Lifeline", "Free, confidential support, 24 hours a day.", "tel:988", "Call or text 988"),
          ("National Domestic Violence Hotline", "Support, safety planning and referrals, 24/7.", "tel:+18007997233", "1-800-799-7233"),
          ("Illinois Domestic Violence Hotline", "Statewide and multilingual, 24/7.", "tel:+18778636338", "1-877-863-6338"),
          ("NAMI Chicago Helpline", "Mental health information and referrals.", "tel:+18336264244", "833-626-4244")]
care = phero("/images/stock-2.jpg", "A worshipper with arms open under stage lights", "You don't have to carry it alone",
             "Prayer, pastoral care and support for life's hardest seasons.") + f"""
<section class="band b-hull" aria-labelledby="k0" style="padding:56px 0">
 <div class="wrap"><h2 id="k0" style="font-size:clamp(2rem,5vw,3rem)">In crisis right now?</h2>
  <ul class="crisis">{"".join(f'<li><strong>{n}</strong><p class="muted" style="margin-top:6px">{d}</p><a class="ulink" href="{h}">{a}</a></li>' for n,d,h,a in crisis)}</ul>
 </div>
</section>
<section class="band b-ink" id="prayer" aria-labelledby="k1">
 <div class="wrap two">
  <div class="rv"><span class="tile">{ic("heart")}</span><h2 id="k1" style="margin-top:20px">Request prayer</h2><p class="lede">Share what's on your heart. Requests go to our pastoral care team and stay confidential.</p><p class="lede"><strong>Pray with us by phone:</strong> {PRAYER_CALL}</p></div>
  <div class="card rv" data-i="1">{form("Prayer Request", [
      ("text","first_name","First name","req","half","ac:given-name"),("email","email","Email, for follow-up","half","ac:email"),
      ("textarea","request","Your prayer request","req"),("chk","contact_me","I'd like a pastor to contact me"),("chk","private","Keep this private to the pastoral staff")], "Send Prayer Request")}</div>
 </div>
</section>
<section class="band b-deep" id="grief" aria-labelledby="k2">
 <div class="wrap two">
  <div class="rv"><span class="tile">{ic("phone")}</span><h2 id="k2" style="margin-top:20px">Grief support</h2><p class="lede">If you have lost someone, let us walk with you. Join In The Midst, our grief support meeting on Zoom, or call <a class="ulink" href="{TEL}">{PHONE}</a> for funeral arrangements and pastoral care.</p><div class="btns"><a class="btn btn-light" href="{GRIEF_ZOOM}">Join In The Midst</a></div><p class="lede">Our Bereavement and Violence Support ministries walk with families, including those who have lost loved ones to violent crime.</p></div>
  <div class="card rv" data-i="1">{form("Grief Support", [
      ("text","name","Your name","req","half","ac:name"),("tel","phone","Best phone number","req","half","ac:tel"),("textarea","note","How can we help?")], "Request a Call")}</div>
 </div>
</section>
"""
page("care.html", "Prayer and Care at a Chicago Church | Fellowship Chicago",
     "Request prayer, get grief support and find crisis resources. Fellowship Missionary Baptist Church of Chicago cares for you at 4543 S Princeton Ave.",
     "care.html", care)

# ------------------------------------------------------------------ CONTACT
contact = f"""
<section class="phero" aria-labelledby="ph" style="min-height:48svh;background:radial-gradient(90% 80% at 85% 0%,rgba(31,86,184,.5),transparent 60%),var(--ink)">
 <div class="wrap"><span data-sentinel></span><h1 id="ph" class="rise">Get in touch</h1><p class="lede rise d1">We would love to hear from you.</p></div>
</section>
<section class="band b-ink" aria-labelledby="ct">
 <div class="wrap two">
  <div class="rv">
   <ul class="vlist">
    <li><span class="tile">{ic("pin")}</span><div><strong>Visit</strong><p><a class="ulink" href="{MAPS}">{ADDR}</a></p></div></li>
    <li><span class="tile">{ic("phone")}</span><div><strong>Call</strong><p><a class="ulink" href="{TEL}">{PHONE}</a></p></div></li>
    <li><span class="tile">{ic("clock")}</span><div><strong>Office hours</strong><p>Tuesday to Friday, 9 AM to 5 PM. Fax (773) 924-9677.</p></div></li>
    <li><span class="tile">{ic("play")}</span><div><strong>Watch</strong><p>Cable 25, Saturdays and Sundays at 9 AM, and live on YouTube and Facebook.</p></div></li>
   </ul>
   <div class="map" style="margin-top:28px"><iframe title="Map to Fellowship Chicago" loading="lazy" src="https://www.google.com/maps?q=4543+S+Princeton+Ave,+Chicago,+IL+60609&output=embed"></iframe></div>
  </div>
  <div class="card rv" data-i="1"><h2 id="ct" style="font-size:clamp(2.2rem,5vw,3.4rem);margin-bottom:24px">Send a message</h2>{form("Contact", [
      ("text","name","Name","req","half","ac:name"),("email","email","Email","req","half","ac:email"),("tel","phone","Phone","half","ac:tel"),
      ("select","topic","Topic",["General question","Membership","Weddings and funerals","Media and livestream","Other"],"half"),
      ("textarea","message","Message","req")], "Send Message")}</div>
 </div>
</section>
"""
page("contact.html", "Contact a Baptist Church in Chicago, IL | Fellowship Chicago",
     "Contact Fellowship Missionary Baptist Church of Chicago at 4543 S Princeton Ave, Chicago, IL 60609. Call (773) 924-3232, office open Tuesday to Friday.",
     "contact.html", contact)
print("pages:", sorted(p.name for p in OUT.iterdir()))
