import {type ProjectSnapshot} from '../application/contracts/project';
import { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { type ReadinessResult, unavailable } from '../application/contracts/readiness';
import { type CreateInput, type SaveInput, type UniverseResult, type UniverseSnapshot, type ProfileData } from '../application/contracts/universe';
import './shell.css';
import {Workspace,type WorkspaceHandle} from './workspace/Workspace';
import {FloatingPanel} from './workspace/FloatingPanel';
type Departure = 'project-new' | 'project-open' | 'project-close' | 'new' | 'open' | 'close' | 'quit' | 'dismiss' | 'calendar-update' | 'workspace-action';
function Shell() {
    const [result, setResult] = useState<ReadinessResult>();
    const [utilityShown,setUtilityShown]=useState(false);
    const [closing, setClosing] = useState(false);
    const closingRef = useRef(false);
    const [workspaceBlocked, setWorkspaceBlocked] = useState(false);
    const [calendarUpdate, setCalendarUpdate] = useState({required:false,busy:false});
    const [snapshot, setSnapshot] = useState<UniverseSnapshot | null>(null);
    const [projectSnapshot, setProjectSnapshot] = useState<ProjectSnapshot | null>(null);
    const [projectUncertain, setProjectUncertain] = useState(false);
    const [pendingProtectionCount, setPendingProtectionCount] = useState(0);
    const [editor, setEditor] = useState<'create' | 'profile' | null>(null);
    const [draft, setDraft] = useState<ProfileData>({ name: '', description: '' });
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string>();
    const [fieldError, setFieldError] = useState<string>();
    const [pendingDeparture, setPendingDeparture] = useState<Departure>();
    const [pending, setPending] = useState<CreateInput | SaveInput>();
    const [status, setStatus] = useState('Open a project or choose a universe to begin.');
    const workspaceRef = useRef<WorkspaceHandle>(null);
    const workspaceDeparture = useRef<((approved:boolean)=>void)|null>(null);
    const revision = useRef(0n);
    const quitToken = useRef<string | undefined>(undefined);
    function finishQuit(approved: boolean): void {
        const token = quitToken.current;
        quitToken.current = undefined;
        if (token)
            document.dispatchEvent(new CustomEvent('writingtool-quit-decision', { detail: { token, approved } }));
    }
    function cancelDeparture(): void {
        if (pendingDeparture === 'quit')
            finishQuit(false);
        if (pendingDeparture === 'workspace-action') { workspaceDeparture.current?.(false); workspaceDeparture.current=null; }
        setPendingDeparture(undefined);
    }
    const editorRef = useRef(editor);
    editorRef.current = editor;
    const dirty = editor !== null && (editor === 'create' ? !!draft.name || !!draft.description : !!snapshot && (draft.name !== snapshot.profile.name || draft.description !== snapshot.profile.description));
    const state = result?.status ?? 'checking';
    useEffect(() => {
        let active = true;
        let timer: ReturnType<typeof setTimeout> | undefined;
        const check = async () => {
            let response: ReadinessResult;
            try {
                response = await window.writingTool.readiness();
            }
            catch {
                response = unavailable(crypto.randomUUID(), 'UNAVAILABLE');
            }
            if (active) {
                setResult(response);
                timer = setTimeout(() => {
                    void check();
                }, 2000);
            }
        };
        void check();
        return () => {
            active = false;
            clearTimeout(timer);
        };
    }, []);
    function accept(response: UniverseResult): boolean {
        if (response.status === 'canceled')
            return false;
        if (response.status === 'error') {
            setError(response.message);
            return false;
        }
        setSnapshot(response.snapshot);
        return true;
    }
    async function save(): Promise<boolean> {
        if (busy || pending || projectUncertain)
            return false;
        if (!draft.name.trim()) {
            setFieldError('Enter a universe name.');
            return false;
        }
        setFieldError(undefined);
        setBusy(true);
        const submitted = revision.current.toString();
        const input: CreateInput | SaveInput = editor === 'create' ? { operationId: crypto.randomUUID(), submittedEditorRevision: submitted, data: { ...draft } } : { operationId: crypto.randomUUID(), submittedEditorRevision: submitted, data: { ...draft }, ownerId: snapshot!.ownerId, expectedUnitGeneration: snapshot!.generation, expectedRecordVersion: snapshot!.recordVersion };
        try {
            const response = 'ownerId' in input ? await window.writingTool.saveUniverseProfile(input) : await window.writingTool.createUniverse(input);
            if (response.status === 'error' && response.outcome === 'unknown')
                setPending(input);
            if (!accept(response))
                return false;
            if (response.status === 'ok') {
                setEditor('profile');
                if (revision.current.toString() === submitted && response.snapshot)
                    setDraft(response.snapshot.profile);
                setStatus(`Saved ${response.snapshot?.profile.name ?? 'universe'}.`);
            }
            return revision.current.toString() === submitted;
        }
        finally {
            setBusy(false);
        }
    }
    async function depart(action: Departure): Promise<void> {
        if (closingRef.current) {
            if (action === 'quit') finishQuit(false);
            return;
        }
        if (action === 'workspace-action') {
            setPendingDeparture(undefined);
            setEditor(null);
            await workspaceRef.current?.refresh();
            const resolve=workspaceDeparture.current; workspaceDeparture.current=null; resolve?.(true);
            return;
        }
        if (!await workspaceRef.current?.guard(action === 'quit') && workspaceRef.current) {
            if (action === 'quit') finishQuit(false);
            return;
        }
        if (busy || pending || (projectUncertain && action !== 'project-open'))
            return;
        setPendingDeparture(undefined);
        if (action === 'project-new' || action === 'project-open' || action === 'project-close') {
            setBusy(true);
            try {
                const response = action === 'project-new' ? await window.writingTool.createProject({operationId:crypto.randomUUID()}) : action === 'project-open' ? await window.writingTool.openProject() : await window.writingTool.closeProject();
                if(response.status==='canceled') return;
                if(response.status==='error') {
                    if(response.outcome!=='not-committed') setProjectUncertain(true);
                    setError(response.message); return;
                }
                setProjectUncertain(false); setProjectSnapshot(response.snapshot);
                if(response.snapshot) setSnapshot(response.snapshot.universe);
                setEditor(null);
                setStatus(action==='project-close'?'Project closed.': 'Project opened with its authoritative universe.');
            } finally {setBusy(false);}
            return;
        }
        if (action === 'new') {
            setEditor('create');
            setDraft({ name: '', description: '' });
            setFieldError(undefined);
            return;
        }
        if (action === 'quit') {
            closingRef.current = true;
            setClosing(true);
            try {
                if (workspaceRef.current && !await workspaceRef.current.closeProtection()) {
                    closingRef.current = false;
                    setClosing(false);
                    finishQuit(false);
                    return;
                }
                // Keep input locked until native draining closes the window or reports failure.
                finishQuit(true);
            } catch (error) {
                closingRef.current = false;
                setClosing(false);
                setError(error instanceof Error ? error.message : 'Closing failed. Your work is retained.');
                finishQuit(false);
            }
            return;
        }
        if (action === 'calendar-update') {
            setEditor(null);
            await workspaceRef.current?.refresh();
            await workspaceRef.current?.updateCalendar();
            return;
        }
        if (action === 'dismiss') {
            setEditor(null);
            await workspaceRef.current?.refresh();
            return;
        }
        setBusy(true);
        try {
            const response = action === 'open' ? await window.writingTool.openUniverse() : await window.writingTool.closeUniverse();
            if (accept(response)) {
                setEditor(null);
                setStatus(action === 'open' ? 'Universe opened.' : 'Universe closed.');
            }
        }
        finally {
            setBusy(false);
        }
    }
    function requestDeparture(action: Departure): void {
        if (closingRef.current) return;
        if (action === 'quit' && !quitToken.current) {
            document.dispatchEvent(new Event('writingtool-request-quit'));
            return;
        }
        if (pending || busy || (error && action !== 'quit') || pendingDeparture || (projectUncertain && action !== 'project-open')) {
            if (action === 'quit')
                finishQuit(false);
            return;
        }
        if (action === 'quit') setError(undefined);
        if (dirty)
            setPendingDeparture(action);
        else
            void depart(action);
    }
    async function beforeWorkspaceNavigation():Promise<boolean> {
        if (closingRef.current||busy||pending||error||pendingDeparture||projectUncertain||workspaceDeparture.current) return false;
        if (!editorRef.current) return true;
        if (dirty) return new Promise(resolve=>{ workspaceDeparture.current=resolve; setPendingDeparture('workspace-action'); });
        setEditor(null);
        await workspaceRef.current?.refresh();
        return true;
    }
    const departureRef = useRef(requestDeparture);
    departureRef.current = requestDeparture;
    useEffect(() => {
        let active = true;
        const check = async () => {
            const response = await window.writingTool.protection({command:'protection.pending'});
            if (active && response.status === 'ok') setPendingProtectionCount(response.value.pending?.length ?? 0);
        };
        void check();
        document.addEventListener('writingtool-close-aborted', check);
        document.addEventListener('writingtool-recovered-context', check);
        return () => {
            active = false;
            document.removeEventListener('writingtool-close-aborted', check);
            document.removeEventListener('writingtool-recovered-context', check);
        };
    }, []);
    useEffect(() => {
        const quit = (event: Event) => {
            const token = (event as CustomEvent<{
                token?: string;
            }>).detail?.token;
            if (token)
                quitToken.current = token;
            departureRef.current('quit');
        };
        const keys = (event: KeyboardEvent) => {
            if (closingRef.current) {
                if ((event.ctrlKey || event.metaKey) && ['n', 'o', 's', 'w'].includes(event.key.toLowerCase())) {
                    event.preventDefault();
                    event.stopImmediatePropagation();
                }
                return;
            }
            if (event.key === 'Escape' && editorRef.current && !document.querySelector('.blocking')) {
                event.preventDefault();
                departureRef.current('dismiss');
                return;
            }
            if (!(event.ctrlKey || event.metaKey))
                return;
            const key = event.key.toLowerCase();
            if (key === 's' && editorRef.current) event.stopImmediatePropagation();
            if (document.querySelector('.blocking')) {
                if (['n', 'o', 's', 'w'].includes(key))
                    event.preventDefault();
                return;
            }
            if (key === 'n' || key === 'o' || key === 's' || key === 'w') {
                event.preventDefault();
                if (key === 'n')
                    departureRef.current('project-new');
                else if (key === 'o')
                    departureRef.current('project-open');
                else if (key === 'w')
                    departureRef.current(editorRef.current && !event.shiftKey ? 'dismiss' : 'close');
                else if (editorRef.current)
                    document.querySelector<HTMLButtonElement>('[data-profile-save]')?.click();
            }
        };
        const preventUnapprovedUnload = (event: BeforeUnloadEvent) => {
            event.preventDefault();
            event.returnValue = false;
        };
        window.addEventListener('beforeunload', preventUnapprovedUnload);
        const recovered=()=>{void (async()=>{
            const pendingOperations=await window.writingTool.protection({command:'protection.pending'});
            // Keep the recovery panel in place until every pending operation is resolved.
            if(pendingOperations.status==='ok'&&pendingOperations.value.pending?.some(id=>!pendingOperations.value.deferred?.includes(id)))return;
            // Authority requests are exclusive in main; await each before sending the next.
            const project=await window.writingTool.currentProject();
            const universe=await window.writingTool.currentUniverse();
            if(project.status!=='ok'||universe.status!=='ok')throw new Error('The active roots could not be refreshed. Reopen the saved owning roots before editing.');
            setProjectSnapshot(project.snapshot);setSnapshot(universe.snapshot);
        })().catch(()=>{setProjectSnapshot(null);setSnapshot(null);setEditor(null);setError('The active roots could not be refreshed. Reopen the saved owning roots before editing.');});};
        const closeAborted = async (event:Event) => {
            try {
                if ((event as CustomEvent<{refresh:boolean}>).detail?.refresh) {
                    const project = await window.writingTool.currentProject();
                    const universe = await window.writingTool.currentUniverse();
                    if (project.status !== 'ok' || universe.status !== 'ok')
                        throw new Error('Closing stopped after releasing an owning root. Reopen your saved project or universe before writing.');
                    setProjectSnapshot(project.snapshot);
                    setSnapshot(universe.snapshot);
                }
            } catch (error) {
                // The closing cut was saved before native draining; do not expose a released editor.
                setProjectSnapshot(null);
                setSnapshot(null);
                setEditor(null);
                setError(error instanceof Error ? error.message : 'Reopen your saved work before writing.');
            } finally {
                closingRef.current = false;
                setClosing(false);
            }
        };
        document.addEventListener('writingtool-close-aborted', closeAborted);
        document.addEventListener('writingtool-recovered-context',recovered);
        document.addEventListener('writingtool-window-close', quit);
        window.addEventListener('keydown', keys);
        return () => {
            window.removeEventListener('beforeunload', preventUnapprovedUnload);
            document.removeEventListener('writingtool-window-close', quit);
            document.removeEventListener('writingtool-recovered-context',recovered);
            document.removeEventListener('writingtool-close-aborted', closeAborted);
            window.removeEventListener('keydown', keys);
        };
    }, []);
    useEffect(() => {
        if (!pendingDeparture && !error)
            return;
        const dialogs = document.querySelectorAll<HTMLElement>('.scrim');
        const dialog = dialogs[dialogs.length - 1];
        if (!dialog)
            return;
        const previous = document.activeElement as HTMLElement | null;
        const focusable = () => Array.from(dialog.querySelectorAll<HTMLElement>('button:not(:disabled), input, textarea, [tabindex="0"]'));
        (dialog.querySelector<HTMLElement>('[autofocus]') ?? focusable()[0])?.focus();
        const trap = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                if (error)
                    setError(undefined);
                else if (pendingDeparture)
                    cancelDeparture();
                else
                    departureRef.current('dismiss');
            }
            if (event.key !== 'Tab')
                return;
            const items = focusable();
            if (!items.length)
                return;
            const first = items[0], last = items[items.length - 1];
            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            }
            else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        };
        dialog.addEventListener('keydown', trap);
        return () => {
            dialog.removeEventListener('keydown', trap);
            if (previous?.isConnected)
                previous.focus();
        };
    }, [pendingDeparture, error]);
    const previousEditor = useRef(editor);
    useEffect(() => {
        if (previousEditor.current && !editor)
            document.querySelector<HTMLElement>('nav details:nth-child(2) summary')?.focus();
        previousEditor.current = editor;
    }, [editor]);
    async function reconcile(): Promise<void> {
        if (!pending || busy)
            return;
        setError(undefined);
        setBusy(true);
        try {
            const response = await window.writingTool.openUniverse(pending.operationId);
            if (!accept(response) || response.status !== 'ok')
                return;
            setPending(undefined);
            if (response.receipt) {
                if (response.receipt.submittedEditorRevision === revision.current.toString() && response.snapshot)
                    setDraft(response.snapshot.profile);
                setEditor('profile');
                setStatus('The saved operation was confirmed after recovery.');
            }
            else {
                setStatus('Recovery confirmed the operation did not commit. Your edits are still available.');
            }
        }
        finally {
            setBusy(false);
        }
    }
    async function editProfile(): Promise<void> {
        if (!snapshot || busy || pending || projectUncertain || editor)
            return;
        if (workspaceRef.current && !await workspaceRef.current.guard()) return;
        const response = await window.writingTool.currentUniverse();
        if (response.status !== 'ok' || !response.snapshot) { if (response.status === 'error') setError(response.message); return; }
        setSnapshot(response.snapshot);
        setEditor('profile');
        setDraft(response.snapshot.profile);
        setFieldError(undefined);
    }
    return <main onClick={event => {
        // Portal clicks follow React ancestors, so handle toolbar commands here.
        const button = (event.target as Element).closest('button');
        if (button && !button.disabled && button.closest('nav[aria-label="Application commands"]')) {
            const menu = button.closest('details[name="writingtool-menu"]');
            const restoreFocus = menu?.contains(document.activeElement);
            menu?.removeAttribute('open');
            if (restoreFocus)
                menu?.querySelector('summary')?.focus();
        }
    }}>
    <header inert={!!pendingDeparture || !!error || closing || workspaceBlocked}><span className="wordmark">WritingTool</span><nav aria-label="Application commands">
      <details name="writingtool-menu"><summary>Project</summary><div className="menu"><div id="project-workspace-menu"/><button disabled={busy || !!pending || projectUncertain} onClick={() => requestDeparture('project-new')}>New project… <kbd>Ctrl+N</kbd></button><button disabled={busy || !!pending} onClick={() => requestDeparture('project-open')}>Open project… <kbd>Ctrl+O</kbd></button><button disabled={busy || !!pending || projectUncertain || !projectSnapshot} onClick={() => requestDeparture('project-close')}>Close project</button><button disabled={busy || !!pending || projectUncertain || !!projectSnapshot} onClick={() => requestDeparture('new')}>New universe</button><button disabled={busy || !!pending || projectUncertain || !!projectSnapshot} onClick={() => requestDeparture('open')}>Open universe…</button><button disabled={busy || !!pending || projectUncertain || !!projectSnapshot || !snapshot} onClick={() => requestDeparture('close')}>Close universe <kbd>Ctrl+Shift+W</kbd></button><button disabled={busy || !!pending} onClick={() => requestDeparture('quit')}>Exit</button></div></details>
      <details name="writingtool-menu"><summary>Universe</summary><div className="menu"><div id="universe-workspace-menu"/><button data-top-profile-edit disabled={!snapshot || !!editor || busy || !!pending} onClick={editProfile}>Edit profile</button><button data-top-profile-save disabled={!editor || busy || !!pending} onClick={() => void save()}>Save profile <kbd>Ctrl+S</kbd></button><button data-top-reconcile disabled={busy} onClick={() => pending ? void reconcile() : void workspaceRef.current?.recover()}>Reopen and reconcile…</button><button data-top-profile-close disabled={!editor || busy || !!pending} onClick={() => requestDeparture('dismiss')}>Close profile <kbd>Ctrl+W</kbd></button></div></details>
      <span id="workspace-menus"/>
    </nav></header>
    {pendingProtectionCount>0&&<div className="status unavailable" role="alert" inert={!!pendingDeparture||!!error||closing||workspaceBlocked}><strong>Unfinished backup or recovery needs attention</strong><p>The original operation is retained. Reconcile it, or choose Continue writing where available.</p><button disabled={busy||!!pending} onClick={()=>void workspaceRef.current?.recover()}>Reconcile pending operations…</button></div>}
    <section hidden={!!editor || !!snapshot || utilityShown} inert={!!pendingDeparture || !!error || closing} aria-labelledby="heading">
      <p className="eyebrow">{projectSnapshot ? 'PROJECT' : snapshot ? 'UNIVERSE' : 'YOUR WRITING SPACE'}</p><h1 id="heading">{projectSnapshot ? 'Your project' : snapshot?.profile.name ?? 'Open your writing project.'}</h1>
      {projectSnapshot && <div className="project-context"><p>Project <span className="location">{projectSnapshot.ownerId}</span></p><p className="location">{projectSnapshot.location}</p><p>Linked universe: <strong>{snapshot?.profile.name}</strong></p></div>}
      {snapshot ? <><p>{snapshot.profile.description || (projectSnapshot ? 'Your project and its shared universe are ready.' : 'Your universe is ready. No calendar or project is needed.')}</p><p className="location">{snapshot.location}</p><button disabled={busy || !!pending} onClick={editProfile}>Edit universe profile</button></> : <><p>Open a project with its shared universe, or create a project in its own folder.</p><div className="actions"><button disabled={busy || !!pending || state !== 'ready'} onClick={() => requestDeparture('project-open')}>Open project…</button><button disabled={busy || !!pending || projectUncertain || state !== 'ready'} onClick={() => requestDeparture('project-new')}>Create project…</button></div><button disabled={busy||!!pending} onClick={()=>void workspaceRef.current?.recover()}>Recover from backup / recent projects…</button><p>You can also work with a universe on its own.</p><div className="actions"><button disabled={busy || !!pending || projectUncertain || state !== 'ready'} onClick={() => requestDeparture('open')}>Open universe…</button><button disabled={busy || !!pending || projectUncertain || state !== 'ready'} onClick={() => requestDeparture('new')}>Create universe</button></div></>}
      <div className={`status ${state}`} role="status" aria-live="polite" data-readiness={state}><strong>{state === 'ready' ? 'Application ready' : state === 'unavailable' ? 'Application unavailable' : 'Checking application…'}</strong><span>{result?.status === 'unavailable' ? `Host connection failed (${result.code}).` : state === 'ready' ? 'The local application host responded successfully.' : 'Waiting for the local application host.'}</span></div>
      {projectUncertain && <div className="status unavailable" role="alert"><strong>Project creation needs reconciliation</strong><p>Reopen the selected project folder to confirm its saved identity and matching universe.</p><button disabled={busy} onClick={() => requestDeparture('project-open')}>Reopen project…</button></div>}
      {pending && <div className="status unavailable" role="alert"><strong>Save outcome needs recovery</strong><p>Your submitted edits are retained. Reopen the same folder to determine whether it saved.</p><button disabled={busy} onClick={() => void reconcile()}>Reopen and reconcile…</button></div>}
    </section>
    {<div hidden={!!editor} inert={!!pendingDeparture || !!error || closing}><Workspace key={`${projectSnapshot?.ownerId??''}/${snapshot?.ownerId??'none'}`} ref={workspaceRef} identity={`${projectSnapshot?.ownerId??''}/${snapshot?.ownerId??'none'}`} universeName={snapshot?.profile.name??'No universe open'} onStatus={setStatus} onCenterChange={setUtilityShown} closing={closing} navigating={busy} onBlockedChange={setWorkspaceBlocked} onCalendarUpdateChange={setCalendarUpdate} covered={!!editor} beforeNavigate={beforeWorkspaceNavigation}/></div>}
    {editor && <section className="profile workspace-editor" inert={!!pendingDeparture || !!error || closing} aria-labelledby="profile-heading"><h2 id="profile-heading">{editor === 'create' ? 'Create universe' : 'Universe profile'}</h2><form onSubmit={event => {
                event.preventDefault();
                void save();
            }}>
      <label>Name <input autoFocus value={draft.name} aria-invalid={!!fieldError} aria-describedby={fieldError ? 'name-error' : undefined} onChange={e => {
                revision.current++;
                setDraft({ ...draft, name: e.target.value });
                setFieldError(undefined);
            }}/></label>{fieldError && <p id="name-error" role="alert">{fieldError}</p>}
      <label>Description <span className="optional">(optional)</span><textarea rows={6} value={draft.description} onChange={e => {
                revision.current++;
                setDraft({ ...draft, description: e.target.value });
            }}/></label>
      <div className="actions"><button type="submit" data-profile-save disabled={busy || !!pending}>{busy ? 'Saving…' : editor === 'create' ? 'Choose folder and create…' : 'Save'} <kbd>Ctrl+S</kbd></button><button type="button" disabled={busy || !!pending} onClick={() => requestDeparture('dismiss')}>Close</button></div>
      {pending && <button type="button" disabled={busy} onClick={() => void reconcile()}>Reopen and reconcile…</button>}
    </form></section>}
    {pendingDeparture && <div className="scrim blocking"><section className="dialog" role="alertdialog" aria-modal="true" aria-labelledby="pending-heading"><h2 id="pending-heading">Save your changes?</h2><p>Your universe profile has unsaved changes.</p><div className="actions"><button onClick={() => {
                const action = pendingDeparture;
                setPendingDeparture(undefined);
                void save().then(saved => {
                    if (saved)
                        void depart(action);
                    else if (action === 'quit')
                        finishQuit(false);
                    else if (action === 'workspace-action') { workspaceDeparture.current?.(false); workspaceDeparture.current=null; }
                });
            }}>Save</button><button onClick={() => void depart(pendingDeparture)}>Discard</button><button autoFocus onClick={cancelDeparture}>Cancel</button></div></section></div>}
    {error && <div className="scrim blocking"><section className="dialog" role="alertdialog" aria-modal="true" aria-labelledby="error-heading"><h2 id="error-heading">Unable to complete operation</h2><p>{error}</p><div className="actions">{pending && <button onClick={() => void reconcile()} disabled={busy}>Reopen same folder…</button>}{projectUncertain && <button onClick={() => {setError(undefined); void depart('project-open');}} disabled={busy}>Reopen project…</button>}<button autoFocus onClick={() => setError(undefined)}>Return to editor</button></div></section></div>}
    <footer inert={!!pendingDeparture || !!error || closing} role="status">{closing ? 'Finishing the required closing revision and complete backup…' : busy ? 'Working…' : status}{calendarUpdate.required&&<span className="calendar-update-status">Calendar update required. Writing remains available. <button disabled={busy||!!pending||projectUncertain||calendarUpdate.busy||workspaceBlocked||closing} onClick={()=>requestDeparture('calendar-update')}>Update to current calendar</button></span>}</footer>
  </main>;
}
const root = document.getElementById('root');
if (!root)
    throw new Error('Missing application root');
createRoot(root).render(location.hash.startsWith('#floating-') ? <FloatingPanel /> : <Shell />);
