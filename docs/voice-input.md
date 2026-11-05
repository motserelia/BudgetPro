> Current development policy: **Groq Free only**. See [Groq implementation and release plan](voice-groq-implementation.md). Google setup below is historical; billing, Google activation and production deployment require separate owner approval. No provider is selected by default.

# BudgetPRO Voice Input 1.3.0 — real integration setup

The existing Recorder/AudioWorklet/PCM/VAD/session architecture is retained. Only Google Speech-to-Text V2 `chirp_2` is used. Fixed RU/EN/KA share one provider; no alternate locale/engine fallback. Previous checkpoint `5217efe` is not a rollback target.

## Public API routing

One public configuration is `www/api-config.js` (`BudgetPROApiConfig.getApiBaseUrl/getApiUrl`). It contains only a public origin, never credentials.

- Production Web: its same-origin `/api`, currently `https://budget-pro-lski.vercel.app/api`.
- Packaged Electron (`file:`): `https://budget-pro-lski.vercel.app/api`.
- Native Android (Capacitor): the same production HTTPS API base. Android's local WebView `https://budgetpro.app` is the **client origin**, not the STT backend.
- Local developer Web: loopback same-origin `/api`. `npm run voice:dev` serves www and routes directly to the actual backend handlers, default `http://127.0.0.1:8130`.

Voice, auth and JSONBin helpers use this configuration. Desktop no longer risks `/api` under `file:`. `voiceApiUrl`, `authPresent` and `httpStatus` appear in memory-only Voice Diagnostics. Tokens do not appear. Google credentials stay in server modules, outside www/desktop/APK/deb.

## Google Cloud setup

1. Create/select a Google Cloud project. Record its **project ID**, not display name or project number.
2. Enable billing on that project.
3. Enable **Cloud Speech-to-Text API**, service `speech.googleapis.com`.
4. Create a runtime service account dedicated to BudgetPRO STT.
5. Grant **Cloud Speech Client**, `roles/speech.client`, on the target project. It includes `speech.recognizers.recognize` and location metadata reads. Owner/Editor/Admin are not necessary. Inspect the IAM binding in Cloud Console; a locally parsed key does not prove the role is granted.
6. Create the service-account JSON credentials (if organizational policy permits keys). Keep the downloaded JSON outside the repository and all client/build directories.
7. Store credentials only server-side. Use either raw `GOOGLE_SERVICE_ACCOUNT_JSON` or preferably base64 JSON in `GOOGLE_SERVICE_ACCOUNT_JSON_B64`. **B64 takes priority whenever nonempty; malformed B64 fails rather than falling back.** Private-key escaped newlines are normalized and the RSA key is parsed before Google calls. Base64 is transport encoding, not encryption; treat it as the same secret.
8. Set Vercel Production environment variables:
   - `GOOGLE_CLOUD_PROJECT`: selected project ID.
   - `GOOGLE_CLOUD_LOCATION`: **europe-west4**.
   - `GOOGLE_SERVICE_ACCOUNT_JSON` **or** `GOOGLE_SERVICE_ACCOUNT_JSON_B64`.
   - `SUPABASE_URL`, `SUPABASE_ANON_KEY`: the existing auth project's URL/public key used server-side to verify `/auth/v1/user`.
   - `VOICE_ALLOWED_ORIGINS`: `https://budget-pro-lski.vercel.app,https://budgetpro.app,null` plus any actual trusted Web custom domains. `null` explicitly covers the Electron file-origin strategy; it does not replace Supabase authentication. Never use `*`.
   - Leave `VOICE_ENABLE_ADAPTATION` absent/false for the first baseline. Category hints are bounded and ignored until this flag is explicitly true.
9. **Create a new Vercel deployment after changing ENV** (Dashboard Redeploy, or authenticated `vercel --prod`). Existing deployments do not automatically receive new ENV. This requires a valid Vercel login and access to the existing project; do not create a replacement project accidentally.
10. Run health, setup and smoke checks below. A successful health response proves local format/presence validation only, not billing/API/IAM/recognition success. Check project access/model availability using Locations API and then a real human WAV.

Service implementation uses Node crypto/fetch and the official **REST V2** API, not a separate Google SDK. Regional URL:

`https://europe-west4-speech.googleapis.com/v2/projects/PROJECT_ID/locations/europe-west4/recognizers/_:recognize`

Implicit `_` recognizer, no global recognizer. Config: `model: chirp_2`, exactly `languageCodes: [ka-GE]` / `[ru-RU]` / `[en-US]`. Auto is **language-agnostic transcription** (`[auto]`), not the separate unsupported Language Detection feature. `result.languageCode` is retained when present. Google's documentation says Chirp 2 confidence values are not representative, so the response always uses `confidence: null`.

## Check / auth / smoke

```bash
npm run voice:check
# Local server prerequisites without network checks:
npm run voice:check -- --offline
# Load a protected external ENV file (never commit it):
npm run voice:check -- --env-file /secure/path/voice.env
```

`voice:check` validates project/location/JSON or B64/RSA key, constructs the **production REST client**, scans www/desktop/Android assets and tracked working-tree/index source for credential markers, checks the public API base and fetches health. With credentials it performs read-only Google Locations connectivity. This is not a Speech recognize-permission/billing test. The source scan does not claim a full audit of archived backups or entire Git history. No private key, service account JSON, OAuth token, assertion or JWT is printed.

Sign in to BudgetPRO. The client reads the existing Supabase session, refreshes it through the existing auth path if expired, and explicitly sends `Authorization: Bearer <user access token>`. Cookies are not assumed. A session starts before refresh, so double-start and Cancel still work while auth is pending. Missing/expired user auth returns `VOICE_AUTH_REQUIRED`; missing Google config returns `STT_NOT_CONFIGURED`. Google errors are classified as API_DISABLED, BILLING_DISABLED, PERMISSION_DENIED, AUTH_ERROR, REGION_UNAVAILABLE, QUOTA_EXCEEDED without echoing raw Google messages/secrets. Unknown CORS origins get 403 CORS_DENIED.

For CLI backend tests, set a short-lived **user** access token as `VOICE_TEST_ACCESS_TOKEN` in a protected local ENV file (not `.env.example`, not git, not command arguments). This is distinct from Google credentials. `--env-file` uses Node's ENV loader and never prints values. Run:

```bash
npm run voice:smoke -- --env-file /secure/path/voice.env --file tests/voice/fixtures/ka-01-gamarjoba.wav --lang ka
# Optional local endpoint handler: includes real Supabase auth and Google provider
npm run voice:smoke -- --env-file /secure/path/voice.env --local --file tests/voice/fixtures/ka-01-gamarjoba.wav --lang ka
```

Remote smoke uses the actual HTTP endpoint. Local smoke invokes the actual transcribe handler; it does not inject a fake user or a new STT implementation. Failure exits 1. Successful output includes API URL, HTTP status, locale/model/location, transcript, normalized text, elapsed duration and validation. Transcript output is intentional for operator smoke/benchmark commands; production server logs do not print it.

## Record human fixtures

Use a **real human microphone**; no generated or synthetic speech counts as real acceptance. Linux helper uses `arecord` with default microphone (`--device pulse` or another ALSA device if necessary). It records mono raw PCM16 16 kHz and wraps it with the same WAV encoder as VoiceRecorder. No codec guess or header-only resampling. Existing fixtures are never overwritten. Check `arecord -l` / `arecord -L`; do not install fake microphone devices to turn absent hardware into a passed test.

```bash
npm run voice:record-fixture -- --lang ka --name ka-01-gamarjoba --seconds 5
# Speak: გამარჯობა
npm run voice:record-fixture -- --lang ka --name ka-02-coffee --seconds 6
# Speak: ყავა რვა ლარი
npm run voice:record-fixture -- --lang ka --name ka-03-digits --seconds 7
# Speak: ერთი ორი სამი ოთხი ხუთი
npm run voice:record-fixture -- --lang ka --name ka-04-task --seconds 7
# Speak: დღეს ახალი დავალება დავამატო
```

Also record `en-01-task`, `en-02-coffee`, `en-03-digits` and `ru-01-task`, `ru-02-coffee`, `ru-03-digits`; references are in `tests/voice/fixtures/manifest.json`. Flags can be omitted in an interactive terminal to select language/name. Share recordings only with the speaker's consent.

Capture/VAD/quiet/noise settings from 1.3.0 remain: AudioWorklet PCM, windowed-sinc resampling to PCM16 mono 16 kHz WAV, max 29 seconds, pre-roll 400/500/400ms and silence endpoint 1000/1500/1100ms. Quiet bounded gain ≤2; no aggressive gate. Production recorder requires no native Android recognizer. Physical hardware/quiet/noise performance needs human acceptance.

## Real tests and benchmark

```bash
npm run voice:test:api -- --env-file /secure/path/voice.env
npm run voice:benchmark:real -- --env-file /secure/path/voice.env
```

With no human fixture, real API tests exit 1 (`HUMAN_FIXTURES_REQUIRED`, executed=0), **not success with 42 SKIP**. With an existing fixture but missing auth/config/health, preflight fails. After setup, each available fixture actually calls the backend; missing human microphone fixtures may SKIP. Unit test runs exclude real networking unless `VOICE_RUN_REAL_API=true`. No mocked integration counts as Google STT.

Acceptance tolerates punctuation/case, reports normalized CER/WER, checks Georgian Unicode script and key words where specified, and independently checks amount/digit normalization. Default maximum CER is 0.25; adjust per fixture only with a documented reason. Cyrillic/Latin-only Georgian, translation, empty text and wrong digits fail. Benchmark table includes language, fixture, reference, transcript, CER/WER, duration, scriptValidation and numberNormalization.

First baseline has adaptation and denoiser/SNR off. Only after baseline succeeds compare adaptation (explicit server flag) and denoiser changes separately. Do not change chirp_2 based only on failed configuration.

## Build/status

Version stays **1.3.0**. `npm run dist:linux`; `npx cap sync android`; Java 21 Gradle `:app:assembleDebug`. deb install: `sudo apt install --reinstall ./dist/budgetpro_1.3.0_amd64.deb`.

Current run evidence and unresolved external prerequisites: `voice-verification.md`. A successful-integration checkpoint must follow real Georgian acceptance; none is claimed while credentials/human audio/deployment are unavailable.

## Official references

- Regional configuration / Locations API: https://docs.cloud.google.com/speech-to-text/docs/locations
- REST Recognize and implicit recognizer: https://docs.cloud.google.com/speech-to-text/docs/reference/rest/v2/projects.locations.recognizers/recognize
- Chirp 2 auto/confidence/adaptation/denoiser: https://docs.cloud.google.com/speech-to-text/docs/models/chirp-2
- IAM Cloud Speech Client: https://docs.cloud.google.com/iam/docs/roles-permissions/speech
