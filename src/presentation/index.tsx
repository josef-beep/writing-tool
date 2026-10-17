import { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { type ReadinessResult, unavailable } from '../application/contracts/readiness';
import { type CreateInput, type SaveInput, type UniverseResult, type UniverseSnapshot, type ProfileData } from '../application/contracts/universe';
import './shell.css';
type Departure = 'new' | 'open' | 'close' | 'quit' | 'dismiss';
function Shell() {
    const [result, setResult] = useState<ReadinessResult>();
    const [snapshot, setSnapshot] = useState<UniverseSnapshot | null>(null);
    const [editor, setEditor] = useState<'create' | 'profile' | null>(null);
    const [draft, setDraft] = useState<ProfileData>({ name: '', description: '' });
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string>();
    const [fieldError, setFieldError] = useState<string>();
    const [pendingDeparture, setPendingDeparture] = useState<Departure>();
    const [pending, setPending] = useState<CreateInput | SaveInput>();
    const [status, setStatus] = useState('Choose or create a universe to begin.');
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
        if (busy || pending)
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
        if (busy || pending)
            return;
        setPendingDeparture(undefined);
        if (action === 'new') {
            setEditor('create');
            setDraft({ name: '', description: '' });
            setFieldError(undefined);
            return;
        }
        if (action === 'quit') {
            finishQuit(true);
            return;
        }
        if (action === 'dismiss') {
            setEditor(null);
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
        if (action === 'quit' && !quitToken.current) {
            document.dispatchEvent(new Event('writingtool-request-quit'));
            return;
        }
        if (pending || busy || error || pendingDeparture) {
            if (action === 'quit')
                finishQuit(false);
            return;
        }
        if (dirty)
            setPendingDeparture(action);
        else
            void depart(action);
    }
    const departureRef = useRef(requestDeparture);
    departureRef.current = requestDeparture;
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
            if (event.key === 'Escape' && editorRef.current && !document.querySelector('.blocking')) {
                event.preventDefault();
                departureRef.current('dismiss');
                return;
            }
            if (!(event.ctrlKey || event.metaKey))
                return;
            const key = event.key.toLowerCase();
            if (document.querySelector('.blocking')) {
                if (['n', 'o', 's', 'w'].includes(key))
                    event.preventDefault();
                return;
            }
            if (key === 'n' || key === 'o' || key === 's' || key === 'w') {
                event.preventDefault();
                if (key === 'n')
                    departureRef.current('new');
                else if (key === 'o')
                    departureRef.current('open');
                else if (key === 'w')
                    departureRef.current(editorRef.current && !event.shiftKey ? 'dismiss' : 'close');
                else
                    document.querySelector<HTMLButtonElement>('[data-profile-save]')?.click();
            }
        };
        const preventUnapprovedUnload = (event: BeforeUnloadEvent) => {
            event.preventDefault();
            event.returnValue = false;
        };
        window.addEventListener('beforeunload', preventUnapprovedUnload);
        document.addEventListener('writingtool-window-close', quit);
        window.addEventListener('keydown', keys);
        return () => {
            window.removeEventListener('beforeunload', preventUnapprovedUnload);
            document.removeEventListener('writingtool-window-close', quit);
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
    function editProfile(): void {
        if (!snapshot || busy || pending || editor)
            return;
        setEditor('profile');
        setDraft(snapshot.profile);
        setFieldError(undefined);
    }
    return <main>
    <header inert={!!pendingDeparture || !!error}><span className="wordmark">WritingTool</span><nav aria-label="Application commands" onClick={event => {
        const target = event.target as HTMLElement;
        if (target.closest('button'))
            target.closest('details')?.removeAttribute('open');
    }}>
      <details><summary>File</summary><div className="menu"><button disabled={busy || !!pending} onClick={() => requestDeparture('new')}>New universe <kbd>Ctrl+N</kbd></button><button disabled={busy || !!pending} onClick={() => requestDeparture('open')}>Open universe… <kbd>Ctrl+O</kbd></button><button disabled={busy || !!pending || !snapshot} onClick={() => requestDeparture('close')}>Close universe <kbd>Ctrl+Shift+W</kbd></button><button disabled={busy || !!pending} onClick={() => requestDeparture('quit')}>Exit</button></div></details>
      <details><summary>Universe</summary><div className="menu"><button data-top-profile-edit disabled={!snapshot || !!editor || busy || !!pending} onClick={editProfile}>Edit profile</button><button data-top-profile-save disabled={!editor || busy || !!pending} onClick={() => void save()}>Save profile <kbd>Ctrl+S</kbd></button><button data-top-reconcile disabled={!pending || busy} onClick={() => void reconcile()}>Reopen and reconcile…</button><button data-top-profile-close disabled={!editor || busy || !!pending} onClick={() => requestDeparture('dismiss')}>Close profile <kbd>Ctrl+W</kbd></button></div></details>
    </nav></header>
    <section hidden={!!editor} inert={!!pendingDeparture || !!error} aria-labelledby="heading">
      <p className="eyebrow">{snapshot ? 'UNIVERSE' : 'YOUR WRITING SPACE'}</p><h1 id="heading">{snapshot?.profile.name ?? 'Open your universe.'}</h1>
      {snapshot ? <><p>{snapshot.profile.description || 'Your universe is ready. No calendar or project is needed.'}</p><p className="location">{snapshot.location}</p><button disabled={busy || !!pending} onClick={editProfile}>Edit universe profile</button></> : <><p>Create a shared setting in its own folder, or open an existing universe.</p><div className="actions"><button disabled={busy || !!pending || state !== 'ready'} onClick={() => requestDeparture('open')}>Open universe…</button><button disabled={busy || !!pending || state !== 'ready'} onClick={() => requestDeparture('new')}>Create universe</button></div></>}
      <div className={`status ${state}`} role="status" aria-live="polite" data-readiness={state}><strong>{state === 'ready' ? 'Application ready' : state === 'unavailable' ? 'Application unavailable' : 'Checking application…'}</strong><span>{result?.status === 'unavailable' ? `Host connection failed (${result.code}).` : state === 'ready' ? 'The local application host responded successfully.' : 'Waiting for the local application host.'}</span></div>
      {pending && <div className="status unavailable" role="alert"><strong>Save outcome needs recovery</strong><p>Your submitted edits are retained. Reopen the same folder to determine whether it saved.</p><button disabled={busy} onClick={() => void reconcile()}>Reopen and reconcile…</button></div>}
    </section>
    {editor && <section className="profile workspace-editor" inert={!!pendingDeparture || !!error} aria-labelledby="profile-heading"><h2 id="profile-heading">{editor === 'create' ? 'Create universe' : 'Universe profile'}</h2><form onSubmit={event => {
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
                });
            }}>Save</button><button onClick={() => void depart(pendingDeparture)}>Discard</button><button autoFocus onClick={cancelDeparture}>Cancel</button></div></section></div>}
    {error && <div className="scrim blocking"><section className="dialog" role="alertdialog" aria-modal="true" aria-labelledby="error-heading"><h2 id="error-heading">Unable to complete operation</h2><p>{error}</p><div className="actions">{pending && <button onClick={() => void reconcile()} disabled={busy}>Reopen same folder…</button>}<button autoFocus onClick={() => setError(undefined)}>Return to editor</button></div></section></div>}
    <footer inert={!!pendingDeparture || !!error} role="status">{busy ? 'Working…' : status}</footer>
  </main>;
}
const root = document.getElementById('root');
if (!root)
    throw new Error('Missing application root');
createRoot(root).render(<Shell />);
