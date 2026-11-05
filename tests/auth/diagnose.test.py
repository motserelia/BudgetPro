"""python3 tests/auth/diagnose.test.py: offline privacy/read-only regressions."""
import contextlib
import importlib.util
import io
import json
from pathlib import Path
import unittest
import sys
sys.dont_write_bytecode = True
from unittest.mock import patch

spec = importlib.util.spec_from_file_location('auth_diagnose', Path(__file__).resolve().parents[2] / 'scripts/auth-diagnose.py')
doctor = importlib.util.module_from_spec(spec)
spec.loader.exec_module(doctor)

class DiagnosticsTest(unittest.TestCase):
    def test_exception_and_upstream_body_are_never_reported(self):
        private = 'fixture-private-token fixture-person@example.invalid'
        with patch.object(doctor.urllib.request, 'urlopen', side_effect=RuntimeError(private)):
            result = doctor.probe('test', 'https://example.invalid')
        self.assertNotIn(private, json.dumps(result))
        self.assertEqual(result['transport_error'], 'RuntimeError')
        response = io.BytesIO(json.dumps({'error': private, 'token': private, 'email': private}).encode())
        response.status = 500
        response.headers = {}
        with patch.object(doctor.urllib.request, 'urlopen', return_value=response):
            result = doctor.probe('test', 'https://example.invalid')
        self.assertNotIn(private, json.dumps(result))
        self.assertEqual(result['error_class'], 'unclassified_or_absent')

    def test_run_cannot_send_a_real_email(self):
        calls = []
        def probe(*args):
            calls.append(args)
            return {'check': args[0]}
        with patch.object(doctor, 'probe', side_effect=probe), patch.object(doctor, 'inventory', return_value={}), contextlib.redirect_stdout(io.StringIO()):
            doctor.run()
        for name, url, method, body in calls:
            if method == 'POST':
                self.assertIn((url, body), [
                    (doctor.ORIGIN + '/api/auth/magic-link', b'{"email":"invalid"}'),
                    (doctor.ORIGIN + '/api/auth/refresh-session', b'{}')])
            else:
                self.assertIn(method, ('GET', 'OPTIONS'))

if __name__ == '__main__':
    unittest.main()
