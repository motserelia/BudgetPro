#!/usr/bin/env python3
"""Inspect the isolated artifact. Never print matches or private credentials."""
import hashlib
import json
import pathlib
import re
import subprocess
import zipfile

ROOT = pathlib.Path(__file__).resolve().parents[2]
TOOLS = pathlib.Path('/home/irakli/Android/Sdk/build-tools')

def apk_identity(apk):
    badge = subprocess.run([str(TOOLS/'34.0.0/aapt'),'dump','badging',str(apk)],check=True,capture_output=True,text=True).stdout
    match = re.search(r"package: name='([^']+)' versionCode='(\d+)'", badge)
    sig = subprocess.run([str(TOOLS/'36.1.0/apksigner'),'verify','--print-certs',str(apk)],check=True,capture_output=True,text=True).stdout
    certs = re.findall(r'Signer #\d+ certificate SHA-256 digest: ([0-9a-fA-F]+)',sig)
    if not match or not certs:
        raise RuntimeError('APK_IDENTITY_UNAVAILABLE')
    return {'packageId':match[1],'versionCode':int(match[2]),'certificateSha256':certs,'debuggable':'application-debuggable' in badge}

def verify():
    manifest=json.loads(pathlib.Path('/tmp/budgetpro-voice-debug-stage.json').read_text());stage=pathlib.Path(manifest['stage'])
    apk=stage/'android/app/build/outputs/apk/debug/app-debug.apk'
    identity=apk_identity(apk)
    assert identity['packageId']=='pro.budget.app' and identity['versionCode']==manifest['versionCode'] and identity['debuggable']
    matches=[]
    patterns={'Groq key':rb'gsk_[A-Za-z0-9]{20,}', 'private key':rb'-----BEGIN (?:RSA )?PRIVATE KEY-----', 'JWT':rb'eyJ[A-Za-z0-9_-]{15,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}', 'Vercel personal token':rb'vcp_[A-Za-z0-9]{20,}'}
    with zipfile.ZipFile(apk) as z:
        for info in z.infolist():
            if info.is_dir():continue
            data=z.read(info)
            for kind,pattern in patterns.items():
                if re.search(pattern,data):matches.append({'file':info.filename,'kind':kind})
        for name,digest in manifest['sha256'].items():assert hashlib.sha256(z.read('assets/public/'+name)).hexdigest()==digest,name
        assert z.read('assets/public/api-config.js')==(ROOT/'android/app/src/main/assets/public/api-config.js').read_bytes()
        cfg=json.loads(z.read('assets/capacitor.config.json'));assert cfg['server']['hostname']=='budgetpro.app' and cfg['server']['androidScheme']=='https' and cfg['android']['allowMixedContent'] is (not manifest.get('localVoskOnly', False))
        if manifest.get('localVoskOnly'):
            page=z.read('assets/public/index.html').decode()
            assert page.index('voice/local-finance-guard.js') < page.index('voice/voice-session.js') < page.index('src="index.js"') < page.index('voice/local-wav-capture.js')
            assert manifest['debugBuildRevision']==4 and manifest['versionCode']==5
            assert 'Content-Security-Policy' in page and 'connect-src' in page and 'form-action' in page
            index=z.read('assets/public/index.js').decode()
            assert index.endswith('\nwindow.BudgetPROVoiceDebug.finalize(' + json.dumps(manifest['financialEntryGuards']) + ');\n')
            assert z.read('assets/public/voice/voice-session.js')==(ROOT/'scripts/voice-debug/local-voice-session.js').read_bytes()
            assert z.read('assets/public/index.js').count(b'if (window.BudgetPROVoiceDebug?.localOnly) return window.BudgetPROVoiceDebug.blocked();')==len(manifest['financialEntryGuards']) + sum(manifest.get('financialWrapperGuards', {}).values())
        for name in z.namelist():
            assert not name.endswith('.env') and '/.env.' not in name
        assert not any('x-vercel-trusted-oidc-idp-token' in z.read(n).decode('utf8','ignore') for n in z.namelist() if n.startswith('assets/public/') and n.endswith('.js'))
    assert not matches,'SECRET_PATTERN_FOUND (values hidden)'
    xml=subprocess.run([str(TOOLS/'34.0.0/aapt'),'dump','xmltree',str(apk),'res/xml/voice_debug_network_security.xml'],check=True,capture_output=True,text=True).stdout
    assert 'E: base-config' in xml and 'cleartextTrafficPermitted=(type 0x12)0x0' in xml
    assert re.findall(r'C: "([^"]+)"',xml)==([] if manifest.get('localVoskOnly') else ['localhost','127.0.0.1'])
    old=ROOT/'android/app/build/outputs/apk/debug/app-debug.apk';previous=apk_identity(old) if old.exists() else None
    out={'apk':str(apk),'sha256':hashlib.sha256(apk.read_bytes()).hexdigest(),'identity':identity,'assetHashesVerified':True,'credentialPatternMatches':len(matches),'productionApiConfigUnchanged':True,'localVoskOnly':manifest.get('localVoskOnly', False),'cleartextBlocked':manifest.get('localVoskOnly', False),'loopbackOnlyCleartext':not manifest.get('localVoskOnly', False),'previousLocalApkIdentity':previous,'matchesPreviousLocalApkSigner':bool(previous and previous['certificateSha256']==identity['certificateSha256']),'installedDeviceCompatibility':'UNKNOWN until device connected','installed':False}
    pathlib.Path('/tmp/budgetpro-voice-debug-apk-report.json').write_text(json.dumps(out,indent=2));print(json.dumps(out,indent=2))
if __name__=='__main__':verify()
