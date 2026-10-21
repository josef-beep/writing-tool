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
import {createRecord} from '../src/presentation/workspace/model.ts';
import {DEFAULT_PANELS} from '../src/presentation/workspace/SettingsForm.tsx';
import {runSmokeProcess} from './smoke.mjs';

const root=path.resolve(import.meta.dirname,'..'),require=createRequire(import.meta.url);
const availableModes=['panels','read-failure','layout-retry','partial-layout','context','menus','timeline'];
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
for(const mode of modes){
 const fixture=path.join(output,mode);
 for(const directory of ['profile','project','universe','backups'])fs.mkdirSync(path.join(fixture,directory),{recursive:true});
 const coordinator=new WorkspaceCoordinator(path.join(fixture,'profile'));
 const universe=new FileUniverseStorage(undefined,coordinator).create(path.join(fixture,'universe'),{operationId:randomUUID(),submittedEditorRevision:'1',data:{name:'Desktop verification fixture',description:'Temporary integration data'}}).store;
 const project=new FileProjectStorage(coordinator).create(path.join(fixture,'project'),{operationId:randomUUID()},universe.snapshot().ownerId,universe.location).store;
 try{
  const snapshot={project:project.workspace.snapshot(),universe:universe.workspace.snapshot()};
  const characters=['major','minor'].map(type=>{const record=createRecord(snapshot,'character');record.data.name=`Fixture ${type}`;record.data.type=type;return record;});
  fs.writeFileSync(path.join(fixture,'characters.json'),JSON.stringify(characters));
  if(mode==='timeline'){
   const calendar=createRecord(snapshot,'calendar'),configuration=calendar.data.versions[0];
   Object.assign(configuration,{daysOnly:'365',actualDays:'365',targetDays:'365'});
   snapshot.universe.records.push(calendar);
   const year=-999999999999999999999999n;
   const events=Array.from({length:18},(_,index)=>{
    const record=createRecord(snapshot,'event');
    record.data.heading=`Timeline fixture event ${index}`;record.data.code=`E${index.toString().padStart(3,'0')}-a-long-readable-timeline-code`;
    record.data.date={calendarVersion:calendar.data.currentVersion,year:(index===0?year-1n:year).toString(),day:index===0?'365':index>=16?(index+16).toString():index>=13?'2':'1'};
    record.data.order=index.toString();return record;
   });
   fs.writeFileSync(path.join(fixture,'timeline.json'),JSON.stringify({records:[calendar,...events],expected:events.slice(1,-1).map(record=>record.id)}));
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
}
fs.writeFileSync(path.join(output,'results.json'),JSON.stringify(results,null,2)+'\n');
console.log('Desktop verification evidence: '+output);
