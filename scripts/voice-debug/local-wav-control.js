'use strict';
// Operator-only USB/CDP tool. Never bundled into APK. Never starts a microphone.
const fs = require('node:fs'), path = require('node:path'), os = require('node:os'), crypto = require('node:crypto'), { spawn } = require('node:child_process');
const { evaluate } = require('/tmp/budgetpro-phone-cdp');
async function main() {
  const [action, permission, ...extra] = process.argv.slice(2);
  if (!['prepare', 'status', 'arm', 'export', 'discard'].includes(action) || extra.length || (permission && permission !== '--confirm-audio-permission')) throw Error('INVALID_ARGUMENT');
  if (['arm', 'export'].includes(action) && permission !== '--confirm-audio-permission') throw Error('EXPLICIT_AUDIO_PERMISSION_REQUIRED');
  if (action === 'prepare') {
    const source = fs.readFileSync(path.join(__dirname, 'local-wav-capture.js'), 'utf8');
    const status = await evaluate(source + '\n;window.BudgetPROLocalWavCapture.status()');
    if (status?.protocolVersion !== 3 || status?.buildRevision !== 4 || !status.installed) throw Error('LOCAL_V3_DEBUG_REQUIRED');
    console.log(JSON.stringify(status)); return;
  }
  if (['arm', 'export'].includes(action)) {
    const safe = await evaluate('window.BudgetPROVoiceDebug?.buildRevision === 4 && window.BudgetPROVoiceDebug.guardReady && window.BudgetPROLocalWavCapture?.status().buildRevision === 4');
    if (!safe) throw Error('LOCAL_V4_DEBUG_REQUIRED');
  }
  if (action !== 'export') {
    const method = { status: 'status', arm: 'arm', discard: 'discard' }[action];
    const status = await evaluate(`(()=>{const c=window.BudgetPROLocalWavCapture;if(!c)throw Error('LOCAL_CAPTURE_NOT_PREPARED');c.${method}();return c.status();})()`);
    console.log(JSON.stringify(status)); return;
  }
  const meta = await evaluate('window.BudgetPROLocalWavCapture.claimExport()');
  if (!Number.isInteger(meta.bytes) || meta.bytes < 44 || meta.bytes > 960044 || !/^[a-f0-9]{64}$/.test(meta.sha256)) throw Error('LOCAL_EXPORT_INVALID');
  const chunks = [];
  for (let offset = 0; offset < meta.bytes; offset += 32768) {
    const b64 = await evaluate(`window.BudgetPROLocalWavCapture.readChunk(${offset},32768)`);
    chunks.push(Buffer.from(b64, 'base64'));
  }
  const wav = Buffer.concat(chunks);
  if (wav.length !== meta.bytes || crypto.createHash('sha256').update(wav).digest('hex') !== meta.sha256) throw Error('LOCAL_EXPORT_HASH_MISMATCH');
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'budgetpro-vosk-capture-')); fs.chmodSync(directory, 0o700);
  const file = path.join(directory, 'sample.wav');
  try {
  // Independent TTL cleanup even if the operator's session ends unexpectedly.
  const child = spawn('python3', ['-c', 'import time,pathlib; time.sleep(1800); pathlib.Path(__import__("sys").argv[1]).unlink(missing_ok=True)', file], { detached: true, stdio: 'ignore' });
  await new Promise((resolve, reject) => { child.once('spawn', resolve); child.once('error', reject); }); child.unref();
  fs.writeFileSync(file, wav, { mode: 0o600, flag: 'wx' });
  fs.writeFileSync(path.join(directory, 'capture.json'), JSON.stringify({ ...meta, privateTemporaryAudio: true, deleteBy: Date.now() + 1800000 }, null, 2), { mode: 0o600, flag: 'wx' });
  await evaluate('window.BudgetPROLocalWavCapture.discard()');
  console.log(JSON.stringify({ exported: true, path: file, bytes: meta.bytes, sha256: meta.sha256, ttlSeconds: 1800 }));
  } catch (error) {
    fs.rmSync(file, { force: true });
    throw error;
  } finally { wav.fill(0); chunks.forEach(chunk => chunk.fill(0)); }
}
main().catch(() => { console.log(JSON.stringify({ ok: false, error: 'LOCAL_CAPTURE_CONTROL_FAILED' })); process.exitCode = 1; });
