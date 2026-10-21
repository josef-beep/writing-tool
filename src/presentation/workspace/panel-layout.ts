import type {AppSettings,PanelLayout} from '../../application/contracts/workspace';
import {PANEL_IDS} from '../../application/contracts/presentation';
export const DEFAULT_PANELS:PanelLayout[]=PANEL_IDS.map((id,i)=>({id,visible:true,collapsed:false,placement:i===2?'right':'left',order:String(i),width:i===2?'280':'250',height:'500',monitor:null,x:'80',y:'80'}));
/** Imported subsets still display every known panel; keep unknown saved entries intact. */
export function normalizePanelLayouts(panels:PanelLayout[]):PanelLayout[]{
 return [...DEFAULT_PANELS.map(fallback=>({...fallback,...panels.find(panel=>panel.id===fallback.id)})),...panels.filter(panel=>!PANEL_IDS.some(id=>id===panel.id))];
}
/** Retain newer gestures while an older batch is saving, including failed/uncertain saves. */
export class PanelLayoutQueue{
 private patches=new Map<string,Partial<PanelLayout>>();
 get size(){return this.patches.size;}
 add(id:string,patch:Partial<PanelLayout>){this.patches.set(id,{...this.patches.get(id),...patch});}
 apply(panels:PanelLayout[]):PanelLayout[]{return normalizePanelLayouts(panels).map(panel=>({...panel,...this.patches.get(panel.id)}));}
 acknowledge(panels:PanelLayout[]):void{
  const normalized=normalizePanelLayouts(panels);
  for(const [id,patch]of this.patches){const actual=normalized.find(p=>p.id===id);if(!actual)continue;const remaining=Object.fromEntries(Object.entries(patch).filter(([key,value])=>actual[key as keyof PanelLayout]!==value));if(Object.keys(remaining).length)this.patches.set(id,remaining);else this.patches.delete(id);}
 }
}
export function reorderPanels(panels:PanelLayout[],id:string,direction:-1|1):PanelLayout[]{
 const ordered=[...panels].sort((a,b)=>BigInt(a.order)<BigInt(b.order)?-1:BigInt(a.order)>BigInt(b.order)?1:a.id.localeCompare(b.id));
 const index=ordered.findIndex(p=>p.id===id);if(index<0)return panels;
 let other=index+direction;while(other>=0&&other<ordered.length&&ordered[other].placement!==ordered[index].placement)other+=direction;
 if(other<0||other>=ordered.length)return panels;
 [ordered[index],ordered[other]]=[ordered[other],ordered[index]];
 return panels.map(panel=>({...panel,order:String(ordered.findIndex(p=>p.id===panel.id))}));
}
export function mergeSavedPanelLayout(draft:PanelLayout[],before:PanelLayout[],saved:PanelLayout[],submittedDraft:PanelLayout[]):PanelLayout[]{
 const baseline=normalizePanelLayouts(before),acknowledged=normalizePanelLayouts(saved),submitted=normalizePanelLayouts(submittedDraft);
 return normalizePanelLayouts(draft).map(panel=>{const actual=acknowledged.find(p=>p.id===panel.id),previous=baseline.find(p=>p.id===panel.id),atSubmission=submitted.find(p=>p.id===panel.id);if(!actual||!previous||!atSubmission)return panel;return {...panel,...Object.fromEntries(Object.entries(actual).filter(([key,value])=>previous[key as keyof PanelLayout]!==value&&panel[key as keyof PanelLayout]===atSubmission[key as keyof PanelLayout]))};});
}
type PanelPersistence={
 current:()=>AppSettings|null;
 draft:()=>PanelLayout[]|null;
 read:()=>Promise<AppSettings>;
 save:(values:AppSettings,expectedVersion:string)=>Promise<AppSettings>;
 accept:(before:AppSettings,saved:AppSettings,submittedDraft:PanelLayout[]|null)=>void;
};
/** Controller persistence loop; read-back rebases both rejected replies and known conflicts. */
export async function persistPanelLayouts(queue:PanelLayoutQueue,io:PanelPersistence):Promise<void>{
 const beforeRead=io.current(),draftBeforeRead=io.draft()?.map(panel=>({...panel}))??null;
 let current=await io.read();
 io.accept(beforeRead??current,current,draftBeforeRead);queue.acknowledge(current.panels);
 while(queue.size){
  const submittedDraft=io.draft()?.map(panel=>({...panel}))??null;
  const values={...current,panels:queue.apply(current.panels)};
  let saved:AppSettings;
  try{saved=await io.save(values,current.recordVersion);}
  catch(error){
   try{const observed=await io.read();io.accept(current,observed,submittedDraft);queue.acknowledge(observed.panels);}catch{/* Preserve the original error and every unacknowledged gesture. */}
   if(queue.size)throw error;
   return;
  }
  io.accept(current,saved,submittedDraft);queue.acknowledge(saved.panels);
  current=saved;
 }
}
export function panelResizePatch(before:{width:number;height:number},after:{width:number;height:number},collapsed:boolean):Partial<PanelLayout>{
 const patch:Partial<PanelLayout>={};
 if(after.width>0&&Math.round(after.width)!==Math.round(before.width))patch.width=String(Math.round(after.width));
 if(!collapsed&&after.height>0&&Math.round(after.height)!==Math.round(before.height))patch.height=String(Math.round(after.height));
 return patch;
}
