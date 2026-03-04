import { useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { CORE_EVENT_COUNT } from './events';
import { LESSONS, ALL_LEVEL2_LESSONS } from './lessons';

const LEVEL1_COUNT = LESSONS.length;           // 21
const TOTAL_LESSON_COUNT = LEVEL1_COUNT + ALL_LEVEL2_LESSONS.length; // 21 + 28 = 49

export const ACHIEVEMENTS = [
    // ─── Learning ───
    {
        id: 'first-lesson',
        title: 'First Steps',
        description: 'Complete your first lesson',
        hint: 'Complete any lesson from the Learn tab to take your first steps into history.',
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
        description: 'Complete all Level 1 lessons',
        hint: 'Finish all 21 core lessons in the main learning path (Level 1) to earn this achievement.',
        emoji: '\uD83C\uDFDB\uFE0F',
        category: 'learning',
        check: (state) => {
            const l1 = Object.keys(state.completedLessons).filter(k => k.startsWith('lesson-')).length;
            return l1 >= LEVEL1_COUNT;
        },
        progress: (state) => {
            const l1 = Object.keys(state.completedLessons).filter(k => k.startsWith('lesson-')).length;
            return { current: Math.min(l1, LEVEL1_COUNT), target: LEVEL1_COUNT };
        },
    },
    {
        id: 'all-levels',
        title: 'Grand Historian',
        description: 'Complete every lesson across both levels',
        hint: 'Finish all Level 1 core lessons and every Level 2 chapter to earn this prestigious achievement.',
        emoji: '\uD83D\uDC51',
        category: 'learning',
        check: (state) => Object.keys(state.completedLessons).length >= TOTAL_LESSON_COUNT,
        progress: (state) => ({ current: Math.min(Object.keys(state.completedLessons).length, TOTAL_LESSON_COUNT), target: TOTAL_LESSON_COUNT }),
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
        description: `Discover all ${CORE_EVENT_COUNT} events`,
        hint: `Complete lessons and practice to encounter all ${CORE_EVENT_COUNT} historical events in Chronos.`,
        emoji: '\uD83C\uDF0D',
        category: 'discovery',
        check: (state) => (state.seenEvents || []).length >= CORE_EVENT_COUNT,
        progress: (state) => ({ current: Math.min((state.seenEvents || []).length, CORE_EVENT_COUNT), target: CORE_EVENT_COUNT }),
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
        hint: 'Score 7 or higher on 5 different events. Practice events you\u2019ve already seen to boost their mastery.',
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

    // ─── Challenge Mode ───
    {
        id: 'challenge-first',
        title: 'Challenger',
        description: 'Complete your first challenge game',
        emoji: '\u26A1',
        category: 'challenge',
        check: (state) => ((state.challenge?.soloGamesPlayed || 0) + (state.challenge?.multiplayerGamesPlayed || 0)) >= 1,
        progress: (state) => ({ current: Math.min((state.challenge?.soloGamesPlayed || 0) + (state.challenge?.multiplayerGamesPlayed || 0), 1), target: 1 }),
    },
    {
        id: 'challenge-score-10',
        title: 'On a Roll',
        description: 'Score 10 in a single challenge game',
        emoji: '\uD83C\uDFAF',
        category: 'challenge',
        check: (state) => (state.challenge?.soloHighScore || 0) >= 10,
        progress: (state) => ({ current: Math.min(state.challenge?.soloHighScore || 0, 10), target: 10 }),
    },
    {
        id: 'challenge-score-25',
        title: 'Unstoppable Force',
        description: 'Score 25 in a single challenge game',
        emoji: '\uD83D\uDD25',
        category: 'challenge',
        check: (state) => (state.challenge?.soloHighScore || 0) >= 25,
        progress: (state) => ({ current: Math.min(state.challenge?.soloHighScore || 0, 25), target: 25 }),
    },
    {
        id: 'challenge-streak-5',
        title: 'Flawless Five',
        description: 'Get 5 correct in a row in a challenge',
        emoji: '\u2728',
        category: 'challenge',
        check: (state) => (state.challenge?.soloBestStreak || 0) >= 5,
        progress: (state) => ({ current: Math.min(state.challenge?.soloBestStreak || 0, 5), target: 5 }),
    },
    {
        id: 'challenge-multiplayer',
        title: 'Party Time',
        description: 'Play a multiplayer challenge',
        emoji: '\uD83C\uDF89',
        category: 'challenge',
        check: (state) => (state.challenge?.multiplayerGamesPlayed || 0) >= 1,
        progress: (state) => ({ current: Math.min(state.challenge?.multiplayerGamesPlayed || 0, 1), target: 1 }),
    },
];

// ─── Bonus (Hidden) Achievements ───
// These remain hidden ("???") until randomly unlocked.
// Each has a trigger condition (must be true) + a random chance per qualifying state change.
export const BONUS_ACHIEVEMENTS = [
    {
        id: 'bonus-time-traveler',
        title: 'Time Traveler',
        description: 'The timeline whispered your name',
        emoji: '\uD83D\uDD70\uFE0F',
        category: 'bonus',
        hidden: true,
        // Triggers when user completes a lesson; 8% chance per lesson completion
        triggerKey: (state) => Object.keys(state.completedLessons).length,
        triggerCondition: (state) => Object.keys(state.completedLessons).length >= 1,
        chance: 0.08,
    },
    {
        id: 'bonus-lucky-scholar',
        title: 'Lucky Scholar',
        description: 'Fortune favors the curious',
        emoji: '\uD83C\uDF40',
        category: 'bonus',
        hidden: true,
        // Triggers on XP gain; 3% chance per XP change
        triggerKey: (state) => state.totalXP,
        triggerCondition: (state) => state.totalXP >= 50,
        chance: 0.03,
    },
    {
        id: 'bonus-night-owl',
        title: 'Night Owl',
        description: 'History never sleeps, and neither do you',
        emoji: '\uD83E\uDD89',
        category: 'bonus',
        hidden: true,
        // Triggers on study session; 20% chance if it's after 10 PM or before 5 AM
        triggerKey: (state) => (state.studySessions || []).length,
        triggerCondition: () => {
            const hour = new Date().getHours();
            return hour >= 22 || hour < 5;
        },
        chance: 0.20,
    },
    {
        id: 'bonus-plot-twist',
        title: 'Plot Twist',
        description: 'History is full of surprises!',
        emoji: '\uD83C\uDFAD',
        category: 'bonus',
        hidden: true,
        // Triggers on daily quiz completion; 15% chance
        triggerKey: (state) => state.dailyQuiz?.totalCompleted || 0,
        triggerCondition: (state) => (state.dailyQuiz?.totalCompleted || 0) >= 1,
        chance: 0.15,
    },
    {
        id: 'bonus-deja-vu',
        title: 'D\u00e9j\u00e0 Vu',
        description: "Haven't we been here before?",
        emoji: '\uD83D\uDD04',
        category: 'bonus',
        hidden: true,
        // Triggers on streak continuation; 10% chance when streak >= 2
        triggerKey: (state) => state.currentStreak,
        triggerCondition: (state) => state.currentStreak >= 2,
        chance: 0.10,
    },
    {
        id: 'bonus-hidden-gem',
        title: 'Hidden Gem',
        description: 'A rare find in the annals of time',
        emoji: '\uD83D\uDC8E',
        category: 'bonus',
        hidden: true,
        // Triggers when starring events; 12% chance
        triggerKey: (state) => (state.starredEvents || []).length,
        triggerCondition: (state) => (state.starredEvents || []).length >= 1,
        chance: 0.12,
    },
];

/** All achievements combined */
export const ALL_ACHIEVEMENTS = [...ACHIEVEMENTS, ...BONUS_ACHIEVEMENTS];

/** Returns achievement IDs that should be unlocked but aren't yet */
export function checkAchievements(state) {
    const unlocked = state.achievements || {};
    return ACHIEVEMENTS
        .filter(a => !unlocked[a.id] && a.check(state))
        .map(a => a.id);
}

/** Hook that checks for new achievements on state changes and dispatches unlocks. */
export function useAchievementChecker() {
    const { state, dispatch } = useApp();
    const prevChecked = useRef(new Set(Object.keys(state.achievements || {})));
    const mounted = useRef(false);
    const bonusRollKeys = useRef({}); // tracks last trigger key per bonus achievement

    // Destructure the specific fields we depend on for the lint rule
    const { completedLessons, currentStreak, totalXP, seenEvents, starredEvents, eventMastery, dailyQuiz, achievements, studySessions, challenge } = state;

    useEffect(() => {
        const currentState = { completedLessons, currentStreak, totalXP, seenEvents, starredEvents, eventMastery, dailyQuiz, achievements, studySessions, challenge };

        if (!mounted.current) {
            // On mount: silently unlock all achievements that already qualify
            const alreadyQualified = checkAchievements(currentState);
            for (const id of alreadyQualified) {
                if (!achievements[id]) {
                    dispatch({ type: 'UNLOCK_ACHIEVEMENT', achievementId: id, silent: true });
                }
                prevChecked.current.add(id);
            }
            // Seed bonus roll keys so we don't roll on mount
            for (const ba of BONUS_ACHIEVEMENTS) {
                bonusRollKeys.current[ba.id] = ba.triggerKey(currentState);
            }
            mounted.current = true;
            return;
        }

        // ─── Regular achievements ───
        const newlyUnlocked = checkAchievements(currentState);
        for (const id of newlyUnlocked) {
            if (!prevChecked.current.has(id)) {
                dispatch({ type: 'UNLOCK_ACHIEVEMENT', achievementId: id });
                prevChecked.current.add(id);
            }
        }

        // ─── Bonus (hidden) achievements — random roll ───
        const unlocked = achievements || {};
        for (const ba of BONUS_ACHIEVEMENTS) {
            if (unlocked[ba.id]) continue;
            const currentKey = ba.triggerKey(currentState);
            const prevKey = bonusRollKeys.current[ba.id];
            // Only roll when the trigger key has changed (new activity occurred)
            if (currentKey !== prevKey) {
                bonusRollKeys.current[ba.id] = currentKey;
                if (ba.triggerCondition(currentState) && Math.random() < ba.chance) {
                    dispatch({ type: 'UNLOCK_ACHIEVEMENT', achievementId: ba.id });
                }
            }
        }
    }, [completedLessons, currentStreak, totalXP, seenEvents, starredEvents, eventMastery, dailyQuiz, achievements, studySessions, challenge, dispatch]);
}
