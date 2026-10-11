import * as T from './vendor/three.module.js';
import {makeDinosaur,GROWTH_SECONDS} from './dinosaurs.js';
import {species} from './island.js';
import {frontierLandmarks,frontierTreasures} from './frontier.js';
export const landmarks=[...frontierLandmarks,
 {id:'cave',name:'Grotte de cristal',icon:'💎',x:-57,z:0,hint:'À l’ouest, passe les marais et cherche une entrée dans la roche.'},
 {id:'falls',name:'Cascade des brumes',icon:'💦',x:0,z:-57,hint:'Au nord, au-delà des falaises, cherche les deux rubans d’eau.'},
 {id:'ruins',name:'Ruines oubliées',icon:'🏛️',x:57,z:0,hint:'À l’est, des colonnes dépassent au-delà de la plaine.'},
 {id:'isles',name:'Archipel des nids',icon:'🏝️',x:2,z:63,hint:'Au sud, explore les petites îles à la nage ou en volant.'},
];
export const hiddenTreasures=[...frontierTreasures,{id:'crystal',x:-58,z:-3,gems:8},{id:'mist',x:2,z:-59,gems:8},{id:'temple',x:59,z:-3,gems:10},{id:'islet',x:3,z:64,gems:12},{id:'shore',x:24,z:55,gems:6}];
export const secretNests=[{id:'nest-raptor',x:145,z:-70,index:9},{id:'nest-cave',x:-55,z:3,index:2},{id:'nest-falls',x:-5,z:-56,index:5},{id:'nest-ruins',x:55,z:4,index:6},{id:'nest-west-isle',x:-18,z:55,index:1},{id:'nest-east-isle',x:22,z:55,index:0}];
export const INCUBATION_SECONDS=45;
export function normalizeExploration(s={},found=[],tamed=[]){return {schemaVersion:1,seen:[...new Set([...(s.seen||[]),...found,...tamed])].filter(i=>Number.isInteger(i)&&species[i]),places:[...new Set(s.places||[])],treasures:[...new Set(s.treasures||[])],hatched:[...new Set([...(s.hatched||[]),...(!s.schemaVersion?found.map(i=>'old-'+i):[])])],incubating:Object.fromEntries(Object.entries(s.incubating||{}).map(([id,t])=>[id,Math.max(0,Math.min(INCUBATION_SECONDS,Number(t)||0))])),cared:s.cared||0};}
export function collectSecret(state,id,inv){const t=hiddenTreasures.find(t=>t.id===id);if(!t||state.treasures.includes(id))return false;state.treasures.push(id);inv.gems=(inv.gems||0)+t.gems;return t.gems;}
export function incubate(state,id,inv){if(state.hatched.includes(id))return 'hatched';if(Object.hasOwn(state.incubating,id))return state.incubating[id]<=0?'ready':'waiting';if(!(inv.nest>0))return 'empty';inv.nest--;state.incubating[id]=INCUBATION_SECONDS;return 'started';}
export function tickIncubation(state,dt){for(const id of Object.keys(state.incubating))state.incubating[id]=Math.max(0,state.incubating[id]-dt);}
export function feedBaby(d,inv){if(!d.baby)return 'adult';if((d.fullness??90)>90)return 'full';if(!(inv.berries>0))return 'empty';inv.berries--;d.fullness=120;return 'fed';}
export function growBaby(d,dt){d.fullness=Math.max(0,(d.fullness??90)-dt);d.age=Math.min(GROWTH_SECONDS,d.age+dt*(d.fullness>0?1:.25));return d.age>=GROWTH_SECONDS;}
export const entries=[
 ['Près du camp et dans la jungle','5 baies','Reconnais ses trois cornes. Un compagnon pour tes premières explorations.'],
 ['Jungle et forêt du sud','7 baies','Son long cou dépasse des buissons. Tu peux le monter une fois adulte.'],
 ['Jungle et grotte de cristal','4 baies','Cherche les grandes plaques sur son dos et son nid près de la grotte.'],
 ['Autour du volcan','10 baies','Il est farouche avant de devenir ton ami. Garde tes baies à portée de main.'],
 ['Marais de l’ouest','12 baies','Sa grande voile permet de le reconnaître dans les marais.'],
 ['Falaises et vallée des cascades','3 baies','Ton compagnon volant : monte dessus et bats des ailes pour explorer les îles.'],
 ['Plaine de l’est et ruines','8 baies','Cherche ses petites crêtes. Son œuf est aussi caché près des ruines.'],
 ['Montagnes enneigées du grand nord','10 baies','Reconnais son pelage laineux, sa trompe et ses grandes défenses. Ce géant paisible peut devenir ta monture.'],
 ['Savane rocheuse du sud-est','12 baies','Ses deux longues canines et sa démarche de félin le distinguent. Il est farouche avant de devenir ton compagnon.'],
 ['Grande plaine des raptors au nord-est','6 baies','Un petit prédateur à plumes, rapide et agile. Dans le jeu, il chasse les petits protocératops sauvages.'],
 ['Plaine des raptors et savane','3 baies','Un petit herbivore à collerette. Il broute les plantes et sert de proie aux carnivores sauvages.'],
];
const cube=new T.BoxGeometry(1,1,1),sphere=new T.IcosahedronGeometry(1,0);
const materials=new Map();function material(color){if(!materials.has(color))materials.set(color,new T.MeshLambertMaterial({color}));return materials.get(color);}
function shape(g,x,y,z,w,h,d,color,geo=cube){const m=new T.Mesh(geo,material(color));m.position.set(x,y,z);m.scale.set(w,h,d);g.add(m);return m;}
export function makeNest(index){const g=new T.Group();for(let i=0;i<10;i++){const a=i*Math.PI/5,m=shape(g,Math.cos(a)*.5,.08,Math.sin(a)*.5,.55,.16,.16,0x91633d);m.rotation.y=-a;}const egg=shape(g,0,.45,0,.32,.44,.32,species[index].color,sphere);return {g,egg};}
export function buildSecrets({scene,add,ground,state}){
 const decor=new T.Group(),falls=[],chests=[];scene.add(decor);
 // Walkable cave: solid side walls, open southern entrance and an overhead canopy.
 for(let x=-62;x<=-52;x++)for(let z=-6;z<=4;z++)if(x===-62||x===-52||z===-6)for(let y=3;y<=7;y++)add(x,y,z,'stone');
 shape(decor,-57,7.7,-1,11,1.4,11,0x667d86);for(const[x,y,z,w,h,d]of [[-62,5,4,2,5,3],[-52,5,4,2,5,3],[-61,7.4,4,3,2,3],[-53,7.4,4,3,2,3],[-57,8.5,3,5,1.3,4]])shape(decor,x,y,z,w,h,d,0x718793);shape(decor,-60,8.6,-2,5,1,7,0x718793);shape(decor,-54,8.2,-2,4,.7,8,0x718793);
 for(const[x,z]of [[-60,-3],[-54,-4],[-61,1]]){const c=shape(decor,x,ground(x,z,true)+.8,z,.35,1.2,.35,0x75e7d7,sphere);c.rotation.z=.2;}
 // Two streams leave a rocky ledge; the passage behind them remains accessible.
 for(let x=-5;x<=5;x++)for(let y=3;y<=8;y++)add(x,y,-62,'stone');
 shape(decor,0,8.8,-60.5,12,.6,4,0x74999a);for(let x=-9;x<=9;x++)if(Math.abs(x)>4)for(let z=-63;z<=-59;z++)for(let y=3;y<=Math.max(3,11-Math.abs(x));y++)add(x,y,z,'stone');for(const[x,z]of [[-7,-60],[7,-61],[-5,-63]])shape(decor,x,ground(x,z)+.3,z,2,.5,2,0x439b55);shape(decor,0,9.15,-61,9,.08,3,0x64c9d2);
 for(const x of [-2,2]){const m=new T.Mesh(new T.BoxGeometry(1.8,6.1,.18),new T.MeshBasicMaterial({color:0x65d4e7,transparent:true,opacity:.65}));m.position.set(x,5.4,-58);decor.add(m);falls.push(m);for(let i=0;i<8;i++){const bead=shape(decor,x+(i%3-1)*.45,3+i*.65,-57.8,.09,.4,.09,0xdbffff);falls.push(bead);}}
 shape(decor,0,2.56,-57,7,.08,5,0x64c9d2);
 for(const[x,z,h]of [[53,-4,4],[61,-4,5],[53,4,3],[61,4,4]]){for(let y=3;y<3+h;y++)add(x,y,z,'moss');shape(decor,x,3+h,z,1.8,.4,1.8,0xa3b4a2);}
 shape(decor,57,7.5,-4,9,.7,1.4,0x8f9d8b);shape(decor,57,2.7,0,4,.3,4,0xc0b98f);
 for(const t of hiddenTreasures){const g=new T.Group();shape(g,0,.3,0,.9,.6,.6,0x91653e);shape(g,0,.65,0,.95,.15,.65,0xefc25b);shape(g,0,.35,.33,.15,.2,.08,0xffeaa0);g.position.set(t.x,ground(t.x,t.z,true),t.z);g.visible=!state.treasures.includes(t.id);scene.add(g);chests.push({...t,g});}
 for(const[x,z]of [[-22,58],[-2,66],[27,59],[-49,9],[64,9]]){const y=ground(x,z,true);for(let h=1;h<=3;h++)add(x,Math.floor(y)+h,z,'wood');for(let a=-2;a<=2;a++)for(let b=-2;b<=2;b++)if(Math.abs(a)+Math.abs(b)<4)add(x+a,Math.floor(y)+4,z+b,'leaf');}
 return {chests,update(time,pos){if(pos)for(const child of decor.children)child.visible=Math.hypot(child.position.x-pos.x,child.position.z-pos.z)<140;falls.forEach((m,i)=>{if(i%9!==0)m.position.y=2.8+((i*.65-time*2)%5.5+5.5)%5.5;});}};
}
let portraits;
export function dinosaurPortraits(){if(portraits)return portraits;portraits=[];let renderer;try{renderer=new T.WebGLRenderer({alpha:true,antialias:true,preserveDrawingBuffer:true});renderer.setSize(240,180);renderer.setPixelRatio(1);const scene=new T.Scene(),camera=new T.PerspectiveCamera(38,4/3,.1,30);scene.add(new T.HemisphereLight(0xffffff,0x587565,3));const light=new T.DirectionalLight(0xffffff,2);light.position.set(3,5,4);scene.add(light);for(let i=0;i<species.length;i++){const {g}=makeDinosaur(i,species[i].color);scene.add(g);const bounds=new T.Box3().setFromObject(g),center=bounds.getCenter(new T.Vector3()),size=bounds.getSize(new T.Vector3()),distance=Math.max(size.x,size.y,size.z)*1.25;camera.position.copy(center).add(new T.Vector3(distance*.8,distance*.35,distance));camera.lookAt(center);renderer.render(scene,camera);portraits.push(renderer.domElement.toDataURL());scene.remove(g);}}catch{portraits=[];}finally{renderer?.dispose();}return portraits;}
