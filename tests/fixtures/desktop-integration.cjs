const fs=require('node:fs');
const path=require('node:path');
const {app,BrowserWindow,ipcMain,dialog,utilityProcess,shell}=require('electron');
const repo=process.env.WRITINGTOOL_TEST_ROOT;
const output=process.env.WRITINGTOOL_TEST_BUILD;
const fixture=process.env.WRITINGTOOL_TEST_FIXTURE;
const mode=process.env.WRITINGTOOL_TEST_MODE;
const errorExitModes=['error-quit','combined-error-quit','error-profile-quit','error-quit-timeout','error-quit-copy-keep','close-stalled','close-backup-error','error-quit-copy-failure','close-pending'];
app.setPath('userData',path.join(fixture,'profile'));
app.setAppPath(repo);
let opened=false,main,failedQueries=0,allowReads=mode!=='read-failure',captureCount=0,backupCount=0,pass=false,lostAck=false,conflicted=false,expectedBounds,panelId='timeline',host,corruptedBackup=null;
let holdRead=false,releaseRead,holdProjectClose=false,releaseProjectClose,activeRequests=0,loseMutation=false,loseProfile=false,quitChoices=0,copyFailures=0,openedRecoveryFolder=false;
const originalFork=utilityProcess.fork.bind(utilityProcess);
utilityProcess.fork=(...args)=>{
 host=originalFork(...args);
 host.on('message',message=>{
  if(['reconcile-background','close-backup-error'].includes(mode)&&!corruptedBackup&&message.command==='protection.backup'&&message.status==='ok'&&message.value.output){
   corruptedBackup=message.requestId;fs.appendFileSync(message.value.output.path,'Injected changed output evidence');
  }
 });
 const originalOn=host.on.bind(host);
 host.on=(event,listener)=>originalOn(event,event==='message'?message=>{
  if(holdProjectClose&&message.command==='project.close'){holdProjectClose=false;releaseProjectClose=()=>listener(message);}
  else if(holdRead&&message.command==='workspace.query'){
   holdRead=false;
   releaseRead=fail=>listener(fail?{protocolVersion:1,requestId:message.requestId,command:message.command,status:'error',code:'HOST_UNAVAILABLE',message:'Injected read failure',outcome:'not-committed',retry:'after-recovery',issues:[]}:message);
  }else if(loseMutation&&message.command==='workspace.mutate'&&message.status==='ok'){
   loseMutation=false;listener({protocolVersion:1,requestId:message.requestId,command:message.command,status:'error',code:'HOST_UNAVAILABLE',message:'Injected lost save acknowledgement',outcome:'unknown',retry:'after-recovery',issues:[]});
  }else if(loseProfile&&message.command==='universe.profile.save'&&message.status==='ok'){
   loseProfile=false;listener({protocolVersion:1,requestId:message.requestId,command:message.command,status:'error',code:'HOST_UNAVAILABLE',message:'Injected lost profile acknowledgement',outcome:'unknown',retry:'after-recovery'});
  }else listener(message);
 }:listener);
 return host;
};
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
 activeRequests++;
 let result;try{result=await handler(event,request);}finally{activeRequests--;}
 if(mode==='layout-retry'&&layoutSave&&!lostAck&&result.status==='ok'&&request.values.panels.some(p=>p.id==='timeline'&&p.placement==='floating')){
  lostAck=true;return{protocolVersion:1,requestId:request.requestId,command:request.command,status:'error',code:'HOST_UNAVAILABLE',message:'Injected lost layout acknowledgement',outcome:'unknown',retry:'after-recovery',issues:[]};
 }
 if(mode==='combined-error-quit'&&channel==='writingtool:protection:v1'&&request.command==='protection.resolve'&&result.status==='ok')return{protocolVersion:1,requestId:request.requestId,command:request.command,status:'error',message:'Injected combined proposal save error',outcome:'unknown',operationId:request.requestId};
 if(channel==='writingtool:project:v1'&&request.command==='project.open'&&result.status==='ok')opened=true;
 return result;
});
dialog.showOpenDialog=async(_window,options)=>{
 const title=options?.title||'';
 console.log('PICKER '+title);
 return{canceled:false,filePaths:[path.join(fixture,/backup/i.test(title)?'backups':/universe/i.test(title)?'universe':'project')]};
};
dialog.showErrorBox=(title,message)=>{console.log('ERROR_BOX '+JSON.stringify({title,message}));if(errorExitModes.includes(mode))throw new Error('An OK-only native close error still blocks quitting');};
const originalMessageBox=dialog.showMessageBox.bind(dialog);
shell.openPath=async directory=>{if(directory!==path.join(fixture,'profile/recovery/interrupted-close'))throw new Error('Wrong recovery folder');openedRecoveryFolder=true;return '';};
dialog.showMessageBox=async(window,options)=>{
 if(options.title==='Quit application?'){
  quitChoices++;
  if(!options.buttons.includes('Quit application')||options.defaultId!==0||options.cancelId!==0)throw new Error('Native error exit has no safe cancel and explicit quit choice');
  return{response:errorExitModes.includes(mode)&&!(mode==='close-pending'&&quitChoices===1)?1:0,checkboxChecked:false};
 }
 if(options.title==='Recovery copy could not be completed'&&['error-quit-copy-failure','error-quit-timeout','error-quit-copy-keep'].includes(mode)){copyFailures++;return{response:mode==='error-quit-copy-keep'?0:1,checkboxChecked:false};}
 return originalMessageBox(window,options);
};
app.on('before-quit',()=>{
 if(!errorExitModes.includes(mode))return;
 const directory=path.join(fixture,'profile/recovery/interrupted-close');
 if(!fs.existsSync(directory)){if(mode==='error-quit-copy-failure'&&quitChoices===1){pass=true;console.log('ERROR_EXIT_NO_COPY explicitly confirmed exit after recovery write failure');}return;}
 const copies=fs.readdirSync(directory).map(name=>JSON.parse(fs.readFileSync(path.join(directory,name,'recovery.json'),'utf8')));
 const copy=copies.at(-1);
 if(mode==='error-quit'||mode==='error-quit-copy-keep'){
  if(!copy?.drafts.some(d=>d.kind==='workspace'&&d.value.writing?.text.endsWith(' Retained after save error'))||copy.workspace.length!==1||copy.unresolved.length!==1)throw new Error('Error exit did not retain the exact manuscript draft and pending mutation');
  if(mode==='error-quit'&&!copy.drafts.some(d=>d.kind==='visible-editors'&&d.value.some(editor=>editor.text.includes(' Visible editor text after adapter error'))))throw new Error('Latest visible editor text was omitted');
 }else if(mode==='combined-error-quit'){
  if(!copy.drafts.some(d=>d.kind==='protection'&&d.value.combinedText?.includes(' Combined recovery draft')&&d.value.combined?.data.formatting.paragraphs.some(p=>p.kind==='heading')))throw new Error('Combined recovery proposal text or formatting was omitted');
 }else if(mode==='error-profile-quit'){
  if(!copy.drafts.some(d=>d.kind==='profile'&&d.value.draft.description.includes(' Unsaved profile Ω'))||copy.mutations.length!==1)throw new Error('Dirty profile and pending profile save were omitted');
 }else if(mode==='error-quit-timeout'){
  if(!copy.collectionError||copy.workspace.length!==1||copyFailures!==1)throw new Error('Unresponsive collection did not offer explicit exit with pending inputs retained');
 }else if(mode==='close-stalled'){
  if(!copy.reason.includes('Closing has not finished'))throw new Error('A stalled normal close had no native escape');
 }else{
  const id=mode==='close-backup-error'?corruptedBackup:fs.readFileSync(path.join(fixture,'pending-id'),'utf8');
  if(!copy?.protection.some(([operationId])=>operationId===id)||!fs.existsSync(path.join(fixture,'profile/protection/native-pending',id+'.json')))throw new Error('Native error exit discarded original pending recovery evidence');
 }
 pass=true;console.log('ERROR_EXIT_RECOVERY exact drafts and pending operation context retained before normal app shutdown');
});
const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const deadline=setTimeout(()=>{console.error('TIMEOUT');app.exit(1);},120000);
app.on('will-quit',()=>{clearTimeout(deadline);console.log('WRITINGTOOL_SMOKE '+JSON.stringify({mode,passed:pass,failedQueries,captureCount,backupCount,lostAck,conflicted,expectedBounds,panelId}));if(!pass)process.exitCode=1;});
app.on('browser-window-created',(_event,window)=>{
 if(main)return;main=window;
 if(mode==='error-quit-timeout'){
  const execute=window.webContents.executeJavaScript.bind(window.webContents);
  window.webContents.executeJavaScript=(code,...args)=>code.includes('writingtool-collect-recovery')?new Promise(()=>{}):execute(code,...args);
 }
 window.once('closed',()=>console.log('WINDOW_CLOSED'));
 window.webContents.once('did-finish-load',()=>void drive().catch(async error=>{console.error(error);console.error('BODY '+await evaluate('document.body.innerText'));app.exit(1);}));
});
async function evaluate(code){
 const result=await main.webContents.executeJavaScript(`(async()=>{try{return await (${code});}catch(error){return {__desktopError:error.message};}})()`);
 if(result&&typeof result==='object'&&Object.hasOwn(result,'__desktopError'))throw new Error(result.__desktopError);
 return result;
}
async function waitFor(code,description,timeout=15000){const until=Date.now()+timeout;while(Date.now()<until){if(await evaluate(code))return;await delay(100);}throw new Error('Timed out: '+description+'\n'+await evaluate('document.body.innerText'));}
async function clickText(text){await evaluate(`(()=>{const b=[...document.querySelectorAll('button')].find(b=>b.textContent.trim().startsWith(${JSON.stringify(text)}));if(!b)throw new Error('Missing button '+${JSON.stringify(text)});b.click();})()`);}
async function verifyExclusiveMenus(){
 await waitFor(`document.querySelectorAll('.workspace-panel').length===3&&!document.querySelector('.blocking')`,'settled menu workspace');
 await evaluate(`(()=>{
  const toolbar=[...document.querySelectorAll('header nav details')];
  if(toolbar.length!==8)throw new Error('Expected all eight application menus');
  for(const menu of toolbar){
   menu.querySelector('summary').click();
   const opened=toolbar.filter(item=>item.open);
   if(opened.length!==1||opened[0]!==menu)throw new Error('Opening '+menu.querySelector('summary').textContent+' left another toolbar menu open');
  }
  const last=toolbar.at(-1);last.querySelector('summary').click();
  if(toolbar.some(menu=>menu.open))throw new Error('Clicking the same menu did not close it');
  toolbar[0].querySelector('summary').click();
  const moves=[...document.querySelectorAll('aside .panel-heading details')];
  if(moves.length!==3)throw new Error('Expected all panel Move menus');
  const all=[...toolbar,...moves];
  for(const move of moves){
   move.querySelector('summary').click();
   if(all.filter(menu=>menu.open).length!==1||!move.open)throw new Error('Panel Move menu did not close the previous menu');
  }
  const disclosure=document.querySelector('details.visibility');disclosure.querySelector('summary').click();
  if(!disclosure.open||!moves.at(-1).open)throw new Error('Opening an independent filter disclosure closed the panel menu');
  toolbar[0].querySelector('summary').click();
  if(all.filter(menu=>menu.open).length!==1||!toolbar[0].open)throw new Error('Toolbar did not close the panel Move menu');
  if(!disclosure.open)throw new Error('Opening a menu closed an independent filter disclosure');
 })()`);
 main.focus();
 await delay(100);
 const projectMenu=`document.querySelectorAll('header nav details')[0]`,universeMenu=`document.querySelectorAll('header nav details')[1]`,moveMenu=`document.querySelector('aside .panel-heading details')`;
 async function expectMenu(menu,open=true){
  await waitFor(`(${menu}).open===${open}&&document.querySelectorAll('details[name="writingtool-menu"][open]').length===${open?1:0}`,'exclusive menu state: '+menu);
 }
 async function pointerClick(element){
  const point=await evaluate(`(()=>{const r=(${element}).getBoundingClientRect();return{x:Math.round(r.x+r.width/2),y:Math.round(r.y+r.height/2)};})()`);
  main.webContents.sendInputEvent({type:'mouseDown',...point,button:'left',clickCount:1});
  main.webContents.sendInputEvent({type:'mouseUp',...point,button:'left',clickCount:1});
 }
 async function pressSummary(menu,keyCode,character,open=true){
  await evaluate(`(${menu}).querySelector('summary').focus()`);
  main.webContents.sendInputEvent({type:'keyDown',keyCode});
  main.webContents.sendInputEvent({type:'char',keyCode:character});
  main.webContents.sendInputEvent({type:'keyUp',keyCode});
  await expectMenu(menu,open);
 }
 await pointerClick(`(${universeMenu}).querySelector('summary')`);await expectMenu(universeMenu);
 await pointerClick(`(${universeMenu}).querySelector('summary')`);await expectMenu(universeMenu,false);
 await pointerClick(`(${moveMenu}).querySelector('summary')`);await expectMenu(moveMenu);
 await pointerClick(`(${projectMenu}).querySelector('summary')`);await expectMenu(projectMenu);
 await pressSummary(universeMenu,'Enter','\r');
 await pressSummary(moveMenu,'Space',' ');
 await pressSummary(moveMenu,'Space',' ',false);
 await pressSummary(projectMenu,'Space',' ');
 const viewMenu=`[...document.querySelectorAll('header nav details')].find(menu=>menu.querySelector('summary').textContent==='View')`;
 await pointerClick(`(${viewMenu}).querySelector('summary')`);await expectMenu(viewMenu);
 await pointerClick(`[...(${viewMenu}).querySelectorAll('button')].find(button=>button.textContent==='Font and layout…')`);
 await waitFor(`document.querySelector('.center-form h2')?.textContent==='Settings'`,'portaled menu command');
 await expectMenu(viewMenu,false);
 const writingMenu=`[...document.querySelectorAll('header nav details')].find(menu=>menu.querySelector('summary').textContent==='Writing')`;
 await pointerClick(`(${writingMenu}).querySelector('summary')`);await expectMenu(writingMenu);
 await evaluate(`(()=>{if(!(${writingMenu}).querySelector('button').disabled)throw new Error('Expected unavailable formatting command');})()`);
 await pointerClick(`(${writingMenu}).querySelector('button')`);
 await expectMenu(writingMenu);
 if(!await evaluate(`document.querySelector('.center-form h2')?.textContent==='Settings'`))throw new Error('Disabled command changed the workspace');
 await pointerClick(`document.querySelector('.center-form > button')`);
 await waitFor(`!document.querySelector('.center-form')`,'back from settings');
 await expectMenu(writingMenu);
 const settingsMenu=`[...document.querySelectorAll('header nav details')].find(menu=>menu.querySelector('summary').textContent==='Settings')`;
 await pressSummary(settingsMenu,'Space',' ');
 await evaluate(`(${settingsMenu}).querySelector('button').focus()`);
 main.webContents.sendInputEvent({type:'keyDown',keyCode:'Enter'});
 main.webContents.sendInputEvent({type:'char',keyCode:'\r'});
 main.webContents.sendInputEvent({type:'keyUp',keyCode:'Enter'});
 await waitFor(`document.querySelector('.center-form h2')?.textContent==='Settings'`,'keyboard portaled command');
 await expectMenu(settingsMenu,false);
 const focusState=await evaluate(`(()=>{const active=document.activeElement;return{visible:active.checkVisibility(),tag:active.tagName,text:active.textContent.slice(0,80)};})()`);
 console.log('MENU_COMMAND_FOCUS '+JSON.stringify(focusState));
 if(!focusState.visible||focusState.tag!=='SUMMARY'||focusState.text!=='Settings')throw new Error('Keyboard command did not return focus to its summary');
 await pointerClick(`document.querySelector('.center-form > button')`);
 await waitFor(`!document.querySelector('.center-form')`,'back before Space command');
 await pressSummary(settingsMenu,'Enter','\r');
 await evaluate(`(${settingsMenu}).querySelector('button').focus()`);
 main.webContents.sendInputEvent({type:'keyDown',keyCode:'Space'});
 main.webContents.sendInputEvent({type:'char',keyCode:' '});
 main.webContents.sendInputEvent({type:'keyUp',keyCode:'Space'});
 await waitFor(`document.querySelector('.center-form h2')?.textContent==='Settings'`,'Space portaled command');
 await expectMenu(settingsMenu,false);
 if(!await evaluate(`document.activeElement===(${settingsMenu}).querySelector('summary')&&document.activeElement.checkVisibility()`))throw new Error('Space command did not return focus to its summary');
 await pointerClick(`(${universeMenu}).querySelector('summary')`);await expectMenu(universeMenu);
 await pointerClick(`document.querySelector('[data-top-profile-edit]')`);
 await waitFor(`document.querySelector('#profile-heading')`,'Shell profile command');
 await expectMenu(universeMenu,false);
 await pointerClick(`(${universeMenu}).querySelector('summary')`);await expectMenu(universeMenu);
 await pointerClick(`document.querySelector('[data-top-profile-close]')`);
 await waitFor(`!document.querySelector('#profile-heading')`,'close profile command');
 await expectMenu(universeMenu,false);
 if(!await evaluate(`document.querySelector('details.visibility').open`))throw new Error('Command dismissal closed the independent disclosure');
 await pointerClick(`(${projectMenu}).querySelector('summary')`);await expectMenu(projectMenu);
 console.log('MENU_EXCLUSIVITY pointer, Enter/Space, portaled/Shell command dismissal, disabled commands, panel Move and independent disclosure passed');
}
async function verifyTimeline(){
 const data=JSON.parse(fs.readFileSync(path.join(fixture,'timeline.json'),'utf8'));
 let visibleRecords=data.records.slice(2,-1),pickerRecords=data.records.slice(1);
 const queried=await evaluate(`window.writingTool.workspace({command:'workspace.query'})`);
 if(queried.status!=='ok')throw new Error('Cannot query timeline fixture');
 const unit=queried.snapshot.universe;
 const saved=await evaluate(`window.writingTool.workspace(${JSON.stringify({command:'workspace.mutate',input:{operationId:require('node:crypto').randomUUID(),submittedEditorRevision:'0',units:[{owner:unit.owner,expectedUnitGeneration:unit.generation,changes:data.records.map(record=>({action:'put',record,expectedRecordVersion:null,manuscript:null}))}]}})})`);
 if(saved.status!=='ok')throw new Error('Cannot save timeline fixtures: '+JSON.stringify(saved));
 await evaluate(`window.dispatchEvent(new Event('focus'))`);
 await waitFor(`document.querySelectorAll('.timeline-codes .event-code').length===18`,'loaded timeline records');
 if(!await evaluate(`document.querySelector('select[aria-label="Timeline interval"] option[value="month"]').disabled`))throw new Error('Days-only calendar should explain unavailable month intervals');
 await evaluate(`(()=>{const select=document.querySelector('.timeline-scroll').parentElement.querySelector('select[aria-label="Go to event or decision"]');select.value=${JSON.stringify(data.expected[0])};select.dispatchEvent(new Event('change',{bubbles:true}));})()`);
 await waitFor(`document.querySelectorAll('.timeline-codes .event-code').length===16`,'focused timeline range');
 const check=async(webContents,expected=visibleRecords,width=180)=>{
  const result=await webContents.executeJavaScript(`(async()=>{
   document.documentElement.style.fontSize='32px';
   const viewport=document.querySelector('.timeline-scroll');viewport.style.width='${width}px';viewport.style.height='300px';
   await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
   const buttons=[...viewport.querySelectorAll('.timeline-codes .event-code')];
   const picker=[...viewport.parentElement.querySelector('select[aria-label="Go to event or decision"]').options].map(option=>option.value).filter(Boolean);
   if(JSON.stringify(picker)!==${JSON.stringify(JSON.stringify(pickerRecords.map(record=>record.id)))})return 'Timeline picker is not ordered oldest first';
   const ids=buttons.map(button=>button.getAttribute('aria-label').split(': ')[0]);
   if(buttons.length!==${expected.length})return 'Missing in-range events: '+buttons.length;
   const expectedCodes=${JSON.stringify(expected.map(record=>'event '+record.data.code))};
   if(JSON.stringify(ids)!==JSON.stringify(expectedCodes))return 'Timeline omitted, duplicated or reordered an event';
   const groups=[...viewport.querySelectorAll('.timeline-group')];
   for(let index=1;index<groups.length;index++){
    const previous=groups[index-1].getBoundingClientRect(),current=groups[index].getBoundingClientRect();
    if(current.top<previous.bottom-1)return 'Date groups overlap by '+(previous.bottom-current.top)+' pixels';
   }
   for(const button of buttons){
    button.scrollIntoView({block:'center',inline:'nearest'});
    await new Promise(resolve=>requestAnimationFrame(resolve));
    const rect=button.getBoundingClientRect(),bounds=viewport.getBoundingClientRect();
    let top=Math.max(rect.top,bounds.top,0),bottom=Math.min(rect.bottom,bounds.bottom,innerHeight),left=Math.max(rect.left,bounds.left,0),right=Math.min(rect.right,bounds.right,innerWidth);
    for(let ancestor=viewport.parentElement;ancestor;ancestor=ancestor.parentElement){
     const style=getComputedStyle(ancestor),box=ancestor.getBoundingClientRect();
     if(/auto|scroll|hidden|clip/.test(style.overflowY)){top=Math.max(top,box.top);bottom=Math.min(bottom,box.bottom);}
     if(/auto|scroll|hidden|clip/.test(style.overflowX)){left=Math.max(left,box.left);right=Math.min(right,box.right);}
    }
    const hit=bottom>top&&right>left?document.elementFromPoint((left+right)/2,(top+bottom)/2):null;
    if(!button.contains(hit))return 'An in-range event cannot be reached: '+JSON.stringify({text:button.textContent,rect:rect.toJSON(),viewport:bounds.toJSON(),hit:hit?.outerHTML.slice(0,300)});
   }
   return null;
  })()`);
  if(result)throw new Error(result);
 };
 await check(main.webContents);
 const latest=await evaluate(`window.writingTool.workspace({command:'workspace.query'})`);
 if(latest.status!=='ok')throw new Error('Cannot query event before date edit');
 const changed=structuredClone(latest.snapshot.universe.records.find(record=>record.id===data.expected.at(-1)));
 changed.data.date.day='1';
 const updated=await evaluate(`window.writingTool.workspace(${JSON.stringify({command:'workspace.mutate',input:{operationId:require('node:crypto').randomUUID(),submittedEditorRevision:'0',units:[{owner:latest.snapshot.universe.owner,expectedUnitGeneration:latest.snapshot.universe.generation,changes:[{action:'put',record:changed,expectedRecordVersion:changed.recordVersion,manuscript:null}]}]}})})`);
 if(updated.status!=='ok')throw new Error('Cannot edit fixture event date: '+JSON.stringify(updated));
 visibleRecords=data.records.slice(2,-2);visibleRecords.splice(12,0,changed);
 pickerRecords=[data.records[1],...visibleRecords,data.records.at(-1)];
 await evaluate(`window.dispatchEvent(new Event('focus'))`);
 await waitFor(`JSON.stringify([...document.querySelector('.timeline-scroll').parentElement.querySelector('select[aria-label="Go to event or decision"]').options].map(option=>option.value).filter(Boolean))===${JSON.stringify(JSON.stringify(pickerRecords.map(record=>record.id)))}`,'oldest-first order after date edit');
 await check(main.webContents);
 await evaluate(`document.documentElement.style.fontSize='14px'`);
 await evaluate(`(()=>{const panel=document.querySelector('aside[aria-label="Universe timeline"]');[...panel.querySelectorAll('button')].find(button=>button.textContent==='floating').click();})()`);
 const end=Date.now()+15000;while(BrowserWindow.getAllWindows().length<2&&Date.now()<end)await delay(100);
 const floating=BrowserWindow.getAllWindows().find(window=>window!==main);
 if(!floating)throw new Error('Timeline did not float');
 const ready=Date.now()+15000;while(!await floating.webContents.executeJavaScript(`document.querySelectorAll('.timeline-codes .event-code').length===16`)&&Date.now()<ready)await delay(100);
 await check(floating.webContents);
 if(!await floating.webContents.executeJavaScript(`document.querySelector('.timeline-scroll').scrollTop>0`))throw new Error('Timeline resize fixture must start scrolled');
 await check(floating.webContents,visibleRecords,220);
 const wide=await floating.webContents.executeJavaScript(`(async()=>{const result=await window.writingToolPresentation.presentation({command:'panel.read'});if(result.status!=='ok'||!result.mirror)throw new Error('Cannot read shared timeline');return window.writingToolPresentation.presentation({command:'panel.action',action:{kind:'timeline',value:{...result.mirror.timeline,period:'1000000000000000000000000000000'}}});})()`);
 if(wide.status!=='ok')throw new Error('Cannot expand shared timeline range');
 const expanded=Date.now()+15000;while(!await floating.webContents.executeJavaScript(`document.querySelectorAll('.timeline-codes .event-code').length===17`)&&Date.now()<expanded)await delay(100);
 await check(floating.webContents,[...visibleRecords,data.records.at(-1)]);
 async function publish(records){
  const current=await evaluate(`window.writingTool.workspace({command:'workspace.query'})`);
  if(current.status!=='ok')throw new Error('Cannot query live timeline');
  const unit=current.snapshot.universe;
  const result=await evaluate(`window.writingTool.workspace(${JSON.stringify({command:'workspace.mutate',input:{operationId:require('node:crypto').randomUUID(),submittedEditorRevision:'0',units:[{owner:unit.owner,expectedUnitGeneration:unit.generation,changes:records.map(record=>({action:'put',record,expectedRecordVersion:unit.records.find(saved=>saved.id===record.id)?.recordVersion??null,manuscript:null}))}]}})})`);
  if(result.status!=='ok')throw new Error('Cannot publish live timeline dates: '+JSON.stringify(result));
  await evaluate(`window.dispatchEvent(new Event('focus'))`);
 }
 async function waitInFloating(code,description){
  const deadline=Date.now()+15000;
  while(Date.now()<deadline){if(await floating.webContents.executeJavaScript(code))return;await delay(100);}
  throw new Error('Timed out: '+description);
 }
 const later=structuredClone(changed);later.data.date.day='3';
 await publish([later]);
 visibleRecords=[...data.records.slice(2,-2),later];pickerRecords=[data.records[1],...visibleRecords,data.records.at(-1)];
 await waitInFloating(`JSON.stringify([...document.querySelector('.timeline-scroll').parentElement.querySelector('select[aria-label="Go to event or decision"]').options].map(option=>option.value).filter(Boolean))===${JSON.stringify(JSON.stringify(pickerRecords.map(record=>record.id)))}`,'open floating panel reorders after event date edit');
 await check(floating.webContents,[...visibleRecords,data.records.at(-1)]);
 await floating.webContents.executeJavaScript(`document.querySelector('.timeline-codes .event-code').click()`);
 await waitFor(`document.querySelector('.center-heading h2')?.textContent.includes('Timeline fixture event 1')`,'select canonical event from timeline');
 const uuid=()=>require('node:crypto').randomUUID(),base={schemaVersion:1,owner:changed.owner,universeId:changed.universeId};
 const type={...base,id:uuid(),recordVersion:uuid(),recordType:'decision-type',data:{name:'Timeline ordering fixture',makerRequired:false,builtin:null}};
 const older={...base,id:uuid(),recordVersion:uuid(),recordType:'decision',data:{code:'D-OLD',text:'Older choice',date:{...changed.data.date,day:'2'},order:'0',typeId:type.id,maker:null,characterIds:[],eventIds:[],followingDecisionIds:[]}};
 const newer={...older,id:uuid(),recordVersion:uuid(),data:{...older.data,code:'D-NEW',text:'Newer choice',date:{...older.data.date,day:'3'}}};
 await publish([type,older,newer]);
 await waitInFloating(`document.querySelectorAll('.timeline-codes .decision-code').length===2`,'live decision fixtures');
 await floating.webContents.executeJavaScript(`[...document.querySelectorAll('label.check')].find(label=>label.textContent.includes('Unresolved decisions only')).querySelector('input').click()`);
 await waitInFloating(`(()=>{const rows=[...document.querySelectorAll('.unresolved-lookup button')];return rows.length===2&&rows[0].textContent.startsWith('D-OLD:')&&rows[1].textContent.startsWith('D-NEW:');})()`,'oldest-first unresolved list');
 await publish([{...newer,data:{...newer.data,date:{...newer.data.date,day:'1'}}}]);
 await waitInFloating(`(()=>{const rows=[...document.querySelectorAll('.unresolved-lookup button')];return rows.length===2&&rows[0].textContent.startsWith('D-NEW:')&&rows[1].textContent.startsWith('D-OLD:');})()`,'mounted unresolved list reorders after decision date edit');
 const finalOrder=await floating.webContents.executeJavaScript(`(()=>{const graphic=[...document.querySelectorAll('.timeline-codes .decision-code')].map(button=>button.textContent.split(' ')[0]),picker=[...document.querySelector('.timeline-scroll').parentElement.querySelector('select[aria-label="Go to event or decision"]').options].map(option=>option.value);return JSON.stringify(graphic)==='["D-NEW","D-OLD"]'&&picker.indexOf(${JSON.stringify(newer.id)})<picker.indexOf(${JSON.stringify(older.id)});})()`);
 if(!finalOrder)throw new Error('Decision date edit did not reorder the graphic and picker');
 console.log('TIMELINE_VISIBLE_RANGE all in-range events, oldest-first graphic/picker/unresolved order, live docked/floating date edits, boundaries, nonoverlap, scroll reachability, compressed wide range and canonical selection passed');
}
async function verifyTimelineIntervals(){
 const data=JSON.parse(fs.readFileSync(path.join(fixture,'timeline.json'),'utf8'));
 const queried=await evaluate(`window.writingTool.workspace({command:'workspace.query'})`);
 if(queried.status!=='ok')throw new Error('Cannot query interval fixture');
 const unit=queried.snapshot.universe;
 const saved=await evaluate(`window.writingTool.workspace(${JSON.stringify({command:'workspace.mutate',input:{operationId:require('node:crypto').randomUUID(),submittedEditorRevision:'0',units:[{owner:unit.owner,expectedUnitGeneration:unit.generation,changes:data.records.map(record=>({action:'put',record,expectedRecordVersion:null,manuscript:null}))}]}})})`);
 if(saved.status!=='ok')throw new Error('Cannot save interval fixture: '+JSON.stringify(saved));
 await evaluate(`window.dispatchEvent(new Event('focus'))`);
 await waitFor(`document.querySelectorAll('.timeline-codes .event-code').length===18`,'interval fixture loading');
 await evaluate(`(()=>{const select=document.querySelector('select[aria-label="Go to event or decision"]');select.value=${JSON.stringify(data.expected[0])};select.dispatchEvent(new Event('change',{bubbles:true}));})()`);
 await waitFor(`document.querySelectorAll('.timeline-codes .event-code').length===16`,'interval starting focus');
 const intervalSelector='select[aria-label="Timeline interval"]';
 async function choose(webContents,interval){
  await webContents.executeJavaScript(`(()=>{const select=document.querySelector(${JSON.stringify(intervalSelector)});select.value=${JSON.stringify(interval)};select.dispatchEvent(new Event('change',{bubbles:true}));})()`);
  const deadline=Date.now()+15000;
  while(Date.now()<deadline){
   const selected=await webContents.executeJavaScript(`document.querySelector(${JSON.stringify(intervalSelector)})?.value===${JSON.stringify(interval)}`);
   if(selected){
    if(webContents===main.webContents)return;
    const mirrored=await webContents.executeJavaScript(`window.writingToolPresentation.presentation({command:'panel.read'})`);
    if(mirrored.status==='ok'&&mirrored.mirror?.timeline.interval===interval)return;
   }
   await delay(100);
  }
  throw new Error('Interval did not update: '+interval);
 }
 async function waitCount(webContents,count){
  const deadline=Date.now()+15000;
  while(Date.now()<deadline){if(await webContents.executeJavaScript(`document.querySelectorAll('.timeline-codes .event-code').length===${count}`))return;await delay(100);}
  throw new Error('Interval omitted an event, expected '+count);
 }
 const summaries=[];
 for(const interval of ['day','month','year','decade','century']){
  await choose(main.webContents,interval);await waitCount(main.webContents,interval==='decade'||interval==='century'?18:17);
  const labels=await evaluate(`[...document.querySelectorAll('.timeline-date')].map(button=>button.textContent)`);
  if(interval==='month'&&(!labels.some(label=>label.startsWith('First /'))||!labels.some(label=>label.startsWith('Last /'))||!labels.some(label=>label.startsWith('Festival /'))))throw new Error('Month intervals ignored configured names or standalone day');
  if(interval==='year'&&labels.some(label=>label.includes('/')))throw new Error('Year intervals still use day labels');
  if((interval==='decade'||interval==='century')&&labels.some(label=>!label.includes('–')))throw new Error('Long intervals need year-range labels');
  if(interval!=='day'&&!await evaluate(`document.querySelector('.timeline-record-date')`))throw new Error('Coarse intervals lost exact event dates');
  if(interval!=='day'){
   const problem=await evaluate(`(async()=>{
    const viewport=document.querySelector('.timeline-scroll'),groups=[...viewport.querySelectorAll('.timeline-group')],dates=${JSON.stringify(data.dates)};
    for(let index=1;index<groups.length;index++)if(groups[index].getBoundingClientRect().top<groups[index-1].getBoundingClientRect().bottom-1)return 'Coarse groups overlap';
    for(const button of viewport.querySelectorAll('.event-code')){
     const code=button.getAttribute('aria-label').split(': ')[0].slice(6);
     if(button.querySelector('.timeline-record-date')?.textContent!==dates[code])return 'Coarse interval changed an event date: '+code;
     button.scrollIntoView({block:'center',inline:'nearest'});await new Promise(resolve=>requestAnimationFrame(resolve));
     const rect=button.getBoundingClientRect();let top=Math.max(rect.top,0),bottom=Math.min(rect.bottom,innerHeight),left=Math.max(rect.left,0),right=Math.min(rect.right,innerWidth);
     for(let ancestor=button.parentElement;ancestor;ancestor=ancestor.parentElement){const style=getComputedStyle(ancestor),box=ancestor.getBoundingClientRect();if(/auto|scroll|hidden|clip/.test(style.overflowY)){top=Math.max(top,box.top);bottom=Math.min(bottom,box.bottom);}if(/auto|scroll|hidden|clip/.test(style.overflowX)){left=Math.max(left,box.left);right=Math.min(right,box.right);}}
     if(bottom<=top||right<=left||!button.contains(document.elementFromPoint((left+right)/2,(top+bottom)/2)))return 'Coarse event is unreachable: '+code;
    }
    return null;
   })()`);
   if(problem)throw new Error(problem);
  }
  summaries.push({interval,groups:labels.length});
 }
 await evaluate(`[...document.querySelector('aside[aria-label="Universe timeline"]').querySelectorAll('button')].find(button=>button.textContent==='Zoom in').click()`);
 await waitFor(`document.querySelector('aside[aria-label="Universe timeline"]').innerText.includes('Zoom: 2×')`,'interval zoom');
 await evaluate(`[...document.querySelector('aside[aria-label="Universe timeline"]').querySelectorAll('button')].find(button=>button.textContent==='Zoom out').click()`);
 await waitFor(`document.querySelector('aside[aria-label="Universe timeline"]').innerText.includes('Zoom: 1×')`,'interval zoom reset');
 await evaluate(`[...document.querySelectorAll('button')].find(button=>button.textContent==='Later period').click()`);
 await waitCount(main.webContents,0);
 await evaluate(`[...document.querySelectorAll('button')].find(button=>button.textContent==='Earlier period').click()`);
 await waitCount(main.webContents,18);
 const queriedLate=await evaluate(`window.writingTool.workspace({command:'workspace.query'})`);
 if(queriedLate.status!=='ok')throw new Error('Cannot query late-century fixture');
 const late=structuredClone(queriedLate.snapshot.universe.records.find(record=>record.id===data.records.at(-1).id));
 late.data.date.year=(BigInt(late.data.date.year)+98n).toString();
 const savedLate=await evaluate(`window.writingTool.workspace(${JSON.stringify({command:'workspace.mutate',input:{operationId:require('node:crypto').randomUUID(),submittedEditorRevision:'0',units:[{owner:queriedLate.snapshot.universe.owner,expectedUnitGeneration:queriedLate.snapshot.universe.generation,changes:[{action:'put',record:late,expectedRecordVersion:late.recordVersion,manuscript:null}]}]}})})`);
 if(savedLate.status!=='ok')throw new Error('Cannot save late-century fixture');
 await evaluate(`window.dispatchEvent(new Event('focus'))`);
 for(const zoom of [2,4,8,16,32,64]){
  await evaluate(`[...document.querySelector('aside[aria-label="Universe timeline"]').querySelectorAll('button')].find(button=>button.textContent==='Zoom in').click()`);
  await waitFor(`document.querySelector('aside[aria-label="Universe timeline"]').innerText.includes('Zoom: ${zoom}×')`,'high-zoom century');
 }
 await evaluate(`[...document.querySelectorAll('button')].find(button=>button.textContent==='Last record').click()`);
 await waitFor(`[...document.querySelectorAll('.timeline-codes .event-code')].some(button=>button.getAttribute('aria-label').startsWith(${JSON.stringify('event '+late.data.code+':')}))`,'Last record visible at 64x');
 await evaluate(`document.querySelector('.timeline-date').click()`);
 await waitCount(main.webContents,18);
 await evaluate(`[...document.querySelectorAll('.timeline-codes .event-code')].find(button=>button.getAttribute('aria-label').startsWith(${JSON.stringify('event '+late.data.code+':')})).click()`);
 await waitFor(`document.querySelector('.center-heading h2')?.textContent.includes('Timeline fixture event 17')`,'coarse late-record canonical editor');
 await choose(main.webContents,'year');
 await evaluate(`[...document.querySelector('aside[aria-label="Universe timeline"]').querySelectorAll('button')].find(button=>button.textContent==='floating').click()`);
 const deadline=Date.now()+15000;while(BrowserWindow.getAllWindows().length<2&&Date.now()<deadline)await delay(100);
 const floating=BrowserWindow.getAllWindows().find(window=>window!==main);
 if(!floating)throw new Error('Interval panel did not float');
 await waitCount(floating.webContents,17);
 if(!await floating.webContents.executeJavaScript(`document.querySelector(${JSON.stringify(intervalSelector)}).value==='year'`))throw new Error('Selected interval did not transfer to floating panel');
 await choose(floating.webContents,'month');
 const mirrored=await floating.webContents.executeJavaScript(`window.writingToolPresentation.presentation({command:'panel.read'})`);
 if(mirrored.status!=='ok'||mirrored.mirror.timeline.interval!=='month')throw new Error('Floating interval was not synchronized through owner');
 await floating.webContents.executeJavaScript(`[...document.querySelectorAll('.panel-heading button')].find(button=>button.textContent==='left').click()`);
 await waitFor(`document.querySelector('aside[aria-label="Universe timeline"] select[aria-label="Timeline interval"]')?.value==='month'`,'interval survives docking');
 const visible=await evaluate(`[...document.querySelectorAll('.timeline-codes .event-code')].map(button=>button.getAttribute('aria-label').split(': ')[0])`);
 if(visible.length===0||new Set(visible).size!==visible.length)throw new Error('Interval roundtrip lost or duplicated records');
 const current=await evaluate(`window.writingTool.workspace({command:'workspace.query'})`);
 if(current.status!=='ok')throw new Error('Cannot query calendar before interval fallback');
 const calendar=structuredClone(current.snapshot.universe.records.find(record=>record.recordType==='calendar'));
 const version={...calendar.data.versions.at(-1),id:require('node:crypto').randomUUID(),elements:[],daysOnly:'365'};
 calendar.data.versions.push(version);calendar.data.currentVersion=version.id;
 const removed=await evaluate(`window.writingTool.workspace(${JSON.stringify({command:'workspace.mutate',input:{operationId:require('node:crypto').randomUUID(),submittedEditorRevision:'0',units:[{owner:current.snapshot.universe.owner,expectedUnitGeneration:current.snapshot.universe.generation,changes:[{action:'put',record:calendar,expectedRecordVersion:calendar.recordVersion,manuscript:null}]}]}})})`);
 if(removed.status!=='ok')throw new Error('Cannot test month removal: '+JSON.stringify(removed));
 await evaluate(`window.dispatchEvent(new Event('focus'))`);
 await waitFor(`document.querySelector(${JSON.stringify(intervalSelector)})?.value==='day'&&document.querySelector(${JSON.stringify(intervalSelector)}).querySelector('option[value="month"]').disabled`,'calendar change falls back to Days');
 await choose(main.webContents,'year');
 await evaluate(`(()=>{const select=document.querySelector('select[aria-label="Go to event or decision"]');select.value=${JSON.stringify(data.records[14].id)};select.dispatchEvent(new Event('change',{bubbles:true}));})()`);
 await waitCount(main.webContents,4);
 // Retain this scenario with the commented timeline creation control.
 /*
 await evaluate(`[...document.querySelectorAll('.timeline-codes button')].find(button=>button.textContent==='New event here').click()`);
 await waitFor(`[...document.querySelectorAll('.center-form label')].find(label=>label.textContent.startsWith('Day of year'))?.querySelector('input')?.value==='2'`,'clipped year creation date stays inside visible range');
 await evaluate(`document.querySelector('.center-heading button').click()`);
 await waitFor(`!document.querySelector('.center-form')||!!document.querySelector('.blocking')`,'leave unsaved interval fixture');
 if(await evaluate(`!!document.querySelector('.blocking')`))await clickText('Discard');
 await waitFor(`!document.querySelector('.center-form')&&!document.querySelector('.blocking')`,'discard temporary event draft');
 */
 if(await evaluate(`[...document.querySelectorAll('.timeline-codes button')].some(button=>button.textContent==='New event here')`))throw new Error('Timeline creation button should be hidden');
 console.log('TIMELINE_INTERVALS '+JSON.stringify(summaries)+'; exact dates, standalone day, reachability, late-record 64x navigation, full-period focus, hidden creation button, floating/docking synchronization and month-removal fallback passed');
}
async function verifyFactionReopen(){
 const factionName='Reopen fixture faction';
 await evaluate(`(()=>{const menu=[...document.querySelectorAll('header nav details')].find(menu=>menu.querySelector('summary').textContent==='Universe');menu.querySelector('summary').click();[...menu.querySelectorAll('button')].find(button=>button.textContent==='New faction…').click();})()`);
 await waitFor(`document.querySelector('.center-form label')?.textContent==='Faction name'`,'new faction editor');
 await evaluate(`document.querySelector('.center-form label input').focus()`);
 await main.webContents.insertText(factionName);
 await waitFor(`document.querySelector('.center-form form [role="status"]')?.textContent==='Unsaved changes'`,'faction edit pending');
 await evaluate(`document.querySelector('.center-form form').requestSubmit()`);
 await waitFor(`document.querySelector('.center-form form [role="status"]')?.textContent==='Saved.'&&!document.querySelector('.center-form button[type="submit"]').disabled&&!document.querySelector('.blocking')`,'saved incomplete faction');
 const snapshot=await evaluate(`window.writingTool.workspace({command:'workspace.query'})`);
 if(snapshot.status!=='ok'||!snapshot.snapshot.universe.records.some(record=>record.recordType==='faction'&&record.data.name===factionName))throw new Error('Saved faction is unavailable');
 await evaluate(`document.querySelector('.center-heading button').click()`);
 await waitFor(`!document.querySelector('.center-form')`,'leave faction editor');
 if(!await evaluate(`[...document.querySelectorAll('.context-tabs button')].find(button=>button.textContent==='factions')?.getAttribute('aria-pressed')==='true'`))throw new Error('Faction creation did not select the Factions context tab');
 await waitFor(`[...document.querySelectorAll('aside[aria-label="Writing context"] .context-record')].some(button=>button.textContent===${JSON.stringify(factionName)})`,'saved faction list');
 await evaluate(`[...document.querySelectorAll('aside[aria-label="Writing context"] .context-record')].find(button=>button.textContent===${JSON.stringify(factionName)}).click()`);
 await waitFor(`document.querySelector('.center-form label input')?.value===${JSON.stringify(factionName)}`,'reopened faction editor');
 const description='Saved faction description';
 await evaluate(`[...document.querySelectorAll('.center-form label')].find(label=>label.textContent.startsWith('Description')).querySelector('textarea').focus()`);
 await main.webContents.insertText(description);
 await waitFor(`document.querySelector('.center-form form [role="status"]')?.textContent==='Unsaved changes'`,'reopened faction edit pending');
 await evaluate(`document.querySelector('.center-form form').requestSubmit()`);
 await waitFor(`document.querySelector('.center-form form [role="status"]')?.textContent==='Saved.'&&!document.querySelector('.center-form button[type="submit"]').disabled&&!document.querySelector('.blocking')`,'saved reopened faction edit');
 async function browse(){
  await evaluate(`(()=>{const menu=[...document.querySelectorAll('header nav details')].find(menu=>menu.querySelector('summary').textContent==='Universe');menu.querySelector('summary').click();[...menu.querySelectorAll('button')].find(button=>button.textContent==='Factions…').click();})()`);
 }
 await browse();
 await waitFor(`document.querySelector('.faction-browser [aria-label="Saved factions"]')`,'Universe faction browser');
 await evaluate(`[...document.querySelectorAll('.context-tabs button')].find(button=>button.textContent==='characters').click()`);
 await waitFor(`[...document.querySelectorAll('.context-tabs button')].find(button=>button.textContent==='characters')?.getAttribute('aria-pressed')==='true'`,'Characters selected before faction open');
 await evaluate(`[...document.querySelectorAll('.faction-browser .context-record')].find(button=>button.textContent===${JSON.stringify(factionName)}).click()`);
 await waitFor(`document.querySelector('.center-heading button')?.textContent==='Back to factions'`,'faction browser return link');
 if(!await evaluate(`[...document.querySelectorAll('.context-tabs button')].find(button=>button.textContent==='factions')?.getAttribute('aria-pressed')==='true'`))throw new Error('Opening a faction did not restore its context tab');
 await evaluate(`document.querySelector('.center-heading button').click()`);
 await waitFor(`!!document.querySelector('.faction-browser')`,'return from faction to browser');
 await evaluate(`(()=>{const menu=[...document.querySelectorAll('header nav details')].find(menu=>menu.querySelector('summary').textContent==='View');menu.querySelector('summary').click();[...menu.querySelectorAll('button')].find(button=>button.textContent==='Hide context').click();})()`);
 await waitFor(`!document.querySelector('aside[aria-label="Writing context"]')`,'hidden context panel');
 await evaluate(`[...document.querySelectorAll('.faction-browser .context-record')].find(button=>button.textContent===${JSON.stringify(factionName)}).click()`);
 await waitFor(`document.querySelector('.center-form label input')?.value===${JSON.stringify(factionName)}`,'faction reopened with context hidden');
 if(!await evaluate(`[...document.querySelectorAll('.center-form label')].find(label=>label.textContent.startsWith('Description')).querySelector('textarea').value===${JSON.stringify(description)}`))throw new Error('Reopened faction lost its saved edit');
 await evaluate(`document.querySelector('.center-form label input').focus()`);
 await main.webContents.insertText('unsaved ');
 await browse();
 await waitFor(`document.querySelector('.blocking')?.textContent.includes('Save your changes')`,'faction navigation guard');
 await clickText('Cancel');
 await waitFor(`!document.querySelector('.blocking')&&!!document.querySelector('.center-form label input')`,'cancel keeps faction editor');
 await browse();
 await waitFor(`!!document.querySelector('.blocking')`,'faction discard guard');
 await clickText('Discard');
 await waitFor(`!!document.querySelector('.faction-browser')`,'discard returns to faction browser');
 if(!await evaluate(`[...document.querySelectorAll('.faction-browser .context-record')].some(button=>button.textContent===${JSON.stringify(factionName)})`))throw new Error('Discard changed the saved faction');
 await evaluate(`document.querySelector('.faction-browser > button').click()`);
 await waitFor(`document.querySelector('.center-heading button')?.textContent==='Back to factions'&&document.querySelector('.center-form label input')?.value===''`,'new faction from browser');
 await evaluate(`document.querySelector('.center-heading button').click()`);
 await waitFor(`!!document.querySelector('.blocking')`,'discard unnamed faction guard');
 await clickText('Discard');
 await waitFor(`!!document.querySelector('.faction-browser')&&!document.querySelector('.blocking')`,'discarded new faction returns to browser');
 await evaluate(`[...document.querySelectorAll('.faction-browser .context-record')].find(button=>button.textContent===${JSON.stringify(factionName)}).click()`);
 await waitFor(`!!document.querySelector('.center-form label input')`,'faction before save-on-navigation');
 await evaluate(`(()=>{const input=[...document.querySelectorAll('.center-form label')].find(label=>label.textContent.startsWith('Description')).querySelector('textarea');input.focus();input.select();})()`);
 await main.webContents.insertText('Saved when navigating');
 await waitFor(`document.querySelector('.center-form form [role="status"]')?.textContent==='Unsaved changes'`,'save-on-navigation pending');
 await browse();await waitFor(`!!document.querySelector('.blocking')`,'save-on-navigation guard');
 await evaluate(`[...document.querySelectorAll('.blocking button')].find(button=>button.textContent==='Save').click()`);
 await waitFor(`!!document.querySelector('.faction-browser')&&!document.querySelector('.blocking')`,'saved navigation reaches browser');
 await evaluate(`[...document.querySelectorAll('.faction-browser .context-record')].find(button=>button.textContent===${JSON.stringify(factionName)}).click()`);
 await waitFor(`[...document.querySelectorAll('.center-form label')].find(label=>label.textContent.startsWith('Description'))?.querySelector('textarea').value==='Saved when navigating'`,'navigation saved faction edit');
 await evaluate(`(()=>{const menu=[...document.querySelectorAll('header nav details')].find(menu=>menu.querySelector('summary').textContent==='Project');menu.querySelector('summary').click();[...menu.querySelectorAll('button')].find(button=>button.textContent==='Close project').click();})()`);
 await waitFor(`!document.querySelector('.center-form')&&document.querySelector('footer')?.textContent.includes('Project closed.')&&[...document.querySelectorAll('header nav button')].some(button=>button.textContent==='Factions…'&&!button.disabled)`,'project closed for faction reload');
 await browse();await waitFor(`!!document.querySelector('.faction-browser')`,'standalone universe faction browser');
 await evaluate(`[...document.querySelectorAll('.faction-browser .context-record')].find(button=>button.textContent===${JSON.stringify(factionName)}).click()`);
 await waitFor(`[...document.querySelectorAll('.center-form label')].find(label=>label.textContent.startsWith('Description'))?.querySelector('textarea').value==='Saved when navigating'`,'standalone universe faction edit');
 await evaluate(`(()=>{const menu=[...document.querySelectorAll('header nav details')].find(menu=>menu.querySelector('summary').textContent==='Project');menu.querySelector('summary').click();[...menu.querySelectorAll('button')].find(button=>button.textContent.startsWith('Close universe')).click();})()`);
 await waitFor(`document.body.innerText.includes('Open your writing project')`,'universe closed before persisted reload');
 await clickText('Open project…');
 await waitFor(`document.querySelector('footer')?.textContent.includes('Project opened with its authoritative universe.')&&[...document.querySelectorAll('header nav button')].some(button=>button.textContent==='Factions…'&&!button.disabled)`,'project reopened for faction');
 await browse();await waitFor(`!!document.querySelector('.faction-browser')`,'saved faction browser after reload');
 await evaluate(`[...document.querySelectorAll('.faction-browser .context-record')].find(button=>button.textContent===${JSON.stringify(factionName)}).click()`);
 await waitFor(`[...document.querySelectorAll('.center-form label')].find(label=>label.textContent.startsWith('Description'))?.querySelector('textarea').value==='Saved when navigating'`,'persisted faction reload');
 await evaluate(`(()=>{const menu=[...document.querySelectorAll('header nav details')].find(menu=>menu.querySelector('summary').textContent==='View');menu.querySelector('summary').click();[...menu.querySelectorAll('button')].find(button=>button.textContent==='Show context').click();})()`);
 await waitFor(`!!document.querySelector('aside[aria-label="Writing context"]')`,'show faction context');
 await evaluate(`[...document.querySelector('aside[aria-label="Writing context"]').querySelectorAll('button')].find(button=>button.textContent==='floating').click()`);
 const end=Date.now()+15000;while(BrowserWindow.getAllWindows().length<2&&Date.now()<end)await delay(100);
 const floating=BrowserWindow.getAllWindows().find(window=>window!==main);
 if(!floating)throw new Error('Faction context did not float');
 const loaded=Date.now()+15000;while(!await floating.webContents.executeJavaScript(`[...document.querySelectorAll('.context-record')].some(button=>button.textContent===${JSON.stringify(factionName)})`)&&Date.now()<loaded)await delay(100);
 await floating.webContents.executeJavaScript(`[...document.querySelectorAll('.context-record')].find(button=>button.textContent===${JSON.stringify(factionName)}).click()`);
 await waitFor(`document.querySelector('.center-form label input')?.value===${JSON.stringify(factionName)}`,'floating faction opens canonical editor');
 console.log('FACTION_REOPEN create/save, browser return, unnamed-draft discard, saved edits, hidden/floating context, Save/Cancel/Discard guards and standalone/project universe reload passed');
}
async function verifyWriting(){
 await waitFor(`document.querySelectorAll('.workspace-panel').length===3&&!document.querySelector('.blocking')`,'settled writing workspace');
 await clickText('Create story…');
 await waitFor(`!!document.querySelector('.center-form form')`,'new story form');
 await evaluate(`document.querySelector('.center-form label input').focus()`);
 await main.webContents.insertText('Writing fixture story');
 await evaluate(`document.querySelector('.center-form form').requestSubmit()`);
 await waitFor(`document.querySelector('.center-form form [role="status"]')?.textContent==='Saved.'&&!document.querySelector('.blocking')`,'saved story');
 await evaluate(`document.querySelector('.center-heading button').click()`);
 await waitFor(`!document.querySelector('.center-form')`,'back from story');
 await clickText('Writing fixture story');
 await waitFor(`[...document.querySelectorAll('header nav button')].some(button=>button.textContent==='New chapter…'&&!button.disabled)`,'selected story');
 await evaluate(`(()=>{const menu=[...document.querySelectorAll('header nav details')].find(menu=>menu.querySelector('summary').textContent==='Writing');menu.querySelector('summary').click();[...menu.querySelectorAll('button')].find(button=>button.textContent==='New chapter…').click();})()`);
 await waitFor(`!!document.querySelector('.center-form form')`,'new chapter form');
 await evaluate(`document.querySelector('.center-form label input').focus()`);
 await main.webContents.insertText('Writing fixture chapter');
 await evaluate(`document.querySelector('.center-form form').requestSubmit()`);
 await waitFor(`document.querySelector('.center-form form [role="status"]')?.textContent==='Saved.'&&!document.querySelector('.blocking')`,'saved chapter');
 await clickText('Write chapter');
 await waitFor(`!!document.querySelector('.manuscript[contenteditable="true"]')&&!document.querySelector('.blocking')`,'editable chapter');
 main.focus();
 const point=await evaluate(`(()=>{const editor=document.querySelector('.manuscript');editor.scrollIntoView({block:'start'});const bounds=editor.getBoundingClientRect();const point={x:Math.round(bounds.left+Math.min(100,bounds.width/2)),y:Math.round(Math.max(bounds.top,0)+40)};if(!editor.contains(document.elementFromPoint(point.x,point.y)))throw new Error('Manuscript cannot be clicked');return point;})()`);
 main.webContents.sendInputEvent({type:'mouseDown',...point,button:'left',clickCount:1});
 main.webContents.sendInputEvent({type:'mouseUp',...point,button:'left',clickCount:1});
 await waitFor(`document.activeElement===document.querySelector('.manuscript')`,'pointer focuses manuscript');
 await main.webContents.insertText('Writing works 🌍');
 await waitFor(`document.querySelector('.manuscript')?.textContent==='Writing works 🌍'&&document.querySelector('.writing-meta [role="status"]')?.textContent.startsWith('Unsaved changes')&&!document.querySelector('.blocking')`,'typed manuscript reaches draft');
 async function press(keyCode,character,modifiers=[]){
  main.webContents.sendInputEvent({type:'keyDown',keyCode,modifiers});
  if(character)main.webContents.sendInputEvent({type:'char',keyCode:character,modifiers});
  main.webContents.sendInputEvent({type:'keyUp',keyCode,modifiers});
  await delay(80);
 }
 const beforeZoom=await evaluate(`document.querySelector('aside[aria-label="Universe timeline"]')?.innerText`);
 await press('=',null,['control','shift']);
 if(await evaluate(`document.querySelector('aside[aria-label="Universe timeline"]')?.innerText`)!==beforeZoom)throw new Error('Editor shortcut changed timeline zoom');
 await press('Enter','\r');
 await press('A','a');
 await waitFor(`document.querySelector('.manuscript')?.textContent==='Writing works 🌍a'&&!document.querySelector('.blocking')`,'keyboard Enter and letter input');
 await press('A',null,['control']);
 await press('B',null,['control']);
 await waitFor(`document.querySelector('.manuscript .manuscript-bold')?.textContent==='Writing works 🌍'&&!document.querySelector('.blocking')`,'keyboard bold formatting');
 await evaluate(`(()=>{const select=document.querySelector('select[aria-label="Paragraph style"]');select.value='h2';select.dispatchEvent(new Event('change',{bubbles:true}));})()`);
 await waitFor(`document.querySelector('.manuscript h2')?.textContent==='Writing works 🌍'&&!document.querySelector('.blocking')`,'heading formatting');
 await press('S',null,['control']);
 await waitFor(`document.querySelector('.writing-meta [role="status"]')?.textContent.startsWith('Saved.')&&!document.querySelector('.blocking')`,'saved manuscript');
 const queried=await evaluate(`window.writingTool.workspace({command:'workspace.query'})`);
 if(queried.status!=='ok'||!Object.values(queried.snapshot.project.manuscripts).includes('Writing works 🌍\na'))throw new Error('Typed writing did not reach authoritative storage');
 const chapter=queried.snapshot.project.records.find(record=>record.recordType==='chapter');
 if(chapter.data.formatting.paragraphs[0].kind!=='heading'||!chapter.data.formatting.paragraphs[0].marks[0]?.styles.includes('bold'))throw new Error('Manuscript formatting was not saved');
 if(mode==='writing'){
  const exited=new Promise(resolve=>host.once('exit',resolve));host.kill();await exited;
  const denied=await evaluate(`window.writingTool.closeUniverse()`);
  if(denied.status!=='error'||denied.code!=='VALIDATION')throw new Error('Host restart bypassed the associated project guard');
  const exitedAgain=new Promise(resolve=>host.once('exit',resolve));host.kill();await exitedAgain;
 }
 await press('W',null,['control']);
 await waitFor(`document.querySelector('footer')?.textContent.includes('Project closed.')&&!document.querySelector('.manuscript')`,'closed writing project');
 const remainingUniverse=await evaluate(`window.writingTool.currentUniverse()`);
 if(remainingUniverse.status!=='ok'||remainingUniverse.snapshot?.ownerId!==queried.snapshot.universe.owner.id)throw new Error('Closing the project lost its open universe');
 if(mode==='writing'){
  const closed=await evaluate(`window.writingTool.closeUniverse()`);
  if(closed.status!=='ok'||closed.snapshot!==null)throw new Error('The standalone universe did not close');
  const exited=new Promise(resolve=>host.once('exit',resolve));host.kill();await exited;
  const empty=await evaluate(`window.writingTool.workspace({command:'workspace.query'})`);
  if(empty.status!=='ok'||empty.snapshot.universe||empty.snapshot.project)throw new Error('Host restart reopened a deliberately closed universe');
 }
 await clickText('Open project…');
 await waitFor(`[...document.querySelectorAll('.chapter-select')].some(button=>button.textContent.startsWith('Writing fixture chapter'))`,'reloaded chapter navigation');
 await evaluate(`document.querySelector('.chapter-select').click()`);
 await waitFor(`document.querySelector('.manuscript h2 .manuscript-bold')?.textContent==='Writing works 🌍'&&!document.querySelector('.blocking')`,'reopened formatted manuscript');
 if(mode==='writing'||mode==='reconcile-defer'){
  const exited=new Promise(resolve=>host.once('exit',resolve));host.kill();await exited;
  await evaluate(`document.querySelector('[data-top-profile-edit]').click()`);
  await waitFor(`!!document.querySelector('#profile-heading')&&!document.querySelector('.blocking')`,'profile command restores crashed host');
  await evaluate(`document.querySelector('.profile textarea').focus()`);
  await main.webContents.insertText(' Keyboard profile edit');
  await press('Escape');
  await waitFor(`!!document.querySelector('#pending-heading')`,'profile departure dialog');
  await press('Tab',null,['shift']);
  if(!await evaluate(`document.querySelector('.blocking').contains(document.activeElement)`))throw new Error('Shift+Tab escaped the dialog');
  await press('Tab');
  if(!await evaluate(`document.querySelector('.blocking').contains(document.activeElement)`))throw new Error('Tab escaped the dialog');
  await press('Escape');
  await waitFor(`!document.querySelector('.blocking')&&document.activeElement===document.querySelector('.profile textarea')`,'Escape restores profile input focus');
  await press('S',null,['control']);
  await waitFor(`document.querySelector('footer')?.textContent.startsWith('Saved ')&&!document.querySelector('[data-profile-save]').disabled`,'keyboard profile save');
  const universe=await evaluate(`window.writingTool.currentUniverse()`);
  if(universe.status!=='ok'||!universe.snapshot.profile.description.includes('Keyboard profile edit'))throw new Error('Profile Ctrl+S was lost to workspace shortcut');
  if(mode==='writing'){
   const exited=new Promise(resolve=>host.once('exit',resolve));host.kill();await exited;
   const restored=await evaluate(`window.writingTool.currentUniverse()`);
   if(restored.status!=='ok'||restored.snapshot.generation!==universe.snapshot.generation||restored.snapshot.recordVersion!==universe.snapshot.recordVersion||restored.snapshot.profile.description!==universe.snapshot.profile.description)throw new Error('Restart lost the saved profile context');
   await evaluate(`document.querySelector('.profile textarea').focus()`);
   await main.webContents.insertText(' Second save after restart');
   await press('S',null,['control']);
   await waitFor(`document.querySelector('footer')?.textContent.startsWith('Saved ')&&!document.querySelector('[data-profile-save]').disabled`,'profile saved again after restart');
   const savedAgain=await evaluate(`window.writingTool.currentUniverse()`);
   if(savedAgain.status!=='ok'||!savedAgain.snapshot.profile.description.includes('Second save after restart')||savedAgain.snapshot.generation===universe.snapshot.generation)throw new Error('Second profile save used stale restored context');
  }
  await press('W',null,['control']);
  await waitFor(`!document.querySelector('#profile-heading')&&document.activeElement===document.querySelector('.manuscript')`,'profile close restores writing focus');
 }
 console.log('MANUSCRIPT_WRITING chapter creation, text/keyboard input, bold, headings, durable save and reopening passed');
}
async function verifyDeferredReconcile(){
 const id=fs.readFileSync(path.join(fixture,'pending-id'),'utf8');
 const liveId=fs.readFileSync(path.join(fixture,'live-id'),'utf8');
 const otherId=fs.readFileSync(path.join(fixture,'other-pending-id'),'utf8');
 await waitFor(`document.body.innerText.includes('Unfinished backup or recovery needs attention')`,'pending backup warning');
 await clickText('Reconcile pending operations…');
 await waitFor(`!!document.querySelector('.protection-center')&&[...document.querySelectorAll('.protection-center button')].some(button=>button.textContent===${JSON.stringify('Reconcile '+id)})`,'retained pending backup');
 const denied=await evaluate(`window.writingTool.protection({command:'protection.defer',operationId:${JSON.stringify(liveId)}})`);
 if(denied.status!=='error'||JSON.parse(fs.readFileSync(path.join(fixture,'profile/protection/native-pending',liveId+'.json'),'utf8')).deferred)throw new Error('Live recovery was allowed to bypass reconciliation');
 const projectBlocked=await evaluate(`window.writingTool.openProject()`);
 if(projectBlocked.status!=='error'||projectBlocked.code!=='RECOVERY_REQUIRED')throw new Error('A pending live recovery did not block project changes');
 const workspaceBlocked=await evaluate(`window.writingTool.workspace({command:'settings.select-backup'})`);
 const universeBlocked=await evaluate(`window.writingTool.closeUniverse()`);
 if(workspaceBlocked.status!=='error'||workspaceBlocked.code!=='RECOVERY_REQUIRED'||universeBlocked.status!=='error'||universeBlocked.code!=='RECOVERY_REQUIRED')throw new Error('A pending live recovery did not block workspace or universe changes');
 main.close();await delay(150);
 if(main.isDestroyed()||captureCount||backupCount)throw new Error('Native close bypassed a pending live recovery');
 await clickText('Reconcile '+liveId);
 await waitFor(`document.querySelector('.blocking')?.textContent.includes('confirmed not completed')`,'unsent recovery reconciled safely');
 await evaluate(`[...document.querySelectorAll('.blocking button')].find(button=>button.textContent==='Cancel').click()`);
 await waitFor(`!document.querySelector('.blocking')&&!document.querySelector('.protection-center')?.textContent.includes(${JSON.stringify(liveId)})`,'live recovery removed from pending UI');
 await clickText('Open project…');
 await waitFor(`document.querySelector('footer')?.textContent.includes('Project opened with its authoritative universe.')&&!document.querySelector('.blocking')`,'open project while unfinished copies remain');
 await clickText('Reconcile pending operations…');
 await waitFor(`[...document.querySelectorAll('.protection-center button')].some(button=>button.textContent===${JSON.stringify('Reconcile '+id)})`,'reopen pending copy review');
 await clickText('Reconcile '+id);
 await waitFor(`document.querySelector('.blocking')?.textContent.includes('Operation needs attention')`,'failed reconciliation dialog');
 const metadata=()=>JSON.parse(fs.readFileSync(path.join(fixture,'profile/protection/native-pending',id+'.json'),'utf8'));
 if(metadata().deferred)throw new Error('Failed reconciliation was silently deferred');
 const directory=path.join(fixture,'profile/protection/native-pending');
 if(process.platform!=='win32')fs.chmodSync(directory,0o500);
 try{
  const exited=new Promise(resolve=>host.once('exit',resolve));host.kill();await exited;
  await waitFor(`document.activeElement?.textContent==='Continue writing'`,'safe action has keyboard focus');
  main.webContents.sendInputEvent({type:'keyDown',keyCode:'Enter'});
  main.webContents.sendInputEvent({type:'char',keyCode:'\r'});
  main.webContents.sendInputEvent({type:'keyUp',keyCode:'Enter'});
  await waitFor(`!document.querySelector('.blocking')&&!document.querySelector('.protection-center')`,'keyboard escape from failed reconciliation without metadata writes');
  if(metadata().deferred)throw new Error('Returning to writing unexpectedly changed original evidence');
  if(!fs.existsSync(path.join(directory,otherId+'.json')))throw new Error('Another pending backup was lost');
 }finally{if(process.platform!=='win32')fs.chmodSync(directory,0o700);}
 const retained=await evaluate(`window.writingTool.protection({command:'protection.pending'})`);
 if(retained.status!=='ok'||!retained.value.pending.includes(id)||!retained.value.deferrable.includes(id))throw new Error('Deferred operation was lost');
 const rejected=await evaluate(`window.writingTool.protection({command:'protection.defer',operationId:'00000000-0000-4000-8000-000000000000'})`);
 if(rejected.status!=='error')throw new Error('An unrelated operation could be deferred');
 console.log('RECONCILE_DEFER failed backup reconciliation escaped; metadata and original job retained');
}
async function verifyReadQueue(){
 await waitFor(`document.querySelectorAll('.workspace-panel').length===3&&!document.querySelector('.blocking')`,'settled request queue workspace');
 const id=fs.readFileSync(path.join(fixture,'pending-id'),'utf8');
 for(const [command,fail] of [['project',false],['universe',false],['reconcile',false],['project',true]]){
  const idle=Date.now()+5000;while(Date.now()<idle){if(!activeRequests){await delay(100);if(!activeRequests)break;}await delay(10);}
  if(activeRequests)throw new Error('Background requests did not settle');
  releaseRead=undefined;holdRead=true;
  await evaluate(`(()=>{window.__heldRead=window.writingTool.workspace({command:'workspace.query'});})()`);
  const until=Date.now()+5000;while(!releaseRead&&Date.now()<until)await delay(10);
  if(!releaseRead)throw new Error('Read response was not held');
  const request=command==='project'?`window.writingTool.currentProject()`:command==='universe'?`window.writingTool.currentUniverse()`:`window.writingTool.protection({command:'protection.reconcile',operationId:${JSON.stringify(id)}})`;
  await evaluate(`(()=>{window.__queuedDone=false;window.__queued=${request}.then(result=>{window.__queuedDone=true;return result;});})()`);
  await delay(100);
  if(await evaluate(`window.__queuedDone`))throw new Error(command+' did not wait for the active workspace read');
  releaseRead(fail);releaseRead=undefined;
  const read=await evaluate(`window.__heldRead`),result=await evaluate(`window.__queued`);
  if(read.status!==(fail?'error':'ok')||result.status!=='ok')throw new Error(command+' was stranded or rejected after workspace read: '+JSON.stringify(result));
 }
 console.log('READ_QUEUE project, universe and reconcile wait for background reads; failed reads release queued requests');
}
async function verifyCombinedDraftQuit(){
 const proposal=await evaluate(`(async()=>{
  const queried=await window.writingTool.workspace({command:'workspace.query'});if(queried.status!=='ok')throw new Error('No recovery fixture snapshot');
  const unit=queried.snapshot.project,chapter=structuredClone(unit.records.find(record=>record.recordType==='chapter'));
  const captured=await window.writingTool.protection({command:'protection.capture',owner:unit.owner,reason:'Manual'});if(captured.status!=='ok'||!captured.value.manifest)throw new Error('Capture failed');
  chapter.data.title+=' changed live';
  const changed=await window.writingTool.workspace({command:'workspace.mutate',input:{operationId:crypto.randomUUID(),submittedEditorRevision:'0',units:[{owner:unit.owner,expectedUnitGeneration:unit.generation,changes:[{action:'put',record:chapter,expectedRecordVersion:chapter.recordVersion,manuscript:unit.manuscripts[chapter.id]}]}]}});if(changed.status!=='ok')throw new Error('Live comparison edit failed');
  const recovered=await window.writingTool.protection({command:'protection.recover',owner:unit.owner,revisionId:captured.value.manifest.id,scope:[chapter.id]});if(recovered.status!=='ok'||!recovered.value.recovery)throw new Error('Recovery proposal failed');
  return recovered.value.recovery.proposal.id;
 })()`);
 await evaluate(`document.querySelector('[data-top-reconcile]').click()`);
 await waitFor(`document.querySelector('.protection-center')?.textContent.includes(${JSON.stringify('Resume recovery proposal '+proposal)})`,'resume comparison proposal');
 await clickText('Resume recovery proposal '+proposal);
 await waitFor(`[...document.querySelectorAll('button')].some(button=>button.textContent==='Edit combined')`,'comparison conflict');
 await clickText('Edit combined');
 await waitFor(`!!document.querySelector('.protection-center .manuscript')`,'combined manuscript editor');
 await evaluate(`(()=>{const editor=document.querySelector('.protection-center .manuscript');editor.focus();const selection=getSelection();selection.selectAllChildren(editor);selection.collapseToEnd();})()`);
 await main.webContents.insertText(' Combined recovery draft');
 await waitFor(`document.querySelector('.protection-center .manuscript')?.textContent.includes(' Combined recovery draft')`,'combined proposal draft');
 await clickText('Save combined proposal');
 await waitFor(`document.querySelector('.blocking')?.textContent.includes('Injected combined proposal save error')`,'failed combined proposal save');
 await evaluate(`[...document.querySelectorAll('.blocking button')].find(button=>button.textContent==='Quit application…').click()`);
}
async function drive(){
 await waitFor(`document.querySelector('[data-readiness="ready"]')`,'host readiness');
 await waitFor(`!document.querySelector('.blocking')`,'initial workspace loading');
 if(mode==='recovery-notice'){
  await waitFor(`document.body.innerText.includes('Drafts from an interrupted exit are available.')`,'retained recovery copy notice after restart');
  await clickText('Open saved recovery copies');
  const until=Date.now()+5000;while(!openedRecoveryFolder&&Date.now()<until)await delay(20);
  if(!openedRecoveryFolder)throw new Error('Saved recovery copies could not be found after relaunch');
  pass=true;main.close();return;
 }
 if(mode==='close-stalled'){
  await evaluate(`document.addEventListener('writingtool-window-close',event=>event.stopImmediatePropagation(),{capture:true})`);
  main.close();await delay(150);
  if(quitChoices||main.isDestroyed())throw new Error('Normal close did not wait for the renderer decision');
  main.close();return;
 }
 if(mode==='close-pending'){
  main.close();
  const until=Date.now()+5000;while(quitChoices!==1&&Date.now()<until)await delay(20);
  if(quitChoices!==1||main.isDestroyed())throw new Error('Keeping the app open did not cancel the error exit');
  await delay(100);
  if(fs.existsSync(path.join(fixture,'profile/recovery/interrupted-close')))throw new Error('Canceling exit unexpectedly wrote recovery drafts');
  main.close();return;
 }
 if(mode==='reconcile-defer')await verifyDeferredReconcile();
 if(!opened)await clickText('Open project…');
 const openDeadline=Date.now()+15000;while(!opened&&Date.now()<openDeadline)await delay(100);
 if(!opened)throw new Error('Project did not open');
 await waitFor(`document.body.innerText.includes('Your universe records')||document.body.innerText.includes('Create or select a story')||document.body.innerText.includes('Injected temporary snapshot')`,'project workspace');
 if(mode==='close-drain-cancel'){
  await waitFor(`document.querySelectorAll('.workspace-panel').length===3&&!document.querySelector('.blocking')`,'settled close-drain workspace');
  holdProjectClose=true;main.close();
  const until=Date.now()+15000;while(!releaseProjectClose&&Date.now()<until)await delay(20);
  if(!releaseProjectClose)throw new Error('Native root-close response was not held');
  main.close();
  const choiceUntil=Date.now()+5000;while(quitChoices!==1&&Date.now()<choiceUntil)await delay(20);
  await delay(50);
  const blocked=await evaluate(`window.writingTool.currentUniverse()`);
  if(quitChoices!==1||blocked.status!=='error')throw new Error('Canceling recovery exit cleared another native drain lock');
  pass=true;releaseProjectClose();return;
 }
 if(mode==='error-profile-quit'){
  await waitFor(`!document.querySelector('.blocking')`,'settled profile workspace');
  await evaluate(`document.querySelector('[data-top-profile-edit]').click()`);
  await waitFor(`!!document.querySelector('.profile textarea')`,'profile editor');
  await evaluate(`document.querySelector('.profile textarea').focus()`);await main.webContents.insertText(' Unsaved profile Ω');
  loseProfile=true;await evaluate(`document.querySelector('.profile form').requestSubmit()`);
  await waitFor(`document.querySelector('.blocking')?.textContent.includes('Injected lost profile acknowledgement')`,'unknown profile save result');
  await evaluate(`[...document.querySelectorAll('.blocking button')].find(button=>button.textContent==='Quit application…').click()`);return;
 }
 if(mode==='writing'||mode==='reconcile-defer'||mode==='reconcile-background'||mode==='error-quit'||mode==='close-backup-error'||mode==='error-quit-copy-failure'||mode==='error-quit-timeout'||mode==='error-quit-copy-keep'||mode==='combined-error-quit'){
  await verifyWriting();
  if(mode==='combined-error-quit'){await verifyCombinedDraftQuit();return;}
  if(mode==='error-quit'||mode==='error-quit-copy-failure'||mode==='error-quit-timeout'||mode==='error-quit-copy-keep'){
   await evaluate(`(()=>{const editor=document.querySelector('.manuscript');editor.focus();const selection=getSelection();selection.selectAllChildren(editor);selection.collapseToEnd();})()`);
   await main.webContents.insertText(' Retained after save error');
   await waitFor(`document.querySelector('.writing-meta [role="status"]')?.textContent.startsWith('Unsaved changes')`,'unsaved recovery manuscript');
   if(['error-quit-copy-failure','error-quit-copy-keep'].includes(mode))fs.writeFileSync(path.join(fixture,'profile/recovery'),'Injected unwritable recovery directory');
   loseMutation=true;
   await evaluate(`document.querySelector('.writing-meta button:nth-of-type(2)').click()`);
   await waitFor(`document.querySelector('.blocking')?.textContent.includes('Injected lost save acknowledgement')`,'unknown save result');
   if(mode==='error-quit')await evaluate(`document.addEventListener('writingtool-collect-recovery',()=>document.querySelector('.manuscript').append(' Visible editor text after adapter error'),{capture:true,once:true})`);
   await evaluate(`[...document.querySelectorAll('.blocking button')].find(button=>button.textContent==='Quit application…').click()`);
   if(mode==='error-quit-copy-keep'){
    const until=Date.now()+5000;while(copyFailures!==1&&Date.now()<until)await delay(20);
    await waitFor(`!document.body.inert&&!!document.querySelector('.blocking')`,'interactive editor after keeping app open');
    if(copyFailures!==1||main.isDestroyed()||!await evaluate(`document.querySelector('.manuscript').textContent.endsWith(' Retained after save error')`))throw new Error('Keeping open after failed recovery copy lost draft or controls');
    fs.unlinkSync(path.join(fixture,'profile/recovery'));
    await evaluate(`[...document.querySelectorAll('.blocking button')].find(button=>button.textContent==='Quit application…').click()`);
   }
   return;
  }
  main.close();
  if(mode==='close-backup-error'){
   await waitFor(`document.querySelector('.blocking')?.textContent.includes('Required closing operation failed')`,'closing backup error');
   await evaluate(`[...document.querySelectorAll('.blocking button')].find(button=>button.textContent==='Quit application…').click()`);
   return;
  }
  if(mode==='reconcile-background'){
   await waitFor(`document.querySelector('.blocking')?.textContent.includes('Required closing operation failed')`,'closing output failure');
   await clickText('Cancel closing');
   await waitFor(`document.querySelector('.blocking')?.textContent.includes('Protection needs attention')&&[...document.querySelectorAll('.blocking button')].some(button=>button.textContent==='Continue writing'&&!button.disabled)`,'background reconciliation escape');
   await evaluate(`[...document.querySelectorAll('.blocking button')].find(button=>button.textContent==='Continue writing').click()`);
   await waitFor(`!document.querySelector('.blocking')`,'background warning deferred');
   await evaluate(`(()=>{const editor=document.querySelector('.manuscript');editor.focus();const selection=getSelection();selection.selectAllChildren(editor);selection.collapseToEnd();})()`);
   await main.webContents.insertText(' after failed closing');
   await waitFor(`document.querySelector('.writing-meta [role="status"]')?.textContent.startsWith('Unsaved changes')`,'writing after canceled closing');
   await evaluate(`document.querySelector('.writing-meta button:nth-of-type(2)').click()`);
   await waitFor(`document.querySelector('.writing-meta [role="status"]')?.textContent.startsWith('Saved.')&&!document.querySelector('.blocking')`,'save after canceled closing');
   const metadata=JSON.parse(fs.readFileSync(path.join(fixture,'profile/protection/native-pending',corruptedBackup+'.json'),'utf8'));
   if(metadata.request.requestId!==corruptedBackup)throw new Error('Background escape did not retain the original operation');
   console.log('RECONCILE_BACKGROUND canceled failed close, continued writing and saved; original evidence retained');
   main.close();
  }
 }else if(mode==='read-queue'){
  await verifyReadQueue();
  main.close();
 }else if(mode==='reconcile-defer-restart'){
  const id=fs.readFileSync(path.join(fixture,'pending-id'),'utf8');
  const retained=await evaluate(`window.writingTool.protection({command:'protection.pending'})`);
  if(retained.status!=='ok'||!retained.value.pending.includes(id))throw new Error('Restart lost the retained operation');
  await waitFor(`!!document.querySelector('.chapter-select')&&!document.querySelector('.blocking')`,'writing available after restart');
  await evaluate(`document.querySelector('.chapter-select').click()`);
  await waitFor(`!!document.querySelector('.manuscript')&&!document.querySelector('.blocking')`,'reopened writing after restart');
  await evaluate(`(()=>{const editor=document.querySelector('.manuscript');editor.focus();const selection=getSelection();selection.selectAllChildren(editor);selection.collapseToEnd();})()`);
  await main.webContents.insertText(' after restart');
  await waitFor(`document.querySelector('.writing-meta [role="status"]')?.textContent.startsWith('Unsaved changes')`,'restart manuscript edited');
  await evaluate(`document.querySelector('.writing-meta button:nth-of-type(2)').click()`);
  await waitFor(`document.querySelector('.writing-meta [role="status"]')?.textContent.startsWith('Saved.')&&!document.querySelector('.blocking')`,'restart manuscript saved');
  const queried=await evaluate(`window.writingTool.workspace({command:'workspace.query'})`);
  if(queried.status!=='ok'||!Object.values(queried.snapshot.project.manuscripts).some(text=>text.endsWith(' after restart')))throw new Error('Deferred operation blocked saving after restart');
  console.log('RECONCILE_DEFER_RESTART retained job, project opening, editing, saving and normal close passed');
  main.close();
 }else if(mode==='factions'){
  await verifyFactionReopen();
  main.close();
 }else if(mode==='intervals'){
  await verifyTimelineIntervals();
  main.close();
 }else if(mode==='timeline'){
  await verifyTimeline();
  main.close();
 }else if(mode==='menus'){
  await verifyExclusiveMenus();
  main.close();
 }else if(mode==='read-failure'){
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
