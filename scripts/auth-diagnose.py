#!/usr/bin/env python3
"""Read-only Magic Link diagnostics. Standard library only; NEVER sends an email.
Run: python3 scripts/auth-diagnose.py
Output contains presence flags/status codes, never credentials or response bodies.
"""
import json
import os
from pathlib import Path
import shutil
import urllib.error
import urllib.request

ROOT = Path(__file__).resolve().parents[1]
ORIGIN = 'https://budget-pro-lski.vercel.app'
ENV_KEYS = ('VERCEL_TOKEN', 'VERCEL_ORG_ID', 'VERCEL_PROJECT_ID',
            'SUPABASE_ACCESS_TOKEN', 'SUPABASE_PROJECT_ID', 'SUPABASE_URL',
            'SUPABASE_ANON_KEY', 'BUDGETPRO_AUTH_REDIRECT_URL')
SAFE_ERRORS = {'Method Not Allowed', 'Invalid email address', 'refresh_token_invalid',
               'AUTH_METHOD_NOT_ALLOWED', 'AUTH_INVALID_EMAIL', 'AUTH_CONFIG_ERROR',
               'AUTH_RATE_LIMITED', 'AUTH_RECIPIENT_NOT_ALLOWED',
               'AUTH_EMAIL_DELIVERY_FAILED', 'AUTH_SERVER_UNAVAILABLE'}


def probe(name, url, method='GET', body=None):
    # All requests are fixed in run(); there is no CLI option accepting an email.
    result = {'check': name, 'method': method}
    try:
        req = urllib.request.Request(url, data=body, method=method,
            headers={'Content-Type': 'application/json', 'Origin': 'https://budgetpro.app'})
        try:
            response = urllib.request.urlopen(req, timeout=15)
        except urllib.error.HTTPError as error:
            response = error
        with response:
            raw = response.read()
            result.update(status=response.status,
                          cors_allows_native=response.headers.get('Access-Control-Allow-Origin') in ('*', 'https://budgetpro.app'))
        if name == 'deployed_client':
            text = raw.decode(errors='replace')
            result.update(matches_local=raw == (ROOT / 'www/index.js').read_bytes(),
                          has_api_configuration='BudgetPROApiConfig' in text,
                          has_cold_start_fix='const receiveAuthUrl =' in text,
                          is_javascript=not text.lstrip().startswith('<'))
        else:
            try:
                data = json.loads(raw)
                if name == 'assetlinks':
                    result['matches_local'] = data == json.loads((ROOT / 'www/.well-known/assetlinks.json').read_text())
                elif isinstance(data, dict):
                    error = data.get('error')
                    result['ok'] = data.get('ok') if isinstance(data.get('ok'), bool) else None
                    result['error_class'] = error if isinstance(error, str) and error in SAFE_ERRORS else 'unclassified_or_absent'
            except (ValueError, TypeError):
                result['json_response'] = False
    except Exception as error:
        # str(error) may contain URLs, tokens or upstream bodies: never serialize it.
        result['transport_error'] = type(error).__name__
    return result


def inventory():
    home = Path.home()
    credential_paths = [home / '.local/share/com.vercel.cli/auth.json',
                        home / '.config/com.vercel.cli/auth.json',
                        home / '.config/vercel/auth.json', home / '.vercel/auth.json',
                        home / '.supabase/access-token', home / '.config/supabase/access-token']
    return {
        'tools': {name: bool(shutil.which(name)) for name in ('vercel', 'supabase', 'gh', 'adb', 'node', 'python3')},
        'environment_presence': {key: bool(os.environ.get(key)) for key in ENV_KEYS},
        'credential_files_present': [str(path.relative_to(home)) for path in credential_paths if path.is_file()],
        'project_link': (ROOT / '.vercel/project.json').is_file(),
        'ancestor_project_link': any((parent / '.vercel/project.json').is_file() for parent in ROOT.parents),
        'supabase_link': (ROOT / 'supabase/.temp/project-ref').is_file(),
        'supabase_config': (ROOT / 'supabase/config.toml').is_file(),
        'local_env_files': [path.name for path in ROOT.glob('.env*') if path.name != '.env.example' and path.is_file()],
    }


def run():
    print(json.dumps({'inventory': inventory()}, ensure_ascii=False), flush=True)
    checks = [
        ('vercel_identity', 'https://api.vercel.com/v2/user', 'GET', None),
        ('supabase_management', 'https://api.supabase.com/v1/projects', 'GET', None),
        ('magic_cors', ORIGIN + '/api/auth/magic-link', 'OPTIONS', None),
        ('magic_method', ORIGIN + '/api/auth/magic-link', 'GET', None),
        ('magic_validation', ORIGIN + '/api/auth/magic-link', 'POST', b'{"email":"invalid"}'),
        ('refresh_validation', ORIGIN + '/api/auth/refresh-session', 'POST', b'{}'),
        ('deployed_client', ORIGIN + '/index.js', 'GET', None),
        ('api_config_asset', ORIGIN + '/api-config.js', 'GET', None),
        ('assetlinks', ORIGIN + '/.well-known/assetlinks.json', 'GET', None),
    ]
    for args in checks:
        print(json.dumps(probe(*args), ensure_ascii=False), flush=True)


if __name__ == '__main__':
    run()
