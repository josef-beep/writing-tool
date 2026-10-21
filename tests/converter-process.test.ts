import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {runConverter} from '../src/infrastructure/converter-process';

const fixture=fileURLToPath(new URL('./fixtures/converter-tree.cjs',import.meta.url));
const delay=(ms:number)=>new Promise<void>(resolve=>setTimeout(resolve,ms));
function running(pid:number):boolean{
 try{process.kill(pid,0);}catch(error){if((error as NodeJS.ErrnoException).code==='ESRCH')return false;throw error;}
 if(process.platform==='linux'){
  try{const stat=fs.readFileSync(`/proc/${pid}/stat`,'utf8');return !['Z','X'].includes(stat.slice(stat.lastIndexOf(')')+2).split(' ')[0]);}
  catch(error){if((error as NodeJS.ErrnoException).code==='ENOENT')return false;throw error;}
 }
 return true;
}
for(const reason of ['cancel','timeout'] as const)test(`${reason} waits for a TERM-resistant descendant after its successful parent exits`,{skip:process.platform==='win32'},async t=>{
 const temp=fs.mkdtempSync(path.join(os.tmpdir(),'writingtool-converter-test-')),pidFile=path.join(temp,'descendant.pid'),control={canceled:false};
 let descendant:number|undefined;
 t.after(()=>{if(descendant&&running(descendant))process.kill(descendant,'SIGKILL');fs.rmSync(temp,{recursive:true,force:true});});
 const converted=runConverter(process.execPath,[fixture,pidFile],control,{timeoutMs:reason==='timeout'?2000:10000,graceMs:150});
 const readyEnd=Date.now()+1500;
 while(!fs.existsSync(pidFile)&&Date.now()<readyEnd)await delay(10);
 assert.equal(fs.existsSync(pidFile),true,'descendant started before termination');
 descendant=Number(fs.readFileSync(pidFile,'utf8'));
 assert.equal(running(descendant),true);
 if(reason==='cancel')control.canceled=true;
 const result=await converted;
 assert.equal(result.code,0,'the wrapper acknowledged TERM with successful exit');
 assert.equal(result.timedOut,reason==='timeout','a successful wrapper exit cannot turn a timeout into success');
 assert.equal(control.canceled,reason==='cancel');
 assert.equal(running(descendant),false,'the converter cannot return while the pipe-free descendant survives');
});

test('ordinary converter completion still returns its exit status and diagnostics',async()=>{
 const result=await runConverter(process.execPath,['-e',"process.stderr.write('conversion diagnostic');process.exitCode=7;"],{canceled:false});
 assert.deepEqual(result,{code:7,stderr:'conversion diagnostic',timedOut:false});
});
