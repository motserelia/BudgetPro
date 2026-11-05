#!/usr/bin/env python3
"""Independent offline-only debug APK tree. Does not sync or modify main Android/www."""
import contextlib,hashlib,importlib.util,io,json,pathlib,re,shutil,zipfile
ROOT=pathlib.Path(__file__).resolve().parents[2]
MODEL=pathlib.Path('/tmp/budgetpro-vosk-georgian/models/vosk-model-small-ka-0.42')
DEPS=pathlib.Path('/tmp/budgetpro-vosk-android-deps')
ARTIFACTS={'vosk-android-0.3.75.aar':'ab2f8b91ac8051561aa325546b35fed9a68b36b8121bac5c6fb927525c4adfad','jna-5.18.1.aar':'7f053e3ec99e14dd71259c82c1c8a02738d64a13c31226b2acc170f3060951e0'}
def main():
 for name,h in ARTIFACTS.items():
  if hashlib.sha256((DEPS/name).read_bytes()).hexdigest()!=h:raise RuntimeError('DEPENDENCY_HASH_MISMATCH')
 if not (MODEL/'am/final.mdl').is_file():raise RuntimeError('LOCAL_MODEL_MISSING')
 archive=MODEL.parent.parent/'vosk-model-small-ka-0.42.zip'
 if hashlib.sha256(archive.read_bytes()).hexdigest()!='a4aa25c879c479428694d6839bbdfcaf1e879361f34f6a9301d750e95cc63b6d':raise RuntimeError('MODEL_ARCHIVE_MISMATCH')
 with zipfile.ZipFile(archive) as z:
  for f in MODEL.rglob('*'):
   if f.is_file() and f.read_bytes()!=z.read(MODEL.name+'/'+str(f.relative_to(MODEL))):raise RuntimeError('EXTRACTED_MODEL_MISMATCH')
 legacy=pathlib.Path('/tmp/budgetpro-voice-debug-stage.json');saved=legacy.read_bytes() if legacy.exists() else None
 spec=importlib.util.spec_from_file_location('base',ROOT/'scripts/voice-debug/prepare-android.py');base=importlib.util.module_from_spec(spec);spec.loader.exec_module(base)
 try:
  with contextlib.redirect_stdout(io.StringIO()):base.prepare(True)
  manifest=json.loads(legacy.read_text())
 finally:
  if saved is not None:legacy.write_bytes(saved)
 stage=pathlib.Path(manifest['stage']);android=stage/'android';app=android/'app';assets=app/'src/main/assets';public=assets/'public'
 shutil.copy2(ROOT/'scripts/voice-debug/native-vosk-client.js',public/'voice/native-vosk-client.js')
 page=public/'index.html';html=page.read_text().replace('voice/local-wav-capture.js','voice/native-vosk-client.js');page.write_text(html)
 (public/'voice/local-wav-capture.js').unlink()
 session=public/'voice/voice-session.js';s=session.read_text()
 old="asrStatus: 'not_started', financialParseStatus: 'not_started'"
 assert s.count(old)==1;s=s.replace(old,"asrStatus: 'success'")
 old="errorPhase: 'capture', captureStatus: 'failed', requestStatus: 'not_sent', httpStatus: null, asrStatus: 'not_started'"
 assert s.count(old)==1;s=s.replace(old,"errorPhase: root.VoiceDiagnostics.get()?.errorPhase || 'capture', captureStatus: 'failed', requestStatus: 'not_sent', httpStatus: null, asrStatus: root.VoiceDiagnostics.get()?.asrStatus || 'not_started'")
 session.write_text(s)
 java=app/'src/debug/java/pro/budget/app';java.mkdir(parents=True,exist_ok=True)
 for f in (ROOT/'scripts/voice-debug/android-vosk/java/pro/budget/app').glob('*.java'):shutil.copy2(f,java/f.name)
 activity=app/'src/main/java/pro/budget/app/MainActivity.java';s=activity.read_text();anchor='super.onCreate(savedInstanceState);';assert s.count(anchor)==1;activity.write_text(s.replace(anchor,'registerPlugin(VoskDebugPlugin.class);\n        '+anchor))
 (app/'src/debug/AndroidManifest.xml').write_text('''<manifest xmlns:android="http://schemas.android.com/apk/res/android"><application android:networkSecurityConfig="@xml/voice_debug_network_security"><service android:name=".VoskDebugService" android:exported="false" android:process=":voskDebug" android:stopWithTask="true" /></application></manifest>''')
 model_files=[]
 for src in sorted(MODEL.rglob('*')):
  if src.is_file():
   name=str(src.relative_to(MODEL));dest=assets/'vosk-model-small-ka-0.42'/name;dest.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(src,dest)
   model_files.append({'path':name,'bytes':src.stat().st_size,'sha256':hashlib.sha256(src.read_bytes()).hexdigest()})
 licenses=assets/'vosk-licenses';licenses.mkdir(exist_ok=True)
 for n in ['VOSK-APACHE-LICENSE.txt','JNA-LICENSE.txt']:shutil.copy2(DEPS/n,licenses/n)
 (licenses/'NOTICE.txt').write_text('Vosk Android 0.3.75 / Georgian model small-ka-0.42: Apache-2.0; https://alphacephei.com/vosk/models\nJNA 5.18.1: see JNA-LICENSE.txt. No speech services or model downloads.\n')
 model_manifest={'model':MODEL.name,'bytes':sum(f['bytes'] for f in model_files),'files':model_files}
 (assets/'vosk-small-manifest.json').write_text(json.dumps(model_manifest,indent=2))
 libs=app/'libs';libs.mkdir(exist_ok=True)
 for n in ARTIFACTS:shutil.copy2(DEPS/n,libs/n)
 build=app/'build.gradle';s=build.read_text().replace('versionCode 5','versionCode 7')
 # Match connected arm64 device. Model and engine cannot be included in release tasks.
 s+='\nandroid.defaultConfig.ndk.abiFilters "arm64-v8a"\nandroid.packagingOptions.jniLibs.useLegacyPackaging = false\ndependencies { debugImplementation files("libs/vosk-android-0.3.75.aar", "libs/jna-5.18.1.aar") }\n'
 build.write_text(s)
 tests=app/'src/test/java/pro/budget/app';tests.mkdir(parents=True,exist_ok=True)
 for f in (ROOT/'tests/voice/android-vosk').glob('*.java'):shutil.copy2(f,tests/f.name)
 manifest.update({'nativeVoskAndroid':True,'versionCode':7,'nativeModel':model_manifest,'sdkArtifacts':ARTIFACTS,'installed':False,'voiceOnlyRelay':None,'nativeProcess':':voskDebug'})
 manifest['updatedAssets']=[n for n in manifest['updatedAssets'] if n!='voice/local-wav-capture.js']+['voice/native-vosk-client.js']
 manifest['sha256']={n:hashlib.sha256((public/n).read_bytes()).hexdigest() for n in manifest['updatedAssets']}
 manifest['nativeSourceSha256']={p.name:hashlib.sha256(p.read_bytes()).hexdigest() for p in java.glob('*.java')}
 (stage/'voice-debug-manifest.json').write_text(json.dumps(manifest,indent=2))
 pathlib.Path('/tmp/budgetpro-vosk-android-stage.json').write_text(json.dumps(manifest,indent=2))
 print(json.dumps({'stage':str(stage),'versionCode':7,'modelBytes':model_manifest['bytes'],'modelFiles':len(model_files),'productionOrMainAndroidChanged':False,'installed':False}))
if __name__=='__main__':main()
