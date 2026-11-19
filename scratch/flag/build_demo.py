"""Standalone page for the scroll demo: scratch/flag/site3/index.html -> scratch/flag/demo/rebuild.html"""
import os, re
s = open('scratch/flag/site3/index.html').read()
css = s[s.index('<style>') + 7:s.index('</style>')]
lines = css.split('\n')
keep = []
for n, l in enumerate(lines):
    if n < 45 or re.search(r'\.(rb|ks|rebuild)\b|\.rb-|\.ks-|@keyframes ks|@container|prefers-reduced-motion|^\.still|^:root|^h1,h2|^h2|^h1 em|\.metal|@keyframes sheen|/\* stage|/\* narrow', l):
        keep.append(l)
    elif keep and keep[-1].startswith('@container') or (keep and lines[n-1] in keep and lines[n-1].startswith('@container')):
        keep.append(l)
# the @container block spans several lines: keep everything from its start to its end
ci = css.index('@container (max-width:560px){'); ce = css.index('}}}', ci) + 3
container = css[ci:ce]
body_css = '\n'.join(l for l in keep if not l.startswith('@container') and not (l and l in container))
EXTRA = '''
body{background:#040B16;color:var(--ivory)}
.dtop{position:relative;z-index:2;display:flex;align-items:center;justify-content:space-between;gap:16px;max-width:1600px;margin:0 auto;padding:18px 18px}
@media(min-width:900px){.dtop{padding:22px 48px}}
.dtop a.brand{display:flex;align-items:center;gap:12px;color:var(--ivory);text-decoration:none;font-family:var(--font-heading);font-weight:700}
.dtop img{width:44px;height:44px;border-radius:50%}
.btn{display:inline-flex;align-items:center;justify-content:center;min-height:48px;padding:0 24px;border-radius:999px;font-weight:700;text-decoration:none;background:linear-gradient(135deg,#FFE9A0 0%,#F2C14E 45%,#C98F28 100%);color:#071425;box-shadow:0 16px 44px -14px rgba(242,193,78,.9)}
.dend{max-width:1600px;margin:0 auto;padding:80px 18px 120px;display:flex;flex-wrap:wrap;gap:20px;align-items:center;justify-content:space-between}
@media(min-width:900px){.dend{padding:100px 48px 140px}}
.dend h2{font-size:clamp(2rem,4vw,3.6rem);color:var(--ivory)}
'''
sec = s[s.index('<section class="rebuild" id="rebuild"'):]
sec = sec[:sec.index('</section>') + len('</section>')]
JS = r'''<script>
(function(){var H=document.documentElement,still=matchMedia('(prefers-reduced-motion: reduce)').matches;H.classList.toggle('still',still);
var rbs=document.getElementById('rebuild'),rb=document.getElementById('rb'),rbl=[].slice.call(document.querySelectorAll('.rb-list li'));
function setStage(n){rb.dataset.stage=n;for(var k=2;k<=6;k++)rb.classList.toggle('s'+k,n>=k);rbl.forEach(function(li,i){li.classList.toggle('on',i===n-1);li.classList.toggle('done',i<n-1)})}
function onFrame(){if(still){rbs.classList.add('static');setStage(6);return}var r=rbs.getBoundingClientRect(),span=r.height-innerHeight,p=span>0?Math.min(1,Math.max(0,-r.top/span)):1;setStage(Math.min(6,1+Math.floor(p*6.0001)))}
var t=false;addEventListener('scroll',function(){if(!t){t=true;requestAnimationFrame(function(){t=false;onFrame()})}},{passive:true});addEventListener('resize',onFrame);onFrame()})();
</script>'''
html = ('<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1">\n'
 '<title>Watch a Website Come Alive | Bridge to Better Solutions, LLC</title>\n<meta name="robots" content="noindex">\n'
 '<meta name="description" content="Scroll to watch a quiet website become one that works: structure, typography, design, imagery, journeys and connected systems.">\n'
 '<meta name="theme-color" content="#040B16">\n<link rel="stylesheet" href="https://use.typekit.net/oky1fcu.css">\n<style>\n'
 + body_css + '\n' + container + EXTRA + '</style>\n</head>\n<body>\n'
 '<header class="dtop"><a class="brand" href="/"><img src="/images/btbs-logo.png" width="44" height="44" alt="Bridge to Better Solutions, LLC logo">Bridge to Better Solutions</a><a class="btn" href="/#intake">Start Your Project</a></header>\n'
 '<main>\n' + sec + '\n<div class="dend"><h2>Ready for yours?</h2><a class="btn" href="/#intake">Start Your Project</a></div>\n</main>\n' + JS + '\n</body>\n</html>')
os.makedirs('scratch/flag/demo', exist_ok=True)
open('scratch/flag/demo/rebuild.html', 'w').write(html)
print('ok', len(html), 'base64' in html)
