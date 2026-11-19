"""Flagship v2: 3D logo emblem hero, no custom cursor, hotter palette, Desmond case study.
Input: scratch/flag/site/index.html (v1). Output: scratch/flag/site2/index.html"""
import os, re
s = open('scratch/flag/site/index.html').read()
medal = open('scratch/flag/medal.js').read().strip()

def rep(old, new, count=1):
    global s
    assert s.count(old) == count, ('match count', s.count(old), old[:90])
    s = s.replace(old, new)

# ---- 3D emblem replaces the bridge scene ----
i = s.index('<script type="module">') + len('<script type="module">\n')
j = s.index('</script>', i)
s = s[:i] + medal + '\n' + s[j:]

# ---- remove the custom cursor ----
rep('/* cursor ring (fine pointers only) */\n.cur{position:fixed;left:0;top:0;width:34px;height:34px;margin:-17px 0 0 -17px;border:1.5px solid var(--gold);border-radius:50%;pointer-events:none;z-index:100;opacity:0;transition:width .35s var(--ease),height .35s var(--ease),margin .35s var(--ease),background-color .35s,opacity .3s}\n.cur-on .cur{opacity:.9}.cur.big{width:70px;height:70px;margin:-35px 0 0 -35px;background:rgba(201,162,74,.14)}\n', '')
rep('.still .cur{display:none}', '')
rep('.cur{display:none}}', '}')
m = re.search(r"if\(matchMedia\('\(pointer:fine\)'\)\.matches.*?requestAnimationFrame\(t\)\}\)\(\)\}\n", s, re.S)
rep(m.group(0), '')

# ---- hero copy tweaks ----
rep('This bridge is real-time 3D, built in code.', 'This emblem is real-time 3D, built in code.')
rep('.hero.hero3d::before{background:linear-gradient(90deg,rgba(5,14,26,.9) 0%,rgba(5,14,26,.66) 42%,rgba(5,14,26,0) 80%);z-index:1}',
    '.hero.hero3d::before{background:linear-gradient(90deg,rgba(4,11,22,.82) 0%,rgba(4,11,22,.45) 38%,rgba(4,11,22,0) 58%);z-index:1}')
rep('.hero.hero3d::before{background:linear-gradient(180deg,rgba(5,14,26,0) 30%,rgba(5,14,26,.78) 56%,#050E1A 78%)}',
    '.hero.hero3d::before{background:linear-gradient(180deg,rgba(4,11,22,0) 44%,rgba(4,11,22,.7) 58%,#040B16 76%)}')

# ---- Desmond case study replaces the illustrative slider ----
old = s[s.index('<section class="band deep" id="transformation"'):]
old = old[:old.index('</section>') + len('</section>')]
CASE = '''<section class="band deep cs" id="transformation" aria-labelledby="tf-h">
<div class="wrap">
<div class="cs-head rv-up"><div><h2 id="tf-h">Real client. <em>Real transformation.</em></h2><p class="lead">Desmond D. Davis is a national keynote speaker and burnout strategist. Bridge to Better Solutions designed and built his new home online.</p></div>
<ul class="cs-tags"><li>Brand presence</li><li>Speaker booking journey</li><li>Podcast and store</li></ul></div>
<div class="cs-stage rv-up">
<div class="cs-desk"><div class="cs-bar"><i></i><i></i><i></i><span>inspiredhouse.co</span></div><div class="cs-view" data-w="1440"><iframe src="https://inspiredhouse.co" title="Inspired House, the live website of Desmond D. Davis" loading="lazy" tabindex="-1"></iframe></div></div>
<div class="cs-phone"><div class="cs-view" data-w="390"><iframe src="https://inspiredhouse.co" title="Inspired House on a phone, live" loading="lazy" tabindex="-1"></iframe></div></div>
</div>
<div class="cs-foot"><span>The live site, rendered in real time.</span><a class="btn btn-gold" href="https://inspiredhouse.co" target="_blank" rel="noopener">Visit inspiredhouse.co</a></div>
</div>
</section>'''
rep(old, CASE)
# guard the old slider script now that the stage is gone
i = s.index('/* slider */'); j = s.index('/* concept index + lightbox */')
s = s[:i] + 'if($(\'#stage\')){\n' + s[i:j] + '}\n' + s[j:]
rep('<a class="gb-link" href="#example">See what is possible', '<a class="gb-link" href="#transformation">See the work')
rep('Demonstrations on this page are illustrative, not client projects. Photography via Pexels.',
    'Kindred is an illustrative demo. Inspired House is a client project. Photography via Pexels.')

CSS = r'''
/* ===== v2: hotter palette ===== */
:root{--gold:#E2B13C;--gold-hi:#FFE08A;--metal:linear-gradient(100deg,#B07A1E 0%,#FFD978 20%,#E8B842 38%,#FFF3C8 52%,#D6A030 70%,#FFD978 86%,#B98626 100%)}
.btn-gold{background:linear-gradient(135deg,#FFE9A0 0%,#F2C14E 45%,#C98F28 100%);box-shadow:0 16px 44px -14px rgba(242,193,78,.9),inset 0 1px 0 rgba(255,255,255,.65)}
.goldband{background:linear-gradient(118deg,#C48A22 0%,#F0BE45 28%,#FFE6A2 50%,#EDB83F 70%,#B57E1F 100%)}
.deep,.dark{background-color:#040B16;background-image:radial-gradient(60% 60% at 85% 0%,rgba(37,99,210,.5),transparent 70%),radial-gradient(45% 45% at 0% 100%,rgba(242,193,78,.16),transparent 70%)}
.hero.hero3d{background:#040B16}
.marq{background:#040B16}
.cap::before{background:linear-gradient(118deg,#C48A22,#FFE08A 45%,#E8B842)}
.data::before{background:linear-gradient(90deg,rgba(4,11,22,.95) 0%,rgba(8,24,52,.8) 45%,rgba(8,24,52,.3) 100%)}
.num em{color:#FFE08A}
@media(min-width:900px){.hero3d .wrap>*{max-width:min(54vw,860px)}.hero3d h1{font-size:clamp(3.4rem,6.1vw,6.6rem)}}
/* case study: Desmond's live site */
.cs-head{display:grid;gap:24px;align-items:end}@media(min-width:1000px){.cs-head{grid-template-columns:7fr 4fr;gap:64px}}
.cs-tags{list-style:none;margin:0;padding:0;display:flex;flex-wrap:wrap;gap:10px}
.cs-tags li{border:1px solid rgba(255,224,138,.4);color:#FFE08A;border-radius:999px;padding:8px 16px;font-size:.95rem}
.cs-stage{position:relative;margin-top:48px}
.cs-desk{border-radius:16px;overflow:hidden;border:1px solid rgba(245,241,232,.16);background:#0A0A10;box-shadow:0 70px 140px -60px rgba(0,0,0,.95),0 0 0 1px rgba(226,177,60,.18),0 0 120px -30px rgba(37,99,210,.55)}
.cs-bar{display:flex;align-items:center;gap:6px;height:36px;padding:0 16px;background:#14161D;border-bottom:1px solid rgba(255,255,255,.06)}
.cs-bar i{width:10px;height:10px;border-radius:50%;background:#3A3D48}.cs-bar span{margin-left:14px;font-size:.875rem;color:rgba(245,241,232,.6)}
.cs-view{position:relative;overflow:hidden;aspect-ratio:16/10;background:#0A0A10}
.cs-view iframe{position:absolute;top:0;left:0;border:0;transform-origin:0 0;pointer-events:none}
.cs-phone{position:absolute;right:5%;bottom:-40px;width:clamp(150px,18vw,260px);border-radius:36px;border:9px solid #07080C;overflow:hidden;background:#000;box-shadow:0 50px 100px -30px rgba(0,0,0,.9),0 0 0 1px rgba(226,177,60,.25)}
.cs-phone .cs-view{aspect-ratio:9/19.5}
.cs-foot{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:16px;margin-top:72px;color:rgba(245,241,232,.75)}
@media(max-width:699px){.cs-desk{display:none}.cs-phone{position:relative;right:auto;bottom:auto;width:min(300px,78vw);margin:0 auto}.cs-foot{margin-top:32px}}
'''
rep('/* reveals: visible by default; hidden only under .mo */', CSS.strip('\n') + '\n/* reveals: visible by default; hidden only under .mo */')

FIT = '''<script>
(function(){var vs=[].slice.call(document.querySelectorAll('.cs-view'));function fit(){vs.forEach(function(v){var f=v.querySelector('iframe'),w=+v.dataset.w,k=v.clientWidth/w;if(!k)return;f.style.width=w+'px';f.style.height=Math.ceil(v.clientHeight/k)+'px';f.style.transform='scale('+k+')'})}
fit();addEventListener('resize',fit);if('ResizeObserver'in window)vs.forEach(function(v){new ResizeObserver(fit).observe(v)})})();
</script>
<script type="module">'''
rep('<script type="module">', FIT)

os.makedirs('scratch/flag/site2', exist_ok=True)
open('scratch/flag/site2/index.html', 'w').write(s)
print('ok', len(s))
