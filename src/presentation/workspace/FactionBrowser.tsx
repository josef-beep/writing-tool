import type {WorkspaceRecordOf} from '../../domain/workspace';

export function FactionBrowser({factions,open,create,back}:{factions:WorkspaceRecordOf<'faction'>[];open:(faction:WorkspaceRecordOf<'faction'>)=>void;create:()=>void;back:()=>void}){
 return <div className="center-form faction-browser"><div className="center-heading"><h2>Factions</h2><button onClick={back}>Back to writing</button></div><button onClick={create}>New faction…</button>{!factions.length?<p>No factions saved in this universe yet.</p>:<ul className="faction-list" aria-label="Saved factions">{factions.map(faction=><li key={faction.id}><button className="context-record" onClick={()=>open(faction)}>{faction.data.name}</button></li>)}</ul>}</div>;
}
