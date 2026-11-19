const {chromium}=require('playwright');
const SP='/tmp/claude-0/-home-user-kingdom-briefing/556e63e4-cff2-5a2d-b961-cdbc1dd892b1/scratchpad/rb-';
(async()=>{const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
for(const [n,w,h] of [['d',1440,900],['m',390,844]]){
const ctx=await b.newContext({viewport:{width:w,height:h}});await ctx.addInitScript(()=>{Object.defineProperty(navigator,'webdriver',{get:()=>false})});
const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:4443/index.html');await p.waitForTimeout(1500);
console.log(n,'errors',errs.join('|')||'none',await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth?'no-overflow':'OVERFLOW'));
const top=await p.evaluate(()=>{const r=document.getElementById('rebuild');return {t:r.offsetTop,h:r.offsetHeight}});
for(let k=1;k<=6;k++){const y=top.t+(top.h-h)*((k-.5)/6);await p.evaluate(y=>scrollTo({top:y,behavior:'instant'}),y);await p.waitForTimeout(k>=5?3200:1300);
 const st=await p.$eval('#rb',e=>e.dataset.stage);await p.screenshot({path:SP+n+k+'.png'});console.log(n,k,'stage',st)}
await ctx.close()}
await b.close()})();
