'use strict';
// Fixed readout through the debug APK's own auth probe. No token/storage extraction.
const { execFile } = require('node:child_process');
const { promisify } = require('node:util');
const run = promisify(execFile);
const adb = async args => (await run('adb', args, { timeout: 20000, maxBuffer: 131072 })).stdout.trim();
async function main() {
  const devices = (await adb(['devices'])).split('\n').slice(1).map(s => s.trim().split(/\s+/)).filter(v => v[1] === 'device');
  if (devices.length !== 1) throw new Error('CONNECT_ONE_AUTHORIZED_DEVICE');
  const args = ['-s', devices[0][0]], pid = (await adb([...args, 'shell', 'pidof', 'pro.budget.app'])).split(/\s+/)[0];
  if (!/^\d+$/.test(pid || '')) throw new Error('APP_NOT_RUNNING');
  const port = await adb([...args, 'forward', 'tcp:0', 'localabstract:webview_devtools_remote_' + pid]);
  if (!/^\d+$/.test(port)) throw new Error('WEBVIEW_DEBUG_PORT_UNAVAILABLE');
  let ws;
  try {
    const response = await fetch('http://127.0.0.1:' + port + '/json', { signal: AbortSignal.timeout(5000), redirect: 'error' });
    const pages = await response.json();
    const page = pages.find(p => { try { return p.type === 'page' && new URL(p.url).origin === 'https://budgetpro.app'; } catch { return false; } });
    if (!page) throw new Error('BUDGETPRO_WEBVIEW_NOT_FOUND');
    const url = new URL(page.webSocketDebuggerUrl);
    if (url.protocol !== 'ws:' || !['localhost','127.0.0.1'].includes(url.hostname) || url.port !== port || url.username || url.password || url.search) throw new Error('DEBUG_URL_DENIED');
    ws = new WebSocket(url);
    const result = await new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('AUTH_PROBE_TIMEOUT')), 35000);
      ws.addEventListener('open', () => ws.send(JSON.stringify({ id: 1, method: 'Runtime.evaluate', params: { expression: '(async()=>{if(!window.BudgetPROVoiceDebug)return {ok:false,error:"DEBUG_BUILD_NOT_INSTALLED"};return await window.BudgetPROVoiceDebug.checkSession();})()', awaitPromise: true, returnByValue: true } })));
      ws.addEventListener('error', () => { clearTimeout(timer); reject(new Error('DEBUG_SOCKET_UNAVAILABLE')); });
      ws.addEventListener('message', e => {
        let data; try { data = JSON.parse(e.data); } catch { return; }
        if (data.id !== 1) return;
        clearTimeout(timer);
        if (data.result?.exceptionDetails || !data.result?.result?.value) reject(new Error('AUTH_PROBE_FAILED'));
        else resolve(data.result.result.value);
      });
    });
    console.log(JSON.stringify({ ok: result.ok === true, error: /^[A-Z_-]{1,64}$/.test(result.error || '') ? result.error : 'AUTH_PROBE_FAILED', httpStatus: Number.isInteger(result.httpStatus) ? result.httpStatus : null, audioSent: false }));
  } finally {
    ws?.close(); await adb([...args, 'forward', '--remove', 'tcp:' + port]).catch(() => {});
  }
}
if (require.main === module) main().catch(e => { const allowed = ['CONNECT_ONE_AUTHORIZED_DEVICE','APP_NOT_RUNNING','WEBVIEW_DEBUG_PORT_UNAVAILABLE','BUDGETPRO_WEBVIEW_NOT_FOUND','DEBUG_URL_DENIED','AUTH_PROBE_TIMEOUT','DEBUG_SOCKET_UNAVAILABLE','AUTH_PROBE_FAILED']; console.log(JSON.stringify({ ok: false, error: allowed.includes(e.message) ? e.message : 'DEVICE_PROBE_UNAVAILABLE', audioSent: false })); process.exitCode = 1; });
