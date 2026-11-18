/* ULI × Nuveen · field data. Edit lat/lon here; add `poly:[[lon,lat],...]` to draw a real boundary on the satellite. */
(function(){
const D=window.ULI;
const X0=-58.439,SX=187.69,Y0=-30.097,SY=222.6;
window.NV={X0,SX,Y0,SY,lon2x:l=>(l-X0)*SX,lat2y:a=>(Y0-a)*SY,x2lon:x=>x/SX+X0,y2lat:y=>Y0-y/SY,KM:2.0055};
/* exact:true means the coordinates are confirmed; otherwise the location is shown as approximate and the camera stays at regional scale */
NV.FIELDS=[
 {k:'ret',dk:'lavalleja',name:'Farmland Lav 1',dep:'Lavalleja',ha:360,lat:-33.563932,lon:-54.665226,exact:true,
  lead:'Livestock farm with forestry areas, on a national road. One fifth of the land is forestry-priority, up to two thirds with a livestock component.',
  st:[['360 ha','Area'],['US$4,550','Per hectare'],['81','CONEAT']],
  fb:{t:'Land that can qualify for forestry',v:'21–66%',seg:[[21,'a','21% qualifies outright (~75 ha): group 2.14'],[45,'b','45% more if the project also includes livestock (~165 ha): groups 2.20 and 2.11b']],rest:'32% is outside the decree (~120 ha): group 2.21'},
  facts:['Direct access from a national road','Water in creeks and ponds, electricity at the gate','Old homestead that can be restored'],
  plants:'Distance to the plants to be confirmed',
  main:['ret_sat','Satellite view'],thumbs:[['ret_p1','Landscape at dusk'],['ret_p2','Old homestead'],['ret_p4','Cattle on the farm']]},
 {k:'lav',dk:'lavalleja',name:'Farmland Lav 2',dep:'Lavalleja',ha:442,lat:-34.136885,lon:-55.217034,exact:true,
  lead:'Hill country in the Santa Lucía headwaters, 40 km from Minas.',
  st:[['442 ha','Area'],['US$4,000','Per hectare'],['63','CONEAT']],
  fb:{t:'Land that can qualify for forestry',v:'23–30%',seg:[[23.3,'a','23% qualifies outright (94 ha): groups 2.12 and 2.11a'],[6.9,'b','7% more if the project also includes livestock (28 ha): group 2.11b']],rest:'70% is outside the decree (281 ha): groups 2.21 and 2.10'},
  facts:['406 ha plus an adjoining 36 ha lot being annexed','Working livestock operation','Staff housing, shed and animal-handling facilities'],
  plants:'Distance to the plants to be confirmed',
  main:['lav_sat','Satellite view · parcels'],thumbs:[]},
 {k:'dur',dk:'durazno',name:'Farmland Durazno',dep:'Durazno',ha:445,lat:-32.904613,lon:-55.394321,exact:true,
  lead:'A small ticket with the highest share of forestry-priority soils.',
  st:[['445 ha','Area'],['US$5,200','Per ha, negotiable'],['66','CONEAT']],
  fb:{t:'Forestry-priority soils',v:'80.9%',seg:[[80.9,'a','360 ha on priority soils']],rest:'Other soils'},
  facts:['Soil groups 8.12 and 8.8 dominate','Can be taken alone or with Campo 1 (1,820 ha)','A natural field to test own wood against a lease'],
  plants:'Distance to the plants to be confirmed',
  main:['dur_sat','Satellite view'],thumbs:[]},
 {k:'tij',dk:'paysandu',name:'La Tijereta',dep:'Paysandú',ha:501,lat:-32.231,lon:-57.686,exact:true,
  lead:'Mixed livestock, cropping and forestry farm on the Queguay River.',
  st:[['501 ha','Area'],['US$5,200','Per hectare'],['80','CONEAT']],
  fb:{t:'Forestry-priority soils',v:'86%',seg:[[85.8,'a','430 ha on priority soils: groups 9.1, 9.2 and 9.3']],rest:'14% group 03.2, outside the decree (71 ha)'},
  facts:['Permanent water and native woodland on the Queguay River','Handling yards with scales, three windmills, solar power','Main house and staff quarters in very good condition'],
  plants:'<b>181 km</b> to UPM Fray Bentos · <b>231 km</b> to Paso de los Toros',
  main:['tij_sat','Satellite view'],thumbs:[['tij_p1','Main house'],['tij_p2','Cattle'],['tij_p3','Grazing land']]}
];
/* straight-line distance to the two UPM pulp mills (WGS84 plant coordinates) */
const PL={pdt:[-32.866,-56.5354],fb:[-33.121,-58.2551]};
const hav=(a,b,c,d)=>{const R=6371,t=x=>x*Math.PI/180,dl=t(c-a),dn=t(d-b);const h=Math.sin(dl/2)**2+Math.cos(t(a))*Math.cos(t(c))*Math.sin(dn/2)**2;return 2*R*Math.asin(Math.sqrt(h))};
const r5=x=>Math.round(x/5)*5;
const ROAD={tij:' · by road: <b>181 km</b> and <b>231 km</b>'};
NV.FIELDS.forEach(f=>{ const a=r5(hav(f.lat,f.lon,PL.pdt[0],PL.pdt[1])),b=r5(hav(f.lat,f.lon,PL.fb[0],PL.fb[1]));
  f.dPdt=a;f.dFb=b;
  f.plants=`<b>UPM Paso de los Toros</b> ~${a} km · <b>UPM Fray Bentos</b> ~${b} km <span style="opacity:.7">straight line</span>`+(ROAD[f.k]||''); });
/* replace the webinar properties with ours */
D.markers={};D.props={};
NV.FIELDS.forEach((f,i)=>{ f.n=i+1; f.x=NV.lon2x(f.lon); f.y=NV.lat2y(f.lat); f.pk='p-'+f.k; f.rkm=Math.sqrt(f.ha/100/Math.PI);
  D.markers[f.pk]=[+f.x.toFixed(1),+f.y.toFixed(1)];
  D.props[f.pk]={name:f.name,dept:f.dk,region:f.dep,area:f.ha.toLocaleString('en-US')+' ha',imgs:[],hl:[],radar:[]}; });
D.ops=[];
})();
