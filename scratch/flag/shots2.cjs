const {chromium}=require('playwright');
const SP='/tmp/claude-0/-home-user-kingdom-briefing/556e63e4-cff2-5a2d-b961-cdbc1dd892b1/scratchpad/fl2-';
(async()=>{const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});let fails=0;const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)fails++};
for(const [n,w,h] of [['d',1440,900],['m',390,844]]){
const ctx=await b.newContext({viewport:{width:w,height:h}});await ctx.addInitScript(()=>{Object.defineProperty(navigator,'webdriver',{get:()=>false})});
const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error'&&!/typekit/.test(m.text()))errs.push(m.text())});
await p.goto('http://localhost:4442/index.html');await p.waitForTimeout(14000);
ok(errs.length===0,n+' no errors '+errs.join(' | '));
ok(await p.evaluate(()=>document.documentElement.classList.contains('gl-on')),n+' 3D running');
ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),n+' no h-overflow');
await p.screenshot({path:SP+n+'-hero.png'});
for(const id of ['vision','transformation','services']){await p.evaluate(i=>document.getElementById(i).scrollIntoView({behavior:'instant'}),id);await p.waitForTimeout(1300);await p.screenshot({path:SP+n+'-'+id+'.png'})}
if(n==='d'){await p.evaluate(()=>document.getElementById('services').scrollIntoView({behavior:'instant'}));await p.waitForTimeout(800);const r=await p.$eval('.cap',e=>{const b=e.getBoundingClientRect();return [b.x+b.width/2,b.y+b.height/2]});await p.mouse.move(r[0],r[1]);await p.waitForTimeout(900);await p.screenshot({path:SP+'d-caphover.png'});
 await p.click('.cap >> nth=2');await p.waitForTimeout(500);const pt=await p.evaluate(()=>{const r=[...document.querySelectorAll('[name=project_type]')].find(x=>x.checked);return r&&r.value});ok(pt==='An advanced interactive digital experience','cap preset '+pt)}
await ctx.close()}
await b.close();console.log('fails',fails)})();
