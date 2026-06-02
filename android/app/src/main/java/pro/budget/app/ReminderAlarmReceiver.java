package pro.budget.app;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.SharedPreferences;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.media.AudioManager;
import android.media.AudioAttributes;
import android.media.Ringtone;
import android.media.RingtoneManager;
import android.media.ToneGenerator;
import android.net.Uri;
import android.os.Build;
import android.os.Handler;
import android.os.Looper;
import android.os.VibrationEffect;
import android.os.Vibrator;
import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;

public class ReminderAlarmReceiver extends BroadcastReceiver {
    public static final String CHANNEL_ID = "budget_native_reminders";
    private static final String CHANNEL_SOUND_VERSION = "v5";
    private static final String PREFS_NAME = "budgetpro_reminder_receiver";
    private static final String EXACT_GENERATION_KEY = "exact_alarm_generation";
    public static final String EXTRA_NOTIFICATION_ID = "notificationId";
    public static final String EXTRA_TITLE = "title";
    public static final String EXTRA_BODY = "body";
    public static final String EXTRA_DELIVERY_MODE = "deliveryMode";
    public static final String EXTRA_SOUND_CHOICE = "soundChoice";
    public static final String EXTRA_GENERATION = "generation";

    @Override
    public void onReceive(Context context, Intent intent) {
        int notificationId = intent != null
            ? intent.getIntExtra(EXTRA_NOTIFICATION_ID, 990001)
            : 990001;
        String title = intent != null
            ? intent.getStringExtra(EXTRA_TITLE)
            : "BudgetPRO reminder";
        String body = intent != null
            ? intent.getStringExtra(EXTRA_BODY)
            : "Open BudgetPRO and check your planned reminder.";
        String deliveryMode = intent != null
            ? intent.getStringExtra(EXTRA_DELIVERY_MODE)
            : "sound_vibration";
        String soundChoice = intent != null
            ? intent.getStringExtra(EXTRA_SOUND_CHOICE)
            : "sound_1";
        int incomingGeneration = intent != null
            ? intent.getIntExtra(EXTRA_GENERATION, 0)
            : 0;
        int currentGeneration = context
            .getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
            .getInt(EXACT_GENERATION_KEY, 1);
        if (incomingGeneration != currentGeneration) {
            return;
        }
        if (body == null || body.trim().isEmpty()) {
            body = restoreLastBody(context, notificationId, title);
        } else {
            saveLastBody(context, notificationId, title, body);
        }
        String channelId = buildChannelId(deliveryMode, soundChoice);

        ensureChannel(context, channelId, deliveryMode, soundChoice);

        Intent launchIntent = context.getPackageManager()
            .getLaunchIntentForPackage(context.getPackageName());
        PendingIntent contentIntent = null;
        if (launchIntent != null) {
            launchIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
            launchIntent.putExtra("openClock", true);
            launchIntent.putExtra("notificationTitle", title);
            launchIntent.putExtra("notificationBody", body);
            contentIntent = PendingIntent.getActivity(
                context,
                notificationId,
                launchIntent,
                pendingFlags()
            );
        }

        NotificationCompat.Builder builder = new NotificationCompat.Builder(context, channelId)
            .setSmallIcon(context.getApplicationInfo().icon)
            .setContentTitle(body)
            .setContentText(body)
            .setStyle(new NotificationCompat.BigTextStyle().setBigContentTitle(body).bigText(body))
            .setSubText(title)
            .setTicker(body)
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setCategory(NotificationCompat.CATEGORY_REMINDER)
            .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
            .setDefaults(Notification.DEFAULT_LIGHTS)
            .setAutoCancel(true);

        if (contentIntent != null) {
            builder.setContentIntent(contentIntent);
        }

        if ("silent".equals(deliveryMode)) {
            builder.setSilent(true);
            builder.setDefaults(0);
            builder.setVibrate(new long[] { 0L });
        } else if ("vibration_only".equals(deliveryMode)) {
            builder.setSilent(true);
            builder.setDefaults(0);
            builder.setVibrate(vibrationPatternFor(soundChoice));
            vibrateNow(context, soundChoice);
        } else {
            Uri soundUri = soundUriFor(context, soundChoice);
            builder.setSilent(false);
            builder.setSound(soundUri);
            if ("sound_only".equals(deliveryMode)) {
                builder.setVibrate(new long[] { 0L });
            } else {
                builder.setVibrate(vibrationPatternFor(soundChoice));
                vibrateNow(context, soundChoice);
            }
        }

        NotificationManagerCompat.from(context).notify(notificationId, builder.build());
    }

    private static int pendingFlags() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            return PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE;
        }
        return PendingIntent.FLAG_UPDATE_CURRENT;
    }

    private static String buildChannelId(String deliveryMode, String soundChoice) {
        return CHANNEL_ID
            + "_"
            + CHANNEL_SOUND_VERSION
            + "_"
            + safePart(deliveryMode)
            + "_"
            + safePart(soundChoice);
    }

    private static String safePart(String value) {
        if (value == null || value.trim().isEmpty()) return "default";
        return value.replaceAll("[^a-zA-Z0-9_]+", "_");
    }

    private static String restoreLastBody(Context context, int notificationId, String title) {
        SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        String restored = prefs.getString("body_id_" + notificationId, null);
        if (restored == null || restored.trim().isEmpty()) {
            String legacyKey = "body_" + safePart(title);
            restored = prefs.getString(legacyKey, null);
        }
        return restored != null && !restored.trim().isEmpty()
            ? restored
            : "Open BudgetPRO and check your planned reminder.";
    }

    private static void saveLastBody(Context context, int notificationId, String title, String body) {
        SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        prefs
            .edit()
            .putString("body_id_" + notificationId, body)
            .putString("body_" + safePart(title), body)
            .apply();
    }

    private static String soundResourceNameFor(String soundChoice) {
        String name;
        switch (soundChoice == null ? "sound_1" : soundChoice) {
            case "sound_2":
                name = "reminder_sound_2";
                break;
            case "sound_3":
                name = "reminder_sound_3";
                break;
            case "sound_4":
                name = "reminder_sound_4";
                break;
            case "sound_5":
                name = "reminder_sound_5";
                break;
            case "sound_6":
                name = "reminder_sound_6";
                break;
            case "sound_7":
                name = "reminder_sound_7";
                break;
            case "sound_8":
                name = "reminder_sound_8";
                break;
            case "sound_9":
                name = "reminder_sound_9";
                break;
            case "sound_10":
                name = "reminder_sound_10";
                break;
            case "sound_11":
                name = "reminder_sound_11";
                break;
            case "sound_12":
                name = "reminder_sound_12";
                break;
            case "sound_13":
                name = "reminder_sound_13";
                break;
            case "sound_14":
                name = "reminder_sound_14";
                break;
            default:
                name = "reminder_sound_1";
                break;
        }
        return name;
    }

    private static Uri soundUriFor(Context context, String soundChoice) {
        try {
            String resName = soundResourceNameFor(soundChoice);
            int resId = context.getResources().getIdentifier(
                resName,
                "raw",
                context.getPackageName()
            );
            if (resId != 0) {
                return Uri.parse(
                    "android.resource://"
                        + context.getPackageName()
                        + "/"
                        + resId
                );
            }
        } catch (Exception ignored) {}
        return RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION);
    }

    private static int[] toneSequenceFor(String soundChoice) {
        switch (soundChoice == null ? "sound_1" : soundChoice) {
            case "sound_2":
                return new int[] { ToneGenerator.TONE_PROP_BEEP2, ToneGenerator.TONE_PROP_ACK };
            case "sound_3":
                return new int[] { ToneGenerator.TONE_CDMA_ALERT_CALL_GUARD, ToneGenerator.TONE_PROP_BEEP };
            case "sound_4":
                return new int[] { ToneGenerator.TONE_PROP_ACK };
            case "sound_5":
                return new int[] { ToneGenerator.TONE_CDMA_ALERT_NETWORK_LITE, ToneGenerator.TONE_CDMA_ONE_MIN_BEEP };
            case "sound_6":
                return new int[] { ToneGenerator.TONE_PROP_NACK, ToneGenerator.TONE_PROP_ACK };
            case "sound_7":
                return new int[] { ToneGenerator.TONE_CDMA_PIP, ToneGenerator.TONE_CDMA_PIP };
            case "sound_8":
                return new int[] { ToneGenerator.TONE_CDMA_HIGH_L, ToneGenerator.TONE_CDMA_HIGH_SS };
            case "sound_9":
                return new int[] { ToneGenerator.TONE_CDMA_SOFT_ERROR_LITE, ToneGenerator.TONE_PROP_BEEP2 };
            case "sound_10":
                return new int[] { ToneGenerator.TONE_CDMA_EMERGENCY_RINGBACK, ToneGenerator.TONE_PROP_ACK };
            default:
                return new int[] { ToneGenerator.TONE_PROP_BEEP };
        }
    }

    private static int toneDurationFor(String soundChoice) {
        switch (soundChoice == null ? "sound_1" : soundChoice) {
            case "sound_2":
            case "sound_3":
            case "sound_8":
            case "sound_10":
                return 420;
            case "sound_5":
            case "sound_9":
                return 520;
            default:
                return 360;
        }
    }

    private static void playToneNow(String soundChoice) {
        try {
            final ToneGenerator tg = new ToneGenerator(AudioManager.STREAM_ALARM, 100);
            final int[] tones = toneSequenceFor(soundChoice);
            final int duration = toneDurationFor(soundChoice);
            Handler handler = new Handler(Looper.getMainLooper());
            for (int i = 0; i < tones.length; i++) {
                final int tone = tones[i];
                handler.postDelayed(
                    () -> tg.startTone(tone, duration),
                    i * (duration + 110L)
                );
            }
            handler.postDelayed(tg::release, tones.length * (duration + 140L));
        } catch (Exception ignored) {}
    }

    private static void playRingtoneNow(Context context, String soundChoice) {
        try {
            final Ringtone ringtone = RingtoneManager.getRingtone(context, soundUriFor(context, soundChoice));
            if (ringtone == null) return;
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
                ringtone.setLooping(false);
            }
            ringtone.play();
            int stopAfterMs;
            switch (soundChoice == null ? "sound_1" : soundChoice) {
                case "sound_5":
                case "sound_8":
                case "sound_10":
                    stopAfterMs = 2400;
                    break;
                case "sound_2":
                case "sound_3":
                case "sound_6":
                case "sound_9":
                    stopAfterMs = 1800;
                    break;
                default:
                    stopAfterMs = 1400;
                    break;
            }
            new Handler(Looper.getMainLooper()).postDelayed(() -> {
                try {
                    ringtone.stop();
                } catch (Exception ignored) {}
            }, stopAfterMs);
        } catch (Exception ignored) {}
    }

    private static long[] vibrationPatternFor(String soundChoice) {
        switch (soundChoice == null ? "sound_1" : soundChoice) {
            case "sound_2":
                return new long[] { 0L, 120L, 90L, 120L };
            case "sound_3":
                return new long[] { 0L, 180L, 80L, 180L };
            case "sound_4":
                return new long[] { 0L, 260L };
            case "sound_5":
                return new long[] { 0L, 90L, 70L, 90L, 70L, 90L };
            case "sound_6":
                return new long[] { 0L, 220L, 120L, 120L };
            case "sound_7":
                return new long[] { 0L, 140L, 60L, 220L };
            case "sound_8":
                return new long[] { 0L, 320L, 90L, 140L };
            case "sound_9":
                return new long[] { 0L, 100L, 60L, 100L, 60L, 220L };
            case "sound_10":
                return new long[] { 0L, 420L };
            default:
                return new long[] { 0L, 180L };
        }
    }

    private static void vibrateNow(Context context, String soundChoice) {
        try {
            Vibrator vibrator = (Vibrator) context.getSystemService(Context.VIBRATOR_SERVICE);
            if (vibrator == null || !vibrator.hasVibrator()) return;
            long[] pattern = vibrationPatternFor(soundChoice);
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                vibrator.vibrate(VibrationEffect.createWaveform(pattern, -1));
            } else {
                vibrator.vibrate(pattern, -1);
            }
        } catch (Exception ignored) {}
    }

    private static void ensureChannel(
        Context context,
        String channelId,
        String deliveryMode,
        String soundChoice
    ) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) return;
        NotificationManager manager = context.getSystemService(NotificationManager.class);
        if (manager == null) return;
        NotificationChannel existing = manager.getNotificationChannel(channelId);
        if (existing != null) return;

        NotificationChannel channel = new NotificationChannel(
            channelId,
            "BudgetPRO Full Reminders",
            NotificationManager.IMPORTANCE_HIGH
        );
        channel.setDescription(
            "Full scheduled reminders from BudgetPRO with clear text in the notification shade."
        );
        channel.setLockscreenVisibility(Notification.VISIBILITY_PUBLIC);
        if ("silent".equals(deliveryMode)) {
            channel.setSound(null, null);
            channel.enableVibration(false);
        } else if ("vibration_only".equals(deliveryMode)) {
            channel.setSound(null, null);
            channel.enableVibration(true);
            channel.setVibrationPattern(vibrationPatternFor(soundChoice));
        } else {
            AudioAttributes attrs = new AudioAttributes.Builder()
                .setUsage(AudioAttributes.USAGE_NOTIFICATION)
                .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                .build();
            channel.setSound(soundUriFor(context, soundChoice), attrs);
            if ("sound_only".equals(deliveryMode)) {
                channel.enableVibration(false);
            } else {
                channel.enableVibration(true);
                channel.setVibrationPattern(vibrationPatternFor(soundChoice));
            }
        }
        manager.createNotificationChannel(channel);
    }
}
