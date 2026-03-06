import { useState, useEffect, useMemo, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { LESSONS, ERA_QUIZ_GROUPS, LEVEL2_CHAPTERS, ALL_LEVEL2_LESSONS } from '../data/lessons';
import { getEventsByIds, getEventById } from '../data/events';
import { isPlacementQuizUnlocked } from '../data/placementQuiz';
import { getTodaysDailyQuiz } from '../data/dailyQuiz';
import { Card, Button, DiHBadge, MasteryDots } from '../components/shared';
import LessonFlow from '../components/learn/LessonFlow';
import Lesson0Flow from '../components/learn/Lesson0Flow';
import PlacementQuizFlow from '../components/learn/PlacementQuizFlow';
import DailyQuizFlow from '../components/DailyQuizFlow';
import Mascot from '../components/Mascot';
import LessonIcon from '../components/LessonIcon';

// ─── "This Week" card session tracking (survives tab switches, resets on app reload) ───
let _thisWeekShown = false;       // has the card been shown & acknowledged this session?
let _thisWeekDismissed = false;   // was it dismissed via X?
let _completionsSinceTrigger = 0; // qualifying activities since last show
let _lastTrackedSessionCount = -1; // initialized per-session on first render

function _getWeeklyShownToday() {
    const todayStr = new Date().toISOString().split('T')[0];
    try {
        const raw = localStorage.getItem('chronos-weekly-shown-today');
        if (raw) {
            const parsed = JSON.parse(raw);
            if (parsed.date === todayStr) return parsed;
        }
    } catch { /* ignore */ }
    return { date: todayStr, count: 0 };
}

function _incrementWeeklyShownToday() {
    const current = _getWeeklyShownToday();
    localStorage.setItem('chronos-weekly-shown-today', JSON.stringify({
        date: current.date, count: current.count + 1,
    }));
}

// Era accent colors — evolving warm palette: brown → amber → gold → red
// Each era has a distinctly different hue while staying muted for parchment
const ERA_COLORS = {
    prehistory:  '#9E4A4A',  // muted warm red
    ancient:     '#7A6B50',  // earthy olive-brown
    medieval:    '#B06A30',  // distinct warm orange
    earlymodern: '#9A8528',  // olive-gold
    modern:      '#B09035',  // golden amber
};

function getEraAccent(lessonNumber) {
    if (lessonNumber === 0) return '#8B4157';      // prologue: burgundy
    if (lessonNumber <= 3) return ERA_COLORS.prehistory;
    if (lessonNumber <= 8) return ERA_COLORS.ancient;
    if (lessonNumber <= 12) return ERA_COLORS.medieval;
    if (lessonNumber <= 15) return ERA_COLORS.earlymodern;
    return ERA_COLORS.modern;
}

function getEraColor(eraId) {
    return ERA_COLORS[eraId] || '#8B4157';
}

// Era-specific SVG icons for chapter headers (matching Lesson 0 era icons)
function EraChapterIcon({ eraId, size = 22, color }) {
    const c = color || getEraColor(eraId);
    const props = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: c, strokeWidth: '1.8', strokeLinecap: 'round', strokeLinejoin: 'round' };
    switch (eraId) {
        case 'prehistory': return (
            <svg {...props}>
                <path d="M5 10c0-1.5 1-2.5 2-3 .5-1.5-.5-3-2-3.5S2 4 2.5 5.5c-1 .5-1.5 2-.5 3s2.5 1 3 1.5z" fill={c} opacity="0.15" />
                <path d="M19 14c0 1.5-1 2.5-2 3-.5 1.5.5 3 2 3.5s3-.5 2.5-2c1-.5 1.5-2 .5-3s-2.5-1-3-1.5z" fill={c} opacity="0.15" />
                <line x1="7" y1="9" x2="17" y2="15" />
            </svg>
        );
        case 'ancient': return (
            <svg {...props}>
                <path d="M3 21h18" /><path d="M5 21V7l7-4 7 4v14" fill={c} opacity="0.12" />
                <line x1="9" y1="21" x2="9" y2="10" /><line x1="15" y1="21" x2="15" y2="10" />
                <path d="M5 7l7-4 7 4" /><line x1="3" y1="21" x2="21" y2="21" />
            </svg>
        );
        case 'medieval': return (
            <svg {...props}>
                <path d="M5 3l14 14" /><path d="M9.5 7.5L5 3" /><path d="M19 3L5 17" />
                <path d="M14.5 7.5L19 3" /><path d="M5 17l2 2 2-2" /><path d="M19 17l-2 2-2-2" />
            </svg>
        );
        case 'earlymodern': return (
            <svg {...props}>
                <circle cx="12" cy="12" r="9" fill={c} opacity="0.08" />
                <polygon points="16.24,7.76 14.12,14.12 7.76,16.24 9.88,9.88" fill={c} opacity="0.2" stroke={c} />
                <line x1="12" y1="3" x2="12" y2="5" /><line x1="12" y1="19" x2="12" y2="21" />
                <line x1="3" y1="12" x2="5" y2="12" /><line x1="19" y1="12" x2="21" y2="12" />
            </svg>
        );
        case 'modern': return (
            <svg {...props}>
                <circle cx="12" cy="12" r="9" fill={c} opacity="0.08" />
                <ellipse cx="12" cy="12" rx="4" ry="9" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <path d="M4.5 7.5h15M4.5 16.5h15" />
            </svg>
        );
        default: return null;
    }
}

export default function LearnPage({ onSessionChange, registerBackHandler, onTabChange }) {
    const { state, dispatch } = useApp();
    const [activeLessonId, setActiveLessonId] = useState(null);
    const [showPlacement, setShowPlacement] = useState(null);
    const [showDailyQuiz, setShowDailyQuiz] = useState(false);
    const [expandedEra, setExpandedEra] = useState(() => {
        // Auto-expand the era containing the user's next incomplete lesson
        for (const era of ERA_QUIZ_GROUPS) {
            for (const lessonId of era.lessonIds) {
                if (!state.completedLessons[lessonId]) return era.id;
            }
        }
        return null;
    });
    const [expandedChapter, setExpandedChapter] = useState(null);
    const [paceWarningLessonId, setPaceWarningLessonId] = useState(null);
    const [dailyCompletedExpanded, setDailyCompletedExpanded] = useState(false);
    const [settingsTipDismissed, setSettingsTipDismissed] = useState(
        () => !!localStorage.getItem('chronos-settings-tip-seen')
    );

    // Level 2 unlocks after completing the Prologue (Lesson 0)
    const isLevel2Unlocked = !!state.completedLessons['lesson-0'];
    const [level2UnlockDismissed, setLevel2UnlockDismissed] = useState(
        () => !!localStorage.getItem('chronos-level2-unlock-seen')
    );
    const showLevel2Unlock = isLevel2Unlocked && !level2UnlockDismissed;

    // Level 1 / Level 2 panel switching — clamp to 1 if Level 2 not yet unlocked
    const [rawActiveLevel, setRawActiveLevel] = useState(() => {
        const saved = localStorage.getItem('chronos-learn-level');
        return saved === '2' ? 2 : 1;
    });
    const activeLevel = isLevel2Unlocked ? rawActiveLevel : 1;
    const setActiveLevel = setRawActiveLevel;
    const [slideDirection, setSlideDirection] = useState('right');
    const touchStartX = useRef(null);
    const touchStartY = useRef(null);

    function switchLevel(newLevel) {
        if (newLevel === 2 && !isLevel2Unlocked) return;
        setSlideDirection(newLevel > activeLevel ? 'right' : 'left');
        setActiveLevel(newLevel);
    }
    function handleTouchStart(e) {
        touchStartX.current = e.touches[0].clientX;
        touchStartY.current = e.touches[0].clientY;
    }
    function handleTouchEnd(e) {
        if (touchStartX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchStartX.current;
        const dy = e.changedTouches[0].clientY - touchStartY.current;
        if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) {
            if (dx < 0 && activeLevel === 1 && isLevel2Unlocked) switchLevel(2);
            if (dx > 0 && activeLevel === 2) switchLevel(1);
        }
        touchStartX.current = null;
        touchStartY.current = null;
    }
    useEffect(() => {
        localStorage.setItem('chronos-learn-level', String(activeLevel));
        const mainContent = document.querySelector('.main-content');
        if (mainContent) mainContent.scrollTop = 0;
    }, [activeLevel]);

    const isOnboardingGuide = state.onboardingStep === 'guide_lesson0';
    const isPlacementActive = state.onboardingStep === 'placement_active';

    // Daily quiz data
    const dailyData = useMemo(() => getTodaysDailyQuiz(), []);
    const today = new Date().toISOString().split('T')[0];

    // Count distinct lesson sessions completed today
    const todayLessonCount = useMemo(() =>
        (state.studySessions || []).filter(s => s.type === 'lesson' && s.date?.startsWith(today)).length,
        [state.studySessions, today]
    );

    function handleLessonClick(lessonId) {
        if (todayLessonCount >= 5 && !paceWarningLessonId) {
            setPaceWarningLessonId(lessonId);
        } else {
            setActiveLessonId(lessonId);
        }
    }
    const isDailyCompleted = state.dailyQuiz?.lastCompletedDate === today;
    const isDailyStarted = state.dailyQuiz?.lastAttemptedDate === today && !isDailyCompleted;
    // Only show "This Day in History" after completing the third lesson
    const showDaily = dailyData && !!state.completedLessons['lesson-3'];
    const todayEvents = useMemo(() =>
        isDailyCompleted ? dailyData.eventIds.map(id => getEventById(id)).filter(Boolean) : [],
        [isDailyCompleted, dailyData.eventIds]
    );

    // Snapshot session count the first time daily quiz is marked complete today.
    // If the user does anything else afterward, the completed banner disappears.
    useEffect(() => {
        if (isDailyCompleted) {
            const key = `chronos-daily-snap-${today}`;
            if (!localStorage.getItem(key)) {
                // eslint-disable-next-line react-hooks/exhaustive-deps
                localStorage.setItem(key, String((state.studySessions || []).length));
            }
        }
    }, [isDailyCompleted, today]); // intentionally omits studySessions — we only want the snapshot at completion time

    const hasActivitySinceDaily = useMemo(() => {
        if (!isDailyCompleted) return false;
        const snap = localStorage.getItem(`chronos-daily-snap-${today}`);
        if (snap === null) return false;
        return (state.studySessions || []).length > parseInt(snap, 10);
    }, [isDailyCompleted, today, state.studySessions]);

    // ─── "This Week" card (session-based, day 2+, max 2/day) ─────────
    const weekStart = useMemo(() => {
        const d = new Date();
        const day = d.getDay(); // 0=Sun
        const diff = day === 0 ? 6 : day - 1; // shift to Monday start
        d.setDate(d.getDate() - diff);
        return d.toISOString().split('T')[0];
    }, []);

    const weeklyInsights = useMemo(() => {
        const sessions = (state.studySessions || []).filter(s => s.date >= weekStart);
        if (sessions.length === 0) return null;
        return {
            sessions: sessions.length,
            weekQuestions: sessions.reduce((s, sess) => s + (sess.questionsAnswered || 0), 0),
            weekSeconds: sessions.reduce((s, sess) => s + (sess.duration || 0), 0),
        };
    }, [state.studySessions, weekStart]);

    // Day 2+ check: user has been active on a previous day
    const isDay2Plus = useMemo(() => {
        if (state.lastActiveDate && state.lastActiveDate < today) return true;
        return (state.studySessions || []).some(s => s.date && s.date.split('T')[0] < today);
    }, [state.lastActiveDate, state.studySessions, today]);

    // Initialize module-level session count tracker on first render
    if (_lastTrackedSessionCount === -1) {
        _lastTrackedSessionCount = (state.studySessions || []).length;
    }

    // Track qualifying activity completions for the 5-activity re-trigger
    const [thisWeekDismissed, setThisWeekDismissed] = useState(_thisWeekDismissed);
    const [thisWeekShown, setThisWeekShown] = useState(_thisWeekShown);
    const currentSessionCount = (state.studySessions || []).length;

    useEffect(() => {
        const diff = currentSessionCount - _lastTrackedSessionCount;
        if (diff <= 0) return;
        const recent = (state.studySessions || []).slice(-diff);
        const qualifying = recent.filter(s =>
            ['lesson', 'practice', 'challenge'].includes(s.type)
        ).length;
        _completionsSinceTrigger += qualifying;
        _lastTrackedSessionCount = currentSessionCount;

        // Re-trigger after 5 qualifying activities if dismissed and daily cap allows
        if (_completionsSinceTrigger >= 5 && _thisWeekDismissed) {
            const { count } = _getWeeklyShownToday();
            if (count < 2) {
                _thisWeekDismissed = false;
                _thisWeekShown = false;
                _completionsSinceTrigger = 0;
                setThisWeekDismissed(false);
                setThisWeekShown(false);
            }
        }
    }, [currentSessionCount]); // eslint-disable-line react-hooks/exhaustive-deps

    const showWeeklyInsights = isDay2Plus && weeklyInsights && !thisWeekDismissed
        && _getWeeklyShownToday().count < 2;

    // Record when the card becomes visible
    useEffect(() => {
        if (showWeeklyInsights && !thisWeekShown) {
            _thisWeekShown = true;
            _completionsSinceTrigger = 0;
            _incrementWeeklyShownToday();
            setThisWeekShown(true);
        }
    }, [showWeeklyInsights, thisWeekShown]); // eslint-disable-line react-hooks/exhaustive-deps


    useEffect(() => {
        onSessionChange?.(!!activeLessonId || showPlacement || isPlacementActive || showDailyQuiz);
    }, [activeLessonId, showPlacement, isPlacementActive, showDailyQuiz, onSessionChange]);

    // Register back handler when in a lesson, placement, or daily quiz
    useEffect(() => {
        if (showDailyQuiz && registerBackHandler) {
            return registerBackHandler(() => setShowDailyQuiz(false));
        }
        if (activeLessonId && registerBackHandler) {
            return registerBackHandler(() => setActiveLessonId(null));
        }
        if ((showPlacement || isPlacementActive) && registerBackHandler) {
            return registerBackHandler(() => {
                setShowPlacement(null);
                if (isPlacementActive) {
                    dispatch({ type: 'SET_ONBOARDING_STEP', step: 'complete' });
                }
            });
        }
    }, [showDailyQuiz, activeLessonId, showPlacement, isPlacementActive, registerBackHandler, dispatch]);

    // Daily quiz flow
    if (showDailyQuiz) {
        return <DailyQuizFlow onComplete={() => setShowDailyQuiz(false)} />;
    }

    // Placement quiz flow (from onboarding or manual)
    if (isPlacementActive || showPlacement) {
        return <PlacementQuizFlow
            initialEra={typeof showPlacement === 'string' ? showPlacement : undefined}
            onComplete={() => {
                setShowPlacement(null);
                if (isPlacementActive) {
                    dispatch({ type: 'SET_ONBOARDING_STEP', step: 'complete' });
                }
            }}
        />;
    }

    if (activeLessonId) {
        const lesson = LESSONS.find(l => l.id === activeLessonId)
            || ALL_LEVEL2_LESSONS.find(l => l.id === activeLessonId);
        if (lesson?.isLesson0) {
            return <Lesson0Flow lesson={lesson} onComplete={() => setActiveLessonId(null)} />;
        }
        return <LessonFlow lesson={lesson} onComplete={() => setActiveLessonId(null)} />;
    }

    // Check if skip-ahead dividers should show (always visible once onboarding is done)
    const onboardingDone = state.onboardingStep === 'complete' || state.onboardingStep === null;
    const showSkipDividers = onboardingDone;

    return (
        <div className="py-2 sm:py-6">
            {/* Level toggle pills — only show when Level 2 is unlocked */}
            {isLevel2Unlocked && (
                <div className="flex items-center justify-center gap-1.5 mb-4">
                    {[1, 2].map(level => {
                        const isActive = activeLevel === level;
                        return (
                            <button key={level} onClick={() => switchLevel(level)}
                                className="transition-all cursor-pointer"
                                style={{
                                    padding: '5px 18px',
                                    borderRadius: '20px',
                                    fontSize: '13px',
                                    fontWeight: isActive ? 700 : 500,
                                    fontFamily: 'var(--font-serif)',
                                    backgroundColor: isActive ? 'var(--color-burgundy)' : 'transparent',
                                    color: isActive ? 'white' : 'var(--color-ink-secondary)',
                                    border: isActive ? '1.5px solid var(--color-burgundy)' : '1.5px solid rgba(var(--color-ink-rgb), 0.12)',
                                }}>
                                Level {level}
                            </button>
                        );
                    })}
                </div>
            )}

            {/* Level 2 unlock banner — shown once after completing the Prologue */}
            {showLevel2Unlock && (
                <Card className="mb-4 animate-fade-in" style={{
                    borderLeft: '3px solid var(--color-burgundy)',
                    backgroundColor: 'var(--color-burgundy-soft)',
                }}>
                    <div className="flex items-start gap-3">
                        <Mascot mood="celebrating" size={44} />
                        <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-bold mb-0.5" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ink)' }}>
                                Level 2 Unlocked!
                            </h3>
                            <p className="text-xs leading-relaxed" style={{ color: 'var(--color-ink-secondary)' }}>
                                Swipe left or tap "Level 2" above to explore Deep Dives {'\u2014'} topic-based chapters you can start anytime.
                            </p>
                        </div>
                        <button onClick={() => { setLevel2UnlockDismissed(true); localStorage.setItem('chronos-level2-unlock-seen', '1'); }}
                            className="flex-shrink-0 p-1 rounded-full" style={{ color: 'var(--color-ink-muted)' }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    </div>
                </Card>
            )}

            <div onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>

                {activeLevel === 1 ? (
                    <div key="level1" className={`slide-from-${slideDirection}`}>
                        <div className="text-center mb-4">
                            <h1 className="learn-page-title font-bold" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ink)' }}>
                                The Story of Humanity
                            </h1>
                            <p className="learn-page-subtitle mt-0.5" style={{ color: 'var(--color-ink-muted)' }}>
                                60 events across 20 lessons
                            </p>
                        </div>

                        {/* Daily Quiz card — 3 states: not started / retry / completed */}
                        {showDaily && !isDailyStarted && !isDailyCompleted && (
                            <Card
                                onClick={() => setShowDailyQuiz(true)}
                                className="mb-4 animate-fade-in daily-quiz-card"
                                style={{
                                    borderLeft: '3px solid #E6A817',
                                    backgroundColor: 'rgba(230, 168, 23, 0.04)',
                                }}
                            >
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                                        style={{ backgroundColor: 'rgba(230,168,23,0.12)' }}>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#B8860B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                            <line x1="16" y1="2" x2="16" y2="6" />
                                            <line x1="8" y1="2" x2="8" y2="6" />
                                            <line x1="3" y1="10" x2="21" y2="10" />
                                        </svg>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <h3 className="text-sm font-bold" style={{ fontFamily: 'var(--font-serif)' }}>
                                                This Day in History
                                            </h3>
                                            <span className="daily-quiz-bonus-pill-sm">{'2\× XP'}</span>
                                        </div>
                                        <p className="text-xs" style={{ color: 'var(--color-ink-muted)' }}>
                                            {dailyData.dateLabel} {'—'} {dailyData.eventIds.map(id => getEventById(id)?.year).filter(Boolean).join(' · ')}
                                        </p>
                                    </div>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B8860B" strokeWidth="2" className="flex-shrink-0 mt-1">
                                        <polyline points="9 18 15 12 9 6" />
                                    </svg>
                                </div>
                            </Card>
                        )}

                        {/* Daily Quiz — started but not finished */}
                        {showDaily && isDailyStarted && (
                            <Card
                                onClick={() => setShowDailyQuiz(true)}
                                className="mb-4 animate-fade-in daily-quiz-card"
                                style={{
                                    borderLeft: '3px solid #E6A817',
                                    backgroundColor: 'rgba(230, 168, 23, 0.06)',
                                }}
                            >
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                                        style={{ backgroundColor: 'rgba(230,168,23,0.15)' }}>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#B8860B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polygon points="5 3 19 12 5 21 5 3" />
                                        </svg>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-sm font-bold mb-0.5" style={{ fontFamily: 'var(--font-serif)' }}>
                                            Continue Today's Quiz
                                        </h3>
                                        <p className="text-xs" style={{ color: 'var(--color-ink-muted)' }}>
                                            {dailyData.dateLabel} {'—'} pick up where you left off
                                        </p>
                                    </div>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B8860B" strokeWidth="2" className="flex-shrink-0 mt-1">
                                        <polyline points="9 18 15 12 9 6" />
                                    </svg>
                                </div>
                            </Card>
                        )}

                        {/* Daily Quiz — completed: collapsed banner or expanded cards */}
                        {showDaily && isDailyCompleted && !hasActivitySinceDaily && !dailyCompletedExpanded && (
                            <button
                                onClick={() => setDailyCompletedExpanded(true)}
                                className="w-full mb-4 animate-fade-in flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer"
                                style={{
                                    backgroundColor: 'rgba(230, 168, 23, 0.10)',
                                    border: '1px solid rgba(230, 168, 23, 0.25)',
                                }}
                            >
                                <div className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0"
                                    style={{ backgroundColor: 'rgba(5, 150, 105, 0.15)' }}>
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="3">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                </div>
                                <span className="text-xs font-semibold flex-1 text-left" style={{ color: '#8B6914' }}>
                                    Today's Quiz Complete
                                </span>
                                {state.dailyQuiz?.lastXPEarned > 0 && (
                                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                                        style={{ backgroundColor: 'rgba(5, 150, 105, 0.1)', color: '#059669' }}>
                                        +{state.dailyQuiz.lastXPEarned} XP
                                    </span>
                                )}
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#B8860B" strokeWidth="2" className="flex-shrink-0">
                                    <polyline points="6 9 12 15 18 9" />
                                </svg>
                            </button>
                        )}
                        {showDaily && isDailyCompleted && !hasActivitySinceDaily && dailyCompletedExpanded && (
                            <Card
                                className="mb-4 animate-fade-in daily-quiz-card"
                                style={{
                                    borderLeft: '3px solid #059669',
                                    backgroundColor: 'rgba(5, 150, 105, 0.04)',
                                }}
                            >
                                <button
                                    onClick={() => setDailyCompletedExpanded(false)}
                                    className="w-full flex items-center gap-2 mb-2 cursor-pointer"
                                >
                                    <div className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0"
                                        style={{ backgroundColor: 'rgba(5, 150, 105, 0.12)' }}>
                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="3">
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                    </div>
                                    <h3 className="text-sm font-bold flex-1 text-left" style={{ fontFamily: 'var(--font-serif)' }}>
                                        Today's Quiz {'\u2014'} Complete
                                    </h3>
                                    {state.dailyQuiz?.lastXPEarned > 0 && (
                                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                                            style={{ backgroundColor: 'rgba(5, 150, 105, 0.1)', color: '#059669' }}>
                                            +{state.dailyQuiz.lastXPEarned} XP
                                        </span>
                                    )}
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-ink-faint)" strokeWidth="2" className="flex-shrink-0">
                                        <polyline points="18 15 12 9 6 15" />
                                    </svg>
                                </button>
                                <div className="space-y-1.5">
                                    {todayEvents.map(event => (
                                        <button
                                            key={event.id}
                                            className="w-full flex items-center gap-3 p-2 rounded-xl transition-colors"
                                            style={{ backgroundColor: 'rgba(230, 168, 23, 0.05)', cursor: 'pointer' }}
                                            onClick={() => {
                                                window.CHRONOS_OPEN_EVENT = event.id;
                                                onTabChange?.('timeline');
                                            }}
                                        >
                                            <span className="text-xs font-bold flex-shrink-0" style={{ color: '#8B6914', fontFamily: 'var(--font-serif)', minWidth: '3rem' }}>
                                                {event.year}
                                            </span>
                                            <span className="text-sm font-medium flex-1 text-left" style={{ color: 'var(--color-ink)' }}>
                                                {event.title}
                                            </span>
                                            <DiHBadge />
                                        </button>
                                    ))}
                                </div>
                            </Card>
                        )}

                        {/* Weekly insights teaser — opens WeekTracker modal */}
                        {showWeeklyInsights && (
                            <Card
                                onClick={() => window.dispatchEvent(new Event('openWeekTracker'))}
                                className="mb-4 animate-fade-in"
                                style={{ borderLeft: '3px solid #8B6DB5', backgroundColor: 'rgba(140, 100, 180, 0.04)' }}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                                        style={{ backgroundColor: 'rgba(140, 100, 180, 0.12)' }}>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7C5BAD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                                        </svg>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-sm font-bold mb-0.5" style={{ fontFamily: 'var(--font-serif)' }}>
                                            This Week
                                        </h3>
                                        <p className="text-xs" style={{ color: 'var(--color-ink-muted)' }}>
                                            {weeklyInsights.sessions} {weeklyInsights.sessions === 1 ? 'session' : 'sessions'} {'\u00B7'} {weeklyInsights.weekQuestions} questions {'\u00B7'} {weeklyInsights.weekSeconds >= 60 ? `${Math.floor(weeklyInsights.weekSeconds / 60)}m` : `${weeklyInsights.weekSeconds}s`}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8B6DB5" strokeWidth="2">
                                            <polyline points="9 18 15 12 9 6" />
                                        </svg>
                                        <button onClick={(e) => {
                                            e.stopPropagation();
                                            _thisWeekDismissed = true;
                                            _completionsSinceTrigger = 0;
                                            setThisWeekDismissed(true);
                                        }} className="p-1 -mr-1" style={{ color: 'var(--color-ink-faint)' }}>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </Card>
                        )}

                        {/* Onboarding guide overlay for lesson 0 */}
                        {isOnboardingGuide && (
                            <div className="mb-4 animate-fade-in">
                                <Card className="p-4" style={{ backgroundColor: 'rgba(139, 65, 87, 0.06)', border: '1px dashed var(--color-burgundy)' }}>
                                    <div className="flex items-center gap-3">
                                        <span className="text-xl">👇</span>
                                        <div className="flex-1">
                                            <p className="text-sm font-semibold" style={{ color: 'var(--color-burgundy)' }}>
                                                Tap the Prologue below to start!
                                            </p>
                                            <p className="text-xs mt-0.5" style={{ color: 'var(--color-ink-muted)' }}>
                                                It's a quick overview of the 5 eras of history.
                                            </p>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        )}

                        <div className="space-y-3">
                            {/* ── Prologue (always visible) ── */}
                            {(() => {
                                const lesson = LESSONS[0];
                                const isCompleted = !!state.completedLessons[lesson.id];
                                const accentColor = getEraAccent(0);
                                const pulseLesson0 = isOnboardingGuide;
                                return (
                                    <Card
                                        onClick={() => handleLessonClick(lesson.id)}
                                        className={`lesson-card-row animate-fade-in-up relative overflow-hidden ${pulseLesson0 ? 'onboarding-pulse' : ''}`}
                                        style={{ backgroundColor: isCompleted ? 'rgba(5, 150, 105, 0.04)' : 'var(--color-card)' }}
                                    >
                                        <span className="absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none select-none"
                                            style={{ opacity: 0.045 }}>
                                            <LessonIcon index={0} size={72} color={accentColor} />
                                        </span>
                                        <div className="flex items-center gap-4">
                                            <div className="flex-shrink-0">
                                                <div className="relative">
                                                    <div className="w-11 h-11 rounded-full flex items-center justify-center" style={{
                                                        backgroundColor: isCompleted ? 'rgba(5, 150, 105, 0.10)' : `${accentColor}0A`,
                                                        border: isCompleted ? '2px solid rgba(5, 150, 105, 0.35)' : `2px solid ${accentColor}`,
                                                    }}>
                                                        <LessonIcon index={0} size={20} color={accentColor} />
                                                    </div>
                                                    {isCompleted && (
                                                        <div className="absolute -bottom-0.5 -right-0.5 w-[18px] h-[18px] rounded-full flex items-center justify-center"
                                                            style={{ backgroundColor: 'var(--color-success)', boxShadow: '0 0 0 2px var(--color-card)' }}>
                                                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5">
                                                                <polyline points="20 6 9 17 4 12" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                    {!isCompleted && (
                                                        <div className="absolute -bottom-0.5 -right-0.5 rounded-full flex items-center justify-center px-1 py-px"
                                                            style={{ backgroundColor: accentColor, boxShadow: '0 0 0 2px var(--color-card)' }}>
                                                            <span className="text-[8px] font-bold uppercase text-white leading-none">New</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <span className="text-[11px] font-medium uppercase tracking-wider" style={{ color: 'var(--color-ink-faint)' }}>
                                                    Prologue
                                                </span>
                                                <h3 className="text-base font-bold leading-tight" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ink)' }}>
                                                    {lesson.title}
                                                </h3>
                                                <p className="text-sm mt-0.5" style={{ color: 'var(--color-ink-muted)' }}>
                                                    {lesson.subtitle}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-3 flex-shrink-0">
                                                <span className="text-xs hidden sm:block" style={{ color: 'var(--color-ink-faint)' }}>5 eras</span>
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-ink-faint)" strokeWidth="2" className="flex-shrink-0">
                                                    <polyline points="9 18 15 12 9 6" />
                                                </svg>
                                            </div>
                                        </div>
                                    </Card>
                                );
                            })()}

                            {/* ── Era sections (collapsible) ── */}
                            {ERA_QUIZ_GROUPS.map((era, eraIdx) => {
                                const eraLessons = era.lessonIds.map(id => LESSONS.find(l => l.id === id));
                                const completedCount = eraLessons.filter(l => !!state.completedLessons[l.id]).length;
                                const totalCount = eraLessons.length;
                                const eventCount = era.eventIds.length;
                                const isEraComplete = completedCount === totalCount;
                                const eraInProgress = completedCount > 0 && !isEraComplete;
                                const isExpanded = expandedEra === era.id;
                                const accentColor = getEraAccent(eraLessons[0].number);

                                // Skip-ahead quiz
                                const canSkip = showSkipDividers && !isEraComplete && !state.placementQuizzes?.[era.id]?.passed;
                                const skipUnlocked = canSkip ? isPlacementQuizUnlocked(era.id, state.placementQuizzes) : false;

                                return (
                                    <div key={era.id} className="animate-fade-in-up"
                                        style={{ animationDelay: `${(eraIdx + 1) * 60}ms`, animationFillMode: 'backwards' }}>
                                        {/* Era header — collapsible */}
                                        <Card
                                            className="cursor-pointer active:scale-[0.98] transition-transform"
                                            style={{
                                                padding: '8px 12px',
                                                borderLeft: `3px solid ${isEraComplete ? 'rgba(5, 150, 105, 0.5)' : accentColor}`,
                                                backgroundColor: isEraComplete ? 'rgba(5, 150, 105, 0.04)' : `${accentColor}08`,
                                            }}
                                            onClick={() => setExpandedEra(isExpanded ? null : era.id)}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="relative flex-shrink-0">
                                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{
                                                        backgroundColor: isEraComplete ? 'rgba(5, 150, 105, 0.10)' : `${accentColor}15`,
                                                        border: isEraComplete ? '2px solid rgba(5, 150, 105, 0.35)' : undefined,
                                                    }}>
                                                        <EraChapterIcon eraId={era.id} size={20} color={isEraComplete ? 'var(--color-success)' : accentColor} />
                                                    </div>
                                                    {isEraComplete && (
                                                        <div className="absolute -bottom-1 -right-1 w-[18px] h-[18px] rounded-full flex items-center justify-center"
                                                            style={{ backgroundColor: 'var(--color-success)', boxShadow: '0 0 0 2px var(--color-card)' }}>
                                                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5">
                                                                <polyline points="20 6 9 17 4 12" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-base font-bold leading-tight"
                                                        style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ink)' }}>
                                                        {era.label}
                                                    </h3>
                                                    <p className="text-xs mt-0.5" style={{ color: 'var(--color-ink-muted)' }}>
                                                        {totalCount} lessons {'\u00B7'} {eventCount} events
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2 flex-shrink-0">
                                                    {eraInProgress && (
                                                        <span className="text-[10px] font-bold px-2 py-1 rounded-full"
                                                            style={{ backgroundColor: `${accentColor}15`, color: accentColor }}>
                                                            {completedCount}/{totalCount}
                                                        </span>
                                                    )}
                                                    {isEraComplete && (
                                                        <span className="text-[10px] font-bold px-2 py-1 rounded-full"
                                                            style={{ backgroundColor: 'rgba(5, 150, 105, 0.1)', color: 'var(--color-success)' }}>
                                                            Complete
                                                        </span>
                                                    )}
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                                                        stroke={isEraComplete ? 'var(--color-success)' : accentColor} strokeWidth="2.5"
                                                        className="flex-shrink-0 transition-transform duration-200"
                                                        style={{ transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }}>
                                                        <polyline points="9 18 15 12 9 6" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </Card>

                                        {/* Lessons within era — shown when expanded */}
                                        {isExpanded && (
                                            <div className="space-y-3 ml-3 mt-3 animate-fade-in" style={{ borderLeft: `2px solid ${accentColor}20` }}>
                                                {eraLessons.map((lesson, lIdx) => {
                                                    const globalIdx = LESSONS.findIndex(l => l.id === lesson.id);
                                                    const isUnlocked = globalIdx === 0 || !!state.completedLessons[LESSONS[globalIdx - 1].id];
                                                    const isCompleted = !!state.completedLessons[lesson.id];
                                                    const events = getEventsByIds(lesson.eventIds);
                                                    const masteryData = lesson.eventIds.map(id => state.eventMastery[id]).filter(Boolean);
                                                    const isSkipped = lesson.eventIds.every(id => (state.skippedEvents || []).includes(id));

                                                    return (
                                                        <Card
                                                            key={lesson.id}
                                                            onClick={isUnlocked ? () => handleLessonClick(lesson.id) : undefined}
                                                            className="lesson-card-row animate-fade-in-up ml-3 relative overflow-hidden"
                                                            style={{
                                                                animationDelay: `${lIdx * 60}ms`,
                                                                animationFillMode: 'backwards',
                                                                backgroundColor: isCompleted ? 'rgba(5, 150, 105, 0.04)' : 'var(--color-card)',
                                                            }}
                                                        >
                                                            <span className="absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none select-none"
                                                                style={{ opacity: 0.045 }}>
                                                                <LessonIcon index={lesson.number} size={72} color={accentColor} />
                                                            </span>
                                                            {!isUnlocked && (
                                                                <div className="absolute top-2 right-2 z-10 w-5 h-5 rounded-full flex items-center justify-center"
                                                                    style={{ backgroundColor: 'rgba(var(--color-ink-rgb), 0.08)' }}>
                                                                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--color-ink-secondary)" strokeWidth="2.5">
                                                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                                                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                                                    </svg>
                                                                </div>
                                                            )}
                                                            <div className="flex items-center gap-4">
                                                                <div className="flex-shrink-0">
                                                                    <div className="relative">
                                                                        <div className="w-11 h-11 rounded-full flex items-center justify-center" style={{
                                                                            backgroundColor: !isUnlocked ? 'rgba(var(--color-ink-rgb), 0.06)' :
                                                                                isCompleted ? 'rgba(5, 150, 105, 0.06)' : 'rgba(250, 246, 240, 0.8)',
                                                                            border: !isUnlocked ? '1.5px solid rgba(var(--color-ink-rgb), 0.10)' :
                                                                                isCompleted ? '2px solid rgba(5, 150, 105, 0.35)' : '2px solid var(--color-burgundy)',
                                                                        }}>
                                                                            <span style={{ opacity: isUnlocked ? 1 : 0.55 }}>
                                                                                <LessonIcon index={lesson.number} size={20} color={'var(--color-burgundy)'} />
                                                                            </span>
                                                                        </div>
                                                                        {isUnlocked && isCompleted && (
                                                                            <div className="absolute -bottom-0.5 -right-0.5 w-[18px] h-[18px] rounded-full flex items-center justify-center"
                                                                                style={{ backgroundColor: 'var(--color-success)', boxShadow: '0 0 0 2px var(--color-card)' }}>
                                                                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5">
                                                                                    <polyline points="20 6 9 17 4 12" />
                                                                                </svg>
                                                                            </div>
                                                                        )}
                                                                        {isUnlocked && !isCompleted && (
                                                                            <div className="absolute -bottom-0.5 -right-0.5 rounded-full flex items-center justify-center px-1 py-px"
                                                                                style={{ backgroundColor: accentColor, boxShadow: '0 0 0 2px var(--color-card)' }}>
                                                                                <span className="text-[8px] font-bold uppercase text-white leading-none">New</span>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="flex items-center gap-2 mb-0.5">
                                                                        <span className="text-[11px] font-medium uppercase tracking-wider" style={{ color: 'var(--color-ink-faint)' }}>
                                                                            Lesson {lesson.number}
                                                                        </span>
                                                                        {isSkipped && (
                                                                            <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded"
                                                                                style={{ backgroundColor: 'rgba(139, 65, 87, 0.08)', color: 'var(--color-burgundy)' }}>
                                                                                Placed
                                                                            </span>
                                                                        )}
                                                                        {masteryData.length > 0 && (
                                                                            <div className="flex gap-0.5">
                                                                                {lesson.eventIds.slice(0, 7).map(id => {
                                                                                    const m = state.eventMastery[id];
                                                                                    return (
                                                                                        <div key={id} className="w-1.5 h-1.5 rounded-full" style={{
                                                                                            backgroundColor: m ? (
                                                                                                m.overallMastery >= 7 ? 'var(--color-success)' :
                                                                                                    m.overallMastery >= 3 ? 'var(--color-warning)' : 'var(--color-error)'
                                                                                            ) : 'var(--color-ink-faint)',
                                                                                            opacity: m ? 1 : 0.2
                                                                                        }} />
                                                                                    );
                                                                                })}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    <h3 className="text-base font-bold leading-tight" style={{ fontFamily: 'var(--font-serif)', color: isUnlocked ? 'var(--color-ink)' : 'var(--color-ink-faint)' }}>
                                                                        {lesson.title}
                                                                    </h3>
                                                                    <p className="text-sm mt-0.5" style={{ color: isUnlocked ? 'var(--color-ink-muted)' : 'var(--color-ink-faint)' }}>
                                                                        {lesson.subtitle}
                                                                    </p>
                                                                </div>
                                                                <div className="flex items-center gap-3 flex-shrink-0">
                                                                    {isUnlocked && (
                                                                        <>
                                                                            <span className="text-xs hidden sm:block" style={{ color: 'var(--color-ink-faint)' }}>
                                                                                {events.length} events
                                                                            </span>
                                                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-ink-faint)" strokeWidth="2" className="flex-shrink-0">
                                                                                <polyline points="9 18 15 12 9 6" />
                                                                            </svg>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </Card>
                                                    );
                                                })}

                                                {/* Skip-ahead quiz at bottom of era */}
                                                {canSkip && (
                                                    <div className="ml-3 animate-fade-in flex items-center gap-1.5 px-2.5 py-1 rounded-lg"
                                                        style={{ backgroundColor: 'rgba(139, 65, 87, 0.06)' }}>
                                                        <span className="text-[10px]" style={{ color: 'var(--color-ink-faint)' }}>
                                                            Know this already? Take the{' '}
                                                        </span>
                                                        {skipUnlocked ? (
                                                            <button onClick={() => setShowPlacement(era.id)}
                                                                className="text-[10px] font-medium px-2 py-0.5 rounded-full cursor-pointer"
                                                                style={{ backgroundColor: 'rgba(139, 65, 87, 0.12)', color: 'var(--color-burgundy)' }}>
                                                                quiz
                                                            </button>
                                                        ) : (
                                                            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                                                                style={{ backgroundColor: 'rgba(139, 65, 87, 0.08)', color: 'rgba(139, 65, 87, 0.5)' }}>
                                                                quiz
                                                            </span>
                                                        )}
                                                        <span className="text-[10px]" style={{ color: 'var(--color-ink-faint)' }}>
                                                            {' '}to skip it!
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Tip: customize lesson length — shown once after completing Lesson 1 */}
                        {state.completedLessons['lesson-1'] && !settingsTipDismissed && (
                            <Card className="mt-6 animate-fade-in" style={{
                                borderLeft: '3px solid var(--color-burgundy)',
                                backgroundColor: 'var(--color-burgundy-soft)',
                            }}>
                                <div className="flex items-start gap-3">
                                    <Mascot mood="happy" size={40} />
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-sm font-bold mb-0.5" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ink)' }}>
                                            Customize your lessons
                                        </h3>
                                        <p className="text-xs leading-relaxed" style={{ color: 'var(--color-ink-secondary)' }}>
                                            Want shorter or longer lessons? You can adjust cards per lesson and recap intensity in Settings.
                                        </p>
                                        <button
                                            className="text-xs font-semibold mt-2"
                                            style={{ color: 'var(--color-burgundy)' }}
                                            onClick={() => { setSettingsTipDismissed(true); localStorage.setItem('chronos-settings-tip-seen', '1'); dispatch({ type: 'TOGGLE_SETTINGS' }); }}
                                        >
                                            Open Settings
                                        </button>
                                    </div>
                                    <button onClick={() => { setSettingsTipDismissed(true); localStorage.setItem('chronos-settings-tip-seen', '1'); }}
                                        className="flex-shrink-0 p-1 rounded-full" style={{ color: 'var(--color-ink-muted)' }}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                                        </svg>
                                    </button>
                                </div>
                            </Card>
                        )}

                    </div>
                ) : (
                    <div key="level2" className={`slide-from-${slideDirection}`}>

                        <div className="text-center mb-6">
                            <h1 className="learn-page-title font-bold" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ink)' }}>
                                Deep Dives
                            </h1>
                            <p className="learn-page-subtitle mt-0.5" style={{ color: 'var(--color-ink-muted)' }}>
                                Topic-based chapters you can start anytime
                            </p>
                        </div>

                        {LEVEL2_CHAPTERS.map((chapter, chIdx) => {
                            const chCompletedCount = chapter.lessons.filter(l => state.completedLessons[l.id]).length;
                            const chTotalCount = chapter.lessons.length;
                            const chEventCount = [...new Set(chapter.lessons.flatMap(l => l.eventIds))].length;
                            const chNumber = chIdx + 1;
                            const isExpanded = expandedChapter === chapter.id;
                            const chIsComplete = chCompletedCount === chTotalCount;
                            const chInProgress = chCompletedCount > 0 && !chIsComplete;
                            const chNotStarted = chCompletedCount === 0;

                            return (
                                <div key={chapter.id} className="mb-3.5 animate-fade-in">
                                    {/* Chapter header card — clickable to expand/collapse */}
                                    <Card className="cursor-pointer active:scale-[0.98] transition-transform" style={{
                                        padding: '8px 12px',
                                        borderLeft: `3px solid ${chIsComplete ? 'rgba(5, 150, 105, 0.5)' : chapter.color}`,
                                        backgroundColor: chIsComplete ? 'rgba(5, 150, 105, 0.04)' : `${chapter.color}08`,
                                    }}
                                        onClick={() => setExpandedChapter(isExpanded ? null : chapter.id)}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="relative flex-shrink-0">
                                                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                                                    style={{
                                                        backgroundColor: chIsComplete ? 'rgba(5, 150, 105, 0.10)' : `${chapter.color}15`,
                                                        border: chIsComplete ? '2px solid rgba(5, 150, 105, 0.35)' : undefined,
                                                    }}>
                                                    <LessonIcon index={chapter.iconIndex || 6} size={20} color={chIsComplete ? 'var(--color-success)' : chapter.color} />
                                                </div>
                                                {chIsComplete && (
                                                    <div className="absolute -bottom-1 -right-1 w-[18px] h-[18px] rounded-full flex items-center justify-center"
                                                        style={{ backgroundColor: 'var(--color-success)', boxShadow: '0 0 0 2px var(--color-card)' }}>
                                                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5">
                                                            <polyline points="20 6 9 17 4 12" />
                                                        </svg>
                                                    </div>
                                                )}
                                                {chNotStarted && (
                                                    <div className="absolute -bottom-1 -right-1 rounded-full flex items-center justify-center px-1.5 py-0.5"
                                                        style={{ backgroundColor: chapter.color, boxShadow: '0 0 0 2px var(--color-card)' }}>
                                                        <span className="text-[8px] font-bold uppercase text-white leading-none">New</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: chIsComplete ? 'var(--color-success)' : chapter.color }}>
                                                    Chapter {chNumber}
                                                </span>
                                                <h3 className="text-base font-bold leading-tight"
                                                    style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ink)' }}>
                                                    {chapter.title}
                                                </h3>
                                                <p className="text-xs mt-0.5" style={{ color: 'var(--color-ink-muted)' }}>
                                                    {chapter.subtitle} {'\u00B7'} {chEventCount} events
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2 flex-shrink-0">
                                                {chInProgress && (
                                                    <span className="text-[10px] font-bold px-2 py-1 rounded-full"
                                                        style={{ backgroundColor: `${chapter.color}15`, color: chapter.color }}>
                                                        {chCompletedCount}/{chTotalCount}
                                                    </span>
                                                )}
                                                {chIsComplete && (
                                                    <span className="text-[10px] font-bold px-2 py-1 rounded-full"
                                                        style={{ backgroundColor: 'rgba(5, 150, 105, 0.1)', color: 'var(--color-success)' }}>
                                                        Complete
                                                    </span>
                                                )}
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                                                    stroke={chIsComplete ? 'var(--color-success)' : chapter.color} strokeWidth="2.5"
                                                    className="flex-shrink-0 transition-transform duration-200"
                                                    style={{ transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }}>
                                                    <polyline points="9 18 15 12 9 6" />
                                                </svg>
                                            </div>
                                        </div>
                                    </Card>

                                    {/* Lesson cards within chapter — only shown when expanded */}
                                    {isExpanded && (
                                        <div className="space-y-3 ml-3 mt-3 animate-fade-in" style={{ borderLeft: `2px solid ${chapter.color}20` }}>
                                            {chapter.lessons.map((lesson, lIdx) => {
                                                const isUnlocked = lIdx === 0 || !!state.completedLessons[chapter.lessons[lIdx - 1].id];
                                                const isCompleted = !!state.completedLessons[lesson.id];
                                                const events = getEventsByIds(lesson.eventIds);
                                                const masteryData = lesson.eventIds.map(id => state.eventMastery[id]).filter(Boolean);

                                                return (
                                                    <Card
                                                        key={lesson.id}
                                                        onClick={isUnlocked ? () => handleLessonClick(lesson.id) : undefined}
                                                        className={`lesson-card-row animate-fade-in-up ml-3 relative overflow-hidden`}
                                                        style={{
                                                            animationDelay: `${lIdx * 60}ms`,
                                                            animationFillMode: 'backwards',
                                                            backgroundColor: isCompleted ? 'rgba(5, 150, 105, 0.04)' : 'var(--color-card)',
                                                        }}
                                                    >
                                                        {/* Decorative background icon */}
                                                        <span className="absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none select-none"
                                                            style={{ opacity: 0.045 }}>
                                                            <LessonIcon index={lesson.iconIndex || chapter.iconIndex || 6} size={72} color={chapter.color} />
                                                        </span>
                                                        {!isUnlocked && (
                                                            <div className="absolute top-2 right-2 z-10 w-5 h-5 rounded-full flex items-center justify-center"
                                                                style={{ backgroundColor: 'rgba(var(--color-ink-rgb), 0.08)' }}>
                                                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--color-ink-secondary)" strokeWidth="2.5">
                                                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                                                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                                                </svg>
                                                            </div>
                                                        )}
                                                        <div className="flex items-center gap-4">
                                                            <div className="flex-shrink-0">
                                                                <div className="relative">
                                                                    <div className="w-11 h-11 rounded-full flex items-center justify-center" style={{
                                                                        backgroundColor: !isUnlocked ? 'rgba(var(--color-ink-rgb), 0.06)' :
                                                                            isCompleted ? 'rgba(5, 150, 105, 0.10)' : `${chapter.color}08`,
                                                                        border: !isUnlocked ? '1.5px solid rgba(var(--color-ink-rgb), 0.10)' :
                                                                            isCompleted ? '2px solid rgba(5, 150, 105, 0.35)' : `2px solid ${chapter.color}`,
                                                                    }}>
                                                                        <span style={{ opacity: isUnlocked ? 1 : 0.55 }}>
                                                                            <LessonIcon index={lesson.iconIndex || chapter.iconIndex || 6} size={20} color={chapter.color} />
                                                                        </span>
                                                                    </div>
                                                                    {isUnlocked && isCompleted && (
                                                                        <div className="absolute -bottom-0.5 -right-0.5 w-[18px] h-[18px] rounded-full flex items-center justify-center"
                                                                            style={{ backgroundColor: 'var(--color-success)', boxShadow: '0 0 0 2px var(--color-card)' }}>
                                                                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5">
                                                                                <polyline points="20 6 9 17 4 12" />
                                                                            </svg>
                                                                        </div>
                                                                    )}
                                                                    {isUnlocked && !isCompleted && (
                                                                        <div className="absolute -bottom-0.5 -right-0.5 rounded-full flex items-center justify-center px-1 py-px"
                                                                            style={{ backgroundColor: chapter.color, boxShadow: '0 0 0 2px var(--color-card)' }}>
                                                                            <span className="text-[8px] font-bold uppercase text-white leading-none">New</span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center gap-2 mb-0.5">
                                                                    <span className="text-[11px] font-medium uppercase tracking-wider" style={{ color: 'var(--color-ink-faint)' }}>
                                                                        Lesson {chNumber}.{lIdx + 1}
                                                                    </span>
                                                                    {masteryData.length > 0 && (
                                                                        <div className="flex gap-0.5">
                                                                            {lesson.eventIds.map(id => {
                                                                                const m = state.eventMastery[id];
                                                                                return (
                                                                                    <div key={id} className="w-1.5 h-1.5 rounded-full" style={{
                                                                                        backgroundColor: m ? (
                                                                                            m.overallMastery >= 7 ? 'var(--color-success)' :
                                                                                                m.overallMastery >= 3 ? 'var(--color-warning)' : 'var(--color-error)'
                                                                                        ) : 'var(--color-ink-faint)',
                                                                                        opacity: m ? 1 : 0.2
                                                                                    }} />
                                                                                );
                                                                            })}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <h3 className="text-base font-bold leading-tight" style={{ fontFamily: 'var(--font-serif)', color: isUnlocked ? 'var(--color-ink)' : 'var(--color-ink-faint)' }}>
                                                                    {lesson.title}
                                                                </h3>
                                                                <p className="text-sm mt-0.5" style={{ color: isUnlocked ? 'var(--color-ink-muted)' : 'var(--color-ink-faint)' }}>
                                                                    {lesson.subtitle}
                                                                </p>
                                                            </div>

                                                            <div className="flex items-center gap-3 flex-shrink-0">
                                                                {isUnlocked && (
                                                                    <>
                                                                        <span className="text-xs hidden sm:block" style={{ color: 'var(--color-ink-faint)' }}>
                                                                            {events.length} events
                                                                        </span>
                                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-ink-faint)" strokeWidth="2" className="flex-shrink-0">
                                                                            <polyline points="9 18 15 12 9 6" />
                                                                        </svg>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </Card>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                    </div>
                )}

            </div>{/* end swipe container */}

            {/* Pacing warning — shown after 5+ lesson sessions in one day */}
            {paceWarningLessonId && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6"
                    style={{ backgroundColor: 'rgba(var(--color-ink-rgb), 0.5)', backdropFilter: 'blur(4px)' }}
                    onClick={() => setPaceWarningLessonId(null)}>
                    <div className="w-full max-w-sm rounded-2xl p-6 animate-fade-in"
                        style={{ backgroundColor: 'var(--color-card)', boxShadow: 'var(--shadow-elevated)' }}
                        onClick={e => e.stopPropagation()}>
                        <div className="text-center mb-4">
                            <Mascot mood="thinking" size={52} />
                        </div>
                        <h3 className="text-base font-bold text-center mb-2" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ink)' }}>
                            Take it slow!
                        </h3>
                        <p className="text-sm text-center mb-5" style={{ color: 'var(--color-ink-muted)' }}>
                            You've done {todayLessonCount} lessons today {'—'} impressive! But learning sticks better with time between sessions. Try practicing what you already know instead.
                        </p>
                        <Button className="w-full mb-2" onClick={() => {
                            setPaceWarningLessonId(null);
                            window.dispatchEvent(new CustomEvent('widgetOpenTab', { detail: 'practice' }));
                        }}>
                            Go to Practice
                        </Button>
                        <button
                            className="w-full py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer"
                            style={{ color: 'var(--color-ink-muted)', backgroundColor: 'transparent' }}
                            onClick={() => {
                                const id = paceWarningLessonId;
                                setPaceWarningLessonId(null);
                                setActiveLessonId(id);
                            }}>
                            Continue anyway
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
