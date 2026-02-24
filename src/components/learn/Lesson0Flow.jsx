import { useState, useMemo, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { getEventById, ERA_BOUNDARY_EVENTS } from '../../data/events';
import { Card, Button, ProgressBar, Divider } from '../shared';
import Mascot from '../Mascot';

// ─── PHASES ────────────────────────────────────────────
const PHASE = {
    INTRO: 'intro',
    LEARN: 'learn',
    QUIZ: 'quiz',
    SUMMARY: 'summary',
};

// ─── Period data (the 5 "cards" for Lesson 0) ──────────
const PERIODS = [
    'prehistory', 'ancient', 'medieval', 'earlymodern', 'modern'
].map(id => {
    const info = {
        prehistory: { title: 'Prehistory', subtitle: 'c. 7 million years ago – c. 3200 BCE', description: 'The longest chapter in human history — from the first split with our ape ancestors through mastering fire, developing language, migrating across the globe, and eventually settling into farming communities.', color: '#0D9488', icon: '🦴' },
        ancient: { title: 'The Ancient World', subtitle: 'c. 3200 BCE – 500 CE', description: 'Writing is invented, cities rise, empires clash. From Sumer to Rome, humanity builds the foundations of law, philosophy, religion, and governance.', color: '#6B5B73', icon: '🏛️' },
        medieval: { title: 'The Medieval World', subtitle: '500 – 1500 CE', description: 'Empires fragment and reform. Faiths spread across continents, scholars preserve and advance knowledge, and horseback conquerors redraw the map of Eurasia.', color: '#A0522D', icon: '⚔️' },
        earlymodern: { title: 'The Early Modern Period', subtitle: '1500 – 1800 CE', description: 'Print breaks the monopoly on knowledge, ships connect every continent, and thinkers challenge the divine right of kings.', color: '#65774A', icon: '🧭' },
        modern: { title: 'The Modern World', subtitle: '1800 – Present', description: 'Industry, ideology, and information transform human life at accelerating speed. Two world wars reshape the global order, and digital networks connect billions.', color: '#8B4157', icon: '🌍' },
    }[id];
    const boundary = ERA_BOUNDARY_EVENTS[id];
    const startEvent = boundary?.startEventId ? getEventById(boundary.startEventId) : null;
    const endEvent = boundary?.endEventId ? getEventById(boundary.endEventId) : null;
    return { id, ...info, startEvent, endEvent };
});

// ─── Generate MCQ quiz questions ───────────────────────
function generateQuizQuestions() {
    const questions = [];

    for (const period of PERIODS) {
        // Q1: "When?" — given period name, pick correct date range
        const dateOptions = PERIODS
            .map(p => ({ id: p.id, label: p.subtitle }))
            .sort(() => Math.random() - 0.5);
        questions.push({
            type: 'date',
            periodId: period.id,
            prompt: period.title,
            promptIcon: period.icon,
            correctAnswer: period.subtitle,
            options: dateOptions.map(o => o.label),
        });

        // Q2: "What period?" — given date range, pick correct period name
        const nameOptions = PERIODS
            .map(p => ({ id: p.id, label: p.title, icon: p.icon }))
            .sort(() => Math.random() - 0.5);
        questions.push({
            type: 'event',
            periodId: period.id,
            prompt: period.subtitle,
            promptIcon: null,
            correctAnswer: period.title,
            options: nameOptions.map(o => `${o.icon} ${o.label}`),
            correctDisplay: `${period.icon} ${period.title}`,
        });
    }

    return questions.sort(() => Math.random() - 0.5);
}

// ─── COMPONENT ─────────────────────────────────────────
export default function Lesson0Flow({ lesson, onComplete }) {
    const { state, dispatch } = useApp();

    const [phase, setPhase] = useState(PHASE.INTRO);
    const [cardIndex, setCardIndex] = useState(0);
    const [quizQuestions, setQuizQuestions] = useState([]);
    const [quizIndex, setQuizIndex] = useState(0);
    const [results, setResults] = useState([]);     // { score, periodId, type }[]
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [answered, setAnswered] = useState(false);
    const [selectedDot, setSelectedDot] = useState(null);  // for result dot modal
    const xpDispatched = useRef(false);

    const greenCount = useMemo(() => results.filter(r => r.score === 'green').length, [results]);

    // Dispatch XP when summary is reached
    useEffect(() => {
        if (phase === PHASE.SUMMARY && !xpDispatched.current) {
            xpDispatched.current = true;
            dispatch({ type: 'COMPLETE_LESSON', lessonId: 'lesson-0' });
            dispatch({ type: 'ADD_XP', amount: greenCount * 5 });
        }
    }, [phase, greenCount, dispatch]);

    const scoreColors = {
        green: { bg: 'rgba(5, 150, 105, 0.08)', border: 'var(--color-success)' },
        red: { bg: 'rgba(166, 61, 61, 0.08)', border: 'var(--color-error)' },
    };

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
                        Lesson 0
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
                        5 eras to discover
                    </p>
                    <p className="text-xs mb-6" style={{ color: 'var(--color-ink-faint)' }}>
                        Learn the shape of history, then test your knowledge
                    </p>
                    <Mascot mood="happy" size={64} />
                    {(() => {
                        const timesCompleted = state.completedLessons['lesson-0'] || 0;
                        return (
                            <>
                                {timesCompleted > 0 && (
                                    <p className="text-xs font-medium mt-3 mb-1" style={{ color: 'var(--color-success)' }}>
                                        ✓ Completed {timesCompleted} {timesCompleted === 1 ? 'time' : 'times'}
                                    </p>
                                )}
                                <div className={timesCompleted > 0 ? "mt-3" : "mt-6"}>
                                    <Button onClick={() => {
                                        setPhase(PHASE.LEARN);
                                        setCardIndex(0);
                                    }}>
                                        {timesCompleted > 0 ? 'Learn Again' : 'Begin Learning'}
                                    </Button>
                                </div>
                            </>
                        );
                    })()}
                </div>
            </div>
        );
    }

    // ─── LEARN (Period Cards) ──────────────────────────
    if (phase === PHASE.LEARN) {
        const period = PERIODS[cardIndex];

        return (
            <div className="py-4 animate-fade-in">
                <div className="flex items-center justify-between mb-4">
                    <button onClick={onComplete} className="text-sm flex items-center gap-1" style={{ color: 'var(--color-ink-muted)' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
                        Exit
                    </button>
                    <span className="text-sm font-medium" style={{ color: 'var(--color-ink-muted)' }}>
                        Era {cardIndex + 1} of {PERIODS.length}
                    </span>
                </div>

                <ProgressBar value={cardIndex + 1} max={PERIODS.length} />

                <div className="text-center mt-2 mb-1">
                    <span className="text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: 'var(--color-burgundy-soft)', color: 'var(--color-burgundy)' }}>
                        Study — Era {cardIndex + 1} of {PERIODS.length}
                    </span>
                </div>

                <div className="mt-4 animate-slide-in-right" key={period.id}>
                    <Card style={{ borderLeft: `4px solid ${period.color}`, overflow: 'hidden' }}>
                        <div className="text-center mb-4">
                            <span className="text-5xl">{period.icon}</span>
                        </div>
                        <h2 className="text-2xl font-bold text-center mb-1" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ink)' }}>
                            {period.title}
                        </h2>
                        <p className="text-sm font-semibold text-center mb-4" style={{ color: period.color }}>
                            {period.subtitle}
                        </p>
                        <Divider />
                        <p className="text-sm leading-relaxed mt-4" style={{ color: 'var(--color-ink-secondary)' }}>
                            {period.description}
                        </p>

                        {/* Boundary events */}
                        <div className="mt-4 pt-3" style={{ borderTop: '1px solid rgba(28, 25, 23, 0.06)' }}>
                            <p className="text-[11px] uppercase tracking-wider font-semibold mb-2" style={{ color: 'var(--color-ink-faint)' }}>
                                Key Transitions
                            </p>
                            {period.startEvent && (
                                <div className="flex items-start gap-2 text-xs py-1">
                                    <span className="flex-shrink-0 mt-0.5" style={{ color: 'var(--color-success)' }}>▶</span>
                                    <div>
                                        <span className="font-semibold" style={{ color: 'var(--color-ink)' }}>Begins with: </span>
                                        <span style={{ color: 'var(--color-ink-secondary)' }}>{period.startEvent.title}</span>
                                        <span className="ml-1 font-medium" style={{ color: 'var(--color-burgundy)' }}>({period.startEvent.date})</span>
                                    </div>
                                </div>
                            )}
                            {period.endEvent && (
                                <div className="flex items-start gap-2 text-xs py-1">
                                    <span className="flex-shrink-0 mt-0.5" style={{ color: 'var(--color-error)' }}>■</span>
                                    <div>
                                        <span className="font-semibold" style={{ color: 'var(--color-ink)' }}>Ends with: </span>
                                        <span style={{ color: 'var(--color-ink-secondary)' }}>{period.endEvent.title}</span>
                                        <span className="ml-1 font-medium" style={{ color: 'var(--color-burgundy)' }}>({period.endEvent.date})</span>
                                    </div>
                                </div>
                            )}
                            {!period.endEvent && (
                                <div className="flex items-start gap-2 text-xs py-1">
                                    <span className="flex-shrink-0 mt-0.5" style={{ color: 'var(--color-ink-faint)' }}>■</span>
                                    <span className="italic" style={{ color: 'var(--color-ink-faint)' }}>Ongoing — the era we live in</span>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>

                <div className="flex gap-3 mt-6">
                    {cardIndex > 0 && (
                        <Button variant="secondary" onClick={() => setCardIndex(i => i - 1)}>
                            ← Back
                        </Button>
                    )}
                    <Button
                        className="flex-1"
                        onClick={() => {
                            if (cardIndex < PERIODS.length - 1) {
                                setCardIndex(i => i + 1);
                            } else {
                                const qs = generateQuizQuestions();
                                setQuizQuestions(qs);
                                setQuizIndex(0);
                                setResults([]);
                                setSelectedAnswer(null);
                                setAnswered(false);
                                setPhase(PHASE.QUIZ);
                            }
                        }}
                    >
                        {cardIndex < PERIODS.length - 1 ? 'Next Era →' : 'Start Quiz →'}
                    </Button>
                </div>
            </div>
        );
    }

    // ─── QUIZ (MCQ Only) ───────────────────────────────
    if (phase === PHASE.QUIZ) {
        const q = quizQuestions[quizIndex];

        if (!q) {
            // All quiz questions done — transition handled by handleNext below
            // This branch shouldn't normally be reached, but just in case:
            if (phase !== PHASE.SUMMARY) {
                setTimeout(() => setPhase(PHASE.SUMMARY), 0);
            }
            return null;
        }

        const handleAnswer = (answer) => {
            if (answered) return;
            setSelectedAnswer(answer);
            const isCorrect = q.type === 'event'
                ? answer === q.correctDisplay
                : answer === q.correctAnswer;
            const score = isCorrect ? 'green' : 'red';
            setResults(prev => [...prev, { score, periodId: q.periodId, type: q.type }]);
            setAnswered(true);
        };

        const handleNext = () => {
            if (quizIndex + 1 >= quizQuestions.length) {
                setPhase(PHASE.SUMMARY);
            } else {
                setQuizIndex(i => i + 1);
                setSelectedAnswer(null);
                setAnswered(false);
            }
        };

        const currentScore = answered ? results[results.length - 1] : null;
        const correctValue = q.type === 'event' ? q.correctDisplay : q.correctAnswer;

        return (
            <div className="py-4 animate-fade-in" key={`quiz-${quizIndex}`}>
                <div className="flex items-center justify-between mb-4">
                    <button onClick={onComplete} className="text-sm flex items-center gap-1"
                        style={{ color: 'var(--color-ink-muted)' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
                        Exit
                    </button>
                    <span className="text-sm font-medium" style={{ color: 'var(--color-ink-muted)' }}>
                        {quizIndex + 1} / {quizQuestions.length}
                    </span>
                </div>
                <ProgressBar value={quizIndex + 1} max={quizQuestions.length} />

                <div className="mt-6 animate-slide-in-right">
                    <Card style={answered && currentScore ? {
                        backgroundColor: scoreColors[currentScore].bg,
                        borderLeft: `3px solid ${scoreColors[currentScore].border}`
                    } : {}}>
                        <p className="text-xs uppercase tracking-wider font-semibold mb-2" style={{ color: 'var(--color-ink-faint)' }}>
                            {q.type === 'date' ? 'When was this era?' : 'What period is this?'}
                        </p>

                        {q.promptIcon && (
                            <span className="text-3xl block mb-2">{q.promptIcon}</span>
                        )}
                        <h3 className="text-lg font-bold mb-4" style={{ fontFamily: 'var(--font-serif)', color: q.type === 'date' ? 'var(--color-ink)' : 'var(--color-burgundy)' }}>
                            {q.prompt}
                        </h3>

                        <div className="space-y-2">
                            {q.options.map((opt, i) => {
                                const isCorrect = opt === correctValue;
                                const isSelected = selectedAnswer === opt;
                                let optStyle = {};
                                if (answered) {
                                    if (isCorrect) optStyle = { backgroundColor: 'rgba(5, 150, 105, 0.1)', borderColor: 'var(--color-success)' };
                                    else if (isSelected && !isCorrect) optStyle = { backgroundColor: 'rgba(166, 61, 61, 0.1)', borderColor: 'var(--color-error)' };
                                }
                                return (
                                    <button
                                        key={i}
                                        onClick={() => handleAnswer(opt)}
                                        disabled={answered}
                                        className="w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all duration-200"
                                        style={{
                                            borderColor: isSelected && !answered ? 'var(--color-burgundy)' : 'rgba(28, 25, 23, 0.08)',
                                            backgroundColor: 'var(--color-card)',
                                            ...optStyle,
                                        }}
                                    >
                                        <span>{opt}</span>
                                        {answered && isCorrect && (
                                            <span className="ml-2 text-xs" style={{ color: 'var(--color-success)' }}>✓</span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {answered && (
                            <div className="mt-3">
                                <p className="text-sm font-semibold" style={{
                                    color: currentScore === 'green' ? 'var(--color-success)' : 'var(--color-error)'
                                }}>
                                    {currentScore === 'green' ? 'Correct!' : 'Not quite'}
                                </p>
                            </div>
                        )}
                    </Card>
                </div>

                {answered && (
                    <div className="mt-4">
                        <Button className="w-full" onClick={handleNext}>Continue →</Button>
                    </div>
                )}
            </div>
        );
    }

    // ─── SUMMARY ───────────────────────────────────────
    if (phase === PHASE.SUMMARY) {
        const total = results.length;
        const redCount = results.filter(r => r.score === 'red').length;
        const xp = greenCount * 5;

        return (
            <div className="py-8 text-center animate-fade-in">
                <Mascot mood="celebrating" size={80} />

                <h2 className="text-2xl font-bold mt-4 mb-1" style={{ fontFamily: 'var(--font-serif)' }}>
                    Timeline Unlocked!
                </h2>
                <p className="text-sm mb-6" style={{ color: 'var(--color-ink-muted)' }}>
                    You now know the shape of human history
                </p>

                <Card className="animate-celebration" style={{
                    borderTop: '3px solid var(--color-success)',
                }}>
                    <div className="text-sm font-semibold mb-3" style={{ color: 'var(--color-ink-secondary)' }}>
                        5 eras studied
                    </div>

                    <div className="flex items-center gap-1 mb-4 justify-center flex-wrap">
                        {results.map((r, i) => {
                            const period = PERIODS.find(p => p.id === r.periodId);
                            return (
                                <button key={i}
                                    className="w-3 h-3 rounded-full result-dot-btn"
                                    title={`${period?.title || 'Period'} — ${r.type === 'date' ? 'Date' : 'Period Name'}`}
                                    onClick={() => setSelectedDot(r)}
                                    style={{
                                        backgroundColor: r.score === 'green' ? 'var(--color-success)' : 'var(--color-error)'
                                    }} />
                            );
                        })}
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-center mb-4">
                        <div>
                            <div className="text-lg font-bold" style={{ color: 'var(--color-success)' }}>{greenCount}</div>
                            <div className="text-xs" style={{ color: 'var(--color-ink-muted)' }}>Correct</div>
                        </div>
                        <div>
                            <div className="text-lg font-bold" style={{ color: 'var(--color-error)' }}>{redCount}</div>
                            <div className="text-xs" style={{ color: 'var(--color-ink-muted)' }}>Missed</div>
                        </div>
                    </div>

                    <Divider />

                    {/* XP Reward */}
                    <div className="flex items-center justify-center gap-2 mt-3">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-bronze)" strokeWidth="2">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="var(--color-bronze-light)" />
                        </svg>
                        <div className="text-left">
                            <div className="text-xl font-bold leading-none" style={{ color: 'var(--color-burgundy)' }}>+{xp}</div>
                            <div className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--color-ink-faint)' }}>XP earned</div>
                        </div>
                    </div>

                    {/* Era preview */}
                    <div className="mt-4 pt-3" style={{ borderTop: '1px solid rgba(28, 25, 23, 0.06)' }}>
                        <p className="text-[11px] uppercase tracking-wider font-semibold mb-2" style={{ color: 'var(--color-ink-faint)' }}>
                            Eras Unlocked
                        </p>
                        <div className="flex justify-center gap-3">
                            {PERIODS.map(p => (
                                <div key={p.id} className="text-center">
                                    <span className="text-xl">{p.icon}</span>
                                    <p className="text-[9px] font-semibold mt-0.5" style={{ color: p.color }}>{p.title.replace('The ', '')}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>

                <div className="mt-6">
                    <Button className="w-full" onClick={onComplete}>
                        Continue
                    </Button>
                </div>

                {/* Result Dot Modal */}
                {selectedDot && (() => {
                    const period = PERIODS.find(p => p.id === selectedDot.periodId);
                    if (!period) return null;
                    const dotColor = selectedDot.score === 'green' ? 'var(--color-success)' : 'var(--color-error)';
                    const hlBg = selectedDot.score === 'green' ? 'rgba(5, 150, 105, 0.12)' : 'rgba(166, 61, 61, 0.12)';
                    const isDateQ = selectedDot.type === 'date';
                    return (
                        <div className="dot-modal-backdrop" onClick={() => setSelectedDot(null)}>
                            <div className="dot-modal-content" onClick={e => e.stopPropagation()}>
                                <Card style={{ borderLeft: `4px solid ${period.color}` }}>
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full"
                                            style={{ backgroundColor: hlBg, color: dotColor }}>
                                            {isDateQ ? '📅 Date Question' : '❓ Period Name Question'}
                                        </span>
                                        <button onClick={() => setSelectedDot(null)}
                                            className="w-7 h-7 rounded-full flex items-center justify-center text-sm"
                                            style={{ color: 'var(--color-ink-muted)', backgroundColor: 'rgba(28,25,23,0.05)' }}>✕</button>
                                    </div>
                                    <div className="text-center mb-4">
                                        <span className="text-5xl">{period.icon}</span>
                                    </div>
                                    <div className={!isDateQ ? 'dot-highlight' : ''}
                                        style={!isDateQ ? { backgroundColor: hlBg, color: dotColor } : {}}>
                                        <h2 className="text-2xl font-bold text-center mb-1" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ink)' }}>
                                            {period.title}
                                        </h2>
                                    </div>
                                    <div className={isDateQ ? 'dot-highlight' : ''}
                                        style={isDateQ ? { backgroundColor: hlBg, color: dotColor } : {}}>
                                        <p className="text-sm font-semibold text-center mb-4" style={{ color: period.color }}>
                                            {period.subtitle}
                                        </p>
                                    </div>
                                    <Divider />
                                    <p className="text-sm leading-relaxed mt-4" style={{ color: 'var(--color-ink-secondary)' }}>
                                        {period.description}
                                    </p>
                                </Card>
                            </div>
                        </div>
                    );
                })()}
            </div>
        );
    }

    return null;
}
