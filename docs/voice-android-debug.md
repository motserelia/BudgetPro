# BudgetPRO: защищённый Android voice debug

Production и его ENV не изменяются. Этот комплект предназначен только для
компьютера разработчика и изолированного debug APK. Google billing/fallback нет.
Реальный Groq запрещён до независимой проверки Free, сессии и ручного запуска.

## Файлы

Новые файлы этого этапа:
- scripts/voice-debug/relay.js — loopback relay и официальный Vercel CLI OIDC;
- scripts/voice-debug/android-bootstrap.js — только debug voice routing/auth probe/save guard;
- scripts/voice-debug/prepare-android.py — изолированное дерево Android в /tmp;
- scripts/voice-debug/verify-apk.py — проверка assets, подписи, package/version и credential patterns;
- scripts/voice-debug/check-device.py — только чтение совместимости установленного APK;
- scripts/voice-debug/check-session.js — фиксированный безопасный вызов app-owned probe через CDP;
- tests/voice/debug-relay.test.js — mock/loopback тесты;
- docs/voice-android-debug.md — инструкция.

Рабочие www/index.js, www/api-config.js, www/index.html, native Android, Auth API,
package/lock не редактировались. Существующие незавершённые изменения сохранены.
Пять уже обновлённых клиентских файлов перенесены в отдельное дерево:
www/index.js и www/voice/{voice-api-client,voice-diagnostics,voice-session,voice-ui}.js.
Остальные исходные Android-assets остаются прежними.

## Relay

Фиксированный upstream:
https://budget-pro-lski-40b8q4kqy-motserelia-s-projects.vercel.app.
Project prj_JXya7HuDChbetag5FjXhWDej2MpV, budget-pro-lski.
Слушает только 127.0.0.1:8139. Разрешены только:
- GET /api/voice/health;
- POST /api/voice/transcribe;
- OPTIONS к этим двум путям.

Host: localhost/127.0.0.1 с фактическим портом. Origin: только
https://budgetpro.app (или отсутствие Origin для локальных инструментов).
Абсолютные URL, //host, кодированные/нормализованные обходы пути, лишние API,
посторонние Host/Origin запрещены. Никакого настраиваемого произвольного upstream.
WAV максимум 960044 bytes, timeout 27 s. Supabase Authorization передаётся как есть;
Cookie/пользовательский Vercel header не пересылаются. TLS-проверка не отключается,
redirect запрещён, входные и выходные размеры ограничены. При отключении клиента
upstream отменяется. SIGINT/SIGTERM закрывает listener и активные соединения.
Логи содержат только method/path без query, размер, статус и счётчик; без аудио,
текста, Authorization, пользовательского sessionId и OIDC.

Официальный `vercel project token budget-pro-lski --scope TEAM --format=json`
вызывается дочерним процессом; stdout с JWT никогда не выводится/не сохраняется.
Проверяются project/team/issuer/audience/environment/expiry. Кеш и единственный
параллельный refresh только в памяти. Криптографическую подпись проверяет Vercel.
Токен добавляется только upstream как x-vercel-trusted-oidc-idp-token.
Постоянных bypass secrets, endpoint получения токенов и ослабления защиты нет.
[CLI](https://vercel.com/docs/cli/project),
[Trusted Sources](https://vercel.com/changelog/trusted-sources-for-deployment-protection).

По умолчанию корректный WAV получает локальный 423 DEBUG_AUDIO_NOT_ARMED и
никогда не достигает Preview. Пустой body разрешён как безопасный auth probe:
после Supabase backend отклонит его до Redis/Groq. Другой невалидный WAV
отклоняется самим relay, поэтому он не доказывает принятие сессии backend.

После всех предпосылок и ручного разрешения оператор может отдельно запустить
relay с --allow-one-ru-audio. Допустим только ru, ровно одна попытка за процесс.
Слот списывается до upstream и не возвращается после ошибки/тайм-аута/429.
Это переключатель оператора, а не проверка тарифа Groq. Пока Free не проверен,
его НЕ использовать. Многократный restart не является разрешением новых тестов.

## Изолированная Android-конфигурация

prepare-android.py копирует Android и только нужные native-модули в /tmp;
node_modules не линкуются на запись и cap sync не запускается. Из проекта
копируются только пять обновлённых JS-файлов. В генерируемом index.html после
index.js добавляется debug bootstrap; оформление и остальная страница прежние.

Только voice/health и voice/transcribe направляются на http://localhost:8139/api.
Все Auth/Magic Link/Refresh/JSONBin/backup URLs остаются production. Исходный
api-config.js побайтово сохраняется, его глобальная базовая конфигурация не меняется.
Package ID pro.budget.app, versionCode 4, versionName 1.3.0 сохраняются.

Origin WebView остаётся https://budgetpro.app: secure context и локальный путь
AudioWorklet не меняются. Debug allowMixedContent включён только в изолированном
дереве. Network Security Config: base cleartext=false, исключения только localhost
и 127.0.0.1, без поддоменов. На Android до API 24 domain-config не поддерживается;
этот тестовый транспорт на таком устройстве не подтверждён и может блокироваться.
[Android network security](https://developer.android.com/privacy-and-security/security-config).
Release-задачи в этом дереве явно запрещены Gradle guard. Не переносить настройки
в реальное android/ или release. Никаких trust-all сертификатов/TLS bypass.

Проверка Local Network Access/разрешений WebView возможна только на телефоне.
PNA preflight обрабатывается исключительно для доверенного origin; это не замена
системному разрешению LNA, если конкретная версия Android/WebView его запросит.
Микрофон, AudioWorklet и реальные PCM-сэмплы без устройства не считаются проверенными.

В debug runtime заблокированы quick-save, save-and-continue и Save полного
голосового редактора. Штатная финансовая модель исходного приложения не меняется;
это дополнительный тестовый interlock против записи продиктованного черновика.
Остальные финансовые действия не тестировать и не выполнять.

## Воспроизведение подготовки оператором

Использовать Node 24 и уже установленный SDK/JDK 21. Ничего не устанавливать.
```
python3 scripts/voice-debug/prepare-android.py
# Путь дерева напечатан безопасно и сохранён в /tmp/budgetpro-voice-debug-stage.json.
# В этом дереве android/:
./gradlew :app:assembleDebug --offline --no-daemon
# Из ~/BudgetPRO:
python3 scripts/voice-debug/verify-apk.py
```
Текущий artifact/report: /tmp/budgetpro-voice-debug-stage.json и
/tmp/budgetpro-voice-debug-apk-report.json. Повторная prepare создаёт новый каталог;
не собирать случайно основной Android-проект вместо изолированного.

## Телефон и установка

Если телефона нет, STOP после подготовки. Пользователь:
1. Включает Developer options (семь нажатий на номер сборки, если нужно).
2. Включает USB debugging, подключает разблокированный телефон кабелем передачи данных.
3. Подтверждает RSA-авторизацию своего компьютера на телефоне.
4. Сообщает, что телефон подключён. APK вручную пока не устанавливает.

Далее агент выполняет только чтение:
```
python3 scripts/voice-debug/check-device.py
```
Сравниваются package, versionCode и SHA-256 сертификата нового/установленного APK.
Читается только установленный base APK для подписи, не /data/data/ и не сеансы.
Несовместимая подпись или downgrade → STOP. Нельзя uninstall/pm clear или удалять
профиль ради установки. Предыдущее локальное APK с той же подписью не доказывает,
что такая же подпись у установленного на телефоне приложения.

Только после положительного compatibility gate допустимо штатное обновление -r
без удаления приложения. Сначала повторить проверку самого APK. Установка в этом
этапе не выполнялась. При 0/multiple/unauthorized устройствах script не устанавливает.

## USB relay и положительная Supabase-проверка

Когда APK проверен/установлен, обычный вход BudgetPRO выполняет сам пользователь.
Токены в чат/терминал не копируются. Серверные настройки Auth остаются прежними.
Оператор запускает relay БЕЗ аудио-разрешения:
```
/tmp/node-v24.22.2-linux-x64/bin/node scripts/voice-debug/relay.js
adb reverse tcp:8139 tcp:8139
```
При обычной работе CLI уже авторизован. Токен вручную в команду не подставляется.
[ADB reverse](https://developer.android.com/develop/ui/views/layout/webapps/access-local-server).

На открытом debug BudgetPRO:
```
/tmp/node-v24.22.2-linux-x64/bin/node scripts/voice-debug/check-session.js
```
Он через фиксированный CDP Runtime.evaluate вызывает только
BudgetPROVoiceDebug.checkSession() внутри самого приложения. Приложение использует
свой штатный auth/refresh lifecycle и отправляет пустой WAV. Возвращаются только
ok/error/httpStatus. Нет чтения localStorage/session через DevTools, извлечения
access/refresh token, Runtime.enable console logging или микрофонной записи.
Временный adb forward автоматически удаляется.
[CDP Runtime](https://chromedevtools.github.io/devtools-protocol/tot/Runtime/).
Ожидается 400 INVALID_AUDIO вместо 401 VOICE_AUTH_REQUIRED. Если 401 — не запускать STT.
Физическое выполнение CDP-проверки без телефона не подтверждено.

## Единственный первый STT — пока НЕ разрешён к запуску

Нужны подтверждённый Free в организации Groq (флаг ENV не доказательство),
действующая сессия, успешный relay, проверка Redis, готовый телефон и ручной старт.
Настоящий Redis из отдельной Preview BUILD был подтверждён ранее: PING/EVAL,
дедупликация, minute limits/cooldown, fail-closed. Исходный /transcribe Function
с настоящей сессией ещё не прошёл сквозной тест.

После этих проверок оператор отдельно разрешает одну попытку ru. Пользователь
вручную произносит 3–5 секунд «Потратил восемь лари на кофе». Автоповторов нет.
При любой неудаче остановиться. Проверить отдельно:
- разрешение микрофона, реальные PCM metrics и сформированный WAV на устройстве;
- единственный relay upstream и статус ответа;
- backend/Supabase/Redis этапы и ответ Groq;
- реальный transcript и затем черновик: расход, сумма 8, GEL, категория;
- отсутствие сохранённой финансовой операции.

Relay не логирует transcript. Его можно посмотреть только в приложении/его
memory-only diagnostics для этой согласованной тестовой фразы.
Ни текст парсера, ни mock WAV не считать реальной аудиотранскрипцией.
После успешного RU — отдельный план KA/EN/auto, каждую запись запускает пользователь.
Текущий one-shot relay сознательно ограничен ru и не разрешает эти языки автоматически.

Остановка: Ctrl+C relay; оператор удаляет adb reverse:
```
adb reverse --remove tcp:8139
```
Проверить, что порт закрыт. Не оставлять OIDC/ключи в файлах; в реализации их нет.

## Ограничения текущего результата

APK собран/проверен статически, но не установлен. ADB: 0 устройств.
Подпись совпала только с предыдущим ЛОКАЛЬНЫМ APK, не с телефоном.
Настоящая пользовательская Supabase-сессия UNKNOWN. Free аккаунта Groq UNKNOWN.
Настоящий STT, transcript и сумма из аудио не проверены. Нельзя объявлять систему
работающей до реального Android-аудиотеста. Production/ENV не менялись, deploy нет.

## Выполненные проверки этого этапа

- Node 24: 227 tests, 185 PASS, 0 FAIL, 42 SKIP (нет человеческих WAV fixtures).
- 14 новых relay/debug tests: WAV byte preservation, fixed upstream, OIDC claims/cache,
  CORS/Host/path guards, default STT lock, atomic one-shot, 429/no retry, timeout,
  disconnect/cancel, safe logs/headers, nonvoice production routing, auth probe,
  voice-save interlocks. Это mocks/loopback, не качество ASR.
- Настоящий relay → защищённый Preview: health 200 groq/whisper-large-v3,
  preflight 204 с PNA header, отсутствующий/неверный Bearer 401.
  Синтетический WAV получил локальный 423, upstream не вызывался.
  Всего 5 локальных проверок, 4 upstream запроса, audioAttempts=0. Relay остановлен.
- Offline Gradle assembleDebug: PASS. Release dry-run заблокирован явным guard.
- APK assets hashes, compiled loopback network profile и debug flag: PASS.
  Credential-pattern scan всех ZIP entries: 0 совпадений; OIDC header/relay source
  в APK отсутствуют. Ни Groq, ни Redis секреты для сборки не извлекались.
- Package pro.budget.app, versionCode 4; подпись совпадает с предыдущим локальным
  debug APK. Это НЕ проверка подписи установленного приложения.
- Исходный Preview READY; production обоих Vercel-проектов не изменён; новых deploy нет.
- Python AST, JS syntax и git diff --check: PASS.

Артефакт:
/tmp/budgetpro-voice-debug-_o7fwimd/android/app/build/outputs/apk/debug/app-debug.apk
SHA-256: 03487d62a33bbf39f25523af9ab5c5add91c537f1fb5101a95d3960172337519

Актуальные машинные evidence:
- /tmp/budgetpro-debug-relay-live.json;
- /tmp/budgetpro-voice-debug-apk-report.json;
- /tmp/budgetpro-voice-debug-release-guard.json;
- /tmp/budgetpro-voice-debug-vercel.json;
- /tmp/budgetpro-voice-debug-suite-final.log.

Фактического transcript нет. Сумма из настоящего аудио не проверена. Redis real
BUILD-проверка подтверждена прошлым этапом, а runtime-связка с настоящим Supabase
пользователем и Groq ещё требует физического теста. ADB-устройства нет: здесь STOP.
