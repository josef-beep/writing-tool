import fs from 'node:fs';
import path from 'node:path';
import {randomUUID} from 'node:crypto';
import {type AppSettings,SETTINGS_ID,validAppSettings} from '../application/contracts/workspace';
export {SETTINGS_ID,validAppSettings} from '../application/contracts/workspace';
import {closed,isUuid} from '../domain/validation';
import {positiveInteger,scalarText,signedInteger,unsignedInteger} from '../domain/calendar';
import {UniverseFailure} from '../application/universe';
import {decode,hash,jsonBytes,readManaged,publishManagedBytes,ensureManagedDirectory} from './universe-files';
const fields=['schemaVersion','id','recordVersion','autosaveMinutes','revisionMinutes','backupMinutes','retentionDays','backupDestination','theme','fontFamily','fontSize','panels'];
export const defaultSettings=():AppSettings=>({schemaVersion:1,id:SETTINGS_ID,recordVersion:randomUUID(),autosaveMinutes:'5',revisionMinutes:'10',backupMinutes:'10',retentionDays:'30',backupDestination:null,theme:'dark',fontFamily:'system-ui, sans-serif',fontSize:'16',panels:[]});
export class SettingsStorage {
 readonly relative=`settings/${SETTINGS_ID}.json`;
 constructor(private userData:string,private gate:<T>(fn:()=>T)=>T=fn=>fn()){ensureManagedDirectory(userData,'settings');this.gate(()=>{if(!fs.existsSync(path.join(userData,this.relative)))publishManagedBytes(userData,this.relative,Buffer.from(jsonBytes(defaultSettings())),null);});}
 get():AppSettings{const v=decode(readManaged(this.userData,this.relative));if(!validAppSettings(v))throw new UniverseFailure('UNSUPPORTED_VERSION','The app settings are invalid or use an unsupported schema.');return v;}
 save(values:AppSettings,expectedVersion:string):AppSettings{return this.gate(()=>this.saveLocked(values,expectedVersion));}
 private saveLocked(values:AppSettings,expectedVersion:string):AppSettings{if(!validAppSettings(values))throw new UniverseFailure('VALIDATION','Settings contain invalid fields or intervals.');const before=readManaged(this.userData,this.relative),current=this.get();if(current.recordVersion!==expectedVersion)throw new UniverseFailure('GENERATION_CONFLICT','Settings changed. Reopen the form before saving.');const next={...values,recordVersion:randomUUID()};try{publishManagedBytes(this.userData,this.relative,Buffer.from(jsonBytes(next)),hash(before));return next;}catch{throw new UniverseFailure('RECOVERY_REQUIRED','Settings publication could not be confirmed. Read settings again before retrying.','unknown');}}
 import(value:unknown):{settings:AppSettings;warnings:string[]}{if(typeof value!=='object'||!value||Array.isArray(value))throw new UniverseFailure('VALIDATION','Settings import requires a JSON object.');const supplied=value as Record<string,unknown>,current=this.get(),next={...current};const warnings=Object.keys(supplied).filter(k=>!fields.includes(k)).map(k=>`Ignored unknown settings field: ${k}`);for(const k of fields)if(Object.hasOwn(supplied,k))(next as Record<string,unknown>)[k]=supplied[k];if(!validAppSettings(next))throw new UniverseFailure('VALIDATION','A known settings field is invalid. No imported values were applied.');return{settings:this.save({...next,recordVersion:current.recordVersion},current.recordVersion),warnings};}
}
