package com.chronos.app;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.widget.RemoteViews;

public class StreakWidget extends AppWidgetProvider {

    private static final String PREFS_GROUP = "group.com.chronos.app.widgets";

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        for (int appWidgetId : appWidgetIds) {
            updateWidget(context, appWidgetManager, appWidgetId);
        }
    }

    static void updateWidget(Context context, AppWidgetManager appWidgetManager, int appWidgetId) {
        SharedPreferences prefs = context.getSharedPreferences(PREFS_GROUP, Context.MODE_PRIVATE);
        String streak = prefs.getString("currentStreak", "0");

        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_streak);
        views.setTextViewText(R.id.streak_count, streak);
        views.setTextViewText(R.id.streak_label, "1".equals(streak) ? "day streak" : "day streak");

        // Tap → open app
        Intent intent = context.getPackageManager().getLaunchIntentForPackage(context.getPackageName());
        if (intent != null) {
            intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
            PendingIntent pendingIntent = PendingIntent.getActivity(
                context, 0, intent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
            );
            views.setOnClickPendingIntent(R.id.widget_streak_root, pendingIntent);
        }

        appWidgetManager.updateAppWidget(appWidgetId, views);
    }
}
