import { useState, useMemo, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { ALL_EVENTS, getEventById, CATEGORY_CONFIG, isDiHEvent, getEraForYear } from '../data/events';
import { LESSONS } from '../data/lessons';
import { scoreDateAnswer, generateLocationOptions, generateWhatOptions, generateDescriptionOptions, SCORE_COLORS, getScoreColor, getScoreLabel, shuffle } from '../data/quiz';
import { calculateNextReview, getDueEvents, getCardStatus } from '../data/spacedRepetition';
import { Card, Button, MasteryDots, ProgressBar, Divider, CategoryTag, DiHBadge, StarButton, TabSelector, ConfirmModal, ExpandableText, ControversyNote } from '../components/shared';
import Mascot from '../components/Mascot';
import * as feedback from '../services/feedback';
import { shareText, buildPracticeShareText } from '../services/share';

// ─── Matching colors (same palette as Lesson0Flow) ───
const MATCH_COLORS = [
    '#9B8EC4', '#5A9BD5', '#D98C3B', '#D4739D', '#6BAFAC',
];

// ─── Views ───────────────────────────────────────────
const VIEW = {
    HUB: 'hub',
    COLLECTION: 'collection',
    LESSON_PICKER: 'lesson_picker',
    SESSION: 'session',
    RESULTS: 'results',
};

export default function PracticePage({ onSessionChange, registerBackHandler }) {
    const { state, dispatch } = useApp();
    const [view, setView] = useState(VIEW.HUB);
    const [practiceTab, setPracticeTab] = useState(() =>
        window.CHRONOS_OPEN_EVENT ? 'collection' : 'hub'
    ); // hub | collection
    const [sessionQuestions, setSessionQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [results, setResults] = useState([]);
    const [sessionMode, setSessionMode] = useState(null);
    const [selectedLessons, setSelectedLessons] = useState([]);
    const [collectionSort, setCollectionSort] = useState('success'); // success | times
    const [expandedEventId, setExpandedEventId] = useState(() => {
        if (window.CHRONOS_OPEN_EVENT) {
            const id = window.CHRONOS_OPEN_EVENT;
            window.CHRONOS_OPEN_EVENT = null;
            return id;
        }
        return null;
    });
    const [showExitConfirm, setShowExitConfirm] = useState(false);
    const sessionStartTime = useRef(null);
    const sessionRecorded = useRef(false);
    const [sessionDuration, setSessionDuration] = useState(0);
    const [shareToast, setShareToast] = useState(false);

    useEffect(() => {
        onSessionChange?.(view === VIEW.SESSION || view === VIEW.RESULTS);
    }, [view, onSessionChange]);

    useEffect(() => {
        if (shareToast) {
            const t = setTimeout(() => setShareToast(false), 2000);
            return () => clearTimeout(t);
        }
    }, [shareToast]);

    // Register back handler for non-hub views
    useEffect(() => {
        if (view !== VIEW.HUB && registerBackHandler) {
            return registerBackHandler(() => {
                if (view === VIEW.SESSION) {
                    setShowExitConfirm(true);
                } else {
                    setView(VIEW.HUB);
                }
            });
        }
    }, [view, registerBackHandler]);

    // ─── Derived data ────────────────────────────────
    const learnedEvents = useMemo(() => {
        return (state.seenEvents || []).map(id => getEventById(id)).filter(Boolean);
    }, [state.seenEvents]);

    const starredEvents = useMemo(() => {
        return (state.starredEvents || []).map(id => getEventById(id)).filter(Boolean);
    }, [state.starredEvents]);

    const eventStats = useMemo(() => {
        return learnedEvents.map(e => {
            const mastery = state.eventMastery[e.id];
            const overall = mastery?.overallMastery ?? 0;
            const timesReviewed = mastery?.timesReviewed ?? 0;
            const successRate = timesReviewed > 0 ? Math.round((overall / 12) * 100) : 0;
            const cardStatus = getCardStatus(e.id, state.eventMastery, state.srSchedule || {}, state.skippedEvents || []);
            return { event: e, mastery, overall, timesReviewed, successRate, cardStatus };
        });
    }, [learnedEvents, state.eventMastery, state.srSchedule, state.skippedEvents]);

    // 4-status card tiers (replaces old 3-tier system)
    const statusTiers = useMemo(() => {
        const newCards = eventStats.filter(s => s.cardStatus === 'new');
        const learning = eventStats.filter(s => s.cardStatus === 'learning');
        const known = eventStats.filter(s => s.cardStatus === 'known');
        const assimilated = eventStats.filter(s => s.cardStatus === 'fully_assimilated');
        return { new: newCards, learning, known, fully_assimilated: assimilated };
    }, [eventStats]);

    // Spaced repetition: events due for review
    const dueEvents = useMemo(() => {
        return getDueEvents(state.srSchedule || {}, state.seenEvents || []);
    }, [state.srSchedule, state.seenEvents]);

    const weakEvents = useMemo(() => {
        return [...eventStats].sort((a, b) => a.overall - b.overall);
    }, [eventStats]);

    // Group results by event for per-event breakdown (used in RESULTS view)
    const eventBreakdown = useMemo(() => {
        const map = {};
        results.forEach(r => {
            if (!map[r.eventId]) map[r.eventId] = { event: getEventById(r.eventId), questions: [] };
            map[r.eventId].questions.push(r);
        });
        return Object.values(map);
    }, [results]);

    // ─── Select 4 events for a matching question ─────
    const selectMatchEvents = (pool) => {
        if (pool.length < 4) return null;
        const scoreOrder = { red: 0, null: 1, undefined: 1, yellow: 2, green: 3 };
        // Sort by date weakness (weakest first)
        const sorted = [...pool].sort((a, b) => {
            const aScore = scoreOrder[state.eventMastery[a.id]?.dateScore] ?? 1;
            const bScore = scoreOrder[state.eventMastery[b.id]?.dateScore] ?? 1;
            return aScore - bScore;
        });
        // Group by era, pick 1 per era for diversity
        const byEra = {};
        for (const ev of sorted) {
            const eraId = getEraForYear(ev.year).id;
            if (!byEra[eraId]) byEra[eraId] = [];
            byEra[eraId].push(ev);
        }
        const picked = [];
        const eras = Object.keys(byEra);
        // One from each era (up to 4)
        for (const era of eras) {
            if (picked.length >= 4) break;
            picked.push(byEra[era][0]);
        }
        // Fill remaining from weakest overall
        if (picked.length < 4) {
            const pickedIds = new Set(picked.map(e => e.id));
            for (const ev of sorted) {
                if (picked.length >= 4) break;
                if (!pickedIds.has(ev.id)) {
                    picked.push(ev);
                    pickedIds.add(ev.id);
                }
            }
        }
        return picked.slice(0, 4);
    };

    // ─── Question generation ─────────────────────────
    const generateQuestionsForPool = (eventPool) => {
        const qList = [];
        const shuffled = shuffle([...eventPool]);
        const pool = shuffled.slice(0, 15);

        // Try to create one match question (counts as 2 slots)
        const matchEvents = selectMatchEvents(pool);
        const matchEventIds = matchEvents ? new Set(matchEvents.map(e => e.id)) : new Set();
        let matchQuestion = null;
        if (matchEvents) {
            matchQuestion = {
                type: 'match',
                events: matchEvents,
                names: shuffle(matchEvents.map(e => ({ id: e.id, label: e.title }))),
                dates: shuffle(matchEvents.map(e => ({ id: e.id, label: e.date }))),
                key: `practice-match-${Date.now()}-${Math.random()}`,
            };
        }

        const regularCap = matchQuestion ? 10 : 12;

        for (const event of pool) {
            const mastery = state.eventMastery[event.id];
            const scores = {
                location: mastery?.locationScore,
                date: mastery?.dateScore,
                what: mastery?.whatScore,
                description: mastery?.descriptionScore,
            };

            const scoreOrder = { red: 0, null: 1, undefined: 1, yellow: 2, green: 3 };
            const types = Object.entries(scores)
                // Skip date questions for events already in the match
                .filter(([t]) => !(t === 'date' && matchEventIds.has(event.id)))
                .sort((a, b) => (scoreOrder[a[1]] ?? 1) - (scoreOrder[b[1]] ?? 1));

            const numQs = Math.min(2, types.filter(t => (scoreOrder[t[1]] ?? 1) < 3).length || 1);
            for (let i = 0; i < numQs && i < types.length; i++) {
                qList.push({
                    event,
                    type: types[i][0],
                    key: `practice-${event.id}-${types[i][0]}-${Date.now()}-${Math.random()}`,
                });
            }
            if (qList.length >= regularCap) break;
        }

        const allQuestions = shuffle(qList);
        // Insert match question at a random position
        if (matchQuestion) {
            const pos = Math.floor(Math.random() * (allQuestions.length + 1));
            allQuestions.splice(pos, 0, matchQuestion);
        }
        return allQuestions;
    };

    const startSession = (mode, eventPool) => {
        const qs = generateQuestionsForPool(eventPool);
        if (qs.length === 0) return;
        setSessionQuestions(qs);
        setCurrentIndex(0);
        setResults([]);
        setSessionMode(mode);
        sessionStartTime.current = Date.now();
        sessionRecorded.current = false;
        setView(VIEW.SESSION);
    };

    const startSpacedReview = () => {
        // Prioritize due events, then weak events as fallback
        const dueIds = dueEvents.slice(0, 15).map(d => d.eventId);
        const duePool = dueIds.map(id => getEventById(id)).filter(Boolean);
        if (duePool.length > 0) {
            startSession('Spaced Review', duePool);
        } else {
            // No events due — fall back to weak events
            const pool = weakEvents.filter(w => w.overall < 7).map(w => w.event);
            startSession('Spaced Review', pool.length > 0 ? pool : learnedEvents);
        }
    };

    const startFavorites = () => {
        startSession('Favorites', starredEvents);
    };

    const startLessonPractice = () => {
        const eventIds = selectedLessons.flatMap(lessonId => {
            const lesson = LESSONS.find(l => l.id === lessonId);
            return lesson ? lesson.eventIds : [];
        });
        const events = [...new Set(eventIds)].map(id => getEventById(id)).filter(Boolean);
        const learned = events.filter(e => (state.seenEvents || []).includes(e.id));
        startSession('By Lesson', learned.length > 0 ? learned : events);
        setSelectedLessons([]);
    };

    // ─── No events learned ──────────────────────────
    if (learnedEvents.length === 0) {
        return (
            <div className="py-12 text-center animate-fade-in">
                <Mascot mood="happy" size={70} />
                <h2 className="text-xl font-bold mt-4" style={{ fontFamily: 'var(--font-serif)' }}>
                    Practice awaits
                </h2>
                <p className="text-sm mt-2 mx-4" style={{ color: 'var(--color-ink-muted)' }}>
                    Complete your first lesson to unlock practice mode. Each session targets your weakest areas.
                </p>
            </div>
        );
    }

    // ═══════════════════════════════════════════════════
    // SESSION (active quiz)
    // ═══════════════════════════════════════════════════
    if (view === VIEW.SESSION) {
        const q = sessionQuestions[currentIndex];
        if (!q) return null;

        const handleSessionNext = () => {
            if (currentIndex + 1 >= sessionQuestions.length) {
                // Session complete — calculate XP and show results
                const xp = results.reduce((s, r) => {
                    const diff = getEventById(r.eventId)?.difficulty || 1;
                    return s + (r.score === 'green' ? 5 * diff : r.score === 'yellow' ? 2 * diff : 0);
                }, 0);
                if (xp > 0) dispatch({ type: 'ADD_XP', amount: xp });
                // Record study session
                if (!sessionRecorded.current && sessionStartTime.current) {
                    sessionRecorded.current = true;
                    const duration = Math.round((Date.now() - sessionStartTime.current) / 1000);
                    setSessionDuration(duration);
                    dispatch({ type: 'RECORD_STUDY_SESSION', duration, sessionType: 'practice', questionsAnswered: results.length });
                }
                setView(VIEW.RESULTS);
                feedback.complete();
            } else {
                setCurrentIndex(i => i + 1);
            }
        };

        return (
            <>
            {showExitConfirm && (
                <ConfirmModal
                    title="Leave session?"
                    message="Progress in this session will be lost."
                    confirmLabel="Leave"
                    cancelLabel="Stay"
                    danger
                    onConfirm={() => { setShowExitConfirm(false); setView(VIEW.HUB); }}
                    onCancel={() => setShowExitConfirm(false)}
                />
            )}
            <div className="py-4 animate-fade-in" key={`practice-${currentIndex}`}>
                <div className="flex items-center justify-between mb-4">
                    <button onClick={() => setShowExitConfirm(true)} className="text-sm flex items-center gap-1"
                        style={{ color: 'var(--color-ink-muted)' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="15 18 9 12 15 6" />
                        </svg>
                        Exit
                    </button>
                    <span className="text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: 'var(--color-burgundy-soft)', color: 'var(--color-burgundy)' }}>
                        {sessionMode}
                    </span>
                    <span className="text-sm font-medium" style={{ color: 'var(--color-ink-muted)' }}>
                        {currentIndex + 1} / {sessionQuestions.length}
                    </span>
                </div>
                <ProgressBar value={currentIndex + 1} max={sessionQuestions.length} />

                <div className="mt-6">
                    {q.type === 'match' ? (
                        <PracticeMatchQuestion
                            question={q}
                            onAnswer={(scores, events, pairs) => {
                                // Push 2 result entries (match counts as 2 questions)
                                setResults(prev => [
                                    ...prev,
                                    { eventId: events[0].id, type: 'match', score: scores[0] },
                                    { eventId: events[1].id, type: 'match', score: scores[1] },
                                ]);
                                // Update mastery + SR for all 4 matched events
                                events.forEach(ev => {
                                    const isCorrect = pairs[ev.id] === ev.id;
                                    const evScore = isCorrect ? 'green' : 'red';
                                    dispatch({ type: 'UPDATE_EVENT_MASTERY', eventId: ev.id, questionType: 'date', score: evScore });
                                    const schedule = state.srSchedule?.[ev.id] || { interval: 0, ease: 2.5, reviewCount: 0 };
                                    const next = calculateNextReview(schedule, evScore);
                                    dispatch({ type: 'UPDATE_SR_SCHEDULE', eventId: ev.id, ...next });
                                    if (evScore === 'green' && (state.skippedEvents || []).includes(ev.id)) {
                                        dispatch({ type: 'REMOVE_SKIPPED_EVENT', eventId: ev.id });
                                    }
                                });
                            }}
                            onNext={handleSessionNext}
                            onBack={currentIndex > 0 ? () => setCurrentIndex(i => i - 1) : null}
                        />
                    ) : (
                        <PracticeQuestion
                            question={q}
                            isStarred={(state.starredEvents || []).includes(q.event.id)}
                            onToggleStar={() => dispatch({ type: 'TOGGLE_STAR', eventId: q.event.id })}
                            onAnswer={(score) => {
                                setResults(prev => [...prev, { eventId: q.event.id, type: q.type, score }]);
                                dispatch({
                                    type: 'UPDATE_EVENT_MASTERY',
                                    eventId: q.event.id,
                                    questionType: q.type,
                                    score,
                                });
                                // Update spaced repetition schedule
                                const schedule = state.srSchedule?.[q.event.id] || { interval: 0, ease: 2.5, reviewCount: 0 };
                                const next = calculateNextReview(schedule, score);
                                dispatch({ type: 'UPDATE_SR_SCHEDULE', eventId: q.event.id, ...next });
                                // Remove skipped tag on green answer
                                if (score === 'green' && (state.skippedEvents || []).includes(q.event.id)) {
                                    dispatch({ type: 'REMOVE_SKIPPED_EVENT', eventId: q.event.id });
                                }
                            }}
                            onNext={handleSessionNext}
                            onBack={currentIndex > 0 ? () => setCurrentIndex(i => i - 1) : null}
                        />
                    )}
                </div>
            </div>
            </>
        );
    }

    // ═══════════════════════════════════════════════════
    // RESULTS
    // ═══════════════════════════════════════════════════
    if (view === VIEW.RESULTS) {
        const greenCount = results.filter(r => r.score === 'green').length;
        const yellowCount = results.filter(r => r.score === 'yellow').length;
        const redCount = results.filter(r => r.score === 'red').length;
        const perfectSession = redCount === 0 && yellowCount === 0 && results.length > 0;
        const sessionMin = Math.floor(sessionDuration / 60);
        const sessionSec = sessionDuration % 60;
        const sessionTimeStr = sessionMin > 0 ? `${sessionMin}m ${sessionSec}s` : `${sessionSec}s`;

        return (
            <div className="lesson-flow-container animate-fade-in">
                <div className="flex-1 min-h-0 overflow-y-auto">
                    <div className="py-4">
                        <div className="text-center">
                            <Mascot mood={perfectSession ? 'celebrating' : redCount === 0 ? 'happy' : greenCount > redCount ? 'happy' : 'thinking'} size={70} />
                            <h2 className="text-2xl font-bold mt-4 mb-1" style={{ fontFamily: 'var(--font-serif)' }}>
                                {perfectSession ? '⭐ Perfect Session!' : 'Practice Complete'}
                            </h2>
                            <p className="text-sm mb-1" style={{ color: 'var(--color-ink-muted)' }}>
                                {sessionMode} · {results.length} questions · {sessionTimeStr}
                            </p>
                        </div>

                        <Card className="mt-4">
                            {/* Score dots */}
                            <div className="flex items-center gap-1 mb-4 justify-center flex-wrap">
                                {results.map((r, i) => (
                                    <div key={i} className="w-2.5 h-2.5 rounded-full animate-dot-stagger" style={{
                                        animationDelay: `${i * 40}ms`,
                                        backgroundColor: r.score === 'green' ? 'var(--color-success)' :
                                            r.score === 'yellow' ? 'var(--color-warning)' : 'var(--color-error)'
                                    }} />
                                ))}
                            </div>

                            {/* Score summary */}
                            <div className="grid grid-cols-3 gap-3 text-center">
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
                        </Card>

                        {/* Per-event breakdown */}
                        <h3 className="text-sm font-semibold mt-6 mb-3" style={{ color: 'var(--color-ink-muted)' }}>
                            Event Breakdown
                        </h3>
                        <div className="space-y-2">
                            {eventBreakdown.map(({ event, questions }) => {
                                if (!event) return null;
                                const allGreen = questions.every(q => q.score === 'green');
                                const hasRed = questions.some(q => q.score === 'red');
                                const borderColor = allGreen ? 'var(--color-success)' : hasRed ? 'var(--color-error)' : 'var(--color-warning)';
                                return (
                                    <Card key={event.id} className="p-3" style={{ borderLeft: `3px solid ${borderColor}` }}>
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-sm font-semibold truncate" style={{ fontFamily: 'var(--font-serif)' }}>
                                                    {event.title}
                                                </h4>
                                                <div className="flex items-center gap-2 mt-1">
                                                    {questions.map((q, i) => {
                                                        const label = q.type === 'location' ? 'Where' : q.type === 'date' ? 'When' : q.type === 'description' ? 'Desc' : q.type === 'match' ? 'Match' : 'What';
                                                        return (
                                                            <span key={i} className="text-[10px] font-semibold px-1.5 py-0.5 rounded"
                                                                style={{
                                                                    backgroundColor: q.score === 'green' ? 'rgba(5,150,105,0.1)' :
                                                                        q.score === 'yellow' ? 'rgba(198,134,42,0.1)' : 'rgba(166,61,61,0.1)',
                                                                    color: q.score === 'green' ? 'var(--color-success)' :
                                                                        q.score === 'yellow' ? 'var(--color-warning)' : 'var(--color-error)',
                                                                }}>
                                                                {label}
                                                            </span>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                            <StarButton
                                                isStarred={(state.starredEvents || []).includes(event.id)}
                                                onClick={() => dispatch({ type: 'TOGGLE_STAR', eventId: event.id })}
                                                size={16}
                                            />
                                        </div>
                                    </Card>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="flex-shrink-0 pt-4 pb-2 space-y-2">
                    <div className="flex gap-3">
                        <Button variant="secondary" onClick={() => { setView(VIEW.HUB); setPracticeTab('hub'); }}>
                            Done
                        </Button>
                        <Button className="flex-1" onClick={() => startSpacedReview()}>
                            Practice Again
                        </Button>
                    </div>
                    <button
                        onClick={async () => {
                            const text = buildPracticeShareText({ sessionMode, greenCount, totalQuestions: results.length, perfectSession });
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
            </div>
        );
    }

    // ═══════════════════════════════════════════════════
    // LESSON PICKER
    // ═══════════════════════════════════════════════════
    if (view === VIEW.LESSON_PICKER) {
        const availableLessons = LESSONS.filter(l =>
            !l.isLesson0 && l.eventIds.some(id => (state.seenEvents || []).includes(id))
        );

        return (
            <div className="lesson-flow-container animate-fade-in">
                <div className="flex-shrink-0 pt-4">
                    <div className="flex items-center justify-between mb-4">
                        <button onClick={() => { setView(VIEW.HUB); setSelectedLessons([]); }}
                            className="text-sm flex items-center gap-1" style={{ color: 'var(--color-ink-muted)' }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="15 18 9 12 15 6" />
                            </svg>
                            Back
                        </button>
                        <span className="text-sm font-medium" style={{ color: 'var(--color-ink-muted)' }}>
                            {selectedLessons.length} selected
                        </span>
                    </div>

                    <h2 className="text-lg font-bold mb-1" style={{ fontFamily: 'var(--font-serif)' }}>Choose Lessons</h2>
                    <p className="text-xs mb-4" style={{ color: 'var(--color-ink-muted)' }}>
                        Select which lessons to practice. Events from all selected lessons will be combined.
                    </p>
                </div>

                <div className="flex-1 min-h-0 overflow-y-auto">
                    <div className="space-y-2">
                        {availableLessons.map(lesson => {
                            const isSelected = selectedLessons.includes(lesson.id);
                            const eventCount = lesson.eventIds.length;
                            const masteredCount = lesson.eventIds.filter(id => {
                                const m = state.eventMastery[id];
                                return m && m.overallMastery >= 7;
                            }).length;

                            return (
                                <Card
                                    key={lesson.id}
                                    onClick={() => {
                                        setSelectedLessons(prev =>
                                            prev.includes(lesson.id)
                                                ? prev.filter(id => id !== lesson.id)
                                                : [...prev, lesson.id]
                                        );
                                    }}
                                    className="p-3"
                                    style={{
                                        borderLeft: isSelected ? '3px solid var(--color-burgundy)' : '3px solid transparent',
                                        backgroundColor: isSelected ? 'rgba(139, 65, 87, 0.04)' : 'var(--color-card)',
                                    }}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0
                                            ${isSelected ? '' : ''}`}
                                            style={{
                                                backgroundColor: isSelected ? 'var(--color-burgundy)' : 'rgba(28,25,23,0.06)',
                                                color: isSelected ? 'white' : 'var(--color-ink-muted)',
                                            }}>
                                            {isSelected ? '\✓' : lesson.number}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-semibold truncate" style={{ fontFamily: 'var(--font-serif)' }}>
                                                {lesson.title}
                                            </h4>
                                            <p className="text-xs" style={{ color: 'var(--color-ink-faint)' }}>
                                                {eventCount} events · {masteredCount} mastered
                                            </p>
                                        </div>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>

                    {availableLessons.length === 0 && (
                        <div className="text-center py-8">
                            <p className="text-sm" style={{ color: 'var(--color-ink-muted)' }}>
                                Complete lessons to unlock them for practice.
                            </p>
                        </div>
                    )}
                </div>

                <div className="flex-shrink-0 pt-4 pb-2">
                    <Button className="w-full" disabled={selectedLessons.length === 0} onClick={startLessonPractice}>
                        Practice {selectedLessons.length > 0 ? `${selectedLessons.length} Lesson${selectedLessons.length > 1 ? 's' : ''}` : ''}  →
                    </Button>
                </div>
            </div>
        );
    }

    // ═══════════════════════════════════════════════════
    // HUB + COLLECTION (main view with tabs)
    // ═══════════════════════════════════════════════════
    return (
        <div className="py-6 animate-fade-in">
            {/* Header */}
            <div className="text-center mb-6">
                <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-serif)' }}>Practice</h1>
                <p className="text-xs mt-1" style={{ color: 'var(--color-ink-muted)' }}>
                    {learnedEvents.length} events learned · {starredEvents.length} starred
                </p>
            </div>

            {/* Tab Selector */}
            <div className="mb-5">
                <TabSelector
                    tabs={[
                        { id: 'hub', label: '🎯 Modes' },
                        { id: 'collection', label: '📚 My Cards' },
                    ]}
                    activeTab={practiceTab}
                    onChange={setPracticeTab}
                />
            </div>

            {practiceTab === 'hub' ? (
                <HubView
                    starredEvents={starredEvents}
                    weakEvents={weakEvents}
                    statusTiers={statusTiers}
                    dueCount={dueEvents.length}
                    state={state}
                    dispatch={dispatch}
                    onStartSpacedReview={startSpacedReview}
                    onStartFavorites={startFavorites}
                    onOpenLessonPicker={() => setView(VIEW.LESSON_PICKER)}
                />
            ) : (
                <CollectionView
                    statusTiers={statusTiers}
                    collectionSort={collectionSort}
                    setCollectionSort={setCollectionSort}
                    expandedEventId={expandedEventId}
                    setExpandedEventId={setExpandedEventId}
                    state={state}
                    dispatch={dispatch}
                    onStartSession={(events) => startSession('Custom', events)}
                />
            )}
        </div>
    );
}

// ═══════════════════════════════════════════════════════
// HUB VIEW — Practice mode cards
// ═══════════════════════════════════════════════════════
function HubView({ starredEvents, weakEvents, statusTiers, dueCount, state, dispatch, onStartSpacedReview, onStartFavorites, onOpenLessonPicker }) {
    return (
        <div className="space-y-3">
            {/* Spaced Review */}
            <Card onClick={onStartSpacedReview} className="lesson-card-row p-4">
                <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: 'rgba(139, 65, 87, 0.1)' }}>
                        <span className="text-lg">🧠</span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-bold" style={{ fontFamily: 'var(--font-serif)' }}>Spaced Review</h3>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--color-ink-muted)' }}>
                            Reviews cards at optimal intervals
                        </p>
                        {dueCount > 0 ? (
                            <div className="flex items-center gap-1.5 mt-2">
                                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--color-burgundy)' }} />
                                <span className="text-[10px] font-semibold" style={{ color: 'var(--color-burgundy)' }}>
                                    {dueCount} card{dueCount !== 1 ? 's' : ''} due for review
                                </span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-1.5 mt-2">
                                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--color-success)' }} />
                                <span className="text-[10px] font-semibold" style={{ color: 'var(--color-success)' }}>
                                    All caught up!
                                </span>
                            </div>
                        )}
                    </div>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-ink-faint)" strokeWidth="2" className="mt-2 flex-shrink-0">
                        <polyline points="9 18 15 12 9 6" />
                    </svg>
                </div>
            </Card>

            {/* Favorites */}
            <Card
                onClick={starredEvents.length > 0 ? onStartFavorites : undefined}
                className="lesson-card-row p-4"
                style={{ opacity: starredEvents.length > 0 ? 1 : 0.5 }}
            >
                <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: 'rgba(230, 168, 23, 0.1)' }}>
                        <span className="text-lg">{'\⭐'}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-bold" style={{ fontFamily: 'var(--font-serif)' }}>Favorites</h3>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--color-ink-muted)' }}>
                            {starredEvents.length > 0
                                ? `${starredEvents.length} starred event${starredEvents.length !== 1 ? 's' : ''} · shuffled`
                                : 'Star events during lessons to add them here'
                            }
                        </p>
                    </div>
                    {starredEvents.length > 0 && (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-ink-faint)" strokeWidth="2" className="mt-2 flex-shrink-0">
                            <polyline points="9 18 15 12 9 6" />
                        </svg>
                    )}
                </div>
            </Card>

            {/* By Lesson */}
            <Card onClick={onOpenLessonPicker} className="lesson-card-row p-4">
                <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: 'rgba(101, 119, 74, 0.1)' }}>
                        <span className="text-lg">{''}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-bold" style={{ fontFamily: 'var(--font-serif)' }}>By Lesson</h3>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--color-ink-muted)' }}>
                            Pick lessons to combine into a custom session
                        </p>
                    </div>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-ink-faint)" strokeWidth="2" className="mt-2 flex-shrink-0">
                        <polyline points="9 18 15 12 9 6" />
                    </svg>
                </div>
            </Card>

            {/* Card Status overview */}
            <div className="mt-4">
                <Divider />
                <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--color-ink-faint)' }}>
                    Card Status
                </h3>
                <div className="grid grid-cols-4 gap-2">
                    <div className="text-center p-2.5 rounded-xl" style={{ backgroundColor: 'rgba(28, 25, 23, 0.04)' }}>
                        <div className="text-lg font-bold" style={{ color: 'var(--color-ink-muted)' }}>{statusTiers.new.length}</div>
                        <div className="text-[9px] font-semibold" style={{ color: 'var(--color-ink-muted)' }}>New</div>
                    </div>
                    <div className="text-center p-2.5 rounded-xl" style={{ backgroundColor: 'rgba(166, 61, 61, 0.06)' }}>
                        <div className="text-lg font-bold" style={{ color: 'var(--color-error)' }}>{statusTiers.learning.length}</div>
                        <div className="text-[9px] font-semibold" style={{ color: 'var(--color-error)' }}>Learning</div>
                    </div>
                    <div className="text-center p-2.5 rounded-xl" style={{ backgroundColor: 'rgba(198, 134, 42, 0.06)' }}>
                        <div className="text-lg font-bold" style={{ color: 'var(--color-warning)' }}>{statusTiers.known.length}</div>
                        <div className="text-[9px] font-semibold" style={{ color: 'var(--color-warning)' }}>Known</div>
                    </div>
                    <div className="text-center p-2.5 rounded-xl" style={{ backgroundColor: 'rgba(5, 150, 105, 0.06)' }}>
                        <div className="text-lg font-bold" style={{ color: 'var(--color-success)' }}>{statusTiers.fully_assimilated.length}</div>
                        <div className="text-[9px] font-semibold" style={{ color: 'var(--color-success)' }}>Mastered</div>
                    </div>
                </div>
            </div>

            {/* Top weak events preview */}
            {weakEvents.length > 0 && weakEvents[0].overall < 7 && (
                <div className="mt-2">
                    <h3 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--color-ink-faint)' }}>
                        Needs Most Attention
                    </h3>
                    <div className="space-y-2">
                        {weakEvents.slice(0, 4).filter(w => w.overall < 7).map(({ event, mastery }) => (
                            <Card key={event.id} className="p-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-sm font-semibold truncate" style={{ fontFamily: 'var(--font-serif)' }}>
                                            {event.title}
                                        </h4>
                                        <div className="flex items-center gap-3 mt-1">
                                            <MasteryDots mastery={mastery} />
                                            <span className="text-[10px]" style={{ color: 'var(--color-ink-faint)' }}>
                                                {event.date}
                                            </span>
                                        </div>
                                    </div>
                                    <StarButton
                                        isStarred={(state.starredEvents || []).includes(event.id)}
                                        onClick={() => dispatch({ type: 'TOGGLE_STAR', eventId: event.id })}
                                        size={16}
                                    />
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

// ═══════════════════════════════════════════════════════
// COLLECTION VIEW — Card triage
// ═══════════════════════════════════════════════════════
function CollectionView({ statusTiers, collectionSort, setCollectionSort, expandedEventId, setExpandedEventId, state, dispatch, onStartSession }) {
    const tierConfig = [
        {
            key: 'new',
            label: 'New',
            color: 'var(--color-ink-muted)',
            bg: 'rgba(28, 25, 23, 0.04)',
            items: statusTiers.new,
            practiceLabel: 'Practice these',
        },
        {
            key: 'learning',
            label: 'Learning',
            color: 'var(--color-error)',
            bg: 'rgba(166, 61, 61, 0.06)',
            items: statusTiers.learning,
            practiceLabel: 'Practice these',
        },
        {
            key: 'known',
            label: 'Known',
            color: 'var(--color-warning)',
            bg: 'rgba(198, 134, 42, 0.06)',
            items: statusTiers.known,
            practiceLabel: null,
        },
        {
            key: 'fully_assimilated',
            label: 'Fully Assimilated',
            color: 'var(--color-success)',
            bg: 'rgba(5, 150, 105, 0.06)',
            items: statusTiers.fully_assimilated,
            practiceLabel: null,
        },
    ];

    return (
        <div>
            {/* Sort toggle */}
            <div className="mb-4">
                <TabSelector
                    tabs={[
                        { id: 'success', label: '% Success' },
                        { id: 'times', label: 'Times Seen' },
                    ]}
                    activeTab={collectionSort}
                    onChange={setCollectionSort}
                />
            </div>

            {/* Tier sections */}
            {tierConfig.map(tier => (
                <div key={tier.key} className="mb-5">
                    <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-sm font-bold" style={{ color: tier.color }}>{tier.label}</h3>
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full"
                            style={{ backgroundColor: tier.bg, color: tier.color }}>
                            {tier.items.length}
                        </span>
                        {tier.items.length > 0 && tier.practiceLabel && (
                            <button
                                onClick={() => onStartSession(tier.items.map(i => i.event))}
                                className="ml-auto text-[10px] font-semibold px-2 py-1 rounded-lg transition-all"
                                style={{ backgroundColor: tier.bg, color: tier.color }}
                            >
                                {tier.practiceLabel} {'→'}
                            </button>
                        )}
                    </div>

                    {tier.items.length === 0 ? (
                        <div className="text-center py-4 rounded-xl" style={{ backgroundColor: tier.bg }}>
                            <p className="text-xs" style={{ color: 'var(--color-ink-faint)' }}>
                                {tier.key === 'new' ? 'All events have been reviewed' :
                                    tier.key === 'learning' ? 'No cards still learning — great work!' :
                                    tier.key === 'fully_assimilated' ? 'Keep practicing to fully assimilate cards' :
                                    'No cards at this level yet'}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-1.5">
                            {(collectionSort === 'success'
                                ? [...tier.items].sort((a, b) => a.successRate - b.successRate)
                                : [...tier.items].sort((a, b) => a.timesReviewed - b.timesReviewed)
                            ).map(({ event, mastery, timesReviewed, successRate }) => {
                                const isExpanded = expandedEventId === event.id;
                                return (
                                    <div key={event.id}>
                                        <Card
                                            onClick={() => setExpandedEventId(isExpanded ? null : event.id)}
                                            className="p-3"
                                            style={{
                                                borderLeft: isExpanded ? `3px solid ${tier.color}` : '3px solid transparent',
                                            }}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <h4 className="text-sm font-semibold truncate" style={{ fontFamily: 'var(--font-serif)' }}>
                                                            {event.title}
                                                        </h4>
                                                        {isDiHEvent(event) && <DiHBadge />}
                                                    </div>
                                                    <div className="flex items-center gap-3 mt-1">
                                                        <MasteryDots mastery={mastery} />
                                                        <span className="text-[10px]" style={{ color: 'var(--color-ink-faint)' }}>
                                                            {collectionSort === 'success'
                                                                ? `${successRate}% success`
                                                                : `${timesReviewed} time${timesReviewed !== 1 ? 's' : ''} seen`
                                                            }
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 flex-shrink-0">
                                                    <StarButton
                                                        isStarred={(state.starredEvents || []).includes(event.id)}
                                                        onClick={() => dispatch({ type: 'TOGGLE_STAR', eventId: event.id })}
                                                        size={16}
                                                    />
                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--color-ink-faint)" strokeWidth="2"
                                                        className="transition-transform duration-200"
                                                        style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                                                        <polyline points="6 9 12 15 18 9" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </Card>

                                        {/* Expanded card detail */}
                                        {isExpanded && (
                                            <div className="animate-fade-in mx-1 mt-1 mb-2">
                                                <Card className="p-4" style={{ borderLeft: `3px solid ${tier.color}` }}>
                                                    <div className="flex items-center justify-between mb-2">
                                                        <div className="flex items-center gap-2">
                                                            <CategoryTag category={event.category} />
                                                            {isDiHEvent(event) && <DiHBadge />}
                                                        </div>
                                                        <span className="text-xs font-medium" style={{ color: 'var(--color-burgundy)' }}>
                                                            {event.date}
                                                        </span>
                                                    </div>
                                                    <ExpandableText lines={3} className="text-sm leading-relaxed mb-3" style={{ color: 'var(--color-ink-secondary)' }}>
                                                        {event.keywords && <><strong style={{ color: 'var(--color-ink)' }}>{event.keywords}</strong>{' '}</>}{event.description}
                                                    </ExpandableText>
                                                    <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--color-ink-muted)' }}>
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                                                        </svg>
                                                        {event.location.place}
                                                    </div>
                                                    <div className="flex items-center gap-4 mt-3 pt-3" style={{ borderTop: '1px solid rgba(28,25,23,0.06)' }}>
                                                        <div className="text-[10px]">
                                                            <span style={{ color: 'var(--color-ink-faint)' }}>Reviewed: </span>
                                                            <span className="font-bold">{timesReviewed}×</span>
                                                        </div>
                                                        <div className="text-[10px]">
                                                            <span style={{ color: 'var(--color-ink-faint)' }}>Success: </span>
                                                            <span className="font-bold">{successRate}%</span>
                                                        </div>
                                                        <div className="text-[10px] flex items-center gap-1">
                                                            <span style={{ color: 'var(--color-ink-faint)' }}>Mastery: </span>
                                                            <MasteryDots mastery={mastery} />
                                                        </div>
                                                    </div>
                                                </Card>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

// ═══════════════════════════════════════════════════════
// PRACTICE MATCH QUESTION — match 4 events to their dates
// ═══════════════════════════════════════════════════════
function PracticeMatchQuestion({ question, onAnswer, onNext, onBack }) {
    const [matchPairs, setMatchPairs] = useState({});
    const [matchSelected, setMatchSelected] = useState(null);
    const [matchChecked, setMatchChecked] = useState(false);

    const pairCount = Object.keys(matchPairs).length;
    const allPaired = pairCount === 4;

    const nameColorMap = {};
    const dateColorMap = {};
    Object.keys(matchPairs).forEach((nameId, i) => {
        nameColorMap[nameId] = MATCH_COLORS[i % MATCH_COLORS.length];
        dateColorMap[matchPairs[nameId]] = MATCH_COLORS[i % MATCH_COLORS.length];
    });

    const handleNameClick = (nameId) => {
        if (matchChecked) return;
        setMatchSelected(matchSelected === nameId ? null : nameId);
    };

    const handleDateClick = (dateId) => {
        if (matchChecked) return;
        if (!matchSelected) {
            const pairedName = Object.entries(matchPairs).find(([, d]) => d === dateId)?.[0];
            if (pairedName) {
                setMatchPairs(prev => { const next = { ...prev }; delete next[pairedName]; return next; });
            }
            return;
        }
        setMatchPairs(prev => {
            const next = { ...prev };
            delete next[matchSelected];
            const existing = Object.entries(next).find(([, d]) => d === dateId)?.[0];
            if (existing) delete next[existing];
            next[matchSelected] = dateId;
            return next;
        });
        setMatchSelected(null);
    };

    const handleCheck = () => {
        if (!allPaired || matchChecked) return;
        const correctCount = question.names.filter(n => matchPairs[n.id] === n.id).length;
        const wrongCount = 4 - correctCount;
        // Scoring: 0 wrong = 2×green, 1 wrong = green+yellow, 2 wrong = 2×yellow, 3-4 wrong = 2×red
        const scores = wrongCount === 0 ? ['green', 'green']
            : wrongCount === 1 ? ['green', 'yellow']
            : wrongCount === 2 ? ['yellow', 'yellow']
            : ['red', 'red'];
        setMatchChecked(true);
        onAnswer(scores, question.events, matchPairs);
        if (wrongCount === 0) feedback.forScore('green');
        else if (wrongCount <= 2) feedback.forScore('yellow');
        else feedback.forScore('red');
    };

    const matchScore = matchChecked
        ? (question.names.filter(n => matchPairs[n.id] === n.id).length === 4 ? 'green'
            : question.names.filter(n => matchPairs[n.id] === n.id).length >= 2 ? 'yellow' : 'red')
        : null;

    return (
        <div className="animate-slide-in-right">
            <Card style={matchChecked && matchScore ? {
                backgroundColor: SCORE_COLORS[matchScore].bg,
                borderLeft: `3px solid ${SCORE_COLORS[matchScore].border}`
            } : {}}>
                <p className="text-xs uppercase tracking-wider font-semibold mb-1" style={{ color: 'var(--color-ink-faint)' }}>
                    Match each event to its date
                </p>
                <p className="text-[11px] mb-3" style={{ color: 'var(--color-ink-faint)' }}>
                    Tap an event, then tap its date
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    {/* Left column: event names */}
                    <div className="flex flex-col gap-1.5">
                        {question.names.map((n) => {
                            const isPaired = !!matchPairs[n.id];
                            const isActive = matchSelected === n.id;
                            const color = nameColorMap[n.id];
                            let bg = 'var(--color-card)';
                            let border = 'rgba(28, 25, 23, 0.08)';
                            let borderStyle = 'solid';
                            if (matchChecked && isPaired) {
                                const isCorrect = matchPairs[n.id] === n.id;
                                bg = isCorrect ? 'rgba(5, 150, 105, 0.1)' : 'rgba(166, 61, 61, 0.1)';
                                border = isCorrect ? 'var(--color-success)' : 'var(--color-error)';
                            } else if (isActive) {
                                bg = 'var(--color-burgundy-soft)';
                                border = 'var(--color-burgundy)';
                                borderStyle = 'dashed';
                            } else if (isPaired && color) {
                                bg = `${color}18`;
                                border = color;
                            }
                            return (
                                <button key={n.id} onClick={() => handleNameClick(n.id)} disabled={matchChecked}
                                    className="rounded-lg transition-all flex items-center justify-center"
                                    style={{
                                        padding: '10px 6px', minHeight: '44px',
                                        fontSize: '0.7rem', fontWeight: 600, fontFamily: 'var(--font-serif)',
                                        textAlign: 'center', backgroundColor: bg,
                                        border: `2px ${borderStyle} ${border}`,
                                        color: 'var(--color-ink)', cursor: matchChecked ? 'default' : 'pointer',
                                    }}>
                                    {n.label}
                                </button>
                            );
                        })}
                    </div>

                    {/* Right column: dates */}
                    <div className="flex flex-col gap-1.5">
                        {question.dates.map((d) => {
                            const pairedByName = Object.entries(matchPairs).find(([, dateId]) => dateId === d.id)?.[0];
                            const isPaired = !!pairedByName;
                            const color = dateColorMap[d.id];
                            let bg = 'var(--color-card)';
                            let border = 'rgba(28, 25, 23, 0.08)';
                            let borderStyle = 'solid';
                            if (matchChecked && isPaired) {
                                const isCorrect = pairedByName === d.id;
                                bg = isCorrect ? 'rgba(5, 150, 105, 0.1)' : 'rgba(166, 61, 61, 0.1)';
                                border = isCorrect ? 'var(--color-success)' : 'var(--color-error)';
                            } else if (isPaired && color) {
                                bg = `${color}18`;
                                border = color;
                            } else if (matchSelected && !isPaired) {
                                border = 'rgba(139, 65, 87, 0.3)';
                                borderStyle = 'dashed';
                            }
                            return (
                                <button key={d.id} onClick={() => handleDateClick(d.id)} disabled={matchChecked}
                                    className="rounded-lg transition-all flex items-center justify-center"
                                    style={{
                                        padding: '10px 6px', minHeight: '44px',
                                        fontSize: '0.7rem', fontWeight: 500,
                                        textAlign: 'center', backgroundColor: bg,
                                        border: `2px ${borderStyle} ${border}`,
                                        color: 'var(--color-ink-secondary)', cursor: matchChecked ? 'default' : 'pointer',
                                    }}>
                                    {d.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {!matchChecked && (
                    <div className="mt-4">
                        <Button className="w-full" onClick={handleCheck} disabled={!allPaired}>
                            Check Matches
                        </Button>
                    </div>
                )}

                {matchChecked && (
                    <div className="mt-3 pt-3" style={{ borderTop: '1px solid rgba(28,25,23,0.06)' }}>
                        <p className="text-sm font-semibold" style={{ color: SCORE_COLORS[matchScore].border }}>
                            {matchScore === 'green' ? 'Perfect match!' : matchScore === 'yellow' ? 'Close — some pairs were off' : 'Several pairs were wrong'}
                        </p>
                    </div>
                )}
            </Card>
            {matchChecked && (
                <div className="pinned-footer flex gap-3">
                    {onBack && <Button variant="secondary" onClick={onBack}>{'←'} Back</Button>}
                    <Button className="flex-1" onClick={onNext}>Continue {'→'}</Button>
                </div>
            )}
        </div>
    );
}

// ═══════════════════════════════════════════════════════
// PRACTICE QUESTION — individual question card
// ═══════════════════════════════════════════════════════
function PracticeQuestion({ question, isStarred, onToggleStar, onAnswer, onNext, onBack }) {
    const { event, type } = question;
    const [answered, setAnswered] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [score, setScore] = useState(null);
    const [dateInput, setDateInput] = useState('');
    const [era, setEra] = useState(event.year < 0 ? 'BCE' : 'CE');

    const [locationOptions] = useState(() => generateLocationOptions(event));
    const [whatOptions] = useState(() => generateWhatOptions(event, ALL_EVENTS.map(e => e.id)));
    const [descriptionOptions] = useState(() => generateDescriptionOptions(event));


    const handleMCQ = (answer, correct) => {
        if (answered) return;
        setSelectedAnswer(answer);
        const s = answer === correct ? 'green' : 'red';
        setScore(s);
        setAnswered(true);
        onAnswer(s);
        feedback.forScore(s);
    };

    const handleDateSubmit = () => {
        if (answered) return;
        const userYear = parseInt(dateInput);
        if (isNaN(userYear)) return;
        const s = scoreDateAnswer(userYear, era, event);
        setScore(s);
        setAnswered(true);
        onAnswer(s);
        feedback.forScore(s);
    };

    // ─── Post-answer feedback card ───
    const renderFeedback = () => {
        if (!answered || !score) return null;
        return (
            <div className="mt-3 pt-3" style={{ borderTop: '1px solid rgba(28,25,23,0.06)' }}>
                <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold" style={{
                        color: getScoreColor(score).border
                    }}>
                        {getScoreLabel(score)}
                    </p>
                    <StarButton isStarred={isStarred} onClick={onToggleStar} size={16} />
                </div>
                {score !== 'green' && (
                    <div className="mt-2 text-xs leading-relaxed" style={{ color: 'var(--color-ink-secondary)' }}>
                        <strong>{event.title}</strong> — <span style={{ color: 'var(--color-burgundy)' }}>{event.date}</span>
                        {type === 'location' && <span> · {event.location.place}</span>}
                    </div>
                )}
            </div>
        );
    };

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
                            let optStyle = {};
                            if (answered) {
                                if (isCorrect) optStyle = { backgroundColor: 'rgba(5, 150, 105, 0.1)', borderColor: 'var(--color-success)' };
                                else if (isSelected) optStyle = { backgroundColor: 'rgba(166, 61, 61, 0.1)', borderColor: 'var(--color-error)' };
                            }
                            return (
                                <button key={i} onClick={() => handleMCQ(opt, event.location.place)} disabled={answered}
                                    className="mcq-option"
                                    style={{ ...optStyle }}>
                                    {opt}{answered && isCorrect && <span className="ml-2 text-xs" style={{ color: 'var(--color-success)' }}>✓</span>}
                                </button>
                            );
                        })}
                    </div>
                    {renderFeedback()}
                </Card>
                {answered && <ControversyNote note={event.controversyNotes?.location} />}
                {answered ? (
                    <div className="pinned-footer flex gap-3">
                        {onBack && <Button variant="secondary" onClick={onBack}>← Back</Button>}
                        <Button className="flex-1" onClick={onNext}>Continue →</Button>
                    </div>
                ) : (
                    onBack && <div className="pinned-footer"><Button variant="secondary" className="w-full" onClick={onBack}>← Back</Button></div>
                )}
            </div>
        );
    }

    if (type === 'date') {
        const isRange = event.yearEnd != null;
        const hint = isRange ? 'Enter any year within the period' : (Math.abs(event.year) > 100000 ? 'Approximate is fine' : '');

        return (
            <div className="animate-slide-in-right">
                <Card style={answered && score ? { backgroundColor: SCORE_COLORS[score].bg, borderLeft: `3px solid ${SCORE_COLORS[score].border}` } : {}}>
                    <p className="text-xs uppercase tracking-wider font-semibold mb-2" style={{ color: 'var(--color-ink-faint)' }}>When did this happen?</p>
                    <h3 className="text-lg font-bold mb-1" style={{ fontFamily: 'var(--font-serif)' }}>{event.title}</h3>
                    <p className="text-sm mb-2 leading-relaxed" style={{ color: 'var(--color-ink-secondary)' }}>{event.description.substring(0, 100)}…</p>
                    {hint && <p className="text-xs italic mb-3" style={{ color: 'var(--color-ink-faint)' }}>{hint}</p>}

                    {!answered ? (
                        <>
                            <div>
                                <label className="text-xs font-semibold mb-1 block" style={{ color: 'var(--color-ink-muted)' }}>Year</label>
                                <div className="flex gap-2">
                                    <input type="number" value={dateInput} onChange={e => setDateInput(e.target.value)}
                                        placeholder="e.g. 1453"
                                        className="flex-1 px-4 py-3 rounded-xl border-2 text-sm font-medium outline-none"
                                        style={{ borderColor: 'rgba(28, 25, 23, 0.1)', backgroundColor: 'var(--color-card)', color: 'var(--color-ink)' }} />
                                    <div className="flex rounded-xl border-2 overflow-hidden" style={{ borderColor: 'rgba(28, 25, 23, 0.1)' }}>
                                        {['BCE', 'CE'].map(e => (
                                            <button key={e} onClick={() => setEra(e)} className="px-3 py-2 text-xs font-bold"
                                                style={{ backgroundColor: era === e ? 'var(--color-burgundy)' : 'transparent', color: era === e ? 'white' : 'var(--color-ink-muted)' }}>
                                                {e}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4">
                                <Button className="w-full" onClick={handleDateSubmit} disabled={!dateInput}>
                                    Check Answer
                                </Button>
                                {onBack && <Button variant="secondary" className="w-full mt-3" onClick={onBack}>← Back</Button>}
                            </div>
                        </>
                    ) : (
                        renderFeedback()
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

    if (type === 'what') {
        return (
            <div className="animate-slide-in-right">
                <Card style={answered && score ? { backgroundColor: SCORE_COLORS[score].bg, borderLeft: `3px solid ${SCORE_COLORS[score].border}` } : {}}>
                    <p className="text-xs uppercase tracking-wider font-semibold mb-2" style={{ color: 'var(--color-ink-faint)' }}>What happened?</p>
                    <p className="text-xl font-semibold mb-1" style={{ color: 'var(--color-burgundy)' }}>{event.date}</p>
                    <p className="text-sm mb-5" style={{ color: 'var(--color-ink-muted)' }}>{event.location.region}</p>
                    <div className="mcq-options mcq-options--grid">
                        {whatOptions.map((opt, i) => {
                            const isCorrect = opt.id === event.id;
                            const isSelected = selectedAnswer === opt.id;
                            let optStyle = {};
                            if (answered) {
                                if (isCorrect) optStyle = { backgroundColor: 'rgba(5, 150, 105, 0.1)', borderColor: 'var(--color-success)' };
                                else if (isSelected) optStyle = { backgroundColor: 'rgba(166, 61, 61, 0.1)', borderColor: 'var(--color-error)' };
                            }
                            return (
                                <button key={i} onClick={() => handleMCQ(opt.id, event.id)} disabled={answered}
                                    className="mcq-option"
                                    style={{ ...optStyle }}>
                                    <span className="font-semibold">{opt.title}</span>
                                    {answered && isCorrect && <span className="ml-2 text-xs" style={{ color: 'var(--color-success)' }}>✓</span>}
                                </button>
                            );
                        })}
                    </div>
                    {renderFeedback()}
                </Card>
                {answered && <ControversyNote note={event.controversyNotes?.what} />}
                {answered ? (
                    <div className="pinned-footer flex gap-3">
                        {onBack && <Button variant="secondary" onClick={onBack}>← Back</Button>}
                        <Button className="flex-1" onClick={onNext}>Continue →</Button>
                    </div>
                ) : (
                    onBack && <div className="pinned-footer"><Button variant="secondary" className="w-full" onClick={onBack}>← Back</Button></div>
                )}
            </div>
        );
    }

    if (type === 'description') {
        return (
            <div className="animate-slide-in-right">
                <Card style={answered && score ? { backgroundColor: SCORE_COLORS[score].bg, borderLeft: `3px solid ${SCORE_COLORS[score].border}` } : {}}>
                    <p className="text-xs uppercase tracking-wider font-semibold mb-2" style={{ color: 'var(--color-ink-faint)' }}>Which description fits?</p>
                    <h3 className="text-xl font-bold mb-1" style={{ fontFamily: 'var(--font-serif)' }}>{event.title}</h3>
                    <p className="text-sm mb-5" style={{ color: 'var(--color-burgundy)' }}>{event.date}</p>
                    <div className="mcq-options">
                        {descriptionOptions.map((opt, i) => {
                            const isCorrect = opt.id === event.id;
                            const isSelected = selectedAnswer === opt.id;
                            let optStyle = {};
                            if (answered) {
                                if (isCorrect) optStyle = { backgroundColor: 'rgba(5, 150, 105, 0.1)', borderColor: 'var(--color-success)' };
                                else if (isSelected && !isCorrect) optStyle = { backgroundColor: 'rgba(166, 61, 61, 0.1)', borderColor: 'var(--color-error)' };
                            }
                            return (
                                <button key={i} onClick={() => handleMCQ(opt.id, event.id)} disabled={answered}
                                    className="mcq-option"
                                    style={{ borderColor: isSelected && !answered ? 'var(--color-burgundy)' : undefined, ...optStyle }}>
                                    <span className="leading-relaxed text-sm block" style={{ color: 'var(--color-ink-secondary)' }}>{opt.description}</span>
                                    {answered && isCorrect && <span className="ml-2 text-xs font-bold mt-1 block" style={{ color: 'var(--color-success)' }}>✓ Correct</span>}
                                </button>
                            );
                        })}
                    </div>
                    {renderFeedback()}
                </Card>
                {answered && <ControversyNote note={event.controversyNotes?.description} />}
                {answered ? (
                    <div className="pinned-footer flex gap-3">
                        {onBack && <Button variant="secondary" onClick={onBack}>← Back</Button>}
                        <Button className="flex-1" onClick={onNext}>Continue →</Button>
                    </div>
                ) : (
                    onBack && <div className="pinned-footer"><Button variant="secondary" className="w-full" onClick={onBack}>← Back</Button></div>
                )}
            </div>
        );
    }

    return null;
}
