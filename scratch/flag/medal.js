import * as THREE from 'three';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
import {UnrealBloomPass} from 'three/addons/postprocessing/UnrealBloomPass.js';
import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';
(function(){
var cv=document.getElementById('hero-gl'),hero=document.getElementById('top');if(!cv||!hero)return;
var H=document.documentElement,bot=navigator.webdriver===true,still=function(){return H.classList.contains('still')};
var gl;try{gl=new THREE.WebGLRenderer({canvas:cv,antialias:true,powerPreference:'high-performance'})}catch(e){return}
var small=innerWidth<900;gl.setPixelRatio(Math.min(devicePixelRatio,2.5));gl.toneMapping=THREE.ACESFilmicToneMapping;gl.toneMappingExposure=.82;gl.outputColorSpace=THREE.SRGBColorSpace;
var scene=new THREE.Scene(),cam=new THREE.PerspectiveCamera(30,1,.1,400);
var pm=new THREE.PMREMGenerator(gl);scene.environment=pm.fromScene(new RoomEnvironment(),.035).texture;
/* backdrop: midnight with a royal-blue bloom behind the emblem */
function bgTex(){var c=document.createElement('canvas');c.width=2048;c.height=1280;var x=c.getContext('2d');x.fillStyle='#040B16';x.fillRect(0,0,2048,1280);
var cx=small?1024:1380,cy=small?380:640,g=x.createRadialGradient(cx,cy,0,cx,cy,1100);g.addColorStop(0,'#1C4486');g.addColorStop(.32,'#0F2850');g.addColorStop(.7,'#071530');g.addColorStop(1,'#040B16');x.fillStyle=g;x.fillRect(0,0,2048,1280);
var g2=x.createRadialGradient(cx,cy+360,0,cx,cy+360,620);g2.addColorStop(0,'rgba(232,178,62,.22)');g2.addColorStop(1,'rgba(232,178,62,0)');x.fillStyle=g2;x.fillRect(0,0,2048,1280);
var t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t}
scene.background=bgTex();
/* light rays fanning out behind the emblem */
var U={t:{value:0}};
var rays=new THREE.Mesh(new THREE.PlaneGeometry(90,90),new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,uniforms:{t:U.t,k:{value:0}},
vertexShader:'varying vec2 vU;void main(){vU=uv-.5;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
fragmentShader:'uniform float t,k;varying vec2 vU;void main(){float r=length(vU),a=atan(vU.y,vU.x);float s=pow(abs(sin(a*14.+t*.05)),18.)*.6+pow(abs(sin(a*7.-t*.03+1.3)),30.)*.5;float f=smoothstep(.5,.14,r)*smoothstep(.11,.17,r);gl_FragColor=vec4(vec3(1.,.8,.42)*s*f*.16*k,1.);}'}));
rays.position.z=-7;
/* gold dust drifting upward */
var dustN=small?260:520,dp=new Float32Array(dustN*3),ds=new Float32Array(dustN);for(var i=0;i<dustN;i++){dp[i*3]=(Math.random()-.5)*70;dp[i*3+1]=(Math.random()-.5)*44;dp[i*3+2]=(Math.random()-.5)*30-4;ds[i]=Math.random()}
var dg=new THREE.BufferGeometry();dg.setAttribute('position',new THREE.BufferAttribute(dp,3));dg.setAttribute('seed',new THREE.BufferAttribute(ds,1));
var dust=new THREE.Points(dg,new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,uniforms:{t:U.t,px:{value:gl.getPixelRatio()}},
vertexShader:'attribute float seed;uniform float t,px;varying float a;void main(){vec3 p=position;p.y=mod(p.y+t*(.25+seed*.5)+22.,44.)-22.;p.x+=sin(t*.3+seed*20.)*.6;a=(.25+.75*seed)*(.6+.4*sin(t*1.7+seed*30.));vec4 mv=modelViewMatrix*vec4(p,1.);gl_PointSize=px*(1.2+seed*3.4)*(36./-mv.z);gl_Position=projectionMatrix*mv;}',
fragmentShader:'varying float a;void main(){float d=length(gl_PointCoord-.5);float m=smoothstep(.5,0.,d);gl_FragColor=vec4(vec3(1.,.82,.45)*m*a,m*a);}'}));
scene.add(dust);
/* the emblem */
var medal=new THREE.Group(),inner=new THREE.Group();medal.add(inner);scene.add(medal);medal.add(rays);
var GOLD=new THREE.MeshPhysicalMaterial({color:0xD4A033,metalness:1,roughness:.24,clearcoat:.4,clearcoatRoughness:.14,envMapIntensity:.95});
var GOLD2=new THREE.MeshPhysicalMaterial({color:0xE3B548,metalness:1,roughness:.34,envMapIntensity:.85,emissive:0x2a1a00,emissiveIntensity:.2});
function lathe(pts,mat){var g=new THREE.LatheGeometry(pts.map(function(p){return new THREE.Vector2(p[0],p[1])}),256);var m=new THREE.Mesh(g,mat);m.rotation.x=Math.PI/2;return m}
inner.add(lathe([[10.95,-.5],[11.05,.15],[10.95,.62],[10.6,.86],[10.2,.78],[9.95,.42],[9.9,.12],[9.86,0]],GOLD));
inner.add(lathe([[8.42,0],[8.38,.18],[8.26,.3],[8.1,.26],[8.02,.1],[7.98,0]],GOLD));
var back=new THREE.Mesh(new THREE.CircleGeometry(11,128),new THREE.MeshPhysicalMaterial({color:0xB98A2A,metalness:1,roughness:.45}));back.position.z=-.5;back.rotation.y=Math.PI;inner.add(back);
/* the enamel face, painted at 4096px so the lettering stays sharp */
var FACE=4096,faceC=document.createElement('canvas');faceC.width=faceC.height=FACE;
var faceT=new THREE.CanvasTexture(faceC);faceT.colorSpace=THREE.SRGBColorSpace;faceT.anisotropy=gl.capabilities.getMaxAnisotropy();
var face=new THREE.Mesh(new THREE.CircleGeometry(9.9,256),new THREE.MeshBasicMaterial({map:faceT,toneMapped:false}));inner.add(face);
function arcText(x,txt,rad,mid,topArc,font,track){x.font=font;var ws=[],tot=0;for(var i=0;i<txt.length;i++){var w=x.measureText(txt[i]).width+track;ws.push(w);tot+=w}tot-=track;var a=mid-(topArc?1:-1)*tot/rad/2;
for(var j=0;j<txt.length;j++){var c=a+(topArc?1:-1)*ws[j]/2/rad;x.save();x.translate(FACE/2+Math.cos(c)*rad,FACE/2+Math.sin(c)*rad);x.rotate(c+(topArc?Math.PI/2:-Math.PI/2));x.fillText(txt[j],0,0);x.restore();a+=(topArc?1:-1)*ws[j]/rad}}
function paint(){var x=faceC.getContext('2d'),C=FACE/2,S=FACE/19.8;x.clearRect(0,0,FACE,FACE);x.textAlign='center';x.textBaseline='middle';
/* band */
var g=x.createRadialGradient(C,C,8*S,C,C,9.9*S);g.addColorStop(0,'#0C2347');g.addColorStop(1,'#091B38');x.fillStyle=g;x.beginPath();x.arc(C,C,9.9*S,0,7);x.fill();
/* inner field: night sky over water */
x.save();x.beginPath();x.arc(C,C,8.05*S,0,7);x.clip();var sk=x.createLinearGradient(0,C-8*S,0,C);sk.addColorStop(0,'#08183A');sk.addColorStop(.6,'#143466');sk.addColorStop(.9,'#2A4068');sk.addColorStop(1,'#9A7038');x.fillStyle=sk;x.fillRect(0,0,FACE,C);
var wa=x.createLinearGradient(0,C,0,C+8*S);wa.addColorStop(0,'#13305E');wa.addColorStop(.5,'#0E2850');wa.addColorStop(1,'#0A1D3C');x.fillStyle=wa;x.fillRect(0,C,FACE,C);
for(var i=0;i<140;i++){var sx=C+(Math.random()-.5)*15*S,sy=C-Math.random()*7.4*S;x.fillStyle='rgba(255,246,220,'+(.25+Math.random()*.6)+')';x.beginPath();x.arc(sx,sy,Math.random()*3.2+1,0,7);x.fill()}
/* wordmark */
x.shadowColor='rgba(0,0,0,.6)';x.shadowOffsetY=S*.05;x.shadowBlur=S*.03;
x.fillStyle='#F7F2E6';x.font='700 '+(2.35*S)+'px sentinel, "Rockwell", "Clarendon", Georgia, serif';x.fillText('BRIDGE',C,C+2.05*S);
x.font='700 '+(1.02*S)+'px futura-pt, "Futura", "Trebuchet MS", sans-serif';x.fillText('TO BETTER',C,C+3.85*S);x.fillText('SOLUTIONS',C,C+4.95*S);
x.shadowColor='transparent';var gg=x.createLinearGradient(C-6*S,0,C+6*S,0);gg.addColorStop(0,'rgba(226,177,60,0)');gg.addColorStop(.5,'#F4CF6A');gg.addColorStop(1,'rgba(226,177,60,0)');x.fillStyle=gg;x.fillRect(C-6.4*S,C+3.82*S,3.1*S,S*.08);x.fillRect(C+3.3*S,C+3.82*S,3.1*S,S*.08);
x.restore();
/* ring lettering in gold */
var gold=x.createLinearGradient(0,0,FACE,FACE);gold.addColorStop(0,'#F9DC86');gold.addColorStop(.5,'#E2B13C');gold.addColorStop(1,'#F6D27A');x.fillStyle=gold;x.shadowColor='rgba(0,0,0,.5)';x.shadowOffsetY=S*.04;x.shadowBlur=S*.06;
var rf='700 '+(.98*S)+'px futura-pt, "Futura", "Trebuchet MS", sans-serif';
arcText(x,'SYSTEMS ARCHITECTURE & INNOVATION',9.12*S,-Math.PI/2,true,rf,S*.07);
arcText(x,'SMARTER SYSTEMS • BETTER OUTCOMES',9.12*S,Math.PI/2,false,rf,S*.07);
faceT.needsUpdate=true}
paint();if(document.fonts){Promise.all(['700 80px sentinel','700 80px futura-pt'].map(function(f){return document.fonts.load(f).catch(function(){})})).then(function(){paint();if(bot||still())frame(performance.now())})}
/* the bridge in raised gold relief, with light travelling along the cables */
function pathMat(off){return new THREE.ShaderMaterial({uniforms:{t:U.t,reveal:{value:0},off:{value:off}},
vertexShader:'varying vec2 vU;void main(){vU=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
fragmentShader:'uniform float t,reveal,off;varying vec2 vU;void main(){float x=vU.x;if(x>reveal)discard;float h=fract(x*1.6-t*.22+off);float p=pow(h,30.)*5.+pow(h,6.)*.4;float tip=smoothstep(reveal-.06,reveal,x)*3.;vec3 c=vec3(1.,.83,.45)*(.95+p+tip);gl_FragColor=vec4(c,1.);\n#include <tonemapping_fragment>\n#include <colorspace_fragment>\n}'})}
var relief=new THREE.Group();inner.add(relief);var cableMats=[];
function deckY(x){return -.15+.55*(1-Math.pow(x/7.7,2))}
[-1,1].forEach(function(sd){[-.34,.34].forEach(function(z,k){var c=new THREE.QuadraticBezierCurve3(new THREE.Vector3(sd*.85,5.55,.5+z),new THREE.Vector3(sd*3.6,1.35,.5+z),new THREE.Vector3(sd*7.75,deckY(7.7)+.15,.5+z));var m=pathMat(k*.4+(sd>0?.2:0));cableMats.push(m);relief.add(new THREE.Mesh(new THREE.TubeGeometry(c,160,.07,10,false),m))})});
/* suspenders */
(function(){var v=[];for(var x=1.2;x<7.5;x+=.42){[-1,1].forEach(function(sd){var tt=0,bx=0;for(var it=0;it<30;it++){var u=tt,px=(1-u)*(1-u)*.85+2*(1-u)*u*3.6+u*u*7.75;if(px<x)tt+=1/60;else break}var u2=tt,cy=(1-u2)*(1-u2)*5.55+2*(1-u2)*u2*1.35+u2*u2*(deckY(7.7)+.15);v.push(sd*x,deckY(x)+.1,.5,sd*x,cy,.5)})}
var g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(v,3));var sm=new THREE.LineBasicMaterial({color:0xF4D27A,transparent:true,opacity:0});var l=new THREE.LineSegments(g,sm);l.userData.sus=sm;relief.add(l)})();
/* deck: an arched span with a lower chord and struts */
var dk=[],dk2=[];for(var i=0;i<=80;i++){var x=-7.7+i*15.4/80;dk.push(new THREE.Vector3(x,deckY(x),.5));dk2.push(new THREE.Vector3(x,deckY(x)-.55+.25*Math.pow(x/7.7,2),.45))}
relief.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(dk),200,.16,10,false),GOLD));
relief.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(dk2),200,.07,8,false),GOLD2));
for(var sx=-7;sx<=7;sx+=1){var h1=deckY(sx),h2=deckY(sx)-.55+.25*Math.pow(sx/7.7,2),st=new THREE.Mesh(new THREE.CylinderGeometry(.045,.045,h1-h2,8),GOLD2);st.position.set(sx,(h1+h2)/2,.47);relief.add(st)}
/* tower */
[-.85,.85].forEach(function(x){var g=new THREE.BoxGeometry(.38,6.4,.42),m=new THREE.Mesh(g,GOLD);m.position.set(x,2.45,.5);relief.add(m)});
[5.3,3.9,2.1].forEach(function(y,i){var b=new THREE.Mesh(new THREE.BoxGeometry(1.75,i?.18:.26,.32),GOLD);b.position.set(0,y,.5);relief.add(b)});
var xb=new THREE.Group();[[-1,1],[1,-1]].forEach(function(p){var b=new THREE.Mesh(new THREE.BoxGeometry(.09,1.95,.18),GOLD2);b.position.set(0,4.6,.5);b.rotation.z=p[0]*.62;xb.add(b)});relief.add(xb);
/* beacons on the tower and a warm glow along the deck */
var glowT=(function(){var c=document.createElement('canvas');c.width=c.height=256;var x=c.getContext('2d'),g=x.createRadialGradient(128,128,0,128,128,128);g.addColorStop(0,'rgba(255,244,214,1)');g.addColorStop(.2,'rgba(255,214,120,.8)');g.addColorStop(.55,'rgba(226,177,60,.16)');g.addColorStop(1,'rgba(226,177,60,0)');x.fillStyle=g;x.fillRect(0,0,256,256);var t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t})();
var beacons=[];[-.85,.85].forEach(function(x){var s=new THREE.Sprite(new THREE.SpriteMaterial({map:glowT,blending:THREE.AdditiveBlending,depthWrite:false,transparent:true,opacity:0}));s.position.set(x,5.75,.75);s.scale.set(1.5,1.5,1);relief.add(s);beacons.push(s)});
/* lights */
var key=new THREE.DirectionalLight(0xFFF1D6,1.6);key.position.set(-14,16,22);scene.add(key);
var sweep=new THREE.PointLight(0xFFD98A,120,60,1.7);scene.add(sweep);
var rimL=new THREE.DirectionalLight(0x6E9CFF,1.2);rimL.position.set(18,-6,-10);scene.add(rimL);
/* post: bloom */
var comp=new EffectComposer(gl);comp.addPass(new RenderPass(scene,cam));var bloom=new UnrealBloomPass(new THREE.Vector2(512,512),.5,.45,.97);comp.addPass(bloom);comp.addPass(new OutputPass());
/* layout */
var base={x:0,y:0,s:1};
function size(){var w=hero.clientWidth,h=hero.clientHeight;small=w<900;gl.setSize(w,h,false);comp.setSize(w,h);bloom.setSize(Math.max(256,w>>1),Math.max(256,h>>1));cam.aspect=w/h;
if(small){cam.fov=38;cam.position.set(0,0,52);var vh=2*52*Math.tan(19*Math.PI/180),vw=vh*cam.aspect;base.s=Math.min(vw*.56/22,vh*.235/22);base.x=0;base.y=vh/2-11*base.s-vh*.08}
else{cam.fov=30;cam.position.set(0,0,52);var vh2=2*52*Math.tan(15*Math.PI/180),vw2=vh2*cam.aspect;base.s=Math.min(vh2*.7/22,vw2*.4/22);base.x=vw2*.27;base.y=vh2*.01}
cam.updateProjectionMatrix();scene.background=bgTex()}
size();addEventListener('resize',size);
/* motion */
var tx=0,ty=0,mx=0,my=0;addEventListener('pointermove',function(e){tx=e.clientX/innerWidth-.5;ty=e.clientY/innerHeight-.5},{passive:true});
function ease(v){v=Math.min(1,Math.max(0,v));return 1-Math.pow(1-v,3)}
var t0=performance.now(),ready=false,live=true,raf=0;
function frame(now){var t=(now-t0)/1000,done=still()||bot;U.t.value=t;
var a=done?1:ease((t-.2)/1.9),rv=done?1:ease((t-1.1)/1.8),lit=done?1:ease((t-2.4)/1);
mx+=(tx-mx)*.05;my+=(ty-my)*.05;
var r=hero.getBoundingClientRect(),sp=Math.min(1,Math.max(0,-r.top/Math.max(1,r.height)));
var idle=done&&bot?0:Math.sin(t*.45);
medal.position.set(base.x-sp*base.x*.6,base.y+(done&&bot?0:Math.sin(t*.8)*.25)+sp*6,sp*14);
medal.scale.setScalar(base.s*(.82+.18*a));
inner.rotation.set(-my*.22+sp*.55,(1-a)*-1.5+(-.2+mx*.4+idle*.06)*(a),.02*idle);
rays.material.uniforms.k.value=lit;rays.rotation.z=t*.02;
cableMats.forEach(function(m){m.uniforms.reveal.value=rv});relief.children.forEach(function(c){if(c.userData.sus)c.userData.sus.opacity=.75*rv});
beacons.forEach(function(b,i){b.material.opacity=lit*(.85+.15*Math.sin(t*2.2+i))});
var sa=done&&bot?.6:t*.5;sweep.position.set(Math.cos(sa)*18+base.x,Math.sin(sa*.7)*9+base.y,14);
dust.rotation.y=mx*.08;
comp.render();if(!ready){ready=true;H.classList.add('gl-on')}}
function loop(now){raf=0;if(!live)return;frame(now);if(!still()&&!bot)raf=requestAnimationFrame(loop)}
if('IntersectionObserver'in window)new IntersectionObserver(function(es){live=es[0].isIntersecting;if(live&&!raf&&!still()&&!bot)raf=requestAnimationFrame(loop)}).observe(hero);
if(bot){var n=0;(function warm(){frame(performance.now()+6000);if(++n<3)setTimeout(warm,80)})()}else{raf=requestAnimationFrame(loop)}
addEventListener('scroll',function(){if(still()&&live)frame(performance.now())},{passive:true});
var mt=document.getElementById('mtog');if(mt)mt.addEventListener('click',function(){setTimeout(function(){if(!still()&&!raf&&live)raf=requestAnimationFrame(loop);else frame(performance.now())},30)});
})();
