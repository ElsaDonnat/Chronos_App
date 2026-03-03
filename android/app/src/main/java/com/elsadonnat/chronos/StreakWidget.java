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

public class StreakWidget extends AppWidgetProvider {

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

        // Determine widget dimensions to pick the right layout
        Bundle options = appWidgetManager.getAppWidgetOptions(appWidgetId);
        int minWidth = options.getInt(AppWidgetManager.OPTION_APPWIDGET_MIN_WIDTH, 110);
        int minHeight = options.getInt(AppWidgetManager.OPTION_APPWIDGET_MIN_HEIGHT, 110);

        boolean isSmall = minWidth < 120 && minHeight < 120;   // 1x1
        boolean isWide = !isSmall && minWidth > minHeight * 1.3;

        int layoutRes;
        if (isWide) {
            layoutRes = R.layout.widget_streak_wide;
        } else if (isSmall) {
            layoutRes = R.layout.widget_streak_small;
        } else {
            layoutRes = R.layout.widget_streak;
        }
        RemoteViews views = new RemoteViews(context.getPackageName(), layoutRes);

        views.setTextViewText(R.id.streak_count, streak);
        views.setTextViewText(R.id.streak_label, "days in a row");

        // 1x1: show flame + number only; bigger: show label too
        views.setViewVisibility(R.id.streak_count, View.VISIBLE);
        if (!isWide && isSmall) {
            views.setViewVisibility(R.id.streak_label, View.GONE);
        } else {
            views.setViewVisibility(R.id.streak_label, View.VISIBLE);
        }

        // Set flame drawable based on streak status
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
            default: // inactive
                flameRes1 = R.drawable.flame_inactive_1;
                flameRes2 = R.drawable.flame_inactive_2;
                break;
        }

        views.setImageViewResource(R.id.flame_frame_1, flameRes1);
        views.setImageViewResource(R.id.flame_frame_2, flameRes2);
        views.setTextColor(R.id.streak_count, 0xFF8B4157); // burgundy, matches widget border

        // Show green tick when user has played today
        views.setViewVisibility(R.id.check_tick,
            "active".equals(streakStatus) ? View.VISIBLE : View.GONE);

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
