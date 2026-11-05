# Local Vosk debug v4: financial isolation

Date: 2026-11-03. This revision is prepared only in the isolated temporary Android
tree; source www, production APIs, ENV, financial parser and Android main tree
are unchanged. Package pro.budget.app; Android versionCode 5 (installed v3 was 4).
WAV protocol remains 3; the financial guard/build revision is 4.

## Confirmed root cause and reviewed paths

www/index.js:7487 declares saveAll. At 36249, _origSaveAll saves a reference to
it; at 36250 a new function replaces saveAll. The v3 preparer guarded only the
declaration. The outer function ignored the blocked original's false return and
could continue to _fbDB.ref(partner_rooms/.../transactions).set when configured.
The positive-control unit test reproduces one such write with disposable mocks.
No claim is made that the historical phone actually sent financial data.

Reviewed alternative paths:

- Saved original/wrapper references and later/asynchronous calls. The optional
  _origDeleteOp alias has no deleteOp definition in current index.js/index.html.
- Profile/global saves, direct add/edit/delete and balance/category/recurring
  handlers; settings backup callbacks call the same lower-level save functions.
- IndexedDB save/load/clear, background recovery (including Firebase once and
  JSONBin restore), profile switching and JSON/data-URL imports.
- Partner room initialization/subscription and writes, Firebase initialization
  and helper, JSONBin backup/message helpers; configured SDK transport can use
  WebSocket independently of fetch/XHR.
- JSON/CSV/PDF/Sheets exports and clipboard/file backup exports.
- Storage setItem/removeItem/clear AND named-property writes; IndexedDB store,
  cursor, schema and transaction mutation APIs.

The app's financial persistence uses these browser stores and JS cloud paths;
no separate native Preferences/Filesystem/CapacitorHttp financial write path was
found. Service worker source caches app assets, not financial records; v4 blocks
new worker/service-worker transport setup without unregistering existing workers
or deleting any data.

## Corrections

prepare-android.py inserts debug-only entry guards into 41 reviewed function
declarations AND the saveAll assignment. It verifies declaration/wrapper counts
and refuses unreviewed redeclarations/wrapper changes. Thus _origSaveAll and a
saved outer wrapper are guarded even if they bypass the final public binding.

After the ENTIRE index.js executes all its definitions/replacements, the staged
file calls BudgetPROVoiceDebug.finalize with the exact reviewed list. It checks
actual function bodies, replaces all 41 public financial entry points with
read-only functions, and makes their bindings non-writable/non-configurable.
Async functions preserve a Promise-returning false result. The debug object and
transport guards are sealed as well. guardReady is false until successful
finalization and continually checks the sealed function identities. WAV setup,
arming/export and start require revision 4 and finalized guards. A missing or
incomplete guard fails closed before microphone setup.

Storage proxies reject direct property writes/deletes. Financial persistence
methods remain blocked even through saved application callbacks. IndexedDB
store/cursor/schema writes are blocked in addition to write transactions.
WebSocket, EventSource, Worker, SharedWorker and new service-worker registration
are blocked. Staged HTML CSP restricts connections to self and canonical HTTPS
Auth endpoints; form actions/objects/frames are disabled. Fetch/XHR reject STT
and financial API requests. Firebase/partner initialization, cloud restore and
all exports are blocked at their own entries too.

Only the normal Auth session/pending-email/resend storage keys and canonical
Auth requests remain writable/permitted. No real user's token or financial
record is used in tests. This protects the reviewed app code and local-test
workflow; it is not a sandbox against arbitrary hostile injected code, DevTools
or native processes. The APK is not for normal financial use.

## Validation

Node regression: old-wrapper positive control with configured room; patched
original, wrapper and saved references; deferred calls; immutable final bindings;
known future-wrapper changes rejected; low-level storage/network and UI guards.
Existing voice tests cover one-shot WAV, cancellation/digest races, no successful
cancel, missing/replaced hook/session, readiness and PCM format/hash/expiry.

Full-runtime Chromium test serves all staged app files and executes the ENTIRE
index.js, all original wrappers, DOM lifecycle and finalization. The test server
adds only a diagnostic capture of the outer saveAll reference before finalize.
It creates a disposable configured partner-room mock and exercises all 41
financial entries, original _origSaveAll and saved outer wrapper synchronously
and through microtasks. Financial state/storage stay unchanged, partner writes
and underlying financial requests stay zero. Direct Storage properties, IDB
low-level mutations and transports are tested. The actual app Auth refresh
client succeeds against a mock response. Actual startVoiceSession/VoiceUI/local
session capture one synthetic WAV, keep the overlay, never call the parser or
open an editor, and block another capture without a handler.

No real microphone, STT or Vosk recognition is run. The native-origin adapter
and recorder are mocks in Chromium. Android v4 runtime and real microphone remain
unverified until separately authorized installation and manual recording.
A successful desktop test never authorizes recording on the currently installed v3.

## Build and next gate

Use prepare-android.py --local-vosk, then existing JDK21 and offline Gradle in
that generated tree only. verify-apk.py checks signatures, hashes, revision,
versionCode 5, source-order/finalization, wrapper guard counts, CSP and credential
patterns. check-device.py is read-only and compares with the actual installed APK.

Do not install or arm as part of this preparation. After owner installation
permission: repeat live identity/hash gate, preserve financial/session baselines,
install -r only, and check native revision 4, guardReady, actual sealed saveAll,
original reference guard, session and unchanged records without clicking Save.
Keep capture locked until a separate owner authorization. WAV capture/export,
private file permissions/TTL, same-hash Small/Large comparison and deletion are
unchanged from the v3 procedure.
