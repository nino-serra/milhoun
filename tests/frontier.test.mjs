import assert from 'node:assert/strict';
import {height,legacyHeight,biome,surface,species,ISLAND_RADIUS,WORLD_EXTENT,isPredator} from '../dist/island.js';
import {regionalSpawns,frontierBerries,frontierLandmarks,frontierTreasures,companionRecord,MAX_BUILD_HEIGHT} from '../dist/frontier.js';
import {makeDinosaur} from '../dist/dinosaurs.js';
import {feedDinosaur,tamingCost} from '../dist/resources.js';
import {entries} from '../dist/exploration.js';
let original=0,current=0,maximum=0;
for(let x=-WORLD_EXTENT;x<=WORLD_EXTENT;x++)for(let z=-WORLD_EXTENT;z<=WORLD_EXTENT;z++){const old=legacyHeight(x,z),h=height(x,z);if(old>-2){original++;assert.equal(h,old,'Existing column changed');}if(h>-2)current++;maximum=Math.max(maximum,h);assert.ok(h<MAX_BUILD_HEIGHT);}
assert.ok(current>original*6);assert.ok(maximum>=27);assert.equal(surface(-30,-105,height(-30,-105)),'snow');assert.ok(biome(111,38).includes('crocs'));
for(const p of [...regionalSpawns,...frontierLandmarks,...frontierTreasures,...frontierBerries.map(([x,z])=>({x,z}))]){assert.ok(height(p.x,p.z)>=0,JSON.stringify(p));assert.ok(Math.hypot(p.x*.95,p.z)<ISLAND_RADIUS);}
for(const i of [7,8]){const d=makeDinosaur(i,species[i].color);assert.equal(d.legs.length,4);assert.equal(d.wings.length,0);assert.ok(entries[i]);assert.ok(species[i].mammal);d.g.updateMatrixWorld(true);d.g.traverse(o=>{if(o.isMesh)assert.ok(o.matrixWorld.elements.every(Number.isFinite));});const animal={index:i,feed:0,tame:false},bag={berries:tamingCost(i)};for(let n=0;n<tamingCost(i);n++)feedDinosaur(animal,bag);assert.equal(animal.tame,true);assert.equal(bag.berries,0);}
assert.equal(isPredator(7),false);assert.equal(isPredator(8),true);
assert.equal(companionRecord({companions:[{nickname:'Ancien bébé'}]},{id:'baby-0'},0).nickname,'Ancien bébé');assert.equal(companionRecord({companionState:{'baby-0':{nickname:'Milo'}},companions:[{nickname:'Incorrect'}]},{id:'baby-0'},18).nickname,'Milo');
console.log('PASS: '+original+' old terrain columns unchanged; '+current+' total columns; summit '+maximum+'; accessible regions, nine species, mammal taming, stable companion IDs.');
