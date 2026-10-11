import assert from 'node:assert/strict';
import * as T from '../dist/vendor/three.module.js';
import {berryPoints,tamingCost,feedDinosaur,pickBerries,regrowBerries} from '../dist/resources.js';
import {levels,creatureSpawns,makeCreature,strikeCreature,swordReach,Encounters} from '../dist/encounters.js';
import {height,species} from '../dist/island.js';
import {recipes} from '../dist/building.js';
assert.equal(recipes.some(r=>r.out==='berries'),false);
for(let index=0;index<species.length;index++){const d={index,feed:0,tame:false},inv={berries:tamingCost(index)};for(let i=1;i<=tamingCost(index);i++){const r=feedDinosaur(d,inv);assert.equal(d.tame,i===tamingCost(index));assert.equal(r.remaining,tamingCost(index)-i);}assert.equal(inv.berries,0);assert.equal(feedDinosaur(d,inv).status,'friend');}
assert.ok(tamingCost(4)>tamingCost(3));assert.ok(tamingCost(1)>tamingCost(0));assert.ok(tamingCost(3)>tamingCost(5));assert.equal(feedDinosaur({index:0,feed:0,tame:false},{berries:0}).status,'empty');
const inv={berries:0},timers=new Map(),leaf={type:'leaf'},b={type:'berry'},blocks=new Map([['b',b]]);assert.equal(pickBerries(leaf,inv,timers,0,'leaf'),false);assert.ok(pickBerries(b,inv,timers,5,'b'));assert.equal(inv.berries,3);assert.equal(pickBerries(b,inv,timers,5,'b'),false);assert.equal(regrowBerries(blocks,timers,64),false);assert.equal(regrowBerries(blocks,timers,65),true);assert.ok(pickBerries(b,inv,timers,66,'b'));assert.equal(inv.berries,6);
for(const[x,z]of berryPoints)assert.ok(height(x,z)>-2);
for(let tier=0;tier<3;tier++){if(tier)assert.ok(levels[tier].hp>levels[tier-1].hp&&levels[tier].loot.gems>levels[tier-1].loot.gems);for(const type of ['snake','spider']){const m=makeCreature(type,tier);assert.equal(m.moving.length,type==='spider'?8:9);m.g.updateMatrixWorld(true);assert.ok(m.g.children.length>0);}const c={hp:levels[tier].hp};for(let hit=1;hit<=levels[tier].hp;hit++)assert.equal(strikeCreature(c,hit),hit===levels[tier].hp?'defeated':'hit');assert.equal(strikeCreature(c,99),false);}
for(const c of creatureSpawns){assert.ok(Math.hypot(c.x,c.z-12)>8);assert.ok(height(c.x,c.z)>-2);}
assert.ok(swordReach(new T.Vector3(0,0,-2),new T.Vector3(0,1.65,0),0));assert.equal(swordReach(new T.Vector3(0,0,2),new T.Vector3(0,1.65,0),0),false);
let gems=0,saves=0;const opts={scene:new T.Scene(),ground:()=>.5,blocked:()=>false,onDamage:()=>{},onReward:l=>gems+=l.gems,onChange:()=>saves++,message:()=>{},sound:()=>{}};
let e=new Encounters(opts),c=e.creatures[0];e.strike(c,1);e.strike(c,2);assert.equal(c.hp,0);assert.ok(c.loot);assert.equal(gems,0);
const persisted=JSON.parse(JSON.stringify(e.serialize(3)));e=new Encounters({...opts,scene:new T.Scene(),saved:persisted});c=e.creatures[0];assert.equal(c.hp,0);assert.ok(c.loot);assert.equal(c.respawnAt,119);e.update(.01,0,new T.Vector3(c.x,2.15,c.z));assert.equal(gems,1);assert.equal(c.loot,null);e.update(.01,.1,new T.Vector3(c.x,2.15,c.z));assert.equal(gems,1);assert.ok(saves>=3);
console.log('PASS: species-specific taming, berry-only harvest and timed regrowth, 3 difficulty tiers, sword rules, saved defeat/chest, no duplicate treasure.');
