import test,{type TestContext} from 'node:test';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {renderToStaticMarkup} from 'react-dom/server';
import {validPanelAction,validTimelineView,validTimelineCalendar,resolveTimelineView,INITIAL_TIMELINE_VIEW,panelActionOpensMain,type PanelAction,type PanelMirror,type TimelineView} from '../src/application/contracts/presentation';
import {PanelLayoutQueue,reorderPanels,mergeSavedPanelLayout,normalizePanelLayouts,persistPanelLayouts,panelResizePatch} from '../src/presentation/workspace/panel-layout';
import {PanelContent,PanelControls} from '../src/presentation/workspace/PanelContent';
import {DEFAULT_PANELS} from '../src/presentation/workspace/SettingsForm';
import {SettingsStorage} from '../src/infrastructure/settings-storage';
import type {PanelLayout,AppSettings} from '../src/application/contracts/workspace';
import type {CalendarData} from '../src/domain/calendar';
import type {WorkspaceRecord} from '../src/domain/workspace';

const panels=()=>structuredClone(DEFAULT_PANELS);
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
 const decisions=renderToStaticMarkup(<PanelContent id="context" mirror={{...m,contextTab:'decisions'}} onAction={()=>{}}/>);assert.match(decisions,/Unresolved/);assert.match(decisions,/aria-pressed="true"/);
 const controls=renderToStaticMarkup(<PanelControls panel={{...panels()[0],placement:'floating',collapsed:true}} onPatch={()=>{}} onOrder={()=>{}}/>);assert.match(controls,/Expand navigation/);assert.match(controls,/Earlier panel/);assert.match(controls,/>bottom</);
});
