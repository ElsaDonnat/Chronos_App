import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';

const isNative = Capacitor.isNativePlatform();

const DAILY_REMINDER = 1001;
const STREAK_REMINDER = 1002;
const CHANNEL_ID = 'chronos-reminders';

const DAILY_TITLES = [
  'Time for history!',
  'Your daily lesson awaits',
  'Ready to learn?',
  'History is calling',
];

const DAILY_BODIES = [
  'Spend a few minutes exploring the story of humanity.',
  'Pick up where you left off.',
  'A quick lesson keeps your knowledge sharp.',
  'Great minds never stop learning.',
];

const STREAK_TITLE = "Don't break your streak!";

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export async function createNotificationChannel() {
  if (!isNative) return;
  try {
    await LocalNotifications.createChannel({
      id: CHANNEL_ID,
      name: 'Chronos Reminders',
      description: 'Daily learning reminders and streak alerts',
      importance: 3, // DEFAULT
      visibility: 0, // PUBLIC
    });
  } catch (e) {
    console.error('Failed to create notification channel:', e);
  }
}

export async function checkNotificationPermission() {
  if (!isNative) return 'unsupported';
  try {
    const result = await LocalNotifications.checkPermissions();
    return result.display; // 'granted' | 'denied' | 'prompt'
  } catch {
    return 'unsupported';
  }
}

export async function requestNotificationPermission() {
  if (!isNative) return 'unsupported';
  try {
    const result = await LocalNotifications.requestPermissions();
    return result.display;
  } catch {
    return 'denied';
  }
}

export async function scheduleDailyReminder(hour, minute) {
  if (!isNative) return;
  try {
    await LocalNotifications.cancel({ notifications: [{ id: DAILY_REMINDER }] });
    await LocalNotifications.schedule({
      notifications: [{
        id: DAILY_REMINDER,
        title: randomFrom(DAILY_TITLES),
        body: randomFrom(DAILY_BODIES),
        channelId: CHANNEL_ID,
        schedule: {
          on: { hour, minute },
          every: 'day',
          allowWhileIdle: true,
        },
      }],
    });
  } catch (e) {
    console.error('Failed to schedule daily reminder:', e);
  }
}

export async function scheduleStreakReminder(currentStreak) {
  if (!isNative) return;
  try {
    await LocalNotifications.cancel({ notifications: [{ id: STREAK_REMINDER }] });
    const body = currentStreak > 1
      ? `You're on a ${currentStreak}-day streak. A quick lesson keeps it alive.`
      : 'A quick lesson today starts building your streak.';
    await LocalNotifications.schedule({
      notifications: [{
        id: STREAK_REMINDER,
        title: STREAK_TITLE,
        body,
        channelId: CHANNEL_ID,
        schedule: {
          on: { hour: 20, minute: 0 },
          every: 'day',
          allowWhileIdle: true,
        },
      }],
    });
  } catch (e) {
    console.error('Failed to schedule streak reminder:', e);
  }
}

export async function cancelDailyReminder() {
  if (!isNative) return;
  try {
    await LocalNotifications.cancel({ notifications: [{ id: DAILY_REMINDER }] });
  } catch (e) {
    console.error('Failed to cancel daily reminder:', e);
  }
}

export async function cancelStreakReminder() {
  if (!isNative) return;
  try {
    await LocalNotifications.cancel({ notifications: [{ id: STREAK_REMINDER }] });
  } catch (e) {
    console.error('Failed to cancel streak reminder:', e);
  }
}

export async function cancelAllReminders() {
  if (!isNative) return;
  try {
    await LocalNotifications.cancel({
      notifications: [{ id: DAILY_REMINDER }, { id: STREAK_REMINDER }],
    });
  } catch (e) {
    console.error('Failed to cancel all reminders:', e);
  }
}

export async function rescheduleNotifications(settings, currentStreak) {
  if (!isNative) return;
  const [hour, minute] = (settings.dailyReminderTime || '09:00').split(':').map(Number);
  await scheduleDailyReminder(hour, minute);
  if (settings.streakRemindersEnabled) {
    await scheduleStreakReminder(currentStreak);
  } else {
    await cancelStreakReminder();
  }
}
