/* Satellite basemap (HTML tile layer, GPU-composited) + field boundary layer. */
(function(){
const F=window.FILM, D=window.ULI, NV=window.NV, NS='http://www.w3.org/2000/svg';
const TILES=window.NV_TILES||'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
const {lon2x,lat2y,x2lon,y2lat}=NV;
let svg,gFld,layer,loaded=0,failed=0,flying=false;
const cache=new Map(), vis=new Set();
F.drift=false;
const mercY=lat=>{const r=lat*Math.PI/180;return (1-Math.log(Math.tan(r)+1/Math.cos(r))/Math.PI)/2};
const mercLat=t=>Math.atan(Math.sinh(Math.PI*(1-2*t)))*180/Math.PI;
const mk=(n,a)=>{const e=document.createElementNS(NS,n);for(const k in a)e.setAttribute(k,a[k]);return e};
const url=(z,x,y)=>TILES.replace('{z}',z).replace('{x}',x).replace('{y}',y);

F.onBuild=function(s){
  svg=s;
  layer=document.createElement('div'); layer.id='satHtml';
  document.getElementById('stage').insertBefore(layer,document.getElementById('world'));
  const allD=Object.values(D.depts).join(' ');
  svg.querySelector('#gHalo').after(mk('path',{id:'gOut',d:'M-3000,-3000H4000V4000H-3000Z '+allD}));
  gFld=mk('g',{id:'gFld'}); svg.appendChild(gFld);
  NV.FIELDS.forEach(f=>{
    const g=mk('g',{class:'fld','data-k':f.k});
    if(f.poly){
      const d='M'+f.poly.map(p=>lon2x(p[0]).toFixed(2)+','+lat2y(p[1]).toFixed(2)).join('L')+'Z';
      g.appendChild(mk('path',{class:'fl-fill',d}));g.appendChild(mk('path',{class:'fl-line',d,pathLength:1}));
    }else if(f.exact){
      const r=f.rkm*NV.KM;
      g.appendChild(mk('circle',{class:'fl-fill',cx:f.x,cy:f.y,r}));g.appendChild(mk('circle',{class:'fl-line',cx:f.x,cy:f.y,r,pathLength:1}));
    }else{
      const r=Math.max(1.5,f.rkm)*NV.KM;
      g.appendChild(mk('circle',{class:'fl-soft',cx:f.x,cy:f.y,r:r*1.6}));g.appendChild(mk('circle',{class:'fl-approx',cx:f.x,cy:f.y,r}));
    }
    gFld.appendChild(g);
  });
};

function wanted(z,x0,x1,y0,y1){
  const n=Math.pow(2,z),out=[];
  const lonW=x2lon(x0),lonE=x2lon(x1),latN=y2lat(y0),latS=y2lat(y1);
  const tx0=Math.max(0,Math.floor((lonW+180)/360*n)),tx1=Math.min(n-1,Math.floor((lonE+180)/360*n));
  const ty0=Math.max(0,Math.floor(mercY(latN)*n)),ty1=Math.min(n-1,Math.floor(mercY(latS)*n));
  for(let ty=ty0;ty<=ty1;ty++)for(let tx=tx0;tx<=tx1;tx++)out.push([z,tx,ty]);
  return out;
}
function addTile(z,x,y){
  const key=z+'/'+x+'/'+y; let t=cache.get(key);
  if(t){t.seen=performance.now();return t}
  const n=Math.pow(2,z),lonW=x/n*360-180,lonE=(x+1)/n*360-180,latN=mercLat(y/n),latS=mercLat((y+1)/n);
  const X=lon2x(lonW),Y=lat2y(latN),W=lon2x(lonE)-X,H=lat2y(latS)-Y;
  const el=document.createElement('img'); el.className='st'; el.draggable=false; el.decoding='async'; el.style.zIndex=z;
  el.addEventListener('load',()=>{loaded++;el.classList.add('ok');svg.classList.add('satok')});
  el.addEventListener('error',()=>{failed++;el.remove();cache.delete(key);vis.delete(t)});
  el.src=url(z,x,y);
  layer.appendChild(el);
  t={el,z,X,Y,W,H,seen:performance.now(),on:true}; cache.set(key,t); vis.add(t); return t;
}
let last={k:0,tx:0,ty:0,t:0,fl:false};
function selectTiles(k,tx,ty,force){
  const now=performance.now();
  if(!force && Math.abs(k/last.k-1)<.04 && Math.abs(tx-last.tx)<16 && Math.abs(ty-last.ty)<16 && last.fl===flying) return;
  if(!force && now-last.t<160) return;
  last={k,tx,ty,t:now,fl:flying};
  const vw=innerWidth,vh=innerHeight,m=.06;
  const x0=(-tx-vw*m)/k,x1=(vw*(1+m)-tx)/k,y0=(-ty-vh*m)/k,y1=(vh*(1+m)-ty)/k;
  let zt=Math.ceil(Math.log2(NV.SX*k*360/256)-.25); zt=Math.max(6,Math.min(16,zt));
  if(flying) zt=Math.max(6,zt-(zt&1));            /* fewer distinct zoom levels while the camera moves */
  let list=wanted(zt,x0,x1,y0,y1);
  while(list.length>36&&zt>6){zt--;list=wanted(zt,x0,x1,y0,y1)}
  const zf=Math.max(6,zt-3);
  const all=(zf<zt?wanted(zf,x0,x1,y0,y1):[]).concat(list);
  let added=0;
  all.forEach(a=>{ if(!cache.has(a.join('/'))){ if(added>=14) { last.t=0; last.k=0; return; } added++; } addTile(a[0],a[1],a[2]); });
  /* drop tiles far from this view or this zoom */
  if(cache.size>260){
    const arr=[...cache.entries()].sort((a,b)=>a[1].seen-b[1].seen);
    arr.slice(0,cache.size-200).forEach(([key,t])=>{t.el.remove();cache.delete(key);vis.delete(t)});
  }
}
function place(k,tx,ty){
  const vw=innerWidth,vh=innerHeight;
  vis.forEach(t=>{
    const sx=t.X*k+tx,sy=t.Y*k+ty,w=t.W*k,h=t.H*k;
    if(sx>vw+8||sy>vh+8||sx+w<-8||sy+h<-8){ if(t.on){t.on=false;t.el.style.visibility='hidden'} return; }
    if(!t.on){t.on=true;t.el.style.visibility=''}
    t.el.style.transform='translate3d('+sx.toFixed(2)+'px,'+sy.toFixed(2)+'px,0) scale('+((w+.7)/256).toFixed(5)+','+((h+.7)/256).toFixed(5)+')';
  });
}
let strokeK=0, curField=null;
F.onFrame=function(k,tx,ty,fl){
  if(!svg) return;
  flying=fl;
  const b=F.beats[F.idx], m=b&&b.R?b.R.map||{}:{};
  const on=!!m.sat;
  if(on!==F._satOn){F._satOn=on; layer.classList.toggle('on',on); svg.classList.toggle('sat',on);}
  svg.classList.toggle('fly',fl);
  if(on){ selectTiles(k,tx,ty,false); place(k,tx,ty); }
  if(!fl && Math.abs(k/strokeK-1)>.04){
    strokeK=k; const st=svg.style;
    st.setProperty('--sw',(2.6/k)+'px');st.setProperty('--dsw',(1.2/k)+'px');st.setProperty('--gsw',(2.4/k)+'px');st.setProperty('--hsw',(14/k)+'px');
  }
  const cur=m.field||null;
  if(curField!==cur){ curField=cur; [...gFld.children].forEach(g=>{g.classList.toggle('on',g.dataset.k===cur);g.classList.remove('arr')}); }
  if(!fl&&cur){ const g=gFld.querySelector('[data-k="'+cur+'"]'); if(g&&!g.classList.contains('arr')) g.classList.add('arr'); }
};

/* prefetch: country levels first, then the view of every satellite beat, so the show runs from cache */
const pre=[];let queue=[],active=0;
function pump(){ while(active<6&&queue.length){ const u=queue.shift(); const im=new Image(); active++; im.onload=im.onerror=()=>{active--;pump()}; im.src=u; pre.push(im); } }
function enqueueView(k,tx,ty,zs){
  const vw=innerWidth,vh=innerHeight,x0=-tx/k,x1=(vw-tx)/k,y0=-ty/k,y1=(vh-ty)/k;
  zs.forEach(z=>wanted(z,x0,x1,y0,y1).forEach(a=>queue.push(url(a[0],a[1],a[2]))));
}
F.prefetch=function(){
  const vw=innerWidth,vh=innerHeight;
  [6,7,8,9].forEach(z=>enqueueView(0.0001+ (vw/1000),0,0,[]) );
  /* whole country, z6 to z9 */
  const k0=vw/1000; [6,7,8,9].forEach(z=>{ const ks=wanted(z,0,1000,0,1086); ks.forEach(a=>queue.push(url(a[0],a[1],a[2]))); });
  F.beats.forEach(b=>{
    if(!(b.R&&b.R.map&&b.R.map.sat&&b.R.cam&&b.R.cam.km)) return;
    const c=b.R.cam,h=c.km*NV.KM,w=h*vw/vh,k=vw/w,ax=c.ax!=null?c.ax:.5,ay=c.ay!=null?c.ay:.5;
    const tx=ax*vw-c.x*k,ty=ay*vh-c.y*k;
    let zt=Math.ceil(Math.log2(NV.SX*k*360/256)-.25); zt=Math.max(6,Math.min(16,zt));
    enqueueView(k,tx,ty,[Math.max(6,zt-3),zt,Math.max(6,zt-1)]);
  });
  queue=[...new Set(queue)]; pump();
};
setTimeout(()=>{ if(F.beats&&F.beats.length) F.prefetch(); },1200);
F.satStats=()=>({loaded,failed,tiles:cache.size});
})();
