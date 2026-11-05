"""Voice recording window regression: python3 tests/ui/voice_recording_window.py.
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
options.add_argument('--autoplay-policy=no-user-gesture-required')
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
    driver.execute_script("window.__realRecorder=VoiceRecorder;window.__realGetUserMedia=navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);window.getAuthSession=()=>({access_token:'test',expires_at:Math.floor(Date.now()/1000)+3600});window.VoiceRecorder=class{constructor(mode,frame){window.__frame=frame;}async start(){}async close(){}async finish(){return{wav:new ArrayBuffer(44),metrics:{}};}};VoiceApiClient.transcribe=()=>new Promise(()=>{});")
    driver.execute_cdp_cmd('Emulation.setEmulatedMedia',{'features':[{'name':'prefers-reduced-motion','value':'reduce'}]})
    count=0
    for width,height in [(320,640),(360,740),(390,844),(412,915)]:
      driver.execute_cdp_cmd('Emulation.setDeviceMetricsOverride',{'width':width,'height':height,'deviceScaleFactor':1,'mobile':True})
      for simple in [False,True]:
        for theme in ['white','dark']:
          for lang in ['ru','ka','en']:
            for font in ['normal','xl']:
              driver.execute_script("applyColorTheme(arguments[0]);currentLang=arguments[1];applyFontSize(arguments[2]);applySimpleMode(arguments[3]);renderHome();document.querySelector('.home-voice-btn').click();",theme,lang,font,simple)
              wait_js("document.querySelector('.voice-v2-panel')?.dataset.state==='listening'")
              errors=driver.execute_script("const p=document.querySelector('#voiceOverlay .voice-v2-panel'),r=p.getBoundingClientRect();return[r.left<0,r.right>innerWidth+1,r.top<0,r.bottom>innerHeight+1,p.scrollWidth>p.clientWidth+1,...[...p.querySelectorAll('button:not([hidden])')].map(b=>b.getBoundingClientRect().height<44||b.scrollWidth>b.clientWidth+1)];")
              assert not any(errors),(width,simple,theme,lang,font,errors)
              driver.execute_script("__frame({rms:.16,peak:.6,speech:true,elapsed:500});")
              assert driver.execute_script("return document.querySelector('.voice-v2-audiogram span:last-child').style.transform")!='scaleY(0.06)'
              driver.execute_script("for(let i=0;i<16;i++)__frame({rms:0,peak:0,speech:false,elapsed:600});")
              assert driver.execute_script("return [...document.querySelectorAll('.voice-v2-audiogram span')].every(b=>b.style.transform==='scaleY(0.06)')")
              driver.execute_script("document.querySelector('#voiceOverlay [data-cancel]').click();")
              wait_js("document.querySelector('#voiceOverlay')===null")
              count+=1
      print('VOICE WINDOW GEOMETRY/SOUND/SILENCE',width,'cases',count,flush=True)
    # Exercise the real recorder + AudioWorklet using one synthetic Web Audio stream.
    # This is NOT a physical microphone or a live Google STT test.
    driver.execute_script("window.VoiceRecorder=__realRecorder;window.__audio=new AudioContext();window.__osc=__audio.createOscillator();window.__gain=__audio.createGain();window.__dest=__audio.createMediaStreamDestination();__gain.gain.value=.08;__osc.connect(__gain);__gain.connect(__dest);__osc.start();__audio.resume();window.__captures=0;navigator.mediaDevices.getUserMedia=async()=>{__captures++;return __dest.stream;};currentLang='ru';renderHome();")
    click('.home-voice-btn')
    wait_js("document.querySelector('.voice-v2-panel')?.dataset.state==='listening'||document.querySelector('.voice-v2-panel')?.dataset.state==='speech'")
    wait_js("Number(document.querySelector('.voice-v2-panel').style.getPropertyValue('--voice-level'))>0.1")
    driver.save_screenshot('/tmp/budgetpro-voice-recording-window.png')
    driver.execute_script("__gain.gain.value=0;")
    wait_js("[...document.querySelectorAll('.voice-v2-audiogram span')].every(b=>b.style.transform==='scaleY(0.06)')")
    assert driver.execute_script("return __captures")==1
    driver.execute_script("document.querySelector('#voiceOverlay [data-cancel]').click();")
    wait_js("document.querySelector('#voiceOverlay')===null")
    assert driver.execute_script("return __dest.stream.getTracks().every(t=>t.readyState==='ended')")
    driver.execute_script("__osc.stop();__audio.close();navigator.mediaDevices.getUserMedia=__realGetUserMedia;window.getAuthSession=()=>null;renderHome();document.querySelector('.home-voice-btn').click();")
    wait_js("document.querySelector('.voice-v2-panel')?.dataset.state==='error'")
    assert driver.execute_script("return document.querySelector('#voiceOverlay [data-stop]').hidden&&document.querySelector('#voiceOverlay [data-start]').hidden&&!document.querySelector('#voiceOverlay [data-login]').hidden")
    click('#voiceOverlay [data-login]')
    wait_js("document.querySelector('#authScreen')!==null&&document.querySelector('#voiceOverlay')===null")
    print('REAL PCM/AUDIOWORKLET SYNTHETIC SIGNAL + CLEANUP + LOGIN PASS',flush=True)
    errors=[e for e in driver.get_log('browser') if 'Uncaught' in e['message'] or 'SyntaxError' in e['message']]
    assert not errors,errors
finally:
    driver.quit();server.shutdown()
