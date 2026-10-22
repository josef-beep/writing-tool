import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {randomUUID} from 'node:crypto';
import {createRequire} from 'node:module';
import {pathToFileURL} from 'node:url';
import {mainConfig} from '../webpack.main.config.ts';
import {rendererConfig} from '../webpack.renderer.config.ts';
import {FileUniverseStorage} from '../src/infrastructure/universe-storage.ts';
import {FileProjectStorage} from '../src/infrastructure/project-storage.ts';
import {WorkspaceCoordinator} from '../src/infrastructure/workspace-coordinator.ts';
import {SettingsStorage} from '../src/infrastructure/settings-storage.ts';
import {createRecord,dateLabel} from '../src/presentation/workspace/model.ts';
import {DEFAULT_PANELS} from '../src/presentation/workspace/SettingsForm.tsx';
import {runSmokeProcess} from './smoke.mjs';
import {unzipSync,strFromU8} from 'fflate';

const root=path.resolve(import.meta.dirname,'..'),require=createRequire(import.meta.url);
const availableModes=['panels','read-failure','layout-retry','partial-layout','context','menus','timeline','intervals','factions','writing','reconcile-defer','reconcile-background'];
const selectedModes=process.argv.slice(2);
if(selectedModes.some(mode=>!availableModes.includes(mode)))throw new Error('Choose desktop scenarios from: '+availableModes.join(', '));
const modes=selectedModes.length?selectedModes:availableModes;
const output=fs.mkdtempSync(path.join(os.tmpdir(),'writingtool-desktop-verification-'));
const webpack=require('webpack');
const imported=await import(pathToFileURL(path.join(path.dirname(require.resolve('@electron-forge/plugin-webpack')),'WebpackConfig.js')).href);
const Generator=typeof imported.default==='function'?imported.default:imported.default.default;
const renderer={config:rendererConfig,entryPoints:[{html:'./src/index.html',js:'./src/presentation/index.tsx',name:'main_window',preload:{js:'./src/desktop/preload.ts'}}]};
const generator=new Generator({mainConfig,renderer},root,true,17940);
generator.webpackDir=path.join(output,'bundles');
for(const config of [await generator.getMainConfig(),...await generator.getRendererConfig(renderer)]){
 config.context=root;config.mode='development';config.optimization={...config.optimization,minimize:false};
 await new Promise((resolve,reject)=>{
  const compiler=webpack(config);
  compiler.run((error,stats)=>compiler.close(closeError=>{
   if(error||closeError)return reject(error??closeError);
   if(stats.hasErrors())return reject(new Error(stats.toString({all:false,errors:true,errorDetails:true})));
   resolve();
  }));
 });
}
const results=[];
function verifyClosingArchive(fixture,suffix){
 const found=fs.readdirSync(path.join(fixture,'backups')).filter(name=>name.endsWith('.zip')).some(name=>{
  try{const files=unzipSync(fs.readFileSync(path.join(fixture,'backups',name)));return Object.entries(files).some(([name,bytes])=>/^project\/[^/]+\/chapters\/[^/]+\.wrt$/.test(name)&&strFromU8(bytes).endsWith(suffix));}catch{return false;}
 });
 if(!found)throw new Error('The fresh closing ZIP did not include writing saved after deferral.');
}
for(const mode of modes){
 const fixture=path.join(output,mode);
 for(const directory of ['profile','project','universe','backups'])fs.mkdirSync(path.join(fixture,directory),{recursive:true});
 const coordinator=new WorkspaceCoordinator(path.join(fixture,'profile'));
 const universe=new FileUniverseStorage(undefined,coordinator).create(path.join(fixture,'universe'),{operationId:randomUUID(),submittedEditorRevision:'1',data:{name:'Desktop verification fixture',description:'Temporary integration data'}}).store;
 const project=new FileProjectStorage(coordinator).create(path.join(fixture,'project'),{operationId:randomUUID()},universe.snapshot().ownerId,universe.location).store;
 try{
  const snapshot={project:project.workspace.snapshot(),universe:universe.workspace.snapshot()};
  if(mode==='reconcile-defer'){
   const id=randomUUID(),request={protocolVersion:1,requestId:id,command:'protection.backup',owner:snapshot.project.owner,reason:'Close',chooseLocation:false,closing:true,nativeBackupFolder:path.join(fixture,'missing-backups')};
   const pending={request,project:project.location,universe:universe.location,projectIdentity:{id:snapshot.project.owner.id,rootId:snapshot.project.rootId},universeIdentity:{id:snapshot.universe.owner.id,rootId:snapshot.universe.rootId},dispatch:'attempted'};
   for(const directory of ['native-pending','jobs'])fs.mkdirSync(path.join(fixture,'profile/protection',directory),{recursive:true});
   fs.writeFileSync(path.join(fixture,'profile/protection/native-pending',id+'.json'),JSON.stringify(pending));
   fs.writeFileSync(path.join(fixture,'profile/protection/jobs',id+'.json'),JSON.stringify({schemaVersion:1,state:'started',request}));
   fs.writeFileSync(path.join(fixture,'pending-id'),id);
   const otherId=randomUUID(),otherRequest={...request,requestId:otherId};
   fs.writeFileSync(path.join(fixture,'profile/protection/native-pending',otherId+'.json'),JSON.stringify({...pending,request:otherRequest}));
   fs.writeFileSync(path.join(fixture,'profile/protection/jobs',otherId+'.json'),JSON.stringify({schemaVersion:1,state:'started',request:otherRequest}));
   fs.writeFileSync(path.join(fixture,'other-pending-id'),otherId);
   const liveId=randomUUID(),liveRequest={protocolVersion:1,requestId:liveId,command:'protection.apply',proposalId:randomUUID()};
   fs.writeFileSync(path.join(fixture,'profile/protection/native-pending',liveId+'.json'),JSON.stringify({...pending,request:liveRequest,dispatch:'prepared'}));
   fs.writeFileSync(path.join(fixture,'live-id'),liveId);
  }
  const characters=['major','minor'].map(type=>{const record=createRecord(snapshot,'character');record.data.name=`Fixture ${type}`;record.data.type=type;return record;});
  fs.writeFileSync(path.join(fixture,'characters.json'),JSON.stringify(characters));
  if(mode==='timeline'||mode==='intervals'){
   const calendar=createRecord(snapshot,'calendar'),configuration=calendar.data.versions[0];
   Object.assign(configuration,{daysOnly:'365',actualDays:'365',targetDays:'365'});
   if(mode==='intervals'){
    configuration.elements=[{id:randomUUID(),kind:'month',name:'First',days:'10'},{id:randomUUID(),kind:'standalone',name:'Festival',days:'1'},{id:randomUUID(),kind:'month',name:'Last',days:'354'}];
    configuration.daysOnly=null;
   }
   snapshot.universe.records.push(calendar);
   const year=-999999999999999999999999n;
   const events=Array.from({length:18},(_,index)=>{
    const record=createRecord(snapshot,'event');
    record.data.heading=`Timeline fixture event ${index}`;record.data.code=`E${index.toString().padStart(3,'0')}-a-long-readable-timeline-code`;
    record.data.date={calendarVersion:calendar.data.currentVersion,year:(index===0?year-1n:year).toString(),day:index===0?'365':index>=16?(index+16).toString():index>=13?'2':'1'};
    if(mode==='intervals'&&index===15)record.data.date.day='11';
    record.data.order=index.toString();return record;
   });
   fs.writeFileSync(path.join(fixture,'timeline.json'),JSON.stringify({records:[calendar,...events],expected:events.slice(1,-1).map(record=>record.id),dates:Object.fromEntries(events.map(record=>[record.data.code,dateLabel(record.data.date,calendar.data)]))}));
  }
  if(mode==='partial-layout'){
   const settings=new SettingsStorage(path.join(fixture,'profile'),fn=>coordinator.settingsGate(fn)),saved=settings.get();
   settings.save({...saved,panels:[structuredClone(DEFAULT_PANELS[0])]},saved.recordVersion);
  }
 }finally{project.releaseCandidate();universe.close();coordinator.close();}
 const log=path.join(output,`${mode}.log`);
 const result=await runSmokeProcess(require('electron'),[path.join(root,'tests/fixtures/desktop-integration.cjs')],{
  fault:mode,timeoutMs:120000,
  env:{...process.env,WRITINGTOOL_TEST_ROOT:root,WRITINGTOOL_TEST_BUILD:generator.webpackDir,WRITINGTOOL_TEST_FIXTURE:fixture,WRITINGTOOL_TEST_MODE:mode},
  write:bytes=>fs.appendFileSync(log,bytes),
 });
 if(result.expectedBounds){
  const directory=path.join(fixture,'profile/settings'),file=fs.readdirSync(directory).find(name=>name.endsWith('.json'));
  const settings=JSON.parse(fs.readFileSync(path.join(directory,file),'utf8')),panel=settings.panels.find(p=>p.id===result.panelId);
  if(panel.width!==String(result.expectedBounds.width)||panel.height!==String(result.expectedBounds.height))throw new Error('Immediate-close bounds were not persisted: '+mode);
 }
 results.push(result);console.log(`${mode}: passed`);
 if(mode==='reconcile-background')verifyClosingArchive(fixture,' after failed closing');
 if(mode==='reconcile-defer'){
  const restarted=await runSmokeProcess(require('electron'),[path.join(root,'tests/fixtures/desktop-integration.cjs')],{
   fault:mode+'-restart',timeoutMs:120000,
   env:{...process.env,WRITINGTOOL_TEST_ROOT:root,WRITINGTOOL_TEST_BUILD:generator.webpackDir,WRITINGTOOL_TEST_FIXTURE:fixture,WRITINGTOOL_TEST_MODE:mode+'-restart'},
   write:bytes=>fs.appendFileSync(path.join(output,mode+'-restart.log'),bytes),
  });
  results.push(restarted);console.log(`${mode}-restart: passed`);
  verifyClosingArchive(fixture,' after restart');
 }
}
fs.writeFileSync(path.join(output,'results.json'),JSON.stringify(results,null,2)+'\n');
console.log('Desktop verification evidence: '+output);
