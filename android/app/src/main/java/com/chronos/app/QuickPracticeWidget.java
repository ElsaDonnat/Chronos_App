package com.chronos.app;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.View;
import android.widget.RemoteViews;

public class QuickPracticeWidget extends AppWidgetProvider {

    private static final String PREFS_GROUP = "group.com.chronos.app.widgets";

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        for (int appWidgetId : appWidgetIds) {
            updateWidget(context, appWidgetManager, appWidgetId);
        }
    }

    @Override
    public void onAppWidgetOptionsChanged(Context context, AppWidgetManager appWidgetManager, int appWidgetId, Bundle newOptions) {
        updateWidget(context, appWidgetManager, appWidgetId);
    }

    static void updateWidget(Context context, AppWidgetManager appWidgetManager, int appWidgetId) {
        SharedPreferences prefs = context.getSharedPreferences(PREFS_GROUP, Context.MODE_PRIVATE);
        String streak = prefs.getString("currentStreak", "0");
        String totalXP = prefs.getString("totalXP", "0");

        // Determine widget size
        Bundle options = appWidgetManager.getAppWidgetOptions(appWidgetId);
        int minWidth = options.getInt(AppWidgetManager.OPTION_APPWIDGET_MIN_WIDTH, 110);
        int minHeight = options.getInt(AppWidgetManager.OPTION_APPWIDGET_MIN_HEIGHT, 110);

        boolean isSmall = minWidth < 100 || minHeight < 100;      // ~1x1

        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_quick_practice);
        views.setTextViewText(R.id.practice_streak, streak + " day streak");
        views.setTextViewText(R.id.practice_xp, totalXP + " XP");

        // Size-responsive visibility
        if (isSmall) {
            // 1x1: just the hourglass+play logo
            views.setViewVisibility(R.id.practice_title, View.GONE);
            views.setViewVisibility(R.id.practice_label, View.GONE);
            views.setViewVisibility(R.id.practice_stats_row, View.GONE);
        } else {
            // 2x2+: full display (Chronos, label, streak + XP)
            views.setViewVisibility(R.id.practice_title, View.VISIBLE);
            views.setViewVisibility(R.id.practice_label, View.VISIBLE);
            views.setViewVisibility(R.id.practice_stats_row, View.VISIBLE);
        }

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
