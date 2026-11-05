# Local Vosk capture: unexpected existing-operation editor

Diagnostic date: 2026-11-03, Asia/Tbilisi. No real recording, STT, APK install,
app launch, operation button click, financial write or Production change in
this investigation. The only new executable is an isolated browser test.

## Evidence and limits

- ADB device connected. Package pro.budget.app versionCode 4 is installed;
  its SHA-256 matches the previously inspected isolated debug APK.
- At inspection the app process was absent. The WebView's in-memory history,
  injected local capture code and held audio could not be inspected. Do not
  substitute the previous five-attempt history for this new attempt.
- Bounded main/events logcat is readable but lacks relevant local-capture,
  crash and application lifecycle events proving this incident's sequence.
- No temporary capture WAV or same-WAV comparison report was found. This
  operator did not invoke Vosk recognition. Whether this specific recording
  formed a WAV or reached the local hook cannot be reconstructed.
- Relay port 8139 is closed; adb reverse is absent. If the previously verified
  v2 hook remained installed, its transcribe path calls no network API and no
  onTranscript/parser. It is injected in RAM, not bundled into the APK.
  App process loss removes it. No historical packet trace exists; therefore
  absence of cloud upload for the new incident is not independently proven.

## Reproduced code path, not a proven historical Android gesture

1. scripts/voice-debug/local-wav-capture.js calls voice.cancel after retaining
   the valid WAV. The session resolves {handled:true,cancelled:true}.
2. www/index.js startVoiceSession closes the overlay for cancelled results.
3. www/voice/voice-ui.js adds closing, disabling pointer events immediately,
   and removes the overlay after 180ms (0 with reduced motion).
4. A subsequent pointer click reaches the underlying operation card. The
   card's click listener opens openEditModal with its existing transaction
   index. openEditModal reads transactions[idx], not an ASR draft.

tests/ui/local_capture_modal_routing.py uses the actual VoiceUI and actual
startVoiceSession function with a mock cancellation result in disposable
desktop Chromium. Three checks pass: cancellation closes the overlay; no
automatic parser/editor call occurs; a separate subsequent pointer click
reaches a mock underlying card. This does NOT reproduce a same-gesture
Android compatibility click or establish when the reported editor opened.

Stop invokes voice.stop only; Cancel invokes voice.cancel plus overlay close.
The normal successful onTranscript callback closes the overlay and calls
parseVoiceInput; v2 local capture never supplies a transcript. The existing
operation editor can be opened from home/simplified cards and full-history
listeners, including a delayed 200ms opening from full history. No runtime
evidence identifies which listener fired in the reported incident.

The debug bootstrap blocks voice-draft Save controls only. Existing-operation
saveEditBtn/deleteItemBtn are not covered. Opening the editor reads an operation
and changes transient editingOpIndex; persistence occurs in its Save/Delete
handlers. No such actions were performed here. Current stored-data equality
could not be checked without restarting the app; no claim about unobserved
user actions is made.

## Minimal correction plan, not applied

1. In local debug infrastructure, distinguish successful local capture from
   real user cancellation. Map only the captured session's cancellation
   result to an explicit localCaptureComplete result before startVoiceSession
   receives it. Keep the overlay in its existing ready state; never fabricate
   a transcript, call the financial parser, or change app visuals.
2. Preserve ordinary Cancel behavior and one-shot start blocking. Match the
   capture's session ID and diagnostic completion before mapping a result.
3. During a local test, add a debug-only capture-phase action guard for existing
   operation editing and persistence controls (home/history entry, Save/Delete,
   confirmation). Do not change stored data or production handlers.
4. Add bounded RAM-only input/modal timing: event type, time, target role/id,
   isTrusted, pointer ID, overlay present/closing, edit-open call-site category.
   Do not log operation values, text, tokens or audio. Trace the next manual
   attempt only after explicit owner permission.
5. Before any new recording, verify the hook is installed, one-shot budget,
   active guards, ka, stopped relay and no reverse. Process/refresh loss must
   invalidate readiness and require preparation again. Export an authorized
   capture promptly; do not wait beyond its ten-minute RAM lifetime.

## Regression acceptance cases for the future patch

- Successful local Stop and VAD: overlay remains present/interactive, no
  closing class, parser/editor/network counters zero, one WAV held.
- Stop twice and Retry/microphone taps: at most one capture; no second mic.
- Cancel before capture / during digest: no retained audio, no result mapping.
- Double tap across completion, pointerdown before completion with pointerup
  after completion, touch+synthetic click, reduced motion, and delayed history
  callback: existing-operation editor and persistence cannot be triggered.
- Debug write guards reject Save/Delete/confirmation while financial-store
  fingerprint remains unchanged. Tests use disposable records only.
- Normal voice success/cancel outside local capture keeps its existing behavior.
- WebView reload/process loss invalidates readiness; no cloud fallback.
- Same-WAV Small/Large comparison checks SHA-256, retains raw transcripts and
  refuses guessed sums. No recognition/audio upload in regression tests.

No functional patch is applied in this diagnostic task. Fixing the local result
routing and adding guards should precede a further authorized recording.
