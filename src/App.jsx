import { useState, useEffect, useRef, useCallback } from 'react';
import { App as CapApp } from '@capacitor/app';
import { useApp } from './context/AppContext';
import TopBar from './components/TopBar';
import Sidebar, { MobileTabBar } from './components/layout/Sidebar';
import LearnPage from './pages/LearnPage';
import TimelinePage from './pages/TimelinePage';
import PracticePage from './pages/PracticePage';
import Settings from './components/Settings';
import NotificationOnboarding from './components/NotificationOnboarding';
import { ConfirmModal } from './components/shared';
import {
  createNotificationChannel,
  scheduleDailyReminder,
  scheduleStreakReminder,
  rescheduleNotifications,
} from './services/notifications';

const TAB_KEYS = { '1': 'learn', '2': 'timeline', '3': 'practice' };
const RATING_MILESTONE = 3; // Show rating prompt after completing 3 lessons
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.chronos.app';

export default function App() {
  const [activeTab, setActiveTab] = useState('learn');
  const [inSession, setInSession] = useState(false);
  const { state, dispatch } = useApp();
  const mainRef = useRef(null);
  // Ref for child pages to register a back handler
  const backHandlerRef = useRef(null);

  useEffect(() => {
    mainRef.current?.scrollTo(0, 0);
  }, [activeTab]);

  // Android hardware back button
  useEffect(() => {
    const listener = CapApp.addListener('backButton', () => {
      // 1. Settings open → close settings
      if (state.settingsOpen) {
        dispatch({ type: 'TOGGLE_SETTINGS' });
        return;
      }
      // 2. Child page has a back handler (lesson flow, practice session, etc.)
      if (backHandlerRef.current) {
        backHandlerRef.current();
        return;
      }
      // 3. Not on learn tab → go to learn tab
      if (activeTab !== 'learn') {
        setActiveTab('learn');
        return;
      }
      // 4. On learn tab, top level → minimize app
      CapApp.minimizeApp();
    });

    return () => { listener.then(l => l.remove()); };
  }, [state.settingsOpen, dispatch, activeTab]);

  const registerBackHandler = useCallback((handler) => {
    backHandlerRef.current = handler;
    return () => { backHandlerRef.current = null; };
  }, []);

  const handleKeyDown = useCallback((e) => {
    // Don't capture when user is typing in an input
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    if (e.key === 'Escape' && state.settingsOpen) {
      dispatch({ type: 'TOGGLE_SETTINGS' });
      return;
    }

    if (TAB_KEYS[e.key]) {
      setActiveTab(TAB_KEYS[e.key]);
    }
  }, [state.settingsOpen, dispatch]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Show rating prompt after milestone (derived from state, no effect needed)
  const completedCount = Object.keys(state.completedLessons).length;
  const shouldShowRating = completedCount >= RATING_MILESTONE && !state.ratingPromptDismissed;

  // Notification onboarding — show after first lesson, but not when rating is showing
  const shouldShowNotificationOnboarding =
    completedCount >= 1 &&
    !state.notificationOnboardingDismissed &&
    !shouldShowRating;

  // Init notification channel + reschedule on mount
  useEffect(() => {
    createNotificationChannel();
    if (state.notificationsEnabled) {
      rescheduleNotifications(state, state.currentStreak);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Reschedule notifications on app resume
  useEffect(() => {
    const listener = CapApp.addListener('appStateChange', ({ isActive }) => {
      if (isActive && state.notificationsEnabled) {
        rescheduleNotifications(state, state.currentStreak);
      }
    });
    return () => { listener.then(l => l.remove()); };
  }, [state.notificationsEnabled, state.dailyReminderTime, state.streakRemindersEnabled, state.currentStreak]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="app-shell">
      <TopBar activeTab={activeTab} />
      <div className="app-body">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="main-content" ref={mainRef}>
          <div className={`main-content-inner${inSession ? ' in-session' : ''}`}>
            <div className="animate-fade-in" key={activeTab}>
              {activeTab === 'learn' && <LearnPage onSessionChange={setInSession} registerBackHandler={registerBackHandler} />}
              {activeTab === 'timeline' && <TimelinePage />}
              {activeTab === 'practice' && <PracticePage onSessionChange={setInSession} registerBackHandler={registerBackHandler} />}
            </div>
          </div>
        </main>
      </div>
      {!inSession && <MobileTabBar activeTab={activeTab} onTabChange={setActiveTab} />}
      {state.settingsOpen && <Settings />}
      {shouldShowRating && (
        <ConfirmModal
          title="Enjoying Chronos?"
          message="You've completed 3 lessons! If you're enjoying the app, a quick rating on the Play Store would mean a lot."
          confirmLabel="Rate Now"
          cancelLabel="Maybe Later"
          onConfirm={() => {
            window.open(PLAY_STORE_URL, '_blank');
            dispatch({ type: 'DISMISS_RATING_PROMPT' });
          }}
          onCancel={() => {
            dispatch({ type: 'DISMISS_RATING_PROMPT' });
          }}
        />
      )}
      {shouldShowNotificationOnboarding && (
        <NotificationOnboarding
          onEnable={async (time, streakEnabled) => {
            dispatch({
              type: 'ENABLE_NOTIFICATIONS',
              dailyReminderTime: time,
              streakRemindersEnabled: streakEnabled,
            });
            const [h, m] = time.split(':').map(Number);
            await scheduleDailyReminder(h, m);
            if (streakEnabled) {
              await scheduleStreakReminder(state.currentStreak);
            }
          }}
          onSkip={() => dispatch({ type: 'DISMISS_NOTIFICATION_ONBOARDING' })}
        />
      )}
    </div>
  );
}
