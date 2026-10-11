import * as T from './vendor/three.module.js';
const round=new T.SphereGeometry(1,10,7),cone=new T.ConeGeometry(1,1,7),cylinder=new T.CylinderGeometry(1,1,1,7);
const materials=new Map();function mat(color){if(!materials.has(color))materials.set(color,new T.MeshLambertMaterial({color,flatShading:true}));return materials.get(color);}
function shape(g,geo,color,pos,size){const m=new T.Mesh(geo,mat(color));m.position.set(...pos);m.scale.set(...size);g.add(m);return m;}
function oval(g,color,pos,size){return shape(g,round,color,pos,size);}
function limb(g,color,from,to,r1,r2=r1){const a=new T.Vector3(...from),b=new T.Vector3(...to),delta=b.clone().sub(a);const geo=r2===0?cone:cylinder;const m=shape(g,geo,color,a.clone().add(b).multiplyScalar(.5).toArray(),[r1,delta.length(),r1]);m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),delta.normalize());return m;}
export const GROWTH_SECONDS=12*60;
export function growthScale(age){return .3+.7*Math.min(1,Math.max(0,age)/GROWTH_SECONDS);}
export function normalizeBaby(value){return typeof value==='number'?{index:value,age:0}:{index:value.index,age:Math.max(0,Math.min(GROWTH_SECONDS,Number(value.age)||0))};}
export function makeDinosaur(index,color){
  const g=new T.Group(),legs=[],wings=[],belly=new T.Color(color).lerp(new T.Color(0xf0dfb0),.5).getHex(),dark=new T.Color(color).multiplyScalar(.7).getHex();
  function eye(x,y,z,r=.085){oval(g,0xeee6c8,[x,y,z],[r,r,r*.65]);oval(g,0x203d32,[x,y,z-.035],[r*.55,r*.65,r*.5]);}
  function feet(x,z,y=1){const leg=new T.Group();leg.position.set(x,y,z);limb(leg,color,[0,0,0],[0,-y+.15,.06],.16);oval(leg,dark,[0,-y+.12,-.08],[.22,.13,.32]);g.add(leg);legs.push(leg);}
  if(index===9){
    oval(g,color,[0,.85,0],[.25,.32,.64]);oval(g,belly,[0,.77,-.1],[.21,.2,.43]);limb(g,color,[0,1,-.4],[0,1.28,-.7],.15);oval(g,color,[0,1.3,-.83],[.2,.22,.4]);eye(-.14,1.38,-1.06,.05);eye(.14,1.38,-1.06,.05);
    for(const side of [-1,1]){const leg=new T.Group();leg.position.set(side*.22,.73,.15);limb(leg,color,[0,0,0],[0,-.4,.14],.095);limb(leg,color,[0,-.4,.14],[0,-.65,-.1],.06);oval(leg,dark,[0,-.67,-.2],[.1,.07,.2]);limb(leg,0xf4e5be,[0,-.64,-.31],[0,-.49,-.42],.035,0);g.add(leg);legs.push(leg);limb(g,color,[side*.2,1,-.35],[side*.42,.72,-.64],.07);for(let i=0;i<4;i++)limb(g,dark,[side*.32,.83,-.5],[side*(.5+i*.045),.7,-.35+i*.12],.04,0);}
    limb(g,color,[0,.85,.45],[0,.8,1.3],.12);limb(g,dark,[0,.8,1.15],[0,1,2.05],.085,0);for(let i=0;i<4;i++)limb(g,dark,[0,1.05,i*.17],[0,1.28,i*.17+.08],.055,0);
  }else if(index===10){
    oval(g,color,[0,.53,0],[.37,.35,.6]);for(const side of [-1,1])for(const z of [-.32,.34])feet(side*.24,z,.4);oval(g,color,[0,.8,-.42],[.49,.42,.1]);oval(g,belly,[0,.64,-.7],[.25,.23,.35]);oval(g,dark,[0,.57,-1],[.14,.13,.12]);eye(-.17,.76,-.85,.05);eye(.17,.76,-.85,.05);limb(g,color,[0,.55,.5],[0,.58,1.18],.12,0);
  }else if(index===7){
    // Woolly mammoth: high shoulders, shaggy coat, long trunk and curved ivory tusks.
    oval(g,color,[0,1.85,0],[1,1.05,1.5]);oval(g,dark,[0,2.4,-.65],[.94,.65,.82]);
    for(const x of [-.64,.64])for(const z of [-.8,.85]){const leg=new T.Group();leg.position.set(x,1.35,z);limb(leg,color,[0,0,0],[0,-1.14,0],.3);oval(leg,dark,[0,-1.15,-.05],[.34,.22,.4]);g.add(leg);legs.push(leg);}
    oval(g,color,[0,2.18,-1.5],[.75,.82,.68]);for(const x of [-.67,.67])oval(g,dark,[x,2.14,-1.34],[.28,.43,.19]);
    eye(-.43,2.36,-1.97,.075);eye(.43,2.36,-1.97,.075);
    const trunk=[[0,2.05,-1.96],[0,1.58,-2.12],[0,1.02,-2.26],[0,.55,-2.4],[0,.42,-2.73],[0,.66,-2.95]];for(let i=1;i<trunk.length;i++)limb(g,color,trunk[i-1],trunk[i],.24-i*.025);
    for(const side of [-1,1]){const points=[[side*.45,1.72,-1.83],[side*.68,1.2,-2.2],[side*.83,1.13,-2.72],[side*.81,1.48,-3.08],[side*.66,1.97,-3.16]];for(let i=1;i<points.length;i++)limb(g,0xffecc0,points[i-1],points[i],.15-i*.025,i===points.length-1?0:.1);}
    for(let i=0;i<16;i++){const a=i*Math.PI/8;const tuft=shape(g,cone,i%2?dark:color,[Math.cos(a)*.9,.94,Math.sin(a)*1.24],[.19,.65,.23]);tuft.rotation.z=Math.PI;}
    limb(g,dark,[0,1.65,1.35],[.18,.72,1.75],.07);
  }else if(index===8){
    // Low, muscular cat with four paws and two conspicuous downward sabres.
    oval(g,color,[0,1.02,0],[.52,.5,1.05]);oval(g,color,[0,1.27,-.57],[.62,.64,.68]);oval(g,belly,[0,.86,-.4],[.41,.24,.66]);
    for(const x of [-.4,.4])for(const z of [-.65,.68]){const leg=new T.Group();leg.position.set(x,.85,z);limb(leg,color,[0,0,0],[0,-.65,-.06],.18);oval(leg,belly,[0,-.7,-.15],[.22,.15,.33]);g.add(leg);legs.push(leg);}
    oval(g,color,[0,1.39,-1.02],[.48,.48,.48]);oval(g,belly,[0,1.18,-1.38],[.38,.25,.29]);oval(g,dark,[0,1.35,-1.63],[.13,.09,.07]);eye(-.25,1.55,-1.39,.065);eye(.25,1.55,-1.39,.065);
    for(const x of [-.3,.3]){oval(g,color,[x,1.83,-.95],[.17,.2,.12]);oval(g,dark,[x,1.86,-1.04],[.09,.12,.035]);limb(g,0xfff1cb,[x*.78,1.21,-1.52],[x*.8,.55,-1.59],.085,0);}
    for(const side of [-1,1])for(let i=0;i<5;i++){const stripe=oval(g,dark,[side*.5,1.11,-.43+i*.28],[.04,.24,.065]);stripe.rotation.x=.2;}
    limb(g,color,[0,1.14,.85],[.2,1.29,1.63],.09);limb(g,dark,[.2,1.29,1.63],[.36,1.52,1.92],.07);
  }else if(index===5){
    oval(g,color,[0,.85,0],[.26,.3,.58]);oval(g,belly,[0,.76,-.08],[.19,.18,.43]);
    limb(g,color,[0,1,-.3],[0,1.38,-.62],.14);oval(g,color,[0,1.4,-.72],[.22,.23,.31]);
    limb(g,0xd5b573,[0,1.39,-.91],[0,1.32,-1.64],.15,0);
    limb(g,dark,[0,1.51,-.55],[0,1.8,-.1],.13,0);eye(-.15,1.48,-.93,.052);eye(.15,1.48,-.93,.052);
    for(const side of [-1,1]){
      const wing=new T.Group();wing.position.set(side*.18,.93,-.05);
      const verts=new Float32Array([0,0,0,side*1.05,.08,-.2,side*2.35,-.05,.22, 0,0,0,side*2.35,-.05,.22,side*.95,-.05,.82, 0,0,0,side*.95,-.05,.82,0,0,.55]);
      const geo=new T.BufferGeometry();geo.setAttribute('position',new T.BufferAttribute(verts,3));geo.computeVertexNormals();const membrane=mat(0xba7d61);membrane.side=T.DoubleSide;wing.add(new T.Mesh(geo,membrane));
      limb(wing,color,[0,0,0],[side*1.05,.08,-.2],.045);limb(wing,color,[side*1.05,.08,-.2],[side*2.35,-.05,.22],.025);
      g.add(wing);wings.push(wing);feet(side*.16,.35,.35);
    }
  }else if(index===3||index===4||index===6){
    oval(g,color,[0,1.48,0],[.57,.8,.9]);oval(g,belly,[0,1.43,-.35],[.43,.62,.5]);
    limb(g,color,[0,1.85,-.45],[0,2.18,-.95],.37);oval(g,color,[0,2.28,-1.16],[.46,.45,.65]);oval(g,belly,[0,2.04,-1.3],[.37,.13,.51]);
    eye(-.34,2.43,-1.52);eye(.34,2.43,-1.52);
    for(const x of [-.47,.47]){oval(g,color,[x,1.04,.14],[.3,.55,.37]);feet(x,.2,.78);limb(g,color,[x*.83,1.64,-.52],[x*1.05,1.27,-.75],.09);}
    limb(g,color,[0,1.25,.57],[0,1.12,1.52],.28);limb(g,color,[0,1.12,1.3],[0,1.35,2.8],.2,0);
    for(let i=0;i<4;i++)oval(g,dark,[0,1.99-i*.07,.1+i*.26],[.16,.12,.16]);
    if(index===4){
      oval(g,color,[0,2.17,-1.75],[.27,.23,.7]);oval(g,belly,[0,2.04,-1.91],[.21,.07,.49]);
      const vertices=[];for(let i=0;i<7;i++){const z=-.6+i*.22,nz=z+.22,h=2+Math.sin((i+1)/9*Math.PI)*1.25,nh=2+Math.sin((i+2)/9*Math.PI)*1.25;vertices.push(0,1.95,z,0,h,z,0,nh,nz,0,1.95,z,0,nh,nz,0,1.95,nz);limb(g,dark,[0,1.96,z],[0,h,z],.025);}
      const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(vertices,3));geo.computeVertexNormals();const sail=mat(0xcb8b62);sail.side=T.DoubleSide;g.add(new T.Mesh(geo,sail));
    }
    if(index===6){
      for(const x of [-.32,.32]){limb(g,0xc6784b,[x,2.54,-1.22],[x,2.81,-1.41],.11,0);limb(g,color,[x*1.3,1.67,-.5],[x*1.55,1.08,-.93],.11);}
      for(let i=0;i<5;i++)oval(g,dark,[.52,1.75-i*.12,.25],[.06,.09,.28]);
      g.scale.setScalar(.9);
    }
  }else{
    const long=index===1;oval(g,color,[0,long?1.37:1.08,0],[long?.76:.65,long?.75:.6,long?1.22:1]);oval(g,belly,[0,long?1.12:.86,-.1],[.5,.37,.75]);
    for(const x of [-.47,.47])for(const z of [-.61,.63])feet(x,z,long?1.14:.82);
    limb(g,color,[0,1,.7],[0,.82,1.6],.25);limb(g,color,[0,.82,1.35],[0,.94,long?3.2:2.3],.18,0);
    if(long){
      limb(g,color,[0,1.6,-.7],[0,2.65,-1.25],.3);limb(g,color,[0,2.55,-1.2],[0,3.65,-1.5],.22);oval(g,color,[0,3.68,-1.67],[.29,.28,.47]);oval(g,belly,[0,3.54,-1.8],[.23,.09,.3]);eye(-.19,3.8,-1.96,.065);eye(.19,3.8,-1.96,.065);
      for(let i=0;i<5;i++)oval(g,dark,[.55,1.6,-.7+i*.35],[.12,.15,.18]);
    }else if(index===0){
      oval(g,color,[0,1.5,-.85],[.84,.76,.2]);oval(g,dark,[0,1.5,-1.005],[.7,.61,.045]);oval(g,color,[0,1.15,-1.23],[.52,.43,.61]);oval(g,dark,[0,1.04,-1.75],[.24,.2,.2]);eye(-.34,1.38,-1.61);eye(.34,1.38,-1.61);
      for(const x of [-.3,.3])limb(g,0xf3e6bd,[x,1.53,-1.25],[x*1.35,1.95,-1.94],.105,0);limb(g,0xf3e6bd,[0,1.3,-1.72],[0,1.64,-1.96],.08,0);
      for(let i=0;i<7;i++){const a=Math.PI*i/6;oval(g,belly,[Math.cos(a)*.77,1.5+Math.sin(a)*.69,-.86],[.13,.12,.12]);}
    }else{
      limb(g,color,[0,1,-.7],[0,.75,-1.25],.25);oval(g,color,[0,.76,-1.47],[.29,.28,.42]);eye(-.19,.88,-1.7,.065);eye(.19,.88,-1.7,.065);
      for(let i=0;i<7;i++){const z=-.82+i*.29,h=.4+Math.sin(i/6*Math.PI)*.42;const p=shape(g,cone,0xbb8655,[i%2?.13:-.13,1.55+h/2,z],[.25,h,.12]);p.rotation.z=i%2?-.18:.18;}
      for(const x of [-.13,.13])limb(g,0xf0deb0,[x,.9,1.82],[x*3,1.4,2.17],.07,0);
    }
  }
  return {g,legs,wings};
}
