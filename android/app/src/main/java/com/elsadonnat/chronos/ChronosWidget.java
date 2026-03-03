package com.elsadonnat.chronos;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.View;
import android.widget.RemoteViews;

public class ChronosWidget extends AppWidgetProvider {

    private static final String PREFS_GROUP = "group.com.elsadonnat.chronos.widgets";

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
        String streakStatus = prefs.getString("streakStatus", "inactive");

        // Pick horizontal or vertical layout based on aspect ratio
        Bundle options = appWidgetManager.getAppWidgetOptions(appWidgetId);
        int minWidth = options.getInt(AppWidgetManager.OPTION_APPWIDGET_MIN_WIDTH, 110);
        int minHeight = options.getInt(AppWidgetManager.OPTION_APPWIDGET_MIN_HEIGHT, 110);

        boolean isVertical = minHeight > minWidth * 1.3;
        boolean isNarrow = minWidth < 100; // ~1 column wide
        int layoutRes = isVertical ? R.layout.widget_combined_v : R.layout.widget_combined_h;

        RemoteViews views = new RemoteViews(context.getPackageName(), layoutRes);

        // Streak data
        views.setTextViewText(R.id.combo_streak_count, streak);
        views.setTextViewText(R.id.combo_streak_label, "1".equals(streak) ? "day streak" : "day streak");

        // Hide "day streak" label when too narrow
        views.setViewVisibility(R.id.combo_streak_label, isNarrow ? View.GONE : View.VISIBLE);

        // Flame drawable based on streak status
        int flameRes1;
        int flameRes2;

        switch (streakStatus) {
            case "active":
                flameRes1 = R.drawable.flame_active_1;
                flameRes2 = R.drawable.flame_active_2;
                break;
            case "at-risk":
                flameRes1 = R.drawable.flame_at_risk_1;
                flameRes2 = R.drawable.flame_at_risk_2;
                break;
            default:
                flameRes1 = R.drawable.flame_inactive_1;
                flameRes2 = R.drawable.flame_inactive_2;
                break;
        }

        views.setImageViewResource(R.id.combo_flame_1, flameRes1);
        views.setImageViewResource(R.id.combo_flame_2, flameRes2);
        views.setTextColor(R.id.combo_streak_count, 0xFF8B4157); // burgundy, matches widget border

        // Streak section tap → open app home
        Intent homeIntent = context.getPackageManager().getLaunchIntentForPackage(context.getPackageName());
        if (homeIntent != null) {
            homeIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
            PendingIntent homePending = PendingIntent.getActivity(
                context, 2, homeIntent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
            );
            views.setOnClickPendingIntent(R.id.combo_streak_area, homePending);
        }

        // Practice section tap → open practice tab
        Intent practiceIntent = context.getPackageManager().getLaunchIntentForPackage(context.getPackageName());
        if (practiceIntent != null) {
            practiceIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
            practiceIntent.putExtra("openTab", "practice");
            PendingIntent practicePending = PendingIntent.getActivity(
                context, 3, practiceIntent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
            );
            views.setOnClickPendingIntent(R.id.combo_practice_area, practicePending);
        }

        appWidgetManager.updateAppWidget(appWidgetId, views);
    }
}
