"""Generate the DemoDrop static pages for Fellowship Chicago (plain HTML/CSS/vanilla JS)."""
import json, pathlib, re

OUT = pathlib.Path(__file__).parent / "out"
OUT.mkdir(exist_ok=True)

SHELBY = "https://shelbygiving.com/app/Giving/fell4543118"
YT = "https://www.youtube.com/channel/UCbc_LGxLxkKMdfzm54HMEGg"
UPLOADS = "UUbc_LGxLxkKMdfzm54HMEGg"
LIVE = "https://www.youtube-nocookie.com/embed/live_stream?channel=UCbc_LGxLxkKMdfzm54HMEGg"
FB = "https://www.facebook.com/FellowshipChicago"
IG = "https://www.instagram.com/fellowshipchicago"
ADDR = "4543 S Princeton Ave, Chicago, IL 60609"
MAPS = "https://www.google.com/maps/search/?api=1&query=4543+S+Princeton+Ave+Chicago+IL+60609"
TEL = "tel:+17739243232"
PHONE = "(773) 924-3232"

# ---------- icons: one family, 24 grid, 1.75 stroke, round caps ----------
ICONS = {
    "anchor": '<circle cx="12" cy="5" r="2"/><path d="M12 7v14M8 11h8M4 14a8 8 0 0 0 16 0M4 14h2M18 14h2"/>',
    "clock": '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    "pin": '<path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/>',
    "play": '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M10.5 9.5v5l4-2.5z"/>',
    "kids": '<circle cx="8" cy="7" r="2.2"/><circle cx="16.5" cy="8.5" r="1.8"/><path d="M4.5 20v-4a3.5 3.5 0 0 1 7 0v4M13.5 20v-3a3 3 0 0 1 6 0v3"/>',
    "car": '<path d="M5 16V12l2-4.5h10L19 12v4M5 16h14M5 16v2M19 16v2"/><circle cx="8" cy="13.5" r=".6"/><circle cx="16" cy="13.5" r=".6"/>',
    "bread": '<path d="M5 11a4 4 0 0 1 2-7.5h10A4 4 0 0 1 19 11v8a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 19z"/><path d="M9 11v6M15 11v6"/>',
    "table": '<path d="M3 10h18M6 10v9M18 10v9M8 6.5c0-1.5 1-2.5 2-2.5M14 6.5c0-1.5 1-2.5 2-2.5"/>',
    "scales": '<path d="M12 4v16M8 20h8M5 7h14M7 7l-3 6a3 3 0 0 0 6 0zM17 7l-3 6a3 3 0 0 0 6 0z"/>',
    "heart": '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>',
    "phone": '<path d="M6.5 3.5h3l1.5 4-2 1.5a11 11 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2 2A16 16 0 0 1 4.5 5.5a2 2 0 0 1 2-2z"/>',
    "book": '<path d="M4 5.5A2 2 0 0 1 6 4h5v15H6a2 2 0 0 0-2 1.5zM20 5.5A2 2 0 0 0 18 4h-5v15h5a2 2 0 0 1 2 1.5z"/>',
    "music": '<path d="M9 18V6l10-2v12"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="16.5" cy="16" r="2.5"/>',
    "bolt": '<path d="M13 3 5 13.5h6L10 21l8-10.5h-6z"/>',
    "gift": '<rect x="4" y="9" width="16" height="11" rx="1.5"/><path d="M3 9h18M12 9v11M12 9c-2-4-6-4-6-1.5S10 9 12 9zM12 9c2-4 6-4 6-1.5S14 9 12 9z"/>',
    "arrow": '<path d="M7 17 17 7M9 7h8v8"/>',
    "cal": '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 3v4M15 3v4"/>',
    "ankh": '<ellipse cx="12" cy="6.5" rx="3" ry="3.8"/><path d="M12 10.3V21M7.5 12.5h9"/>',
    "rope": '<path d="M8.5 3c0 4.5 7 4.5 7 9s-7 4.5-7 9M15.5 3c0 4.5-7 4.5-7 9s7 4.5 7 9"/>',
    "cross": '<path d="M12 3v18M7 8h10M7.5 14.5l1.5-1.5 1.5 1.5 1.5-1.5 1.5 1.5 1.5-1.5 1.5 1.5"/>',
    "copy": '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>',
    "mail": '<rect x="3.5" y="5.5" width="17" height="13" rx="2"/><path d="m4 7 8 6 8-6"/>',
}


def ic(name, cls="ic"):
    return (f'<svg class="{cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" '
            f'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{ICONS[name]}</svg>')


NAV = [("visit.html", "I'm New"), ("watch.html", "Watch"), ("connect.html", "Get Connected"),
       ("our-story.html", "Our Story"), ("care.html", "Care")]

CSS = r"""
:root{
  --ink:#05080f;--hull:#0b1526;--deep:#0f2343;--brand:#1f56b8;--brand-hi:#5a8ff2;--tide:#a9c0e8;
  --foam:#f4f7fc;--white:#ffffff;--text-dark:#0b1220;--brass:#d6b26a;--live:#e5484d;--line:rgba(169,192,232,.18);
  --font-heading:"roc-grotesk-condensed","Arial Narrow",sans-serif;
  --font-accent:"ivypresto-display",Georgia,serif;
  --font-body:"proxima-nova","Helvetica Neue",sans-serif;
  --r:16px;--wrap:1600px;--ease:cubic-bezier(.16,1,.3,1)
}
*,*::before,*::after{box-sizing:border-box}
html{background:var(--ink);color-scheme:dark;-webkit-text-size-adjust:100%}
body{margin:0;background:var(--ink);color:var(--foam);font-family:var(--font-body);font-size:1.0625rem;line-height:1.6;overflow-x:clip;-webkit-font-smoothing:antialiased}
img{max-width:100%;display:block}
a{color:inherit}a[href^="mailto"]{overflow-wrap:anywhere}
:focus-visible{outline:3px solid var(--brand-hi);outline-offset:3px;border-radius:6px}
.wrap{max-width:var(--wrap);margin:0 auto;padding:0 18px}
@media(min-width:700px){.wrap{padding:0 32px}}
@media(min-width:1100px){.wrap{padding:0 48px}}
.skip{position:absolute;left:12px;top:-80px;z-index:200;background:var(--foam);color:var(--ink);padding:12px 16px;border-radius:10px;font-weight:700}
.skip:focus{top:12px}
h1,h2,h3{overflow-wrap:break-word;font-family:var(--font-heading);font-weight:700;text-transform:uppercase;line-height:.9;letter-spacing:.005em;margin:0}
h2{font-size:clamp(2.6rem,7vw,5.25rem)}
h3{font-size:1.6rem;line-height:1}
p{margin:0}
.accent{font-family:var(--font-accent);font-style:italic;font-weight:400;text-transform:none;letter-spacing:0;line-height:1.1;padding-bottom:.08em;color:var(--brass)}
.lede{font-size:1.15rem;color:rgba(244,247,252,.86);max-width:60ch;margin-top:18px}
.muted{color:var(--tide)}
section{position:relative}
.band{padding:84px 0}
@media(min-width:900px){.band{padding:120px 0}}
.b-ink{background:var(--ink)}.b-hull{background:var(--hull)}.b-deep{background:var(--deep)}
.b-white{background:var(--white);color:var(--text-dark)}
.b-brand{background:var(--brand)}
/* buttons: pill rule for every CTA */
.btn{display:inline-flex;align-items:center;justify-content:center;gap:10px;min-height:52px;padding:0 28px;border-radius:999px;font-weight:700;font-size:1.0625rem;text-decoration:none;white-space:nowrap;border:1.5px solid transparent;cursor:pointer;transition:transform .25s var(--ease),background .25s,border-color .25s,box-shadow .25s;font-family:var(--font-body)}
.btn:hover,.btn:focus-visible{transform:translateY(-2px)}
.btn-light{background:var(--foam);color:var(--ink)}.btn-light:hover{background:#fff;box-shadow:0 10px 30px -10px rgba(244,247,252,.5)}
.btn-ghost{border-color:rgba(244,247,252,.4);color:var(--foam);background:transparent}.btn-ghost:hover{border-color:var(--foam);background:rgba(244,247,252,.08)}
.btn-brand{background:var(--brand);color:#fff}.btn-brand:hover{background:#2a64cc}
.btn-dark{background:var(--ink);color:var(--foam)}
.btns{display:flex;flex-wrap:wrap;gap:12px;margin-top:28px}
.ulink{text-decoration:none;font-weight:700;background:linear-gradient(currentColor,currentColor) 0 100%/0 2px no-repeat;transition:background-size .3s var(--ease);padding-bottom:2px}
.ulink:hover,.ulink:focus-visible{background-size:100% 2px}
.ic{width:24px;height:24px;flex:none}
.tile{display:inline-grid;place-items:center;width:52px;height:52px;border-radius:14px;background:rgba(90,143,242,.14);color:var(--brand-hi);flex:none}
.b-white .tile{background:rgba(31,86,184,.1);color:var(--brand)}

/* header */
.hdr{position:fixed;inset:0 0 auto 0;z-index:60;transition:background .35s,border-color .35s;border-bottom:1px solid transparent}
.hdr.solid,.hdr.open{background:rgba(5,8,15,.94);border-color:var(--line)}
.hdr-in{max-width:var(--wrap);margin:0 auto;height:60px;display:flex;align-items:center;justify-content:space-between;gap:16px;padding:0 18px}
@media(min-width:700px){.hdr-in{padding:0 32px}}
@media(min-width:1100px){.hdr-in{height:76px;padding:0 48px}}
.logo img{height:34px;width:auto}
@media(min-width:1100px){.logo img{height:42px}}
.nav{display:none}
@media(min-width:1100px){.nav{display:flex;gap:4px}.nav a{padding:10px 16px;border-radius:999px;text-decoration:none;font-weight:600;color:rgba(244,247,252,.88)}.nav a:hover,.nav a[aria-current]{background:rgba(244,247,252,.1);color:#fff}}
.hdr-r{display:flex;align-items:center;gap:10px}
.hdr .give{min-height:44px;padding:0 22px;display:none}
@media(min-width:700px){.hdr .give{display:inline-flex}}
.burger{width:46px;height:46px;border-radius:999px;border:1px solid var(--line);background:transparent;color:var(--foam);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;cursor:pointer}
.burger span{display:block;width:20px;height:2px;background:currentColor;border-radius:2px;transition:transform .3s var(--ease),opacity .2s}
.hdr.open .burger span:nth-child(1){transform:translateY(7px) rotate(45deg)}
.hdr.open .burger span:nth-child(2){opacity:0}
.hdr.open .burger span:nth-child(3){transform:translateY(-7px) rotate(-45deg)}
@media(min-width:1100px){.burger{display:none}}
.panel{position:fixed;inset:60px 0 0 0;background:var(--ink);padding:24px 18px 96px;overflow-y:auto;opacity:0;transform:translateY(-8px);pointer-events:none;transition:opacity .3s,transform .3s var(--ease);display:flex;flex-direction:column}
.hdr.open .panel{opacity:1;transform:none;pointer-events:auto}
.panel a.pl{display:flex;align-items:center;min-height:56px;font-family:var(--font-heading);font-weight:700;text-transform:uppercase;font-size:2.4rem;text-decoration:none;line-height:1}
.panel .btn{margin-top:28px;width:100%}
.panel .pmeta{margin-top:20px;color:var(--tide)}
@media(min-width:1100px){.panel{display:none}}
/* sticky mobile bar */
.mbar{position:fixed;left:0;right:0;bottom:0;z-index:55;display:flex;gap:10px;padding:10px 14px calc(10px + env(safe-area-inset-bottom));background:rgba(5,8,15,.96);border-top:1px solid var(--line)}
.mbar .btn{flex:1;min-height:48px;padding:0 12px}
@media(min-width:900px){.mbar{display:none}}
body{padding-bottom:72px}@media(min-width:900px){body{padding-bottom:0}}

/* hero */
.hero{position:relative;min-height:84svh;display:flex;align-items:flex-end;overflow:hidden;isolation:isolate}
@media(min-width:900px){.hero{min-height:min(92svh,880px)}}
.hero-media{position:absolute;inset:0;z-index:-2;overflow:hidden}
.hero-media img{width:100%;height:100%;object-fit:cover;object-position:center 35%;animation:kb 18s var(--ease) forwards}
@keyframes kb{from{transform:scale(1)}to{transform:scale(1.06)}}
.hero-vid{position:absolute;inset:0;opacity:0;transition:opacity 2s;pointer-events:none}
.hero-vid.on{opacity:.75}
.hero-vid iframe{position:absolute;left:50%;top:50%;width:177.78vh;height:56.25vw;min-width:100%;min-height:100%;transform:translate(-50%,-50%);border:0}
.scrim{position:absolute;inset:0;z-index:-1;background:linear-gradient(90deg,rgba(5,8,15,.86) 0%,rgba(5,8,15,.55) 45%,rgba(5,8,15,.22) 100%),linear-gradient(0deg,var(--ink) 0%,rgba(5,8,15,.55) 30%,rgba(5,8,15,0) 60%),linear-gradient(rgba(31,86,184,.22),rgba(31,86,184,.22))}
.hero .wrap{width:100%;padding-bottom:40px;padding-top:110px}
@media(min-width:900px){.hero .wrap{padding-bottom:72px}}
.hero h1{font-size:clamp(3.1rem,13vw,8.5rem);line-height:.86}
.hero h1 .accent{display:block;font-size:max(1.8rem,.58em);margin-top:.12em}
.hero .sub{font-size:1.125rem;max-width:34ch;margin-top:18px;color:rgba(244,247,252,.92)}
@media(min-width:900px){.hero .sub{font-size:1.3rem}}
.hero .btns{margin-top:24px}
.hero .btns .btn{flex:1 1 0}
@media(min-width:600px){.hero .btns .btn{flex:0 0 auto}}
.hero .times{margin-top:22px;font-weight:700;font-size:1.0625rem;color:var(--foam)}
.hero .times span{color:var(--tide);font-weight:400}
.rise{animation:rise .9s var(--ease) both}
.rise.d1{animation-delay:.12s}.rise.d2{animation-delay:.24s}.rise.d3{animation-delay:.36s}
@keyframes rise{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:none}}

.phero{position:relative;min-height:62svh;display:flex;align-items:flex-end;overflow:hidden;isolation:isolate}
.phero .wrap{width:100%;padding-top:120px;padding-bottom:48px}
@media(min-width:900px){.phero .wrap{padding-top:150px;padding-bottom:72px}}
.phero h1{font-size:clamp(3rem,11vw,7.5rem)}

/* visit band (light) */
.poster{display:grid;gap:28px}
@media(min-width:1000px){.poster{gap:56px}.poster .vlist{grid-template-columns:repeat(3,1fr);gap:28px}}
.clock{display:grid;grid-template-columns:repeat(3,auto);justify-content:start;gap:0 16px;font-family:var(--font-heading);font-weight:700;font-size:clamp(2.4rem,10vw,9rem);line-height:.85;color:var(--text-dark);margin-top:24px}
.clock .t{white-space:nowrap}
.clock small{display:block;font-size:max(1rem,.3em);color:#41506a;margin-top:6px}
.clock .sep{display:none;color:var(--brand);font-weight:400}
@media(min-width:700px){.clock{display:flex;flex-wrap:wrap;align-items:baseline;gap:8px 18px}.clock small{display:inline;margin:0 0 0 4px}.clock .sep{display:inline}}
.vlist{display:grid;gap:18px;margin:0;padding:0;list-style:none}
.vlist li{display:flex;gap:16px;align-items:flex-start}
.vlist strong{display:block;font-size:1.125rem}
.vlist p{color:rgba(244,247,252,.82)}
.b-white .vlist p{color:#33405a}
.b-white a.ulink{color:var(--brand)}
.b-white h2{color:var(--text-dark)}

/* live strip */
.live{border-block:1px solid var(--line);background:var(--hull)}
.live.is-live{background:linear-gradient(90deg,rgba(229,72,77,.22),var(--hull) 60%)}
.live .wrap{display:flex;flex-direction:column;gap:14px;padding-top:20px;padding-bottom:20px}
@media(min-width:800px){.live .wrap{flex-direction:row;align-items:center;justify-content:space-between}}
.live p{font-size:1.0625rem}
.cd{display:block;margin-top:4px;font-family:var(--font-heading);font-weight:700;font-size:1.6rem;letter-spacing:.02em;font-variant-numeric:tabular-nums}@media(min-width:600px){.cd{display:inline;margin:0 0 0 8px}}
.ldot{display:inline-block;width:10px;height:10px;border-radius:50%;background:var(--live);margin-right:10px;vertical-align:middle;box-shadow:0 0 0 0 rgba(229,72,77,.6);animation:pulse 1.6s infinite}
@keyframes pulse{70%{box-shadow:0 0 0 10px rgba(229,72,77,0)}100%{box-shadow:0 0 0 0 rgba(229,72,77,0)}}

/* message */
.split{display:grid;gap:36px}
@media(min-width:1000px){.split{grid-template-columns:1fr 1.45fr;gap:64px;align-items:center}}
.frame{padding:10px;border:1px solid rgba(214,178,106,.45);border-radius:calc(var(--r) + 10px)}
.frame>*{border-radius:var(--r);overflow:hidden}
.vid{aspect-ratio:16/9;background:var(--hull);position:relative}
.vid iframe{position:absolute;inset:0;width:100%;height:100%;border:0}

/* doors */
.doors{list-style:none;margin:40px 0 0;padding:0;border-top:1px solid var(--line)}
.doors li{border-bottom:1px solid var(--line)}
.doors a{display:grid;grid-template-columns:1fr auto;align-items:center;gap:18px;padding:24px 0;text-decoration:none}
.doors .t{display:block;font-family:var(--font-heading);font-weight:700;text-transform:uppercase;font-size:clamp(2.4rem,7.5vw,6rem);line-height:.9;transition:color .25s}
.doors .d{display:block;color:var(--tide);margin-top:6px}
.doors .ic{width:36px;height:36px;color:var(--tide);transition:transform .3s var(--ease),color .25s}
.doors a:hover .t{color:var(--brand-hi)}.doors a:hover .ic{transform:translate(4px,-4px);color:var(--foam)}

/* mission */
.ship{font-family:var(--font-heading);font-weight:700;font-size:clamp(3.6rem,15vw,12rem);line-height:.85;margin:0}
.ship b{color:var(--brand-hi)}
.letters{display:grid;grid-template-columns:repeat(2,1fr);gap:1px;background:var(--line);border:1px solid var(--line);border-radius:var(--r);overflow:hidden;margin-top:48px;list-style:none;padding:0}
.letters li{background:var(--deep);padding:20px}
.letters li:last-child{grid-column:span 2}
.letters .L{font-family:var(--font-heading);font-weight:700;font-size:4rem;line-height:1;color:var(--brand-hi)}
.letters .W{display:block;margin-top:8px;font-weight:600}
@media(min-width:700px){.letters{grid-template-columns:repeat(4,1fr)}.letters li:last-child{grid-column:span 2}}
@media(min-width:1200px){.letters{grid-template-columns:repeat(7,1fr)}.letters li:last-child{grid-column:auto}}

/* impact rows */
.rows{list-style:none;margin:44px 0 0;padding:0;display:grid;gap:0}
.rows li{display:grid;gap:14px;padding:28px 0;border-top:1px solid var(--line)}
@media(min-width:900px){.rows li{grid-template-columns:72px 1fr 1.2fr auto;align-items:center;gap:32px}}
.rows h3{font-size:clamp(2rem,4vw,3rem)}
.rows p{color:rgba(244,247,252,.82)}

/* pastor */
.pastor{display:grid;gap:36px}
@media(min-width:1000px){.pastor{grid-template-columns:.8fr 1.2fr;gap:72px;align-items:center}}
.pastor .frame img{width:100%;height:auto;aspect-ratio:4/5;object-fit:cover;object-position:center 20%;max-height:600px}
.pname{font-size:clamp(2.8rem,6.5vw,5.5rem)}
.legacy-year{font-family:var(--font-heading);font-weight:700;font-size:clamp(7rem,26vw,20rem);line-height:.8;color:transparent;-webkit-text-stroke:2px rgba(214,178,106,.75)}

/* events */
.ev{list-style:none;margin:40px 0 0;padding:0;display:grid;gap:14px}
@media(min-width:700px){.ev{grid-template-columns:repeat(2,1fr)}}
@media(min-width:1200px){.ev{grid-template-columns:repeat(4,1fr)}}
.ev li{border:1px solid var(--line);border-radius:var(--r);padding:22px;background:var(--hull);display:flex;flex-direction:column;gap:8px;transition:transform .3s var(--ease),border-color .3s}
.ev li:hover{transform:translateY(-3px);border-color:rgba(90,143,242,.5)}
.ev .dt{display:flex;align-items:baseline;gap:12px}
.ev .n{font-family:var(--font-heading);font-weight:700;font-size:3.6rem;line-height:.9}
.ev .m{font-weight:700;color:var(--tide);text-transform:uppercase;letter-spacing:.08em;font-size:.95rem;line-height:1.2}
.ev h3{font-family:var(--font-body);text-transform:none;font-size:1.2rem;line-height:1.3;margin-top:8px}
.ev .tm{color:var(--brand-hi);font-weight:700}
.ev a{margin-top:auto;padding-top:6px;color:var(--foam);font-size:1rem}

/* give band */
.b-brand h2{color:#fff}
.give-in{display:grid;gap:28px}
@media(min-width:1000px){.give-in{grid-template-columns:1.4fr auto;align-items:end}}
.b-brand .lede{color:rgba(255,255,255,.92)}
.b-brand .btn-ghost{border-color:rgba(255,255,255,.6)}

/* footer */
.ftr{background:#03050a;border-top:1px solid var(--line);padding:64px 0 32px}
.fgrid{display:grid;gap:40px}
@media(min-width:1000px){.fgrid{grid-template-columns:1.3fr 2fr}}
.fcols{display:grid;grid-template-columns:repeat(2,1fr);gap:32px}
@media(min-width:700px){.fcols{grid-template-columns:repeat(3,1fr)}}
.ftr h2{font-family:var(--font-body);font-size:1rem;text-transform:none;letter-spacing:0;line-height:1.3;color:var(--tide);font-weight:700;margin-bottom:12px}
.ftr ul{list-style:none;margin:0;padding:0;display:grid;gap:10px}
.ftr a{text-decoration:none;color:rgba(244,247,252,.88)}.ftr a:hover{color:#fff;text-decoration:underline}
.ftr address{font-style:normal;display:grid;gap:6px;margin-top:22px}
.soc{display:flex;flex-wrap:wrap;gap:10px;margin-top:20px}
.soc a{display:inline-flex;align-items:center;min-height:44px;padding:0 16px;border:1px solid var(--line);border-radius:999px}
.legal{margin-top:48px;padding-top:24px;border-top:1px solid var(--line);display:grid;gap:6px;font-size:.875rem;color:var(--tide)}

/* forms */
.form{display:grid;gap:18px}
@media(min-width:700px){.form{grid-template-columns:1fr 1fr}.form .full{grid-column:1/-1}}
.form label{display:block;font-weight:600;font-size:1rem}
.form input,.form select,.form textarea{display:block;width:100%;margin-top:8px;min-height:50px;padding:12px 16px;font:inherit;font-size:1rem;color:var(--foam);background:rgba(5,8,15,.6);border:1px solid rgba(169,192,232,.35);border-radius:12px}
.form textarea{min-height:130px;resize:vertical}
.form input:focus,.form select:focus,.form textarea:focus{outline:none;border-color:var(--brand-hi);box-shadow:0 0 0 3px rgba(90,143,242,.35)}
.form .chk{display:flex;gap:12px;align-items:flex-start;font-weight:400}
.form .chk input{width:22px;min-height:22px;height:22px;margin-top:2px;accent-color:var(--brand-hi)}
.form [data-dd-form-status]{grid-column:1/-1;font-weight:600}
.req{color:var(--brass)}
.card{border:1px solid var(--line);border-radius:var(--r);background:var(--hull);padding:24px}
@media(min-width:700px){.card{padding:32px}}
.two{display:grid;gap:40px}
@media(min-width:1000px){.two{grid-template-columns:1fr 1.35fr;gap:64px}}
.note{border:1px dashed rgba(214,178,106,.6);border-radius:12px;padding:16px 18px;color:var(--tide);background:rgba(214,178,106,.06);font-size:1rem}
.note b{color:var(--brass)}

/* timeline */
.tl{display:grid;gap:40px;margin-top:56px}
@media(min-width:1000px){.tl{grid-template-columns:1fr 1.25fr}}
.tl-year{display:none}
@media(min-width:1000px){.tl-year{display:block;position:sticky;top:110px;align-self:start}.tl-year .y{font-family:var(--font-heading);font-weight:700;font-size:clamp(8rem,16vw,15rem);line-height:.85;font-variant-numeric:tabular-nums}}
.tl ol{list-style:none;margin:0;padding:0 0 0 28px;border-left:1px solid var(--line);position:relative}
.tl li{position:relative;padding-bottom:56px}
@media(min-width:1000px){.tl li{min-height:42vh;padding-bottom:0}}
.tl li::before{content:"";position:absolute;left:-36px;top:12px;width:15px;height:15px;border-radius:50%;border:2px solid rgba(169,192,232,.6);background:var(--ink);transition:background .4s,border-color .4s}
.tl li.on::before{background:var(--brass);border-color:var(--brass)}
.tl .yr{font-family:var(--font-heading);font-weight:700;font-size:3.4rem;line-height:1;color:var(--brass)}
@media(min-width:1000px){.tl .yr{font-size:1.1rem;letter-spacing:.2em;color:var(--tide)}}
.tl h3{font-size:clamp(2rem,3.6vw,3.2rem);line-height:.95;margin-top:8px;max-width:18ch}
.tl p{color:rgba(244,247,252,.8);margin-top:10px;max-width:52ch}
.strip{list-style:none;margin:48px 0 0;padding:0;display:grid;gap:14px}
@media(min-width:700px){.strip{grid-template-columns:repeat(2,1fr)}}
.strip img{width:100%;height:auto;aspect-ratio:4/3;object-fit:cover;border-radius:var(--r);filter:grayscale(1) contrast(1.05)}
.sym{list-style:none;margin:40px 0 0;padding:0;display:grid;gap:14px}
@media(min-width:700px){.sym{grid-template-columns:repeat(2,1fr)}}
@media(min-width:1200px){.sym{grid-template-columns:repeat(4,1fr)}}
.sym li{border-top:2px solid var(--brass);padding-top:18px}
.sym h3{font-size:2rem}
.sym p{margin-top:8px;color:rgba(244,247,252,.82)}
.crew{list-style:none;margin:40px 0 0;padding:0;display:grid;gap:0 32px}
@media(min-width:700px){.crew{grid-template-columns:repeat(2,1fr)}}
@media(min-width:1200px){.crew{grid-template-columns:repeat(3,1fr)}}
.crew li{padding:18px 0;border-top:1px solid var(--line)}
.crew strong{display:block;font-size:1.2rem}
.crew span{color:var(--tide)}

/* finder */
.chips{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}
.chips button{min-height:44px;padding:0 16px;border-radius:999px;border:1px solid var(--line);background:transparent;color:var(--foam);font:inherit;font-size:1rem;font-weight:600;cursor:pointer}
.chips button[aria-pressed=true]{background:var(--foam);color:var(--ink);border-color:var(--foam)}
.fs{border:0;margin:0;padding:0}
.fs legend{font-weight:700;color:var(--tide);padding:0}
.mins{list-style:none;margin:28px 0 0;padding:0;display:grid;gap:14px}
@media(min-width:700px){.mins{grid-template-columns:repeat(2,1fr)}}
@media(min-width:1200px){.mins{grid-template-columns:repeat(3,1fr)}}
.mins li{border:1px solid var(--line);border-radius:var(--r);background:var(--hull);padding:22px;display:flex;flex-direction:column;gap:10px}
.mins li[hidden]{display:none}
.mins h3{font-size:2rem}
.mins .who{margin-top:auto;color:var(--tide);font-size:.95rem}
.mins .lead{font-size:1rem;color:var(--foam)}
.mins a{font-size:1rem;color:var(--brand-hi)}
.ways{list-style:none;margin:36px 0 0;padding:0;display:grid;gap:14px}
@media(min-width:700px){.ways{grid-template-columns:repeat(2,1fr)}}
@media(min-width:1200px){.ways{grid-template-columns:repeat(3,1fr)}}
.ways li{border:1px solid var(--line);border-radius:var(--r);background:var(--hull);padding:24px}
.ways h3{font-family:var(--font-body);text-transform:none;font-size:1.1rem;color:var(--tide);line-height:1.3}
.ways .v{font-family:var(--font-heading);font-weight:700;font-size:clamp(1.7rem,7vw,2.2rem);overflow-wrap:anywhere;margin-top:10px;line-height:1}
.crisis{list-style:none;margin:24px 0 0;padding:0;display:grid;gap:12px}
@media(min-width:700px){.crisis{grid-template-columns:repeat(2,1fr)}}
@media(min-width:1200px){.crisis{grid-template-columns:repeat(5,1fr)}}
.crisis li{border:1px solid var(--line);border-radius:var(--r);background:var(--hull);padding:20px}
.crisis a{font-weight:700;display:inline-block;margin-top:10px}
.faq{margin-top:28px;border-top:1px solid var(--line)}
.faq details{border-bottom:1px solid var(--line)}
.faq summary{cursor:pointer;list-style:none;min-height:56px;display:flex;align-items:center;justify-content:space-between;font-weight:700;font-size:1.125rem;gap:16px}
.faq summary::after{content:"+";font-size:1.6rem;color:var(--brand-hi);transition:transform .3s}
.faq details[open] summary::after{transform:rotate(45deg)}
.faq p{padding:0 0 20px;color:rgba(244,247,252,.82)}
.map{aspect-ratio:4/3;border-radius:var(--r);overflow:hidden;border:1px solid var(--line)}
.map iframe{width:100%;height:100%;border:0;filter:grayscale(1) invert(.9) hue-rotate(180deg)}


/* events with sign-up */
.ev .where{display:flex;gap:8px;align-items:center;color:var(--tide);font-size:1rem}
.ev .where .ic{width:18px;height:18px}
.ev .ecta{margin-top:auto;min-height:46px;padding:0 20px;align-self:flex-start;font-size:1rem;color:var(--ink)}
.ev .muted{font-size:1rem}
.ev li[hidden]{display:none}
@media(min-width:700px){.evx .evp{grid-column:1/-1;flex-direction:row;flex-wrap:wrap;align-items:center;gap:12px 28px}.evx .evp .ecta{margin:0 0 0 auto}}
/* feature photo */
.feat img{width:100%;height:auto;aspect-ratio:16/9;object-fit:cover;object-position:center 30%;max-height:560px}
@media(max-width:699px){.feat img{aspect-ratio:4/3}}
/* timeline inline archive photo */
.tlimg{margin:18px 0 0;max-width:420px}
.tlimg img{width:100%;height:auto;aspect-ratio:4/3;object-fit:cover;border-radius:var(--r);filter:grayscale(1) contrast(1.05)}
.tlimg figcaption{margin-top:8px;color:var(--tide);font-size:.95rem}
/* built to last */
.btl{display:grid;gap:36px}
@media(min-width:1000px){.btl{grid-template-columns:.75fr 1.25fr;gap:72px;align-items:center}}
.btl .frame img{width:100%;height:auto;aspect-ratio:3/4;object-fit:cover;max-height:620px}
.btl-list{list-style:none;margin:28px 0 0;padding:0;display:grid;gap:0}
.btl-list li{display:grid;gap:4px;padding:16px 0;border-top:1px solid rgba(214,178,106,.4)}
.btl-list strong{font-family:var(--font-heading);font-size:1.6rem;text-transform:uppercase;color:var(--brass)}
/* staff with photos */
.crewp{gap:28px 20px;grid-template-columns:repeat(2,1fr)}
@media(min-width:700px){.crewp{grid-template-columns:repeat(3,1fr)}}
@media(min-width:1200px){.crewp{grid-template-columns:repeat(5,1fr)}}
.crewp li{border-top:0;padding:0;display:flex;flex-direction:column;gap:4px}
.crewp img{width:100%;height:auto;aspect-ratio:1/1;object-fit:cover;object-position:center 20%;border-radius:var(--r);margin-bottom:10px;background:var(--hull)}
.crewp span{font-size:1rem;line-height:1.35}
.crewp a{font-size:.9rem;color:var(--brand-hi);overflow-wrap:anywhere;margin-top:4px}

/* reveals: visible by default, hidden only under .mo */
.mo .rv{opacity:0;transform:translateY(20px);transition:opacity .65s var(--ease),transform .65s var(--ease)}
.mo .rv.in{opacity:1;transform:none}
.mo .rvi img{transform:scale(1.04);transition:transform 1.1s var(--ease)}
.mo .rvi.in img{transform:none}
@media(prefers-reduced-motion:reduce){*,*::before,*::after{animation:none!important;transition:none!important}.hero-vid{display:none}}
"""

JS = r"""
(function(){
var d=document,h=d.documentElement;
var rm=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if('IntersectionObserver' in window&&!rm&&!navigator.webdriver){h.classList.add('mo');}
/* reveals */
var rv=[].slice.call(d.querySelectorAll('.rv,.rvi'));
if(h.classList.contains('mo')){
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){var el=e.target,i=+(el.dataset.i||0);setTimeout(function(){el.classList.add('in')},Math.min(i,7)*75);io.unobserve(el);}})},{threshold:.15});
  rv.forEach(function(el){var r=el.getBoundingClientRect();if(r.top<innerHeight&&r.bottom>0)el.classList.add('in');else io.observe(el);});
  setTimeout(function(){rv.forEach(function(el){el.classList.add('in')})},3000);
}
/* header solid after hero (no scroll listener) */
var hdr=d.querySelector('.hdr'),sent=d.querySelector('[data-sentinel]');
if(hdr&&sent&&'IntersectionObserver' in window){new IntersectionObserver(function(es){hdr.classList.toggle('solid',!es[0].isIntersecting)},{rootMargin:'-80px 0px 0px 0px'}).observe(sent);}else if(hdr){hdr.classList.add('solid');}
/* mobile menu */
var btn=d.querySelector('.burger'),panel=d.getElementById('menu');
function setMenu(o){hdr.classList.toggle('open',o);btn.setAttribute('aria-expanded',o);btn.setAttribute('aria-label',o?'Close menu':'Open menu');d.body.style.overflow=o?'hidden':'';if(o){var f=panel.querySelector('a');f&&f.focus();}else{btn.focus();}}
if(btn){btn.addEventListener('click',function(){setMenu(!hdr.classList.contains('open'))});
  panel.addEventListener('click',function(e){if(e.target.closest('a')||e.target===panel)setMenu(false)});
  d.addEventListener('keydown',function(e){if(e.key==='Escape'&&hdr.classList.contains('open'))setMenu(false)});}
/* schedule */
var S=[{d:0,h:8,m:0,t:'8:00 AM',l:'Early Worship'},{d:0,h:10,m:45,t:'10:45 AM',l:'Worship, Kidz Zone and Youth'},{d:0,h:13,m:15,t:'1:15 PM',l:'Afternoon Worship'}];
var DAYS=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
function chi(t){var f=new Intl.DateTimeFormat('en-US',{timeZone:'America/Chicago',weekday:'long',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'}).formatToParts(t),p={};f.forEach(function(x){p[x.type]=x.value});return{w:DAYS.indexOf(p.weekday),min:+p.hour*60+ +p.minute+ +p.second/60};}
function next(){var c=chi(new Date()),now=c.w*1440+c.min,best=null;S.forEach(function(s){var st=s.d*1440+s.h*60+s.m,dl=st-now;if(dl< -100)dl+=10080;var live=dl<=0&&dl>-100;var o={s:s,ms:dl*60000,live:live};if(!best||live||(!best.live&&o.ms<best.ms))best=o;});return best;}
function cd(ms){var t=Math.max(0,Math.floor(ms/1000));return{d:Math.floor(t/86400),h:Math.floor(t%86400/3600),m:Math.floor(t%3600/60),s:t%60};}
function pad(n){return String(n).padStart(2,'0')}
function tick(){var n=next(),c=cd(n.ms);
  d.querySelectorAll('[data-live]').forEach(function(el){
    var box=el.closest('.live');if(box)box.classList.toggle('is-live',n.live);
    el.innerHTML=n.live?'<span class="ldot" aria-hidden="true"></span><strong>Live now:</strong> '+n.s.l+', '+n.s.t:'Next livestream: <strong>Sunday '+n.s.t+'</strong><span class="cd">'+c.d+'D '+pad(c.h)+'H '+pad(c.m)+'M</span>';});
  d.querySelectorAll('[data-live-btn]').forEach(function(b){b.textContent=n.live?'Watch live':'Go to Watch';});
  d.querySelectorAll('[data-big-cd]').forEach(function(el){el.textContent=n.live?'Live now':c.d+'d '+pad(c.h)+'h '+pad(c.m)+'m '+pad(c.s)+'s';});
  d.querySelectorAll('[data-next-label]').forEach(function(el){el.textContent=n.live?n.s.l:'Next livestream: Sunday '+n.s.t;});
}
if(d.querySelector('[data-live],[data-big-cd]')){tick();setInterval(tick,1000);}
/* upcoming services, real weekly schedule */
var evl=d.querySelector('[data-events]');
if(evl){var out=[],now=new Date(),k=+evl.dataset.events||4;
  for(var i=0;i<15&&out.length<k;i++){var day=new Date(now.getTime()+i*864e5);var ymd=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Chicago'}).format(day);var dow=new Date(ymd+'T12:00:00Z').getUTCDay();
    S.forEach(function(s){if(s.d!==dow||out.length>=k)return;var u=Date.UTC(+ymd.slice(0,4),+ymd.slice(5,7)-1,+ymd.slice(8,10),s.h,s.m);var off=new Intl.DateTimeFormat('en-US',{timeZone:'America/Chicago',timeZoneName:'shortOffset'}).format(new Date(u)).match(/GMT([+-]\d+)/);var dt=new Date(u-(off?+off[1]:-6)*3600000);if(dt<now)return;out.push({s:s,dt:dt});});}
  var fm=function(o){return new Intl.DateTimeFormat('en-US',Object.assign({timeZone:'America/Chicago'},o))};
  evl.innerHTML=out.map(function(e){var st=e.dt.toISOString().replace(/[-:]|\.\d{3}/g,''),en=new Date(e.dt.getTime()+90*60000).toISOString().replace(/[-:]|\.\d{3}/g,'');
    var g='https://calendar.google.com/calendar/render?action=TEMPLATE&text='+encodeURIComponent(e.s.l+', Fellowship Chicago')+'&dates='+st+'/'+en+'&location='+encodeURIComponent('4543 S Princeton Ave, Chicago, IL 60609');
    return '<li><div class="dt"><span class="n">'+fm({day:'numeric'}).format(e.dt)+'</span><span class="m">'+fm({month:'short'}).format(e.dt)+'<br>'+fm({weekday:'short'}).format(e.dt)+'</span></div><h3>'+e.s.l+'</h3><span class="tm">'+e.s.t+'</span><a class="ulink" href="'+g+'">Add to calendar</a></li>';}).join('');}
/* ministry finder */
var mins=d.querySelectorAll('.mins li'),fa='All',fi='All',cnt=d.querySelector('[data-count]');
function apply(){var n=0;mins.forEach(function(li){var a=li.dataset.age.split('|'),t=li.dataset.int.split('|');var ok=(fa==='All'||a.indexOf(fa)>-1||a.indexOf('All Ages')>-1)&&(fi==='All'||t.indexOf(fi)>-1);li.hidden=!ok;if(ok)n++;});if(cnt)cnt.textContent='Showing '+n+(n===1?' ministry':' ministries');}
d.querySelectorAll('.chips').forEach(function(g){g.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;g.querySelectorAll('button').forEach(function(x){x.setAttribute('aria-pressed',x===b)});if(g.dataset.f==='age')fa=b.textContent;else fi=b.textContent;apply();});});
function pick(v){var s=d.querySelector('select[name=ministry]');if(s&&v)s.value=v;}
d.querySelectorAll('[data-join]').forEach(function(a){a.addEventListener('click',function(){pick(a.dataset.join)});});
try{pick(new URLSearchParams(location.search).get('m'));}catch(_){}
/* copy */
d.querySelectorAll('[data-copy]').forEach(function(b){b.addEventListener('click',function(){navigator.clipboard&&navigator.clipboard.writeText(b.dataset.copy).then(function(){var l=b.querySelector('span');var o=l.textContent;l.textContent='Copied';setTimeout(function(){l.textContent=o},2000)})})});
/* timeline active year */
var tl=d.querySelectorAll('.tl li'),ty=d.querySelector('.tl-year .y'),tg=d.querySelector('.tl-year .g');
if(tl.length&&'IntersectionObserver' in window){var tio=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){tl.forEach(function(x){x.classList.remove('on')});e.target.classList.add('on');var y=+e.target.dataset.y;if(ty)ty.textContent=y;if(tg)tg.textContent=y===1950?'Year one':(y-1950)+' years after the first service';}})},{rootMargin:'-45% 0px -45% 0px'});tl.forEach(function(li){tio.observe(li)});}
/* player buttons on watch page */
var pf=d.getElementById('player');
d.querySelectorAll('[data-play]').forEach(function(b){b.addEventListener('click',function(){if(!pf)return;pf.innerHTML='<iframe title="'+b.dataset.title+'" src="'+b.dataset.play+'" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>';});});
/* hero video: reveal only once YouTube reports playback */
var hv=d.querySelector('.hero-vid');
if(hv&&!rm&&!navigator.webdriver){setTimeout(function(){var f=d.createElement('iframe');f.title='Worship at Fellowship Chicago, background video, muted';f.tabIndex=-1;f.allow='autoplay; encrypted-media';
  f.src='https://www.youtube-nocookie.com/embed/videoseries?list=UUbc_LGxLxkKMdfzm54HMEGg&autoplay=1&mute=1&controls=0&loop=1&playsinline=1&rel=0&disablekb=1&iv_load_policy=3&enablejsapi=1';
  f.onload=function(){f.contentWindow.postMessage(JSON.stringify({event:'listening',id:'hero'}),'*')};hv.appendChild(f);
  addEventListener('message',function(e){if(!/youtube(-nocookie)?\.com$/.test((e.origin.split('//')[1]||'')))return;try{var x=typeof e.data==='string'?JSON.parse(e.data):e.data;if(x&&x.info&&(x.info.playerState===1||x.info.currentTime>0))hv.classList.add('on');}catch(_){}});},900);}
/* event expiry */
var today=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Chicago'}).format(new Date());
d.querySelectorAll('[data-end]').forEach(function(li){if(li.dataset.end<today)li.hidden=true;});
/* footer year */
var yr=d.querySelector('[data-year]');if(yr)yr.textContent=new Date().getFullYear();
})();
"""

FAVICON = "/images/site-icon.png"


def header(active):
    links = "".join(
        f'<a href="{h}"{" aria-current=page" if h == active else ""}>{t}</a>' for h, t in NAV)
    plinks = "".join(f'<a class="pl" href="{h}">{t}</a>' for h, t in NAV + [("give.html", "Give"), ("contact.html", "Contact")])
    return f"""<!--dd:header-->
<header class="hdr">
 <div class="hdr-in">
  <a class="logo" href="index.html" aria-label="Fellowship Chicago home"><img src="/images/logo-white.png" alt="Fellowship Missionary Baptist Church of Chicago" width="783" height="191"></a>
  <nav class="nav" aria-label="Primary">{links}</nav>
  <div class="hdr-r">
   <a class="btn btn-brand give" href="give.html">Give</a>
   <button class="burger" type="button" aria-expanded="false" aria-controls="menu" aria-label="Open menu"><span></span><span></span><span></span></button>
  </div>
 </div>
 <nav class="panel" id="menu" aria-label="Mobile">
  {plinks}
  <a class="btn btn-light" href="visit.html#plan">Plan Your Visit</a>
  <p class="pmeta"><a href="{TEL}">{PHONE}</a><br>{ADDR}</p>
 </nav>
</header>"""


def footer():
    return f"""<!--dd:footer-->
<footer class="ftr">
 <div class="wrap">
  <div class="fgrid">
   <div>
    <img src="/images/logo-white.png" alt="Fellowship Missionary Baptist Church of Chicago" width="783" height="191" loading="lazy" style="height:48px;width:auto">
    <address>
     <a href="{MAPS}">{ADDR}</a>
     <a href="{TEL}">{PHONE}</a>
     <span class="muted">Office hours: Tuesday to Friday, 9 AM to 5 PM</span>
    </address>
    <div class="soc"><a href="{FB}">Facebook</a><a href="{IG}">Instagram</a><a href="{YT}">YouTube</a></div>
   </div>
   <div class="fcols">
    <nav aria-label="Visit"><h2>Visit</h2><ul><li><a href="visit.html">Plan Your Visit</a></li><li><a href="index.html#events">Upcoming</a></li><li><a href="contact.html">Contact</a></li></ul></nav>
    <nav aria-label="Grow"><h2>Grow</h2><ul><li><a href="watch.html">Watch</a></li><li><a href="connect.html">Ministries</a></li><li><a href="care.html">Care and Prayer</a></li><li><a href="our-story.html">Our Story</a></li><li><a href="give.html">Give</a></li></ul></nav>
    <div><h2>Sunday Worship</h2><ul><li>8:00 AM</li><li>10:45 AM</li><li>1:15 PM</li><li>Refuel, Tuesdays 7:00 PM (seasonal)</li></ul></div>
   </div>
  </div>
  <div class="legal">
   <p>&copy; <span data-year>2026</span> Fellowship Missionary Baptist Church of Chicago. All rights reserved. The church's name, logo and photos belong to the church.</p>
   <p>Website by Bridge to Better Solutions, LLC</p>
  </div>
 </div>
</footer>
<div class="mbar"><a class="btn btn-light" href="visit.html#plan">Plan Your Visit</a><a class="btn btn-brand" href="give.html">Give</a></div>"""


def mincss(c):
    c = re.sub(r"/\*.*?\*/", "", c, flags=re.S)
    c = re.sub(r"\s*\n\s*", "", c)
    c = re.sub(r"\s*([{};,])\s*", r"\1", c)
    return c.replace(";}", "}")


def minjs(j):
    j = re.sub(r"^\s*/\*.*?\*/\s*$", "", j, flags=re.M)
    return "\n".join(l.strip() for l in j.splitlines() if l.strip())


KEEP = {"mo","in","on","solid","open","is-live","ldot","cd","rv","rvi","sr"}


def prune(css, html):
    used = set(re.findall(r'class="([^"]*)"', html))
    used = {c for grp in used for c in grp.split()} | KEEP

    def ok(sel):
        for alt in sel.split(","):
            cls = re.findall(r"\.([a-zA-Z][\w-]*)", alt)
            if all(c in used for c in cls):
                return True
        return False

    out, i = [], 0
    while i < len(css):
        if css.startswith("@media", i) or css.startswith("@keyframes", i):
            j = css.index("{", i); depth, k = 1, j + 1
            while depth:
                depth += {"{": 1, "}": -1}.get(css[k], 0); k += 1
            head, inner = css[i:j], css[j + 1:k - 1]
            if head.startswith("@keyframes"):
                out.append(css[i:k])
            else:
                kept = prune(inner, html)
                if kept: out.append(head + "{" + kept + "}")
            i = k
        else:
            j = css.index("{", i); k = css.index("}", j)
            if ok(css[i:j]): out.append(css[i:k + 1])
            i = k + 1
    return "".join(out)


def fold(html, width=900):
    out, line = [], ""
    for tok in re.split(r"(?<=>)(?=<)|(?<=\})", html):
        line += tok
        if len(line) >= width:
            out.append(line); line = ""
    out.append(line)
    return "\n".join(out)


NEEDS = {
    "schedule": ("data-live", "data-big-cd", "data-events"),
    "upcoming services, real weekly schedule": ("data-events",),
    "ministry finder": ('class="mins"', 'name="ministry"'),
    "copy": ("data-copy",),
    "timeline active year": ('class="tl"',),
    "player buttons on watch page": ("data-play",),
    "hero video: reveal only once YouTube reports playback": ("hero-vid",),
    "event expiry": ("data-end",),
}


def js_for(html):
    parts = re.split(r"^/\* ?(.*?) ?\*/$", JS, flags=re.M)
    out = [parts[0]]
    for i in range(1, len(parts), 2):
        need = NEEDS.get(parts[i])
        if need is None or any(n in html for n in need):
            out.append(parts[i + 1])
    return "".join(out)


def page(fname, title, desc, active, body):
    html = f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>{title}</title>
<meta name="description" content="{desc}">
<meta name="robots" content="noindex, nofollow">
<meta name="theme-color" content="#05080f">
<link rel="icon" href="{FAVICON}">
<link rel="stylesheet" href="https://use.typekit.net/oky1fcu.css">
<style>@@CSS@@</style>
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
{header(active)}
<main id="main">
{body}
</main>
{footer()}
<script>@@JS@@</script>
</body>
</html>"""
    bad = re.findall(r"[–—]", html)
    assert not bad, f"dash found in {fname}"
    html = re.sub(r">\s+<", "><", html)
    html = html.replace("@@CSS@@", prune(mincss(CSS), html))
    html = html.replace("@@JS@@", minjs(js_for(html)))
    a, b = html.split("<script>", 1); js, c = b.split("</script>", 1)
    html = fold(a) + "\n<script>" + js + "</script>" + c
    (OUT / fname).write_text(html)
    return html


def phero(img, alt, title, intro, pos="center 40%"):
    return f"""<section class="phero" aria-labelledby="ph">
 <div class="hero-media"><img src="{img}" alt="{alt}" width="1600" height="1067" loading="eager" fetchpriority="high" style="object-position:{pos}"></div>
 <div class="scrim"></div>
 <div class="wrap"><span data-sentinel></span>
  <h1 id="ph" class="rise">{title}</h1>
  <p class="lede rise d1">{intro}</p>
 </div>
</section>"""


def form(name, fields, submit):
    out = [f'<form class="form" data-dd-form="{name}">']
    for f in fields:
        kind, nm, label = f[0], f[1], f[2]
        req = " required" if "req" in f else ""
        star = ' <span class="req">*</span>' if req else ""
        full = "" if "half" in f else ' class="full"'
        ac = next((x[3:] for x in f if isinstance(x, str) and x.startswith("ac:")), "")
        ac = f' autocomplete="{ac}"' if ac else ""
        if kind == "chk":
            out.append(f'<label class="chk full"><input type="checkbox" name="{nm}" value="yes"> <span>{label}</span></label>')
        elif kind == "textarea":
            out.append(f'<div{full}><label>{label}{star}<textarea name="{nm}"{req}></textarea></label></div>')
        elif kind == "select":
            opts = "".join(f"<option>{o}</option>" for o in f[3])
            out.append(f'<div{full}><label>{label}{star}<select name="{nm}"{req}><option value="">Choose one</option>{opts}</select></label></div>')
        else:
            out.append(f'<div{full}><label>{label}{star}<input type="{kind}" name="{nm}"{req}{ac}></label></div>')
    out.append(f'<div class="full"><button class="btn btn-light" type="submit">{submit}</button></div><p data-dd-form-status></p></form>')
    return "".join(out)


exec(open(pathlib.Path(__file__).parent / "pages.py").read())
