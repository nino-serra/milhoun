import * as T from './vendor/three.module.js';
import {frontierBiome,regionalSpawns,frontierBerries,frontierTreasures} from './frontier.js';
import {height,legacyHeight} from './island.js';
export function addFrontierScenery(add){
 // Coordinate hashing keeps foliage reproducible and independent of old-world RNG.
 const hash=(x,z)=>{let n=Math.imul(x+900,374761393)^Math.imul(z+900,668265263);n=Math.imul(n^(n>>>13),1274126177);return(n^(n>>>16))>>>0;};
 const protectedSpots=[...regionalSpawns,...frontierTreasures,...frontierBerries.map(([x,z])=>({x,z}))];
 for(let x=-165;x<=165;x+=9)for(let z=-168;z<=165;z+=9){const h=height(x,z);if(h<1||legacyHeight(x,z)>-2||protectedSpots.some(p=>Math.hypot(p.x-x,p.z-z)<5))continue;const n=hash(x,z),b=frontierBiome(x,z);
  if(b.includes('enneigées')){if(h>23||n%3)continue;for(let y=1;y<=4;y++)add(x,h+y,z,'wood');for(let y=3;y<=6;y++){const r=Math.max(0,5-y);for(let a=-r;a<=r;a++)for(let c=-r;c<=r;c++)if(Math.abs(a)+Math.abs(c)<=r+1)add(x+a,h+y,z+c,y===6?'snow':'pine');}add(x,h+7,z,'snow');}
  else if(b.includes('jungle')||b.includes('marais')||b.includes('archipel')||b.includes('cascades')){if(n%3===0)continue;for(let y=1;y<=4;y++)add(x,h+y,z,'wood');for(let a=-2;a<=2;a++)for(let c=-2;c<=2;c++)if(Math.abs(a)+Math.abs(c)<4){add(x+a,h+4,z+c,'leaf');if(Math.abs(a)+Math.abs(c)<2)add(x+a,h+5,z+c,'leaf');}}
  else if(b.includes('crocs')){if(n%4===0){for(let y=1;y<=3;y++)add(x,h+y,z,'wood');for(let a=-2;a<=2;a++)for(let c=-1;c<=1;c++)add(x+a,h+4,z+c,'leaf');}else if(n%5===0)for(let a=-1;a<=1;a++)for(let y=1;y<=2;y++)add(x+a,h+y,z,'stone');}
  else if(b.includes('ruines')&&n%5===0){for(let y=1;y<=3+(n%3);y++)add(x,h+y,z,'moss');}
  else if(b.includes('cristal')&&n%4===0){for(let y=1;y<=2+n%3;y++)add(x,h+y,z,'ice');}
 }
}
export function makeSnow(scene){const count=150,positions=new Float32Array(count*3);for(let i=0;i<count;i++){positions[i*3]=((i*17)%41)-20;positions[i*3+1]=(i*11)%20;positions[i*3+2]=((i*23)%41)-20;}const geo=new T.BufferGeometry();geo.setAttribute('position',new T.BufferAttribute(positions,3));const snow=new T.Points(geo,new T.PointsMaterial({color:0xffffff,size:.11,transparent:true,opacity:.85,depthWrite:false}));snow.frustumCulled=false;snow.visible=false;scene.add(snow);return{update(dt,pos,active){snow.visible=active;if(!active)return;snow.position.copy(pos);for(let i=0;i<count;i++){positions[i*3+1]-=dt*(1+(i%4)*.2);if(positions[i*3+1]<-3)positions[i*3+1]=17;}geo.attributes.position.needsUpdate=true;}};}
