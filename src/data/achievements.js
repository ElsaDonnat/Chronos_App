import { useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';

export const ACHIEVEMENTS = [
    // ─── Learning ───
    {
        id: 'first-lesson',
        title: 'First Steps',
        description: 'Complete your first lesson',
        emoji: '\uD83D\uDC63',
        category: 'learning',
        check: (state) => Object.keys(state.completedLessons).length >= 1,
        progress: (state) => ({ current: Object.keys(state.completedLessons).length, target: 1 }),
    },
    {
        id: 'five-lessons',
        title: 'Getting Started',
        description: 'Complete 5 lessons',
        emoji: '\uD83D\uDCD6',
        category: 'learning',
        check: (state) => Object.keys(state.completedLessons).length >= 5,
        progress: (state) => ({ current: Math.min(Object.keys(state.completedLessons).length, 5), target: 5 }),
    },
    {
        id: 'ten-lessons',
        title: 'Scholar',
        description: 'Complete 10 lessons',
        emoji: '\uD83C\uDF93',
        category: 'learning',
        check: (state) => Object.keys(state.completedLessons).length >= 10,
        progress: (state) => ({ current: Math.min(Object.keys(state.completedLessons).length, 10), target: 10 }),
    },
    {
        id: 'all-lessons',
        title: 'Historian',
        description: 'Complete all 21 lessons',
        emoji: '\uD83C\uDFDB\uFE0F',
        category: 'learning',
        check: (state) => Object.keys(state.completedLessons).length >= 21,
        progress: (state) => ({ current: Math.min(Object.keys(state.completedLessons).length, 21), target: 21 }),
    },

    // ─── Streaks ───
    {
        id: 'streak-3',
        title: 'On Fire',
        description: 'Reach a 3-day streak',
        emoji: '\uD83D\uDD25',
        category: 'streaks',
        check: (state) => state.currentStreak >= 3,
        progress: (state) => ({ current: Math.min(state.currentStreak, 3), target: 3 }),
    },
    {
        id: 'streak-7',
        title: 'Dedicated',
        description: 'Reach a 7-day streak',
        emoji: '\u2B50',
        category: 'streaks',
        check: (state) => state.currentStreak >= 7,
        progress: (state) => ({ current: Math.min(state.currentStreak, 7), target: 7 }),
    },
    {
        id: 'streak-30',
        title: 'Unstoppable',
        description: 'Reach a 30-day streak',
        emoji: '\uD83D\uDC8E',
        category: 'streaks',
        check: (state) => state.currentStreak >= 30,
        progress: (state) => ({ current: Math.min(state.currentStreak, 30), target: 30 }),
    },

    // ─── XP ───
    {
        id: 'xp-100',
        title: 'Rising Star',
        description: 'Earn 100 XP',
        emoji: '\u2728',
        category: 'xp',
        check: (state) => state.totalXP >= 100,
        progress: (state) => ({ current: Math.min(state.totalXP, 100), target: 100 }),
    },
    {
        id: 'xp-500',
        title: 'Bright Mind',
        description: 'Earn 500 XP',
        emoji: '\uD83C\uDF1F',
        category: 'xp',
        check: (state) => state.totalXP >= 500,
        progress: (state) => ({ current: Math.min(state.totalXP, 500), target: 500 }),
    },
    {
        id: 'xp-2000',
        title: 'Grandmaster',
        description: 'Earn 2000 XP',
        emoji: '\uD83D\uDC51',
        category: 'xp',
        check: (state) => state.totalXP >= 2000,
        progress: (state) => ({ current: Math.min(state.totalXP, 2000), target: 2000 }),
    },

    // ─── Discovery ───
    {
        id: 'discover-30',
        title: 'Explorer',
        description: 'Discover 30 events',
        emoji: '\uD83D\uDDFA\uFE0F',
        category: 'discovery',
        check: (state) => (state.seenEvents || []).length >= 30,
        progress: (state) => ({ current: Math.min((state.seenEvents || []).length, 30), target: 30 }),
    },
    {
        id: 'discover-all',
        title: 'Cartographer',
        description: 'Discover all 60 events',
        emoji: '\uD83C\uDF0D',
        category: 'discovery',
        check: (state) => (state.seenEvents || []).length >= 60,
        progress: (state) => ({ current: Math.min((state.seenEvents || []).length, 60), target: 60 }),
    },

    // ─── Collection ───
    {
        id: 'collect-10',
        title: 'Collector',
        description: 'Star 10 events',
        emoji: '\uD83C\uDFC6',
        category: 'collection',
        check: (state) => (state.starredEvents || []).length >= 10,
        progress: (state) => ({ current: Math.min((state.starredEvents || []).length, 10), target: 10 }),
    },

    // ─── Mastery ───
    {
        id: 'mastery-5',
        title: 'Sharp Mind',
        description: 'Master 5 events (7+ mastery)',
        emoji: '\uD83E\uDDE0',
        category: 'mastery',
        check: (state) => Object.values(state.eventMastery || {}).filter(m => m.overallMastery >= 7).length >= 5,
        progress: (state) => ({
            current: Math.min(Object.values(state.eventMastery || {}).filter(m => m.overallMastery >= 7).length, 5),
            target: 5,
        }),
    },

    // ─── Daily Quiz ───
    {
        id: 'daily-5',
        title: 'Daily Devotee',
        description: 'Complete 5 daily quizzes',
        emoji: '\uD83D\uDCC5',
        category: 'daily',
        check: (state) => (state.dailyQuiz?.totalCompleted || 0) >= 5,
        progress: (state) => ({ current: Math.min(state.dailyQuiz?.totalCompleted || 0, 5), target: 5 }),
    },
];

/** Returns achievement IDs that should be unlocked but aren't yet */
export function checkAchievements(state) {
    const unlocked = state.achievements || {};
    return ACHIEVEMENTS
        .filter(a => !unlocked[a.id] && a.check(state))
        .map(a => a.id);
}

/** Hook that checks for new achievements on state changes and dispatches unlocks */
export function useAchievementChecker() {
    const { state, dispatch } = useApp();
    const prevChecked = useRef(new Set(Object.keys(state.achievements || {})));

    // Destructure the specific fields we depend on for the lint rule
    const { completedLessons, currentStreak, totalXP, seenEvents, starredEvents, eventMastery, dailyQuiz, achievements } = state;

    useEffect(() => {
        const currentState = { completedLessons, currentStreak, totalXP, seenEvents, starredEvents, eventMastery, dailyQuiz, achievements };
        const newlyUnlocked = checkAchievements(currentState);
        for (const id of newlyUnlocked) {
            if (!prevChecked.current.has(id)) {
                dispatch({ type: 'UNLOCK_ACHIEVEMENT', achievementId: id });
                prevChecked.current.add(id);
            }
        }
    }, [completedLessons, currentStreak, totalXP, seenEvents, starredEvents, eventMastery, dailyQuiz, achievements, dispatch]);
}
