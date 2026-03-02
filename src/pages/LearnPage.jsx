import { useState, useEffect, useMemo, Fragment } from 'react';
import { useApp } from '../context/AppContext';
import { LESSONS, ERA_QUIZ_GROUPS } from '../data/lessons';
import { getEventsByIds, getEventById } from '../data/events';
import { isPlacementQuizUnlocked } from '../data/placementQuiz';
import { getTodaysDailyQuiz } from '../data/dailyQuiz';
import { Card, Button, DiHBadge, MasteryDots } from '../components/shared';
import LessonFlow from '../components/learn/LessonFlow';
import Lesson0Flow from '../components/learn/Lesson0Flow';
import PlacementQuizFlow from '../components/learn/PlacementQuizFlow';
import DailyQuizFlow from '../components/DailyQuizFlow';
import Mascot from '../components/Mascot';

export default function LearnPage({ onSessionChange, registerBackHandler, onTabChange }) {
    const { state, dispatch } = useApp();
    const [activeLessonId, setActiveLessonId] = useState(null);
    const [selectedCards, setSelectedCards] = useState(3);
    const [selectedRecap, setSelectedRecap] = useState(2);
    const [showPlacement, setShowPlacement] = useState(null);
    const [showDailyQuiz, setShowDailyQuiz] = useState(false);
    const [expandedEra, setExpandedEra] = useState(null);
    const [paceWarningLessonId, setPaceWarningLessonId] = useState(null);
    const [dailyCompletedExpanded, setDailyCompletedExpanded] = useState(false);

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
    const todayEvents = useMemo(() =>
        isDailyCompleted ? dailyData.eventIds.map(id => getEventById(id)).filter(Boolean) : [],
        [isDailyCompleted, dailyData.eventIds]
    );

    // ─── Weekly insights (shown every 3 days) ─────────
    const weekStart = useMemo(() => {
        const d = new Date();
        const day = d.getDay(); // 0=Sun
        const diff = day === 0 ? 6 : day - 1; // shift to Monday start
        d.setDate(d.getDate() - diff);
        return d.toISOString().split('T')[0];
    }, []);
    const [weekInsightsDismissed, setWeekInsightsDismissed] = useState(() => {
        const lastDismissed = localStorage.getItem('chronos-weekly-dismissed');
        if (!lastDismissed) return false;
        const daysSince = Math.floor((Date.now() - new Date(lastDismissed).getTime()) / 86400000);
        return daysSince < 3;
    });

    const weeklyInsights = useMemo(() => {
        const sessions = (state.studySessions || []).filter(s => s.date >= weekStart);
        if (sessions.length === 0) return null;
        return {
            sessions: sessions.length,
            weekQuestions: sessions.reduce((s, sess) => s + (sess.questionsAnswered || 0), 0),
            weekSeconds: sessions.reduce((s, sess) => s + (sess.duration || 0), 0),
        };
    }, [state.studySessions, weekStart]);

    const showWeeklyInsights = weeklyInsights && !weekInsightsDismissed
        && (state.seenEvents || []).length >= 3;

    // Map lesson IDs to their era group (for skip-ahead dividers)
    const lessonEraEndMap = useMemo(() => {
        const map = {};
        for (const group of ERA_QUIZ_GROUPS) {
            const lastLessonId = group.lessonIds[group.lessonIds.length - 1];
            map[lastLessonId] = group;
        }
        return map;
    }, []);

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
        const lesson = LESSONS.find(l => l.id === activeLessonId);
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
            <div className="text-center mb-4">
                <h2 className="learn-page-chapter font-semibold uppercase tracking-widest mb-0.5" style={{ color: 'var(--color-ink-muted)' }}>
                    Chapter 1
                </h2>
                <h1 className="learn-page-title font-bold" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ink)' }}>
                    The Story of Humanity
                </h1>
                <p className="learn-page-subtitle mt-0.5" style={{ color: 'var(--color-ink-muted)' }}>
                    60 events across 16 lessons
                </p>
            </div>

            {/* Daily Quiz card — 3 states: not started / retry / completed */}
            {dailyData && !isDailyStarted && !isDailyCompleted && (
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
            {dailyData && isDailyStarted && (
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
            {dailyData && isDailyCompleted && !dailyCompletedExpanded && (
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
            {dailyData && isDailyCompleted && dailyCompletedExpanded && (
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
                                setWeekInsightsDismissed(true);
                                localStorage.setItem('chronos-weekly-dismissed', new Date().toISOString().split('T')[0]);
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
                {/* Thematic emoji per lesson — shown as faded background on locked cards */}
                {LESSONS.map((lesson, index) => {
                    const LESSON_EMOJI = [
                        '🌍', '🦶', '🧠', '🌾', '📜', '⚖️', '⚔️', '🏛️', '🐪', '🕌',
                        '🏰', '🗡️', '💀', '🎨', '🚢', '🔭', '⚡', '🏭', '💣', '☢️', '🌐',
                    ];
                    const isUnlocked = index === 0 || state.completedLessons[LESSONS[index - 1].id];
                    const isCompleted = state.completedLessons[lesson.id];
                    const isLesson0 = !!lesson.isLesson0;
                    const events = isLesson0 ? [] : getEventsByIds(lesson.eventIds);
                    const seenCount = isLesson0 ? 0 : lesson.eventIds.filter(id => state.seenEvents.includes(id)).length;
                    const masteryData = isLesson0 ? [] : lesson.eventIds.map(id => state.eventMastery[id]).filter(Boolean);
                    const isSkipped = !isLesson0 && lesson.eventIds.every(id => (state.skippedEvents || []).includes(id));

                    // Pulse lesson 0 during onboarding guide
                    const pulseLesson0 = isOnboardingGuide && isLesson0;

                    // Era skip-ahead divider after this lesson?
                    const eraGroup = lessonEraEndMap[lesson.id];
                    const showEraSkip = showSkipDividers && eraGroup
                        && !state.placementQuizzes[eraGroup.id]?.passed;
                    const eraUnlocked = showEraSkip ? isPlacementQuizUnlocked(eraGroup.id, state.placementQuizzes) : false;
                    const isEraExpanded = showEraSkip ? expandedEra === eraGroup.id : false;

                    return (
                        <Fragment key={lesson.id}>
                        <Card
                            onClick={isUnlocked ? () => handleLessonClick(lesson.id) : undefined}
                            className={`lesson-card-row animate-fade-in-up ${!isUnlocked ? 'relative overflow-hidden' : ''} ${pulseLesson0 ? 'onboarding-pulse' : ''}`}
                            style={{
                                animationDelay: `${index * 60}ms`,
                                animationFillMode: 'backwards',
                                backgroundColor: isCompleted ? 'rgba(5, 150, 105, 0.04)' : 'var(--color-card)',
                            }}
                        >
                            {/* Locked lesson: faded emoji background + lock badge */}
                            {!isUnlocked && (
                                <>
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none select-none"
                                        style={{ fontSize: '48px', opacity: 0.06 }}>
                                        {LESSON_EMOJI[lesson.number] || '📖'}
                                    </span>
                                    <div className="absolute top-2 right-2">
                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--color-ink-muted)" strokeWidth="2.5" opacity="0.45">
                                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                        </svg>
                                    </div>
                                </>
                            )}
                            <div className="flex items-center gap-4">
                                {/* Progress indicator */}
                                <div className="flex-shrink-0">
                                    <div className="relative">
                                        <div className="w-11 h-11 rounded-full flex items-center justify-center" style={{
                                            backgroundColor: !isUnlocked ? 'rgba(28, 25, 23, 0.05)' :
                                                isCompleted ? 'rgba(5, 150, 105, 0.10)' : 'rgba(139, 65, 87, 0.04)',
                                            border: !isUnlocked ? 'none' :
                                                isCompleted ? '2px solid rgba(5, 150, 105, 0.35)' : '2px solid var(--color-burgundy)',
                                        }}>
                                            <span className="text-lg" style={{ opacity: isUnlocked ? 1 : 0.45 }}>
                                                {LESSON_EMOJI[lesson.number] || '📖'}
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
                                                style={{ backgroundColor: 'var(--color-burgundy)', boxShadow: '0 0 0 2px var(--color-card)' }}>
                                                <span className="text-[8px] font-bold uppercase text-white leading-none">New</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <span className="text-[11px] font-medium uppercase tracking-wider" style={{ color: 'var(--color-ink-faint)' }}>
                                            {isLesson0 ? 'Prologue' : `Lesson ${lesson.number}`}
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

                                {/* Right side: event count + arrow */}
                                <div className="flex items-center gap-3 flex-shrink-0">
                                    {isUnlocked && (
                                        <>
                                            <span className="text-xs hidden sm:block" style={{ color: 'var(--color-ink-faint)' }}>
                                                {isLesson0 ? '5 eras' : `${events.length} events`}
                                            </span>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-ink-faint)" strokeWidth="2" className="flex-shrink-0">
                                                <polyline points="9 18 15 12 9 6" />
                                            </svg>
                                        </>
                                    )}
                                </div>
                            </div>
                        </Card>
                        {showEraSkip && (
                            <div className="my-1">
                                <button
                                    onClick={() => setExpandedEra(isEraExpanded ? null : eraGroup.id)}
                                    className="w-full flex items-center gap-3 group"
                                    style={{ cursor: 'pointer' }}
                                >
                                    <div className="flex-1 h-px" style={{ backgroundColor: 'rgba(139, 65, 87, 0.15)' }} />
                                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-full transition-colors"
                                        style={{ backgroundColor: isEraExpanded ? 'rgba(139, 65, 87, 0.08)' : 'transparent' }}>
                                        <span className="text-sm">🎓</span>
                                        <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--color-burgundy)' }}>
                                            Skip {eraGroup.label.replace(/^The /, '')}
                                        </span>
                                    </div>
                                    <div className="flex-1 h-px" style={{ backgroundColor: 'rgba(139, 65, 87, 0.15)' }} />
                                </button>
                                {isEraExpanded && (
                                    <Card className="mt-2 p-4 animate-fade-in" style={{ borderLeft: '3px solid var(--color-burgundy)' }}>
                                        <div className="flex items-center gap-3">
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-sm font-bold" style={{ fontFamily: 'var(--font-serif)' }}>
                                                    {eraGroup.label}
                                                </h3>
                                                <p className="text-xs mt-0.5" style={{ color: 'var(--color-ink-muted)' }}>
                                                    {eraGroup.questionCount} questions {'·'} {eraGroup.lessonIds.length} lessons
                                                </p>
                                            </div>
                                            {eraUnlocked ? (
                                                <Button onClick={() => setShowPlacement(eraGroup.id)} style={{ fontSize: '12px', padding: '6px 12px' }}>
                                                    Take Quiz
                                                </Button>
                                            ) : (
                                                <span className="text-[10px] font-medium px-2.5 py-1 rounded-full whitespace-nowrap"
                                                    style={{ backgroundColor: 'rgba(28,25,23,0.06)', color: 'var(--color-ink-muted)' }}>
                                                    Pass previous era first
                                                </span>
                                            )}
                                        </div>
                                    </Card>
                                )}
                            </div>
                        )}
                        </Fragment>
                    );
                })}
            </div>

            {/* First-launch lesson settings chooser */}
            {Object.keys(state.completedLessons).length === 0 && state.cardsPerLesson === undefined && (() => {
                const totalQ = selectedCards * (2 + selectedRecap);
                const estMin = Math.max(1, Math.round(totalQ / 2));
                return (
                    <Card className="mt-6 p-5 animate-fade-in">
                        <div className="text-center mb-3">
                            <Mascot mood="happy" size={52} />
                        </div>
                        <h3 className="text-base font-bold text-center mb-1" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ink)' }}>
                            How much time do you have?
                        </h3>
                        <p className="text-xs text-center mb-4" style={{ color: 'var(--color-ink-muted)' }}>
                            Customize your lesson length. You can change this later in settings.
                        </p>

                        {/* Cards per lesson */}
                        <div className="text-xs font-semibold mb-2" style={{ color: 'var(--color-ink-secondary)' }}>Cards per Lesson</div>
                        <div className="flex gap-2 mb-4">
                            {[1, 2, 3].map(n => {
                                const isActive = selectedCards === n;
                                return (
                                    <button
                                        key={n}
                                        onClick={() => setSelectedCards(n)}
                                        className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                                        style={{
                                            backgroundColor: isActive ? 'var(--color-burgundy)' : 'var(--color-card)',
                                            color: isActive ? 'white' : 'var(--color-ink-secondary)',
                                            border: isActive ? 'none' : '1px solid rgba(28, 25, 23, 0.08)',
                                        }}
                                    >
                                        {n} {n === 1 ? 'card' : 'cards'}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Recap intensity */}
                        <div className="text-xs font-semibold mb-2" style={{ color: 'var(--color-ink-secondary)' }}>Recap Intensity</div>
                        <div className="flex gap-2 mb-1">
                            {[
                                { value: 0, label: 'Off' },
                                { value: 1, label: 'Light' },
                                { value: 2, label: 'Full' },
                            ].map(({ value, label }) => {
                                const isActive = selectedRecap === value;
                                return (
                                    <button
                                        key={value}
                                        onClick={() => setSelectedRecap(value)}
                                        className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                                        style={{
                                            backgroundColor: isActive ? 'var(--color-burgundy)' : 'var(--color-card)',
                                            color: isActive ? 'white' : 'var(--color-ink-secondary)',
                                            border: isActive ? 'none' : '1px solid rgba(28, 25, 23, 0.08)',
                                        }}
                                    >
                                        {label}
                                    </button>
                                );
                            })}
                        </div>
                        <div className="flex gap-2 mb-4">
                            <span className="flex-1 text-center text-[11px]" style={{ color: 'var(--color-ink-faint)' }}>No recap</span>
                            <span className="flex-1 text-center text-[11px]" style={{ color: 'var(--color-ink-faint)' }}>1 per card</span>
                            <span className="flex-1 text-center text-[11px]" style={{ color: 'var(--color-ink-faint)' }}>2 per card</span>
                        </div>

                        {/* Summary + confirm */}
                        <p className="text-xs text-center mb-4" style={{ color: 'var(--color-ink-secondary)' }}>
                            {totalQ} questions per lesson · ~{estMin} min
                        </p>
                        <Button className="w-full" onClick={() => {
                            dispatch({ type: 'SET_CARDS_PER_LESSON', value: selectedCards });
                            dispatch({ type: 'SET_RECAP_PER_CARD', value: selectedRecap });
                        }}>
                            Start Learning
                        </Button>
                    </Card>
                );
            })()}

            {/* Empty state mascot (shown after setting is chosen or for returning users with no completions) */}
            {Object.keys(state.completedLessons).length === 0 && state.cardsPerLesson !== undefined && (
                <div className="text-center mt-10 animate-fade-in">
                    <Mascot mood="happy" size={60} />
                    <p className="text-sm mt-2" style={{ color: 'var(--color-ink-muted)', fontFamily: 'var(--font-serif)' }}>
                        Start your journey through history!
                    </p>
                </div>
            )}

            {/* Pacing warning — shown after 5+ lesson sessions in one day */}
            {paceWarningLessonId && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6"
                    style={{ backgroundColor: 'rgba(28, 25, 23, 0.5)', backdropFilter: 'blur(4px)' }}
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
