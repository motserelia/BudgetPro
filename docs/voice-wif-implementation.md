# Реализация WIF для BudgetPRO — 2026-11-02

Код подготовлен локально. Google Cloud/IAM/billing/ENV не менялись; deployments, создание accounts/keys и реальные STT-запросы не выполнялись. Предыдущий preview остаётся на прежнем коде: в нём WIF ещё нет.

## Режимы и цепочка запроса

`GOOGLE_AUTH_MODE` отсутствует/пустой → прежний `service_account`. Поддерживаются raw JSON и B64 с прежним приоритетом B64. `GOOGLE_AUTH_MODE=wif` → только федерация; при ошибке нет fallback на постоянный ключ. Неизвестный режим отклоняется как STT_NOT_CONFIGURED.

Цепочка:

1. Неизменённый voice/transcribe проверяет CORS, параметры и конфигурацию, затем Supabase Bearer через auth/v1/user. Проверки WAV/rate/session/deadline сохранены.
2. Внутри вызова Google-клиента официальный `@vercel/oidc.getVercelOidcTokenSync()` получает токен из Vercel request context (`x-vercel-oidc-token`), с платформенным ENV fallback. Пользовательский Authorization/Supabase token не используется как Google assertion. Ручного чтения HTTP-заголовка из req и нового публичного token endpoint нет.
3. Локально проверяются точные issuer/audience/owner/project/environment/subject/exp/iat/nbf и alg=RS256. Это предварительная проверка claims, не проверка подписи. Подпись/JWKS и provider condition проверяет Google STS.
4. Официальный Google `IdentityPoolClient` выполняет RFC8693 token exchange на https://sts.googleapis.com/v1/token, затем вызывает generateAccessToken для отдельного service account на iamcredentials.googleapis.com. Запрашивается access token на 900 секунд со scope cloud-platform; фактические разрешения ограничивает IAM.
5. Только impersonated access token используется для существующего regional Speech Recognize. Модель chirp_2, europe-west4, языки, WAV, transcript validator и финансовый парсер не менялись.

Используется синхронный официальный Vercel helper: он не пытается автоматически читать/обновлять локальный Vercel CLI login при отсутствии workload token. Vercel обновляет платформенный OIDC; токен запрашивается заново в контексте каждого вызова, не на module initialization.

Google access token кешируется только в памяти одного Google-клиента, привязанного к полной конфигурации provider/account/environment. Cache hit разрешён только для SHA-256 **точно того же JWT**, ранее принятого STS, после повторной проверки claims/срока. Подделанный JWT с теми же decoded claims не использует кеш. Срок кеша ограничен и Google expiry, и OIDC expiry, с запасом 60 секунд. Сам OIDC JWT в кеше не сохраняется; credentials на диск/клиент не передаются.

Оба SDK auth HTTP-запроса получают AbortSignal исходного voice-запроса, timeout 25 секунд и retryConfig с нулём повторов. RequestIdentityPoolClient использует protected stsCredential и public transporter SDK, чтобы STS/IAM разделяли настройки отмены. Библиотеки зафиксированы: @vercel/oidc 4.0.5, google-auth-library 11.3.2. При обновлении обязательны тесты отмены и отсутствия retries. Google auth SDK требует Node >=22; проверка выполнена на отдельном Node 24.22.2, соответствующем production major 24. Системный Node не менялся.

SDK errors могут содержать assertions и headers: наружу возвращаются только AUTH_ERROR/503 и фиксированное описание стадии. Raw error/response/config/cause не логируются и не прикладываются. Схема успешного voice response не менялась.

## Жёсткая область доверия

Задана в server/voice/config.js, не берётся из пользовательского запроса:

- Google project budgetpro-push; provider project number 632084975766.
- Vercel owner ID team_TX33yawczaApgU3vUv6jfnnb; slug motserelia-s-projects.
- Vercel project ID prj_JXya7HuDChbetag5FjXhWDej2MpV; name budget-pro-lski.
- Issuer https://oidc.vercel.com/motserelia-s-projects.
- Audience https://vercel.com/motserelia-s-projects.
- Только environment preview/production, строго равный VERCEL_ENV. Development/custom environments не разрешены.
- Только отдельные accounts budgetpro-stt, budgetpro-stt-preview или budgetpro-stt-production в том же Google project; суффикс environment при наличии должен совпадать. Firebase/push account использовать нельзя.

Переименование team/project, переход на global issuer, другой audience или Google project требует отдельного обновления кода и доверия. Строгое отклонение безопаснее незаметного расширения доступа.

## Повторная read-only проверка Google Cloud

На момент реализации:

| Ресурс | Состояние |
| --- | --- |
| Billing budgetpro-push | billingEnabled=false |
| speech.googleapis.com | DISABLED |
| sts.googleapis.com | DISABLED |
| iamcredentials.googleapis.com | ENABLED |
| iam.googleapis.com | ENABLED |
| fcm.googleapis.com | ENABLED |
| Workload Identity Pools | Пустой доступный список |
| Accounts | Только прежние Firebase Admin SDK и budgetpro-push; новые STT accounts отсутствуют |

Ничего из перечисленного не создавалось/не активировалось.

## Точный план Google Cloud после разрешения

Предлагаемые имена ниже — план, не созданные ресурсы и не credentials.

1. Согласовать billing account и подключение его к budgetpro-push. В предыдущей проверке оба доступных billing account закрыты. Потребуется восстановление разрешённого account/платёжного профиля либо отдельное решение владельца; никакие реквизиты не нужны в чате. Подключение billing к Firebase-проекту переводит его на Blaze; существующие FCM accounts/API не трогать. Автоматически отключать billing общего Firebase-проекта при расходах STT нельзя.
2. Включить speech.googleapis.com и sts.googleapis.com. IAM и IAM Credentials уже включены; только повторно проверить. Не активировать посторонние API.
3. Создать два отдельных accounts без JSON keys:
   - budgetpro-stt-preview@budgetpro-push.iam.gserviceaccount.com;
   - budgetpro-stt-production@budgetpro-push.iam.gserviceaccount.com.
4. Выдать каждому только `roles/speech.client` на budgetpro-push. Не выдавать Editor, Owner или Speech Admin. У ролей есть speech.recognizers.recognize и location metadata read. Проектные квоты Speech общие для двух accounts.
5. Создать pool `budgetpro-vercel-stt` в locations/global и OIDC provider `vercel`. Полный provider:
   `projects/632084975766/locations/global/workloadIdentityPools/budgetpro-vercel-stt/providers/vercel`.
6. Provider issuer: https://oidc.vercel.com/motserelia-s-projects. Allowed audiences: только https://vercel.com/motserelia-s-projects. Mapping:
   `google.subject=assertion.sub,attribute.owner_id=assertion.owner_id,attribute.project_id=assertion.project_id,attribute.environment=assertion.environment`.
7. Provider CEL condition:

```text
assertion.owner_id == 'team_TX33yawczaApgU3vUv6jfnnb' &&
assertion.project_id == 'prj_JXya7HuDChbetag5FjXhWDej2MpV' &&
assertion.environment in ['preview', 'production']
```

8. На preview account выдать `roles/iam.workloadIdentityUser` только member:

```text
principal://iam.googleapis.com/projects/632084975766/locations/global/workloadIdentityPools/budgetpro-vercel-stt/subject/owner:motserelia-s-projects:project:budget-pro-lski:environment:preview
```

9. На production account выдать ту же роль только member:

```text
principal://iam.googleapis.com/projects/632084975766/locations/global/workloadIdentityPools/budgetpro-vercel-stt/subject/owner:motserelia-s-projects:project:budget-pro-lski:environment:production
```

Не использовать wildcard всего pool/team; не выдавать Service Account Token Creator всему проекту. Preview не получает production account. Разрешать запуск с Google доступом только доверенным deployments, включая preview; период тестового доступа согласовать.

## Vercel ENV после разрешения

Только project budget-pro-lski / prj_JXya7HuDChbetag5FjXhWDej2MpV:

| ENV | Preview | Production |
| --- | --- | --- |
| GOOGLE_AUTH_MODE | wif | wif |
| GOOGLE_CLOUD_PROJECT | budgetpro-push | budgetpro-push |
| GOOGLE_CLOUD_LOCATION | europe-west4 | europe-west4 |
| GOOGLE_WIF_PROVIDER | Полный provider resource выше | Тот же provider |
| GOOGLE_SERVICE_ACCOUNT_EMAIL | budgetpro-stt-preview@budgetpro-push.iam.gserviceaccount.com | budgetpro-stt-production@budgetpro-push.iam.gserviceaccount.com |
| VERCEL_ENV | Платформа задаёт preview | Платформа задаёт production |

Не задавать вручную постоянный VERCEL_OIDC_TOKEN. JSON/B64 для WIF не нужны и не читаются; обратная совместимость доступна только через явный service_account режим либо прежний default. Существующие SUPABASE_URL/SUPABASE_ANON_KEY, Auth/JSONBin ENV не менять. VOICE_ALLOWED_ORIGINS defaults и выключенная adaptation сохранены. ENV требуют нового deployment.

Health `configured=true` означает только корректность серверной конфигурации, не выдачу OIDC, успешный STS, billing/IAM или транскрипцию. В WIF credentialsConfigured отражает статическую WIF-конфигурацию; endpoint не обменивает токены и не публикует account/provider/credentials.

## Проверки

На Node 24.22.2: все Google обращения заменены mock fetch. Настоящие Vercel helper и Google IdentityPoolClient исполнялись локально, включая чтение request context, формирование STS exchange, IAM impersonation и base64 Speech request.

Проверены issuer/audience/owner/project/environment/sub, истечение/будущее время/alg, отсутствие токена/config, отказ STS, отказ IAM, invalid expiry, отсутствие SDK retries, AbortSignal, expiry/cache и подделанный JWT после заполнения кеша. Проверены safe errors без assertions/access tokens, совместимость voice response, обязательный Supabase Bearer до Google, Auth/JSONBin preflight без сети. Прежние JSON/B64 tests сохранены.

Итог voice/auth/finance: 176 тестов, 134 PASS, 42 SKIP, 0 FAIL; среди них 29 новых WIF tests. На файлах isolated snapshot с его собственными dependencies отдельно прошло 62 серверных теста. npm ci --ignore-scripts для snapshot и syntax check его 13 JS-файлов успешны. git diff --check и git apply --check изолированного патча проходят.

42 human-audio integration tests пропущены; реальные Google/Vercel exchanges и распознавание не подтверждены. Новый Vercel build/deployment не запускался. Не считать mocks доказательством настройки внешних сервисов.

## Изолированная публикация и откат

Подготовлен новый локальный snapshot `/tmp/budgetpro-wif-release-dakws120`, без deployment. Основа — подтверждённая действующая auth production-база dpl_8Pv2eQR3EByprDH7ZyJye7dp7KVJ. Frontend, Auth/JSONBin исходники сохранены. В manifest добавлены только два точных server dependencies; текущие Electron/scripts/прочие незавершённые package-изменения не копировались. В www добавляются только прежние shared api-config/transcript-validator, frontend entrypoints не заменяются; Android не меняется.

Полный release patch: `/tmp/budgetpro-wif-release.patch`; SHA-256 manifest: `/tmp/budgetpro-wif-release-manifest.json`. Относительно production меняются 12 файлов (весь ранее отсутствовавший voice backend плюс WIF, package/lockfile и Vercel config), удалений нет. Эти временные артефакты нужно сохранить до очистки /tmp, если публикация откладывается. Документ, .env.example и tests в release не включены.

Перед публикацией повторно сверить актуальный production. Если он изменился, заново собрать snapshot поверх новой базы. Опубликовать сначала отдельный preview только после разрешения, с настоящими согласованными preview ENV. SSO не отключать: существующий штатный Trusted Sources CLI OIDC доступ использовать для проверки.

Порядок: billing/Google resources → preview ENV → разрешённый isolated preview → health/static flags → read-only Locations → CORS → missing/invalid Supabase Bearer → WAV/limits → один отдельно разрешённый платный STT test → подтверждение production → Android. Existing Magic Link не проверять повторной реальной отправкой без согласованного теста. JSONBin проверить без изменения пользовательских данных. Второй Vercel project budget-pro не трогать.

Откат deployment к dpl_8Pv2eQR3EByprDH7ZyJye7dp7KVJ сохранит прежний web/Auth/JSONBin, но voice endpoints исчезнут. Возврат к прежнему JSON auth возможен только с действительными отдельно разрешёнными credentials; автоматического fallback нет. Deployment rollback не отменяет billing/ENV/IAM/WIF changes — это отдельные согласуемые действия. Глобальную дедупликацию/rate limit между serverless instances данный этап не добавляет.

## Официальные источники

- https://vercel.com/docs/oidc/reference
- https://vercel.com/docs/oidc/gcp
- https://github.com/vercel/vercel/tree/main/packages/oidc
- https://github.com/googleapis/google-auth-library-nodejs
- https://docs.cloud.google.com/iam/docs/reference/sts/rest/v1/TopLevel/token
- https://docs.cloud.google.com/iam/docs/reference/credentials/rest/v1/projects.serviceAccounts/generateAccessToken
- https://docs.cloud.google.com/iam/docs/best-practices-for-using-workload-identity-federation
