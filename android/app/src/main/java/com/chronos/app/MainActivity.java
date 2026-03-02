package com.chronos.app;

import android.content.Intent;
import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        handleWidgetIntent();
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        handleWidgetIntent();
    }

    private void handleWidgetIntent() {
        String openTab = getIntent().getStringExtra("openTab");
        if (openTab != null) {
            getBridge().getWebView().post(() ->
                getBridge().getWebView().evaluateJavascript(
                    "window.WIDGET_OPEN_TAB = '" + openTab + "';" +
                    "window.dispatchEvent(new CustomEvent('widgetOpenTab', " +
                    "{ detail: '" + openTab + "' }));",
                    null
                )
            );
        }
    }
}
