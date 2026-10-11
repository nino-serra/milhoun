import {raptorPlainHeight} from './raptor-habitat.js';
// Existing island coordinates and the first six animals remain stable for old saves.
import {MAP_RADIUS,MAP_EXTENT,frontierHeight,frontierBiome} from './frontier.js';
export const ISLAND_RADIUS=MAP_RADIUS;
export const WORLD_EXTENT=MAP_EXTENT;
export const species=[
  {name:'Tricératops',color:0xc1bd76,kind:0},
  {name:'Diplodocus',color:0x75b7aa,kind:1},
  {name:'Stégosaure',color:0x83a65a,kind:2},
  {name:'Tyrannosaure',color:0xd68f69,kind:3},
  {name:'Spinosaure',color:0x699b83,kind:4},
  {name:'Ptérodactyle',color:0xc39a71,kind:5},
  {name:'Allosaure',color:0xa39b60,kind:6},
  {name:'Mammouth laineux',color:0x96623d,kind:7,mammal:true},
  {name:'Tigre à dents de sabre',color:0xd5a058,kind:8,mammal:true},
  {name:'Vélociraptor',color:0xb77a48,kind:9},
  {name:'Protocératops',color:0xa5af68,kind:10},
];
export const spawnPoints=[
  [3,6,0],[-5,4,1],[-10,10,2],[11,-4,3],[-13,-9,0],[7,15,2],
  [-34,3,4],[-36,-9,4],[4,-35,5],[-6,-36,5],[34,3,6],[35,12,6],[-7,35,1],[9,35,2],
];
export const eggPoints=[[-6,12,1],[-14,-8,0],[10,-5,3],[15,10,2],[-33,8,4],[0,-34,5],[33,8,6]];
export function legacyHeight(x,z){
  const r=Math.hypot(x*.95,z);
  if(r>76)return -2;
  if(r>44){
    // New terrain never replaces a cell of the original island.
    const west=Math.hypot((x+56)/15,z/18),north=Math.hypot(x/17,(z+56)/14),east=Math.hypot((x-56)/16,z/19);
    if(Math.min(west,north,east)<1)return Math.min(2,Math.floor((1-Math.min(west,north,east))*8));
    for(const[cx,cz,rad]of [[-18,55,10],[2,63,9],[22,55,10]]){const d=Math.hypot(x-cx,z-cz);if(d<rad)return Math.min(1,Math.floor((rad-d)/2));}
    if((Math.abs(z)<2&&Math.abs(x)<57)||(Math.abs(x)<2&&z<0&&z>-57)||(Math.abs(x+18)<2&&z>0&&z<56))return 0;
    return -2;
  }
  if(r<=26){
    if(r>23)return -1;
    if(x>7&&z<-5){const d=Math.hypot(x-14,z+13);return Math.max(1,Math.floor(9-d*.85));}
    return Math.floor(1+Math.sin(x*.19)*.65+Math.cos(z*.24)*.7);
  }
  if(r>41)return -1;
  const ramp=Math.floor((r-26)/2)-1;
  let h=1;
  if(z<-28)h=Math.floor(2+Math.max(0,1-Math.hypot(x,z+36)/11)*3);
  else if(x<-26)h=Math.sin(x*.37+z*.24)>.7?0:1;
  else h=Math.floor(1.5+Math.sin(x*.2)*.5+Math.cos(z*.2)*.5);
  return Math.min(ramp,h,Math.floor((42-r)/2));
}
export function height(x,z){const old=legacyHeight(x,z);if(old>-2)return old;const outer=frontierHeight(x,z);return outer>-2?outer:raptorPlainHeight(x,z);}
export function biome(x,z){
  const r=Math.hypot(x*.95,z);
  if(legacyHeight(x,z)===-2)return frontierHeight(x,z)===-2&&raptorPlainHeight(x,z)>-2?'🌾 La plaine des raptors':frontierBiome(x,z);
  if(r>44){if(x<-35)return '💎 La grotte de cristal';if(z<-35)return '💦 La vallée des cascades';if(x>35)return '🏛️ Les ruines oubliées';return '🏝️ L’archipel des nids';}
  if(r>26){if(r>40)return '🐚 La grande côte';if(z<-28)return '🪽 Les falaises';if(x<-26)return '🌿 Les marais';if(x>26)return '🌾 La plaine';return '🌴 La forêt du sud';}
  return x>7&&z<-5?'🌋 Le volcan':x<-7&&z<-3?'🌵 Le petit désert':r>21?'🐚 La plage':'🌴 La jungle';
}
export function surface(x,z,h){const b=biome(x,z);return b.includes('enneigées')?(h<1?'ice':'snow'):b.includes('crocs')?(h<1?'sand':h>5?'stone':'dryGrass'):b.includes('grotte')&&h>0?'stone':b.includes('volcan')?(h>7?'lava':'stone'):b.includes('falaises')?'stone':b.includes('désert')||h<1?'sand':b.includes('marais')?'moss':'grass';}
export function compass(yaw){return ['Nord','Nord-est','Est','Sud-est','Sud','Sud-ouest','Ouest','Nord-ouest'][((Math.round(-yaw/(Math.PI/4))%8)+8)%8];}
export const isPredator=index=>[3,4,6,8,9].includes(index);
