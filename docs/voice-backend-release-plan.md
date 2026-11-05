# Изолированная подготовка voice backend — 2026-11-02

Production не публиковался. Google Cloud, IAM, billing, credentials и Vercel ENV не изменялись. Платных STT-запросов не выполнялось.

## Причина 404 и проверенная база

Цель: `budget-pro-lski`, `prj_JXya7HuDChbetag5FjXhWDej2MpV`, домен `https://budget-pro-lski.vercel.app`.

Действующий production: `dpl_8Pv2eQR3EByprDH7ZyJye7dp7KVJ`. Все 150 опубликованных исходников сверены по SHA-1 с сохранённой изолированной auth-публикацией `/tmp/budgetpro-auth-release-zhgssc9m`; расхождений нет. Voice endpoints и серверные зависимости в этой публикации отсутствуют. Отдельные проверки production GET health и OPTIONS transcribe возвращают 404.

Причина: предыдущая изолированная публикация содержала только согласованное исправление Magic Link и старую production-базу. Новые локальные voice-файлы в неё не включались. `rootDirectory=null`, `outputDirectory=www`: API должен оставаться в корневом `api/`, переносить его в `www/api/` не требуется.

## Точный состав публикации

Изолированная копия: `/tmp/budgetpro-voice-release-a093i77a`.
Патч относительно действующего production: `/tmp/budgetpro-voice-backend.patch`; `git apply --check` на чистой production-базе проходит.
Манифест с SHA-256: `/tmp/budgetpro-voice-release-plan.json`.

Добавляются восемь файлов:

1. `api/voice/transcribe.js`
2. `api/voice/health.js`
3. `server/voice/config.js`
4. `server/voice/cors.js`
5. `server/voice/google-client.js`
6. `server/voice/google-errors.js`
7. `www/api-config.js`
8. `www/voice/transcript-validator.js`

Меняется `vercel.json`: явный `outputDirectory=www`, лимит transcribe 30 секунд; существующий rewrite assetlinks сохранён. Глобальный rewrite API не добавляется.

Дополнительные npm-зависимости не нужны: используются Node crypto/fetch/Buffer/URL/AbortController и перечисленные локальные модули. `package.json` и lockfile берутся из production без изменений. Серверный metrics-модуль и остальные клиентские voice-модули в runtime не требуются и в патч не включены.

Все остальные production-файлы сохранены побайтно, включая frontend, Auth и JSONBin. Никаких удалений. Существующий незавершённый рабочий каталог не является источником deployment. Документ и регрессионные тесты в deployment не включены.

## Локальное исправление

В `api/voice/transcribe.js` reservation session ID перенесена перед асинхронным чтением WAV. Параллельный дубликат получает 409, Google вызывается один раз. Ошибка до вызова Google снимает reservation; после начала вызова reservation сохраняется даже при сетевой ошибке, чтобы не повторять обработку автоматически.

Добавлены три теста в `tests/voice/api.test.js`: конкурентный дубликат, повтор после некорректного WAV, запрет повтора после upstream-ошибки.

Сохранены Supabase Bearer validation, CORS allowlist, WAV PCM16 mono 16 kHz, длительность 220–30000 ms, максимум 960044 байт, 10 запросов/минуту на пользователя, session TTL 120 секунд, внутренний deadline 25 секунд, Vercel timeout 30 секунд, модель chirp_2 и europe-west4.

Ограничение существующей архитектуры: rate/session Map находятся в памяти одного serverless instance. Глобальная защита между разными экземплярами и после перезапуска этим патчем не обеспечивается.

## Preview

URL: https://budget-pro-lski-ndhwucqir-motserelia-s-projects.vercel.app

ID: `dpl_2rEFZyC1KtsPeNboGYQWGUpibStU`, состояние READY, не production. Сверены SHA-1 всех 158 опубликованных исходников — расхождений нет. Сборка Node 24 завершена успешно. В build output присутствуют:

- `api/auth/magic-link`
- `api/auth/refresh-session`
- `api/jsonbin/backup`
- `api/jsonbin/messages`
- `api/voice/health`
- `api/voice/transcribe` (timeout 30 секунд)

Исходники четырёх существующих API идентичны production. Хеши собранных bundles отличаются; идентичность бинарных артефактов не заявляется. Повторная реальная отправка Magic Link и запись резервных копий не выполнялись.

Preview защищён Vercel SSO. Без авторизованного браузера GET/OPTIONS возвращают 302 на Vercel Auth; конечная HTML-страница входа с 200 не считается успешным API-ответом. Automation bypass отсутствует; новый bypass не создавался, защита не ослаблялась. Runtime logs прочитаны, записей о вызовах функций нет: запросы остановлены до функций. Облачное выполнение handlers и реальные Google/Supabase запросы из preview не подтверждены.

Production обоих проектов после preview не изменился: целевой `dpl_8Pv2eQR3EByprDH7ZyJye7dp7KVJ`, второй `budget-pro` — `dpl_Gd1KYe8iQjxJdV7y91peteVPqap4`.

## Google Cloud: прочитанные настройки

Через уже авторизованный gcloud OAuth прочитаны Resource Manager, Service Usage, Cloud Billing и IAM API. Во всех шести доступных проектах lifecycle ACTIVE, `speech.googleapis.com` DISABLED, billingEnabled=false. Список и IAM прочитаны без ошибок доступа.

| Project ID | Service accounts | Project IAM |
| --- | --- | --- |
| budgetpro-push | Два активных: Firebase Admin SDK и budgetpro-push | Firebase SDK service agent / token creator; Editor у push account |
| gen-lang-client-0969595110 | Нет | Speech-роли в прочитанной политике не найдены |
| project-804c44ec-1be5-4bd4-9fa | Нет | Speech-роли в прочитанной политике не найдены |
| igneous-ethos-422311-p9 | Нет | Speech-роли в прочитанной политике не найдены |
| skilled-mission-422311-t6 | Нет | Speech-роли в прочитанной политике не найдены |
| local-chalice-422311-e1 | Нет | Speech-роли в прочитанной политике не найдены |

В budgetpro-push отдельная Speech-роль также не найдена. Это не доказательство отсутствия Speech permissions у широкой роли Editor. Effective permissions runtime service account и унаследованные IAM bindings не подтверждены. Ключи аккаунтов не запрашивались.

Подтверждённого исходного STT-проекта среди доступных не найдено. budgetpro-push — кандидат по имени, автоматически выбирать его и использовать push credentials нельзя. Проект для подключения пока не выбран.

Поддержка V2 chirp_2/europe-west4 для ka-GE, ru-RU, en-US подтверждается официальным каталогом Google. Практическая доступность модели для конкретного проекта не проверена: API выключен. Никакого переключения модели не требуется.

## Необходимые настройки после отдельного разрешения

1. Подтвердить существующий Google Cloud проект для STT. Новый проект не создавать автоматически.
2. Подключить billing к выбранному проекту и включить `speech.googleapis.com`. В каждом доступном кандидате это сейчас отсутствует. Возможны расходы после начала распознавания.
3. Подготовить отдельный runtime service account с `roles/speech.client`, без Editor/Owner. Создание аккаунта/ключа и IAM changes требуют разрешения. Существующая реализация ожидает service-account JSON; альтернативную архитектуру авторизации этот патч не вводит.
4. Добавить только серверные Vercel ENV выбранного проекта/окружения:

| ENV | Требуемое значение / статус |
| --- | --- |
| GOOGLE_CLOUD_PROJECT | Подтверждённый Project ID; сейчас отсутствует |
| GOOGLE_CLOUD_LOCATION | europe-west4; сейчас отсутствует |
| GOOGLE_SERVICE_ACCOUNT_JSON_B64 **или** GOOGLE_SERVICE_ACCOUNT_JSON | Настоящие server-only credentials; оба отсутствуют. При непустом B64 он имеет приоритет; Base64 не шифрует секрет |
| SUPABASE_URL, SUPABASE_ANON_KEY | Уже есть в production и preview; Sensitive, значения не извлекались и не менялись |
| VOICE_ALLOWED_ORIGINS | Необязателен: defaults уже разрешают https://budgetpro.app, production origin и null. Доверенный browser preview origin при необходимости добавлять явно, без wildcard |
| VOICE_ENABLE_ADAPTATION | Оставить отсутствующим/false для исходной проверки |

Credentials никогда не помещать в www, APK, git или публичный конфиг. Изменения ENV потребуют нового deployment: текущий preview отсутствующую конфигурацию автоматически не получит.

5. Выполнить read-only Google Locations проверку после настройки. Это не подтверждает recognize permissions/billing или качество речи.
6. Только после отдельного разрешения опубликовать подготовленный snapshot в production и проверить реальные авторизованные запросы. До разрешения платное распознавание не запускать.

## Проверки и пределы результата

- Общий запуск voice/auth/finance: 147 тестов, 105 PASS, 42 SKIP, 0 FAIL. SKIP относятся к отсутствующим human-audio интеграционным fixtures; реальные API-тесты не включались.
- API/config-provider тесты именно из isolated snapshot: 33 PASS, 0 FAIL.
- Syntax check: 12 JS-файлов snapshot, включая оба Auth API, JSONBin и все voice runtime dependencies — успешно.
- Отдельные проверки snapshot: импорт старых API; health configured=false; Android CORS OPTIONS 204 и неизвестный origin 403; missing config/credentials 503 STT_NOT_CONFIGURED; actual handler с синтетической конфигурацией отклоняет отсутствующий Bearer 401; Supabase invalid-token ответ 401 проверен с mock fetch.
- Некорректный WAV, размер, дедлайн, отсутствие речи, ошибки API/billing/permissions/quota/region/OAuth и недоступность upstream проверены локально с mocks, без реальных Google запросов.
- Одновременный дубликат: ответы 200/409, mocked recognizeCalls=1.
- Offline voice-check закономерно завершается 1: STT_NOT_CONFIGURED / PROJECT_MISSING; локальный ENV отсутствует. Credentials-маркеров в проверенных client/index/working-tree файлах не найдено; это не аудит всех архивов или истории Git.
- git diff --check и git apply --check изолированного патча — успешно.
- Живое распознавание, cloud runtime execution, Android end-to-end и фактическая работа Magic Link/backup из нового preview не подтверждены.

## Публикация и откат

Production deployment требует отдельного подтверждения точного snapshot, целевого проекта и ENV. Старые маршруты входят в новый deployment, а их исходники не меняются; Vercel пересобирает функции. Поэтому после разрешённой публикации нужны runtime checks всех API без записи пользовательских данных.

Rollback target: `dpl_8Pv2eQR3EByprDH7ZyJye7dp7KVJ`, известная работающая auth-база. Она остаётся доступной. Откат вернёт прежние API/ frontend, но voice endpoints снова будут отсутствовать. Предыдущая auth rollback-база: `dpl_Aq74juFdGTGDCMWdsE9nnqRRujAd`.

Не публиковать весь текущий рабочий каталог. Использовать проверенную изолированную копию/патч и вновь сверить её с актуальным production перед разрешённым релизом. Файлы /tmp являются временными; исходники voice остаются в проекте, манифест/патч нужно сохранить до очистки /tmp, если релиз откладывается.

## Официальные источники

- https://docs.cloud.google.com/speech-to-text/docs/speech-to-text-supported-languages
- https://docs.cloud.google.com/iam/docs/roles-permissions/speech
- https://vercel.com/docs/project-configuration/vercel-json
