import assert from 'node:assert/strict';
import {IslandSound} from '../dist/sound.js';
const param=()=>({value:0,setValueAtTime(v){assert.ok(Number.isFinite(v));},exponentialRampToValueAtTime(v){assert.ok(v>0&&Number.isFinite(v));},setTargetAtTime(v){assert.ok(Number.isFinite(v));}});
function node(){return{gain:param(),frequency:param(),Q:param(),threshold:param(),ratio:param(),connect(){},disconnect(){},start(){},stop(time){if(time===undefined)this.onended?.();}};}
class Context{constructor(){this.sampleRate=8000;this.currentTime=0;this.state='running';this.destination={};}createGain(){return node();}createDynamicsCompressor(){return node();}createOscillator(){return node();}createBiquadFilter(){return node();}createBufferSource(){return node();}createBuffer(n,length){return{getChannelData:()=>new Float32Array(length)};}resume(){this.state='running';return Promise.resolve();}suspend(){this.state='suspended';return Promise.resolve();}}
globalThis.AudioContext=Context;
const s=new IslandSound();s.setActive(true);
for(const effect of ['start','home','hatch','friend','feed','mount','craft','jump','hurt','scare','place','break']){s.clear();s.play(effect);assert.ok(s.voices.size>0,effect);assert.ok(s.voices.size<=33);}
for(let index=0;index<7;index++){s.clear();s.dino(index);assert.ok(s.voices.size>0);s.clear();s.play('hatch',index);assert.ok(s.voices.size>0);}
s.configure({muted:true});assert.equal(s.voices.size,0);s.play('hatch');assert.equal(s.voices.size,0);
s.configure({muted:false});s.tick({time:1,moving:true,grounded:true,region:'La plage',near:{index:2},mounted:false});assert.ok(s.wind);s.setActive(false);assert.equal(s.voices.size,0);assert.equal(s.ctx.state,'suspended');s.tick({time:3,moving:true,grounded:true,region:'La plage'});assert.equal(s.voices.size,0);
s.setActive(true);s.configure({music:false,volume:.3});s.tick({time:8,moving:false,grounded:true,region:'Le désert'});assert.equal(s.voices.size,1,'Only ambient loop when music off');s.configure({volume:5});assert.equal(s.volume,1);s.configure({volume:-1});assert.equal(s.volume,0);s.setActive(false);
delete globalThis.AudioContext;const silent=new IslandSound();assert.doesNotThrow(()=>{silent.setActive(true);silent.play('start');silent.tick({time:1,region:'La jungle'});});
console.log('PASS: effects, mute, pause, resume, ambient-only, volume bounds, audio unavailable.');

