(function(root) {
  'use strict';
  const words = {
    ru: { authenticating: 'Проверяю вход…', login: 'Войти в аккаунт', ready: 'Готов', requesting: 'Запрашиваем микрофон', listening: 'Слушаю', speech: 'Речь обнаружена', sending: 'Отправляю', transcribing: 'Распознаю', done: 'Готово', 'no-speech': 'Не распознано', error: 'Ошибка сервера', language: 'Язык речи', mode: 'Режим записи', auto: 'Автоматически', quiet: 'Тихая речь', noise: 'Шумное место', start: 'Начать запись', stop: 'Остановить', cancel: 'Отмена', retry: 'Повторить', use: 'Использовать текст', copy: 'Скопировать диагностику', save: 'Сохранить последнюю тестовую запись', floating: 'Плавающая кнопка', back: 'Назад' },
    en: { authenticating: 'Checking sign-in…', login: 'Sign in', ready: 'Ready', requesting: 'Requesting microphone', listening: 'Listening', speech: 'Speech detected', sending: 'Sending', transcribing: 'Recognizing', done: 'Done', 'no-speech': 'Not recognized', error: 'Server error', language: 'Speech language', mode: 'Recording mode', auto: 'Automatic', quiet: 'Quiet speech', noise: 'Noisy place', start: 'Start recording', stop: 'Stop', cancel: 'Cancel', retry: 'Retry', use: 'Use text', copy: 'Copy diagnostics', save: 'Save last test recording', floating: 'Floating button', back: 'Back' },
    ka: { authenticating: 'შესვლის შემოწმება…', login: 'ანგარიშში შესვლა', ready: 'მზადაა', requesting: 'მიკროფონზე წვდომის მოთხოვნა', listening: 'გისმენთ', speech: 'მეტყველება აღმოჩენილია', sending: 'იგზავნება', transcribing: 'ამოცნობა', done: 'მზადაა', 'no-speech': 'ვერ ამოიცნო', error: 'სერვერის შეცდომა', language: 'მეტყველების ენა', mode: 'ჩაწერის რეჟიმი', auto: 'ავტომატურად', quiet: 'ჩუმი მეტყველება', noise: 'ხმაურიანი ადგილი', start: 'ჩაწერის დაწყება', stop: 'გაჩერება', cancel: 'გაუქმება', retry: 'ხელახლა', use: 'ტექსტის გამოყენება', copy: 'დიაგნოსტიკის კოპირება', save: 'ბოლო ტესტის ჩანაწერის შენახვა', floating: 'მცურავი ღილაკი', back: 'უკან' },
  };
  const errors = {
    VOICE_DRAFT_UNAVAILABLE: ["Не удалось подготовить черновик. Перезапустите приложение.", "Could not prepare the draft. Restart the app.", "მონახაზი ვერ მომზადდა. გადატვირთეთ აპლიკაცია."],
    EMPTY_TRANSCRIPT: ["Не удалось распознать речь. Повторите запись.", "No speech recognized. Please try again.", "მეტყველება ვერ ამოიცნო. სცადეთ ხელახლა."],
    MODEL_NOT_FOUND: ["Локальная модель для выбранного языка отсутствует в приложении. Выберите другой язык.", "The local model for this language is not bundled. Choose another language.", "არჩეული ენის ლოკალური მოდელი აპლიკაციაში არ არის. აირჩიეთ სხვა ენა."],
    MODEL_LOAD_FAILED: ["Не удалось загрузить локальную языковую модель.", "Could not load the local speech model.", "ენის ლოკალური მოდელი ვერ ჩაიტვირთა."],
    INVALID_PCM: ["Некорректный формат записи. Повторите запись.", "Invalid recording format. Please try again.", "ჩანაწერის ფორმატი არასწორია. სცადეთ ხელახლა."],
    RECOGNIZER_FAILED: ["Локальное распознавание завершилось ошибкой.", "Local speech recognition failed.", "ლოკალური ამოცნობა ვერ დასრულდა."],
    RECORDING_INTERRUPTED: ["Запись прервана. Начните новую попытку.", "Recording interrupted. Please try again.", "ჩაწერა შეწყდა. სცადეთ ხელახლა."],
    VOSK_NATIVE_UNAVAILABLE: ["Локальный Vosk не включён в эту Android-сборку.", "Local Vosk is unavailable in this Android build.", "ამ Android ვერსიაში ლოკალური Vosk მიუწვდომელია."],
    VOSK_LANGUAGE_REQUIRED: ["Для локального распознавания выберите Русский, English или ქართული.", "Select Russian, English or Georgian for local recognition.", "ლოკალური ამოცნობისთვის აირჩიეთ ქართული, რუსული ან ინგლისური."],
    VOSK_BUSY: ["Дождитесь завершения предыдущей записи.", "Wait for the previous recording to finish.", "დაელოდეთ წინა ჩანაწერის დასრულებას."],
    WHISPER_NATIVE_UNAVAILABLE: ["Локальный Whisper не включён в эту Android-сборку.", "Local Whisper is unavailable in this Android build.", "ამ Android ვერსიაში ლოკალური Whisper მიუწვდომელია."],
    WHISPER_LANGUAGE_REQUIRED: ["Для Whisper выберите Русский, English, ქართული или «Автоматически».", "Select Russian, English, Georgian or Automatic for Whisper.", "Whisper-ისთვის აირჩიეთ ქართული, რუსული, ინგლისური ან „ავტომატურად“."],
    WHISPER_BUSY: ["Дождитесь завершения предыдущего распознавания Whisper.", "Wait for the previous Whisper recognition to finish.", "დაელოდეთ წინა Whisper-ის ამოცნობის დასრულებას."],
    VOICE_MULTIPLE_OPERATIONS: ["Распознано несколько сумм. Продиктуйте каждую операцию отдельно.", "Multiple amounts detected. Dictate each operation separately.", "აღმოჩენილია რამდენიმე თანხა. ოპერაციები ცალ-ცალკე თქვით."],
    VOICE_AMBIGUOUS_AMOUNT: ["Сумма или валюта неоднозначна. Уточните фразу.", "The amount or currency is ambiguous. Clarify the phrase.", "თანხა ან ვალუტა ორაზროვანია. დააზუსტეთ ფრაზა."],
    VOICE_CURRENCY_MISMATCH: ["Валюта в речи отличается от валюты формы. Сначала выберите нужную валюту.", "Spoken currency differs from the form currency. Select the correct currency first.", "ნათქვამი ვალუტა ფორმის ვალუტას არ ემთხვევა. აირჩიეთ შესაბამისი ვალუტა."],

    DEBUG_AUDIO_NOT_ARMED: ['Тестовая отправка заблокирована. Дождитесь разрешения следующей попытки.', 'Test upload is locked. Wait for the next attempt to be authorized.', 'ტესტის გაგზავნა დაბლოკილია. დაელოდეთ შემდეგი მცდელობის ნებართვას.'],
    DEBUG_LANGUAGE_MISMATCH: ['Для этой тестовой попытки выбран другой язык.', 'A different language is selected for this test attempt.', 'ამ ტესტისთვის სხვა ენაა არჩეული.'],
    ASR_QUOTA_EXCEEDED: ['Исчерпан бесплатный лимит распознавания. Подождите до его обновления. Платный сервис не включается.', 'Free speech quota exhausted. Wait for it to reset. No paid fallback is used.', 'ამოიწურა ამოცნობის უფასო ლიმიტი. დაელოდეთ მის განახლებას. ფასიანი სერვისი არ ჩაირთვება.'],
    RATE_LIMITED: ['Слишком много запросов. Подождите минуту.', 'Too many requests. Please wait a minute.', 'ძალიან ბევრი მოთხოვნაა. დაელოდეთ ერთ წუთს.'],
    ASR_PROVIDER_AUTH_FAILED: ['Серверный ключ распознавания отклонён. Требуется проверка настройки сервера.', 'Speech provider rejected the server key. Server configuration needs checking.', 'ამოცნობის პროვაიდერმა სერვერის გასაღები უარყო. საჭიროა სერვერის პარამეტრების შემოწმება.'],
    ASR_UNAVAILABLE: ['Сервис распознавания временно недоступен. Автоматического повтора нет.', 'Speech service is temporarily unavailable. No automatic retry is made.', 'ამოცნობის სერვისი დროებით მიუწვდომელია. ავტომატური გამეორება არ ხდება.'],
    ASR_LIMITS_NOT_CONFIGURED: ['Защита бесплатной квоты ещё не настроена на сервере.', 'Free quota protection is not configured on the server yet.', 'სერვერზე უფასო კვოტის დაცვა ჯერ არ არის გამართული.'],
    ASR_LIMITS_UNAVAILABLE: ['Проверка бесплатной квоты недоступна. Запрос не отправлен провайдеру.', 'Free quota verification is unavailable. No request was sent to the provider.', 'უფასო კვოტის შემოწმება მიუწვდომელია. მოთხოვნა პროვაიდერთან არ გაგზავნილა.'],
    ASR_INVALID_RESPONSE: ['Сервис распознавания вернул некорректный ответ.', 'Speech service returned an invalid response.', 'ამოცნობის სერვისმა არასწორი პასუხი დააბრუნა.'],
    ASR_REQUEST_REJECTED: ['Сервис распознавания отклонил запись.', 'Speech service rejected the recording.', 'ამოცნობის სერვისმა ჩანაწერი უარყო.'],
    DUPLICATE_SESSION: ['Эта запись уже отправлена. Повторная обработка заблокирована.', 'This recording has already been submitted. Duplicate processing is blocked.', 'ეს ჩანაწერი უკვე გაგზავნილია. განმეორებითი დამუშავება დაბლოკილია.'],
    AUTH_REFRESH_FAILED: ['Не удалось обновить сеанс входа. Проверьте интернет и повторите попытку или войдите снова.', 'Could not refresh your session. Check internet and retry, or sign in again.', 'სესიის განახლება ვერ მოხერხდა. შეამოწმეთ ინტერნეტი და სცადეთ ხელახლა ან შედით თავიდან.'],
    OFFLINE: ['Для голосового распознавания требуется интернет.', 'Voice recognition requires internet.', 'ხმოვანი ამოცნობისთვის საჭიროა ინტერნეტი.'],
    MICROPHONE_DENIED: ['Нет разрешения на микрофон.', 'Microphone permission denied.', 'მიკროფონის ნებართვა არ არის.'],
    MICROPHONE_MISSING: ['Нет микрофона.', 'No microphone.', 'მიკროფონი ვერ მოიძებნა.'],
    VOICE_AUTH_REQUIRED: ['Войдите в облачный аккаунт для голосового ввода. Локальный финансовый профиль не означает вход в аккаунт.', 'Sign in to use voice input.', 'ხმოვანი შეყვანისთვის შედით ანგარიშში.'],
    STT_NOT_CONFIGURED: ['Сервер распознавания ещё не настроен.', 'Speech server is not configured yet.', 'ამოცნობის სერვერი ჯერ არ არის გამართული.'],
    VOICE_AUTH_NOT_CONFIGURED: ['Авторизация голосового сервера не настроена.', 'Voice server authentication is not configured.', 'ხმოვანი სერვერის ავტორიზაცია არ არის გამართული.'],
    AUTH_ERROR: ['Ошибка Google credentials на сервере.', 'Server Google credentials error.', 'სერვერის Google credentials შეცდომა.'],
    CORS_DENIED: ['Сервер не разрешает подключение из этого приложения.', 'Server does not allow this application origin.', 'სერვერი ამ აპლიკაციის origin-ს არ უშვებს.'],
    'invalid-script': ['Распознавание вернуло текст не на выбранном языке. Повторите запись.', 'Recognition returned another script. Please try again.', 'ამოცნობამ სხვა ენის ტექსტი დააბრუნა. სცადეთ ხელახლა.'],
    NO_SPEECH: ['Не удалось распознать речь.', 'Could not recognize speech.', 'მეტყველება ვერ ამოიცნო.'],
    NETWORK_ERROR: ['Не удалось подключиться к распознаванию речи.', 'Could not connect to speech recognition.', 'ხმოვან ამოცნობასთან დაკავშირება ვერ მოხერხდა.'],
    TIMEOUT: ['Время ожидания распознавания истекло. Повторите запись.', 'Recognition timed out. Please try again.', 'ამოცნობის დრო ამოიწურა. სცადეთ ხელახლა.'],
  };
  function errorText(code, lang, speechLang) {
    const i = { ru: 0, en: 1, ka: 2 }[lang] ?? 1;
    if (code === 'MICROPHONE_PERMISSION_DENIED') code='MICROPHONE_DENIED';
    if (String(code || '').startsWith('MICROPHONE_') && code !== 'MICROPHONE_DENIED' && code !== 'MICROPHONE_MISSING') code='RECORDING_INTERRUPTED';
    if (speechLang === 'ka' && ['NO_SPEECH', 'invalid-script'].includes(code)) return ['Не удалось распознать грузинскую речь. Повторите запись.', 'Could not recognize Georgian speech. Please try again.', 'ქართული მეტყველება ვერ ამოიცნო. სცადეთ ხელახლა.'][i];
    if (['API_DISABLED', 'BILLING_DISABLED', 'PERMISSION_DENIED', 'REGION_UNAVAILABLE', 'QUOTA_EXCEEDED'].includes(code)) return ({ru: 'Ошибка настройки Google: ', en: 'Google configuration error: ', ka: 'Google კონფიგურაციის შეცდომა: '}[lang] || 'Google error: ') + code;
    return (errors[code] || ['Ошибка сервера распознавания. Повторите запись.', 'Speech server error. Please try again.', 'ამოცნობის სერვერის შეცდომა. სცადეთ ხელახლა.'])[i];
  }
  function style() {
    if (document.getElementById('voiceV2Style')) return;
    const el = document.createElement('style'); el.id = 'voiceV2Style'; el.textContent = `.voice-v2-panel{padding:24px;max-width:620px;margin:auto;display:grid;gap:16px;background:var(--card-bg,#fff);color:var(--text,#181828);border-radius:24px;border:1px solid #8885}.voice-v2-panel label{display:flex;justify-content:space-between;gap:12px}.voice-v2-panel select,.voice-v2-panel textarea{font:inherit;padding:10px;border:1px solid #8887;border-radius:12px;background:transparent;color:inherit}.voice-v2-panel textarea{width:100%;box-sizing:border-box;min-height:100px}.voice-v2-actions{display:flex;gap:8px;flex-wrap:wrap}.voice-v2-actions button{font:inherit;padding:10px 16px;border:1px solid #8887;border-radius:14px;cursor:pointer}.voice-v2-meter{height:12px;background:#8883;border-radius:8px;overflow:hidden}.voice-v2-meter div{height:100%;width:0;background:#ef825d;transition:width 80ms}.voice-v2-panel pre{white-space:pre-wrap;overflow-wrap:anywhere;max-height:320px;overflow:auto}.voice-v2-overlay{position:fixed;inset:0;z-index:99998;display:flex;align-items:center;justify-content:center;background:#090918cc;padding:20px}.voice-v2-overlay .voice-v2-panel{background:#211d36;color:#fff;min-width:260px}.voice-v2-orb{font-size:56px;text-align:center}.voice-v2-panel button:disabled{opacity:.45;cursor:default}`;
    el.textContent += `
html body .voice-v2-overlay { box-sizing:border-box; padding:calc(16px + var(--safe-top, env(safe-area-inset-top, 0px))) 16px calc(16px + var(--safe-bottom, env(safe-area-inset-bottom, 0px))); animation:voiceWindowIn 180ms ease-out; }
html body .voice-v2-overlay .voice-v2-panel { box-sizing:border-box; width:min(100%,460px); min-width:0; max-height:calc(100dvh - 48px - var(--safe-top,0px) - var(--safe-bottom,0px)); overflow:auto; padding:24px 18px 18px; background:linear-gradient(var(--card-bg),var(--card-bg)),var(--cream); color:var(--text); border-color:var(--cream-border); gap:18px; }
html body .voice-v2-panel [data-status] { line-height:1.45; text-align:center; overflow-wrap:normal; word-break:normal; }
html body .voice-v2-actions { gap:10px; }
html body .voice-v2-actions button { min-height:48px; min-width:44px; flex:1 1 max(140px, 8.5em); background:var(--primary-pale); color:var(--text); border-color:var(--cream-border); white-space:normal; word-break:normal; line-height:1.3; }
html body .voice-v2-panel [hidden] { display:none !important; }
html body .voice-v2-panel [data-stop],html body .voice-v2-panel [data-login] { border-color:var(--primary); font-weight:800; }
html body .voice-v2-orb { position:relative; display:grid; place-items:center; width:100px; height:100px; margin:0 auto; border-radius:50%; color:var(--primary); background:var(--primary-pale); }
html body .voice-v2-orb svg { width:48px; height:48px; }
html body .voice-v2-orb::before, html body .voice-v2-orb::after { content:''; position:absolute; inset:5px; border:2px solid currentColor; border-radius:50%; pointer-events:none; transform:scale(calc(1 + var(--voice-level,0)*.24)); opacity:calc(.08 + var(--voice-level,0)*.4); transition:transform 100ms linear,opacity 140ms linear; }
html body .voice-v2-orb::after { inset:-5px; opacity:calc(var(--voice-level,0)*.22); }
html body .voice-v2-audiogram { display:flex; align-items:center; justify-content:center; gap:5px; height:64px; color:var(--primary); }
html body .voice-v2-audiogram span { display:block; height:56px; width:7px; max-width:5%; border-radius:8px; background:currentColor; transform:scaleY(.06); transition:transform 110ms linear; }
html body .voice-v2-meter div { background:var(--primary); }
html body .voice-v2-panel:is([data-state='sending'],[data-state='transcribing']) .voice-v2-orb::before { inset:-5px; opacity:.6; border-style:dashed; animation:voiceProcessing 3s linear infinite; }
html body .voice-v2-overlay.closing { opacity:0; transition:opacity 180ms ease; pointer-events:none; }
@keyframes voiceWindowIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
@keyframes voiceProcessing { to { transform:rotate(360deg); } }
@media(prefers-reduced-motion:reduce) { html body .voice-v2-overlay, html body .voice-v2-orb::before { animation:none !important; } html body .voice-v2-overlay,html body .voice-v2-audiogram span,html body .voice-v2-orb::before,html body .voice-v2-orb::after { transition:none !important; } }
`;
    document.head.appendChild(el);
  }
  function visualMarkup() {
    return `<div class="voice-v2-orb" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10v1a7 7 0 0 0 14 0v-1M12 18v4M8 22h8"/></svg></div><div class="voice-v2-audiogram" aria-hidden="true">${'<span></span>'.repeat(15)}</div>`;
  }
  function status(container, next, lang) {
    const copy = words[lang] || words.en, active = root.BudgetPROVoiceModule.isActive();
    const recording = ['listening', 'speech'].includes(next.status);
    const authError = next.error === 'VOICE_AUTH_REQUIRED';
    const failed = ['error', 'no-speech'].includes(next.status);
    const panel = container.querySelector('.voice-v2-panel') || container;
    panel.dataset.state = next.status;
    const text = next.error ? errorText(next.error, lang, root.BudgetPROVoiceModule.getLanguage()) : copy[next.status] || copy.ready;
    const label = container.querySelector('[data-status]');
    if (label.textContent !== text) label.textContent = text;
    container.querySelector('[data-meter]').style.width = `${(recording ? next.meter || 0 : 0) * 100}%`;
    container.querySelectorAll('[data-start]').forEach(el => {
      el.disabled = active;
      el.hidden = authError || (el.hasAttribute('data-retry') && !failed);
    });
    container.querySelectorAll('[data-login]').forEach(el => el.hidden = !authError && next.error !== 'AUTH_REFRESH_FAILED');
    container.querySelectorAll('[data-stop]').forEach(el => { el.disabled = !recording; el.hidden = !recording; });
    container.querySelectorAll('select').forEach(el => el.disabled = active);
    // RMS comes from the existing PCM recorder. The bars show recent measured levels,
    // never random/decorative motion and never a second microphone stream.
    const level = recording ? Math.min(1, Math.max(0, Number(next.meter) || 0)) : 0;
    panel.style.setProperty('--voice-level', level);
    const bars = container.querySelectorAll('.voice-v2-audiogram span');
    const levels = panel._voiceLevels || (panel._voiceLevels = Array(15).fill(0));
    if (recording) { levels.shift(); levels.push(level); } else levels.fill(0);
    bars.forEach((bar, i) => bar.style.transform = `scaleY(${Math.max(.06, levels[i])})`);
    const report = container.querySelector('[data-report]'); if (report) report.textContent = root.VoiceDiagnostics.format();
    const draft = container.querySelector('textarea'); if (draft && next.status === 'authenticating') draft.value = '';
    else if (draft && next.transcript) draft.value = next.transcript;
    const use = container.querySelector('[data-use]'); if (use) use.disabled = active || !next.transcript;
  }
  function openOverlay(lang, begin, login) {
    style(); const copy = words[lang] || words.en;
    document.querySelector('#voiceOverlay.closing')?.remove();
    const overlay = document.createElement('div'); overlay.className = 'voice-v2-overlay'; overlay.id = 'voiceOverlay';
    overlay.setAttribute('role', 'dialog'); overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', lang === 'ru' ? 'Голосовой ввод' : lang === 'ka' ? 'ხმოვანი შეყვანა' : 'Voice input');
    overlay.innerHTML = `<div class="voice-v2-panel">${root.VoiceApiClient?.isLocal?.() ? `<label>${copy.language}<select data-language><option value="auto" disabled>— ${copy.language} —</option><option value="ru">Русский</option><option value="en">English</option><option value="ka">ქართული</option></select></label>` : ""}${visualMarkup()}<div data-status role="status" aria-live="polite"></div><div class="voice-v2-meter"><div data-meter></div></div><div class="voice-v2-actions"><button data-stop hidden>${copy.stop}</button><button data-cancel>${copy.cancel}</button><button data-start data-retry hidden>${copy.retry}</button><button data-login hidden>${copy.login}</button></div></div>`;
    document.body.appendChild(overlay);
    const languageSelect=overlay.querySelector('[data-language]');
    if(languageSelect){languageSelect.value=root.BudgetPROVoiceModule.getLanguage();languageSelect.onchange=e=>root.BudgetPROVoiceModule.setLanguage(e.target.value);}
    let unsub = root.BudgetPROVoiceModule.subscribe(next => status(overlay, next, lang));
    overlay.querySelector('[data-stop]').onclick = () => root.BudgetPROVoiceModule.stop();
    let closed = false;
    const close = () => {
      if (closed) return; closed = true; unsub?.(); unsub = null;
      overlay.classList.add('closing');
      const reduced = root.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
      setTimeout(() => overlay.remove(), reduced ? 0 : 180);
    };
    overlay.querySelector('[data-cancel]').onclick = () => { root.BudgetPROVoiceModule.cancel(); close(); };
    overlay.querySelector('[data-start]').onclick = () => { if (!root.BudgetPROVoiceModule.isActive()) begin(close, 'overlay_retry'); };
    overlay.querySelector('[data-login]').onclick = () => { root.BudgetPROVoiceModule.cancel(); close(); login?.(); };
    return close;
  }
  function renderSettings({ container, lang, begin, use, back, login, floating, setFloating, cloudConsent, setCloudConsent, cloudLabel, cloudHint }) {
    style(); const copy = words[lang] || words.en, voice = root.BudgetPROVoiceModule;
    container.innerHTML = `<div class="voice-v2-panel"><div class="voice-v2-actions"><button data-back>← ${copy.back}</button></div><h2>🎤 ${lang === 'ru' ? 'Голосовой ввод' : lang === 'ka' ? 'ხმოვანი შეყვანა' : 'Voice input'}</h2><label>${copy.floating}<input type="checkbox" data-floating></label>${cloudLabel ? `<label>${cloudLabel}<input type="checkbox" data-cloud-consent></label><div style="margin:-6px 0 6px;font-size:12px;line-height:1.4;opacity:.72;">${cloudHint || ''}</div>` : ''}<label>${copy.language}<select data-language><option value="auto">${copy.auto}</option><option value="ru">Русский</option><option value="en">English</option><option value="ka">ქართული</option></select></label><label>${copy.mode}<select data-mode><option value="auto">${copy.auto}</option><option value="quiet">${copy.quiet}</option><option value="noise">${copy.noise}</option></select></label>${visualMarkup()}<div data-status role="status" aria-live="polite"></div><div class="voice-v2-meter"><div data-meter></div></div><div class="voice-v2-actions"><button data-start>${copy.start}</button><button data-stop>${copy.stop}</button><button data-cancel>${copy.cancel}</button></div><textarea aria-label="Transcript"></textarea><div class="voice-v2-actions"><button data-start data-retry>${copy.retry}</button><button data-login hidden>${copy.login}</button><button data-use>${copy.use}</button></div><details><summary>Voice Input Diagnostics</summary><pre data-report></pre><div class="voice-v2-actions"><button data-copy>${copy.copy}</button><button data-save hidden>${copy.save}</button></div></details></div>`;
    container.querySelector('[data-language]').value = voice.getLanguage(); container.querySelector('[data-mode]').value = voice.getMode(); container.querySelector('[data-floating]').checked = floating;
    container.querySelector('[data-language]').onchange = e => voice.setLanguage(e.target.value);
    container.querySelector('[data-mode]').onchange = e => voice.setMode(e.target.value);
    container.querySelector('[data-floating]').onchange = e => setFloating(e.target.checked);
    const consentBox = container.querySelector('[data-cloud-consent]');
    if (consentBox) { consentBox.checked = cloudConsent === 'cloud'; consentBox.onchange = e => setCloudConsent?.(e.target.checked ? 'cloud' : 'local'); }
    container.querySelectorAll('[data-start]').forEach(el => el.onclick = () => { if (!voice.isActive()) begin({ settings: true, diagnosticSource: el.hasAttribute('data-retry') ? 'settings_retry' : 'settings_start' }); });
    container.querySelector('[data-login]').onclick = () => { voice.cancel(); login?.(); };
    container.querySelector('[data-stop]').onclick = () => voice.stop(); container.querySelector('[data-cancel]').onclick = () => voice.cancel(); container.querySelector('[data-back]').onclick = back;
    container.querySelector('[data-use]').onclick = () => { const text = container.querySelector('textarea').value; const validation = root.VoiceTranscriptValidator.validateTranscript(text, voice.getLanguage()); if (validation.valid) use(text); else container.querySelector('[data-status]').textContent = errorText(validation.reason, lang, voice.getLanguage()); };
    container.querySelector('[data-copy]').onclick = async () => { try { await navigator.clipboard.writeText(root.VoiceDiagnostics.format()); } catch { container.querySelector('[data-report]').focus(); } };
    container.querySelector('[data-save]').hidden = !root.VoiceDiagnostics.isDeveloper(); container.querySelector('[data-save]').onclick = () => root.VoiceDiagnostics.save();
    return voice.subscribe(next => status(container, next, lang));
  }
  root.VoiceUI = { openOverlay, renderSettings, errorText };
})(globalThis);
