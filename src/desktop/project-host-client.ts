import {type ProjectHostRequest,type ProjectHostResult,type ProjectResult,validProjectResult} from '../application/contracts/project';
export function projectUnavailable(request: {requestId:string;command: ProjectResult['command']}): ProjectResult {
    return {protocolVersion:1,requestId:request.requestId,command:request.command,status:'error',code:'HOST_UNAVAILABLE',message:'The host did not confirm the project operation. Reopen its folder before continuing.',outcome:request.command==='project.create'?'unknown':'not-committed',retry:'after-recovery'};
}
export class ProjectHostClient {
    private pending=new Map<string,{request:ProjectHostRequest;resolve:(r:ProjectHostResult)=>void;timer:ReturnType<typeof setTimeout>}>();
    private failed=false;
    constructor(private host:{postMessage(data:unknown):void}|undefined) {this.failed=!host;}
    request(request:ProjectHostRequest):Promise<ProjectHostResult> {
        if(this.failed || this.pending.size>=32 || this.pending.has(request.requestId)) return Promise.resolve({...projectUnavailable(request),outcome:'not-committed'} as ProjectResult);
        return new Promise(resolve=>{
            const timer=setTimeout(()=>{this.fail();},15000);
            this.pending.set(request.requestId,{request,resolve,timer});
            try {this.host!.postMessage(request);} catch {this.fail();}
        });
    }
    receive(value:unknown):void {
        if(typeof value!=='object'||value===null||!('requestId' in value)||typeof value.requestId!=='string') {this.fail();return;}
        const p=this.pending.get(value.requestId);
        if(!p) return;
        if(!validProjectResult(value,p.request,true)) {this.fail();return;}
        clearTimeout(p.timer);this.pending.delete(value.requestId);p.resolve(value);
    }
    fail():void {this.failed=true;for(const p of this.pending.values()){clearTimeout(p.timer);p.resolve(projectUnavailable(p.request));}this.pending.clear();}
}
