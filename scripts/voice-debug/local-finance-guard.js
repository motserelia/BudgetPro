// Loaded before index.js ONLY in the isolated local-Vosk APK.
(function(root) {
  'use strict';
  if (root.BudgetPROVoiceDebug?.localOnly) return;
  let guardReady = false, lastState = null;
  const sealed = new Map();
  const runtimeProtected = () => guardReady && [...sealed].every(([name, fn]) => root[name] === fn && Object.getOwnPropertyDescriptor(root, name)?.writable === false);
  const history = [], authKeys = new Set(['budgetpro_auth_session', 'budgetpro_auth_pending_email', 'budgetpro_auth_magic_link_resend_until']);
  const trace = (name, data = {}) => {
    const item = { event: /^[a-z_-]{1,48}$/.test(name) ? name : 'blocked', at: Date.now() };
    for (const key of ['eventType', 'role', 'trusted', 'pointerId']) if (['string', 'boolean', 'number'].includes(typeof data[key])) item[key] = String(data[key]).slice(0, 48);
    history.push(item); if (history.length > 100) history.shift();
  };
  const blocked = () => { trace('financial_handler_blocked'); return false; };
  const messages = {
    ru: { READY: 'Локальный тест: ожидается разрешение захвата WAV.', RECORDING: 'Локальная запись. Аудио не отправляется в облако.', CAPTURE_COMPLETE: 'WAV захвачен локально. Не повторяйте запись. Сообщите о завершении.', CANCELLED: 'Локальная запись отменена.', ERROR: 'Локальный захват недоступен или завершился ошибкой. Новую запись не запускайте.' },
    ka: { READY: 'ლოკალური ტესტი: WAV ჩაწერის ნებართვის მოლოდინი.', RECORDING: 'ლოკალური ჩაწერა. აუდიო ღრუბელში არ იგზავნება.', CAPTURE_COMPLETE: 'WAV ლოკალურად მიღებულია. აღარ გაიმეოროთ ჩაწერა.', CANCELLED: 'ლოკალური ჩაწერა გაუქმებულია.', ERROR: 'ლოკალური ჩაწერა მიუწვდომელია ან შეცდომით დასრულდა.' },
    en: { READY: 'Local test: waiting for WAV capture authorization.', RECORDING: 'Local recording. Audio is not uploaded.', CAPTURE_COMPLETE: 'WAV captured locally. Do not repeat. Report completion.', CANCELLED: 'Local recording cancelled.', ERROR: 'Local capture is unavailable or failed. Do not record again.' },
  };
  root.BudgetPROVoiceDebug = Object.freeze({ localOnly: true, saveBlocked: true, protocolVersion: 3, get guardReady() { return runtimeProtected(); }, buildRevision: 4, trace, blocked,
    finalize(names) {
      if (guardReady) return runtimeProtected();
      const required = ['saveAll','openEditModal','safeDeleteOp','cloudLoad','initFirebase','openPartnerMode','recoverMissingDataInBackground'];
      if (!Array.isArray(names) || !required.every(name => names.includes(name))) throw Error('LOCAL_TEST_GUARD_LIST_INCOMPLETE');
      for (const name of names) {
        const fn = root[name];
        if (typeof fn !== 'function' || !fn.toString().includes('BudgetPROVoiceDebug?.localOnly')) throw Error('LOCAL_TEST_UNGUARDED_RUNTIME_FUNCTION');
      }
      for (const name of names) {
        const fn = root[name]?.constructor?.name === 'AsyncFunction' ? async function localVoskBlocked() { return blocked(); } : function localVoskBlocked() { return blocked(); };
        Object.defineProperty(root, name, { value: fn, writable: false, configurable: false }); sealed.set(name, fn);
      }
      for (const name of ['fetch']) if (typeof root[name] === 'function') Object.defineProperty(root, name, { value: root[name], writable: false, configurable: false });
      for (const [owner, keys] of [[root.XMLHttpRequest?.prototype, ['open','send']], [root.IDBDatabase?.prototype, ['transaction']], [root.indexedDB, ['deleteDatabase']], [root.navigator, ['sendBeacon']], [root.navigator?.serviceWorker, ['register']]]) {
        if (!owner) continue;
        for (const key of keys) if (typeof owner[key] === 'function') Object.defineProperty(owner, key, { value: owner[key], writable: false, configurable: false });
      }
      Object.defineProperty(root, 'BudgetPROVoiceDebug', { value: root.BudgetPROVoiceDebug, writable: false, configurable: false });
      guardReady = true; trace('runtime_sealed'); return runtimeProtected();
    },
    history: () => history.map(item => ({ ...item })),
    showState(state) {
      const lang = root.document?.documentElement.lang || 'en';
      const text = (messages[lang] || messages.en)[state] || messages.en.ERROR;
      root.document?.querySelectorAll('#voiceOverlay [data-status]').forEach(el => { el.textContent = text; });
      if (state !== lastState) { trace('capture_state', { role: state }); lastState = state; }
    },
  });
  // Protect the actual persistence boundary while preserving the normal auth keys.
  if (root.Storage) {
    const proto = root.Storage.prototype, set = proto.setItem, remove = proto.removeItem;
    Object.defineProperties(proto, {
      setItem: { value: function(key, value) { if (authKeys.has(String(key))) return set.call(this, key, value); trace('storage_write_blocked'); }, writable: false, configurable: false },
      removeItem: { value: function(key) { if (authKeys.has(String(key))) return remove.call(this, key); trace('storage_delete_blocked'); }, writable: false, configurable: false },
      clear: { value: function() { trace('storage_clear_blocked'); }, writable: false, configurable: false },
    });
  }
  // Named-property Storage writes bypass prototype setItem in Chromium.
  for (const storageName of ['localStorage', 'sessionStorage']) {
    if (!root[storageName] || !root.Proxy) continue;
    const storage = root[storageName];
    const proxy = new Proxy(storage, {
      get(target, key) { const v = Reflect.get(target, key, target); return typeof v === 'function' ? v.bind(target) : v; },
      set(target, key, value) { if (authKeys.has(String(key))) target.setItem(key, value); else trace('storage_write_blocked'); return true; },
      deleteProperty(target, key) { if (authKeys.has(String(key))) target.removeItem(key); else trace('storage_delete_blocked'); return true; },
      defineProperty() { trace('storage_write_blocked'); return false; },
    });
    Object.defineProperty(root, storageName, { get: () => proxy, configurable: false });
  }
  for (const [klass, methods] of [[root.IDBObjectStore, ['add','put','delete','clear']], [root.IDBCursor, ['update','delete']], [root.IDBDatabase, ['createObjectStore','deleteObjectStore']]]) {
    if (!klass) continue;
    for (const name of methods) if (typeof klass.prototype[name] === 'function') Object.defineProperty(klass.prototype, name, { value() { trace('indexeddb_write_blocked'); throw Error('LOCAL_TEST_READ_ONLY'); }, writable: false, configurable: false });
  }
  if (root.IDBDatabase) {
    const transaction = root.IDBDatabase.prototype.transaction;
    root.IDBDatabase.prototype.transaction = function(stores, mode = 'readonly', ...rest) {
      if (mode !== 'readonly') { trace('indexeddb_write_blocked'); throw Error('LOCAL_TEST_READ_ONLY'); }
      return transaction.call(this, stores, mode, ...rest);
    };
  }
  if (root.indexedDB) root.indexedDB.deleteDatabase = () => { trace('indexeddb_delete_blocked'); throw Error('LOCAL_TEST_READ_ONLY'); };
  const allowedRequest = (input, method) => {
    const u = new URL(typeof input === 'string' || input instanceof URL ? input : input.url, root.location.href);
    const auth = u.protocol === 'https:' && ((u.hostname === 'budget-pro-lski.vercel.app' && /^\/api\/auth\/[a-z-]+$/.test(u.pathname)) || (u.hostname.endsWith('.supabase.co') && u.pathname.startsWith('/auth/v1/')));
    const asset = u.origin === root.location.origin && !u.pathname.startsWith('/api/') && method === 'GET';
    return auth || asset;
  };
  if (root.fetch) {
    const fetch = root.fetch.bind(root);
    root.fetch = (input, options = {}) => {
      const method = String(options.method || input?.method || 'GET').toUpperCase();
      if (!allowedRequest(input, method)) { trace('network_blocked'); return Promise.reject(Error('LOCAL_TEST_NETWORK_BLOCKED')); }
      return fetch(input, options);
    };
  }
  if (root.XMLHttpRequest) {
    const open = root.XMLHttpRequest.prototype.open, send = root.XMLHttpRequest.prototype.send;
    const requests = new WeakMap();
    root.XMLHttpRequest.prototype.open = function(method, url, ...rest) { requests.set(this, { method: String(method).toUpperCase(), url }); return open.call(this, method, url, ...rest); };
    root.XMLHttpRequest.prototype.send = function(body) { const r = requests.get(this); if (!r || !allowedRequest(r.url, r.method)) { trace('network_blocked'); throw Error('LOCAL_TEST_NETWORK_BLOCKED'); } return send.call(this, body); };
  }
  // Firebase can use WebSocket independently of fetch/XHR.
  for (const name of ['WebSocket','EventSource','Worker','SharedWorker']) if (root[name]) Object.defineProperty(root, name, { value: function() { trace('network_blocked'); throw Error('LOCAL_TEST_NETWORK_BLOCKED'); }, writable: false, configurable: false });
  if (root.navigator?.serviceWorker?.register) root.navigator.serviceWorker.register = () => { trace('network_blocked'); return Promise.reject(Error('LOCAL_TEST_NETWORK_BLOCKED')); };
  if (root.navigator?.sendBeacon) root.navigator.sendBeacon = () => { trace('network_blocked'); return false; };
  // Capture-phase guards precede app handlers. Only existing microphone controls
  // and existing voice modal controls are interactive throughout the local test.
  for (const type of ['pointerdown', 'pointerup', 'touchstart', 'touchend', 'pointercancel', 'touchcancel', 'click', 'dblclick', 'keydown', 'submit', 'input', 'change']) {
    root.document?.addEventListener(type, event => {
      const allowed = event.target?.closest?.('#voiceOverlay, #voiceInputBtn, .home-voice-btn');
      if (!allowed || event.target?.closest?.('#saveEditBtn,#deleteItemBtn,#confirmOk,#voiceSaveDraft,#voiceQuickSave,#voiceQuickMore')) {
        event.preventDefault(); event.stopImmediatePropagation(); trace('input_blocked', { eventType: type, trusted: event.isTrusted, pointerId: event.pointerId }); return;
      }
      trace('voice_input', { eventType: type, role: event.target?.closest?.('[data-stop]') ? 'stop' : event.target?.closest?.('[data-cancel]') ? 'cancel' : 'voice', trusted: event.isTrusted, pointerId: event.pointerId });
    }, { capture: true, passive: false });
  }
  trace('guard_installed');
})(globalThis);
