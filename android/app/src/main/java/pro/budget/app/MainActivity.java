package pro.budget.app;

import android.os.Bundle;
import android.util.Log;
import android.webkit.ConsoleMessage;
import android.webkit.JavascriptInterface;
import android.view.View;
import android.webkit.WebView;
import android.webkit.WebChromeClient;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import com.getcapacitor.BridgeActivity;
import com.getcapacitor.android.R;

public class MainActivity extends BridgeActivity {

    public static class TraceBridge {
        @JavascriptInterface
        public void log(String message) {
            Log.d("BudgetPRO", "[JSBRIDGE] " + message);
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
                wv.clearCache(true);
                wv.clearHistory();
                wv.getSettings().setCacheMode(android.webkit.WebSettings.LOAD_NO_CACHE);
                wv.addJavascriptInterface(new TraceBridge(), "BudgetPROTrace");
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
}
