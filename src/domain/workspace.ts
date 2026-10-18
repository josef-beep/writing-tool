import { closed, isUuid } from './validation';
import { type CalendarData, type DatePosition, type BirthComponents, validCalendarData, validDatePosition, scalarText, unsignedInteger, signedInteger, elapsedPosition, compareDates, birthPosition } from './calendar';
import { type ChapterFormatting, validChapterFormatting } from './manuscript';
import { PERSONALITY_LABELS, type PersonalityLabel } from './personality';
import { canonicalCodeKey, trimmedCode } from './code-fold';
export { canonicalCodeKey, trimmedCode, PERSONALITY_LABELS };
export type Owner = {kind: 'project' | 'universe'; id: string};
export type ManagedImage = {id: string; sha256: string; mediaType: 'image/png'|'image/jpeg'|'image/webp'};
export type Maker = {kind: 'character'|'faction'; id: string};
export type StoryData = {title: string; creationSequence: string; order: string; volumeId: string|null; chapterTarget: string|null};
export type VolumeData = {title: string; order: string};
export type ChapterData = {title: string; storyId: string; creationSequence: string; start: DatePosition|null; end: DatePosition|null; characterIds: string[]; events: {eventId: string; role: 'main'|'flashback'}[]; wordTarget: string|null; calendarUpdateRequired: boolean; formatting: ChapterFormatting};
export type PlotData = {calendarUpdateRequired?:boolean; storyId: string; heading: string; date: DatePosition|null; order: string};
export type EventData = {calendarUpdateRequired?:boolean; heading: string; description: string|null; date: DatePosition; code: string; order: string; maker: Maker|null; kind: 'ordinary'|'birth'|'background'; characterId: string|null};
export type DecisionData = {calendarUpdateRequired?:boolean; text: string; date: DatePosition; typeId: string; code: string; order: string; maker: Maker|null; characterIds: string[]; eventIds: string[]; followingDecisionIds: string[]};
export type DecisionTypeData = {name: string; makerRequired: boolean; builtin: 'personal'|'story'|null};
export type CharacterField = 'rankTitle'|'background'|'description'|'motivation'|'weaknesses'|'strengths'|'specialities';
export type CharacterData = {calendarUpdateRequired?:boolean; name: string; type: 'main'|'major'|'minor'|'extra'; rankTitle: string; background: string; description: string; motivation: string; weaknesses: string; strengths: string; specialities: string; waivers: CharacterField[]; personalities: PersonalityLabel[]; image: ManagedImage|null; birth: BirthComponents|null; birthEventId: string|null};
export type MilitaryUnit = {name: string; role: string; description: string; baseStrength: string|null; movementPoints: string|null; baseModifierPoints: string|null};
export type FactionData = {name: string; description: string; image: ManagedImage|null; governmentType: string; governmentNotes: string; leaderImage: ManagedImage|null; leaderName: string; leaderAge: string; leaderReputation: string; leaderProfile: string; militaryHead: string; intelligenceHead: string; overview: string; strengths: string; weaknesses: string; population: string; resources: string; culture: string; locations: {name: string; notes: string}[]; military: MilitaryUnit[]};
export type AffiliationData = {calendarUpdateRequired?:boolean; characterId: string; date: DatePosition; order: string; factionId: string|null};
export type VisibilityCategory = {kind:'events'} | {kind:'decision-type'; id:string};
export type ViewData = {makers: (Maker|{kind:'none'})[]; categories: VisibilityCategory[]};
export type WorkspaceDataMap = {story: StoryData; volume: VolumeData; chapter: ChapterData; plot: PlotData; 'decision-context': {storyId:string; decisionId:string}; calendar: CalendarData; event: EventData; decision: DecisionData; 'decision-type':DecisionTypeData; character:CharacterData; faction:FactionData; affiliation:AffiliationData; view:ViewData};
export type WorkspaceRecordType = keyof WorkspaceDataMap;
export type WorkspaceRecordOf<K extends WorkspaceRecordType> = {schemaVersion:1; recordType:K; id:string; owner:Owner; universeId:string; recordVersion:string; data:WorkspaceDataMap[K]};
export type WorkspaceRecord = {[K in WorkspaceRecordType]:WorkspaceRecordOf<K>}[WorkspaceRecordType];
export const recordCategory: Record<WorkspaceRecordType,string> = {story:'stories',volume:'volumes',chapter:'chapters',plot:'plots','decision-context':'decision-context',calendar:'calendars',event:'events',decision:'decisions','decision-type':'decision-types',character:'characters',faction:'factions',affiliation:'affiliations',view:'views'};
export const ownerKindForType = (type:WorkspaceRecordType):Owner['kind'] => ['story','volume','chapter','plot','decision-context'].includes(type) ? 'project' : 'universe';
export class WorkspaceValidationError extends Error { constructor(message:string, public readonly field = '') { super(message); this.name = 'WorkspaceValidationError'; } }
const fail = (message:string, field=''):never => {throw new WorkspaceValidationError(message,field);};
const named = (v:unknown):v is string => scalarText(v) && !!v.trim();
const nullable = <T>(v:unknown, f:(v:unknown)=>v is T):v is T|null => v === null || f(v);
const ids = (v:unknown):v is string[] => Array.isArray(v) && v.every(isUuid) && new Set(v).size === v.length;
const texts = (v:Record<string,unknown>, fields:string[]):boolean => fields.every(k => scalarText(v[k]));
const maker = (v:unknown):v is Maker => closed(v,['kind','id']) && (v.kind === 'character' || v.kind === 'faction') && isUuid(v.id);
const image = (v:unknown):v is ManagedImage => closed(v,['id','sha256','mediaType']) && isUuid(v.id) && typeof v.sha256 === 'string' && /^[0-9a-f]{64}$/.test(v.sha256) && ['image/png','image/jpeg','image/webp'].includes(v.mediaType as string);
const code = (v:unknown):v is string => scalarText(v) && !!trimmedCode(v) && v === trimmedCode(v);
const exactDecimal = (v:unknown, signed:boolean):boolean => typeof v === 'string' && (signed ? /^(?:0|-?[1-9][0-9]*)(?:\.[0-9]+)?$|^-0\.[0-9]*[1-9][0-9]*$/ : /^(?:0|[1-9][0-9]*)(?:\.[0-9]+)?$/).test(v);
const CHARACTER_FIELDS:CharacterField[] = ['rankTitle','background','description','motivation','weaknesses','strengths','specialities'];
const FACTION_TEXT = ['description','governmentType','governmentNotes','leaderName','leaderAge','leaderReputation','leaderProfile','militaryHead','intelligenceHead','overview','strengths','weaknesses','population','resources','culture'];
const flagKeys=(v:unknown):string[]=>typeof v==='object'&&v!==null&&Object.hasOwn(v,'calendarUpdateRequired')?['calendarUpdateRequired']:[];
const calendarFlag=(v:unknown):boolean=>!flagKeys(v).length||typeof (v as {calendarUpdateRequired:unknown}).calendarUpdateRequired==='boolean';
export function validWorkspaceData<K extends WorkspaceRecordType>(type:K,v:unknown):v is WorkspaceDataMap[K] {
    switch(type) {
    case 'story': return closed(v,['title','creationSequence','order','volumeId','chapterTarget']) && named(v.title) && unsignedInteger(v.creationSequence) && unsignedInteger(v.order) && nullable(v.volumeId,isUuid) && nullable(v.chapterTarget,unsignedInteger);
    case 'volume': return closed(v,['title','order']) && named(v.title) && unsignedInteger(v.order);
    case 'chapter': return closed(v,['title','storyId','creationSequence','start','end','characterIds','events','wordTarget','calendarUpdateRequired','formatting']) && scalarText(v.title) && isUuid(v.storyId) && unsignedInteger(v.creationSequence) && nullable(v.start,validDatePosition) && nullable(v.end,validDatePosition) && ids(v.characterIds) && Array.isArray(v.events) && v.events.every(e => closed(e,['eventId','role']) && isUuid(e.eventId) && ['main','flashback'].includes(e.role as string)) && new Set(v.events.map(e => e.eventId)).size === v.events.length && nullable(v.wordTarget,unsignedInteger) && typeof v.calendarUpdateRequired === 'boolean' && validChapterFormatting(v.formatting);
    case 'plot': return calendarFlag(v) && closed(v,[...flagKeys(v),'storyId','heading','date','order']) && isUuid(v.storyId) && named(v.heading) && nullable(v.date,validDatePosition) && unsignedInteger(v.order);
    case 'decision-context':return closed(v,['storyId','decisionId']) && isUuid(v.storyId) && isUuid(v.decisionId);
    case 'calendar':return validCalendarData(v);
    case 'event':return calendarFlag(v) && closed(v,[...flagKeys(v),'heading','description','date','code','order','maker','kind','characterId']) && named(v.heading) && nullable(v.description,scalarText) && validDatePosition(v.date) && code(v.code) && unsignedInteger(v.order) && nullable(v.maker,maker) && ['ordinary','birth','background'].includes(v.kind as string) && nullable(v.characterId,isUuid) && (v.kind === 'ordinary' ? v.characterId === null : v.characterId !== null);
    case 'decision':return calendarFlag(v) && closed(v,[...flagKeys(v),'text','date','typeId','code','order','maker','characterIds','eventIds','followingDecisionIds']) && named(v.text) && validDatePosition(v.date) && isUuid(v.typeId) && code(v.code) && unsignedInteger(v.order) && nullable(v.maker,maker) && ids(v.characterIds) && ids(v.eventIds) && ids(v.followingDecisionIds);
    case 'decision-type':return closed(v,['name','makerRequired','builtin']) && named(v.name) && v.name === v.name.trim() && typeof v.makerRequired === 'boolean' && (v.builtin === null || v.builtin === 'personal' && v.name === 'Personal Decisions' && v.makerRequired || v.builtin === 'story' && v.name === 'Story Decisions' && !v.makerRequired);
    case 'character':return calendarFlag(v) && closed(v,[...flagKeys(v),'name','type',...CHARACTER_FIELDS,'waivers','personalities','image','birth','birthEventId']) && named(v.name) && ['main','major','minor','extra'].includes(v.type as string) && texts(v,CHARACTER_FIELDS) && Array.isArray(v.waivers) && v.waivers.every(w => CHARACTER_FIELDS.includes(w as CharacterField)) && new Set(v.waivers).size === v.waivers.length && Array.isArray(v.personalities) && v.personalities.every(p => (PERSONALITY_LABELS as readonly unknown[]).includes(p)) && new Set(v.personalities).size === v.personalities.length && nullable(v.image,image) && (v.birth === null || closed(v.birth,['year','elementId','day']) && signedInteger(v.birth.year) && nullable(v.birth.elementId,isUuid) && (v.birth.day === null || unsignedInteger(v.birth.day) && v.birth.day !== '0')) && nullable(v.birthEventId,isUuid) && (v.birth === null) === (v.birthEventId === null);
    case 'faction':return closed(v,['name',...FACTION_TEXT,'image','leaderImage','locations','military']) && named(v.name) && texts(v,FACTION_TEXT) && nullable(v.image,image) && nullable(v.leaderImage,image) && Array.isArray(v.locations) && v.locations.every(l => closed(l,['name','notes']) && scalarText(l.name) && scalarText(l.notes)) && Array.isArray(v.military) && v.military.every(m => closed(m,['name','role','description','baseStrength','movementPoints','baseModifierPoints']) && texts(m,['name','role','description']) && [m.baseStrength,m.movementPoints].every(n => n === null || exactDecimal(n,false)) && (m.baseModifierPoints === null || exactDecimal(m.baseModifierPoints,true)));
    case 'affiliation':return calendarFlag(v) && closed(v,[...flagKeys(v),'characterId','date','order','factionId']) && isUuid(v.characterId) && validDatePosition(v.date) && unsignedInteger(v.order) && nullable(v.factionId,isUuid);
    case 'view':return closed(v,['makers','categories']) && Array.isArray(v.makers) && v.makers.every(m => maker(m) || closed(m,['kind']) && m.kind === 'none') && Array.isArray(v.categories) && v.categories.every(c => closed(c,['kind']) && c.kind === 'events' || closed(c,['kind','id']) && c.kind === 'decision-type' && isUuid(c.id)) && new Set(v.makers.map(m => JSON.stringify(m))).size === v.makers.length && new Set(v.categories.map(c => JSON.stringify(c))).size === v.categories.length;
    default:return false;
    }
}
export function validateWorkspaceRecord(v:unknown):v is WorkspaceRecord {
    if (!closed(v,['schemaVersion','recordType','id','owner','universeId','recordVersion','data']) || v.schemaVersion !== 1 || typeof v.recordType !== 'string' || !Object.hasOwn(recordCategory,v.recordType) || !isUuid(v.id) || !isUuid(v.universeId) || !isUuid(v.recordVersion) || !closed(v.owner,['kind','id']) || !isUuid(v.owner.id) || v.owner.kind !== ownerKindForType(v.recordType as WorkspaceRecordType) || v.owner.kind === 'universe' && v.owner.id !== v.universeId || !validWorkspaceData(v.recordType as WorkspaceRecordType,v.data)) return false;
    if(v.recordType === 'chapter') {const f = (v.data as ChapterData).formatting; return f.chapterId === v.id && f.recordVersion === v.recordVersion; } return true;
}
/** Validate the complete candidate closure, including the project's authoritative universe. */
export function assertWorkspaceState(records:readonly WorkspaceRecord[]):void {
    const map = new Map<string,WorkspaceRecord>();
    for(const r of records) {if(!validateWorkspaceRecord(r)) fail('Invalid closed workspace record.'); if(map.has(r.id)) fail('Duplicate permanent identity.'); map.set(r.id,r);}
    const calendars = records.filter((r):r is WorkspaceRecordOf<'calendar'> => r.recordType === 'calendar');
    const calendarFor = (r:WorkspaceRecord):CalendarData => {const found=calendars.filter(c=>c.universeId===r.universeId); if(found.length!==1) return fail('Exactly one authoritative calendar is required for dated content.'); return found[0].data;};
    const ref = (r:WorkspaceRecord,id:string,type:WorkspaceRecordType,project=false):WorkspaceRecord => {const target=map.get(id); if(!target || target.recordType!==type || target.universeId!==r.universeId || project && (target.owner.kind!==r.owner.kind || target.owner.id!==r.owner.id)) return fail('Missing or foreign record reference.',id); return target;};
    const keys=new Set<string>(), typeNames=new Set<string>(), builtin=new Set<string>(), contexts=new Set<string>();
    const date=(r:WorkspaceRecord,d:DatePosition|null):void=>{if(d) elapsedPosition(d,calendarFor(r));};
    for(const r of records) {
        const d=r.data;
        switch(r.recordType) {
        case 'calendar':if(r.data.versions.some(c=>c.targetDays!==c.actualDays))fail('Saved calendar target must equal its actual length.');if(calendars.filter(c=>c.universeId===r.universeId).length!==1) fail('Only one calendar per universe is permitted.'); break;
        case 'story':if(r.data.volumeId)ref(r,r.data.volumeId,'volume',true);break;
        case 'chapter': {const c=r.data;ref(r,c.storyId,'story',true);c.characterIds.forEach(id=>ref(r,id,'character'));c.events.forEach(e=>ref(r,e.eventId,'event'));date(r,c.start);date(r,c.end);if(c.start&&c.end&&compareDates(c.end,c.start,calendarFor(r))<0)fail('Chapter end must be corrected to start.');break;}
        case 'plot':ref(r,r.data.storyId,'story',true);date(r,r.data.date);break;
        case 'decision-context':{ref(r,r.data.storyId,'story',true);ref(r,r.data.decisionId,'decision');const k=`${r.owner.id}/${r.data.storyId}/${r.data.decisionId}`;if(contexts.has(k))fail('Duplicate story decision relevance.');contexts.add(k);break;}
        case 'event':case 'decision': {
            const e = r.data; date(r,e.date);const key=`${r.universeId}/${canonicalCodeKey(e.code)}`;if(keys.has(key))fail('Timeline code is already in use.','code');keys.add(key);if(e.maker)ref(r,e.maker.id,e.maker.kind);
            if(r.recordType==='event') {if(r.data.characterId)ref(r,r.data.characterId,'character');if(r.data.kind==='birth') {const c=ref(r,r.data.characterId!,'character') as WorkspaceRecordOf<'character'>;if(c.data.birthEventId!==r.id || !c.data.birth || c.data.birth.year!==r.data.date.year)fail('Canonical birth association is inconsistent.');}}
            else {const decision=r.data, t=ref(r,decision.typeId,'decision-type') as WorkspaceRecordOf<'decision-type'>;if(t.data.makerRequired&&!decision.maker)fail('This decision type requires a maker.','maker');decision.characterIds.forEach(id=>ref(r,id,'character'));for(const id of decision.eventIds){const target=ref(r,id,'event') as WorkspaceRecordOf<'event'>;if(compareDates(target.data.date,decision.date,calendarFor(r))<0)fail('Result event predates its source decision.');}for(const id of decision.followingDecisionIds){const target=ref(r,id,'decision') as WorkspaceRecordOf<'decision'>;if(id===r.id||compareDates(target.data.date,decision.date,calendarFor(r))<0)fail('Invalid following decision date or self-link.');}}
            break;
        }
        case 'decision-type': {const t=r.data,k=`${r.universeId}/${canonicalCodeKey(t.name)}`;if(typeNames.has(k))fail('Decision type names must be unique.');typeNames.add(k);if(t.builtin){const b=`${r.universeId}/${t.builtin}`;if(builtin.has(b))fail('Duplicate built-in decision type.');builtin.add(b);}break;}
        case 'character':if(r.data.birthEventId){const e=ref(r,r.data.birthEventId,'event') as WorkspaceRecordOf<'event'>;if(e.data.kind!=='birth'||e.data.characterId!==r.id||e.data.date.year!==r.data.birth!.year)fail('Birth event must be the character’s canonical birth.');}break;
        case 'affiliation':ref(r,r.data.characterId,'character');if(r.data.factionId)ref(r,r.data.factionId,'faction');date(r,r.data.date);break;
        case 'view':if(records.filter(x=>x.recordType==='view'&&x.universeId===r.universeId).length>1)fail('Only one synchronized visibility configuration is permitted per universe.');for(const m of r.data.makers)if(m.kind!=='none')ref(r,m.id,m.kind);for(const c of r.data.categories)if(c.kind==='decision-type')ref(r,c.id,'decision-type');break;
        }
        void d;
    }
    const done=new Set<string>(),visiting=new Set<string>();
    const visit=(id:string):void=>{if(visiting.has(id))fail('Decision result graph contains a cycle.');if(done.has(id))return;visiting.add(id);const r=map.get(id) as WorkspaceRecordOf<'decision'>;r.data.followingDecisionIds.forEach(visit);visiting.delete(id);done.add(id);};
    records.filter(r=>r.recordType==='decision').forEach(r=>visit(r.id));
}
export const decisionResolved = (d:DecisionData):boolean => d.eventIds.length+d.followingDecisionIds.length>0;
const exactCompare=(a:string,b:string):number=>BigInt(a)<BigInt(b)?-1:BigInt(a)>BigInt(b)?1:0;
export function compareOptionalDates(a:DatePosition|null,b:DatePosition|null,c:CalendarData|null):number {return a===null?(b===null?0:-1):b===null?1:c?compareDates(a,b,c):fail('A calendar is required for dated ordering.');}
export function orderedChapters(chapters:readonly WorkspaceRecordOf<'chapter'>[],calendar:CalendarData|null=null):WorkspaceRecordOf<'chapter'>[] {return [...chapters].sort((a,b)=>compareOptionalDates(a.data.start,b.data.start,calendar)||exactCompare(a.data.creationSequence,b.data.creationSequence)||a.id.localeCompare(b.id));}
export function orderedPlots(plots:readonly WorkspaceRecordOf<'plot'>[],calendar:CalendarData|null=null):WorkspaceRecordOf<'plot'>[] {return [...plots].sort((a,b)=>compareOptionalDates(a.data.date,b.data.date,calendar)||exactCompare(a.data.order,b.data.order)||a.id.localeCompare(b.id));}
export function orderedDated<K extends 'event'|'decision'|'affiliation'>(records:readonly WorkspaceRecordOf<K>[],calendar:CalendarData):WorkspaceRecordOf<K>[] {return [...records].sort((a,b)=>compareDates(a.data.date,b.data.date,calendar)||exactCompare(a.data.order,b.data.order)||a.id.localeCompare(b.id));}
export function nextGroupOrder(records:readonly {data:{date:DatePosition|null;order:string}}[],date:DatePosition|null,calendar:CalendarData):string {let max=-1n;for(const r of records)if(compareOptionalDates(r.data.date,date,calendar)===0&&BigInt(r.data.order)>max)max=BigInt(r.data.order);return(max+1n).toString();}
export function affiliationHistory(records:readonly WorkspaceRecordOf<'affiliation'>[],calendar:CalendarData):{record:WorkspaceRecordOf<'affiliation'>;previousFactionId:string|null;factionId:string|null}[] {let previous:string|null=null;return orderedDated(records,calendar).map(record=>{const entry={record,previousFactionId:previous,factionId:record.data.factionId};previous=record.data.factionId;return entry;});}
export function visibleRecord(record:WorkspaceRecordOf<'event'>|WorkspaceRecordOf<'decision'>,view:ViewData):boolean {const m=record.data.maker;return (!view.makers.length||view.makers.some(f=>m?f.kind!=='none'&&f.kind===m.kind&&f.id===m.id:f.kind==='none'))&&(!view.categories.length||view.categories.some(c=>record.recordType==='event'?c.kind==='events':c.kind==='decision-type'&&c.id===record.data.typeId));}
export function writingContextDecisions(decisions:readonly WorkspaceRecordOf<'decision'>[],contexts:readonly WorkspaceRecordOf<'decision-context'>[],storyId:string,chapterCharacters:readonly string[]):WorkspaceRecordOf<'decision'>[] {const story=new Set(contexts.filter(c=>c.data.storyId===storyId).map(c=>c.data.decisionId));return decisions.filter(d=>story.has(d.id)||d.data.characterIds.some(id=>chapterCharacters.includes(id)));}
export function characterCompleteness(character:WorkspaceRecordOf<'character'>,events:readonly WorkspaceRecordOf<'event'>[]):Record<'name'|CharacterField,'answered'|'waived'|'incomplete'|'optional'> {const c=character.data,expected:CharacterField[]=c.type==='extra'?[]:['rankTitle','description',...(c.type==='main'?['background' as const]:[])];const states={} as Record<'name'|CharacterField,'answered'|'waived'|'incomplete'|'optional'>;states.name=c.name.trim()?'answered':'incomplete';for(const f of CHARACTER_FIELDS){const answered=!!c[f].trim()||f==='background'&&events.some(e=>e.universeId===character.universeId&&e.data.kind==='background'&&e.data.characterId===character.id);states[f]=answered?'answered':c.waivers.includes(f)?'waived':expected.includes(f)?'incomplete':'optional';}return states;}
export function normalizeCharacter(character:CharacterData,hasBackgroundEvent=false):CharacterData {return {...character,waivers:character.waivers.filter(f=>!character[f].trim()&&!(f==='background'&&hasBackgroundEvent))};}
export function factionCompleteness(f:FactionData):{complete:boolean;missing:string[]} {const fields=['name',...FACTION_TEXT.filter(k=>!['population','resources','culture'].includes(k))];const missing=fields.filter(k=>!(f[k as keyof FactionData] as string).trim());if(!f.image)missing.push('image');if(!f.leaderImage)missing.push('leaderImage');return{complete:!missing.length,missing};}
export function normalizeFaction(f:FactionData):FactionData {return {...f,military:f.military.filter(m=>m.name.trim()||m.role.trim()||m.description.trim()||m.baseStrength!==null||m.movementPoints!==null||m.baseModifierPoints!==null)};}
export function synchronizedBirth(character:WorkspaceRecordOf<'character'>,event:WorkspaceRecordOf<'event'>,calendar:CalendarData,direction:'character-to-event'|'event-to-character'):{character:WorkspaceRecordOf<'character'>;event:WorkspaceRecordOf<'event'>} {if(event.data.kind!=='birth'||event.data.characterId!==character.id||character.data.birthEventId!==event.id||!character.data.birth)fail('Birth synchronization requires the canonical association.');return direction==='character-to-event'?{character,event:{...event,data:{...event.data,date:birthPosition(character.data.birth,calendar)}}}:{character:{...character,data:{...character.data,birth:{...character.data.birth,year:event.data.date.year}}},event};}

export const BUILTIN_DECISION_TYPES: readonly DecisionTypeData[] = [
    {name:'Personal Decisions',makerRequired:true,builtin:'personal'},
    {name:'Story Decisions',makerRequired:false,builtin:'story'},
];
/** Advance group position only for insertion or a real elapsed-date change. */
export function appendMovedGroupOrder<T extends {id:string;data:{date:DatePosition|null;order:string}}>(before:readonly T[],candidate:T,calendar:CalendarData):T {
    const old=before.find(r=>r.id===candidate.id);
    return !old || compareOptionalDates(old.data.date,candidate.data.date,calendar)!==0 ? {...candidate,data:{...candidate.data,order:nextGroupOrder(before.filter(r=>r.id!==candidate.id),candidate.data.date,calendar)}} : candidate;
}
/** Explicit calendar update converts display metadata while retaining elapsed chronology. */
export function updateRecordCalendar(record:WorkspaceRecord,calendar:CalendarData,convert:(date:DatePosition,calendar:CalendarData)=>DatePosition):WorkspaceRecord {
    switch(record.recordType) {
    case 'chapter':return {...record,data:{...record.data,start:record.data.start?convert(record.data.start,calendar):null,end:record.data.end?convert(record.data.end,calendar):null,calendarUpdateRequired:false}};
    case 'plot':return {...record,data:{...record.data,date:record.data.date?convert(record.data.date,calendar):null,...(Object.hasOwn(record.data,'calendarUpdateRequired')?{calendarUpdateRequired:false}:{})}};
    case 'event':return {...record,data:{...record.data,date:convert(record.data.date,calendar),...(Object.hasOwn(record.data,'calendarUpdateRequired')?{calendarUpdateRequired:false}:{})}};
    case 'decision':return {...record,data:{...record.data,date:convert(record.data.date,calendar),...(Object.hasOwn(record.data,'calendarUpdateRequired')?{calendarUpdateRequired:false}:{})}};
    case 'affiliation':return {...record,data:{...record.data,date:convert(record.data.date,calendar),...(Object.hasOwn(record.data,'calendarUpdateRequired')?{calendarUpdateRequired:false}:{})}};
    default:return record;
    }
}

export const CHARACTER_PROMPTS:Record<CharacterField,string>={rankTitle:'What rank or title does this character hold?',background:'What experiences shaped this character?',description:'How would you describe this character?',motivation:'What does this character want, and why?',weaknesses:'What weaknesses or limitations affect this character?',strengths:'What strengths help this character?',specialities:'What skills or areas of expertise distinguish this character?'};
