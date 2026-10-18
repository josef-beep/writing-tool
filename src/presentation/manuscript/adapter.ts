import {$getRoot,$createParagraphNode,$createTextNode,$isTextNode,$isElementNode,$isLineBreakNode,$isParagraphNode,type LexicalNode} from 'lexical';
import {$createHeadingNode,$isHeadingNode} from '@lexical/rich-text';
import {assertManuscript,type Manuscript,type Paragraph,type InlineMark} from '../../domain/manuscript';
/** Keys are transient; persistent paragraph identities survive importing, typing and history. */
export type ParagraphIdentities=Map<string,string>;
export function importManuscript(manuscript:Manuscript,identities:ParagraphIdentities):void {
 assertManuscript(manuscript.text,manuscript.paragraphs);for(const p of manuscript.paragraphs){if(BigInt(p.indent)>BigInt(Number.MAX_SAFE_INTEGER))throw new Error('This paragraph indentation exceeds the editor representation. The saved manuscript has not been changed.');}const root=$getRoot();root.clear();const lines=manuscript.text.split('\n');
 manuscript.paragraphs.forEach((p,i)=>{const node=p.kind==='heading'?$createHeadingNode(`h${p.headingLevel}`):$createParagraphNode();identities.set(`${node.getKey()}:0`,p.id);node.setIndent(Number(p.indent));const scalars=Array.from(lines[i]);const begin=BigInt(p.start);let cursor=0;for(const mark of p.marks){const start=Number(BigInt(mark.start)-begin),end=Number(BigInt(mark.end)-begin);if(start>cursor)node.append($createTextNode(scalars.slice(cursor,start).join('')));const text=$createTextNode(scalars.slice(start,end).join(''));for(const style of mark.styles)text.toggleFormat(style);node.append(text);cursor=end;}if(cursor<scalars.length)node.append($createTextNode(scalars.slice(cursor).join('')));root.append(node);});
}
export function exportManuscript(identities:ParagraphIdentities):Manuscript {
 const paragraphs:Paragraph[]=[],lines:string[]=[];let offset=0n;
 for(const block of $getRoot().getChildren()){
  if(!$isParagraphNode(block)&&!$isHeadingNode(block))throw new Error('Unsupported manuscript block. Save has been stopped to preserve your document.');
  const fragments:{text:string;styles:InlineMark['styles']}[]=[];
  const walk=(node:LexicalNode):void=>{if($isTextNode(node)){const styles:InlineMark['styles']=[];if(node.hasFormat('bold'))styles.push('bold');if(node.hasFormat('italic'))styles.push('italic');fragments.push({text:node.getTextContent(),styles});}else if($isLineBreakNode(node))fragments.push({text:'\n',styles:[]});else if(node===block&&$isElementNode(node))node.getChildren().forEach(walk);else throw new Error('Unsupported nested manuscript content. Save has been stopped to preserve your document.');};walk(block);
  const rows:{text:string;marks:InlineMark[]}[]=[{text:'',marks:[]}];let local=0n;
  for(const f of fragments){const parts=f.text.split('\n');parts.forEach((part,i)=>{if(i){rows.push({text:'',marks:[]});local=0n;}const row=rows[rows.length-1],length=BigInt(Array.from(part).length);if(length&&f.styles.length){const last=row.marks.at(-1),start=local.toString(),end=(local+length).toString();if(last&&last.end===start&&last.styles.join(',')===f.styles.join(','))last.end=end;else row.marks.push({start,end,styles:[...f.styles]});}row.text+=part;local+=length;});}
  rows.forEach((row,i)=>{const key=`${block.getKey()}:${i}`,id=identities.get(key)??crypto.randomUUID();identities.set(key,id);const end=offset+BigInt(Array.from(row.text).length),base={id,start:offset.toString(),end:end.toString(),indent:String($isElementNode(block)?block.getIndent():0),marks:row.marks.map(m=>({...m,start:(offset+BigInt(m.start)).toString(),end:(offset+BigInt(m.end)).toString()}))};const paragraph:Paragraph=row.text==='***'?{...base,kind:'scene-break',marks:[]}:$isHeadingNode(block)?{...base,kind:'heading',headingLevel:Number(block.getTag().slice(1)) as 1|2|3|4|5|6}:{...base,kind:'body'};paragraphs.push(paragraph);lines.push(row.text);offset=end+1n;});
 }
 if(!paragraphs.length){paragraphs.push({id:crypto.randomUUID(),start:'0',end:'0',indent:'0',marks:[],kind:'body'});lines.push('');}
 const text=lines.join('\n');assertManuscript(text,paragraphs);return{text,paragraphs};
}
