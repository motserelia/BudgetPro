> Historical v1/v2 preparation notes below. Current capture-only APK and operator procedure: [voice-local-vosk-debug-v3.md](voice-local-vosk-debug-v3.md). Do not use a v1/v2 hook for another recording. Protocol 3 requires the new isolated APK and separate installation/recording permission.

# One manual Android WAV, two offline Vosk models

Preparation only. No recording, WAV export or real inference is authorized yet.
Groq/Google, Production, Android assets, app appearance and financial parser are
not changed. Existing Supabase session/save interlocks remain in place.

## Prepared path

1. local-wav-control.js prepare installs local-wav-capture.js into RAM of the
   already installed, idle, native debug WebView using the existing USB/CDP
   helper /tmp/budgetpro-phone-cdp.js. No APK update or app-storage write occurs.
2. The hook replaces only VoiceApiClient.transcribe in memory, with no call to
   the original function/fetch. It is audio-locked by default. The ordinary
   voice session still authenticates before using its existing VoiceRecorder.
3. Only after explicit owner permission, the operator runs arm with
   --confirm-audio-permission. The user then presses the existing microphone,
   waits for Listening, speaks once and presses Stop. No script calls start().
4. Exactly one ka WAV is accepted (PCM16 mono 16000 Hz, 0.22–30 s). The slot is
   consumed before async work. Retry cannot overwrite it. Protocol version 2
   completes the existing session through its cancellation/ready path before
   ending the local transcribe call with LOCAL_WAV_CAPTURED. Therefore the
   session's catch/fail path ignores this internal terminal signal: no fake
   transcript, parser callback or UI server error. Diagnostics mark capture
   complete, request not_sent and ASR/parser not_started. The start wrapper
   blocks later attempts before microphone initialization while locked/used.
   Version 1 raised LOCAL_WAV_CAPTURED while the session was active, causing
   the generic UI server error despite successful local capture.
5. Audio exists in WebView RAM for up to ten minutes, then is zeroed/discarded.
   Access also checks expiry, including when background timers are throttled.
   No file is written by capture/prepare/status/arm. No audio/token is logged.
6. A separately authorized export reads bounded base64 chunks over private
   USB/CDP, verifies SHA-256 and writes exactly one sample.wav under a random
   /tmp/budgetpro-vosk-capture-* directory (0700; file 0600). This is not shared
   Android storage or a public endpoint. The phone buffer is discarded.
7. An independent cleanup process removes that WAV after thirty minutes even
   if the operator session ends. The comparison tool also deletes it in finally
   after comparing or failing. Only its own validated temporary capture is
   eligible for deletion, never an arbitrary user source WAV.

Until permission, only this preparation command may run:

```
/tmp/node-v24.22.2-linux-x64/bin/node scripts/voice-debug/local-wav-control.js prepare
```

After explicit permission to record, retain temporarily and process the WAV:

```
/tmp/node-v24.22.2-linux-x64/bin/node scripts/voice-debug/local-wav-control.js arm --confirm-audio-permission
# User manually records once. No automatic recording command.
/tmp/node-v24.22.2-linux-x64/bin/node scripts/voice-debug/local-wav-control.js export --confirm-audio-permission
# Use the private path returned above:
/tmp/node-v24.22.2-linux-x64/bin/node scripts/voice-debug/compare-vosk-georgian.js --audio /tmp/budgetpro-vosk-capture-XXXXXX/sample.wav --confirm-audio-permission
```

Do not run arm/export/compare in the preparation stage. No listening relay or
adb reverse is required for this local path. Keep the cloud relay stopped and
the reverse removed as another barrier against accidental provider upload.
The hook disappears when the WebView reloads; recheck status before recording.
Do not reload or restore cloud routing as part of an unapproved retry.
Preparing version 2 can replace an expired/empty inactive version 1 hook, but
refuses migration if it is armed, busy or holds audio. Migration is locked and
does not authorize another recording. Reinstalling version 2 preserves its
one-shot budget and any held audio. No APK rebuild is needed for this RAM hook.

## Offline comparison

Uses the existing scripts/voice-debug/vosk-georgian.py with the already downloaded
vosk-model-small-ka-0.42 and vosk-model-ka-0.42 under /tmp/budgetpro-vosk-georgian.
Each model runs in a fresh Python process, sequentially, on the exact same file;
both reports must match the exported WAV SHA-256. No microphone/network/model
download is part of inference. Recognized texts are never manually corrected.

Reports separately record model-load and recognition wall/CPU time, average CPU
as percentage of one core (may exceed 100% for multithreading), and process peak
RSS in KiB including model loading. These are Linux measurements, not Android
benchmarks. Raw transcript is then passed to the real app's number normalizer
and buildVoiceDraftFromText only, through CDP: no parseVoiceInput/save function,
new draft window or financial write. The normalizer output is a separate field.
Currency detection is reported honestly: current draft has no currency field;
spoken ლარი and the app's display currency are distinct observations.

Missing or corrupted numerals remain unknown; no expected answer is inserted.
This one phrase can compare two models on one example, not rank all Georgian
speech or predict phone RAM, latency and battery cost. No results are available
until the owner-authorized recording and offline comparison actually happen.

## Standalone tetri: cause and proposed correction, not implemented

For 50 თეთრი, the existing functions return:

- number normalizer: 50 თეთრი (correct);
- extractVoiceCurrencyPairAmount: null, since its outer loop requires a major
  unit (ლარი etc.) and only checks minor units after that;
- parseVoiceNumberWords: 5, since the minor-unit branch divides values below
  100 by ten instead of consistently dividing tetri by 100;
- extractVoiceAmount: 50, since the bare numeric candidate loses unit semantics
  and outranks the converted candidate in its score-based selection.

Thus changing only a divisor does not fix the final selection. Safe future plan:

1. Introduce unit-aware internal candidates tied to the same numeric token span:
   major, minor, bare. A recognized minor-unit-only span converts by 100.
2. Preserve major+minor totals and prevent a bare candidate for the same span
   overriding the explicit unit conversion. Do not merge unrelated numbers.
3. Unknown/ambiguous numbers remain needs_input. Do not infer amounts from fuzzy
   spelling or from the expected test phrase. Preserve financial storage format.
4. Run the text cases in tests/voice/fixtures/tetri-regression-plan.json, covering
   1/5/10/50/99/100/150 tetri, spelled numbers, lari+tetri, ordinary lari and
   corrupted/missing numerals. Add ambiguity/time/ID and save-guard regressions.
5. Make a separately authorized small parser patch only after these failures
   are reviewed. No financial parser correction is part of this preparation.
