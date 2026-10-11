import assert from 'node:assert/strict';
import * as T from '../dist/vendor/three.module.js';
import {treeTooCloseToCamp} from '../dist/camp-clearance.js';
import {createShopBuilding} from '../dist/shop-building.js';
assert.equal(treeTooCloseToCamp(0,0),true);assert.equal(treeTooCloseToCamp(-6,12),true);assert.equal(treeTooCloseToCamp(20,0),true);assert.equal(treeTooCloseToCamp(30,0),false);
globalThis.document={createElement(){return {getContext(){return {fillRect(){},fillText(){}};}};}};
const shop=createShopBuilding({scene:new T.Scene(),x:0,y:0,z:0}),pos=new T.Vector3(0,1.8,0);assert.equal(shop.aimedAt(pos,0,-.1),true);assert.equal(shop.aimedAt(pos,Math.PI,-.1),false);assert.equal(shop.aimedAt(pos,0,-.1,[],true),false);assert.equal(shop.aimedAt(new T.Vector3(0,1.8,4),0,-.1),false);const obstruction=new T.Mesh(new T.BoxGeometry(1,2,.2),new T.MeshBasicMaterial());obstruction.position.set(0,1.5,-.5);obstruction.updateMatrixWorld(true);assert.equal(shop.aimedAt(pos,0,-.1,[obstruction]),false);delete globalThis.document;
console.log('PASS: central generated-tree clearance, seller aim/range/on-foot guards, facing away and obstacle rejection.');
