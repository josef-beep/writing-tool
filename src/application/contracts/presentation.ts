import type {WorkspaceSnapshot,AppSettings,PanelLayout} from './workspace';
import {validDatePosition,elapsedPosition,signedInteger,positiveInteger,type CalendarData,type DatePosition} from '../../domain/calendar';
import {closed,isUuid} from '../../domain/validation';
import {validWorkspaceData} from '../../domain/workspace';
import type {ViewData} from '../../domain/workspace';
export const PRESENTATION_CHANNEL='writingtool:presentation:v1';
export const PANEL_IDS=['navigation','timeline','context'] as const;
export type PanelId=typeof PANEL_IDS[number];
export type TimelineView={zoom:number;focus:{requestId:string;start:DatePosition;end:DatePosition|null}|null;anchor:string|null;period:string|null;unresolved:boolean};
export const INITIAL_TIMELINE_VIEW:TimelineView={zoom:1,focus:null,anchor:null,period:null,unresolved:false};
export type ContextTab='characters'|'factions'|'plots'|'decisions';
export type CharacterFilter='all'|'main'|'major'|'minor'|'extra';
export type PanelPatch=Partial<Pick<PanelLayout,'visible'|'collapsed'|'placement'>>;
export type PanelMirror={snapshot:WorkspaceSnapshot;settings:AppSettings|null;universeName:string;storyId:string|null;chapterId:string|null;selectedId:string|null;timeline:TimelineView;contextTab:ContextTab;characterFilter:CharacterFilter;blocked:boolean};
export type PanelAction={kind:'select'|'edit';id:string}|{kind:'move';id:string;direction:-1|1}|{kind:'create';recordType:'story'|'volume'|'chapter'|'event'|'character'|'faction'|'decision'|'plot'}|{kind:'create-event';date:DatePosition}|{kind:'filters';value:ViewData}|{kind:'tree'}|{kind:'timeline';value:TimelineView}|{kind:'context';tab:ContextTab;filter:CharacterFilter}|{kind:'panel';patch:PanelPatch}|{kind:'panel-order';direction:-1|1};
export const validTimelineView=(v:unknown):v is TimelineView=>closed(v,['zoom','focus','anchor','period','unresolved'])&&typeof v.zoom==='number'&&Number.isFinite(v.zoom)&&v.zoom>=.125&&v.zoom<=64&&(v.anchor===null||signedInteger(v.anchor))&&(v.period===null||positiveInteger(v.period))&&typeof v.unresolved==='boolean'&&(v.focus===null||closed(v.focus,['requestId','start','end'])&&isUuid(v.focus.requestId)&&validDatePosition(v.focus.start)&&(v.focus.end===null||validDatePosition(v.focus.end)));
export function validTimelineCalendar(view:TimelineView,calendar:CalendarData|null):boolean{
 if(!view.focus)return true;
 if(!calendar)return false;
 try{elapsedPosition(view.focus.start,calendar);if(view.focus.end)elapsedPosition(view.focus.end,calendar);return true;}catch{return false;}
}
/** Focus requests reset the interval once; ordinary mirrors/panning retain its shared state. */
export function resolveTimelineView(current:TimelineView,next:TimelineView,calendar:CalendarData|null):TimelineView|null{
 if(!validTimelineView(next)||!validTimelineCalendar(next,calendar))return null;
 if(!next.focus||next.focus.requestId===current.focus?.requestId)return next;
 const start=elapsedPosition(next.focus.start,calendar!),end=next.focus.end?elapsedPosition(next.focus.end,calendar!):start,low=start<end?start:end,high=start>end?start:end;
 return {...next,anchor:low.toString(),period:high>low?(high-low+1n).toString():'31'};
}
export const panelActionOpensMain=(action:PanelAction):boolean=>['select','edit','create','create-event','tree'].includes(action.kind);
export function validPanelAction(v:unknown):v is PanelAction{
 if(closed(v,['kind','id'])&&['select','edit'].includes(String(v.kind)))return isUuid(v.id);
 if(closed(v,['kind','id','direction'])&&v.kind==='move')return isUuid(v.id)&&[-1,1].includes(Number(v.direction))&&typeof v.direction==='number';
 if(closed(v,['kind','recordType'])&&v.kind==='create')return ['story','volume','chapter','event','character','faction','decision','plot'].includes(String(v.recordType));
 if(closed(v,['kind','date'])&&v.kind==='create-event')return validDatePosition(v.date);
 if(closed(v,['kind','value'])&&v.kind==='filters')return validWorkspaceData('view',v.value);
 if(closed(v,['kind','value'])&&v.kind==='timeline')return validTimelineView(v.value);
 if(closed(v,['kind','tab','filter'])&&v.kind==='context')return ['characters','factions','plots','decisions'].includes(String(v.tab))&&['all','main','major','minor','extra'].includes(String(v.filter));
 if(closed(v,['kind','patch'])&&v.kind==='panel'&&typeof v.patch==='object'&&v.patch!==null){const p=v.patch as Record<string,unknown>;return Object.keys(p).length>0&&Object.entries(p).every(([key,value])=>key==='placement'?['left','right','bottom','center','floating'].includes(String(value)):['visible','collapsed'].includes(key)&&typeof value==='boolean');}
 return closed(v,['kind'])&&v.kind==='tree'||closed(v,['kind','direction'])&&v.kind==='panel-order'&&typeof v.direction==='number'&&[-1,1].includes(v.direction);
}
export type PresentationCommand={command:'inventory'|'panel.flush'}|{command:'panel.sync';layouts:PanelLayout[];mirror:PanelMirror}|{command:'panel.read'}|{command:'panel.action';action:PanelAction};
export type PresentationEvent={kind:'mirror';mirror:PanelMirror}|{kind:'action';action:PanelAction;panelId:PanelId}|{kind:'layout';id:PanelId;patch:Partial<PanelLayout>};
export type PresentationResult={status:'ok';fonts:string[];monitors:{id:string;x:number;y:number;width:number;height:number}[];panelId:PanelId|null;mirror:PanelMirror|null;layoutPatches?:{id:PanelId;patch:Partial<PanelLayout>}[]}|{status:'error';message:string};
export interface PresentationBridge {presentation:(command:PresentationCommand)=>Promise<PresentationResult>;onPresentation:(listener:(event:PresentationEvent)=>void)=>()=>void}
