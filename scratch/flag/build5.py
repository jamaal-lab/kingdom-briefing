"""site4 -> site5: hosted portrait + Inspired House before/after slider."""
import os, re, shutil
s = open('scratch/flag/site4/index.html').read()

# 1) portrait: hosted image instead of base64
s, n = re.subn(r'<img src="data:image/webp;base64,[^"]+" width="200" height="300"',
               '<img src="/images/jamaal-peavy-portrait.jpg" width="1024" height="1535"', s)
assert n == 1

# 2) before/after slider replaces the live desktop iframe
old_desk = s[s.index('<div class="cs-desk">'):s.index('<div class="cs-phone">')]
new_desk = ('<div class="cs-desk"><div class="cs-bar"><i></i><i></i><i></i><span>inspiredhouse.co</span></div>'
 '<div class="cs-ba" id="csba" style="--p:50%">'
 '<img class="ba-before" src="/images/ih-before.jpg" width="2880" height="1800" alt="Before: the previous Inspired House website, a plain template page with a stock photo banner and a contact form." loading="lazy" decoding="async">'
 '<div class="ba-after"><img src="/images/ih-after.jpg" width="2880" height="1800" alt="After: the new inspiredhouse.co, a dark cinematic homepage with a glowing 3D logo, Desmond\'s portrait and a gold Book Desmond button." loading="lazy" decoding="async"></div>'
 '<span class="ba-tag b">Before</span><span class="ba-tag a">After</span>'
 '<div class="ba-line" aria-hidden="true"><span class="ba-knob"><svg viewBox="0 0 24 24"><path d="M9 6l-6 6 6 6M15 6l6 6-6 6"/></svg></span></div>'
 '<input class="ba-range" type="range" min="0" max="100" value="50" aria-label="Compare the old and new Inspired House websites">'
 '</div></div>\n')
s = s.replace(old_desk, new_desk)

s = s.replace('<span>The live site, rendered in real time.</span>',
              '<span>Drag to compare his previous site with the new one. The phone shows the live site.</span>')

CSS = '''
/* before/after slider */
.cs-ba{position:relative;aspect-ratio:16/10;overflow:hidden;background:#0A0A10;touch-action:pan-y;cursor:ew-resize;user-select:none}
.cs-ba img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:top}
.ba-after{position:absolute;inset:0;clip-path:inset(0 0 0 var(--p));will-change:clip-path}
.ba-line{position:absolute;top:0;bottom:0;left:var(--p);width:2px;margin-left:-1px;background:linear-gradient(180deg,#FFE08A,#E2B13C,#FFE08A);box-shadow:0 0 18px rgba(242,193,78,.9),0 0 50px rgba(242,193,78,.5);pointer-events:none}
.ba-knob{position:absolute;top:50%;left:50%;width:58px;height:58px;margin:-29px 0 0 -29px;border-radius:50%;background:linear-gradient(135deg,#FFE9A0,#F2C14E 45%,#C98F28);box-shadow:0 10px 30px -6px rgba(0,0,0,.7),0 0 0 6px rgba(242,193,78,.22);display:grid;place-items:center}
.ba-knob svg{width:26px;height:26px;fill:none;stroke:#071425;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}
.ba-tag{position:absolute;top:18px;padding:7px 14px;border-radius:999px;font-size:.875rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;pointer-events:none;backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px)}
.ba-tag.b{left:18px;background:rgba(10,12,18,.72);color:rgba(245,241,232,.9);border:1px solid rgba(245,241,232,.2)}
.ba-tag.a{right:18px;background:rgba(242,193,78,.92);color:#071425}
.ba-range{position:absolute;inset:0;width:100%;height:100%;margin:0;opacity:0;cursor:ew-resize}
.cs-ba:has(.ba-range:focus-visible) .ba-knob{outline:3px solid #FFE08A;outline-offset:4px}
@media(max-width:699px){.cs-desk{display:block}.cs-phone{margin-top:28px}.ba-knob{width:46px;height:46px;margin:-23px 0 0 -23px}.ba-tag{top:10px;font-size:.875rem;padding:5px 10px}.ba-tag.b{left:10px}.ba-tag.a{right:10px}}
'''
s = s.replace('/* ===== v3: the rebuild showpiece ===== */', CSS + '/* ===== v3: the rebuild showpiece ===== */', 1)

JS = '''<script>
(function(){var ba=document.getElementById('csba');if(!ba)return;var r=ba.querySelector('.ba-range'),drag=false,played=false;
function set(v){v=Math.max(0,Math.min(100,v));ba.style.setProperty('--p',v+'%');r.value=v}
function at(e){var b=ba.getBoundingClientRect();set((e.clientX-b.left)/b.width*100)}
r.addEventListener('input',function(){played=true;set(+r.value)});
ba.addEventListener('pointerdown',function(e){played=true;drag=true;at(e)});
addEventListener('pointermove',function(e){if(drag)at(e)},{passive:true});
addEventListener('pointerup',function(){drag=false});
var calm=document.documentElement.classList.contains('still')||matchMedia('(prefers-reduced-motion: reduce)').matches;
if(calm||!('IntersectionObserver' in window))return;
new IntersectionObserver(function(es,o){es.forEach(function(en){if(!en.isIntersecting||played)return;o.disconnect();
var t0=performance.now();(function f(t){if(played)return;var k=Math.min(1,(t-t0)/2600),e=k<.5?4*k*k*k:1-Math.pow(-2*k+2,3)/2;set(50+Math.sin(e*Math.PI*2)*-40*(1-k*.3));if(k<1)requestAnimationFrame(f);else set(50)})(t0)})},{threshold:.55}).observe(ba)})();
</script>
'''
s = s.replace('</body>', JS + '</body>', 1)

assert 'base64' not in s
os.makedirs('scratch/flag/site5/images', exist_ok=True)
for f in os.listdir('scratch/flag/site4/images'):
    shutil.copy('scratch/flag/site4/images/' + f, 'scratch/flag/site5/images/' + f)
for f in ('jamaal-peavy-portrait.jpg', 'ih-before.jpg', 'ih-after.jpg'):
    shutil.copy('docs/websites/demodrop-flagship/' + f, 'scratch/flag/site5/images/' + f)
open('scratch/flag/site5/index.html', 'w').write(s)
print('ok', len(s))
