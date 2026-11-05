const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '../..');

test('Android manifest declares every audio permission requested by the installed Capacitor WebChromeClient', () => {
  const bridge = fs.readFileSync(path.join(root, 'node_modules/@capacitor/android/capacitor/src/main/java/com/getcapacitor/BridgeWebChromeClient.java'), 'utf8');
  const audioBlock = bridge.match(/if \(Arrays\.asList\(request\.getResources\(\)\)\.contains\("android\.webkit\.resource\.AUDIO_CAPTURE"\)\) \{([^}]+)\}/);
  assert.ok(audioBlock, 'Find the actual WebView audio-permission request');
  const required = [...audioBlock[1].matchAll(/Manifest\.permission\.(\w+)/g)].map(match => 'android.permission.' + match[1]);
  assert.ok(required.includes('android.permission.RECORD_AUDIO'));
  assert.ok(required.includes('android.permission.MODIFY_AUDIO_SETTINGS'));
  const manifest = fs.readFileSync(path.join(root, 'android/app/src/main/AndroidManifest.xml'), 'utf8');
  const declared = new Set([...manifest.matchAll(/<uses-permission\s+android:name="([^"]+)"/g)].map(match => match[1]));
  for (const permission of required) assert.ok(declared.has(permission), 'Missing required audio permission: ' + permission);
});
