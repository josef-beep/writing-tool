import fs from 'node:fs';
import path from 'node:path';
import {spawn} from 'node:child_process';

export class ConverterTerminationError extends Error {
 constructor(message:string){super(message);this.name='ConverterTerminationError';}
}
const delay=(milliseconds:number)=>new Promise<void>(resolve=>setTimeout(resolve,milliseconds));
function groupRunning(pid:number):boolean{
 try{process.kill(-pid,0);}catch(error){if((error as NodeJS.ErrnoException).code==='ESRCH')return false;throw error;}
 if(process.platform!=='linux')return true;
 // Orphan zombies cannot touch conversion files; some init processes reap them late.
 for(const name of fs.readdirSync('/proc')){
  if(!/^[0-9]+$/.test(name))continue;
  let stat:string;try{stat=fs.readFileSync(`/proc/${name}/stat`,'utf8');}catch(error){if((error as NodeJS.ErrnoException).code==='ENOENT')continue;return true;}
  const fields=stat.slice(stat.lastIndexOf(')')+2).split(' ');
  if(Number(fields[2])===pid&&fields[0]!=='Z'&&fields[0]!=='X')return true;
 }
 return false;
}
async function terminateTree(pid:number,graceMs:number):Promise<void>{
 if(process.platform==='win32'){
  await new Promise<void>((resolve,reject)=>{
   const killer=spawn(path.join(process.env.SystemRoot??'C:\\Windows','System32','taskkill.exe'),['/PID',String(pid),'/T','/F'],{shell:false,windowsHide:true,stdio:'ignore'});
   const timer=setTimeout(()=>{killer.kill();reject(new Error('Windows taskkill did not finish confirming process-tree termination.'));},15000);
   killer.once('error',error=>{clearTimeout(timer);reject(error);});killer.once('close',code=>{clearTimeout(timer);if(code===0)resolve();else reject(new Error('Windows taskkill did not confirm process-tree termination.'));});
  });return;
 }
 const signal=(value:NodeJS.Signals)=>{try{process.kill(-pid,value);}catch(error){if((error as NodeJS.ErrnoException).code!=='ESRCH')throw error;}};
 signal('SIGTERM');
 const graceEnd=Date.now()+graceMs;
 while(groupRunning(pid)&&Date.now()<graceEnd)await delay(Math.min(25,Math.max(1,graceEnd-Date.now())));
 if(!groupRunning(pid))return;
 signal('SIGKILL');
 const killEnd=Date.now()+5000;
 while(groupRunning(pid)&&Date.now()<killEnd)await delay(25);
 if(groupRunning(pid))throw new Error('The original converter process group did not finish terminating.');
}
/** Host-only converter runner. Cancellation/timeout waits for the original tree before returning. */
export async function runConverter(command:string,args:string[],control:{canceled:boolean},options:{timeoutMs?:number;graceMs?:number}={}):Promise<{code:number|null;stderr:string;timedOut:boolean}>{
 const child=spawn(command,args,{shell:false,detached:process.platform!=='win32',windowsHide:true,stdio:['ignore','ignore','pipe']});
 let stderr='',timedOut=false,termination:Promise<void>|undefined,terminationFailure:ConverterTerminationError|undefined;
 let rejectTermination!:(error:ConverterTerminationError)=>void;
 const failedTermination=new Promise<never>((_resolve,reject)=>{rejectTermination=reject;});
 const terminate=()=>{
  if(termination||!child.pid)return;
  termination=terminateTree(child.pid,options.graceMs??3000).catch(error=>{terminationFailure=new ConverterTerminationError(`Converter termination could not be confirmed; temporary files were retained. ${error instanceof Error?error.message:String(error)}`);rejectTermination(terminationFailure);});
 };
 child.stderr.on('data',bytes=>{if(stderr.length<8192)stderr+=String(bytes).slice(0,8192-stderr.length);});
 const poll=setInterval(()=>{if(control.canceled)terminate();},100);
 const timeout=setTimeout(()=>{timedOut=true;terminate();},options.timeoutMs??300000);
 try{
  const closed=new Promise<number|null>((resolve,reject)=>{child.once('error',reject);child.once('close',resolve);});
  const code=await Promise.race([closed,failedTermination]);
  if(control.canceled||timedOut)terminate();
  // A close from the wrapper is independent of the descendant termination promise.
  if(termination)await termination;
  if(terminationFailure)throw terminationFailure;
  return{code,stderr,timedOut};
 }catch(error){if(termination)await termination;if(terminationFailure)throw terminationFailure;throw error;}finally{clearInterval(poll);clearTimeout(timeout);}
}
