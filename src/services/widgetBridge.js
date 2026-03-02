import { Capacitor } from '@capacitor/core';
import { WidgetBridgePlugin } from 'capacitor-widget-bridge';

const WIDGET_GROUP = 'group.com.chronos.app.widgets';

/**
 * Register widget class names with the bridge plugin.
 * Call once on app startup.
 */
export async function initWidgets() {
  if (Capacitor.getPlatform() !== 'android') return;

  try {
    await WidgetBridgePlugin.setRegisteredWidgets({
      widgets: [
        'com.chronos.app.StreakWidget',
        'com.chronos.app.QuickPracticeWidget',
      ],
    });
  } catch (e) {
    console.warn('Widget registration failed:', e);
  }
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
      key: 'totalXP',
      value: String(state.totalXP || 0),
    });

    await WidgetBridgePlugin.reloadAllTimelines();
  } catch (e) {
    console.warn('Widget sync failed:', e);
  }
}
