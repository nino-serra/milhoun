import * as T from './vendor/three.module.js';
import {makeDinosaur} from './dinosaurs.js';
const cube=new T.BoxGeometry(1,1,1),round=new T.SphereGeometry(1,8,6),materials=new Map();
function mat(color){if(!materials.has(color))materials.set(color,new T.MeshLambertMaterial({color,flatShading:true}));return materials.get(color);}
export function block(group,x,y,z,w,h,d,color){const m=new T.Mesh(cube,mat(color));m.position.set(x,y,z);m.scale.set(w,h,d);group.add(m);return m;}
function oval(group,x,y,z,w,h,d,color){const m=new T.Mesh(round,mat(color));m.position.set(x,y,z);m.scale.set(w,h,d);group.add(m);return m;}
export function makeJourneyAnimal(kind,color){if(kind==='fire'){const{g}=makeDinosaur(3,color);for(let i=0;i<5;i++){const m=new T.Mesh(new T.ConeGeometry(.15,.45,5),mat(0xe4b547));m.position.set(0,2.1-i*.08,i*.35);g.add(m);}return g;}
 const g=new T.Group(),elephant=kind==='elephant',giraffe=kind==='giraffe',lion=kind==='lion',h=elephant?1.8:giraffe?1.7:1.05,w=elephant?.9:.45,length=elephant?1.4:1;
 oval(g,0,h,0,w,elephant?.9:.5,length,color);
 for(const x of [-w*.65,w*.65])for(const z of [-length*.65,length*.65])block(g,x,h/2,z,elephant?.35:.16,h,.2,color);
 const headY=giraffe?3.9:elephant?2:1.35,headZ=giraffe?-.9:-length-.15;
 if(giraffe){const neck=block(g,0,2.6,-.7,.26,2.2,.32,color);neck.rotation.x=-.18;for(let i=0;i<8;i++)for(const side of [-1,1])block(g,side*.44,1.4+(i%3)*.2,-.75+Math.floor(i/3)*.5,.025,.19,.23,0x885c39);}
 if(lion)oval(g,0,1.37,-1.05,.6,.65,.4,0x876540);
 oval(g,0,headY,headZ,elephant?.65:.32,elephant?.65:.34,elephant?.55:.38,color);
 for(const x of [-1,1]){oval(g,x*(elephant?.38:.19),headY+.1,headZ-.3,.055,.07,.04,0x233c34);block(g,x*.22,headY+.3,headZ,.13,.2,.12,color);}
 if(elephant){for(const x of [-1,1])oval(g,x*.7,2,-1.05,.4,.65,.12,color);for(let i=0;i<5;i++)oval(g,0,1.8-i*.3,-1.9-i*.08,.18-i*.02,.25,.16,color);for(const x of [-.35,.35])block(g,x,1.5,-1.85,.09,.08,.7,0xffedc8);}
 if(kind==='zebra'){for(let i=0;i<9;i++)for(const side of [-1,1])block(g,side*.43,1.07,-.85+i*.2,.035,.8,.08,0x38403a);for(let i=0;i<5;i++)block(g,0,1.6,-.7+i*.3,.1,.17,.15,0x38403a);}
 if(lion)block(g,0,1.1,1.3,.1,.1,.8,color);return g;
}
export function makeBoat(){const g=new T.Group();block(g,0,.35,0,2.4,.55,4.5,0x956139);for(const x of [-1.15,1.15])block(g,x,.75,0,.16,.6,4.5,0xc3925b);block(g,0,2.1,0,.13,3.8,.13,0xc3925b);const sail=new T.Mesh(new T.PlaneGeometry(2.1,2.2),mat(0xffe6ad));sail.material.side=T.DoubleSide;sail.position.set(1,2.6,0);g.add(sail);block(g,0,1,1.2,2,.16,.5,0xc3925b);return g;}
