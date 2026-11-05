# Offline Vosk in the main Android app

Android uses `BudgetPROVosk` through `Capacitor.Plugins`. Choose **Русский** or **ქართული** in the existing voice controls. Automatic language detection and English are not provided by these two bundled models. An unsupported selection fails before microphone capture; there is no server fallback on Android. The main Home voice entry and normal repeated recording remain available; floating-button preferences are preserved.

`Voice Test v3` provided the first-PCM readiness and Stop/flush recorder implementation. The main app does not include its one-shot gate, WAV tap, fixture ledger or diagnostic applicationId. The existing web/server adapter and Groq/Google server components are retained.

## Build

SDK dependencies are pinned in `android/app/build.gradle`: Vosk Android 0.3.75, JNA 5.18.1. The app-private `:vosk` service uses a serial background worker, loads one model at a time, checks bundled model file hashes, strips/validates WAV, and feeds PCM16 mono 16 kHz. Confirmed Result segments survive an empty FinalResult. The JS adapter rejects empty/mismatched results, supports cancellation and timeouts, releases native resources and clears its WAV buffer. No auth tokens or financial hints are sent to native STT.

Place the official model ZIPs in a local directory:

- https://alphacephei.com/vosk/models/vosk-model-small-ka-0.42.zip
- https://alphacephei.com/vosk/models/vosk-model-small-ru-0.22.zip

Then run:

```sh
python3 scripts/prepare-vosk-models.py --archives-dir /path/to/model-zips
npx --no-install cap copy android
JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64 android/gradlew -p android :app:assembleDebug :app:testDebugUnitTest
```

The preparation script accepts only the pinned SHA-256 archives. Generated assets are in ignored `.cache/vosk-assets`; no large model binaries are added to Git. Each Android build verifies these assets; recognition never downloads models. License text for this Linux build is copied from `/usr/share/common-licenses/Apache-2.0` and included with notices. Check notices when distributing dependencies on another build platform.

## Financial behavior

The existing normalizer/parser opens an editable voice draft; STT never invokes financial persistence. User confirmation is required. Unknown categories remain unselected and require manual choice, rather than creating a fallback category. Existing Georgian/Russian salary, coffee and transport keys are reused. Russian tetri/kopeck unit names now use the strict 1/100 money parser too. The historical golden fixture is retained, with an explicit test correction for its known `50 копеек → 5` error.

Several independent monetary amounts are rejected with a request to dictate separately; this integration does not implement multiple drafts from one utterance. The form currency must match explicitly spoken currency. Editable voice text is checked again at Save. Negative/ambiguous amounts are not inferred as valid positive operations. Russian cent expressions currently require clarification or an explicit decimal major-unit amount; they are not guessed as GEL. Supabase/account logic and non-voice finance handlers are unchanged.

The native client fails closed when its JS bridge is absent. The voice draft fails closed when its safety module is absent. Normal non-debug diagnostics do not retain transcripts/parser text or WAV exports. Existing isolated debug finance guards remain in the debug infrastructure and their mock regressions are retained; no debug financial guard was disabled on a phone.

## Validation and limits

See `/tmp/budgetpro-vosk-main-integration/REPORT.md` for this integration's evidence. Browser tests use a mock recognizer and synthetic Web Audio, with HTTPS blocked and disposable financial fixtures. The reference-WAV test uses real desktop Vosk with the same production engine/collector classes; it is not an Android benchmark or microphone test. The old Voice Test v3's real Georgian microphone success is preserved as prior evidence, not attributed to the new main APK.

The candidate main APK has not been installed. Before updating a phone, compare its installed certificate/package/version/ABI, take read-only logical financial snapshots, and verify session/data preservation. Do not uninstall, clear storage, downgrade, or run a microphone test without separate authorization. Real RU and KA microphone tests in the new main APK, its exact device memory behavior, and the separate unfinished security review remain necessary before claiming production readiness or safe real financial saving.
