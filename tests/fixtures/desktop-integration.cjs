const fs=require('node:fs');
const path=require('node:path');
const {app,BrowserWindow,ipcMain,dialog}=require('electron');
const repo=process.env.WRITINGTOOL_TEST_ROOT;
const output=process.env.WRITINGTOOL_TEST_BUILD;
const fixture=process.env.WRITINGTOOL_TEST_FIXTURE;
const mode=process.env.WRITINGTOOL_TEST_MODE;
app.setPath('userData',path.join(fixture,'profile'));
app.setAppPath(repo);
let opened=false,main,failedQueries=0,allowReads=mode!=='read-failure',captureCount=0,backupCount=0,pass=false,lostAck=false,conflicted=false,expectedBounds,panelId='timeline';
const originalHandle=ipcMain.handle.bind(ipcMain);
ipcMain.handle=(channel,handler)=>originalHandle(channel,async(event,request)=>{
 if(channel==='writingtool:workspace:v1'&&request.command==='workspace.query'&&opened&&!allowReads){
  failedQueries++;
  return{protocolVersion:1,requestId:request.requestId,command:request.command,status:'error',code:'HOST_UNAVAILABLE',message:'Injected temporary snapshot read failure',outcome:'not-committed',retry:'after-recovery',issues:[]};
 }
 if(channel==='writingtool:protection:v1'){
  if(request.command==='protection.capture'&&request.reason==='Close')captureCount++;
  if(request.command==='protection.backup'&&request.reason==='Close')backupCount++;
 }
 const layoutSave=channel==='writingtool:workspace:v1'&&request.command==='settings.save';
 if(mode==='layout-retry'&&layoutSave&&lostAck&&!conflicted&&request.values.panels.some(p=>p.id==='timeline'&&p.collapsed)){
  const directory=path.join(fixture,'profile/settings'),file=path.join(directory,fs.readdirSync(directory).find(name=>name.endsWith('.json')));
  const current=JSON.parse(fs.readFileSync(file,'utf8'));current.recordVersion=require('node:crypto').randomUUID();
  const temporary=file+'.concurrent';fs.writeFileSync(temporary,JSON.stringify(current));fs.renameSync(temporary,file);conflicted=true;
 }
 const result=await handler(event,request);
 if(mode==='layout-retry'&&layoutSave&&!lostAck&&result.status==='ok'&&request.values.panels.some(p=>p.id==='timeline'&&p.placement==='floating')){
  lostAck=true;return{protocolVersion:1,requestId:request.requestId,command:request.command,status:'error',code:'HOST_UNAVAILABLE',message:'Injected lost layout acknowledgement',outcome:'unknown',retry:'after-recovery',issues:[]};
 }
 if(channel==='writingtool:project:v1'&&request.command==='project.open'&&result.status==='ok')opened=true;
 return result;
});
dialog.showOpenDialog=async(_window,options)=>{
 const title=options?.title||'';
 console.log('PICKER '+title);
 return{canceled:false,filePaths:[path.join(fixture,/backup/i.test(title)?'backups':/universe/i.test(title)?'universe':'project')]};
};
dialog.showErrorBox=(title,message)=>console.log('ERROR_BOX '+JSON.stringify({title,message}));
const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const deadline=setTimeout(()=>{console.error('TIMEOUT');app.exit(1);},120000);
app.on('will-quit',()=>{clearTimeout(deadline);console.log('WRITINGTOOL_SMOKE '+JSON.stringify({mode,passed:pass,failedQueries,captureCount,backupCount,lostAck,conflicted,expectedBounds,panelId}));if(!pass)process.exitCode=1;});
app.on('browser-window-created',(_event,window)=>{
 if(main)return;main=window;
 window.once('closed',()=>console.log('WINDOW_CLOSED'));
 window.webContents.once('did-finish-load',()=>void drive().catch(async error=>{console.error(error);console.error('BODY '+await evaluate('document.body.innerText'));app.exit(1);}));
});
async function evaluate(code){return main.webContents.executeJavaScript(code);}
async function waitFor(code,description,timeout=15000){const until=Date.now()+timeout;while(Date.now()<until){if(await evaluate(code))return;await delay(100);}throw new Error('Timed out: '+description+'\n'+await evaluate('document.body.innerText'));}
async function clickText(text){await evaluate(`(()=>{const b=[...document.querySelectorAll('button')].find(b=>b.textContent.trim().startsWith(${JSON.stringify(text)}));if(!b)throw new Error('Missing button '+${JSON.stringify(text)});b.click();})()`);}
async function drive(){
 await waitFor(`document.querySelector('[data-readiness="ready"]')`,'host readiness');
 await waitFor(`!document.querySelector('.blocking')`,'initial workspace loading');
 await clickText('Open project…');
 const openDeadline=Date.now()+15000;while(!opened&&Date.now()<openDeadline)await delay(100);
 if(!opened)throw new Error('Project did not open');
 await waitFor(`document.body.innerText.includes('Your universe records')||document.body.innerText.includes('Create or select a story')||document.body.innerText.includes('Injected temporary snapshot')`,'project workspace');
 if(mode==='read-failure'){
  await waitFor(`document.body.innerText.includes('Injected temporary snapshot')`,'injected read failure');
  main.close();await delay(1200);
  if(main.isDestroyed()||captureCount||backupCount)throw new Error('Failed read bypassed close guard');
  allowReads=true;
  const retry=await evaluate(`[...document.querySelectorAll('.blocking button')].some(b=>b.textContent.includes('Retry loading'))`);
  if(retry)await clickText('Retry loading');
  else await clickText('Return to editor');
  await waitFor(`!document.querySelector('.blocking')`,'recovered read');
  main.close();
 }else{
  await waitFor(`document.querySelectorAll('.workspace-panel').length===3`,'three docked panels');
  await waitFor(`!document.querySelector('.blocking')`,'settled project workspace');
  await clickText('Calendar…');
  await waitFor(`document.querySelector('.center-form form')&&document.body.innerText.includes('Days per year')`,'calendar form');
  await evaluate(`(()=>{const label=[...document.querySelectorAll('label')].find(e=>e.textContent.startsWith('Days per year'));const input=label.querySelector('input');input.focus();input.select();})()`);
  await main.webContents.insertText('365');
  await evaluate(`(()=>{const label=[...document.querySelectorAll('label')].find(e=>e.textContent.startsWith('Target days per year'));const input=label.querySelector('input');input.focus();input.select();})()`);
  await main.webContents.insertText('400');
  await delay(100);
  await evaluate(`document.querySelector('.center-form form').requestSubmit()`);
  await waitFor(`document.querySelector('.center-form form')?.innerText.includes('Saved')&&!document.querySelector('.blocking')`,'saved calendar');
  await evaluate(`document.querySelector('.center-heading button').click()`);
  await waitFor(`!document.querySelector('.center-form')`,'back to writing');
  panelId=mode==='context'?'context':'timeline';
  const title=mode==='context'?'Writing context':'Universe timeline';
  await evaluate(`(()=>{const panel=[...document.querySelectorAll('aside')].find(p=>p.getAttribute('aria-label')===${JSON.stringify(title)});const b=[...panel.querySelectorAll('button')].find(b=>b.textContent==='floating');if(!b)throw new Error('Missing native float control');b.click();})()`);
  const end=Date.now()+15000;while(BrowserWindow.getAllWindows().length<2&&Date.now()<end)await delay(100);
  const floating=BrowserWindow.getAllWindows().find(w=>w!==main);
  if(!floating)throw new Error('Floating timeline did not open');
  await delay(500);
  if(mode==='context'){
   const records=JSON.parse(fs.readFileSync(path.join(fixture,'characters.json'),'utf8'));
   const snapshot=await evaluate(`window.writingTool.workspace({command:'workspace.query'})`);
   if(snapshot.status!=='ok')throw new Error('Cannot prepare context records');
   const unit=snapshot.snapshot.universe;
   const saved=await evaluate(`window.writingTool.workspace(${JSON.stringify({command:'workspace.mutate',input:{operationId:require('node:crypto').randomUUID(),submittedEditorRevision:'0',units:[{owner:unit.owner,expectedUnitGeneration:unit.generation,changes:records.map(record=>({action:'put',record,expectedRecordVersion:null,manuscript:null}))}]}})})`);
   if(saved.status!=='ok')throw new Error('Cannot save context fixtures: '+JSON.stringify(saved));
   await evaluate(`window.dispatchEvent(new Event('focus'))`);
   await waitFor(`document.body.innerText.includes('Saved')||!document.querySelector('.blocking')`,'context refresh');
   await delay(300);floating.focus();
   await floating.webContents.executeJavaScript(`[...document.querySelectorAll('button')].find(b=>b.textContent==='factions').click()`);
   const roundtripEnd=Date.now()+5000;
   while(Date.now()<roundtripEnd&&!await floating.webContents.executeJavaScript(`document.body.innerText.includes('New faction')`))await delay(50);
   if(!await floating.webContents.executeJavaScript(`document.body.innerText.includes('New faction')`))throw new Error('Floating tab did not update after action roundtrip');
   if(!floating.isFocused())throw new Error('Floating context action stole focus');
   await floating.webContents.executeJavaScript(`[...document.querySelectorAll('button')].find(b=>b.textContent==='characters').click()`);
   await delay(150);
   await floating.webContents.executeJavaScript(`(()=>{const select=document.querySelector('select');select.value='major';select.dispatchEvent(new Event('change',{bubbles:true}));})()`);
   await delay(300);
   const observed=await floating.webContents.executeJavaScript(`(async()=>({text:document.body.innerText,projection:await window.writingToolPresentation.presentation({command:'panel.read'})}))()`);
   if(!observed.text.includes('Fixture major')||observed.text.includes('Fixture minor')||observed.projection.mirror.characterFilter!=='major')throw new Error('Floating classification did not update displayed records');
  }else{
  if(!await floating.webContents.executeJavaScript(`document.body.innerText.includes('Zoom in')`))throw new Error('Floating timeline controls unavailable');
  await evaluate(`(()=>{const e=new KeyboardEvent('keydown',{key:'+',ctrlKey:true,bubbles:true});window.dispatchEvent(e);})()`);
  await delay(300);
  const floatingText=await floating.webContents.executeJavaScript(`document.body.innerText`);
  if(!floatingText.includes('Zoom: 2×'))throw new Error('Main keyboard zoom did not reach floating timeline: '+floatingText);
  console.log('FLOATING_ZOOM_SHARED true');
  if(mode==='layout-retry'){
   await floating.webContents.executeJavaScript(`document.querySelector('[aria-label="Collapse timeline"]').click()`);
   await waitFor(`document.querySelector('.blocking')?.innerText.includes('Retry layout save')`,'generation conflict prompt');
   await clickText('Retry layout save');
   await waitFor(`!document.querySelector('.blocking')`,'layout retry');
   await delay(200);
   if(!lostAck||!conflicted)throw new Error('Layout fault injection did not execute');
   await floating.webContents.executeJavaScript(`document.querySelector('[aria-label="Expand timeline"]').click()`);
   await delay(250);
  }
  }
  const bounds=floating.getBounds();floating.setBounds({...bounds,width:bounds.width+40,height:bounds.height+30});
  // Native close must flush the debounced window bounds before required captures.
  expectedBounds={width:bounds.width+40,height:bounds.height+30};
  main.close();
 }
 const end=Date.now()+70000;while(!main.isDestroyed()&&Date.now()<end){
  const error=await evaluate(`document.querySelector('.blocking')?.innerText||''`);
  if(error)throw new Error('Unexpected closing dialog: '+error);
  if(captureCount&&backupCount)pass=true;
  await delay(200);
 }
 if(!main.isDestroyed())throw new Error('Window remained open');
 if(!pass)throw new Error('Required closing captures were not observed');
}
require(path.join(output,'main/index.cjs'));
