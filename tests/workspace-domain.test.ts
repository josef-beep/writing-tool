import test from 'node:test';
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {assertWorkspaceState,WorkspaceValidationError,type WorkspaceRecord,type WorkspaceRecordOf} from '../src/domain/workspace';

test('long valid decision chains are validated without recursive call-stack limits and still reject cycles',()=>{
    const universeId=randomUUID(),owner={kind:'universe' as const,id:universeId},version=randomUUID(),typeId=randomUUID();
    const calendar:WorkspaceRecordOf<'calendar'>={schemaVersion:1,recordType:'calendar',id:randomUUID(),owner,universeId,recordVersion:randomUUID(),data:{
        currentVersion:version,anchor:{year:'0',day:'1'},versions:[{id:version,elements:[],daysOnly:'365',actualDays:'365',targetDays:'365',enteredYear:'0',yearNames:[]}],
    }};
    const type:WorkspaceRecordOf<'decision-type'>={schemaVersion:1,recordType:'decision-type',id:typeId,owner,universeId,recordVersion:randomUUID(),data:{name:'Story Decisions',makerRequired:false,builtin:'story'}};
    const ids=Array.from({length:12000},()=>randomUUID());
    const decisions:WorkspaceRecordOf<'decision'>[]=ids.map((id,index)=>({schemaVersion:1,recordType:'decision',id,owner,universeId,recordVersion:randomUUID(),data:{
        text:`Decision ${index}`,date:{calendarVersion:version,year:'0',day:'1'},typeId,code:`D${index}`,order:String(index),maker:null,characterIds:[],eventIds:[],followingDecisionIds:ids[index+1]?[ids[index+1]]:[],
    }}));
    const records:WorkspaceRecord[]=[calendar,type,...decisions];
    assert.doesNotThrow(()=>assertWorkspaceState(records));
    decisions[decisions.length-1].data.followingDecisionIds=[ids[0]];
    assert.throws(()=>assertWorkspaceState(records),error=>error instanceof WorkspaceValidationError&&error.message.includes('cycle'));
});
