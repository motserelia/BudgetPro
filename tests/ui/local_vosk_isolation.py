"""Full staged app runtime, configured partner mock, synthetic WAV; never a real mic/STT.
The served index.js adds only a diagnostic saved reference immediately before
finalize, to exercise the actual wrapper after every app redefinition has run.
"""
import functools, json, threading
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
ROOT=Path(__file__).resolve().parents[2]
manifest=json.loads(Path('/tmp/budgetpro-voice-debug-stage.json').read_text())
assert manifest.get('debugBuildRevision')==4
ASSETS=Path(manifest['stage'])/'android/app/src/main/assets/public'
class Handler(SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path.split('?')[0]=='/index.js':
            source=(ASSETS/'index.js').read_text().replace('\nwindow.BudgetPROVoiceDebug.finalize(', '\nwindow.__savedPartnerWrapper=saveAll;\nwindow.BudgetPROVoiceDebug.finalize(')
            self.send_response(200);self.send_header('Content-Type','application/javascript');self.end_headers();self.wfile.write(source.encode());return
        super().do_GET()
    def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Handler,directory=str(ASSETS)))
threading.Thread(target=server.serve_forever,daemon=True).start()
options=Options();options.binary_location='/usr/bin/chromium'
for flag in ['--headless=new','--no-sandbox','--disable-dev-shm-usage','--disable-background-networking','--no-first-run']:options.add_argument(flag)
d=webdriver.Chrome(service=Service('/usr/bin/chromedriver'),options=options)
try:
    d.execute_cdp_cmd('Network.enable',{})
    d.execute_cdp_cmd('Network.setBlockedURLs',{'urls':['https://*','wss://*']})
    d.execute_cdp_cmd('Page.addScriptToEvaluateOnNewDocument',{'source': '''
      for(const [k,v] of Object.entries({budgetpro_guest_mode:'true',budgetpro_defaults_en_dark_v1:'1',budgetpro_guide_completed_v3:'1',welcomeSeen:'1',onboarding_done:'1',showGoalsBtn:'false',showVoiceBtn:'false',lang:'ru',themeManualOverride:'1',jsonbin_disabled:'true',partnerRoomCode:'fixture-room', 'financial-fixture':'{"balance":123,"operations":[{"id":"fixture"}]}'}))localStorage.setItem(k,v);
      window.__counts={auth:0,financialNetwork:0,partner:0,microphone:0,parser:0};
      const nativeFetch=window.fetch.bind(window);
      window.fetch=(input,options={})=>{
        const u=new URL(typeof input==='string'?input:input.url,location.href);
        if(u.pathname==='/api/auth/refresh-session') {__counts.auth++;return Promise.resolve(new Response(JSON.stringify({ok:true,session:{access_token:'mock-refreshed-access',refresh_token:'mock-refreshed-refresh',expires_at:Math.floor(Date.now()/1000)+3600,authUserId:'fixture-user'}}),{status:200,headers:{'Content-Type':'application/json'}}));}
        if(u.origin!==location.origin||u.pathname.startsWith('/api/')) {__counts.financialNetwork++;return Promise.reject(Error('UNEXPECTED_FINANCIAL_NETWORK'));}
        return nativeFetch(input,options);
      };
    '''})
    d.set_page_load_timeout(25);d.get('http://127.0.0.1:%d/'%server.server_port)
    WebDriverWait(d,10).until(lambda x:x.execute_script('return !!window.BudgetPROVoiceDebug?.guardReady'))
    if not d.execute_script('return appInitDone'):d.execute_script('init();')
    # Only disposable fixtures. These direct fixture assignments are outside app handlers.
    d.execute_script('''
      transactions=[{id:'fixture-tx',type:'expense',category:'Fixture',amountRub:8,date:'2026-01-01'}];
      startBalanceRub=100;categories={Fixture:{subcats:[]}};incomeCategories={Salary:{subcats:[]}};
      recurringOps=[{id:'fixture-recurring',amountRub:2,freq:'daily'}];
      window.__beforeFinance=JSON.stringify({transactions,startBalanceRub,categories,incomeCategories,recurringOps});
      _fbDB={ref(){return {set(){__counts.partner++;},update(){__counts.partner++;},remove(){__counts.partner++;},on(){__counts.partner++;}};}};
      window.Capacitor={isNativePlatform:()=>true};
    ''')
    seal=d.execute_script('''return {ready:BudgetPROVoiceDebug.guardReady, revision:BudgetPROVoiceDebug.buildRevision,
      allSealed:arguments[0].every(n=>Object.getOwnPropertyDescriptor(window,n)?.writable===false),
      wrapperGuarded:__savedPartnerWrapper.toString().includes('BudgetPROVoiceDebug?.localOnly'),
      originalGuarded:_origSaveAll.toString().includes('BudgetPROVoiceDebug?.localOnly')};''',manifest['financialEntryGuards'])
    assert seal['ready'] and seal['revision']==4 and seal['allSealed'] and seal['wrapperGuarded'] and seal['originalGuarded'],seal
    d.execute_script('saveAll();__savedPartnerWrapper();_origSaveAll();')
    async_result=d.execute_async_script('''const done=arguments[0];Promise.resolve().then(()=>__savedPartnerWrapper()).then(()=>_origSaveAll()).then(()=>done(true));''')
    assert async_result is True
    for name in manifest['financialEntryGuards']:
        if name=='saveVoiceDraftTransaction':args={}
        else:args=None
        result=d.execute_async_script('''const done=arguments[arguments.length-1];Promise.resolve(window[arguments[0]](arguments[1])).then(v=>done(v===false),()=>done(false));''',name,args)
        assert result is True,name
    snapshot=d.execute_script('''return {finance:JSON.stringify({transactions,startBalanceRub,categories,incomeCategories,recurringOps})===__beforeFinance,
      stored:localStorage.getItem('financial-fixture')==='{"balance":123,"operations":[{"id":"fixture"}]}',partner:__counts.partner,financialNetwork:__counts.financialNetwork,editor:!!document.getElementById('editModal')};''')
    assert snapshot=={'finance':True,'stored':True,'partner':0,'financialNetwork':0,'editor':False},snapshot
    # Direct property writes and lower-level IDB APIs are blocked, too.
    boundaries=d.execute_script('''
      localStorage['financial-fixture']='changed';delete localStorage['financial-fixture'];
      let idb=0,ws=0;
      for(const fn of [()=>IDBObjectStore.prototype.put.call({},{}),()=>IDBCursor.prototype.update.call({},{}),()=>IDBDatabase.prototype.createObjectStore.call({},'x')])try{fn();}catch(e){if(e.message==='LOCAL_TEST_READ_ONLY')idb++;}
      for(const name of ['WebSocket','EventSource','Worker','SharedWorker'])if(window[name])try{new window[name]('https://example.invalid');}catch(e){if(e.message==='LOCAL_TEST_NETWORK_BLOCKED')ws++;}
      const saved=saveAll;try{window.saveAll=()=>{__counts.partner++;};}catch{};
      return {stored:localStorage.getItem('financial-fixture')==='{"balance":123,"operations":[{"id":"fixture"}]}',idb,ws,lateOverrideBlocked:saveAll===saved};
    ''')
    assert boundaries['stored'] and boundaries['idb']==3 and boundaries['ws']==4 and boundaries['lateOverrideBlocked'],boundaries
    # Actual Auth refresh client, mocked server: no real account or network.
    auth=d.execute_async_script('''const done=arguments[0];saveAuthSession({access_token:'mock-expired',refresh_token:'mock-refresh',expires_at:1,authUserId:'fixture-user'});refreshAuthSession('v4-regression').then(ok=>done({ok,valid:isAuthenticated(),calls:__counts.auth}));''')
    assert auth=={'ok':True,'valid':True,'calls':1},auth
    # No real recorder. The whole app run/start/overlay path remains actual.
    d.execute_script('''
      window.VoiceRecorder=class{async start(){__counts.microphone++;}async close(){}async finish(){return {wav:VoicePCM.wav(new Float32Array(16000)),metrics:{duration:1000}};}};
    ''')
    capture=(ROOT/'scripts/voice-debug/local-wav-capture.js').read_text()
    d.execute_script('const module={exports:{}};'+capture+'''
      const r={BudgetPROVoiceDebug,Capacitor,BudgetPROVoiceModule,location:{origin:'https://budgetpro.app'},crypto,setTimeout:setTimeout.bind(window),clearTimeout:clearTimeout.bind(window),btoa:btoa.bind(window)};
      for(const n of ['VoiceApiClient','BudgetPROLocalWavCapture'])Object.defineProperty(r,n,{get:()=>window[n],set:v=>window[n]=v});module.exports(r);
    ''')
    d.execute_script('BudgetPROLocalWavCapture.arm();window.__pendingVoice=startVoiceSession();')
    WebDriverWait(d,5).until(lambda x:x.execute_script('return __counts.microphone===1'))
    d.execute_script("document.querySelector('#voiceOverlay [data-stop]').click();BudgetPROVoiceModule.stop();")
    state=d.execute_async_script('const done=arguments[0];__pendingVoice.then(()=>done({capture:BudgetPROLocalWavCapture.status(),overlay:!!document.querySelector("#voiceOverlay:not(.closing)"),editor:!!document.getElementById("editModal"),partner:__counts.partner,financialNetwork:__counts.financialNetwork}));')
    assert state['capture']['state']=='CAPTURE_COMPLETE' and state['capture']['captured'] and state['overlay'] and not state['editor'] and state['partner']==0 and state['financialNetwork']==0,state
    guard_click=d.execute_script('''
      const b=document.createElement('button');b.id='saveEditBtn';b.onclick=()=>{transactions.push({id:'forbidden'});};document.body.appendChild(b);b.click();b.remove();
      return JSON.stringify({transactions,startBalanceRub,categories,incomeCategories,recurringOps})===__beforeFinance;
    ''')
    assert guard_click
    d.execute_script("document.querySelector('#voiceOverlay [data-cancel]').click();BudgetPROLocalWavCapture.discard();")
    missing=d.execute_async_script('const done=arguments[0];delete window.BudgetPROLocalWavCapture;BudgetPROVoiceModule.start({token:"fixture"}).then(done);')
    assert missing.get('localCaptureBlocked') and d.execute_script('return __counts.microphone')==1
    report={'pass':16,'fullIndexAndAllWrappersLoaded':True,'configuredPartnerMock':True,'globalWrapperAndSavedOriginalBlocked':True,'asyncContinuationBlocked':True,'allFinancialEntriesSealed':len(manifest['financialEntryGuards']),'financialStateAndStorageUnchanged':True,'financialNetworkAndPartnerCalls':0,'actualAuthRefreshClientMockPass':True,'localWavNoCancelAndNoEditor':True,'missingHookNoMic':True,'realMicrophoneOrVoskUsed':False,'androidRuntimeVerified':False}
    Path('/tmp/budgetpro-vosk-georgian/v4-full-runtime-test.json').write_text(json.dumps(report,indent=2))
    print(json.dumps(report))
finally:
    d.quit();server.shutdown()
