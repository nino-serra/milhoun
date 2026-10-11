import {isPredator} from './island.js';
export const catalog=[
{"id":"darkPlanks","label":"Planches foncées","icon":"🪵","color":7951165,"crafted":true},
{"id":"palePlanks","label":"Planches claires","icon":"🪵","color":14862747,"crafted":true},
{"id":"cutStone","label":"Pierre taillée","icon":"🪨","color":11119270,"crafted":true},
{"id":"terracotta","label":"Terre cuite","icon":"🧱","color":12482135,"crafted":true},
{"id":"cream","label":"Bloc crème","icon":"⬜","color":15655097,"crafted":false},
{"id":"green","label":"Bloc vert","icon":"🟩","color":7379308,"crafted":false},
{"id":"purple","label":"Bloc violet","icon":"🟪","color":10322861,"crafted":false},
{"id":"brickStairs","label":"Escalier en brique","icon":"🪜","color":14130296,"crafted":true},
{"id":"darkStairs","label":"Escalier bois foncé","icon":"🪜","color":7951165,"crafted":true},
{"id":"paleStairs","label":"Escalier bois clair","icon":"🪜","color":14862747,"crafted":true},
{"id":"stoneSlab","label":"Dalle en pierre","icon":"▰","color":11119270,"crafted":true},
{"id":"brickSlab","label":"Dalle en brique","icon":"▰","color":14130296,"crafted":true},
{"id":"tileRoof","label":"Toit en tuiles","icon":"🏠","color":12413260,"crafted":true},
{"id":"slateRoof","label":"Toit en ardoise","icon":"🏠","color":5859703,"crafted":true},
{"id":"thatchRoof","label":"Toit de chaume","icon":"🏠","color":13151075,"crafted":true},
{"id":"ridgeRoof","label":"Faîtage en tuiles","icon":"🏠","color":12413260,"crafted":true},
{"id":"pillar","label":"Poteau en bois","icon":"🪵","color":11831645,"crafted":true},
{id:'chest',label:'Coffre de rangement',icon:'📦',color:0xb48350,crafted:true},
{id:'bed',label:'Lit du camp',icon:'🛏️',color:0xd97769,crafted:true},
{id:'tent',obtained:true,label:'Tente de voyage',icon:'⛺',color:0xf0c76e,crafted:true},
{id:'garden',label:'Potager',icon:'🌱',color:0x779a4e,crafted:true},
{id:'oven',label:'Four',icon:'♨️',color:0x8c8278,crafted:true},
{id:'bench',label:'Banc du camp',icon:'🪑',color:0xc68d58,crafted:true},
{id:'table',label:'Table du camp',icon:'🍽️',color:0xd2a16d,crafted:true},
{id:'stool',label:'Tabouret',icon:'🪑',color:0xba804e,crafted:true},
{id:'planter',label:'Jardinière',icon:'🌼',color:0x7baf68,crafted:true},
  {id:'penKit',label:'Kit enclos',icon:'🏡',color:0xc28a52,crafted:true},
  {id:'fence',label:'Clôture',icon:'🪵',color:0xc28a52,crafted:true},
  {id:'gate',label:'Portillon',icon:'🚪',color:0xbf8448,crafted:true},
  {id:'feeder',label:'Mangeoire',icon:'🫐',color:0xc79b64,crafted:true},
  {id:'grass',label:'Herbe',icon:'🌱',color:0x83b64c},
  {id:'wood',label:'Bois',icon:'🪵',color:0x9b6843},
  {id:'stone',label:'Pierre',icon:'🪨',color:0x89948e},
  {id:'sand',label:'Sable',icon:'🏖️',color:0xe6c889},
  {id:'brick',label:'Brique',icon:'🧱',color:0xd79c78},
  {id:'woodStairs',label:'Escalier bois',icon:'🪜',color:0xc28a52,crafted:true},
  {id:'stoneStairs',label:'Escalier pierre',icon:'🪜',color:0xa1aba6,crafted:true},
  {id:'slab',label:'Dalle en bois',icon:'▰',color:0xc79b64,crafted:true},
  {id:'planks',label:'Planches',icon:'🪵',color:0xd6af76,crafted:true},
  {id:'glass',label:'Verre',icon:'🪟',color:0xb4e5ea,crafted:true},
  {id:'moss',label:'Pierre moussue',icon:'🌿',color:0x668b57,crafted:true},
  {id:'blue',label:'Bloc bleu',icon:'🔷',color:0x72badc},
  {id:'coral',label:'Bloc rose',icon:'🌸',color:0xe7a49f},
  {id:'white',label:'Bloc blanc',icon:'☁️',color:0xeee8d5},
];
export const recipes=[
{"title":"🪵 6 Planches foncées","cost":{"wood":2},"out":"darkPlanks","n":6},
{"title":"🪵 6 Planches claires","cost":{"wood":2},"out":"palePlanks","n":6},
{"title":"🪨 6 Pierre taillée","cost":{"stone":3},"out":"cutStone","n":6},
{"title":"🧱 6 Terre cuite","cost":{"sand":2,"stone":1},"out":"terracotta","n":6},
{"title":"🪜 4 Escalier en brique","cost":{"stone":2,"sand":1},"out":"brickStairs","n":4},
{"title":"🪜 4 Escalier bois foncé","cost":{"wood":3},"out":"darkStairs","n":4},
{"title":"🪜 4 Escalier bois clair","cost":{"wood":3},"out":"paleStairs","n":4},
{"title":"▰ 6 Dalle en pierre","cost":{"stone":2},"out":"stoneSlab","n":6},
{"title":"▰ 6 Dalle en brique","cost":{"stone":1,"sand":1},"out":"brickSlab","n":6},
{"title":"🏠 6 Toit en tuiles","cost":{"stone":2,"sand":2},"out":"tileRoof","n":6},
{"title":"🏠 6 Toit en ardoise","cost":{"stone":3},"out":"slateRoof","n":6},
{"title":"🏠 6 Toit de chaume","cost":{"wood":2,"berries":1},"out":"thatchRoof","n":6},
{"title":"🏠 4 Faîtage en tuiles","cost":{"stone":2,"sand":1},"out":"ridgeRoof","n":4},
{"title":"🪵 4 Poteau en bois","cost":{"wood":2},"out":"pillar","n":4},
{title:'📦 Coffre de rangement',cost:{wood:8},out:'chest',n:1},
{title:'🛏️ Lit unique du camp',cost:{wood:10,berries:4},out:'bed',n:1,unique:true},
{title:'🌱 Potager',cost:{wood:4,stone:2},out:'garden',n:1},
{title:'♨️ Four',cost:{stone:8,iron:1},out:'oven',n:1},
{title:'🪑 Banc du camp',cost:{wood:4},out:'bench',n:1},
{title:'🍽️ Table du camp',cost:{wood:5},out:'table',n:1},
{title:'🪑 Tabouret',cost:{wood:2},out:'stool',n:1},
{title:'🌼 Jardinière',cost:{wood:3,berries:2},out:'planter',n:1},
  {title:'⛵ Bateau de la savane',cost:{wood:30,stone:12,iron:4},out:'boat',n:1,unique:true},
  {title:'🔥 Torche',cost:{wood:2,stone:1},out:'torch',n:1,unique:true},
  {title:'🥾 Bottes à ressorts',cost:{iron:4,wood:2},out:'springs',n:1,unique:true},
  {title:'🏡 Kit enclos 7 × 7',cost:{wood:8},out:'penKit',n:1},
  {title:'🫐 Mangeoire',cost:{wood:3},out:'feeder',n:1},
  {title:'🪵 8 clôtures',cost:{wood:2},out:'fence',n:8},
  {title:'🚪 Portillon',cost:{wood:2},out:'gate',n:1},
  {title:'⚔️ Épée en bois',cost:{wood:4},out:'sword',n:1,unique:true},
  {title:'🪜 4 escaliers en bois',cost:{wood:3},out:'woodStairs',n:4},
  {title:'🪜 4 escaliers en pierre',cost:{stone:3},out:'stoneStairs',n:4},
  {title:'▰ 6 dalles en bois',cost:{wood:2},out:'slab',n:6},
  {title:'🪵 6 blocs de planches',cost:{wood:2},out:'planks',n:6},
  {title:'🪟 4 blocs de verre',cost:{sand:3},out:'glass',n:4},
  {title:'🌿 4 pierres moussues',cost:{stone:2,berries:2},out:'moss',n:4},
  {title:'🪹 Un nid pour un œuf',cost:{wood:3},out:'nest',n:1},
  {title:'🪹 Un nid solide',cost:{stone:3},out:'nest',n:1},
];
export const itemName={iron:'fer',wood:'bois',stone:'pierres',sand:'sable',berries:'baies'};
export function itemType(type){if(type==='gateOpen')return 'gate';return type.replace(/[0-3]$/,'');}
export const stairItems=['woodStairs','stoneStairs','brickStairs','darkStairs','paleStairs'];
export const roofItems=['tileRoof','slateRoof','thatchRoof','ridgeRoof'];
export function rotatable(item){return stairItems.includes(item)||roofItems.includes(item);}
export function stairType(type){return stairItems.includes(type.slice(0,-1))&&/[0-3]$/.test(type);}
export function placedType(item,rotation){return rotatable(item)?item+((rotation%4+4)%4):item;}
// A stair is two actual half-height steps. Rotation points toward its high end.
export function blockTop(b,x,z){
  if(['slab','stoneSlab','brickSlab'].includes(b.type))return b.y;
  const item=itemType(b.type);if(roofItems.includes(item)){const r=Number(b.type.at(-1)),dx=x-b.x,dz=z-b.z,t=[-dz,dx,dz,-dx][r]??0;return b.y+(item==='ridgeRoof'?.5-Math.abs(t)*1.6:t*.8);}
  if(stairType(b.type)){
    const direction=Number(b.type.at(-1)),dx=x-b.x,dz=z-b.z;
    const high=[dz<=0,dx>=0,dz>=0,dx<=0][direction];
    return b.y+(high?.5:0);
  }
  return b.y+.5;
}
export function craft(inv,recipe){
  if(recipe.unique&&(inv[recipe.out]||inv[recipe.out+'Owned']))return false;
  if(!Object.entries(recipe.cost).every(([k,n])=>(inv[k]||0)>=n))return false;
  for(const[k,n]of Object.entries(recipe.cost))inv[k]-=n;
  inv[recipe.out]=(inv[recipe.out]||0)+recipe.n;return true;
}
export function spendBlock(inv,item){const c=catalog.find(c=>c.id===item);if(!c)return false;if(!c.crafted)return true;if(!(inv[item]>0))return false;inv[item]--;return true;}
export function attackable(d,pos,yaw){
  if(d.tame||d.baby||!isPredator(d.index))return false;
  const dx=d.g.position.x-pos.x,dz=d.g.position.z-pos.z,dist=Math.hypot(dx,dz);
  return dist<=3.5&&Math.abs(d.g.position.y+1-pos.y)<2.6&&(dist<.1||(-Math.sin(yaw)*dx-Math.cos(yaw)*dz)/dist>.45);
}
