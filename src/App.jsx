import { useState, useEffect, useRef, useCallback } from 'react';
import { App as CapApp } from '@capacitor/app';
import { useApp } from './context/AppContext';
import { useAchievementChecker, ALL_ACHIEVEMENTS } from './data/achievements';
import TopBar from './components/TopBar';
import Sidebar, { MobileTabBar } from './components/layout/Sidebar';
import LearnPage from './pages/LearnPage';
import TimelinePage from './pages/TimelinePage';
import PracticePage from './pages/PracticePage';
import ChallengePage from './pages/ChallengePage';
import Settings from './components/Settings';
import WeekTracker from './components/WeekTracker';
import NotificationOnboarding from './components/NotificationOnboarding';
import OnboardingOverlay from './components/OnboardingOverlay';
import WelcomeBackModal from './components/WelcomeBackModal';
import { ConfirmModal } from './components/shared';
import {
  createNotificationChannel,
  scheduleDailyReminder,
  scheduleStreakReminder,
  rescheduleNotifications,
} from './services/notifications';
import * as feedback from './services/feedback';
import * as ambientMusic from './services/ambientMusic';

const TAB_KEYS = { '1': 'learn', '2': 'timeline', '3': 'practice', '4': 'challenge' };
const RATING_MILESTONE = 3; // Show rating prompt after completing 3 lessons
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.elsadonnat.chronos';

export default function App() {
  const [activeTab, setActiveTab] = useState(() => {
    // Cold-start: widget may have set this global before React mounted
    if (window.WIDGET_OPEN_TAB === 'practice') {
      window.WIDGET_OPEN_TAB = null;
      return 'practice';
    }
    return 'learn';
  });
  const [inSession, setInSession] = useState(false);
  const [showWeekTracker, setShowWeekTracker] = useState(false);
  const { state, dispatch } = useApp();
  const mainRef = useRef(null);
  // Ref for child pages to register a back handler
  const backHandlerRef = useRef(null);

  // ─── "Keep Going" encouragement modal ─────
  const [showEncouragement, setShowEncouragement] = useState(false);
  const encourageSessionCountRef = useRef(0);   // times shown this session (max 2)
  const sessionActivityCountRef = useRef(0);     // qualifying activities this session
  const lastSessionLengthRef = useRef(state.studySessions?.length || 0);

  // ─── "Welcome Back" modal for returning users ─────
  const [showWelcomeBack, setShowWelcomeBack] = useState(false);
  const [daysAway, setDaysAway] = useState(0);

  useEffect(() => {
    if (!state.lastActiveDate) return;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const last = new Date(state.lastActiveDate);
    last.setHours(0, 0, 0, 0);
    const diffDays = Math.floor((today - last) / (1000 * 60 * 60 * 24));
    if (diffDays >= 2) {
      setDaysAway(diffDays); // eslint-disable-line react-hooks/set-state-in-effect
      setShowWelcomeBack(true);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Achievement checker — runs on state changes
  useAchievementChecker();

  // Auto-dismiss achievement toast after 3.5s + play sound
  useEffect(() => {
    if ((state.newAchievements || []).length > 0) {
      feedback.achievement();
      const timer = setTimeout(() => {
        dispatch({ type: 'DISMISS_ACHIEVEMENT_TOAST' });
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [state.newAchievements, dispatch]);

  // Track activity completions for "Keep Going" encouragement
  useEffect(() => {
    const currentLength = (state.studySessions || []).length;
    const diff = currentLength - lastSessionLengthRef.current;
    if (diff <= 0) return;
    lastSessionLengthRef.current = currentLength;

    const recent = (state.studySessions || []).slice(-diff);
    const qualifying = recent.filter(s =>
      ['lesson', 'practice', 'challenge'].includes(s.type)
    ).length;
    const prevCount = sessionActivityCountRef.current;
    sessionActivityCountRef.current += qualifying;
    const newCount = sessionActivityCountRef.current;

    // Trigger at every 3rd activity (3, 6, 9...)
    if (Math.floor(newCount / 3) > Math.floor(prevCount / 3) && newCount >= 3) {
      // Session cap: max 2
      if (encourageSessionCountRef.current >= 2) return;
      // Daily cap: max 4
      const todayStr = new Date().toISOString().split('T')[0];
      let dailyCount = 0;
      try {
        const raw = localStorage.getItem('chronos-encourage-today');
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed.date === todayStr) dailyCount = parsed.count;
        }
      } catch { /* ignore */ }
      if (dailyCount >= 4) return;

      encourageSessionCountRef.current += 1;
      localStorage.setItem('chronos-encourage-today', JSON.stringify({
        date: todayStr, count: dailyCount + 1,
      }));
      // Defer setState to avoid synchronous setState-in-effect
      const timer = setTimeout(() => setShowEncouragement(true), 0);
      return () => clearTimeout(timer);
    }
  }, [state.studySessions]);

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

  // Detect lesson 0 completion during onboarding
  useEffect(() => {
    if (state.onboardingStep === 'guide_lesson0' && state.completedLessons['lesson-0']) {
      dispatch({ type: 'SET_ONBOARDING_STEP', step: 'complete' });
    }
  }, [state.completedLessons, state.onboardingStep, dispatch]);

  // Show rating prompt after milestone (derived from state, no effect needed)
  const completedCount = Object.keys(state.completedLessons).length;
  const shouldShowRating = completedCount >= RATING_MILESTONE && !state.ratingPromptDismissed;

  // Notification onboarding — show after first lesson, but not during a lesson/quiz session, not when rating is showing, and only after tutorial
  const onboardingDone = state.onboardingStep === 'complete' || state.onboardingStep === null;
  const shouldShowNotificationOnboarding =
    completedCount >= 1 &&
    !inSession &&
    !state.notificationOnboardingDismissed &&
    !shouldShowRating &&
    onboardingDone;

  // Music prompt — show after 2nd lesson, once, when nothing else is showing
  const shouldShowMusicPrompt =
    completedCount >= 2 &&
    !inSession &&
    !state.musicPromptDismissed &&
    !shouldShowRating &&
    !shouldShowNotificationOnboarding &&
    onboardingDone;

  // "Keep Going" encouragement — avoid stacking with other modals
  const shouldShowEncouragement = showEncouragement
    && !inSession
    && !shouldShowRating
    && !shouldShowNotificationOnboarding
    && !shouldShowMusicPrompt;

  // "Welcome Back" — show when returning after 2+ days, avoid stacking
  const shouldShowWelcomeBack = showWelcomeBack
    && !inSession
    && !shouldShowRating
    && !shouldShowNotificationOnboarding
    && !shouldShowMusicPrompt
    && !shouldShowEncouragement
    && onboardingDone;

  // Determine if onboarding overlay should show
  const showOnboardingOverlay = state.onboardingStep
    && state.onboardingStep !== 'complete'
    && state.onboardingStep !== 'placement_active'
    && state.onboardingStep !== 'guide_lesson0';

  // Widget deep-link: listen for "open to practice" event from native widget tap
  useEffect(() => {
    const handleWidgetOpen = (e) => {
      if (e.detail === 'practice') setActiveTab('practice');
    };
    window.addEventListener('widgetOpenTab', handleWidgetOpen);
    return () => window.removeEventListener('widgetOpenTab', handleWidgetOpen);
  }, []);

  // Week tracker: open from TopBar stats or LearnPage weekly card
  useEffect(() => {
    const handleOpen = () => setShowWeekTracker(true);
    window.addEventListener('openWeekTracker', handleOpen);
    return () => window.removeEventListener('openWeekTracker', handleOpen);
  }, []);

  // Pause/resume ambient music on tab visibility change
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        ambientMusic.pause();
      } else {
        ambientMusic.resume();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

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
      if (isActive) {
        ambientMusic.resume();
        if (state.notificationsEnabled) {
          rescheduleNotifications(state, state.currentStreak);
        }
      } else {
        ambientMusic.pause();
      }
    });
    return () => { listener.then(l => l.remove()); };
  }, [state.notificationsEnabled, state.dailyReminderTime, state.streakRemindersEnabled, state.currentStreak]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="app-shell">
      {!inSession && <TopBar activeTab={activeTab} />}
      <div className="app-body">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="main-content" ref={mainRef}>
          <div className={`main-content-inner${inSession ? ' in-session' : ''}`}>
            <div className="animate-fade-in" key={activeTab}>
              {activeTab === 'learn' && <LearnPage onSessionChange={setInSession} registerBackHandler={registerBackHandler} onTabChange={setActiveTab} />}
              {activeTab === 'timeline' && <TimelinePage />}
              {activeTab === 'practice' && <PracticePage onSessionChange={setInSession} registerBackHandler={registerBackHandler} />}
              {activeTab === 'challenge' && <ChallengePage onSessionChange={setInSession} registerBackHandler={registerBackHandler} />}
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
      {shouldShowMusicPrompt && (
        <ConfirmModal
          title="Background Music"
          message="Chronos plays a relaxing ambient soundscape while you study. You can adjust the music and sound effect volumes separately in Settings — or slide them all the way down to mute."
          confirmLabel="Got It"
          cancelLabel="Mute Music"
          onConfirm={() => dispatch({ type: 'DISMISS_MUSIC_PROMPT' })}
          onCancel={() => {
            dispatch({ type: 'SET_MUSIC_VOLUME', value: 0 });
            dispatch({ type: 'DISMISS_MUSIC_PROMPT' });
          }}
        />
      )}
      {shouldShowEncouragement && (
        <ConfirmModal
          title="3 in a row!"
          message="Keep going \u2014 and remember to take a break."
          confirmLabel="OK"
          cancelLabel={null}
          onConfirm={() => setShowEncouragement(false)}
        />
      )}
      {shouldShowWelcomeBack && (
        <WelcomeBackModal daysAway={daysAway} onDismiss={() => setShowWelcomeBack(false)} />
      )}
      {showWeekTracker && <WeekTracker onClose={() => setShowWeekTracker(false)} />}
      {showOnboardingOverlay && (
        <OnboardingOverlay step={state.onboardingStep} dispatch={dispatch} />
      )}

      {/* Achievement unlock toast */}
      {(state.newAchievements || []).length > 0 && (() => {
        const achievementId = state.newAchievements[0];
        const achievement = ALL_ACHIEVEMENTS.find(a => a.id === achievementId);
        if (!achievement) return null;
        return (
          <div className="achievement-toast animate-slide-in-down" onClick={() => dispatch({ type: 'DISMISS_ACHIEVEMENT_TOAST' })}>
            <span className="achievement-toast-emoji">{achievement.emoji}</span>
            <div>
              <p className="achievement-toast-label">Achievement Unlocked!</p>
              <p className="achievement-toast-title">{achievement.title}</p>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
