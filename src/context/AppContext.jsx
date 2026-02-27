import { createContext, useContext, useReducer, useEffect } from 'react';

const AppContext = createContext(null);

const STORAGE_KEY = 'chronos-state-v1';

function getInitialState() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            return { ...defaultState, ...parsed, settingsOpen: false };
        }
    } catch (e) {
        console.error('Failed to load state:', e);
    }
    return defaultState;
}

const defaultState = {
    // Lesson completion: { [lessonId]: boolean }
    completedLessons: {},
    // Event mastery: { [eventId]: { locationScore, dateScore, whatScore, timesReviewed, lastSeen, overallMastery } }
    eventMastery: {},
    // Set of event IDs the user has seen the learn card for
    seenEvents: [],
    // Starred/favorited event IDs
    starredEvents: [],
    // XP
    totalXP: 0,
    // Streak
    currentStreak: 0,
    lastActiveDate: null, // ISO date string e.g. '2025-02-23'
    // Settings
    settingsOpen: false,
    // Whether the rating prompt has been shown/dismissed
    ratingPromptDismissed: false,
    // Notifications
    notificationOnboardingDismissed: false,
    notificationsEnabled: false,
    dailyReminderTime: '09:00',
    streakRemindersEnabled: true,
    // Cards per lesson setting (1, 2, or 3). Undefined until user makes a choice.
    // cardsPerLesson: undefined (not set here — LessonFlow falls back to 3)
};

function calculateOverallMastery(mastery) {
    const scoreMap = { green: 3, yellow: 1, red: 0 };
    const loc = scoreMap[mastery.locationScore] ?? 0;
    const date = scoreMap[mastery.dateScore] ?? 0;
    const what = scoreMap[mastery.whatScore] ?? 0;
    const desc = scoreMap[mastery.descriptionScore] ?? 0;
    return loc + date + what + desc;
}

function getTodayDate() {
    return new Date().toISOString().split('T')[0];
}

function reducer(state, action) {
    switch (action.type) {
        case 'COMPLETE_LESSON': {
            const prev = state.completedLessons[action.lessonId] || 0;
            return {
                ...state,
                completedLessons: {
                    ...state.completedLessons,
                    [action.lessonId]: prev + 1
                }
            };
        }

        case 'MARK_EVENTS_SEEN': {
            const newSeen = [...new Set([...state.seenEvents, ...action.eventIds])];
            return { ...state, seenEvents: newSeen };
        }

        case 'UPDATE_EVENT_MASTERY': {
            const { eventId, questionType, score } = action;
            const existing = state.eventMastery[eventId] || {
                locationScore: null,
                dateScore: null,
                whatScore: null,
                descriptionScore: null,
                timesReviewed: 0,
                lastSeen: null,
                overallMastery: 0
            };

            const updated = { ...existing };
            if (questionType === 'location') updated.locationScore = score;
            if (questionType === 'date') updated.dateScore = score;
            if (questionType === 'what') updated.whatScore = score;
            if (questionType === 'description') updated.descriptionScore = score;
            updated.timesReviewed = (existing.timesReviewed || 0) + 1;
            updated.lastSeen = Date.now();
            updated.overallMastery = calculateOverallMastery(updated);

            return {
                ...state,
                eventMastery: {
                    ...state.eventMastery,
                    [eventId]: updated
                }
            };
        }

        case 'ADD_XP': {
            const today = getTodayDate();
            let newStreak = state.currentStreak;

            if (state.lastActiveDate !== today) {
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                const yesterdayStr = yesterday.toISOString().split('T')[0];

                if (state.lastActiveDate === yesterdayStr) {
                    newStreak = state.currentStreak + 1;
                } else if (!state.lastActiveDate) {
                    newStreak = 1;
                } else {
                    newStreak = 1;
                }
            }

            return {
                ...state,
                totalXP: state.totalXP + action.amount,
                currentStreak: newStreak,
                lastActiveDate: today
            };
        }

        case 'UPDATE_STREAK': {
            const today = getTodayDate();
            if (state.lastActiveDate === today) return state;

            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toISOString().split('T')[0];

            if (state.lastActiveDate === yesterdayStr) {
                return state; // streak is still active
            }
            if (state.lastActiveDate && state.lastActiveDate !== today) {
                // Streak broken
                return { ...state, currentStreak: 0 };
            }
            return state;
        }

        case 'TOGGLE_STAR': {
            const { eventId } = action;
            const starred = state.starredEvents || [];
            const isStarred = starred.includes(eventId);
            return {
                ...state,
                starredEvents: isStarred
                    ? starred.filter(id => id !== eventId)
                    : [...starred, eventId]
            };
        }

        case 'TOGGLE_SETTINGS': {
            return { ...state, settingsOpen: !state.settingsOpen };
        }

        case 'IMPORT_STATE': {
            return { ...defaultState, ...action.payload, settingsOpen: false };
        }

        case 'DISMISS_RATING_PROMPT': {
            return { ...state, ratingPromptDismissed: true };
        }

        case 'SET_CARDS_PER_LESSON': {
            return { ...state, cardsPerLesson: action.value };
        }

        case 'SET_RECAP_PER_CARD': {
            return { ...state, recapPerCard: action.value };
        }

        case 'DISMISS_NOTIFICATION_ONBOARDING': {
            return { ...state, notificationOnboardingDismissed: true };
        }

        case 'ENABLE_NOTIFICATIONS': {
            return {
                ...state,
                notificationsEnabled: true,
                notificationOnboardingDismissed: true,
                ...(action.dailyReminderTime && { dailyReminderTime: action.dailyReminderTime }),
                ...(action.streakRemindersEnabled !== undefined && { streakRemindersEnabled: action.streakRemindersEnabled }),
            };
        }

        case 'DISABLE_NOTIFICATIONS': {
            return { ...state, notificationsEnabled: false };
        }

        case 'SET_DAILY_REMINDER_TIME': {
            return { ...state, dailyReminderTime: action.value };
        }

        case 'SET_STREAK_REMINDERS': {
            return { ...state, streakRemindersEnabled: action.value };
        }

        case 'RESET_PROGRESS': {
            return { ...defaultState };
        }

        default:
            return state;
    }
}

export function AppProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, null, getInitialState);

    // Persist to localStorage
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch (e) {
            console.error('Failed to save state:', e);
        }
    }, [state]);

    // Check streak on mount
    useEffect(() => {
        dispatch({ type: 'UPDATE_STREAK' });
    }, []);

    return (
        <AppContext.Provider value={{ state, dispatch }}>
            {children}
        </AppContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useApp() {
    const ctx = useContext(AppContext);
    if (!ctx) throw new Error('useApp must be used within AppProvider');
    return ctx;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useIsLessonUnlocked(lessonIndex, lessons) {
    const { state } = useApp();
    if (lessonIndex === 0) return true;
    const prevLesson = lessons[lessonIndex - 1];
    return !!state.completedLessons[prevLesson.id];
}
