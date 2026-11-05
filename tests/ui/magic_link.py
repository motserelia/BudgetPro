"""Magic Link form regression: python3 tests/ui/magic_link.py.
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
    driver.execute_script("window.__realFetch=fetch;window.__mailCalls=0;window.fetch=(url,options)=>String(url).includes('/auth/magic-link')?(window.__mailCalls++,new Promise(resolve=>window.__mailResponse=resolve)):__realFetch(url,options);")
    cases=0
    for lang in ['ru','ka','en']:
      for status,code in [(503,'AUTH_CONFIG_ERROR'),(403,'AUTH_RECIPIENT_NOT_ALLOWED'),(500,'AUTH_EMAIL_DELIVERY_FAILED'),(503,'AUTH_SERVER_UNAVAILABLE'),(429,'AUTH_RATE_LIMITED'),(200,None),(200,'invalid-json')]:
        driver.execute_script("currentLang=arguments[0];clearAuthResendTimer();setMagicLinkResendUntil(0);localStorage.removeItem(AUTH_PENDING_EMAIL_KEY);showAuthScreen('test');document.querySelector('#authEmailInput').value='test@example.com';",lang)
        previous=driver.execute_script("return __mailCalls")
        driver.execute_script("for(let i=0;i<10;i++)document.querySelector('#authSendBtn').click();")
        assert driver.execute_script("return __mailCalls")==previous+1
        assert driver.execute_script("return document.querySelector('#authSendBtn').disabled")
        driver.execute_script("__mailResponse({status:arguments[0],ok:arguments[0]===200,json:async()=>arguments[1]==='invalid-json'?null:arguments[1]?{ok:false,error:arguments[1],retryAfter:60}:{ok:true}});",status,code)
        wait_js("!window.__magicLinkSending")
        if code is None:
          assert driver.execute_script("return localStorage.getItem(AUTH_PENDING_EMAIL_KEY)")=='test@example.com'
          assert driver.execute_script("return !document.querySelector('#authErrorText').textContent")
        else:
          assert driver.execute_script("return document.querySelector('#authErrorText').textContent")
          assert driver.execute_script("return !localStorage.getItem(AUTH_PENDING_EMAIL_KEY)")
        if status==429:
          assert driver.execute_script("return document.querySelector('#authSendBtn').disabled&&getMagicLinkResendRemainingMs()>0")
        elif status!=200 or code:
          assert driver.execute_script("return !document.querySelector('#authSendBtn').disabled")
        cases+=1
    print('MAGIC LINK FORM PASS',cases,'localized response cases; pending buttons and duplicate clicks',flush=True)
    # Persist only synthetic auth fixtures, then reload the isolated browser profile.
    driver.execute_script("clearAuthResendTimer();document.querySelector('#authScreen').remove();const payload=btoa(JSON.stringify({sub:'fixture-user',email:'fixture@example.com'}));pendingAppUrlAuthHash='#access_token=fixture.'+payload+'.fixture&refresh_token=fixture-refresh&expires_in=3600';")
    assert driver.execute_async_script("handleAuthCallback().then(arguments[0]);")
    driver.refresh()
    WebDriverWait(driver,10).until(lambda d:d.execute_script('return typeof getAuthSession==="function"'))
    assert driver.execute_script("const s=getAuthSession('fixture');return !!s?.access_token&&!!s?.refresh_token&&s.authUserId==='fixture-user';")
    print('CALLBACK SAVE AND BROWSER RESTART RESTORE PASS (synthetic session)',flush=True)
finally:
    driver.quit();server.shutdown()
