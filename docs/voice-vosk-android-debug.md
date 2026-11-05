# Изолированный Vosk Small на Android

Это независимая debug-сборка pro.budget.app, versionCode 7 (обновление с 6).
Основные www, Android, Groq/Google, Supabase, ENV и Production не изменяются.
Установка и микрофон требуют отдельного разрешения владельца.

## Зависимости и воспроизводимость

Официальные артефакты из Maven Central:
- com.alphacephei:vosk-android:0.3.75@aar
- net.java.dev.jna:jna:5.18.1@aar

AAR используются только в изолированном /tmp Gradle-проекте, с фиксированными
SHA-256 в prepare-vosk-android.py. package.json и основной Gradle не меняются.
Исходный локальный ZIP small-ka-0.42 проверяется по SHA-256, каждый из 14
распакованных файлов сравнивается с ZIP. Модель — 97 400 805 bytes, ZIP —
45 682 310 bytes. Модель и Vosk имеют Apache-2.0; тексты лицензий Vosk/JNA
включены в assets/vosk-licenses. В APK только arm64-v8a.

Официальные источники:
- https://github.com/alphacep/vosk-android-demo/blob/master/app/build.gradle
- https://alphacephei.com/vosk/models
- https://capacitorjs.com/docs/android/custom-code

Подготовка: `python3 scripts/voice-debug/prepare-vosk-android.py`.
Она использует существующий prepare-android.py, сохраняет его старый stage manifest,
а новый manifest пишет в /tmp/budgetpro-vosk-android-stage.json.
Сборка выполняется в новом manifest.stage/android, JDK 21, существующим gradlew:
`./gradlew --offline --no-daemon :app:assembleDebug :app:testDebugUnitTest`.
Включать release запрещено самой конфигурацией staged Gradle.
Проверка артефакта: `python3 scripts/voice-debug/verify-vosk-android.py --device`.
Ни одна из этих команд не устанавливает APK.

## Цепочка

Существующий Web Audio рекордер → WAV PCM16 mono 16 kHz → debug JS adapter →
локальный Capacitor plugin → анонимный pipe с ParcelFileDescriptor →
неэкспортируемый VoskDebugService в отдельном процессе :voskDebug → Vosk SDK →
исходный ka transcript → существующий нормализатор → чистый финансовый парсер →
диагностика в RAM. Финансовая форма не открывается, операция не сохраняется.

Аудио не записывается в файлы. WAV ограничен 30 секундами / 960044 bytes;
проверяется в JS и Java. После обработки доступные WAV/PCM-массивы обнуляются,
decoder закрывается, JS запрашивает release модели. Нативный model.close() идёт
на serial worker. Для warm benchmark selfTest использует два независимых
распознавателя на одной модели, затем закрывает модель. Это синтетическая
тишина, не проверка качества человеческой речи.

При первом явном initialize модель копируется только из APK в noBackupFilesDir,
проверяется SHA-256 каждого файла. Это постоянная копия модели, не аудио.
Никаких URL модели, ключей, облачного SDK или сетевого fallback в адаптере нет.
Адаптер использует подтверждённый window.Capacitor.Plugins.BudgetPROVoskDebug.
Capacitor.registerPlugin не вызывается. При каждом явном prepare проверяются
initialize/transcribe/release/cancel/selfTest; при отсутствии bridge выдаётся
VOSK_NATIVE_PLUGIN_UNAVAILABLE, при неполном контракте VOSK_NATIVE_PLUGIN_INVALID.
Поздняя готовность bridge поддерживается повторной явной проверкой; автоповторов нет.
prepare/selfTest/release/transcribe разделяют блокировку busy. Generation отменяет
устаревший результат инициализации при background/Cancel.
Существующие общие INTERNET/Auth permissions оставлены ради штатной Supabase.
Распознавание не нуждается в интернете; обычная авторизация приложения может
потребовать сеть при истёкшей сессии. Auth-логику не меняли.

## Защиты

Наследуются все 41 sealed финансовые функции, ранние guards оригинальных ссылок,
внешняя saveAll, Storage/IDB/network/partner/event guards v4 и CSP. В приложение
не добавлены секреты. Native plugin знает только PCM, не получает Bearer, hints,
категории, историю или финансовые записи. Функции сохранения не вызываются.
Сохранена история 10 попыток VoiceDiagnostics и отдельная RAM history Vosk.
Первоначально модель не загружается, запись не вооружена. Если native bridge или
модель не готовы, микрофон заблокирован. Одна явная arm даёт одну попытку,
включая ошибку/Cancel. Автоматического повтора нет. При background снимается
готовность и освобождается модель; повторное prepare только явное.

Service проверяет lowMemory и доступную память >=512 MiB, свободное место под
модель с запасом. Java OOM/Linkage errors дают безопасный код. Нативный процесс
отделён от UI; потеря Binder обрабатывается как VOSK_PROCESS_STOPPED. Это снижает
риск, но не гарантирует выживание приложения при общем системном OOM/LMK.
Timeout — 60 секунд, Cancel инвалидирует результат и прерывает chunk loop.

## Проверки после разрешённой установки, ДО микрофона

Оператор через существующий USB/CDP выполняет (Node 24):
1. `scripts/voice-debug/vosk-android-control.js status` — проверить 41 защиты,
   фактический versionCode, встроенный plugin и отсутствие аудио.
2. `... self-test` — реальная загрузка Android Vosk, два прохода синтетического
   PCM, закрытие ресурсов. Метод не запрашивает микрофон и не вызывает парсер.
3. Сохранить logical fingerprints. `... prepare` — локальная инициализация;
   `... arm --confirm-audio-permission` только при разрешении одной записи.
4. Пользователь нажимает прежний микрофон, ждёт готовности, говорит один раз,
   завершает Stop либо VAD. Нельзя нажимать финансовые Save/Delete.
5. `... report` сохраняет RAM результаты без аудио в /tmp/budgetpro-vosk-android-phone-report.json.
6. Проверить hashes, guards, native release и отсутствие второго старта.

Подготовлены A–E в scripts/voice-debug/vosk-android-cases.json. Сначала один A.
Для следующих записей требуется отдельный согласованный тестовый цикл;
автоматической переустановки/перезагрузки/повторной записи инструмент не делает.

Проверять STT transcript отдельно от нормализованного текста и суммы. Валюта,
распознанная как слово, отличается от валюты из настроек: текущий финансовый
парсер вообще не возвращает отдельное поле currency. Ошибка standalone tetri
(50 вместо 0.50) не исправляется и должна оставаться видимой в отчёте.

## Метрики и ограничения проверки

initialize: extraction + проверка файлов + model load, elapsed/CPU/PSS/VmHWM.
recognition: elapsed/CPU, bridgeAndRecognitionMs и heartbeat UI (50 ms).
VmHWM — максимум за жизнь отдельного процесса, не независимый максимум каждой
попытки. PSS — текущий снимок; CPU ms — процесс, не загрузка всего телефона.
Heartbeat не доказывает отсутствие коротких задержек и не заменяет профилировщик.
Проверяются APK/ELF alignment 16 KiB, ABI, подпись, assets и шаблоны секретов.

JVM-тесты используют backend mocks; браузерные тесты — mock Capacitor plugin
с синтетическим WAV и реальным финансовым парсером. Они не доказывают загрузку
libvosk/модели на Android. Нативный SDK и модель практически проверены на устройстве в versionCode 6.
Исправленный JS-адаптер можно дополнительно проверить в отдельном RAM-экземпляре
через настоящий Capacitor.Plugins на той же версии без подмены рабочих объектов.
Это не заменяет проверку запуска встроенного адаптера после разрешённой установки
versionCode 7. Реальные memory-pressure/native crash сценарии и человеческая речь
этой сборки не проверены. Результаты ПК и mocks не выдаются за Android.
