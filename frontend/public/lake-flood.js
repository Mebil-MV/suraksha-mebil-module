const W=1280,H=720,D=21,TAU=Math.PI*2,cv=document.getElementById('c'),ctx=cv.getContext('2d'),dpr=Math.min(devicePixelRatio||1,2);
cv.width=W*dpr;cv.height=H*dpr;
const cl=(v,a=0,b=1)=>v<a?a:v>b?b:v,lp=(a,b,k)=>a+(b-a)*k,sm=k=>k*k*(3-2*k),mod=(a,n)=>((a%n)+n)%n;
function hs(n){n|=0;n=(n^61)^(n>>>16);n=(n+(n<<3))|0;n^=n>>>4;n=Math.imul(n,0x27d4eb2d);n^=n>>>15;return(n>>>0)/4294967296}
const hx=s=>[1,3,5].map(i=>parseInt(s.slice(i,i+2),16)),mx=(a,b,k)=>a.map((v,i)=>lp(v,b[i],k)),rg=(c,a=1)=>`rgba(${c[0]|0},${c[1]|0},${c[2]|0},${a})`;
const SKY={top:[hx('#6fa3c9'),hx('#232f3b')],mid:[hx('#a9d0e0'),hx('#46565f')],hor:[hx('#f4e4b8'),hx('#79878a')]};
// ---- terrain: a bowl-shaped lake (x 250..840) between the town on the right and the high ground on the left
const BL=250,BR=840,W0=476;
const gb=x=>x<BL?470:x>BR?lp(470,515,cl((x-BR)/440)):470+145*Math.pow(Math.sin(Math.PI*(x-BL)/(BR-BL)),.7);
const XF=t=>lp(260,800,cl((t-2.8)/3.8));                       // front of the earth-fill
const gs=(x,t)=>{const g=gb(x);if(x<BL||x>BR)return g;const f=XF(t);return x<f?470:lp(470,g,sm(cl((x-f)/110)))};
const D0=t=>64*sm(cl((t-8.6)/5.5)),XW=t=>lp(760,1400,sm(cl((t-8.6)/4.8))),XL=t=>lp(720,300,sm(cl((t-8.4)/3.2)));
const dep=(x,t)=>{const xl=XL(t),xw=XW(t);if(x<xl||x>xw)return 0;return(D0(t)*(x<780?Math.exp((x-780)/330):Math.exp(-(x-780)/380))+5*sm(cl((t-8.4)/1.2)))*cl((x-xl)/70)*cl((xw-x)/70)};
const BD=[[330,92,120],[470,92,160],[610,92,200]];
const HO=[[970,70,44,'#e0d2b0','#8a3d33'],[1060,64,40,'#d6c19c','#3f5f7a'],[1150,70,46,'#cfd8c0','#7a4a2c'],[1240,64,42,'#d9c8a4','#4e6b3c']];
const TRIPS=[1.5,2.6,3.7,4.6],FL=[[9.6,.7,900],[12.2,.6,500]];
const CAP=[[.3,2.9,'A lake that stored rainwater for years'],[3.1,8,'People fill the lake with earth to build on it'],[8.4,11.6,'Heavy rain has nowhere to be stored'],[11.8,15.8,'Floodwater spreads into the homes nearby'],[16.4,21,'Homes and flats are surrounded by floodwater']];
const storm=t=>sm(cl((t-7.5)/2.5));
function ridge(y,a,f,s,c,cs,k,sh){ctx.fillStyle=rg(mx(c,cs,k));ctx.beginPath();ctx.moveTo(-100,H);for(let x=-100;x<=W+100;x+=24)ctx.lineTo(x-sh,y-a*(.6+.4*Math.sin(x*f+s)+.3*Math.sin(x*f*2.3+s*2)));ctx.lineTo(W+100,H);ctx.fill()}
function truck(x,y,dir,ang){ctx.save();ctx.translate(x,y);ctx.scale(dir,1);ctx.fillStyle='#e6a21a';ctx.fillRect(0,-30,26,24);ctx.fillStyle='#9ec9e0';ctx.fillRect(12,-27,12,10);ctx.fillStyle='#3a3f48';ctx.fillRect(-60,-8,88,5);
ctx.save();ctx.translate(-58,-16);ctx.rotate(-ang);ctx.fillStyle='#c98a14';ctx.fillRect(0,-26,56,26);ctx.fillStyle='#7a5a38';ctx.fillRect(2,-30,52,6);ctx.restore();
ctx.fillStyle='#14181e';for(const w of[-46,-18,12]){ctx.beginPath();ctx.arc(w,-5,7,0,TAU);ctx.fill()}ctx.restore()}
function exc(x,y,t,w){const a=.9+Math.sin(t*2.4)*.35*w,c=2.3+Math.sin(t*2.4+1)*.5*w,px=x-18,py=y-34,e1x=px-Math.cos(a)*72,e1y=py-Math.sin(a)*72,e2x=e1x+Math.cos(c)*52,e2y=e1y+Math.sin(c)*52;
ctx.fillStyle='#2a2f38';ctx.fillRect(x-32,y-14,64,14);ctx.fillStyle='#e6a21a';ctx.fillRect(x-18,y-42,38,28);ctx.fillStyle='#9ec9e0';ctx.fillRect(x-14,y-38,14,14);
ctx.lineCap='round';ctx.strokeStyle='#d99a12';ctx.lineWidth=9;ctx.beginPath();ctx.moveTo(px,py);ctx.lineTo(e1x,e1y);ctx.stroke();ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(e1x,e1y);ctx.lineTo(e2x,e2y);ctx.stroke();
ctx.fillStyle='#7a5a38';ctx.beginPath();ctx.arc(e2x,e2y,9,0,TAU);ctx.fill();ctx.fillStyle='#8a6a45';if(w)for(let j=0;j<5;j++){const u=mod(t*1.2+j*.2,1);ctx.beginPath();ctx.arc(e2x-u*30,e2y+u*u*(W0-e2y+20),3,0,TAU);ctx.fill()}}
function crane(t){const x=170,top=170,sk=sm(cl((t-8.4)/1.4))*330;if(sk>=330)return;ctx.save();ctx.beginPath();ctx.rect(-600,-600,3200,1070);ctx.clip();ctx.translate(0,sk);ctx.fillStyle='#d9a21a';ctx.fillRect(x-5,top,10,300);ctx.strokeStyle='#8a6a14';ctx.lineWidth=1;for(let y=top;y<470;y+=20){ctx.beginPath();ctx.moveTo(x-5,y);ctx.lineTo(x+5,y+20);ctx.stroke()}
ctx.fillStyle='#d9a21a';ctx.fillRect(x-70,top-8,520,8);ctx.fillStyle='#555d66';ctx.fillRect(x-70,top,26,22);ctx.fillRect(x-8,top-24,16,18);
if(t>3.4&&t<8.3){const hxp=x+120+(Math.sin(t*.9)*.5+.5)*300,hy=top+60+(Math.sin(t*1.7)*.5+.5)*150;ctx.strokeStyle='#222';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(hxp,top);ctx.lineTo(hxp,hy);ctx.stroke();ctx.fillStyle='#8f8b80';ctx.fillRect(hxp-14,hy,28,20)}ctx.restore()}
function bld(i,t,k){const[x,w,h]=BD[i],tb=2.8+(x+w-260)/(540/3.8)+.15,p=sm(cl((t-tb)/2.2));if(p<=0)return;const hv=Math.min(h,Math.ceil(h*p/30)*30);
ctx.fillStyle='#bdb9ad';ctx.fillRect(x,470-hv,w,hv);ctx.fillStyle='#8f8b80';ctx.fillRect(x-3,470-hv-5,w+6,6);
for(let r=0;r<Math.floor(hv/30);r++)for(let c=0;c<4;c++){ctx.fillStyle=k>.5&&hs(i*40+r*4+c)<.65?'#ffd98a':'#7aa3b8';ctx.fillRect(x+8+c*21,470-(r+1)*30+7,14,16)}
if(p<1){ctx.strokeStyle='rgba(60,60,60,.6)';ctx.lineWidth=1;for(let y=470-hv;y<470;y+=30){ctx.beginPath();ctx.moveTo(x-4,y);ctx.lineTo(x+w+4,y);ctx.stroke()}}}
function house(h,i,t,k){const[x,w,ht,wall,roof]=h,y=gs(x+w/2,t);ctx.fillStyle=wall;ctx.fillRect(x,y-ht,w,ht);ctx.fillStyle=roof;ctx.beginPath();ctx.moveTo(x-6,y-ht);ctx.lineTo(x+w/2,y-ht-26);ctx.lineTo(x+w+6,y-ht);ctx.fill();
ctx.fillStyle=k>.3?'#ffd98a':'#9ec0d0';ctx.fillRect(x+w*.12,y-ht*.75,w*.22,ht*.3);ctx.fillRect(x+w*.62,y-ht*.75,w*.22,ht*.3);ctx.fillStyle='#4a3626';ctx.fillRect(x+w*.43,y-ht*.5,w*.15,ht*.5)}
const TF=[[210,170,120,76],[380,150,120,98],[550,170,120,76]],TH=[[700,350],[810,362],[920,348],[1035,360],[1150,352],[708,515],[826,526],[944,514],[1064,530],[1176,520]];
function topView(t){const u=t-15.8,sc=lp(1,1.07,cl(u/5)),R=lp(40,780,sm(cl(u/3.4))),C=[420,250],sub=(x,y)=>Math.pow((x-C[0])/1.25,2)+Math.pow(y-C[1],2)<Math.pow(R*.92,2);
ctx.save();ctx.globalAlpha=cl(u/.6);ctx.translate(640,360);ctx.scale(sc,sc);ctx.translate(-640,-360);
ctx.fillStyle='#6f9552';ctx.fillRect(-100,-100,1500,950);for(let i=0;i<10;i++){ctx.fillStyle=i%2?'#7ea35c':'#628a49';ctx.fillRect(hs(i)*1100,hs(i+9)*620,110+hs(i+3)*120,60+hs(i+5)*70)}
ctx.fillStyle='#8f8b84';ctx.fillRect(-100,452,1500,42);ctx.fillStyle='rgba(240,235,200,.6)';for(let x=-100;x<1400;x+=70)ctx.fillRect(x,471,34,3);
ctx.fillStyle='#2f5d33';for(let i=0;i<70;i++){ctx.beginPath();ctx.arc(hs(i+100)*1280,hs(i+200)*720,6+hs(i)*7,0,TAU);ctx.fill()}
const wg=ctx.createRadialGradient(C[0],C[1],20,C[0],C[1],R*1.3);wg.addColorStop(0,'rgba(80,140,170,.9)');wg.addColorStop(1,'rgba(105,165,190,.86)');ctx.fillStyle=wg;ctx.beginPath();
for(let k=0;k<=64;k++){const th=k/64*TAU,rr=R*(.86+.1*Math.sin(3*th+u*.8)+.06*Math.sin(7*th+1.3)+.04*Math.sin(13*th)),x=C[0]+Math.cos(th)*rr*1.25,y=C[1]+Math.sin(th)*rr;k?ctx.lineTo(x,y):ctx.moveTo(x,y)}ctx.closePath();ctx.fill();ctx.strokeStyle='rgba(235,245,250,.6)';ctx.lineWidth=3;ctx.stroke();
ctx.lineWidth=1.5;for(let i=0;i<60;i++){const x=mod(hs(i+70)*1500+t*28,1600)-150,y=hs(i+80)*760-20;if(!sub(x,y))continue;ctx.strokeStyle='rgba(255,255,255,.22)';ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+18,y+Math.sin(x*.05)*2);ctx.stroke()}
for(let i=0;i<14;i++){const x=C[0]-100+hs(i)*700+u*(25+hs(i+4)*15),y=C[1]+(hs(i+8)-.5)*520;if(!sub(x,y))continue;ctx.save();ctx.translate(x,y);ctx.rotate(hs(i+2)*3+t*.3);ctx.fillStyle=i%2?'#7a5a38':'#c9c2b0';ctx.fillRect(-9,-4,18,8);ctx.restore()}
const foam=(x,y,w,h,i)=>{if(!sub(x+w/2,y+h/2))return;const e=mod(t*.8+i*.3,1);ctx.strokeStyle='rgba(255,255,255,.65)';ctx.lineWidth=3;ctx.strokeRect(x-4,y-4,w+8,h+8);ctx.strokeStyle=`rgba(255,255,255,${.4*(1-e)})`;ctx.lineWidth=2;ctx.strokeRect(x-4-e*10,y-4-e*10,w+8+e*20,h+8+e*20)};
TF.forEach(([x,y,w,h],i)=>{foam(x,y,w,h,i);ctx.fillStyle='rgba(0,0,0,.28)';ctx.fillRect(x+7,y+7,w,h);ctx.fillStyle='#c4c0b4';ctx.fillRect(x,y,w,h);ctx.fillStyle='#a7a398';ctx.fillRect(x+6,y+6,w-12,h-12);ctx.fillStyle='#5a5f66';for(let j=0;j<4;j++)ctx.fillRect(x+14+j*24,y+14,12,10);ctx.fillStyle='#8f8b80';ctx.fillRect(x+w-34,y+h-30,22,20)});
TH.forEach(([x,y],i)=>{const w=64,h=48;foam(x,y,w,h,i+3);ctx.fillStyle='rgba(0,0,0,.28)';ctx.fillRect(x+5,y+5,w,h);const c=['#a8453a','#4f6f8a','#8a5a3c','#9a7a3a'][i%4];ctx.fillStyle=c;ctx.fillRect(x,y,w,h);ctx.fillStyle='rgba(0,0,0,.22)';ctx.fillRect(x+w/2,y,w/2,h);ctx.fillStyle='rgba(255,255,255,.3)';ctx.fillRect(x+w/2-1,y,2,h)});
ctx.fillStyle='rgba(8,14,24,.6)';ctx.fillRect(1182,24,74,34);ctx.fillStyle='#f4ead2';ctx.font='600 18px system-ui,sans-serif';ctx.textAlign='center';ctx.fillText('N ↑',1219,47);ctx.restore()}
function frame(t){ctx.setTransform(dpr,0,0,dpr,0,0);const k=storm(t),e=sm(cl((t-8.5)/5)),cx=lp(640,760,e),z=lp(1,1.12,e);
let g=ctx.createLinearGradient(0,0,0,H*.7);g.addColorStop(0,rg(mx(SKY.top[0],SKY.top[1],k)));g.addColorStop(.6,rg(mx(SKY.mid[0],SKY.mid[1],k)));g.addColorStop(1,rg(mx(SKY.hor[0],SKY.hor[1],k)));ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
if(k<1){const sg=ctx.createRadialGradient(1000,110,6,1000,110,90);sg.addColorStop(0,`rgba(255,244,200,${.95*(1-k)})`);sg.addColorStop(1,'rgba(255,244,200,0)');ctx.fillStyle=sg;ctx.fillRect(880,0,240,230)}
ctx.fillStyle=`rgba(40,52,64,${.45*k})`;for(let i=0;i<14;i++){ctx.beginPath();ctx.arc(mod(i*150+t*14,1500)-100,50+hs(i)*130,60+hs(i+9)*50,0,TAU);ctx.fill()}
ridge(400,90,.004,1,hx('#8aa6bd'),hx('#56697a'),k,(cx-640)*.25);ridge(450,70,.006,3,hx('#5f8070'),hx('#31453d'),k,(cx-640)*.5);
if(t<3.2){ctx.strokeStyle='#2a3440';ctx.lineWidth=2;for(let i=0;i<5;i++){const x=mod(i*260+t*60,1500)-100,y=140+i*18+Math.sin(t*3+i)*6,f=Math.sin(t*9+i)*5;ctx.beginPath();ctx.moveTo(x-9,y-f);ctx.lineTo(x,y);ctx.lineTo(x+9,y-f);ctx.stroke()}}
ctx.save();ctx.translate(640,360);ctx.scale(z,z);ctx.translate(-cx,-360);
// lake water (terrain is drawn over it, so only the unfilled part shows)
const wg=ctx.createLinearGradient(0,W0,0,640);wg.addColorStop(0,'#5f9fb8');wg.addColorStop(1,'#1f5a76');ctx.fillStyle=wg;ctx.beginPath();ctx.moveTo(BL,700);for(let x=BL;x<=BR;x+=8)ctx.lineTo(x,W0+Math.sin(x*.04+t*1.8)*1.4);ctx.lineTo(BR,700);ctx.fill();
const l=cx-640/z-60,r=cx+640/z+60;ctx.beginPath();ctx.moveTo(l,1200);for(let x=l;x<=r;x+=10)ctx.lineTo(x,gs(x,t));ctx.lineTo(r,1200);const tg=ctx.createLinearGradient(0,460,0,800);tg.addColorStop(0,'#7a6342');tg.addColorStop(1,'#43331f');ctx.fillStyle=tg;ctx.fill();
const strip=(a,b,off,lw,col)=>{ctx.strokeStyle=col;ctx.lineWidth=lw;ctx.beginPath();let s=1;for(let x=Math.max(a,l);x<=Math.min(b,r);x+=10){const y=gs(x,t)+off;s?ctx.moveTo(x,y):ctx.lineTo(x,y);s=0}ctx.stroke()};
strip(l,r,6,14,'#5f8a40');if(t>2.8)strip(BL-20,XF(t)+30,8,18,'#8a6a45');
ctx.strokeStyle='#4f7a36';ctx.lineWidth=2;for(let i=0;i<16;i++){const x=i<8?BL+8+i*6:BR-60+(i-8)*7;if(i<8&&x<XF(t)+20)continue;if(i>=8&&t>4.5)continue;const y=gs(x,t);ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+Math.sin(t*2+i)*2,y-18-hs(i)*10);ctx.stroke()}
crane(t);for(let i=0;i<3;i++)bld(i,t,k);
for(const T of TRIPS){const u=(t-T)/3.2;if(u<0||u>1)continue;const f=XF(Math.min(t,6.6));let x,d=1,a=0;
if(u<.4)x=lp(-120,f-110,u/.4);else if(u<.5){x=f-110;d=-1}else if(u<.6){x=lp(f-110,f-50,(u-.5)/.1);d=-1}else if(u<.75){x=f-50;d=-1;a=sm(cl((u-.6)/.08))*.6}else{x=lp(f-50,-160,(u-.75)/.25);d=-1}
truck(x,470,d,a);if(u>.6&&u<.75){for(let j=0;j<10;j++){const v=cl((u-.6)/.12-j*.07);if(v<=0||v>=1)continue;ctx.fillStyle='#8a6a45';ctx.beginPath();ctx.arc(x+60+(j%4)*4+v*10,lp(442,486,v*v),4,0,TAU);ctx.fill()}}}
{const ex=t<6.6?lp(1500,905,sm(cl((t-2.2)/1))):lp(905,1500,sm(cl((t-6.6)/1.8)));if(ex<1450)exc(ex,gb(ex),t,t>3.2&&t<6.6?1:0)}HO.forEach((h,i)=>house(h,i,t,k));
// flood water: rain water gathers around the flats and runs downhill into the living area
if(t>8.4){const xl=XL(t),xw=XW(t),a=Math.max(xl-40,l),b=Math.min(xw+40,r),P=[];for(let x=a;x<=b;x+=8)P.push([x,gs(x,t)-dep(x,t)+Math.sin(x*.05-t*3)*1.4*cl(dep(x,t)/10)]);
if(P.length>2){const fg=ctx.createLinearGradient(0,400,0,540);fg.addColorStop(0,'rgba(125,175,195,.8)');fg.addColorStop(1,'rgba(40,85,110,.92)');ctx.fillStyle=fg;ctx.beginPath();P.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));for(let i=P.length-1;i>=0;i--)ctx.lineTo(P[i][0],gs(P[i][0],t)+2);ctx.closePath();ctx.fill();
ctx.strokeStyle='rgba(235,245,250,.65)';ctx.lineWidth=2;ctx.beginPath();P.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.stroke();
ctx.strokeStyle='rgba(255,255,255,.35)';ctx.lineWidth=1.5;for(let i=0;i<30;i++){const x=xl+mod(hs(i)*(xw-xl)+t*70,xw-xl),d=dep(x,t);if(d<7)continue;const y=gs(x,t)-d+4+hs(i+9)*Math.min(26,d);ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+16,y);ctx.stroke()}
for(let i=0;i<28;i++){const u=mod(t*1.5+hs(i+50),1),x=xl+hs(i+60)*(xw-xl),d=dep(x,t);if(d<8)continue;ctx.strokeStyle=`rgba(235,245,250,${.5*(1-u)})`;ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(x,gs(x,t)-d+3+hs(i+70)*Math.min(20,d*.6),2+u*8,.8+u*2,0,0,TAU);ctx.stroke()}
for(let i=0;i<8;i++){const x=700+hs(i)*140+(t-9)*(40+hs(i+5)*40),d=dep(x,t);if(d<10)continue;ctx.save();ctx.translate(x,gs(x,t)-d+2+Math.sin(t*2+i)*2);ctx.rotate(Math.sin(t+i)*.3);ctx.fillStyle=i%2?'#7a5a38':'#c9c2b0';ctx.fillRect(-9,-4,18,8);ctx.restore()}}}
ctx.restore();
if(t>=15.8)topView(t);
let fl=0;for(const[t0,d,bx]of FL){const q=(t-t0)/d;if(q<0||q>1)continue;const a=Math.pow(Math.max(0,Math.sin(q*Math.PI*3)),2)*(1-q);fl=Math.max(fl,a);if(q<.4&&a>.1){ctx.strokeStyle='#eef6ff';ctx.shadowColor='#bcd8ff';ctx.shadowBlur=18;ctx.lineWidth=3;ctx.beginPath();let x=bx;ctx.moveTo(x,-10);for(let i=1;i<=9;i++){x+=(hs(i+bx)-.5)*70;ctx.lineTo(x,i*34)}ctx.stroke();ctx.shadowBlur=0}}
ctx.fillStyle=`rgba(10,18,28,${.3*k})`;ctx.fillRect(0,0,W,H);if(fl>0){ctx.fillStyle=`rgba(225,236,255,${fl*.5})`;ctx.fillRect(0,0,W,H)}
const ri=sm(cl((t-8.2)/2));ctx.strokeStyle='rgba(200,220,235,.45)';ctx.lineWidth=1.3;ctx.beginPath();
for(let i=0;i<380;i++){if(hs(i)>ri)continue;const y=mod(hs(i+3)*900+t*(850+hs(i+4)*400),820)-50,x=mod(hs(i+1)*1500,1500)-100+y*.18,len=14+hs(i+5)*14;ctx.moveTo(x-len*.18,y-len);ctx.lineTo(x,y)}ctx.stroke();
const vg=ctx.createRadialGradient(640,360,300,640,360,800);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,.4)');ctx.fillStyle=vg;ctx.fillRect(0,0,W,H);
for(const[a,b,s]of CAP){const al=Math.min(cl((t-a)/.3),cl((b-t)/.3));if(al<=0)continue;ctx.font='600 28px system-ui,sans-serif';ctx.textAlign='center';const w=ctx.measureText(s).width+56;ctx.globalAlpha=al;ctx.fillStyle='rgba(8,14,24,.6)';ctx.beginPath();ctx.roundRect?ctx.roundRect(640-w/2,640,w,52,26):ctx.rect(640-w/2,640,w,52);ctx.fill();ctx.fillStyle='#f4ead2';ctx.fillText(s,640,676);ctx.globalAlpha=1}
const fd=Math.max(1-t/.35,1-(D-t)/.35,0);if(fd>0){ctx.fillStyle=`rgba(0,0,0,${cl(fd)})`;ctx.fillRect(0,0,W,H)}}
let t=0,playing=true,last=performance.now();const pp=document.getElementById('pp'),sk=document.getElementById('sk'),tm=document.getElementById('tm');
function loop(n){const dt=(n-last)/1000;last=n;if(playing){t+=dt;if(t>=D)t=0;sk.value=t}frame(t);tm.textContent=t.toFixed(1)+'s';requestAnimationFrame(loop)}
pp.onclick=()=>{playing=!playing;pp.textContent=playing?'Pause':'Play'};
sk.oninput=()=>{playing=false;pp.textContent='Play';t=+sk.value};
requestAnimationFrame(loop);
