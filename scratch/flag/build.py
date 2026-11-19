"""Flagship build: live 3D hero, gold color-block band, kinetic type, capabilities, cursor.
Source: scratch/dd5/index.html (funnel signature). Output: scratch/flag/site/index.html"""
import os, re
s = open('scratch/dd5/index.html').read()
scene = open('scratch/flag/scene.js').read()

def rep(old, new, count=1):
    global s
    assert s.count(old) == count, ('match count', s.count(old), old[:90])
    s = s.replace(old, new)

def cut(start, end_marker):
    """return the block from start up to and including the first end_marker after it"""
    i = s.index(start); j = s.index(end_marker, i) + len(end_marker)
    return s[i:j]

# ---------- head ----------
rep('<title>Web Design &amp; Digital Experiences | Bridge to Better Solutions, LLC</title>',
    '<title>Web Design, 3D &amp; Motion | Bridge to Better Solutions, LLC</title>')
rep('<meta name="theme-color" content="#10243A">', '<meta name="theme-color" content="#050E1A">')
rep('</head>', '<script type="importmap">{"imports":{"three":"https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.min.js","three/addons/":"https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/"}}</script>\n<link rel="modulepreload" href="https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.min.js" crossorigin>\n</head>')

# ---------- CSS ----------
CSS = r'''
/* ===== FLAGSHIP ===== */
:root{--mid:#050E1A;--mid2:#0A1A2E;--gold-hi:#F3D88F;--metal:linear-gradient(100deg,#9C7A2E 0%,#E9C877 20%,#C9A24A 38%,#F6E3A6 52%,#B8913F 70%,#E9C877 86%,#A9822F 100%);--metal-ink:linear-gradient(100deg,#6E531B 0%,#9A7731 40%,#7D6122 70%,#9A7731 100%)}
body{background:var(--white)}
::selection{background:var(--gold);color:var(--mid)}
h1,h2{font-family:var(--font-heading);font-weight:700;letter-spacing:-.035em}
h2{font-size:clamp(2.4rem,5.4vw,5rem);line-height:.98}
h1 em,h2 em{font-family:var(--font-display);font-style:italic;font-weight:400;letter-spacing:-.01em}
.band:not(.deep):not(.dark) h2 em,.sc-intro h2 em,.rb-text h2 em,.faq-grid h2 em,.in-aside h2 em{background:var(--metal-ink);-webkit-background-clip:text;background-clip:text;color:transparent}
.metal,.deep h2 em,.dark h2 em,.data h2 em,.finale h2 em,.caps h2 em{background:var(--metal);background-size:220% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;animation:sheen 7s linear infinite}
@keyframes sheen{to{background-position:-220% 0}}
.deep,.dark{background-color:var(--mid);background-image:radial-gradient(60% 55% at 85% 0%,rgba(30,74,140,.38),transparent 70%),radial-gradient(40% 40% at 0% 100%,rgba(201,162,74,.12),transparent 70%)}
/* metallic buttons with a light sweep */
.btn{position:relative;overflow:hidden;isolation:isolate}
.btn-gold{background:linear-gradient(135deg,#F0D488 0%,#C9A24A 48%,#A9822F 100%);color:#071425;box-shadow:0 14px 34px -14px rgba(201,162,74,.95),inset 0 1px 0 rgba(255,255,255,.5)}
.btn-gold::after{content:"";position:absolute;inset:0;z-index:-1;background:linear-gradient(110deg,transparent 25%,rgba(255,255,255,.65) 50%,transparent 75%);transform:translateX(-130%);transition:transform .9s var(--ease)}
.btn-gold:hover::after,.btn-gold:focus-visible::after{transform:translateX(130%)}
.btn-line{backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px)}
.hdr.solid{background:rgba(5,14,26,.82);backdrop-filter:blur(14px) saturate(1.4);-webkit-backdrop-filter:blur(14px) saturate(1.4)}
/* scroll progress */
.pbar{position:fixed;top:0;left:0;right:0;height:2px;z-index:60;background:var(--metal);transform-origin:0 50%;transform:scaleX(0);pointer-events:none}
/* cursor ring (fine pointers only) */
.cur{position:fixed;left:0;top:0;width:34px;height:34px;margin:-17px 0 0 -17px;border:1.5px solid var(--gold);border-radius:50%;pointer-events:none;z-index:100;opacity:0;transition:width .35s var(--ease),height .35s var(--ease),margin .35s var(--ease),background-color .35s,opacity .3s}
.cur-on .cur{opacity:.9}.cur.big{width:70px;height:70px;margin:-35px 0 0 -35px;background:rgba(201,162,74,.14)}
/* hero: real-time 3D bridge */
.hero.hero3d{min-height:100svh;background:var(--mid);align-items:flex-end}
.hero3d #hero-gl{position:absolute;inset:0;width:100%;height:100%;display:block;opacity:0;transition:opacity 1.6s ease;z-index:0}
.gl-on .hero3d #hero-gl{opacity:1}
.hero3d .hero-poster{transition:opacity 1.6s ease}.gl-on .hero3d .hero-poster{opacity:0}
.hero.hero3d::before{background:linear-gradient(90deg,rgba(5,14,26,.9) 0%,rgba(5,14,26,.66) 42%,rgba(5,14,26,0) 80%);z-index:1}
.hero.hero3d::after{height:34%;background:linear-gradient(0deg,#050E1A 8%,rgba(5,14,26,0));z-index:1}
.hero3d .wrap{z-index:2;padding-bottom:120px}
.hero3d .eyebrow{color:rgba(243,216,143,.9)}
.hero3d h1{font-size:clamp(3rem,7.2vw,7.4rem);line-height:.92;max-width:none;margin-top:22px}
.hero3d h1 .ln{display:block;overflow:hidden;padding-bottom:.08em}
.hero3d h1 .ln>span,.hero3d h1 .ln>em{display:inline-block}
.hero3d h1 em{color:transparent}
.mo .hero3d h1 .ln>*{transform:translateY(108%);animation:rise 1.3s var(--ease) .25s forwards}
.mo .hero3d h1 .ln+.ln>*{animation-delay:.42s}
.mo .hero3d .sub,.mo .hero3d .ctas,.mo .hero3d .eyebrow{opacity:0;animation:fadeup 1s var(--ease) .75s forwards}
@keyframes rise{to{transform:none}}@keyframes fadeup{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
.hero3d .sub{max-width:44ch}
.hero .hero-foot{position:absolute;left:0;right:0;bottom:28px;max-width:1600px;margin:0 auto;padding:0 18px;z-index:2;display:flex;justify-content:space-between;align-items:center;gap:16px;font-size:.875rem;color:rgba(245,241,232,.7)}
.hero-foot .scr{display:none;align-items:center;gap:12px}.hero-foot .scr i{position:relative;width:1.5px;height:38px;background:rgba(245,241,232,.2);overflow:hidden}
.hero-foot .scr i::after{content:"";position:absolute;left:0;right:0;top:-40%;height:40%;background:var(--gold);animation:drip 2.2s var(--ease) infinite}
@keyframes drip{to{top:100%}}
@media(min-width:900px){.hero .hero-foot{padding:0 48px}.hero-foot .scr{display:flex}}
.hero-foot .live{display:flex;align-items:center;gap:10px}.hero-foot .live b{width:8px;height:8px;border-radius:50%;background:var(--gold);box-shadow:0 0 0 0 rgba(201,162,74,.7);animation:ping 2s infinite}
@keyframes ping{70%{box-shadow:0 0 0 10px rgba(201,162,74,0)}100%{box-shadow:0 0 0 0 rgba(201,162,74,0)}}
@media(max-width:899px){.hero.hero3d .hero-poster{height:56svh}.hero.hero3d::before{background:linear-gradient(180deg,rgba(5,14,26,0) 30%,rgba(5,14,26,.78) 56%,#050E1A 78%)}.hero.hero3d::after{display:none}.hero3d .wrap{padding-bottom:96px}.hero3d .eyebrow{display:none}.hero3d h1{margin-top:0}.hero-foot .scr{display:none}.hero-foot{justify-content:flex-start}}
/* kinetic word band */
.marq{position:relative;background:var(--mid);overflow:hidden;padding:34px 0;border-top:1px solid rgba(245,241,232,.08);border-bottom:1px solid rgba(245,241,232,.08)}
.marq-t{display:flex;align-items:center;gap:44px;width:max-content;animation:mq 46s linear infinite;will-change:transform}
.marq:hover .marq-t{animation-play-state:paused}
.marq span{font-family:var(--font-heading);font-weight:700;font-size:clamp(3rem,8vw,7.6rem);line-height:1;letter-spacing:-.045em;white-space:nowrap;color:transparent;-webkit-text-stroke:1.3px rgba(245,241,232,.5)}
.marq span:nth-of-type(even){-webkit-text-stroke:0;background:var(--metal);-webkit-background-clip:text;background-clip:text}
.marq svg{width:46px;height:46px;flex:none;color:var(--gold)}
@keyframes mq{to{transform:translateX(-50%)}}
/* the gold band */
.goldband{position:relative;overflow:hidden;color:#071425;padding:110px 0;background:linear-gradient(118deg,#B08A3A 0%,#D6B25C 30%,#EFD38A 52%,#C9A24A 74%,#A27C2E 100%)}
@media(min-width:900px){.goldband{padding:150px 0}}
.goldband::after{content:"";position:absolute;inset:-50% -20%;background:linear-gradient(105deg,transparent 40%,rgba(255,248,225,.38) 50%,transparent 60%);animation:band 9s var(--ease) infinite;pointer-events:none}
@keyframes band{0%{transform:translateX(-60%)}60%,100%{transform:translateX(60%)}}
.gb-grid{position:relative;z-index:1;display:grid;gap:36px;align-items:end}@media(min-width:1000px){.gb-grid{grid-template-columns:8fr 4fr;gap:72px}}
.gb-words{font-size:clamp(2.4rem,5.6vw,5.6rem);line-height:.98;letter-spacing:-.04em;color:#071425}
.gb-words .w{opacity:.2;transition:opacity .35s ease}.gb-words .w.on{opacity:1}
.gb-side p{font-size:1.1875rem;color:rgba(7,20,37,.86);max-width:40ch}
.gb-link{display:inline-flex;align-items:center;gap:12px;margin-top:24px;min-height:48px;font-weight:700;color:#071425;text-decoration:none;border-bottom:2px solid #071425}
.gb-link svg{width:20px;height:20px;transition:transform .4s var(--ease)}.gb-link:hover svg{transform:translateX(6px)}
/* data numbers in metallic gold */
.num b{background:var(--metal);background-size:220% 100%;-webkit-background-clip:text;background-clip:text;color:transparent}
.sc-res .num b{background:var(--metal-ink);-webkit-background-clip:text;background-clip:text}
/* capabilities */
.caps{padding:96px 0}@media(min-width:900px){.caps{padding:140px 0}}
.caps-head{display:grid;gap:20px;align-items:end}@media(min-width:1000px){.caps-head{grid-template-columns:7fr 5fr;gap:64px}}
.caps h2{color:var(--ivory)}
.cap-list{list-style:none;margin:64px 0 0;padding:0;border-bottom:1px solid rgba(245,241,232,.14)}
.cap{position:relative;display:grid;gap:10px 32px;align-items:center;padding:30px 18px;border-top:1px solid rgba(245,241,232,.14);color:var(--ivory);text-decoration:none;overflow:hidden;isolation:isolate;transition:color .45s var(--ease)}
@media(min-width:1000px){.cap{grid-template-columns:6fr 5fr 64px;padding:40px 28px}}
.cap::before{content:"";position:absolute;inset:0;z-index:-1;background:linear-gradient(118deg,#B08A3A,#E3C373 45%,#C9A24A);transform:scaleY(0);transform-origin:50% 100%;transition:transform .6s var(--ease)}
.cap:hover::before,.cap:focus-visible::before{transform:scaleY(1)}
.cap:hover,.cap:focus-visible{color:#071425}
.cap h3{font-family:var(--font-heading);font-weight:700;font-size:clamp(1.9rem,4vw,3.9rem);line-height:1;letter-spacing:-.035em}
.cap h3 em{font-family:var(--font-display);font-weight:400}
.cap p{color:rgba(245,241,232,.72);font-size:1.0625rem;max-width:46ch;transition:color .45s}
.cap:hover p,.cap:focus-visible p{color:rgba(7,20,37,.82)}
.cap .arr{display:none;width:64px;height:64px;border-radius:50%;border:1.5px solid currentColor;align-items:center;justify-content:center;transition:transform .6s var(--ease)}
@media(min-width:1000px){.cap .arr{display:flex}}
.cap .arr svg{width:24px;height:24px}.cap:hover .arr{transform:rotate(-45deg)}
.caps .paths-note{color:rgba(245,241,232,.7);margin-top:28px}.caps .paths-note a{color:var(--gold-hi)}
/* headings wipe in */
.mo .rv-up h2{clip-path:inset(0 0 100% 0);transition:clip-path 1.1s var(--ease) .08s}
.mo .rv-up.in h2{clip-path:inset(-10% -5% -20% -5%)}
.sol-photo img,.data-bg img{transition:transform 1.6s var(--ease)}
.mo .sol-photo:not(.in) img{transform:scale(1.08)}
.finale h2{font-size:clamp(2.6rem,6vw,5.6rem)}
'''
rep('/* reveals: visible by default; hidden only under .mo */', CSS.strip('\n') + '\n/* reveals: visible by default; hidden only under .mo */')
# motion-off states for the new effects
rep('.still *,.still *::before,.still *::after{animation:none!important;transition:none!important}',
    '.still *,.still *::before,.still *::after{animation:none!important;transition:none!important}\n.still .cur{display:none}.still .marq-t{flex-wrap:wrap;width:auto;justify-content:center}.still .marq-t>*:nth-child(n+9){display:none}\n@media(prefers-reduced-motion:reduce){.marq-t{flex-wrap:wrap;width:auto;justify-content:center}.marq-t>*:nth-child(n+9){display:none}.cur{display:none}}')

# ---------- icons ----------
rep('<symbol id="i-plus"', '<symbol id="i-spark" viewBox="0 0 24 24"><path d="M12 2c.6 4.6 2.4 6.8 7 7.6v.8c-4.6.8-6.4 3-7 7.6h-.8c-.6-4.6-2.4-6.8-7-7.6v-.8c4.6-.8 6.4-3 7-7.6z" fill="currentColor"/></symbol>\n<symbol id="i-arrow" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></symbol>\n<symbol id="i-plus"')

# ---------- hero ----------
old_hero = cut('<section class="hero" id="top" aria-labelledby="hero-h">', '</section>')
img = re.search(r'<img src="/images/bridge-gold-3840.jpg"[^>]*>', old_hero).group(0)
img = img.replace('<img ', '<img class="hero-poster" ', 1)
HERO = ('<section class="hero hero3d" id="top" aria-labelledby="hero-h">\n' + img + '\n'
 '<canvas id="hero-gl" aria-hidden="true"></canvas>\n'
 '<div class="wrap">\n'
 '<p class="eyebrow">Web design, 3D and motion for businesses, nonprofits and ministries</p>\n'
 '<h1 id="hero-h"><span class="ln"><span>Your work is extraordinary.</span></span><span class="ln"><em class="metal">Your website should be too.</em></span></h1>\n'
 '<p class="sub">Websites, 3D and motion, and the systems behind them. Built in Rochester, NY, for organizations ready to be seen.</p>\n'
 '<div class="ctas"><a class="btn btn-gold mag" href="#intake">Start Your Project</a><a class="btn btn-line mag" href="#score">Get My Score</a></div>\n'
 '</div>\n'
 '<div class="hero-foot"><span class="live"><b aria-hidden="true"></b>This bridge is real-time 3D, built in code.</span><span class="scr" aria-hidden="true"><i></i>Scroll</span></div>\n'
 '</section>\n\n'
 + '<div class="marq" aria-hidden="true"><div class="marq-t">'
 + ''.join('<span>%s</span><svg><use href="#i-spark"/></svg>' % w for w in ['Websites', '3D &amp; Motion', 'Brand Experiences', 'Connected Systems'] * 2)
 + '</div></div>\n\n'
 '<section class="goldband" id="vision" aria-labelledby="gb-h">\n<div class="wrap gb-grid">\n'
 '<h2 id="gb-h" class="gb-words">Closing the gap between extraordinary work and the way the world experiences it.</h2>\n'
 '<div class="gb-side"><p>We design and build websites, 3D and motion experiences, and the connected systems behind them, for businesses, nonprofits and ministries.</p>'
 '<a class="gb-link" href="#example">See what is possible<svg aria-hidden="true"><use href="#i-arrow"/></svg></a></div>\n'
 '</div>\n</section>')
rep(old_hero, HERO)

# statement moved into the gold band
rep('<p class="statement">Closing the gap between <em>extraordinary work</em> and the way the world experiences it online.</p>\n', '')

# ---------- capabilities replace the two paths ----------
old_srv = cut('<section class="band cool" id="services" aria-labelledby="paths-h">', '</section>')
def cap(title, desc, preset):
    return ('<li><a class="cap" href="#intake" data-preset=\'%s\'><h3>%s</h3><p>%s</p><span class="arr" aria-hidden="true"><svg><use href="#i-arrow"/></svg></span></a></li>' % (preset, title, desc))
CAPS = ('<section class="band deep caps" id="services" aria-labelledby="paths-h">\n<div class="wrap">\n'
 '<div class="caps-head rv-up"><h2 id="paths-h">Everything your brand needs to <em>show up and stand out.</em></h2>'
 '<p class="lead">Start with a focused fix or a complete transformation, and go as far as your vision wants to go.</p></div>\n'
 '<ul class="cap-list">\n'
 + cap('Quick Website Jobs &amp; Upgrades', 'Fix pages, links and forms. Refresh content and photos. Improve mobile, speed and search.', '{"project_type":"A quick website fix or update"}') + '\n'
 + cap('Complete Website <em>Buildouts</em>', 'Strategy, page architecture, custom design and build, launched with analytics and search foundations.', '{"project_type":"A completely new website"}') + '\n'
 + cap('3D, Motion &amp; <em>Interactive</em>', 'Real-time 3D, scroll stories and animation, like the bridge at the top of this page.', '{"project_type":"An advanced interactive digital experience"}') + '\n'
 + cap('Connected <em>Systems</em>', 'Intake, booking and CRM connections, so confirmations and follow up happen without manual admin.', '{"features":["CRM integration","Automated follow-up"]}') + '\n'
 '</ul>\n'
 '<p class="small paths-note rv-up">Every project starts with a written scope. Price and timing are agreed before work begins. Not sure which fits? <a href="#score">Get your score</a> and we will recommend one.</p>\n'
 '</div>\n</section>')
rep(old_srv, CAPS)

# ---------- finale ----------
rep('<h2 id="fin-h">Your work deserves a digital experience that <em>reflects its value.</em></h2>',
    '<h2 id="fin-h">Let&rsquo;s build something <em>extraordinary.</em></h2>')

# ---------- page-level elements ----------
rep('<a href="#main" class="sr">Skip to content</a>', '<a href="#main" class="sr">Skip to content</a>\n<div class="pbar" id="pbar" aria-hidden="true"></div>')

FX = r'''<script>
(function(){var d=document,H=d.documentElement,still=function(){return H.classList.contains('still')||navigator.webdriver===true};
var pb=d.getElementById('pbar'),gb=d.querySelector('.gb-words'),ws=[];
if(gb){gb.innerHTML=gb.textContent.trim().split(/\s+/).map(function(w){return '<span class="w">'+w+'</span>'}).join(' ');ws=[].slice.call(gb.querySelectorAll('.w'))}
function onS(){var h=H.scrollHeight-innerHeight;pb.style.transform='scaleX('+(h>0?scrollY/h:0)+')';
if(ws.length){if(still()){ws.forEach(function(w){w.classList.add('on')})}else{var r=gb.getBoundingClientRect(),p=(innerHeight*.9-r.top)/(r.height+innerHeight*.3),k=Math.floor(Math.max(0,Math.min(1,p))*ws.length*1.1);ws.forEach(function(w,i){w.classList.toggle('on',i<k)})}}}
addEventListener('scroll',onS,{passive:true});addEventListener('resize',onS);onS();
var mt=d.getElementById('mtog');if(mt)mt.addEventListener('click',onS);
if(matchMedia('(pointer:fine)').matches&&!matchMedia('(prefers-reduced-motion: reduce)').matches){var c=d.createElement('div');c.className='cur';c.setAttribute('aria-hidden','true');d.body.appendChild(c);var x=-99,y=-99,cx=x,cy=y;
addEventListener('pointermove',function(e){x=e.clientX;y=e.clientY;H.classList.add('cur-on')},{passive:true});d.addEventListener('pointerleave',function(){H.classList.remove('cur-on')});
d.addEventListener('pointerover',function(e){c.classList.toggle('big',!!(e.target.closest&&e.target.closest('a,button,[role=slider],summary,label,.stage')))});
(function t(){cx+=(x-cx)*.22;cy+=(y-cy)*.22;c.style.transform='translate3d('+cx.toFixed(1)+'px,'+cy.toFixed(1)+'px,0)';requestAnimationFrame(t)})()}
[].forEach.call(d.querySelectorAll('.mag'),function(b){b.addEventListener('pointermove',function(e){if(still()||e.pointerType!=='mouse')return;var r=b.getBoundingClientRect();b.style.transform='translate('+((e.clientX-r.left-r.width/2)*.22).toFixed(1)+'px,'+((e.clientY-r.top-r.height/2)*.32).toFixed(1)+'px)'});b.addEventListener('pointerleave',function(){b.style.transform=''})});
})();
</script>
<script type="module">
''' + scene.strip() + '\n</script>\n</body>'
rep("var nums=$$('[data-count]');if(!still&&'IntersectionObserver'in window){", "var nums=$$('[data-count]');if(!still&&!navigator.webdriver&&'IntersectionObserver'in window){")
rep('</script>\n</body>', '</script>\n' + FX)

os.makedirs('scratch/flag/site', exist_ok=True)
open('scratch/flag/site/index.html', 'w').write(s)
print('ok', len(s))
