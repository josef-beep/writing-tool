import type {WorkspaceSnapshot,WorkspaceChange,WorkspaceUnitSnapshot} from '../../application/contracts/workspace';
import {type WorkspaceRecord,type WorkspaceRecordType,type WorkspaceRecordOf,type WorkspaceDataMap,ownerKindForType} from '../../domain/workspace';
import {type CalendarData,type DatePosition,configuration,convertDate,displayDate} from '../../domain/calendar';
export const uuid=()=>crypto.randomUUID();
export const allRecords=(s:WorkspaceSnapshot):WorkspaceRecord[]=>[...(s.project?.records??[]),...(s.universe?.records??[])];
export const recordsOf=<K extends WorkspaceRecordType>(s:WorkspaceSnapshot,k:K):Extract<WorkspaceRecord,{recordType:K}>[]=>allRecords(s).filter((r):r is Extract<WorkspaceRecord,{recordType:K}>=>r.recordType===k);
export const unitFor=(s:WorkspaceSnapshot,r:Pick<WorkspaceRecord,'owner'>):WorkspaceUnitSnapshot=>{const unit=r.owner.kind==='project'?s.project:s.universe;if(!unit||unit.owner.id!==r.owner.id)throw new Error('The owning workspace is no longer active.');return unit;};
export const currentCalendar=(s:WorkspaceSnapshot):CalendarData|null=>recordsOf(s,'calendar')[0]?.data??null;
export function dateLabel(d:DatePosition|null,c:CalendarData|null):string {if(!d)return 'Undated';if(!c)return 'Calendar unavailable';try{return displayDate(convertDate(d,c),c);}catch{return 'Calendar format unavailable';}}
export const firstDate=(c:CalendarData|null):DatePosition=>{if(!c)throw new Error('Configure a calendar before creating dated records.');return{calendarVersion:c.currentVersion,year:configuration(c,c.currentVersion).enteredYear,day:'1'};};
export function newRecord<K extends WorkspaceRecordType>(snapshot:WorkspaceSnapshot,type:K,data:WorkspaceDataMap[K]):WorkspaceRecordOf<K>{const owner=ownerKindForType(type)==='project'?snapshot.project?.owner:snapshot.universe?.owner;if(!owner||!snapshot.universe)throw new Error('Open the owning project or universe first.');return{schemaVersion:1,id:uuid(),recordVersion:uuid(),owner,universeId:snapshot.universe.owner.id,recordType:type,data};}
export function createRecord(snapshot:WorkspaceSnapshot,type:WorkspaceRecordType,storyId?:string):WorkspaceRecord {
 const c=currentCalendar(snapshot),named={name:''},text='';
 switch(type){
 case 'story':return newRecord(snapshot,type,{title:'',creationSequence:'0',order:nextOrder(recordsOf(snapshot,type)),volumeId:null,chapterTarget:null});
 case 'volume':return newRecord(snapshot,type,{title:'',order:nextOrder(recordsOf(snapshot,type))});
 case 'chapter':{if(!storyId)throw new Error('Select or create a story first.');const record=newRecord(snapshot,type,{title:'',storyId,creationSequence:'0',start:null,end:null,characterIds:[],events:[],wordTarget:'2500',calendarUpdateRequired:false,formatting:{formatVersion:1,chapterId:'',recordVersion:'',text:{relativePath:'',sha256:'0'.repeat(64),byteLength:'0',scalarLength:'0'},paragraphs:[{id:uuid(),start:'0',end:'0',indent:'0',kind:'body',marks:[]}]}});record.data.formatting.chapterId=record.id;record.data.formatting.recordVersion=record.recordVersion;record.data.formatting.text.relativePath=`chapters/${record.id}.wrt`;return record;}
 case 'plot':if(!storyId)throw new Error('Select or create a story first.');return newRecord(snapshot,type,{storyId,heading:'',date:null,order:'0'});
 case 'event':return newRecord(snapshot,type,{heading:'',description:null,date:firstDate(c),code:'',order:'0',maker:null,kind:'ordinary',characterId:null});
 case 'decision':return newRecord(snapshot,type,{text:'',date:firstDate(c),code:'',order:'0',typeId:recordsOf(snapshot,'decision-type').find(t=>t.data.builtin==='story')?.id??'',maker:null,characterIds:[],eventIds:[],followingDecisionIds:[]});
 case 'decision-type':return newRecord(snapshot,type,{name:'',makerRequired:false,builtin:null});
 case 'character':return newRecord(snapshot,type,{...named,type:'extra',rankTitle:text,background:text,description:text,motivation:text,weaknesses:text,strengths:text,specialities:text,waivers:[],personalities:[],image:null,birth:null,birthEventId:null});
 case 'faction':return newRecord(snapshot,type,{...named,description:text,image:null,governmentType:text,governmentNotes:text,leaderImage:null,leaderName:text,leaderAge:text,leaderReputation:text,leaderProfile:text,militaryHead:text,intelligenceHead:text,overview:text,strengths:text,weaknesses:text,population:text,resources:text,culture:text,locations:[],military:[]});
 case 'affiliation':return newRecord(snapshot,type,{characterId:'',date:firstDate(c),order:'0',factionId:null});
 case 'view':return newRecord(snapshot,type,{makers:[],categories:[]});
 case 'decision-context':return newRecord(snapshot,type,{storyId:storyId??'',decisionId:''});
 case 'calendar':{const id=uuid();return newRecord(snapshot,type,{currentVersion:id,anchor:{year:'0',day:'1'},versions:[{id,elements:[],daysOnly:'',actualDays:'',targetDays:'',enteredYear:'0',yearNames:[]}]});}
 }
}
export function nextOrder(rs:readonly {data:{order:string}}[]):string{return(rs.reduce((n,r)=>BigInt(r.data.order)>n?BigInt(r.data.order):n,-1n)+1n).toString();}
export const putChange=(s:WorkspaceSnapshot,r:WorkspaceRecord,manuscript:string|null=null):WorkspaceChange=>({action:'put',record:r,expectedRecordVersion:allRecords(s).find(x=>x.id===r.id)?.recordVersion??null,manuscript});
export const recordLabel=(r:WorkspaceRecord):string=>{switch(r.recordType){case 'story':case 'volume':case 'chapter':return r.data.title||'Untitled';case 'event':case 'plot':return r.data.heading||'Untitled';case 'decision':return r.data.text||'Untitled decision';case 'character':case 'faction':case 'decision-type':return r.data.name||'Unnamed';default:return r.recordType;}};
