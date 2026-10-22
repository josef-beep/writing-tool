type ShortcutEvent = Pick<KeyboardEvent, 'key' | 'ctrlKey' | 'metaKey' | 'altKey' | 'shiftKey' | 'isComposing' | 'defaultPrevented' | 'repeat' | 'keyCode'>;
export type AppShortcut = 'save' | 'new-project' | 'open-project' | 'close' | 'close-universe' | 'zoom-in' | 'zoom-out';

/** Only claim the app's shortcuts; leave editor commands and input methods alone. */
export function appShortcut(event: ShortcutEvent, editingText = false): AppShortcut | null {
    if (event.defaultPrevented || event.isComposing || event.keyCode === 229 || event.altKey || event.repeat || !(event.ctrlKey || event.metaKey)) return null;
    const key = event.key.toLowerCase();
    if (key === 'w') return event.shiftKey ? 'close-universe' : 'close';
    if (!event.shiftKey) {
        if (key === 's') return 'save';
        if (key === 'n') return 'new-project';
        if (key === 'o') return 'open-project';
    }
    if (!editingText) {
        if (key === '+' || key === '=') return 'zoom-in';
        if (key === '-') return 'zoom-out';
    }
    return null;
}

export function isTextInput(target: EventTarget | null): boolean {
    return target instanceof Element && !!target.closest('input, textarea, select, [contenteditable]:not([contenteditable="false"])');
}
