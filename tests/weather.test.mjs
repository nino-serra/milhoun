import assert from 'node:assert/strict';
import {climateAt,DAY_SECONDS,SEASON_SECONDS,equipmentState,jumpSpeed,ironVeins,makeWeather} from '../dist/weather.js';
import {height,biome} from '../dist/island.js';
import {craft,recipes} from '../dist/building.js';
import * as T from '../dist/vendor/three.module.js';
assert.equal(climateAt(120).daylight,1);assert.equal(climateAt(360).night,true);
assert.equal(climateAt(120).wet,true);assert.equal(climateAt(200).wet,false);
assert.equal(climateAt(DAY_SECONDS*8).season.name,'Printemps');
assert.deepEqual([0,1,2,3].map(i=>climateAt(i*SEASON_SECONDS).season.name),['Printemps','Été','Automne','Hiver']);
assert.deepEqual(equipmentState({torch:true,springs:true},{}),{torch:false,springs:false});
const inv={wood:4,stone:1,iron:3};assert.equal(craft(inv,recipes.find(r=>r.out==='springs')),false);assert.equal(inv.wood,4);inv.iron++;
assert.equal(craft(inv,recipes.find(r=>r.out==='springs')),true);assert.equal(inv.iron,0);assert.equal(craft(inv,recipes.find(r=>r.out==='torch')),true);assert.equal(craft(inv,recipes.find(r=>r.out==='torch')),false);
assert.equal(jumpSpeed({springs:true},inv),10);assert.equal(jumpSpeed({springs:true},inv,true),6);assert.equal(jumpSpeed({springs:false},inv),6);
assert.equal(ironVeins.length,12);for(const[x,z]of ironVeins){assert.ok(height(x,z)>0);assert.ok(biome(x,z).includes('enneigées'));}
const scene=new T.Scene();scene.background=new T.Color();scene.fog=new T.Fog(0,10,100);const camera=new T.PerspectiveCamera(),hemi=new T.HemisphereLight(),sun=new T.DirectionalLight(),mats={grass:new T.MeshLambertMaterial(),leaf:new T.MeshLambertMaterial()};const w=makeWeather(scene,camera,hemi,sun,mats),pos=new T.Vector3();
assert.equal(w.update(120,pos,{},inv,'jungle').raining,true);assert.equal(w.update(120,pos,{},inv,'jungle',true).raining,false);assert.equal(w.update(120,pos,{},inv,'désert').raining,false);assert.equal(w.update(3*SEASON_SECONDS+120,pos,{},inv,'jungle').snow,true);
w.update(360,pos,{torch:true},inv,'jungle');assert.ok(camera.children[0].visible);assert.ok(camera.children[0].children.some(c=>c.isPointLight&&c.intensity>0));w.update(360,pos,{torch:false},inv,'jungle');assert.equal(camera.children[0].visible,false);
console.log('PASS: seasons, daylight, precipitation, shelter, iron locations, crafting and equipped jump/torch.');
