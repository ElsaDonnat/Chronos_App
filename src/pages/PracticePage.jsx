import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ALL_EVENTS, getEventById, CATEGORY_CONFIG } from '../data/events';
import { LESSONS } from '../data/lessons';
import { scoreDateAnswer, generateLocationOptions, generateWhatOptions } from '../data/quiz';
import { Card, Button, MasteryDots, ProgressBar, Divider, CategoryTag, StarButton, TabSelector } from '../components/shared';
import Mascot from '../components/Mascot';

// ─── Views ───────────────────────────────────────────
const VIEW = {
    HUB: 'hub',
    COLLECTION: 'collection',
    LESSON_PICKER: 'lesson_picker',
    SESSION: 'session',
    RESULTS: 'results',
};

export default function PracticePage() {
    const { state, dispatch } = useApp();
    const [view, setView] = useState(VIEW.HUB);
    const [practiceTab, setPracticeTab] = useState('hub'); // hub | collection
    const [sessionQuestions, setSessionQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [results, setResults] = useState([]);
    const [sessionMode, setSessionMode] = useState(null);
    const [selectedLessons, setSelectedLessons] = useState([]);
    const [collectionSort, setCollectionSort] = useState('success'); // success | times
    const [expandedEventId, setExpandedEventId] = useState(null);

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
            const successRate = timesReviewed > 0 ? Math.round((overall / 9) * 100) : 0;
            return { event: e, mastery, overall, timesReviewed, successRate };
        });
    }, [learnedEvents, state.eventMastery]);

    const tiers = useMemo(() => {
        const struggling = eventStats.filter(s => s.overall <= 3);
        const learning = eventStats.filter(s => s.overall > 3 && s.overall < 7);
        const mastered = eventStats.filter(s => s.overall >= 7);
        return { struggling, learning, mastered };
    }, [eventStats]);

    const weakEvents = useMemo(() => {
        return [...eventStats].sort((a, b) => a.overall - b.overall);
    }, [eventStats]);

    // ─── Question generation ─────────────────────────
    const generateQuestionsForPool = (eventPool) => {
        const qList = [];
        const shuffled = [...eventPool].sort(() => Math.random() - 0.5);
        const pool = shuffled.slice(0, 15);

        for (const event of pool) {
            const mastery = state.eventMastery[event.id];
            const scores = {
                location: mastery?.locationScore,
                date: mastery?.dateScore,
                what: mastery?.whatScore,
            };

            const scoreOrder = { red: 0, null: 1, undefined: 1, yellow: 2, green: 3 };
            const types = Object.entries(scores)
                .sort((a, b) => (scoreOrder[a[1]] ?? 1) - (scoreOrder[b[1]] ?? 1));

            const numQs = Math.min(2, types.filter(t => (scoreOrder[t[1]] ?? 1) < 3).length || 1);
            for (let i = 0; i < numQs && i < types.length; i++) {
                qList.push({
                    event,
                    type: types[i][0],
                    key: `practice-${event.id}-${types[i][0]}-${Date.now()}-${Math.random()}`,
                });
            }
            if (qList.length >= 12) break;
        }

        return qList.sort(() => Math.random() - 0.5);
    };

    const startSession = (mode, eventPool) => {
        const qs = generateQuestionsForPool(eventPool);
        if (qs.length === 0) return;
        setSessionQuestions(qs);
        setCurrentIndex(0);
        setResults([]);
        setSessionMode(mode);
        setView(VIEW.SESSION);
    };

    const startSmartReview = () => {
        const pool = weakEvents
            .filter(w => w.overall < 7)
            .map(w => w.event);
        startSession('Smart Review', pool.length > 0 ? pool : learnedEvents);
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
        if (!q) {
            // Session done → calculate XP and show results
            const xp = results.reduce((s, r) => s + (r.score === 'green' ? 5 : r.score === 'yellow' ? 2 : 0), 0);
            if (xp > 0) dispatch({ type: 'ADD_XP', amount: xp });
            setView(VIEW.RESULTS);
            return null;
        }

        return (
            <div className="py-4 animate-fade-in" key={`practice-${currentIndex}`}>
                <div className="flex items-center justify-between mb-4">
                    <button onClick={() => {
                        if (window.confirm("Are you sure? Progress in this session will be lost.")) {
                            setView(VIEW.HUB);
                        }
                    }} className="text-sm flex items-center gap-1"
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
                        }}
                        onNext={() => setCurrentIndex(i => i + 1)}
                        onBack={currentIndex > 0 ? () => setCurrentIndex(i => i - 1) : null}
                    />
                </div>
            </div>
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

        // Group results by event for per-event breakdown
        const eventBreakdown = useMemo(() => {
            const map = {};
            results.forEach(r => {
                if (!map[r.eventId]) map[r.eventId] = { event: getEventById(r.eventId), questions: [] };
                map[r.eventId].questions.push(r);
            });
            return Object.values(map);
        }, [results]);

        return (
            <div className="py-8 animate-fade-in">
                <div className="text-center">
                    <Mascot mood={perfectSession ? 'celebrating' : redCount === 0 ? 'happy' : greenCount > redCount ? 'happy' : 'thinking'} size={70} />
                    <h2 className="text-2xl font-bold mt-4 mb-1" style={{ fontFamily: 'var(--font-serif)' }}>
                        {perfectSession ? '🎯 Perfect Session!' : 'Practice Complete'}
                    </h2>
                    <p className="text-sm mb-1" style={{ color: 'var(--color-ink-muted)' }}>
                        {sessionMode} · {results.length} questions
                    </p>
                </div>

                <Card className="mt-4">
                    {/* Score dots */}
                    <div className="flex items-center gap-1 mb-4 justify-center flex-wrap">
                        {results.map((r, i) => (
                            <div key={i} className="w-2.5 h-2.5 rounded-full" style={{
                                backgroundColor: r.score === 'green' ? 'var(--color-success)' :
                                    r.score === 'yellow' ? 'var(--color-warning)' : 'var(--color-error)'
                            }} />
                        ))}
                    </div>

                    {/* Score summary */}
                    <div className="grid grid-cols-3 gap-3 text-center">
                        <div>
                            <div className="text-lg font-bold" style={{ color: 'var(--color-success)' }}>{greenCount}</div>
                            <div className="text-xs" style={{ color: 'var(--color-ink-muted)' }}>Exact</div>
                        </div>
                        <div>
                            <div className="text-lg font-bold" style={{ color: 'var(--color-warning)' }}>{yellowCount}</div>
                            <div className="text-xs" style={{ color: 'var(--color-ink-muted)' }}>Close</div>
                        </div>
                        <div>
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
                                                const label = q.type === 'location' ? 'Where' : q.type === 'date' ? 'When' : 'What';
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

                <div className="flex gap-3 mt-6">
                    <Button variant="secondary" onClick={() => { setView(VIEW.HUB); setPracticeTab('hub'); }}>
                        Done
                    </Button>
                    <Button className="flex-1" onClick={() => startSmartReview()}>
                        Practice Again
                    </Button>
                </div>
            </div>
        );
    }

    // ═══════════════════════════════════════════════════
    // LESSON PICKER
    // ═══════════════════════════════════════════════════
    if (view === VIEW.LESSON_PICKER) {
        const completedLessons = LESSONS.filter(l =>
            !l.isLesson0 && state.completedLessons[l.id]
        );
        const availableLessons = LESSONS.filter(l =>
            !l.isLesson0 && l.eventIds.some(id => (state.seenEvents || []).includes(id))
        );

        return (
            <div className="py-4 animate-fade-in">
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
                                        {isSelected ? '✓' : lesson.number}
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

                <div className="mt-6">
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
        <div className="py-4 animate-fade-in">
            {/* Header */}
            <div className="text-center mb-4">
                <h1 className="text-xl font-bold" style={{ fontFamily: 'var(--font-serif)' }}>Practice</h1>
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
                    learnedEvents={learnedEvents}
                    starredEvents={starredEvents}
                    weakEvents={weakEvents}
                    tiers={tiers}
                    state={state}
                    dispatch={dispatch}
                    onStartSmartReview={startSmartReview}
                    onStartFavorites={startFavorites}
                    onOpenLessonPicker={() => setView(VIEW.LESSON_PICKER)}
                />
            ) : (
                <CollectionView
                    eventStats={eventStats}
                    tiers={tiers}
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
function HubView({ learnedEvents, starredEvents, weakEvents, tiers, state, dispatch, onStartSmartReview, onStartFavorites, onOpenLessonPicker }) {
    const needsWork = tiers.struggling.length + tiers.learning.length;

    return (
        <div className="space-y-3">
            {/* Smart Review */}
            <Card onClick={onStartSmartReview} className="p-4">
                <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: 'rgba(139, 65, 87, 0.1)' }}>
                        <span className="text-lg">🧠</span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-bold" style={{ fontFamily: 'var(--font-serif)' }}>Smart Review</h3>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--color-ink-muted)' }}>
                            Targets your weakest areas first
                        </p>
                        {needsWork > 0 && (
                            <div className="flex items-center gap-1.5 mt-2">
                                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--color-error)' }} />
                                <span className="text-[10px] font-semibold" style={{ color: 'var(--color-error)' }}>
                                    {needsWork} event{needsWork !== 1 ? 's' : ''} need{needsWork === 1 ? 's' : ''} work
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
                className="p-4"
                style={{ opacity: starredEvents.length > 0 ? 1 : 0.5 }}
            >
                <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: 'rgba(230, 168, 23, 0.1)' }}>
                        <span className="text-lg">⭐</span>
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
            <Card onClick={onOpenLessonPicker} className="p-4">
                <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: 'rgba(101, 119, 74, 0.1)' }}>
                        <span className="text-lg">📖</span>
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

            {/* Stats overview */}
            <div className="mt-4">
                <Divider />
                <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--color-ink-faint)' }}>
                    Mastery Overview
                </h3>
                <div className="grid grid-cols-3 gap-3">
                    <div className="text-center p-3 rounded-xl" style={{ backgroundColor: 'rgba(166, 61, 61, 0.06)' }}>
                        <div className="text-lg font-bold" style={{ color: 'var(--color-error)' }}>{tiers.struggling.length}</div>
                        <div className="text-[10px] font-semibold" style={{ color: 'var(--color-error)' }}>Struggling</div>
                    </div>
                    <div className="text-center p-3 rounded-xl" style={{ backgroundColor: 'rgba(198, 134, 42, 0.06)' }}>
                        <div className="text-lg font-bold" style={{ color: 'var(--color-warning)' }}>{tiers.learning.length}</div>
                        <div className="text-[10px] font-semibold" style={{ color: 'var(--color-warning)' }}>Learning</div>
                    </div>
                    <div className="text-center p-3 rounded-xl" style={{ backgroundColor: 'rgba(5, 150, 105, 0.06)' }}>
                        <div className="text-lg font-bold" style={{ color: 'var(--color-success)' }}>{tiers.mastered.length}</div>
                        <div className="text-[10px] font-semibold" style={{ color: 'var(--color-success)' }}>Mastered</div>
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
function CollectionView({ eventStats, tiers, collectionSort, setCollectionSort, expandedEventId, setExpandedEventId, state, dispatch, onStartSession }) {
    const sortedStats = useMemo(() => {
        const copy = [...eventStats];
        if (collectionSort === 'success') {
            return copy.sort((a, b) => a.successRate - b.successRate);
        }
        return copy.sort((a, b) => a.timesReviewed - b.timesReviewed);
    }, [eventStats, collectionSort]);

    const tierConfig = [
        {
            key: 'struggling',
            label: 'Struggling',
            emoji: '🔴',
            color: 'var(--color-error)',
            bg: 'rgba(166, 61, 61, 0.06)',
            items: tiers.struggling,
        },
        {
            key: 'learning',
            label: 'Learning',
            emoji: '🟡',
            color: 'var(--color-warning)',
            bg: 'rgba(198, 134, 42, 0.06)',
            items: tiers.learning,
        },
        {
            key: 'mastered',
            label: 'Mastered',
            emoji: '🟢',
            color: 'var(--color-success)',
            bg: 'rgba(5, 150, 105, 0.06)',
            items: tiers.mastered,
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
                        <span>{tier.emoji}</span>
                        <h3 className="text-sm font-bold" style={{ color: tier.color }}>{tier.label}</h3>
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full"
                            style={{ backgroundColor: tier.bg, color: tier.color }}>
                            {tier.items.length}
                        </span>
                        {tier.items.length > 0 && tier.key !== 'mastered' && (
                            <button
                                onClick={() => onStartSession(tier.items.map(i => i.event))}
                                className="ml-auto text-[10px] font-semibold px-2 py-1 rounded-lg transition-all"
                                style={{ backgroundColor: tier.bg, color: tier.color }}
                            >
                                Practice these →
                            </button>
                        )}
                    </div>

                    {tier.items.length === 0 ? (
                        <div className="text-center py-4 rounded-xl" style={{ backgroundColor: tier.bg }}>
                            <p className="text-xs" style={{ color: 'var(--color-ink-faint)' }}>
                                {tier.key === 'struggling' ? 'No struggling events — great work!' :
                                    tier.key === 'mastered' ? 'Keep practicing to master events' : 'No events in this tier'}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-1.5">
                            {(collectionSort === 'success'
                                ? [...tier.items].sort((a, b) => a.successRate - b.successRate)
                                : [...tier.items].sort((a, b) => a.timesReviewed - b.timesReviewed)
                            ).map(({ event, mastery, overall, timesReviewed, successRate }) => {
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
                                                        <CategoryTag category={event.category} />
                                                        <span className="text-xs font-medium" style={{ color: 'var(--color-burgundy)' }}>
                                                            {event.date}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--color-ink-secondary)' }}>
                                                        {event.description}
                                                    </p>
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

    const scoreColors = {
        green: { bg: 'rgba(5, 150, 105, 0.08)', border: 'var(--color-success)' },
        yellow: { bg: 'rgba(198, 134, 42, 0.08)', border: 'var(--color-warning)' },
        red: { bg: 'rgba(166, 61, 61, 0.08)', border: 'var(--color-error)' },
    };

    const handleMCQ = (answer, correct) => {
        if (answered) return;
        setSelectedAnswer(answer);
        const s = answer === correct ? 'green' : 'red';
        setScore(s);
        setAnswered(true);
        onAnswer(s);
    };

    const handleDateSubmit = () => {
        if (answered) return;
        const userYear = parseInt(dateInput);
        if (isNaN(userYear)) return;
        const s = scoreDateAnswer(userYear, era, event);
        setScore(s);
        setAnswered(true);
        onAnswer(s);
    };

    // ─── Post-answer feedback card ───
    const renderFeedback = () => {
        if (!answered || !score) return null;
        return (
            <div className="mt-3 pt-3" style={{ borderTop: '1px solid rgba(28,25,23,0.06)' }}>
                <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold" style={{
                        color: score === 'green' ? 'var(--color-success)' : score === 'yellow' ? 'var(--color-warning)' : 'var(--color-error)'
                    }}>
                        {score === 'green' ? '✓ Correct!' : score === 'yellow' ? '≈ Close!' : '✗ Not quite'}
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
                <Card style={answered && score ? { backgroundColor: scoreColors[score].bg, borderLeft: `3px solid ${scoreColors[score].border}` } : {}}>
                    <p className="text-xs uppercase tracking-wider font-semibold mb-2" style={{ color: 'var(--color-ink-faint)' }}>Where did this happen?</p>
                    <h3 className="text-lg font-bold mb-1" style={{ fontFamily: 'var(--font-serif)' }}>{event.title}</h3>
                    <p className="text-sm mb-4" style={{ color: 'var(--color-burgundy)' }}>{event.date}</p>
                    <div className="space-y-2">
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
                                    className="w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all"
                                    style={{ borderColor: 'rgba(28, 25, 23, 0.08)', backgroundColor: 'var(--color-card)', ...optStyle }}>
                                    {opt}{answered && isCorrect && <span className="ml-2 text-xs" style={{ color: 'var(--color-success)' }}>✓</span>}
                                </button>
                            );
                        })}
                    </div>
                    {renderFeedback()}
                </Card>
                {answered ? (
                    <div className="flex gap-3 mt-4">
                        {onBack && <Button variant="secondary" onClick={onBack}>← Back</Button>}
                        <Button className="flex-1" onClick={onNext}>Continue →</Button>
                    </div>
                ) : (
                    onBack && <div className="mt-4"><Button variant="secondary" className="w-full" onClick={onBack}>← Back</Button></div>
                )}
            </div>
        );
    }

    if (type === 'date') {
        const isRange = event.yearEnd != null;
        const hint = isRange ? 'Enter any year within the period' : (Math.abs(event.year) > 100000 ? 'Approximate is fine' : '');

        return (
            <div className="animate-slide-in-right">
                <Card style={answered && score ? { backgroundColor: scoreColors[score].bg, borderLeft: `3px solid ${scoreColors[score].border}` } : {}}>
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
                {answered && (
                    <div className="flex gap-3 mt-4">
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
                <Card style={answered && score ? { backgroundColor: scoreColors[score].bg, borderLeft: `3px solid ${scoreColors[score].border}` } : {}}>
                    <p className="text-xs uppercase tracking-wider font-semibold mb-2" style={{ color: 'var(--color-ink-faint)' }}>What happened?</p>
                    <p className="text-lg font-semibold mb-1" style={{ color: 'var(--color-burgundy)' }}>{event.date}</p>
                    <p className="text-sm mb-4" style={{ color: 'var(--color-ink-muted)' }}>{event.location.region}</p>
                    <div className="space-y-2">
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
                                    className="w-full text-left px-4 py-3 rounded-xl border-2 text-sm transition-all"
                                    style={{ borderColor: 'rgba(28, 25, 23, 0.08)', backgroundColor: 'var(--color-card)', ...optStyle }}>
                                    <span className="font-semibold">{opt.title}</span>
                                    {answered && isCorrect && <span className="ml-2 text-xs" style={{ color: 'var(--color-success)' }}>✓</span>}
                                </button>
                            );
                        })}
                    </div>
                    {renderFeedback()}
                </Card>
                {answered ? (
                    <div className="flex gap-3 mt-4">
                        {onBack && <Button variant="secondary" onClick={onBack}>← Back</Button>}
                        <Button className="flex-1" onClick={onNext}>Continue →</Button>
                    </div>
                ) : (
                    onBack && <div className="mt-4"><Button variant="secondary" className="w-full" onClick={onBack}>← Back</Button></div>
                )}
            </div>
        );
    }

    return null;
}
