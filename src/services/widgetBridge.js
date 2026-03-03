import { Capacitor } from '@capacitor/core';
import { WidgetBridgePlugin } from 'capacitor-widget-bridge';

const WIDGET_GROUP = 'group.com.elsadonnat.chronos.widgets';

/**
 * Register widget class names with the bridge plugin.
 * Call once on app startup.
 */
export async function initWidgets() {
  if (Capacitor.getPlatform() !== 'android') return;

  try {
    await WidgetBridgePlugin.setRegisteredWidgets({
      widgets: [
        'com.elsadonnat.chronos.StreakWidget',
        'com.elsadonnat.chronos.QuickPracticeWidget',
        'com.elsadonnat.chronos.ChronosWidget',
      ],
    });
  } catch (e) {
    console.warn('Widget registration failed:', e);
  }
}

/**
 * Compute streak status from app state.
 * Returns 'active' (studied today), 'at-risk' (yesterday, not today), or 'inactive' (lost).
 */
function getStreakStatus(state) {
  if (!state.lastActiveDate || !state.currentStreak) return 'inactive';
  const today = new Date().toISOString().split('T')[0];
  if (state.lastActiveDate === today) return 'active';
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  if (state.lastActiveDate === yesterday.toISOString().split('T')[0]) return 'at-risk';
  return 'inactive';
}

/**
 * Sync relevant state values to SharedPreferences so native widgets can read them.
 * Call whenever app state changes.
 */
export async function syncWidgetData(state) {
  if (Capacitor.getPlatform() !== 'android') return;

  try {
    await WidgetBridgePlugin.setItem({
      group: WIDGET_GROUP,
      key: 'currentStreak',
      value: String(state.currentStreak || 0),
    });

    await WidgetBridgePlugin.setItem({
      group: WIDGET_GROUP,
      key: 'streakStatus',
      value: getStreakStatus(state),
    });

    await WidgetBridgePlugin.setItem({
      group: WIDGET_GROUP,
      key: 'totalXP',
      value: String(state.totalXP || 0),
    });

    // Max XP from a quick practice session (3 events × 20 XP each)
    await WidgetBridgePlugin.setItem({
      group: WIDGET_GROUP,
      key: 'practiceRewardXP',
      value: '60',
    });

    await WidgetBridgePlugin.reloadAllTimelines();
  } catch (e) {
    console.warn('Widget sync failed:', e);
  }
}
