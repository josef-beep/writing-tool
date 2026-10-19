import type {ProtectionHostRequest,ProtectionResult} from '../application/contracts/protection';
import {validProtectionResult,protectionOperationId,protectionHasDurableEffects} from '../application/contracts/protection';
export const protectionUnavailable=(r:ProtectionHostRequest):ProtectionResult=>({protocolVersion:1,requestId:r.requestId,command:r.command,status:'error',message:protectionHasDurableEffects(r)?'The protection outcome is unconfirmed. Retain this operation and reconcile before closing.':'The protection service did not answer. Retry the read or reopen the saved owning roots.',outcome:protectionHasDurableEffects(r)?'unknown':'not-committed',operationId:protectionHasDurableEffects(r)?protectionOperationId(r):null});
export class ProtectionHostClient{
 private pending=new Map<string,{request:ProtectionHostRequest;resolve:(r:ProtectionResult)=>void}>();
 constructor(private host:{postMessage(v:unknown):void}|undefined){}
 request(request:ProtectionHostRequest):Promise<ProtectionResult>{if(!this.host)return Promise.resolve(protectionUnavailable(request));return new Promise(resolve=>{this.pending.set(request.requestId,{request,resolve});try{this.host!.postMessage(request);}catch{this.fail();}});}
 receive(v:unknown){if(typeof v!=='object'||!v||!('requestId'in v))return;const p=this.pending.get(String(v.requestId));if(!p)return;if(!validProtectionResult(v,p.request)){this.fail();return;}this.pending.delete(p.request.requestId);p.resolve(v);}
 fail(){this.host=undefined;for(const p of this.pending.values())p.resolve(protectionUnavailable(p.request));this.pending.clear();}
}
