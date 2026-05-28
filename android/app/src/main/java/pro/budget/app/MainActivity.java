package pro.budget.app;

import android.Manifest;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Bundle;
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
    private WebView budgetWebView;
    private SpeechRecognizer speechRecognizer;
    private String pendingVoiceLang = "ru-RU";
    private boolean pendingVoiceAutoLang = false;
    private String pendingVoiceMode = "auto";
    private String latestPartialVoiceText = "";
    private long lastVoiceRmsDispatchAt = 0L;

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
        }
    }

    @Override
    public void onDestroy() {
        stopNativeVoice();
        super.onDestroy();
    }
}
