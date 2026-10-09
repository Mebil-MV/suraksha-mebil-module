const W=1280,H=720,D=10,TAU=Math.PI*2,GX=620,cv=document.getElementById('c'),ctx=cv.getContext('2d'),dpr=Math.min(devicePixelRatio||1,2);
cv.width=W*dpr;cv.height=H*dpr;
const cl=(v,a=0,b=1)=>v<a?a:v>b?b:v,lp=(a,b,k)=>a+(b-a)*k,sm=k=>k*k*(3-2*k),mod=(a,n)=>((a%n)+n)%n;
function hs(n){n|=0;n=(n^61)^(n>>>16);n=(n+(n<<3))|0;n^=n>>>4;n=Math.imul(n,0x27d4eb2d);n^=n>>>15;return(n>>>0)/4294967296}
const hx=s=>[1,3,5].map(i=>parseInt(s.slice(i,i+2),16)),mx=(a,b,k)=>a.map((v,i)=>lp(v,b[i],k)),rg=(c,a=1)=>`rgba(${c[0]|0},${c[1]|0},${c[2]|0},${a})`;
const SKY={top:[hx('#243a5a'),hx('#0f1a2e')],mid:[hx('#5f8196'),hx('#2b4559')],hor:[hx('#e6d5a2'),hx('#6f8a8c')]};
function gen(s,wn,wx,hn,hm){let r=s,x=-900,o=[];const f=()=>hs(r++);while(x<2400){const w=lp(wn,wx,f()),h=lp(hn,hm,Math.pow(f(),1.6));o.push({x,w,h,s:Math.floor(f()*1e6),a:f()});x+=w+f()*6}return o}
const LY=[{p:.2,sg:448,b:gen(11,30,64,50,190),body:'#5a7790',roof:'#4d667d',gr:'#4a647a',wt:[hx('#8fb4bb'),hx('#4f8095')],rise:26,win:[3,4,4,5,.28]},
{p:.55,sg:500,b:gen(37,44,100,80,240),body:'#2f4866',roof:'#243a56',gr:'#233a55',wt:[hx('#4f93aa'),hx('#1e5873')],rise:44,win:[5,7,6,9,.36]}];
// thrown waste: t=release time, k=kind, w=person, rx/ry/rot=resting spot at the drain
const IT=[{t:1.5,k:0,w:1,rx:615,ry:613,rot:.1},{t:1.95,k:0,w:1,rx:650,ry:614,rot:-.2},{t:2.2,k:3,w:2,rx:585,ry:616,rot:.3},{t:2.55,k:1,w:2,rx:634,ry:607,rot:1.3},{t:2.9,k:2,w:2,rx:600,ry:608,rot:.8}];
const FL=[[4.4,.7,380],[7.4,.7,900]],CAP=[[.4,3.2,'People dump waste into the street drain'],[3.4,6.2,'The drain clogs — the rain has nowhere to go'],[6.4,10,'Streets flood. Keep drains clear.']];
const cam=t=>{const e=sm(cl((t-5.5)/4.5));return{z:lp(1,1.7,e),fx:lp(640,980,e),fy:lp(360,520,e)}};
const rise=t=>sm(cl((t-3.6)/6)),surf=r=>lp(628,548,r),storm=t=>sm(cl((t-1.5)/5));
function item(k,x,y,r,s=1){ctx.save();ctx.translate(x,y);ctx.rotate(r);ctx.scale(s,s);
if(k==0){ctx.fillStyle='#1c242c';ctx.beginPath();ctx.ellipse(0,-9,15,12,0,0,TAU);ctx.fill();ctx.beginPath();ctx.moveTo(-4,-19);ctx.lineTo(0,-28);ctx.lineTo(5,-19);ctx.fill();ctx.fillStyle='rgba(255,255,255,.18)';ctx.beginPath();ctx.ellipse(-5,-13,5,3,0,0,TAU);ctx.fill()}
else if(k==1){ctx.fillStyle='rgba(170,215,230,.92)';ctx.fillRect(-14,-5,22,10);ctx.fillRect(8,-2,6,4);ctx.fillStyle='#d9443a';ctx.fillRect(14,-3,4,6)}
else if(k==2){ctx.fillStyle='#b9c1c7';ctx.fillRect(-8,-6,16,12);ctx.fillStyle='#c4463c';ctx.fillRect(-8,-2,16,4)}
else{ctx.fillStyle='#b88a54';ctx.fillRect(-16,-12,32,24);ctx.fillStyle='#8f6a3c';ctx.fillRect(-16,-2,32,3)}ctx.restore()}
function pst(w,t){if(w==1)return{x:t<1.2?lp(120,520,sm(t/1.2)):t<2.3?520:520-(t-2.3)*210,d:t<2.3?1:-1,m:t<1.2||t>2.3};
return{x:t<2?lp(1230,740,sm(t/2)):t<3.1?740:740+(t-3.1)*220,d:t<3.1?-1:1,m:t<2||t>3.1}}
function armA(w,t){let a=.35;for(const it of IT)if(it.w==w){const u=t-it.t;if(u>-.4&&u<.3)a=u<-.12?lp(.35,-1.1,sm((u+.4)/.28)):u<0?lp(-1.1,1.5,(u+.12)/.12):u<.15?1.5:lp(1.5,.35,(u-.15)/.15)}return a}
const hand=(x,d,a)=>[x+d*Math.sin(a)*34,508+(Math.cos(a)-Math.cos(1.5))*34];
function person(w,t,col){const s=pst(w,t),fy=592,x=s.x,d=s.d,ph=s.m?x*.07:0,b=s.m?Math.abs(Math.sin(ph))*2:0,hy=fy-46-b,sy=fy-90-b,a=armA(w,t);
ctx.lineCap='round';ctx.strokeStyle='#18202c';ctx.lineWidth=8;
for(const g of[-1,1]){ctx.beginPath();ctx.moveTo(x,hy);ctx.lineTo(x+g*Math.sin(ph)*15,fy);ctx.stroke()}
ctx.strokeStyle='rgba(0,0,0,.35)';ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(x,sy+6);ctx.lineTo(x-d*Math.sin(ph)*10,sy+34);ctx.stroke();
ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(x-12,hy+4);ctx.lineTo(x-15,sy+8);ctx.quadraticCurveTo(x,sy-6,x+15,sy+8);ctx.lineTo(x+12,hy+4);ctx.fill();
ctx.fillStyle='#d9a47a';ctx.beginPath();ctx.arc(x+d*2,sy-12,10,0,TAU);ctx.fill();ctx.fillStyle=col;ctx.beginPath();ctx.arc(x+d*2,sy-13,13,Math.PI,TAU);ctx.fill();
const h=hand(x,d,a);ctx.strokeStyle=col;ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(x,sy+6);ctx.lineTo(h[0],h[1]+(sy+90-fy+0)*0);ctx.stroke();
ctx.fillStyle='#d9a47a';ctx.beginPath();ctx.arc(h[0],h[1],4,0,TAU);ctx.fill();
const nx=IT.find(i=>i.w==w&&t<i.t);if(nx)item(nx.k,h[0],h[1]+(nx.k==0?24:3),0,.85)}
function lamp(x,t){const on=t<7.4||(t<7.8&&hs(Math.floor(t*28))>.5);ctx.strokeStyle='#1a2230';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(x,590);ctx.lineTo(x,410);ctx.lineTo(x+24,404);ctx.stroke();
if(on){const g=ctx.createRadialGradient(x+24,410,2,x+24,410,150);g.addColorStop(0,'rgba(255,230,160,.55)');g.addColorStop(1,'rgba(255,230,160,0)');ctx.fillStyle=g;ctx.fillRect(x-130,260,310,330);ctx.fillStyle='#fff3c8'}else ctx.fillStyle='#39414d';ctx.beginPath();ctx.arc(x+24,408,6,0,TAU);ctx.fill()}
function house(t){const lit='#ffd98a';ctx.fillStyle='#ffd98a';
ctx.fillStyle='#e8d9bc';ctx.fillRect(890,430,240,130);ctx.fillStyle='#d5c3a1';ctx.fillRect(1090,430,40,130);ctx.fillStyle='#9a977f';ctx.fillRect(890,546,240,14);
ctx.fillStyle='#46294a';ctx.fillRect(1070,360,22,50);ctx.fillStyle='#5d3b5b';ctx.beginPath();ctx.moveTo(868,436);ctx.lineTo(1010,350);ctx.lineTo(1152,436);ctx.fill();
ctx.fillStyle='#f4ead2';ctx.fillRect(884,430,252,6);
for(const wx of[915,1062]){const g=ctx.createRadialGradient(wx+24,480,4,wx+24,480,70);g.addColorStop(0,'rgba(255,210,120,.45)');g.addColorStop(1,'rgba(255,210,120,0)');ctx.fillStyle=g;ctx.fillRect(wx-50,420,150,120);ctx.fillStyle=lit;ctx.fillRect(wx,456,48,48);ctx.fillStyle='#f4ead2';ctx.fillRect(wx+22,456,4,48);ctx.fillRect(wx,478,48,4)}
ctx.fillStyle='#2e5d63';ctx.fillRect(988,456,46,104);ctx.fillStyle='#e8c46a';ctx.beginPath();ctx.arc(1026,512,3,0,TAU);ctx.fill();ctx.fillStyle='#b6b3a0';ctx.fillRect(980,553,62,7);
ctx.fillStyle=lit;ctx.beginPath();ctx.arc(1046,470,4,0,TAU);ctx.fill()}
function layer(L,t,c,k){const dx=(c.fx-640)*(1-L.p),dy=(c.fy-360)*(1-L.p)*.5,l=c.fx-640/c.z-dx-80,rr=c.fx+640/c.z-dx+80,cut=sm(cl((t-7.4)/.6)),rb=sm(cl((t-4.2)/5.5)),[ww,wh,gx,gy,lt]=L.win;
ctx.save();ctx.translate(dx,dy);ctx.fillStyle=L.gr;ctx.fillRect(l,L.sg,rr-l,300);
for(const b of L.b){if(b.x+b.w<l||b.x>rr)continue;const y=L.sg-b.h;ctx.fillStyle=L.body;ctx.fillRect(b.x,y,b.w,b.h);ctx.fillStyle='rgba(8,20,40,.18)';ctx.fillRect(b.x+b.w*.7,y,b.w*.3,b.h);ctx.fillStyle=L.roof;ctx.fillRect(b.x-1,y-4,b.w+2,5);
if(b.a>.75){ctx.fillRect(b.x+b.w/2,y-22,2,18)}
const cols=Math.max(1,Math.floor((b.w-6)/(ww+gx))),rows=Math.max(1,Math.floor((b.h-12)/(wh+gy))),x0=b.x+(b.w-cols*(ww+gx)+gx)/2;
for(let i=0;i<cols;i++)for(let j=0;j<rows;j++){const id=b.s+i*31+j*7,on=hs(id)<lt&&hs(id+99)>=cut*.8;ctx.fillStyle=on?'rgba(255,226,150,.85)':'rgba(6,14,28,.28)';ctx.fillRect(x0+i*(ww+gx),y+8+j*(wh+gy),ww,wh)}}
const top=L.sg-L.rise*rb,g=ctx.createLinearGradient(0,top,0,top+120);g.addColorStop(0,rg(L.wt[0],.6));g.addColorStop(1,rg(L.wt[1],.9));ctx.fillStyle=g;ctx.fillRect(l,top,rr-l,400);ctx.fillStyle='rgba(255,255,255,.22)';ctx.fillRect(l,top,rr-l,1.5);ctx.restore()}
function water(t,r,hw){if(hw<2)return;const s=surf(r),P=[];for(let x=GX-hw;x<=GX+hw;x+=10){const q=Math.abs(x-GX)/hw;P.push([x,s+Math.pow(q,3)*34+Math.sin(x*.03+t*2.2)*1.6*(.4+r)+Math.sin(x*.07-t*3)*.8])}
const g=ctx.createLinearGradient(0,s,0,760);g.addColorStop(0,'rgba(95,150,165,.84)');g.addColorStop(1,'rgba(22,70,92,.92)');ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(P[0][0],760);for(const p of P)ctx.lineTo(p[0],p[1]);ctx.lineTo(P[P.length-1][0],760);ctx.fill();
ctx.strokeStyle='rgba(230,245,250,.5)';ctx.lineWidth=2;ctx.beginPath();P.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.stroke();
ctx.lineWidth=1;for(let i=0;i<40;i++){const u=mod(t*1.4+hs(i)*3,1),x=GX+(hs(i+200)*2-1)*hw*.9,y=lp(s+8,712,Math.pow(hs(i+400),1.5));ctx.strokeStyle=`rgba(220,240,250,${.5*(1-u)})`;ctx.beginPath();ctx.ellipse(x,y,3+u*13,1+u*4,0,0,TAU);ctx.stroke()}
if(r>.12)for(let i=0;i<16;i++){const x=GX+(hs(i)-.3)*170+(t-4.5)*(18+hs(i+5)*22);if(Math.abs(x-GX)>hw*.95)continue;ctx.globalAlpha=cl(r*4);item(i%4,x,s+3+Math.sin(t*2+i)*2,Math.sin(t*1.3+i)*.4,.9);ctx.globalAlpha=1}}
function frame(t){ctx.setTransform(dpr,0,0,dpr,0,0);const k=storm(t),c=cam(t),r=rise(t);
// sky
let g=ctx.createLinearGradient(0,-400,0,470);g.addColorStop(0,rg(mx(SKY.top[0],SKY.top[1],k)));g.addColorStop(.6,rg(mx(SKY.mid[0],SKY.mid[1],k)));g.addColorStop(1,rg(mx(SKY.hor[0],SKY.hor[1],k)));ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
ctx.save();ctx.translate(640,360);ctx.scale(c.z,c.z);ctx.translate(-c.fx,-c.fy);
ctx.fillStyle=`rgba(20,32,48,${.32*k})`;for(let i=0;i<16;i++){ctx.beginPath();ctx.arc(mod(i*140+t*10,1700)-200,70+hs(i)*160,70+hs(i+9)*60,0,TAU);ctx.fill()}
LY.forEach(L=>layer(L,t,c,k));
ctx.fillStyle='#233a55';ctx.fillRect(-500,500,2400,260);ctx.fillStyle=`rgba(60,130,150,${.55*sm(cl((t-4.2)/5.5))})`;ctx.fillRect(-500,500,2400,60);
ctx.fillStyle='#6d6c66';ctx.fillRect(-500,560,2400,40);ctx.fillStyle='#8c8a80';ctx.fillRect(-500,598,2400,4);ctx.fillStyle='#2a2f38';ctx.fillRect(-500,602,2400,200);
ctx.fillStyle='rgba(230,225,190,.25)';for(let x=-500;x<1900;x+=120)ctx.fillRect(x,690,60,4);
lamp(330,t);lamp(830,t);house(t);
// drain
ctx.fillStyle='#0e1318';ctx.beginPath();ctx.moveTo(575,606);ctx.lineTo(665,606);ctx.lineTo(675,626);ctx.lineTo(565,626);ctx.fill();ctx.strokeStyle='#5b6670';ctx.lineWidth=1.5;for(let i=0;i<=9;i++){const u=i/9;ctx.beginPath();ctx.moveTo(lp(575,665,u),606);ctx.lineTo(lp(565,675,u),626);ctx.stroke()}
const cc=IT.reduce((s,i)=>s+sm(cl((t-i.t-.5)/.2)),0),fa=.4*(1-cl(cc/2.5))*(1-sm(cl((t-2.6)/.8)));
if(fa>.01){ctx.strokeStyle=`rgba(170,205,220,${fa})`;ctx.lineWidth=2;for(let i=0;i<10;i++){const sd=i%2?1:-1,x=GX+sd*lp(190,50,mod(i*.137+t*.6,1));ctx.beginPath();ctx.moveTo(x,612+(i%3)*3);ctx.lineTo(x+sd*-14,612+(i%3)*3);ctx.stroke()}}
if(cc>.02){ctx.fillStyle='#1b232b';ctx.beginPath();ctx.ellipse(GX,618,16+9*cc,4+3.5*cc,0,0,TAU);ctx.fill()}
for(const it of IT){const u=(t-it.t)/.55;if(u<0)continue;if(u>=1)item(it.k,it.rx,it.ry,it.rot);else{const s=pst(it.w,it.t),h=hand(s.x,s.d,1.5);item(it.k,lp(h[0],it.rx,sm(u)),lp(h[1]+12,it.ry,u*u)-70*4*u*(1-u)*.7,it.rot+(1-u)*6)}}
person(1,t,'#d9703f');person(2,t,'#e3b341');
water(t,r,sm(cl((t-2.6)))*40+1100*Math.pow(r,.6));
ctx.restore();
// lightning
let fl=0;for(const[t0,d,bx]of FL){const f=(t-t0)/d;if(f<0||f>1)continue;const a=Math.pow(Math.max(0,Math.sin(f*Math.PI*3)),2)*(1-f);fl=Math.max(fl,a);
if(f<.4&&a>.1){ctx.strokeStyle='#eef6ff';ctx.shadowColor='#bcd8ff';ctx.shadowBlur=18;ctx.lineWidth=3;ctx.beginPath();let x=bx;ctx.moveTo(x,-10);for(let i=1;i<=9;i++){x+=(hs(i+bx)-.5)*70;ctx.lineTo(x,i*38)}ctx.stroke();ctx.shadowBlur=0}}
ctx.fillStyle=`rgba(8,16,30,${.1+.25*k})`;ctx.fillRect(0,0,W,H);
if(fl>0){ctx.fillStyle=`rgba(225,236,255,${fl*.5})`;ctx.fillRect(0,0,W,H)}
// rain
const ri=lp(.15,1,sm(cl((t-2.4)/3.2)));ctx.strokeStyle=`rgba(200,220,235,${.3+.2*k})`;ctx.lineWidth=1.3;ctx.beginPath();
for(let i=0;i<320;i++){if(hs(i)>ri)continue;const y=mod(hs(i+3)*900+t*(850+hs(i+4)*400),820)-50,x=mod(hs(i+1)*1500,1500)-100+y*.18,len=14+hs(i+5)*14;ctx.moveTo(x-len*.18,y-len);ctx.lineTo(x,y)}ctx.stroke();
const vg=ctx.createRadialGradient(640,360,300,640,360,800);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,.45)');ctx.fillStyle=vg;ctx.fillRect(0,0,W,H);
// caption
for(const[a,b,s]of CAP){const al=Math.min(cl((t-a)/.3),cl((b-t)/.3));if(al<=0)continue;ctx.font='600 28px system-ui,sans-serif';ctx.textAlign='center';const w=ctx.measureText(s).width+56;ctx.globalAlpha=al;ctx.fillStyle='rgba(8,14,24,.6)';ctx.beginPath();ctx.roundRect?ctx.roundRect(640-w/2,640,w,52,26):ctx.rect(640-w/2,640,w,52);ctx.fill();ctx.fillStyle='#f4ead2';ctx.fillText(s,640,676);ctx.globalAlpha=1}
const fd=Math.max(1-t/.35,1-(D-t)/.35,0);if(fd>0){ctx.fillStyle=`rgba(0,0,0,${cl(fd)})`;ctx.fillRect(0,0,W,H)}}
let t=0,playing=true,last=performance.now();const pp=document.getElementById('pp'),sk=document.getElementById('sk'),tm=document.getElementById('tm');
function loop(n){const dt=(n-last)/1000;last=n;if(playing){t+=dt;if(t>=D)t=0;sk.value=t}frame(t);tm.textContent=t.toFixed(1)+'s';requestAnimationFrame(loop)}
pp.onclick=()=>{playing=!playing;pp.textContent=playing?'Pause':'Play'};
sk.oninput=()=>{playing=false;pp.textContent='Play';t=+sk.value};
requestAnimationFrame(loop);
