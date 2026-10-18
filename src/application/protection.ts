import type {ProtectionHostRequest,ProtectionValue} from './contracts/protection';
/** Native capture/publication mechanisms are composed by the utility host. */
export interface ProtectionPort{readonly busy:boolean;execute(request:ProtectionHostRequest):Promise<ProtectionValue>;cancel(operationId:string):boolean}
export class ProtectionApplication{
 constructor(private port:ProtectionPort){}
 get busy(){return this.port.busy;}
 execute(request:ProtectionHostRequest){return this.port.execute(request);}
 cancel(operationId:string){return this.port.cancel(operationId);}
}
