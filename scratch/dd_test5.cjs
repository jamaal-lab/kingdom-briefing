const {chromium}=require('playwright');
const SP='/tmp/claude-0/-home-user-kingdom-briefing/556e63e4-cff2-5a2d-b961-cdbc1dd892b1/scratchpad/';
(async()=>{const b=await chromium.launch();let fails=0;const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)fails++};
for(const [n,w,h] of [['m',390,844],['d',1440,900]]){
const p=await b.newPage({viewport:{width:w,height:h}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:4434/index.html');await p.waitForTimeout(800);
ok(errs.length===0,n+' no JS errors '+errs.join('|'));
ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),n+' no h-overflow');
const small=await p.evaluate(()=>{const r=[];document.querySelectorAll('body *').forEach(e=>{if(e.closest('#rb,.stage,[hidden],.sr,.hp'))return;const t=[...e.childNodes].some(c=>c.nodeType==3&&c.textContent.trim());if(!t)return;const s=getComputedStyle(e);if(s.display==='none'||s.visibility==='hidden')return;if(parseFloat(s.fontSize)<14)r.push(e.tagName+':'+e.textContent.trim().slice(0,30))});return r});
ok(small.length===0,n+' text >=14px '+small.slice(0,5).join('|'));
if(n==='m'){ok(!(await p.$eval('#mbar',e=>e.classList.contains('on'))),'mbar hidden at top');
 await p.evaluate(()=>scrollTo({top:document.querySelector('#solution').offsetTop+200,behavior:'instant'}));await p.waitForTimeout(600);
 ok(await p.$eval('#mbar',e=>e.classList.contains('on')),'mbar shown mid-page');
 await p.evaluate(()=>document.querySelector('#intake').scrollIntoView({behavior:'instant'}));await p.waitForTimeout(600);
 ok(!(await p.$eval('#mbar',e=>e.classList.contains('on'))),'mbar hidden over form');}
await p.evaluate(()=>document.querySelector('#score').scrollIntoView({behavior:'instant'}));
await p.fill('#sc-url','example.com');
const ans=['Yes','No','Yes','Not sure','Yes','No'];
for(const a of ans){await p.click(`#sc-body .opt:text-is("${a}")`);}
await p.waitForTimeout(1100);
const res=await p.$eval('#sc-body',e=>e.innerText);ok(/3\s*of 6/.test(res)&&/Time for a rebuild/.test(res),n+' score result 3 of 6');
ok((await p.$$('#sc-body .sc-fix li')).length===3,n+' 3 gaps listed');
await p.evaluate(()=>document.querySelector('#sc-body').scrollIntoView({behavior:'instant',block:'center'}));await p.waitForTimeout(200);
await p.screenshot({path:SP+`sc-${n}.png`});
await p.click('#sc-body a.btn-gold');await p.waitForTimeout(400);
const v=await p.evaluate(()=>{const f=document.querySelector('#intake-form');const pt=[...f.querySelectorAll('[name=project_type]')].find(r=>r.checked);return {pt:pt&&pt.value,url:f.elements.website_url.value,fr:f.elements.frustrations.value,ws:f.elements.website_score.value}});
ok(v.pt==='A redesign of an existing site'&&v.url==='example.com'&&/3 of 6/.test(v.fr)&&/gaps/.test(v.ws),n+' prefill '+JSON.stringify(v));
await p.evaluate(()=>document.querySelector('#faq').scrollIntoView({behavior:'instant'}));await p.click('#faq summary >> nth=0');await p.waitForTimeout(300);
ok(await p.$eval('#faq details',e=>e.open),n+' faq opens');
for(const id of ['top','score','faq']){await p.evaluate(i=>document.getElementById(i).scrollIntoView({behavior:'instant'}),id);await p.waitForTimeout(400);await p.screenshot({path:SP+`v5-${n}-${id}.png`})}
await p.close()}
await b.close();console.log('fails',fails)})();
