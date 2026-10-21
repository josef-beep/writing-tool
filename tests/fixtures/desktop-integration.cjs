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
 await evaluate(`(()=>{const select=document.querySelector('.timeline-scroll').parentElement.querySelector('label select');select.value=${JSON.stringify(data.expected[0])};select.dispatchEvent(new Event('change',{bubbles:true}));})()`);
 await waitFor(`document.querySelectorAll('.timeline-codes .event-code').length===16`,'focused timeline range');
 const check=async(webContents,expected=visibleRecords,width=180)=>{
  const result=await webContents.executeJavaScript(`(async()=>{
   document.documentElement.style.fontSize='32px';
   const viewport=document.querySelector('.timeline-scroll');viewport.style.width='${width}px';viewport.style.height='300px';
   await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
   const buttons=[...viewport.querySelectorAll('.timeline-codes .event-code')];
   const picker=[...viewport.parentElement.querySelector('label select').options].map(option=>option.value).filter(Boolean);
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
 await waitFor(`JSON.stringify([...document.querySelector('.timeline-scroll').parentElement.querySelector('label select').options].map(option=>option.value).filter(Boolean))===${JSON.stringify(JSON.stringify(pickerRecords.map(record=>record.id)))}`,'oldest-first order after date edit');
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
 await waitInFloating(`JSON.stringify([...document.querySelector('.timeline-scroll').parentElement.querySelector('label select').options].map(option=>option.value).filter(Boolean))===${JSON.stringify(JSON.stringify(pickerRecords.map(record=>record.id)))}`,'open floating panel reorders after event date edit');
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
 const finalOrder=await floating.webContents.executeJavaScript(`(()=>{const graphic=[...document.querySelectorAll('.timeline-codes .decision-code')].map(button=>button.textContent.split(' ')[0]),picker=[...document.querySelector('.timeline-scroll').parentElement.querySelector('label select').options].map(option=>option.value);return JSON.stringify(graphic)==='["D-NEW","D-OLD"]'&&picker.indexOf(${JSON.stringify(newer.id)})<picker.indexOf(${JSON.stringify(older.id)});})()`);
 if(!finalOrder)throw new Error('Decision date edit did not reorder the graphic and picker');
 console.log('TIMELINE_VISIBLE_RANGE all in-range events, oldest-first graphic/picker/unresolved order, live docked/floating date edits, boundaries, nonoverlap, scroll reachability, compressed wide range and canonical selection passed');
}
async function drive(){
 await waitFor(`document.querySelector('[data-readiness="ready"]')`,'host readiness');
 await waitFor(`!document.querySelector('.blocking')`,'initial workspace loading');
 await clickText('Open project…');
 const openDeadline=Date.now()+15000;while(!opened&&Date.now()<openDeadline)await delay(100);
 if(!opened)throw new Error('Project did not open');
 await waitFor(`document.body.innerText.includes('Your universe records')||document.body.innerText.includes('Create or select a story')||document.body.innerText.includes('Injected temporary snapshot')`,'project workspace');
 if(mode==='timeline'){
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
