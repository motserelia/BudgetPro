'use strict';
// Operator-only: two offline recognizers, one owned temporary WAV, no recording.
const fs = require('node:fs'), path = require('node:path'), crypto = require('node:crypto'), { promisify } = require('node:util'), { execFile } = require('node:child_process');
const { evaluate } = require('/tmp/budgetpro-phone-cdp');
const run = promisify(execFile), root = '/tmp/budgetpro-vosk-georgian';
async function main() {
  const [flag, fileArg, permission, ...extra] = process.argv.slice(2);
  if (flag !== '--audio' || permission !== '--confirm-audio-permission' || extra.length) throw Error('EXPLICIT_AUDIO_PERMISSION_REQUIRED');
  const file = path.resolve(fileArg), directory = path.dirname(file);
  if (!/^\/tmp\/budgetpro-vosk-capture-[A-Za-z0-9]+\/sample\.wav$/.test(file) || fs.realpathSync(file) !== file || (fs.statSync(file).mode & 0o777) !== 0o600 || (fs.statSync(directory).mode & 0o777) !== 0o700 || fs.statSync(file).uid !== process.getuid()) throw Error('OWNED_PRIVATE_CAPTURE_REQUIRED');
  const meta = JSON.parse(fs.readFileSync(path.join(directory, 'capture.json')));
  const digest = crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
  if (!meta.privateTemporaryAudio || meta.deleteBy < Date.now() || meta.sha256 !== digest) throw Error('CAPTURE_HASH_OR_TTL_INVALID');
  const results = [];
  try {
    for (const name of ['vosk-model-small-ka-0.42', 'vosk-model-ka-0.42']) {
      const reportPath = path.join(directory, name + '.json');
      await run(path.join(root, 'venv/bin/python'), [path.join(__dirname, 'vosk-georgian.py'), '--model', path.join(root, 'models', name), '--audio', file, '--allow-audio-use', '--report', reportPath], { timeout: 180000, maxBuffer: 16384 });
      const result = JSON.parse(fs.readFileSync(reportPath));
      if (!result.recognitionPerformed || result.audioSha256 !== digest) throw Error('MODEL_AUDIO_MISMATCH');
      const transcript = JSON.stringify(result.rawTranscript);
      result.financial = await evaluate(`(()=>{if(!window.BudgetPROVoiceDebug?.saveBlocked)throw Error('DEBUG_REQUIRED');const text=${transcript};const normalized=window.BudgetPROVoiceNumberNormalizer.normalizeNumbers(text,'ka');const draft=buildVoiceDraftFromText(normalized);return {normalizedTranscript:normalized,type:draft.type,amount:draft.amount,category:draft.category,currencyParsed:draft.currency||null,displayCurrency:typeof displayCurrency==='undefined'?null:displayCurrency,spokenLariWord:/(?:^|\\s)ლარი(?:\\s|$|[.!?,])/u.test(text),operationSaved:false};})()`);
      results.push(result);
    }
    fs.writeFileSync(path.join(directory, 'comparison.json'), JSON.stringify({ audioSha256: digest, sameAudio: true, results, cloudRequests: 0, operationSaved: false }, null, 2), { mode: 0o600, flag: 'wx' });
    console.log(JSON.stringify({ ok: true, sameAudio: true, report: path.join(directory, 'comparison.json'), models: results.length, cloudRequests: 0 }));
  } finally {
    // Delete only the owned one-off capture, never an arbitrary user audio file.
    fs.rmSync(file, { force: true });
  }
}
main().catch(() => { console.log(JSON.stringify({ ok: false, error: 'LOCAL_COMPARISON_FAILED' })); process.exitCode = 1; });
