"""Generate source tables from official Unicode 17 files; does not execute the generated code."""
import hashlib
import json
from pathlib import Path

unicode_data = Path('/tmp/writingtool-UnicodeData-17.0.0.txt')
normalization = Path('/tmp/writingtool-DerivedNormalizationProps-17.0.0.txt')
decomposition, combining = {}, {}
for line in unicode_data.read_text().splitlines():
    fields = line.split(';')
    cp = int(fields[0], 16)
    if int(fields[3]):
        combining[str(cp)] = int(fields[3])
    value = fields[5]
    if value and not value.startswith('<'):
        decomposition[str(cp)] = [int(x, 16) for x in value.split()]
excluded = set()
for line in normalization.read_text().splitlines():
    value = line.split('#', 1)[0].strip()
    if not value:
        continue
    fields = [x.strip() for x in value.split(';')]
    if fields[1] == 'Full_Composition_Exclusion':
        bounds = [int(x, 16) for x in fields[0].split('..')]
        excluded.update(range(bounds[0], bounds[-1] + 1))
composition = {','.join(map(str, value)): int(cp) for cp, value in decomposition.items()
               if len(value) == 2 and int(cp) not in excluded}
header = '// Generated from Unicode 17.0.0 UnicodeData.txt and Full_Composition_Exclusion.\n'
header += '// Unicode License V3: resources/licenses/Unicode-LICENSE.txt\n'
for filename in [unicode_data, normalization]:
    header += f'// {filename.name}: SHA-256 {hashlib.sha256(filename.read_bytes()).hexdigest()}\n'
source = header
for name, table, type_name in [('DECOMPOSITION', decomposition, 'number[]'), ('COMBINING', combining, 'number'), ('COMPOSITION', composition, 'number')]:
    source += f'export const {name}:Record<string,{type_name}> = {json.dumps(table, separators=(",", ":"))};\n'
Path('src/domain/unicode-normalization-data.ts').write_text(source)
Path('resources/licenses/Unicode-LICENSE.txt').write_bytes(Path('/tmp/writingtool-Unicode-LICENSE.txt').read_bytes())
