import { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { ERA_QUIZ_GROUPS } from '../../data/lessons';
import { generatePlacementQuestions, scorePlacementQuiz, getNextPlacementEra, isPlacementQuizUnlocked } from '../../data/placementQuiz';
import { generateLocationOptions, generateWhatOptions, generateDateMCQOptions, generateDescriptionOptions, generateEraOptions, SCORE_COLORS, getScoreColor, getScoreLabel, scoreDateAnswer, shuffle } from '../../data/quiz';
import { getEraForYear, ERA_RANGES } from '../../data/events';
import { Card, Button, ProgressBar } from '../shared';
import Mascot from '../Mascot';
import * as feedback from '../../services/feedback';

// SVG era icons — replace emoji to avoid rendering issues on Android
const EraIcon = ({ type, size = 20, color }) => {
    const c = color || '#666';
    const icons = {
        prehistory: (
            <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 10c0-1.5 1-2.5 2-3 .5-1.5-.5-3-2-3.5S2 4 2.5 5.5c-1 .5-1.5 2-.5 3s2.5 1 3 1.5z" fill={c} opacity="0.15" />
                <path d="M19 14c0 1.5-1 2.5-2 3-.5 1.5.5 3 2 3.5s3-.5 2.5-2c1-.5 1.5-2 .5-3s-2.5-1-3-1.5z" fill={c} opacity="0.15" />
                <line x1="7" y1="9" x2="17" y2="15" />
            </svg>
        ),
        ancient: (
            <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 21h18M5 21V7l7-4 7 4v14" fill={c} opacity="0.1" />
                <line x1="9" y1="21" x2="9" y2="10" />
                <line x1="15" y1="21" x2="15" y2="10" />
                <path d="M5 7l7-4 7 4" />
                <line x1="3" y1="21" x2="21" y2="21" />
            </svg>
        ),
        medieval: (
            <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 3l14 14M9.5 7.5L5 3M19 3L5 17" />
                <path d="M14.5 7.5L19 3" />
                <path d="M5 17l2 2 2-2" />
                <path d="M19 17l-2 2-2-2" />
            </svg>
        ),
        earlymodern: (
            <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" fill={c} opacity="0.08" />
                <polygon points="16.24,7.76 14.12,14.12 7.76,16.24 9.88,9.88" fill={c} opacity="0.2" stroke={c} />
                <line x1="12" y1="3" x2="12" y2="5" />
                <line x1="12" y1="19" x2="12" y2="21" />
                <line x1="3" y1="12" x2="5" y2="12" />
                <line x1="19" y1="12" x2="21" y2="12" />
            </svg>
        ),
        modern: (
            <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" fill={c} opacity="0.08" />
                <ellipse cx="12" cy="12" rx="4" ry="9" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <path d="M4.5 7.5h15M4.5 16.5h15" />
            </svg>
        ),
    };
    return icons[type] || null;
};

// Period icons/colors for era selection
const ERA_STYLE = {
    prehistory: { iconType: 'prehistory', color: '#9E4A4A' },
    ancient: { iconType: 'ancient', color: '#7A6B50' },
    medieval: { iconType: 'medieval', color: '#B06A30' },
    earlymodern: { iconType: 'earlymodern', color: '#9A8528' },
    modern: { iconType: 'modern', color: '#B09035' },
};

export default function PlacementQuizFlow({ onComplete, initialEra }) {
    const { state, dispatch } = useApp();
    const [activeEra, setActiveEra] = useState(initialEra || null);
    const [questions, setQuestions] = useState(() => initialEra ? generatePlacementQuestions(initialEra) : []);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [viewIndex, setViewIndex] = useState(0);
    const [results, setResults] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [quizScore, setQuizScore] = useState(null);

    const nextEra = useMemo(() => getNextPlacementEra(state.placementQuizzes), [state.placementQuizzes]);

    const startQuiz = (eraId) => {
        const qs = generatePlacementQuestions(eraId);
        setActiveEra(eraId);
        setQuestions(qs);
        setCurrentIndex(0);
        setViewIndex(0);
        setResults([]);
        setShowResults(false);
        setQuizScore(null);
    };

    const handleAnswer = (score, selectedAnswer, options) => {
        setResults(prev => [...prev, { score, selectedAnswer, options }]);
        feedback.forScore(score);
    };

    const handleNext = () => {
        if (currentIndex + 1 >= questions.length) {
            // Quiz complete
            const scored = scorePlacementQuiz(activeEra, results);
            setQuizScore(scored);
            dispatch({
                type: 'COMPLETE_PLACEMENT_QUIZ',
                eraId: activeEra,
                passed: scored.passed,
                score: scored.score,
                maxScore: scored.maxScore,
            });
            setShowResults(true);
            feedback.complete();
        } else {
            setCurrentIndex(i => i + 1);
            setViewIndex(currentIndex + 1);
        }
    };

    const handleContinue = () => {
        if (initialEra) {
            onComplete();
            return;
        }
        if (quizScore?.passed) {
            // Check if there's a next era
            const updated = { ...state.placementQuizzes, [activeEra]: { passed: true } };
            const next = getNextPlacementEra(updated);
            if (next) {
                startQuiz(next.id);
            } else {
                // All eras passed
                dispatch({ type: 'SET_ONBOARDING_STEP', step: 'complete' });
                onComplete();
            }
        } else {
            // Failed — go back to era picker or finish
            setActiveEra(null);
            setShowResults(false);
        }
    };

    // ─── Results screen ───
    if (showResults && quizScore) {
        const group = ERA_QUIZ_GROUPS.find(g => g.id === activeEra);
        const greenCount = results.filter(r => r.score === 'green').length;
        const yellowCount = results.filter(r => r.score === 'yellow').length;
        const redCount = results.filter(r => r.score === 'red').length;

        return (
            <div className="lesson-flow-container animate-fade-in">
                <div className="flex-1 min-h-0 overflow-y-auto">
                    <div className="py-6 text-center">
                        <Mascot mood={quizScore.passed ? 'celebrating' : 'thinking'} size={70} />
                        <h2 className="text-2xl font-bold mt-4 mb-1" style={{ fontFamily: 'var(--font-serif)' }}>
                            {quizScore.passed ? 'Passed!' : 'Not quite'}
                        </h2>
                        <p className="text-sm mb-1" style={{ color: 'var(--color-ink-muted)' }}>
                            {group?.label} · {quizScore.score} / {quizScore.maxScore} points
                        </p>
                        {quizScore.passed ? (
                            <p className="text-sm mt-3 px-4" style={{ color: 'var(--color-success)' }}>
                                Lessons {group.lessonIds.map(id => id.replace('lesson-', '')).join(', ')} unlocked!
                            </p>
                        ) : (
                            <p className="text-sm mt-3 px-4" style={{ color: 'var(--color-ink-secondary)' }}>
                                You need {group?.passThreshold}+ points to pass. You'll start learning from these lessons.
                            </p>
                        )}

                        <Card className="mt-5">
                            <div className="flex items-center gap-1 mb-4 justify-center flex-wrap">
                                {results.map((r, i) => (
                                    <div key={i} className="w-2.5 h-2.5 rounded-full" style={{
                                        backgroundColor: r.score === 'green' ? 'var(--color-success)' :
                                            r.score === 'yellow' ? 'var(--color-warning)' : 'var(--color-error)'
                                    }} />
                                ))}
                            </div>
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
                    </div>
                </div>

                <div className="flex-shrink-0 flex gap-3 pt-4 pb-2">
                    {quizScore.passed ? (
                        <Button className="flex-1" onClick={handleContinue}>
                            {initialEra ? 'Done' : (getNextPlacementEra({ ...state.placementQuizzes, [activeEra]: { passed: true } })
                                ? 'Next Era →' : 'Finish')}
                        </Button>
                    ) : (
                        <>
                            <Button variant="secondary" onClick={() => {
                                if (!initialEra) dispatch({ type: 'SET_ONBOARDING_STEP', step: 'complete' });
                                onComplete();
                            }}>
                                {initialEra ? 'Back' : 'Start Learning'}
                            </Button>
                            <Button className="flex-1" onClick={() => startQuiz(activeEra)}>
                                Retry
                            </Button>
                        </>
                    )}
                </div>
            </div>
        );
    }

    // ─── Quiz session ───
    if (activeEra && questions.length > 0 && !showResults) {
        const isReviewing = viewIndex < currentIndex;
        const q = questions[viewIndex];
        const reviewResult = isReviewing ? results[viewIndex] : null;
        return (
            <div className="lesson-flow-container animate-fade-in">
                <div className="flex-shrink-0 pt-4">
                    <div className="flex items-center justify-center mb-3 relative">
                        <button onClick={() => initialEra ? onComplete() : setActiveEra(null)} className="text-sm flex items-center gap-1 absolute left-0"
                            style={{ color: 'var(--color-ink-muted)' }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="15 18 9 12 15 6" />
                            </svg>
                            Exit
                        </button>
                        <span className="text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full"
                            style={{ backgroundColor: 'var(--color-burgundy-soft)', color: 'var(--color-burgundy)' }}>
                            {isReviewing ? 'Reviewing' : 'Placement'} · {viewIndex + 1}/{questions.length}
                        </span>
                    </div>
                    <ProgressBar value={currentIndex + 1} max={questions.length} />
                </div>

                <div className="flex-1 min-h-0 overflow-y-auto">
                    <div className="mt-4" key={`placement-q-${viewIndex}`}>
                        <PlacementQuestion
                            question={q}
                            onAnswer={handleAnswer}
                            onNext={handleNext}
                            reviewMode={isReviewing}
                            reviewResult={reviewResult}
                        />
                    </div>
                </div>

                {/* Previous / Back to current navigation */}
                <div className="flex-shrink-0 flex items-center justify-between pt-2 pb-1">
                    {viewIndex > 0 ? (
                        <button
                            onClick={() => setViewIndex(i => i - 1)}
                            className="text-xs flex items-center gap-1 py-1.5 px-2 rounded-lg"
                            style={{ color: 'var(--color-ink-muted)' }}
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="15 18 9 12 15 6" />
                            </svg>
                            Previous
                        </button>
                    ) : <div />}
                    {isReviewing && (
                        <button
                            onClick={() => setViewIndex(currentIndex)}
                            className="text-xs flex items-center gap-1 py-1.5 px-2 rounded-lg font-semibold"
                            style={{ color: 'var(--color-burgundy)' }}
                        >
                            Back to Q{currentIndex + 1}
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="9 18 15 12 9 6" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>
        );
    }

    // ─── Era selection screen ───
    return (
        <div className="py-6 animate-fade-in">
            <div className="text-center mb-6">
                <h2 className="text-xl font-bold" style={{ fontFamily: 'var(--font-serif)' }}>Placement Quizzes</h2>
                <p className="text-xs mt-1" style={{ color: 'var(--color-ink-muted)' }}>
                    Score 9+ to skip an era's lessons
                </p>
            </div>

            <div className="space-y-3">
                {ERA_QUIZ_GROUPS.map((group) => {
                    const quizResult = state.placementQuizzes[group.id];
                    const passed = quizResult?.passed;
                    const unlocked = isPlacementQuizUnlocked(group.id, state.placementQuizzes);
                    const isNext = nextEra?.id === group.id;
                    const style = ERA_STYLE[group.id] || {};

                    return (
                        <Card
                            key={group.id}
                            onClick={unlocked && !passed ? () => startQuiz(group.id) : undefined}
                            className={`p-4 ${!unlocked ? 'opacity-40' : ''}`}
                            style={{
                                borderLeft: passed ? '3px solid var(--color-success)'
                                    : isNext ? '3px solid var(--color-burgundy)'
                                        : '3px solid transparent',
                            }}
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                                    style={{ backgroundColor: passed ? 'rgba(5,150,105,0.1)' : `${style.color}15` }}>
                                    {passed
                                        ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="2.5">
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                        : <EraIcon type={style.iconType} size={20} color={style.color} />
                                    }
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-sm font-bold" style={{ fontFamily: 'var(--font-serif)' }}>{group.label}</h3>
                                    <p className="text-xs mt-0.5" style={{ color: 'var(--color-ink-muted)' }}>
                                        {passed
                                            ? `Passed · ${quizResult.score}/${quizResult.maxScore} points`
                                            : `${group.questionCount} questions · ${group.lessonIds.length} lessons`}
                                    </p>
                                </div>
                                {unlocked && !passed && (
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-ink-faint)" strokeWidth="2">
                                        <polyline points="9 18 15 12 9 6" />
                                    </svg>
                                )}
                                {!unlocked && (
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-ink-faint)" strokeWidth="2">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                    </svg>
                                )}
                            </div>
                        </Card>
                    );
                })}
            </div>

            <div className="mt-6 flex gap-3">
                <Button variant="secondary" className="flex-1" onClick={() => {
                    dispatch({ type: 'SET_ONBOARDING_STEP', step: 'complete' });
                    onComplete();
                }}>
                    Done
                </Button>
                {nextEra && (
                    <Button className="flex-1" onClick={() => startQuiz(nextEra.id)}>
                        Start {nextEra.label} →
                    </Button>
                )}
            </div>
        </div>
    );
}

// ─── Placement question — handles standard MCQ + challenge-style types ───
function PlacementQuestion({ question, onAnswer, onNext, reviewMode, reviewResult }) {
    const { type } = question;
    const event = question.event; // may be undefined for whichCameFirst
    const [answered, setAnswered] = useState(reviewMode || false);
    const [selectedAnswer, setSelectedAnswer] = useState(reviewMode ? reviewResult?.selectedAnswer : null);
    const [score, setScore] = useState(reviewMode ? reviewResult?.score : null);

    // Same-era pool for harder distractors (passed from question generator)
    const sameEraPool = question.sameEraEvents || [];

    // Pre-generate options (use saved options in review mode for consistency)
    const savedOpts = reviewMode ? reviewResult?.options : null;

    // Location: prefer same-region distractors from the era pool
    const [locationOpts] = useState(() => {
        if (type !== 'location') return [];
        if (savedOpts) return savedOpts;
        const pool = sameEraPool.length >= 4 ? [event, ...sameEraPool] : undefined;
        return generateLocationOptions(event, pool);
    });

    // What: use same-era + same-category events as distractors (not random)
    const [whatOpts] = useState(() => {
        if (type !== 'what') return [];
        if (savedOpts) return savedOpts;
        // Build pool of same-era events, preferring same category
        const sameCatEra = sameEraPool.filter(e => e.category === event.category && e.id !== event.id);
        const sameEraOther = sameEraPool.filter(e => e.category !== event.category && e.id !== event.id);
        const distractors = [...shuffle(sameCatEra), ...shuffle(sameEraOther)].slice(0, 3);
        if (distractors.length >= 3) {
            return shuffle([
                { id: event.id, title: event.title, description: event.description },
                ...distractors.map(e => ({ id: e.id, title: e.title, description: e.description })),
            ]);
        }
        // Fallback to standard generator with era event IDs
        return generateWhatOptions(event, sameEraPool.map(e => e.id));
    });

    // Description: difficulty 2 (plausible distractors) — harder than learn phase
    const [descOpts] = useState(() => type === 'description' ? (savedOpts || generateDescriptionOptions(event, sameEraPool.length >= 4 ? sameEraPool : undefined, 2)) : []);
    const [dateOpts] = useState(() => type === 'date' ? (savedOpts || generateDateMCQOptions(event)) : []);

    // Era detective: all 5 eras as options
    const [eraOpts] = useState(() => {
        if (type !== 'eraDetective' && type !== 'era') return [];
        if (savedOpts) return savedOpts;
        return generateEraOptions(event);
    });

    // Which came first: two events
    const eventA = question.eventA;
    const eventB = question.eventB;

    // Get current options for saving with the answer
    const currentOpts = type === 'location' ? locationOpts : type === 'what' ? whatOpts : type === 'description' ? descOpts : type === 'date' ? dateOpts : type === 'whichCameFirst' ? [eventA, eventB] : eraOpts;

    const handleMCQ = (answer, correct) => {
        if (answered) return;
        setSelectedAnswer(answer);
        const s = answer === correct ? 'green' : 'red';
        setScore(s);
        setAnswered(true);
        onAnswer(s, answer, currentOpts);
    };

    const handleDateMCQ = (opt) => {
        if (answered) return;
        setSelectedAnswer(opt.label);
        const s = opt.isCorrect ? 'green' : scoreDateAnswer(opt.year, opt.year < 0 ? 'BCE' : 'CE', event);
        setScore(s);
        setAnswered(true);
        onAnswer(s, opt.label, currentOpts);
    };

    const cardStyle = answered && score
        ? { backgroundColor: SCORE_COLORS[score].bg, borderLeft: `3px solid ${SCORE_COLORS[score].border}` }
        : {};

    const feedbackEl = answered && score && event && (
        <div className="mt-3 pt-3" style={{ borderTop: '1px solid rgba(var(--color-ink-rgb), 0.06)' }}>
            <p className="text-sm font-semibold" style={{ color: getScoreColor(score).border }}>
                {getScoreLabel(score)}
            </p>
            {score !== 'green' && (
                <div className="mt-2 text-xs leading-relaxed" style={{ color: 'var(--color-ink-secondary)' }}>
                    <strong>{event.title}</strong> — <span style={{ color: 'var(--color-burgundy)' }}>{event.date}</span>
                    {type === 'location' && <span> · {event.location.place}</span>}
                </div>
            )}
        </div>
    );

    // ─── Which Came First ───
    if (type === 'whichCameFirst' && eventA && eventB) {
        const earlierId = eventA.year <= eventB.year ? eventA.id : eventB.id;
        const wcfFeedback = answered && score && (
            <div className="mt-3 pt-3" style={{ borderTop: '1px solid rgba(var(--color-ink-rgb), 0.06)' }}>
                <p className="text-sm font-semibold" style={{ color: getScoreColor(score).border }}>
                    {getScoreLabel(score)}
                </p>
                {score !== 'green' && (
                    <div className="mt-2 text-xs leading-relaxed" style={{ color: 'var(--color-ink-secondary)' }}>
                        <strong>{eventA.title}</strong> ({eventA.date}) came {eventA.year <= eventB.year ? 'first' : 'after'}{' '}
                        <strong>{eventB.title}</strong> ({eventB.date})
                    </div>
                )}
            </div>
        );

        return (
            <div className="animate-slide-in-right">
                <Card style={cardStyle}>
                    <p className="text-xs uppercase tracking-wider font-semibold mb-3" style={{ color: 'var(--color-ink-faint)' }}>Which came first?</p>
                    <div className="mcq-options">
                        {[eventA, eventB].map((evt) => {
                            const isCorrect = evt.id === earlierId;
                            const isSelected = selectedAnswer === evt.id;
                            let s = {};
                            if (answered) {
                                if (isCorrect) s = { backgroundColor: 'rgba(5, 150, 105, 0.1)', borderColor: 'var(--color-success)' };
                                else if (isSelected) s = { backgroundColor: 'rgba(166, 61, 61, 0.1)', borderColor: 'var(--color-error)' };
                            }
                            return (
                                <button key={evt.id} onClick={() => handleMCQ(evt.id, earlierId)} disabled={answered}
                                    className="mcq-option" style={s}>
                                    <span className="font-semibold">{evt.title}</span>
                                    {answered && isCorrect && <span className="ml-2 text-xs" style={{ color: 'var(--color-success)' }}>{'\u2713'}</span>}
                                    {answered && <span className="block text-xs mt-0.5" style={{ color: 'var(--color-ink-muted)' }}>{evt.date}</span>}
                                </button>
                            );
                        })}
                    </div>
                    {wcfFeedback}
                </Card>
                {answered && !reviewMode && (
                    <div className="pinned-footer">
                        <Button className="w-full" onClick={onNext}>Continue \u2192</Button>
                    </div>
                )}
            </div>
        );
    }

    // ─── Era Detective ───
    if (type === 'eraDetective') {
        // Strip year hints from description for harder guessing
        const desc = (event.quizDescription || event.description || '').replace(/\b\d{3,4}\s*(BCE|CE|BC|AD)?\b/gi, '\u2026').substring(0, 120);
        const correctEra = getEraForYear(event.year);

        return (
            <div className="animate-slide-in-right">
                <Card style={cardStyle}>
                    <p className="text-xs uppercase tracking-wider font-semibold mb-2" style={{ color: 'var(--color-ink-faint)' }}>Which era does this belong to?</p>
                    <h3 className="text-xl font-bold mb-1" style={{ fontFamily: 'var(--font-serif)' }}>{event.title}</h3>
                    <p className="text-sm mb-5 leading-relaxed" style={{ color: 'var(--color-ink-secondary)' }}>
                        {desc}{desc.length >= 120 ? '\u2026' : ''}
                    </p>
                    <div className="mcq-options mcq-options--grid">
                        {eraOpts.map((opt, i) => {
                            const isCorrect = opt.isCorrect;
                            const isSelected = selectedAnswer === opt.id;
                            let s = {};
                            if (answered) {
                                if (isCorrect) s = { backgroundColor: 'rgba(5, 150, 105, 0.1)', borderColor: 'var(--color-success)' };
                                else if (isSelected && !isCorrect) s = { backgroundColor: 'rgba(166, 61, 61, 0.1)', borderColor: 'var(--color-error)' };
                            }
                            return (
                                <button key={i} onClick={() => handleMCQ(opt.id, eraOpts.find(o => o.isCorrect).id)} disabled={answered}
                                    className="mcq-option font-semibold" style={s}>
                                    {opt.label}
                                    {answered && isCorrect && <span className="ml-2 text-xs" style={{ color: 'var(--color-success)' }}>{'\u2713'}</span>}
                                </button>
                            );
                        })}
                    </div>
                    {answered && score && (
                        <div className="mt-3 pt-3" style={{ borderTop: '1px solid rgba(var(--color-ink-rgb), 0.06)' }}>
                            <p className="text-sm font-semibold" style={{ color: getScoreColor(score).border }}>
                                {getScoreLabel(score)}
                            </p>
                            {score !== 'green' && (
                                <div className="mt-2 text-xs leading-relaxed" style={{ color: 'var(--color-ink-secondary)' }}>
                                    <strong>{event.title}</strong> ({event.date}) belongs to the <strong>{correctEra.label}</strong> era
                                </div>
                            )}
                        </div>
                    )}
                </Card>
                {answered && !reviewMode && (
                    <div className="pinned-footer">
                        <Button className="w-full" onClick={onNext}>Continue \u2192</Button>
                    </div>
                )}
            </div>
        );
    }

    // ─── Location MCQ (same-region distractors) ───
    if (type === 'location') {
        return (
            <div className="animate-slide-in-right">
                <Card style={cardStyle}>
                    <p className="text-xs uppercase tracking-wider font-semibold mb-2" style={{ color: 'var(--color-ink-faint)' }}>Where did this happen?</p>
                    <h3 className="text-xl font-bold mb-1" style={{ fontFamily: 'var(--font-serif)' }}>{event.title}</h3>
                    <p className="text-sm mb-5" style={{ color: 'var(--color-burgundy)' }}>{event.date}</p>
                    <div className="mcq-options mcq-options--grid">
                        {locationOpts.map((opt, i) => {
                            const isCorrect = opt === event.location.place;
                            const isSelected = selectedAnswer === opt;
                            let s = {};
                            if (answered) {
                                if (isCorrect) s = { backgroundColor: 'rgba(5, 150, 105, 0.1)', borderColor: 'var(--color-success)' };
                                else if (isSelected) s = { backgroundColor: 'rgba(166, 61, 61, 0.1)', borderColor: 'var(--color-error)' };
                            }
                            return (
                                <button key={i} onClick={() => handleMCQ(opt, event.location.place)} disabled={answered}
                                    className="mcq-option" style={s}>
                                    {opt}{answered && isCorrect && <span className="ml-2 text-xs" style={{ color: 'var(--color-success)' }}>{'\u2713'}</span>}
                                </button>
                            );
                        })}
                    </div>
                    {feedbackEl}
                </Card>
                {answered && !reviewMode && (
                    <div className="pinned-footer">
                        <Button className="w-full" onClick={onNext}>Continue \u2192</Button>
                    </div>
                )}
            </div>
        );
    }

    // ─── Date MCQ ───
    if (type === 'date') {
        return (
            <div className="animate-slide-in-right">
                <Card style={cardStyle}>
                    <p className="text-xs uppercase tracking-wider font-semibold mb-2" style={{ color: 'var(--color-ink-faint)' }}>When did this happen?</p>
                    <h3 className="text-xl font-bold mb-1" style={{ fontFamily: 'var(--font-serif)' }}>{event.title}</h3>
                    <p className="text-sm mb-5 leading-relaxed" style={{ color: 'var(--color-ink-secondary)' }}>
                        {(event.quizDescription || event.description).substring(0, 80)}{'\u2026'}
                    </p>
                    <div className="mcq-options">
                        {dateOpts.map((opt, i) => {
                            const isSelected = selectedAnswer === opt.label;
                            let s = {};
                            if (answered) {
                                if (opt.isCorrect) s = { backgroundColor: 'rgba(5, 150, 105, 0.1)', borderColor: 'var(--color-success)' };
                                else if (isSelected) s = { backgroundColor: 'rgba(166, 61, 61, 0.1)', borderColor: 'var(--color-error)' };
                            }
                            return (
                                <button key={i} onClick={() => handleDateMCQ(opt)} disabled={answered}
                                    className="mcq-option" style={s}>
                                    {opt.label}{answered && opt.isCorrect && <span className="ml-2 text-xs" style={{ color: 'var(--color-success)' }}>{'\u2713'}</span>}
                                </button>
                            );
                        })}
                    </div>
                    {feedbackEl}
                </Card>
                {answered && !reviewMode && (
                    <div className="pinned-footer">
                        <Button className="w-full" onClick={onNext}>Continue \u2192</Button>
                    </div>
                )}
            </div>
        );
    }

    // ─── What happened? (same-era + same-category distractors) ───
    if (type === 'what') {
        return (
            <div className="animate-slide-in-right">
                <Card style={cardStyle}>
                    <p className="text-xs uppercase tracking-wider font-semibold mb-2" style={{ color: 'var(--color-ink-faint)' }}>What happened?</p>
                    <p className="text-xl font-semibold mb-1" style={{ color: 'var(--color-burgundy)' }}>{event.date}</p>
                    <p className="text-sm mb-5" style={{ color: 'var(--color-ink-muted)' }}>{event.location.region}</p>
                    <div className="mcq-options mcq-options--grid">
                        {whatOpts.map((opt, i) => {
                            const isCorrect = opt.id === event.id;
                            const isSelected = selectedAnswer === opt.id;
                            let s = {};
                            if (answered) {
                                if (isCorrect) s = { backgroundColor: 'rgba(5, 150, 105, 0.1)', borderColor: 'var(--color-success)' };
                                else if (isSelected) s = { backgroundColor: 'rgba(166, 61, 61, 0.1)', borderColor: 'var(--color-error)' };
                            }
                            return (
                                <button key={i} onClick={() => handleMCQ(opt.id, event.id)} disabled={answered}
                                    className="mcq-option" style={s}>
                                    <span className="font-semibold">{opt.title}</span>
                                    {answered && isCorrect && <span className="ml-2 text-xs" style={{ color: 'var(--color-success)' }}>{'\u2713'}</span>}
                                </button>
                            );
                        })}
                    </div>
                    {feedbackEl}
                </Card>
                {answered && !reviewMode && (
                    <div className="pinned-footer">
                        <Button className="w-full" onClick={onNext}>Continue \u2192</Button>
                    </div>
                )}
            </div>
        );
    }

    // ─── Description MCQ ───
    if (type === 'description') {
        return (
            <div className="animate-slide-in-right">
                <Card style={cardStyle}>
                    <p className="text-xs uppercase tracking-wider font-semibold mb-2" style={{ color: 'var(--color-ink-faint)' }}>Which description fits?</p>
                    <h3 className="text-xl font-bold mb-1" style={{ fontFamily: 'var(--font-serif)' }}>{event.title}</h3>
                    <p className="text-sm mb-5" style={{ color: 'var(--color-burgundy)' }}>{event.date}</p>
                    <div className="mcq-options">
                        {descOpts.map((opt, i) => {
                            const isCorrect = opt.isCorrect;
                            const isSelected = selectedAnswer === i;
                            let s = {};
                            if (answered) {
                                if (isCorrect) s = { backgroundColor: 'rgba(5, 150, 105, 0.1)', borderColor: 'var(--color-success)' };
                                else if (isSelected && !isCorrect) s = { backgroundColor: 'rgba(166, 61, 61, 0.1)', borderColor: 'var(--color-error)' };
                            }
                            return (
                                <button key={i} onClick={() => handleMCQ(i, descOpts.findIndex(o => o.isCorrect))} disabled={answered}
                                    className="mcq-option" style={s}>
                                    <span className="leading-relaxed text-sm block" style={{ color: 'var(--color-ink-secondary)' }}>{opt.description}</span>
                                    {answered && isCorrect && <span className="text-xs font-bold mt-1 block" style={{ color: 'var(--color-success)' }}>{'\u2713'} Correct</span>}
                                </button>
                            );
                        })}
                    </div>
                    {feedbackEl}
                </Card>
                {answered && !reviewMode && (
                    <div className="pinned-footer">
                        <Button className="w-full" onClick={onNext}>Continue \u2192</Button>
                    </div>
                )}
            </div>
        );
    }

    // ─── Era MCQ (legacy type, kept for backwards compat) ───
    if (type === 'era') {
        return (
            <div className="animate-slide-in-right">
                <Card style={cardStyle}>
                    <p className="text-xs uppercase tracking-wider font-semibold mb-2" style={{ color: 'var(--color-ink-faint)' }}>Which era?</p>
                    <h3 className="text-xl font-bold mb-1" style={{ fontFamily: 'var(--font-serif)' }}>{event.title}</h3>
                    <p className="text-sm mb-5 leading-relaxed" style={{ color: 'var(--color-ink-secondary)' }}>
                        {(event.quizDescription || event.description).substring(0, 80)}{'\u2026'}
                    </p>
                    <div className="mcq-options mcq-options--grid">
                        {eraOpts.map((opt, i) => {
                            const isCorrect = opt.isCorrect;
                            const isSelected = selectedAnswer === opt.id;
                            let s = {};
                            if (answered) {
                                if (isCorrect) s = { backgroundColor: 'rgba(5, 150, 105, 0.1)', borderColor: 'var(--color-success)' };
                                else if (isSelected && !isCorrect) s = { backgroundColor: 'rgba(166, 61, 61, 0.1)', borderColor: 'var(--color-error)' };
                            }
                            return (
                                <button key={i} onClick={() => handleMCQ(opt.id, eraOpts.find(o => o.isCorrect).id)} disabled={answered}
                                    className="mcq-option font-semibold" style={s}>
                                    {opt.label}
                                    {answered && isCorrect && <span className="ml-2 text-xs" style={{ color: 'var(--color-success)' }}>{'\u2713'}</span>}
                                </button>
                            );
                        })}
                    </div>
                    {feedbackEl}
                </Card>
                {answered && !reviewMode && (
                    <div className="pinned-footer">
                        <Button className="w-full" onClick={onNext}>Continue \u2192</Button>
                    </div>
                )}
            </div>
        );
    }

    return null;
}
