import * as T from './vendor/three.module.js';
export const DAY_SECONDS=480,SEASON_SECONDS=960;
export const seasons=[{name:'Printemps',icon:'🌸',grass:0x83b64c,leaf:0x439b55},{name:'Été',icon:'☀️',grass:0x9cb94e,leaf:0x398a4a},{name:'Automne',icon:'🍂',grass:0xb4a15a,leaf:0xb77739},{name:'Hiver',icon:'❄️',grass:0xc9d8c6,leaf:0x75988b}];
export function climateAt(seconds){const t=Math.max(0,Number(seconds)||0),phase=(t%DAY_SECONDS)/DAY_SECONDS,season=seasons[Math.floor(t/SEASON_SECONDS)%4],daylight=Math.max(0,Math.min(1,Math.sin(phase*Math.PI*2)*2+.25)),wet=t%DAY_SECONDS>105&&t%DAY_SECONDS<185;return {season,phase,daylight,wet,night:daylight<.25,label:daylight<.25?'🌙 Nuit':phase>.4?'🌅 Coucher du soleil':phase<.08?'🌅 Aube':'☀️ Jour'};}
export function equipmentState(saved,inv){return {torch:!!saved?.torch&&!!inv.torch,springs:!!saved?.springs&&!!inv.springs};}
export function jumpSpeed(equipment,inv,mounted=false){return !mounted&&equipment.springs&&inv.springs?10:6;}
// Small, fixed veins on the northern mountains, outside the original island.
export const ironVeins=[[-31,-106],[-33,-107],[-24,-119],[-22,-120],[-17,-128],[18,-121],[20,-123],[30,-130],[32,-131],[40,-136],[-41,-113],[-43,-115]];
export function makeWeather(scene,camera,hemisphere,sun,mats){
 const rainGeo=new T.BufferGeometry(),positions=new Float32Array(180*6);rainGeo.setAttribute('position',new T.BufferAttribute(positions,3));const rain=new T.LineSegments(rainGeo,new T.LineBasicMaterial({color:0xb8ddf3,transparent:true,opacity:.6}));rain.visible=false;rain.frustumCulled=false;scene.add(rain);
 const torch=new T.Group(),wood=new T.Mesh(new T.CylinderGeometry(.035,.045,.42,6),new T.MeshLambertMaterial({color:0x865032}));torch.add(wood);const flame=new T.Mesh(new T.OctahedronGeometry(.09),new T.MeshBasicMaterial({color:0xffcd62}));flame.position.y=.27;flame.scale.y=1.7;torch.add(flame);torch.position.set(-.36,-.38,-.7);torch.visible=false;camera.add(torch);const light=new T.PointLight(0xffbe65,0,18,1.4);light.position.set(0,.3,0);torch.add(light);
 const moon=new T.Mesh(new T.SphereGeometry(3,12,8),new T.MeshBasicMaterial({color:0xfff1be}));moon.visible=false;scene.add(moon);
 const skyDay=new T.Color('#a9ddeb'),skyNight=new T.Color('#253753'),skyWet=new T.Color('#859eae'),target=new T.Color();let lastSeason;
 return {update(seconds,pos,equipment,inv,region,covered=false){const c=climateAt(seconds),precip=c.wet&&!region.includes('désert')&&!region.includes('volcani'),snow=region.includes('enneigées')||(precip&&c.season===seasons[3]);target.copy(skyNight).lerp(skyDay,c.daylight);if(precip)target.lerp(skyWet,.25*c.daylight);scene.background.copy(target);scene.fog.color.copy(target);hemisphere.intensity=.55+c.daylight*2.05;sun.intensity=.18+c.daylight*(precip?1.25:2.12);sun.position.set(Math.cos(c.phase*Math.PI*2)*40,15+c.daylight*30,20);moon.visible=c.night;moon.position.set(pos.x-45,pos.y+48,pos.z-70);
 if(lastSeason!==c.season){mats.grass.color.setHex(c.season.grass);mats.leaf.color.setHex(c.season.leaf);lastSeason=c.season;}
 rain.visible=precip&&!snow&&!covered;if(rain.visible){for(let i=0;i<180;i++){const k=i*6,x=pos.x+Math.sin(i*78.23)*13,z=pos.z+Math.cos(i*43.51)*13,y=pos.y+10-((seconds*12+i*.71)%15);positions.set([x,y,z,x-.08,y-.7,z],k);}rainGeo.attributes.position.needsUpdate=true;}
 torch.visible=!!equipment.torch&&!!inv.torch;light.intensity=torch.visible?15+Math.sin(seconds*19)*1.2:0;flame.scale.y=1.6+Math.sin(seconds*17)*.18;
 return {...c,snow:snow&&!covered,raining:rain.visible,text:c.season.icon+' '+c.season.name+' · '+c.label+(precip?(snow?' · ❄️ Neige':' · 🌧️ Pluie'):'')};}};
}
