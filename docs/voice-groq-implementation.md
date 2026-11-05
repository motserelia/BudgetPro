# BudgetPRO: Groq Free — реализация и план запуска

Состояние: локальная реализация, все внешние ASR-запросы в тестах подменены.
Реальная транскрипция, качество языков, доставка на Android и Vercel build/deploy не подтверждены.
Production, ENV, IAM, billing и пользовательские данные не изменялись.

## Архитектура

Capacitor WAV → прежний POST `/api/voice/transcribe` → Supabase `/auth/v1/user`
→ проверка WAV → атомарная резервация общей квоты Redis
→ `server/voice/asr.js` → `server/voice/groq-client.js`
→ Groq `/openai/v1/audio/transcriptions` → существующая проверка текста
→ существующий нормализатор чисел → финансовый черновик → ручное подтверждение.

- WAV: прежний PCM16, mono, 16 kHz, 220 ms–30 s, максимум 960044 bytes.
- Контракт запроса не изменён: binary body, query language/mode/sessionId/hints,
  Supabase Bearer только к BudgetPRO. В Groq передаётся исключительно его серверный ключ.
- Multipart: `file`, `model=whisper-large-v3`, `response_format=json`, `temperature=0`.
  Фиксированные языки: ru/ka/en. Auto: параметр `language` отсутствует.
  Endpoint translations не используется. Hints и финансовые категории в Groq не передаются.
- Ответ сохраняет sessionId, requestedLanguage/Locale, transcript, durationMs,
  responseTime, validation. Правдивые provider/model: groq/whisper-large-v3.
  JSON Groq не подтверждает определённый язык: detectedLanguage=null,
  detectedLanguages=[], confidence=null, region=null.
- `health` проверяет наличие/формат конфигурации, а не реальную связь или тариф.
- Прежние дедлайны: сервер 25 s, клиент 28 s, Vercel 30 s. Abort передаётся fetch.
  Отменённый HTTP-запрос на сервере завершается через общий TIMEOUT/504;
  на клиенте пользовательская отмена остаётся AbortError и не открывает черновик.
- Отдельные безопасные ошибки для квоты, ключа, недоступности провайдера,
  хранилища лимитов и неправильного ответа. RU/EN/KA сообщения в прежнем UI.
- Нет автоматического повтора, повторной записи операции или fallback.
- Google SA JSON и подготовленная WIF-интеграция сохранены без изменения.
  Google через dispatcher требует одновременно ASR_PROVIDER=google и отдельный
  ASR_ALLOW_PAID_PROVIDERS=true. Сейчас этот флаг оставлять false/не задавать.
- Без ASR_PROVIDER вызовы запрещены. cloudflare сейчас возвращает ошибку настройки;
  для будущего движка предусмотрена единая точка dispatcher, но адаптер не реализован.

Финансовый парсер не переписан. В parseVoiceInput добавлены только диагностические
поля stage/financialParseStatus/financialParseError. STT success, неполный черновик
и исключение парсера различаются. Отсутствующая сумма по-прежнему допускает
ручное заполнение существующего окна; автоматического сохранения нет.

## Обязательные server ENV

Устанавливать только в нужном environment проекта budget-pro-lski,
`prj_JXya7HuDChbetag5FjXhWDej2MpV`. Сначала Preview; Production требует разрешения.

| ENV | Значение/назначение |
|---|---|
| ASR_PROVIDER | groq |
| GROQ_API_KEY | Настоящий секретный ключ Groq Free, вводить через защищённый интерфейс ENV |
| GROQ_FREE_TIER_CONFIRMED | true только после проверки владельцем тарифа Free |
| ASR_REDIS_REST_URL | Настоящий HTTPS root endpoint общего Redis REST store |
| ASR_REDIS_REST_TOKEN | Секретный write-capable REST token этого store |
| SUPABASE_URL | Уже существующий исходный Supabase-проект; не заменять |
| SUPABASE_ANON_KEY | Уже существующий ключ для проверки пользовательской сессии; не заменять |

Необязательный VOICE_ALLOWED_ORIGINS: точные доверенные origins через запятую.
Default сохраняет https://budget-pro-lski.vercel.app, https://budgetpro.app, null.
Origin конкретного Preview нужно явно разрешить для браузерного теста на нём;
для нативного Android остаётся https://budgetpro.app. Wildcard не допускается.

ASR_ALLOW_PAID_PROVIDERS=false/отсутствует. Google ENV не нужны Groq; старые
credentials не удалять и не переносить в клиент. Новых npm dependencies нет.
GROQ_API_KEY и Redis token запрещены в www, APK, Git и диагностических отчётах.

Ключ не содержит достоверного признака Free/paid. GROQ_FREE_TIER_CONFIRMED —
подтверждение владельца, не проверка тарифа через API. Если владелец позже
переведёт ту же организацию на paid, код не сможет определить это по ключу.
Нужен отдельный Free аккаунт/организация без платного апгрейда и контроль её тарифа.

## Общая защита квоты

Требуется общий Redis REST endpoint с поддержкой EVAL, TIME, ZSET, TTL
(например, Upstash Redis **Free**, не PAYG). Ресурсы не создавались.
[REST API](https://upstash.com/docs/redis/features/restapi),
[актуальный Free тариф](https://upstash.com/pricing/redis).

Атомарный Lua script и Redis TIME, общий namespace/hash tag, без локальных часов:
- пользователь: 5 запросов за rolling minute, 60 за rolling 24 h;
- все пользователи/instances/deployments: 18/minute, 1800/24 h;
- аудио: 6000 s/hour, 24000 s/24 h, каждый запрос резервирует max(10, ceil(duration)).
- sessionId+userId хешируются, повтор блокируется на 24 h;
- запросы оплачены квотой до upload; после ошибки/отмены резерв не возвращается;
- Groq 429 создаёт общий cooldown по Retry-After (максимум 24 h), при его отсутствии
  консервативно 1 h. Новый запрос пользователя тоже проверяет cooldown;
- в Redis только хеши, время и длительность; аудио, текст, email, токены не записываются.
- локальный Map оставлен только как ранняя дополнительная защита, не глобальная;
- отсутствие конфигурации/ошибка Redis запрещает отправку Groq. Нет in-memory fallback.

Лимиты консервативнее опубликованного Free Groq: 20 RPM, 2000 RPD,
7200 audio seconds/hour, 28800/day. Лимит Groq общий для организации;
параллельные приложения/другие ключи могут расходовать остаток вне BudgetPRO.
[Официальные лимиты](https://console.groq.com/docs/rate-limits).
Точные ограничения конкретной организации проверить в её консоли до запуска.

Free Upstash: опубликованы 500K commands/month, 250 MB и 10 GB bandwidth/month.
Нужны контроль именно Free плана и его ресурсов, без автоматического paid upgrade.
При отказе store отправка остановится. Код не определяет тариф Redis по REST token.
Один store необходим для всех instances, использующих одну Groq organization.
Не сбрасывать store/namespace во время окна квоты; потеря/эвикция данных ослабляет
лимиты. Для массового production нужны отдельные согласованные лимиты регистрации,
мониторинг, оценка отказов store и при необходимости усиление anti-abuse.
При отказе записи cooldown уже списанная квота/дедупликация остаются; нельзя
гарантировать сохранение cooldown, если сам store недоступен.

## Ключ, бесплатность и данные

1. Войти владельцем в [Groq Console](https://console.groq.com/keys).
2. Выбрать организацию на Free. Не подключать paid plan/payment/billing.
3. Создать отдельный BudgetPRO server key. Не присылать ключ в чат.
4. Сохранить его как Sensitive ENV только серверного Preview нужного Vercel-проекта.
5. Проверить лимиты и настройки данных организации; затем подтвердить Free флаг.

[Параметры STT](https://console.groq.com/docs/speech-to-text) и
[API reference](https://console.groq.com/docs/api-reference) проверены при реализации.
Модель поддерживает multilingual transcription, но качество RU/KA/EN здесь
не измерено. Синтетический WAV используется только для валидации транспорта.

По [политике Groq](https://console.groq.com/docs/your-data), inference content
обычно не хранится, однако для reliability/abuse могут сохраняться данные до 30 дней.
Есть ZDR-настройка; её включение для реальной организации не проверено.
Без этого подтверждения нельзя обещать нулевое хранение аудио. Аудио уходит
стороннему облачному провайдеру, это не локальное распознавание.

## Изолированный пакет для Preview

Read-only Vercel API подтвердил правильный project ID, Node 24.x,
rootDirectory=null, outputDirectory=www. Production пока
`dpl_8Pv2eQR3EByprDH7ZyJye7dp7KVJ`.
Supabase ENV существуют на preview/production; новые ASR/Groq/Redis ENV отсутствуют.
Значения Sensitive ENV не извлекались/не выводились.

Каталог: `/tmp/budgetpro-groq-release-eg7uymy4`.
Manifest: `/tmp/budgetpro-groq-release-manifest.json`.
Patch от проверенной production-базы: `/tmp/budgetpro-groq-release.patch`.
Локальный diff только этого задания: `/tmp/budgetpro-groq-task.patch`.

15 файлов серверного release относительно production:
```
api/voice/health.js
api/voice/transcribe.js
package.json
package-lock.json
server/voice/asr.js
server/voice/config.js
server/voice/cors.js
server/voice/google-client.js
server/voice/google-errors.js
server/voice/groq-client.js
server/voice/request-limits.js
server/voice/wif.js
vercel.json
www/api-config.js
www/voice/transcript-validator.js
```
Package/lock взяты из ранее подготовленного изолированного WIF release, не из
рабочего Electron/package. Старые production Auth, JSONBin и frontend сохранены
побайтово. Ничего не удалено. Незавершённый www/index.js не попадает в release.
Серверные Google/WIF файлы нужны для сохранения опциональной совместимости.
Новых зависимостей Groq/Redis нет; Node 24 предоставляет fetch/FormData/Blob.

Preview deployment не выполнялся: текущий этап остановлен после локальной
реализации и тестов. Не использовать этот временный каталог без повторной проверки
актуальной production-базы, manifest и целевого project ID перед публикацией.
После настройки настоящих Preview ENV можно опубликовать только этот изолированный
каталог в Preview; отдельное разрешение требуется для реального STT-запроса.
Production и второй проект budget-pro не затрагивать.
Откат: прежний production deployment не меняется; будущий Preview можно удалить.
Нельзя деплоить весь текущий dirty worktree.

## Android и реальный приёмочный тест

Старый JS-клиент жёстко разрешал только google-stt-v2/chirp_2. В рабочем www
проверка переведена на общий контракт provider/model; обновлены сообщения/диагностика, нативный код не менялся.
**Установленный старый APK не получит эти JS-правки из server-only Preview.**
Потребуется согласованное обновление packaged www assets и сборка/установка APK.
Текущий Android API URL указывает на production. Для проверки Preview нужен
контролируемый тестовый API URL либо отдельный локальный/браузерный harness.
Здесь URL не менялся, APK не собирался, настройки телефона не изменялись.
Не выдавать server-only Preview за восстановленный голосовой ввод на телефоне.

После согласования: одна короткая человеческая WAV (RU/KA/EN поэтапно, не массово),
валидная Supabase-сессия, проверить текст и отдельно финансовый черновик с суммой,
валютой, категорией/типом. Исходный текст и полученный черновик сверять независимо.
Проверить auto без language и отмену; не сохранять тестовую операцию автоматически.
Затем отдельно проверить Android recorder → API → text → draft → ручное сохранение.
Фактическая скорость и точность финансовых сумм пока не подтверждены.

## Результаты локальных проверок

Node.js 24.22.2, команда:
```
env -u VOICE_RUN_REAL_API -u VOICE_TEST_ACCESS_TOKEN \
  /tmp/node-v24.22.2-linux-x64/bin/node --test \
  tests/voice/*.test.js tests/auth/*.test.js tests/finance/*.test.js
```

- Всего 213: PASS 171, FAIL 0, SKIP 42.
- 37 новых Groq/лимитер/совместимость тестов прошли.
- 42 real-backend сценария пропущены: отсутствуют человеческие WAV fixtures.
  Это не успех распознавания.
- Проверены multipart и ru/ka/en/auto, 429, 401/403, 500/400, network,
  empty transcript, malformed response, key/config absence, invalid WAV,
  Supabase rejection, CORS OPTIONS, timeout, abort, no retry/fallback,
  dedup after failed upload и недоступный Redis.
- Реальные Lua scripts исполнены через уже установленную системную liblua5.3;
  Redis primitives/clock подменены. Проверены minute/day/user/global/audio
  limits, rolling reset и общий cooldown. Нет подтверждения настоящего Redis REST.
- VM-тест Android JS проверяет прежний WAV/Bearer/API request contract,
  новый ответ Groq, quota/cancel, отдельный financial-parse status.
- Старые Google SA/WIF mocks, Auth/JSONBin и финансовые тесты проходят.
- Проверка синтаксиса 18 затронутых JS файлов и импорт 6 изолированных API
  handlers на Node 24 прошли. Для import использованы уже установленные
  зависимости прежнего WIF release через NODE_PATH, без установки новых.
- git diff --check прошёл. Дополнительно проверяется diff только этого задания,
  поскольку рабочая копия уже содержит изменения прошлых этапов.

Полный список файлов текущего задания (22):
```
.env.example
api/voice/health.js
api/voice/transcribe.js
server/voice/asr.js
server/voice/groq-client.js
server/voice/request-limits.js
www/index.js
www/voice/voice-api-client.js
www/voice/voice-diagnostics.js
www/voice/voice-session.js
www/voice/voice-ui.js
scripts/voice-check.js
scripts/voice-cli-common.js
scripts/voice-test-api.js
tests/voice/api.test.js
tests/voice/groq.test.js
tests/voice/helpers/redis-lua.py
tests/voice/integration.test.js
tests/voice/routing-auth.test.js
tests/voice/wif.test.js
docs/voice-input.md
docs/voice-groq-implementation.md
```

Реальные аккаунты Groq/Redis не создавались и не перенастраивались. Реальные
ASR-запросы не выполнялись. Google billing, ENV и production deployment
не изменялись. APK не собирался, распознавание на физическом Android не проверено.
