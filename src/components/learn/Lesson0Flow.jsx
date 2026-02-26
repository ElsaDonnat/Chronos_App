import { useState, useMemo, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { getEventById, ERA_BOUNDARY_EVENTS } from '../../data/events';
import { SCORE_COLORS, getScoreLabel } from '../../data/quiz';
import { Card, Button, ProgressBar, Divider } from '../shared';
import Mascot from '../Mascot';

// ─── Matching colors for pairing lines ──────────────────
const MATCH_COLORS = [
    '#8B4157', // burgundy
    '#0D9488', // teal
    '#6B5B73', // purple
    '#C9A96E', // gold
    '#A0522D', // brown
];

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
        prehistory: {
            title: 'Prehistory',
            subtitle: 'c. 7\u20136 million years ago \u2013 c. 3200 BCE',
            description: 'Literally "before written records," prehistory spans 99% of the human story. It traces the arc from biological to cultural evolution: bipedalism, stone tools, the mastery of fire, the emergence of language and symbolic thought, the migration out of Africa to every continent, and finally the Neolithic transition from nomadic foraging to settled agriculture that made civilization possible.',
            color: '#0D9488', icon: '\uD83E\uDDB4',
        },
        ancient: {
            title: 'The Ancient World',
            subtitle: 'c. 3200 BCE \u2013 476 CE',
            description: 'Defined by the invention of writing, the rise of cities, and the emergence of states and empires. Mesopotamia, Egypt, Greece, Rome, China, and India each developed distinct traditions of law, philosophy, science, and organized religion. The era\u2019s arc runs from the first civilizations in Sumer to the collapse of the largest \u2014 the Western Roman Empire \u2014 under the weight of economic decay and Germanic invasions.',
            color: '#6B5B73', icon: '\uD83C\uDFDB\uFE0F',
        },
        medieval: {
            title: 'The Medieval World',
            subtitle: '476 \u2013 c. 1500 CE',
            description: 'Far from the "Dark Ages" of popular myth, this was an era of transformation. Islam rose and spread from Arabia to Iberia, the Byzantine Empire preserved Roman learning for a millennium, feudalism structured Western Europe, the Mongol Empire connected East and West, the Crusades reshaped Mediterranean trade, and Europe\u2019s first universities were founded. The era\u2019s arc runs from Rome\u2019s fall to the reconnection of the world.',
            color: '#A0522D', icon: '\u2694\uFE0F',
        },
        earlymodern: {
            title: 'The Early Modern Period',
            subtitle: 'c. 1500 \u2013 1789',
            description: 'European exploration and colonization linked every continent for the first time. The Renaissance revived classical learning, the Reformation shattered religious unity, the Scientific Revolution overturned ancient certainties, and the Enlightenment challenged the divine right of kings. The Atlantic slave trade forcibly connected three continents. The arc is from a fragmented world to an interconnected one, ending when Enlightenment ideals erupted into revolution.',
            color: '#65774A', icon: '\uD83E\uDDED',
        },
        modern: {
            title: 'The Modern World',
            subtitle: '1789 \u2013 Present',
            description: 'More change in two centuries than in the previous two millennia. Industrialization transformed how people worked and lived, nationalism redrew the map of Europe, two world wars killed tens of millions and dismantled colonial empires, the Cold War split the globe, decolonization reshaped the Global South, and the digital revolution connected billions. The defining theme is acceleration \u2014 of technology, population, and the pace of change itself.',
            color: '#8B4157', icon: '\uD83C\uDF0D',
        },
    }[id];
    const boundary = ERA_BOUNDARY_EVENTS[id];
    const startEvent = boundary?.startEventId ? getEventById(boundary.startEventId) : null;
    const endEvent = boundary?.endEventId ? getEventById(boundary.endEventId) : null;
    return { id, ...info, startEvent, endEvent };
});

// ─── Fake but plausible date ranges for each era ──────
// Each era has "close" fakes (right ballpark, off by a bit) and
// "far" fakes (different ballpark — too early, too late, too wide, etc.)
// This prevents process-of-elimination and tests real knowledge.
const FAKE_DATES = {
    prehistory: {
        close: [
            'c. 7\u20136 million years ago \u2013 c. 5000 BCE',
            'c. 4 million years ago \u2013 c. 3200 BCE',
            'c. 7\u20136 million years ago \u2013 c. 1500 BCE',
            'c. 5 million years ago \u2013 c. 3000 BCE',
        ],
        far: [
            'c. 10 million years ago \u2013 c. 8000 BCE',
            'c. 2 million years ago \u2013 c. 500 BCE',
            'c. 3 million years ago \u2013 c. 5000 BCE',
            'c. 12 million years ago \u2013 c. 4000 BCE',
        ],
    },
    ancient: {
        close: [
            'c. 3500 BCE \u2013 476 CE',
            'c. 3200 BCE \u2013 330 CE',
            'c. 3200 BCE \u2013 565 CE',
            'c. 3000 BCE \u2013 476 CE',
        ],
        far: [
            'c. 5000 BCE \u2013 200 CE',
            'c. 2000 BCE \u2013 750 CE',
            'c. 4000 BCE \u2013 600 CE',
            'c. 1500 BCE \u2013 476 CE',
        ],
    },
    medieval: {
        close: [
            '476 \u2013 1453 CE',
            '500 \u2013 c. 1500 CE',
            '476 \u2013 1648 CE',
            '476 \u2013 c. 1400 CE',
        ],
        far: [
            '410 \u2013 1350 CE',
            '600 \u2013 1600 CE',
            '300 \u2013 1453 CE',
            '700 \u2013 1500 CE',
        ],
    },
    earlymodern: {
        close: [
            '1492 \u2013 1789',
            'c. 1500 \u2013 1815',
            'c. 1500 \u2013 1776',
            '1453 \u2013 1789',
        ],
        far: [
            '1453 \u2013 1648',
            '1600 \u2013 1900',
            '1450 \u2013 1750',
            '1350 \u2013 1700',
        ],
    },
    modern: {
        close: [
            '1776 \u2013 Present',
            '1815 \u2013 Present',
            '1800 \u2013 Present',
            '1750 \u2013 Present',
        ],
        far: [
            '1648 \u2013 Present',
            '1848 \u2013 Present',
            '1914 \u2013 Present',
            '1700 \u2013 Present',
        ],
    },
};

// Pick 3 fake date ranges for a given era: randomly 1-2 close + 1-2 far
function pickFakeDates(periodId) {
    const pool = FAKE_DATES[periodId];
    const closeCount = Math.random() < 0.5 ? 1 : 2;
    const farCount = 3 - closeCount;
    const shuffledClose = [...pool.close].sort(() => Math.random() - 0.5);
    const shuffledFar = [...pool.far].sort(() => Math.random() - 0.5);
    return [
        ...shuffledClose.slice(0, closeCount),
        ...shuffledFar.slice(0, farCount),
    ];
}

// ─── Generate MCQ quiz questions ───────────────────────
function generateQuizQuestions() {
    const questions = [];

    for (const period of PERIODS) {
        // Q1: "When?" — given period name, pick correct date range
        // Wrong answers are plausible fakes, NOT real dates of other eras
        const fakes = pickFakeDates(period.id);
        const dateOptions = [period.subtitle, ...fakes].sort(() => Math.random() - 0.5);
        questions.push({
            type: 'date',
            periodId: period.id,
            prompt: period.title,
            promptIcon: period.icon,
            correctAnswer: period.subtitle,
            options: dateOptions,
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

    // Q11: Matching — match all 5 eras to their real date ranges
    const shuffledNames = PERIODS.map(p => ({ id: p.id, label: `${p.icon} ${p.title}` }))
        .sort(() => Math.random() - 0.5);
    const shuffledDates = PERIODS.map(p => ({ id: p.id, label: p.subtitle }))
        .sort(() => Math.random() - 0.5);
    questions.push({
        type: 'match',
        periodId: 'all',
        names: shuffledNames,
        dates: shuffledDates,
    });

    // Shuffle MCQs but keep match question at the end
    const matchQ = questions.pop();
    const shuffled = questions.sort(() => Math.random() - 0.5);
    shuffled.push(matchQ);
    return shuffled;
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
    // Matching question state
    const [matchPairs, setMatchPairs] = useState({});       // { nameId: dateId }
    const [matchSelected, setMatchSelected] = useState(null); // currently selected name id
    const [matchChecked, setMatchChecked] = useState(false);
    const xpDispatched = useRef(false);

    const greenCount = useMemo(() => results.filter(r => r.score === 'green').length, [results]);
    const yellowCount = useMemo(() => results.filter(r => r.score === 'yellow').length, [results]);

    // Dispatch XP when summary is reached
    useEffect(() => {
        if (phase === PHASE.SUMMARY && !xpDispatched.current) {
            xpDispatched.current = true;
            dispatch({ type: 'COMPLETE_LESSON', lessonId: 'lesson-0' });
            dispatch({ type: 'ADD_XP', amount: greenCount * 5 + yellowCount * 2 });
        }
    }, [phase, greenCount, yellowCount, dispatch]);

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
                    <h1 className="lesson-intro-title font-bold mb-3" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ink)' }}>
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

                <div className="mt-3 animate-slide-in-right" key={period.id}>
                    <Card className="era-card-content" style={{ borderLeft: `4px solid ${period.color}`, overflow: 'hidden' }}>
                        <div className="text-center mb-2 sm:mb-4">
                            <span className="era-card-icon">{period.icon}</span>
                        </div>
                        <h2 className="era-card-title font-bold text-center mb-1" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ink)' }}>
                            {period.title}
                        </h2>
                        <p className="text-sm font-semibold text-center mb-2 sm:mb-4" style={{ color: period.color }}>
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

                <div className="flex gap-3 mt-4">
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

    // ─── QUIZ ─────────────────────────────────────────
    if (phase === PHASE.QUIZ) {
        const q = quizQuestions[quizIndex];

        if (!q) {
            if (phase !== PHASE.SUMMARY) {
                setTimeout(() => setPhase(PHASE.SUMMARY), 0);
            }
            return null;
        }

        const handleNext = () => {
            if (quizIndex + 1 >= quizQuestions.length) {
                setPhase(PHASE.SUMMARY);
            } else {
                setQuizIndex(i => i + 1);
                setSelectedAnswer(null);
                setAnswered(false);
                setMatchPairs({});
                setMatchSelected(null);
                setMatchChecked(false);
            }
        };

        // ── Matching question ──────────────────────────
        if (q.type === 'match') {
            const pairCount = Object.keys(matchPairs).length;
            const allPaired = pairCount === 5;

            // Which color index does each name get?
            const nameColorMap = {};
            const dateColorMap = {};
            const pairedNames = Object.keys(matchPairs);
            pairedNames.forEach((nameId, i) => {
                nameColorMap[nameId] = MATCH_COLORS[i % MATCH_COLORS.length];
                dateColorMap[matchPairs[nameId]] = MATCH_COLORS[i % MATCH_COLORS.length];
            });

            const handleNameClick = (nameId) => {
                if (matchChecked) return;
                if (matchSelected === nameId) {
                    setMatchSelected(null);
                } else {
                    setMatchSelected(nameId);
                }
            };

            const handleDateClick = (dateId) => {
                if (matchChecked) return;
                if (!matchSelected) {
                    // If clicking a date that's already paired, unpair it
                    const pairedName = Object.entries(matchPairs).find(([, d]) => d === dateId)?.[0];
                    if (pairedName) {
                        setMatchPairs(prev => {
                            const next = { ...prev };
                            delete next[pairedName];
                            return next;
                        });
                    }
                    return;
                }
                // Pair the selected name with this date
                setMatchPairs(prev => {
                    const next = { ...prev };
                    // Remove any existing pair for this name
                    delete next[matchSelected];
                    // Remove any existing pair that uses this date
                    const existingName = Object.entries(next).find(([, d]) => d === dateId)?.[0];
                    if (existingName) delete next[existingName];
                    next[matchSelected] = dateId;
                    return next;
                });
                setMatchSelected(null);
            };

            const handleCheck = () => {
                if (!allPaired || matchChecked) return;
                // Count correct matches
                const correctCount = q.names.filter(n => matchPairs[n.id] === n.id).length;
                // Score: all correct = green, exactly 1 swap (4 correct or 3 correct) = yellow, else red
                // A single swap means exactly 2 items are swapped, so 3 correct is the minimum for "one swap"
                const wrongCount = 5 - correctCount;
                const score = wrongCount === 0 ? 'green' : wrongCount <= 2 ? 'yellow' : 'red';
                setResults(prev => [...prev, { score, periodId: 'all', type: 'match' }]);
                setMatchChecked(true);
            };

            const matchScore = matchChecked ? results[results.length - 1]?.score : null;

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

                    <div className="mt-4 animate-slide-in-right">
                        <Card style={matchChecked && matchScore ? {
                            backgroundColor: SCORE_COLORS[matchScore].bg,
                            borderLeft: `3px solid ${SCORE_COLORS[matchScore].border}`
                        } : {}}>
                            <p className="text-xs uppercase tracking-wider font-semibold mb-1" style={{ color: 'var(--color-ink-faint)' }}>
                                Match each era to its dates
                            </p>
                            <p className="text-[11px] mb-3" style={{ color: 'var(--color-ink-faint)' }}>
                                Tap an era, then tap its date range
                            </p>

                            <div className="flex gap-2">
                                {/* Left column: era names */}
                                <div className="flex-1 flex flex-col gap-1.5">
                                    {q.names.map((n) => {
                                        const isPaired = !!matchPairs[n.id];
                                        const isActive = matchSelected === n.id;
                                        const color = nameColorMap[n.id];
                                        let bg = 'var(--color-card)';
                                        let border = 'rgba(28, 25, 23, 0.08)';
                                        if (matchChecked && isPaired) {
                                            const isCorrect = matchPairs[n.id] === n.id;
                                            bg = isCorrect ? 'rgba(5, 150, 105, 0.1)' : 'rgba(166, 61, 61, 0.1)';
                                            border = isCorrect ? 'var(--color-success)' : 'var(--color-error)';
                                        } else if (isActive) {
                                            bg = 'var(--color-burgundy-soft)';
                                            border = 'var(--color-burgundy)';
                                        } else if (isPaired && color) {
                                            bg = `${color}18`;
                                            border = color;
                                        }
                                        return (
                                            <button
                                                key={n.id}
                                                onClick={() => handleNameClick(n.id)}
                                                disabled={matchChecked}
                                                className="text-left rounded-lg transition-all"
                                                style={{
                                                    padding: '8px 10px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: 600,
                                                    fontFamily: 'var(--font-serif)',
                                                    backgroundColor: bg,
                                                    border: `2px solid ${border}`,
                                                    color: 'var(--color-ink)',
                                                    cursor: matchChecked ? 'default' : 'pointer',
                                                }}
                                            >
                                                {n.label}
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Right column: date ranges */}
                                <div className="flex-1 flex flex-col gap-1.5">
                                    {q.dates.map((d) => {
                                        const pairedByName = Object.entries(matchPairs).find(([, dateId]) => dateId === d.id)?.[0];
                                        const isPaired = !!pairedByName;
                                        const color = dateColorMap[d.id];
                                        let bg = 'var(--color-card)';
                                        let border = 'rgba(28, 25, 23, 0.08)';
                                        if (matchChecked && isPaired) {
                                            const isCorrect = pairedByName === d.id;
                                            bg = isCorrect ? 'rgba(5, 150, 105, 0.1)' : 'rgba(166, 61, 61, 0.1)';
                                            border = isCorrect ? 'var(--color-success)' : 'var(--color-error)';
                                        } else if (isPaired && color) {
                                            bg = `${color}18`;
                                            border = color;
                                        } else if (matchSelected && !isPaired) {
                                            border = 'rgba(139, 65, 87, 0.3)';
                                        }
                                        return (
                                            <button
                                                key={d.id}
                                                onClick={() => handleDateClick(d.id)}
                                                disabled={matchChecked}
                                                className="text-left rounded-lg transition-all"
                                                style={{
                                                    padding: '8px 10px',
                                                    fontSize: '0.7rem',
                                                    fontWeight: 500,
                                                    backgroundColor: bg,
                                                    border: `2px solid ${border}`,
                                                    color: 'var(--color-ink-secondary)',
                                                    cursor: matchChecked ? 'default' : 'pointer',
                                                }}
                                            >
                                                {d.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {matchChecked && (
                                <div className="mt-3">
                                    <p className="text-sm font-semibold" style={{
                                        color: matchScore === 'green' ? 'var(--color-success)' :
                                            matchScore === 'yellow' ? 'var(--color-warning)' : 'var(--color-error)'
                                    }}>
                                        {getScoreLabel(matchScore)}
                                    </p>
                                    {matchScore !== 'green' && (
                                        <p className="text-xs mt-1" style={{ color: 'var(--color-ink-muted)' }}>
                                            {q.names.filter(n => matchPairs[n.id] === n.id).length} of 5 correct
                                        </p>
                                    )}
                                </div>
                            )}
                        </Card>
                    </div>

                    <div className="mt-4">
                        {!matchChecked ? (
                            <Button
                                className="w-full"
                                onClick={handleCheck}
                                disabled={!allPaired}
                                variant={allPaired ? 'primary' : 'secondary'}
                            >
                                {allPaired ? 'Check Answers' : `${pairCount}/5 matched`}
                            </Button>
                        ) : (
                            <Button className="w-full" onClick={handleNext}>Continue →</Button>
                        )}
                    </div>
                </div>
            );
        }

        // ── MCQ question (date / event) ────────────────
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

        const currentScore = answered ? results[results.length - 1]?.score : null;
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
                        backgroundColor: SCORE_COLORS[currentScore].bg,
                        borderLeft: `3px solid ${SCORE_COLORS[currentScore].border}`
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

                        <div className="mcq-options mcq-options--grid">
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
                                        className="mcq-option"
                                        style={{
                                            borderColor: isSelected && !answered ? 'var(--color-burgundy)' : undefined,
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
        const redCount = results.filter(r => r.score === 'red').length;
        const xp = greenCount * 5 + yellowCount * 2;

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
                            const dotLabel = r.type === 'match' ? 'Matching' : r.type === 'date' ? 'Date' : 'Period Name';
                            return (
                                <button key={i}
                                    className={`rounded-full result-dot-btn ${r.type === 'match' ? 'w-4 h-4' : 'w-3 h-3'}`}
                                    title={`${period?.title || 'All Eras'} — ${dotLabel}`}
                                    onClick={() => setSelectedDot(r)}
                                    style={{
                                        backgroundColor: r.score === 'green' ? 'var(--color-success)' :
                                            r.score === 'yellow' ? 'var(--color-warning)' : 'var(--color-error)'
                                    }} />
                            );
                        })}
                    </div>

                    <div className={`grid gap-3 text-center mb-4 ${yellowCount > 0 ? 'grid-cols-3' : 'grid-cols-2'}`}>
                        <div>
                            <div className="text-lg font-bold" style={{ color: 'var(--color-success)' }}>{greenCount}</div>
                            <div className="text-xs" style={{ color: 'var(--color-ink-muted)' }}>Correct</div>
                        </div>
                        {yellowCount > 0 && (
                            <div>
                                <div className="text-lg font-bold" style={{ color: 'var(--color-warning)' }}>{yellowCount}</div>
                                <div className="text-xs" style={{ color: 'var(--color-ink-muted)' }}>Close</div>
                            </div>
                        )}
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
                    const dotColor = selectedDot.score === 'green' ? 'var(--color-success)' :
                        selectedDot.score === 'yellow' ? 'var(--color-warning)' : 'var(--color-error)';
                    const hlBg = selectedDot.score === 'green' ? 'rgba(5, 150, 105, 0.12)' :
                        selectedDot.score === 'yellow' ? 'rgba(198, 134, 42, 0.12)' : 'rgba(166, 61, 61, 0.12)';

                    // Match question dot modal
                    if (selectedDot.type === 'match') {
                        return (
                            <div className="dot-modal-backdrop" onClick={() => setSelectedDot(null)}>
                                <div className="dot-modal-content" onClick={e => e.stopPropagation()}>
                                    <Card style={{ borderLeft: `4px solid var(--color-burgundy)` }}>
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full"
                                                style={{ backgroundColor: hlBg, color: dotColor }}>
                                                🔗 Matching Question
                                            </span>
                                            <button onClick={() => setSelectedDot(null)}
                                                className="w-7 h-7 rounded-full flex items-center justify-center text-sm"
                                                style={{ color: 'var(--color-ink-muted)', backgroundColor: 'rgba(28,25,23,0.05)' }}>✕</button>
                                        </div>
                                        <p className="text-sm font-semibold mb-3" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ink)' }}>
                                            Match each era to its dates
                                        </p>
                                        <div className="space-y-1.5">
                                            {PERIODS.map(p => (
                                                <div key={p.id} className="flex items-center gap-2 text-xs py-1 px-2 rounded-lg"
                                                    style={{ backgroundColor: 'rgba(28,25,23,0.03)' }}>
                                                    <span>{p.icon}</span>
                                                    <span className="font-semibold" style={{ color: 'var(--color-ink)' }}>{p.title}</span>
                                                    <span style={{ color: 'var(--color-ink-faint)' }}>→</span>
                                                    <span style={{ color: 'var(--color-ink-secondary)' }}>{p.subtitle}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </Card>
                                </div>
                            </div>
                        );
                    }

                    // MCQ question dot modal
                    const period = PERIODS.find(p => p.id === selectedDot.periodId);
                    if (!period) return null;
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
