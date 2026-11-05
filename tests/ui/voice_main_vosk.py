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
    driver.execute_script("""
      currentLang='ru';displayCurrency='GEL';exchangeRates.GEL=.03;
      transactions=[{id:'fixture',type:'income',category:'ხელფასი',amountRub:1000,date:today()}];startBalanceRub=1000;
      categories={'ყავა':{subcats:[]},'ტრანსპორტი':{subcats:[]},'Продукты':{subcats:[]}};
      incomeCategories={'ხელფასი':{subcats:[]}};
      window.__beforeFinance=JSON.stringify({transactions,startBalanceRub,categories,incomeCategories});
      window.__writes=0;window.__nativeCalls=0;window.__release=0;window.__mic=0;
      window.saveAll=()=>{__writes++;throw Error('NO_FINANCIAL_WRITES');};
      navigator.mediaDevices.getUserMedia=async()=>{__mic++;throw Error('NO_MICROPHONE_IN_BROWSER_TEST');};
      window.VoiceRecorder=class{constructor(){}async start(){}async close(){}async finish(){return{wav:VoicePCM.wav(new Float32Array(16000)),metrics:{duration:1000}};}};
      window.Capacitor={isNativePlatform:()=>true,getPlatform:()=> 'android',Plugins:{BudgetPROVosk:{
        initialize:async()=>({}),cancel:async()=>({}),release:async()=>{__release++;return{};},
        transcribe:async o=>{__nativeCalls++;return{offline:true,model:o.language==='ru'?'vosk-model-small-ru-0.22':'vosk-model-small-ka-0.42',transcript:__fixtureText};}
      }}};
    """)
    cases=[('ka','ყავაში რვა ლარი გადავიხადე','8.00','ყავა'),('ka','ტაქსიში თორმეტი ლარი გადავიხადე','12.00','ტრანსპორტი'),('ka','ხელფასი ორი ათას ხუთასი ლარი მივიღე','2500.00','ხელფასი'),('ka','ორმოცდაათი თეთრი დავხარჯე','0.50',None),('ka','პურში სამი ლარი და ორმოცდაათი თეთრი გადავიხადე','3.50',None),('ru','Потратил восемь лари на кофе','8.00','ყავა'),('ru','Получил зарплату две тысячи пятьсот лари','2500.00','ხელფასი'),('ru','Потратил пятьдесят тетри','0.50',None),('ru','Потратил три лари и пятьдесят тетри','3.50',None)]
    results=[]
    def run(lang,text):
      driver.execute_script('BudgetPROVoiceModule.setLanguage(arguments[0]);window.__fixtureText=arguments[1];window.__run=startVoiceSession();',lang,text)
      WebDriverWait(driver,5).until(lambda d:d.execute_script("return BudgetPROVoiceModule.getDiagnostics()?.captureStatus==='ready'"))
      driver.execute_script('BudgetPROVoiceModule.stop();BudgetPROVoiceModule.stop();')
      WebDriverWait(driver,5).until(lambda d:d.execute_script('return !BudgetPROVoiceModule.isActive()'))
    for lang,text,amount,category in cases:
      run(lang,text)
      WebDriverWait(driver,5).until(lambda d:d.find_elements('id','voiceQuickAmount'))
      result=driver.execute_script("return{amount:document.getElementById('voiceQuickAmount').value,summary:document.getElementById('voiceQuickChipRow').textContent};")
      assert result['amount']==amount,(text,result)
      if category:assert category in result['summary'],(text,result)
      results.append({'language':lang,'textFixture':text,**result})
      driver.execute_script("closeModal('voiceQuickModal');")
      WebDriverWait(driver,5).until(lambda d:not d.find_elements('id','voiceQuickAmount'))
    # Safety refusals use the real main parseVoiceInput, not a separate parser implementation.
    for lang,text in [('ka','ყავაში რვა ლარი და ტაქსიში თორმეტი ლარი გადავიხადე'),('ru','Потратил восемь долларов на кофе')]:
      run(lang,text)
      assert not driver.find_elements('id','voiceQuickAmount'),text
    summary=driver.execute_script("return{nativeCalls:__nativeCalls,releases:__release,microphoneCalls:__mic,writes:__writes,financeUnchanged:__beforeFinance===JSON.stringify({transactions,startBalanceRub,categories,incomeCategories})};")
    assert summary['nativeCalls']==11 and summary['releases']==11 and summary['microphoneCalls']==0 and summary['writes']==0 and summary['financeUnchanged'],summary
    print(json.dumps({'kind':'MOCK_ASR_REAL_MAIN_DOM_AND_PARSER','cases':results,'summary':summary},ensure_ascii=False,indent=2),flush=True)
finally:
    driver.quit();server.shutdown()
