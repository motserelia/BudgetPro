# Georgian prompt comparison Preview

Project: budget-pro-lski / prj_JXya7HuDChbetag5FjXhWDej2MpV.

Context Preview: https://budget-pro-lski-dwabf1uuf-motserelia-s-projects.vercel.app

Deployment: dpl_Gw9nniiCMZvnWjdyK7RhS4fzEwun.

Baseline retained: https://budget-pro-lski-40b8q4kqy-motserelia-s-projects.vercel.app

## Configuration

Only server/voice/asr.js and server/voice/groq-client.js differ from the baseline
deployment source. All 162 source files were verified against Vercel source
hashes; Auth, JSONBin, frontend, package/lock and route configuration are retained.
No production promotion or shared project ENV update was performed.

ASR_TEST_VARIANT=ka-context is an explicit nonsecret, deployment-only runtime
setting. It is rejected outside VERCEL_ENV=preview or outside Groq. Supported
explicit variants are baseline (no prompt) and ka-context (fixed dictionary).
Without the setting, the original Groq behavior remains unchanged.

The adapter uses transcriptions, whisper-large-v3, temperature=0, response_format=json
and language=ka for comparisons. The exact context is:

ყავა, ლარი, თეთრი, გადავიხადე, დავხარჯე, შემოსავალი, ხელფასი

There is no test amount, expected answer, whole test phrase or private category
list in the prompt. Client query parameters cannot select or change the prompt.
Groq supports same-language context:
https://console.groq.com/docs/speech-to-text

The local groq-comparison.js module reuses the same server adapter. No second
implementation or new provider is introduced. Supabase/WAV checks, shared Redis,
timeouts, cancellation, quota handling and no-retry behavior remain in place.
The account Free tier was previously confirmed by the owner in Billing; an ENV
attestation alone does not verify billing status.

## Android and test access

The existing debug APK is compatible: only the computer-side relay destination
changes. Preview protection remains enabled. The official short-lived Vercel
CLI identity stays in relay RAM, never in the APK. Start the default relay to
check health/CORS and the existing empty-body Supabase auth probe. Default audio
is locked. Only after separate authorization restart with --allow-one-audio ka.
Exactly one manually started upload is permitted, with no automatic retry.

Keep USB connected and verify adb reverse tcp:8139 tcp:8139 before the test.
The phone language must be ka and debug saves must remain blocked. No audio is
automatically written to files. Immediately after a future authorized recording,
save the sanitized diagnostic history before analyzing it. Include the variant
and Preview deployment ID alongside the attempt ID.

## Rollback

Stop the relay. Restore its PREVIEW constant to the baseline URL above, verify
health and restart audio-locked. This requires no APK update, production deploy,
ENV modification, financial-data change or project-security change. Do not
delete or promote either Preview automatically. No real STT quality improvement
is claimed until a separately authorized recording has been evaluated.
