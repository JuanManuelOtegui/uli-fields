(function(){
const F=window.FILM, D=window.ULI, NV=window.NV, FS=NV.FIELDS;
const WORD=['Zero','One','Two','Three','Four','Five','Six','Seven'][FS.length];
const DISC='Information only. Not an offer and not investment advice. Estimates, not forecasts. Land is illiquid and capital is at risk.';
const DISC2_UNUSED='Illustrative model built from the La Tijereta investment memorandum (May 2026) and UPM terms reported to ULI. Not a forecast. Land is illiquid and capital is at risk.';
const kin=(cls,t,d)=>`<div class="kin ${cls}"${d?` style="--d:${d}ms"`:''}>${t}</div>`;
const rev=(t,d=0,cls='')=>`<div class="rev ${cls}" style="--d:${d}ms">${t}</div>`;
const kick=(t,d=0)=>rev(`<div class="kick">${t}</div>`,d);
const card=(t,v,d,extra='')=>`<div class="card ${extra}"><div class="ct">${t}</div><div class="cv">${v}</div><div class="cd">${d}</div></div>`;
F.extraAssets=['ret_soil','lav_map','dur_map','tij_soil'].map(x=>''+x+'.jpg'); FS.forEach(f=>{F.extraAssets.push(''+f.main[0]+'.jpg');f.thumbs.forEach(t=>F.extraAssets.push(''+t[0]+'.jpg'))});

/* camera: view height in km */
const C={far:{x:500,y:545,km:700},country:{x:500,y:545,km:560,ax:.74,ay:.5}};
const fcam=f=>({x:f.x,y:f.y,km:f.exact?Math.max(7,5*f.rkm):Math.max(22,6.5*f.rkm),ax:.66,ay:.5});
const fmap=f=>({glow:true,sat:1,field:f.k,props:[f.pk],focusProp:f.pk,propLabels:false});
const fmapNoDot=f=>({glow:true,sat:1,field:f.k,props:[],propLabels:false});

/* locator inset */
const locator=f=>{let s='<svg viewBox="0 0 1000 1086" aria-label="Location in Uruguay">';
  Object.keys(D.depts).forEach(k=>{s+=`<path d="${D.depts[k]}" fill="${k===f.dk?'#2f7a54':'#16331f'}" stroke="#6b8f78" stroke-width="5"/>`});
  return s+`<circle cx="${f.x}" cy="${f.y}" r="30" fill="#E8B86D" stroke="#06110b" stroke-width="10"/></svg>`};

function swapInit(root){
  const mi=root.querySelector('.mi'); if(!mi) return;
  const img=mi.querySelector('img'), cap=mi.querySelector('.cap');
  const swap=fig=>{
    const ts=fig.dataset.src, tc=fig.dataset.cap, ms=mi.dataset.src, mc=cap.textContent;
    img.style.animation='none'; void img.offsetWidth;
    img.src=''+ts+'.jpg'; img.alt=tc; cap.textContent=tc; mi.dataset.src=ts; mi.style.setProperty('--bgi','url('+ts+'.jpg)');
    img.style.animation='';
    fig.dataset.src=ms; fig.dataset.cap=mc; fig.querySelector('img').src=''+ms+'.jpg'; fig.querySelector('.cap').textContent=mc; fig.setAttribute('aria-label','Show larger: '+mc);
  };
  root.querySelectorAll('.th figure').forEach(fig=>{
    fig.addEventListener('click',e=>{e.stopPropagation();swap(fig)});
    fig.addEventListener('keydown',e=>{if(e.key==='Enter'){e.stopPropagation();swap(fig)}});
  });
}
function zoomHTML(f){
  return `<div class="col zt">${rev(`<div class="znum">0${f.n}</div>`,200)}
    ${kin('zname',f.name,400)}
    ${rev(`<div class="zmeta"><b>${f.ha.toLocaleString('en-US')} ha</b> · ${f.dep}</div>`,900)}
</div>`;
}
function detHTML(f){
  const fb=f.fb; let segs='',lg='',used=0;
  fb.seg.forEach(s=>{segs+=`<i class="s${s[1]}" data-w="${s[0]}"></i>`;lg+=`<span class="s${s[1]}">${s[2]}</span>`;used+=s[0]});
  segs+=`<i class="sc" data-w="${Math.max(0,100-used)}"></i>`; lg+=`<span class="sc">${fb.rest}</span>`;
  const th=f.thumbs.map((t,i)=>rev(`<figure class="pe" data-src="${t[0]}" data-cap="${t[1]}" tabindex="0" role="button" aria-label="Show larger: ${t[1]}"><img src="${t[0]}.jpg" alt="${t[1]}"><div class="cap">${t[1]}</div></figure>`,500+i*130)).join('');
  return `<div class="col" style="max-width:none;width:auto"><div class="nvd">
    <div class="gal"${f.thumbs.length?'':' style="grid-template-rows:minmax(0,1fr)"'}>${rev(`<div class="mi pe" data-src="${f.main[0]}" style="--bgi:url(${f.main[0]}.jpg)"><img src="${f.main[0]}.jpg" alt="${f.main[1]}"><div class="cap">${f.main[1]}</div><div class="loc">${locator(f)}</div></div>`,150,'')}
      ${f.thumbs.length?`<div class="th" style="--n:${f.thumbs.length}">${th}</div>`:''}</div>
    <div class="info">
      ${kick(`Field ${f.n} of ${FS.length} · ${f.dep}`,200)}
      ${kin('nvh',f.name,300)}
      ${rev(`<div class="ld">${f.lead}</div>`,600)}
      ${rev(`<div class="stats3">${f.st.map(s=>`<div><b>${s[0]}</b><span>${s[1]}</span></div>`).join('')}</div>`,800)}
      ${rev(`<div class="fbar"><div class="ft"><span>${fb.t}</span><b>${fb.v}</b></div><div class="tr">${segs}</div><div class="lg">${lg}</div></div>`,1000)}
      ${rev(`<ul class="fx">${f.facts.map(x=>`<li>${x}</li>`).join('')}</ul>`,1200)}
      ${rev(`<div class="pl2">${f.plants}</div>`,1400)}
    </div></div></div>`;
}

/* ---------- Arrival ---------- */
F.chapter({title:'Arrival',beats:[
 {label:'Cover',hud:false,cam:C.country,map:{glow:true,sweep:true},veil:null,layout:'center',
  html:`<div class="col"><img class="logo-hero rev" src="logo.png" alt="Uruguay Land Invest">
      ${kin('h-xl shadow','Own the land that<br><em>feeds, builds and grows.</em>',300)}
      ${rev('<div class="lede">Direct land, forestry and agriculture in Uruguay.</div>',1400)}</div>`},
 {label:'The selection',cam:C.country,photo:null,map:{glow:true,depts:true,sat:1,props:'all',propLabels:false},veil:'left',layout:'left',
  html:`<div class="col" style="max-width:min(42vw,700px)">${kick('The selection · smallest to largest')}${kin('h-l',WORD+' fields, <em>from 360 ha to '+FS[FS.length-1].ha.toLocaleString('en-US')+'.</em>',200)}
   <div class="lgd">${FS.map((f,i)=>rev(`<div class="r"><b>${f.n}</b>${f.name}<span>${f.dep} · ${f.ha.toLocaleString('en-US')} ha</span><em><i data-lw="${(Math.log(f.ha)/Math.log(FS[FS.length-1].ha)*100).toFixed(0)}"></i></em></div>`,600+i*140)).join('')}</div></div>`,
  after:root=>{root.querySelectorAll('.lgd i').forEach(i=>setTimeout(()=>i.style.width=i.dataset.lw+'%',700))}}
]});

/* ---------- Soils ---------- */
const SOIL={
 ret:{img:'ret_soil',cap:'CONEAT soil groups · Farmland Lav 1',dense:false,g:[["2.21", "105", "~120 ha", "Hills with convex ridges; loamy Brunosoles, grazing use. Not in the forestry decree."], ["2.20", "74", "~145 ha", "Extended rolling hills; loamy Argisoles and Planosoles, grazing use. In the forestry decree only if the project also includes livestock or agriculture."], ["2.14", "61", "~75 ha", "Non-rocky hill country, rolling to broken relief; sandy to sandy-loam soils. In the forestry decree."], ["2.11b", "26", "~20 ha", "Small patch of rocky hills on granite, very shallow Litosoles. Same decree condition as 2.20."]],note:"Index and descriptions: MGAP CONEAT and ULI field report. Hectares measured on the CONEAT map inside the boundary; they match the report split (2.21 about 32%, 2.20 with 2.11b about 45%, 2.14 about 21%). Forestry decree: 452/988 as amended by 220/2010."},
 lav:{img:'lav_map',cap:'CONEAT soil groups · Farmland Lav 2',dense:false,g:[["2.21", "105", "~150 ha", "Non-rocky hills and rolling land, loamy Brunosoles. Not in the forestry decree."], ["2.12", "83", "~85 ha", "Undulating non-rocky hills, Brunosoles sandy loam to loam. In the forestry decree."], ["2.11a", "53", "~25 ha", "Rocky hills, shallow stony Brunosoles. In the forestry decree."], ["2.11b", "26", "~30 ha", "Steep rocky hills on granite, very shallow Litosoles. In the forestry decree only with a livestock or agriculture component."], ["2.10", "9", "~115 ha", "Very rocky sierras, over 40% outcrops. Not in the forestry decree."]],note:"Hectares measured on the CONEAT map inside the six parcels (403 ha); approximate. Index and descriptions: MGAP CONEAT."},
 dur:{img:'dur_map',cap:'CONEAT soil groups · Farmland Durazno',dense:false,g:[["8.12", "66", "359 ha", "Hills and strong rises on sandy soils; low fertility, very limited cropping. In the forestry decree."], ["G03.11", "70", "56 ha", "Low plains beside watercourses; flood risk, summer grazing."], ["G03.10", "18", "18 ha", "Areas flooded much of the year; practically no agricultural use."], ["G10.6a", "140", "9 ha", "Gently rolling land; deep soils of medium fertility, with Vertisols."], ["G10.7", "96", "3 ha", "Gently rolling to flat terrain; deep soils of medium fertility."], ["8.8", "74", "1 ha", "Group 8 soils. In the forestry decree."]],note:"Areas calculated from the CONEAT chart percentages. Forestry decree: 452/988 as amended by 220/2010 (groups 8.12 and 8.8)."},
 tij:{img:'tij_soil',cap:'CONEAT soil groups · La Tijereta',dense:false,g:[["9.2", "~74", "298 ha", "Brunosoles Eutricos, sandy loam to sandy clay loam; medium to high fertility, good drainage. In the forestry decree."], ["9.1", "61", "86 ha", "Lighter soils of pastoral and forestry aptitude. In the forestry decree."], ["03.2", "131", "71 ha", "Plains along the Queguay; very fertile, the best forage area of the farm. Flooding is the main limit. Not in the forestry decree."], ["9.3", "~74", "46 ha", "Lighter soils of pastoral and forestry aptitude. In the forestry decree."]],note:"Hectares: MGAP CONEAT sketch, padrón 6087 (501.0 ha). Index: 131 for 03.2 and 61 for 9.1 are published. The ~74 for 9.2 and 9.3 is derived: it is the combined value that brings the field to its average of 80."}
};
function soilHTML(f){
  const S=SOIL[f.k];
  return `<div class="col" style="max-width:none;width:auto"><div class="nvd">
    <div class="gal">${rev(`<div class="mi" style="--bgi:url(${S.img}.jpg)"><img src="${S.img}.jpg" alt="${S.cap}"><div class="cap">${S.cap}</div></div>`,150)}</div>
    <div class="info">
      ${kick(`Soils · ${f.name}`,200)}
      ${kin('nvh','Soil groups',300)}
      ${rev(`<table class="sgt${S.dense?' dense':''}"><tr><th>CONEAT group</th><th>Index</th><th>Hectares</th></tr>${S.g.map(g=>`<tr><td><b>${g[0]}</b><small>${g[3]}</small></td><td>${g[1]}</td><td>${g[2]}</td></tr>`).join('')}</table>`,600)}
      ${rev(`<div class="pl2">${S.note}</div>`,900)}
    </div></div></div>`;
}

/* ---------- Fields ---------- */
const ROM=['I','II','III','IV','V','VI'];
FS.forEach((f,i)=>{
 F.chapter({roman:ROM[i],title:f.name,beats:[
  {label:'Fly in · '+f.name,cam:fcam(f),photo:null,map:fmap(f),veil:'left',layout:'left',foot:null,html:zoomHTML(f)},
  {label:'Field · '+f.name,cam:fcam(f),photo:null,map:fmapNoDot(f),veil:'night',layout:'center',foot:DISC,html:detHTML(f),after:swapInit}
  ].concat(SOIL[f.k]?[{label:'Soils · '+f.name,cam:fcam(f),photo:null,map:fmapNoDot(f),veil:'night',layout:'center',foot:DISC,html:soilHTML(f),after:root=>{root.querySelectorAll('.fbar i').forEach(i=>{if(i.dataset.w)setTimeout(()=>i.style.width=i.dataset.w+'%',900)})}}]:[])});
});

/* ---------- Next steps ---------- */
F.chapter({roman:ROM[FS.length],title:'Next steps',beats:[
 {label:'Next steps',cam:C.country,photo:null,map:{glow:true,depts:true,sat:1,props:'all',propLabels:false},veil:'left',layout:'left',foot:DISC,
  html:`<div class="col" style="max-width:min(48vw,860px)">${kick('Where this leaves us')}${kin('h-l','Tell us what fits. <em>We build the rest.</em>',200)}
   <div class="steps">${rev('<div class="step"><div class="n">01</div><b>Your criteria</b><span>Departments, size range and maximum distance to the plants.</span></div>',600)}
   ${rev('<div class="step"><div class="n">02</div><b>Investment projects</b><span>Two or three fields modelled under the three scenarios, non-planted area included.</span></div>',800)}
   ${rev('<div class="step"><div class="n">03</div><b>Walk the land</b><span>A visit, with an asado, during your trip in the first half of 2027.</span></div>',1000)}</div></div>`},
 {label:'End',hud:false,cam:C.far,photo:null,map:{glow:true,sweep:true},veil:'soft',layout:'center',
  html:`<div class="col"><img class="logo-hero rev" src="logo.png" alt="Uruguay Land Invest">${kin('h-l shadow','Thank you.',400)}</div>`}
]});
})();
