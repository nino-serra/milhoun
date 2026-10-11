import assert from 'node:assert/strict';
import {parseImportedSave} from '../dist/save-transfer.js';
const old={inv:{gems:12,berries:5},tamed:[0],babies:[],edits:{},journey:{treasure:true}};
assert.deepEqual(parseImportedSave(JSON.stringify(old)),old);for(const bad of ['null','[]','{}',JSON.stringify({...old,inv:{gems:-1}}),JSON.stringify({...old,inv:{gems:'12'}}),'x'.repeat(2000001)])assert.throws(()=>parseImportedSave(bad));
assert.throws(()=>parseImportedSave(JSON.stringify({...old,babies:[null]})));assert.throws(()=>parseImportedSave(JSON.stringify({...old,tamed:[99]})));assert.throws(()=>parseImportedSave(JSON.stringify({...old,edits:{bad:'wood'}})));
console.log('PASS: legacy/new save import, rejects invalid JSON structure, bad inventory and oversized files.');
