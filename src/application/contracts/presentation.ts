import type {WorkspaceSnapshot,AppSettings,PanelLayout} from './workspace';
export const PRESENTATION_CHANNEL='writingtool:presentation:v1';
export const PANEL_IDS=['navigation','timeline','context'] as const;
export type PanelId=typeof PANEL_IDS[number];
export type PanelMirror={snapshot:WorkspaceSnapshot;settings:AppSettings|null;universeName:string;storyId:string|null;chapterId:string|null;blocked:boolean};
export type PanelAction={kind:'select';id:string}|{kind:'create';recordType:'story'|'volume'|'chapter'|'event'|'character'|'faction'|'decision'|'plot'}|{kind:'tree'};
export type PresentationCommand={command:'inventory'}|{command:'panel.sync';layouts:PanelLayout[];mirror:PanelMirror}|{command:'panel.read'}|{command:'panel.action';action:PanelAction};
export type PresentationEvent={kind:'mirror';mirror:PanelMirror}|{kind:'action';action:PanelAction}|{kind:'layout';id:PanelId;patch:Partial<PanelLayout>};
export type PresentationResult={status:'ok';fonts:string[];monitors:{id:string;x:number;y:number;width:number;height:number}[];panelId:PanelId|null;mirror:PanelMirror|null}|{status:'error';message:string};
export interface PresentationBridge {presentation:(command:PresentationCommand)=>Promise<PresentationResult>;onPresentation:(listener:(event:PresentationEvent)=>void)=>()=>void}
