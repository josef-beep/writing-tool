import { closed, isUuid } from './validation';
import { scalarText, unsignedInteger } from './calendar';
export type InlineMark = { start: string; end: string; styles: ('bold' | 'italic')[] };
export type Paragraph = { id: string; start: string; end: string; indent: string; marks: InlineMark[] } & ({kind: 'body' | 'scene-break'} | {kind: 'heading'; headingLevel: 1|2|3|4|5|6});
export type ChapterFormatting = { formatVersion: 1; chapterId: string; recordVersion: string; text: {relativePath: string; sha256: string; byteLength: string; scalarLength: string}; paragraphs: Paragraph[] };
export type Manuscript = { text: string; paragraphs: Paragraph[] };
export function validParagraph(v: unknown): v is Paragraph {
    if (typeof v !== 'object' || !v) return false;
    const kind = (v as {kind?:unknown}).kind;
    if (!closed(v, ['id','start','end','kind','indent','marks', ...(kind === 'heading' ? ['headingLevel'] : [])]) || !isUuid(v.id) || !unsignedInteger(v.start) || !unsignedInteger(v.end) || BigInt(v.end) < BigInt(v.start) || !unsignedInteger(v.indent) || !['body','heading','scene-break'].includes(v.kind as string) || !Array.isArray(v.marks) || (kind === 'heading' && ![1,2,3,4,5,6].includes(v.headingLevel as number))) return false;
    let previous: InlineMark | null = null;
    for (const m of v.marks) {
        if (!closed(m, ['start','end','styles']) || !unsignedInteger(m.start) || !unsignedInteger(m.end) || BigInt(m.start) < BigInt(v.start) || BigInt(m.end) > BigInt(v.end) || BigInt(m.start) >= BigInt(m.end) || !Array.isArray(m.styles) || m.styles.length < 1 || m.styles.length > 2 || new Set(m.styles).size !== m.styles.length || !m.styles.every(s => s === 'bold' || s === 'italic')) return false;
        const styles = m.styles;
        if (previous && (BigInt(previous.end) > BigInt(m.start) || (previous.end === m.start && previous.styles.length === m.styles.length && previous.styles.every(s => styles.includes(s))))) return false;
        previous = m as InlineMark;
    }
    return kind !== 'scene-break' || v.marks.length === 0;
}
export function validChapterFormatting(v: unknown): v is ChapterFormatting {
    return closed(v, ['formatVersion','chapterId','recordVersion','text','paragraphs']) && v.formatVersion === 1 && isUuid(v.chapterId) && isUuid(v.recordVersion) && closed(v.text, ['relativePath','sha256','byteLength','scalarLength']) && v.text.relativePath === `chapters/${v.chapterId}.wrt` && typeof v.text.sha256 === 'string' && /^[0-9a-f]{64}$/.test(v.text.sha256) && unsignedInteger(v.text.byteLength) && unsignedInteger(v.text.scalarLength) && Array.isArray(v.paragraphs) && v.paragraphs.length > 0 && v.paragraphs.every(validParagraph) && new Set(v.paragraphs.map(p => p.id)).size === v.paragraphs.length;
}
export function assertManuscript(text: string, paragraphs: Paragraph[]): void {
    if (!scalarText(text) || text.includes('\r') || text.startsWith('\uFEFF') || !Array.isArray(paragraphs) || !paragraphs.every(validParagraph) || new Set(paragraphs.map(p => p.id)).size !== paragraphs.length) throw new Error('Invalid LF manuscript or formatting.');
    const lines = text.split('\n'); if (lines.length !== paragraphs.length) throw new Error('Paragraphs do not match manuscript.');
    let start = 0n;
    for (let i = 0; i < lines.length; i++) { const p = paragraphs[i], end = start + BigInt(Array.from(lines[i]).length); if (p.start !== start.toString() || p.end !== end.toString() || (p.kind === 'scene-break' && lines[i] !== '***')) throw new Error('Paragraph ranges do not match manuscript.'); start = end + 1n; }
}
export function scalarOffsetFromUtf16(text: string, offset: number): string {
    if (!scalarText(text) || !Number.isSafeInteger(offset) || offset < 0 || offset > text.length || (offset > 0 && offset < text.length && /[\uD800-\uDBFF]/.test(text[offset - 1]) && /[\uDC00-\uDFFF]/.test(text[offset]))) throw new Error('Offset splits a Unicode scalar.');
    return Array.from(text.slice(0, offset)).length.toString();
}
export function utf16OffsetFromScalar(text: string, offset: string): number { if (!scalarText(text) || !unsignedInteger(offset)) throw new Error('Invalid scalar offset.'); let n = 0n, utf16 = 0; for (const s of text) { if (n === BigInt(offset)) return utf16; n++; utf16 += s.length; } if (n === BigInt(offset)) return utf16; throw new Error('Scalar offset exceeds text.'); }
