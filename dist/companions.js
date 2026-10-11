export const missions=[
 {id:'snow',title:'Au pays de la neige',hint:'Passe les cascades et rejoins les montagnes enneigées au grand nord.',reward:8},
 {id:'sabre',title:'Sur la piste des crocs',hint:'Observe un tigre à dents de sabre dans la savane au sud-est.',reward:8},
 {id:'mammoth',title:'Un géant pour ami',hint:'Offre 10 baies à un mammouth laineux pour devenir son ami.',reward:10},
  {id:'explorer',title:'Les quatre horizons',hint:'Découvre la grotte, la cascade, les ruines et l’archipel. Le carnet donne des indices.',reward:8},
  {id:'nursery',title:'Un bébé bien nourri',hint:'Fais éclore un œuf puis offre une baie à ton bébé.',reward:4},
  {id:'journal',title:'Un carnet bien rempli',hint:'Rencontre les neuf espèces d’animaux préhistoriques.',reward:7},
  {id:'friend',title:'Un nouvel ami',hint:'Apprivoise un dinosaure avec des baies.',reward:3},
  {id:'name',title:'Un prénom pour ton ami',hint:'Ouvre Mes amis et donne-lui un prénom.',reward:2},
  {id:'pen',title:'Une maison pour les dinos',hint:'Fabrique un kit enclos dans l’atelier, puis pose-le sur un espace libre.',reward:4},
  {id:'meal',title:'Le repas est servi',hint:'Pose une mangeoire, vise-la et remplis-la avec 🤍. Un ami proche viendra manger.',reward:3},
  {id:'home',title:'Bienvenue chez toi',hint:'Amène un ami dans l’enclos, ferme le portillon et dis-lui de rester.',reward:5},
];
export function claimMission(state,id,inv){if(!state.done[id]||state.claimed[id])return false;const m=missions.find(m=>m.id===id);if(!m)return false;state.claimed[id]=true;inv.gems=(inv.gems||0)+m.reward;return true;}
export function fillFeeder(stock,inv){const n=Math.min(6-stock,inv.berries||0);if(n<=0)return 0;inv.berries-=n;return n;}
export function penCells(x,z){const cells=[];for(let dx=-3;dx<=3;dx++)for(let dz=-3;dz<=3;dz++)if(Math.abs(dx)===3||Math.abs(dz)===3)cells.push({x:x+dx,z:z+dz,type:dx===0&&dz===3?'gate':'fence'});return cells;}
export function insidePen(d,p){return Math.abs(d.x-p.x)<2.5&&Math.abs(d.z-p.z)<2.5;}
// Keep the actor and its stable ID: old save arrays refer to spawn indexes.
export function releaseCompanion(d,confirmed=false){if(!confirmed||!d?.tame)return false;d.tame=false;d.refuge=false;d.feed=0;d.nickname='';d.order='stay';d.ecoGoal=null;d.foodTarget=null;d.foodAbsent=0;d.calmUntil=0;d.happyUntil=0;d.g.visible=true;return true;}
export function restoredBabyTame(record){return record?.tame!==false;}
export function blockedByFence(blocks,key,x,z,y){const ix=Math.round(x),iz=Math.round(z);for(let h=Math.floor(y)-1;h<=Math.ceil(y)+1;h++){const b=blocks.get(key(ix,h,iz));if(b&&['fence','gate'].includes(b.type)&&Math.abs(b.y-y)<1.8)return true;}return false;}
