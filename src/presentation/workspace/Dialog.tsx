import {createPortal} from 'react-dom';
import {useEffect,useRef,type ReactNode} from 'react';

export function Dialog({title,children,onCancel}:{title:string;children:ReactNode;onCancel:()=>void}) {
 const ref=useRef<HTMLElement>(null),cancel=useRef(onCancel);
 const previous=useRef(typeof document==='undefined'?null:document.activeElement as HTMLElement|null);
 cancel.current=onCancel;
 useEffect(()=>{
  const root=ref.current!;
  const items=()=>Array.from(root.querySelectorAll<HTMLElement>('button:not(:disabled),input:not(:disabled),select:not(:disabled),textarea:not(:disabled),a[href],[tabindex="0"]')).filter(item=>!item.matches(':disabled')&&!item.closest('[inert],[hidden]')&&item.getClientRects().length>0);
  // React autoFocus runs before this effect; retain that explicitly chosen action.
  if(!root.contains(document.activeElement))(items()[0]??root).focus();
  const key=(e:KeyboardEvent)=>{
   if(e.defaultPrevented||e.isComposing||e.keyCode===229)return;
   if(e.key==='Escape'){
    e.preventDefault();e.stopPropagation();cancel.current();
   }else if(e.key==='Tab'){
    const list=items(),first=list[0],last=list.at(-1);
    if(!first){e.preventDefault();root.focus();}
    else if(e.shiftKey&&(document.activeElement===first||!list.includes(document.activeElement as HTMLElement))){e.preventDefault();last?.focus();}
    else if(!e.shiftKey&&(document.activeElement===last||!list.includes(document.activeElement as HTMLElement))){e.preventDefault();first.focus();}
   }
  };
  root.addEventListener('keydown',key);
  return()=>{root.removeEventListener('keydown',key);if(previous.current?.isConnected)previous.current.focus();};
 },[]);
 return createPortal(<div className="scrim blocking"><section ref={ref} className="dialog" role="alertdialog" aria-modal="true" aria-label={title} tabIndex={-1}><h2>{title}</h2>{children}</section></div>,document.body);
}
