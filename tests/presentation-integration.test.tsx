import test,{type TestContext} from 'node:test';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {renderToStaticMarkup} from 'react-dom/server';
import {validPanelAction,validTimelineView,validTimelineCalendar,resolveTimelineView,INITIAL_TIMELINE_VIEW,TIMELINE_INTERVALS,panelActionOpensMain,type PanelAction,type PanelMirror,type TimelineInterval,type TimelineView} from '../src/application/contracts/presentation';
import {PanelLayoutQueue,reorderPanels,mergeSavedPanelLayout,normalizePanelLayouts,persistPanelLayouts,panelResizePatch} from '../src/presentation/workspace/panel-layout';
import {PanelContent,PanelControls} from '../src/presentation/workspace/PanelContent';
import {FactionBrowser} from '../src/presentation/workspace/FactionBrowser';
import {Timeline} from '../src/presentation/workspace/Chronology';
import {timelineDateAt,timelinePeriod,timelineDefaultSpan,timelineUnitDays} from '../src/presentation/workspace/timeline-interval';
import {createRecord,newRecord} from '../src/presentation/workspace/model';
import {DEFAULT_PANELS} from '../src/presentation/workspace/SettingsForm';
import {SettingsStorage} from '../src/infrastructure/settings-storage';
import type {PanelLayout,AppSettings,WorkspaceSnapshot} from '../src/application/contracts/workspace';
import {elapsedPosition,type CalendarData} from '../src/domain/calendar';
import type {WorkspaceRecord} from '../src/domain/workspace';

const panels=()=>structuredClone(DEFAULT_PANELS);
const pickerLabels=(html:string)=>[...(html.match(/<select[^>]*aria-label="Go to event or decision"[^>]*>(.*?)<\/select>/s)?.[1]??'').matchAll(/<option value="[^"]+">([^<]+)<\/option>/g)].map(match=>match[1].split(': ')[0]);
function persistenceFixture(t:TestContext,initial:PanelLayout[]=panels()){
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'writingtool-panel-persistence-'));
 t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
 const storage=new SettingsStorage(root),first=storage.get();
 let current=storage.save({...first,panels:initial},first.recordVersion),draft:AppSettings|null=null,reads=0,saves=0;
 const io={
  current:()=>current,
  draft:()=>draft?.panels??null,
  read:async()=>{reads++;return storage.get();},
  save:async(values:AppSettings,expected:string)=>{saves++;return storage.save(values,expected);},
  accept:(before:AppSettings,saved:AppSettings,submittedDraft:PanelLayout[]|null)=>{current=saved;if(draft)draft={...draft,recordVersion:saved.recordVersion,panels:mergeSavedPanelLayout(draft.panels,before.panels,saved.panels,submittedDraft??draft.panels)};},
 };
 return {storage,io,queue:new PanelLayoutQueue(),current:()=>current,draft:()=>draft,setDraft:(value:AppSettings)=>{draft=value;},counts:()=>({reads,saves})};
}

test('the controller persistence loop completes imported subsets and preserves existing panel fields',async t=>{
 const f=persistenceFixture(t,[{...panels()[1],width:'333',collapsed:true}]);
 f.queue.add('navigation',{width:'425'});f.queue.add('context',{height:'725'});
 await persistPanelLayouts(f.queue,f.io);
 assert.equal(f.counts().saves,1);assert.equal(f.queue.size,0);
 const actual=f.storage.get();assert.equal(actual.panels.length,3);
 assert.equal(actual.panels.find(p=>p.id==='navigation')!.width,'425');
 assert.equal(actual.panels.find(p=>p.id==='context')!.height,'725');
 assert.equal(actual.panels.find(p=>p.id==='timeline')!.width,'333');
 assert.equal(actual.panels.find(p=>p.id==='timeline')!.collapsed,true);
 assert.deepEqual(normalizePanelLayouts([{...panels()[1],width:'333'}]).map(p=>p.id),['navigation','timeline','context']);
});

for(const newerGesture of [false,true])test(`write-then-reject reads durable settings and retains newer gestures: ${newerGesture}`,async t=>{
 const f=persistenceFixture(t),originalSave=f.io.save,originalVersion=f.current().recordVersion;
 f.queue.add('navigation',{width:'410'});
 f.io.save=async(values,expected)=>{await originalSave(values,expected);if(newerGesture)f.queue.add('navigation',{width:'470'});throw new Error('Reply was lost after publication');};
 if(newerGesture)await assert.rejects(persistPanelLayouts(f.queue,f.io),/Reply was lost/);else await persistPanelLayouts(f.queue,f.io);
 assert.notEqual(f.current().recordVersion,originalVersion);assert.equal(f.current().recordVersion,f.storage.get().recordVersion);
 assert.equal(f.storage.get().panels[0].width,'410');assert.equal(f.queue.size,newerGesture?1:0);
 f.io.save=originalSave;
 if(newerGesture){await persistPanelLayouts(f.queue,f.io);assert.equal(f.storage.get().panels[0].width,'470');assert.equal(f.queue.size,0);}
});

test('a real generation conflict rebases the retry without losing latest gestures or unrelated settings',async t=>{
 const f=persistenceFixture(t),originalSave=f.io.save;
 f.queue.add('navigation',{width:'420'});
 f.io.save=async(values,expected)=>{
  const live=f.storage.get();f.storage.save({...live,theme:'light'},live.recordVersion);
  f.queue.add('navigation',{width:'480'});
  return originalSave(values,expected);
 };
 await assert.rejects(persistPanelLayouts(f.queue,f.io),/Settings changed/);
 assert.equal(f.current().recordVersion,f.storage.get().recordVersion);assert.equal(f.queue.apply(f.current().panels)[0].width,'480');
 f.io.save=originalSave;await persistPanelLayouts(f.queue,f.io);
 assert.equal(f.storage.get().theme,'light');assert.equal(f.storage.get().panels[0].width,'480');assert.equal(f.queue.size,0);
});

test('acknowledgement preserves newer edits to the same settings panel field',async t=>{
 const f=persistenceFixture(t),originalSave=f.io.save;
 f.setDraft({...structuredClone(f.current()),theme:'light'});f.queue.add('navigation',{width:'420'});
 f.io.save=async(values,expected)=>{
  const currentDraft=f.draft()!;
  f.setDraft({...currentDraft,panels:currentDraft.panels.map(p=>p.id==='navigation'?{...p,width:'950'}:p)});
  return originalSave(values,expected);
 };
 await persistPanelLayouts(f.queue,f.io);
 assert.equal(f.storage.get().panels[0].width,'420');assert.equal(f.draft()!.panels[0].width,'950');assert.equal(f.draft()!.theme,'light');
 assert.equal(f.draft()!.recordVersion,f.storage.get().recordVersion);
});

test('pointer dimensions ignore viewport constraints and collapsed resizing preserves expanded height',()=>{
 assert.deepEqual(panelResizePatch({width:220,height:280},{width:220,height:280},false),{});
 assert.deepEqual(panelResizePatch({width:220,height:40},{width:280,height:41},true),{width:'280'});
 assert.deepEqual(panelResizePatch({width:220,height:280},{width:280,height:360},false),{width:'280',height:'360'});
});

function timelineFixture(){
 const version=randomUUID(),calendar:CalendarData={currentVersion:version,anchor:{year:'0',day:'1'},versions:[{id:version,elements:[],daysOnly:'365',actualDays:'365',targetDays:'365',enteredYear:'0',yearNames:[]}]};
 const focus={requestId:randomUUID(),start:{calendarVersion:version,year:'0',day:'5'},end:null};
 return {calendar,focus};
}
test('timeline intervals use actual month boundaries, standalone days and exact negative year buckets',()=>{
 const {calendar}=timelineFixture(),config=calendar.versions[0];
 config.elements=[{id:randomUUID(),kind:'month',name:'First',days:'10'},{id:randomUUID(),kind:'standalone',name:'Festival',days:'1'},{id:randomUUID(),kind:'month',name:'Last',days:'50'}];
 config.daysOnly=null;config.actualDays='61';config.targetDays='61';
 assert.equal(timelinePeriod(9n,'month',calendar).label,'First / 0');
 assert.equal(timelinePeriod(10n,'month',calendar).label,'Festival / 0');
 assert.equal(timelinePeriod(11n,'month',calendar).label,'Last / 0');
 assert.equal(timelinePeriod(60n,'month',calendar).position,11n);
 assert.equal(timelinePeriod(60n,'month',calendar).end,60n);
 assert.equal(timelinePeriod(61n,'month',calendar).label,'First / 1');
 assert.deepEqual(timelineDateAt(-1n,calendar),{calendarVersion:calendar.currentVersion,year:'-1',day:'61'});
 assert.equal(timelinePeriod(-1n,'year',calendar).position,-61n);
 assert.equal(timelinePeriod(-1n,'decade',calendar).label,'-10–-1');
 assert.equal(timelinePeriod(-1n,'century',calendar).label,'-100–-1');
 assert.equal(timelinePeriod(0n,'century',calendar).label,'0–99');
 const hugeYear=100000000000000000000009n,huge=hugeYear*61n;
 assert.equal(timelinePeriod(huge,'decade',calendar).position,(hugeYear-9n)*61n);
 assert.equal(timelineDateAt(huge,calendar).year,hugeYear.toString());
 assert.deepEqual(TIMELINE_INTERVALS.map(interval=>timelineDefaultSpan(interval,calendar)),[365n,61n,610n,6100n,61000n]);
 assert.deepEqual(TIMELINE_INTERVALS.map(interval=>timelineUnitDays(interval,calendar)),[1n,30n,61n,610n,6100n]);
 for(const interval of TIMELINE_INTERVALS){const next={...INITIAL_TIMELINE_VIEW,interval};assert.equal(validTimelineView(next),true);assert.equal(validTimelineCalendar(next,calendar),true);}
 assert.equal(validTimelineView({...INITIAL_TIMELINE_VIEW,interval:'week'}),false);
 const noMonths=timelineFixture().calendar;
 assert.equal(validTimelineCalendar({...INITIAL_TIMELINE_VIEW,interval:'month'},noMonths),false);
 assert.equal(resolveTimelineView(INITIAL_TIMELINE_VIEW,{...INITIAL_TIMELINE_VIEW,interval:'month'},noMonths),null);
 calendar.anchor.year='42';
 const historical={...config,id:randomUUID(),elements:[],daysOnly:'100',actualDays:'100',targetDays:'100'};calendar.versions.push(historical);
 const original={calendarVersion:historical.id,year:'43',day:'5'},retained=structuredClone(original),position=elapsedPosition(original,calendar);
 assert.equal(position,104n);assert.equal(timelinePeriod(position,'month',calendar).position,72n);
 assert.equal(timelinePeriod(position,'month',calendar).end,121n);assert.equal(timelinePeriod(position,'month',calendar).label,'Last / 43');
 assert.equal(timelinePeriod(position,'year',calendar).position,61n);assert.equal(timelinePeriod(position,'decade',calendar).position,-122n);
 assert.deepEqual(original,retained,'bucketing preserves historical record dates');
});
test('selected timeline interval survives zoom, chapter focus and floating serialization',()=>{
 const {calendar,focus}=timelineFixture();
 const century={...INITIAL_TIMELINE_VIEW,interval:'century' as const,unresolved:true,anchor:'-365',period:null};
 const zoomed=resolveTimelineView(century,JSON.parse(JSON.stringify({...century,zoom:2})),calendar)!;
 assert.equal(zoomed.interval,'century');assert.equal(zoomed.anchor,'-365');assert.equal(zoomed.unresolved,true);
 const focused=resolveTimelineView(zoomed,{...zoomed,focus},calendar)!;
 assert.equal(focused.interval,'century');assert.equal(focused.anchor,'4');assert.equal(focused.period,'31');
 const ranged=resolveTimelineView(focused,{...focused,focus:{...focus,requestId:randomUUID(),end:{...focus.start,day:'10'}}},calendar)!;
 assert.equal(ranged.period,'5','inclusive focused range ends on the requested date');
});
test('shared timeline interval and unresolved filter survive reparenting while repeated focus requests still reset',()=>{
 const {calendar,focus}=timelineFixture(),focused=resolveTimelineView(INITIAL_TIMELINE_VIEW,{...INITIAL_TIMELINE_VIEW,focus},calendar)!;
 assert.equal(focused.anchor,'4');assert.equal(focused.period,'31');
 const panned={...focused,anchor:'-900',period:'93',unresolved:true};
 const transferred:TimelineView=JSON.parse(JSON.stringify(panned));
 const zoomed=resolveTimelineView(panned,{...transferred,zoom:4},calendar)!;
 assert.equal(zoomed.anchor,'-900');assert.equal(zoomed.period,'93');assert.equal(zoomed.unresolved,true);assert.equal(zoomed.focus!.requestId,focus.requestId);
 const returned=resolveTimelineView(zoomed,{...zoomed,focus:{...focus,requestId:randomUUID()}},calendar)!;
 assert.equal(returned.anchor,'4');assert.equal(returned.period,'31');assert.equal(returned.unresolved,true);
 const pannedAgain={...returned,anchor:'1234'};
 const repeated=resolveTimelineView(pannedAgain,{...pannedAgain,focus:{...focus,requestId:randomUUID()}},calendar)!;
 assert.equal(repeated.anchor,'4');assert.notEqual(repeated.focus!.requestId,returned.focus!.requestId);
});
test('timeline forwarding and application reject foreign versions and invalid days at either endpoint',()=>{
 const {calendar,focus}=timelineFixture(),current={...INITIAL_TIMELINE_VIEW,anchor:'87',unresolved:true};
 const invalidDates=[{...focus.start,calendarVersion:randomUUID()},{...focus.start,day:'366'}];
 for(const date of invalidDates)for(const endpoint of ['start','end'] as const){
  const next={...current,focus:{...focus,[endpoint]:date}};
  assert.equal(validTimelineView(next),true,'wire shape alone is insufficient');
  assert.equal(validTimelineCalendar(next,calendar),false,'native forwarding validates the active calendar');
  assert.equal(resolveTimelineView(current,next,calendar),null,'the main controller preserves its prior view');
 }
 assert.equal(current.anchor,'87');assert.equal(current.unresolved,true);
 assert.equal(validTimelineCalendar({...current,focus},null),false);
});
test('timeline includes every event at both interval boundaries and on shared dates, preserving order and visibility filters',()=>{
 const {calendar}=timelineFixture(),universeId=randomUUID(),owner={kind:'universe' as const,id:universeId};
 const snapshot:WorkspaceSnapshot={project:null,universe:{owner,rootId:randomUUID(),universeId,generation:'0',records:[],manuscripts:{},assets:[],counters:{story:'0',chapter:'0',event:'0',decision:'0'}}};
 snapshot.universe!.records.push(newRecord(snapshot,'calendar',calendar));
 const year=-999999999999999999999999n,first=year*365n;
 const event=(code:string,day:string,order:string,yearValue=year)=>newRecord(snapshot,'event',{heading:code,description:null,date:{calendarVersion:calendar.currentVersion,year:yearValue.toString(),day},code,order,maker:null,kind:'ordinary',characterId:null});
 const before=event('BEFORE','365','0',year-1n),after=event('AFTER','33','0'),end=event('END','32','0');
 const sameDay=Array.from({length:60},(_,index)=>event(`SAME-${index}`,'1',index.toString()));
 const middle=event('MIDDLE','2','0');
 const character=createRecord(snapshot,'character');
 if(character.recordType!=='character')throw new Error('Expected character fixture');
 character.data.name='Fixture character';character.data.birth={year:year.toString(),elementId:null,day:null};character.data.birthEventId=sameDay[1].id;
 sameDay[0].data.kind='background';sameDay[0].data.characterId=character.id;
 sameDay[1].data.kind='birth';sameDay[1].data.characterId=character.id;
 middle.data.maker={kind:'character',id:character.id};
 const decisionType=newRecord(snapshot,'decision-type',{name:'Fixture type',makerRequired:false,builtin:null});
 const decision=newRecord(snapshot,'decision',{code:'DECISION',text:'An unresolved choice',date:middle.data.date,order:'1',typeId:decisionType.id,maker:null,characterIds:[],eventIds:[],followingDecisionIds:[]});
 const resolved=newRecord(snapshot,'decision',{...decision.data,code:'RESOLVED',text:'A resolved choice',order:'2',eventIds:[end.id]});
 snapshot.universe!.records.push(character,decisionType,decision,resolved,after,end,middle,...[...sameDay].reverse(),before);
 const render=(unresolved=false)=>renderToStaticMarkup(<Timeline snapshot={{...snapshot}} universeName="Fixture" value={{...INITIAL_TIMELINE_VIEW,anchor:first.toString(),period:'31',unresolved}} open={()=>{}} onChange={()=>{}} goTo={()=>{}}/>);
 const labels=(html:string)=>[...html.matchAll(/aria-label="event ([^"]+):/g)].map(match=>match[1]);
 assert.deepEqual(labels(render()),[...sameDay.map(record=>record.data.code),'MIDDLE','END']);
 const options=pickerLabels;
 assert.deepEqual(options(render()),['BEFORE',...sameDay.map(record=>record.data.code),'MIDDLE','DECISION','RESOLVED','END','AFTER'],'timeline picker is oldest first across event and decision records');
 const view=newRecord(snapshot,'view',{makers:[],categories:[{kind:'decision-type',id:randomUUID()}]});snapshot.universe!.records.push(view);
 assert.deepEqual(labels(render()),[],'category filters still apply');
 view.data.categories=[];
 assert.deepEqual(labels(render()),[...sameDay.map(record=>record.data.code),'MIDDLE','END'],'Show all restores the entire interval');
 view.data.makers=[{kind:'none'}];
 assert.deepEqual(labels(render()),[...sameDay.map(record=>record.data.code),'END'],'makerless filter preserves all matching events');
 view.data.makers=[{kind:'character',id:character.id}];
 assert.deepEqual(labels(render()),['MIDDLE'],'named maker filter retains matching events only');
 view.data.makers=[];
 const unresolved=render(true);
 assert.deepEqual(labels(unresolved),[],'unresolved-only mode retains its explicit meaning');
 assert.match(unresolved,/aria-label="decision DECISION:/,'unresolved decisions remain visible');
 assert.doesNotMatch(unresolved,/aria-label="decision RESOLVED:/,'resolved decisions remain excluded');
 assert.match(render(),/aria-label="decision RESOLVED:/,'the normal timeline still shows resolved decisions');
});
test('timeline chronology uses exact calendar positions for its graphic, picker and unresolved list',()=>{
 const {calendar}=timelineFixture(),historical=randomUUID();
 calendar.versions.push({...calendar.versions[0],id:historical,daysOnly:'100',actualDays:'100',targetDays:'100'});
 calendar.versions[0].elements=[{id:randomUUID(),kind:'month',name:'First',days:'31'},{id:randomUUID(),kind:'month',name:'Last',days:'334'}];calendar.versions[0].daysOnly=null;
 const universeId=randomUUID(),owner={kind:'universe' as const,id:universeId};
 const snapshot:WorkspaceSnapshot={project:null,universe:{owner,rootId:randomUUID(),universeId,generation:'0',records:[],manuscripts:{},assets:[],counters:{story:'0',chapter:'0',event:'0',decision:'0'}}};
 const date=(year:string,day:string,calendarVersion=calendar.currentVersion)=>({calendarVersion,year,day});
 const event=(code:string,when:ReturnType<typeof date>,order:string)=>newRecord(snapshot,'event',{heading:code,description:null,date:when,code,order,maker:null,kind:'ordinary',characterId:null});
 const newest=event('NEWEST',date('0','200'),'0'),older=event('OLDER',date('1','1',historical),'9'),negative=event('NEGATIVE',date('-1','365'),'99');
 const tieLate=event('TIE-LATE',date('0','1'),'10'),tieEarly=event('TIE-EARLY',date('0','1',historical),'2');
 const idFirst=event('ID-FIRST',date('0','1'),'3'),idLast=event('ID-LAST',date('0','1'),'3');
 idFirst.id='00000000-0000-4000-8000-000000000001';idLast.id='ffffffff-ffff-4fff-bfff-ffffffffffff';
 const type=newRecord(snapshot,'decision-type',{name:'Fixture type',makerRequired:false,builtin:null});
 const newerDecision=newRecord(snapshot,'decision',{code:'NEWER-DECISION',text:'Newer',date:newest.data.date,order:'1',typeId:type.id,maker:null,characterIds:[],eventIds:[],followingDecisionIds:[]});
 const olderDecision=newRecord(snapshot,'decision',{...newerDecision.data,code:'OLDER-DECISION',text:'Older',date:older.data.date,order:'10'});
 const firstDecision=newRecord(snapshot,'decision',{...newerDecision.data,code:'FIRST-DECISION',text:'First on its day',date:older.data.date,order:'0'});
 snapshot.universe!.records.push(newRecord(snapshot,'calendar',calendar),type,newerDecision,newest,idLast,tieLate,olderDecision,older,tieEarly,idFirst,negative,firstDecision);
 const render=(unresolved=false,interval:TimelineInterval='day')=>renderToStaticMarkup(<Timeline snapshot={snapshot} universeName="Fixture" value={{...INITIAL_TIMELINE_VIEW,interval,anchor:'-1',period:'500',unresolved}} open={()=>{}} onChange={()=>{}} goTo={()=>{}}/>);
 const ordered=['NEGATIVE','TIE-EARLY','ID-FIRST','ID-LAST','TIE-LATE','FIRST-DECISION','OLDER','OLDER-DECISION','NEWEST','NEWER-DECISION'];
 assert.deepEqual([...render().matchAll(/aria-label="(?:event|decision) ([^:]+):/g)].map(match=>match[1]),ordered);
 for(const interval of TIMELINE_INTERVALS){
  const html=render(false,interval);
  assert.deepEqual([...html.matchAll(/aria-label="(?:event|decision) ([^:]+):/g)].map(match=>match[1]),ordered,`${interval} keeps every record in date order`);
  if(interval!=='day')assert.match(html,/class="timeline-record-date"/,'coarse intervals retain exact event dates');
 }
 assert.deepEqual(pickerLabels(render()),ordered);
 assert.deepEqual([...render(true).matchAll(/class="context-record decision-code"[^>]*>([^:]+):/g)].map(match=>match[1]),['FIRST-DECISION','OLDER-DECISION','NEWER-DECISION']);
 negative.data.date=date('1','10');
 assert.deepEqual(pickerLabels(render()),[...ordered.slice(1),'NEGATIVE'],'date changes reorder the picker');
});
test('floating view and layout commands retain focus; only main-content intents request owner focus',()=>{
 const id=randomUUID();
 const local:PanelAction[]=[{kind:'timeline',value:{...INITIAL_TIMELINE_VIEW}},{kind:'context',tab:'characters',filter:'all'},{kind:'filters',value:{makers:[],categories:[]}},{kind:'panel',patch:{collapsed:true}},{kind:'panel-order',direction:1},{kind:'move',id,direction:1}];
 for(const action of local)assert.equal(panelActionOpensMain(action),false);
 for(const action of [{kind:'select',id},{kind:'edit',id},{kind:'create',recordType:'character'},{kind:'tree'}] as PanelAction[])assert.equal(panelActionOpensMain(action),true);
});

test('layout acknowledgements retain newer gestures, failed batches and independent panel patches',()=>{
 const q=new PanelLayoutQueue(),original=panels();q.add('navigation',{width:'410'});q.add('context',{height:'615'});
 const submitted=q.apply(original);q.add('navigation',{width:'470',collapsed:true});
 q.acknowledge(submitted);
 assert.equal(q.size,1);assert.equal(q.apply(submitted)[0].width,'470');assert.equal(q.apply(submitted)[0].collapsed,true);
 q.acknowledge(q.apply(submitted));assert.equal(q.size,0);
});
test('panel saves preserve unrelated unsaved settings layout fields and deterministic panel order',()=>{
 const original=panels(),draft=panels();draft[0].height='980';draft[1].width='530';
 const saved=panels();saved[0].width='470';
 const merged=mergeSavedPanelLayout(draft,original,saved,draft);
 assert.equal(merged[0].height,'980');assert.equal(merged[0].width,'470');assert.equal(merged[1].width,'530');
 const reordered=reorderPanels(original,'timeline',-1);assert.equal(reordered.find(p=>p.id==='timeline')!.order,'0');assert.equal(reordered.find(p=>p.id==='navigation')!.order,'1');
 assert.deepEqual(reorderPanels(original,'navigation',-1),original);
});
test('floating intents reject broad patches, arbitrary ordering and invalid timeline values',()=>{
 const id=randomUUID();for(const action of [{kind:'edit',id},{kind:'move',id,direction:1},{kind:'panel',patch:{collapsed:true,placement:'left'}},{kind:'context',tab:'characters',filter:'major'},{kind:'timeline',value:{...INITIAL_TIMELINE_VIEW,zoom:2}}])assert.equal(validPanelAction(action),true);
 for(const action of [{kind:'move',id,direction:'1'},{kind:'panel',patch:{x:'999'}},{kind:'panel',patch:{id:'context'}},{kind:'panel-order',direction:2},{kind:'context',tab:'sql',filter:'all'},{kind:'edit',id,extra:true}])assert.equal(validPanelAction(action),false);
 for(const zoom of [NaN,Infinity,0,65])assert.equal(validTimelineView({...INITIAL_TIMELINE_VIEW,zoom}),false);
 assert.equal(validTimelineView({...INITIAL_TIMELINE_VIEW,focus:{requestId:randomUUID(),start:{year:'0',day:'1',calendarVersion:randomUUID()},end:null}}),true);
});
test('shared panel content exposes grouped navigation, context filters, selection and decision status',()=>{
 const universeId=randomUUID(),projectId=randomUUID(),storyId=randomUUID(),volumeId=randomUUID(),characterId=randomUUID(),decisionId=randomUUID(),version=randomUUID();
 const record=(recordType:string,id:string,data:unknown,project=false)=>({schemaVersion:1,recordType,id,data,universeId,owner:{kind:project?'project':'universe',id:project?projectId:universeId},recordVersion:randomUUID()}) as WorkspaceRecord;
 const unit=(kind:'project'|'universe',records:WorkspaceRecord[])=>({owner:{kind,id:kind==='project'?projectId:universeId},rootId:randomUUID(),universeId,generation:'0',records,manuscripts:{},assets:[],counters:{story:'0',chapter:'0',event:'0',decision:'0'}});
 const m:PanelMirror={snapshot:{project:unit('project',[record('volume',volumeId,{title:'Collected volume',order:'0'},true),record('story',storyId,{title:'Selected story',order:'0',volumeId,chapterTarget:2},true)]),universe:unit('universe',[record('character',characterId,{name:'Visible major',type:'major'}),record('decision',decisionId,{code:'D1',text:'An unresolved choice',date:{calendarVersion:version,year:'0',day:'1'},followingDecisionIds:[],eventIds:[],characterIds:[],maker:null,typeId:randomUUID(),order:'0'})])},settings:null,universeName:'Fixture',storyId:null,chapterId:null,selectedId:decisionId,blocked:false,contextTab:'characters',characterFilter:'major',timeline:{...INITIAL_TIMELINE_VIEW}};
 const navigation=renderToStaticMarkup(<PanelContent id="navigation" mirror={m} onAction={()=>{}}/>);
 assert.match(navigation,/Collected volume/);assert.match(navigation,/Edit story/);assert.match(navigation,/Move Selected story up/);assert.match(navigation,/New volume/);
 const characters=renderToStaticMarkup(<PanelContent id="context" mirror={m} onAction={()=>{}}/>);assert.match(characters,/Classification/);assert.match(characters,/Visible major/);
 const faction=createRecord(m.snapshot,'faction');
 if(faction.recordType!=='faction')throw new Error('Expected faction fixture');
 faction.data.name='Saved incomplete faction';m.snapshot.universe!.records.push(faction);
 const factions=renderToStaticMarkup(<PanelContent id="context" mirror={{...m,contextTab:'factions',selectedId:faction.id}} onAction={()=>{}}/>);
 assert.match(factions,/Saved incomplete faction/);assert.match(factions,/aria-pressed="true"/);
 const browser=renderToStaticMarkup(<FactionBrowser factions={[faction]} open={()=>{}} create={()=>{}} back={()=>{}}/>);
 assert.match(browser,/Saved incomplete faction/);assert.match(browser,/aria-label="Saved factions"/);assert.match(browser,/New faction/);
 const empty=renderToStaticMarkup(<FactionBrowser factions={[]} open={()=>{}} create={()=>{}} back={()=>{}}/>);
 assert.match(empty,/No factions saved in this universe yet/);
 const decisions=renderToStaticMarkup(<PanelContent id="context" mirror={{...m,contextTab:'decisions'}} onAction={()=>{}}/>);assert.match(decisions,/Unresolved/);assert.match(decisions,/aria-pressed="true"/);
 const controls=renderToStaticMarkup(<PanelControls panel={{...panels()[0],placement:'floating',collapsed:true}} onPatch={()=>{}} onOrder={()=>{}}/>);assert.match(controls,/Expand navigation/);assert.match(controls,/Earlier panel/);assert.match(controls,/>bottom</);
});
