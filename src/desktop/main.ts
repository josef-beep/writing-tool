import { randomUUID } from 'node:crypto';
import { UNIVERSE_CHANNEL, validUniverseRequest, closed, isUuid, type SaveReceipt, type ReconciliationExpectation, type UniverseSnapshot } from '../application/contracts/universe';
import { UniverseHostClient, hostUnavailable } from './universe-host-client';
import { app, BrowserWindow, dialog, ipcMain, utilityProcess, type IpcMainInvokeEvent, type UtilityProcess } from 'electron';
import path from 'node:path';
import fs from 'node:fs';
import squirrelStartup from 'electron-squirrel-startup';
import { validRequest } from '../application/contracts/readiness';
import { HostClient } from './host-client';
import { READINESS_CHANNEL, trustedSender } from './security';
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;
const diagnostic = process.env.WRITINGTOOL_DIAGNOSTIC === '1';
const fault = diagnostic ? process.env.WRITINGTOOL_HOST_FAULT : undefined;
if (diagnostic && process.env.WRITINGTOOL_PROFILE)
    app.setPath('userData', process.env.WRITINGTOOL_PROFILE);
let window: BrowserWindow | undefined;
let child: UtilityProcess | undefined;
let client: HostClient | undefined;
let universeClient: UniverseHostClient | undefined;
let hostExited = false;
let drained = false;
let draining = false;
let quitPermit: 'window' | 'app' | undefined;
let quitDecisionInFlight = false;
const mutationLocations = new Map<string, {
    location: string;
    expected: ReconciliationExpectation;
}>();
const unresolvedOperations = new Set<string>();
function rememberMutation(id: string, location: string, expected: ReconciliationExpectation): void {
    mutationLocations.set(id, { location, expected });
    unresolvedOperations.add(id);
    for (const oldId of mutationLocations.keys()) {
        if (mutationLocations.size <= 32)
            break;
        if (!unresolvedOperations.has(oldId))
            mutationLocations.delete(oldId);
    }
}
let activeLocation: string | undefined;
let activeSnapshot: UniverseSnapshot | null = null;
let diagnosticChooserCanceled = false;
let diagnosticLoseSaveAck = false;
let diagnosticLostReceipt: SaveReceipt | undefined;
let diagnosticDelaySaveAck = false;
let diagnosticAckRelease: (() => void) | undefined;
let shutdown = false;
let invalidRequestsRejected = false;
let permissionChecks = 0;
let permissionRequests = 0;
let hostErrors = 0;
function authorized(event: Pick<IpcMainInvokeEvent, 'sender' | 'senderFrame'>): boolean {
    return !!window && !window.isDestroyed() && !!event.senderFrame && trustedSender(event.sender.id, window.webContents.id, event.senderFrame === window.webContents.mainFrame, event.senderFrame.url, MAIN_WINDOW_WEBPACK_ENTRY);
}
if (squirrelStartup)
    app.quit();
else
    app.whenReady().then(async () => {
        try {
            if (fault === 'start')
                throw new Error('Diagnostic startup failure');
            child = utilityProcess.fork(path.join(__dirname, 'utility-host.cjs'), fault ? [`--diagnostic-fault=${fault}`] : [], { serviceName: 'WritingTool application host' });
            client = new HostClient(child);
            universeClient = new UniverseHostClient(child);
            child.on('message', message => {
                if (typeof message === 'object' && message !== null && 'command' in message)
                    universeClient?.receive(message);
                else
                    client?.receive(message);
            });
            child.on('exit', () => {
                hostExited = true;
                client?.fail('HOST_EXITED');
                universeClient?.fail();
            });
            child.on('error', () => {
                hostErrors++;
                client?.fail('HOST_EXITED');
                universeClient?.fail();
            });
            // Exercise Electron's documented FatalError event path without inducing a crash.
            if (fault === 'fatal-error')
                child.emit('error', 'FatalError', 'diagnostic', '{}');
        }
        catch {
            client = new HostClient(undefined);
            universeClient = new UniverseHostClient(undefined);
            hostExited = true;
        }
        ipcMain.on('writingtool:quit-request:v1', (event, value: unknown) => {
            if (authorized(event) && closed(value, ['protocolVersion', 'requestId', 'command']) && value.protocolVersion === 1 && isUuid(value.requestId) && value.command === 'application.quit')
                void requestNativeQuit('app');
        });
        ipcMain.handle(READINESS_CHANNEL, (event, request: unknown) => {
            if (!authorized(event) || !validRequest(request))
                throw new Error('Readiness request denied');
            return client!.request(request);
        });
        ipcMain.handle(UNIVERSE_CHANNEL, async (event, value: unknown) => {
            if (!authorized(event) || !validUniverseRequest(value) || draining)
                throw new Error('Universe request denied');
            const request = value;
            const reconcilesPending = request.command === 'universe.open' && request.reconcileOperationId && mutationLocations.has(request.reconcileOperationId);
            if (unresolvedOperations.size > 0 && request.command !== 'universe.current' && !reconcilesPending)
                return { protocolVersion: 1, requestId: request.requestId, command: request.command, status: 'error', code: 'RECOVERY_REQUIRED', message: 'Reconcile the pending operation in its original folder before another operation or close.', outcome: 'unknown', retry: 'after-recovery' };
            if (request.command === 'universe.open' && hostExited && !fault) {
                child = utilityProcess.fork(path.join(__dirname, 'utility-host.cjs'), [], { serviceName: 'WritingTool application host' });
                client = new HostClient(child);
                universeClient = new UniverseHostClient(child);
                hostExited = false;
                child.on('message', message => {
                    if (typeof message === 'object' && message !== null && 'command' in message)
                        universeClient?.receive(message);
                    else
                        client?.receive(message);
                });
                child.on('exit', () => {
                    hostExited = true;
                    client?.fail('HOST_EXITED');
                    universeClient?.fail();
                });
                child.on('error', () => {
                    client?.fail('HOST_EXITED');
                    universeClient?.fail();
                });
            }
            if (request.command === 'universe.create' || request.command === 'universe.open') {
                const injected = diagnostic ? process.env.WRITINGTOOL_UNIVERSE_FOLDER : undefined;
                let selection: {
                    canceled: boolean;
                    filePaths: string[];
                };
                try {
                    selection = diagnostic && diagnosticChooserCanceled ? { canceled: true, filePaths: [] } : injected ? { canceled: false, filePaths: [injected] } : await dialog.showOpenDialog(window!, { title: request.command === 'universe.create' ? 'Choose an empty folder for the universe' : 'Open universe folder', properties: ['openDirectory'] });
                }
                catch {
                    return { protocolVersion: 1, requestId: request.requestId, command: request.command, status: 'error', code: 'IO_FAILURE', message: 'The folder chooser could not open. Try selecting a location again.', outcome: 'not-committed', retry: 'new-request' };
                }
                if (selection.canceled || !selection.filePaths[0])
                    return { protocolVersion: 1, requestId: request.requestId, command: request.command, status: 'canceled' };
                let basePath: string;
                try {
                    basePath = fs.realpathSync(selection.filePaths[0]);
                }
                catch {
                    return { protocolVersion: 1, requestId: request.requestId, command: request.command, status: 'error', code: 'IO_FAILURE', message: 'The selected folder is unavailable. Your edits were retained.', outcome: request.command === 'universe.open' && request.reconcileOperationId ? 'unknown' : 'not-committed', retry: request.command === 'universe.open' && request.reconcileOperationId ? 'after-recovery' : 'new-request' };
                }
                const pending = request.command === 'universe.open' && request.reconcileOperationId ? mutationLocations.get(request.reconcileOperationId) : undefined;
                if (request.command === 'universe.open' && request.reconcileOperationId && !pending)
                    return { protocolVersion: 1, requestId: request.requestId, command: request.command, status: 'error', code: 'RECOVERY_REQUIRED', message: 'The original operation context is unavailable. Preserve the pending edits.', outcome: 'unknown', retry: 'after-recovery' };
                if (request.command === 'universe.create')
                    rememberMutation(request.input.operationId, basePath, { identity: { creationOperationId: request.input.operationId }, mutation: { command: request.command, input: request.input } });
                const result = await universeClient!.request({ ...request, basePath, ...(pending ? { reconcileExpected: pending.expected } : {}) });
                if (result.status === 'ok') {
                    activeLocation = result.snapshot?.location;
                    activeSnapshot = result.snapshot;
                }
                if (request.command === 'universe.create' && !(result.status === 'error' && result.outcome === 'unknown'))
                    unresolvedOperations.delete(request.input.operationId);
                if (request.command === 'universe.open' && result.status === 'ok' && request.reconcileOperationId)
                    unresolvedOperations.delete(request.reconcileOperationId);
                return result;
            }
            if (request.command === 'universe.profile.save' && activeLocation && activeSnapshot)
                rememberMutation(request.input.operationId, activeLocation, { identity: { ownerId: activeSnapshot.ownerId, rootId: activeSnapshot.rootId }, mutation: { command: request.command, input: request.input } });
            let result = await universeClient!.request(request);
            if (diagnostic && diagnosticDelaySaveAck && request.command === 'universe.profile.save' && result.status === 'ok') {
                diagnosticDelaySaveAck = false;
                await new Promise<void>(resolve => {
                    diagnosticAckRelease = () => {
                        diagnosticAckRelease = undefined;
                        resolve();
                    };
                });
            }
            if (diagnostic && diagnosticLoseSaveAck && request.command === 'universe.profile.save' && result.status === 'ok') {
                diagnosticLoseSaveAck = false;
                diagnosticLostReceipt = result.receipt;
                result = hostUnavailable(request);
            }
            if (request.command === 'universe.profile.save' && !(result.status === 'error' && result.outcome === 'unknown'))
                unresolvedOperations.delete(request.input.operationId);
            return result;
        });
        window = new BrowserWindow({ width: 960, height: 680, minWidth: 360, minHeight: 360, backgroundColor: '#292929', show: false, webPreferences: { preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY, sandbox: true, contextIsolation: true, nodeIntegration: false, webviewTag: false, additionalArguments: diagnostic ? ['--writingtool-smoke'] : [] } });
        window.webContents.on('console-message', (_event, _level, message) => {
            if (diagnostic && message === 'WRITINGTOOL_INVALID_REQUESTS true')
                invalidRequestsRejected = true;
        });
        window.removeMenu();
        window.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
        window.webContents.on('will-navigate', event => event.preventDefault());
        window.webContents.on('will-redirect', event => event.preventDefault());
        window.webContents.on('will-attach-webview', event => event.preventDefault());
        window.webContents.session.setPermissionRequestHandler((_contents, _permission, callback) => {
            permissionRequests++;
            callback(false);
        });
        window.webContents.session.setPermissionCheckHandler(() => {
            permissionChecks++;
            return false;
        });
        window.webContents.on('will-prevent-unload', event => {
            if (drained)
                event.preventDefault();
        });
        window.on('close', event => {
            if (drained || quitPermit === 'window') {
                quitPermit = undefined;
                drained = true;
                return;
            }
            event.preventDefault();
            void requestNativeQuit('window');
        });
        window.on('closed', () => {
            client?.fail('UNAVAILABLE');
            window = undefined;
        });
        window.once('ready-to-show', () => window?.show());
        await window.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
        if (diagnostic)
            void smoke();
    }).catch(error => {
        console.error(error);
        app.exit(1);
    });
async function smoke(): Promise<void> {
    const deadline = Date.now() + 14000;
    let observed: Record<string, unknown> = {};
    while (Date.now() < deadline && window && !window.isDestroyed()) {
        observed = await window.webContents.executeJavaScript(`({state:document.querySelector('[data-readiness]')?.getAttribute('data-readiness'),text:document.querySelector('[data-readiness]')?.textContent,keys:Object.keys(window.writingTool || {}),node:typeof window.require,process:typeof window.process})`);
        if (observed.state === 'ready' || observed.state === 'unavailable')
            break;
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    if (fault === 'exit-after-ready' && observed.state === 'ready') {
        child?.kill();
        while (Date.now() < deadline) {
            observed = await window!.webContents.executeJavaScript(`({state:document.querySelector('[data-readiness]')?.getAttribute('data-readiness'),text:document.querySelector('[data-readiness]')?.textContent,keys:Object.keys(window.writingTool || {}),node:typeof window.require,process:typeof window.process})`);
            if (observed.state === 'unavailable')
                break;
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }
    let universeFlow: unknown = undefined;
    if (!fault && process.env.WRITINGTOOL_UNIVERSE_FOLDER) {
        diagnosticChooserCanceled = true;
        const canceled = await window!.webContents.executeJavaScript(`window.writingTool.openUniverse()`);
        diagnosticChooserCanceled = false;
        const presentation = await window!.webContents.executeJavaScript(`(async () => {
            const tick=()=>new Promise(resolve=>setTimeout(resolve,70));
            const setName=(input,value)=>{ Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(input,value); input.dispatchEvent(new Event('input',{bubbles:true})); };
            Array.from(document.querySelectorAll('button')).find(button=>button.textContent==='Create universe').click(); await tick();
            let form=document.querySelector('.profile form'); form.requestSubmit(); await tick();
            const requiredName=!!document.querySelector('#name-error');
            let input=document.querySelector('.profile input'); setName(input,'Unsaved smoke draft'); await tick();
            document.dispatchEvent(new Event('writingtool-window-close')); await tick();
            const pendingGuard=document.querySelector('#pending-heading')?.textContent==='Save your changes?';
            Array.from(document.querySelectorAll('.blocking button')).find(button=>button.textContent==='Cancel')?.click(); await tick();
            const preservedDraft=input.value==='Unsaved smoke draft';
            setName(input,'   '); await tick();
            Array.from(form.querySelectorAll('button')).find(button=>button.textContent==='Close').click(); await tick();
            Array.from(document.querySelectorAll('.blocking button')).find(button=>button.textContent==='Save')?.click(); await tick();
            const failedSaveRetains=!!document.querySelector('#name-error') && input.value==='   ';
            setName(input,'Discarded draft'); await tick();
            Array.from(form.querySelectorAll('button')).find(button=>button.textContent==='Close').click(); await tick();
            Array.from(document.querySelectorAll('.blocking button')).find(button=>button.textContent==='Discard')?.click(); await tick();
            const discarded=!document.querySelector('.profile');
            Array.from(document.querySelectorAll('button')).find(button=>button.textContent==='Create universe').click(); await tick();
            form=document.querySelector('.profile form'); input=document.querySelector('.profile input'); setName(input,'Smoke universe'); await tick(); form.requestSubmit();
            for(let i=0;i<100 && document.querySelector('#profile-heading')?.textContent!=='Universe profile';i++) await tick();
            const staysOpen=document.querySelector('#profile-heading')?.textContent==='Universe profile';
            return {requiredName,pendingGuard,preservedDraft,failedSaveRetains,discarded,staysOpen};
        })()`);
        const created = await window!.webContents.executeJavaScript('window.writingTool.currentUniverse()');
        const mouseClick = async (selector: string) => {
            const point = await window!.webContents.executeJavaScript(`(() => {const rect=document.querySelector(${JSON.stringify(selector)}).getBoundingClientRect();return {x:Math.round(rect.x+rect.width/2),y:Math.round(rect.y+rect.height/2)};})()`);
            window!.webContents.sendInputEvent({ type: 'mouseDown', button: 'left', clickCount: 1, ...point });
            window!.webContents.sendInputEvent({ type: 'mouseUp', button: 'left', clickCount: 1, ...point });
            await new Promise(resolve => setTimeout(resolve, 100));
        };
        await mouseClick('nav details:nth-child(2) summary');
        await mouseClick('[data-top-profile-close]');
        const mouseCloseProfile = await window!.webContents.executeJavaScript(`!document.querySelector('.profile')`);
        await mouseClick('nav details:nth-child(2) summary');
        await mouseClick('[data-top-profile-edit]');
        const mouseEditProfile = await window!.webContents.executeJavaScript(`!!document.querySelector('.profile') && !document.querySelector('header').inert`);
        diagnosticLoseSaveAck = true;
        await window!.webContents.executeJavaScript(`(async () => {
            const input=document.querySelector('.profile input'), description=document.querySelector('.profile textarea');
            Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(input,'Saved smoke universe'); input.dispatchEvent(new Event('input',{bubbles:true}));
            Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,'value').set.call(description,'Persisted through the secured utility host.'); description.dispatchEvent(new Event('input',{bubbles:true}));
            await new Promise(resolve=>setTimeout(resolve,70));
        })()`);
        await mouseClick('nav details:nth-child(2) summary');
        const mouseMenuUsable = await window!.webContents.executeJavaScript(`document.querySelector('nav details:nth-child(2)').open && !document.querySelector('[data-top-profile-save]').disabled`);
        await mouseClick('[data-top-profile-save]');
        const recovery = await window!.webContents.executeJavaScript(`(async () => {
            const tick=()=>new Promise(resolve=>setTimeout(resolve,70));
            const input=document.querySelector('.profile input');
            for(let i=0;i<100 && !document.querySelector('#error-heading');i++) await tick();
            const unknownRetained=!!document.querySelector('#error-heading') && document.querySelector('[data-profile-save]').disabled;
            document.dispatchEvent(new Event('writingtool-window-close')); await tick();
            const ordinaryDiscardBlocked=!document.querySelector('#pending-heading') && input.value==='Saved smoke universe';
            Array.from(document.querySelectorAll('.blocking button')).find(button=>button.textContent==='Return to editor')?.click();
            return {unknownRetained,ordinaryDiscardBlocked};
        })()`);
        await mouseClick('nav details:nth-child(2) summary');
        recovery.mouseReconcile = await window!.webContents.executeJavaScript(`!document.querySelector('[data-top-reconcile]').disabled`);
        await mouseClick('[data-top-reconcile]');
        recovery.reconciled = await window!.webContents.executeJavaScript(`(async()=>{for(let i=0;i<100 && document.querySelector('[data-profile-save]').disabled;i++)await new Promise(resolve=>setTimeout(resolve,70));return !document.querySelector('#error-heading')&&!document.querySelector('[data-profile-save]').disabled&&document.querySelector('.profile input').value==='Saved smoke universe';})()`);
        const delayedAck = async (departure: boolean, submittedName: string, newerName: string) => {
            diagnosticDelaySaveAck = true;
            await window!.webContents.executeJavaScript(`(async () => {
                const input=document.querySelector('.profile input');
                Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(input,${JSON.stringify(submittedName)}); input.dispatchEvent(new Event('input',{bubbles:true}));
                await new Promise(resolve=>setTimeout(resolve,70));
                if(${departure}) {document.querySelector('[data-top-profile-close]').click();await new Promise(resolve=>setTimeout(resolve,70));Array.from(document.querySelectorAll('.blocking button')).find(button=>button.textContent==='Save').click();}
                else document.querySelector('[data-top-profile-save]').click();
            })()`);
            for (let i = 0; i < 100 && !diagnosticAckRelease; i++)
                await new Promise(resolve => setTimeout(resolve, 30));
            if (!diagnosticAckRelease)
                return false;
            await window!.webContents.executeJavaScript(`(() => {const input=document.querySelector('.profile input');Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(input,${JSON.stringify(newerName)});input.dispatchEvent(new Event('input',{bubbles:true}));})()`);
            diagnosticAckRelease();
            return window!.webContents.executeJavaScript(`(async()=>{for(let i=0;i<100 && document.querySelector('[data-profile-save]').disabled;i++)await new Promise(resolve=>setTimeout(resolve,30));const retained=!!document.querySelector('.profile')&&document.querySelector('.profile input').value===${JSON.stringify(newerName)};document.querySelector('[data-top-profile-close]').click();await new Promise(resolve=>setTimeout(resolve,70));const dirty=!!document.querySelector('#pending-heading');Array.from(document.querySelectorAll('.blocking button')).find(button=>button.textContent==='Cancel')?.click();return retained&&dirty;})()`);
        };
        const typingAfterSave = await delayedAck(false, 'First delayed submission', 'Newer retained draft');
        const departureSaveRetainsNewer = await delayedAck(true, 'Departure submitted draft', 'Even newer retained draft');
        await window!.webContents.executeJavaScript(`(async()=>{document.querySelector('[data-top-profile-close]').click();await new Promise(resolve=>setTimeout(resolve,70));Array.from(document.querySelectorAll('.blocking button')).find(button=>button.textContent==='Discard').click();})()`);
        const exactDescription = '  Exact\r\n Ω🌌 \t';
        const exactSaved = await window!.webContents.executeJavaScript(`(async()=>{const current=await window.writingTool.currentUniverse();const s=current.snapshot;return window.writingTool.saveUniverseProfile({operationId:crypto.randomUUID(),ownerId:s.ownerId,expectedUnitGeneration:s.generation,expectedRecordVersion:s.recordVersion,submittedEditorRevision:'999',data:{name:'Saved smoke universe',description:${JSON.stringify(exactDescription)}}});})()`);
        const exactDescriptionSaved = exactSaved.status === 'ok' && exactSaved.snapshot?.profile.description === exactDescription;
        diagnosticChooserCanceled = true;
        const activeCancellation = await window!.webContents.executeJavaScript(`(async () => { const before=await window.writingTool.currentUniverse(); const result=await window.writingTool.openUniverse(); const after=await window.writingTool.currentUniverse(); return result.status==='canceled' && JSON.stringify(before.snapshot)===JSON.stringify(after.snapshot); })()`);
        diagnosticChooserCanceled = false;
        const closed = await window!.webContents.executeJavaScript('window.writingTool.closeUniverse()');
        const oldChild = child;
        const exited = new Promise(resolve => oldChild?.once('exit', resolve));
        oldChild?.kill();
        await exited;
        const reopened = await window!.webContents.executeJavaScript(`window.writingTool.openUniverse()`);
        await window!.webContents.executeJavaScript(`(async()=>{await window.writingTool.closeUniverse();Array.from(document.querySelectorAll('nav button')).find(button=>button.textContent.startsWith('New universe')).click();await new Promise(resolve=>setTimeout(resolve,70));const input=document.querySelector('.profile input');Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(input,'Unsaved native close draft');input.dispatchEvent(new Event('input',{bubbles:true}));})()`);
        const cancelNative = async (kind: 'window' | 'app') => {
            if (kind === 'window')
                window!.close();
            else
                app.quit();
            const preserved = await window!.webContents.executeJavaScript(`(async()=>{for(let i=0;i<100&&!document.querySelector('#pending-heading');i++)await new Promise(resolve=>setTimeout(resolve,30));const retained=!!document.querySelector('#pending-heading')&&document.querySelector('.profile input')?.value==='Unsaved native close draft';Array.from(document.querySelectorAll('.blocking button')).find(button=>button.textContent==='Cancel')?.click();return retained;})()`);
            await new Promise(resolve => setTimeout(resolve, 70));
            return preserved && !!window && !window.isDestroyed();
        };
        const nativeWindowCancel = await cancelNative('window');
        const nativeAppCancel = await cancelNative('app');
        universeFlow = {
            passed: nativeWindowCancel && nativeAppCancel && canceled.status === 'canceled' && activeCancellation && Object.values(presentation).every(Boolean) && Object.values(recovery).every(Boolean) && mouseCloseProfile && mouseEditProfile && mouseMenuUsable && created.status === 'ok' && closed.status === 'ok' && reopened.status === 'ok' && reopened.snapshot?.ownerId === created.snapshot?.ownerId && reopened.snapshot?.profile?.name === 'Saved smoke universe' && reopened.snapshot?.generation === exactSaved.snapshot?.generation && reopened.snapshot?.profile.description === exactDescription && exactDescriptionSaved && typingAfterSave && departureSaveRetainsNewer,
            receipt: diagnosticLostReceipt, nativeWindowCancel, nativeAppCancel, presentation, typingAfterSave, departureSaveRetainsNewer, exactDescriptionSaved, topCommands: { mouseCloseProfile, mouseEditProfile, mouseMenuUsable, mouseSave: recovery.unknownRetained, mouseReconcile: recovery.mouseReconcile }, recovery, activeCancellation, reopened,
            nativePickerBoundary: 'explicit diagnostic selection and cancellation',
            acknowledgmentBoundary: 'explicit diagnostic loss after durable host reply'
        };
    }
    const expected = fault ? 'unavailable' : 'ready';
    const untrusted = new BrowserWindow({ show: false, webPreferences: { preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY, sandbox: true, contextIsolation: true, nodeIntegration: false } });
    await untrusted.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
    const untrustedResult = await untrusted.webContents.executeJavaScript('window.writingTool.readiness()');
    const untrustedUniverse = await untrusted.webContents.executeJavaScript('window.writingTool.currentUniverse()');
    const senderDenied = untrustedUniverse.status === 'error' && untrustedUniverse.code === 'HOST_UNAVAILABLE' && untrustedResult.status === 'unavailable' && untrustedResult.code === 'UNAVAILABLE';
    untrusted.destroy();
    const checksBefore = permissionChecks;
    const requestsBefore = permissionRequests;
    const permissions = await window!.webContents.executeJavaScript(`Promise.race([
    (async () => {
      const query = await navigator.permissions.query({name: 'geolocation'});
      const request = await new Promise(resolve => navigator.geolocation.getCurrentPosition(
        () => resolve('granted'), error => resolve(error.code === 1 ? 'denied' : 'error'),
        {timeout: 1000, maximumAge: 0}
      ));
      return {query: query.state, request};
    })(),
    new Promise(resolve => setTimeout(() => resolve({query: 'timeout', request: 'timeout'}), 2000))
  ])`);
    const permissionsDenied = permissions.query === 'denied' && permissions.request === 'denied' && permissionChecks > checksBefore && permissionRequests > requestsBefore;
    const before = window!.webContents.getURL();
    const windowCount = BrowserWindow.getAllWindows().length;
    await window!.webContents.executeJavaScript(`window.open('https://example.invalid'); location.href='https://example.invalid';`);
    await new Promise(resolve => setTimeout(resolve, 150));
    const security = observed.node === 'undefined' && observed.process === 'undefined' && JSON.stringify(observed.keys) === '["createUniverse","openUniverse","currentUniverse","saveUniverseProfile","closeUniverse","readiness"]' && window!.webContents.getURL() === before && BrowserWindow.getAllWindows().length === windowCount;
    const expectedCode = ({ start: 'HOST_START_FAILED', exit: 'HOST_EXITED', invalid: 'INVALID_RESPONSE', timeout: 'TIMEOUT', 'exit-after-ready': 'HOST_EXITED', 'fatal-error': 'HOST_EXITED' } as Record<string, string>)[fault ?? ''];
    const universePassed = !universeFlow || (universeFlow as {
        passed: boolean;
    }).passed;
    const passed = universePassed && observed.state === expected && client?.pendingCount === 0 && security && senderDenied && invalidRequestsRejected && permissionsDenied && (fault !== 'fatal-error' || hostErrors === 1) && (!expectedCode || String(observed.text).includes(expectedCode));
    console.log('WRITINGTOOL_SMOKE ' + JSON.stringify({ passed, packaged: app.isPackaged, fault: fault ?? 'none', observed, security, senderDenied, invalidRequestsRejected, permissionsDenied, permissionChecks, permissionRequests, hostErrors, pending: client?.pendingCount, universeFlow, versions: process.versions }));
    if (!passed) {
        app.exit(1);
        return;
    }
    // Success exits through the same production dirty decision and host drain.
    app.quit();
    if (window && !window.isDestroyed())
        await window.webContents.executeJavaScript(`(async()=>{for(let i=0;i<100&&!document.querySelector('#pending-heading');i++)await new Promise(resolve=>setTimeout(resolve,30));Array.from(document.querySelectorAll('.blocking button')).find(button=>button.textContent==='Discard')?.click();})()`).catch(() => {
        });
}
async function requestNativeQuit(kind: 'window' | 'app'): Promise<void> {
    if (quitDecisionInFlight || draining)
        return;
    quitDecisionInFlight = true;
    try {
        const owned = window;
        if (owned && !owned.isDestroyed()) {
            const token = randomUUID();
            const approved = await owned.webContents.executeJavaScript(`new Promise(resolve => {
                const token=${JSON.stringify(token)};
                const listener=event=>{if(event.detail?.token!==token)return;document.removeEventListener('writingtool-quit-decision',listener);resolve(event.detail.approved===true);};
                document.addEventListener('writingtool-quit-decision',listener);
                document.dispatchEvent(new CustomEvent('writingtool-window-close',{detail:{token}}));
            })`);
            if (!approved)
                return;
        }
        if (unresolvedOperations.size) {
            dialog.showErrorBox('Unable to close universe', 'Reconcile the unresolved operation before closing.');
            return;
        }
        draining = true;
        if (!hostExited) {
            // Reuse the same process, never create replacement authority. A
            // failed readiness/transport client is not a shutdown acknowledgment.
            universeClient?.fail();
            universeClient = new UniverseHostClient(child);
            const result = await universeClient.request({ protocolVersion: 1, requestId: randomUUID(), command: 'universe.close' });
            if (result.status !== 'ok' && !hostExited) {
                dialog.showErrorBox('Unable to close universe', result.status === 'error' ? result.message : 'Shutdown was not acknowledged.');
                return;
            }
        }
        if (diagnostic)
            console.log('WRITINGTOOL_DRAIN ' + JSON.stringify({ kind, hostAlreadyExited: hostExited, unresolved: unresolvedOperations.size, drained: true }));
        quitPermit = kind;
        if (kind === 'window' && window && !window.isDestroyed())
            window.close();
        else
            app.quit();
    }
    catch (error) {
        console.error('Normal close remains pending', error);
    }
    finally {
        draining = false;
        quitDecisionInFlight = false;
    }
}
app.on('before-quit', event => {
    if (drained || quitPermit === 'app') {
        quitPermit = undefined;
        drained = true;
        if (!shutdown) {
            shutdown = true;
            ipcMain.removeHandler(READINESS_CHANNEL);
            ipcMain.removeHandler(UNIVERSE_CHANNEL);
            ipcMain.removeAllListeners('writingtool:quit-request:v1');
            client?.fail('UNAVAILABLE');
            child?.kill();
        }
        return;
    }
    event.preventDefault();
    void requestNativeQuit('app');
});
app.on('window-all-closed', () => app.quit());
