import csv
import re
from pathlib import Path

root = Path('.')
input_file = root / 'styles-audit-resolved.csv'
output_file = root / 'styles-audit-expanded.csv'

spacing_map = {
    '0':0,'0.5':2,'1':4,'1.5':6,'2':8,'2.5':10,'3':12,'3.5':14,'4':16,'5':20,'6':24,'7':28,'8':32,'9':36,'10':40,'11':44,'12':48,'14':56,'16':64,'20':80,'24':96,'28':112,'32':128,'36':144,'40':160,'44':176,'48':192,'52':208,'56':224,'60':240,'64':256,'72':288,'80':320,'96':384
}

num_class_re = re.compile(r"\b(p|px|py|pl|pr|pt|pb|m|mx|my|ml|mr|mt|mb|w|h)-([0-9]+(?:\.[0-9]+)?)\b")
rem_re = re.compile(r"([0-9]*\.?[0-9]+)rem")
bracket_px_re = re.compile(r"\b(?:p|px|py|pl|pr|pt|pb|text|w|h)-?\[([0-9]+(?:\.[0-9]+)?)(px)\]\b")

rows = []
with input_file.open(newline='\n', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    fieldnames = reader.fieldnames + ['spacing_resolved','rem_resolved']
    for r in reader:
        snippet = r.get('token_snippet','')
        spacing_entries = []
        for m in num_class_re.finditer(snippet):
            full = m.group(0)
            val = m.group(2)
            px = spacing_map.get(val)
            if px is not None:
                spacing_entries.append(f"{full}:{px}px")
            else:
                spacing_entries.append(f"{full}:unknown")
        # bracketed explicit px like text-[10px] or px-[10px]
        for m in bracket_px_re.finditer(snippet):
            val = m.group(1)
            unit = m.group(2)
            spacing_entries.append(f"{val}{unit}:{val}{unit}")
        rem_entries = []
        for m in rem_re.finditer(snippet):
            v = float(m.group(1))
            rem_entries.append(f"{m.group(1)}rem:{int(round(v*16))}px")
        r['spacing_resolved'] = '; '.join(spacing_entries)
        r['rem_resolved'] = '; '.join(rem_entries)
        rows.append(r)

with output_file.open('w', newline='\n', encoding='utf-8') as f:
    writer = csv.DictWriter(f, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(rows)

print('WROTE', output_file.resolve())
