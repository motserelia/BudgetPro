#!/usr/bin/env python3
"""Read-only compatibility gate. No install/uninstall/clear and no app data access."""
import json
import pathlib
import subprocess
import sys
import tempfile
from importlib.util import spec_from_file_location,module_from_spec
sys.dont_write_bytecode = True
spec=spec_from_file_location('verify',pathlib.Path(__file__).with_name('verify-apk.py'));module=module_from_spec(spec);spec.loader.exec_module(module)
def call(args):
    return subprocess.run(args,check=True,capture_output=True,text=True,timeout=25).stdout

def check():
    lines=[x.split() for x in call(['adb','devices','-l']).splitlines()[1:] if x.strip()]
    devices=[x[0] for x in lines if len(x)>1 and x[1]=='device']
    result={'authorizedDevices':len(devices),'unauthorizedDevices':sum(len(x)>1 and x[1]=='unauthorized' for x in lines),'compatibleUpdate':False,'installed':False}
    if len(devices)!=1:
        result['reason']='CONNECT_ONE_AUTHORIZED_DEVICE';print(json.dumps(result,indent=2));return
    args=['adb','-s',devices[0]]
    raw=call(args+['shell','pm','path','pro.budget.app']);paths=[x[len('package:'):].strip() for x in raw.splitlines() if x.startswith('package:')]
    if not paths:
        result['reason']='BUDGETPRO_NOT_INSTALLED';print(json.dumps(result,indent=2));return
    dest=pathlib.Path(tempfile.mkdtemp(prefix='budgetpro-installed-signature-'))/'base.apk'
    call(args+['pull',next((p for p in paths if p.endswith('/base.apk')),paths[0]),str(dest)])
    previous=module.apk_identity(dest);manifest=json.loads(pathlib.Path('/tmp/budgetpro-voice-debug-stage.json').read_text());apk=pathlib.Path(manifest['stage'])/'android/app/build/outputs/apk/debug/app-debug.apk';new=module.apk_identity(apk)
    result['samePackage']=new['packageId']==previous['packageId']=='pro.budget.app';result['sameSigner']=new['certificateSha256']==previous['certificateSha256'];result['versionAllowsUpdate']=new['versionCode']>=previous['versionCode'];result['compatibleUpdate']=all(result[k] for k in ['samePackage','sameSigner','versionAllowsUpdate']);result['reason']='COMPATIBLE_NOT_INSTALLED' if result['compatibleUpdate'] else 'STOP_INCOMPATIBLE_UPDATE';result['previousVersionCode']=previous['versionCode'];result['newVersionCode']=new['versionCode']
    print(json.dumps(result,indent=2));pathlib.Path('/tmp/budgetpro-voice-debug-device-report.json').write_text(json.dumps(result,indent=2))
if __name__=='__main__':check()
