import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {createRequire} from 'node:module';
import {rules} from '../../../webpack.rules.ts';
import {plugins} from '../../../webpack.plugins.ts';
const require=createRequire(import.meta.url),webpack=require('webpack'),root=fs.mkdtempSync(path.join(os.tmpdir(),'writingtool-checker-')),entry=path.join(root,'entry.ts'),output=path.join(root,'output');
const config={mode:'development',context:process.cwd(),entry,output:{path:output,filename:'probe.cjs'},resolve:{extensions:['.ts','.js']},module:{rules:rules.map(rule=>rule&&rule.test?.toString().includes('tsx')?{...rule,use:{...rule.use,loader:require.resolve('ts-loader'),options:{...rule.use.options,configFile:path.resolve('tsconfig.json')}}}:rule)},plugins};
const valid='const checked: string = "checked"; export {checked};\n',invalid='const checked: string = 123; export {checked};\n';
function compile(){return new Promise((resolve,reject)=>{const compiler=webpack(config);compiler.run((error,stats)=>compiler.close(closeError=>error||closeError?reject(error??closeError):resolve(stats)));});}
fs.writeFileSync(entry,invalid);const bad=await compile();if(!bad.hasErrors()||!bad.toString({all:false,errors:true}).includes('TS2322'))throw new Error('Real TypeScript error did not fail the compiler');console.log('invalid compile: TS2322 reported');
fs.writeFileSync(entry,valid);const good=await compile();if(good.hasErrors())throw new Error(good.toString({all:false,errors:true}));console.log('valid compile: passed');
let phase=0;await new Promise((resolve,reject)=>{const compiler=webpack(config),watch=compiler.watch({},(error,stats)=>{if(error)return reject(error);try{if(phase===0){if(stats.hasErrors())throw new Error(stats.toString());phase++;fs.writeFileSync(entry,invalid);}else if(phase===1){if(!stats.hasErrors()||!stats.toString({all:false,errors:true}).includes('TS2322'))throw new Error('Watch missed a type error');phase++;fs.writeFileSync(entry,valid);}else{if(stats.hasErrors())throw new Error('Watch did not recover');watch.close(error=>compiler.close(closeError=>error||closeError?reject(error??closeError):resolve()));}}catch(error){watch.close(()=>compiler.close(()=>reject(error)));}});});
console.log('watch: valid -> TS2322 -> valid -> clean close passed');
fs.writeFileSync(new URL('./webpack-check.json',import.meta.url),JSON.stringify({fixture:root,invalidCompile:'TS2322',validCompile:true,watchRecovery:true,watchClose:true,plugins:plugins.length},null,2)+'\n');
