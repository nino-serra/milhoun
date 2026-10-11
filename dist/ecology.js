export const ACTIVE_COMPANIONS=12;
export const diets={0:[],1:[],2:[],7:[],10:[],3:[0,2,6,9,10],6:[2,9,10],8:[10],9:[10],4:['coelacanth'],5:['coelacanth'],croc:['coelacanth'],dunk:['coelacanth']};
export function activeFriends(dinos){return dinos.filter(d=>d.tame&&!d.refuge).length;}
export function hasRoom(dinos){return activeFriends(dinos)<ACTIVE_COMPANIONS;}
export function canHunt(hunter,prey){const food=diets[hunter.kind??hunter.index];return hunter!==prey&&!hunter.tame&&!hunter.refuge&&!hunter.foodAbsent&&!hunter.retreat&&!prey.tame&&!prey.refuge&&!prey.foodAbsent&&!prey.retreat&&!!food?.includes(prey.kind??prey.index);}
export function setRefuge(d,inside,dinos){if(!d.tame)return false;if(!inside&&d.refuge&&!hasRoom(dinos))return false;d.refuge=inside;d.g.visible=!inside;return true;}
export class Ecology{
 constructor({dinos,marine,ground,plant,blocked,saved={},message,onChange}){Object.assign(this,{dinos,marine,ground,plant,blocked,message,onChange});this.nextThink=0;this.plants={...saved.plants};this.meals=Number(saved.meals)||0;this.actors=[...dinos,...marine];for(const a of this.actors){const old=saved.animals?.[a.id];a.hunger=Math.max(0,Math.min(100,Number(old?.hunger??(25+(this.actors.indexOf(a)%5)*10))));a.foodAbsent=Math.max(0,Math.min(240,Number(old?.absent)||0));a.ecoGoal=null;}}
 update(dt,time,pos){this.actors=[...this.dinos,...this.marine];for(const[k,n]of Object.entries(this.plants)){this.plants[k]=Math.max(0,n-dt);if(!this.plants[k])delete this.plants[k];}
 for(const a of this.actors){a.ecoGoal=a.fleeUntil>time?a.fleeGoal:null;if(a.refuge){a.g.visible=false;continue;}if(a.tame){a.foodAbsent=0;continue;}a.hunger=Math.min(100,(a.hunger??20)+dt*.5);if(a.foodAbsent>0){a.foodAbsent=Math.max(.001,a.foodAbsent-dt);a.g.visible=false;if(a.foodAbsent<=.001){const x=a.homeX??a.x,z=a.homeZ??a.z,near=pos.distanceTo(a.g.position)<12,food=this.plant(x,z);if(!near&&(a.kind||food||diets[a.index]?.length)&&!this.actors.some(p=>canHunt(p,{...a,foodAbsent:0})&&Math.hypot(p.g.position.x-x,p.g.position.z-z)<9)){a.foodAbsent=0;a.hunger=20;a.g.position.set(x,this.ground(x,z,true)+(a.kind?2:0),z);this.onChange();}}}}
 // Think four times a second; movement uses the existing terrain and fence checks.
 if(time<this.nextThink){for(const a of this.actors)if(!a.foodAbsent&&!a.refuge&&!a.tame&&a.foodTarget&&!a.foodTarget.foodAbsent&&!a.foodTarget.refuge&&!a.foodTarget.tame)a.ecoGoal=a.foodTarget.g.position;return;}this.nextThink=time+.25;
 for(const a of this.actors){a.foodTarget=null;if(a.tame||a.refuge||a.foodAbsent||a.retreat||a.hit>time||a.retreatUntil>time)continue;const diet=diets[a.kind??a.index];if(!diet)continue;
 if(diet.length===0){if(a.hunger<35)continue;const spot=this.plant(a.g.position.x,a.g.position.z);if(spot&&!this.plants[spot]){this.plants[spot]=60;a.hunger=0;a.grazingUntil=time+5;}continue;}
 if(a.hunger<45)continue;let prey=null,range=18;for(const p of this.actors){if(!canHunt(a,p))continue;const distance=a.g.position.distanceTo(p.g.position);if(distance<range&&!this.blocked(a.g.position,p.g.position)){prey=p;range=distance;}}if(!prey)continue;a.foodTarget=prey;a.ecoGoal=prey.g.position;const away=prey.g.position.clone().sub(a.g.position).normalize();prey.ecoGoal=prey.g.position.clone().addScaledVector(away,4);prey.fleeGoal=prey.ecoGoal;prey.fleeUntil=time+1;
 if(range<1.5){prey.foodAbsent=180;prey.g.visible=false;prey.ecoGoal=null;a.ecoGoal=null;a.foodTarget=null;a.hunger=0;this.meals++;if(pos.distanceTo(a.g.position)<22)this.message('🌿 '+(a.s?.name||a.kind)+' a trouvé sa nourriture. La nature se renouvelle.');this.onChange();}}
 }
 serialize(){return {meals:this.meals,plants:this.plants,animals:Object.fromEntries(this.actors.filter(a=>!a.tame).map(a=>[a.id,{hunger:a.hunger||0,absent:a.foodAbsent||0}]))};}
}
