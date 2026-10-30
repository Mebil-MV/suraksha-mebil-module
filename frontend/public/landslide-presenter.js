const W=1280,H=720,D=17,TAU=Math.PI*2,cv=document.getElementById('c'),ctx=cv.getContext('2d'),dpr=Math.min(devicePixelRatio||1,2);
const SH=340,CH=H+SH;cv.width=W*dpr;cv.height=CH*dpr;
const cl=(v,a=0,b=1)=>v<a?a:v>b?b:v,lp=(a,b,k)=>a+(b-a)*k,sm=k=>k*k*(3-2*k),mod=(a,n)=>((a%n)+n)%n;
function hs(n){n|=0;n=(n^61)^(n>>>16);n=(n+(n<<3))|0;n^=n>>>4;n=Math.imul(n,0x27d4eb2d);n^=n>>>15;return(n>>>0)/4294967296}
const hx=s=>[1,3,5].map(i=>parseInt(s.slice(i,i+2),16)),mx=(a,b,k)=>a.map((v,i)=>lp(v,b[i],k)),rg=(c,a=1)=>`rgba(${c[0]|0},${c[1]|0},${c[2]|0},${a})`;
const SKY={top:[hx('#6fa3c9'),hx('#26343f')],mid:[hx('#a9d0e0'),hx('#4a5b66')],hor:[hx('#f4e4b8'),hx('#7b8887')]};
// mountain (left) -> slope -> valley (centre/right)
const TP=[[-400,430],[100,260],[480,130],[800,330],[1050,560],[1250,760],[1450,800],[1800,790],[2400,600]];
function gy(x){if(x<=TP[0][0])return TP[0][1];for(let i=1;i<TP.length;i++)if(x<=TP[i][0]){const a=TP[i-1],b=TP[i],u=(x-a[0])/(b[0]-a[0]);return lp(a[1],b[1],(1-Math.cos(u*Math.PI))/2)}return TP[TP.length-1][1]}
// trees: those inside the logging zone are felled one by one
const TR=[];for(let i=0;i<54;i++){const x=90+i*21+hs(i)*10;TR.push({x,s:34+hs(i+60)*26,g:hs(i+9),z:x>270&&x<1020})}
[1370,1465,1555,1640,1705,1795,1855,1920].forEach((x,i)=>TR.push({x,s:30+hs(i+80)*18,g:hs(i+30),z:false}));
const LG=TR.filter(t=>t.z).sort((a,b)=>hs(a.x*3)-hs(b.x*3));LG.forEach((t,k)=>{t.tf=.7+k*(3.6/LG.length);t.j=k%2});
const HO=[[1330,58,44,'#d8c7a2','#8a3d33'],[1415,50,40,'#cdb78e','#5d4a3a'],[1500,64,50,'#e0d2b0','#3f5f7a'],[1590,54,42,'#d6c19c','#7a4a2c'],[1670,60,48,'#cfd8c0','#8a3d33'],[1745,50,40,'#d9c8a4','#4e6b3c']];
const RD=[{p:.25,y:330,c:hx('#8aa6bd'),cs:hx('#56697a'),a:90,f:.004,s:1},{p:.55,y:430,c:hx('#5f8070'),cs:hx('#31453d'),a:110,f:.006,s:3}];
const FL=[[6.4,.7,1000],[9.2,.6,420]],CAP=[[.3,4,'Trees are cut down from the mountain slope'],[4.2,7,'Heavy rain falls on the bare, loose soil'],[7.3,12.3,'The landslide buries the village below'],[12.7,17,'The mud has swallowed most of the village']];
const F=t=>{const p=cl((t-7)/4.8);return 760+1080*(.5*sm(p)+.5*(1-Math.pow(1-p,2)))};
const push=(x,t)=>Math.max(0,F(t)-x+12);
function th(x,t){const f=F(t);if(x>f||f<=761)return 0;const d=f-x,L=Math.min(720,f-760),head=d<50?Math.sqrt(1-Math.pow((50-d)/50,2)):1,tail=sm(cl((L-d)/140)),hd=sm(cl((x-760)/60)),
body=lp(34,14,cl(d/L))*(1+.9*sm(cl((x-1230)/260))),lump=Math.sin(d*.05-t*8)*2.2+Math.sin(d*.13+t*5)*1;return Math.max(5*hd,(body+lump)*head*tail*hd)}
function cam(t){const e1=sm(cl((t-4.3)/2.7)),e2=sm(cl((t-7.2)/4.5)),ax=lp(560,700,cl(t/4.3)),ay=lp(330,350,cl(t/4.3));
let cx=lp(ax,1380,e1),cy=lp(ay,650,e1);cx=lp(cx,cl(F(t)-200,1250,1600),e2);cy=lp(cy,560,e2);return{z:lp(1,.78,e2),cx,cy}}
function tree(x,s,g,tilt,dy=0){const y=gy(x)+dy;ctx.save();ctx.translate(x,y);ctx.rotate(tilt);ctx.fillStyle='#4a3322';ctx.fillRect(-2,-s*.25,4,s*.25);
for(let j=0;j<3;j++){ctx.fillStyle=rg(mx(hx('#2c5a33'),hx('#4a7d3c'),g),1);const w=s*(.5-.11*j),b=-s*.2-j*s*.27;ctx.beginPath();ctx.moveTo(-w,b);ctx.lineTo(w,b);ctx.lineTo(0,b-s*.38);ctx.fill()}ctx.restore()}
function lj(x,t,j,col){const n=LG.filter(q=>q.j==j);let k=n.findIndex(q=>q.tf>=t-.1);if(k<0)k=n.length-1;const cur=n[k],pv=n[Math.max(0,k-1)],px=lp(pv.x-26,cur.x-26,sm(cl((t-(pv.tf+.1))/.3))),fy=gy(px),ch=t>cur.tf-.6&&t<cur.tf+.05,a=ch?-1.8+Math.sin(t*14)*1.5:.3;
ctx.lineCap='round';ctx.strokeStyle='#202a36';ctx.lineWidth=5;for(const g of[-1,1]){ctx.beginPath();ctx.moveTo(px,fy-24);ctx.lineTo(px+g*4,fy);ctx.stroke()}
ctx.strokeStyle=col;ctx.lineWidth=9;ctx.beginPath();ctx.moveTo(px,fy-26);ctx.lineTo(px,fy-46);ctx.stroke();ctx.fillStyle='#d9a47a';ctx.beginPath();ctx.arc(px,fy-54,6,0,TAU);ctx.fill();ctx.fillStyle='#f2c230';ctx.beginPath();ctx.arc(px,fy-56,7,Math.PI,TAU);ctx.fill();
const hx_=px+Math.sin(a)*22,hy=fy-42+Math.cos(a)*22,ex=px+Math.sin(a)*38,ey=fy-42+Math.cos(a)*38;ctx.strokeStyle=col;ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(px,fy-42);ctx.lineTo(hx_,hy);ctx.stroke();ctx.strokeStyle='#6b4a2c';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(hx_,hy);ctx.lineTo(ex,ey);ctx.stroke();ctx.fillStyle='#b9c1c7';ctx.beginPath();ctx.arc(ex,ey,5,0,TAU);ctx.fill()}
function ridge(R,t,c,k){const dx=(c.cx-640)*(1-R.p),dy=(c.cy-360)*(1-R.p),l=c.cx-640/c.z-dx-80,r=c.cx+640/c.z-dx+80;ctx.save();ctx.translate(dx,dy);ctx.fillStyle=rg(mx(R.c,R.cs,k));ctx.beginPath();ctx.moveTo(l,R.y+1400);
for(let x=l;x<=r;x+=24)ctx.lineTo(x,R.y-R.a*(.6+.4*Math.sin(x*R.f+R.s)+.3*Math.sin(x*R.f*2.3+R.s*2)));ctx.lineTo(r,R.y+1400);ctx.fill();ctx.restore()}
function house(h,i,t){const[x,w,ht,wall,roof]=h,cx=x+w/2,pu=push(cx,t),nx=cx+(25+hs(i+3)*35)*(1-Math.exp(-pu/90)),y=gy(nx)+Math.min(th(nx,t)*.5,ht*.5),tl=cl(pu/150)*.28*(i%2?1:-.8);
ctx.save();ctx.translate(nx,y);ctx.rotate(tl);ctx.translate(-w/2,0);
ctx.fillStyle=wall;ctx.fillRect(0,-ht,w,ht);ctx.fillStyle=roof;ctx.beginPath();ctx.moveTo(-6,-ht);ctx.lineTo(w/2,-ht-26);ctx.lineTo(w+6,-ht);ctx.fill();ctx.fillStyle='#5a4636';ctx.fillRect(w*.7,-ht-30,6,18);
const lit=pu<20&&hs(i+Math.floor(t*6))>.04;ctx.fillStyle=lit?'#ffd98a':'#2b3440';ctx.fillRect(w*.12,-ht*.75,w*.22,ht*.3);ctx.fillRect(w*.58,-ht*.75,w*.22,ht*.3);ctx.fillStyle='#4a3626';ctx.fillRect(w*.4,-ht*.5,w*.16,ht*.5);
if(pu<20){ctx.fillStyle='rgba(210,210,215,.35)';for(let q=0;q<4;q++){const u=mod(t*.5+q*.25+i*.13,1);ctx.beginPath();ctx.arc(w*.7+3+Math.sin(u*6)*6,-ht-30-u*40,4+u*9,0,TAU);ctx.fill()}}ctx.restore();
if(pu>100)for(let j=0;j<7;j++){const px=nx+(hs(i*9+j)-.5)*w*1.6+(pu-100)*.35*hs(j+3),py=gy(px)-th(px,t)-6-hs(j+40)*26+Math.sin(t*5+j)*3;ctx.save();ctx.translate(px,py);ctx.rotate(hs(j+i)*3+t*2);ctx.fillStyle='#8a6a43';ctx.fillRect(-9,-1.5,18,3);ctx.restore()}}

const TH=Array.from({length:10},(_,i)=>[200+i*100+hs(i+5)*20,(i%2?330:455)+hs(i)*20,50+hs(i+2)*16,34+hs(i+7)*10,['#a8453a','#8a5a3c','#4f6f8a','#9a7a3a'][i%4]]);
function topView(t){const u=t-12.3,fr=lp(-200,1130,sm(cl(u/3.8))),nz=q=>Math.sin(q*.03+u*2)*26+Math.sin(q*.09)*12+Math.max(0,Math.sin(q*.012+1))*110;
ctx.save();ctx.globalAlpha=cl(u/.5);ctx.fillStyle='#6a9150';ctx.fillRect(0,0,W,H);
for(let i=0;i<14;i++){ctx.fillStyle=i%2?'#7aa05a':'#5d8546';ctx.fillRect(hs(i)*1100,hs(i+9)*600,120+hs(i+3)*120,60+hs(i+5)*80)}
ctx.lineCap='round';ctx.strokeStyle='#4d86a8';ctx.lineWidth=26;ctx.beginPath();ctx.moveTo(-20,610);ctx.bezierCurveTo(300,560,500,700,800,620);ctx.bezierCurveTo(1000,570,1150,640,1300,600);ctx.stroke();
ctx.strokeStyle='#b8aa8c';ctx.lineWidth=18;ctx.beginPath();ctx.moveTo(-20,420);ctx.bezierCurveTo(300,380,600,480,900,400);ctx.bezierCurveTo(1100,350,1200,380,1300,360);ctx.stroke();
ctx.fillStyle='#2f5d33';for(let i=0;i<90;i++){ctx.beginPath();ctx.arc(hs(i+100)*1280,hs(i+200)*720,6+hs(i)*7,0,TAU);ctx.fill()}
for(const[x,y,w,h,c]of TH){ctx.fillStyle='rgba(0,0,0,.25)';ctx.fillRect(x+5,y+5,w,h);ctx.fillStyle=c;ctx.fillRect(x,y,w,h);ctx.fillStyle='rgba(0,0,0,.22)';ctx.fillRect(x+w/2,y,w/2,h);ctx.fillStyle='rgba(255,255,255,.25)';ctx.fillRect(x+w/2-1,y,2,h)}
const E=s=>fr+nz(s),pt=(q,s)=>[q*.8-s*.6,q*.6+s*.8];ctx.beginPath();let p=pt(-400,-800);ctx.moveTo(p[0],p[1]);
for(let s=-800;s<=600;s+=14){p=pt(E(s),s);ctx.lineTo(p[0],p[1])}p=pt(-400,600);ctx.lineTo(p[0],p[1]);ctx.closePath();ctx.fillStyle='rgba(104,74,46,.95)';ctx.fill();ctx.strokeStyle='rgba(150,115,75,.8)';ctx.lineWidth=3;ctx.stroke();
for(let i=0;i<110;i++){const x=hs(i+300)*1280,y=hs(i+400)*720,q=x*.8+y*.6,s=-x*.6+y*.8;if(q>E(s)-24)continue;ctx.fillStyle=i%3?'rgba(40,25,12,.22)':'rgba(170,135,95,.2)';ctx.beginPath();ctx.ellipse(x,y,10+hs(i)*22,5+hs(i+9)*10,hs(i+3)*3,0,TAU);ctx.fill()}
for(let i=0;i<34;i++){const x=hs(i+500)*1280,y=hs(i+600)*720,q=x*.8+y*.6,s=-x*.6+y*.8;if(q>E(s)-30)continue;ctx.save();ctx.translate(x,y);ctx.rotate(hs(i)*3);if(i%2){ctx.fillStyle='#4a3322';ctx.fillRect(-14,-2.5,28,5)}else{ctx.fillStyle='#74797e';ctx.beginPath();ctx.arc(0,0,4+hs(i+2)*6,0,TAU);ctx.fill()}ctx.restore()}
ctx.globalAlpha=cl(u/.5);ctx.fillStyle='rgba(8,14,24,.6)';ctx.fillRect(24,24,130,34);ctx.fillStyle='#f4ead2';ctx.font='600 18px system-ui,sans-serif';ctx.textAlign='left';ctx.fillText('TOP VIEW   N ↑',38,47);ctx.restore()}
function scene(t){ctx.setTransform(dpr,0,0,dpr,0,0);const k=sm(cl((t-3.8)/3)),c=cam(t),f=F(t),se=cl((t-7)/.5)*cl((11-t)/2);
let g=ctx.createLinearGradient(0,0,0,H*.8);g.addColorStop(0,rg(mx(SKY.top[0],SKY.top[1],k)));g.addColorStop(.6,rg(mx(SKY.mid[0],SKY.mid[1],k)));g.addColorStop(1,rg(mx(SKY.hor[0],SKY.hor[1],k)));ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
if(k<1){const sg=ctx.createRadialGradient(1000,110,6,1000,110,90);sg.addColorStop(0,`rgba(255,244,200,${.95*(1-k)})`);sg.addColorStop(1,'rgba(255,244,200,0)');ctx.fillStyle=sg;ctx.fillRect(880,0,240,230)}
ctx.fillStyle=`rgba(40,52,64,${.45*k})`;for(let i=0;i<14;i++){ctx.beginPath();ctx.arc(mod(i*150+t*14,1500)-100,50+hs(i)*130,60+hs(i+9)*50,0,TAU);ctx.fill()}
RD.forEach(R=>ridge(R,t,c,k));
ctx.save();ctx.translate(640+Math.sin(t*70)*4*se,360+Math.cos(t*83)*3*se);ctx.scale(c.z,c.z);ctx.translate(-c.cx,-c.cy);
const l=c.cx-640/c.z-60,r=c.cx+640/c.z+60,fell=TR.filter(q=>q.z&&t>q.tf).length/LG.length;
ctx.beginPath();ctx.moveTo(l,1500);for(let x=l;x<=r;x+=12)ctx.lineTo(x,gy(x));ctx.lineTo(r,1500);{const tg=ctx.createLinearGradient(0,120,0,1000);tg.addColorStop(0,'#7a6342');tg.addColorStop(1,'#43331f');ctx.fillStyle=tg;ctx.fill()}
const strip=(a,b,off,lw,col)=>{ctx.strokeStyle=col;ctx.lineWidth=lw;ctx.beginPath();for(let x=Math.max(a,l);x<=Math.min(b,r);x+=12)x==Math.max(a,l)?ctx.moveTo(x,gy(x)+off):ctx.lineTo(x,gy(x)+off);ctx.stroke()};
strip(l,r,7,16,'#5f8a40');ctx.globalAlpha=fell;strip(250,1040,9,22,k>.3?'#6e4d2e':'#8d6841');ctx.globalAlpha=1;
for(const q of TR){if(q.z&&t>q.tf){ctx.fillStyle='#4a3322';ctx.fillRect(q.x-3,gy(q.x)-7,6,7)}
let tilt=q.z&&t>q.tf?sm(cl((t-q.tf)/.9))*1.45:0,x=q.x,y0=0;const pu=push(q.x,t);if(q.x>=760&&pu>0){x=q.x+60*(1-Math.exp(-pu/80));tilt=Math.max(tilt,cl(pu/80)*1.5);y0=Math.min(th(x,t)*.5,q.s*.4)}tree(x,q.s,q.g,tilt,y0)}
for(const q of LG){const u=t-q.tf;if(u>0&&u<.6){ctx.fillStyle='#e2c58f';for(let j=0;j<7;j++){const a=hs(q.x+j)*TAU,d=u*70*(.4+hs(j+5));ctx.fillRect(q.x+Math.cos(a)*d,gy(q.x)-20-Math.abs(Math.sin(a))*d+u*u*90,3,2)}}}
if(t<4.6){lj(0,t,0,'#c0453a');lj(0,t,1,'#3a6ea5')}
HO.forEach((h,i)=>house(h,i,t));
if(f>762){const a=770,top=x=>gy(x)-th(x,t);ctx.beginPath();ctx.moveTo(a,gy(a)+6);for(let x=a;x<=f;x+=4)ctx.lineTo(x,top(x));ctx.lineTo(f,gy(f)+6);ctx.closePath();
const mg=ctx.createLinearGradient(0,gy(f)-120,0,gy(f)+20);mg.addColorStop(0,'#7b5a38');mg.addColorStop(.5,'#5b4128');mg.addColorStop(1,'#3f2d1c');ctx.fillStyle=mg;ctx.fill();
ctx.strokeStyle='rgba(150,115,75,.7)';ctx.lineWidth=2;ctx.beginPath();for(let x=a;x<=f;x+=4)x==a?ctx.moveTo(x,top(x)):ctx.lineTo(x,top(x));ctx.stroke();
ctx.strokeStyle='rgba(40,25,12,.3)';ctx.lineWidth=2;for(let i=0;i<8;i++){const x=f-hs(i+50)*Math.min(720,f-760)*.9,tt=th(x,t);if(tt<14)continue;const y=gy(x)-tt*(.3+hs(i+60)*.4);ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-14-hs(i)*18,y+2);ctx.stroke()}
const L=Math.min(720,f-760);for(let i=0;i<12;i++){const x=f-mod(hs(i)*L*.95+(t-7)*45,L*.95)-8,tt=th(x,t);if(tt<8)continue;const rr=4+hs(i+40)*8;ctx.save();ctx.translate(x,gy(x)-tt+2);ctx.rotate(x*.05);if(i%3==0){ctx.fillStyle='#4a3322';ctx.fillRect(-rr*2,-2.5,rr*4,5)}else{ctx.fillStyle='#6e7378';ctx.beginPath();ctx.arc(0,-rr*.5,rr,0,TAU);ctx.fill()}ctx.restore()}
if(t<11.8){ctx.fillStyle='#6a4a2f';for(let i=0;i<28;i++){const u=mod(t*1.6+hs(i+3),1),x=f-30+u*(40+hs(i+8)*60)+hs(i+20)*30,y=gy(x)-th(f-30,t)*.8-4*u*(1-u)*(50+hs(i+12)*70)+u*u*20;ctx.beginPath();ctx.arc(x,y,2+hs(i+30)*4,0,TAU);ctx.fill()}}
ctx.fillStyle=`rgba(135,112,88,${.22*cl((12.4-t)/2)})`;for(let i=0;i<22;i++){const x=f-hs(i+70)*160+Math.sin(t*2+i)*8,y=gy(x)-th(x,t)-15-hs(i+90)*70-(t-7)*3;ctx.beginPath();ctx.arc(x,y,24+hs(i+11)*30,0,TAU);ctx.fill()}}
for(let i=0;i<10;i++){const ts=6.6+hs(i)*.6,u=t-ts;if(u<0||t>8.5)continue;const x=720+hs(i+5)*160+u*u*70;ctx.fillStyle='#6e7378';ctx.beginPath();ctx.arc(x,gy(x)-5,4+hs(i+20)*3,0,TAU);ctx.fill()}
ctx.restore();
if(t>=12.3)topView(t);
let fl=0;for(const[t0,d,bx]of FL){const q=(t-t0)/d;if(q<0||q>1)continue;const a=Math.pow(Math.max(0,Math.sin(q*Math.PI*3)),2)*(1-q);fl=Math.max(fl,a);
if(q<.4&&a>.1){ctx.strokeStyle='#eef6ff';ctx.shadowColor='#bcd8ff';ctx.shadowBlur=18;ctx.lineWidth=3;ctx.beginPath();let x=bx;ctx.moveTo(x,-10);for(let i=1;i<=9;i++){x+=(hs(i+bx)-.5)*70;ctx.lineTo(x,i*34)}ctx.stroke();ctx.shadowBlur=0}}
ctx.fillStyle=`rgba(10,18,28,${.3*k})`;ctx.fillRect(0,0,W,H);if(fl>0){ctx.fillStyle=`rgba(225,236,255,${fl*.5})`;ctx.fillRect(0,0,W,H)}
const ri=sm(cl((t-4)/2.2));ctx.strokeStyle=`rgba(200,220,235,${.45})`;ctx.lineWidth=1.3;ctx.beginPath();
for(let i=0;i<380;i++){if(hs(i)>ri)continue;const y=mod(hs(i+3)*900+t*(850+hs(i+4)*400),820)-50,x=mod(hs(i+1)*1500,1500)-100+y*.18,len=14+hs(i+5)*14;ctx.moveTo(x-len*.18,y-len);ctx.lineTo(x,y)}ctx.stroke();
const vg=ctx.createRadialGradient(640,360,300,640,360,800);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,.4)');ctx.fillStyle=vg;ctx.fillRect(0,0,W,H);
for(const[a,b,s]of CAP){const al=Math.min(cl((t-a)/.3),cl((b-t)/.3));if(al<=0)continue;ctx.font='600 28px system-ui,sans-serif';ctx.textAlign='center';const w=ctx.measureText(s).width+56;ctx.globalAlpha=al;ctx.fillStyle='rgba(8,14,24,.6)';ctx.beginPath();ctx.roundRect?ctx.roundRect(640-w/2,640,w,52,26):ctx.rect(640-w/2,640,w,52);ctx.fill();ctx.fillStyle='#f4ead2';ctx.fillText(s,640,676);ctx.globalAlpha=1}
const fd=Math.max(1-t/.35,1-(D-t)/.35,0);if(fd>0){ctx.fillStyle=`rgba(0,0,0,${cl(fd)})`;ctx.fillRect(0,0,W,H)}}

// ================= narrator lady: stands on the stage below the animation =================
const LINES=[{t0:.4,t1:3.9,tx:'Up in the mountains, the forest is being cut down.',pt:0},{t0:4.2,t1:7,tx:'Then heavy rain falls on the bare soil.',pt:0},{t0:7.2,t1:9.9,tx:'The slope collapses into a landslide!',pt:1},{t0:10.1,t1:12.3,tx:'Mud and rocks rush toward the village.',pt:1},{t0:12.6,t1:16.8,tx:'From above, the village is buried. Stop deforestation, and protect our forests.',pt:0}];
// mouth shapes [width, opening, roundness] for the visemes
const MS={A:[24,17,0],E:[29,9,0],I:[30,6,0],O:[15,15,1],U:[12,10,1],W:[12,8,1],M:[22,1.5,0],F:[24,5,0],C:[20,6,0],R:[21,2,0]},VW={a:'A',e:'E',i:'I',o:'O',u:'U',y:'I',m:'M',b:'M',p:'M',f:'F',v:'F',w:'W'},REST=[21,2,0];
const shp=ch=>MS[ch&&/[a-z]/.test(ch)?(VW[ch]||'C'):'R'];
// every letter gets a time slot (vowels longest, punctuation = pause); the slots are stretched to fill the line's time window
LINES.forEach(L=>{const c=[...L.tx.toLowerCase()],d=c.map(ch=>'aeiou'.includes(ch)?.11:/[a-z]/.test(ch)?.06:ch==' '?.045:',;'.includes(ch)?.2:.34),k=(L.t1-L.t0)*.95/d.reduce((a,b)=>a+b,0);L.c=c;L.cum=[0];d.forEach((x,i)=>L.cum.push(L.cum[i]+x*k));L.drift=0;L.go=false});
function mouth(t){for(const L of LINES){const te=t-L.t0+L.drift;if(te<0||te>L.cum[L.c.length])continue;let i=0;while(i<L.c.length-1&&L.cum[i+1]<te)i++;const a=shp(L.c[i]),b=shp(L.c[i+1]),k=sm(cl(((te-L.cum[i])/(L.cum[i+1]-L.cum[i])-.5)/.5));return{m:[lp(a[0],b[0],k),lp(a[1],b[1],k),lp(a[2],b[2],k)],i,L}}return{m:REST,i:-1,L:null}}
// pacing: she walks back and forth, and stops to point at the screen while the landslide is described
const PA=[-1.1];for(let i=1;i<=D*50;i++){const q=i/50;let v=1;for(const L of LINES)if(L.pt)v=Math.min(v,1-sm(cl(Math.min((q-L.t0+.6)/.5,(L.t1+.4-q)/.5))));PA.push(PA[i-1]+.02*.42*v)}
const pa=t=>{const f=cl(t,0,D)*50,i=Math.min(Math.floor(f),D*50-1);return lp(PA[i],PA[i+1],f-i)},px=t=>640+330*Math.sin(pa(t));
const gst=(t,key)=>LINES.reduce((m,L)=>(key=='pt'&&!L.pt)?m:Math.max(m,sm(cl(Math.min((t-L.t0+.3)/.4,(L.t1+.3-t)/.4)))),0);
function limb(sx,sy,sg,a1,a2,col){const ex=sx+sg*Math.sin(a1)*46,ey=sy+Math.cos(a1)*46,wx=ex+sg*Math.sin(a1+a2)*40,wy=ey+Math.cos(a1+a2)*40,ux=ex+(wx-ex)*.75,uy=ey+(wy-ey)*.75;
ctx.lineCap='round';ctx.strokeStyle=col;ctx.lineWidth=13;ctx.beginPath();ctx.moveTo(sx,sy);ctx.lineTo(ex,ey);ctx.lineTo(ux,uy);ctx.stroke();ctx.strokeStyle='#e3b08c';ctx.lineWidth=8;ctx.beginPath();ctx.moveTo(ux,uy);ctx.lineTo(wx,wy);ctx.stroke();ctx.fillStyle='#e3b08c';ctx.beginPath();ctx.arc(wx,wy,6,0,TAU);ctx.fill()}
function mouthD(m,x,y){const w=m[0]*.4,h=m[1]*.8,r=m[2];ctx.save();ctx.translate(x,y);
if(h<2.2){ctx.strokeStyle='#b8404f';ctx.lineWidth=2.8;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(-w,0);ctx.quadraticCurveTo(0,2.4,w,0);ctx.stroke();ctx.fillStyle='rgba(220,120,130,.7)';ctx.fillRect(-w*.5,1,w,1.5)}
else{ctx.beginPath();ctx.ellipse(0,h*.3,w*(1-r*.1),h*.55,0,0,TAU);ctx.fillStyle='#3b1218';ctx.fill();ctx.save();ctx.clip();if(h>3.5){ctx.fillStyle='#f4f1ea';ctx.fillRect(-w,-h*.3,w*2,Math.min(4,h*.4))}if(h>8){ctx.fillStyle='#d9737d';ctx.beginPath();ctx.ellipse(0,h*.65,w*.55,h*.2,0,0,TAU);ctx.fill()}ctx.restore();
ctx.strokeStyle='#b8404f';ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(0,h*.3,w*(1-r*.1),h*.55,0,0,TAU);ctx.stroke()}ctx.restore()}
function lady(t,X,FY0,mo){const v=(px(t+.05)-px(t-.05))/.1,mv=cl(Math.abs(v)/35),dir=cl(v/70,-1,1),ph=X*.05,tk=gst(t,'tk'),pn=gst(t,'pt'),bob=Math.abs(Math.sin(ph))*2.2*mv+Math.sin(t*1.7)*.8,fx=dir*4,blink=mod(t,3.7)<.13,SK='#e3b08c',HR='#2a1a14',BL='#1f7a8c';
ctx.save();ctx.translate(X,FY0);ctx.fillStyle='rgba(0,0,0,.5)';ctx.beginPath();ctx.ellipse(0,2,58,8,0,0,TAU);ctx.fill();ctx.scale(.98,.98);
for(const g of[-1,1]){const q=ph+(g>0?0:Math.PI),lx=g*9+Math.sin(q)*20*mv,lift=Math.max(0,Math.cos(q))*9*mv;ctx.strokeStyle='#4b5a70';ctx.lineWidth=15;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(g*9,-94);ctx.lineTo(lx,-8-lift);ctx.stroke();ctx.fillStyle='#0d1015';ctx.beginPath();ctx.ellipse(lx+dir*3,-4-lift,12,5.5,0,0,TAU);ctx.fill()}
ctx.translate(0,-bob);ctx.rotate(dir*.015);const hrt=dir*.03+Math.sin(t*2.4)*.02*tk;
ctx.save();ctx.translate(0,-176);ctx.rotate(hrt);ctx.translate(0,176);ctx.fillStyle=HR;ctx.beginPath();ctx.moveTo(-30,-212);ctx.bezierCurveTo(-33,-268,33,-268,30,-212);ctx.bezierCurveTo(35,-190,38,-166,33,-144);ctx.quadraticCurveTo(22,-136,12,-146);ctx.quadraticCurveTo(0,-138,-12,-146);ctx.quadraticCurveTo(-22,-136,-33,-144);ctx.bezierCurveTo(-38,-166,-35,-190,-30,-212);ctx.fill();
ctx.strokeStyle='rgba(170,120,90,.32)';ctx.lineWidth=2.5;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(-17,-244);ctx.quadraticCurveTo(0,-254,17,-244);ctx.stroke();ctx.restore();
ctx.fillStyle='#2a3544';ctx.fillRect(-27,-100,54,8);
ctx.fillStyle=BL;ctx.beginPath();ctx.moveTo(-14,-182);ctx.lineTo(-33,-172);ctx.lineTo(-27,-96);ctx.lineTo(27,-96);ctx.lineTo(33,-172);ctx.lineTo(14,-182);ctx.quadraticCurveTo(0,-170,-14,-182);ctx.fill();
ctx.fillStyle='#f4f1ea';ctx.beginPath();ctx.moveTo(-12,-182);ctx.lineTo(12,-182);ctx.lineTo(0,-138);ctx.fill();ctx.strokeStyle='#15606f';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-12,-182);ctx.lineTo(0,-138);ctx.lineTo(12,-182);ctx.moveTo(0,-138);ctx.lineTo(0,-96);ctx.stroke();
limb(-33,-170,-1,.14+Math.sin(ph)*.3*mv+tk*.12*Math.sin(t*2.2),.22+tk*.2*(.5+.5*Math.sin(t*3.3)),BL);
limb(33,-170,1,lp(.28+tk*(.3+.22*Math.sin(t*3.1))+Math.sin(ph+Math.PI)*.2*mv*(1-tk),2.5,pn),lp(.55+tk*(.45+.3*Math.sin(t*4.3+1)),-.3,pn),BL);
ctx.fillStyle=SK;ctx.fillRect(-7,-188,14,16);
ctx.save();ctx.translate(0,-176);ctx.rotate(hrt);ctx.translate(0,176);
ctx.fillStyle=SK;for(const g of[-1,1]){ctx.beginPath();ctx.ellipse(g*25,-212,4,6,0,0,TAU);ctx.fill()}ctx.fillStyle='#d6a63a';ctx.beginPath();ctx.arc(-25,-203,2.2,0,TAU);ctx.arc(25,-203,2.2,0,TAU);ctx.fill();
ctx.fillStyle=SK;ctx.beginPath();ctx.ellipse(0,-212,25,29,0,0,TAU);ctx.fill();
ctx.fillStyle='rgba(230,120,120,.18)';for(const g of[-1,1]){ctx.beginPath();ctx.arc(g*15+fx,-203,6,0,TAU);ctx.fill()}
for(const g of[-1,1]){const ex=g*10+fx;ctx.fillStyle='#fff';ctx.beginPath();ctx.ellipse(ex,-214,6,blink?.8:4,0,0,TAU);ctx.fill();if(!blink){ctx.fillStyle='#2b1a12';ctx.beginPath();ctx.arc(ex+dir*1.6,-214-pn*1.8,3,0,TAU);ctx.fill();ctx.fillStyle='#fff';ctx.fillRect(ex+dir*1.6-1,-216-pn*1.8,1.6,1.6)}
ctx.strokeStyle=HR;ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(ex-6,-223-(mo.m[1]>10?1.5:0));ctx.quadraticCurveTo(ex,-227-(mo.m[1]>10?2:0),ex+6,-223);ctx.stroke()}
ctx.strokeStyle='rgba(150,90,70,.6)';ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(fx,-211);ctx.quadraticCurveTo(fx+dir*3,-205,fx,-204);ctx.stroke();
mouthD(mo.m,fx,-196);
ctx.save();ctx.beginPath();ctx.ellipse(0,-212,25,29,0,0,TAU);ctx.clip();ctx.fillStyle=HR;ctx.beginPath();ctx.moveTo(-32,-264);ctx.lineTo(32,-264);ctx.lineTo(32,-222);ctx.lineTo(24,-224);ctx.quadraticCurveTo(14,-241,-9,-243);ctx.quadraticCurveTo(-20,-238,-26,-218);ctx.lineTo(-32,-218);ctx.closePath();ctx.fill();ctx.restore();
for(const g of[-1,1]){ctx.fillStyle=HR;ctx.beginPath();ctx.moveTo(g*26,-200);ctx.bezierCurveTo(g*36,-188,g*38,-168,g*32,-143);ctx.bezierCurveTo(g*26,-154,g*21,-172,g*21,-190);ctx.closePath();ctx.fill()}
ctx.restore();ctx.restore()}
function subs(t,mo){const L=LINES.find(L=>t>L.t0-.1&&t<L.t1+.7);if(!L)return;const a=Math.min(cl((t-L.t0+.1)/.2),cl((L.t1+.7-t)/.3));ctx.font='600 25px system-ui,sans-serif';ctx.textAlign='left';const tx=L.tx;let sg=[[tx,0]];if(ctx.measureText(tx).width>1000){const m=tx.lastIndexOf(' ',tx.length/2+6);sg=[[tx.slice(0,m),0],[tx.slice(m+1),m+1]]}
const ci=mo.L===L?mo.i:(t>L.t0+.5?L.c.length:0);ctx.globalAlpha=a;sg.forEach(([q,st],j)=>{const x0=640-ctx.measureText(q).width/2,y=34+j*32;ctx.fillStyle='#6f7b89';ctx.fillText(q,x0,y);ctx.fillStyle='#fff';ctx.fillText(q.slice(0,cl(ci-st,0,q.length)),x0,y)});ctx.globalAlpha=1}
function stage(t){const mo=mouth(t),X=px(t),FY0=SH-34;ctx.save();ctx.translate(0,H);
const bg=ctx.createLinearGradient(0,0,0,SH);bg.addColorStop(0,'#06080c');bg.addColorStop(1,'#10151c');ctx.fillStyle=bg;ctx.fillRect(0,0,W,SH);
const sp=ctx.createRadialGradient(X,FY0-120,10,X,FY0-120,300);sp.addColorStop(0,'rgba(90,130,170,.28)');sp.addColorStop(1,'rgba(90,130,170,0)');ctx.fillStyle=sp;ctx.fillRect(0,0,W,SH);
const fg=ctx.createLinearGradient(0,FY0,0,SH);fg.addColorStop(0,'#1a212b');fg.addColorStop(1,'#0b0e13');ctx.fillStyle=fg;ctx.fillRect(0,FY0,W,SH-FY0);ctx.fillStyle='rgba(255,255,255,.08)';ctx.fillRect(0,FY0,W,1.5);
subs(t,mo);lady(t,X,FY0,mo);
if(needG&&voiceOn){ctx.font='600 15px system-ui,sans-serif';ctx.textAlign='right';ctx.fillStyle='#ffd24a';ctx.fillText('Click Play or Voice once to enable sound',W-20,SH-10)}ctx.restore()}
function frame(t){ctx.setTransform(dpr,0,0,dpr,0,0);ctx.save();ctx.beginPath();ctx.rect(0,0,W,H);ctx.clip();scene(t);ctx.restore();stage(t)}
// ---------- voice (browser text-to-speech; mouth is driven by the timeline so it works silently too) ----------
let t=0,playing=true,voiceOn=true,needG=false,last=performance.now();const pp=document.getElementById('pp'),sk=document.getElementById('sk'),tm=document.getElementById('tm'),vc=document.getElementById('vc');
const synth=typeof speechSynthesis!=='undefined'?speechSynthesis:null;let vz=null;
function pickV(){if(!synth)return;const all=synth.getVoices(),en=all.filter(x=>/^en/i.test(x.lang));vz=en.find(x=>/zira|aria|jenny|samantha|susan|hazel|karen|tessa|moira|fiona|victoria|female/i.test(x.name))||en.find(x=>/google us english/i.test(x.name))||en[0]||all[0]||null}
if(synth){pickV();synth.onvoiceschanged=pickV}
function resetSpeech(){if(synth){synth.cancel();synth.resume()}LINES.forEach(L=>{L.go=t>L.t0+.05;L.drift=0})}
function say(L){if(!synth)return;const u=new SpeechSynthesisUtterance(L.tx);if(vz){u.voice=vz;u.lang=vz.lang}u.pitch=1.15;u.rate=cl((L.tx.length/14.5)/((L.t1-L.t0)*.95),.8,1.45);
u.onboundary=e=>{if(L.cum[e.charIndex]!=null)L.drift=lp(L.drift,L.cum[e.charIndex]-(t-L.t0),.6)};u.onerror=e=>{if(e.error==='not-allowed')needG=true};synth.speak(u)}
function loop(n){const dt=Math.min(.1,(n-last)/1000);last=n;if(playing){t+=dt;if(t>=D){t=0;resetSpeech()}sk.value=t;if(voiceOn)for(const L of LINES)if(!L.go&&t>=L.t0&&t<L.t0+1.2){L.go=true;say(L)}}frame(t);tm.textContent=t.toFixed(1)+'s';requestAnimationFrame(loop)}
pp.onclick=()=>{needG=false;playing=!playing;pp.textContent=playing?'Pause':'Play';if(synth)playing?synth.resume():synth.pause()};
vc.onclick=()=>{needG=false;voiceOn=!voiceOn;vc.textContent='Voice: '+(voiceOn?'On':'Off');resetSpeech()};
sk.oninput=()=>{needG=false;playing=false;pp.textContent='Play';t=+sk.value;resetSpeech()};
if(document.addEventListener)document.addEventListener('pointerdown',()=>{needG=false});
requestAnimationFrame(loop);
