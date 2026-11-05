#!/usr/bin/env python3
"""Read-only native APK gate; optional attached-device signer comparison. Never installs."""
import argparse,hashlib,importlib.util,json,pathlib,re,struct,subprocess,tempfile,zipfile
ROOT=pathlib.Path(__file__).resolve().parents[2]
def main(device=False):
 m=json.loads(pathlib.Path('/tmp/budgetpro-vosk-android-stage.json').read_text());stage=pathlib.Path(m['stage']);apk=stage/'android/app/build/outputs/apk/debug/app-debug.apk'
 spec=importlib.util.spec_from_file_location('verify',ROOT/'scripts/voice-debug/verify-apk.py');v=importlib.util.module_from_spec(spec);spec.loader.exec_module(v)
 identity=v.apk_identity(apk);assert identity['packageId']=='pro.budget.app' and identity['versionCode']==7 and identity['debuggable']
 patterns=[rb'gsk_[A-Za-z0-9]{20,}',rb'-----BEGIN (?:RSA )?PRIVATE KEY-----',rb'vcp_[A-Za-z0-9]{20,}',rb'eyJ[A-Za-z0-9_-]{15,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}']
 with zipfile.ZipFile(apk) as z:
  matches=0
  for info in z.infolist():
   if info.is_dir():continue
   assert not info.filename.endswith('.env') and '/.env.' not in info.filename
   data=z.read(info)
   matches+=sum(bool(re.search(p,data)) for p in patterns)
  assert matches==0,'SECRET_PATTERN_FOUND_VALUES_HIDDEN'
  for n,h in m['sha256'].items():assert hashlib.sha256(z.read('assets/public/'+n)).hexdigest()==h
  for f in m['nativeModel']['files']:assert hashlib.sha256(z.read('assets/vosk-model-small-ka-0.42/'+f['path'])).hexdigest()==f['sha256']
  assert z.read('assets/public/api-config.js')==(ROOT/'android/app/src/main/assets/public/api-config.js').read_bytes()
  index=z.read('assets/public/index.js').decode();assert index.count('if (window.BudgetPROVoiceDebug?.localOnly) return window.BudgetPROVoiceDebug.blocked();')==42
  assert index.endswith('\nwindow.BudgetPROVoiceDebug.finalize('+json.dumps(m['financialEntryGuards'])+');\n')
  page=z.read('assets/public/index.html').decode();assert page.index('voice/local-finance-guard.js')<page.index('voice/voice-session.js')<page.index('src="index.js"')<page.index('voice/native-vosk-client.js')
  assert 'voice/local-wav-capture.js' not in page and 'voice/voice-debug-bootstrap.js' not in page and 'Content-Security-Policy' in page
  native=z.read('assets/public/voice/native-vosk-client.js').decode();assert 'fetch(' not in native and 'XMLHttpRequest' not in native and 'native().transcribe' in native
  assert 'root.Capacitor.Plugins.BudgetPROVoskDebug' in native and '.registerPlugin(' not in native
  cfg=json.loads(z.read('assets/capacitor.config.json'));assert cfg['server']['hostname']=='budgetpro.app' and cfg['server']['androidScheme']=='https' and not cfg['android']['allowMixedContent']
  aligns={}
  for name in [n for n in z.namelist() if n.startswith('lib/') and n.endswith('.so')]:
   assert name.startswith('lib/arm64-v8a/')
   b=z.read(name);assert b[:5]==b'\x7fELF\x02';off=struct.unpack_from('<Q',b,32)[0];size,num=struct.unpack_from('<HH',b,54)
   loads=[struct.unpack_from('<Q',b,off+i*size+48)[0] for i in range(num) if struct.unpack_from('<I',b,off+i*size)[0]==1];assert loads and min(loads)>=16384
   aligns[name]=min(loads)
  assert len(aligns)==2
 tools=pathlib.Path('/home/irakli/Android/Sdk/build-tools/36.1.0')
 subprocess.run([str(tools/'zipalign'),'-c','-P','16','4',str(apk)],check=True,capture_output=True)
 xml=subprocess.run(['/home/irakli/Android/Sdk/build-tools/34.0.0/aapt','dump','xmltree',str(apk),'AndroidManifest.xml'],check=True,capture_output=True,text=True).stdout
 start=xml.index('pro.budget.app.VoskDebugService') if 'pro.budget.app.VoskDebugService' in xml else xml.index('.VoskDebugService')
 service=xml[start-200:start+650];assert ':voskDebug' in service and 'android:exported' in service and '(type 0x12)0x0' in service
 out={'apk':str(apk),'apkBytes':apk.stat().st_size,'apkSha256':hashlib.sha256(apk.read_bytes()).hexdigest(),'identity':identity,'modelBytes':m['nativeModel']['bytes'],'modelFilesVerified':len(m['nativeModel']['files']),'assetHashesVerified':True,'financialEntryGuards':41,'wrapperGuard':True,'secretPatternMatches':0,'separateNonExportedNativeProcess':True,'elfLoadAlignments':aligns,'zip16KiBAlignment':True,'installed':False,'microphoneStarted':False,'androidNativeRuntimeTested':False}
 if device:
  b=['adb','-s','9a1882b9'];state=subprocess.run(b+['get-state'],check=True,capture_output=True,text=True).stdout.strip();assert state=='device'
  path=subprocess.run(b+['shell','pm','path','pro.budget.app'],check=True,capture_output=True,text=True).stdout.strip().splitlines()[0].removeprefix('package:')
  with tempfile.TemporaryDirectory(prefix='budgetpro-vosk-signer-') as d:
   dest=pathlib.Path(d)/'base.apk';subprocess.run(b+['pull',path,str(dest)],check=True,capture_output=True);old=v.apk_identity(dest)
  compatible=old['packageId']==identity['packageId'] and old['certificateSha256']==identity['certificateSha256'] and old['versionCode']<identity['versionCode'];assert compatible
  out['device']={'connected':True,'installedVersionCode':old['versionCode'],'newVersionCode':identity['versionCode'],'sameSigner':True,'compatibleUpdate':True}
 pathlib.Path('/tmp/budgetpro-vosk-android-apk-report.json').write_text(json.dumps(out,indent=2));print(json.dumps(out,indent=2))
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--device',action='store_true');main(p.parse_args().device)
