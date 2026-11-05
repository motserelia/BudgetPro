# Human microphone fixtures

No human recordings are included yet. `npm run voice:test:api` must fail preflight when none exist; a missing recording is not an STT success.

Use `npm run voice:record-fixture -- --lang ka --name ka-01-gamarjoba --seconds 5` on a machine with a real microphone. Speak the exact corresponding manifest reference. Names required for baseline:

- ka-01-gamarjoba.wav: გამარჯობა
- ka-02-coffee.wav: ყავა რვა ლარი
- ka-03-digits.wav: ერთი ორი სამი ოთხი ხუთი
- ka-04-task.wav: დღეს ახალი დავალება დავამატო
- en-01-task.wav / en-02-coffee.wav / en-03-digits.wav
- ru-01-task.wav / ru-02-coffee.wav / ru-03-digits.wav

English/Russian references and the 42 normal/quiet/noise fixture slots are in manifest.json. PCM16 mono 16000 Hz WAV, maximum 30 seconds. Obtain consent before committing/sharing someone's voice. Do not fake an absent microphone with generated audio. Complete setup and smoke commands are in docs/voice-input.md.

Real Georgian microphone and Google STT: NOT VERIFIED.
