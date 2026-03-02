import { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { getTodaysDailyQuiz, DAILY_QUIZ_XP_PER_CORRECT } from '../data/dailyQuiz';
import { Card, Button, ProgressBar } from './shared';
import Mascot from './Mascot';

const PHASES = { INTRO: 'intro', LEARN: 'learn', QUIZ: 'quiz', RESULTS: 'results' };

export default function DailyQuizFlow({ onComplete }) {
    const { dispatch } = useApp();
    const dailyData = getTodaysDailyQuiz();

    const [phase, setPhase] = useState(PHASES.INTRO);
    const [learnIndex, setLearnIndex] = useState(0);
    const [quizIndex, setQuizIndex] = useState(0);
    const [results, setResults] = useState([]); // ['correct' | 'wrong']
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [answered, setAnswered] = useState(false);
    const sessionStartTime = useRef(null);
    useEffect(() => { sessionStartTime.current = Date.now(); }, []);

    const totalEvents = dailyData.events.length;

    // ─── INTRO ───
    if (phase === PHASES.INTRO) {
        return (
            <div className="daily-quiz-container animate-fade-in">
                <div className="flex-1 min-h-0 overflow-y-auto">
                    <div className="py-6 text-center">
                        <div className="daily-quiz-date-badge">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                <line x1="16" y1="2" x2="16" y2="6" />
                                <line x1="8" y1="2" x2="8" y2="6" />
                                <line x1="3" y1="10" x2="21" y2="10" />
                            </svg>
                            {dailyData.dateLabel}
                        </div>

                        <h2 className="text-2xl font-bold mt-4 mb-1" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ink)' }}>
                            This Day in History
                        </h2>
                        <p className="text-sm mb-2" style={{ color: 'var(--color-ink-muted)' }}>
                            3 events that shaped the world on this date
                        </p>

                        <div className="daily-quiz-bonus-pill">
                            2\u00d7 XP BONUS
                        </div>

                        <div className="mt-6 space-y-3 text-left px-2">
                            {dailyData.events.map((event, i) => (
                                <Card key={i} className="daily-quiz-preview-card" style={{ animationDelay: `${i * 100}ms` }}>
                                    <div className="flex items-center gap-3">
                                        <div className="daily-quiz-number">{i + 1}</div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-bold" style={{ fontFamily: 'var(--font-serif)' }}>
                                                {event.title}
                                            </h4>
                                            <p className="text-xs mt-0.5" style={{ color: 'var(--color-ink-muted)' }}>
                                                {event.year} \u00b7 {event.location}
                                            </p>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex-shrink-0 pt-4 pb-2">
                    <Button className="w-full daily-quiz-btn" onClick={() => setPhase(PHASES.LEARN)}>
                        Start Daily Quiz
                    </Button>
                </div>
            </div>
        );
    }

    // ─── LEARN PHASE ───
    if (phase === PHASES.LEARN) {
        const event = dailyData.events[learnIndex];
        return (
            <div className="daily-quiz-container animate-fade-in" key={`learn-${learnIndex}`}>
                <div className="flex-shrink-0 pt-4">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full daily-quiz-phase-tag">
                            Learn
                        </span>
                        <span className="text-sm font-medium" style={{ color: 'var(--color-ink-muted)' }}>
                            {learnIndex + 1} / {totalEvents}
                        </span>
                    </div>
                    <ProgressBar value={learnIndex + 1} max={totalEvents} />
                </div>

                <div className="flex-1 min-h-0 overflow-y-auto">
                    <div className="mt-5 animate-slide-in-right" key={learnIndex}>
                        <Card className="daily-quiz-learn-card">
                            <div className="daily-quiz-date-badge mb-3" style={{ justifyContent: 'flex-start' }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                    <line x1="16" y1="2" x2="16" y2="6" />
                                    <line x1="8" y1="2" x2="8" y2="6" />
                                    <line x1="3" y1="10" x2="21" y2="10" />
                                </svg>
                                {dailyData.dateLabel}, {event.year}
                            </div>

                            <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ink)' }}>
                                {event.title}
                            </h3>

                            <p className="text-xs font-medium mb-3" style={{ color: '#B8860B' }}>
                                {event.location}
                            </p>

                            <p className="text-sm leading-relaxed" style={{ color: 'var(--color-ink-secondary)' }}>
                                {event.description}
                            </p>
                        </Card>
                    </div>
                </div>

                <div className="flex-shrink-0 pt-4 pb-2">
                    <Button
                        className="w-full daily-quiz-btn"
                        onClick={() => {
                            if (learnIndex + 1 < totalEvents) {
                                setLearnIndex(i => i + 1);
                            } else {
                                setPhase(PHASES.QUIZ);
                            }
                        }}
                    >
                        {learnIndex + 1 < totalEvents ? 'Next Event \u2192' : 'Start Quiz \u2192'}
                    </Button>
                </div>
            </div>
        );
    }

    // ─── QUIZ PHASE ───
    if (phase === PHASES.QUIZ) {
        const event = dailyData.events[quizIndex];
        const q = event.question;

        const handleAnswer = (optIndex) => {
            if (answered) return;
            setSelectedAnswer(optIndex);
            setAnswered(true);
            const isCorrect = optIndex === q.correctIndex;
            setResults(prev => [...prev, isCorrect ? 'correct' : 'wrong']);
        };

        const handleNext = () => {
            setSelectedAnswer(null);
            setAnswered(false);
            if (quizIndex + 1 < totalEvents) {
                setQuizIndex(i => i + 1);
            } else {
                // Quiz done — calculate XP and dispatch
                const xpEarned = results.filter(r => r === 'correct').length * DAILY_QUIZ_XP_PER_CORRECT;
                dispatch({ type: 'COMPLETE_DAILY_QUIZ', xpEarned });
                if (xpEarned > 0) {
                    dispatch({ type: 'ADD_XP', amount: xpEarned });
                }
                const duration = sessionStartTime.current ? Math.round((Date.now() - sessionStartTime.current) / 1000) : 0;
                dispatch({ type: 'RECORD_STUDY_SESSION', duration, sessionType: 'daily_quiz', questionsAnswered: results.length });
                setPhase(PHASES.RESULTS);
            }
        };

        return (
            <div className="daily-quiz-container animate-fade-in" key={`quiz-${quizIndex}`}>
                <div className="flex-shrink-0 pt-4">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full daily-quiz-phase-tag">
                            Quiz
                        </span>
                        <div className="flex items-center gap-2">
                            <span className="daily-quiz-bonus-pill-sm">2\u00d7 XP</span>
                            <span className="text-sm font-medium" style={{ color: 'var(--color-ink-muted)' }}>
                                {quizIndex + 1} / {totalEvents}
                            </span>
                        </div>
                    </div>
                    <ProgressBar value={quizIndex + 1} max={totalEvents} />
                </div>

                <div className="flex-1 min-h-0 overflow-y-auto">
                    <div className="mt-5 animate-slide-in-right" key={quizIndex}>
                        <Card className={answered ? (selectedAnswer === q.correctIndex ? 'daily-quiz-card-correct' : 'daily-quiz-card-wrong') : ''}>
                            <p className="text-xs uppercase tracking-wider font-semibold mb-2" style={{ color: '#B8860B' }}>
                                {event.title} \u00b7 {event.year}
                            </p>

                            <h3 className="text-lg font-bold mb-5" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ink)' }}>
                                {q.prompt}
                            </h3>

                            <div className="space-y-2.5">
                                {q.options.map((opt, i) => {
                                    const isCorrect = i === q.correctIndex;
                                    const isSelected = selectedAnswer === i;

                                    let optClass = 'daily-quiz-option';
                                    if (answered) {
                                        if (isCorrect) optClass += ' daily-quiz-option--correct';
                                        else if (isSelected) optClass += ' daily-quiz-option--wrong';
                                        else optClass += ' daily-quiz-option--dimmed';
                                    }

                                    return (
                                        <button
                                            key={i}
                                            onClick={() => handleAnswer(i)}
                                            disabled={answered}
                                            className={optClass}
                                        >
                                            <span>{opt}</span>
                                            {answered && isCorrect && (
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="2.5">
                                                    <polyline points="20 6 9 17 4 12" />
                                                </svg>
                                            )}
                                            {answered && isSelected && !isCorrect && (
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-error)" strokeWidth="2.5">
                                                    <line x1="18" y1="6" x2="6" y2="18" />
                                                    <line x1="6" y1="6" x2="18" y2="18" />
                                                </svg>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>

                            {answered && (
                                <div className="mt-4 pt-3 text-sm animate-fade-in" style={{ borderTop: '1px solid rgba(28,25,23,0.06)' }}>
                                    {selectedAnswer === q.correctIndex ? (
                                        <p className="font-semibold" style={{ color: 'var(--color-success)' }}>
                                            \u2713 Correct! +{DAILY_QUIZ_XP_PER_CORRECT} XP
                                        </p>
                                    ) : (
                                        <p className="font-semibold" style={{ color: 'var(--color-error)' }}>
                                            \u2717 The answer was: {q.options[q.correctIndex]}
                                        </p>
                                    )}
                                </div>
                            )}
                        </Card>
                    </div>
                </div>

                {answered && (
                    <div className="flex-shrink-0 pt-4 pb-2">
                        <Button className="w-full daily-quiz-btn" onClick={handleNext}>
                            {quizIndex + 1 < totalEvents ? 'Next Question \u2192' : 'See Results'}
                        </Button>
                    </div>
                )}
            </div>
        );
    }

    // ─── RESULTS PHASE ───
    if (phase === PHASES.RESULTS) {
        const correctCount = results.filter(r => r === 'correct').length;
        const xpEarned = correctCount * DAILY_QUIZ_XP_PER_CORRECT;

        return (
            <div className="daily-quiz-container animate-fade-in">
                <div className="flex-1 min-h-0 overflow-y-auto">
                    <div className="py-6 text-center">
                        <Mascot mood={correctCount === totalEvents ? 'celebrating' : correctCount > 0 ? 'happy' : 'thinking'} size={70} />

                        <h2 className="text-2xl font-bold mt-4 mb-1" style={{ fontFamily: 'var(--font-serif)' }}>
                            {correctCount === totalEvents ? 'Perfect!' : correctCount > 0 ? 'Nice work!' : 'Better luck tomorrow!'}
                        </h2>

                        <p className="text-sm mb-2" style={{ color: 'var(--color-ink-muted)' }}>
                            {dailyData.dateLabel} \u00b7 {correctCount}/{totalEvents} correct
                        </p>

                        {xpEarned > 0 && (
                            <div className="daily-quiz-xp-result animate-pop-in">
                                <span className="daily-quiz-bonus-pill mr-2">2\u00d7 BONUS</span>
                                <span className="text-xl font-bold" style={{ color: '#B8860B' }}>+{xpEarned} XP</span>
                            </div>
                        )}

                        <div className="mt-5 flex items-center gap-2 justify-center">
                            {results.map((r, i) => (
                                <div
                                    key={i}
                                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                                    style={{
                                        backgroundColor: r === 'correct' ? 'rgba(5, 150, 105, 0.1)' : 'rgba(166, 61, 61, 0.1)',
                                        color: r === 'correct' ? 'var(--color-success)' : 'var(--color-error)',
                                    }}
                                >
                                    {r === 'correct' ? '\u2713' : '\u2717'}
                                </div>
                            ))}
                        </div>

                        <Card className="mt-6 text-left">
                            <h3 className="text-xs uppercase tracking-wider font-semibold mb-3" style={{ color: 'var(--color-ink-faint)' }}>
                                Today you learned
                            </h3>
                            {dailyData.events.map((event, i) => (
                                <div key={i} className={`py-2 ${i > 0 ? 'border-t' : ''}`} style={{ borderColor: 'rgba(28,25,23,0.06)' }}>
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                                            style={{
                                                backgroundColor: results[i] === 'correct' ? 'rgba(5,150,105,0.1)' : 'rgba(166,61,61,0.1)',
                                                color: results[i] === 'correct' ? 'var(--color-success)' : 'var(--color-error)',
                                            }}
                                        >
                                            {results[i] === 'correct' ? '\u2713' : '\u2717'}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold">{event.title}</p>
                                            <p className="text-xs" style={{ color: 'var(--color-ink-muted)' }}>{event.year} \u00b7 {event.location}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </Card>
                    </div>
                </div>

                <div className="flex-shrink-0 pt-4 pb-2">
                    <Button className="w-full" onClick={onComplete}>
                        Done
                    </Button>
                </div>
            </div>
        );
    }

    return null;
}
