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

public class QuickPracticeWidget extends AppWidgetProvider {

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
        String totalXP = prefs.getString("totalXP", "0");

        // Determine widget size
        Bundle options = appWidgetManager.getAppWidgetOptions(appWidgetId);
        int minWidth = options.getInt(AppWidgetManager.OPTION_APPWIDGET_MIN_WIDTH, 110);
        int minHeight = options.getInt(AppWidgetManager.OPTION_APPWIDGET_MIN_HEIGHT, 110);

        // 1x1: both dimensions single-cell; 2x1/1x2: one dimension single-cell;
        // 2x2+: both dimensions multi-cell
        boolean isSmall = minWidth < 120 && minHeight < 120;         // 1x1
        boolean isWide = minWidth >= 120 && minHeight < 120;          // 2x1
        boolean isTall = minHeight >= 120 && minWidth < 120;          // 1x2
        // else: 2x2+ (both dimensions >= 120)

        // Pick layout based on widget shape
        int layoutRes;
        if (isSmall) {
            layoutRes = R.layout.widget_quick_practice_small;
        } else if (isWide) {
            layoutRes = R.layout.widget_quick_practice_wide;
        } else if (isTall) {
            layoutRes = R.layout.widget_quick_practice_tall;
        } else {
            layoutRes = R.layout.widget_quick_practice;
        }

        RemoteViews views = new RemoteViews(context.getPackageName(), layoutRes);

        // Set stats only on full 2x2+ layout
        if (!isSmall && !isWide && !isTall) {
            String rewardXP = prefs.getString("practiceRewardXP", "60");
            views.setTextViewText(R.id.practice_reward_xp, "Earn up to " + rewardXP + " XP");
            views.setTextViewText(R.id.practice_streak, streak + " day streak");
            views.setTextViewText(R.id.practice_xp, totalXP + " XP");
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
