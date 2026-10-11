import * as T from './vendor/three.module.js';
export const levels=[
  {name:'Facile',icon:'🟢',color:0x79b84f,hp:2,damage:1,speed:.7,loot:{gems:1,wood:2,stone:0}},
  {name:'Moyen',icon:'🟠',color:0xe5a040,hp:4,damage:1,speed:1.05,loot:{gems:3,wood:0,stone:3}},
  {name:'Costaud',icon:'🟣',color:0xa876c7,hp:6,damage:2,speed:1.3,loot:{gems:5,wood:3,stone:3}},
];
export const creatureSpawns=[
  {id:'spider-green',type:'spider',tier:0,x:9,z:22},
  {id:'snake-green',type:'snake',tier:0,x:-12,z:18},
  {id:'spider-orange',type:'spider',tier:1,x:-18,z:-5},
  {id:'snake-orange',type:'snake',tier:1,x:20,z:18},
  {id:'snake-purple',type:'snake',tier:2,x:-32,z:-5},
  {id:'spider-purple',type:'spider',tier:2,x:31,z:-15},
];
export function swordReach(point,pos,yaw,range=3.5){const dx=point.x-pos.x,dz=point.z-pos.z,dist=Math.hypot(dx,dz);return dist<=range&&Math.abs(point.y+.7-pos.y)<2.7&&(dist<.1||(-Math.sin(yaw)*dx-Math.cos(yaw)*dz)/dist>.45);}
export function strikeCreature(c,time){
  if(c.hp<=0||time<(c.hitUntil||0))return false;
  c.hp=Math.max(0,c.hp-1);c.hitUntil=time+.3;
  if(c.hp===0){c.respawnAt=time+120;return 'defeated';}return 'hit';
}
const sphere=new T.SphereGeometry(1,8,6),rod=new T.CylinderGeometry(1,1,1,5),box=new T.BoxGeometry(1,1,1);
function mesh(g,geo,material,p,s){const m=new T.Mesh(geo,material);m.position.set(...p);m.scale.set(...s);g.add(m);return m;}
function segment(g,material,a,b,r){const delta=new T.Vector3(...b).sub(new T.Vector3(...a));const m=mesh(g,rod,material,new T.Vector3(...a).add(new T.Vector3(...b)).multiplyScalar(.5).toArray(),[r,delta.length(),r]);m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),delta.normalize());return m;}
export function makeCreature(type,tier){
  const g=new T.Group(),moving=[],body=new T.MeshLambertMaterial({color:levels[tier].color,flatShading:true}),dark=new T.MeshLambertMaterial({color:0x33483a}),white=new T.MeshLambertMaterial({color:0xfff5d6});
  if(type==='spider'){
    mesh(g,sphere,body,[0,.55,.35],[.57,.43,.7]);mesh(g,sphere,body,[0,.48,-.4],[.4,.33,.4]);
    for(const side of [-1,1])for(let i=0;i<4;i++){const leg=new T.Group();leg.position.set(side*.25,.48,-.5+i*.3);const joint=[side*(.85+Math.sin(i)*.13),.23,(i-1.5)*.18],end=[side*(1.2+Math.sin(i)*.13),-.43,(i-1.5)*.3];segment(leg,body,[0,0,0],joint,.07);segment(leg,body,joint,end,.055);g.add(leg);moving.push(leg);}
    for(const x of [-.16,.16]){mesh(g,sphere,white,[x,.59,-.74],[.12,.13,.07]);mesh(g,sphere,dark,[x,.59,-.79],[.06,.08,.03]);}
  }else{
    for(let i=0;i<9;i++){const r=.24*(1-i*.055);moving.push(mesh(g,sphere,body,[Math.sin(i*.8)*.16,.24,i*.24],[r,r,.3]));}
    mesh(g,sphere,body,[0,.42,-.22],[.33,.31,.44]);for(const x of [-.19,.19]){mesh(g,sphere,white,[x,.56,-.51],[.095,.1,.065]);mesh(g,sphere,dark,[x,.56,-.56],[.045,.065,.03]);}
    mesh(g,box,dark,[0,.34,-.68],[.15,.035,.03]);
  }
  g.scale.setScalar(1+tier*.15);return {g,moving};
}
function makeChest(){const g=new T.Group(),gold=new T.MeshLambertMaterial({color:0xf6c94c}),wood=new T.MeshLambertMaterial({color:0xa26f3d});mesh(g,box,wood,[0,.28,0],[.65,.46,.48]);mesh(g,box,gold,[0,.53,0],[.68,.12,.52]);for(const x of [-.2,.2])mesh(g,box,gold,[x,.27,0],[.07,.49,.5]);mesh(g,box,gold,[0,.3,-.255],[.13,.14,.045]);return g;}
export class Encounters{
  constructor({scene,ground,blocked,onDamage,onReward,onChange,message,sound,saved=[]}){
    Object.assign(this,{scene,ground,blocked,onDamage,onReward,onChange,message,sound});
    this.creatures=creatureSpawns.map(spec=>{const old=saved.find(c=>c.id===spec.id),model=makeCreature(spec.type,spec.tier),c={...spec,...model,hp:levels[spec.tier].hp,hitUntil:0,respawnAt:0,loot:null};c.g.position.set(spec.x,ground(spec.x,spec.z,true),spec.z);if(old){c.hp=Math.max(0,Math.min(c.hp,Number(old.hp)));if(!Number.isFinite(c.hp))c.hp=levels[spec.tier].hp;c.respawnAt=Math.max(0,Number(old.remaining)||0);if(old.loot&&[old.loot.x,old.loot.y,old.loot.z].every(Number.isFinite))this.drop(c,old.loot);}c.g.visible=c.hp>0;scene.add(c.g);return c;});
  }
  drop(c,p){const g=makeChest();g.position.set(p.x,p.y,p.z);this.scene.add(g);c.loot=g;}
  target(pos,yaw){return this.creatures.filter(c=>c.hp>0&&swordReach(c.g.position,pos,yaw)).sort((a,b)=>a.g.position.distanceTo(pos)-b.g.position.distanceTo(pos))[0];}
  strike(c,time){const result=strikeCreature(c,time);if(!result)return;this.sound('hit');if(result==='defeated'){c.g.visible=false;this.drop(c,c.g.position);this.sound('victory');this.message('Vaincu ! Approche-toi du coffre pour récupérer ton trésor ✨');}else this.message((c.type==='spider'?'Araignée':'Serpent')+' '+levels[c.tier].icon+' — '+c.hp+' / '+levels[c.tier].hp+' ♥');this.onChange();}
  nearest(pos){let best=null,distance=6;for(const c of this.creatures){const d=Math.hypot(c.g.position.x-pos.x,c.g.position.z-pos.z);if(c.hp>0&&d<distance){best=c;distance=d;}}return best;}
  label(c){const l=levels[c.tier];return (c.type==='spider'?'🕷️ Araignée géante':'🐍 Serpent')+' · '+l.icon+' '+l.name+' · '+c.hp+'/'+l.hp+' ♥';}
  update(dt,time,pos){
    const campSafe=Math.hypot(pos.x,pos.z-12)<7;
    for(const c of this.creatures){
      if(c.loot){c.loot.rotation.y+=dt*.5;if(Math.hypot(c.loot.position.x-pos.x,c.loot.position.z-pos.z)<1.8&&Math.abs(c.loot.position.y+.7-pos.y)<2.3){this.scene.remove(c.loot);c.loot.traverse(o=>{if(o.isMesh)o.material.dispose();});c.loot=null;this.onReward({...levels[c.tier].loot});this.sound('treasure');this.onChange();}}
      const distance=Math.hypot(c.g.position.x-pos.x,c.g.position.z-pos.z);
      if(c.hp<=0){if(time>=c.respawnAt&&!c.loot&&Math.hypot(c.x-pos.x,c.z-pos.z)>8){c.hp=levels[c.tier].hp;c.g.visible=true;c.g.position.set(c.x,this.ground(c.x,c.z,true),c.z);this.onChange();}continue;}
      const pursue=!campSafe&&distance<7,angle=pursue?Math.atan2(pos.x-c.g.position.x,pos.z-c.g.position.z):Math.atan2(c.x-c.g.position.x,c.z-c.g.position.z),speed=pursue?levels[c.tier].speed:.4;
      const walking=time>=c.hitUntil&&(pursue||Math.hypot(c.x-c.g.position.x,c.z-c.g.position.z)>1);
      if(walking){const x=c.g.position.x+Math.sin(angle)*speed*dt,z=c.g.position.z+Math.cos(angle)*speed*dt,y=this.ground(x,z,true);if(Math.hypot(x,z-12)>6&&y>=-.5&&Math.abs(y-c.g.position.y)<.7&&!this.blocked(c.g.position,new T.Vector3(x,y,z))){c.g.position.set(x,y,z);c.g.rotation.y=angle+Math.PI;}}
      if(pursue&&time>=c.hitUntil&&distance<1.5&&Math.abs(c.g.position.y+.7-pos.y)<2&&!this.blocked(c.g.position,pos))this.onDamage(levels[c.tier].damage);
      c.moving.forEach((part,i)=>{if(c.type==='spider')part.rotation.y=walking?Math.sin(time*7+i)*.2:0;else part.position.x=Math.sin(time*4-i*.7)*.14;});
      c.g.scale.setScalar((1+c.tier*.15)*(time<c.hitUntil?.94:1));
    }
  }
  serialize(time){return this.creatures.map(c=>({id:c.id,hp:c.hp,remaining:Math.max(0,c.respawnAt-time),loot:c.loot?{x:c.loot.position.x,y:c.loot.position.y,z:c.loot.position.z}:null}));}
}
