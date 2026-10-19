import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {runConverter,ConverterTerminationError} from './converter-process';
import {unzipSync} from 'fflate';
import {pathToFileURL} from 'node:url';
import {DatabaseSync} from 'node:sqlite';
import type {PinnedExportSource} from './export-captures';
import type {WorkspaceRecordOf} from '../domain/workspace';
import {orderedChapters} from '../domain/workspace';
import type {Paragraph} from '../domain/manuscript';
import {assertManuscript} from '../domain/manuscript';
import {CATALOG_NOTICE} from '../application/contracts/protection';
import {canonical,readManaged} from './universe-files';
import {publishOutput,checkCancel,checkpoint,type NativeDestination,type OperationControl,OperationCanceled} from './archives';
// oxlint-disable-next-line no-control-regex -- Intentionally match control characters for validation or normalization.
const xml=(s:string)=>{if(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\uFFFE\uFFFF]/u.test(s))throw new Error('DOCX/PDF cannot represent a saved control character. Export Markdown or text to preserve those bytes.');return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');};
const xmlText=(s:string)=>xml(s).replace(/ /g,'<text:s/>').replace(/\t/g,'<text:tab/>').replace(/\n/g,'<text:line-break/>').replace(/\r/g,'&#13;');
const md=(s:string)=>s.replace(/[\\`*_{}[\]<>#+.!|~-]/g,'\\$&');
export type ExportChapter={title:string;text:string;paragraphs:Paragraph[]};
function spans(c:ExportChapter,p:Paragraph,format:'md'|'xml'):string{const chars=Array.from(c.text),start=Number(p.start),end=Number(p.end);let at=start,out='';const escape=format==='md'?md:xmlText;for(const m of p.marks){out+=escape(chars.slice(at,Number(m.start)).join(''));let text=escape(chars.slice(Number(m.start),Number(m.end)).join(''));if(format==='md'){const match=/^(\s*)([\s\S]*?)(\s*)$/.exec(text)!;text=match[2];if(text){if(m.styles.includes('italic'))text=`*${text}*`;if(m.styles.includes('bold'))text=`**${text}**`;}text=match[1]+text+match[3];}else text=`<text:span text:style-name="${m.styles.includes('bold')?m.styles.includes('italic')?'BI':'B':'I'}">${text}</text:span>`;out+=text;at=Number(m.end);}return out+escape(chars.slice(at,end).join(''));}
export function serializeManuscript(chapters:ExportChapter[],format:'md'|'txt'|'fodt'):string{
 for(const c of chapters)assertManuscript(c.text,c.paragraphs);
 if(format==='txt')return chapters.map(c=>c.title+'\n\n'+c.paragraphs.map(p=>'    '.repeat(Number(p.indent))+Array.from(c.text).slice(Number(p.start),Number(p.end)).join('')).join('\n')).join('\n\n')+'\n';
 if(format==='md')return chapters.map(c=>'# '+md(c.title)+'\n\n'+c.paragraphs.map(p=>p.kind==='scene-break'?'\\*\\*\\*':(p.kind==='heading'?'#'.repeat(p.headingLevel)+' ':'')+spans(c,p,'md')).join('\n\n')).join('\n\n')+'\n';
 const styles=new Map<string,string>();const para=(p:Paragraph)=>{const key=`P${p.indent}_${p.kind==='heading'?p.headingLevel:0}`;styles.set(key,`<style:style style:name="${key}" style:family="paragraph" style:parent-style-name="Body"><style:paragraph-properties fo:margin-left="${BigInt(p.indent)/2n}${BigInt(p.indent)%2n?'.5':''}in"/></style:style>`);return key;};
 const body=chapters.map((c,i)=>`<text:h text:style-name="${i?'Chapter':'FirstChapter'}" text:outline-level="1">${xmlText(c.title)}</text:h>`+c.paragraphs.map(p=>{const style=para(p),tag=p.kind==='heading'?'text:h':'text:p';return`<${tag} text:style-name="${style}"${p.kind==='heading'?` text:outline-level="${p.headingLevel}"`:''}>${spans(c,p,'xml').replace(/\t/g,'<text:tab/>').replace(/ {2,}/g,m=>`<text:s text:c="${m.length}"/>`)}</${tag}>`;}).join('')).join('');
 return`<?xml version="1.0" encoding="UTF-8"?><office:document xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0" xmlns:style="urn:oasis:names:tc:opendocument:xmlns:style:1.0" xmlns:text="urn:oasis:names:tc:opendocument:xmlns:text:1.0" xmlns:fo="urn:oasis:names:tc:opendocument:xmlns:xsl-fo-compatible:1.0" office:version="1.3" office:mimetype="application/vnd.oasis.opendocument.text"><office:styles><style:default-style style:family="paragraph"><style:paragraph-properties fo:line-height="150%"/><style:text-properties style:font-name="Liberation Serif" fo:font-family="Liberation Serif" fo:font-size="12pt"/></style:default-style><style:style style:name="Body" style:family="paragraph"/><style:style style:name="FirstChapter" style:family="paragraph" style:parent-style-name="Body" style:master-page-name="Standard"/><style:style style:name="Chapter" style:family="paragraph" style:parent-style-name="Body"><style:paragraph-properties fo:break-before="page"/></style:style><style:style style:name="B" style:family="text"><style:text-properties fo:font-weight="bold"/></style:style><style:style style:name="I" style:family="text"><style:text-properties fo:font-style="italic"/></style:style><style:style style:name="BI" style:family="text"><style:text-properties fo:font-style="italic" fo:font-weight="bold"/></style:style></office:styles><office:automatic-styles><style:page-layout style:name="A4"><style:page-layout-properties fo:page-width="21cm" fo:page-height="29.7cm" fo:margin="2.54cm" style:print-orientation="portrait"/></style:page-layout>${[...styles.values()].join('')}</office:automatic-styles><office:master-styles><style:master-page style:name="Standard" style:page-layout-name="A4"/></office:master-styles><office:body><office:text>${body}</office:text></office:body></office:document>`;
}
export async function exportSaved(source:PinnedExportSource,format:'md'|'txt'|'docx'|'pdf'|'sqlite',storyId:string|null,chapterIds:string[]|null,destination:NativeDestination,runtime:string|undefined,control:OperationControl):Promise<void>{
 const unit=source.unit,owner=unit.owner,temp=fs.mkdtempSync(path.join(fs.realpathSync(os.tmpdir()),'writingtool-export-'));let retainTemp=false;try{checkCancel(control);let output:string;
 if(format==='sqlite'){output=path.join(temp,'catalog.sqlite');fs.writeFileSync(output,source.catalog,{flag:'wx',mode:0o600});const db=new DatabaseSync(output);try{if(db.prepare('PRAGMA quick_check').get()?.quick_check!=='ok')throw new Error('Catalog export validation failed.');const m=db.prepare('SELECT * FROM unit_meta').get();if(m?.ownerId!==owner.id||m.rootId!==unit.rootId||m.generation!==unit.generation)throw new Error('Catalog capture identity mismatch.');db.exec('CREATE TABLE writingtool_export_metadata(schemaVersion INTEGER NOT NULL,sourceKind TEXT NOT NULL,ownerId TEXT NOT NULL,rootId TEXT NOT NULL,generation TEXT NOT NULL,capturedAt TEXT NOT NULL,scope TEXT NOT NULL,dependencyNotice TEXT NOT NULL,externalDependencies TEXT NOT NULL)');db.prepare('INSERT INTO writingtool_export_metadata VALUES(1,?,?,?,?,?,?,?,?)').run(owner.kind,owner.id,unit.rootId,unit.generation,source.capturedAt,'catalog-only',CATALOG_NOTICE,canonical({universeId:unit.universeId,externalFiles:source.files.filter(f=>f.relativePath!=='database/catalog.sqlite').map(f=>({relativePath:f.relativePath,sha256:f.sha256}))}));if(db.prepare('PRAGMA quick_check').get()?.quick_check!=='ok')throw new Error('Catalog metadata validation failed.');}finally{db.close();}}
 else{if(owner.kind!=='project'||!storyId||!unit.records.some(r=>r.recordType==='story'&&r.id===storyId))throw new Error('Select one active project story.');const calendar=source.calendar;const eligible=orderedChapters(unit.records.filter((r):r is WorkspaceRecordOf<'chapter'>=>r.recordType==='chapter'&&r.data.storyId===storyId),calendar);if(chapterIds&&chapterIds.some(id=>!eligible.some(c=>c.id===id)))throw new Error('Selected chapters do not belong to this story.');const chapters=eligible.filter(c=>chapterIds===null||chapterIds.includes(c.id)).map(c=>({title:c.data.title,text:unit.manuscripts[c.id],paragraphs:c.data.formatting.paragraphs}));if(!chapters.length)throw new Error('Select at least one chapter to export.');if(format==='md'||format==='txt'){output=path.join(temp,`manuscript.${format}`);fs.writeFileSync(output,serializeManuscript(chapters,format),{flag:'wx',mode:0o600});}else{if(!runtime||!fs.existsSync(runtime))throw new Error('The pinned bundled LibreOffice runtime is unavailable. Set up application resources before exporting.');const input=path.join(temp,'manuscript.fodt');fs.writeFileSync(input,serializeManuscript(chapters,'fodt'),{flag:'wx',mode:0o600});control.phase='Converting with bundled LibreOffice';await convert(runtime,input,temp,format,control);output=path.join(temp,`manuscript.${format}`);const bytes=readManaged(temp,path.basename(output));validateConverted(bytes,format,chapters);}}
 checkCancel(control);await checkpoint();if(!fs.statSync(output).size)throw new Error('Export output is empty.');control.phase='Validating export';publishOutput(destination,output,control);
 }catch(error){retainTemp=error instanceof ConverterTerminationError;throw error;}finally{if(!retainTemp)fs.rmSync(temp,{recursive:true,force:true});}}
async function convert(runtime:string,input:string,temp:string,format:'docx'|'pdf',control:OperationControl):Promise<void>{
 const result=await runConverter(runtime,[`-env:UserInstallation=${pathToFileURL(path.join(temp,'profile')).href}`,'--headless','--nologo','--nodefault','--norestore','--nolockcheck','--convert-to',format==='docx'?'docx:Office Open XML Text':'pdf:writer_pdf_Export','--outdir',temp,input],control);
 if(control.canceled)throw new OperationCanceled();
 if(result.timedOut)throw new Error('LibreOffice conversion timed out. Previous output was preserved.');
 if(result.code!==0)throw new Error(`LibreOffice conversion failed: ${result.stderr}`);
}

function validateConverted(bytes:Buffer,format:'docx'|'pdf',chapters:ExportChapter[]){
 if(format==='pdf'){
  // Structural completion only; rendered text/format fidelity remains a release gate.
  if(!bytes.subarray(0,5).equals(Buffer.from('%PDF-'))||!bytes.subarray(Math.max(0,bytes.length-2048)).includes(Buffer.from('%%EOF'))||!bytes.includes(Buffer.from('/Pages')))throw new Error('The converted PDF is incomplete.');
  return;
 }
 const files=unzipSync(bytes),document=files['word/document.xml'];
 if(!files['[Content_Types].xml']||!files['_rels/.rels']||!document)throw new Error('Converted DOCX lacks required package/document parts.');
 const text=new TextDecoder('utf-8',{fatal:true}).decode(document);
 if(!text.includes('wordprocessingml/2006/main')||/<!DOCTYPE|<!ENTITY/i.test(text))throw new Error('Invalid converted DOCX XML.');
 const decodeText=(value:string)=>{
  if(/&(?!(?:amp|lt|gt|quot|apos|#x[0-9a-fA-F]+|#[0-9]+);)/.test(value))throw new Error('Invalid DOCX text entity.');
  const decoded=value.replace(/&(?:amp|lt|gt|quot|apos|#x[0-9a-fA-F]+|#[0-9]+);/g,entity=>{
   const named:Record<string,string>={'&amp;':'&','&lt;':'<','&gt;':'>','&quot;':'"','&apos;':"'"};
   return named[entity]??String.fromCodePoint(parseInt(entity.slice(entity[2]==='x'?3:2,-1),entity[2]==='x'?16:10));
  });
  xml(decoded);return decoded;
 };
 // Empty paragraphs and explicit text line breaks are content too. Page/column
 // breaks affect layout and must not introduce extra manuscript characters.
 const paragraphs=[...text.matchAll(/<w:p(?=[\s/>])(?:[^>]*\/>|[^>]*>([\s\S]*?)<\/w:p>)/g)].map(paragraph=>{
  let result='';
  for(const token of (paragraph[1]??'').matchAll(/<w:t(?=[\s/>])(?:[^>]*\/>|[^>]*>([\s\S]*?)<\/w:t>)|<w:(tab|cr|br)(?=[\s/>])([^>]*?)(?:\/>|>\s*<\/w:\2>)/g)){
   if(token[0].startsWith('<w:t')&&!token[2])result+=decodeText(token[1]??'');
   else if(token[2]==='tab')result+='\t';
   else if(token[2]==='cr'||token[2]==='br'&&!/w:type\s*=\s*["'](?:page|column)["']/.test(token[3]))result+='\n';
  }
  return result;
 });
 const expected=chapters.flatMap(chapter=>[chapter.title,...chapter.text.split('\n')]);
 if(canonical(paragraphs)!==canonical(expected))throw new Error('Converted DOCX manuscript/title content did not match the saved selection.');
}
