import {normalizeOutfits} from './outfits.js';
export const playerItems=[{id:'hat',name:'Chapeau d’explorateur',price:8},{id:'cap',name:'Casquette turquoise',price:6}];
export const playerColors=['#33a99b','#ec9360','#8b79c9','#e3c657'];
export function normalizePlayer(value={}){const owned=Array.isArray(value?.owned)?value.owned:[];return {...normalizeOutfits(value,owned),thirdPerson:value?.thirdPerson===true,color:playerColors.includes(value?.color)?value.color:playerColors[0],owned:[...new Set((Array.isArray(value?.owned)?value.owned:[]).filter(id=>playerItems.some(i=>i.id===id)||['crystal','safari','ruins','snow'].includes(id)))],accessory:playerItems.some(i=>i.id===value?.accessory&&value?.owned?.includes(i.id))?value.accessory:''};}
export function buyPlayerItem(state,inv,id){const item=playerItems.find(i=>i.id===id);if(!item||state.owned.includes(id)||!Number.isFinite(inv.gems)||inv.gems<item.price)return false;inv.gems-=item.price;state.owned.push(id);return true;}
