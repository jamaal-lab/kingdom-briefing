"""site5 -> site6: speed and smoothness pass, crisper emblem."""
import os, shutil
s = open('scratch/flag/site5/index.html').read()
def R(a, b, n=1):
    global s
    c = s.count(a)
    assert c == n, (c, a[:80])
    s = s.replace(a, b)

# --- emblem module: MSAA, adaptive resolution, precompiled shaders
i = s.index('<script type="module">') + len('<script type="module">'); j = s.index('</script>', i)
s = s[:i] + '\n' + open('scratch/flag/medal6.js').read() + s[j:]

# --- network: warm connections, fetch the three.js addon chain in parallel
PRE = ''.join('<link rel="modulepreload" href="https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/%s" crossorigin>' % p for p in (
    'environments/RoomEnvironment.js', 'postprocessing/EffectComposer.js', 'postprocessing/RenderPass.js',
    'postprocessing/UnrealBloomPass.js', 'postprocessing/OutputPass.js', 'postprocessing/Pass.js',
    'postprocessing/ShaderPass.js', 'postprocessing/MaskPass.js', 'shaders/CopyShader.js',
    'shaders/LuminosityHighPassShader.js', 'shaders/OutputShader.js'))
R('<link rel="modulepreload" href="https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.min.js" crossorigin>',
  '<link rel="modulepreload" href="https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.min.js" crossorigin>' + PRE)
R('<link rel="stylesheet" href="https://use.typekit.net/oky1fcu.css">',
  '<link rel="preconnect" href="https://use.typekit.net" crossorigin><link rel="preconnect" href="https://p.typekit.net" crossorigin><link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>'
  '<link rel="stylesheet" href="https://use.typekit.net/oky1fcu.css">')

# --- images: 1.7 MB logo -> 14 KB; hero photo only when 3D can't run
R('src="/images/btbs-logo.png"', 'src="/images/btbs-logo-160.webp"', 2)
R('<img class="hero-poster" src="/images/bridge-gold-3840.jpg" srcset="/images/bridge-gold-1920.jpg 1920w, /images/bridge-gold-3840.jpg 3840w" sizes="100vw"',
  '<img class="hero-poster" data-src="/images/bridge-gold-1920.jpg" data-srcset="/images/bridge-gold-1920.jpg 1920w, /images/bridge-gold-3840.jpg 3840w" sizes="100vw"')
R('<canvas id="hero-gl" aria-hidden="true"></canvas>',
  '<canvas id="hero-gl" aria-hidden="true"></canvas><script>(function(){var i=document.querySelector(".hero-poster");if(!i)return;var ok=false;try{ok=!!document.createElement("canvas").getContext("webgl2")}catch(e){}'
  'function go(){if(i.dataset.src){i.sizes="100vw";i.srcset=i.dataset.srcset;i.src=i.dataset.src;i.removeAttribute("data-src")}}if(!ok)go();else setTimeout(function(){if(!document.documentElement.classList.contains("gl-on"))go()},5000)})()</script>')
R('.hero3d .hero-poster{transition:opacity 1.6s ease}',
  '.hero3d .hero-poster{transition:opacity 1.6s ease;color:transparent}.hero3d{background:#040B16 radial-gradient(60% 75% at 67% 50%,#1C4486 0,#0F2850 32%,#071530 70%,#040B16 100%)}')

# --- Desmond's phone: a crisp screenshot instead of loading his whole live site
R('<div class="cs-phone"><div class="cs-view" data-w="390"><iframe src="https://inspiredhouse.co" title="Inspired House on a phone, live" loading="lazy" tabindex="-1"></iframe></div></div>',
  '<div class="cs-phone"><div class="cs-view"><img src="/images/ih-phone.jpg" width="780" height="1688" alt="The new inspiredhouse.co on a phone: Desmond D. Davis, Burnout isn\'t solved by pushing harder, with a gold Book Desmond to Speak button." loading="lazy" decoding="async"></div></div>')
R('.cs-phone .cs-view{aspect-ratio:9/19.5}', '.cs-phone .cs-view{aspect-ratio:9/19.5}.cs-phone .cs-view img{width:100%;height:100%;object-fit:cover;object-position:top}')
R("var f=v.querySelector('iframe'),w=+v.dataset.w,k=v.clientWidth/w;if(!k)return;", "var f=v.querySelector('iframe'),w=+v.dataset.w,k=v.clientWidth/w;if(!k||!f)return;")
R('<span>Drag to compare his previous site with the new one. The phone shows the live site.</span>',
  '<span>Drag to compare his previous site with the new one.</span>')

# --- paint cost: no live blur over moving layers
R('.hdr.solid{background:rgba(5,14,26,.82);backdrop-filter:blur(14px) saturate(1.4);-webkit-backdrop-filter:blur(14px) saturate(1.4)}',
  '.hdr.solid{background:rgba(5,14,26,.94)}')
R('.rb.s3 .ks-cards div{border:1px solid rgba(246,238,223,.18);background:rgba(246,238,223,.08);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px)}',
  '.rb.s3 .ks-cards div{border:1px solid rgba(246,238,223,.18);background:rgba(28,44,36,.72)}')
R('box-shadow:0 30px 60px -20px rgba(0,0,0,.8),0 0 40px -10px rgba(242,193,78,.45);backdrop-filter:blur(12px);color:var(--ivory)}',
  'box-shadow:0 30px 60px -20px rgba(0,0,0,.8),0 0 40px -10px rgba(242,193,78,.45);color:var(--ivory)}')
R('border-radius:50%;filter:blur(110px);opacity:.55;background-color:#2563D2;transition:background-color 1.2s var(--ease);z-index:0;pointer-events:none}',
  'border-radius:50%;opacity:.6;color:#2563D2;background:radial-gradient(closest-side,currentColor,transparent);transform:scale(1.5);transition:color 1.2s var(--ease);z-index:0;pointer-events:none}')
for k, c in (('2', '#E9D6AA'), ('3', '#2F7A55'), ('4', '#E9A465'), ('5', '#C8643B'), ('6', '#F2C14E')):
    R('.rebuild[data-s="%s"] .rb-glow{background-color:%s}' % (k, c), '.rebuild[data-s="%s"] .rb-glow{color:%s}' % (k, c))
R('transform:translateX(-130%);mix-blend-mode:screen}', 'transform:translateX(-130%);will-change:transform}')
# the 3D tilt is driven from script now (no per-frame style recalculation of the whole mock)
R('.rb{position:relative;z-index:2;transform-style:preserve-3d;transform:rotateY(calc(var(--mx,0) * -9deg - 5deg)) rotateX(calc(var(--my,0) * 7deg + 3deg));transition:transform .25s linear,scale .9s var(--ease)}',
  '.rb{position:relative;z-index:2;transform:rotateY(-5deg) rotateX(3deg);transition:scale .9s var(--ease);will-change:transform}')
R('@media(max-width:999px){.rb{transform:rotateX(calc(var(--my,0) * 4deg + 2deg))}}', '@media(max-width:999px){.rb{transform:rotateX(2deg)}}')
R('.still .rb{transform:none}', '.still .rb{transform:none!important}')
R('@media(prefers-reduced-motion:reduce){.rb{transform:none}', '@media(prefers-reduced-motion:reduce){.rb{transform:none!important}')

old_tick = ("var mx=0,my=0,tx=0,ty=0,raf=0;\n"
"addEventListener('pointermove',function(e){tx=e.clientX/innerWidth-.5;ty=e.clientY/innerHeight-.5;kick()},{passive:true});\n"
"function tick(){raf=0;mx+=(tx-mx)*.08;my+=(ty-my)*.08;var r=sec.getBoundingClientRect(),span=r.height-innerHeight,p=span>0?Math.min(1,Math.max(0,-r.top/span)):1,lp=Math.min(1,(p*6)%1+(p>=1?1:0));\n"
"rb.style.setProperty('--mx',mx.toFixed(3));rb.style.setProperty('--my',my.toFixed(3));rb.style.setProperty('--lp',lp.toFixed(3));if(Math.abs(tx-mx)>.002||Math.abs(ty-my)>.002)kick()}\n"
"function kick(){if(!raf&&!still())raf=requestAnimationFrame(tick)}\n"
"addEventListener('scroll',kick,{passive:true});tick();\n")
new_tick = ("var art=rb.querySelector('.ks-art'),mx=0,my=0,tx=0,ty=0,raf=0,inView=false,lmx=9,llp=9;\n"
"if('IntersectionObserver' in window)new IntersectionObserver(function(es){inView=es[0].isIntersecting;if(inView)kick()}).observe(sec);else inView=true;\n"
"addEventListener('pointermove',function(e){tx=e.clientX/innerWidth-.5;ty=e.clientY/innerHeight-.5;if(inView)kick()},{passive:true});\n"
"function tick(){raf=0;if(!inView)return;mx+=(tx-mx)*.08;my+=(ty-my)*.08;var r=sec.getBoundingClientRect(),span=r.height-innerHeight,p=span>0?Math.min(1,Math.max(0,-r.top/span)):1,lp=Math.min(1,(p*6)%1+(p>=1?1:0));\n"
"rb.style.transform=innerWidth>=1000?'rotateY('+(mx*-9-5).toFixed(2)+'deg) rotateX('+(my*7+3).toFixed(2)+'deg)':'rotateX('+(my*4+2).toFixed(2)+'deg)';\n"
"if(art&&rb.classList.contains('s4')&&(Math.abs(mx-lmx)>.003||Math.abs(lp-llp)>.004)){lmx=mx;llp=lp;art.style.setProperty('--mx',mx.toFixed(3));art.style.setProperty('--lp',lp.toFixed(3))}\n"
"if(Math.abs(tx-mx)>.002||Math.abs(ty-my)>.002)kick()}\n"
"function kick(){if(!raf&&!still())raf=requestAnimationFrame(tick)}\n"
"addEventListener('scroll',function(){if(inView)kick()},{passive:true});tick();\n")
R(old_tick, new_tick)
R("var up=+s>+last;last=s;sec.dataset.s=s;if(still())return;", "var up=+s>+last;last=s;sec.dataset.s=s;lmx=9;kick();if(still())return;")

assert 'base64' not in s
os.makedirs('scratch/flag/site6/images', exist_ok=True)
for f in os.listdir('scratch/flag/site5/images'):
    shutil.copy('scratch/flag/site5/images/' + f, 'scratch/flag/site6/images/' + f)
for f in ('btbs-logo-160.webp', 'ih-phone.jpg'):
    shutil.copy('docs/websites/demodrop-flagship/' + f, 'scratch/flag/site6/images/' + f)
open('scratch/flag/site6/index.html', 'w').write(s)
print('ok', len(s))
