import { closed, isUuid } from './validation';
export type DatePosition = { calendarVersion: string; year: string; day: string };
export type CalendarElement = { id: string; kind: 'month' | 'standalone'; name: string; days: string };
export type CalendarConfiguration = { id: string; elements: CalendarElement[]; daysOnly: string | null; actualDays: string; targetDays: string; enteredYear: string; yearNames: { year: string; name: string }[] };
export type CalendarData = { currentVersion: string; anchor: { year: string; day: '1' }; versions: CalendarConfiguration[] };
export const signedInteger = (v: unknown): v is string => typeof v === 'string' && /^(0|-?[1-9][0-9]*)$/.test(v);
export const unsignedInteger = (v: unknown): v is string => typeof v === 'string' && /^(0|[1-9][0-9]*)$/.test(v);
export const positiveInteger = (v: unknown): v is string => unsignedInteger(v) && v !== '0';
export const scalarText = (v: unknown): v is string => typeof v === 'string' && !/[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/u.test(v);
export function validCalendarConfiguration(v: unknown): v is CalendarConfiguration {
    if (!closed(v, ['id','elements','daysOnly','actualDays','targetDays','enteredYear','yearNames']) || !isUuid(v.id) || !signedInteger(v.enteredYear) || !positiveInteger(v.actualDays) || !positiveInteger(v.targetDays) || !Array.isArray(v.elements) || !Array.isArray(v.yearNames)) return false;
    const ids = new Set<string>();
    for (const e of v.elements) {
        if (!closed(e, ['id','kind','name','days']) || !isUuid(e.id) || ids.has(e.id) || !scalarText(e.name) || !positiveInteger(e.days) || !['month','standalone'].includes(e.kind as string) || (e.kind === 'standalone' && e.days !== '1')) return false;
        ids.add(e.id);
    }
    if (v.elements.length ? v.daysOnly !== null || v.elements.reduce((n, e) => n + BigInt(e.days), 0n).toString() !== v.actualDays : !positiveInteger(v.daysOnly) || v.daysOnly !== v.actualDays) return false;
    const years = new Set<string>();
    return v.yearNames.every(n => { if (!closed(n, ['year','name']) || !signedInteger(n.year) || !scalarText(n.name) || years.has(n.year)) return false; years.add(n.year); return true; });
}
export function validCalendarData(v: unknown): v is CalendarData {
    return closed(v, ['currentVersion','anchor','versions']) && isUuid(v.currentVersion) && closed(v.anchor, ['year','day']) && signedInteger(v.anchor.year) && v.anchor.day === '1' && Array.isArray(v.versions) && v.versions.length > 0 && v.versions.every(validCalendarConfiguration) && new Set(v.versions.map(c => c.id)).size === v.versions.length && v.versions.some(c => c.id === v.currentVersion);
}
export function validDatePosition(v: unknown): v is DatePosition { return closed(v, ['calendarVersion','year','day']) && isUuid(v.calendarVersion) && signedInteger(v.year) && positiveInteger(v.day); }
export function configuration(calendar: CalendarData, id: string): CalendarConfiguration { const c = calendar.versions.find(c => c.id === id); if (!c) throw new Error('Unknown calendar configuration.'); return c; }
export function hasCalendarMonths(calendar: CalendarData | null): boolean { return !!calendar && configuration(calendar, calendar.currentVersion).elements.some(element => element.kind === 'month'); }
export function elapsedPosition(date: DatePosition, calendar: CalendarData): bigint {
    if (!validDatePosition(date)) throw new Error('Invalid calendar date.');
    const c = configuration(calendar, date.calendarVersion);
    if (BigInt(date.day) > BigInt(c.actualDays)) throw new Error('Day exceeds the calendar year length.');
    return (BigInt(date.year) - BigInt(calendar.anchor.year)) * BigInt(c.actualDays) + BigInt(date.day) - 1n;
}
export function floorDivide(n: bigint, d: bigint): bigint { const q = n / d; return n % d < 0n ? q - 1n : q; }
export function convertDate(date: DatePosition, calendar: CalendarData, targetVersion = calendar.currentVersion): DatePosition {
    const position = elapsedPosition(date, calendar), days = BigInt(configuration(calendar, targetVersion).actualDays), years = floorDivide(position, days);
    return { calendarVersion: targetVersion, year: (BigInt(calendar.anchor.year) + years).toString(), day: (position - years * days + 1n).toString() };
}
export function compareDates(a: DatePosition, b: DatePosition, calendar: CalendarData): number { const x = elapsedPosition(a, calendar), y = elapsedPosition(b, calendar); return x < y ? -1 : x > y ? 1 : 0; }
export function displayDate(date: DatePosition, calendar: CalendarData): string {
    elapsedPosition(date, calendar);
    const c = configuration(calendar, date.calendarVersion), name = c.yearNames.find(n => n.year === date.year)?.name || '';
    if (!c.elements.length) return `${date.day}/${date.year}`;
    let remaining = BigInt(date.day), monthOrdinal=0n;
    for (const e of c.elements) { if(e.kind==='month')monthOrdinal++; if (remaining <= BigInt(e.days)) {
        if (e.kind === 'standalone') return `${name ? `${name}/` : ''}${e.name ? `${e.name}-` : ''}${date.day}/${date.year}`;
        return [e.name || monthOrdinal.toString(), remaining.toString(), date.year, name].filter(Boolean).join('/');
    } remaining -= BigInt(e.days); }
    throw new Error('Invalid calendar date.');
}
export function correctChapterRange(start: DatePosition | null, end: DatePosition | null, calendar: CalendarData): {start: DatePosition | null; end: DatePosition | null} {
    if (start) elapsedPosition(start, calendar); if (end) elapsedPosition(end, calendar);
    return { start, end: start && end && compareDates(end, start, calendar) < 0 ? { ...start } : end };
}
export type BirthComponents = { year: string; elementId: string | null; day: string | null };
export function birthPosition(birth: BirthComponents, calendar: CalendarData): DatePosition {
    if (!signedInteger(birth.year) || (birth.day !== null && !positiveInteger(birth.day))) throw new Error('Invalid recorded birth components.');
    const c = configuration(calendar, calendar.currentVersion); let day = 1n;
    if (birth.elementId !== null) { const index = c.elements.findIndex(e => e.id === birth.elementId); if (index >= 0) { const e = c.elements[index], component = BigInt(birth.day ?? '1'); if (component <= BigInt(e.days)) day = c.elements.slice(0,index).reduce((n,e) => n + BigInt(e.days), 0n) + component; } }
    else if (birth.day !== null && BigInt(birth.day) <= BigInt(c.actualDays)) day = BigInt(birth.day);
    return { calendarVersion: c.id, year: birth.year, day: day.toString() };
}

/** Form targets may differ; committed configurations use their calculated actual total. */
export function normalizeCalendarData(candidate: CalendarData, previous: CalendarData | null = null): CalendarData {
    const normalized: CalendarData = { ...candidate, anchor: { ...candidate.anchor }, versions: candidate.versions.map(c => {
        const actual = c.elements.length ? c.elements.reduce((n,e) => { if (!positiveInteger(e.days)) throw new Error('Calendar element days must be positive integers.'); return n + BigInt(e.days); },0n).toString() : c.daysOnly;
        if (!positiveInteger(actual) || !positiveInteger(c.targetDays)) throw new Error('Calendar day totals must be positive integers.');
        return { ...c, actualDays: actual, targetDays: actual };
    }) };
    if (!validCalendarData(normalized)) throw new Error('Invalid calendar configuration.');
    if (!previous && normalized.anchor.year !== normalized.versions[0].enteredYear) throw new Error('The calendar anchor must use the first entered year.');
    if (previous) {
        if (previous.anchor.year !== normalized.anchor.year || previous.anchor.day !== normalized.anchor.day) throw new Error('Calendar lineage anchor is immutable.');
        for (const old of previous.versions) {const retained=normalized.versions.find(v=>v.id===old.id);if(!retained || stableCalendarJSON(old)!==stableCalendarJSON(retained)) throw new Error('Existing calendar configurations are immutable.');}
    }
    return normalized;
}

function stableCalendarJSON(value:unknown):string {if(value===null||typeof value!=='object')return JSON.stringify(value);if(Array.isArray(value))return '['+value.map(stableCalendarJSON).join(',')+']';return '{'+Object.keys(value).sort().map(k=>JSON.stringify(k)+':'+stableCalendarJSON((value as Record<string,unknown>)[k])).join(',')+'}';}
