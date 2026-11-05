"""Diagnostic reproduction in a disposable desktop browser, not on the phone.
Uses actual VoiceUI and startVoiceSession with a mocked session cancellation.
No microphone, STT, app storage, financial records or external requests.
This proves the closing/hit-test path, not the historical Android gesture.
"""
import json
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service

ROOT = Path(__file__).resolve().parents[2]
source = (ROOT / 'www/index.js').read_text()
start = source.index('async function startVoiceSession(')
function = source[start:source.index('\nfunction getVoiceDraftLabels(', start)]
options = Options()
options.binary_location = '/usr/bin/chromium'
for flag in ['--headless=new', '--no-sandbox', '--disable-dev-shm-usage',
             '--disable-background-networking', '--no-first-run']:
    options.add_argument(flag)
driver = webdriver.Chrome(service=Service('/usr/bin/chromedriver'), options=options)
try:
    driver.execute_cdp_cmd('Network.enable', {})
    driver.execute_cdp_cmd('Network.setBlockedURLs', {'urls': ['http://*', 'https://*']})
    driver.get('data:text/html,<html><head></head><body></body></html>')
    driver.execute_script('''
      window.counts={editor:0,parser:0,closes:0};
      document.body.innerHTML='<button id="mock-operation" style="position:fixed;inset:0;width:100%;height:100%">Mock operation, no financial data</button>';
      document.querySelector('#mock-operation').onclick=()=>counts.editor++;
      window.currentLang='ru'; window.categories={}; window.incomeCategories={};
      window.haptic=()=>{}; window.parseVoiceInput=()=>counts.parser++;
      window.VoiceDiagnostics={format:()=>'',get:()=>({})};
      window.BudgetPROVoiceModule={
        isActive:()=>false,getLanguage:()=>'ka',
        subscribe(fn){fn({status:'listening',meter:0});return()=>counts.closes++;},
        start:()=>new Promise(resolve=>window.resolveSession=resolve),
        stop(){},cancel(){window.resolveSession({handled:true,cancelled:true});}
      };
    ''')
    driver.execute_script((ROOT / 'www/voice/voice-ui.js').read_text())
    driver.execute_script(function + '\nwindow.sessionResult=startVoiceSession();')
    assert driver.execute_script('return !!document.querySelector("#voiceOverlay")')
    # Same cancelled result returned by the real session when the local hook
    # calls voice.cancel(). Wait microtasks only, inside the 180ms close window.
    result = driver.execute_async_script('''
      const done=arguments[0]; BudgetPROVoiceModule.cancel();
      sessionResult.then(()=>done({
        closing:document.querySelector('#voiceOverlay')?.classList.contains('closing'),
        pointerEvents:getComputedStyle(document.querySelector('#voiceOverlay')).pointerEvents,
        underlyingHit:document.elementFromPoint(8,8)?.id,
        ...counts
      }));
    ''')
    assert result['closing'] is True and result['closes'] == 1, result
    assert result['parser'] == 0 and result['editor'] == 0, result
    assert result['pointerEvents'] == 'none', result
    assert result['underlyingHit'] == 'mock-operation', result
    # A separate subsequent pointer click reaches the underlying mock element.
    for event in ['mousePressed', 'mouseReleased']:
        driver.execute_cdp_cmd('Input.dispatchMouseEvent', {
            'type': event, 'x': 8, 'y': 8, 'button': 'left', 'clickCount': 1})
    assert driver.execute_script('return counts.editor') == 1
    assert driver.execute_script('return counts.parser') == 0
    print(json.dumps({'pass': 3, 'cancelledResultClosesOverlay': True,
                      'noAutomaticEditorOrParserOnCancel': True,
                      'closingOverlayAllowsSubsequentUnderlyingClick': True,
                      'androidHistoricalCauseConfirmed': False,
                      'realMicrophoneOrSTTUsed': False}))
finally:
    driver.quit()
