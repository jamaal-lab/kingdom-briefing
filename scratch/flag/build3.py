"""Flagship v3: the Rebuild demo becomes a showpiece. Input site2 -> site3."""
import os, re
s = open('scratch/flag/site2/index.html').read()

def rep(old, new, count=1):
    global s
    assert s.count(old) == count, ('match count', s.count(old), old[:90])
    s = s.replace(old, new)

# ---- new mock site markup ----
i = s.index('<div class="rb" id="rb"')
end = 'Booking confirmed. Calendar and CRM updated.</div>\n</div>\n</div>'
j = s.index(end, i) + len(end)
LEAF = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21c-5-3-8-7-8-11a4 4 0 018-1 4 4 0 018 1c0 4-3 8-8 11z" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>'
ART = '''<svg class="ks-art" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
<defs><linearGradient id="ksSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1C3A30"/><stop offset=".45" stop-color="#9C5A3C"/><stop offset=".72" stop-color="#E9A465"/><stop offset="1" stop-color="#F7D9A3"/></linearGradient>
<radialGradient id="ksSun" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFF4D6"/><stop offset=".45" stop-color="#FCDFA2"/><stop offset="1" stop-color="#F8C27A" stop-opacity="0"/></radialGradient>
<linearGradient id="ksMist" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF6E6" stop-opacity="0"/><stop offset="1" stop-color="#FFF6E6" stop-opacity=".35"/></linearGradient></defs>
<rect width="1600" height="1000" fill="url(#ksSky)"/>
<g class="l0"><circle cx="1110" cy="560" r="260" fill="url(#ksSun)"/><circle cx="1110" cy="560" r="96" fill="#FFF1CF"/></g>
<path class="l1" d="M0 640 C220 560 380 600 560 560 S900 470 1100 540 S1450 520 1600 560 V1000 H0Z" fill="#B46F4E" opacity=".75"/>
<rect class="l1" y="560" width="1600" height="180" fill="url(#ksMist)"/>
<path class="l2" d="M0 720 C260 640 470 700 700 660 S1080 600 1300 660 S1520 650 1600 640 V1000 H0Z" fill="#6F8A68"/>
<path class="l3" d="M0 820 C240 760 520 800 760 770 S1180 730 1600 790 V1000 H0Z" fill="#2F4B3D"/>
<path class="l4" d="M0 900 C300 860 640 880 980 860 S1400 880 1600 870 V1000 H0Z" fill="#162A21"/>
<g class="l5" fill="#0F2019"><path d="M1390 1000 C1380 860 1400 760 1450 660 C1480 600 1520 560 1560 540 C1540 600 1520 660 1490 720 C1530 690 1570 680 1600 680 V1000Z"/><path d="M1470 760 C1410 720 1370 660 1360 600 C1420 620 1460 680 1470 760Z"/><path d="M1520 690 C1560 620 1600 600 1600 600 V700Z"/></g>
</svg>'''
MOCK = ('<div class="rb" id="rb" data-stage="1" aria-hidden="true">\n'
 '<div class="rb-bar"><i></i><i></i><i></i><span>kindred.example</span></div>\n'
 '<div class="ks">\n' + ART + '\n<div class="ks-scrim"></div><div class="ks-grid"></div>\n'
 '<div class="ks-nav" data-wf="NAV"><span class="ks-logo">' + LEAF + 'Kindred</span><span class="ks-links"><i>Treatments</i><i>Studio</i><i>Journal</i></span><span class="ks-cta">Book</span></div>\n'
 '<div class="ks-hero" data-wf="HERO"><p class="ks-kick">Massage, movement and care</p><h4>Feel at home in your body <em>again.</em></h4><p class="ks-sub">Restorative treatments and small group classes, booked in seconds.</p><span class="ks-btn">Book a session</span></div>\n'
 '<div class="ks-cards" data-wf="SERVICES"><div><b>Massage</b><span>60 or 90 minutes</span></div><div><b>Movement</b><span>Small group classes</span></div><div><b>Care plans</b><span>Built around you</span></div></div>\n'
 '<div class="ks-sys"><span><svg viewBox="0 0 24 24"><rect x="4" y="5" width="16" height="15" rx="2.5"/><path d="M4 10h16M9 3v4M15 3v4"/></svg>Calendar</span><span><svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="3.5"/><path d="M5 20c1-4 4-6 7-6s6 2 7 6"/></svg>CRM</span><span><svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M4 7l8 6 8-6"/></svg>Email</span></div>\n'
 '<div class="ks-book"><b>Choose a time</b><div class="ks-days"><i>Wed 12</i><i class="on">Thu 13</i><i>Fri 14</i></div><div class="ks-slots"><i>9:00</i><i class="pick">11:30</i><i>2:00</i><i>4:30</i></div><span class="ks-confirm"><span class="a">Confirm booking</span><span class="b">Booked for Thursday, 11:30</span></span></div>\n'
 '<svg class="ks-ptr" viewBox="0 0 24 24"><path d="M5 3l14 8-6 1.6L10 19z" fill="#fff" stroke="#111" stroke-width="1.4" stroke-linejoin="round"/></svg>\n'
 '<div class="ks-toast"><svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>Booking confirmed. Calendar and CRM updated.</div>\n'
 '</div>\n</div>')
s = s[:i] + MOCK + s[j:]

CSS = r'''
/* ===== v3: the rebuild showpiece ===== */
.rebuild{background:#040B16;background-image:radial-gradient(50% 45% at 80% 40%,rgba(37,99,210,.4),transparent 70%),radial-gradient(40% 40% at 10% 90%,rgba(242,193,78,.12),transparent 70%)}
.rb-text h2{color:var(--ivory)}.rb-text h2 em{background:var(--metal);background-size:220% 100%;-webkit-background-clip:text;background-clip:text;color:transparent}
.rb-text .lead{color:rgba(245,241,232,.75)}
.rb-list li{border-left-color:rgba(245,241,232,.16)}.rb-list li b{color:var(--ivory)}.rb-list li span{color:#FFE08A}.rb-list li p{color:rgba(245,241,232,.72)}
.rb-list li.on{border-left-color:#F2C14E}
.rebuild .rb-note{color:rgba(245,241,232,.6)}
.rb{border:1px solid rgba(245,241,232,.14);background:#0A0D14;box-shadow:0 80px 160px -60px rgba(0,0,0,.95),0 0 0 1px rgba(226,177,60,.16),0 0 140px -30px rgba(37,99,210,.6)}
.rb-bar{background:#14161D;border-bottom:1px solid rgba(255,255,255,.06)}.rb-bar i{background:#3A3D48}.rb-bar span{color:rgba(245,241,232,.6)}
.ks{position:relative;aspect-ratio:16/10;overflow:hidden;container-type:inline-size;background:#0F2A4A;color:#EAF3FF;font-family:var(--font-body);transition:background-color .9s var(--ease),color .9s var(--ease)}
@media(max-width:999px){.ks{aspect-ratio:4/5}}
.ks *{transition:color .7s var(--ease),background-color .7s var(--ease),border-color .7s var(--ease),opacity .8s var(--ease),transform .9s var(--ease),box-shadow .7s var(--ease),outline-color .5s}
.ks-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(140,190,255,.16) 1px,transparent 1px),linear-gradient(90deg,rgba(140,190,255,.16) 1px,transparent 1px);background-size:4cqw 4cqw}
.ks-art{position:absolute;inset:0;width:100%;height:100%;opacity:0}
.ks-art>*{transform:translateY(6%)}.ks-art .l0{transform:translateY(14%)}
.ks-scrim{position:absolute;inset:0;background:linear-gradient(90deg,rgba(16,32,25,.94) 0%,rgba(16,32,25,.7) 38%,rgba(16,32,25,0) 70%),linear-gradient(0deg,rgba(16,32,25,.85) 0%,rgba(16,32,25,0) 40%);opacity:0}
.ks-nav{position:absolute;left:5%;right:5%;top:5%;display:flex;align-items:center;justify-content:space-between;font-size:1.55cqw}
.ks-logo{display:flex;gap:.7cqw;align-items:center;font-weight:700;font-size:2.1cqw}.ks-logo svg{width:2.6cqw;height:2.6cqw;opacity:0}
.ks-links{display:flex;gap:2.8cqw}.ks-links i{font-style:normal}
.ks-cta{padding:.7cqw 2cqw;border-radius:99px;border:1px solid currentColor;font-weight:700}
.ks-hero{position:absolute;left:5%;top:21%;width:50%}
.ks-kick{font-size:1.3cqw;letter-spacing:.22em;text-transform:uppercase;opacity:.8}
.ks h4{font-family:var(--font-body);font-weight:700;font-size:5.4cqw;line-height:1;letter-spacing:-.02em;margin-top:1.4cqw}
.ks h4 em{font-style:normal}
.ks-sub{font-size:1.65cqw;line-height:1.5;margin-top:1.6cqw;opacity:.85;max-width:36ch}
.ks-btn{display:inline-block;margin-top:2.4cqw;padding:1.2cqw 2.6cqw;border-radius:99px;font-size:1.5cqw;font-weight:700;border:1px solid currentColor}
.ks-cards{position:absolute;left:5%;bottom:6%;width:54%;display:grid;grid-template-columns:repeat(3,1fr);gap:1.2cqw}
.ks-cards div{padding:1.5cqw;border-radius:1.2cqw;border:1px dashed rgba(234,243,255,.5);font-size:1.25cqw;display:grid;gap:.3cqw}.ks-cards b{font-size:1.65cqw}
.ks-book{position:absolute;right:5%;bottom:7%;width:31%;padding:2cqw;border-radius:1.8cqw;background:rgba(255,252,246,.97);color:#1E2A24;box-shadow:0 3cqw 7cqw -2cqw rgba(0,0,0,.6);opacity:0;transform:translateY(5cqw) scale(.94)}
.ks-book b{font-size:1.7cqw;font-family:var(--font-display)}
.ks-days,.ks-slots{display:grid;gap:.7cqw;margin-top:1.2cqw}.ks-days{grid-template-columns:repeat(3,1fr)}.ks-slots{grid-template-columns:repeat(2,1fr)}
.ks-days i,.ks-slots i{font-style:normal;text-align:center;font-size:1.25cqw;padding:.8cqw 0;border-radius:.9cqw;border:1px solid #E4DCCE}
.ks-days i.on{background:#1E3A2E;border-color:#1E3A2E;color:#fff}
.ks-confirm{position:relative;display:block;margin-top:1.4cqw;padding:1.1cqw 0;border-radius:99px;background:#C8643B;color:#fff;text-align:center;font-size:1.35cqw;font-weight:700;overflow:hidden}
.ks-confirm .b{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:#2F7A55;opacity:0}
.ks-ptr{position:absolute;width:3cqw;height:3cqw;left:22%;top:66%;opacity:0;filter:drop-shadow(0 .4cqw .6cqw rgba(0,0,0,.5))}
.ks-toast{position:absolute;left:50%;top:11%;display:flex;align-items:center;gap:.8cqw;background:#0F1F18;color:#fff;border:1px solid rgba(157,217,181,.45);font-size:1.4cqw;padding:1cqw 2cqw;border-radius:99px;white-space:nowrap;box-shadow:0 2cqw 4cqw -1.5cqw rgba(0,0,0,.7);opacity:0;transform:translate(-50%,-3cqw)}
.ks-toast svg{width:1.8cqw;height:1.8cqw;fill:none;stroke:#9DD9B5;stroke-width:2.6;stroke-linecap:round;stroke-linejoin:round}
.ks-sys{position:absolute;right:5%;top:24%;width:31%;display:flex;justify-content:space-between;opacity:0}
.ks-sys::before{content:"";position:absolute;left:12%;right:12%;top:2.6cqw;height:2px;background:linear-gradient(90deg,#F2C14E,#FFE08A,#F2C14E);transform:scaleX(0);transform-origin:0 50%;transition:transform 1.2s var(--ease) .5s}
.ks-sys span{position:relative;display:grid;justify-items:center;gap:.8cqw;font-size:1.2cqw;color:#F6EEDF}
.ks-sys svg{width:5.2cqw;height:5.2cqw;padding:1.3cqw;border-radius:50%;background:rgba(15,31,24,.85);border:1px solid rgba(246,238,223,.25);fill:none;stroke:#F6EEDF;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round;box-sizing:border-box}
/* stage 1: blueprint wireframe */
.rb[data-stage="1"] .ks :is(.ks-logo,.ks-links i,.ks-cta,.ks-kick,h4,.ks-sub,.ks-btn,.ks-cards b,.ks-cards span){color:transparent;background:rgba(140,190,255,.2);border-radius:.4cqw;border-color:transparent}
.rb[data-stage="1"] [data-wf]{outline:1.5px dashed rgba(140,190,255,.7);outline-offset:1cqw}
.ks [data-wf]::after{content:attr(data-wf);position:absolute;left:0;top:-3.2cqw;font:700 1.1cqw/1 ui-monospace,Menlo,monospace;letter-spacing:.14em;color:#8EC1FF;opacity:0;transition:opacity .4s}
.rb[data-stage="1"] .ks [data-wf]::after{opacity:1}
/* stage 2: typography on warm paper */
.rb.s2 .ks{background:#F3EEE5;color:#1E2A24}.rb.s2 .ks-grid{opacity:0}
.rb.s2 .ks h4{font-family:var(--font-display);letter-spacing:-.01em;font-size:5.8cqw}.rb.s2 .ks h4 em{font-style:italic;font-weight:400}
.rb.s2 .ks-cards div{border-color:rgba(30,42,36,.3)}
/* stage 3: a brand of its own */
.rb.s3 .ks{background:#13241D;color:#F6EEDF}
.rb.s3 .ks-logo svg{opacity:1;color:#F2B880}
.rb.s3 .ks h4{color:#F6EEDF}.rb.s3 .ks h4 em{color:#F2B880}
.rb.s3 .ks-kick{color:#F2B880;opacity:1}
.rb.s3 .ks-cta,.rb.s3 .ks-btn{background:#C8643B;border-color:#C8643B;color:#fff}
.rb.s3 .ks-btn{box-shadow:0 1.6cqw 3.4cqw -1.2cqw rgba(200,100,59,.9)}
.rb.s3 .ks-cards div{border:1px solid rgba(246,238,223,.18);background:rgba(246,238,223,.08);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px)}
/* stage 4: imagery rises in */
.rb.s4 .ks-art{opacity:1}.rb.s4 .ks-scrim{opacity:1}
.rb.s4 .ks-art>*{transform:none}.rb.s4 .ks-art .l1{transition-delay:.1s}.rb.s4 .ks-art .l2{transition-delay:.2s}.rb.s4 .ks-art .l3{transition-delay:.3s}.rb.s4 .ks-art .l4{transition-delay:.4s}.rb.s4 .ks-art .l5{transition-delay:.5s}
.rb.s4 .ks-art .l0{transform:none;transition-duration:1.6s}
/* stage 5: a journey that converts */
.rb.s5 .ks-book{opacity:1;transform:none}
.rb.s5 .ks-btn{animation:ksPulse 1.8s ease-in-out infinite}
@keyframes ksPulse{50%{box-shadow:0 0 0 1.4cqw rgba(200,100,59,0),0 1.6cqw 3.4cqw -1.2cqw rgba(200,100,59,.9)}0%,100%{box-shadow:0 0 0 0 rgba(200,100,59,.55),0 1.6cqw 3.4cqw -1.2cqw rgba(200,100,59,.9)}}
.rb.s5 .ks-ptr{animation:ksPtr 2.4s var(--ease) .5s forwards}
@keyframes ksPtr{0%{opacity:0;left:22%;top:70%}15%{opacity:1;left:22%;top:70%}70%{opacity:1;left:84%;top:76%;transform:none}80%{transform:scale(.8)}100%{opacity:1;left:84%;top:76%;transform:none}}
.rb.s5 .ks-slots .pick{animation:ksPick .5s ease 2s forwards}
@keyframes ksPick{to{background:#C8643B;border-color:#C8643B;color:#fff}}
/* stage 6: connected systems */
.rb.s6 .ks-toast{opacity:1;transform:translate(-50%,0)}
.rb.s6 .ks-confirm .b{opacity:1}
.rb.s6 .ks-sys{opacity:1}.rb.s6 .ks-sys::before{transform:scaleX(1)}
.rb.s6 .ks-sys svg{border-color:#F2C14E;stroke:#FFE08A;box-shadow:0 0 0 .5cqw rgba(242,193,78,.18),0 0 3cqw rgba(242,193,78,.5)}
.rb.s6 .ks-sys span:nth-child(2) svg{transition-delay:.4s}.rb.s6 .ks-sys span:nth-child(3) svg{transition-delay:.8s}
.rb.s6 .ks-ptr{opacity:0;animation:none}
.rb.s6 .ks-slots .pick{background:#C8643B;border-color:#C8643B;color:#fff}
/* narrow mock (phones) */
@container (max-width:560px){
.ks-nav{font-size:3.4cqw}.ks-logo{font-size:4.4cqw}.ks-logo svg{width:5cqw;height:5cqw}.ks-links{display:none}.ks-cta{padding:1.4cqw 3.6cqw}
.ks-hero{top:15%;width:88%}.ks-kick{font-size:2.8cqw}.ks h4,.rb.s2 .ks h4{font-size:10.5cqw}.ks-sub{font-size:3.6cqw}.ks-btn{font-size:3.4cqw;padding:2.4cqw 5cqw;margin-top:4cqw}
.ks-cards,.ks-sys{display:none}
.ks-book{left:6%;right:6%;width:auto;bottom:5%;padding:4.4cqw;border-radius:4cqw}.ks-book b{font-size:4cqw}.ks-days i,.ks-slots i{font-size:3cqw;padding:2cqw 0;border-radius:2cqw}.ks-days,.ks-slots{gap:1.6cqw;margin-top:2.6cqw}.ks-confirm{font-size:3.2cqw;padding:2.6cqw 0;margin-top:3cqw}
.ks-toast{font-size:3.1cqw;padding:2.2cqw 3.6cqw;top:12%;white-space:normal;width:84%;justify-content:center}.ks-toast svg{width:4cqw;height:4cqw}
.ks-ptr{width:6cqw;height:6cqw}
.ks [data-wf]::after{font-size:2.6cqw;top:-5.6cqw}
.ks-scrim{background:linear-gradient(180deg,rgba(16,32,25,.9) 0%,rgba(16,32,25,.55) 50%,rgba(16,32,25,.2) 75%,rgba(16,32,25,.7) 100%)}
@keyframes ksPtr{0%{opacity:0;left:16%;top:52%}15%{opacity:1;left:16%;top:52%}70%{opacity:1;left:62%;top:83%;transform:none}80%{transform:scale(.8)}100%{opacity:1;left:62%;top:83%;transform:none}}}
'''
rep('/* reveals: visible by default; hidden only under .mo */', CSS.strip('\n') + '\n/* reveals: visible by default; hidden only under .mo */')
os.makedirs('scratch/flag/site3', exist_ok=True)
open('scratch/flag/site3/index.html', 'w').write(s)
print('ok', len(s))
