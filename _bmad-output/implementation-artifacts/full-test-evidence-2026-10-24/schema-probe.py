import copy,json
from pathlib import Path
from jsonschema import Draft202012Validator
from referencing import Registry,Resource
base=Path('_bmad-output/specs/spec-WritingTool/schemas')
schemas={p.name:json.loads(p.read_text()) for p in base.glob('*.schema.json')}
registry=Registry()
for name,schema in schemas.items():
 Draft202012Validator.check_schema(schema)
 resource=Resource.from_contents(schema)
 registry=registry.with_resource(schema['$id'],resource).with_resource(name,resource)
checks=0
foundation=schemas['foundation.schema.json']
def verify(value,definition,expected):
 global checks
 schema={'$ref':foundation['$id']+'#/$defs/'+definition}
 actual=Draft202012Validator(schema,registry=registry).is_valid(value)
 assert actual==expected,(definition,value,actual,expected)
 checks+=1
for value in ['0','1','999999999999999999999999999999']:
 verify(value,'unsignedDecimal',True);verify(value,'signedDecimal',True)
for value in ['',1,'00','01','-0','+1','1.0','1\n',' 1','1e3']:
 verify(value,'unsignedDecimal',False);verify(value,'signedDecimal',False)
verify('-1','signedDecimal',True);verify('-999999999999999999999999','signedDecimal',True)
for value in ['profiles/a.json','chapters/abc.wrt','images/Ω.png']:
 verify(value,'relativePath',True)
for value in ['','/root','../x','a/../b','./a','a/./b','C:/a','a\\b','a//b','a/','a\0b']:
 verify(value,'relativePath',False)
chapter=Draft202012Validator(schemas['chapter-format.schema.json'],registry=registry)
example=json.loads((base/'chapter-format.example.json').read_text())['formatting']
chapter.validate(example);checks+=1
for patch in [{'unexpected':True},{'formatVersion':2},{'paragraphs':[]}]:
 candidate={**copy.deepcopy(example),**patch};assert not chapter.is_valid(candidate);checks+=1
candidate=copy.deepcopy(example);candidate['text']['scalarLength']='01';assert not chapter.is_valid(candidate);checks+=1
result={'metaSchemas':len(schemas),'schemaAssertions':checks,'allPassed':True,'limits':'Schema validation does not establish semantic ownership, storage durability or installed runtime acceptance.'}
Path('_bmad-output/implementation-artifacts/full-test-evidence-2026-10-24/schema-probe-results.json').write_text(json.dumps(result,indent=2)+'\n')
print(json.dumps(result))
