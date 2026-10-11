import assert from 'node:assert/strict';
import * as T from '../dist/vendor/three.module.js';
import {Ecology,canHunt,hasRoom,setRefuge,activeFriends,ACTIVE_COMPANIONS} from '../dist/ecology.js';
import {height,legacyHeight,species,isPredator} from '../dist/island.js';
import {frontierHeight} from '../dist/frontier.js';
import {raptorSpawns} from '../dist/raptor-habitat.js';
import {makeDinosaur} from '../dist/dinosaurs.js';
import {entries,secretNests,incubate,normalizeExploration} from '../dist/exploration.js';
const actor=(id,index,x=0,tame=false)=>({id,index,tame,homeX:x,homeZ:0,g:new T.Group(),s:{name:species[index].name}});
const predator=actor('hunter',9),prey=actor('prey',10);prey.g.position.x=1;
assert.equal(canHunt(predator,prey),true);assert.equal(canHunt(predator,actor('giant',1)),false);assert.equal(canHunt(predator,{...prey,tame:true}),false);assert.equal(canHunt({...predator,tame:true},prey),false);
const all=[predator,prey],make=(saved={},blocked=false)=>new Ecology({dinos:all,marine:[],ground:()=>.5,plant:()=> '0,0',blocked:()=>blocked,saved,message:()=>{},onChange:()=>{}});
let ecology=make();predator.hunger=80;ecology.update(.25,1,new T.Vector3(50,0,50));assert.equal(prey.foodAbsent,180);assert.equal(predator.hunger,0);assert.equal(ecology.meals,1);
const snapshot=JSON.parse(JSON.stringify(ecology.serialize()));ecology=make(snapshot);assert.equal(prey.foodAbsent,180);ecology.update(181,183,new T.Vector3(0,0,0));assert.ok(prey.foodAbsent>0,'No respawn in front of player');predator.g.position.x=100;ecology.update(1,185,new T.Vector3(50,0,50));assert.equal(prey.foodAbsent,0);
ecology=make({},true);predator.g.position.x=0;predator.hunger=80;ecology.update(.25,1,new T.Vector3(50,0,50));assert.equal(prey.foodAbsent,0,'Walls block hunting');
ecology.plants={};prey.hunger=60;ecology.update(.25,2,new T.Vector3(50,0,50));assert.equal(prey.hunger,0);assert.equal(ecology.plants['0,0'],60);ecology.update(61,63,new T.Vector3(50,0,50));assert.equal(ecology.plants['0,0'],undefined,'Plants renew');
const pets=Array.from({length:ACTIVE_COMPANIONS},(_,i)=>actor('pet'+i,10,0,true));assert.equal(hasRoom(pets),false);assert.equal(setRefuge(pets[0],true,pets),true);assert.equal(activeFriends(pets),11);assert.equal(hasRoom(pets),true);assert.equal(setRefuge(pets[0],false,pets),true);assert.equal(activeFriends(pets),12);const extra=actor('extra',9,0,true);extra.refuge=true;pets.push(extra);assert.equal(setRefuge(extra,false,pets),false);assert.equal(setRefuge(prey,true,pets),false);
const nest=normalizeExploration({incubating:{'nest-raptor':0}});assert.equal(incubate(nest,'nest-raptor',{}),'ready');assert.equal(incubate(nest,'nest-raptor',{}),'ready','Waiting for room does not consume egg');
for(let x=-192;x<=192;x++)for(let z=-192;z<=192;z++){const old=legacyHeight(x,z)>-2?legacyHeight(x,z):frontierHeight(x,z);if(old>-2)assert.equal(height(x,z),old);}
for(const p of raptorSpawns)assert.ok(height(p.x,p.z)>=0);assert.ok(secretNests.some(n=>n.index===9));assert.equal(isPredator(9),true);
for(const i of [9,10]){assert.ok(entries[i]);const m=makeDinosaur(i,species[i].color);assert.equal(m.legs.length,i===9?2:4);m.g.traverse(o=>{if(o.isMesh)assert.ok([...o.geometry.attributes.position.array].every(Number.isFinite));});}
console.log('PASS: food web, protected pets, blocked hunts, saved predation and recovery, regrowing plants, refuge capacity, waiting eggs, unchanged old terrain and new species.');
