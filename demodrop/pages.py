# Page bodies. Executed inside gen.py (shares its helpers).

TIMELINE = [
    (1950, "Founded as Mount Carmel Missionary Baptist Church", "Rev. Dr. Clay Evans begins the church."),
    (1952, "Renamed Fellowship. First radio broadcast", ""),
    (1959, "Buys the site at 45th and Princeton", ""),
    (1965, "First LP recording. Jesse Jackson Sr. ordained", ""),
    (1973, "The current building opens", ""),
    (1977, "Television broadcast and credit union launch", ""),
    (2000, "Rev. Clay Evans retires", ""),
    (2001, "Pastor Charles Jenkins inaugurated", ""),
    (2007, "Live streaming begins", ""),
    (2013, "Five Stellar Awards", ""),
    (2018, "Sanctuary remodeled", ""),
    (2019, "Rev. Reginald W. Sharpe Jr. named Pastor", "The third pastor in Fellowship's history."),
]
LEADERS = [
    ("Brianna Sharpe", "First Lady"), ("Frazlier L. Pope III", "Executive Pastor"),
    ("Kesha Brown", "Chief Financial Officer"), ("Wendy Irby", "Director of Membership Services and Assimilation"),
    ("Kevin Vasser", "Pastor of Worship and Arts"), ("Jillian Twiggs", "Youth Pastor"),
    ("Damien Martin", "Director of Ministry Operations"), ("Debra Earl", "Executive Assistant to the Pastor"),
    ("Rafael Evans", "Office Coordinator"), ("Roxanne Montgomery", "Accounts Payable Manager"),
    ("Ashley Cheeks", "Digital Communications Strategist"),
]
MISSION = [("T", "Teaching"), ("H", "Hospitality"), ("E", "Engagement"), ("S", "Service"),
           ("H", "Holistic Ministry"), ("I", "Innovation"), ("P", "Praise and Worship")]
MINISTRIES = [
    ("Kidz Zone", "Children's ministry during the 10:45 AM Sunday service.", "Children", "Discipleship", "", "Sundays, 10:45 AM"),
    ("Youth Ministry", "Students meet Sundays at 10:45 AM.", "Youth", "Discipleship|Fellowship", "Jillian Twiggs, Youth Pastor", "Sundays, 10:45 AM"),
    ("Worship and Arts", "Music and creative arts in worship at The Ship.", "Youth|Young Adults|Adults|Seniors", "Worship and Arts", "Kevin Vasser, Pastor of Worship and Arts", ""),
    ("Refuel", "The midweek service to recharge, in person and online.", "All Ages", "Discipleship|Worship and Arts", "", "Tuesdays, 7:00 PM (seasonal)"),
    ("Community Table", "Shared meals and a seat at the table for our neighbors.", "All Ages", "Service and Outreach|Hospitality", "", ""),
    ("Food Giveaway", "Groceries for families in our community.", "All Ages", "Service and Outreach", "", ""),
    ("Social Justice", "Carrying forward Fellowship's civil rights legacy in our city today.", "Young Adults|Adults|Seniors", "Justice|Service and Outreach", "", ""),
    ("Membership and Assimilation", "Joining Fellowship and finding your place on board.", "Young Adults|Adults|Seniors", "Hospitality|Fellowship", "Wendy Irby, Director of Membership Services and Assimilation", ""),
    ("The Virtual Ship", "Worship online with us on YouTube and Facebook.", "All Ages", "Media and Tech", "", "Every Sunday service, streamed live"),
]

# ------------------------------------------------------------------ HOME
home = f"""
<section class="hero" aria-labelledby="h1">
 <div class="hero-media">
  <img src="/images/stock-3.jpg" alt="A congregation with hands raised in worship before a lit stage and cross" width="1600" height="1067" loading="eager" fetchpriority="high">
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
  <p class="lede rv">Our vision: <span class="accent" style="font-size:1.35em">Share the Gospel through acts of love and generosity.</span></p>
  <ol class="letters">{"".join(f'<li class="rv" data-i="{i}"><span class="L" aria-hidden="true">{l}</span><span class="W">{w}</span></li>' for i,(l,w) in enumerate(MISSION))}</ol>
 </div>
</section>

<section class="band b-ink" id="impact" aria-labelledby="ih">
 <div class="wrap">
  <h2 id="ih" class="rv">Gospel you can see</h2>
  <p class="lede rv">Love in action across our South Side community.</p>
  <ul class="rows">
   <li class="rv"><span class="tile">{ic("bread")}</span><h3>Food Giveaway</h3><p>Groceries for families across our community.</p><a class="ulink" href="connect.html?m=Food+Giveaway#join">Serve with us</a></li>
   <li class="rv" data-i="1"><span class="tile">{ic("table")}</span><h3>Community Table</h3><p>Shared meals and a seat at the table for our neighbors.</p><a class="ulink" href="connect.html?m=Community+Table#join">Serve with us</a></li>
   <li class="rv" data-i="2"><span class="tile">{ic("scales")}</span><h3>Social Justice</h3><p>Carrying forward Fellowship's civil rights legacy in our city today.</p><a class="ulink" href="connect.html?m=Social+Justice#join">Serve with us</a></li>
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
  <h2 id="eh" class="rv">This week at The Ship</h2>
  <ul class="ev" data-events="4"><li><h3>Sunday Worship</h3><span class="tm">8:00 AM, 10:45 AM and 1:15 PM</span></li></ul>
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
   <li><span class="tile">{ic("kids")}</span><div><strong>Kidz Zone, Sundays 10:45 AM</strong><p>Kidz Zone and our youth ministry meet during the 10:45 service.</p></div></li>
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
watch = phero("/images/stock-4.jpg", "Hands raised under blue stage lights", "Watch",
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
   <li class="rv"><span class="tile">{ic("bolt")}</span><h3 id="w3">Refuel</h3><p>Our midweek service, Tuesdays at 7:00 PM in season. Recharge in person or online.</p><a class="ulink" href="{YT}">Watch on YouTube</a></li>
   <li class="rv" data-i="1"><span class="tile">{ic("music")}</span><h3>Music</h3><p>From the first LP in 1965 to five Stellar Awards in 2013, music has always carried the message at Fellowship.</p><a class="ulink" href="{YT}">Listen on YouTube</a></li>
  </ul>
 </div>
</section>
"""
page("watch.html", "Watch Church Online in Chicago | Fellowship Chicago Live",
     "Worship live with Fellowship Chicago every Sunday at 8:00, 10:45 and 1:15 on YouTube and Facebook, and watch recent sermons on demand. #TheVirtualShip",
     "watch.html", watch)

# ------------------------------------------------------------------ CONNECT
ages = ["Children", "Youth", "Young Adults", "Adults", "Seniors"]
ints = ["Worship and Arts", "Service and Outreach", "Discipleship", "Fellowship", "Hospitality", "Media and Tech", "Justice"]
chips = lambda key, opts: f'<div class="chips" data-f="{key}">' + "".join(
    f'<button type="button" aria-pressed="{"true" if o=="All" else "false"}">{o}</button>' for o in ["All"] + opts) + "</div>"
cards = "".join(
    f'<li data-age="{a}" data-int="{t}"><h3>{n}</h3><p>{s}</p>' +
    (f'<p class="lead"><strong>Leader:</strong> {l}</p>' if l else "") +
    (f'<p class="lead"><strong>When:</strong> {w}</p>' if w else "") +
    f'<p class="who">For {a.replace("|", ", ")}</p><a class="ulink" href="#join" data-join="{n}">Join {n}</a></li>'
    for n, s, a, t, l, w in MINISTRIES)
connect = phero("/images/stock-5.jpg", "Arms raised before bright stage lights", "Find your place on deck",
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
  <p class="muted" style="margin-top:24px">Fellowship has many more ministries. Ask the office at <a class="ulink" href="{TEL}">{PHONE}</a> or use the form below and we will connect you.</p>
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
     "Find a ministry at Fellowship Chicago by age group and interest: Kidz Zone, youth, worship and arts, Community Table, food giveaway, social justice and more.",
     "connect.html", connect)

# ------------------------------------------------------------------ STORY
tl_items = "".join(f'<li data-y="{y}"><span class="yr">{y}</span><h3>{t}</h3>{f"<p>{b}</p>" if b else ""}</li>' for y, t, b in TIMELINE)
story = phero("/images/timeline-3.jpg", "Archive photograph from Fellowship's history", "Since 1950, and still sailing",
              "Fellowship began with Rev. Dr. Clay Evans. Five generations later, it is still a family sharing the Gospel through acts of love and generosity.") + f"""
<section class="band b-ink" id="clay-evans" aria-labelledby="s1">
 <div class="wrap two">
  <div class="rv"><h2 id="s1">Rev. Dr. Clay Evans</h2></div>
  <div class="rv" data-i="1">
   <p class="lede" style="margin-top:0">Rev. Evans founded the church in 1950 as Mount Carmel Missionary Baptist Church. Over fifty years he built it into Fellowship: a radio and television ministry, gospel recordings, a credit union and the building at 45th and Princeton. He retired in 2000.</p>
   <p class="lede"><span class="accent" style="font-size:1.4em">In 1965, Jesse Jackson Sr. was ordained at Fellowship.</span></p>
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
  <ul class="strip">
   <li class="rvi"><img src="/images/timeline-2.jpg" alt="Archive photograph from Fellowship's history" width="1200" height="900" loading="lazy"></li>
   <li class="rvi" data-i="2"><img src="/images/timeline-4.jpg" alt="Archive photograph from Fellowship's history" width="1200" height="900" loading="lazy"></li>
  </ul>
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
  <ol class="letters">{"".join(f'<li class="rv" data-i="{i}"><span class="L" aria-hidden="true">{l}</span><span class="W">{w}</span></li>' for i,(l,w) in enumerate(MISSION))}</ol>
 </div>
</section>

<section class="band b-ink" id="leadership" aria-labelledby="s5">
 <div class="wrap">
  <div class="pastor">
   <figure class="frame rvi" style="margin:0"><div><img src="/images/pastor-sharpe.jpg" alt="Pastor Reginald W. Sharpe Jr." width="1200" height="1800" loading="lazy"></div></figure>
   <div class="rv"><p class="muted" style="font-weight:700">Senior Pastor since 2019</p><h2 id="s5" class="pname" style="margin-top:10px">Reginald W. Sharpe Jr.</h2>
    <p class="lede">The third pastor of Fellowship, after Rev. Dr. Clay Evans and Pastor Charles Jenkins. He serves alongside First Lady Brianna Sharpe.</p></div>
  </div>
  <h3 class="rv" style="margin-top:72px;font-size:clamp(2rem,4vw,3rem)">Our leadership team</h3>
  <ul class="crew">{"".join(f'<li class="rv" data-i="{i%6}"><strong>{n}</strong><span>{r}</span></li>' for i,(n,r) in enumerate(LEADERS))}</ul>
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
   <li class="rv" data-i="1"><h3>Zelle, text to give and PayPal</h3><p style="margin-top:10px">Call the church office for current details: <a class="ulink" href="{TEL}">{PHONE}</a>.</p></li>
   <li class="rv" data-i="2"><h3>By mail</h3><p style="margin-top:10px">Fellowship Missionary Baptist Church<br>{ADDR}</p></li>
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
  <div class="rv"><span class="tile">{ic("heart")}</span><h2 id="k1" style="margin-top:20px">Request prayer</h2><p class="lede">Share what's on your heart. Requests go to our pastoral care team and stay confidential.</p></div>
  <div class="card rv" data-i="1">{form("Prayer Request", [
      ("text","first_name","First name","req","half","ac:given-name"),("email","email","Email, for follow-up","half","ac:email"),
      ("textarea","request","Your prayer request","req"),("chk","contact_me","I'd like a pastor to contact me"),("chk","private","Keep this private to the pastoral staff")], "Send Prayer Request")}</div>
 </div>
</section>
<section class="band b-deep" id="grief" aria-labelledby="k2">
 <div class="wrap two">
  <div class="rv"><span class="tile">{ic("phone")}</span><h2 id="k2" style="margin-top:20px">Grief support</h2><p class="lede">If you have lost someone, let us walk with you. For funeral arrangements and pastoral care, call <a class="ulink" href="{TEL}">{PHONE}</a>, Tuesday to Friday, 9 AM to 5 PM.</p></div>
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
    <li><span class="tile">{ic("clock")}</span><div><strong>Office hours</strong><p>Tuesday to Friday, 9 AM to 5 PM</p></div></li>
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
