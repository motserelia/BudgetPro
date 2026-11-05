# Georgian ASR: ka-context audit and isolated Vosk prototype

No existing engine is replaced. No production, ENV, Android, financial-data or
UI changes are part of this investigation. No additional Groq request or real
audio recognition is performed.

## Actual ka-context attempt

Attempt: 7a0f6ee6-84d7-4d2f-8f0f-76e8cfd9318e.
Deployment: dpl_Gw9nniiCMZvnWjdyK7RhS4fzEwun, project budget-pro-lski.
URL: https://budget-pro-lski-dwabf1uuf-motserelia-s-projects.vercel.app

Relay logged one 261504-byte WAV, language ka and HTTP 200. Phone diagnostics
recorded 8170.625 ms audio, 1589 ms server recognition, quiet mode and gain
1.508. Raw API transcript:

ავაში არვა ლარი გადავიხადე

The phone received exactly this text, normalization left it unchanged and the
financial parser reported needs_input / FINANCIAL_DRAFT_INCOMPLETE. Expense
was selected, category fell back to Other, and no amount was inferred.

The pinned relay target, pre-recording phone health (ka-context), deployment
identity and published source hashes were verified. In that immutable code
path, server-selected comparisonVariant=ka-context appends the fixed prompt
to FormData before fetch. language=ka is also appended. This establishes
application of the prompt by the deployed adapter; an independent capture of
the provider's received multipart body is not available. No secret headers or
audio are added to logs to obtain that evidence. A later runtime-log query
returned no retained row matching the test time; the relay and saved client
diagnostics retain the matching attempt ID and HTTP result.

Baseline raw text was the same apart from terminal punctuation. Baseline and
context used different recordings (4544 vs 8170.625 ms), so this is a small
uncontrolled comparison, not a general quality benchmark. The exact acoustic
cause is not established: no human WAV was retained in the checked fixture
and temporary test locations. Prompt is soft context, not a grammar or forced
numeric answer. https://console.groq.com/docs/speech-to-text

## Vosk candidates and environment

Official catalog: https://alphacephei.com/vosk/models

- vosk-model-ka-0.42: 700M archive, published WER 12.7 FLEURS / 5.2 CV17.
- vosk-model-small-ka-0.42: 45M archive, published WER 18.0 FLEURS / 14.2 CV17.
- Both are listed as Apache 2.0; these scores are vendor benchmarks, not
  BudgetPRO financial-dictation results.
- Vosk API license: https://github.com/alphacep/vosk-api/blob/master/COPYING
- Android SDK release checked in Maven Central: 0.3.75. Python package: 0.3.45.
- Android API supports offline native recognition. Current library source
  declares minSdk 21; BudgetPRO's minSdk 23 is above that minimum, but the
  future integration still needs native/JNA/ABI/build and physical-device tests.
  https://github.com/alphacep/vosk-api/blob/master/android/lib/build.gradle
- A Capacitor Java/Kotlin plugin can bridge the existing recorder's PCM16 to
  native recognition on a background worker. This is a proposed integration,
  not an implemented or tested plugin. Avoid a second simultaneous microphone.
  https://capacitorjs.com/docs/plugins/android

All downloads, models, venv and machine results are isolated in
/tmp/budgetpro-vosk-georgian. Package/lock of BudgetPRO are untouched. Recognition
using local Vosk has no per-request cloud fee or provider upload; hardware,
storage and energy still have a cost. Do not assume server hosting is free.

Both model archives were downloaded over official HTTPS, hashed and unpacked;
ZIP CRC integrity was checked. Local load checks (no recognizer/audio):

| Model | Extracted bytes | Model-load seconds | Process peak RSS |
| --- | ---: | ---: | ---: |
| small-ka-0.42 | 97400805 | 1.240 | 215.5 MiB |
| ka-0.42 | 1806000676 | 3.942 | 1937.2 MiB |

These are measurements on the developer Linux computer, not Android or ASR
latency. Both vocabularies contain all six checked words: ყავაში, რვა, ლარი,
თეთრი, გადავიხადე, ხელფასი. Vocabulary coverage is not recognition accuracy.

## Prototype

scripts/voice-debug/vosk-georgian.py opens only an explicitly named local model
folder. It has no microphone, HTTP server, automatic model download, cloud
fallback, application writes or financial save. No audio argument means model
load check only. The report records recognitionPerformed=false in that case.

An audio file requires explicit --allow-audio-use, owner permission for that
file, mono PCM16 WAV 16000 Hz and 0.22–30 s duration. Report files are created
with mode 0600 and cannot overwrite an existing report. Raw audio is never
printed; no automatic audio file is created. No real audio has been used.

Example load check (no recognition):

```
/tmp/budgetpro-vosk-georgian/venv/bin/python scripts/voice-debug/vosk-georgian.py \
  --model /tmp/budgetpro-vosk-georgian/models/vosk-model-small-ka-0.42 \
  --report /tmp/budgetpro-vosk-georgian/new-load-check.json
```

For a future separately authorized WAV, add --audio /path/to/approved.wav and
--allow-audio-use. Run the two models separately on the same file/hash, record
real latency/RAM, then pass raw texts to the existing normalizer and parser.
Do not describe supplied text controls or mocked recognition as Vosk audio
results. Model-load time is not recognition speed or Android performance.

## Parser and Save findings

Actual baseline/context texts produce unknown amount, expense, no parsed
coffee category. Correct standalone Georgian numerals, compounds, income and
lari-plus-tetri control phrases are tested independently of ASR. Pure tetri
revealed a real existing bug: ორმოცდაათი თეთრი becomes 50 instead of 0.50.
This is an expected-failing TODO regression, not a passing financial case or
an STT defect. It is not fixed in this investigation.

The phone's quick Save button is visually enabled (disabled=false) with an
empty amount. This is a UX discrepancy. In ordinary code, saveQuick rejects
nonpositive/nonfinite amounts before saveVoiceDraftTransaction; that function
also validates before conversion or writes, and the full editor has its own
guard. In the debug APK, the capture-phase Save interlock additionally stops
the click before handlers. No Save click was performed on the phone.

## Next step requiring permission

Obtain one manually recorded, explicitly retained WAV and permission to use it
for both local models. Keep the current Groq implementation as a baseline and
do not switch providers or deploy automatically. Select any integration only
after scoring exact numerals, currency units, income/expense and categories,
including abstention on uncertain amounts. The 45M model is the first mobile
candidate; the 700M model is the desktop accuracy reference until device RAM,
loading time and battery impact are measured. Fixing the pure-tetri parser
bug and changing the visual Save state are separate authorized changes.

## Validation results

- Python prototype: five isolated/mock tests passed. No human audio used.
- Voice/Auth/finance Node suite: 250 tests; 207 passed, 42 skipped and one
  expected-failing TODO for standalone tetri. No other failing test.
- Invalid missing/zero/negative amounts are rejected before conversion or writes
  in an isolated test of the actual save function. No phone Save click occurred.
- Syntax and git diff --check passed. The phone financial fingerprint matches
  the pre-recording fingerprint. Relay stopped and USB reverse removed.
