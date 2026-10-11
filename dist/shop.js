import * as T from './vendor/three.module.js';
import {makeDinosaur} from './dinosaurs.js';
import {species} from './island.js';
export const shopItems=[
 {id:'explorer',name:'Foulard d’explorateur',icon:'🏅',kind:'accessory',rarity:'Récompense',price:0,unlock:'expeditions',hint:'Termine les trois expéditions'},
 {id:'blue',name:'Bleu lagon',icon:'💙',kind:'skin',rarity:'Commun',price:5,color:0x4cadd3},
 {id:'pink',name:'Rose bonbon',icon:'🌸',kind:'skin',rarity:'Commun',price:5,color:0xe78fb7},
 {id:'tiger',name:'Rayures de tigre',icon:'🐯',kind:'skin',rarity:'Rare',price:15,color:0xe8ac4e,pattern:'stripe'},
 {id:'gold',name:'Pépites dorées',icon:'✨',kind:'skin',rarity:'Rare',price:15,color:0xb59649,pattern:'spots'},
 {id:'volcano',name:'Volcan',icon:'🌋',kind:'skin',rarity:'Épique',price:35,color:0x944936,pattern:'stripe'},
 {id:'ocean',name:'Océan',icon:'🌊',kind:'skin',rarity:'Épique',price:35,color:0x298ea8,pattern:'spots',unlock:'marine',hint:'Trouve le trésor marin'},
 {id:'frost',name:'Givre',icon:'❄️',kind:'skin',rarity:'Épique',price:35,color:0xa8d9e9,pattern:'spots',unlock:'snow',hint:'Découvre les montagnes des mammouths'},
 {id:'cosmos',name:'Étoiles arc-en-ciel',icon:'🌈',kind:'skin',rarity:'Légendaire',price:75,color:0x7651ae,pattern:'rainbow'},
 {id:'scarf',name:'Foulard rouge',icon:'🧣',kind:'accessory',rarity:'Commun',price:8},
 {id:'saddle',name:'Selle turquoise',icon:'🪑',kind:'accessory',rarity:'Rare',price:12},
 {id:'flowers',name:'Couronne de fleurs',icon:'🌼',kind:'accessory',rarity:'Rare',price:20},
];
export function normalizeShop(saved={}){return {owned:[...new Set((Array.isArray(saved.owned)?saved.owned:[]).filter(id=>shopItems.some(i=>i.id===id)))],looks:Object.fromEntries(Object.entries(saved.looks||{}).map(([id,v])=>[id,{skin:shopItems.some(i=>i.id===v?.skin&&i.kind==='skin')?v.skin:null,accessory:shopItems.some(i=>i.id===v?.accessory&&i.kind==='accessory')?v.accessory:null}]))};}
export function unlocked(item,progress){return !item.unlock||!!progress[item.unlock];}
export function buyItem(state,inv,id,progress){const item=shopItems.find(i=>i.id===id);if(!item)return 'invalid';if(state.owned.includes(id))return 'owned';if(!unlocked(item,progress))return 'locked';if(!(inv.gems>=item.price))return 'poor';inv.gems-=item.price;state.owned.push(id);return 'bought';}
export function equipItem(state,animal,id,kind){if(!animal?.tame)return false;const item=shopItems.find(i=>i.id===id);if(id!==null&&(!item||item.kind!==kind||!state.owned.includes(id)))return false;if(!['skin','accessory'].includes(kind))return false;state.looks[animal.id]??={skin:null,accessory:null};state.looks[animal.id][kind]=id;return true;}
function decorateMaterial(material,item){if(!item.pattern)return;const pattern=item.pattern;material.onBeforeCompile=shader=>{shader.vertexShader='varying vec3 skinPoint;\n'+shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nskinPoint = position;');shader.fragmentShader='varying vec3 skinPoint;\n'+shader.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
 float band=step(0.35,sin(skinPoint.z*19.0+skinPoint.y*4.0));
 float dotMask=step(0.83,sin(skinPoint.x*23.0)*sin(skinPoint.y*21.0)*sin(skinPoint.z*19.0));
 ${pattern==='stripe'?'diffuseColor.rgb *= mix(0.38,1.0,band);':pattern==='spots'?'diffuseColor.rgb = mix(diffuseColor.rgb,vec3(1.0,0.91,0.6),dotMask);':'diffuseColor.rgb = mix(diffuseColor.rgb,0.55+0.45*cos(skinPoint.y*3.0+vec3(0.0,2.1,4.2)),0.65);diffuseColor.rgb=mix(diffuseColor.rgb,vec3(1.0),dotMask);'}`);};material.customProgramCacheKey=()=> 'dino-skin-'+pattern;}
export function applyLook(g,index,look={}){
 const previous=g.userData.accessory;if(previous){g.remove(previous);previous.traverse(o=>{if(o.isMesh){o.geometry.dispose();o.material.dispose();}});delete g.userData.accessory;}
 const base=new T.Color(species[index].color),belly=base.clone().lerp(new T.Color(0xf0dfb0),.5),dark=base.clone().multiplyScalar(.7),item=shopItems.find(i=>i.id===look.skin&&i.kind==='skin');
 g.traverse(o=>{if(!o.isMesh)return;o.userData.naturalMaterial??=o.material;if(o.material!==o.userData.naturalMaterial)o.material.dispose();const original=o.userData.naturalMaterial;o.material=original;if(!item||![base.getHex(),belly.getHex(),dark.getHex()].includes(original.color?.getHex()))return;const m=original.clone(),tint=new T.Color(item.color);if(original.color.getHex()===belly.getHex())tint.lerp(new T.Color(0xffedc9),.4);else if(original.color.getHex()===dark.getHex())tint.multiplyScalar(.65);m.color.copy(tint);decorateMaterial(m,item);o.material=m;});
 if(!look.accessory)return;const accessory=new T.Group();g.userData.accessory=accessory;g.add(accessory);
 // Neck, back and crown anchors match each existing model, including young animals.
 const a=[{y:1.12,z:-.65,r:.49,head:2.22},{y:2.5,z:-1.2,r:.27,head:4.05},{y:.83,z:-1.08,r:.25,head:1.15},{y:1.88,z:-.66,r:.39,head:2.83},{y:1.88,z:-.66,r:.39,head:2.83},{y:1.08,z:-.43,r:.15,head:1.75},{y:1.88,z:-.66,r:.39,head:2.83},{y:1.9,z:-1.3,r:.68,head:3.04},{y:1.21,z:-.7,r:.43,head:1.96},{y:1.04,z:-.51,r:.17,head:1.65},{y:.61,z:-.5,r:.26,head:1.19}][index];
 function add(geo,color,x,y,z){const m=new T.Mesh(geo,new T.MeshLambertMaterial({color}));m.position.set(x,y,z);accessory.add(m);return m;}
 if(['scarf','explorer'].includes(look.accessory)){const ring=add(new T.TorusGeometry(a.r,.07,6,18),look.accessory==='explorer'?0xf0bc42:0xdd5262,0,a.y,a.z);ring.rotation.x=Math.PI/2;const end=add(new T.BoxGeometry(.16,.36,.05),look.accessory==='explorer'?0x2c9f93:0xf06679,a.r*.7,a.y-.2,a.z-a.r*.65);end.rotation.z=-.25;}
 if(look.accessory==='saddle'){const back=[1.6,2.05,1.52,1.88,1.88,1.1,1.88,2.77,1.48,1.12,.87][index],size=index===7?1.05:index===1?.85:index===9||index===10||index===5?.4:.7;add(new T.BoxGeometry(size,.16,size*.9),0x33bbc2,0,back,.05);add(new T.BoxGeometry(size,.2,.12),0xf0cb6c,0,back+.1,.05+size*.4);}
 if(look.accessory==='flowers'){const r=index===7?.45:index===1||index===5||index===9||index===10?.2:.33,z=index===1?-1.65:index===7?-1.5:index===9?-.83:index===10?-.62:index===5?-.72:index===8?-1.02:-1.2;const ring=add(new T.TorusGeometry(r,.035,5,18),0x529055,0,a.head,z);ring.rotation.x=Math.PI/2;for(let i=0;i<7;i++){const angle=i*Math.PI*2/7;add(new T.SphereGeometry(.08,6,4),i%2?0xffdc69:0xf88ab6,Math.cos(angle)*r,a.head+.04,z+Math.sin(angle)*r);}}
}
export function makePreview(canvas){const renderer=new T.WebGLRenderer({canvas,antialias:true,alpha:true,powerPreference:'low-power'});renderer.setPixelRatio(Math.min(globalThis.devicePixelRatio||1,1.5));const scene=new T.Scene(),camera=new T.PerspectiveCamera(35,1,.1,40);scene.add(new T.HemisphereLight(0xffffff,0x637158,2.7));const sun=new T.DirectionalLight(0xffffff,2);sun.position.set(-4,7,5);scene.add(sun);let model;const models=new Map();
 return {draw(index,look,angle=0){if(model)scene.remove(model);if(!models.has(index))models.set(index,makeDinosaur(index,species[index].color).g);model=models.get(index);applyLook(model,index,look);model.rotation.y=.6+angle;scene.add(model);model.updateMatrixWorld(true);const bounds=new T.Box3().setFromObject(model),center=bounds.getCenter(new T.Vector3()),size=bounds.getSize(new T.Vector3()),radius=Math.max(size.x,size.y,size.z);const w=Math.max(240,canvas.clientWidth),h=Math.max(220,canvas.clientHeight);renderer.setSize(w,h,false);camera.aspect=w/h;camera.position.set(center.x+radius*.35,center.y+radius*.2,center.z-radius*2.35);camera.lookAt(center);camera.updateProjectionMatrix();renderer.render(scene,camera);}};
}
