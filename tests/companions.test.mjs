import assert from 'node:assert/strict';
import {claimMission,fillFeeder,penCells,insidePen,blockedByFence} from '../dist/companions.js';
const inv={berries:2,gems:0};assert.equal(fillFeeder(5,inv),1);assert.equal(inv.berries,1);assert.equal(fillFeeder(6,inv),0);
const state={done:{friend:true},claimed:{}};assert.equal(claimMission(state,'friend',inv),true);assert.equal(claimMission(JSON.parse(JSON.stringify(state)),'friend',inv),false);assert.equal(inv.gems,3);assert.equal(claimMission(state,'home',inv),false);
const cells=penCells(0,0);assert.equal(cells.length,24);assert.equal(cells.filter(c=>c.type==='gate').length,1);assert.equal(insidePen({x:2,z:2},{x:0,z:0}),true);assert.equal(insidePen({x:3,z:2},{x:0,z:0}),false);
const key=(x,y,z)=>[x,y,z].join(',');const blocks=new Map([['0,2,3',{type:'gate',y:2}]]);assert.equal(blockedByFence(blocks,key,0,3,1.5),true);blocks.get('0,2,3').type='gateOpen';assert.equal(blockedByFence(blocks,key,0,3,1.5),false);
console.log('PASS: feeder capacity and cost, persistent one-time mission rewards, enclosure boundary and open gate collision.');
