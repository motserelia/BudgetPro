package pro.budget.app;

import android.os.Bundle;
import android.view.View;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import com.getcapacitor.BridgeActivity;
import com.getcapacitor.android.R;

public class MainActivity extends BridgeActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        WindowCompat.setDecorFitsSystemWindows(getWindow(), true);
        super.onCreate(savedInstanceState);

        View webView = findViewById(R.id.webview);
        if (webView != null) {
            ViewCompat.setOnApplyWindowInsetsListener(webView, (view, insets) -> {
                int topInset = insets.getInsets(WindowInsetsCompat.Type.systemBars()).top;
                view.setPadding(0, topInset, 0, 0);
                return insets;
            });
            ViewCompat.requestApplyInsets(webView);
        }
    }
}
