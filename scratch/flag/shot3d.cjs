const {chromium}=require('playwright');
const SP='/tmp/claude-0/-home-user-kingdom-briefing/556e63e4-cff2-5a2d-b961-cdbc1dd892b1/scratchpad/';
const page=process.argv[2]||'t3d.html';
(async()=>{const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
for(const [n,w,h,wd] of [['d',1440,900,false],['m',390,844,false],['bot',1440,900,true]]){
const ctx=await b.newContext({viewport:{width:w,height:h}});
if(!wd)await ctx.addInitScript(()=>{Object.defineProperty(navigator,'webdriver',{get:()=>false})});
const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
await p.goto('http://localhost:4440/'+page);await p.waitForTimeout(n==='bot'?2500:6500);
console.log(n,'errors:',errs.join(' | ')||'none','gl-on:',await p.evaluate(()=>document.documentElement.classList.contains('gl-on')));
await p.screenshot({path:SP+`gl-${n}.png`});
if(n==='d'){await p.evaluate(()=>scrollTo(0,innerHeight*.5));await p.waitForTimeout(1500);await p.screenshot({path:SP+'gl-d-scroll.png'})}
await ctx.close()}
await b.close()})();
