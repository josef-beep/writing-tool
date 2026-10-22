import {useEffect,useRef} from 'react';

/** Retain editor state even when the normal save/close guard cannot finish. */
export function useRecoveryDraft(kind:string,value:unknown|(()=>unknown)):void {
 const latest=useRef(value);latest.current=value;
 useEffect(()=>{
  const collect=(event:Event)=>{
   const drafts=(event as CustomEvent<{drafts:unknown[]}>).detail?.drafts;
   if(Array.isArray(drafts))try{drafts.push({kind,value:typeof latest.current==='function'?latest.current():latest.current});}catch(error){drafts.push({kind,error:error instanceof Error?error.message:'Could not collect editor state.'});}
  };
  document.addEventListener('writingtool-collect-recovery',collect);
  return()=>document.removeEventListener('writingtool-collect-recovery',collect);
 },[kind]);
}

export function QuitApplication(){
 return <button type="button" onClick={()=>document.dispatchEvent(new Event('writingtool-request-recovery-quit'))}>Quit application…</button>;
}
