import assert from 'node:assert/strict';
import * as T from '../dist/vendor/three.module.js';
import {height} from '../dist/island.js';
import {MarineWorld,seabed,diveZone,swimHeight,SEA_LEVEL,normalizeMarine,claimMarineTreasure,marineSpecies} from '../dist/marine.js';
assert.equal(seabed(0,15),null);assert.equal(diveZone(2,63),null);assert.ok(seabed(0,50)<-5);assert.ok(seabed(18,75)<-5);
for(let x=-15;x<35;x++)for(let z=39;z<87;z++)if(height(x,z)>-2)assert.equal(seabed(x,z),null,'Never replace land or buildings');
let y=.4;for(let i=0;i<300;i++)y=swimHeight(y,-8,true,.02);assert.ok(y>=-6.96&&y<-6.8);for(let i=0;i<300;i++)y=swimHeight(y,-8,false,.02);assert.ok(Math.abs(y-(SEA_LEVEL+1.2))<.01);
const inv={gems:0},state=normalizeMarine(),chest=new T.Vector3(18,-7,75);assert.equal(claimMarineTreasure(state,inv,new T.Vector3(18,0,75),chest),false);assert.equal(claimMarineTreasure(state,inv,new T.Vector3(18,-6,75),chest),true);assert.equal(claimMarineTreasure(normalizeMarine(JSON.parse(JSON.stringify(state))),inv,new T.Vector3(18,-6,75),chest),false);assert.equal(inv.gems,25);
let damage=0;const create=saved=>new MarineWorld({scene:new T.Scene(),ground:(x,z)=>(seabed(x,z)??-2)+.5,saved,onChange:()=>{},onDamage:()=>damage++,message:()=>{},sound:()=>{},inv:{gems:0},blocked:()=>false});const world=create();
for(const a of world.animals){assert.ok(diveZone(a.x,a.z));a.g.traverse(o=>{if(o.isMesh)assert.ok([...o.geometry.attributes.position.array].every(Number.isFinite));});}
assert.equal(world.animals.filter(a=>marineSpecies[a.kind].hp>0).length,2);
const croc=world.animals.find(a=>a.kind==='croc'),p=croc.g.position.clone().add(new T.Vector3(0,0,1));assert.equal(world.target(p,0),croc);world.update(.02,0,new T.Vector3(p.x,1,p.z),false);assert.equal(damage,0);
for(let i=0;i<3;i++)world.strike(croc,i);assert.equal(croc.retreat,90);const restored=create(JSON.parse(JSON.stringify(world.serialize())));assert.equal(restored.animals.find(a=>a.kind==='croc').retreat,90);assert.equal(world.target(p,0),undefined);
console.log('PASS: water-only seabeds, safe descent/ascent, single saved marine treasure, marine models and predator retreat persistence.');
