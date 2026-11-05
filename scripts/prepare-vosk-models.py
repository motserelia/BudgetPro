#!/usr/bin/env python3
"""Prepare pinned local model assets. Never contacts a network or changes application storage."""
import argparse,hashlib,json,pathlib,shutil,zipfile
LOCKS={
 'vosk-model-small-ka-0.42': 'a4aa25c879c479428694d6839bbdfcaf1e879361f34f6a9301d750e95cc63b6d',
 'vosk-model-small-ru-0.22': '961d5ff98a17f4aa6de69864d0aa71fa5bac682301d2b5d17a3f24c5c99a46d4',
}
def sha(path):
 h=hashlib.sha256()
 with path.open('rb') as f:
  for b in iter(lambda:f.read(1024*1024),b''):h.update(b)
 return h.hexdigest()
def verify(dest):
 data=json.loads((dest/'vosk-models-manifest.json').read_text())
 if set(data)!=set(LOCKS):raise RuntimeError('MODEL_NOT_FOUND: expected ka and ru models')
 for name,model in data.items():
  if model['archiveSHA256']!=LOCKS[name]:raise RuntimeError('MODEL_INTEGRITY')
  for entry in model['files']:
   rel=pathlib.PurePosixPath(entry['path'])
   if rel.is_absolute() or '..' in rel.parts:raise RuntimeError('MODEL_INTEGRITY')
   p=dest/name/str(rel)
   if not p.is_file() or p.stat().st_size!=entry['bytes'] or sha(p)!=entry['sha256']:raise RuntimeError('MODEL_NOT_FOUND_OR_CHANGED: '+name)
 return data
def main():
 ap=argparse.ArgumentParser();ap.add_argument('--archives-dir',type=pathlib.Path);ap.add_argument('--output-dir',type=pathlib.Path,default=pathlib.Path(__file__).resolve().parents[1]/'.cache/vosk-assets');ap.add_argument('--verify',action='store_true');args=ap.parse_args();dest=args.output_dir
 if args.verify:
  verify(dest);print('Offline ka/ru model integrity: OK');return
 if not args.archives_dir:ap.error('--archives-dir is required; downloads are intentionally not automatic')
 dest.mkdir(parents=True,exist_ok=True);manifest={}
 for name,checksum in LOCKS.items():
  archive=args.archives_dir/(name+'.zip')
  # Support the short names used by the earlier isolated recovery, without weakening digest checks.
  if not archive.exists():archive=args.archives_dir/('model-small-ka.zip' if '-ka-' in name else 'model-small-ru.zip')
  if not archive.is_file() or sha(archive)!=checksum:raise RuntimeError('MODEL_ARCHIVE_MISSING_OR_CHANGED: '+name)
  files=[]
  with zipfile.ZipFile(archive) as z:
   for entry in z.infolist():
    rel=pathlib.PurePosixPath(entry.filename)
    if rel.is_absolute() or '..' in rel.parts or rel.parts[0]!=name:raise RuntimeError('MODEL_INTEGRITY')
    if entry.is_dir():continue
    p=dest/entry.filename;p.parent.mkdir(parents=True,exist_ok=True)
    with z.open(entry) as inp,p.open('wb') as out:shutil.copyfileobj(inp,out)
    files.append({'path':str(rel.relative_to(name)),'bytes':p.stat().st_size,'sha256':sha(p)})
  manifest[name]={'model':name,'archiveSHA256':checksum,'bytes':sum(f['bytes'] for f in files),'files':files}
 (dest/'vosk-models-manifest.json').write_text(json.dumps(manifest,indent=2))
 license_dir=dest/'vosk-licenses';license_dir.mkdir(exist_ok=True)
 license=(pathlib.Path('/usr/share/common-licenses/Apache-2.0'))
 if not license.exists():raise RuntimeError('Provide Apache-2.0 license text before distributing model assets')
 shutil.copyfile(license,license_dir/'Apache-2.0.txt')
 (license_dir/'NOTICE.txt').write_text('Vosk Android 0.3.75 and ka-small-0.42 / ru-small-0.22: Apache-2.0, https://alphacephei.com/vosk/models\nJNA 5.18.1: Apache-2.0 alternative of LGPL-2.1-or-later OR Apache-2.0; https://github.com/java-native-access/jna\nModels are bundled; no runtime speech-service calls or model downloads.\n')
 verify(dest);print(json.dumps({'models':{n:v['bytes'] for n,v in manifest.items()},'output':str(dest)}))
if __name__=='__main__':main()
