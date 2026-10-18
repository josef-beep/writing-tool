import fs from 'node:fs';
import path from 'node:path';
import type {Owner} from '../domain/workspace';
import {validOwner} from '../application/contracts/workspace';
import {closed,isUuid} from '../domain/validation';
import {decode,readManaged,publishManagedBytes,ensureManagedDirectory,hash,jsonBytes} from './universe-files';
export type RecentRoot={id:string;owner:Owner;rootId:string;name:string;location:string};
export class RecentRoots{
 private relative='protection/recent-roots.json';
 constructor(private userData:string){ensureManagedDirectory(userData,'protection');}
 list():RecentRoot[]{if(!fs.existsSync(path.join(this.userData,this.relative)))return[];const value=decode(readManaged(this.userData,this.relative));if(!Array.isArray(value)||!value.every(v=>closed(v,['id','owner','rootId','name','location'])&&isUuid(v.id)&&validOwner(v.owner)&&isUuid(v.rootId)&&typeof v.name==='string'&&typeof v.location==='string'&&path.isAbsolute(v.location)))throw new Error('Recent-root metadata is invalid.');return value;}
 private save(v:RecentRoot[]){const old=fs.existsSync(path.join(this.userData,this.relative))?hash(readManaged(this.userData,this.relative)):null;publishManagedBytes(this.userData,this.relative,Buffer.from(jsonBytes(v)),old);}
 remember(owner:Owner,rootId:string,name:string,location:string){this.save([{id:owner.id,owner,rootId,name,location},...this.list().filter(r=>r.id!==owner.id)]);}
 remove(id:string){this.save(this.list().filter(r=>r.id!==id));}
 available(r:RecentRoot):boolean{try{const d=decode(readManaged(r.location,'writingtool.json')) as {id:string;rootId:string};return d.id===r.owner.id&&d.rootId===r.rootId;}catch{return false;}}
}
