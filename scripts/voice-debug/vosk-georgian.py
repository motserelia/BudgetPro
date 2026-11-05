#!/usr/bin/env python3
"""Isolated offline Vosk experiment. No microphone, network, app writes or auto-download."""
import argparse
import hashlib
import json
import os
import pathlib
import resource
import time
import wave

MODELS = {'vosk-model-ka-0.42', 'vosk-model-small-ka-0.42'}


def validate_audio(path):
    with wave.open(str(path), 'rb') as audio:
        if (audio.getnchannels(), audio.getsampwidth(), audio.getframerate(), audio.getcomptype()) != (1, 2, 16000, 'NONE'):
            raise ValueError('WAV_MUST_BE_PCM16_MONO_16000')
        duration_ms = audio.getnframes() / 16
        if not 220 <= duration_ms <= 30000 or path.stat().st_size > 960044:
            raise ValueError('WAV_DURATION_OR_SIZE_INVALID')
        if len(audio.readframes(audio.getnframes())) != audio.getnframes() * 2:
            raise ValueError('WAV_TRUNCATED')
    return duration_ms


def run(model_path, audio_path=None, allow_audio_use=False, vosk_module=None):
    model_path = pathlib.Path(model_path)
    if model_path.name not in MODELS or not (model_path / 'am/final.mdl').is_file():
        raise ValueError('EXPLICIT_GEORGIAN_MODEL_REQUIRED')
    if audio_path is not None and not allow_audio_use:
        raise ValueError('EXPLICIT_AUDIO_PERMISSION_REQUIRED')
    duration = validate_audio(pathlib.Path(audio_path)) if audio_path is not None else None
    if vosk_module is None:
        import vosk as vosk_module
    vosk_module.SetLogLevel(-1)
    started = time.perf_counter()
    cpu_started = time.process_time()
    # A local path only: never Model(lang=...) or Model(model_name=...) downloads.
    model = vosk_module.Model(str(model_path))
    report = {'provider': 'vosk-local', 'model': model_path.name, 'language': 'ka',
              'modelLoaded': True, 'loadSeconds': round(time.perf_counter() - started, 3),
              'loadCpuSeconds': round(time.process_time() - cpu_started, 3),
              'peakRssKiB': resource.getrusage(resource.RUSAGE_SELF).ru_maxrss,
              'recognitionPerformed': False, 'networkRequests': 0, 'operationSaved': False}
    if hasattr(model, 'vosk_model_find_word'):
        report['vocabularyPresence'] = {word: model.vosk_model_find_word(word) >= 0
                                        for word in ['ყავაში', 'რვა', 'ლარი', 'თეთრი', 'გადავიხადე', 'ხელფასი']}
    if audio_path is None:
        return report
    started = time.perf_counter()
    cpu_started = time.process_time()
    recognizer = vosk_module.KaldiRecognizer(model, 16000)
    recognizer.SetWords(True)
    segments = []
    with wave.open(str(audio_path), 'rb') as audio:
        while True:
            chunk = audio.readframes(4000)
            if not chunk:
                break
            if recognizer.AcceptWaveform(chunk):
                segments.append(json.loads(recognizer.Result()))
    segments.append(json.loads(recognizer.FinalResult()))
    text = ' '.join(segment.get('text', '') for segment in segments).strip()
    elapsed = time.perf_counter() - started
    cpu_elapsed = time.process_time() - cpu_started
    report.update({'recognitionPerformed': True, 'rawTranscript': text,
                   'durationMs': duration, 'recognitionSeconds': round(elapsed, 3),
                   'recognitionCpuSeconds': round(cpu_elapsed, 3),
                   'cpuPercentOfOneCore': round(100 * cpu_elapsed / max(elapsed, .000001), 1),
                   'peakRssKiB': resource.getrusage(resource.RUSAGE_SELF).ru_maxrss,
                   'audioSha256': hashlib.sha256(pathlib.Path(audio_path).read_bytes()).hexdigest(),
                   'wordResults': [word for segment in segments for word in segment.get('result', [])]})
    return report


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--model', type=pathlib.Path, required=True)
    parser.add_argument('--audio', type=pathlib.Path)
    parser.add_argument('--allow-audio-use', action='store_true', help='Only after owner permission for this file')
    parser.add_argument('--report', type=pathlib.Path, required=True)
    args = parser.parse_args()
    try:
        report = run(args.model, args.audio, args.allow_audio_use)
        with os.fdopen(os.open(args.report, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600), 'w') as out:
            json.dump(report, out, ensure_ascii=False, indent=2)
        print(json.dumps({'ok': True, 'model': report['model'], 'modelLoaded': True,
                          'recognitionPerformed': report['recognitionPerformed'], 'reportSaved': True}))
    except Exception as error:
        codes = {'WAV_MUST_BE_PCM16_MONO_16000', 'WAV_DURATION_OR_SIZE_INVALID', 'WAV_TRUNCATED',
                 'EXPLICIT_GEORGIAN_MODEL_REQUIRED', 'EXPLICIT_AUDIO_PERMISSION_REQUIRED'}
        safe = str(error) if isinstance(error, ValueError) and str(error) in codes else 'LOCAL_VOSK_CHECK_FAILED'
        print(json.dumps({'ok': False, 'error': safe}))
        raise SystemExit(1)


if __name__ == '__main__':
    main()
