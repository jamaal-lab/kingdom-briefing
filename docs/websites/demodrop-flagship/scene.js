import * as THREE from 'three';
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
import {UnrealBloomPass} from 'three/addons/postprocessing/UnrealBloomPass.js';
import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';
(function(){
var cv=document.getElementById('hero-gl'),hero=document.getElementById('top');if(!cv||!hero)return;
var H=document.documentElement,bot=navigator.webdriver===true,still=function(){return H.classList.contains('still')};
var gl;try{gl=new THREE.WebGLRenderer({canvas:cv,antialias:true,powerPreference:'high-performance'})}catch(e){return}
var small=innerWidth<900;gl.setPixelRatio(Math.min(devicePixelRatio,small?1.75:2));gl.toneMapping=THREE.ACESFilmicToneMapping;gl.toneMappingExposure=.95;gl.outputColorSpace=THREE.SRGBColorSpace;
var MID=new THREE.Color(0x050E1A),GOLD=new THREE.Color(0xC9A24A),HOT=new THREE.Color(0xF6D98E);
var scene=new THREE.Scene();scene.background=MID;scene.fog=new THREE.FogExp2(0x050E1A,.011);
var cam=new THREE.PerspectiveCamera(36,1,.1,600);
var U={t:{value:0},reveal:{value:0},on:{value:0}};
/* sky dome: deep midnight to a royal-blue and gold haze at the horizon */
var sky=new THREE.Mesh(new THREE.SphereGeometry(300,48,24),new THREE.ShaderMaterial({side:THREE.BackSide,depthWrite:false,fog:false,uniforms:{t:{value:0}},
vertexShader:'varying vec3 vP;void main(){vP=normalize(position);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
fragmentShader:'varying vec3 vP;uniform float t;void main(){float h=vP.y;vec3 top=vec3(.004,.012,.03);vec3 mid=vec3(.025,.065,.15);vec3 haze=vec3(.5,.33,.13);float k=smoothstep(.45,0.,h);vec3 c=mix(top,mid,k);c=mix(c,haze,pow(smoothstep(.12,-.02,h),2.4)*.32*(.75+.25*vP.x));gl_FragColor=vec4(c,1.);}'}));
scene.add(sky);
/* stars */
(function(){var n=small?700:1400,p=new Float32Array(n*3),s=new Float32Array(n);for(var i=0;i<n;i++){var th=Math.random()*Math.PI*2,ph=Math.random()*.55+.08,r=260;p[i*3]=Math.cos(th)*Math.cos(ph)*r;p[i*3+1]=Math.sin(ph)*r;p[i*3+2]=Math.sin(th)*Math.cos(ph)*r;s[i]=Math.random()}
var g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(p,3));g.setAttribute('seed',new THREE.BufferAttribute(s,1));
scene.add(new THREE.Points(g,new THREE.ShaderMaterial({transparent:true,depthWrite:false,fog:false,blending:THREE.AdditiveBlending,uniforms:{t:U.t},
vertexShader:'attribute float seed;uniform float t;varying float a;void main(){a=.35+.65*abs(sin(t*.6+seed*40.));gl_PointSize=(1.+seed*1.6)*'+(gl.getPixelRatio()).toFixed(2)+';gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
fragmentShader:'varying float a;void main(){vec2 d=gl_PointCoord-.5;float m=smoothstep(.5,0.,length(d));gl_FragColor=vec4(vec3(1.,.95,.85)*m*a*.8,m*a);}'})))})();
/* geometry of a suspension bridge along x */
var DECK=2.2,TW=24,SPAN=26,TOP=DECK+20,SAG=DECK+3.2,HALF=2.4,END=78;
function cableY(x){var a=Math.abs(x);if(a<=SPAN){var u=x/SPAN;return SAG+(TOP-SAG)*u*u}var v=(a-SPAN)/(END-SPAN);return TOP+(DECK+.6-TOP)*Math.pow(v,.85)}
/* light-path material: gold tube, drawn in from the towers, with pulses of light travelling along it */
function pathMat(off,dens,base){return new THREE.ShaderMaterial({fog:true,uniforms:THREE.UniformsUtils.merge([THREE.UniformsLib.fog,{t:{value:0},reveal:{value:0},off:{value:off},dens:{value:dens},base:{value:base},col:{value:HOT.clone()}}]),
vertexShader:'#include <common>\n#include <fog_pars_vertex>\nvarying vec2 vUv;void main(){vUv=uv;vec4 mvPosition=modelViewMatrix*vec4(position,1.);gl_Position=projectionMatrix*mvPosition;\n#include <fog_vertex>\n}',
fragmentShader:'#include <common>\n#include <fog_pars_fragment>\nuniform float t,reveal,off,dens,base;uniform vec3 col;varying vec2 vUv;void main(){float x=vUv.x;float d=abs(x-.5)*2.;float shown=1.-smoothstep(reveal-.03,reveal,d);if(shown<.001)discard;float h=fract(x*dens-t*.12+off);float p=pow(h,26.)*4.+pow(h,5.)*.25;float edge=(1.-smoothstep(0.,.03,abs(d-reveal)))*3.*step(reveal,.999);gl_FragColor=vec4(col*(base+p+edge)*shown,1.);\n#include <tonemapping_fragment>\n#include <colorspace_fragment>\n#include <fog_fragment>\n}'})}
var mats=[],bridge=new THREE.Group();scene.add(bridge);
[-HALF,HALF].forEach(function(z,i){var pts=[];for(var k=0;k<=240;k++){var x=-END+k*(2*END/240);pts.push(new THREE.Vector3(x,cableY(x),z))}
var m=pathMat(i*.37,3.,1.15);mats.push(m);bridge.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),480,.085,8,false),m));
/* deck edge light rails */
var r=pathMat(.15+i*.5,5.,.55);mats.push(r);bridge.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.LineCurve3(new THREE.Vector3(-END,DECK+.32,z*1.12),new THREE.Vector3(END,DECK+.32,z*1.12)),2,.035,6,false),r))});
/* suspenders */
(function(){var v=[];for(var x=-END+2;x<END-1;x+=1.6){var y=cableY(x);if(y-DECK<.9)continue;[-HALF,HALF].forEach(function(z){v.push(x,DECK+.3,z,x,y,z)})}
var g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(v,3));
var sus=new THREE.LineSegments(g,new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,fog:true,uniforms:THREE.UniformsUtils.merge([THREE.UniformsLib.fog,{reveal:{value:0}}]),
vertexShader:'#include <common>\n#include <fog_pars_vertex>\nvarying float vx;void main(){vx=abs(position.x)/'+END.toFixed(1)+';vec4 mvPosition=modelViewMatrix*vec4(position,1.);gl_Position=projectionMatrix*mvPosition;\n#include <fog_vertex>\n}',
fragmentShader:'#include <common>\n#include <fog_pars_fragment>\nuniform float reveal;varying float vx;void main(){float s=1.-smoothstep(reveal-.05,reveal,vx);gl_FragColor=vec4(vec3(.85,.66,.3)*.55*s,.6*s);\n#include <fog_fragment>\n}'}));sus.userData.sus=true;bridge.add(sus)})();
/* deck and towers in dark metal, edged in gold */
var dark=new THREE.MeshStandardMaterial({color:0x0B1A2B,metalness:.85,roughness:.35});
var deck=new THREE.Mesh(new THREE.BoxGeometry(END*2,.55,HALF*2.3),dark);deck.position.y=DECK;bridge.add(deck);
var edgeM=new THREE.LineBasicMaterial({color:0xC9A24A,transparent:true,opacity:.55});
[-TW,TW].forEach(function(x){[-HALF,HALF].forEach(function(z){var g=new THREE.BoxGeometry(.9,TOP+1.2,.9),m=new THREE.Mesh(g,dark);m.position.set(x,(TOP+1.2)/2,z);bridge.add(m);var e=new THREE.LineSegments(new THREE.EdgesGeometry(g),edgeM);e.position.copy(m.position);bridge.add(e)});
[TOP-1,TOP-8,DECK+3.5].forEach(function(y){var b=new THREE.Mesh(new THREE.BoxGeometry(.7,.7,HALF*2),dark);b.position.set(x,y,0);bridge.add(b)})});
/* deck lamps: soft glowing points that switch on outward from the centre */
var tex=(function(){var c=document.createElement('canvas');c.width=c.height=128;var x=c.getContext('2d'),g=x.createRadialGradient(64,64,0,64,64,64);g.addColorStop(0,'rgba(255,240,200,1)');g.addColorStop(.18,'rgba(246,217,142,.85)');g.addColorStop(.5,'rgba(201,162,74,.18)');g.addColorStop(1,'rgba(201,162,74,0)');x.fillStyle=g;x.fillRect(0,0,128,128);var t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t})();
var lp=[];for(var x=-END+1;x<END;x+=3.2){lp.push(x,DECK+.9,-HALF*1.15,x,DECK+.9,HALF*1.15)}
var lg=new THREE.BufferGeometry();lg.setAttribute('position',new THREE.Float32BufferAttribute(lp,3));
var lampM=new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,uniforms:{map:{value:tex},on:U.on,t:U.t,px:{value:gl.getPixelRatio()}},
vertexShader:'uniform float on,t,px;varying float a;void main(){float d=abs(position.x)/'+END.toFixed(1)+';a=smoothstep(d,d+.06,on)*(.85+.15*sin(t*3.+position.x));vec4 mv=modelViewMatrix*vec4(position,1.);gl_PointSize=px*260./-mv.z;gl_Position=projectionMatrix*mv;}',
fragmentShader:'uniform sampler2D map;varying float a;void main(){vec4 c=texture2D(map,gl_PointCoord);gl_FragColor=vec4(c.rgb*a*1.6,c.a*a);}'});
bridge.add(new THREE.Points(lg,lampM));
/* tower beacons */
[-TW,TW].forEach(function(x){[-HALF,HALF].forEach(function(z){var s=new THREE.Sprite(new THREE.SpriteMaterial({map:tex,color:0xFFE6A8,blending:THREE.AdditiveBlending,depthWrite:false,transparent:true}));s.position.set(x,TOP+1.5,z);s.scale.set(2.6,2.6,1);bridge.add(s)})});
/* water: dark glassy plane with shimmering gold light streaks under the lamps and cables */
var water=new THREE.Mesh(new THREE.PlaneGeometry(700,700,1,1),new THREE.ShaderMaterial({fog:true,uniforms:THREE.UniformsUtils.merge([THREE.UniformsLib.fog,{t:{value:0},on:{value:0}}]),
vertexShader:'#include <common>\n#include <fog_pars_vertex>\nvarying vec3 wp;void main(){vec4 w=modelMatrix*vec4(position,1.);wp=w.xyz;vec4 mvPosition=viewMatrix*w;gl_Position=projectionMatrix*mvPosition;\n#include <fog_vertex>\n}',
fragmentShader:'#include <common>\n#include <fog_pars_fragment>\nuniform float t,on;varying vec3 wp;float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}void main(){vec3 c=vec3(.01,.03,.06);float z=wp.z;float rip=n(vec2(wp.x*.9,z*3.2-t*1.4))*.6+n(vec2(wp.x*2.3,z*7.-t*2.1))*.4;float lane=pow(abs(cos(3.14159*wp.x/3.2)),46.);float d=abs(wp.x)/'+END.toFixed(1)+';float lit=smoothstep(d,d+.06,on)*step(abs(wp.x),'+END.toFixed(1)+');float fall=exp(-max(z-2.,0.)*.075)*step(-4.,z);float s=lane*smoothstep(.55,.97,rip)*fall*lit;float glow=exp(-abs(z-1.)*.22)*.07*lit*(.6+.4*rip);c+=vec3(.95,.72,.32)*(s*1.4+glow);c+=vec3(.05,.12,.25)*.25*smoothstep(-80.,40.,-z);gl_FragColor=vec4(c,1.);\n#include <tonemapping_fragment>\n#include <colorspace_fragment>\n#include <fog_fragment>\n}'}));
water.rotation.x=-Math.PI/2;scene.add(water);
/* distant city glow on the far shore */
(function(){var n=small?260:520,p=[];for(var i=0;i<n;i++){p.push((Math.random()-.5)*360,Math.random()*Math.random()*7+.4,-70-Math.random()*60)}var g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));
scene.add(new THREE.Points(g,new THREE.PointsMaterial({map:tex,size:1.4,sizeAttenuation:true,color:0xE9C877,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,opacity:.75})))})();
scene.add(new THREE.HemisphereLight(0x3a5a8c,0x050E1A,.9));var key=new THREE.DirectionalLight(0xF6D98E,1.6);key.position.set(-30,40,30);scene.add(key);var rim=new THREE.PointLight(0xC9A24A,60,80,1.6);rim.position.set(0,DECK+6,8);scene.add(rim);
/* post: bloom so the gold genuinely glows */
var comp=new EffectComposer(gl);comp.addPass(new RenderPass(scene,cam));var bloom=new UnrealBloomPass(new THREE.Vector2(512,512),small?.8:1.0,.55,.6);comp.addPass(bloom);comp.addPass(new OutputPass());
/* camera rig: slow drift, pointer parallax, and a scroll-driven glide along the deck */
var mx=0,my=0,tx=0,ty=0,sp=0;addEventListener('pointermove',function(e){tx=e.clientX/innerWidth-.5;ty=e.clientY/innerHeight-.5},{passive:true});
function size(){var w=hero.clientWidth,h=hero.clientHeight;small=w<900;gl.setSize(w,h,false);comp.setSize(w,h);bloom.setSize(w>>1,h>>1);cam.aspect=w/h;cam.fov=small?52:36;cam.updateProjectionMatrix()}
size();addEventListener('resize',size);
var look=new THREE.Vector3();
function place(time){var s=sp,dr=Math.sin(time*.00006)*1.5;mx+=(tx-mx)*.04;my+=(ty-my)*.04;
if(small){cam.position.set(-12+mx*3+s*10,3.2-my*1.5+s*3,74-s*26);look.set(17+s*8,-13,0)}else{cam.position.set(-34+mx*6+dr+s*22,6.2-my*2+s*4,40-s*22);look.set(10+s*14,DECK+8.5,-2)}
cam.lookAt(look)}
var t0=performance.now(),ready=false,live=true,raf=0;
function frame(now){var t=(now-t0)/1000;U.t.value=t;var rv=still()||bot?1:Math.min(1,Math.max(0,(t-.35)/2.6));rv=1-Math.pow(1-rv,3);var on=still()||bot?1.06:Math.min(1.06,Math.max(0,(t-1.2)/2.2)*1.06);
mats.forEach(function(m){m.uniforms.t.value=t;m.uniforms.reveal.value=rv});bridge.children.forEach(function(c){if(c.userData.sus)c.material.uniforms.reveal.value=rv});U.on.value=on;water.material.uniforms.t.value=t;water.material.uniforms.on.value=on;
var r=hero.getBoundingClientRect();sp=Math.min(1,Math.max(0,-r.top/Math.max(1,r.height)));place(now);comp.render();
if(!ready){ready=true;H.classList.add('gl-on')}}
function loop(now){raf=0;if(!live)return;frame(now);if(!still()&&!bot)raf=requestAnimationFrame(loop)}
if('IntersectionObserver'in window)new IntersectionObserver(function(es){live=es[0].isIntersecting;if(live&&!raf&&!still()&&!bot)raf=requestAnimationFrame(loop)}).observe(hero);
if(bot){var n=0;(function warm(){frame(performance.now()+4000);if(++n<3)setTimeout(warm,60)})()}else{raf=requestAnimationFrame(loop)}
addEventListener('scroll',function(){if(still()&&live)frame(performance.now())},{passive:true});
var mt=document.getElementById('mtog');if(mt)mt.addEventListener('click',function(){setTimeout(function(){if(!still()&&!raf&&live)raf=requestAnimationFrame(loop);else frame(performance.now())},30)});
})();
