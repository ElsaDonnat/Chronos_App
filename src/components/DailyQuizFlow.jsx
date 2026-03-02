import { useState, useRef, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { getTodaysDailyQuiz, DAILY_QUIZ_XP_PER_CORRECT } from '../data/dailyQuiz';
import { getEventsByIds } from '../data/events';
import { Card, Button, ProgressBar, DiHBadge } from './shared';
import Mascot from './Mascot';
import { shareText, buildDailyQuizShareText } from '../services/share';

const PHASES = { INTRO: 'intro', QUIZ: 'quiz', RESULTS: 'results' };

function shuffleOptions(correct, wrongs) {
    const options = [
        { title: correct, isCorrect: true },
        ...wrongs.map(t => ({ title: t, isCorrect: false })),
    ];
    for (let i = options.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [options[i], options[j]] = [options[j], options[i]];
    }
    return options;
}

export default function DailyQuizFlow({ onComplete }) {
    const { dispatch } = useApp();
    const dailyData = getTodaysDailyQuiz();
    const events = useMemo(() => getEventsByIds(dailyData.eventIds), [dailyData.eventIds]);

    const [phase, setPhase] = useState(PHASES.INTRO);
    const [quizIndex, setQuizIndex] = useState(0);
    const [results, setResults] = useState([]); // ['correct' | 'wrong']
    const [selectedOption, setSelectedOption] = useState(null);
    const [answered, setAnswered] = useState(false);
    const [showCard, setShowCard] = useState(false);
    const [shareToast, setShareToast] = useState(false);
    const sessionStartTime = useRef(null);

    // Shuffle options once per question
    const shuffledOptions = useMemo(() => {
        return events.map(event => shuffleOptions(event.title, event.wrongTitles));
    }, [events]);

    useEffect(() => {
        sessionStartTime.current = Date.now();
        dispatch({ type: 'START_DAILY_QUIZ' });
    }, [dispatch]);

    useEffect(() => {
        if (shareToast) {
            const t = setTimeout(() => setShareToast(false), 2000);
            return () => clearTimeout(t);
        }
    }, [shareToast]);

    const totalEvents = events.length;

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
                            Can you guess what happened?
                        </p>

                        <div className="daily-quiz-bonus-pill">
                            {'2\× XP BONUS'}
                        </div>

                        <div className="mt-8 space-y-4 px-4">
                            {events.map((event, i) => (
                                <div key={i} className="daily-quiz-year-card animate-fade-in-up" style={{ animationDelay: `${i * 150}ms` }}>
                                    <span className="daily-quiz-year">{event.year}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex-shrink-0 pt-4 pb-2">
                    <Button className="w-full daily-quiz-btn" onClick={() => setPhase(PHASES.QUIZ)}>
                        Start Quiz
                    </Button>
                </div>
            </div>
        );
    }

    // ─── QUIZ PHASE ───
    if (phase === PHASES.QUIZ) {
        const event = events[quizIndex];
        const options = shuffledOptions[quizIndex];

        const handleAnswer = (optIndex) => {
            if (answered) return;
            setSelectedOption(optIndex);
            setAnswered(true);
            const isCorrect = options[optIndex].isCorrect;
            setResults(prev => [...prev, isCorrect ? 'correct' : 'wrong']);
            // Show the card reveal after a short delay
            setTimeout(() => setShowCard(true), 400);
        };

        const handleNext = () => {
            setSelectedOption(null);
            setAnswered(false);
            setShowCard(false);
            if (quizIndex + 1 < totalEvents) {
                setQuizIndex(i => i + 1);
            } else {
                // Quiz done — calculate XP and dispatch
                const xpEarned = results.filter(r => r === 'correct').length * DAILY_QUIZ_XP_PER_CORRECT;
                const eventIds = events.map(e => e.id);
                dispatch({ type: 'MARK_EVENTS_SEEN', eventIds });
                dispatch({ type: 'COMPLETE_DAILY_QUIZ', xpEarned, eventIds });
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
                            <span className="daily-quiz-bonus-pill-sm">{'2\× XP'}</span>
                            <span className="text-sm font-medium" style={{ color: 'var(--color-ink-muted)' }}>
                                {quizIndex + 1} / {totalEvents}
                            </span>
                        </div>
                    </div>
                    <ProgressBar value={quizIndex + 1} max={totalEvents} color="#B8860B" />
                </div>

                <div className="flex-1 min-h-0 overflow-y-auto">
                    <div className="mt-5 animate-slide-in-right" key={quizIndex}>
                        {/* Year display */}
                        <div className="text-center mb-5">
                            <span className="daily-quiz-year">{event.year}</span>
                            <p className="text-sm mt-2 font-medium" style={{ color: 'var(--color-ink-muted)' }}>
                                What happened on {dailyData.dateLabel}, {event.year}?
                            </p>
                        </div>

                        {/* Options */}
                        <div className="space-y-2.5">
                            {options.map((opt, i) => {
                                let optClass = 'daily-quiz-option';
                                if (answered) {
                                    if (opt.isCorrect) optClass += ' daily-quiz-option--correct';
                                    else if (selectedOption === i) optClass += ' daily-quiz-option--wrong';
                                    else optClass += ' daily-quiz-option--dimmed';
                                }

                                return (
                                    <button
                                        key={i}
                                        onClick={() => handleAnswer(i)}
                                        disabled={answered}
                                        className={optClass}
                                    >
                                        <span>{opt.title}</span>
                                        {answered && opt.isCorrect && (
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="2.5">
                                                <polyline points="20 6 9 17 4 12" />
                                            </svg>
                                        )}
                                        {answered && selectedOption === i && !opt.isCorrect && (
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-error)" strokeWidth="2.5">
                                                <line x1="18" y1="6" x2="6" y2="18" />
                                                <line x1="6" y1="6" x2="18" y2="18" />
                                            </svg>
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {/* XP feedback */}
                        {answered && !showCard && (
                            <div className="mt-4 pt-3 text-sm text-center animate-fade-in">
                                {options[selectedOption]?.isCorrect ? (
                                    <p className="font-semibold" style={{ color: 'var(--color-success)' }}>
                                        {'\✓'} Correct! +{DAILY_QUIZ_XP_PER_CORRECT} XP
                                    </p>
                                ) : (
                                    <p className="font-semibold" style={{ color: 'var(--color-error)' }}>
                                        {'\✗'} Not quite!
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Card reveal — the learning moment */}
                        {showCard && (
                            <Card className="mt-4 daily-quiz-card-reveal daily-quiz-learn-card">
                                <div className="flex items-center gap-2 mb-2">
                                    <DiHBadge />
                                    <span className="text-xs font-medium" style={{ color: 'var(--color-ink-faint)' }}>
                                        {dailyData.dateLabel}, {event.year}
                                    </span>
                                </div>
                                <h3 className="text-base font-bold mb-1" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ink)' }}>
                                    {event.title}
                                </h3>
                                <p className="text-xs font-medium mb-2" style={{ color: '#B8860B' }}>
                                    {event.location.place}
                                </p>
                                <p className="text-sm leading-relaxed" style={{ color: 'var(--color-ink-secondary)' }}>
                                    {event.description}
                                </p>
                            </Card>
                        )}
                    </div>
                </div>

                {showCard && (
                    <div className="flex-shrink-0 mt-auto pt-4 pb-2">
                        <Button className="w-full daily-quiz-btn" onClick={handleNext}>
                            {quizIndex + 1 < totalEvents ? 'Continue →' : 'See Results'}
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
                            {dailyData.dateLabel} {'·'} {correctCount}/{totalEvents} correct
                        </p>

                        {xpEarned > 0 && (
                            <div className="daily-quiz-xp-result animate-pop-in">
                                <span className="daily-quiz-bonus-pill mr-2">{'2\× BONUS'}</span>
                                <span className="text-xl font-bold" style={{ color: '#B8860B' }}>+{xpEarned} XP</span>
                            </div>
                        )}

                        {/* Acquired cards */}
                        <div className="mt-6 text-left">
                            <h3 className="text-xs uppercase tracking-wider font-semibold mb-3 px-1" style={{ color: '#B8860B' }}>
                                {totalEvents} Bonus Cards Acquired
                            </h3>
                            <div className="space-y-2">
                                {events.map((event, i) => (
                                    <Card key={event.id} className="daily-quiz-learn-card animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
                                        <div className="flex items-start gap-2">
                                            <div
                                                className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5"
                                                style={{
                                                    backgroundColor: results[i] === 'correct' ? 'rgba(5,150,105,0.1)' : 'rgba(166,61,61,0.1)',
                                                    color: results[i] === 'correct' ? 'var(--color-success)' : 'var(--color-error)',
                                                }}
                                            >
                                                {results[i] === 'correct' ? '\✓' : '\✗'}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <DiHBadge size="sm" />
                                                </div>
                                                <p className="text-sm font-semibold" style={{ fontFamily: 'var(--font-serif)' }}>{event.title}</p>
                                                <p className="text-xs mt-0.5" style={{ color: 'var(--color-ink-muted)' }}>
                                                    {dailyData.dateLabel}, {event.year} {'·'} {event.location.place}
                                                </p>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>

                        <p className="text-xs mt-5 px-2" style={{ color: 'var(--color-ink-muted)' }}>
                            These cards are now in your collection. Practice them in the Practice tab!
                        </p>
                    </div>
                </div>

                <div className="flex-shrink-0 pt-4 pb-2 space-y-2">
                    <Button className="w-full daily-quiz-btn" onClick={onComplete}>
                        Done
                    </Button>
                    <button
                        onClick={async () => {
                            const text = buildDailyQuizShareText({ correctCount, totalEvents, xpEarned, dateLabel: dailyData.dateLabel });
                            const result = await shareText({ title: 'Chronos', text });
                            if (result === 'copied') setShareToast(true);
                        }}
                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer"
                        style={{ color: '#8B6914', backgroundColor: 'rgba(184, 134, 11, 0.1)' }}
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

    return null;
}
