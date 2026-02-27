import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { getEventsByIds, getEventById, ALL_EVENTS, CATEGORY_CONFIG, ERA_BOUNDARY_EVENTS, ERA_RANGES, getEraBoundaryInfo } from '../../data/events';
import { scoreDateAnswer, generateLocationOptions, generateWhatOptions, generateDateMCQOptions, generateDescriptionOptions, calculateXP, SCORE_COLORS, getScoreColor, getScoreLabel } from '../../data/quiz';
import { Card, Button, ProgressBar, CategoryTag, Divider, StarButton, ConfirmModal, ExpandableText } from '../shared';
import Mascot from '../Mascot';

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

// Period overview data
const PERIOD_INFO = {
    prehistory: {
        title: 'Prehistory',
        subtitle: 'c. 7\u20136 million years ago \u2013 c. 3200 BCE',
        keywords: 'Evolution, fire, farming.',
        description: 'Literally "before written records," prehistory spans 99% of the human story \u2014 from bipedalism and stone tools through the mastery of fire, the emergence of language, migration out of Africa, and the Neolithic transition to settled agriculture.',
        color: '#0D9488', icon: '\uD83E\uDDB4',
    },
    ancient: {
        title: 'The Ancient World',
        subtitle: 'c. 3200 BCE \u2013 476 CE',
        keywords: 'Writing, cities, empires.',
        description: 'Defined by writing, cities, states, and empires. From Sumer and Egypt to Greece, Rome, China, and India \u2014 humanity built the foundations of law, philosophy, science, and organized religion.',
        color: '#6B5B73', icon: '\uD83C\uDFDB\uFE0F',
    },
    medieval: {
        title: 'The Medieval World',
        subtitle: '476 \u2013 c. 1500 CE',
        keywords: 'Islam, feudalism, Mongols.',
        description: 'An era of transformation, not darkness. The rise of Islam, Byzantine continuity, feudal Europe, the Mongol Empire, the Crusades, and the first universities \u2014 from Rome\u2019s fall to the reconnection of the world.',
        color: '#A0522D', icon: '\u2694\uFE0F',
    },
    earlymodern: {
        title: 'The Early Modern Period',
        subtitle: 'c. 1500 \u2013 1789',
        keywords: 'Exploration, Reformation, science.',
        description: 'Exploration, colonization, the Renaissance, Reformation, Scientific Revolution, and Enlightenment \u2014 from a fragmented world to an interconnected one, ending when Enlightenment ideals erupted into revolution.',
        color: '#65774A', icon: '\uD83E\uDDED',
    },
    modern: {
        title: 'The Modern World',
        subtitle: '1789 \u2013 Present',
        keywords: 'Industry, world wars, digital.',
        description: 'More change in two centuries than in the previous two millennia. Industrialization, world wars, decolonization, the Cold War, and the digital revolution. The defining theme is acceleration.',
        color: '#8B4157', icon: '\uD83C\uDF0D',
    },
};

export default function LessonFlow({ lesson, onComplete }) {
    const { state, dispatch } = useApp();
    const cardsPerLesson = state.cardsPerLesson || 3;
    const recapPerCard = state.recapPerCard ?? 2;
    const events = useMemo(() => getEventsByIds(lesson.eventIds).slice(0, cardsPerLesson), [lesson, cardsPerLesson]);

    const [phase, setPhase] = useState(PHASE.INTRO);
    const [cardIndex, setCardIndex] = useState(0);         // 0–2, current card in learn phase
    const [learnQuizIndex, setLearnQuizIndex] = useState(0); // 0–1, quiz within current card
    const [recapIndex, setRecapIndex] = useState(0);         // 0–5, recap questions
    const [reviewIndex, setReviewIndex] = useState(0);
    const [quizResults, setQuizResults] = useState([]);
    const [selectedDot, setSelectedDot] = useState(null);    // for result dot modal
    const [showExitConfirm, setShowExitConfirm] = useState(false);
    const xpDispatched = useRef(false);

    // For each card, randomly pick 3 of the 4 question types to use for MCQs (discarding 1)
    // Then assign 2 to the learn phase and 1 to the recap phase
    const selectedTypes = useMemo(() => {
        return events.map(() => {
            const shuffled = [...QUESTION_TYPES].sort(() => Math.random() - 0.5);
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
        return qs.sort(() => Math.random() - 0.5);
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

    // ─── Dispatch XP on summary ───
    useEffect(() => {
        if (phase === PHASE.SUMMARY && !xpDispatched.current) {
            xpDispatched.current = true;
            const xp = calculateXP(quizResults);
            dispatch({ type: 'COMPLETE_LESSON', lessonId: lesson.id });
            dispatch({ type: 'ADD_XP', amount: xp });
        }
    }, [phase, quizResults, lesson.id, dispatch]);

    const handleExit = useCallback(() => {
        setShowExitConfirm(true);
    }, []);

    // Helper: record answer
    const recordAnswer = useCallback((eventId, questionType, score) => {
        const event = getEventById(eventId);
        setQuizResults(prev => [...prev, {
            eventId,
            questionType,
            firstScore: score,
            retryScore: null,
            difficulty: event?.difficulty || 1,
        }]);
        dispatch({
            type: 'UPDATE_EVENT_MASTERY',
            eventId,
            questionType: questionType === 'date_input' ? 'date' : questionType,
            score,
        });
    }, [dispatch]);

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
            dispatch({ type: 'MARK_EVENTS_SEEN', eventIds: events.map(e => e.id) });
        };

        return (
            <div className="lesson-flow-container animate-fade-in">
                <div className="flex-shrink-0 pt-4">
                    <button onClick={onComplete} className="flex items-center gap-1 text-sm"
                        style={{ color: 'var(--color-ink-muted)' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
                        Back
                    </button>
                </div>
                <div className="flex-1 min-h-0 overflow-y-auto">
                    <div className="text-center py-4">
                        <span className="text-xs font-semibold uppercase tracking-widest block mb-2" style={{ color: 'var(--color-ink-faint)' }}>
                            Lesson {lesson.number}
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
                            {events.length} {events.length === 1 ? 'event' : 'events'} · {totalQuestions} questions · ~{Math.max(1, Math.round(totalQuestions / 2))} min
                        </p>
                        <Mascot mood="happy" size={64} />
                        {timesCompleted > 0 && (
                            <p className="text-xs font-medium mt-3 mb-1" style={{ color: 'var(--color-success)' }}>
                                ✓ Completed {timesCompleted} {timesCompleted === 1 ? 'time' : 'times'}
                            </p>
                        )}
                    </div>
                </div>
                <div className="flex-shrink-0 pt-4 pb-2">
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
                        <span className="text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full"
                            style={{ backgroundColor: `${period.color}15`, color: period.color }}>
                            Period Overview
                        </span>
                    </div>
                </div>
                <div className="flex-1 min-h-0 overflow-y-auto">
                    <div className="animate-slide-in-right">
                        <Card className="era-card-content" style={{ borderLeft: `4px solid ${period.color}` }}>
                            <div className="text-center mb-2 sm:mb-4"><span className="era-card-icon">{period.icon}</span></div>
                            <h2 className="era-card-title font-bold text-center mb-1" style={{ fontFamily: 'var(--font-serif)' }}>{period.title}</h2>
                            <p className="text-sm font-semibold text-center mb-2 sm:mb-4" style={{ color: period.color }}>{period.subtitle}</p>
                            <Divider />
                            <ExpandableText lines={3} className="text-sm leading-relaxed mt-4" style={{ color: 'var(--color-ink-secondary)' }}>
                                <strong style={{ color: 'var(--color-ink)' }}>{period.keywords}</strong>{' '}{period.description}
                            </ExpandableText>
                            {(() => {
                                const boundary = ERA_BOUNDARY_EVENTS[lesson.periodId];
                                if (!boundary) return null;
                                const startEvt = boundary.startEventId ? getEventById(boundary.startEventId) : null;
                                const endEvt = boundary.endEventId ? getEventById(boundary.endEventId) : null;
                                return (
                                    <div className="mt-4 pt-3" style={{ borderTop: '1px solid rgba(28, 25, 23, 0.06)' }}>
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
                    <div className="flex items-center justify-between mb-4">
                        <button onClick={handleExit} className="text-sm flex items-center gap-1" style={{ color: 'var(--color-ink-muted)' }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
                            Exit
                        </button>
                        <span className="text-sm font-medium" style={{ color: 'var(--color-ink-muted)' }}>
                            Card {cardIndex + 1} of {events.length}
                        </span>
                    </div>

                    <ProgressBar value={cardIndex + 1} max={events.length} />

                    <div className="text-center mt-2 mb-1">
                        <span className="text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full"
                            style={{ backgroundColor: 'var(--color-burgundy-soft)', color: 'var(--color-burgundy)' }}>
                            📖 Study
                        </span>
                    </div>
                </div>

                <div className="flex-1 min-h-0 overflow-y-auto mt-4" key={event.id}>
                    <div className="animate-slide-in-right">
                        <Card>
                            <div className="flex items-center justify-between">
                                <CategoryTag category={event.category} />
                                <StarButton
                                    isStarred={(state.starredEvents || []).includes(event.id)}
                                    onClick={() => dispatch({ type: 'TOGGLE_STAR', eventId: event.id })}
                                />
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
                                {event.description}
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
                                <div className="mt-4 pt-3" style={{ borderTop: '1px solid rgba(28, 25, 23, 0.06)' }}>
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

        return (
            <div className="py-4 animate-fade-in" key={`learn-q-${cardIndex}-${learnQuizIndex}`}>
                <div className="flex items-center justify-between mb-4">
                    <span className="text-sm" style={{ color: 'var(--color-ink-muted)' }}>
                        Card {cardIndex + 1} · Question {learnQuizIndex + 1}/2
                    </span>
                    <span className="text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: 'var(--color-burgundy-soft)', color: 'var(--color-burgundy)' }}>
                        📝 Learn Quiz
                    </span>
                </div>
                <ProgressBar value={answeredCount + 1} max={totalQuestions} />

                <div className="mt-6">
                    <QuizQuestion
                        question={q}
                        lessonEventIds={lesson.eventIds}
                        onAnswer={(score) => recordAnswer(q.event.id, q.type, score)}
                        onNext={() => setLearnQuizIndex(i => i + 1)}
                        onBack={learnQuizIndex > 0 ? () => setLearnQuizIndex(i => i - 1) : null}
                    />
                </div>
            </div>
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
                            {recapQuestions.length} {recapQuestions.length === 1 ? 'question' : 'questions'}{recapPerCard === 2 ? ' \u2014 including typing exact dates' : ''}
                        </p>
                        <div className="flex justify-center gap-2 mb-4 flex-wrap">
                            {events.map((e, i) => (
                                <div key={i} className="px-3 py-1.5 rounded-lg text-xs font-medium"
                                    style={{ backgroundColor: 'var(--color-burgundy-soft)', color: 'var(--color-burgundy)' }}>
                                    {e.title.length > 20 ? e.title.substring(0, 18) + '\u2026' : e.title}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="flex-shrink-0 pt-4 pb-2">
                    <Button className="w-full" onClick={() => {
                        setRecapIndex(0);
                        setPhase(PHASE.RECAP);
                    }}>
                        Start Recap \u2192
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

        return (
            <div className="py-4 animate-fade-in" key={`recap-${recapIndex}`}>
                <div className="flex items-center justify-between mb-4">
                    <span className="text-sm" style={{ color: 'var(--color-ink-muted)' }}>
                        Recap {recapIndex + 1} / {recapQuestions.length}
                    </span>
                    <span className="text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: 'rgba(139, 65, 87, 0.15)', color: 'var(--color-burgundy)' }}>
                        🔁 Recap
                    </span>
                </div>
                <ProgressBar value={answeredCount + 1} max={totalQuestions} />

                <div className="mt-6">
                    {q.isDateInput ? (
                        <DateInputQuestion
                            event={q.event}
                            onAnswer={(score) => recordAnswer(q.event.id, 'date_input', score)}
                            onNext={() => setRecapIndex(i => i + 1)}
                            onBack={recapIndex > 0 ? () => setRecapIndex(i => i - 1) : null}
                            onSkip={() => setRecapIndex(i => i + 1)}
                        />
                    ) : (
                        <QuizQuestion
                            question={q}
                            lessonEventIds={lesson.eventIds}
                            onAnswer={(score) => recordAnswer(q.event.id, q.type, score)}
                            onNext={() => setRecapIndex(i => i + 1)}
                            onBack={recapIndex > 0 ? () => setRecapIndex(i => i - 1) : null}
                            onSkip={() => setRecapIndex(i => i + 1)}
                        />
                    )}
                </div>
            </div>
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
                                {event.description}
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

        return (
            <div className="lesson-flow-container animate-fade-in">
                <div className="flex-1 min-h-0 overflow-y-auto">
                    <div className="text-center py-4">
                        <Mascot mood={allPassed ? 'celebrating' : 'thinking'} size={80} />
                        <h2 className="text-2xl font-bold mt-4 mb-1" style={{ fontFamily: 'var(--font-serif)' }}>
                            {allPassed ? 'Lesson Complete!' : 'Keep Practicing'}
                        </h2>
                        <p className="text-sm mb-6" style={{ color: 'var(--color-ink-muted)' }}>{lesson.title}</p>

                        <Card className={allPassed ? 'animate-celebration' : ''} style={{
                            borderTop: allPassed ? '3px solid var(--color-success)' : '3px solid var(--color-warning)',
                        }}>
                            <div className="text-sm font-semibold mb-3" style={{ color: 'var(--color-ink-secondary)' }}>
                                {events.length} events · {quizResults.length} questions
                            </div>

                            <div className="flex items-center gap-1 mb-4 justify-center flex-wrap">
                                {quizResults.map((r, i) => (
                                    <button key={i}
                                        className="w-3 h-3 rounded-full result-dot-btn"
                                        title={`${events.find(e => e.id === r.eventId)?.title || 'Event'} \u2014 ${r.questionType}`}
                                        onClick={() => setSelectedDot(r)}
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

                            <div className="flex items-center justify-center gap-6 mt-3">
                                <div className="flex items-center gap-2">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-bronze)" strokeWidth="2">
                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="var(--color-bronze-light)" />
                                    </svg>
                                    <div className="text-left">
                                        <div className="text-xl font-bold leading-none" style={{ color: 'var(--color-burgundy)' }}>+{xp}</div>
                                        <div className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--color-ink-faint)' }}>XP earned</div>
                                    </div>
                                </div>
                                <div className="w-px h-10" style={{ backgroundColor: 'rgba(28, 25, 23, 0.08)' }} />
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl">\uD83D\uDD25</span>
                                    <div className="text-left">
                                        <div className="text-xl font-bold leading-none" style={{ color: 'var(--color-burgundy)' }}>{streak}</div>
                                        <div className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--color-ink-faint)' }}>Day streak</div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>

                <div className="flex-shrink-0 pt-4 pb-2">
                    <Button className="w-full" onClick={onComplete}>Continue</Button>
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
                                        <span className="text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full"
                                            style={{ backgroundColor: hlBg, color: dotColor }}>
                                            {qType === 'date' || qType === 'date_input' ? '📅 Date Question'
                                                : qType === 'location' ? '📍 Location Question'
                                                    : qType === 'description' ? '📝 Event Description' : '❓ What Happened'}
                                        </span>
                                        <button onClick={() => setSelectedDot(null)}
                                            className="w-7 h-7 rounded-full flex items-center justify-center text-sm"
                                            style={{ color: 'var(--color-ink-muted)', backgroundColor: 'rgba(28,25,23,0.05)' }}>✕</button>
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
function QuizQuestion({ question, lessonEventIds, onAnswer, onNext, onBack, onSkip }) {
    const { event, type } = question;
    const [answered, setAnswered] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [score, setScore] = useState(null);

    // MCQ options (memoized once)
    const [locationOptions] = useState(() => generateLocationOptions(event));
    const [whatOptions] = useState(() => generateWhatOptions(event, lessonEventIds));
    const [dateOptions] = useState(() => generateDateMCQOptions(event));
    const [descriptionOptions] = useState(() => generateDescriptionOptions(event));


    const handleAnswer = useCallback((answer, correct) => {
        if (answered) return;
        setSelectedAnswer(answer);
        const s = answer === correct ? 'green' : 'red';
        setScore(s);
        setAnswered(true);
        onAnswer(s);
    }, [answered, onAnswer]);

    const renderButtons = () => {
        if (answered) {
            return (
                <div className="pinned-footer flex gap-3">
                    {onBack && <Button variant="secondary" onClick={onBack}>\u2190 Back</Button>}
                    <Button className="flex-1" onClick={onNext}>Continue \u2192</Button>
                </div>
            );
        }
        if (onSkip || onBack) {
            return (
                <div className="pinned-footer flex gap-3">
                    {onBack && <Button variant="secondary" onClick={onBack}>\u2190 Back</Button>}
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
                        {event.description.substring(0, 80)}…
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
                                    <span className="leading-relaxed text-sm block" style={{ color: 'var(--color-ink-secondary)' }}>{opt.description}</span>
                                    {answered && isCorrect && <span className="ml-2 text-xs font-bold mt-1 block" style={{ color: 'var(--color-success)' }}>✓ Correct</span>}
                                </button>
                            );
                        })}
                    </div>
                </Card>
                {renderButtons()}
            </div>
        );
    }

    return null;
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
    }, [answered, dateInput, era, event, onAnswer]);

    const isRange = event.yearEnd != null;
    const hint = isRange
        ? 'Enter any year within the range'
        : (Math.abs(event.year) > 100000 ? 'Approximate is fine' : '');

    return (
        <div className="animate-slide-in-right">
            <Card style={answered && score ? { backgroundColor: SCORE_COLORS[score].bg, borderLeft: `3px solid ${SCORE_COLORS[score].border}` } : {}}>
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: 'rgba(139, 65, 87, 0.1)', color: 'var(--color-burgundy)' }}>
                        ✏️ Type the date
                    </span>
                </div>
                <h3 className="text-lg font-bold mb-1" style={{ fontFamily: 'var(--font-serif)' }}>{event.title}</h3>
                <p className="text-sm mb-2 leading-relaxed" style={{ color: 'var(--color-ink-secondary)' }}>
                    {event.description.substring(0, 100)}…
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
                                    style={{ borderColor: 'rgba(28,25,23,0.1)', backgroundColor: 'var(--color-card)', color: 'var(--color-ink)' }}
                                    onFocus={e => e.target.style.borderColor = 'var(--color-burgundy)'}
                                    onBlur={e => e.target.style.borderColor = 'rgba(28,25,23,0.1)'}
                                />
                                <div className="flex rounded-xl border-2 overflow-hidden" style={{ borderColor: 'rgba(28,25,23,0.1)' }}>
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

            {answered && (
                <div className="pinned-footer flex gap-3">
                    {onBack && <Button variant="secondary" onClick={onBack}>← Back</Button>}
                    <Button className="flex-1" onClick={onNext}>Continue →</Button>
                </div>
            )}
        </div>
    );
}
