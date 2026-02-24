import { useState, useMemo, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import { getEventsByIds, ALL_EVENTS, formatYear, CATEGORY_CONFIG } from '../../data/events';
import { scoreDateAnswer, generateLocationOptions, generateWhatOptions, calculateXP } from '../../data/quiz';
import { Card, Button, ProgressBar, CategoryTag, Divider } from '../shared';
import Mascot from '../Mascot';

// ─── PHASES ────────────────────────────────────────────
const PHASE = {
    INTRO: 'intro',
    CHUNK_LEARN: 'chunk_learn',    // Study 2 cards
    CHUNK_QUIZ: 'chunk_quiz',      // Quiz on those 2 cards
    FINAL_REVIEW: 'final_review',  // Re-show hard ones + retry red
    SUMMARY: 'summary',
};

const CHUNK_SIZE = 2; // 2 cards per chunk

export default function LessonFlow({ lesson, onComplete }) {
    const { state, dispatch } = useApp();
    const events = useMemo(() => getEventsByIds(lesson.eventIds), [lesson]);

    const [phase, setPhase] = useState(PHASE.INTRO);
    const [chunkIndex, setChunkIndex] = useState(0); // which chunk of 2 we're on
    const [cardIndexInChunk, setCardIndexInChunk] = useState(0); // card within current chunk
    const [quizResults, setQuizResults] = useState([]); // all results across all chunks
    const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
    const [reviewIndex, setReviewIndex] = useState(0);

    // Split events into chunks of CHUNK_SIZE
    const chunks = useMemo(() => {
        const c = [];
        for (let i = 0; i < events.length; i += CHUNK_SIZE) {
            c.push(events.slice(i, i + CHUNK_SIZE));
        }
        return c;
    }, [events]);

    const currentChunk = chunks[chunkIndex] || [];

    // Generate quiz questions for a specific set of events (randomized)
    const generateQuizForEvents = useCallback((evts) => {
        const questions = [];
        for (const event of evts) {
            questions.push({ event, type: 'location', key: `${event.id}-location-${chunkIndex}` });
            questions.push({ event, type: 'date', key: `${event.id}-date-${chunkIndex}` });
            questions.push({ event, type: 'what', key: `${event.id}-what-${chunkIndex}` });
        }
        // Shuffle
        return questions.sort(() => Math.random() - 0.5);
    }, [chunkIndex]);

    const [chunkQuizQuestions, setChunkQuizQuestions] = useState([]);

    // Items needing final review (yellow + red)
    const hardResults = useMemo(() => {
        return quizResults.filter(r => r.firstScore === 'red' || r.firstScore === 'yellow');
    }, [quizResults]);

    const redResults = useMemo(() => {
        return quizResults.filter(r => r.firstScore === 'red' && !r.retryScore);
    }, [quizResults]);

    // Total progress across all chunks
    const totalQuestions = events.length * 3;
    const answeredQuestions = quizResults.length;

    // ─── INTRO ─────────────────────────────────────────
    if (phase === PHASE.INTRO) {
        return (
            <div className="py-8 animate-fade-in">
                <button onClick={onComplete} className="flex items-center gap-1 mb-6 text-sm"
                    style={{ color: 'var(--color-ink-muted)' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
                    Back
                </button>

                <div className="text-center">
                    <span className="text-xs font-semibold uppercase tracking-widest block mb-2" style={{ color: 'var(--color-ink-faint)' }}>
                        Lesson {lesson.number}
                    </span>
                    <h1 className="text-3xl font-bold mb-3" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ink)' }}>
                        {lesson.title}
                    </h1>
                    <p className="text-sm mb-4" style={{ color: 'var(--color-ink-muted)' }}>
                        {lesson.subtitle}
                    </p>
                    <Divider />
                    <p className="text-base italic my-6" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ink-secondary)' }}>
                        "{lesson.mood}"
                    </p>
                    <Divider />
                    <p className="text-sm mt-4 mb-2" style={{ color: 'var(--color-ink-muted)' }}>
                        {events.length} events to discover
                    </p>
                    <p className="text-xs mb-6" style={{ color: 'var(--color-ink-faint)' }}>
                        Learn {CHUNK_SIZE} events at a time, then test your knowledge
                    </p>
                    <Mascot mood="happy" size={64} />
                    <div className="mt-6">
                        <Button onClick={() => {
                            setPhase(PHASE.CHUNK_LEARN);
                            setChunkIndex(0);
                            setCardIndexInChunk(0);
                            dispatch({ type: 'MARK_EVENTS_SEEN', eventIds: lesson.eventIds });
                        }}>
                            Begin Learning
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    // ─── CHUNK LEARN (Show 2 cards) ────────────────────
    if (phase === PHASE.CHUNK_LEARN) {
        const event = currentChunk[cardIndexInChunk];
        if (!event) {
            // Finished showing cards in this chunk, start quiz
            const qs = generateQuizForEvents(currentChunk);
            setChunkQuizQuestions(qs);
            setCurrentQuizIndex(0);
            setPhase(PHASE.CHUNK_QUIZ);
            return null;
        }

        const nearbyEvents = ALL_EVENTS
            .filter(e => e.id !== event.id && state.seenEvents.includes(e.id))
            .map(e => ({ ...e, distance: Math.abs(e.year - event.year) }))
            .sort((a, b) => a.distance - b.distance)
            .slice(0, 2);

        const globalCardNum = chunkIndex * CHUNK_SIZE + cardIndexInChunk + 1;

        return (
            <div className="py-4 animate-fade-in">
                <div className="flex items-center justify-between mb-4">
                    <button onClick={onComplete} className="text-sm flex items-center gap-1" style={{ color: 'var(--color-ink-muted)' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
                        Exit
                    </button>
                    <span className="text-sm font-medium" style={{ color: 'var(--color-ink-muted)' }}>
                        Card {globalCardNum} of {events.length}
                    </span>
                </div>

                <ProgressBar value={globalCardNum} max={events.length} />

                <div className="text-center mt-2 mb-1">
                    <span className="text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: 'var(--color-burgundy-soft)', color: 'var(--color-burgundy)' }}>
                        Study — Set {chunkIndex + 1} of {chunks.length}
                    </span>
                </div>

                <div className="mt-4 animate-slide-in-right" key={event.id}>
                    <Card>
                        <CategoryTag category={event.category} />
                        <h2 className="text-xl font-bold mt-3 mb-2 leading-snug" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ink)' }}>
                            {event.title}
                        </h2>
                        <p className="text-lg font-semibold mb-3" style={{ color: 'var(--color-burgundy)' }}>
                            {event.date}
                        </p>
                        <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--color-ink-secondary)' }}>
                            {event.description}
                        </p>
                        <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--color-ink-muted)' }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                            </svg>
                            {event.location.place}
                        </div>

                        {nearbyEvents.length > 0 && (
                            <div className="mt-4 pt-3" style={{ borderTop: '1px solid rgba(28, 25, 23, 0.06)' }}>
                                <p className="text-[11px] uppercase tracking-wider font-semibold mb-2" style={{ color: 'var(--color-ink-faint)' }}>
                                    Nearby on the Timeline
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
                    </Card>
                </div>

                <div className="flex gap-3 mt-6">
                    {cardIndexInChunk > 0 && (
                        <Button variant="secondary" onClick={() => setCardIndexInChunk(i => i - 1)}>
                            ← Back
                        </Button>
                    )}
                    <Button
                        className="flex-1"
                        onClick={() => setCardIndexInChunk(i => i + 1)}
                    >
                        {cardIndexInChunk < currentChunk.length - 1 ? 'Next →' : 'Start Quiz →'}
                    </Button>
                </div>
            </div>
        );
    }

    // ─── CHUNK QUIZ (Quiz on current 2 cards, randomized) ─────
    if (phase === PHASE.CHUNK_QUIZ) {
        const q = chunkQuizQuestions[currentQuizIndex];
        if (!q) {
            // Finished this chunk's quiz
            const nextChunk = chunkIndex + 1;
            if (nextChunk < chunks.length) {
                // More chunks to learn
                setChunkIndex(nextChunk);
                setCardIndexInChunk(0);
                setPhase(PHASE.CHUNK_LEARN);
            } else {
                // All chunks done — go to final review if there are hard ones
                if (hardResults.length > 0) {
                    setReviewIndex(0);
                    setCurrentQuizIndex(0);
                    setPhase(PHASE.FINAL_REVIEW);
                } else {
                    setPhase(PHASE.SUMMARY);
                }
            }
            return null;
        }

        return (
            <div className="py-4 animate-fade-in" key={`quiz-${chunkIndex}-${currentQuizIndex}`}>
                <div className="flex items-center justify-between mb-4">
                    <span className="text-sm" style={{ color: 'var(--color-ink-muted)' }}>
                        Quiz — Set {chunkIndex + 1}
                    </span>
                    <span className="text-sm font-medium" style={{ color: 'var(--color-ink-muted)' }}>
                        {currentQuizIndex + 1} / {chunkQuizQuestions.length}
                    </span>
                </div>
                <ProgressBar value={answeredQuestions + currentQuizIndex + 1} max={totalQuestions} />

                <div className="mt-6">
                    <QuizQuestion
                        question={q}
                        lessonEventIds={lesson.eventIds}
                        onAnswer={(score) => {
                            setQuizResults(prev => [...prev, {
                                eventId: q.event.id,
                                questionType: q.type,
                                firstScore: score,
                                retryScore: null,
                            }]);
                            dispatch({
                                type: 'UPDATE_EVENT_MASTERY',
                                eventId: q.event.id,
                                questionType: q.type,
                                score,
                            });
                        }}
                        onNext={() => setCurrentQuizIndex(i => i + 1)}
                    />
                </div>
            </div>
        );
    }

    // ─── FINAL REVIEW (re-show hard events + retry reds) ──────
    if (phase === PHASE.FINAL_REVIEW) {
        // First, re-show yellow/red event cards, then retry red questions
        const hardEvents = [...new Set(hardResults.map(r => r.eventId))]
            .map(id => events.find(e => e.id === id))
            .filter(Boolean);

        // Phase 1: Review hard event cards
        if (reviewIndex < hardEvents.length) {
            const event = hardEvents[reviewIndex];
            const eventResults = hardResults.filter(r => r.eventId === event.id);
            const worstScore = eventResults.some(r => r.firstScore === 'red') ? 'red' : 'yellow';
            const borderColor = worstScore === 'red' ? 'var(--color-error)' : 'var(--color-warning)';

            return (
                <div className="py-4 animate-fade-in">
                    <div className="text-center mb-4">
                        <Mascot mood={worstScore === 'red' ? 'surprised' : 'thinking'} size={50} />
                        <p className="text-sm font-semibold mt-2" style={{ color: borderColor }}>
                            {worstScore === 'red' ? "Let's review this one" : "Almost had it — one more look"}
                        </p>
                        <span className="text-xs" style={{ color: 'var(--color-ink-muted)' }}>
                            Review {reviewIndex + 1} of {hardEvents.length}
                        </span>
                    </div>

                    <Card className="animate-slide-in-right" key={event.id}
                        style={{ borderLeft: `3px solid ${borderColor}` }}>
                        <CategoryTag category={event.category} />
                        <h2 className="text-xl font-bold mt-3 mb-2" style={{ fontFamily: 'var(--font-serif)' }}>{event.title}</h2>
                        <p className="text-lg font-semibold mb-3" style={{ color: 'var(--color-burgundy)' }}>{event.date}</p>
                        <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--color-ink-secondary)' }}>{event.description}</p>
                        <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--color-ink-muted)' }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                            </svg>
                            {event.location.place}
                        </div>
                    </Card>

                    <div className="mt-6">
                        <Button className="w-full" onClick={() => setReviewIndex(i => i + 1)}>
                            {reviewIndex < hardEvents.length - 1 ? 'Next Review →' : (redResults.length > 0 ? 'Retry Missed Questions →' : 'See Results →')}
                        </Button>
                    </div>
                </div>
            );
        }

        // Phase 2: Retry red questions
        if (redResults.length > 0) {
            const retryQuestions = redResults.map(r => ({
                event: events.find(e => e.id === r.eventId),
                type: r.questionType,
                key: `retry-${r.eventId}-${r.questionType}`,
            })).filter(q => q.event);

            const rq = retryQuestions[currentQuizIndex];
            if (!rq) {
                setPhase(PHASE.SUMMARY);
                return null;
            }

            return (
                <div className="py-4 animate-fade-in" key={`retry-${currentQuizIndex}`}>
                    <div className="text-center mb-4">
                        <Mascot mood="thinking" size={50} />
                        <p className="text-sm font-semibold mt-2" style={{ color: 'var(--color-error)' }}>
                            Try again
                        </p>
                        <span className="text-xs" style={{ color: 'var(--color-ink-muted)' }}>
                            {currentQuizIndex + 1} of {retryQuestions.length}
                        </span>
                    </div>

                    <QuizQuestion
                        question={rq}
                        lessonEventIds={lesson.eventIds}
                        onAnswer={(score) => {
                            setQuizResults(prev => prev.map(r =>
                                r.eventId === rq.event.id && r.questionType === rq.type && r.firstScore === 'red' && !r.retryScore
                                    ? { ...r, retryScore: score }
                                    : r
                            ));
                            dispatch({
                                type: 'UPDATE_EVENT_MASTERY',
                                eventId: rq.event.id,
                                questionType: rq.type,
                                score,
                            });
                        }}
                        onNext={() => setCurrentQuizIndex(i => i + 1)}
                    />
                </div>
            );
        }

        // No red questions, go to summary
        setPhase(PHASE.SUMMARY);
        return null;
    }

    // ─── SUMMARY ──────────────────────────────────────
    if (phase === PHASE.SUMMARY) {
        const xp = calculateXP(quizResults);
        const greenCount = quizResults.filter(r => r.firstScore === 'green').length;
        const yellowCount = quizResults.filter(r => r.firstScore === 'yellow').length;
        const redCount = quizResults.filter(r => r.firstScore === 'red').length;
        const allPassed = redCount === 0 || quizResults.every(r => r.firstScore !== 'red' || (r.retryScore && r.retryScore !== 'red'));

        const handleContinue = () => {
            if (allPassed) {
                dispatch({ type: 'COMPLETE_LESSON', lessonId: lesson.id });
            }
            dispatch({ type: 'ADD_XP', amount: xp });
            onComplete();
        };

        return (
            <div className="py-8 text-center animate-fade-in">
                <Mascot mood={allPassed ? 'celebrating' : 'thinking'} size={80} />

                <h2 className="text-2xl font-bold mt-4 mb-1" style={{ fontFamily: 'var(--font-serif)' }}>
                    {allPassed ? 'Lesson Complete!' : 'Keep Practicing'}
                </h2>
                <p className="text-sm mb-6" style={{ color: 'var(--color-ink-muted)' }}>
                    {lesson.title}
                </p>

                <Card className={allPassed ? 'animate-celebration' : ''} style={{
                    borderTop: allPassed ? '3px solid var(--color-success)' : '3px solid var(--color-warning)',
                }}>
                    <div className="text-sm font-semibold mb-3" style={{ color: 'var(--color-ink-secondary)' }}>
                        {events.length} events studied
                    </div>

                    <div className="flex items-center gap-1 mb-4 justify-center flex-wrap">
                        {quizResults.map((r, i) => (
                            <div key={i} className="w-2.5 h-2.5 rounded-full"
                                style={{
                                    backgroundColor: r.firstScore === 'green' ? 'var(--color-success)' :
                                        r.firstScore === 'yellow' ? 'var(--color-warning)' : 'var(--color-error)'
                                }} />
                        ))}
                    </div>

                    <div className="grid grid-cols-3 gap-3 text-center mb-4">
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

                    <Divider />

                    <div className="flex items-center justify-center gap-2 mt-2">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-bronze)" strokeWidth="2">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="var(--color-bronze-light)" />
                        </svg>
                        <span className="text-xl font-bold" style={{ color: 'var(--color-burgundy)' }}>+{xp} XP</span>
                    </div>
                </Card>

                <div className="mt-6">
                    <Button className="w-full" onClick={handleContinue}>
                        Continue
                    </Button>
                </div>
            </div>
        );
    }

    return null;
}

// ─── QUIZ QUESTION COMPONENT ─────────────────────────
function QuizQuestion({ question, lessonEventIds, onAnswer, onNext }) {
    const { event, type } = question;
    const [answered, setAnswered] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [score, setScore] = useState(null);

    // Date input state — SINGLE number input for all events
    const [dateInput, setDateInput] = useState('');
    const [era, setEra] = useState(event.year < 0 ? 'BCE' : 'CE');

    // MCQ options (memoized once)
    const [locationOptions] = useState(() => generateLocationOptions(event));
    const [whatOptions] = useState(() => generateWhatOptions(event, lessonEventIds));

    const handleMCQAnswer = useCallback((answer, correct) => {
        if (answered) return;
        setSelectedAnswer(answer);
        const s = answer === correct ? 'green' : 'red';
        setScore(s);
        setAnswered(true);
        onAnswer(s);
    }, [answered, onAnswer]);

    const handleDateSubmit = useCallback(() => {
        if (answered) return;
        const userYear = parseInt(dateInput);
        if (isNaN(userYear)) return;

        // Convert user input to internal year (negative for BCE)
        const actualYear = era === 'BCE' ? -Math.abs(userYear) : Math.abs(userYear);

        // For range events: green if within range, otherwise score by distance
        const s = scoreDateAnswer(Math.abs(userYear), era, event);
        setScore(s);
        setAnswered(true);
        onAnswer(s);
    }, [answered, dateInput, era, event, onAnswer]);

    const scoreColors = {
        green: { bg: 'rgba(5, 150, 105, 0.08)', border: 'var(--color-success)' },
        yellow: { bg: 'rgba(198, 134, 42, 0.08)', border: 'var(--color-warning)' },
        red: { bg: 'rgba(166, 61, 61, 0.08)', border: 'var(--color-error)' },
    };

    // ─ LOCATION MCQ ─
    if (type === 'location') {
        return (
            <div className="animate-slide-in-right">
                <Card style={answered && score ? { backgroundColor: scoreColors[score].bg, borderLeft: `3px solid ${scoreColors[score].border}` } : {}}>
                    <p className="text-xs uppercase tracking-wider font-semibold mb-2" style={{ color: 'var(--color-ink-faint)' }}>
                        Where did this happen?
                    </p>
                    <h3 className="text-lg font-bold mb-1" style={{ fontFamily: 'var(--font-serif)' }}>{event.title}</h3>
                    <p className="text-sm mb-4" style={{ color: 'var(--color-burgundy)' }}>{event.date}</p>

                    <div className="space-y-2">
                        {locationOptions.map((opt, i) => {
                            const isCorrect = opt === event.location.place;
                            const isSelected = selectedAnswer === opt;
                            let optStyle = {};
                            if (answered) {
                                if (isCorrect) optStyle = { backgroundColor: 'rgba(5, 150, 105, 0.1)', borderColor: 'var(--color-success)' };
                                else if (isSelected && !isCorrect) optStyle = { backgroundColor: 'rgba(166, 61, 61, 0.1)', borderColor: 'var(--color-error)' };
                            }
                            return (
                                <button
                                    key={i}
                                    onClick={() => handleMCQAnswer(opt, event.location.place)}
                                    disabled={answered}
                                    className="w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all duration-200"
                                    style={{
                                        borderColor: isSelected && !answered ? 'var(--color-burgundy)' : 'rgba(28, 25, 23, 0.08)',
                                        backgroundColor: 'var(--color-card)',
                                        ...optStyle,
                                    }}
                                >
                                    {opt}
                                    {answered && isCorrect && (
                                        <span className="ml-2 text-xs" style={{ color: 'var(--color-success)' }}>✓</span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </Card>

                {answered && (
                    <div className="mt-4">
                        <Button className="w-full" onClick={onNext}>Continue →</Button>
                    </div>
                )}
            </div>
        );
    }

    // ─ DATE INPUT — always single number ─
    if (type === 'date') {
        const isRange = event.yearEnd != null;
        const hint = isRange
            ? `This event spans a period — enter any year within the range`
            : (Math.abs(event.year) > 100000 ? 'Approximate is fine' : '');

        return (
            <div className="animate-slide-in-right">
                <Card style={answered && score ? { backgroundColor: scoreColors[score].bg, borderLeft: `3px solid ${scoreColors[score].border}` } : {}}>
                    <p className="text-xs uppercase tracking-wider font-semibold mb-2" style={{ color: 'var(--color-ink-faint)' }}>
                        When did this happen?
                    </p>
                    <h3 className="text-lg font-bold mb-1" style={{ fontFamily: 'var(--font-serif)' }}>{event.title}</h3>
                    <p className="text-sm mb-2 leading-relaxed" style={{ color: 'var(--color-ink-secondary)' }}>
                        {event.description.substring(0, 100)}…
                    </p>
                    {hint && (
                        <p className="text-xs italic mb-3" style={{ color: 'var(--color-ink-faint)' }}>
                            {hint}
                        </p>
                    )}

                    {!answered ? (
                        <>
                            <div>
                                <label className="text-xs font-semibold mb-1 block" style={{ color: 'var(--color-ink-muted)' }}>
                                    Year
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        value={dateInput}
                                        onChange={e => setDateInput(e.target.value)}
                                        placeholder="e.g. 1453"
                                        className="flex-1 px-4 py-3 rounded-xl border-2 text-sm font-medium outline-none transition-colors"
                                        style={{
                                            borderColor: 'rgba(28, 25, 23, 0.1)',
                                            backgroundColor: 'var(--color-card)',
                                            color: 'var(--color-ink)',
                                        }}
                                        onFocus={e => e.target.style.borderColor = 'var(--color-burgundy)'}
                                        onBlur={e => e.target.style.borderColor = 'rgba(28, 25, 23, 0.1)'}
                                    />
                                    <div className="flex rounded-xl border-2 overflow-hidden" style={{ borderColor: 'rgba(28, 25, 23, 0.1)' }}>
                                        {['BCE', 'CE'].map(e => (
                                            <button
                                                key={e}
                                                onClick={() => setEra(e)}
                                                className="px-3 py-2 text-xs font-bold transition-colors"
                                                style={{
                                                    backgroundColor: era === e ? 'var(--color-burgundy)' : 'transparent',
                                                    color: era === e ? 'white' : 'var(--color-ink-muted)',
                                                }}
                                            >
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
                            </div>
                        </>
                    ) : (
                        <div className="mt-2">
                            <p className="text-sm font-semibold mb-1" style={{
                                color: score === 'green' ? 'var(--color-success)' : score === 'yellow' ? 'var(--color-warning)' : 'var(--color-error)'
                            }}>
                                {score === 'green' ? 'Excellent!' : score === 'yellow' ? 'Close!' : 'Not quite'}
                            </p>
                            <p className="text-sm" style={{ color: 'var(--color-ink-secondary)' }}>
                                <strong>{event.title}</strong> — <strong style={{ color: 'var(--color-burgundy)' }}>{event.date}</strong>
                            </p>
                        </div>
                    )}
                </Card>

                {answered && (
                    <div className="mt-4">
                        <Button className="w-full" onClick={onNext}>Continue →</Button>
                    </div>
                )}
            </div>
        );
    }

    // ─ WHAT HAPPENED MCQ ─
    if (type === 'what') {
        return (
            <div className="animate-slide-in-right">
                <Card style={answered && score ? { backgroundColor: scoreColors[score].bg, borderLeft: `3px solid ${scoreColors[score].border}` } : {}}>
                    <p className="text-xs uppercase tracking-wider font-semibold mb-2" style={{ color: 'var(--color-ink-faint)' }}>
                        What happened?
                    </p>
                    <p className="text-lg font-semibold mb-1" style={{ color: 'var(--color-burgundy)' }}>{event.date}</p>
                    <p className="text-sm mb-4" style={{ color: 'var(--color-ink-muted)' }}>
                        {event.location.region}
                    </p>

                    <div className="space-y-2">
                        {whatOptions.map((opt, i) => {
                            const isCorrect = opt.id === event.id;
                            const isSelected = selectedAnswer === opt.id;
                            let optStyle = {};
                            if (answered) {
                                if (isCorrect) optStyle = { backgroundColor: 'rgba(5, 150, 105, 0.1)', borderColor: 'var(--color-success)' };
                                else if (isSelected && !isCorrect) optStyle = { backgroundColor: 'rgba(166, 61, 61, 0.1)', borderColor: 'var(--color-error)' };
                            }
                            return (
                                <button
                                    key={i}
                                    onClick={() => handleMCQAnswer(opt.id, event.id)}
                                    disabled={answered}
                                    className="w-full text-left px-4 py-3 rounded-xl border-2 text-sm transition-all duration-200"
                                    style={{
                                        borderColor: isSelected && !answered ? 'var(--color-burgundy)' : 'rgba(28, 25, 23, 0.08)',
                                        backgroundColor: 'var(--color-card)',
                                        ...optStyle,
                                    }}
                                >
                                    <span className="font-semibold">{opt.title}</span>
                                    {answered && isCorrect && (
                                        <span className="ml-2 text-xs" style={{ color: 'var(--color-success)' }}>✓</span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </Card>

                {answered && (
                    <div className="mt-4">
                        <Button className="w-full" onClick={onNext}>Continue →</Button>
                    </div>
                )}
            </div>
        );
    }

    return null;
}
