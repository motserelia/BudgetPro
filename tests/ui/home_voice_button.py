"""Home voice entry regression: python3 tests/ui/home_voice_button.py.
Uses existing Chromium, ChromeDriver and Selenium; external HTTPS is blocked.
Test records and settings are confined to ChromeDriver's disposable browser profile.
"""
import json, threading, functools, time, os, sys
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from pathlib import Path
PROJECT = Path(__file__).resolve().parents[2]
class Handler(SimpleHTTPRequestHandler):
    def log_message(self, *args): pass
server = ThreadingHTTPServer(('127.0.0.1', 0), functools.partial(Handler, directory=str(PROJECT / 'www')))
threading.Thread(target=server.serve_forever, daemon=True).start()
options=Options()
for flag in ['--headless=new','--no-sandbox','--disable-dev-shm-usage','--disable-background-networking','--no-first-run']:
    options.add_argument(flag)
options.binary_location='/usr/bin/chromium'
options.set_capability('goog:loggingPrefs', {'browser':'ALL'})
driver=webdriver.Chrome(service=Service('/usr/bin/chromedriver'), options=options)
try:
    driver.execute_cdp_cmd('Network.enable', {})
    driver.execute_cdp_cmd('Network.setBlockedURLs', {'urls':['https://*']})
    driver.execute_cdp_cmd('Page.addScriptToEvaluateOnNewDocument', {'source': '''
      localStorage.setItem('budgetpro_guest_mode','true');
      localStorage.setItem('budgetpro_defaults_en_dark_v1','1');
      localStorage.setItem('budgetpro_guide_completed_v3','1');
      localStorage.setItem('welcomeSeen','1');
      localStorage.setItem('onboarding_done','1');
      localStorage.setItem('lastSmartSuggestion', new Date().toISOString().slice(0,10));
      localStorage.setItem('showGoalsBtn','false');
      localStorage.setItem('showVoiceBtn','false');
      localStorage.setItem('lang','ru');
      localStorage.setItem('themeManualOverride','1');
      localStorage.setItem('jsonbin_disabled','true');
    '''})
    driver.set_page_load_timeout(20)
    driver.get('http://127.0.0.1:%d/' % server.server_port)
    WebDriverWait(driver, 8).until(lambda d: d.execute_script('return typeof renderHome === "function"'))
    time.sleep(2)
    print('PAGE LOADED',flush=True)
    if not driver.execute_script('return appInitDone'): driver.execute_script('init();')
    driver.execute_script('''
      currentLang='ru'; document.documentElement.lang='ru';
      transactions=[
        {id:'i1',type:'income',category:'Salary',amountRub:20000,date:today()},
        {id:'e1',type:'expense',category:'Coffee',amountRub:100,date:today(),time:'12:00'},
        {id:'e2',type:'expense',category:'Food',amountRub:500,date:today(),time:'11:00'},
        {id:'e3',type:'expense',category:'Transport',amountRub:200,date:today(),time:'10:00'},
        {id:'e4',type:'expense',category:'Older',amountRub:10,date:'2025-01-01'}];
      startBalanceRub=1000; displayCurrency='GEL'; exchangeRates.GEL=.03;
      currentFilter=null; historyFilter='allTime';
      localStorage.setItem('showGoalsBtn','false'); localStorage.setItem('showVoiceBtn','false');
    ''')
    from selenium.webdriver.common.by import By
    from selenium.webdriver.support import expected_conditions as EC
    def wait_js(expression):
      return WebDriverWait(driver,10).until(lambda d:d.execute_script('return '+expression))
    def click(selector):
      from selenium.common.exceptions import StaleElementReferenceException
      for attempt in range(4):
        try:
          el=WebDriverWait(driver,10).until(EC.element_to_be_clickable((By.CSS_SELECTOR,selector)))
          for _ in range(2):
            driver.execute_script('arguments[0].scrollIntoView({block:"center",behavior:"instant"});',el)
            time.sleep(.2)
          el.click();time.sleep(.32);return
        except StaleElementReferenceException:
          if attempt==3: raise
    def fill(selector,value):
      el=WebDriverWait(driver,10).until(EC.visibility_of_element_located((By.CSS_SELECTOR,selector)))
      driver.execute_script('arguments[0].scrollIntoView({block:"center",behavior:"instant"});',el);time.sleep(.25)
      el.clear();el.send_keys(value)
    def prepare(simple,count):
      driver.execute_script('''
        currentTab='home';currentFilter=null;historyFilter='allTime';displayCurrency='RUB';startBalanceRub=100;
        transactions=Array.from({length:arguments[1]},(_,i)=>({id:'row'+i,type:i%2?'income':'expense',category:'Record'+i,amountRub:100+i,date:i<10?today():'2025-01-01',time:'12:00'}));
        applySimpleMode(arguments[0]);renderHome();window.scrollTo(0,0);
      ''',simple,count)
      time.sleep(.25)
    def sizes(selectors):
      return driver.execute_script('''return arguments[0].flatMap(selector=>[...document.querySelectorAll(selector)].map(e=>{
        const r=e.getBoundingClientRect(),s=getComputedStyle(e);return {selector,id:e.id,text:e.textContent.trim().slice(0,35),width:r.width,height:r.height,font:s.fontSize};}));''',selectors)
    # A fresh guest profile exercises the real launch/auth error path without mocks.
    # The floating-button preference must never gate home rendering or launch.
    for simple in [False,True]:
      for stored in [None,'false','true']:
        driver.execute_script("if(arguments[0]===null)localStorage.removeItem('showVoiceBtn');else localStorage.setItem('showVoiceBtn',arguments[0]);applySimpleMode(arguments[1]);renderHome();",stored,simple)
        assert driver.execute_script("const b=document.querySelector('.home-voice-btn');return !b.hidden&&getComputedStyle(b).display!=='none'&&!b.disabled;")
        assert driver.execute_script("return localStorage.getItem('showVoiceBtn')") == stored
        driver.execute_script("renderHome();renderHome();")
        assert driver.execute_script("return document.querySelectorAll('.home-voice-btn:not([hidden])').length") == 1
        click('.home-voice-btn')
        wait_js("document.querySelector('.home-voice-btn').dataset.state==='error'")
        assert driver.execute_script("return BudgetPROVoiceModule.getDiagnostics().error") == 'VOICE_AUTH_REQUIRED'
        assert 'Войдите в облачный аккаунт' in driver.execute_script("return document.querySelector('#voiceOverlay [data-status]').textContent")
        assert driver.execute_script("return !BudgetPROVoiceModule.isActive()&&!document.querySelector('.home-voice-btn').disabled")
        driver.execute_script("document.querySelector('#voiceOverlay [data-cancel]').click();")
        assert driver.execute_script("return localStorage.getItem('showVoiceBtn')") == stored
      for enabled in [False,True,False]:
        driver.execute_script("syncVoiceButtonEnabled(arguments[0]);addVoiceButton();",enabled)
        assert driver.execute_script("const b=document.querySelector('.home-voice-btn');return !b.hidden&&getComputedStyle(b).display!=='none';")
      print('INDEPENDENT VISIBILITY/REAL AUTH ERROR PASS simple=',simple,flush=True)
    driver.execute_script("syncVoiceButtonEnabled(true);addVoiceButton();")
    failures=[]; cases=0
    for width,height in ([(320,640)] if '--quick' in sys.argv else [(320,640),(360,740),(390,844),(412,915)]):
      driver.execute_cdp_cmd('Emulation.setDeviceMetricsOverride',{'width':width,'height':height,'deviceScaleFactor':1,'mobile':True})
      for lang in ['ka','ru','en']:
        for font in ['small','normal','large','xl']:
          for dark in [False,True]:
            for simple in [False,True]:
              result=driver.execute_script(r"""
                currentLang=arguments[0];document.documentElement.lang=currentLang;
                applyFontSize(arguments[1]);applyColorTheme(arguments[2]?'dark':'white');
                applySimpleMode(arguments[3]);renderHome();
                const b=document.querySelector('.home-voice-btn'),r=b.getBoundingClientRect(),label=b.querySelector('.home-voice-label'),l=label.getBoundingClientRect(),orb=b.querySelector('.home-voice-orb').getBoundingClientRect();
                const hero=document.querySelector('.home-overview').getBoundingClientRect(),details=document.querySelector('#homeDetails').getBoundingClientRect();
                const errors=[];if(r.left<0||r.right>innerWidth+.5||b.scrollWidth>b.clientWidth+1)errors.push('button overflow');
                if(r.height<68||r.height>76)errors.push('height '+r.height);
                if(l.left<orb.right||l.right>r.right-8||l.bottom>r.bottom)errors.push('label overlap');
                if(r.top<hero.bottom||r.bottom>details.top)errors.push('order');
                if(getComputedStyle(document.querySelector('#voiceInputBtn')).visibility!=='hidden')errors.push('floating conflict');
                const walker=document.createTreeWalker(label,NodeFilter.SHOW_TEXT);
                while(walker.nextNode())for(const word of walker.currentNode.textContent.matchAll(/\p{L}+/gu)){
                  const range=document.createRange();range.setStart(walker.currentNode,word.index);range.setEnd(walker.currentNode,word.index+word[0].length);
                  const rects=[...range.getClientRects()];if(new Set(rects.map(r=>Math.round(r.top))).size>1)errors.push('split word');
                }
                return {errors,height:r.height,font:getComputedStyle(label).fontSize};
              """,lang,font,dark,simple)
              cases+=1
              if result['errors']: failures.append([width,lang,font,dark,simple,result])
      print('geometry',width,'cases',cases,'failures',len(failures),flush=True)
    assert not failures,failures[:20]
    print('MATRIX PASS',cases,flush=True)
    driver.execute_script("applyFontSize('normal');currentLang='ru';applySimpleMode(false);renderHome();")
    # Test actual session/module and overlay with mocked capture/transport/auth, never a live microphone.
    driver.execute_script(r"""
      window.__realRecorder=VoiceRecorder;window.__realTranscribe=VoiceApiClient.transcribe;window.__realGetAuth=getAuthSession;
      window.__starts=0;window.__closes=0;window.__requests=0;
      window.getAuthSession=()=>({access_token:'browser-test',expires_at:Math.floor(Date.now()/1000)+3600});
      window.VoiceRecorder=class {
        constructor(mode,frame){this.frame=frame;}
        async start(){window.__starts++;if(window.__deny)throw Object.assign(new Error('denied'),{name:'NotAllowedError'});}
        async close(){window.__closes++;}
        async finish(){await this.close();return {wav:new ArrayBuffer(44),metrics:{duration:500}};}
      };
      VoiceApiClient.transcribe=()=>{window.__requests++;return new Promise(resolve=>window.__response=resolve);};
    """)
    for simple,enabled in [(False,False),(False,True),(True,False),(True,True)]:
      driver.execute_script("syncVoiceButtonEnabled(arguments[1]);applySimpleMode(arguments[0]);renderHome();",simple,enabled)
      initial_starts=driver.execute_script("return __starts")
      initial_requests=driver.execute_script("return __requests")
      # Rebinding must not multiply click handlers/subscriptions.
      driver.execute_script("for(let i=0;i<8;i++)bindHomeVoiceButton();document.querySelector('.home-voice-btn').scrollIntoView({block:'center',behavior:'instant'});")
      time.sleep(.25)
      point=driver.execute_script("const r=document.querySelector('.home-voice-btn').getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2};")
      driver.execute_cdp_cmd('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[dict(point,radiusX=1,radiusY=1)]})
      driver.execute_cdp_cmd('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]})
      # Touch itself must launch capture before the extra click events are sent.
      wait_js("document.querySelector('.home-voice-btn').dataset.state==='listening'")
      assert driver.execute_script("return __starts") == initial_starts+1
      driver.execute_script("for(let i=0;i<10;i++)document.querySelector('.home-voice-btn').click();")
      wait_js("document.querySelector('.home-voice-btn').dataset.state==='listening'")
      assert driver.execute_script("return __starts") == initial_starts+1
      assert driver.execute_script("return document.querySelectorAll('#voiceOverlay').length") == 1
      driver.execute_script("document.querySelector('#voiceOverlay [data-stop]').click();")
      wait_js("document.querySelector('.home-voice-btn').dataset.state==='transcribing'")
      assert driver.execute_script("return document.querySelector('.home-voice-btn').disabled")
      driver.execute_script("for(let i=0;i<10;i++)document.querySelector('.home-voice-btn').click();")
      assert driver.execute_script("return __requests") == initial_requests+1
      records_before=driver.execute_script("return JSON.stringify(transactions)")
      driver.execute_script("__response({transcript:'Кофе 8 лари',detectedLanguage:'ru-RU'});")
      wait_js("document.querySelector('.home-voice-btn').dataset.state==='done'")
      wait_js("document.querySelector('#voiceOverlay')===null")
      assert driver.execute_script("return !BudgetPROVoiceModule.isActive()&&!document.querySelector('.home-voice-btn').disabled")
      assert driver.execute_script("return !!document.querySelector('#voiceQuickModal.open,#voiceModal.open')")
      assert driver.execute_script("return JSON.stringify(transactions)") == records_before
      # Save only through the existing explicit confirmation, in a disposable profile.
      if not enabled:
        before_count=driver.execute_script("return getMoneyTransactions().length")
        click('#voiceQuickSave')
        assert driver.execute_script("return getMoneyTransactions().length") == before_count+1
      # Discard the remaining fixture draft without saving.
      driver.execute_script("document.querySelectorAll('.modal-overlay.open,.add-modal-host.open').forEach(e=>closeModal(e.id));")
      driver.execute_script("__deny=true;document.querySelector('.home-voice-btn').click();")
      wait_js("document.querySelector('.home-voice-btn').dataset.state==='error'")
      assert 'Нет разрешения' in driver.execute_script("return document.querySelector('#voiceOverlay [data-status]').textContent")
      assert driver.execute_script("return !document.querySelector('.home-voice-btn').disabled&&!BudgetPROVoiceModule.isActive()")
      driver.execute_script("__deny=false;document.querySelector('#voiceOverlay [data-start]').click();")
      wait_js("document.querySelector('.home-voice-btn').dataset.state==='listening'")
      closed_before=driver.execute_script("return __closes")
      driver.execute_script("document.querySelector('#voiceOverlay [data-cancel]').click();")
      wait_js("document.querySelector('.home-voice-btn').dataset.state==='ready'")
      assert driver.execute_script("return __closes") == closed_before+1
      assert driver.execute_script("return !BudgetPROVoiceModule.isActive()")
      # A transport/server failure uses the same overlay and allows retry/cancel.
      driver.execute_script("document.querySelector('.home-voice-btn').click();")
      wait_js("document.querySelector('.home-voice-btn').dataset.state==='listening'")
      driver.execute_script("VoiceApiClient.transcribe=async()=>{window.__requests++;throw Object.assign(new Error('server'),{code:'STT_NOT_CONFIGURED'});};document.querySelector('#voiceOverlay [data-stop]').click();")
      wait_js("document.querySelector('.home-voice-btn').dataset.state==='error'")
      assert 'Сервер распознавания ещё не настроен' in driver.execute_script("return document.querySelector('#voiceOverlay [data-status]').textContent")
      assert driver.execute_script("return !BudgetPROVoiceModule.isActive()&&!document.querySelector('.home-voice-btn').disabled")
      driver.execute_script("document.querySelector('#voiceOverlay [data-cancel]').click();VoiceApiClient.transcribe=()=>{window.__requests++;return new Promise(resolve=>window.__response=resolve);};")
      assert driver.execute_script("return document.querySelector('.home-voice-btn').dataset.state") == 'ready'
      print('SESSION/TOUCH/PERMISSION/SERVER PASS simple=',simple,'floating=',enabled,flush=True)
    # Visibility settings and existing floating button retain position, work outside home.
    driver.execute_script("localStorage.setItem('voiceBtnPos',JSON.stringify({x:100,y:160}));syncVoiceButtonEnabled(false);")
    assert driver.execute_script("return getComputedStyle(document.querySelector('.home-voice-btn')).display!=='none'")
    driver.execute_script("syncVoiceButtonEnabled(true);setTab('stats');")
    wait_js("document.querySelector('.home-voice-btn')===null")
    assert driver.execute_script("return getComputedStyle(document.querySelector('#voiceInputBtn')).visibility!=='hidden'")
    driver.execute_script("document.querySelector('#voiceInputBtn').click();")
    wait_js("BudgetPROVoiceModule.isActive()")
    driver.execute_script("document.querySelector('#voiceOverlay [data-cancel]').click();renderHome();")
    # Check real CSS wave timing, independent phases, reduced motion and background pause.
    waves=driver.execute_script("const orb=document.querySelector('.home-voice-orb');return ['::before','::after'].map(p=>{const s=getComputedStyle(orb,p);return {duration:s.animationDuration,delay:s.animationDelay,name:s.animationName,iteration:s.animationIterationCount};});")
    assert waves[0]['duration']==waves[1]['duration']=='5s' and waves[0]['delay']!=waves[1]['delay'] and all(w['iteration']=='infinite' for w in waves),waves
    driver.execute_cdp_cmd('Emulation.setEmulatedMedia',{'features':[{'name':'prefers-reduced-motion','value':'reduce'}]})
    assert driver.execute_script("return getComputedStyle(document.querySelector('.home-voice-orb'),'::before').animationName")=='none'
    driver.execute_cdp_cmd('Emulation.setEmulatedMedia',{'features':[{'name':'prefers-reduced-motion','value':'no-preference'}]})
    driver.execute_script("Object.defineProperty(document,'hidden',{configurable:true,value:true});document.dispatchEvent(new Event('visibilitychange'));")
    assert driver.execute_script("return getComputedStyle(document.querySelector('.home-voice-orb'),'::before').animationPlayState")=='paused'
    driver.execute_script("Object.defineProperty(document,'hidden',{configurable:true,value:false});document.dispatchEvent(new Event('visibilitychange'));")
    assert driver.execute_script("return getComputedStyle(document.querySelector('.home-voice-orb'),'::before').animationPlayState")=='running'
    # Wait for the intentional close transition before measuring steady idle DOM.
    wait_js("document.querySelector('#voiceOverlay')===null")
    # Idle animation must not start capture, request speech, or grow the voice DOM.
    before=driver.execute_script("return [__starts,__requests,document.querySelectorAll('.home-voice-btn,.home-voice-btn *,#voiceOverlay,#voiceOverlay *').length];")
    time.sleep(5 if '--quick' in sys.argv else 30)
    after=driver.execute_script("return [__starts,__requests,document.querySelectorAll('.home-voice-btn,.home-voice-btn *,#voiceOverlay,#voiceOverlay *').length];")
    assert before==after,(before,after)
    driver.save_screenshot('/tmp/budgetpro-home-voice.png')
    print('WAVES/REDUCED MOTION/BACKGROUND/IDLE PASS',waves,flush=True)
    errors=[e for e in driver.get_log('browser') if 'Uncaught' in e['message'] or 'SyntaxError' in e['message']]
    assert not errors,errors
    print('ALL HOME VOICE CHECKS PASSED',flush=True)
finally:
    driver.quit();server.shutdown()
