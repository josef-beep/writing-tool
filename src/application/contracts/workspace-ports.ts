import type {WorkspaceUnitSnapshot,WorkspaceReceipt,AssetData,Owner,WorkspaceRecord,UnitMutation} from './workspace';
export type WorkspaceCommit={expectedGeneration:string;records:WorkspaceRecord[];manuscripts:Record<string,string>;counters:{event:string;decision:string;story:string;chapter:string};assets:AssetData[]};
export type WorkspaceOperationRequest={protocolVersion:1;command:'workspace.mutate';submittedEditorRevision:string;units:UnitMutation[]}|{protocolVersion:1;command:'workspace.asset.import';owner:Owner;expectedGeneration:string;asset:AssetData}|{protocolVersion:1;command:'workspace.restore';submittedEditorRevision:string;plans:{owner:Owner;plan:WorkspaceCommit}[]};
export type WorkspaceCapture={snapshot:WorkspaceUnitSnapshot;files:{relativePath:string;base64:string;sha256:string}[]};
export interface WorkspaceUnitPort {
 snapshot():WorkspaceUnitSnapshot;
 hasIdentity(id:string):boolean;
 receipt(operationId:string,digest?:string):WorkspaceReceipt|undefined;
 commit(operationId:string,digest:string,plan:WorkspaceCommit,receipt:WorkspaceReceipt,request:WorkspaceOperationRequest):WorkspaceReceipt;
 recover():void;
 readAsset(id:string):AssetData;
 capture():WorkspaceCapture;
}
export interface WorkspacePublicationPort {
 assertUnreferenced(universeId:string,removedIds:string[],validatedProjectIds:string[]):void;
 receipt(operationId:string,digest?:string):WorkspaceReceipt|undefined;
 commit(operationId:string,digest:string,plans:{owner:Owner;plan:WorkspaceCommit}[],receipt:WorkspaceReceipt,request:WorkspaceOperationRequest):WorkspaceReceipt;
 recover(operationId:string):void;
}
