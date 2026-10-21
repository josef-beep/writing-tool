import {useEffect,useState} from 'react';
import type {PanelMirror,PanelAction,PanelId} from '../../application/contracts/presentation';
import {PanelContent,PanelControls} from './PanelContent';
import './workspace.css';
export function FloatingPanel(){
 const [state,setState]=useState<PanelMirror|null>(null),[id,setId]=useState<PanelId>(),[error,setError]=useState<string>();
 useEffect(()=>{const stop=window.writingToolPresentation.onPresentation(event=>{if(event.kind==='mirror')setState(event.mirror);});void window.writingToolPresentation.presentation({command:'panel.read'}).then(r=>{if(r.status==='ok'){setId(r.panelId??undefined);setState(r.mirror);}else setError(r.message);}).catch(e=>setError(e instanceof Error?e.message:'The floating panel could not connect to the main writing window.'));return stop;},[]);
 useEffect(()=>{const media=window.matchMedia('(prefers-color-scheme: dark)'),apply=()=>document.documentElement.dataset.theme=state?.settings?.theme==='system'?(media.matches?'dark':'light'):state?.settings?.theme??'dark';apply();media.addEventListener('change',apply);return()=>media.removeEventListener('change',apply);},[state?.settings?.theme]);
 useEffect(()=>{const root=document.documentElement;root.style.fontFamily=state?.settings?.fontFamily??'system-ui, sans-serif';root.style.fontSize=`${state?.settings?.fontSize??'14'}px`;},[state?.settings?.fontFamily,state?.settings?.fontSize]);
 async function action(action:PanelAction){try{const response=await window.writingToolPresentation.presentation({command:'panel.action',action});if(response.status==='error')setError(response.message);else setError(undefined);}catch(e){setError(e instanceof Error?e.message:'The main writing window could not receive this action.');}}
 if(!state||!id)return <p role="status">{error??'Waiting for the main writing workspace…'}</p>;
 const panel=state.settings?.panels.find(p=>p.id===id);
 return <main className="floating-panel"><p>Selections open in the main writing window.</p>{error&&<p role="alert">{error}</p>}<div inert={state.blocked}>{panel&&<PanelControls panel={panel} onPatch={patch=>void action({kind:'panel',patch})} onOrder={direction=>void action({kind:'panel-order',direction})}/>}<div className="panel-content" hidden={panel?.collapsed}><PanelContent id={id} mirror={state} onAction={a=>void action(a)}/></div></div>{state.blocked&&<p role="status">Respond to the dialog in the main window to continue.</p>}</main>;
}
