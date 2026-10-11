import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import * as T from '../dist/vendor/three.module.js';
import {releaseCompanion,restoredBabyTame} from '../dist/companions.js';
import {activeFriends,hasRoom} from '../dist/ecology.js';
import {normalizePlayer,buyPlayerItem} from '../dist/player.js';
const dinos=Array.from({length:12},(_,i)=>({id:'wild-'+i,tame:true,refuge:false,feed:9,order:'follow',nickname:'Milo',g:{visible:true}}));
assert.equal(hasRoom(dinos),false);const d=dinos[0];assert.equal(releaseCompanion(d),false);assert.equal(activeFriends(dinos),12);
assert.equal(releaseCompanion(d,true),true);assert.equal(hasRoom(dinos),true);assert.equal(dinos.length,12);assert.equal(d.id,'wild-0');assert.equal(d.feed,0);assert.equal(d.nickname,'');assert.equal(releaseCompanion(d,true),false);
const refugee={tame:true,refuge:true,g:{visible:false}};assert.equal(releaseCompanion(refugee,true),true);assert.equal(refugee.refuge,false);assert.equal(refugee.g.visible,true);
assert.equal(restoredBabyTame({}),true);assert.equal(restoredBabyTame(JSON.parse(JSON.stringify({tame:false}))),false);
const state=normalizePlayer(),inv={gems:7};assert.equal(buyPlayerItem(state,inv,'hat'),false);assert.equal(inv.gems,7);assert.equal(buyPlayerItem(state,inv,'cap'),true);assert.equal(inv.gems,1);assert.equal(buyPlayerItem(state,inv,'cap'),false);state.accessory='cap';assert.deepEqual(normalizePlayer(JSON.parse(JSON.stringify(state))),state);assert.equal(normalizePlayer({accessory:'hat',owned:[],color:'bad'}).accessory,'');assert.deepEqual(normalizePlayer(null),normalizePlayer());
console.log('PASS: confirmed release frees capacity without changing spawn indexes, refuge release, old and released baby saves, player purchase costs and normalized save roundtrip.');
// Execute the actual UI handler to cover mounting and a storage failure rollback.
const source=fs.readFileSync(new URL('../dist/game.js',import.meta.url),'utf8');
const handler=source.split('\n').find(l=>l.startsWith("$('confirmRelease').onclick="));
for(const succeeds of [true,false]){
 const actor={id:'baby-2',index:0,tame:true,refuge:false,nickname:'Milo',feed:4,order:'follow',g:{visible:true}},look={skin:'blue'},elements=new Map();
 const context={releaseTarget:actor,releaseCompanion,riding:actor,descending:true,sprint:{until:20},flightBoostUntil:30,pos:new T.Vector3(1,8,2),ground:()=>0,time:3,wardrobe:{looks:{'baby-2':look}},save:()=>succeeds,applyLook:()=>{},toast:()=>{},openFriends:()=>{},$:id=>{if(!elements.has(id))elements.set(id,{close(){this.closed=true;}});return elements.get(id);}};
 vm.createContext(context);vm.runInContext(handler,context);context.$('confirmRelease').onclick();
 assert.equal(actor.tame,!succeeds);assert.equal(context.riding,succeeds?null:actor);assert.equal(context.pos.y,succeeds?1.65:8);assert.equal(context.sprint.until,succeeds?0:20);assert.equal(context.wardrobe.looks['baby-2'],succeeds?undefined:look);assert.equal(context.$('releaseMenu').closed,succeeds?true:undefined);
}
console.log('PASS: actual release UI dismounts safely, preserves cosmetics ownership, and rolls back when storage fails.');
