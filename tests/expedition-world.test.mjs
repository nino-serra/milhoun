import assert from 'node:assert/strict';
import * as T from '../dist/vendor/three.module.js';
import {createExpeditions} from '../dist/expedition-view.js';
import {adventures,normalizeExpeditions,startAdventure} from '../dist/expeditions.js';
import {height} from '../dist/island.js';
const nodes=new Map();globalThis.document={getElementById(id){if(!nodes.has(id))nodes.set(id,{style:{},hidden:false});return nodes.get(id);}};
const state=normalizeExpeditions(),inv={gems:0},wardrobe={owned:[]},scene=new T.Scene();let blocked=false,saves=0;
const world=createExpeditions({state,inv,wardrobe,scene,ground:height,clearGround:height,blocked:()=>blocked,save:()=>saves++,resume(){},message(){},sound(){}});
const marker=scene.children[0];
for(const a of adventures){startAdventure(state,a.id);for(let i=0;i<a.steps.length;i++){world.update(.02,1,new T.Vector3(0,4,15),0);const pos=marker.position.clone();pos.y+=1.5;assert.equal(world.act(new T.Vector3(100,100,100)),false,'Distant targets cannot be collected');blocked=true;assert.equal(world.act(pos),false,'Cannot collect through terrain');blocked=false;if(a.id==='baby'&&i>0){document.getElementById('expeditionRecall').onclick();world.update(.02,2,pos,0);}assert.equal(world.act(pos),true);assert.equal(state.active?.step,i===a.steps.length-1?undefined:i+1);}}
assert.equal(inv.gems,30);assert.equal(saves,11);assert.deepEqual(wardrobe.owned,['explorer']);assert.equal(marker.visible,false);
console.log('PASS: all three world adventures, range and obstacle guards, escort recall, rewards and hidden completed markers.');
