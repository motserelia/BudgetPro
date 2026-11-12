#!/usr/bin/env python3
"""Prepare pinned local whisper.cpp model assets. Downloads happen only for pinned files and only with --download; never changes application storage."""
import argparse,hashlib,json,pathlib,shutil,urllib.request
# Multilingual q5_1 models: one file covers ru, en and ka (no .en variant, no per-language substitution).
# ggml-small-q5_1 is the model the app ships; ggml-base-q5_1 stays pinned for accuracy/speed comparison.
MODELS={
 'ggml-base-q5_1': {
  'url': 'https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-base-q5_1.bin',
  'sha256': '422f1ae452ade6f30a004d7e5c6a43195e4433bc370bf23fac9cc591f01a8898',
  'bytes': 59707625,
 },
 'ggml-small-q5_1': {
  'url': 'https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-small-q5_1.bin',
  'sha256': 'ae85e4a935d7a567bd102fe55afc16bb595bdb618e11b2fc7591bc08120411bb',
  'bytes': 190085487,
 },
}
MANIFEST='whisper-models-manifest.json'
LICENSE_SRC=pathlib.Path(__file__).resolve().parents[1]/'android/third_party/whisper.cpp/LICENSE'
def sha(path):
 h=hashlib.sha256()
 with path.open('rb') as f:
  for b in iter(lambda:f.read(1024*1024),b''):h.update(b)
 return h.hexdigest()
def download(name,directory):
 spec=MODELS[name];directory.mkdir(parents=True,exist_ok=True)
 target=directory/(name+'.bin');partial=target.with_suffix('.bin.part')
 with urllib.request.urlopen(spec['url'],timeout=600) as response,partial.open('wb') as out:shutil.copyfileobj(response,out)
 partial.replace(target);return target
def verify(dest):
 data=json.loads((dest/MANIFEST).read_text())
 if set(data)!=set(MODELS):raise RuntimeError('MODEL_NOT_FOUND: expected the pinned models: '+', '.join(MODELS))
 for name,model in data.items():
  if model['model']!=name or model['source']['sha256']!=MODELS[name]['sha256']:raise RuntimeError('MODEL_INTEGRITY')
  for entry in model['files']:
   rel=pathlib.PurePosixPath(entry['path'])
   if rel.is_absolute() or '..' in rel.parts:raise RuntimeError('MODEL_INTEGRITY')
   p=dest/name/str(rel)
   if not p.is_file() or p.stat().st_size!=entry['bytes'] or sha(p)!=entry['sha256']:raise RuntimeError('MODEL_NOT_FOUND_OR_CHANGED: '+name)
 return data
def main():
 ap=argparse.ArgumentParser();ap.add_argument('--source-dir',type=pathlib.Path,help='directory holding already downloaded pinned .bin files');ap.add_argument('--output-dir',type=pathlib.Path,default=pathlib.Path(__file__).resolve().parents[1]/'.cache/whisper-assets');ap.add_argument('--models',default='');ap.add_argument('--download',action='store_true');ap.add_argument('--verify',action='store_true');args=ap.parse_args();dest=args.output_dir
 if args.verify:
  verify(dest);print('Offline whisper ru/en/ka model integrity: OK');return
 selected=[name.strip() for name in args.models.split(',') if name.strip()] or list(MODELS)
 unknown=[name for name in selected if name not in MODELS]
 if unknown:ap.error('unknown model: '+', '.join(unknown))
 manifest={}
 if (dest/MANIFEST).is_file():manifest=json.loads((dest/MANIFEST).read_text())
 dest.mkdir(parents=True,exist_ok=True)
 for name in selected:
  spec=MODELS[name];source=args.source_dir/(name+'.bin') if args.source_dir is not None else None
  if source is None or not source.is_file():
   if not args.download:ap.error('--source-dir with pinned files is required; downloads require --download')
   source=download(name,dest.parent/'whisper-downloads')
  if sha(source)!=spec['sha256']:raise RuntimeError('MODEL_FILE_MISSING_OR_CHANGED: '+name)
  target=dest/name/(name+'.bin');target.parent.mkdir(parents=True,exist_ok=True)
  if not target.is_file() or target.stat().st_size!=spec['bytes'] or sha(target)!=spec['sha256']:shutil.copyfile(source,target)
  manifest[name]={'model':name,'source':{'url':spec['url'],'sha256':spec['sha256']},'bytes':target.stat().st_size,'files':[{'path':target.name,'bytes':target.stat().st_size,'sha256':spec['sha256']}]}
 (dest/MANIFEST).write_text(json.dumps(manifest,indent=2))
 license_dir=dest/'whisper-licenses';license_dir.mkdir(exist_ok=True)
 if not LICENSE_SRC.is_file():raise RuntimeError('Provide the whisper.cpp MIT license text before distributing model assets')
 shutil.copyfile(LICENSE_SRC,license_dir/'whisper.cpp-MIT.txt')
 weights=''.join('Whisper %s weights: MIT (OpenAI Whisper), https://huggingface.co/ggerganov/whisper.cpp\n'%name for name in MODELS)
 (license_dir/'NOTICE.txt').write_text('whisper.cpp v1.9.5: MIT, https://github.com/ggml-org/whisper.cpp\n'+weights+'The models are bundled in the APK; no runtime speech-service calls or model downloads.\n')
 verify(dest);print(json.dumps({'models':{n:v['bytes'] for n,v in manifest.items()},'output':str(dest)}))
if __name__=='__main__':main()
