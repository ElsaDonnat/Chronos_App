import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { getEventsByIds, getEventById, ALL_EVENTS, CATEGORY_CONFIG, ERA_BOUNDARY_EVENTS, ERA_RANGES, getEraBoundaryInfo } from '../../data/events';
import { scoreDateAnswer, generateLocationOptions, generateWhatOptions, generateDateMCQOptions, generateDescriptionOptions, calculateXP, SCORE_COLORS, getScoreColor, getScoreLabel, shuffle } from '../../data/quiz';
import { calculateNextReview } from '../../data/spacedRepetition';
import { Card, Button, CategoryTag, CategoryIcon, ImportanceTag, Divider, StarButton, ConfirmModal, ExpandableText, ControversyNote, AnimatedCounter, EventConnections, flyXPToStar } from '../shared';
import Mascot from '../Mascot';
import LessonIcon from '../LessonIcon';
import { LEVEL2_CHAPTERS } from '../../data/lessons';
import * as feedback from '../../services/feedback';
import { stripDatesFromDescription } from '../../utils/stripDates';
import { shareText, buildLessonShareText } from '../../services/share';
import StreakFlame from '../StreakFlame';
import StreakCelebration from '../StreakCelebration';

// ─── PHASES ────────────────────────────────────────────
const PHASE = {
    INTRO: 'intro',
    PERIOD_INTRO: 'period_intro',
    LEARN_CARD: 'learn_card',       // Study an event card
    LEARN_QUIZ: 'learn_quiz',       // 2 MCQ questions after a card
    RECAP_TRANSITION: 'recap_transition',
    RECAP: 'recap',                 // 3 remaining MCQs + 3 date free-inputs
    FINAL_REVIEW: 'final_review',
    SUMMARY: 'summary',
};

const QUESTION_TYPES = ['date', 'location', 'what', 'description'];

// SVG era icons — replace emoji to avoid rendering issues on Android
const EraIcon = ({ type, size = 36 }) => {
    const icons = {
        prehistory: ( // bone
            <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#9E4A4A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 10c0-1.5 1-2.5 2-3 .5-1.5-.5-3-2-3.5S2 4 2.5 5.5c-1 .5-1.5 2-.5 3s2.5 1 3 1.5z" fill="#9E4A4A" opacity="0.15" />
                <path d="M19 14c0 1.5-1 2.5-2 3-.5 1.5.5 3 2 3.5s3-.5 2.5-2c1-.5 1.5-2 .5-3s-2.5-1-3-1.5z" fill="#9E4A4A" opacity="0.15" />
                <line x1="7" y1="9" x2="17" y2="15" />
            </svg>
        ),
        ancient: ( // temple columns
            <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#7A6B50" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 21h18M5 21V7l7-4 7 4v14" fill="#7A6B50" opacity="0.1" />
                <line x1="9" y1="21" x2="9" y2="10" />
                <line x1="15" y1="21" x2="15" y2="10" />
                <path d="M5 7l7-4 7 4" />
                <line x1="3" y1="21" x2="21" y2="21" />
            </svg>
        ),
        medieval: ( // crossed swords
            <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#B06A30" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 3l14 14M9.5 7.5L5 3M19 3L5 17" />
                <path d="M14.5 7.5L19 3" />
                <path d="M5 17l2 2 2-2" />
                <path d="M19 17l-2 2-2-2" />
            </svg>
        ),
        earlymodern: ( // compass
            <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#9A8528" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" fill="#9A8528" opacity="0.08" />
                <polygon points="16.24,7.76 14.12,14.12 7.76,16.24 9.88,9.88" fill="#9A8528" opacity="0.2" stroke="#9A8528" />
                <line x1="12" y1="3" x2="12" y2="5" />
                <line x1="12" y1="19" x2="12" y2="21" />
                <line x1="3" y1="12" x2="5" y2="12" />
                <line x1="19" y1="12" x2="21" y2="12" />
            </svg>
        ),
        modern: ( // globe
            <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#B09035" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" fill="#B09035" opacity="0.08" />
                <ellipse cx="12" cy="12" rx="4" ry="9" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <path d="M4.5 7.5h15M4.5 16.5h15" />
            </svg>
        ),
    };
    return icons[type] || null;
};

// Period overview data
const PERIOD_INFO = {
    prehistory: {
        title: 'Prehistory',
        subtitle: 'c. 7\u20136 million years ago \u2013 c. 3200 BCE',
        keywords: 'Evolution, fire, farming.',
        description: 'Literally "before written records," prehistory spans 99% of the human story \u2014 from bipedalism and stone tools through the mastery of fire, the emergence of language, migration out of Africa, and the Neolithic transition to settled agriculture.',
        color: '#9E4A4A', iconType: 'prehistory',
    },
    ancient: {
        title: 'The Ancient World',
        subtitle: 'c. 3200 BCE \u2013 476 CE',
        keywords: 'Writing, cities, empires.',
        description: 'Defined by writing, cities, states, and empires. From Sumer and Egypt to Greece, Rome, China, and India \u2014 humanity built the foundations of law, philosophy, science, and organized religion.',
        color: '#7A6B50', iconType: 'ancient',
    },
    medieval: {
        title: 'The Medieval World',
        subtitle: '476 \u2013 c. 1500 CE',
        keywords: 'Islam, feudalism, Mongols.',
        description: 'An era of transformation, not darkness. The rise of Islam, Byzantine continuity, feudal Europe, the Mongol Empire, the Crusades, and the first universities \u2014 from Rome\'s fall to the reconnection of the world.',
        color: '#B06A30', iconType: 'medieval',
    },
    earlymodern: {
        title: 'The Early Modern Period',
        subtitle: 'c. 1500 \u2013 1789',
        keywords: 'Exploration, Reformation, science.',
        description: 'Exploration, colonization, the Renaissance, Reformation, Scientific Revolution, and Enlightenment \u2014 from a fragmented world to an interconnected one, ending when Enlightenment ideals erupted into revolution.',
        color: '#9A8528', iconType: 'earlymodern',
    },
    modern: {
        title: 'The Modern World',
        subtitle: '1789 \u2013 Present',
        keywords: 'Industry, world wars, digital.',
        description: 'More change in two centuries than in the previous two millennia. Industrialization, world wars, decolonization, the Cold War, and the digital revolution. The defining theme is acceleration.',
        color: '#B09035', iconType: 'modern',
    },
};

export default function LessonFlow({ lesson, onComplete }) {
    const { state, dispatch } = useApp();
    const recapPerCard = state.recapPerCard ?? 2;
    const events = useMemo(() => getEventsByIds(lesson.eventIds).slice(0, 3), [lesson]);

    // Icon index: lesson.number for Level 1, chapter.iconIndex for Level 2
    const lessonIconIndex = useMemo(() => {
        if (lesson.chapterId) {
            const ch = LEVEL2_CHAPTERS.find(c => c.id === lesson.chapterId);
            return ch?.iconIndex ?? 6;
        }
        return lesson.number;
    }, [lesson]);

    const [phase, setPhase] = useState(PHASE.INTRO);
    const [cardIndex, setCardIndex] = useState(0);         // 0–2, current card in learn phase
    const [learnQuizIndex, setLearnQuizIndex] = useState(0); // 0–1, quiz within current card
    const [recapIndex, setRecapIndex] = useState(0);         // 0–5, recap questions
    const [reviewIndex, setReviewIndex] = useState(0);
    const [quizResults, setQuizResults] = useState([]);
    const [selectedDot, setSelectedDot] = useState(null);    // for result dot modal
    const [showExitConfirm, setShowExitConfirm] = useState(false);
    const [checkpointData, setCheckpointData] = useState(null); // { label, greenCount }
    const xpDispatched = useRef(false);
    const pendingNextAction = useRef(null);
    const lastAnswerScore = useRef(null);
    const sessionStartTime = useRef(null);
    const [sessionDuration, setSessionDuration] = useState(0);
    const [shareToast, setShareToast] = useState(false);
    const [postLessonModal, setPostLessonModal] = useState(null); // null | 'placement' | 'support'
    const [streakCelebration, setStreakCelebration] = useState(null); // null | { previousStatus, newStreak }

    // For each card, randomly pick 3 of the 4 question types to use for MCQs (discarding 1)
    // Then assign 2 to the learn phase and 1 to the recap phase
    const selectedTypes = useMemo(() => {
        return events.map(() => {
            const shuffled = shuffle([...QUESTION_TYPES]);
            return shuffled.slice(0, 3); // pick 3 types to test
        });
    }, [events]);

    const learnTypes = useMemo(() => {
        return selectedTypes.map(types => types.slice(0, 2)); // first 2 go to learn
    }, [selectedTypes]);

    const remainingTypes = useMemo(() => {
        return selectedTypes.map(types => types[2]); // the 3rd goes to recap
    }, [selectedTypes]);

    // Pre-generate learn quiz questions
    const learnQuizQuestions = useMemo(() => {
        const qs = [];
        events.forEach((event, i) => {
            learnTypes[i].forEach(type => {
                qs.push({ event, type, cardIdx: i, phase: 'learn' });
            });
        });
        return qs;
    }, [events, learnTypes]);

    // Pre-generate recap questions (shuffled once on mount)
    // recapPerCard: 0 = no recap, 1 = one question per card (MCQ or date, random), 2 = full (MCQ + date)
    const [recapQuestions] = useState(() => {
        if (recapPerCard === 0) return [];
        const qs = [];
        if (recapPerCard === 2) {
            // Full: 1 MCQ + 1 date input per card
            events.forEach((event, i) => {
                qs.push({ event, type: remainingTypes[i], cardIdx: i, phase: 'recap', isDateInput: false });
            });
            events.forEach((event, i) => {
                qs.push({ event, type: 'date_input', cardIdx: i, phase: 'recap', isDateInput: true });
            });
        } else {
            // Light: 1 question per card — randomly MCQ or date input
            events.forEach((event, i) => {
                const useDateInput = Math.random() < 0.5;
                qs.push({
                    event,
                    type: useDateInput ? 'date_input' : remainingTypes[i],
                    cardIdx: i,
                    phase: 'recap',
                    isDateInput: useDateInput,
                });
            });
        }
        return shuffle(qs);
    });

    // Get current learn quiz questions for current card
    const currentCardLearnQs = useMemo(() => {
        return learnQuizQuestions.filter(q => q.cardIdx === cardIndex);
    }, [learnQuizQuestions, cardIndex]);

    // Nearby events (prev/next chronologically within lesson)
    const getNearbyEvents = useCallback((event) => {
        const sorted = [...events].sort((a, b) => a.year - b.year);
        const idx = sorted.findIndex(e => e.id === event.id);
        const nearby = [];
        if (idx > 0) nearby.push(sorted[idx - 1]);
        if (idx < sorted.length - 1) nearby.push(sorted[idx + 1]);
        return nearby;
    }, [events]);

    // Hard results for final review
    const hardResults = useMemo(() => {
        return quizResults.filter(r => r.firstScore === 'red' || r.firstScore === 'yellow');
    }, [quizResults]);

    // Total counts
    const totalQuestions = events.length * (2 + recapPerCard);
    const answeredCount = quizResults.length;

    // Set session start time on mount
    useEffect(() => { sessionStartTime.current = Date.now(); }, []);

    // Play card reveal sound when a new learn card appears
    useEffect(() => {
        if (phase === PHASE.LEARN_CARD) feedback.cardReveal();
    }, [phase, cardIndex]);

    useEffect(() => {
        if (shareToast) {
            const t = setTimeout(() => setShareToast(false), 2000);
            return () => clearTimeout(t);
        }
    }, [shareToast]);

    // ─── Dispatch XP + record study session on summary ───
    useEffect(() => {
        if (phase === PHASE.SUMMARY && !xpDispatched.current) {
            xpDispatched.current = true;
            feedback.complete();
            // Detect streak earning before dispatching XP (which updates lastActiveDate)
            const today = new Date().toISOString().split('T')[0];
            const wasActiveToday = state.lastActiveDate === today;
            let prevStreakStatus = 'inactive';
            if (!wasActiveToday && state.lastActiveDate && state.currentStreak > 0) {
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                if (state.lastActiveDate === yesterday.toISOString().split('T')[0]) {
                    prevStreakStatus = 'at-risk';
                }
            }
            const xp = calculateXP(quizResults);
            window.dispatchEvent(new Event('freezeXP'));
            dispatch({ type: 'COMPLETE_LESSON', lessonId: lesson.id });
            dispatch({ type: 'MARK_EVENTS_SEEN', eventIds: events.map(e => e.id) });
            dispatch({ type: 'ADD_XP', amount: xp });
            const duration = sessionStartTime.current ? Math.round((Date.now() - sessionStartTime.current) / 1000) : 0;
            setSessionDuration(duration); // eslint-disable-line react-hooks/set-state-in-effect
            dispatch({ type: 'RECORD_STUDY_SESSION', duration, sessionType: 'lesson', questionsAnswered: quizResults.length });
            // Show streak celebration if this is the first activity today
            if (!wasActiveToday) {
                const newStreak = prevStreakStatus === 'at-risk' ? state.currentStreak + 1 : 1;
                setTimeout(() => setStreakCelebration({ previousStatus: prevStreakStatus, newStreak }), 600);
            }
            // Show post-lesson modals for specific lessons
            if (!lesson.chapterId) {
                if (lesson.number === 1) {
                    setTimeout(() => setPostLessonModal('placement'), 1200);
                } else if (lesson.number === 2 || lesson.number === 20) {
                    setTimeout(() => setPostLessonModal('support'), 1200);
                }
            }
        }
    }, [phase, quizResults, lesson.id, lesson.number, lesson.chapterId, dispatch]);

    const handleExit = useCallback(() => {
        setShowExitConfirm(true);
    }, []);

    // Helper: record answer
    const recordAnswer = useCallback((eventId, questionType, score) => {
        lastAnswerScore.current = score;
        const event = getEventById(eventId);
        setQuizResults(prev => [...prev, {
            eventId,
            questionType,
            firstScore: score,
            retryScore: null,
            difficulty: event?.difficulty || 1,
        }]);
        const mappedType = questionType === 'date_input' ? 'date' : questionType;
        dispatch({
            type: 'UPDATE_EVENT_MASTERY',
            eventId,
            questionType: mappedType,
            score,
        });
        // Update spaced repetition schedule
        const schedule = state.srSchedule?.[eventId] || { interval: 0, ease: 2.5, reviewCount: 0 };
        const next = calculateNextReview(schedule, score);
        dispatch({ type: 'UPDATE_SR_SCHEDULE', eventId, ...next });
    }, [dispatch, state.srSchedule]);

    // Helper: wrap onNext to show checkpoint at card boundaries
    const handleNext = useCallback((originalNext, questionEvent, isCardBoundary = false) => {
        if (isCardBoundary) {
            const greenSoFar = quizResults.filter(r => r.firstScore === 'green').length;
            pendingNextAction.current = originalNext;
            setCheckpointData({ label: isCardBoundary, greenCount: greenSoFar });
        } else {
            originalNext();
        }
    }, [quizResults]);

    const dismissCheckpoint = useCallback(() => {
        setCheckpointData(null);
        if (pendingNextAction.current) {
            pendingNextAction.current();
            pendingNextAction.current = null;
        }
    }, []);

    // ════════════════════════════════════════════════════
    // CHECKPOINT INTERSTITIAL (card boundaries)
    // ════════════════════════════════════════════════════
    if (checkpointData) {
        return <CheckpointScreen data={checkpointData} onDismiss={dismissCheckpoint}
            quizResults={quizResults} totalQuestions={totalQuestions}
            eventsCount={events.length} recapPerCard={recapPerCard} />;
    }

    // ════════════════════════════════════════════════════
    // INTRO
    // ════════════════════════════════════════════════════
    if (phase === PHASE.INTRO) {
        const timesCompleted = state.completedLessons[lesson.id] || 0;
        const startLesson = () => {
            if (lesson.periodId && PERIOD_INFO[lesson.periodId]) {
                setPhase(PHASE.PERIOD_INTRO);
            } else {
                setPhase(PHASE.LEARN_CARD);
            }
            setCardIndex(0);
        };

        return (
            <div className="lesson-flow-container animate-fade-in" style={{ position: 'relative' }}>
                {/* Background lesson icon — centered, faint watermark */}
                <div className="pointer-events-none select-none" style={{
                    position: 'absolute', inset: 0, display: 'flex',
                    alignItems: 'center', justifyContent: 'center', opacity: 0.045, zIndex: 0
                }}>
                    <LessonIcon index={lessonIconIndex} size={220} color="var(--color-ink)" />
                </div>
                <div className="flex-shrink-0 pt-3" style={{ position: 'relative', zIndex: 1 }}>
                    <button onClick={onComplete} className="flex items-center gap-1 text-sm"
                        style={{ color: 'var(--color-ink-muted)' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
                        Back
                    </button>
                </div>
                <div className="flex-1 min-h-0 flex flex-col justify-center" style={{ position: 'relative', zIndex: 1 }}>
                    <div className="text-center py-2">
                        <span className="text-xs font-semibold uppercase tracking-widest block mb-1" style={{ color: 'var(--color-ink-faint)' }}>
                            Lesson {lesson.number}
                        </span>
                        <h1 className="lesson-intro-title font-bold mb-1" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ink)' }}>
                            {lesson.title}
                        </h1>
                        <p className="text-sm mb-2" style={{ color: 'var(--color-ink-muted)' }}>
                            {lesson.subtitle}
                        </p>
                        <p className="text-sm italic mb-3" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ink-secondary)' }}>
                            "{lesson.mood}"
                        </p>
                        <p className="text-xs mb-2" style={{ color: 'var(--color-ink-muted)' }}>
                            {events.length} {events.length === 1 ? 'event' : 'events'} · {totalQuestions} questions · ~{Math.max(1, Math.round(totalQuestions / 2))} min
                        </p>
                        {/* Event preview */}
                        {lesson.isLesson0 ? (
                            <div className="flex justify-center gap-2 mt-1 mb-2 flex-wrap">
                                {Object.values(PERIOD_INFO).map((period, i) => (
                                    <div key={i}
                                        className="flex flex-col items-center gap-0.5 px-2.5 py-1.5 rounded-xl animate-fade-in-up"
                                        style={{ backgroundColor: `${period.color}10`, animationDelay: `${i * 0.08}s` }}>
                                        <span className="text-lg">{period.icon}</span>
                                        <span className="text-[10px] font-semibold" style={{ color: period.color }}>{period.title}</span>
                                    </div>
                                ))}
                            </div>
                        ) : events.length > 0 && (
                            <div className="flex flex-col gap-1.5 mt-1 mb-2 text-left">
                                {events.map((event, i) => {
                                    const catConfig = CATEGORY_CONFIG[event.category];
                                    return (
                                        <div key={event.id}
                                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl animate-fade-in-up"
                                            style={{ backgroundColor: catConfig?.bg || 'var(--color-parchment-dark)', border: `1.5px solid ${catConfig?.color || 'var(--color-ink-faint)'}25`, animationDelay: `${i * 0.1}s` }}>
                                            <CategoryIcon category={event.category} size={18} />
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-semibold truncate" style={{ color: 'var(--color-ink)' }}>{event.title}</p>
                                                <p className="text-xs" style={{ color: catConfig?.color || 'var(--color-ink-muted)' }}>{event.date}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                        {timesCompleted > 0 && (
                            <p className="text-xs font-medium mt-1" style={{ color: 'var(--color-success)' }}>
                                ✓ Completed {timesCompleted} {timesCompleted === 1 ? 'time' : 'times'}
                            </p>
                        )}
                    </div>
                </div>
                <div className="flex-shrink-0 pt-3 pb-2" style={{ position: 'relative', zIndex: 1 }}>
                    <Button className="w-full" onClick={startLesson}>
                        {timesCompleted > 0 ? 'Learn Again' : 'Begin Learning'}
                    </Button>
                </div>
            </div>
        );
    }

    // ════════════════════════════════════════════════════
    // PERIOD INTRO
    // ════════════════════════════════════════════════════
    if (phase === PHASE.PERIOD_INTRO) {
        const period = PERIOD_INFO[lesson.periodId];
        if (!period) { setPhase(PHASE.LEARN_CARD); return null; }
        return (
            <div className="lesson-flow-container animate-fade-in">
                <div className="flex-shrink-0 pt-4">
                    <div className="flex items-center justify-between mb-4">
                        <button onClick={onComplete} className="text-sm flex items-center gap-1" style={{ color: 'var(--color-ink-muted)' }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
                            Exit
                        </button>
                        <span className="text-xs uppercase tracking-widest font-bold px-2.5 py-1 rounded-full"
                            style={{ backgroundColor: `${period.color}15`, color: period.color }}>
                            Period Overview
                        </span>
                    </div>
                </div>
                <div className="flex-1 min-h-0 overflow-y-auto">
                    <div className="animate-slide-in-right">
                        <Card className="era-card-content" style={{ borderLeft: `4px solid ${period.color}` }}>
                            <div className="text-center mb-2 sm:mb-4"><span className="era-card-icon"><EraIcon type={period.iconType} size={42} /></span></div>
                            <h2 className="era-card-title font-bold text-center mb-1" style={{ fontFamily: 'var(--font-serif)' }}>{period.title}</h2>
                            <p className="text-sm font-semibold text-center mb-2 sm:mb-4" style={{ color: period.color }}>{period.subtitle}</p>
                            <Divider />
                            <ExpandableText lines={3} className="text-sm leading-relaxed mt-4" style={{ color: 'var(--color-ink-secondary)' }}>
                                <strong style={{ color: 'var(--color-ink)' }}>{period.keywords}</strong><span className="keyword-sep" aria-hidden="true" />{period.description}
                            </ExpandableText>
                            {(() => {
                                const boundary = ERA_BOUNDARY_EVENTS[lesson.periodId];
                                if (!boundary) return null;
                                const startEvt = boundary.startEventId ? getEventById(boundary.startEventId) : null;
                                const endEvt = boundary.endEventId ? getEventById(boundary.endEventId) : null;
                                return (
                                    <div className="mt-4 pt-3" style={{ borderTop: '1px solid rgba(var(--color-ink-rgb), 0.06)' }}>
                                        <p className="text-[11px] uppercase tracking-wider font-semibold mb-2" style={{ color: 'var(--color-ink-faint)' }}>
                                            Key Transitions
                                        </p>
                                        {startEvt && (
                                            <div className="flex items-start gap-2 text-xs py-1">
                                                <span className="flex-shrink-0 mt-0.5" style={{ color: 'var(--color-success)' }}>▶</span>
                                                <div>
                                                    <span className="font-semibold" style={{ color: 'var(--color-ink)' }}>Begins with: </span>
                                                    <span style={{ color: 'var(--color-ink-secondary)' }}>{startEvt.title}</span>
                                                    <span className="ml-1 font-medium" style={{ color: 'var(--color-burgundy)' }}>({startEvt.date})</span>
                                                </div>
                                            </div>
                                        )}
                                        {endEvt && (
                                            <div className="flex items-start gap-2 text-xs py-1">
                                                <span className="flex-shrink-0 mt-0.5" style={{ color: 'var(--color-error)' }}>■</span>
                                                <div>
                                                    <span className="font-semibold" style={{ color: 'var(--color-ink)' }}>Ends with: </span>
                                                    <span style={{ color: 'var(--color-ink-secondary)' }}>{endEvt.title}</span>
                                                    <span className="ml-1 font-medium" style={{ color: 'var(--color-burgundy)' }}>({endEvt.date})</span>
                                                </div>
                                            </div>
                                        )}
                                        {!endEvt && (
                                            <div className="flex items-start gap-2 text-xs py-1">
                                                <span className="flex-shrink-0 mt-0.5" style={{ color: 'var(--color-ink-faint)' }}>■</span>
                                                <span className="italic" style={{ color: 'var(--color-ink-faint)' }}>Ongoing — the era we live in</span>
                                            </div>
                                        )}
                                    </div>
                                );
                            })()}
                        </Card>
                    </div>
                </div>
                <div className="flex-shrink-0 pt-4 pb-2">
                    <Button className="w-full" onClick={() => setPhase(PHASE.LEARN_CARD)}>Begin Events →</Button>
                </div>
            </div>
        );
    }

    // ════════════════════════════════════════════════════
    // LEARN CARD — show study card
    // ════════════════════════════════════════════════════
    if (phase === PHASE.LEARN_CARD) {
        const event = events[cardIndex];
        if (!event) {
            setPhase(PHASE.RECAP_TRANSITION);
            return null;
        }

        const nearbyEvents = getNearbyEvents(event);

        return (
            <>
            <ExitConfirmModal show={showExitConfirm} onConfirm={onComplete} onCancel={() => setShowExitConfirm(false)} />
            <div className="lesson-flow-container animate-fade-in">
                <div className="flex-shrink-0 pt-4">
                    <div className="flex items-center justify-center mb-3 relative">
                        <button onClick={handleExit} className="text-sm flex items-center gap-1 absolute left-0" style={{ color: 'var(--color-ink-muted)' }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
                            Exit
                        </button>
                        <span className="text-xs uppercase tracking-widest font-bold px-2.5 py-1 rounded-full"
                            style={{ backgroundColor: 'var(--color-burgundy-soft)', color: 'var(--color-burgundy)' }}>
                            📖 Study · {cardIndex + 1}/{events.length}
                        </span>
                    </div>

                    <ProgressTimeline
                        quizResults={quizResults}
                        totalQuestions={totalQuestions}
                        eventsCount={events.length}
                        recapPerCard={recapPerCard}
                        currentQuestionIndex={cardIndex * 2}
                        variant="header"
                    />
                </div>

                <div className="flex-1 min-h-0 overflow-y-auto mt-4" key={event.id}>
                    <div className="animate-slide-in-right">
                        <Card>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <CategoryTag category={event.category} />
                                    <ImportanceTag importance={event.importance} />
                                </div>
                                <div className="relative">
                                    <StarButton
                                        isStarred={(state.starredEvents || []).includes(event.id)}
                                        onClick={() => dispatch({ type: 'TOGGLE_STAR', eventId: event.id })}
                                    />
                                    {lesson.id === 'lesson-1' && cardIndex === 0 && !state.hasSeenFavoriteTip && (
                                        <div className="absolute right-0 top-full mt-1 w-56 z-50 animate-fade-in">
                                            <div className="rounded-xl p-3 text-xs leading-relaxed"
                                                style={{
                                                    backgroundColor: 'var(--color-card)',
                                                    boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                                                    border: '1px solid rgba(139, 65, 87, 0.15)',
                                                    color: 'var(--color-ink-secondary)',
                                                }}>
                                                <div className="absolute -top-1.5 right-4 w-3 h-3 rotate-45"
                                                    style={{ backgroundColor: 'var(--color-card)', borderTop: '1px solid rgba(139, 65, 87, 0.15)', borderLeft: '1px solid rgba(139, 65, 87, 0.15)' }} />
                                                <p><strong style={{ color: 'var(--color-ink)' }}>Tap the star</strong> to save events to your favorites. You can practice them anytime in the <strong style={{ color: 'var(--color-burgundy)' }}>Practice</strong> tab.</p>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); dispatch({ type: 'DISMISS_FAVORITE_TIP' }); }}
                                                    className="mt-2 text-xs font-semibold"
                                                    style={{ color: 'var(--color-burgundy)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                                                    Got it
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <h2 className="text-xl font-bold mt-3 mb-2 leading-snug" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ink)' }}>
                                {event.title}
                            </h2>
                            <p className="text-lg font-semibold mb-3" style={{ color: 'var(--color-burgundy)' }}>
                                {event.date}
                            </p>
                            {(() => {
                                const boundaryInfo = getEraBoundaryInfo(event.id);
                                if (!boundaryInfo) return null;
                                const eraIcons = { prehistory: '🦴', ancient: '🏛️', medieval: '⚔️', earlymodern: '🧭', modern: '🌍' };
                                return boundaryInfo.map((b, i) => (
                                    <div key={i} className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg mb-3"
                                        style={{
                                            backgroundColor: b.type === 'start' ? 'rgba(5, 150, 105, 0.08)' : 'rgba(166, 61, 61, 0.08)',
                                            color: b.type === 'start' ? 'var(--color-success)' : 'var(--color-error)',
                                        }}>
                                        <span>{eraIcons[b.eraId] || '📌'}</span>
                                        <span>Marks the {b.type === 'start' ? 'start' : 'end'} of the {b.eraLabel} era</span>
                                    </div>
                                ));
                            })()}
                            <ExpandableText lines={3} className="text-sm leading-relaxed mb-4" style={{ color: 'var(--color-ink-secondary)' }}>
                                {event.keywords && <><strong style={{ color: 'var(--color-ink)' }}>{event.keywords}</strong><span className="keyword-sep" aria-hidden="true" /></>}{event.description}
                            </ExpandableText>
                            <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--color-ink-muted)' }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                                </svg>
                                {event.location.place}
                                {event.location.region && !event.location.place.includes(event.location.region) && (
                                    <span style={{ color: 'var(--color-ink-faint)' }}>· {event.location.region}</span>
                                )}
                            </div>

                            {nearbyEvents.length > 0 && (
                                <div className="mt-4 pt-3" style={{ borderTop: '1px solid rgba(var(--color-ink-rgb), 0.06)' }}>
                                    <p className="text-[11px] uppercase tracking-wider font-semibold mb-2" style={{ color: 'var(--color-ink-faint)' }}>
                                        Before & After
                                    </p>
                                    {nearbyEvents.map(ne => (
                                        <div key={ne.id} className="flex items-center gap-2 text-xs py-1" style={{ color: 'var(--color-ink-muted)' }}>
                                            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: CATEGORY_CONFIG[ne.category]?.color || '#999' }} />
                                            <span>{ne.date}</span>
                                            <span>—</span>
                                            <span className="font-medium">{ne.title}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <EventConnections eventId={event.id} showAll={true} />
                        </Card>
                    </div>
                </div>

                <div className="flex-shrink-0 flex gap-3 pt-4 pb-2">
                    {cardIndex > 0 && (
                        <Button variant="secondary" onClick={() => {
                            setCardIndex(i => i - 1);
                            setLearnQuizIndex(0);
                        }}>← Back</Button>
                    )}
                    <Button className="flex-1" onClick={() => {
                        setLearnQuizIndex(0);
                        setPhase(PHASE.LEARN_QUIZ);
                    }}>
                        Quiz Me →
                    </Button>
                </div>
            </div>
            </>
        );
    }

    // ════════════════════════════════════════════════════
    // LEARN QUIZ — 2 MCQ questions per card
    // ════════════════════════════════════════════════════
    if (phase === PHASE.LEARN_QUIZ) {
        const q = currentCardLearnQs[learnQuizIndex];
        if (!q) {
            const next = cardIndex + 1;
            if (next < events.length) {
                setCardIndex(next);
                setLearnQuizIndex(0);
                setPhase(PHASE.LEARN_CARD);
            } else if (recapPerCard > 0) {
                setPhase(PHASE.RECAP_TRANSITION);
            } else {
                // No recap — skip straight to summary
                setPhase(PHASE.SUMMARY);
            }
            return null;
        }

        const isLastOfCard = learnQuizIndex === currentCardLearnQs.length - 1;

        return (
            <>
            <ExitConfirmModal show={showExitConfirm} onConfirm={onComplete} onCancel={() => setShowExitConfirm(false)} />
            <div className="lesson-flow-container">
                <div className="flex-shrink-0 pt-4">
                    <div className="flex items-center justify-center mb-2 relative">
                        <button onClick={handleExit} className="text-sm flex items-center gap-1 absolute left-0"
                            style={{ color: 'var(--color-ink-muted)' }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
                            Exit
                        </button>
                        <span className="text-xs uppercase tracking-widest font-bold px-2.5 py-1 rounded-full"
                            style={{ backgroundColor: 'var(--color-burgundy-soft)', color: 'var(--color-burgundy)' }}>
                            📝 Learn Quiz · {answeredCount + 1}/{totalQuestions}
                        </span>
                    </div>
                    <ProgressTimeline
                        quizResults={quizResults}
                        totalQuestions={totalQuestions}
                        eventsCount={events.length}
                        recapPerCard={recapPerCard}
                        currentQuestionIndex={answeredCount}
                        variant="header"
                    />
                </div>

                <div className="flex-1 min-h-0 overflow-y-auto mt-4" key={`learn-q-${cardIndex}-${learnQuizIndex}`}>
                    <QuizQuestion
                        question={q}
                        lessonEventIds={lesson.eventIds}
                        descriptionDifficulty={1}
                        onAnswer={(score) => recordAnswer(q.event.id, q.type, score)}
                        onNext={() => handleNext(
                            () => setLearnQuizIndex(i => i + 1),
                            q.event,
                            isLastOfCard ? `Card ${cardIndex + 1} of ${events.length} complete` : false
                        )}
                        onBack={learnQuizIndex > 0 ? () => setLearnQuizIndex(i => i - 1) : null}
                    />
                </div>
            </div>
            </>
        );
    }

    // ════════════════════════════════════════════════════
    // RECAP TRANSITION — animation between learn and recap
    // ════════════════════════════════════════════════════
    if (phase === PHASE.RECAP_TRANSITION) {
        return (
            <div className="lesson-flow-container animate-fade-in">
                <div className="flex-1 min-h-0 overflow-y-auto">
                    <div className="text-center py-6">
                        <div className="animate-recap-pulse">
                            <Mascot mood="thinking" size={72} />
                        </div>
                        <h2 className="text-2xl font-bold mt-6 mb-2" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ink)' }}>
                            Time to Recap
                        </h2>
                        <p className="text-sm mb-1" style={{ color: 'var(--color-ink-muted)' }}>
                            Now let's see how well you remember everything
                        </p>
                        <p className="text-xs mb-6" style={{ color: 'var(--color-ink-faint)' }}>
                            {recapQuestions.length} {recapQuestions.length === 1 ? 'question' : 'questions'}{recapPerCard === 2 ? ' — including typing exact dates' : ''}
                        </p>
                        <div className="flex flex-col gap-1.5 mt-1 mb-4 text-left mx-auto" style={{ maxWidth: 320 }}>
                            {events.map((e, i) => {
                                const catConfig = CATEGORY_CONFIG[e.category];
                                return (
                                    <div key={e.id}
                                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl animate-fade-in-up"
                                        style={{ backgroundColor: catConfig?.bg || 'var(--color-parchment-dark)', border: `1.5px solid ${catConfig?.color || 'var(--color-ink-faint)'}25`, animationDelay: `${i * 0.1}s` }}>
                                        <CategoryIcon category={e.category} size={18} />
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-semibold truncate" style={{ color: 'var(--color-ink)' }}>{e.title}</p>
                                            <p className="text-xs" style={{ color: catConfig?.color || 'var(--color-ink-muted)' }}>{e.date}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
                <div className="flex-shrink-0 pt-4 pb-2">
                    <Button className="w-full" onClick={() => {
                        setRecapIndex(0);
                        setPhase(PHASE.RECAP);
                    }}>
                        Start Recap →
                    </Button>
                </div>
            </div>
        );
    }

    // ════════════════════════════════════════════════════
    // RECAP — 3 remaining MCQs + 3 date free-inputs (shuffled)
    // ════════════════════════════════════════════════════
    if (phase === PHASE.RECAP) {
        const q = recapQuestions[recapIndex];
        if (!q) {
            if (hardResults.length > 0) {
                setReviewIndex(0);
                setPhase(PHASE.FINAL_REVIEW);
            } else {
                setPhase(PHASE.SUMMARY);
            }
            return null;
        }

        // Show recap checkpoint every 3 questions (when recapPerCard=2, i.e. 6 total recap Qs)
        const recapGroupSize = recapPerCard === 2 ? 3 : recapQuestions.length;
        const isRecapBoundary = recapGroupSize > 0
            && (recapIndex + 1) % recapGroupSize === 0
            && recapIndex < recapQuestions.length - 1;
        const recapBoundaryLabel = isRecapBoundary
            ? `Recap ${recapIndex + 1}/${recapQuestions.length}`
            : false;

        return (
            <>
            <ExitConfirmModal show={showExitConfirm} onConfirm={onComplete} onCancel={() => setShowExitConfirm(false)} />
            <div className="lesson-flow-container">
                <div className="flex-shrink-0 pt-4">
                    <div className="flex items-center justify-center mb-2 relative">
                        <button onClick={handleExit} className="text-sm flex items-center gap-1 absolute left-0"
                            style={{ color: 'var(--color-ink-muted)' }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
                            Exit
                        </button>
                        <span className="text-xs uppercase tracking-widest font-bold px-2.5 py-1 rounded-full"
                            style={{ backgroundColor: 'rgba(139, 65, 87, 0.15)', color: 'var(--color-burgundy)' }}>
                            🔁 Recap · {answeredCount + 1}/{totalQuestions}
                        </span>
                    </div>
                    <ProgressTimeline
                        quizResults={quizResults}
                        totalQuestions={totalQuestions}
                        eventsCount={events.length}
                        recapPerCard={recapPerCard}
                        currentQuestionIndex={answeredCount}
                        variant="header"
                    />
                </div>

                <div className="flex-1 min-h-0 overflow-y-auto mt-4" key={`recap-${recapIndex}`}>
                    {q.isDateInput ? (
                        <DateInputQuestion
                            event={q.event}
                            onAnswer={(score) => recordAnswer(q.event.id, 'date_input', score)}
                            onNext={() => handleNext(() => setRecapIndex(i => i + 1), q.event, recapBoundaryLabel)}
                            onBack={recapIndex > 0 ? () => setRecapIndex(i => i - 1) : null}
                            onSkip={() => setRecapIndex(i => i + 1)}
                        />
                    ) : (
                        <QuizQuestion
                            question={q}
                            lessonEventIds={lesson.eventIds}
                            descriptionDifficulty={2}
                            onAnswer={(score) => recordAnswer(q.event.id, q.type, score)}
                            onNext={() => handleNext(() => setRecapIndex(i => i + 1), q.event, recapBoundaryLabel)}
                            onBack={recapIndex > 0 ? () => setRecapIndex(i => i - 1) : null}
                            onSkip={() => setRecapIndex(i => i + 1)}
                        />
                    )}
                </div>
            </div>
            </>
        );
    }

    // ════════════════════════════════════════════════════
    // FINAL REVIEW
    // ════════════════════════════════════════════════════
    if (phase === PHASE.FINAL_REVIEW) {
        const hardEvents = [...new Set(hardResults.map(r => r.eventId))]
            .map(id => events.find(e => e.id === id))
            .filter(Boolean);

        if (reviewIndex < hardEvents.length) {
            const event = hardEvents[reviewIndex];
            const eventResults = hardResults.filter(r => r.eventId === event.id);
            const worstScore = eventResults.some(r => r.firstScore === 'red') ? 'red' : 'yellow';
            const borderColor = worstScore === 'red' ? 'var(--color-error)' : 'var(--color-warning)';

            return (
                <div className="lesson-flow-container animate-fade-in">
                    <div className="flex-shrink-0 text-center mb-4 pt-4">
                        <Mascot mood={worstScore === 'red' ? 'surprised' : 'thinking'} size={50} />
                        <p className="text-sm font-semibold mt-2" style={{ color: borderColor }}>
                            {worstScore === 'red' ? "Let's review this one" : "Almost had it"}
                        </p>
                        <span className="text-xs" style={{ color: 'var(--color-ink-muted)' }}>
                            Review {reviewIndex + 1} of {hardEvents.length}
                        </span>
                    </div>
                    <div className="flex-1 min-h-0 overflow-y-auto">
                        <Card className="animate-slide-in-right" style={{ borderLeft: `3px solid ${borderColor}` }}>
                            <CategoryTag category={event.category} />
                            <h2 className="text-xl font-bold mt-3 mb-2" style={{ fontFamily: 'var(--font-serif)' }}>{event.title}</h2>
                            <p className="text-lg font-semibold mb-3" style={{ color: 'var(--color-burgundy)' }}>{event.date}</p>
                            <ExpandableText lines={3} className="text-sm leading-relaxed mb-3" style={{ color: 'var(--color-ink-secondary)' }}>
                                {event.keywords && <><strong style={{ color: 'var(--color-ink)' }}>{event.keywords}</strong><span className="keyword-sep" aria-hidden="true" /></>}{event.description}
                            </ExpandableText>
                            <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--color-ink-muted)' }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                                </svg>
                                {event.location.place}
                            </div>
                        </Card>
                    </div>
                    <div className="flex-shrink-0 flex gap-3 pt-4 pb-2">
                        {reviewIndex > 0 && (
                            <Button variant="secondary" onClick={() => setReviewIndex(i => i - 1)}>← Back</Button>
                        )}
                        <Button className="flex-1" onClick={() => setReviewIndex(i => i + 1)}>
                            {reviewIndex < hardEvents.length - 1 ? 'Next Review →' : 'See Results →'}
                        </Button>
                    </div>
                </div>
            );
        }

        setPhase(PHASE.SUMMARY);
        return null;
    }

    // ════════════════════════════════════════════════════
    // SUMMARY — XP + Streak
    // ════════════════════════════════════════════════════
    if (phase === PHASE.SUMMARY) {
        const xp = calculateXP(quizResults);
        const greenCount = quizResults.filter(r => r.firstScore === 'green').length;
        const yellowCount = quizResults.filter(r => r.firstScore === 'yellow').length;
        const redCount = quizResults.filter(r => r.firstScore === 'red').length;
        const allPassed = redCount === 0 || quizResults.every(r =>
            r.firstScore !== 'red' || (r.retryScore && r.retryScore !== 'red')
        );
        const streak = state.currentStreak;
        const sessionMin = Math.floor(sessionDuration / 60);
        const sessionSec = sessionDuration % 60;
        const sessionTimeStr = sessionMin > 0 ? `${sessionMin}m ${sessionSec}s` : `${sessionSec}s`;

        return (
            <div className="lesson-flow-container animate-fade-in">
                <div className="flex-1 min-h-0 overflow-y-auto">
                    <div className="text-center pt-8 pb-4 relative">
                        {/* Faint lesson icon behind title */}
                        <div className="absolute inset-x-0 flex justify-center pointer-events-none select-none" style={{ opacity: 0.06, top: '88px' }}>
                            <LessonIcon index={lessonIconIndex} size={120} color="var(--color-ink)" />
                        </div>
                        <Mascot mood={allPassed ? 'celebrating' : 'thinking'} size={64} />
                        <h2 className="text-2xl font-bold mt-2 mb-0.5" style={{ fontFamily: 'var(--font-serif)' }}>
                            {allPassed ? 'Lesson Complete!' : 'Keep Practicing'}
                        </h2>
                        <p className="text-sm mb-3" style={{ color: 'var(--color-ink-muted)' }}>{lesson.title}</p>

                        <Card className={allPassed ? 'animate-celebration' : ''} style={{
                            borderTop: allPassed ? '3px solid var(--color-success)' : '3px solid var(--color-warning)',
                        }}>
                            <div className="text-sm font-semibold mb-2" style={{ color: 'var(--color-ink-secondary)' }}>
                                {events.length} events · {quizResults.length} questions · {sessionTimeStr}
                            </div>

                            <div className="flex items-center gap-1 mb-3 justify-center flex-wrap">
                                {quizResults.map((r, i) => (
                                    <button key={i}
                                        className="w-3 h-3 rounded-full result-dot-btn animate-dot-stagger"
                                        title={`${events.find(e => e.id === r.eventId)?.title || 'Event'} — ${r.questionType}`}
                                        onClick={() => setSelectedDot(r)}
                                        style={{
                                            animationDelay: `${i * 40}ms`,
                                            backgroundColor: r.firstScore === 'green' ? 'var(--color-success)' :
                                                r.firstScore === 'yellow' ? 'var(--color-warning)' : 'var(--color-error)'
                                        }} />
                                ))}
                            </div>

                            <div className="grid grid-cols-3 gap-3 text-center mb-3">
                                <div className="animate-scale-in" style={{ animationDelay: '200ms' }}>
                                    <div className="text-lg font-bold" style={{ color: 'var(--color-success)' }}>{greenCount}</div>
                                    <div className="text-xs" style={{ color: 'var(--color-ink-muted)' }}>Exact</div>
                                </div>
                                <div className="animate-scale-in" style={{ animationDelay: '300ms' }}>
                                    <div className="text-lg font-bold" style={{ color: 'var(--color-warning)' }}>{yellowCount}</div>
                                    <div className="text-xs" style={{ color: 'var(--color-ink-muted)' }}>Close</div>
                                </div>
                                <div className="animate-scale-in" style={{ animationDelay: '400ms' }}>
                                    <div className="text-lg font-bold" style={{ color: 'var(--color-error)' }}>{redCount}</div>
                                    <div className="text-xs" style={{ color: 'var(--color-ink-muted)' }}>Missed</div>
                                </div>
                            </div>

                            <Divider />

                            <div className="flex items-center justify-center gap-6 mt-3">
                                <div id="xp-earned-display" className="flex items-center gap-2 animate-xp-pop" style={{ animationDelay: '500ms' }}>
                                    <svg className="animate-xp-glow" style={{ animationDelay: '700ms' }} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-bronze)" strokeWidth="2">
                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="var(--color-bronze-light)" />
                                    </svg>
                                    <div className="text-left">
                                        <AnimatedCounter value={xp} prefix="+" duration={600} delay={1050} className="text-xl font-bold leading-none" style={{ color: 'var(--color-burgundy)' }} />
                                        <div className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--color-ink-faint)' }}>XP earned</div>
                                    </div>
                                </div>
                                <div className="w-px h-10" style={{ backgroundColor: 'rgba(var(--color-ink-rgb), 0.08)' }} />
                                <div className="flex items-center gap-2 animate-scale-in" style={{ animationDelay: '600ms' }}>
                                    <span className={streak > 1 ? 'animate-streak-bounce' : undefined} style={{ animationDelay: '900ms', animationFillMode: 'backwards' }}>
                                        <StreakFlame status="active" size={28} />
                                    </span>
                                    <div className="text-left">
                                        <AnimatedCounter value={streak} duration={400} delay={800} className="text-xl font-bold leading-none" style={{ color: 'var(--color-burgundy)' }} />
                                        <div className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--color-ink-faint)' }}>Day streak</div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>

                <div className="flex-shrink-0 pt-4 pb-2 space-y-2">
                    <Button className="w-full" onClick={async () => {
                        const el = document.getElementById('xp-earned-display');
                        if (el) await flyXPToStar(el, xp);
                        window.dispatchEvent(new Event('unfreezeXP'));
                        onComplete();
                    }}>Continue</Button>
                    <button
                        onClick={async () => {
                            const text = buildLessonShareText({
                                lessonTitle: lesson.title, greenCount,
                                totalQuestions: quizResults.length, xp, streak,
                            });
                            const result = await shareText({ title: 'Chronos', text });
                            if (result === 'copied') setShareToast(true);
                        }}
                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer"
                        style={{ color: 'var(--color-burgundy)', backgroundColor: 'rgba(139, 65, 87, 0.08)' }}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                            <polyline points="16 6 12 2 8 6" />
                            <line x1="12" y1="2" x2="12" y2="15" />
                        </svg>
                        Share Result
                    </button>
                    {shareToast && (
                        <p className="text-xs text-center animate-fade-in" style={{ color: 'var(--color-success)' }}>
                            Copied to clipboard!
                        </p>
                    )}
                </div>

                {/* Result Dot Modal */}
                {selectedDot && (() => {
                    const evt = events.find(e => e.id === selectedDot.eventId);
                    if (!evt) return null;
                    const qType = selectedDot.questionType;
                    const dotColor = selectedDot.firstScore === 'green' ? 'var(--color-success)'
                        : selectedDot.firstScore === 'yellow' ? 'var(--color-warning)' : 'var(--color-error)';
                    const isTarget = selectedDot.firstScore !== 'green';
                    const hlBg = isTarget ? 'var(--color-warning-light)' : 'rgba(5, 150, 105, 0.12)';
                    const hlColor = isTarget ? 'var(--color-warning)' : 'var(--color-success)';
                    return (
                        <div className="dot-modal-backdrop" onClick={() => setSelectedDot(null)}>
                            <div className="dot-modal-content" onClick={e => e.stopPropagation()}>
                                <Card style={{ borderLeft: `3px solid ${dotColor}` }}>
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-xs uppercase tracking-widest font-bold px-2.5 py-1 rounded-full"
                                            style={{ backgroundColor: hlBg, color: dotColor }}>
                                            {qType === 'date' || qType === 'date_input' ? '📅 Date Question'
                                                : qType === 'location' ? '📍 Location Question'
                                                    : qType === 'description' ? '📝 Event Description' : '❓ What Happened'}
                                        </span>
                                        <button onClick={() => setSelectedDot(null)}
                                            className="w-7 h-7 rounded-full flex items-center justify-center text-sm"
                                            style={{ color: 'var(--color-ink-muted)', backgroundColor: 'rgba(var(--color-ink-rgb), 0.05)' }}>✕</button>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <CategoryTag category={evt.category} />
                                        <StarButton
                                            isStarred={(state.starredEvents || []).includes(evt.id)}
                                            onClick={() => dispatch({ type: 'TOGGLE_STAR', eventId: evt.id })}
                                        />
                                    </div>
                                    <div className="mb-2">
                                        <h2 className={`text-xl font-bold leading-snug ${qType === 'what' ? 'dot-highlight' : ''}`}
                                            style={{ fontFamily: 'var(--font-serif)', ...(qType === 'what' ? { backgroundColor: hlBg, color: hlColor } : { color: 'var(--color-ink)' }) }}>
                                            {evt.title}
                                        </h2>
                                    </div>
                                    <div className="mb-3">
                                        <p className={`text-lg font-semibold ${qType === 'date' || qType === 'date_input' ? 'dot-highlight' : ''}`}
                                            style={{ ...(qType === 'date' || qType === 'date_input' ? { backgroundColor: hlBg, color: hlColor } : { color: 'var(--color-burgundy)' }) }}>
                                            {evt.date}
                                        </p>
                                    </div>
                                    <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--color-ink-secondary)' }}>
                                        {evt.description}
                                    </p>
                                    <div className="mt-3">
                                        <div className={`flex items-center gap-2 text-xs w-max ${qType === 'location' ? 'dot-highlight' : ''}`} style={{ ...(qType === 'location' ? { backgroundColor: hlBg, color: hlColor } : { color: 'var(--color-ink-muted)' }) }}>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="flex-shrink-0">
                                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                                            </svg>
                                            <span className="truncate">{evt.location.place}
                                                {evt.location.region && !evt.location.place.includes(evt.location.region) && (
                                                    <span style={qType === 'location' ? { color: hlColor, opacity: 0.8, marginLeft: 4 } : { color: 'var(--color-ink-faint)', marginLeft: 4 }}>· {evt.location.region}</span>
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    );
                })()}

                {/* Placement Quiz Prompt Modal (after lesson 1) */}
                {postLessonModal === 'placement' && (
                    <div className="dot-modal-backdrop" onClick={() => setPostLessonModal(null)}>
                        <div className="dot-modal-content" onClick={e => e.stopPropagation()}>
                            <Card>
                                <div className="flex items-start justify-between mb-3">
                                    <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                                        style={{ backgroundColor: 'rgba(139, 65, 87, 0.1)' }}>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-burgundy)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" />
                                        </svg>
                                    </div>
                                    <button onClick={() => setPostLessonModal(null)}
                                        className="w-7 h-7 rounded-full flex items-center justify-center text-sm"
                                        style={{ color: 'var(--color-ink-muted)', backgroundColor: 'rgba(var(--color-ink-rgb), 0.05)' }}>✕</button>
                                </div>
                                <h3 className="text-base font-bold mb-1" style={{ fontFamily: 'var(--font-serif)' }}>Already know some history?</h3>
                                <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--color-ink-secondary)' }}>
                                    Placement quizzes in <strong>Settings</strong> let you skip lessons you already know — though we encourage completing each lesson first, they go fast!
                                </p>
                                <Button className="w-full" onClick={() => setPostLessonModal(null)}>Got it</Button>
                            </Card>
                        </div>
                    </div>
                )}

                {/* Streak Celebration */}
                {streakCelebration && (
                    <StreakCelebration
                        previousStatus={streakCelebration.previousStatus}
                        newStreak={streakCelebration.newStreak}
                        onDismiss={() => setStreakCelebration(null)}
                    />
                )}

                {/* Support Modal (after lessons 2 and 20) */}
                {postLessonModal === 'support' && (
                    <div className="dot-modal-backdrop" onClick={() => setPostLessonModal(null)}>
                        <div className="dot-modal-content" onClick={e => e.stopPropagation()}>
                            <Card>
                                <div className="flex items-start justify-between mb-3">
                                    <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                                        style={{ backgroundColor: 'rgba(139, 65, 87, 0.1)' }}>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-burgundy)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                        </svg>
                                    </div>
                                    <button onClick={() => setPostLessonModal(null)}
                                        className="w-7 h-7 rounded-full flex items-center justify-center text-sm"
                                        style={{ color: 'var(--color-ink-muted)', backgroundColor: 'rgba(var(--color-ink-rgb), 0.05)' }}>✕</button>
                                </div>
                                <h3 className="text-base font-bold mb-1" style={{ fontFamily: 'var(--font-serif)' }}>Enjoying Chronos?</h3>
                                <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--color-ink-secondary)' }}>
                                    If you're finding it useful, consider supporting the app!
                                </p>
                                <div className="flex gap-2 mb-3">
                                    <button
                                        onClick={() => window.open('https://buymeacoffee.com/elsadonnat0', '_blank')}
                                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-medium"
                                        style={{ color: '#92400E', backgroundColor: 'rgba(201, 169, 110, 0.15)', border: '1px solid rgba(201, 169, 110, 0.25)' }}
                                    >
                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M18 8h1a4 4 0 0 1 0 8h-1" /><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" /><line x1="6" y1="1" x2="6" y2="4" /><line x1="10" y1="1" x2="10" y2="4" /><line x1="14" y1="1" x2="14" y2="4" />
                                        </svg>
                                        Buy me a coffee
                                    </button>
                                    <button
                                        onClick={() => window.open('https://play.google.com/store/apps/details?id=com.elsadonnat.chronos', '_blank')}
                                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-medium"
                                        style={{ color: 'var(--color-ink-secondary)', backgroundColor: 'rgba(var(--color-ink-rgb), 0.05)', border: '1px solid rgba(var(--color-ink-rgb), 0.1)' }}
                                    >
                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                        </svg>
                                        Rate the app
                                    </button>
                                </div>
                                <button onClick={() => setPostLessonModal(null)}
                                    className="w-full py-2 text-sm text-center"
                                    style={{ color: 'var(--color-ink-faint)' }}>Maybe later</button>
                            </Card>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return null;
}

function ExitConfirmModal({ show, onConfirm, onCancel }) {
    if (!show) return null;
    return (
        <ConfirmModal
            title="Leave lesson?"
            message="Progress in this lesson will be lost."
            confirmLabel="Leave"
            cancelLabel="Stay"
            danger
            onConfirm={onConfirm}
            onCancel={onCancel}
        />
    );
}

// ═══════════════════════════════════════════════════════
// MCQ QUIZ QUESTION (for location, date MCQ, what)
// ═══════════════════════════════════════════════════════
function QuizQuestion({ question, lessonEventIds, onAnswer, onNext, onBack, onSkip, descriptionDifficulty = null }) {
    const { event, type } = question;
    const [answered, setAnswered] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [score, setScore] = useState(null);

    // MCQ options (memoized once)
    const [locationOptions] = useState(() => generateLocationOptions(event));
    const [whatOptions] = useState(() => generateWhatOptions(event, lessonEventIds));
    const [dateOptions] = useState(() => generateDateMCQOptions(event));
    const [descriptionOptions] = useState(() => generateDescriptionOptions(event, ALL_EVENTS, descriptionDifficulty));
    const handleAnswer = useCallback((answer, correct) => {
        if (answered) return;
        feedback.select();
        setSelectedAnswer(answer);
        const s = answer === correct ? 'green' : 'red';
        setScore(s);
        setAnswered(true);
        onAnswer(s);
        feedback.forScore(s);
    }, [answered, onAnswer]);

    const renderButtons = () => {
        if (answered) {
            return (
                <div className="pinned-footer flex gap-3">
                    {onBack && <Button variant="secondary" onClick={onBack}>← Back</Button>}
                    <Button className="flex-1" onClick={onNext}>Continue →</Button>
                </div>
            );
        }
        if (onSkip || onBack) {
            return (
                <div className="pinned-footer flex gap-3">
                    {onBack && <Button variant="secondary" onClick={onBack}>← Back</Button>}
                    {onSkip && <Button className="flex-1" variant="secondary" onClick={onSkip}>Skip</Button>}
                </div>
            );
        }
        return null;
    };

    // ─ LOCATION MCQ ─
    if (type === 'location') {
        return (
            <div className="animate-slide-in-right">
                <Card style={answered && score ? { backgroundColor: SCORE_COLORS[score].bg, borderLeft: `3px solid ${SCORE_COLORS[score].border}` } : {}}>
                    <p className="text-xs uppercase tracking-wider font-semibold mb-2" style={{ color: 'var(--color-ink-faint)' }}>Where did this happen?</p>
                    <h3 className="text-xl font-bold mb-1" style={{ fontFamily: 'var(--font-serif)' }}>{event.title}</h3>
                    <p className="text-sm mb-5" style={{ color: 'var(--color-burgundy)' }}>{event.date}</p>
                    <div className="mcq-options mcq-options--grid">
                        {locationOptions.map((opt, i) => {
                            const isCorrect = opt === event.location.place;
                            const isSelected = selectedAnswer === opt;
                            const optEvent = ALL_EVENTS.find(e => e.location.place === opt);
                            const optRegion = optEvent ? optEvent.location.region : '';
                            let optStyle = {};
                            if (answered) {
                                if (isCorrect) optStyle = { backgroundColor: 'rgba(5, 150, 105, 0.1)', borderColor: 'var(--color-success)' };
                                else if (isSelected && !isCorrect) optStyle = { backgroundColor: 'rgba(166, 61, 61, 0.1)', borderColor: 'var(--color-error)' };
                            }
                            return (
                                <button key={i} onClick={() => handleAnswer(opt, event.location.place)} disabled={answered}
                                    className="mcq-option"
                                    style={{ borderColor: isSelected && !answered ? 'var(--color-burgundy)' : undefined, ...optStyle }}>
                                    <span>{opt}</span>
                                    {optRegion && !opt.includes(optRegion) && (
                                        <span className="ml-1 text-xs" style={{ color: 'var(--color-ink-faint)' }}>· {optRegion}</span>
                                    )}
                                    {answered && isCorrect && <span className="ml-2 text-xs" style={{ color: 'var(--color-success)' }}>✓</span>}
                                </button>
                            );
                        })}
                    </div>
                </Card>
                {answered && <ControversyNote note={event.controversyNotes?.location} />}
                {renderButtons()}
            </div>
        );
    }

    // ─ DATE MCQ ─
    if (type === 'date') {
        return (
            <div className="animate-slide-in-right">
                <Card style={answered && score ? { backgroundColor: SCORE_COLORS[score].bg, borderLeft: `3px solid ${SCORE_COLORS[score].border}` } : {}}>
                    <p className="text-xs uppercase tracking-wider font-semibold mb-2" style={{ color: 'var(--color-ink-faint)' }}>When did this happen?</p>
                    <h3 className="text-xl font-bold mb-1" style={{ fontFamily: 'var(--font-serif)' }}>{event.title}</h3>
                    <p className="text-sm mb-2 leading-relaxed" style={{ color: 'var(--color-ink-secondary)' }}>
                        {stripDatesFromDescription(event.description, 80)}
                    </p>
                    <div className="mcq-options mcq-options--grid mt-4">
                        {dateOptions.map((opt, i) => {
                            const isCorrect = opt.isCorrect;
                            const isSelected = selectedAnswer === opt.label;
                            let optStyle = {};
                            if (answered) {
                                if (isCorrect) optStyle = { backgroundColor: 'rgba(5, 150, 105, 0.1)', borderColor: 'var(--color-success)' };
                                else if (isSelected && !isCorrect) optStyle = { backgroundColor: 'rgba(166, 61, 61, 0.1)', borderColor: 'var(--color-error)' };
                            }
                            return (
                                <button key={i}
                                    onClick={() => handleAnswer(opt.label, dateOptions.find(o => o.isCorrect).label)}
                                    disabled={answered}
                                    className="mcq-option font-semibold"
                                    style={{ borderColor: isSelected && !answered ? 'var(--color-burgundy)' : undefined, ...optStyle }}>
                                    {opt.label}
                                    {answered && isCorrect && <span className="ml-2 text-xs" style={{ color: 'var(--color-success)' }}>✓</span>}
                                </button>
                            );
                        })}
                    </div>
                </Card>
                {answered && <ControversyNote note={event.controversyNotes?.date} />}
                {renderButtons()}
            </div>
        );
    }

    // ─ WHAT HAPPENED MCQ ─
    if (type === 'what') {
        return (
            <div className="animate-slide-in-right">
                <Card style={answered && score ? { backgroundColor: SCORE_COLORS[score].bg, borderLeft: `3px solid ${SCORE_COLORS[score].border}` } : {}}>
                    <p className="text-xs uppercase tracking-wider font-semibold mb-2" style={{ color: 'var(--color-ink-faint)' }}>What happened?</p>
                    <p className="text-xl font-semibold mb-1" style={{ color: 'var(--color-burgundy)' }}>{event.date}</p>
                    <p className="text-sm mb-5" style={{ color: 'var(--color-ink-muted)' }}>
                        {event.location.place}
                        {event.location.region && !event.location.place.includes(event.location.region) && ` · ${event.location.region}`}
                    </p>
                    <div className="mcq-options mcq-options--grid">
                        {whatOptions.map((opt, i) => {
                            const isCorrect = opt.id === event.id;
                            const isSelected = selectedAnswer === opt.id;
                            let optStyle = {};
                            if (answered) {
                                if (isCorrect) optStyle = { backgroundColor: 'rgba(5, 150, 105, 0.1)', borderColor: 'var(--color-success)' };
                                else if (isSelected && !isCorrect) optStyle = { backgroundColor: 'rgba(166, 61, 61, 0.1)', borderColor: 'var(--color-error)' };
                            }
                            return (
                                <button key={i} onClick={() => handleAnswer(opt.id, event.id)} disabled={answered}
                                    className="mcq-option"
                                    style={{ borderColor: isSelected && !answered ? 'var(--color-burgundy)' : undefined, ...optStyle }}>
                                    <span className="font-semibold">{opt.title}</span>
                                    {answered && isCorrect && <span className="ml-2 text-xs" style={{ color: 'var(--color-success)' }}>✓</span>}
                                </button>
                            );
                        })}
                    </div>
                </Card>
                {answered && <ControversyNote note={event.controversyNotes?.what} />}
                {renderButtons()}
            </div>
        );
    }

    // ─ DESCRIPTION MCQ ─
    if (type === 'description') {
        return (
            <div className="animate-slide-in-right">
                <Card style={answered && score ? { backgroundColor: SCORE_COLORS[score].bg, borderLeft: `3px solid ${SCORE_COLORS[score].border}` } : {}}>
                    <p className="text-xs uppercase tracking-wider font-semibold mb-2" style={{ color: 'var(--color-ink-faint)' }}>Which description fits?</p>
                    <h3 className="text-xl font-bold mb-1" style={{ fontFamily: 'var(--font-serif)' }}>{event.title}</h3>
                    <p className="text-sm mb-5" style={{ color: 'var(--color-burgundy)' }}>{event.date}</p>
                    <div className="mcq-options">
                        {descriptionOptions.map((opt, i) => {
                            const isCorrect = opt.isCorrect;
                            const isSelected = selectedAnswer === i;
                            let optStyle = {};
                            if (answered) {
                                if (isCorrect) optStyle = { backgroundColor: 'rgba(5, 150, 105, 0.1)', borderColor: 'var(--color-success)' };
                                else if (isSelected && !isCorrect) optStyle = { backgroundColor: 'rgba(166, 61, 61, 0.1)', borderColor: 'var(--color-error)' };
                            }
                            return (
                                <button key={i} onClick={() => handleAnswer(i, descriptionOptions.findIndex(o => o.isCorrect))} disabled={answered}
                                    className="mcq-option"
                                    style={{ borderColor: isSelected && !answered ? 'var(--color-burgundy)' : undefined, ...optStyle }}>
                                    <span className="leading-relaxed text-sm block" style={{ color: 'var(--color-ink-secondary)' }}>{opt.description}</span>
                                    {answered && isCorrect && <span className="ml-2 text-xs font-bold mt-1 block" style={{ color: 'var(--color-success)' }}>✓ Correct</span>}
                                </button>
                            );
                        })}
                    </div>
                </Card>
                {answered && <ControversyNote note={event.controversyNotes?.description} />}
                {renderButtons()}
            </div>
        );
    }

    return null;
}

// ═══════════════════════════════════════════════════════
// PROGRESS TIMELINE — dots + lines showing session progress
// ═══════════════════════════════════════════════════════
function ProgressTimeline({ quizResults, totalQuestions, eventsCount, questionsPerCard = 2, recapPerCard, currentQuestionIndex, variant = 'header' }) {
    const isCheckpoint = variant === 'checkpoint';
    const dotSize = isCheckpoint ? 12 : 8;
    const currentDotSize = isCheckpoint ? 14 : 10;
    const futureDotSize = isCheckpoint ? 8 : 6;
    const lineH = isCheckpoint ? 3 : 2;
    const gap = isCheckpoint ? 6 : 4;
    const groupGap = isCheckpoint ? 14 : 10;
    const sectionGap = isCheckpoint ? 22 : 16;

    const learnCount = eventsCount * questionsPerCard;
    const recapCount = eventsCount * recapPerCard;

    const getColor = (index) => {
        if (index >= quizResults.length) return null;
        const score = quizResults[index].firstScore;
        if (score === 'green') return 'var(--color-success)';
        if (score === 'yellow') return 'var(--color-warning)';
        return 'var(--color-error)';
    };

    const renderDot = (index) => {
        const isCurrent = index === currentQuestionIndex;
        const isFuture = index > quizResults.length || (index === quizResults.length && !isCurrent);
        const color = getColor(index);
        const size = isCurrent ? currentDotSize : (isFuture ? futureDotSize : dotSize);

        return (
            <div key={`dot-${index}`}
                className={`rounded-full flex-shrink-0 transition-all duration-300 ${isCurrent ? 'timeline-dot-current' : ''} ${isCheckpoint ? 'timeline-dot-stagger' : ''}`}
                style={{
                    width: size, height: size,
                    backgroundColor: color || (isCurrent ? 'var(--color-burgundy)' : 'rgba(28, 25, 23, 0.15)'),
                    opacity: isFuture && !isCurrent ? 0.3 : 1,
                    border: isCurrent ? '2px solid var(--color-burgundy)' : 'none',
                    ...(isCheckpoint ? { animationDelay: `${index * 50}ms` } : {}),
                }}
            />
        );
    };

    const renderLine = (afterIndex) => {
        const color = getColor(afterIndex);
        return (
            <div key={`line-${afterIndex}`} style={{
                width: gap + 4, height: lineH,
                backgroundColor: color || 'rgba(28, 25, 23, 0.12)',
                opacity: afterIndex < quizResults.length ? 0.6 : 0.2,
                borderRadius: 1, flexShrink: 0,
            }} />
        );
    };

    // Build learn card groups (2 dots per card)
    const learnGroups = [];
    for (let card = 0; card < eventsCount; card++) {
        const group = [];
        for (let q = 0; q < questionsPerCard; q++) {
            group.push(card * questionsPerCard + q);
        }
        learnGroups.push(group);
    }

    return (
        <div className="flex items-center justify-center w-full" style={{ minHeight: isCheckpoint ? 24 : 16 }}>
            {/* Learn section */}
            {learnGroups.map((group, gi) => (
                <div key={`lg-${gi}`} className="flex items-center" style={{ gap: 0 }}>
                    {group.map((dotIdx, di) => (
                        <div key={dotIdx} className="flex items-center" style={{ gap: 0 }}>
                            {renderDot(dotIdx)}
                            {di < group.length - 1 && renderLine(dotIdx)}
                        </div>
                    ))}
                    {/* Gap between card groups */}
                    {gi < learnGroups.length - 1 && <div style={{ width: groupGap }} />}
                </div>
            ))}

            {/* Section divider between learn and recap */}
            {recapCount > 0 && (
                <div className="flex items-center" style={{ gap: 2, marginLeft: sectionGap - groupGap, marginRight: sectionGap - groupGap }}>
                    <div className="rounded-full" style={{ width: 2, height: 2, backgroundColor: 'var(--color-ink-faint)', opacity: 0.4 }} />
                    <div className="rounded-full" style={{ width: 2, height: 2, backgroundColor: 'var(--color-ink-faint)', opacity: 0.4 }} />
                </div>
            )}

            {/* Recap section (flat, no grouping since shuffled) */}
            {recapCount > 0 && (
                <div className="flex items-center" style={{ gap: 0 }}>
                    {Array.from({ length: recapCount }, (_, i) => learnCount + i).map((dotIdx, i) => (
                        <div key={dotIdx} className="flex items-center" style={{ gap: 0 }}>
                            {renderDot(dotIdx)}
                            {i < recapCount - 1 && renderLine(dotIdx)}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// ═══════════════════════════════════════════════════════
// CHECKPOINT SCREEN (brief interstitial at card boundaries)
// ═══════════════════════════════════════════════════════
function CheckpointScreen({ data, onDismiss, quizResults, totalQuestions, eventsCount, recapPerCard }) {
    const { label, greenCount } = data;

    useEffect(() => {
        const timer = setTimeout(onDismiss, 1000);
        return () => clearTimeout(timer);
    }, [onDismiss]);

    return (
        <div className="lesson-flow-container animate-checkpoint-enter" onClick={onDismiss}
            style={{ cursor: 'pointer', userSelect: 'none' }}>
            <div className="flex-1 min-h-0 flex flex-col items-center justify-center py-6">
                <ProgressTimeline
                    quizResults={quizResults}
                    totalQuestions={totalQuestions}
                    eventsCount={eventsCount}
                    recapPerCard={recapPerCard}
                    currentQuestionIndex={quizResults.length}
                    variant="checkpoint"
                />
                <p className="text-sm font-semibold mt-5" style={{ color: 'var(--color-ink-secondary)' }}>
                    {label}
                </p>
                {greenCount > 0 && (
                    <p className="text-xs mt-1" style={{ color: 'var(--color-success)' }}>
                        {greenCount} correct so far
                    </p>
                )}
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════
// DATE FREE-INPUT QUESTION (recap only)
// ═══════════════════════════════════════════════════════
function DateInputQuestion({ event, onAnswer, onNext, onBack, onSkip }) {
    const [answered, setAnswered] = useState(false);
    const [dateInput, setDateInput] = useState('');
    const [era, setEra] = useState(event.year < 0 ? 'BCE' : 'CE');
    const [score, setScore] = useState(null);

    const handleSubmit = useCallback(() => {
        if (answered) return;
        const userYear = parseInt(dateInput);
        if (isNaN(userYear)) return;

        const s = scoreDateAnswer(Math.abs(userYear), era, event);
        setScore(s);
        setAnswered(true);
        onAnswer(s);
        feedback.forScore(s);
    }, [answered, dateInput, era, event, onAnswer]);

    const isRange = event.yearEnd != null;
    const hint = isRange
        ? 'Enter any year within the range'
        : (Math.abs(event.year) > 100000 ? 'Approximate is fine' : '');

    return (
        <div className="animate-slide-in-right">
            <Card style={answered && score ? { backgroundColor: SCORE_COLORS[score].bg, borderLeft: `3px solid ${SCORE_COLORS[score].border}` } : {}}>
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs uppercase tracking-widest font-bold px-2.5 py-1 rounded-full"
                        style={{ backgroundColor: 'rgba(139, 65, 87, 0.1)', color: 'var(--color-burgundy)' }}>
                        ✏️ Type the date
                    </span>
                </div>
                <h3 className="text-lg font-bold mb-1" style={{ fontFamily: 'var(--font-serif)' }}>{event.title}</h3>
                <p className="text-sm mb-2 leading-relaxed" style={{ color: 'var(--color-ink-secondary)' }}>
                    {stripDatesFromDescription(event.description, 100)}
                </p>
                {hint && (
                    <p className="text-xs italic mb-3" style={{ color: 'var(--color-ink-faint)' }}>{hint}</p>
                )}

                {!answered ? (
                    <>
                        <div>
                            <label className="text-xs font-semibold mb-1 block" style={{ color: 'var(--color-ink-muted)' }}>Year</label>
                            <div className="flex gap-2">
                                <input
                                    type="number"
                                    value={dateInput}
                                    onChange={e => setDateInput(e.target.value)}
                                    placeholder="e.g. 1453"
                                    className="flex-1 px-4 py-3 rounded-xl border-2 text-sm font-medium outline-none transition-colors"
                                    style={{ borderColor: 'rgba(var(--color-ink-rgb), 0.1)', backgroundColor: 'var(--color-card)', color: 'var(--color-ink)' }}
                                    onFocus={e => e.target.style.borderColor = 'var(--color-burgundy)'}
                                    onBlur={e => e.target.style.borderColor = 'rgba(var(--color-ink-rgb), 0.1)'}
                                />
                                <div className="flex rounded-xl border-2 overflow-hidden" style={{ borderColor: 'rgba(var(--color-ink-rgb), 0.1)' }}>
                                    {['BCE', 'CE'].map(e => (
                                        <button key={e} onClick={() => setEra(e)}
                                            className="px-3 py-2 text-xs font-bold transition-colors"
                                            style={{ backgroundColor: era === e ? 'var(--color-burgundy)' : 'transparent', color: era === e ? 'white' : 'var(--color-ink-muted)' }}>
                                            {e}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="mt-4">
                            <Button className="w-full" onClick={handleSubmit} disabled={!dateInput}>Check Answer</Button>
                            {(onSkip || onBack) && (
                                <div className="flex gap-3 mt-3">
                                    {onBack && <Button variant="secondary" className="flex-1" onClick={onBack}>← Back</Button>}
                                    {onSkip && <Button variant="secondary" className="flex-1" onClick={onSkip}>Skip</Button>}
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="mt-2">
                        <p className="text-sm font-semibold mb-1" style={{
                            color: getScoreColor(score).border
                        }}>
                            {getScoreLabel(score)}
                        </p>
                        <p className="text-sm" style={{ color: 'var(--color-ink-secondary)' }}>
                            <strong>{event.title}</strong> — <strong style={{ color: 'var(--color-burgundy)' }}>{event.date}</strong>
                        </p>
                    </div>
                )}
            </Card>
            {answered && <ControversyNote note={event.controversyNotes?.date} />}

            {answered && (
                <div className="pinned-footer flex gap-3">
                    {onBack && <Button variant="secondary" onClick={onBack}>← Back</Button>}
                    <Button className="flex-1" onClick={onNext}>Continue →</Button>
                </div>
            )}
        </div>
    );
}
