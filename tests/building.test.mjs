import assert from 'node:assert/strict';
import {catalog,recipes,craft,spendBlock,placedType,blockTop,itemType,attackable} from '../dist/building.js';
const swordRecipe=recipes.find(r=>r.out==='sword');const bag={wood:3,stone:0};assert.equal(craft(bag,swordRecipe),false);assert.equal(bag.wood,3);bag.wood=4;assert.equal(craft(bag,swordRecipe),true);assert.equal(bag.sword,1);bag.wood=4;assert.equal(craft(bag,swordRecipe),false);assert.equal(bag.wood,4);
const stairs=recipes.find(r=>r.out==='woodStairs');assert.equal(craft(bag,stairs),true);assert.equal(bag.woodStairs,4);for(let i=0;i<4;i++)assert.equal(spendBlock(bag,'woodStairs'),true);assert.equal(spendBlock(bag,'woodStairs'),false);assert.equal(bag.woodStairs,0);assert.equal(spendBlock(bag,'grass'),true);
for(let r=0;r<4;r++){
  const type=placedType('woodStairs',r),b={x:3,y:2,z:5,type};assert.equal(itemType(type),'woodStairs');
  const high=[[3,4.75],[3.25,5],[3,5.25],[2.75,5]][r],low=[[3,5.25],[2.75,5],[3,4.75],[3.25,5]][r];
  assert.equal(blockTop(b,...high),2.5);assert.equal(blockTop(b,...low),2);
  assert.equal(blockTop({...b,type:'slab'},...high),2);
}
assert.equal(blockTop({x:0,y:2,z:0,type:'stone'},0,0),2.5);
for(const c of catalog.filter(c=>c.crafted&&!c.obtained))assert.ok(recipes.some(r=>r.out===c.id));
const pos={x:0,y:2,z:0},d={index:3,g:{position:{x:0,y:1,z:-2}}};assert.ok(attackable(d,pos,0));assert.equal(attackable({...d,tame:true},pos,0),false);assert.equal(attackable({...d,baby:true},pos,0),false);assert.equal(attackable({...d,index:0},pos,0),false);assert.equal(attackable(d,pos,Math.PI),false);assert.equal(attackable({...d,g:{position:{x:0,y:1,z:-6}}},pos,0),false);
const roundTrip=JSON.parse(JSON.stringify({inv:bag,edits:{'3,2,5':'woodStairs2'}}));assert.equal(roundTrip.inv.sword,1);assert.equal(blockTop({x:3,y:2,z:5,type:roundTrip.edits['3,2,5']},3,5.25),2.5);
console.log('PASS: crafting costs, unique sword, finite crafted blocks, four stair orientations, slab height, combat range/direction/friendly protection, save representation.');
