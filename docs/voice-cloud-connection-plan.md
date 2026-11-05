# План подключения Google STT V2 — 2026-11-02

Только диагностика и подготовка. На этом этапе application/backend code не менялся. Не создавались projects, accounts, keys, WIF pools/providers, budgets или ENV. Billing/API/IAM не менялись. Новых deployments и платных распознаваний не было.

## А. Выбор проекта

Из существующих кандидатов предлагается `budgetpro-push` при отдельном согласовании изменения его billing-режима. Авторизованный gcloud principal имеет прямую роль `roles/owner`. Проверка testIamPermissions подтвердила права чтения проекта, изменения project IAM, включения сервисов, создания service accounts/keys и speech.recognizers.recognize. Эти права принадлежат оператору, а не будущему runtime account; они не доказывают доступность Speech при выключенном API.

Проверены ранее найденные альтернативы: gen-lang-client-0969595110, project-804c44ec-1be5-4bd4-9fa, igneous-ethos-422311-p9, skilled-mission-422311-t6, local-chalice-422311-e1. В предыдущей проверке все ACTIVE, без Speech API и billing, без service accounts. Подтверждённого прежнего STT-проекта среди них нет. Называть какой-либо из них неиспользуемым без инвентаризации его ресурсов нельзя. Новых оснований переносить туда BudgetPRO не найдено.

## Б. Совместимость с Firebase/push

В budgetpro-push включены firebase.googleapis.com и fcm.googleapis.com. Существуют два активных service account: Firebase Admin SDK с Firebase SDK service-agent/token-creator roles и push account с Editor. Отдельный STT account не найден. Существующие accounts/roles/keys менять или переиспользовать для STT не предлагается.

Добавление отдельного Speech account/API не требует изменения FCM-конфигурации. Но подключение Cloud Billing к Firebase-проекту автоматически переводит его на Blaze. FCM остаётся бесплатным; другие ресурсы проекта могут начать тарифицироваться при соответствующем использовании. Поэтому обещать отсутствие любых billing-последствий нельзя. Автоматически отключать billing всего проекта при превышении STT-бюджета нельзя: это затронет общий Firebase-проект.

Firebase Management project/apps endpoints вернули 403, хотя Service Usage подтверждает включённый Firebase API. Регистрация конкретного Android package и список Firebase apps через этот способ не проверены. Это не доказательство отсутствия Firebase-проекта или неисправности FCM. Реальную доставку push на этом этапе не проверяли.

Если обязательна изоляция расходов и billing от Firebase, использовать отдельный согласованный существующий проект после проверки его назначения. Создание нового проекта потребует отдельного разрешения.

## В. Модель, метод, доступность и география

Сохраняются Speech-to-Text V2, chirp_2, europe-west4, Recognize, ka-GE / ru-RU / en-US. Языки/регион есть в официальной таблице. Recognize поддерживается моделью. Отдельный GCS bucket, console workspace или сохранённый recognizer для существующего REST-вызова с inline WAV и recognizers/_ не требуется.

В документации есть несогласованность: страница Chirp 2 помечает регионы Private GA, а официальный release note от 2025-01-27 объявляет GA именно для europe-west4/us-central1/asia-southeast1. Следовательно, оснований заранее требовать allowlist-заявку для базового Recognize не найдено; фактический доступ конкретного проекта всё равно не подтверждён. После разрешённого включения Speech API нужна read-only Locations проверка, затем разрешённое распознавание. Если Google вернёт ограничение доступа модели, исследовать точный ответ и обращаться за доступом, не менять модель.

Отдельного ограничения STT для страны Грузия в проверенной документации не найдено. Регион обработки europe-west4 — Нидерланды, не Грузия; клиент может обращаться из Грузии. Допуск конкретного billing/payment profile не проверен. Таблица валют не содержит Georgia/GEL; Google поясняет, что отсутствие страны в этой таблице может означать расчёт в USD, а не запрет сервиса. Не обещать применимость конкретной карты или валюты до проверки платёжного профиля.

## Г. Недостающие настройки

- Speech API: DISABLED.
- Billing проекта: не подключён. Cloud Billing accounts.list вернул два account, оба open=false. Действующий доступный account не найден; это не утверждение об отсутствии других accounts, недоступных текущему principal.
- STS API: DISABLED. IAM Service Account Credentials API: ENABLED.
- WIF pools: список доступен и пуст.
- Effective legacy constraints iam.disableServiceAccountCreation / iam.disableServiceAccountKeyCreation прочитаны: enforce=true не найден. Это не гарантия успешной будущей операции: все применимые политики и разрешения повторно проверить перед созданием.
- Возможность отдельного runtime account подтверждается разрешением iam.serviceAccounts.create; создание не выполнялось.

После согласования: открыть/подключить разрешённый billing account, включить Speech API; для WIF — STS API, создать отдельный account и pool/provider, настроить минимальные IAM bindings. Billing account может потребовать действий владельца с платёжным профилем; пароли и реквизиты в чат не передавать.

## Д. Стоимость и ограничения расходов

V2 Standard Recognize: базовый on-demand тариф USD 0.016/минуту в первом диапазоне до 500000 минут/месяц. Тарификация посекундная, каждый запрос округляется вверх до секунды, не до 15 секунд. Текущий WAV mono — один канал. Без скидок, налогов и credits:

| Объём | Минуты | Расчёт STT |
| --- | ---: | ---: |
| 1 запись × 15 секунд | 0.25 | USD 0.004 |
| 1000 × 15 секунд | 250 | USD 4 |
| 10000 × 15 секунд | 2500 | USD 40 |

Это стоимость только Google STT. Vercel compute/requests/data transfer, возможные другие сервисы и налоги не включены. Более дешёвый Dynamic Batch не соответствует выбранному синхронному Recognize; метод/модель не меняются.

Для стандартного V2 Recognize постоянные 60 бесплатных минут не подтверждены: официальный Free Tier относит 60 минут к V1 и отдельным medical SKUs. Welcome offer USD 300/90 дней предназначен для eligible новых клиентов. У текущего аккаунта есть история billing; доступность/остаток промокредитов не определены через прочитанный API. В расчёт скидка/credits не заложены.

Предлагаемый alerts-only budget после разрешения: USD 5/месяц для первоначального тестирования, фильтры Project=выбранный проект и Service=Cloud Speech-to-Text, actual alerts 50/80/100%, forecast alert 100%, email администраторам/согласованному адресату. Для 10000 записей нужен осознанный бюджет около USD 40 плюс запас. Дополнительно общий project budget обнаружит расходы других сервисов. Ничего из этого не настроено.

| Ограничение | Что оно обеспечивает |
| --- | --- |
| Alerts-only budget | Уведомляет, не останавливает расходы; отчётность/alerts имеют задержку |
| Новые Google spend-cap budgets | Сейчас перечисляют Gemini API, Agent Platform, Cloud Run/functions; STT не включён. Не считать их STT-лимитом |
| Google Recognize content limit | До 10 MB или 1 минуты на запрос; техническое ограничение, не месячный бюджет |
| Документированная quota Recognize | 300 запросов/60 секунд/регион, общая для проекта. Фактические project quotas не прочитаны: consumerQuotaMetrics вернул 404 при выключенном Speech API |
| BudgetPRO WAV limits | 220–30000 ms, максимум 960044 байт, PCM16 mono 16 kHz; проверяются до Google |
| BudgetPRO per-user rate/dedup | 10/min и TTL 120 секунд в памяти instance. Не глобальная денежная квота, сбрасывается между instances/перезапусками |
| Deadline | Внутренний 25 секунд / Vercel 30 секунд. Отмена ожидания не гарантирует отмену/нетарификацию уже начатой обработки Google |

Для жёсткого небольшого общего бюджета STT понадобился бы отдельный централизованный атомарный учёт/лимит аудиосекунд перед Recognize, с консервативным резервированием. Это отдельное согласуемое изменение; текущий patch этого не делает. Квоты запросов в минуту можно уменьшить после включения API, если метрика допускает override, но они не ограничивают стоимость за месяц.

## Е. Предпочтительная авторизация: WIF

Рекомендация — Vercel OIDC → Google STS → impersonation отдельного Speech service account → краткоживущий Google access token. Постоянный JSON key не необходим архитектурно. В budget-pro-lski OIDC уже enabled=true, issuerMode=team; публичные discovery/JWKS доступны. Vercel поддерживает федерацию GCP на всех планах.

Предлагаемые, ещё НЕ созданные ресурсы: runtime account budgetpro-stt; pool budgetpro-vercel-stt; provider vercel. Для budgetpro-push project number 632084975766.

План доверия:

- Issuer: https://oidc.vercel.com/motserelia-s-projects.
- Allowed audience: https://vercel.com/motserelia-s-projects — совместим с текущим стандартным Vercel aud; при выборе Google default audience понадобится запрос именно этого audience в коде.
- Mapping: google.subject=assertion.sub, attribute.owner_id=assertion.owner_id, attribute.project_id=assertion.project_id, attribute.environment=assertion.environment.
- Provider condition: assertion.owner_id == 'team_TX33yawczaApgU3vUv6jfnnb' && assertion.project_id == 'prj_JXya7HuDChbetag5FjXhWDej2MpV' && assertion.environment in ['preview', 'production'].
- Project binding: roles/speech.client только новому runtime account; роль включает speech.recognizers.recognize. Не выдавать Editor/Owner/Speech Admin.
- Account binding: roles/iam.workloadIdentityUser только точным external subjects owner:motserelia-s-projects:project:budget-pro-lski:environment:preview и ...:production, не всему pool/team. Для изоляции preview/production предпочтительны отдельные accounts/bindings.
- Google scope cloud-platform сам по себе не расширяет разрешения сверх IAM. Не путать входной Supabase Bearer с Vercel OIDC assertion; пользовательская авторизация остаётся обязательной.

Существующий backend WIF НЕ поддерживает: config.js принимает только type=service_account с RSA private_key, google-client.js подписывает service-account JWT и обменивает его на oauth2.googleapis.com/token. Поместить external_account JSON в текущие ENV нельзя — конфигурация будет отвергнута.

Потребуется отдельный серверный patch: config/health для режима WIF, request-bound OIDC supply в transcribe, обмен/refresh Google credentials в google-client; mocks и тесты issuer/aud/project/environment, отказов STS/IAM и отсутствия токенов в логах. Без изменения model/Recognize/Supabase/client. Предпочтительны официальные google-auth-library и @vercel/oidc, без AI/Vertex SDK; зависимости сейчас не устанавливались. Не кешировать исходный OIDC token навсегда/на уровне module; получать свежий в контексте запроса. Кеш Google access token должен учитывать account/provider/expiry и не смешивать окружения.

Если выбран быстрый запуск неизменённого backend, временно потребуется отдельный service-account RSA JSON key. Это менее безопасная альтернатива и требует отдельного разрешения на создание, защищённое хранение и последующую ротацию/удаление. B64 — кодирование, не шифрование. В данном этапе ключ не создавался.

## Ж. Vercel ENV

Цель: budget-pro-lski / prj_JXya7HuDChbetag5FjXhWDej2MpV. Текущий backend читает:

| ENV | Назначение |
| --- | --- |
| GOOGLE_CLOUD_PROJECT | Согласованный Project ID; отсутствует |
| GOOGLE_CLOUD_LOCATION | europe-west4; отсутствует |
| GOOGLE_SERVICE_ACCOUNT_JSON либо GOOGLE_SERVICE_ACCOUNT_JSON_B64 | Полный service_account JSON; оба отсутствуют. Непустой B64 имеет приоритет; поддерживается нормализация escaped newlines RSA key |
| SUPABASE_URL / SUPABASE_ANON_KEY | Уже есть Sensitive в preview/production; сохранить существующие значения |
| VOICE_ALLOWED_ORIGINS | Необязательный allowlist; defaults уже включают https://budgetpro.app, production origin и null. Никакого wildcard |
| VOICE_ENABLE_ADAPTATION | Оставить отсутствующим/false для исходного теста |

Для будущего WIF-патча понадобятся project/location и публичные resource identifiers provider/account, например GOOGLE_WIF_PROVIDER и GOOGLE_SERVICE_ACCOUNT_EMAIL. Это предлагаемые имена, текущий код их не читает. JSON/private_key для WIF не нужны. Vercel выдаёт свой OIDC token платформенно, вручную создавать фиктивный VERCEL_OIDC_TOKEN не надо. Точные ENV имена зафиксировать вместе с WIF implementation до любых изменений настроек.

Изменения ENV применяются только новым deployment. В существующий preview ENV не добавлялись.

## З. Состояние существующего preview

Preview dpl_2rEFZyC1KtsPeNboGYQWGUpibStU, READY:
https://budget-pro-lski-ndhwucqir-motserelia-s-projects.vercel.app

Повторно сверены SHA-1 всех 158 опубликованных исходников — совпадают с /tmp/budgetpro-voice-release-a093i77a. По отношению к подтверждённой production-базе изменён только vercel.json и добавлены восемь файлов из voice-backend-release-plan.md. Исходники существующих Auth/JSONBin, frontend, package/lockfile совпадают с production; посторонние локальные изменения не включены.

Оба shared client файла проверены отдельно:

- www/api-config.js: UMD/CommonJS модуль, серверный cors.js берёт productionOrigin. Содержит только публичный URL и routing helpers, без credentials/запросов к финансовым данным.
- www/voice/transcript-validator.js: UMD/CommonJS validator Unicode/script/пустого transcript; импортируется transcribe.js. Без хранилища и финансовых расчётов.

В production-базе их нет; они добавляются, существующие frontend entrypoints не заменяются и эти скрипты в старый index.html не подключаются. Android APK не собирался/не устанавливался/не менялся. Текущий рабочий www существенно отличается от live web: публиковать целиком рабочий каталог нельзя. Snapshot сохраняет текущий live web, не переносит незавершённые изменения. Перед любым будущим релизом повторно сверить актуальную live-базу, чтобы не затереть изменения, появившиеся после snapshot.

Найден штатный авторизованный доступ через vercel project token того же проекта и x-vercel-trusted-oidc-idp-token. Краткоживущий development token использован только в памяти; SSO/Trusted Sources/config не менялись, automation bypass не создавался.

| Реальный preview запрос | Результат |
| --- | --- |
| GET voice/health, Android Origin | 200 JSON, configured=false, chirp_2/europe-west4, все Google flags false |
| OPTIONS voice/transcribe и voice/health, Android Origin | 204, точный Access-Control-Allow-Origin https://budgetpro.app, разрешены Authorization/Content-Type |
| OPTIONS transcribe с неизвестным Origin | 403 CORS_DENIED, без allow-origin |
| POST transcribe, пустой WAV, без пользовательского Bearer | 503 STT_NOT_CONFIGURED; конфигурация проверяется раньше пользовательской авторизации/WAV. Google не вызывается |
| GET transcribe | 405 METHOD_NOT_ALLOWED |
| GET auth/magic-link | 405 AUTH_METHOD_NOT_ALLOWED; реальное письмо не отправлялось |
| GET auth/refresh-session | 405; refresh token не передавался |

Runtime logs содержат соответствующие вызовы и ожидаемый warning STT_NOT_CONFIGURED PROJECT_MISSING; ошибок импорта/500 в выполненных проверках нет. Не считать 200 health доказательством настройки Google: ok/configured=false.

Локально повторно: voice/auth/finance 105 PASS, 42 SKIP, 0 FAIL (147 total). Дополнительно snapshot: реальный auth handler с синтетической конфигурацией возвращает 401 без Bearer; invalid Supabase token проверен mock fetch; Android CORS, missing credentials и imports старых API проходят. Изолированная проверка лимита: первые 10 mock requests 200, 11-й 429, 30 секунд принимаются, oversized/слишком короткий WAV отклоняются. Google errors проверены mocks. Runtime 401 с полноценной Google-конфигурацией и настоящее STT/Supabase обращение из preview ещё не проверены.

Повторная доставка Magic Link и запись/восстановление JSONBin намеренно не выполнялись. Их исходники сохранены, маршруты присутствуют в build output, Auth исполняется; полноценная пользовательская работа на новом preview не объявляется подтверждённой. Client/working-tree/index credentials scan предыдущего этапа не нашёл ключей; это не полный аудит архивов/истории Git. Новых секретных файлов на этом этапе не создавалось.

## И. Последовательность завершения

1. Согласовать проект и допустимость Firebase Blaze/billing либо выбрать проверенный отдельный существующий проект. Согласовать начальный бюджет и способ авторизации WIF.
2. После разрешения восстановить/подключить billing; настроить project+Speech alerts, включить Speech/STS APIs. Старые Firebase/push accounts и bindings не трогать.
3. Создать отдельный runtime account, WIF pool/provider и точные IAM bindings. Прочитать Locations metadata для europe-west4 и трёх языков, без Recognize.
4. Подготовить/проверить изолированный WIF server patch; сохранить JSON-режим только если согласовано. Новые runtime dependencies включать явно в отдельный reviewed patch.
5. Добавить действительные согласованные ENV сначала для preview; не менять Supabase/JSONBin/Auth ENV.
6. Только после разрешения на deployment создать новый isolated preview от актуальной production-базы. Проверить manifests, все старые routes и отсутствие удаления/замены live frontend. Существующий preview с отсутствующим ENV не станет настроенным автоматически.
7. Проверить health: HTTP 200 и configured=true. Затем Android CORS 204/403, отсутствие/невалидный пользовательский Bearer 401 без вызова Google, invalid WAV/size/duration/rate/timeout и safe errors. Авторизованный CLI использует Trusted Sources, не выключать SSO.
8. После отдельного разрешения на платный запрос выполнить один короткий реальный WAV: Google/Vercel response и logs, модель/регион/язык, отсутствие секретов. Отдельно от unit tests подтвердить реальную транскрипцию.
9. Получить отдельное подтверждение production-публикации точного snapshot/ENV. Второй Vercel-проект budget-pro не затрагивать. После релиза проверить маршруты, Supabase/Magic Link/JSONBin без записи финансовых данных; реальное письмо отправлять только в согласованном тесте.
10. Проверить установленный Android: прежний API URL, вход, запись и успешный transcript для грузинского/русского/английского. APK/пакет приложения в рамках серверного релиза не заменять.

Рабочая rollback-база — dpl_8Pv2eQR3EByprDH7ZyJye7dp7KVJ; откат вернёт прежний web/Auth/JSONBin без voice routes. Текущий production цели и второй проект остались на прежних deployments. WIF/ENV/billing rollback — отдельные действия с собственными последствиями; deployment rollback сам по себе не отменяет IAM/billing/ENV changes. Автоматического отключения billing нет.

## К. Разрешения и оставшиеся проверки

Требуют согласования: billing/Blaze, enable Speech/STS, accounts/pools/providers/IAM, выбор WIF или постоянного ключа, реальные ENV, новые preview/production deployments, платный STT test, настройка budgets/quota overrides. Всё это не выполнялось.

Нет подтверждения доступных trial credits, оплаты конкретной картой из Грузии, фактической project model availability при выключенном API, Google runtime service-account recognize permissions, реального распознавания, Firebase app inventory через Management API (403), push-доставки и Android end-to-end. Эти проверки не заменены предположениями.

## Источники

- Google pricing: https://cloud.google.com/speech-to-text/pricing
- Free Tier/trial: https://docs.cloud.google.com/free/docs/free-cloud-features
- Chirp 2: https://docs.cloud.google.com/speech-to-text/docs/models/chirp-2
- Release notes (GA 2025-01-27): https://docs.cloud.google.com/speech-to-text/docs/release-notes
- Languages: https://docs.cloud.google.com/speech-to-text/docs/speech-to-text-supported-languages
- Setup: https://docs.cloud.google.com/speech-to-text/docs/setup
- Quotas: https://docs.cloud.google.com/speech-to-text/docs/quotas
- Firebase billing: https://firebase.google.com/support/troubleshooter/billing/unrequested/cloud/same
- FCM pricing: https://firebase.google.com/pricing
- Budgets: https://docs.cloud.google.com/billing/docs/how-to/budgets
- Spend caps scope: https://docs.cloud.google.com/billing/docs/how-to/budgets-spend-caps
- Currency: https://docs.cloud.google.com/billing/docs/resources/currency
- Vercel GCP federation: https://vercel.com/docs/oidc/gcp
- OIDC claims: https://vercel.com/docs/oidc/reference
- Precise WIF grants: https://docs.cloud.google.com/iam/docs/best-practices-for-using-workload-identity-federation
- Trusted Sources workflow: https://github.com/vercel-labs/agent-browser/blob/main/skill-data/protected-vercel-deployments/SKILL.md
