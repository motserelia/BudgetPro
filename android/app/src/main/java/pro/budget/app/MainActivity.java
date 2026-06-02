package pro.budget.app;

import android.Manifest;
import android.app.AlarmManager;
import android.app.PendingIntent;
import android.content.SharedPreferences;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.provider.Settings;
import android.speech.RecognitionListener;
import android.speech.RecognizerIntent;
import android.speech.SpeechRecognizer;
import android.util.Log;
import android.webkit.ConsoleMessage;
import android.webkit.JavascriptInterface;
import android.view.View;
import android.webkit.WebView;
import android.webkit.WebChromeClient;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import com.getcapacitor.BridgeActivity;
import com.getcapacitor.android.R;
import java.util.ArrayList;
import java.util.Locale;
import org.json.JSONArray;
import org.json.JSONObject;

public class MainActivity extends BridgeActivity {
    private static final int REQ_RECORD_AUDIO = 9101;
    private static final int REQ_POST_NOTIFICATIONS = 9102;
    private static final String REMINDER_PREFS = "budgetpro_reminder_receiver";
    private static final String EXACT_IDS_KEY = "tracked_exact_alarm_ids";
    private static final String EXACT_GENERATION_KEY = "exact_alarm_generation";
    private WebView budgetWebView;
    private SpeechRecognizer speechRecognizer;
    private String pendingVoiceLang = "ru-RU";
    private boolean pendingVoiceAutoLang = false;
    private String pendingVoiceMode = "auto";
    private String latestPartialVoiceText = "";
    private long lastVoiceRmsDispatchAt = 0L;
    private boolean pendingOpenNotificationClock = false;

    public static class TraceBridge {
        @JavascriptInterface
        public void log(String message) {
            Log.d("BudgetPRO", "[JSBRIDGE] " + message);
        }
    }

    public class VoiceBridge {
        @JavascriptInterface
        public void start(String lang) {
            if (lang != null && lang.contains("::")) {
                String[] parts = lang.split("::", 2);
                startNativeVoice(parts[0], parts.length > 1 ? parts[1] : "auto");
                return;
            }
            startNativeVoice(lang, "auto");
        }

        @JavascriptInterface
        public void startConfig(String lang, String mode) {
            startNativeVoice(lang, mode);
        }

        @JavascriptInterface
        public void stop() {
            stopNativeVoice();
        }
    }

    public class SecurityBridge {
        private boolean startFirstAvailableSettings(Intent[] intents) {
            for (Intent intent : intents) {
                try {
                    intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                    if (intent.resolveActivity(getPackageManager()) != null) {
                        startActivity(intent);
                        return true;
                    }
                } catch (Exception ignored) {}
            }
            return false;
        }

        @JavascriptInterface
        public void openSecuritySettings() {
            MainActivity.this.runOnUiThread(() -> {
                try {
                    Intent intent = new Intent(Settings.ACTION_SECURITY_SETTINGS);
                    intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                    startActivity(intent);
                } catch (Exception e) {
                    Intent fallback = new Intent(Settings.ACTION_SETTINGS);
                    fallback.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                    startActivity(fallback);
                }
            });
        }

        @JavascriptInterface
        public void openBiometricEnrollSettings() {
            MainActivity.this.runOnUiThread(() -> {
                Intent biometricEnroll = Build.VERSION.SDK_INT >= Build.VERSION_CODES.R
                    ? new Intent(Settings.ACTION_BIOMETRIC_ENROLL).putExtra(
                        Settings.EXTRA_BIOMETRIC_AUTHENTICATORS_ALLOWED,
                        0x00FF
                    )
                    : new Intent(Settings.ACTION_SECURITY_SETTINGS);

                Intent[] intents = new Intent[] {
                    biometricEnroll,
                    new Intent("android.settings.BIOMETRIC_ENROLL"),
                    new Intent("android.settings.FACE_SETTINGS"),
                    new Intent("android.settings.FACE_UNLOCK_SETTINGS"),
                    new Intent(Settings.ACTION_SECURITY_SETTINGS),
                    new Intent(Settings.ACTION_SETTINGS)
                };

                if (!startFirstAvailableSettings(intents)) {
                    try {
                        Intent fallback = new Intent(Settings.ACTION_SETTINGS);
                        fallback.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                        startActivity(fallback);
                    } catch (Exception ignored) {}
                }
            });
        }
    }

    public static class NotificationsBridge {
        private final MainActivity activity;

        NotificationsBridge(MainActivity activity) {
            this.activity = activity;
        }

        @JavascriptInterface
        public boolean canScheduleExactAlarms() {
            return activity.canScheduleExactAlarms();
        }

        @JavascriptInterface
        public void openExactAlarmSettings() {
            activity.openExactAlarmSettings();
        }

        @JavascriptInterface
        public boolean scheduleExactReminder(long triggerAtMillis, int notificationId, String title, String body) {
            return activity.scheduleExactReminder(
                triggerAtMillis,
                notificationId,
                title,
                body,
                "sound_vibration",
                "sound_1"
            );
        }

        @JavascriptInterface
        public boolean scheduleExactReminderDetailed(
            long triggerAtMillis,
            int notificationId,
            String title,
            String body,
            String deliveryMode,
            String soundChoice
        ) {
            return activity.scheduleExactReminder(
                triggerAtMillis,
                notificationId,
                title,
                body,
                deliveryMode,
                soundChoice
            );
        }

        @JavascriptInterface
        public boolean cancelExactReminder(int notificationId) {
            return activity.cancelExactReminder(notificationId);
        }

        @JavascriptInterface
        public boolean clearTrackedExactRemindersExcept(String keepIdsJson) {
            return activity.clearTrackedExactRemindersExcept(keepIdsJson);
        }
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        WindowCompat.setDecorFitsSystemWindows(getWindow(), true);
        super.onCreate(savedInstanceState);

        View webView = findViewById(R.id.webview);
        if (webView != null) {
            if (webView instanceof WebView) {
                WebView wv = (WebView) webView;
                budgetWebView = wv;
                wv.clearCache(true);
                wv.clearHistory();
                wv.getSettings().setCacheMode(android.webkit.WebSettings.LOAD_NO_CACHE);
                wv.addJavascriptInterface(new TraceBridge(), "BudgetPROTrace");
                wv.addJavascriptInterface(new VoiceBridge(), "BudgetPROVoice");
                wv.addJavascriptInterface(new SecurityBridge(), "BudgetPROSecurity");
                wv.addJavascriptInterface(new NotificationsBridge(this), "BudgetPRONotifications");
                wv.setWebChromeClient(new WebChromeClient() {
                    @Override
                    public boolean onConsoleMessage(ConsoleMessage consoleMessage) {
                        Log.d(
                            "BudgetPRO",
                            consoleMessage.message() +
                            " -- line " +
                            consoleMessage.lineNumber() +
                            " of " +
                            consoleMessage.sourceId()
                        );
                        return true;
                    }
                });
            }
            ViewCompat.setOnApplyWindowInsetsListener(webView, (view, insets) -> {
                int topInset = insets.getInsets(WindowInsetsCompat.Type.systemBars()).top;
                view.setPadding(0, topInset, 0, 0);
                return insets;
            });
            ViewCompat.requestApplyInsets(webView);
        }

        maybeRequestNotificationPermissions();
        maybeRequestExactAlarmAccess();
        handleNotificationClockIntent(getIntent());
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        handleNotificationClockIntent(intent);
    }

    private void handleNotificationClockIntent(Intent intent) {
        if (intent == null || !intent.getBooleanExtra("openClock", false)) return;
        pendingOpenNotificationClock = true;
        dispatchNotificationClockOpen();
    }

    private void dispatchNotificationClockOpen() {
        if (!pendingOpenNotificationClock || budgetWebView == null) return;
        for (int i = 1; i <= 6; i++) {
            final int attempt = i;
            budgetWebView.postDelayed(() -> {
                if (!pendingOpenNotificationClock || budgetWebView == null) return;
                budgetWebView.evaluateJavascript(
                    "window.dispatchEvent(new CustomEvent('budgetpro:open-notification-clock'))",
                    null
                );
                if (attempt >= 3) pendingOpenNotificationClock = false;
            }, 450L * i);
        }
    }

    private void clearKnownBudgetReminderAlarms() {
        AlarmManager alarmManager = getSystemService(AlarmManager.class);
        if (alarmManager == null) return;

        // Clear legacy recurring plugin ids and exact-alarm recurring ids that may linger
        clearAlarmRange(alarmManager, 810000, 816500);
        clearAlarmRange(alarmManager, 910000, 934500);
    }

    private void clearAlarmRange(AlarmManager alarmManager, int fromInclusive, int toInclusive) {
        for (int id = fromInclusive; id <= toInclusive; id++) {
            try {
                Intent intent = new Intent(this, ReminderAlarmReceiver.class);
                PendingIntent pendingIntent = PendingIntent.getBroadcast(
                    this,
                    id,
                    intent,
                    pendingIntentFlags()
                );
                alarmManager.cancel(pendingIntent);
                pendingIntent.cancel();
            } catch (Exception ignored) {}
        }
    }

    private JSONArray getTrackedExactReminderIds() {
        SharedPreferences prefs = getSharedPreferences(REMINDER_PREFS, MODE_PRIVATE);
        String raw = prefs.getString(EXACT_IDS_KEY, "[]");
        try {
            return new JSONArray(raw);
        } catch (Exception e) {
            return new JSONArray();
        }
    }

    private void saveTrackedExactReminderIds(JSONArray ids) {
        getSharedPreferences(REMINDER_PREFS, MODE_PRIVATE)
            .edit()
            .putString(EXACT_IDS_KEY, ids.toString())
            .apply();
    }

    private void trackExactReminderId(int notificationId) {
        try {
            JSONArray ids = getTrackedExactReminderIds();
            for (int i = 0; i < ids.length(); i++) {
                if (ids.optInt(i) == notificationId) return;
            }
            ids.put(notificationId);
            saveTrackedExactReminderIds(ids);
        } catch (Exception ignored) {}
    }

    private void untrackExactReminderId(int notificationId) {
        try {
            JSONArray ids = getTrackedExactReminderIds();
            JSONArray next = new JSONArray();
            for (int i = 0; i < ids.length(); i++) {
                int id = ids.optInt(i);
                if (id != notificationId) next.put(id);
            }
            saveTrackedExactReminderIds(next);
        } catch (Exception ignored) {}
    }

    private int getExactAlarmGeneration() {
        return getSharedPreferences(REMINDER_PREFS, MODE_PRIVATE)
            .getInt(EXACT_GENERATION_KEY, 1);
    }

    private int bumpExactAlarmGeneration() {
        int next = getExactAlarmGeneration() + 1;
        getSharedPreferences(REMINDER_PREFS, MODE_PRIVATE)
            .edit()
            .putInt(EXACT_GENERATION_KEY, next)
            .apply();
        return next;
    }

    private boolean clearTrackedExactRemindersExcept(String keepIdsJson) {
        AlarmManager alarmManager = getSystemService(AlarmManager.class);
        if (alarmManager == null) return false;
        ArrayList<Integer> keepIds = new ArrayList<>();
        try {
            JSONArray keep = new JSONArray(keepIdsJson == null ? "[]" : keepIdsJson);
            for (int i = 0; i < keep.length(); i++) {
                keepIds.add(keep.optInt(i));
            }
        } catch (Exception ignored) {}
        if (keepIds.isEmpty()) {
            bumpExactAlarmGeneration();
        }

        try {
            JSONArray tracked = getTrackedExactReminderIds();
            JSONArray next = new JSONArray();
            for (int i = 0; i < tracked.length(); i++) {
                int id = tracked.optInt(i);
                if (keepIds.contains(id)) {
                    next.put(id);
                    continue;
                }
                Intent intent = new Intent(this, ReminderAlarmReceiver.class);
                PendingIntent pendingIntent = PendingIntent.getBroadcast(
                    this,
                    id,
                    intent,
                    pendingIntentFlags()
                );
                try {
                    alarmManager.cancel(pendingIntent);
                    pendingIntent.cancel();
                } catch (Exception ignored) {}
            }
            saveTrackedExactReminderIds(next);
            return true;
        } catch (Exception e) {
            Log.e("BudgetPRO", "Failed to clear tracked exact reminders", e);
            return false;
        }
    }

    private void maybeRequestNotificationPermissions() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.TIRAMISU) return;
        if (
            ContextCompat.checkSelfPermission(this, Manifest.permission.POST_NOTIFICATIONS) ==
            PackageManager.PERMISSION_GRANTED
        ) {
            return;
        }
        ActivityCompat.requestPermissions(
            this,
            new String[] { Manifest.permission.POST_NOTIFICATIONS },
            REQ_POST_NOTIFICATIONS
        );
    }

    private boolean canScheduleExactAlarms() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.S) return true;
        AlarmManager alarmManager = getSystemService(AlarmManager.class);
        return alarmManager != null && alarmManager.canScheduleExactAlarms();
    }

    private void maybeRequestExactAlarmAccess() {
        if (canScheduleExactAlarms()) return;
        openExactAlarmSettings();
    }

    private void openExactAlarmSettings() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.S) return;
        try {
            Intent intent = new Intent(Settings.ACTION_REQUEST_SCHEDULE_EXACT_ALARM);
            intent.setData(Uri.parse("package:" + getPackageName()));
            startActivity(intent);
        } catch (Exception e) {
            Intent fallback = new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
            fallback.setData(Uri.parse("package:" + getPackageName()));
            startActivity(fallback);
        }
    }

    private boolean scheduleExactReminder(
        long triggerAtMillis,
        int notificationId,
        String title,
        String body,
        String deliveryMode,
        String soundChoice
    ) {
        if (triggerAtMillis <= System.currentTimeMillis()) return false;
        AlarmManager alarmManager = getSystemService(AlarmManager.class);
        if (alarmManager == null) return false;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S && !canScheduleExactAlarms()) {
            openExactAlarmSettings();
            return false;
        }
        cancelExactReminder(notificationId);

        String safeTitle = (title == null || title.trim().isEmpty())
            ? "BudgetPRO reminder"
            : title.trim();
        String safeBody = (body == null || body.trim().isEmpty())
            ? safeTitle
            : body.trim();
        String safeDeliveryMode = (deliveryMode == null || deliveryMode.trim().isEmpty())
            ? "sound_vibration"
            : deliveryMode.trim();
        String safeSoundChoice = (soundChoice == null) ? "" : soundChoice.trim();

        SharedPreferences prefs = getSharedPreferences(REMINDER_PREFS, MODE_PRIVATE);
        prefs
            .edit()
            .putString("body_" + safeTitle.replaceAll("[^a-zA-Z0-9_]+", "_"), safeBody)
            .apply();

        Intent intent = new Intent(this, ReminderAlarmReceiver.class);
        intent.putExtra(ReminderAlarmReceiver.EXTRA_NOTIFICATION_ID, notificationId);
        intent.putExtra(ReminderAlarmReceiver.EXTRA_TITLE, safeTitle);
        intent.putExtra(ReminderAlarmReceiver.EXTRA_BODY, safeBody);
        intent.putExtra("deliveryMode", safeDeliveryMode);
        intent.putExtra("soundChoice", safeSoundChoice);
        intent.putExtra("generation", getExactAlarmGeneration());

        PendingIntent pendingIntent = PendingIntent.getBroadcast(
            this,
            notificationId,
            intent,
            pendingIntentFlags()
        );

        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                alarmManager.setExactAndAllowWhileIdle(
                    AlarmManager.RTC_WAKEUP,
                    triggerAtMillis,
                    pendingIntent
                );
            } else {
                alarmManager.setExact(
                    AlarmManager.RTC_WAKEUP,
                    triggerAtMillis,
                    pendingIntent
                );
            }
            trackExactReminderId(notificationId);
            return true;
        } catch (Exception e) {
            Log.e("BudgetPRO", "Failed to schedule exact reminder", e);
            return false;
        }
    }

    private boolean cancelExactReminder(int notificationId) {
        AlarmManager alarmManager = getSystemService(AlarmManager.class);
        if (alarmManager == null) return false;

        Intent intent = new Intent(this, ReminderAlarmReceiver.class);
        PendingIntent pendingIntent = PendingIntent.getBroadcast(
            this,
            notificationId,
            intent,
            pendingIntentFlags()
        );
        try {
            alarmManager.cancel(pendingIntent);
            pendingIntent.cancel();
            untrackExactReminderId(notificationId);
            return true;
        } catch (Exception e) {
            Log.e("BudgetPRO", "Failed to cancel exact reminder", e);
            return false;
        }
    }

    private int pendingIntentFlags() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            return PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE;
        }
        return PendingIntent.FLAG_UPDATE_CURRENT;
    }

    private void startNativeVoice(String lang, String mode) {
        String requestedLang = (lang == null || lang.trim().isEmpty()) ? "auto" : lang.trim();
        String requestedMode = (mode == null || mode.trim().isEmpty())
            ? "auto"
            : mode.trim().toLowerCase(Locale.ROOT);
        pendingVoiceAutoLang = requestedLang.toLowerCase(Locale.ROOT).startsWith("auto");
        pendingVoiceLang = pendingVoiceAutoLang ? "" : requestedLang;
        pendingVoiceMode =
            (
                requestedMode.equals("whisper") ||
                requestedMode.equals("street") ||
                requestedMode.equals("auto")
            )
                ? requestedMode
                : "auto";
        runOnUiThread(() -> {
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.RECORD_AUDIO)
                    != PackageManager.PERMISSION_GRANTED) {
                ActivityCompat.requestPermissions(
                    this,
                    new String[] { Manifest.permission.RECORD_AUDIO },
                    REQ_RECORD_AUDIO
                );
                return;
            }
            beginSpeechRecognition();
        });
    }

    private void beginSpeechRecognition() {
        if (!SpeechRecognizer.isRecognitionAvailable(this)) {
            sendVoiceCallback("error", "Speech recognition is not available on this device");
            return;
        }
        destroySpeechRecognizer();
        latestPartialVoiceText = "";
        lastVoiceRmsDispatchAt = 0L;
        speechRecognizer = SpeechRecognizer.createSpeechRecognizer(this);
        speechRecognizer.setRecognitionListener(new RecognitionListener() {
            @Override
            public void onReadyForSpeech(Bundle params) {}

            @Override
            public void onBeginningOfSpeech() {
                sendVoiceLevel(0.08f);
            }

            @Override
            public void onRmsChanged(float rmsdB) {
                long now = android.os.SystemClock.uptimeMillis();
                if (now - lastVoiceRmsDispatchAt < 24L) return;
                lastVoiceRmsDispatchAt = now;
                float divider = pendingVoiceMode.equals("whisper")
                    ? 7.2f
                    : pendingVoiceMode.equals("street")
                        ? 10.5f
                        : 8.8f;
                float offset = pendingVoiceMode.equals("street") ? 1.4f : 2.0f;
                float gamma = pendingVoiceMode.equals("whisper")
                    ? 0.92f
                    : pendingVoiceMode.equals("street")
                        ? 1.08f
                        : 0.86f;
                float normalized = Math.max(0f, Math.min(1f, (rmsdB + offset) / divider));
                normalized = (float) Math.pow(normalized, gamma);
                sendVoiceLevel(normalized);
            }

            @Override
            public void onBufferReceived(byte[] buffer) {}

            @Override
            public void onEndOfSpeech() {
                sendVoiceLevel(0f);
            }

            @Override
            public void onError(int error) {
                if (latestPartialVoiceText != null && !latestPartialVoiceText.trim().isEmpty()) {
                    sendVoiceCallback("result", latestPartialVoiceText, null);
                } else {
                    sendVoiceCallback("error", "Speech recognition error: " + error);
                }
                stopNativeVoice();
            }

            @Override
            public void onResults(Bundle results) {
                ArrayList<String> matches =
                    results.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION);
                String text = chooseBestVoiceResult(matches);
                if (text.trim().isEmpty()) {
                    sendVoiceCallback("error", "No speech recognized");
                } else {
                    sendVoiceCallback("result", text, matches);
                }
                stopNativeVoice();
            }

            @Override
            public void onPartialResults(Bundle partialResults) {
                ArrayList<String> matches =
                    partialResults.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION);
                String text = chooseBestVoiceResult(matches);
                if (text != null && !text.trim().isEmpty()) {
                    latestPartialVoiceText = text;
                }
            }

            @Override
            public void onEvent(int eventType, Bundle params) {}
        });

        Intent intent = new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH);
        intent.putExtra(
            RecognizerIntent.EXTRA_LANGUAGE_MODEL,
            RecognizerIntent.LANGUAGE_MODEL_FREE_FORM
        );
        if (!pendingVoiceAutoLang) {
            intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE, pendingVoiceLang);
            intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE_PREFERENCE, pendingVoiceLang);
        } else {
            intent.putExtra("android.speech.extra.ENABLE_LANGUAGE_DETECTION", true);
            intent.putStringArrayListExtra(
                "android.speech.extra.LANGUAGE_DETECTION_ALLOWED_LANGUAGES",
                getBudgetProVoiceLanguages()
            );
        }
        intent.putExtra(RecognizerIntent.EXTRA_CALLING_PACKAGE, getPackageName());
        intent.putExtra(
            RecognizerIntent.EXTRA_MAX_RESULTS,
            pendingVoiceMode.equals("whisper") ? 10 : 7
        );
        intent.putExtra(RecognizerIntent.EXTRA_PARTIAL_RESULTS, true);
        intent.putExtra(RecognizerIntent.EXTRA_PREFER_OFFLINE, false);
        long minLength = pendingVoiceMode.equals("whisper")
            ? 2400L
            : pendingVoiceMode.equals("street")
                ? 1900L
                : 1800L;
        long completeSilence = pendingVoiceMode.equals("whisper")
            ? 2400L
            : pendingVoiceMode.equals("street")
                ? 1400L
                : 1700L;
        long maybeSilence = pendingVoiceMode.equals("whisper")
            ? 1800L
            : pendingVoiceMode.equals("street")
                ? 900L
                : 1300L;
        intent.putExtra(RecognizerIntent.EXTRA_SPEECH_INPUT_MINIMUM_LENGTH_MILLIS, minLength);
        intent.putExtra(
            RecognizerIntent.EXTRA_SPEECH_INPUT_COMPLETE_SILENCE_LENGTH_MILLIS,
            completeSilence
        );
        intent.putExtra(
            RecognizerIntent.EXTRA_SPEECH_INPUT_POSSIBLY_COMPLETE_SILENCE_LENGTH_MILLIS,
            maybeSilence
        );
        intent.putExtra(
            RecognizerIntent.EXTRA_PROMPT,
            pendingVoiceMode.equals("whisper")
                ? "BudgetPRO: whisper amount, category, income or expense"
                : pendingVoiceMode.equals("street")
                    ? "BudgetPRO: short phrase with amount and category"
                    : "BudgetPRO: amount, category, income or expense"
        );
        speechRecognizer.startListening(intent);
    }

    private ArrayList<String> getBudgetProVoiceLanguages() {
        ArrayList<String> languages = new ArrayList<>();
        languages.add("ru-RU");
        languages.add("en-US");
        languages.add("ka-GE");
        return languages;
    }

    private String chooseBestVoiceResult(ArrayList<String> matches) {
        if ((matches == null || matches.isEmpty())) {
            return latestPartialVoiceText == null ? "" : latestPartialVoiceText;
        }
        String best = "";
        int bestScore = Integer.MIN_VALUE;
        for (String candidate : matches) {
            if (candidate == null || candidate.trim().isEmpty()) continue;
            int score = scoreVoiceCandidate(candidate);
            if (score > bestScore) {
                best = candidate;
                bestScore = score;
            }
        }
        return best;
    }

    private int scoreVoiceCandidate(String text) {
        String lower = text.toLowerCase(Locale.ROOT);
        int score = 0;
        if (lower.matches(".*\\d.*")) score += 8;

        String[] moneyWords = {
            "lari", "gel", "ლარი", "თეთრი", "lari", "лари", "лар", "руб", "ruble",
            "rub", "usd", "dollar", "dollars", "доллар", "eur", "euro", "евро",
            "₾", "cent", "cents", "tetri"
        };
        for (String word : moneyWords) {
            if (lower.contains(word)) score += 4;
        }

        String[] actionWords = {
            "spent", "paid", "bought", "expense", "income", "salary", "received",
            "earned", "cost", "pay", "refund", "cashback", "потрат", "заплат", "куп",
            "расход", "доход", "зарплат", "получ", "заработ", "დავხარჯე",
            "გადავიხადე", "ვიყიდე", "შემოსავალი", "ხელფასი", "ფასი", "ღირდა"
        };
        for (String word : actionWords) {
            if (lower.contains(word)) score += 3;
        }

        String[] categoryWords = {
            "food", "grocery", "transport", "taxi", "coffee", "restaurant", "rent",
            "продукт", "еда", "транспорт", "такси", "кофе", "ресторан", "коммунал",
            "საჭმ", "პროდუქტ", "ტრანსპორტ", "ტაქს", "ყავა"
        };
        for (String word : categoryWords) {
            if (lower.contains(word)) score += 2;
        }
        return score;
    }

    private void stopNativeVoice() {
        runOnUiThread(() -> {
            destroySpeechRecognizer();
        });
    }

    private void destroySpeechRecognizer() {
        if (speechRecognizer == null) return;
        SpeechRecognizer recognizer = speechRecognizer;
        speechRecognizer = null;
        try {
            recognizer.stopListening();
        } catch (Exception ignored) {}
        try {
            recognizer.cancel();
        } catch (Exception ignored) {}
        recognizer.destroy();
    }

    private void sendVoiceCallback(String status, String payload) {
        sendVoiceCallback(status, payload, null);
    }

    private void sendVoiceCallback(String status, String payload, ArrayList<String> alternatives) {
        if (budgetWebView == null) return;
        JSONArray alternativesJson = new JSONArray();
        if (alternatives != null) {
            for (String alternative : alternatives) {
                if (alternative != null && !alternative.trim().isEmpty()) {
                    alternativesJson.put(alternative);
                }
            }
        }
        String js =
            "window.__budgetProNativeVoiceResult && " +
            "window.__budgetProNativeVoiceResult(" +
            JSONObject.quote(status) +
            "," +
            JSONObject.quote(payload == null ? "" : payload) +
            "," +
            alternativesJson.toString() +
            ");";
        budgetWebView.post(() -> budgetWebView.evaluateJavascript(js, null));
    }

    private void sendVoiceLevel(float level) {
        if (budgetWebView == null) return;
        float normalized = Math.max(0f, Math.min(1f, level));
        String js =
            "window.__budgetProNativeVoiceLevel && " +
            "window.__budgetProNativeVoiceLevel(" +
            normalized +
            ");";
        budgetWebView.post(() -> budgetWebView.evaluateJavascript(js, null));
    }

    @Override
    public void onRequestPermissionsResult(
        int requestCode,
        String[] permissions,
        int[] grantResults
    ) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == REQ_RECORD_AUDIO) {
            if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                beginSpeechRecognition();
            } else {
                sendVoiceCallback("error", "Microphone permission denied");
            }
            return;
        }
        if (requestCode == REQ_POST_NOTIFICATIONS) {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S && !canScheduleExactAlarms()) {
                openExactAlarmSettings();
            }
        }
    }

    @Override
    public void onDestroy() {
        stopNativeVoice();
        super.onDestroy();
    }
}
