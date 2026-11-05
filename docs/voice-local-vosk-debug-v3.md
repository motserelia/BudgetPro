> Historical v3 notes. The outer saveAll wrapper gap is addressed by [v4 financial isolation](voice-local-vosk-debug-v4.md). Do not arm the installed v3 build for another recording.

# Local-only Vosk debug APK, protocol 3

Prepared 2026-11-03. No Production, ENV, deployment, financial model, app theme,
main Android tree, real audio or user operations changed. This is a restricted
capture-only test build, not a build for ordinary financial use.

## Completion and safety

The earlier v2 hook used voice.cancel() for successful capture. index.js treated
that result as user cancellation and closed the overlay. Desktop reproduction
proved a later tap could then hit an underlying operation. The historical
Android gesture remains unconfirmed; v3 does not claim to reconstruct it.

prepare-android.py --local-vosk makes a fresh private /tmp tree. Only this APK
loads local-finance-guard.js before app scripts and substitutes local-voice-session.js
for the ordinary voice-session.js. Original www files remain unchanged.
local-wav-capture.js is bundled, rather than depending on a volatile CDP injection.

State flow: READY -> RECORDING -> CAPTURE_COMPLETE, or CANCELLED / ERROR.
A successful local response has no transcript and is never sent to the financial
parser. It resolves localCaptureComplete, not cancelled. No voice.cancel() is
called for success. The existing overlay stays open and hit-tests normally.
Only its existing diagnostic text changes; colors/layout/themes are untouched.
The user may explicitly exit with its existing Cancel button. Capture-phase
financial guards remain active after exit, including during fade-out.

Before every start and again after auth, the session checks the armed one-shot
capture and handler identity, the v3 session identity, and complete financial
guard initialization. Missing, replaced, locked or used handlers cannot request
the microphone and cannot fall back to the regular voice API. The slot is
consumed before microphone setup. Stop/VAD races and repeated Stop cannot run a
second finish. Cancelling during async setup/digest cannot resurrect audio.

## Financial boundaries

- Existing microphone/voice-overlay controls only are interactive. Capture-phase
  pointer/touch/click/keyboard/form guards stop background operation cards,
  Save/Delete/confirmation and other non-voice actions before app listeners.
- In the staged index.js, 22 named financial entry points return before their
  actual bodies, including openEditModal/openAddModal, saveVoiceDraftTransaction,
  safeDeleteOp, saveAll/saveProfileData, normalizers, recurring application,
  imports and backup loading/saving. Normal source functions are unchanged.
- Non-auth Storage writes, removeItem and clear are blocked, including automatic
  startup saves. Existing values remain readable. Auth session/pending-email/
  resend keys keep their original lifecycle.
- IndexedDB write transactions and deleteDatabase are blocked. Backup restore
  functions cannot apply data. No original data is cleared or migrated.
- Fetch/XHR reject STT and backup APIs. Only canonical HTTPS auth calls and local
  GET assets pass. sendBeacon is blocked. Native cleartext and mixed content
  are disabled in this local-only APK; no HTTP relay is needed or used.
- These controls protect this isolated test workflow, not against arbitrary
  hostile code/debugger access. The APK must not be used as a normal finance app.

The RAM-only debug event history retains up to 100 structural events, with no
record values, text, credentials or audio; repeated PCM UI states do not flood
it. Normal VoiceDiagnostics retains ten attempts and recorder/PCM/VAD timings.

## WAV and transport

The unchanged recorder supplies PCM16 mono 16000 Hz WAV. The hook validates
canonical header lengths, PCM format, channel/rate/bits, even byte count,
0.22–30 second duration and maximum 960044 bytes. It stores an exact copy and
SHA-256 in WebView RAM for at most ten minutes. Export/inspection checks expiry
as well as a timer. No file or recording starts automatically.

The operator controls the existing debuggable WebView over USB/ADB CDP, using a
temporary loopback-only ADB forward. No public URL, relay, Groq/Google/Vercel
upload, API key or bypass secret is used. local-wav-control.js requires explicit
permission flags for arming/export and only accepts protocol 3.

After separate owner permission, manual recording is exported once to
/tmp/budgetpro-vosk-capture-*/sample.wav, directory 0700/file 0600. SHA-256 is
checked before writing. An independent cleanup process is started before the
file write, removes audio within thirty minutes, and export failure removes it.
Comparison runs the unchanged downloaded Small/Large models in separate local
processes on the same hash; raw transcripts feed the existing number normalizer
and buildVoiceDraftFromText, never parseVoiceInput/save. The comparison removes
the WAV in finally; only diagnostics remain. Display currency is reported
separately because this parser does not independently populate currency.

## Operator steps (not authorization to record/install)

1. Run Node/browser/Python tests. Prepare with:
   python3 scripts/voice-debug/prepare-android.py --local-vosk
2. Build only the generated tree with existing JDK21, Gradle --offline:
   ./gradlew :app:assembleDebug --offline --no-daemon
3. Run verify-apk.py and check-device.py. Obtain explicit installation permission
   and verify live device package, signer and non-downgrade version first.
   Never uninstall or clear data.
4. After separately approved installation, check v3 native runtime and data/session
   preservation, without microphone. Missing readiness stops the test.
5. With separate permission for one recording/export/inference, use
   local-wav-control.js status, then arm --confirm-audio-permission. The user
   manually records once after Listening. No recorder start via script.
6. Export promptly with export --confirm-audio-permission, then run
   compare-vosk-georgian.js --audio PRIVATE_PATH --confirm-audio-permission.
   Save diagnostics, confirm identical WAV hashes and deletion. No retries/save.

## Validation and remaining physical checks

Node tests cover state separation, no successful cancel, no parser/network,
one-shot export and hash, malformed WAV, missing/replaced hook/session/guards,
auth missing, recorder readiness and Cancel during digest. Financial tests
exercise actual guarded function bodies and Storage/IDB boundaries on fixtures.
Desktop Chromium uses the actual VoiceUI, startVoiceSession, local session and
capture, a mock native-origin adapter and a synthetic recorder: successful capture
keeps the overlay; background clicks and actual financial entry functions are
blocked; storage stays unchanged; explicit exit remains protected; missing hook
cannot start the microphone. No real microphone or STT is used.

Existing recorder tests check initial PCM/pre-roll and readiness with mocks.
Real microphone behavior, beginning-of-speech preservation, Android touch
routing, Supabase restoration after installing this APK and actual Vosk quality
remain unconfirmed until a separately authorized physical test. The unrelated
known standalone-tetri parser bug remains unchanged and marked TODO.
