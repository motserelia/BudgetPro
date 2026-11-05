#!/usr/bin/env python3
"""Create an isolated, debug-only Android tree. Never cap sync or modify real assets."""
import argparse
import hashlib
import json
import pathlib
import re
import shutil
import tempfile

ROOT = pathlib.Path(__file__).resolve().parents[2]
FILES = ['index.js', 'voice/voice-api-client.js', 'voice/voice-diagnostics.js', 'voice/voice-session.js', 'voice/voice-ui.js', 'voice/voice-recorder.js']

GUARDED_FUNCTIONS = ['openEditModal', 'openAddModal', 'openSalaryModal', 'openVoiceQuickModal',
    'openVoiceDraftModal', 'saveVoiceDraftTransaction', 'safeDeleteOp', 'askConfirm',
    'saveAll', 'saveProfileData', 'saveGlobal', 'saveAllToIndexedDB', 'loadAllFromIndexedDB',
    'clearIndexedDB', 'jsonBinSaveBackup', 'jsonBinLoadBackup', 'importFromJSON',
    'applyRecurringOps', 'normalizeFinancialState', 'saveGoals', 'openAddCategoryModal', 'openEditCategoryModal',
    'syncStartBalanceTransaction', 'recoverMissingDataInBackground', 'switchProfile',
    'cloudSave', 'cloudLoad', 'exportToJSON', 'saveFrequentStats', 'saveUserTemplates',
    'saveVoiceLearningEntries', 'openCategoryColorPicker', 'openSubcategoryEditorModal',
    'openPartnerMode', 'initFirebase', '_saveToFirebase', 'jsonBinSaveMessages',
    'saveAllMessages', 'exportToCSV', 'exportToPDF', 'openGoogleSheetsExport']
GUARD_LINE = '\n  if (window.BudgetPROVoiceDebug?.localOnly) return window.BudgetPROVoiceDebug.blocked();\n'
# Current source has exactly one additional saveAll function assignment.
EXPECTED_WRAPPERS = {'saveAll': 1}

def guard_financial_handlers(source):
    # Exact named entry points, including guards BEFORE normalizers/mutations.
    for name in GUARDED_FUNCTIONS:
        declarations = list(re.finditer(r'function ' + name + r'\s*\(', source))
        if len(declarations) != 1:
            raise RuntimeError('FINANCIAL_GUARD_TARGET_MISSING_OR_REDECLARED:' + name)
        match = declarations[0]
        depth, quote, escaped = 1, None, False
        index = match.end()
        while depth:
            c = source[index]
            if quote:
                if escaped: escaped = False
                elif c == chr(92): escaped = True
                elif c == quote: quote = None
            elif c in ('"', "'", '`'): quote = c
            elif c == '(': depth += 1
            elif c == ')': depth -= 1
            index += 1
        while source[index].isspace(): index += 1
        if source[index] != '{': raise RuntimeError('FUNCTION_BODY_NOT_FOUND')
        index += 1
        source = source[:index] + GUARD_LINE + source[index:]
    for name, expected in EXPECTED_WRAPPERS.items():
        pattern = r'(?<![\w$])' + name + r'\s*=\s*(?:async\s+)?function\s*\([^)]*\)\s*\{'
        matches = list(re.finditer(pattern, source))
        if len(matches) != expected: raise RuntimeError('UNREVIEWED_FINANCIAL_WRAPPER:' + name)
        for match in reversed(matches):
            source = source[:match.end()] + GUARD_LINE + source[match.end():]
    source += '\nwindow.BudgetPROVoiceDebug.finalize(' + json.dumps(GUARDED_FUNCTIONS) + ');\n'
    return source

def prepare(local_vosk=False):
    target = pathlib.Path(tempfile.mkdtemp(prefix='budgetpro-voice-debug-'))
    ignored = shutil.ignore_patterns('build', '.gradle', '.cxx', '.idea', 'captures', 'local.properties')
    shutil.copytree(ROOT / 'android', target / 'android', ignore=ignored)
    for name in ['@capacitor/android/capacitor', '@capacitor/app/android', '@capacitor/local-notifications/android', '@capgo/capacitor-native-biometric/android']:
        src = ROOT / 'node_modules' / name
        shutil.copytree(src, target / 'node_modules' / name, ignore=ignored)
    sdk = None
    local = ROOT / 'android/local.properties'
    if local.exists():
        match = re.search(r'^sdk.dir=(.+)$', local.read_text(), re.M)
        if match:
            sdk = match[1].strip()
    if not sdk or not pathlib.Path(sdk).is_dir():
        raise RuntimeError('ANDROID_SDK_NOT_FOUND')
    (target / 'android/local.properties').write_text('sdk.dir=' + sdk + '\n')
    assets = target / 'android/app/src/main/assets/public'
    before = {str(p.relative_to(assets)): hashlib.sha256(p.read_bytes()).hexdigest() for p in assets.rglob('*') if p.is_file()}
    for name in FILES:
        shutil.copy2(ROOT / 'www' / name, assets / name)
    if local_vosk:
        (assets / 'index.js').write_text(guard_financial_handlers((assets / 'index.js').read_text()))
        shutil.copy2(ROOT / 'scripts/voice-debug/local-voice-session.js', assets / 'voice/voice-session.js')
        for name in ['local-finance-guard.js', 'local-wav-capture.js']:
            shutil.copy2(ROOT / 'scripts/voice-debug' / name, assets / 'voice' / name)
    else:
        shutil.copy2(ROOT / 'scripts/voice-debug/android-bootstrap.js', assets / 'voice/voice-debug-bootstrap.js')
    page = assets / 'index.html'
    html = page.read_text()
    anchor = '<script src="index.js"></script>'
    if html.count(anchor) != 1:
        raise RuntimeError('UNEXPECTED_SCRIPT_ORDER')
    if local_vosk:
        early = '<script src="api-config.js"></script>'
        if html.count(early) != 1: raise RuntimeError('UNEXPECTED_GUARD_SCRIPT_ORDER')
        html = html.replace('<head>', '''<head>\n    <meta http-equiv="Content-Security-Policy" content="connect-src 'self' https://budget-pro-lski.vercel.app/api/auth/ https://*.supabase.co/auth/v1/; form-action 'none'; object-src 'none'; frame-src 'none'">''', 1)
        html = html.replace(early, '<script src="voice/local-finance-guard.js"></script>\n    ' + early)
        page.write_text(html.replace(anchor, anchor + '\n    <script src="voice/local-wav-capture.js"></script>'))
    else:
        page.write_text(html.replace(anchor, anchor + '\n    <script src="voice/voice-debug-bootstrap.js"></script>'))
    config_path = target / 'android/app/src/main/assets/capacitor.config.json'
    config = json.loads(config_path.read_text())
    if config['appId'] != 'pro.budget.app' or config['server']['hostname'] != 'budgetpro.app' or config['server']['androidScheme'] != 'https':
        raise RuntimeError('UNEXPECTED_CAPACITOR_ORIGIN')
    config.setdefault('android', {}).update({'allowMixedContent': not local_vosk, 'webContentsDebuggingEnabled': True})
    config_path.write_text(json.dumps(config, indent=2))
    debug = target / 'android/app/src/debug'
    (debug / 'res/xml').mkdir(parents=True, exist_ok=True)
    (debug / 'AndroidManifest.xml').write_text('''<manifest xmlns:android="http://schemas.android.com/apk/res/android">
  <application android:networkSecurityConfig="@xml/voice_debug_network_security" />
</manifest>
''')
    (debug / 'res/xml/voice_debug_network_security.xml').write_text('''<network-security-config>
  <base-config cleartextTrafficPermitted="false" />
  <domain-config cleartextTrafficPermitted="true">
    <domain includeSubdomains="false">localhost</domain>
    <domain includeSubdomains="false">127.0.0.1</domain>
  </domain-config>
</network-security-config>
''')
    if local_vosk:
        (debug / 'res/xml/voice_debug_network_security.xml').write_text('<network-security-config><base-config cleartextTrafficPermitted="false" /></network-security-config>')
    build = target / 'android/app/build.gradle'
    original_build = build.read_text()
    if local_vosk:
        original_build, changes = re.subn(r'versionCode \d+', 'versionCode 5', original_build)
        if changes != 1: raise RuntimeError('UNEXPECTED_VERSION_CODE')
    build.write_text(original_build + '''
// Isolated voice test tree: do not produce release artifacts with these assets.
gradle.taskGraph.whenReady { graph ->
    if (graph.allTasks.any { it.name.toLowerCase().contains('release') }) {
        throw new GradleException("Voice relay assets are debug-only; release tasks forbidden")
    }
}
''')
    updated = [str(p.relative_to(assets)) for p in assets.rglob('*') if p.is_file() and before.get(str(p.relative_to(assets))) != hashlib.sha256(p.read_bytes()).hexdigest()]
    extras = ['index.html', 'voice/local-finance-guard.js', 'voice/local-wav-capture.js'] if local_vosk else ['index.html', 'voice/voice-debug-bootstrap.js']
    assert set(updated) == set(FILES + extras), updated
    assert (assets / 'api-config.js').read_bytes() == (ROOT / 'android/app/src/main/assets/public/api-config.js').read_bytes()
    manifest = {'stage': str(target), 'applicationId': 'pro.budget.app', 'versionCode': 5 if local_vosk else 4, 'debugBuildRevision': 4 if local_vosk else None, 'financialWrapperGuards': EXPECTED_WRAPPERS if local_vosk else {}, 'updatedAssets': updated, 'localVoskOnly': local_vosk, 'financialEntryGuards': GUARDED_FUNCTIONS if local_vosk else [], 'voiceOnlyRelay': None if local_vosk else 'http://localhost:8139/api', 'productionApiUnchanged': True, 'secretsIncluded': False, 'installed': False, 'sha256': {name: hashlib.sha256((assets / name).read_bytes()).hexdigest() for name in updated}}
    (target / 'voice-debug-manifest.json').write_text(json.dumps(manifest, indent=2))
    pathlib.Path('/tmp/budgetpro-voice-debug-stage.json').write_text(json.dumps(manifest, indent=2))
    print(json.dumps(manifest, indent=2))

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--local-vosk', action='store_true')
    prepare(parser.parse_args().local_vosk)
