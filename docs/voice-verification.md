# Verification — 1.3.0

Checkpoint: 5217efe, previous version 1.2.0.

## Passed

- npm install (no new runtime packages required; Google OAuth and REST use Node crypto/fetch).
- npm test / npm run voice:test: backend, PCM/VAD, numbers, Unicode validator, session lifecycle. Direct test output also inspected; 31 KA, 35 RU, 36 EN number vectors plus digit-sequence tests.
- Exact chirp_2 request config for ka-GE / ru-RU / en-US / auto, no translation/fallback. Mock Cyrillic in Georgian rejected before parser.
- Session double-start guard, cancel before/during request, AbortController and late response suppression, legacy mode migration.
- Canonical WAV validation, anti-alias resampling preserving 440 Hz and suppressing a 12 kHz alias on 48→16 kHz conversion.
- Backend auth refusal, method/MIME/size/language/mode validation, duplicate IDs, no confidence invention, upstream errors and deadline.
- Chromium: modules load, floating ON/OFF, explicit speech language, saved language and {x,y} position reapplied after reload, light/dark gradients/contrast, offline message and Cancel.
- Chromium gesture handlers via synthetic PointerEvents: dragged {100,80}→{150,90}, click suppression active, no recording start; drop into trash removed button and stored showVoiceBtn=false. Native mouse smoke attempts were obscured by the existing initial-profile dialog, so this evidence is limited to handlers, not a physical touchscreen test.
- Actual Chromium WebAudio/AudioWorklet on a synthetic oscillator signal: source rate 44100; output WAV 16000 Hz, mono, 16 bit, 78062 bytes; VAD speech duration ~1138 ms, endpoint achieved, tracks ended and AudioContext closed. This is a real capture-pipeline test using synthetic sound, not a real microphone/STT test.
- Existing financial draft parser: Georgian coffee 8 lari → amount 8; English coffee 8 lari → 8; Russian taxi 12 lari → 12. No transaction was saved by tests.
- npm run dist:linux created dist/budgetpro_1.3.0_amd64.deb.
- npx cap sync android; Gradle :app:assembleDebug succeeded (Java 21). Offline first attempt lacked five cached standard dependencies; online retry resolved them.
- Production source audit: no Whisper/browser/native recognizer, old download/build/IPC paths removed. Code snapshots preserved only in backup ZIP, outside deployable output. No old recognizer processes found.

## Not verified

- npm run voice:test:api: 42 real-audio cases explicitly SKIP, because Google server credentials and real human WAV fixtures are absent.
- Real Georgian microphone: NOT VERIFIED. Real Russian/English normal/quiet/noise accuracy: NOT VERIFIED.
- Live Vercel deployment, Google project access / Locations API query and speech adaptation effect: NOT VERIFIED.
- Physical Android microphone/permissions/touch gestures and packaged Electron microphone: NOT VERIFIED; Android compile and shared renderer pipeline are verified separately.

The implementation is ready for credential configuration and real acoustic acceptance. It is not evidence of production recognition quality.

## Follow-up integration/config verification — 2026-10-03

This section supersedes the earlier API SKIP status above. Version remains 1.3.0.

- Central API configuration: production Web uses its HTTPS origin plus `/api`; packaged Electron/file origin and native Android use `https://budget-pro-lski.vercel.app/api`. Chromium file-origin diagnostics confirmed the absolute transcribe URL and `authPresent=false`/`VOICE_AUTH_REQUIRED`. Installed Electron login and physical Android were not tested.
- Raw/B64 credentials validation, B64 priority, safe health, startup `STT_NOT_CONFIGURED`, regional REST request and Google error mapping verified with isolated tests. No real service account was available.
- Supabase Bearer transport and server user verification tested with mock responses. Expired-session refresh now re-reads the session after the existing boolean-returning refresh function; regression tests pass for both entry points. Real user login/token acceptance remains unverified.
- Actual local HTTP handler: health 200 / configured=false / no-store; OPTIONS 204; unknown Origin 403 CORS_DENIED; transcribe without Google ENV 503 STT_NOT_CONFIGURED. Service worker bypasses voice API requests.
- Production health returns HTTP 404: the new endpoint has not been deployed. Vercel CLI's existing token is invalid, so redeployment could not be completed.
- `npm test`: 9 test files pass. Direct routing/auth suite: 7 tests pass. Provider/config, acceptance and session tests also inspected directly. These are local/mocked tests, not live Google recognition.
- `npm run voice:test:api` exits 1 with HUMAN_FIXTURES_REQUIRED: realTestsExecuted=0, missingHumanFixtures=42, skippedTests=0. This is a failed preflight, not successful acceptance. Normal unit runs do not exercise real network recognition.
- Real microphone recording attempted using the new utility: MICROPHONE_RECORD_FAILED; `arecord -l` reports no sound cards in this environment. No fake WAV was generated.
- Google project, credentials, Supabase server ENV and user test token absent. Speech API enablement, billing, IAM role and actual recognize permission remain unknown. Required role is roles/speech.client; required permission is speech.recognizers.recognize.
- Intended location: europe-west4; model: chirp_2. Harmless Locations connectivity check cannot prove billing or recognize permission, and was not possible without credentials.
- Georgian/Russian/English human transcripts, script acceptance, CER/WER and acoustic digit recognition: not measured. Local NumberNormalizer tests pass.
- Final Linux .deb and Android debug builds are rebuilt after the auth refresh fix; paths are dist/budgetpro_1.3.0_amd64.deb and android/app/build/outputs/apk/debug/app-debug.apk. Both final builds completed successfully (Linux exit 0; Android BUILD SUCCESSFUL). Packaged Electron app.asar resolves the absolute production HTTPS transcribe URL; 948 packaged text files and 20 APK client text files were scanned with no private-key/service-account markers found. This is a marker audit, not a full Git-history or backup-archive audit.
- No successful-integration checkpoint created because the required human Georgian Google result does not exist. Existing checkpoint 5217efe has not been rolled back to. User data preserved.

Next operator steps: configure Google project/billing/API/service account and server-only ENV, authenticate Vercel and redeploy, verify production health, sign in to BudgetPRO, provide VOICE_TEST_ACCESS_TOKEN privately to the local CLI, record human WAV fixtures, then run smoke/API tests/benchmark per docs/voice-input.md. Create an integration checkpoint only after genuine Georgian acceptance passes.
