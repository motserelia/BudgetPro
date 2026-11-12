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
import android.util.Log;
import android.webkit.ConsoleMessage;
import android.webkit.JavascriptInterface;
import android.view.View;
import android.webkit.WebView;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import com.getcapacitor.BridgeActivity;
import com.getcapacitor.BridgeWebChromeClient;
import com.getcapacitor.android.R;
import java.util.ArrayList;
import org.json.JSONArray;
import org.json.JSONObject;

public class MainActivity extends BridgeActivity {
    private static final int REQ_POST_NOTIFICATIONS = 9102;
    private static final String REMINDER_PREFS = "budgetpro_reminder_receiver";
    private static final String EXACT_IDS_KEY = "tracked_exact_alarm_ids";
    private static final String EXACT_GENERATION_KEY = "exact_alarm_generation";
    private WebView budgetWebView;
    private boolean pendingOpenNotificationClock = false;

    public static class TraceBridge {
        @JavascriptInterface
        public void log(String message) {
            Log.d("BudgetPRO", "[JSBRIDGE] " + message);
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
        registerPlugin(pro.budget.app.voice.LocalVoskPlugin.class);
        registerPlugin(pro.budget.app.voice.LocalWhisperPlugin.class);
        super.onCreate(savedInstanceState);

        View webView = findViewById(R.id.webview);
        if (webView != null) {
            if (webView instanceof WebView) {
                WebView wv = (WebView) webView;
                budgetWebView = wv;
                // Тёмный фон самого WebView: белая вспышка при холодном старте
                // исчезает ещё до загрузки HTML и CSS.
                wv.setBackgroundColor(0xFF121212);
                wv.clearCache(true);
                wv.clearHistory();
                wv.getSettings().setCacheMode(android.webkit.WebSettings.LOAD_NO_CACHE);
                wv.addJavascriptInterface(new TraceBridge(), "BudgetPROTrace");
                wv.addJavascriptInterface(new NotificationsBridge(this), "BudgetPRONotifications");
                wv.setWebChromeClient(new BridgeWebChromeClient(bridge) {
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

    // Возврат из фона: WebView мог остаться на паузе после onPause(), тогда
    // страница не перерисовывается и пользователь видит чёрный экран.
    // Возобновляем таймеры, сам WebView и принудительно просим перерисовку.
    @Override
    public void onResume() {
        super.onResume();
        if (budgetWebView == null) {
            budgetWebView = findBudgetWebView();
        }
        if (budgetWebView == null) return;
        budgetWebView.onResume();
        budgetWebView.resumeTimers();
        budgetWebView.requestLayout();
        budgetWebView.invalidate();
    }

    @Override
    public void onPause() {
        if (budgetWebView != null) {
            budgetWebView.onPause();
        }
        super.onPause();
    }

    private WebView findBudgetWebView() {
        View view = findViewById(R.id.webview);
        return view instanceof WebView ? (WebView) view : null;
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

    @Override
    public void onRequestPermissionsResult(
        int requestCode,
        String[] permissions,
        int[] grantResults
    ) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == REQ_POST_NOTIFICATIONS) {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S && !canScheduleExactAlarms()) {
                openExactAlarmSettings();
            }
        }
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
    }
}
