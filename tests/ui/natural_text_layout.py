"""Browser regression: python3 tests/ui/natural_text_layout.py.
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
    # Keep the large geometry matrix independent of decorative animation frame timing.
    driver.execute_cdp_cmd('Emulation.setEmulatedMedia', {'features': [{'name':'prefers-reduced-motion','value':'reduce'}]})
    # Inspect individual words with DOM Ranges, not just element scrollWidth.
    driver.execute_script(r"""
      window.checkNaturalWords = selector => [...document.querySelectorAll(selector)].flatMap(element => {
        const failures=[],walker=document.createTreeWalker(element,NodeFilter.SHOW_TEXT);
        while(walker.nextNode()) {
          const node=walker.currentNode;
          for(const match of node.textContent.matchAll(/\p{L}+/gu)) {
            const range=document.createRange();range.setStart(node,match.index);range.setEnd(node,match.index+match[0].length);
            const rects=[...range.getClientRects()].filter(r=>r.width>0 && r.height>0);
            const tops=new Set(rects.map(r=>Math.round(r.top)));
            if(tops.size>1)failures.push({word:match[0],tops:[...tops],class:element.className});
          }
        }
        return failures;
      });
    """)
    # --quick retains every language and font at the narrowest screen.
    screens=[(320,640)] if '--quick' in sys.argv else [(320,640),(360,740),(390,844),(412,915)]
    checked=0
    for width,height in screens:
      driver.execute_cdp_cmd('Emulation.setDeviceMetricsOverride',{'width':width,'height':height,'deviceScaleFactor':1,'mobile':True})
      for simple in [False,True]:
        for theme in ['dark','white']:
          for lang in ['ka','ru','en']:
            for font in ['small','normal','large','xl']:
              context=(width,simple,theme,lang,font)
              driver.execute_script('applyColorTheme(arguments[0]);currentLang=arguments[1];document.documentElement.lang=arguments[1];applyTranslations();applyFontSize(arguments[2]);homeOperationsExpanded=false;document.documentElement.style.setProperty("--safe-bottom","24px");',theme,lang,font)
              prepare(simple,20)
              driver.execute_script('transactions.forEach((tx,i)=>{tx.category=["კომუნალურები","Очень длинное название категории","Long category name with several words"][i%3];tx.subcategory="სამარშრუტო მიკროავტობუსი";});renderHome();')
              time.sleep(.03)
              for expanded in [False,True]:
                if expanded:
                  driver.execute_script('document.getElementById("homeOpsToggleBtn").click()');time.sleep(.02)
                assert driver.execute_script('return document.querySelectorAll(".op-card,.sm-op-row").length')==(20 if expanded else 3),context
                errors=driver.execute_script('return checkNaturalWords("#homeOpsItems .op-category, #homeOpsItems .sm-op-name, #homeOpsItems .op-time, #homeOpsItems .sm-op-date")')
                assert not errors,(context,errors)
                assert driver.execute_script("""return [...document.querySelectorAll('.op-category,.sm-op-name')].filter(e=>e.textContent.startsWith('კომუნალურები')).every(e=>{const w=document.createTreeWalker(e,NodeFilter.SHOW_TEXT);while(w.nextNode()){const n=w.currentNode,p=n.textContent.indexOf('კომუნალურები');if(p<0)continue;const r=document.createRange();r.setStart(n,p);r.setEnd(n,p+'კომუნალურები'.length);const a=r.getBoundingClientRect(),b=e.getBoundingClientRect();return a.left>=b.left-1&&a.right<=b.right+1;}return false;})"""),context
                assert driver.execute_script("return [...document.querySelectorAll('.op-category,.sm-op-name')].every(e=>getComputedStyle(e).overflowWrap==='normal')"),context
                assert driver.execute_script("return [...document.querySelectorAll('.op-amount,.sm-op-amount')].every(e=>e.scrollWidth<=e.clientWidth+1)"),context
              assert driver.execute_script('return document.documentElement.scrollWidth')<=width,context
              nav='#simpleNav' if simple else '#mainNav'
              assert driver.execute_script("return [...document.querySelectorAll(arguments[0]+' .nav-caption,'+arguments[0]+' .nav-simple-lbl')].every(e=>getComputedStyle(e).whiteSpace==='nowrap'&&e.title===e.textContent&&e.closest('button').getAttribute('aria-label')===e.textContent)",nav),context
              assert driver.execute_script("const n=document.querySelector(arguments[0]),r=n.getBoundingClientRect(),a=[...n.querySelectorAll('.nav-btn')].map(e=>e.getBoundingClientRect());return a.every((x,i)=>x.left>=r.left-1&&x.right<=r.right+1&&(!i||a[i-1].right<=x.left+1));",nav),context
              assert driver.execute_script("return document.querySelector(arguments[0]+' .nav-fab-btn').getBoundingClientRect().width",nav)==72,context
              driver.execute_script('document.querySelector("#homeDetails > summary").click()');time.sleep(.02)
              assert not driver.execute_script('return checkNaturalWords("#homeDetails > summary")'),context
              driver.execute_script('showFullHistory()');time.sleep(.02)
              assert not driver.execute_script('return checkNaturalWords("#fullHistoryModal .history-item-cat, #fullHistoryModal .history-item-meta")'),context
              assert driver.execute_script("return [...document.querySelectorAll('#fullHistoryModal .icon-btn')].every(e=>e.getBoundingClientRect().width>=44)"),context
              driver.execute_script('closeModal("fullHistoryModal")');time.sleep(.02)
              driver.execute_script('currentTab="settings";openSettingsAppearance()')
              assert driver.execute_script('return document.querySelectorAll(".appearance-font-option").length')==4,context
              assert not driver.execute_script('return document.querySelector(".appearance-font-grid").textContent.includes("fontX")'),context
              assert not driver.execute_script('return checkNaturalWords(".appearance-font-option, .appearance-card-desc, .appearance-card-kicker, .appearance-chip-title")'),context
              assert driver.execute_script("return [...document.querySelectorAll('.appearance-font-option')].every(e=>{const a=e.querySelector('.appearance-font-letter').getBoundingClientRect(),b=e.querySelector('.appearance-font-name').getBoundingClientRect();return a.right<=b.left+1&&e.title===e.getAttribute('aria-label');})"),context
              assert driver.execute_script("const a=[...document.querySelectorAll('.appearance-font-option')].map(e=>e.getBoundingClientRect().height);return Math.max(...a)-Math.min(...a)<1"),context
              assert driver.execute_script('return document.documentElement.scrollWidth')<=width,context
              checked+=1
              if checked%24==0:print('TEXT LAYOUT CASES',checked,flush=True)
    # Exercise the actual setting handlers and the unchanged localStorage key.
    for size in ['small','normal','large','xl']:
      driver.execute_script('document.querySelector(arguments[0]).click()',f'.appearance-font-option[data-size="{size}"]')
      assert driver.execute_script('return localStorage.getItem("fontSize")')==size
      assert driver.execute_script('return fontSize')==size
      assert driver.execute_script('return document.querySelector(arguments[0]).classList.contains("active")',f'.appearance-font-option[data-size="{size}"]')
    # Long numeric values must remain complete after reallocating the title row.
    for width,height in screens:
      driver.execute_cdp_cmd('Emulation.setDeviceMetricsOverride',{'width':width,'height':height,'deviceScaleFactor':1,'mobile':True})
      for simple in [False,True]:
        for font in ['small','normal','large','xl']:
          driver.execute_script('applyFontSize(arguments[0]);homeOperationsExpanded=false;',font)
          prepare(simple,3)
          driver.execute_script('transactions[0].amountRub=123456789012345.67;renderHome()')
          assert driver.execute_script("return [...document.querySelectorAll('.op-amount,.sm-op-amount')].every(e=>e.scrollWidth<=e.clientWidth+1)")
          driver.execute_script('showFullHistory()');time.sleep(.02)
          assert driver.execute_script("return [...document.querySelectorAll('#fullHistoryModal .history-item-amt')].every(e=>e.scrollWidth<=e.clientWidth+1)")
          driver.execute_script('closeModal("fullHistoryModal")');time.sleep(.02)
    print('LONG AMOUNTS PASS',len(screens)*8,flush=True)
    # Also exercise the unchanged expand/collapse behavior with normal motion.
    driver.execute_cdp_cmd('Emulation.setEmulatedMedia', {'features': []})
    for simple in [False,True]:
      for theme in ['dark','white']:
        driver.execute_script('applyFontSize("normal");applyColorTheme(arguments[0]);homeOperationsExpanded=false;',theme)
        prepare(simple,20)
        for selector in ['#homeDetails > summary','#homeOpsToggleBtn']:
          for _ in range(2):
            driver.execute_script('document.querySelector(arguments[0]).click()',selector);time.sleep(.32)
        assert driver.execute_script('return !homeOperationsExpanded&&!document.getElementById("homeDetails").open')
    errors=[x for x in driver.get_log('browser') if x['level']=='SEVERE' and ('Uncaught' in x['message'] or 'SyntaxError' in x['message'])]
    assert not errors,errors
    print('PASS: natural word boundaries, all text sizes, translations, navigation, 3/20 rows and history;',checked,'cases',flush=True)
except Exception:
    driver.save_screenshot('/tmp/budgetpro-natural-text-failure.png')
    raise
finally:
    driver.quit();server.shutdown()
