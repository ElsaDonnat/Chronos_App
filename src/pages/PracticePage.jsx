import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ALL_EVENTS, getEventById, CATEGORY_CONFIG } from '../data/events';
import { scoreDateAnswer, generateLocationOptions, generateWhatOptions } from '../data/quiz';
import { Card, Button, MasteryDots, ProgressBar, Divider, CategoryTag } from '../components/shared';
import Mascot from '../components/Mascot';

export default function PracticePage() {
    const { state, dispatch } = useApp();
    const [sessionActive, setSessionActive] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [results, setResults] = useState([]);
    const [showResults, setShowResults] = useState(false);

    const learnedEvents = useMemo(() => {
        return state.seenEvents.map(id => getEventById(id)).filter(Boolean);
    }, [state.seenEvents]);

    const weakEvents = useMemo(() => {
        return learnedEvents
            .map(e => ({ event: e, mastery: state.eventMastery[e.id] }))
            .sort((a, b) => {
                const ma = a.mastery?.overallMastery ?? 0;
                const mb = b.mastery?.overallMastery ?? 0;
                return ma - mb;
            });
    }, [learnedEvents, state.eventMastery]);

    const allMastered = useMemo(() => {
        return learnedEvents.length > 0 && learnedEvents.every(e => {
            const m = state.eventMastery[e.id];
            return m && m.overallMastery >= 7;
        });
    }, [learnedEvents, state.eventMastery]);

    const generatePracticeQuestions = () => {
        const qList = [];
        const prioritized = [...weakEvents].slice(0, 15);

        for (const { event, mastery } of prioritized) {
            // Pick the weakest question type for this event
            const scores = {
                location: mastery?.locationScore,
                date: mastery?.dateScore,
                what: mastery?.whatScore,
            };

            const scoreOrder = { red: 0, null: 1, yellow: 2, green: 3 };
            const types = Object.entries(scores)
                .sort((a, b) => (scoreOrder[a[1]] ?? 1) - (scoreOrder[b[1]] ?? 1));

            // Add weakest 1-2 question types
            const numQs = Math.min(2, types.filter(t => scoreOrder[t[1]] < 3).length || 1);
            for (let i = 0; i < numQs && i < types.length; i++) {
                qList.push({
                    event: event,
                    type: types[i][0],
                    key: `practice-${event.id}-${types[i][0]}-${Date.now()}`,
                });
            }
            if (qList.length >= 12) break;
        }

        // Shuffle
        return qList.sort(() => Math.random() - 0.5);
    };

    const startPractice = () => {
        const qs = generatePracticeQuestions();
        setQuestions(qs);
        setCurrentIndex(0);
        setResults([]);
        setShowResults(false);
        setSessionActive(true);
    };

    // No events learned
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

    // All mastered
    if (allMastered && !sessionActive) {
        return (
            <div className="py-12 text-center animate-fade-in">
                <Mascot mood="celebrating" size={70} />
                <h2 className="text-xl font-bold mt-4" style={{ fontFamily: 'var(--font-serif)' }}>
                    All caught up!
                </h2>
                <p className="text-sm mt-2 mx-4" style={{ color: 'var(--color-ink-muted)' }}>
                    Every event you've learned is mastered. Try learning new events to keep growing.
                </p>
            </div>
        );
    }

    // Session results
    if (showResults) {
        const greenCount = results.filter(r => r.score === 'green').length;
        const yellowCount = results.filter(r => r.score === 'yellow').length;
        const redCount = results.filter(r => r.score === 'red').length;

        return (
            <div className="py-8 text-center animate-fade-in">
                <Mascot mood={redCount === 0 ? 'celebrating' : greenCount > redCount ? 'happy' : 'thinking'} size={70} />
                <h2 className="text-2xl font-bold mt-4 mb-1" style={{ fontFamily: 'var(--font-serif)' }}>
                    Practice Complete
                </h2>
                <p className="text-sm mb-6" style={{ color: 'var(--color-ink-muted)' }}>
                    {results.length} questions reviewed
                </p>

                <Card>
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

                <div className="flex gap-3 mt-6">
                    <Button variant="secondary" onClick={() => { setSessionActive(false); setShowResults(false); }}>
                        Done
                    </Button>
                    <Button className="flex-1" onClick={startPractice}>
                        Practice Again
                    </Button>
                </div>
            </div>
        );
    }

    // Active session
    if (sessionActive) {
        const q = questions[currentIndex];
        if (!q) {
            // Calculate XP and show results
            const xp = results.reduce((s, r) => s + (r.score === 'green' ? 5 : r.score === 'yellow' ? 2 : 0), 0);
            if (xp > 0) dispatch({ type: 'ADD_XP', amount: xp });
            setShowResults(true);
            return null;
        }

        return (
            <div className="py-4 animate-fade-in" key={`practice-${currentIndex}`}>
                <div className="flex items-center justify-between mb-4">
                    <button onClick={() => { setSessionActive(false); }} className="text-sm flex items-center gap-1"
                        style={{ color: 'var(--color-ink-muted)' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="15 18 9 12 15 6" />
                        </svg>
                        Exit
                    </button>
                    <span className="text-sm font-medium" style={{ color: 'var(--color-ink-muted)' }}>
                        {currentIndex + 1} / {questions.length}
                    </span>
                </div>
                <ProgressBar value={currentIndex + 1} max={questions.length} />

                <div className="mt-6">
                    <PracticeQuestion
                        question={q}
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
                    />
                </div>
            </div>
        );
    }

    // Practice overview
    return (
        <div className="py-4 animate-fade-in">
            <div className="text-center mb-6">
                <h1 className="text-xl font-bold" style={{ fontFamily: 'var(--font-serif)' }}>Practice</h1>
                <p className="text-xs mt-1" style={{ color: 'var(--color-ink-muted)' }}>
                    Strengthen your weakest areas
                </p>
            </div>

            <Card className="text-center mb-6">
                <Mascot mood="thinking" size={56} />
                <p className="text-lg font-bold mt-2" style={{ fontFamily: 'var(--font-serif)' }}>
                    {learnedEvents.length} events ready for practice
                </p>
                <p className="text-xs mt-1 mb-4" style={{ color: 'var(--color-ink-muted)' }}>
                    {weakEvents.filter(w => (w.mastery?.overallMastery ?? 0) < 7).length} need strengthening
                </p>
                <Button onClick={startPractice}>Start Practice</Button>
            </Card>

            <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--color-ink-muted)' }}>
                Events by Weakness
            </h3>

            <div className="space-y-2">
                {weakEvents.slice(0, 12).map(({ event, mastery }) => (
                    <Card key={event.id} className="p-3">
                        <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-semibold truncate" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ink)' }}>
                                    {event.title}
                                </h4>
                                <div className="flex items-center gap-3 mt-1">
                                    <MasteryDots mastery={mastery} />
                                    {mastery && (
                                        <div className="flex gap-2 text-[10px]" style={{ color: 'var(--color-ink-faint)' }}>
                                            {['location', 'date', 'what'].map(t => {
                                                const score = mastery[`${t}Score`];
                                                const label = t === 'location' ? 'Where' : t === 'date' ? 'When' : 'What';
                                                return (
                                                    <span key={t} style={{
                                                        color: score === 'green' ? 'var(--color-success)' :
                                                            score === 'yellow' ? 'var(--color-warning)' :
                                                                score === 'red' ? 'var(--color-error)' : 'var(--color-ink-faint)'
                                                    }}>
                                                        {label}
                                                    </span>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <CategoryTag category={event.category} />
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}

// Re-use quiz question patterns
function PracticeQuestion({ question, onAnswer, onNext }) {
    const { event, type } = question;
    const [answered, setAnswered] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [score, setScore] = useState(null);
    const [dateInput, setDateInput] = useState('');
    const [dateEndInput, setDateEndInput] = useState('');
    const [era, setEra] = useState(event.year < 0 ? 'BCE' : 'CE');
    const [eraEnd, setEraEnd] = useState(event.yearEnd ? (event.yearEnd < 0 ? 'BCE' : 'CE') : 'CE');
    const isRange = event.yearEnd != null;

    const [locationOptions] = useState(() => generateLocationOptions(event));
    const [whatOptions] = useState(() => generateWhatOptions(event, ALL_EVENTS.map(e => e.id)));

    const scoreColors = {
        green: { bg: 'rgba(5, 150, 105, 0.08)', border: 'var(--color-success)' },
        yellow: { bg: 'rgba(217, 119, 6, 0.08)', border: 'var(--color-warning)' },
        red: { bg: 'rgba(185, 28, 28, 0.08)', border: 'var(--color-error)' },
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
        let s;
        if (isRange && dateEndInput) {
            const userEndYear = parseInt(dateEndInput);
            if (isNaN(userEndYear)) return;
            const startScore = scoreDateAnswer(userYear, era, event);
            const endScore = scoreDateAnswer(userEndYear, eraEnd, { ...event, year: event.yearEnd });
            const order = { green: 0, yellow: 1, red: 2 };
            s = order[startScore] >= order[endScore] ? startScore : endScore;
        } else {
            s = scoreDateAnswer(userYear, era, event);
        }
        setScore(s);
        setAnswered(true);
        onAnswer(s);
    };

    if (type === 'location') {
        return (
            <div className="animate-slide-in-right">
                <Card style={answered && score ? { backgroundColor: scoreColors[score].bg, borderLeft: `3px solid ${scoreColors[score].border}` } : {}}>
                    <p className="text-xs uppercase tracking-wider font-semibold mb-2" style={{ color: 'var(--color-ink-faint)' }}>Where did this happen?</p>
                    <h3 className="text-lg font-bold mb-1" style={{ fontFamily: 'var(--font-serif)' }}>{event.title}</h3>
                    <p className="text-sm mb-4" style={{ color: 'var(--color-terracotta)' }}>{event.date}</p>
                    <div className="space-y-2">
                        {locationOptions.map((opt, i) => {
                            const isCorrect = opt === event.location.place;
                            const isSelected = selectedAnswer === opt;
                            let optStyle = {};
                            if (answered) {
                                if (isCorrect) optStyle = { backgroundColor: 'rgba(5, 150, 105, 0.1)', borderColor: 'var(--color-success)' };
                                else if (isSelected) optStyle = { backgroundColor: 'rgba(185, 28, 28, 0.1)', borderColor: 'var(--color-error)' };
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
                </Card>
                {answered && <div className="mt-4"><Button className="w-full" onClick={onNext}>Continue →</Button></div>}
            </div>
        );
    }

    if (type === 'date') {
        return (
            <div className="animate-slide-in-right">
                <Card style={answered && score ? { backgroundColor: scoreColors[score].bg, borderLeft: `3px solid ${scoreColors[score].border}` } : {}}>
                    <p className="text-xs uppercase tracking-wider font-semibold mb-2" style={{ color: 'var(--color-ink-faint)' }}>When did this happen?</p>
                    <h3 className="text-lg font-bold mb-1" style={{ fontFamily: 'var(--font-serif)' }}>{event.title}</h3>
                    <p className="text-sm mb-4 leading-relaxed" style={{ color: 'var(--color-ink-secondary)' }}>{event.description.substring(0, 100)}…</p>

                    {!answered ? (
                        <>
                            <div className="space-y-3">
                                <div>
                                    <label className="text-xs font-semibold mb-1 block" style={{ color: 'var(--color-ink-muted)' }}>
                                        {isRange ? 'Start Year' : 'Year'}
                                    </label>
                                    <div className="flex gap-2">
                                        <input type="number" value={dateInput} onChange={e => setDateInput(e.target.value)}
                                            placeholder="e.g. 1453"
                                            className="flex-1 px-4 py-3 rounded-xl border-2 text-sm font-medium outline-none"
                                            style={{ borderColor: 'rgba(28, 25, 23, 0.1)', backgroundColor: 'var(--color-card)', color: 'var(--color-ink)' }} />
                                        <div className="flex rounded-xl border-2 overflow-hidden" style={{ borderColor: 'rgba(28, 25, 23, 0.1)' }}>
                                            {['BCE', 'CE'].map(e => (
                                                <button key={e} onClick={() => setEra(e)} className="px-3 py-2 text-xs font-bold"
                                                    style={{ backgroundColor: era === e ? 'var(--color-terracotta)' : 'transparent', color: era === e ? 'white' : 'var(--color-ink-muted)' }}>
                                                    {e}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                {isRange && (
                                    <div>
                                        <label className="text-xs font-semibold mb-1 block" style={{ color: 'var(--color-ink-muted)' }}>End Year</label>
                                        <div className="flex gap-2">
                                            <input type="number" value={dateEndInput} onChange={e => setDateEndInput(e.target.value)}
                                                placeholder="e.g. 1600"
                                                className="flex-1 px-4 py-3 rounded-xl border-2 text-sm font-medium outline-none"
                                                style={{ borderColor: 'rgba(28, 25, 23, 0.1)', backgroundColor: 'var(--color-card)', color: 'var(--color-ink)' }} />
                                            <div className="flex rounded-xl border-2 overflow-hidden" style={{ borderColor: 'rgba(28, 25, 23, 0.1)' }}>
                                                {['BCE', 'CE'].map(e => (
                                                    <button key={e} onClick={() => setEraEnd(e)} className="px-3 py-2 text-xs font-bold"
                                                        style={{ backgroundColor: eraEnd === e ? 'var(--color-terracotta)' : 'transparent', color: eraEnd === e ? 'white' : 'var(--color-ink-muted)' }}>
                                                        {e}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="mt-4">
                                <Button className="w-full" onClick={handleDateSubmit} disabled={!dateInput || (isRange && !dateEndInput)}>
                                    Check Answer
                                </Button>
                            </div>
                        </>
                    ) : (
                        <div className="mt-2">
                            <p className="text-sm font-semibold" style={{
                                color: score === 'green' ? 'var(--color-success)' : score === 'yellow' ? 'var(--color-warning)' : 'var(--color-error)'
                            }}>
                                {score === 'green' ? 'Excellent!' : score === 'yellow' ? 'Close!' : 'Not quite'}
                            </p>
                            <p className="text-sm" style={{ color: 'var(--color-ink-secondary)' }}>
                                <strong>{event.title}</strong> happened in <strong style={{ color: 'var(--color-terracotta)' }}>{event.date}</strong>
                            </p>
                        </div>
                    )}
                </Card>
                {answered && <div className="mt-4"><Button className="w-full" onClick={onNext}>Continue →</Button></div>}
            </div>
        );
    }

    if (type === 'what') {
        return (
            <div className="animate-slide-in-right">
                <Card style={answered && score ? { backgroundColor: scoreColors[score].bg, borderLeft: `3px solid ${scoreColors[score].border}` } : {}}>
                    <p className="text-xs uppercase tracking-wider font-semibold mb-2" style={{ color: 'var(--color-ink-faint)' }}>What happened?</p>
                    <p className="text-lg font-semibold mb-1" style={{ color: 'var(--color-terracotta)' }}>{event.date}</p>
                    <p className="text-sm mb-4" style={{ color: 'var(--color-ink-muted)' }}>{event.location.region}</p>
                    <div className="space-y-2">
                        {whatOptions.map((opt, i) => {
                            const isCorrect = opt.id === event.id;
                            const isSelected = selectedAnswer === opt.id;
                            let optStyle = {};
                            if (answered) {
                                if (isCorrect) optStyle = { backgroundColor: 'rgba(5, 150, 105, 0.1)', borderColor: 'var(--color-success)' };
                                else if (isSelected) optStyle = { backgroundColor: 'rgba(185, 28, 28, 0.1)', borderColor: 'var(--color-error)' };
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
                </Card>
                {answered && <div className="mt-4"><Button className="w-full" onClick={onNext}>Continue →</Button></div>}
            </div>
        );
    }

    return null;
}
