package com.chronos.app;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.widget.RemoteViews;

public class QuickPracticeWidget extends AppWidgetProvider {

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
        String totalXP = prefs.getString("totalXP", "0");

        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_quick_practice);
        views.setTextViewText(R.id.practice_streak, streak + " day streak");
        views.setTextViewText(R.id.practice_xp, totalXP + " XP");

        // Tap → open app to Practice tab
        Intent intent = context.getPackageManager().getLaunchIntentForPackage(context.getPackageName());
        if (intent != null) {
            intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
            intent.putExtra("openTab", "practice");
            PendingIntent pendingIntent = PendingIntent.getActivity(
                context, 1, intent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
            );
            views.setOnClickPendingIntent(R.id.widget_practice_root, pendingIntent);
        }

        appWidgetManager.updateAppWidget(appWidgetId, views);
    }
}
