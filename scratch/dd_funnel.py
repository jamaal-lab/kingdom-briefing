"""Funnel pass: scorecard hook, sticky mobile CTA, FAQ, prefilled intake.
Reads scratch/dd4/index.html (live signature + portrait), writes scratch/dd5/index.html
and scratch/dd5/edits.json (ordered find/replace pairs for DemoDrop edit_page)."""
import json, os, re

SRC = 'scratch/dd4/index.html'
OUT = 'scratch/dd5/index.html'
src = open(SRC).read()
s = src
edits = []

def rep(old, new):
    global s
    assert s.count(old) == 1, ('not unique', s.count(old), old[:80])
    s = s.replace(old, new)
    edits.append({'find': old, 'replace': new})

# ---------- CSS ----------
CSS = r'''
/* funnel: scorecard */
.sc-grid{display:grid;gap:36px;align-items:start}
@media(min-width:1000px){.sc-grid{grid-template-columns:5fr 7fr;gap:80px}}
.sc-intro .lead{margin-top:18px}
.sc-why{list-style:none;margin:28px 0 0;padding:0;display:grid;gap:14px}
@media(max-width:999px){.sc-why{display:none}}
.sc-why li{display:flex;gap:14px;align-items:center;font-size:1.0625rem}
.sc-why .ico{color:var(--navy)}.sc-why .tile{background:var(--white);box-shadow:0 10px 24px -14px rgba(16,36,58,.45)}
.sc-card{background:var(--white);border:1px solid var(--line);border-radius:var(--r);padding:28px 20px;box-shadow:0 40px 80px -50px rgba(16,36,58,.55)}
@media(min-width:900px){.sc-card{padding:48px}}
.sc-url{display:grid;gap:8px;margin-bottom:28px;padding-bottom:24px;border-bottom:1px solid var(--line)}
.sc-url label{font-weight:700;font-size:1.0625rem}.sc-url label span{font-weight:400;font-size:.875rem;color:var(--muted);margin-left:6px}
.sc-url input{width:100%;min-height:52px;border:1.5px solid #B9C3CF;border-radius:12px;padding:12px 14px;font:inherit;font-size:1rem;color:var(--text);background:var(--white)}
.sc-url input:focus{border-color:var(--navy);outline:3px solid rgba(16,36,58,.15);outline-offset:0}
.sc-step{font-size:.875rem;color:var(--muted);display:flex;justify-content:space-between;gap:12px}
.sc-q{font-family:var(--font-display);font-weight:700;font-size:clamp(1.6rem,2.8vw,2.3rem);line-height:1.1;margin-top:18px;text-wrap:balance}
.sc-hint{color:var(--muted);margin-top:12px;max-width:52ch}
.sc-ans{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:28px}
.sc-ans .opt{text-align:center;font-weight:700;min-height:56px;padding:12px 8px}
.sc-ans .opt:hover,.sc-ans .opt:focus-visible{border-color:var(--navy);background:#F3F5F8}
.sc-res .num{color:var(--navy)}.sc-res .num em{color:var(--gold-ink)}
.sc-res h3{font-family:var(--font-display);font-size:clamp(1.8rem,3vw,2.5rem);margin-top:14px}
.sc-res>p{color:var(--muted);margin-top:10px;max-width:56ch}
.sc-fix{list-style:none;margin:24px 0 0;padding:0;display:grid;gap:12px}
.sc-fix li{display:grid;grid-template-columns:24px 1fr;gap:12px;font-size:1rem;padding-top:12px;border-top:1px solid var(--line)}
.sc-fix li svg{width:22px;height:22px;color:var(--navy);margin-top:2px}
.sc-fix b{display:block;font-size:1.0625rem}.sc-fix span{color:var(--muted)}
.sc-meter{display:flex;gap:6px;margin-top:18px}.sc-meter i{flex:1;height:6px;border-radius:6px;background:var(--line)}.sc-meter i.on{background:var(--navy)}
/* funnel: faq */
.faq-grid{display:grid;gap:32px}@media(min-width:1000px){.faq-grid{grid-template-columns:5fr 7fr;gap:80px}}
.faq{border-top:1px solid var(--line)}
.faq details{border-bottom:1px solid var(--line)}
.faq summary{list-style:none;display:flex;justify-content:space-between;align-items:center;gap:20px;min-height:64px;padding:18px 0;cursor:pointer;font-family:var(--font-heading);font-weight:700;font-size:1.2rem;line-height:1.3}
.faq summary::-webkit-details-marker{display:none}
.faq summary svg{width:22px;height:22px;flex:none;color:var(--navy);transition:transform .3s var(--ease)}
.faq details[open] summary svg{transform:rotate(45deg)}
.faq details p{color:var(--muted);padding:0 0 22px;max-width:62ch}
/* funnel: sticky mobile bar */
.mbar{position:fixed;left:0;right:0;bottom:0;z-index:40;display:flex;gap:10px;padding:10px 16px calc(10px + env(safe-area-inset-bottom));background:rgba(11,26,43,.96);box-shadow:0 -1px 0 rgba(245,241,232,.12);transform:translateY(110%);transition:transform .35s var(--ease)}
.mbar.on{transform:none}
.mbar .btn{flex:1;min-height:48px;padding:0 12px;font-size:.95rem}
.mbar .btn-line{color:var(--ivory)}
@media(min-width:900px){.mbar{display:none}}
@media(max-width:899px){.ftr{padding-bottom:96px}}
'''
rep('.paths-note{margin-top:20px}', '.paths-note{margin-top:20px}' + CSS.rstrip('\n'))

# ---------- icons ----------
ICONS = ('<symbol id="i-gauge" viewBox="0 0 24 24"><path d="M4 17a8 8 0 1116 0M12 17l4-5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></symbol>\n'
         '<symbol id="i-clock" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M12 7.5V12l3 2" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></symbol>\n'
         '<symbol id="i-gap" viewBox="0 0 24 24"><path d="M14.5 5.5a4 4 0 00-5 5L4 16l4 4 5.5-5.5a4 4 0 005-5l-2.6 2.6-2.4-.6-.6-2.4z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></symbol>\n'
         '<symbol id="i-plus" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></symbol>\n'
         '</svg>\n\n<a href="#main" class="sr">Skip to content</a>')
rep('</svg>\n\n<a href="#main" class="sr">Skip to content</a>', ICONS)

# ---------- nav ----------
NAV_OLD = '<li><a href="#data">The data</a></li><li><a href="#solution">Solution</a></li><li><a href="#services">Services</a></li><li><a href="#example">Examples</a></li><li><a href="#process">Process</a></li>'
NAV_NEW = '<li><a href="#score">Your score</a></li><li><a href="#solution">Solution</a></li><li><a href="#services">Services</a></li><li><a href="#example">Examples</a></li><li><a href="#faq">FAQ</a></li>'
rep(NAV_OLD, NAV_NEW)
rep('<a class="row" href="#data">The data</a><a class="row" href="#solution">Solution</a><a class="row" href="#services">Services</a><a class="row" href="#example">Examples</a><a class="row" href="#process">Process</a>',
    '<a class="row" href="#score">Your score</a><a class="row" href="#solution">Solution</a><a class="row" href="#services">Services</a><a class="row" href="#example">Examples</a><a class="row" href="#faq">FAQ</a>')

# ---------- hero ----------
rep('<p class="sub">We build websites, and make good ones better. From quick upgrades to complete digital transformations.</p>\n<div class="ctas"><a class="btn btn-gold" href="#intake">Start Your Project</a><a class="btn btn-line" href="#data">See the data</a></div>',
    '<p class="sub">We build websites, and make good ones better. See where yours stands in 60 seconds.</p>\n<div class="ctas"><a class="btn btn-gold" href="#score">Get My Score</a><a class="btn btn-line" href="#intake">Start Your Project</a></div>')

# ---------- scorecard section (after data, before solution) ----------
SCORE = '''<section class="band cool" id="score" aria-labelledby="sc-h">
<div class="wrap sc-grid">
<div class="sc-intro rv-up">
<h2 id="sc-h">How does <em>your website</em> score?</h2>
<p class="lead">Six quick checks built on the research above. About a minute. Nothing is sent until you choose to send it.</p>
<ul class="sc-why">
<li><span class="tile"><svg class="ico" aria-hidden="true"><use href="#i-clock"/></svg></span>About 60 seconds</li>
<li><span class="tile"><svg class="ico" aria-hidden="true"><use href="#i-search"/></svg></span>See exactly where visitors slip away</li>
<li><span class="tile"><svg class="ico" aria-hidden="true"><use href="#i-gauge"/></svg></span>Get a recommended path, not a sales pitch</li>
</ul>
</div>
<div class="sc-card rv-up">
<div class="sc-url"><label for="sc-url">Your website<span>Optional</span></label><input id="sc-url" type="text" inputmode="url" autocomplete="url" placeholder="yourwebsite.com" maxlength="300"></div>
<div id="sc-body" aria-live="polite"></div>
</div>
</div>
</section>

<section class="band" id="solution" aria-labelledby="sol-h">'''
rep('<section class="band" id="solution" aria-labelledby="sol-h">', SCORE)

# ---------- services: drop finder, point to scorecard ----------
FINDER = '''<p class="small paths-note rv-up">Every project starts with a written scope. Price and timing are agreed before work begins.</p>

<div class="finder rv-up" id="finder" aria-labelledby="finder-h">
<div>
<h3 id="finder-h">Not sure which? Find your path in three taps.</h3>
<div class="prog" aria-hidden="true"><i></i><i></i><i></i></div>
</div>
<div aria-live="polite" id="finder-body"></div>
</div>'''
rep(FINDER, '<p class="small paths-note rv-up">Every project starts with a written scope. Price and timing are agreed before work begins. Not sure which fits? <a href="#score">Get your score</a> and we will recommend one.</p>')

# ---------- FAQ (before intake) ----------
def q(title, body):
    return ('<details><summary>' + title + '<svg aria-hidden="true"><use href="#i-plus"/></svg></summary><p>' + body + '</p></details>')
FAQ = ('<section class="band" id="faq" aria-labelledby="faq-h">\n<div class="wrap faq-grid">\n<div class="rv-up"><h2 id="faq-h">Good questions, <em>straight answers.</em></h2><p class="lead">Still deciding? Start here.</p></div>\n<div class="faq rv-up">\n'
       + q('Do I need a whole new website?', 'Not always. Many sites need focused upgrades: fixing pages, links and forms, refreshing content and photos, and improving mobile, speed and search. Your score above points to the path that fits.') + '\n'
       + q('How is pricing decided?', 'Every project starts with a written scope. Price and timing are agreed before any work begins, so there are no surprises.') + '\n'
       + q('Who will I work with?', 'Your project details are reviewed personally by Jamaal T. Peavy, Founder and Lead Integrator. You will get a reply to set up a short call.') + '\n'
       + q('Can my website connect to booking, email or a CRM?', 'Yes. Buildouts can include intake, booking and CRM connections, so confirmations and follow up happen without manual copying.') + '\n'
       + q('Will you need my passwords?', 'No. We never ask for passwords or login details in the project form.') + '\n'
       + '</div>\n</div>\n</section>\n\n<section class="band cool" id="intake" aria-labelledby="in-h">')
rep('<section class="band cool" id="intake" aria-labelledby="in-h">', FAQ)

# ---------- intake tweaks ----------
m = re.search(r'<div class="f"><label class="t" for="f-concept">.*?</select></div>', s, re.S)
rep(m.group(0), '<div class="f"><label class="t" for="f-start">Is there a website you would like us to start from?<span class="opt-l">Optional</span></label><input id="f-start" name="start_from_site" type="text" maxlength="300" placeholder="A site you admire, or your current one"></div>')
rep('<input type="hidden" name="project_path">', '<input type="hidden" name="project_path">\n<input type="hidden" name="website_score">')

# ---------- finale + footer labels ----------
rep('<div class="ctas"><a class="btn btn-gold" href="#intake">Let’s Build Something Better</a></div>',
    '<div class="ctas"><a class="btn btn-gold" href="#intake">Start Your Project</a><a class="btn btn-line" href="#score">Get My Score</a></div>')
rep('<div><h4>This page</h4><ul><li><a href="#data">The data</a></li>', '<div><h4>This page</h4><ul><li><a href="#score">Your score</a></li>')

# ---------- sticky mobile bar (before footer) ----------
rep('</main>\n\n<footer class="ftr">',
    '</main>\n<div class="mbar" id="mbar" aria-label="Quick actions"><a class="btn btn-line" href="#score">Get My Score</a><a class="btn btn-gold" href="#intake">Start Your Project</a></div>\n\n<footer class="ftr">')

# ---------- JS: replace finder with scorecard ----------
i0 = s.index('/* path finder */'); i1 = s.index('drawF();\n', i0) + len('drawF();\n')
FINDER_JS = s[i0:i1]
SC_JS = r'''/* website scorecard */
var SQ=[
['Does your site load in under three seconds on a phone?','Speed is the first impression most visitors never get past.','Make it fast','53% of mobile visits are abandoned after three seconds.','Slow on phones'],
['Does it look and work right on a phone?','Menus, buttons and forms that are easy to use with a thumb.','Rebuild the phone experience','6 in 10 web visits happen on a mobile device.','Not built for phones'],
['Would a first-time visitor know what you do within five seconds?','Who you serve, what you offer and where, in the first screen.','Say it in the first screen','People judge a site in about 50 milliseconds.','Unclear first screen'],
['Does the design look current and trustworthy?','Would you hire you, based on the site alone?','Refresh the design','Visual design was the most mentioned trust factor in Stanford’s study.','Dated or untrustworthy design'],
['Is there one clear next step on every page?','Book, call, donate or ask. One obvious action, everywhere.','Give every page one clear action','An obvious next step is how a visit becomes an inquiry.','No clear next step'],
['Do new inquiries land in your inbox, calendar or CRM automatically?','No copying form entries by hand, no messages lost in a spam folder.','Connect your systems','Confirmations and follow up happen without manual admin.','Manual or missed inquiries']];
var sA=[],sb=$('#sc-body'),sURL=$('#sc-url'),TICK='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',GAP='<svg viewBox="0 0 24 24" aria-hidden="true"><use href="#i-gap"/></svg>';
function el(t,c,x){var e=d.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e}
function drawS(){sb.innerHTML='';if(sA.length<SQ.length){var k=sA.length,qq=SQ[k],fs=el('div','fq');fs.setAttribute('role','group');fs.setAttribute('aria-labelledby','sc-qt');var st=el('div','sc-step');st.appendChild(el('span','', 'Check '+(k+1)+' of '+SQ.length));if(k){var bk=el('button','linkbtn','Back');bk.type='button';bk.style.minHeight='0';bk.style.padding='0';bk.addEventListener('click',function(){sA.pop();drawS();var f=$('.opt',sb);if(f)f.focus()});st.appendChild(bk)}fs.appendChild(st);
var mt=el('div','sc-meter');mt.setAttribute('aria-hidden','true');for(var i=0;i<SQ.length;i++){var ii=el('i',i<k?'on':'');mt.appendChild(ii)}fs.appendChild(mt);
var lg=el('p','sc-q',qq[0]);lg.id='sc-qt';fs.appendChild(lg);fs.appendChild(el('p','sc-hint',qq[1]));var g=el('div','sc-ans');[['Yes',1],['Not sure',0],['No',0]].forEach(function(a){var b=el('button','opt',a[0]);b.type='button';b.addEventListener('click',function(){sA.push({v:a[1],l:a[0]});drawS();var f=sA.length<SQ.length?$('.opt',sb):$('h3',sb);if(f)f.focus()});g.appendChild(b)});fs.appendChild(g);sb.appendChild(fs);return}
var sc=sA.filter(function(a){return a.v}).length,url=sURL.value.trim(),gaps=[];sA.forEach(function(a,i){if(!a.v)gaps.push(i)});
var tier=sc===6?['A strong foundation.','Your site covers the essentials. A few focused upgrades can make it work even harder for you.','Quick Website Jobs & Upgrades']:sc>=4?['Close, with a few leaks.','Visitors may be slipping away at the gaps below. Targeted fixes or a redesign of key pages would close them.','Quick upgrades or a focused redesign']:['Time for a rebuild.','Your website may be turning visitors away before they reach you. A complete buildout fixes the foundation, not just the surface.','A Complete Website Buildout'];
var w=el('div','sc-res');w.appendChild(el('p','small','Your website score'));var n=el('p','num');var nb=el('b','',still?String(sc):'0');n.appendChild(nb);n.appendChild(el('em','','of 6'));w.appendChild(n);var mt2=el('div','sc-meter');mt2.setAttribute('aria-hidden','true');for(var j=0;j<6;j++)mt2.appendChild(el('i',j<sc?'on':''));w.appendChild(mt2);
var h3=el('h3','',tier[0]);h3.tabIndex=-1;w.appendChild(h3);w.appendChild(el('p','',tier[1]));var rp=el('p','small','Recommended: '+tier[2]);rp.style.marginTop='14px';w.appendChild(rp);
if(gaps.length){var ul=el('ul','sc-fix');gaps.forEach(function(i){var li=el('li');li.innerHTML=GAP;var dv=el('div');dv.appendChild(el('b','',SQ[i][2]+(sA[i].l==='Not sure'?' (worth checking)':'')));dv.appendChild(el('span','',SQ[i][3]));li.appendChild(dv);ul.appendChild(li)});w.appendChild(ul)}
var ct=el('div','ctas');var go=el('a','btn btn-gold','Start Your Project');go.href='#intake';var again=el('button','linkbtn','Start over');again.type='button';ct.appendChild(go);ct.appendChild(again);w.appendChild(ct);var nt=el('p','small','Your answers come with you, so you will not repeat yourself. A starting point, not a full audit.');nt.style.marginTop='12px';w.appendChild(nt);sb.appendChild(w);
go.addEventListener('click',function(){var o={},list=gaps.map(function(i){return SQ[i][4]}).join(', ');o.project_type=sc>=5?PT.quick:(url||sc>=3)?PT.redesign:'A completely new website';if(url){o.has_website='Yes';o.website_url=url}
var note='From my website score ('+sc+' of 6)'+(list?': '+list+'.':'.');if(o.project_type===PT.quick)o.task_description=note;else if(o.project_type===PT.redesign)o.frustrations=note;else o.problems_to_solve=note;form.elements.website_score.value=sc+' of 6'+(list?' | gaps: '+list:'')+(url?' | '+url:'');preset(o)});
again.addEventListener('click',function(){sA=[];drawS();$('.opt',sb).focus()});
if(!still){var t0=performance.now();(function tk(x){var p=Math.min(1,(x-t0)/900);nb.textContent=Math.round(sc*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(tk)})(t0)}}
drawS();
/* sticky mobile bar: after the hero, hidden over the scorecard and the form */
var mbar=$('#mbar'),hero=$('#top'),busy={};if('IntersectionObserver'in window){var mio=new IntersectionObserver(function(es){es.forEach(function(e){busy[e.target.id]=e.isIntersecting});var past=hero.getBoundingClientRect().bottom<0;mbar.classList.toggle('on',past&&!busy.score&&!busy.intake)},{threshold:0});['top','score','intake'].forEach(function(id){mio.observe($('#'+id))});addEventListener('scroll',function(){var past=hero.getBoundingClientRect().bottom<0;mbar.classList.toggle('on',past&&!busy.score&&!busy.intake)},{passive:true})}
'''
rep(FINDER_JS, SC_JS)

os.makedirs('scratch/dd5', exist_ok=True)
open(OUT, 'w').write(s)
# verify edits reproduce output
t = src
for e in edits:
    assert t.count(e['find']) == 1
    t = t.replace(e['find'], e['replace'])
assert t == s
json.dump(edits, open('scratch/dd5/edits.json', 'w'), ensure_ascii=False)
print('ok', len(src), len(s), len(edits))
