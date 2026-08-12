import os, re, json
files = os.listdir('static/img')
exts = ('png','webp','jpg','jpeg')
pat = re.compile(r'^(.*?)(?:_(\d+))?\.(' + '|'.join(exts) + r')$')
groups = {}
for f in files:
    m = pat.match(f)
    if not m: continue
    base, n, ext = m.groups()
    n = int(n) if n else 1
    groups.setdefault(base, {})[n] = f
manifest = {base: ['static/img/' + d[n] for n in sorted(d)] for base, d in groups.items()}
with open('static/img/manifest.json', 'w') as f:
    json.dump(manifest, f, indent=2, ensure_ascii=False)