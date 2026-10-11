import assert from 'node:assert/strict';
import {adventures,normalizeExpeditions,startAdventure,advanceAdventure} from '../dist/expeditions.js';
let state=normalizeExpeditions(),inv={gems:5},wardrobe={owned:[]};
for(const a of adventures){assert.ok(startAdventure(state,a.id));assert.equal(startAdventure(state,'baby'),false);for(let i=0;i<a.steps.length;i++){state=normalizeExpeditions(JSON.parse(JSON.stringify(state)));const r=advanceAdventure(state,inv,wardrobe);assert.equal(r.complete,i===a.steps.length-1);}assert.equal(startAdventure(state,a.id),false);assert.equal(advanceAdventure(state,inv,wardrobe),null);}
assert.equal(inv.gems,35);assert.deepEqual(wardrobe.owned,['explorer']);assert.equal(state.done.length,3);assert.equal(normalizeExpeditions({active:{id:'fake',step:100}}).active,null);assert.equal(normalizeExpeditions({active:{id:'egg',step:100}}).active.step,3);
console.log('PASS: saved progress, sequential steps, one reward per adventure, three medals unlock one accessory, invalid saved adventure.');
