import {raptorSpawns} from './raptor-habitat.js';
// Broad regions around the established island. Existing terrain remains authoritative.
export const MAP_RADIUS=182,MAP_EXTENT=192,MAX_BUILD_HEIGHT=62;
export function frontierHeight(x,z){
 const r=Math.hypot(x*.95,z);if(r>MAP_RADIUS)return -2;
 const north=Math.hypot(x/94,(z+106)/70),west=Math.hypot((x+103)/65,z/79),east=Math.hypot((x-104)/68,z/83);
 const jungle=Math.hypot((x+62)/48,(z-63)/40);
 let coast=Math.max((1-north)*65,(1-west)*62,(1-east)*65,(1-jungle)*38),target=2+Math.sin(x*.047)*1.1+Math.cos(z*.055)*1.2;
 for(const[cx,cz,rad]of [[-65,112,37],[0,135,36],[67,112,37]]){const d=Math.hypot(x-cx,z-cz);coast=Math.max(coast,rad-d);}
 if(coast<=0)return -2;
 if(z<-100)target=Math.max(target,36-Math.hypot(x+22,z+127)*.68,23-Math.hypot(x-34,z+133)*.6);
 else if(x>35&&z<-40)target=Math.max(target,17-Math.hypot(x-65,z+67)*.6);
 else if(x>88&&z>18)target=Math.max(target,9-Math.hypot(x-125,z-43)*.3,7-Math.hypot(x-109,z-65)*.35);
 // A gradual shoreline around the old map avoids sudden cliffs at the join.
 const transition=Math.max(0,(r-73)*.65);
 return Math.max(0,Math.floor(Math.min(target,coast*.6,transition)));
}
export function frontierBiome(x,z){
 if(z<-100)return '❄️ Les montagnes enneigées';
 if(x>88&&z>18)return '🐅 La savane des crocs';
 if(x>-90&&x<-30&&z>50&&z<97)return '🌴 La grande jungle';
 if(z>78)return '🏝️ Le grand archipel';
 if(x>35&&z<-40)return '🌋 Les terres volcaniques';
 if(z<-67)return '💦 La grande vallée des cascades';
 if(x<-85&&z<-20)return '💎 Les hauts plateaux de cristal';
 if(x<-72&&z>8)return '🌿 Les grands marais';
 if(x<-66)return '🌵 Le grand désert';
 if(x>79&&z<-6)return '🏛️ Le royaume des ruines';
 if(x>65)return '🌾 Les grandes plaines';
 return '🌴 La grande jungle';
}
export const regionalSpawns=[
 ...raptorSpawns,
 {id:'mammoth-a',x:-30,z:-105,index:7},{id:'mammoth-b',x:-38,z:-110,index:7},{id:'mammoth-c',x:20,z:-125,index:7},{id:'mammoth-d',x:29,z:-129,index:7},
 {id:'sabre-a',x:106,z:35,index:8},{id:'sabre-b',x:120,z:46,index:8},{id:'sabre-c',x:112,z:66,index:8},
 {id:'swamp-a',x:-109,z:24,index:4},{id:'swamp-b',x:-126,z:40,index:4},
 {id:'plains-a',x:101,z:0,index:6},{id:'plains-b',x:126,z:-17,index:6},
 {id:'jungle-a',x:-72,z:73,index:1},{id:'jungle-b',x:-79,z:81,index:0},
 {id:'isles-a',x:1,z:130,index:2},{id:'isles-b',x:65,z:112,index:1},
 {id:'sky-a',x:13,z:-86,index:5},{id:'sky-b',x:-28,z:-88,index:5},
 {id:'volcano-a',x:65,z:-64,index:3},
];
export const frontierBerries=[[136,-73],[147,-70],[151,-80],[-28,-99],[-40,-112],[24,-122],[39,-135],[108,29],[126,52],[110,70],[-101,28],[-123,47],[105,-7],[-71,80],[2,126],[63,113],[-61,108],[13,-85],[-21,-81],[58,-68],[-100,-38]];
export const frontierLandmarks=[
 {id:'raptor-plain',name:'Grande plaine des raptors',icon:'🌾',x:143,z:-71,hint:'Nord-est : au-delà des ruines, une grande prairie abrite les raptors et les petits protocératops.'},
 {id:'snow',name:'Montagnes des mammouths',icon:'❄️',x:-30,z:-105,hint:'Grand nord : continue au-delà des cascades. Les troupeaux vivent sur les pentes enneigées.'},
 {id:'sabre',name:'Savane des crocs',icon:'🐅',x:111,z:38,hint:'Sud-est : traverse les grandes plaines. Les tigres rôdent près des rochers.'},
 {id:'deep-jungle',name:'Grande jungle',icon:'🌴',x:-72,z:75,hint:'Sud-ouest : une forêt étendue rejoint les îles du sud.'},
 {id:'deep-swamp',name:'Grands marais',icon:'🌿',x:-117,z:30,hint:'Ouest : explore les forêts humides au-delà des anciens marais.'},
 {id:'far-ruins',name:'Royaume des ruines',icon:'🏛️',x:120,z:-22,hint:'Est puis nord : suis les colonnes éparpillées loin derrière les premières ruines.'},
 {id:'far-isles',name:'Grand archipel',icon:'🏝️',x:0,z:132,hint:'Plein sud : trois grandes îles se cachent derrière les petits îlots.'},
 {id:'crystal-heights',name:'Plateaux de cristal',icon:'💎',x:-112,z:-42,hint:'Nord-ouest : après la grotte, cherche les colonnes de cristal.'},
 {id:'volcanic',name:'Terres volcaniques',icon:'🌋',x:65,z:-65,hint:'Nord-est : les pentes rocheuses prolongent le territoire des tyrannosaures.'},
 {id:'far-desert',name:'Grand désert',icon:'🌵',x:-105,z:-15,hint:'Plein ouest : la région sèche s’étend entre les cristaux et les marais.'},
 {id:'far-plains',name:'Grandes plaines',icon:'🌾',x:99,z:7,hint:'Plein est : traverse les plaines avant de partir vers la savane.'},
];
export const frontierTreasures=[{id:'snow-peak',x:-22,z:-127,gems:20},{id:'sabre-rock',x:126,z:43,gems:15},{id:'swamp-cache',x:-119,z:33,gems:12},{id:'isles-cache',x:3,z:133,gems:15},{id:'ruins-cache',x:122,z:-23,gems:12},{id:'crystal-cache',x:-115,z:-43,gems:12}];
export function companionRecord(saved,d,index){return saved?.companionState?saved.companionState[d.id]:saved?.companions?.[index];}
