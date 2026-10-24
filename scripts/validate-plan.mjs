import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const epicPath='_bmad-output/planning-artifacts/epics.md';
const indexPath='_bmad-output/specs/spec-WritingTool/planning-contract-index.md';
const read=name=>fs.readFileSync(path.join(root,name),'utf8');
const epics=read(epicPath),contracts=read(indexPath),failures=[];
const check=(condition,message)=>{if(!condition)failures.push(message);};
const counts=[9,7,14,7,10,2];
const matches=[...epics.matchAll(/^### Story (\d+)\.(\d+): (.+)$/gm)];
const expected=counts.flatMap((count,epic)=>Array.from({length:count},(_,i)=>`${epic+1}.${i+1}`));
const ids=matches.map(match=>`${match[1]}.${match[2]}`);
check(JSON.stringify(ids)===JSON.stringify(expected),'Story IDs/count/order must remain the approved 49 across six epics.');
check(matches[0]?.[3]==='Set up initial project from starter template','Story 1.1 must retain the required starter title.');
const positions=new Map(ids.map((id,index)=>[id,index]));
const extract=(text,prefix)=>{
 const result=new Set();
 for(const match of text.matchAll(new RegExp(`(?<![A-Z])${prefix}-(\\d+)`,'g'))){
  let previous=Number(match[1]);result.add(previous);
  const tail=text.slice(match.index+match[0].length);
  let offset=0,next;
  while((next=/^([/–-])(?:[A-Z]+-)?(\d+)/.exec(tail.slice(offset)))){
   const value=Number(next[2]);
   if(next[1]==='/')result.add(value);
   else for(let i=previous+1;i<=value;i++)result.add(i);
   previous=value;offset+=next[0].length;
  }
 }
 return [...result].sort((a,b)=>a-b);
};
const storyRows=matches.map(match=>{
 const id=`${match[1]}.${match[2]}`,after=epics.slice(match.index+match[0].length);
 const boundary=after.search(/^## |^### (?:Story|Epic) /m),body=boundary<0?after:after.slice(0,boundary);
 for(const [pattern,label]of [[/^As /m,'As'],[/^I want /m,'I want'],[/^So that /m,'So that'],[/\*\*Given\*\*/,'Given'],[/\*\*When\*\*/,'When'],[/\*\*Then\*\*/,'Then'],[/^\*\*Requirements:\*\*/m,'requirements'],[/^\*\*Dependencies:\*\*/m,'dependencies'],[/^\*\*Verification:\*\*/m,'verification']])check(pattern.test(body),`${id}: missing ${label}.`);
 check(!/\{\{|\bTBD\b|\bTODO HERE\b/.test(body),`${id}: unresolved template placeholder.`);
 const requirements=/^\*\*Requirements:\*\* (.+)$/m.exec(body)?.[1]??'';
 const dependencyLine=/^\*\*Dependencies:\*\* (.+)$/m.exec(body)?.[1]??'';
 const dependencies=[...dependencyLine.matchAll(/(?<!\d)(\d+\.\d+)(?!\d)/g)].map(item=>item[1]);
 for(const dependency of dependencies)check(positions.has(dependency)&&positions.get(dependency)<positions.get(id),`${id}: missing/self/forward dependency ${dependency}.`);
 const frs=extract(requirements,'FR'),nfrs=extract(requirements,'NFR'),ars=extract(requirements,'AD');
 check(frs.length>0||id==='1.1'||id==='1.5',`${id}: missing functional/capability requirement.`);
 if(id==='1.5')check(requirements.includes('CAP-1'),'1.5 must map volume organization to CAP-1.');
 check(dependencyLine.includes('planning-contract-index.md'),`${id}: missing consuming prerequisite source.`);
 return{id,title:match[3],dependencies,frs,nfrs,architecture:ars};
});
const frCoverage=Object.fromEntries(Array.from({length:49},(_,i)=>[String(i+1),storyRows.filter(story=>story.frs.includes(i+1)).map(story=>story.id)]));
for(const [fr,stories]of Object.entries(frCoverage))check(stories.length>0,`FR-${fr} has no story coverage.`);
const inventory=epics.slice(epics.indexOf('### Functional Requirements'),epics.indexOf('#### Required field matrices'));
check([...inventory.matchAll(/^FR-(\d+):/gm)].length===49,'Functional inventory must contain all 49 FRs.');
const uxRows=[...epics.matchAll(/^\| (UX-DR\d+) \| ([^|]+) \| ([^|]+) \|$/gm)].map(match=>({id:match[1],acceptance:match[2].trim(),stories:match[3].match(/\d+\.\d+/g)??[]}));
check(uxRows.length===22&&new Set(uxRows.map(row=>row.id)).size===22,'The 22 distinct UX responsibilities must remain mapped.');
for(const row of uxRows){check(row.stories.length>0,`${row.id} has no story.`);for(const id of row.stories)check(positions.has(id),`${row.id}: unknown story ${id}.`);}
const gateIds=[...contracts.matchAll(/^## (TECH-\d+)$/gm)].map(match=>match[1]);
check(JSON.stringify(gateIds)===JSON.stringify(Array.from({length:13},(_,i)=>`TECH-${String(i+1).padStart(2,'0')}`)),'Publish all 13 prerequisite definitions.');
// Existing release work explicitly covers non-feature acceptance; it is not a new story.
const crossCuttingCoverage={'NFR-8':['BUILD-24','BUILD-25','VERIFY-09'],'NFR-10':['VERIFY-10'],'AR-17':['BUILD-24','BUILD-25','VERIFY-09']};
const todo=read('TODO.md');
for(const tasks of Object.values(crossCuttingCoverage))for(const task of tasks)check(todo.includes(task),`Missing release acceptance task ${task}.`);
for(let n=1;n<=10;n++)check(storyRows.some(story=>story.nfrs.includes(n))||crossCuttingCoverage[`NFR-${n}`],`NFR-${n} has no acceptance owner.`);
for(let n=1;n<=18;n++)check(storyRows.some(story=>story.architecture.includes(n))||crossCuttingCoverage[`AR-${n}`],`AR-${n} has no acceptance owner.`);
for(const id of ['6.1','6.2'])check(storyRows.find(story=>story.id===id)?.dependencies.every(dependency=>Number(dependency.split('.')[0])<=2),`${id}: export must not depend on later planning/recovery epics.`);
for(const file of [epicPath,indexPath])for(const match of read(file).matchAll(/\[[^\]]*\]\(([^)]+)\)/g)){
 const link=match[1];if(/^[a-z]+:/i.test(link)||link.startsWith('#'))continue;
 const [target,anchor]=link.split('#'),resolved=path.resolve(root,path.dirname(file),decodeURI(target));
 check(fs.existsSync(resolved)||(process.argv.includes('--write')&&resolved===path.join(root,'_bmad-output/planning-artifacts/plan-05-validation.json')),`${file}: missing linked file ${target}.`);
 if(anchor?.startsWith('tech-'))check(new RegExp(`^## ${anchor.toUpperCase()}$`,'m').test(fs.existsSync(resolved)?fs.readFileSync(resolved,'utf8'):''),`${file}: missing anchor ${anchor}.`);
}
const declaredInputs=[...epics.split('---')[1].matchAll(/^  - (.+)$/gm)].map(match=>match[1]);
const inputs=[...new Set([epicPath,indexPath,'TODO.md','scripts/validate-plan.mjs','_bmad-output/planning-artifacts/final-validation.md','_bmad-output/specs/spec-WritingTool/SPEC.md','_bmad-output/specs/spec-WritingTool/data-contracts.md','_bmad-output/specs/spec-WritingTool/workspace-data-contract.md','_bmad-output/specs/spec-WritingTool/requirements.md','_bmad-output/specs/spec-WritingTool/contracts.md','_bmad-output/planning-artifacts/ux-designs/ux-WritingTool-2026-10-17/DESIGN.md','_bmad-output/planning-artifacts/ux-designs/ux-WritingTool-2026-10-17/EXPERIENCE.md',...declaredInputs])];
const result={schemaVersion:1,scope:'PLAN-05 planning structure and traceability; semantic assessment in final-validation.md',sourceRevision:execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim(),inputs:Object.fromEntries(inputs.map(file=>[file,createHash('sha256').update(read(file)).digest('hex')])),epicStoryCounts:counts,storyCount:storyRows.length,functionalRequirementCount:49,nonFunctionalRequirementCount:10,architectureRequirementCount:18,uxResponsibilityCount:uxRows.length,technicalContractCount:gateIds.length,stories:storyRows,frCoverage,uxCoverage:uxRows,crossCuttingCoverage,checks:{uniqueSequentialStoryIds:true,storyStructure:true,frCoverage:true,earlierDependencies:true,exportIndependence:true,prerequisiteDefinitions:true,linkedInputs:true},failures,runtimeChecksRun:false,fullStoryAcceptance:'open',installedPlatformAcceptance:'open'};
if(failures.length){console.error(failures.join('\n'));process.exitCode=1;}
else{
 if(process.argv.includes('--write'))fs.writeFileSync(path.join(root,'_bmad-output/planning-artifacts/plan-05-validation.json'),JSON.stringify(result,null,2)+'\n');
 console.log(`PLAN-05: ${storyRows.length} stories; 49 FRs; 10 NFRs; 18 architecture requirements; ${uxRows.length} UX responsibilities; ${gateIds.length} technical definitions; zero structural/traceability failures. Runtime/release acceptance remains open.`);
}
