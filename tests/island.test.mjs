import assert from 'node:assert/strict';
import {height,biome,surface,spawnPoints,eggPoints,species,ISLAND_RADIUS,WORLD_EXTENT,isPredator,compass} from '../dist/island.js';
import {makeDinosaur,normalizeBaby,growthScale} from '../dist/dinosaurs.js';
import {attackable} from '../dist/building.js';
const oldHeight=(x,z)=>{const r=Math.hypot(x*.95,z);if(r>26)return-2;if(r>23)return-1;if(x>7&&z<-5){const d=Math.hypot(x-14,z+13);return Math.max(1,Math.floor(9-d*.85));}return Math.floor(1+Math.sin(x*.19)*.65+Math.cos(z*.24)*.7);};
let oldCells=0,newCells=0;
for(let x=-WORLD_EXTENT;x<=WORLD_EXTENT;x++)for(let z=-WORLD_EXTENT;z<=WORLD_EXTENT;z++){
  const h=height(x,z);assert.ok(Number.isInteger(h));if(h>-2)newCells++;
  if(oldHeight(x,z)>-2){oldCells++;assert.equal(h,oldHeight(x,z),'Old terrain changed at '+x+','+z);const b=x>7&&z<-5?'volcan':x<-7&&z<-3?'désert':Math.hypot(x*.95,z)>21?'plage':'jungle';const oldSurface=b==='volcan'?(h>7?'lava':'stone'):b==='désert'||h<1?'sand':'grass';assert.equal(surface(x,z,h),oldSurface);}
}
assert.ok(newCells>oldCells*2.5);assert.equal(height(300,300),-2);
assert.deepEqual(spawnPoints.slice(0,6),[[3,6,0],[-5,4,1],[-10,10,2],[11,-4,3],[-13,-9,0],[7,15,2]]);
assert.equal(new Set(eggPoints.map(p=>p[2])).size,7);
for(const[x,z,i]of [...spawnPoints,...eggPoints]){assert.ok(height(x,z)>=(i>=4?0:-1));assert.ok(Math.hypot(x*.95,z)<ISLAND_RADIUS);assert.ok(species[i]);}
for(let i=0;i<7;i++){const model=makeDinosaur(i,species[i].color);assert.equal(model.wings.length,i===5?2:0);assert.equal(model.legs.length,[3,4,5,6].includes(i)?2:4);model.g.updateMatrixWorld(true);model.g.traverse(o=>{if(o.isMesh){assert.ok(o.matrixWorld.elements.every(Number.isFinite));assert.ok([...o.geometry.attributes.position.array].every(Number.isFinite));}});const baby=normalizeBaby({index:i,age:360});assert.equal(baby.index,i);assert.ok(growthScale(baby.age)<1);}
assert.ok(biome(-34,3).includes('marais'));assert.ok(biome(4,-35).includes('falaises'));assert.ok(biome(34,3).includes('plaine'));
assert.equal(compass(0),'Nord');assert.equal(compass(-Math.PI/2),'Est');assert.equal(compass(Math.PI/2),'Ouest');
for(const index of [4,6]){assert.ok(isPredator(index));assert.ok(attackable({index,g:{position:{x:0,y:1,z:-2}}},{x:0,y:2,z:0},0));}assert.equal(isPredator(5),false);
console.log('PASS: old island preserved, stable saves/spawns, all 7 eggs accessible, 7 valid models, flight wings, predator rules, compass. Surface cells: '+oldCells+' → '+newCells);

