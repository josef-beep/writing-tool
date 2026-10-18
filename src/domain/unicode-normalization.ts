import {DECOMPOSITION,COMBINING,COMPOSITION} from './unicode-normalization-data';
const S_BASE=0xac00,L_BASE=0x1100,V_BASE=0x1161,T_BASE=0x11a7,L_COUNT=19,V_COUNT=21,T_COUNT=28,N_COUNT=V_COUNT*T_COUNT,S_COUNT=L_COUNT*N_COUNT;
const ccc=(cp:number):number=>COMBINING[String(cp)]??0;
function decompose(cp:number,result:number[]):void {
 const syllable=cp-S_BASE;
 if(syllable>=0&&syllable<S_COUNT){result.push(L_BASE+Math.floor(syllable/N_COUNT),V_BASE+Math.floor((syllable%N_COUNT)/T_COUNT));const tail=syllable%T_COUNT;if(tail)result.push(T_BASE+tail);return;}
 const mapping=DECOMPOSITION[String(cp)];if(mapping)for(const value of mapping)decompose(value,result);else result.push(cp);
}
function decomposed(text:string):number[]{
 if(/[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/u.test(text))throw new Error('Malformed Unicode scalar text.');
 const raw:number[]=[];for(const char of text)decompose(char.codePointAt(0)!,raw);
 const result:number[]=[],marks:number[]=[];const flush=()=>{marks.sort((a,b)=>ccc(a)-ccc(b));for(const cp of marks)result.push(cp);marks.length=0;};
 for(const cp of raw){if(ccc(cp)===0){flush();result.push(cp);}else marks.push(cp);}flush();return result;
}
const stringOf=(values:number[]):string=>values.map(cp=>String.fromCodePoint(cp)).join('');
export const unicode17NFD=(text:string):string=>stringOf(decomposed(text));
function composedPair(first:number,second:number):number|undefined {
 const leading=first-L_BASE,vowel=second-V_BASE;
 if(leading>=0&&leading<L_COUNT&&vowel>=0&&vowel<V_COUNT)return S_BASE+(leading*V_COUNT+vowel)*T_COUNT;
 const syllable=first-S_BASE,tail=second-T_BASE;
 if(syllable>=0&&syllable<S_COUNT&&syllable%T_COUNT===0&&tail>0&&tail<T_COUNT)return first+tail;
 return COMPOSITION[`${first},${second}`];
}
export function unicode17NFC(text:string):string {
 const input=decomposed(text);if(!input.length)return '';
 const result=[input[0]];let starter=0,lastClass=ccc(input[0]);
 for(let i=1;i<input.length;i++){const cp=input[i],currentClass=ccc(cp),combined=composedPair(result[starter],cp);if(combined!==undefined&&(lastClass<currentClass||lastClass===0)){result[starter]=combined;}else{if(currentClass===0)starter=result.length;result.push(cp);lastClass=currentClass;}}
 return stringOf(result);
}
