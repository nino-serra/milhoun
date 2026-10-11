import assert from 'node:assert/strict';
import {growthScale,normalizeBaby,GROWTH_SECONDS,makeDinosaur} from '../dist/dinosaurs.js';
assert.equal(growthScale(0),.3);assert.equal(growthScale(-10),.3);assert.equal(growthScale(GROWTH_SECONDS),1);assert.equal(growthScale(99999),1);assert.ok(Math.abs(growthScale(GROWTH_SECONDS/2)-.65)<1e-8);
assert.deepEqual(normalizeBaby(2),{index:2,age:0});assert.deepEqual(normalizeBaby({index:1,age:360}),{index:1,age:360});assert.equal(normalizeBaby({index:3,age:99999}).age,GROWTH_SECONDS);
for(let i=0;i<4;i++){const d=makeDinosaur(i,0x88aa66);assert.equal(d.legs.length,i===3?2:4);d.g.updateMatrixWorld(true);d.g.traverse(o=>{if(o.isMesh){assert.ok(o.geometry.attributes.position.count>0);assert.ok(o.matrixWorld.elements.every(Number.isFinite));}});}
console.log('PASS: gradual bounded growth, old saves migrated, adult age restored, all four models and legs valid.');
