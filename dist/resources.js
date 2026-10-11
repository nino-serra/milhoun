export const BERRY_REGROW_SECONDS=60;
export const berryPoints=[[3,16],[-3,16],[5,20],[-7,18],[8,5],[-8,1],[-17,-8],[18,12],[-32,10],[-36,-5],[31,7],[33,17],[-3,-33],[6,-37],[-6,34],[11,33]];
// Larger peaceful animals eat more; dangerous carnivores take longer to befriend.
export const tamingCosts=[5,7,4,10,12,3,8,10,12,6,3];
export function tamingCost(index){return tamingCosts[index]??5;}
export function feedDinosaur(d,inv){
  if(d.tame)return {status:'friend',remaining:0};
  const required=tamingCost(d.index);
  if(!(inv.berries>0))return {status:'empty',remaining:Math.max(0,required-d.feed)};
  inv.berries--;d.feed=(d.feed||0)+1;d.tame=d.feed>=required;
  return {status:d.tame?'tamed':'fed',remaining:Math.max(0,required-d.feed),required};
}
export function pickBerries(block,inv,timers,time,key){
  if(block?.type!=='berry')return false;
  block.type='berryBare';inv.berries=(inv.berries||0)+3;timers.set(key,time+BERRY_REGROW_SECONDS);return true;
}
export function regrowBerries(blocks,timers,time){let changed=false;for(const[k,due]of timers){if(time<due)continue;const b=blocks.get(k);if(b?.type==='berryBare'){b.type='berry';changed=true;}timers.delete(k);}return changed;}
