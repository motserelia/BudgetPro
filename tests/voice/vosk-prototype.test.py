"""No real audio inference. Mock only, temporary synthetic WAV validates the contract."""
import importlib.util
import pathlib
import tempfile
import types
import unittest
import wave

ROOT = pathlib.Path(__file__).resolve().parents[2]
spec = importlib.util.spec_from_file_location('prototype', ROOT / 'scripts/voice-debug/vosk-georgian.py')
prototype = importlib.util.module_from_spec(spec)
spec.loader.exec_module(prototype)


class PrototypeTests(unittest.TestCase):
    def setUp(self):
        self.directory = tempfile.TemporaryDirectory()
        self.addCleanup(self.directory.cleanup)
        self.root = pathlib.Path(self.directory.name)
        self.model = self.root / 'vosk-model-small-ka-0.42'
        (self.model / 'am').mkdir(parents=True)
        (self.model / 'am/final.mdl').write_bytes(b'mock')
        self.audio = self.root / 'synthetic.wav'
        with wave.open(str(self.audio), 'wb') as out:
            out.setparams((1, 2, 16000, 0, 'NONE', 'not compressed'))
            out.writeframes(b'\0\0' * 16000)

    def test_no_audio_loads_model_without_recognizer(self):
        fake = types.SimpleNamespace(SetLogLevel=lambda _: None, Model=lambda p: object())
        result = prototype.run(self.model, vosk_module=fake)
        self.assertTrue(result['modelLoaded'])
        self.assertFalse(result['recognitionPerformed'])
        self.assertNotIn('rawTranscript', result)

    def test_audio_requires_explicit_permission_before_model_load(self):
        with self.assertRaisesRegex(ValueError, 'EXPLICIT_AUDIO_PERMISSION_REQUIRED'):
            prototype.run(self.model, self.audio)

    def test_wrong_wav_rejected_before_model_load(self):
        self.audio.write_bytes(b'not wav')
        with self.assertRaises((wave.Error, EOFError)):
            prototype.run(self.model, self.audio, True)

    def test_only_explicit_known_georgian_model(self):
        with self.assertRaisesRegex(ValueError, 'EXPLICIT_GEORGIAN_MODEL_REQUIRED'):
            prototype.run(self.root)

    def test_mock_transcript_is_returned_unchanged_without_financial_guess(self):
        class Recognizer:
            def __init__(self, model, rate):
                self.rate = rate
            def SetWords(self, value):
                pass
            def AcceptWaveform(self, chunk):
                return False
            def FinalResult(self):
                return '{"text":"ავაში არვა ლარი გადავიხადე"}'
        fake = types.SimpleNamespace(SetLogLevel=lambda _: None, Model=lambda p: object(), KaldiRecognizer=Recognizer)
        result = prototype.run(self.model, self.audio, True, fake)
        self.assertEqual(result['rawTranscript'], 'ავაში არვა ლარი გადავიხადე')
        self.assertNotIn('amount', result)
        self.assertEqual(result['networkRequests'], 0)
        self.assertFalse(result['operationSaved'])


if __name__ == '__main__':
    unittest.main()
