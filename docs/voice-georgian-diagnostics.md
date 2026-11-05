# Georgian voice diagnostics: local preparation

No real recording/STT, deployment, ENV modification or APK installation is part
of this change. Existing model: Groq Free / whisper-large-v3. Auth and financial
storage are unchanged.

## What the previous logs prove

One WAV reached Preview with HTTP 200; three later uploads were blocked locally
with 423 by the one-shot relay. Their individual triggers were not captured.
They cannot be attributed to user taps or automatic retries from these logs.
Stop/VAD use one finishing guard. Retry explicitly starts a new session; main
and floating buttons also start sessions. Save-and-continue exists but the
debug bootstrap blocks voice saves. There is no automatic ASR network retry.

Previously VoiceDiagnostics.begin replaced one global record, and late API
updates were not tied to an attempt. That explains the lost successful report.

## Memory-only attempt history

In the isolated debug APK (BudgetPROVoiceDebug), or localhost developer mode:

- VoiceDiagnostics.history(): chronological snapshots of the latest 10 attempts;
- VoiceDiagnostics.get(sessionId): one retained attempt;
- VoiceDiagnostics.format(): current plus history, also available through the
  existing Voice Input Diagnostics report/copy action;
- outside debug/developer mode only the current report is retained;
- no localStorage/IndexedDB/files/network diagnostic history is created;
- audio is not added to history or automatically exported to files.

IDs identify voice attempts, not Supabase login sessions. The relay logs only
strict UUID-v4 attempt IDs, validated language, bytes, HTTP status and whether
the request was forwarded. It never logs query strings, transcript or tokens.

Each attempt records start source, finish trigger (Stop, VAD, timer), capture,
send/response/parse events, WAV bytes, raw client API transcript, normalized
text, parser input and independent ASR/financial-parse outcomes. Updates carrying
an evicted/old ID cannot overwrite the current attempt. Cancellation ignores
late responses. The exported fields are allowlisted and common credential
formats are redacted. Reports may contain the explicitly dictated test phrase;
do not copy production financial history into test dictations.

## Recording readiness

A regression reproduced a pre-ready recorder frame showing Listening and
triggering VAD upload before recorder.start resolved. Session callbacks now
wait for recording readiness before changing that state or auto-finishing.
Microphone request/acquisition, context/worklet readiness, context resume,
first PCM frame, first VAD speech, VAD start and capture stop have timestamps.
Mock PCM tests preserve the recorder's pre-roll. This proves state ordering
and buffer behavior, not that earlier real Georgian speech was clipped.
Audio before getUserMedia/AudioWorklet capture cannot be recovered by pre-roll.

## Local A/B preparation (not yet an Android A/B result)

scripts/voice-debug/groq-comparison.js exports factories and opens no listener.
Explicit variant is required:

- baseline: unchanged existing Groq adapter;
- ka-context: same adapter, adding only this fixed prompt for language ka:
  ყავა, ლარი, თეთრი, გადავიხადე, დავხარჯე, შემოსავალი, ხელფასი

No test amount, expected answer, complete test phrase or private category list
is inserted. Context is a hypothesis, not a guaranteed correction.

createComparisonHandler(variant) wraps the original handler and retains
Supabase Bearer, WAV checks, Redis, limits and cancellation. It requires the
existing Groq Free server configuration and rejects Google/other selection.
Credentials remain server-side. No ENV is set by this module.

The fixed Preview relay still targets the existing deployment. That deployment
does NOT gain prompt support from this local file. Actual A/B on Android needs
a separately approved isolated test backend with authorized server credentials
and an explicitly reviewed transport, or an approved isolated Preview release.
Do not pass prompt through a client query or silently alter the current Preview.
No credentials are to be read out of Preview or embedded in the APK.

## Next approved test only

1. Review/prepare a new isolated debug APK including voice-recorder.js (the
   preparation script now copies it as well as the other changed JS assets).
   Do not overwrite or install the existing APK automatically.
2. Verify package, signer and compatible version before any authorized update.
3. Select a single fixed language and one manually authorized attempt, e.g.
   relay.js --allow-one-audio ka. Default relay remains audio-locked. Legacy
   --allow-one-ru-audio still works; auto is not armed by these switches.
4. Speak only after Listening. Retain the diagnostic report immediately; do not
   retry without separate approval. Never save the test financial operation.
5. With separately approved audio retention/replay, compare baseline/context on
   the same WAV; record audio identity, variant and text/financial outcomes
   separately. Replaying audio is another STT request requiring permission.

An unrecognized numeral must remain unknown. For the Georgian string
ავაშირვა ლარი გადავიხადე, no numeric value is inferred. Existing
needs_input / FINANCIAL_DRAFT_INCOMPLETE and manual clarification stay intact.
Valid Georgian standalone/compound/decimal numbers have separate text tests;
those are not ASR-quality results.
