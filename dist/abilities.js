export const currentZone={id:'current',name:'Le passage du grand courant',x:-8,z:84,r:9};
export const rockPassage={id:'horns',name:'Le passage des trois cornes',x:38,z:-4};
export const abilityInfo={0:{icon:'🪨',name:'Briser',hint:'Brise les rochers dorés du passage des trois cornes.'},9:{icon:'💨',name:'Sprint',hint:'Cours plus vite pendant 5 secondes, puis repose-toi 7 secondes.'},4:{icon:'🌊',name:'Plonger',hint:'Nage vite, plonge aux bouées et traverse le grand courant au sud.'},5:{icon:'🪽',name:'Battre ailes',hint:'Vole au-dessus de l’île et bats des ailes pour monter.'}};
export function canUseAbility(d,index){return !!d&&d.tame&&!d.baby&&!d.refuge&&d.index===index;}
export function normalizeAbilities(saved){return {opened:!!saved?.opened,treasures:[...new Set((Array.isArray(saved?.treasures)?saved.treasures:[]).filter(id=>['horns','current'].includes(id)))]};}
export function sprintState(){return {animal:null,until:0,ready:0};}
export function activateSprint(s,d,time){if(!canUseAbility(d,9)||time<s.ready)return false;s.animal=d.id;s.until=time+5;s.ready=time+12;return true;}
export function isSprinting(s,d,time){return canUseAbility(d,9)&&s.animal===d.id&&time<s.until;}
export function mountSpeed(d,swimming,s,time){if(!d)return swimming?2.8:4;if(d.index===5)return 7;if(canUseAbility(d,4)&&swimming)return 6.5;return isSprinting(s,d,time)?10:6;}
export function spinoHeight(y,floor,descending,dt){const low=floor+2.3,high=-.8+1.2,target=descending?Math.min(low,high):high;return Math.max(Math.min(low,high),Math.min(high,y+Math.sign(target-y)*Math.min(Math.abs(target-y),dt*2.8)));}
export function currentAllows(from,to,d){if(canUseAbility(d,4)||to.y>2)return true;const a=Math.hypot(from.x-currentZone.x,from.z-currentZone.z),b=Math.hypot(to.x-currentZone.x,to.z-currentZone.z);return b>=4||b>a+.0001;}
export function claimAbilityTreasure(state,inv,id,d){if(state.treasures.includes(id)||id==='horns'&&!state.opened||id==='current'&&!canUseAbility(d,4)||!['horns','current'].includes(id))return 0;state.treasures.push(id);const n=id==='horns'?12:18;inv.gems+=n;return n;}
