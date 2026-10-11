import assert from 'node:assert/strict';
import {normalizeMilo,currentMilo,claimMilo} from '../dist/milo.js';
import {catalog,recipes,craft,spendBlock} from '../dist/building.js';
const state=normalizeMilo({claimed:['bad','bad']}),inv={wood:8,berries:6,gems:0},p={furniture:[],friends:0,visited:{}};
assert.equal(claimMilo(state,inv,p,()=>false),false);assert.deepEqual(inv,{wood:8,berries:6,gems:0});assert.deepEqual(state.claimed,[]);
assert.equal(claimMilo(state,inv,p),true);assert.equal(inv.gems,8);assert.equal(inv.wood,0);assert.equal(claimMilo(state,inv,p),false);
p.furniture=['bench','table'];assert.equal(claimMilo(state,inv,p),true);assert.equal(inv.gems,20);p.friends=2;assert.equal(claimMilo(state,inv,p),true);p.visited.africa=true;assert.equal(claimMilo(state,inv,p),true);p.treasure=true;assert.equal(claimMilo(state,inv,p),true);assert.equal(inv.gems,65);assert.equal(currentMilo(state),undefined);assert.equal(claimMilo(state,inv,p),false);assert.deepEqual(normalizeMilo(JSON.parse(JSON.stringify(state))),state);
for(const id of ['bench','table','stool','planter']){assert.ok(catalog.find(c=>c.id===id));const r=recipes.find(r=>r.out===id),bag={wood:10,berries:4};assert.ok(craft(bag,r));assert.ok(spendBlock(bag,id));assert.equal(spendBlock(bag,id),false);}
console.log('PASS Milo progression, no duplicate rewards, rollback on storage failure, legacy save, furniture crafting.');
