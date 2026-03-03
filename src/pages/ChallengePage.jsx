import { useState, useEffect, useRef, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { buildChallengePool, generateChallengeQuestion, generateTieredChallengeQuestion, CHALLENGE_TIERS, TOTAL_CHALLENGE_QUESTIONS, getTierForQuestion, getTierProgress } from '../data/challengeQuiz';
import { CATEGORY_CONFIG } from '../data/events';
import { Button } from '../components/shared';
import Mascot from '../components/Mascot';
import * as feedback from '../services/feedback';

// SVG tier icons — replace emoji to avoid rendering issues on Android
const TierIcon = ({ tierId, size = 24, color = '#666' }) => {
    const s = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth: '1.8', strokeLinecap: 'round', strokeLinejoin: 'round' };
    const icons = {
        beginner: <svg {...s}><path d="M12 22c-1-3-5-5-5-10a5 5 0 0 1 10 0c0 5-4 7-5 10z" fill={color} opacity="0.12" /><path d="M12 22c-1-3-5-5-5-10a5 5 0 0 1 10 0c0 5-4 7-5 10z" /><line x1="12" y1="8" x2="12" y2="14" /><path d="M10 11h4" /></svg>,
        amateur: <svg {...s}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" fill={color} opacity="0.08" /><line x1="9" y1="8" x2="16" y2="8" /><line x1="9" y1="12" x2="14" y2="12" /></svg>,
        advanced: <svg {...s}><path d="M12 3L2 9l10 6 10-6-10-6z" fill={color} opacity="0.1" /><path d="M2 9l10 6 10-6" /><path d="M6 11.5v5c0 2 3 3.5 6 3.5s6-1.5 6-3.5v-5" /><line x1="22" y1="9" x2="22" y2="15" /></svg>,
        historian: <svg {...s}><path d="M3 21h18M5 21V7l7-4 7 4v14" fill={color} opacity="0.1" /><line x1="9" y1="21" x2="9" y2="10" /><line x1="15" y1="21" x2="15" y2="10" /><path d="M5 7l7-4 7 4" /><line x1="3" y1="21" x2="21" y2="21" /></svg>,
        expert: <svg {...s}><circle cx="12" cy="12" r="9" fill={color} opacity="0.1" /><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" /></svg>,
        god: <svg {...s}><polygon points="13,2 3,14 12,14 11,22 21,10 12,10" fill={color} opacity="0.15" /><polygon points="13,2 3,14 12,14 11,22 21,10 12,10" /></svg>,
    };
    return icons[tierId] || null;
};

// ─── Views ───────────────────────────────────────────────────
const VIEW = { HUB: 'hub', SETUP_MULTI: 'setup_multi', GAME: 'game', PASS_PHONE: 'pass_phone', RESULTS: 'results' };
const MAX_HEARTS = 3;

// ─── Hearts Component ────────────────────────────────────────
function Hearts({ current, max = MAX_HEARTS, losingIndex = -1 }) {
    return (
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            {Array.from({ length: max }, (_, i) => {
                const isFilled = i < current;
                const isLosing = i === losingIndex;
                return (
                    <svg key={i} width="24" height="24" viewBox="0 0 24 24"
                        fill={isFilled ? '#E05555' : 'none'}
                        stroke={isFilled ? '#E05555' : 'var(--color-ink-faint)'}
                        strokeWidth="2"
                        className={isLosing ? 'challenge-heart--losing' : isFilled ? 'challenge-heart--alive' : ''}
                    >
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                );
            })}
        </div>
    );
}

// ─── Question Renderer ───────────────────────────────────────

function ChallengeQuestion({ question, onAnswer }) {
    const [selected, setSelected] = useState(null);
    const [answered, setAnswered] = useState(false);
    // No useEffect needed — parent uses `key` prop to remount on new question

    if (!question) return null;

    const handleSelect = (index, isCorrect) => {
        if (answered) return;
        setSelected(index);
        setAnswered(true);
        if (isCorrect) feedback.correct();
        else feedback.wrong();
        // Delay to let user see the result
        setTimeout(() => onAnswer(isCorrect), 1200);
    };

    switch (question.type) {
        case 'hardMCQ':
        case 'eraDetective':
        case 'categorySort':
            return (
                <MCQLayout
                    question={question}
                    selected={selected}
                    answered={answered}
                    onSelect={handleSelect}
                />
            );
        case 'whichCameFirst':
            return (
                <WhichCameFirstLayout
                    question={question}
                    selected={selected}
                    answered={answered}
                    onSelect={(id) => {
                        if (answered) return;
                        const isCorrect = id === question.correctId;
                        setSelected(id);
                        setAnswered(true);
                        if (isCorrect) feedback.correct();
                        else feedback.wrong();
                        setTimeout(() => onAnswer(isCorrect), 1200);
                    }}
                />
            );
        case 'oddOneOut':
            return (
                <OddOneOutLayout
                    question={question}
                    selected={selected}
                    answered={answered}
                    onSelect={(id) => {
                        if (answered) return;
                        const isCorrect = id === question.outlierEventId;
                        setSelected(id);
                        setAnswered(true);
                        if (isCorrect) feedback.correct();
                        else feedback.wrong();
                        setTimeout(() => onAnswer(isCorrect), 1200);
                    }}
                />
            );
        case 'trueOrFalse':
            return (
                <TrueOrFalseLayout
                    question={question}
                    selected={selected}
                    answered={answered}
                    onSelect={(val) => {
                        if (answered) return;
                        const isCorrect = val === question.isTrue;
                        setSelected(val);
                        setAnswered(true);
                        if (isCorrect) feedback.correct();
                        else feedback.wrong();
                        setTimeout(() => onAnswer(isCorrect), 1200);
                    }}
                />
            );
        case 'chronologicalOrder':
            return (
                <ChronologicalOrderLayout
                    question={question}
                    onAnswer={onAnswer}
                />
            );
        default:
            return <p>Unknown question type</p>;
    }
}

// ─── MCQ Layout (hardMCQ, eraDetective, categorySort) ────────

function MCQLayout({ question, selected, answered, onSelect }) {
    const isGrid = question.type === 'hardMCQ' && (question.subType === 'location' || question.subType === 'date');
    const isCategorySort = question.type === 'categorySort';

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-ink)', fontFamily: 'var(--font-serif)', textAlign: 'center' }}>
                {question.prompt}
            </p>
            {question.context && (
                <p style={{ fontSize: '0.85rem', color: 'var(--color-ink-secondary)', textAlign: 'center', fontStyle: 'italic', lineHeight: 1.5 }}>
                    {question.context}
                </p>
            )}
            {question.description && question.type === 'categorySort' && (
                <p style={{ fontSize: '0.8rem', color: 'var(--color-ink-muted)', textAlign: 'center', lineHeight: 1.4, maxHeight: 60, overflow: 'hidden' }}>
                    {question.description}
                </p>
            )}
            <div style={{
                display: 'grid',
                gridTemplateColumns: isGrid ? '1fr 1fr' : '1fr',
                gap: 8,
                marginTop: 4,
            }}>
                {question.options.map((opt, i) => {
                    const isSelected = selected === i;
                    const isCorrect = opt.isCorrect;
                    let bg = 'var(--color-card)';
                    let border = '1.5px solid var(--color-ink-faint, #E7E5E4)';
                    let color = 'var(--color-ink)';
                    if (answered) {
                        if (isCorrect) {
                            bg = 'rgba(5, 150, 105, 0.12)';
                            border = '1.5px solid var(--color-success)';
                            color = 'var(--color-success)';
                        } else if (isSelected) {
                            bg = 'rgba(166, 61, 61, 0.12)';
                            border = '1.5px solid var(--color-error)';
                            color = 'var(--color-error)';
                        } else {
                            bg = 'rgba(0,0,0,0.02)';
                            color = 'var(--color-ink-muted)';
                        }
                    }

                    return (
                        <button
                            key={i}
                            onClick={() => onSelect(i, isCorrect)}
                            disabled={answered}
                            style={{
                                background: isCategorySort && !answered ? opt.bg : bg,
                                border,
                                borderRadius: 10,
                                padding: isGrid ? '12px 10px' : '12px 16px',
                                cursor: answered ? 'default' : 'pointer',
                                textAlign: 'left',
                                fontSize: question.subType === 'description' ? '0.78rem' : '0.88rem',
                                fontFamily: 'var(--font-sans)',
                                color: isCategorySort && !answered ? opt.color : color,
                                fontWeight: (isSelected || (answered && isCorrect)) ? 600 : 400,
                                lineHeight: 1.4,
                                transition: 'all 0.15s ease',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                            }}
                        >
                            {answered && isCorrect && <span>&#10003;</span>}
                            {answered && isSelected && !isCorrect && <span>&#10007;</span>}
                            {opt.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

// ─── Which Came First Layout ─────────────────────────────────

function WhichCameFirstLayout({ question, selected, answered, onSelect }) {
    const { eventA, eventB } = question;

    const renderCard = (event) => {
        const isSelected = selected === event.id;
        const isCorrect = event.id === question.correctId;
        let bg = 'var(--color-card)';
        let border = '1.5px solid var(--color-ink-faint, #E7E5E4)';
        if (answered) {
            if (isCorrect) {
                bg = 'rgba(5, 150, 105, 0.12)';
                border = '1.5px solid var(--color-success)';
            } else if (isSelected) {
                bg = 'rgba(166, 61, 61, 0.12)';
                border = '1.5px solid var(--color-error)';
            }
        }

        return (
            <button
                key={event.id}
                onClick={() => onSelect(event.id)}
                disabled={answered}
                style={{
                    background: bg,
                    border,
                    borderRadius: 12,
                    padding: '16px',
                    cursor: answered ? 'default' : 'pointer',
                    textAlign: 'left',
                    width: '100%',
                    transition: 'all 0.15s ease',
                }}
            >
                <p style={{ fontSize: '0.95rem', fontWeight: 600, fontFamily: 'var(--font-serif)', color: 'var(--color-ink)', marginBottom: 4 }}>
                    {event.title}
                </p>
                <p style={{ fontSize: '0.78rem', color: 'var(--color-ink-muted)', lineHeight: 1.4 }}>
                    {event.quizDescription || event.description}
                </p>
                {answered && (
                    <p style={{ fontSize: '0.8rem', fontWeight: 600, marginTop: 8, color: isCorrect ? 'var(--color-success)' : 'var(--color-error)' }}>
                        {event.date}
                    </p>
                )}
            </button>
        );
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
            <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-ink)', fontFamily: 'var(--font-serif)', textAlign: 'center' }}>
                {question.prompt}
            </p>
            {renderCard(eventA)}
            <span style={{ fontSize: '0.75rem', color: 'var(--color-ink-muted)', fontWeight: 600, letterSpacing: 2 }}>OR</span>
            {renderCard(eventB)}
        </div>
    );
}

// ─── Odd One Out Layout ──────────────────────────────────────

function OddOneOutLayout({ question, selected, answered, onSelect }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-ink)', fontFamily: 'var(--font-serif)', textAlign: 'center' }}>
                {question.prompt}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {question.events.map(event => {
                    const isOutlier = event.id === question.outlierEventId;
                    const isSelected = selected === event.id;
                    let bg = 'var(--color-card)';
                    let border = '1.5px solid var(--color-ink-faint, #E7E5E4)';
                    let color = 'var(--color-ink)';

                    if (answered) {
                        if (isOutlier) {
                            bg = 'rgba(5, 150, 105, 0.12)';
                            border = '1.5px solid var(--color-success)';
                            color = 'var(--color-success)';
                        } else if (isSelected) {
                            bg = 'rgba(166, 61, 61, 0.12)';
                            border = '1.5px solid var(--color-error)';
                            color = 'var(--color-error)';
                        } else {
                            bg = 'rgba(139, 65, 87, 0.06)';
                            border = '1.5px solid rgba(139, 65, 87, 0.2)';
                        }
                    }

                    return (
                        <button
                            key={event.id}
                            onClick={() => onSelect(event.id)}
                            disabled={answered}
                            style={{
                                background: bg,
                                border,
                                borderRadius: 10,
                                padding: '12px 10px',
                                cursor: answered ? 'default' : 'pointer',
                                fontSize: '0.82rem',
                                fontFamily: 'var(--font-serif)',
                                color,
                                fontWeight: (isSelected || (answered && isOutlier)) ? 600 : 400,
                                lineHeight: 1.3,
                                textAlign: 'center',
                                transition: 'all 0.15s ease',
                            }}
                        >
                            {event.title}
                        </button>
                    );
                })}
            </div>
            {answered && (
                <p style={{ fontSize: '0.78rem', color: 'var(--color-ink-muted)', textAlign: 'center', fontStyle: 'italic' }}>
                    The other three: {question.sharedTrait}
                </p>
            )}
        </div>
    );
}

// ─── True or False Layout ────────────────────────────────────

function TrueOrFalseLayout({ question, selected, answered, onSelect }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
            <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-ink)', fontFamily: 'var(--font-serif)' }}>
                {question.prompt}
            </p>
            <div style={{
                background: 'var(--color-card)',
                border: '1.5px solid var(--color-ink-faint, #E7E5E4)',
                borderRadius: 12,
                padding: '20px 16px',
                width: '100%',
                textAlign: 'center',
            }}>
                <p style={{ fontSize: '0.9rem', fontFamily: 'var(--font-serif)', fontStyle: 'italic', color: 'var(--color-ink)', lineHeight: 1.6 }}>
                    &ldquo;{question.statement}&rdquo;
                </p>
            </div>
            <div style={{ display: 'flex', gap: 12, width: '100%' }}>
                {[true, false].map(val => {
                    const label = val ? 'True' : 'False';
                    const isSelected = selected === val;
                    const isCorrect = val === question.isTrue;
                    let bg = 'var(--color-card)';
                    let border = '1.5px solid var(--color-ink-faint, #E7E5E4)';
                    let color = 'var(--color-ink)';

                    if (answered) {
                        if (isCorrect) {
                            bg = 'rgba(5, 150, 105, 0.12)';
                            border = '1.5px solid var(--color-success)';
                            color = 'var(--color-success)';
                        } else if (isSelected) {
                            bg = 'rgba(166, 61, 61, 0.12)';
                            border = '1.5px solid var(--color-error)';
                            color = 'var(--color-error)';
                        }
                    }

                    return (
                        <button
                            key={label}
                            onClick={() => onSelect(val)}
                            disabled={answered}
                            style={{
                                flex: 1,
                                background: bg,
                                border,
                                borderRadius: 10,
                                padding: '14px',
                                cursor: answered ? 'default' : 'pointer',
                                fontSize: '1rem',
                                fontWeight: 600,
                                fontFamily: 'var(--font-serif)',
                                color,
                                transition: 'all 0.15s ease',
                            }}
                        >
                            {answered && isCorrect && <span>&#10003; </span>}
                            {answered && isSelected && !isCorrect && <span>&#10007; </span>}
                            {label}
                        </button>
                    );
                })}
            </div>
            {answered && !question.isTrue && question.correctDetail && (
                <p style={{ fontSize: '0.78rem', color: 'var(--color-ink-muted)', textAlign: 'center', fontStyle: 'italic' }}>
                    Correct {question.swappedDetail}: {question.correctDetail}
                </p>
            )}
        </div>
    );
}

// ─── Chronological Order Layout (God tier) ──────────────────

function ChronologicalOrderLayout({ question, onAnswer }) {
    const [order, setOrder] = useState([]);
    const [confirmed, setConfirmed] = useState(false);

    const handleTap = (eventId) => {
        if (confirmed) return;
        if (order.includes(eventId)) {
            setOrder(prev => prev.slice(0, prev.indexOf(eventId)));
        } else {
            setOrder(prev => [...prev, eventId]);
        }
    };

    const handleConfirm = () => {
        if (confirmed || order.length !== 5) return;
        const correct = order.every((id, i) => id === question.correctOrder[i]);
        setConfirmed(true);
        if (correct) feedback.correct();
        else feedback.wrong();
        setTimeout(() => onAnswer(correct), 2500);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-ink)', fontFamily: 'var(--font-serif)', textAlign: 'center' }}>
                {question.prompt}
            </p>
            <p style={{ fontSize: '0.72rem', color: 'var(--color-ink-muted)', textAlign: 'center', marginBottom: 4 }}>
                Tap events in order, earliest first
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {question.events.map(event => {
                    const orderIdx = order.indexOf(event.id);
                    const isSelected = orderIdx !== -1;
                    const correctPos = confirmed ? question.correctOrder.indexOf(event.id) : -1;
                    const isCorrectPos = confirmed && isSelected && order[orderIdx] === question.correctOrder[orderIdx];

                    let bg = 'var(--color-card)';
                    let border = '1.5px solid var(--color-ink-faint, #E7E5E4)';
                    if (confirmed) {
                        if (isCorrectPos) {
                            bg = 'rgba(5, 150, 105, 0.12)';
                            border = '1.5px solid var(--color-success)';
                        } else if (isSelected) {
                            bg = 'rgba(166, 61, 61, 0.12)';
                            border = '1.5px solid var(--color-error)';
                        }
                    } else if (isSelected) {
                        bg = 'rgba(139, 65, 87, 0.08)';
                        border = '1.5px solid var(--color-burgundy)';
                    }

                    return (
                        <button
                            key={event.id}
                            onClick={() => handleTap(event.id)}
                            disabled={confirmed}
                            style={{
                                background: bg, border, borderRadius: 10,
                                padding: '10px 12px', cursor: confirmed ? 'default' : 'pointer',
                                textAlign: 'left', display: 'flex', alignItems: 'center', gap: 10,
                                transition: 'all 0.15s ease',
                            }}
                        >
                            {isSelected ? (
                                <span style={{
                                    width: 24, height: 24, borderRadius: '50%',
                                    background: confirmed ? (isCorrectPos ? 'var(--color-success)' : 'var(--color-error)') : 'var(--color-burgundy)',
                                    color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '0.75rem', fontWeight: 700, flexShrink: 0,
                                }}>
                                    {orderIdx + 1}
                                </span>
                            ) : (
                                <span style={{
                                    width: 24, height: 24, borderRadius: '50%',
                                    border: '1.5px dashed var(--color-ink-faint)', flexShrink: 0,
                                }} />
                            )}
                            <div style={{ minWidth: 0 }}>
                                <p style={{ fontSize: '0.85rem', fontWeight: 600, fontFamily: 'var(--font-serif)', color: 'var(--color-ink)' }}>
                                    {event.title}
                                </p>
                                {confirmed && (
                                    <p style={{ fontSize: '0.72rem', color: isCorrectPos ? 'var(--color-success)' : 'var(--color-error)', marginTop: 2, fontWeight: 600 }}>
                                        {event.date} — correct position: #{correctPos + 1}
                                    </p>
                                )}
                            </div>
                        </button>
                    );
                })}
            </div>
            {!confirmed && order.length === 5 && (
                <Button onClick={handleConfirm} style={{ marginTop: 4 }}>
                    Lock In Answer
                </Button>
            )}
            {!confirmed && order.length > 0 && order.length < 5 && (
                <p style={{ fontSize: '0.72rem', color: 'var(--color-ink-muted)', textAlign: 'center' }}>
                    {5 - order.length} remaining
                </p>
            )}
        </div>
    );
}

// ─── Tier Transition Overlay ─────────────────────────────────

function TierTransition({ tier, onContinue }) {
    useEffect(() => {
        const timer = setTimeout(onContinue, 2500);
        return () => clearTimeout(timer);
    }, [onContinue]);

    return (
        <div
            onClick={onContinue}
            style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                padding: '40px 20px', textAlign: 'center', cursor: 'pointer', minHeight: 300,
            }}
            className="animate-fade-in"
        >
            <div style={{
                marginBottom: 16,
                filter: tier.id === 'god' ? 'drop-shadow(0 0 12px rgba(220, 38, 38, 0.5))' : 'none',
            }}>
                <TierIcon tierId={tier.id} size={48} color={tier.color} />
            </div>
            <p style={{
                fontSize: '0.7rem', fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase',
                color: 'var(--color-ink-muted)', marginBottom: 8,
            }}>
                Level Up
            </p>
            <h2 style={{
                fontFamily: 'var(--font-serif)', fontSize: '1.6rem', fontWeight: 700,
                color: tier.color, marginBottom: 8,
            }}>
                {tier.label}
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-ink-muted)', fontStyle: 'italic' }}>
                {tier.flavor}
            </p>
            <p style={{ fontSize: '0.7rem', color: 'var(--color-ink-faint)', marginTop: 20 }}>
                Tap to continue
            </p>
        </div>
    );
}

// ─── Main ChallengePage ──────────────────────────────────────

export default function ChallengePage({ onSessionChange, registerBackHandler }) {
    const { state, dispatch } = useApp();
    const [view, setView] = useState(VIEW.HUB);
    const [mode, setMode] = useState(null);         // 'solo' | 'multiplayer'
    const [players, setPlayers] = useState([]);
    const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
    const [questionPool, setQuestionPool] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [questionIndex, setQuestionIndex] = useState(0);
    const [usedEventIds, setUsedEventIds] = useState(new Set());
    const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);
    const [bestStreak, setBestStreak] = useState(0);
    const [quizmasterMood, setQuizmasterMood] = useState('thinking');
    const [reactorMood, setReactorMood] = useState('happy');

    const [tierTransition, setTierTransition] = useState(null); // tier object or null
    const [recentLevels, setRecentLevels] = useState([]); // tracks L1/L2 sequence for mixing

    // Multiplayer setup
    const [newPlayerName, setNewPlayerName] = useState('');

    // Timers
    const sessionStartTime = useRef(null);
    const sessionRecorded = useRef(false);

    // Session change notification
    useEffect(() => {
        if (onSessionChange) {
            onSessionChange(view === VIEW.GAME || view === VIEW.PASS_PHONE);
        }
    }, [view, onSessionChange]);

    // ─── Game Control (ordered by dependency chain) ──

    const startSoloGame = useCallback(() => {
        const pool = buildChallengePool(state.seenEvents);
        setQuestionPool(pool);
        setMode('solo');
        setPlayers([{ name: 'You', hearts: MAX_HEARTS, score: 0, eliminated: false }]);
        setCurrentPlayerIndex(0);
        setQuestionIndex(0);
        setUsedEventIds(new Set());
        setConsecutiveCorrect(0);
        setBestStreak(0);
        setQuizmasterMood('thinking');
        setReactorMood('happy');
        setTierTransition(null);
        setRecentLevels([]);
        sessionStartTime.current = Date.now();
        sessionRecorded.current = false;

        // Generate first question (tiered)
        const q = generateTieredChallengeQuestion(pool, 0, new Set(), []);
        setCurrentQuestion(q);
        const newUsed = new Set();
        if (q?.events) q.events.forEach(e => newUsed.add(e.id));
        else if (q?.event) newUsed.add(q.event.id);
        setUsedEventIds(newUsed);
        setRecentLevels(q?.level ? [q.level] : [1]);
        setView(VIEW.GAME);
    }, [state.seenEvents]);

    const startMultiplayerGame = useCallback(() => {
        if (players.length === 0) return;
        const pool = buildChallengePool(state.seenEvents);
        setQuestionPool(pool);
        setMode('multiplayer');
        setPlayers(prev => prev.map(p => ({ ...p, hearts: MAX_HEARTS, score: 0, eliminated: false })));
        setCurrentPlayerIndex(0);
        setQuestionIndex(0);
        setUsedEventIds(new Set());
        setConsecutiveCorrect(0);
        setBestStreak(0);
        setQuizmasterMood('thinking');
        setReactorMood('happy');
        setRecentLevels([]);
        sessionStartTime.current = Date.now();
        sessionRecorded.current = false;

        const q = generateChallengeQuestion(pool, 0, new Set());
        setCurrentQuestion(q);
        if (q?.event) setUsedEventIds(new Set([q.event.id]));
        setView(VIEW.PASS_PHONE);
    }, [state.seenEvents, players]);

    const endGame = useCallback(() => {
        // Record study session
        if (!sessionRecorded.current && sessionStartTime.current) {
            const duration = Math.round((Date.now() - sessionStartTime.current) / 1000);
            dispatch({
                type: 'RECORD_STUDY_SESSION',
                duration,
                sessionType: 'challenge',
                questionsAnswered: questionIndex,
            });
            sessionRecorded.current = true;
        }

        // Calculate total correct for the current/solo player
        const totalCorrect = mode === 'solo'
            ? players[0]?.score || 0
            : players.reduce((sum, p) => sum + p.score, 0);

        // Update challenge stats
        dispatch({
            type: 'UPDATE_CHALLENGE_STATS',
            mode: mode || 'solo',
            score: mode === 'solo' ? (players[0]?.score || 0) : 0,
            bestStreak,
            correctCount: totalCorrect,
        });

        // Award XP for the game
        if (totalCorrect > 0) {
            dispatch({ type: 'ADD_XP', amount: totalCorrect * 8 });
        }

        feedback.gameOver();
        setView(VIEW.RESULTS);
    }, [dispatch, mode, players, questionIndex, bestStreak]);

    const advanceQuestion = useCallback(() => {
        const nextIdx = questionIndex + 1;
        setQuestionIndex(nextIdx);
        setQuizmasterMood('thinking');
        setReactorMood('happy');
        const q = mode === 'solo'
            ? generateTieredChallengeQuestion(questionPool, nextIdx, usedEventIds, recentLevels)
            : generateChallengeQuestion(questionPool, nextIdx, usedEventIds);
        setCurrentQuestion(q);
        if (q?.events) {
            setUsedEventIds(prev => { const s = new Set(prev); q.events.forEach(e => s.add(e.id)); return s; });
        } else if (q?.event) {
            setUsedEventIds(prev => new Set([...prev, q.event.id]));
        }
        if (q?.level) {
            setRecentLevels(prev => [...prev.slice(-5), q.level]);
        }
    }, [questionIndex, questionPool, usedEventIds, mode, recentLevels]);

    const advanceToNextPlayer = useCallback((currentPlayers) => {
        let nextPI = (currentPlayerIndex + 1) % currentPlayers.length;
        let loops = 0;
        while (currentPlayers[nextPI].eliminated && loops < currentPlayers.length) {
            nextPI = (nextPI + 1) % currentPlayers.length;
            loops++;
        }
        setCurrentPlayerIndex(nextPI);
        advanceQuestion();
        setView(VIEW.PASS_PHONE);
    }, [currentPlayerIndex, advanceQuestion]);

    const checkGameState = useCallback(() => {
        // Read the latest players state
        setPlayers(prevPlayers => {
            const current = prevPlayers[currentPlayerIndex];

            if (mode === 'solo') {
                if (current.hearts <= 0) {
                    setTimeout(() => endGame(), 100);
                    return prevPlayers;
                }
                // Check if all 21 questions completed
                if (questionIndex >= TOTAL_CHALLENGE_QUESTIONS - 1) {
                    setTimeout(() => endGame(), 100);
                    return prevPlayers;
                }
                // Check for tier transition
                const currentTier = getTierForQuestion(questionIndex);
                const nextTier = getTierForQuestion(questionIndex + 1);
                if (nextTier.id !== currentTier.id) {
                    setTierTransition(nextTier);
                } else {
                    advanceQuestion();
                }
                return prevPlayers;
            }

            // Multiplayer
            const alive = prevPlayers.filter(p => p.hearts > 0);
            if (alive.length <= 1) {
                setTimeout(() => endGame(), 100);
                return prevPlayers;
            }

            // Next player
            advanceToNextPlayer(prevPlayers);
            return prevPlayers;
        });
    }, [mode, currentPlayerIndex, endGame, advanceQuestion, advanceToNextPlayer, questionIndex]);

    const handleAnswer = useCallback((isCorrect) => {
        setPlayers(prev => {
            const updated = [...prev];
            const pi = currentPlayerIndex;
            if (isCorrect) {
                updated[pi] = { ...updated[pi], score: updated[pi].score + 1 };
            } else {
                const newHearts = updated[pi].hearts - 1;
                updated[pi] = { ...updated[pi], hearts: newHearts, eliminated: newHearts <= 0 };
                feedback.heartLost();
            }
            return updated;
        });

        if (isCorrect) {
            setQuizmasterMood('celebrating');
            setReactorMood('celebrating');
            setConsecutiveCorrect(c => {
                const newC = c + 1;
                setBestStreak(bs => Math.max(bs, newC));
                return newC;
            });

            // Update mastery for all events (handles chronologicalOrder multi-event)
            const eventsToUpdate = currentQuestion?.events || (currentQuestion?.event ? [currentQuestion.event] : []);
            for (const evt of eventsToUpdate) {
                dispatch({
                    type: 'UPDATE_EVENT_MASTERY',
                    eventId: evt.id,
                    questionType: currentQuestion.masteryDimension || 'what',
                    score: 'green',
                });
            }
        } else {
            setQuizmasterMood('sad');
            setReactorMood('sad');
            setConsecutiveCorrect(0);

            const eventsToUpdate = currentQuestion?.events || (currentQuestion?.event ? [currentQuestion.event] : []);
            for (const evt of eventsToUpdate) {
                dispatch({
                    type: 'UPDATE_EVENT_MASTERY',
                    eventId: evt.id,
                    questionType: currentQuestion.masteryDimension || 'what',
                    score: 'red',
                });
            }
        }

        // Check game state after a delay (let animation play)
        setTimeout(() => {
            checkGameState();
        }, 300);
    }, [currentPlayerIndex, currentQuestion, dispatch, checkGameState]);

    // Register back handler (after endGame is declared)
    useEffect(() => {
        if (!registerBackHandler) return;
        if (view === VIEW.HUB) return;

        const unregister = registerBackHandler(() => {
            if (view === VIEW.GAME || view === VIEW.PASS_PHONE) {
                endGame();
            } else if (view === VIEW.SETUP_MULTI) {
                setView(VIEW.HUB);
            } else if (view === VIEW.RESULTS) {
                setView(VIEW.HUB);
            }
        });
        return unregister;
    }, [view, registerBackHandler, endGame]);

    // ─── Multiplayer Setup ───────────────────────────

    const addPlayer = () => {
        const name = newPlayerName.trim();
        if (!name || players.length >= 5) return;
        if (players.some(p => p.name.toLowerCase() === name.toLowerCase())) return;
        setPlayers(prev => [...prev, { name, hearts: MAX_HEARTS, score: 0, eliminated: false }]);
        setNewPlayerName('');
    };

    const removePlayer = (index) => {
        setPlayers(prev => prev.filter((_, i) => i !== index));
    };

    // ─── Derived data ────────────────────────────────

    const ch = state.challenge || {};
    const currentPlayer = players[currentPlayerIndex];
    const isNewHighScore = mode === 'solo' && (players[0]?.score || 0) > (ch.soloHighScore || 0);
    const tierInfo = mode === 'solo' ? getTierProgress(questionIndex) : null;

    const handleTierTransitionDone = useCallback(() => {
        setTierTransition(null);
        advanceQuestion();
    }, [advanceQuestion]);

    // Compute all-time accuracy from eventMastery
    const allTimeAccuracy = (() => {
        const mastery = state.eventMastery || {};
        let correct = 0, total = 0;
        for (const ev of Object.values(mastery)) {
            for (const dim of ['locationScore', 'dateScore', 'whatScore', 'descriptionScore']) {
                if (ev[dim]) { total++; if (ev[dim] === 'green') correct++; }
            }
        }
        return total > 0 ? Math.round((correct / total) * 100) : null;
    })();

    // ─── Render ──────────────────────────────────────

    if (view === VIEW.HUB) {
        return (
            <div style={{ padding: '16px 0' }} className="animate-fade-in">
                {/* Mascot duo header */}
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: 12, marginBottom: 20 }}>
                    <Mascot variant="quizmaster" mood="happy" size={56} />
                    <Mascot mood="happy" size={48} />
                </div>

                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', fontWeight: 700, textAlign: 'center', color: 'var(--color-ink)', marginBottom: 4 }}>
                    Challenge Mode
                </h2>
                <p style={{ textAlign: 'center', fontSize: '0.82rem', color: 'var(--color-ink-muted)', marginBottom: 20 }}>
                    Climb from Beginner to God — {TOTAL_CHALLENGE_QUESTIONS} questions, {CHALLENGE_TIERS.length} tiers!
                </p>

                {/* Mode cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
                    {/* Solo card */}
                    <button
                        onClick={startSoloGame}
                        style={{
                            background: 'var(--color-card)',
                            border: '1.5px solid var(--color-ink-faint, #E7E5E4)',
                            borderRadius: 14,
                            padding: '20px 16px',
                            cursor: 'pointer',
                            textAlign: 'left',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 14,
                            transition: 'all 0.15s ease',
                        }}
                    >
                        <div style={{ flexShrink: 0 }}>
                            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--color-burgundy)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                            </svg>
                        </div>
                        <div>
                            <p style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: '1rem', color: 'var(--color-ink)', marginBottom: 2 }}>
                                Solo Challenge
                            </p>
                            <p style={{ fontSize: '0.78rem', color: 'var(--color-ink-muted)' }}>
                                {CHALLENGE_TIERS.length} tiers, {TOTAL_CHALLENGE_QUESTIONS} questions. Best: <strong>{ch.soloHighScore || 0}/{TOTAL_CHALLENGE_QUESTIONS}</strong>
                            </p>
                        </div>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-ink-muted)" strokeWidth="2" style={{ marginLeft: 'auto' }}>
                            <polyline points="9 18 15 12 9 6" />
                        </svg>
                    </button>

                    {/* Multiplayer card */}
                    <button
                        onClick={() => {
                            setPlayers([]);
                            setNewPlayerName('');
                            setView(VIEW.SETUP_MULTI);
                        }}
                        style={{
                            background: 'var(--color-card)',
                            border: '1.5px solid var(--color-ink-faint, #E7E5E4)',
                            borderRadius: 14,
                            padding: '20px 16px',
                            cursor: 'pointer',
                            textAlign: 'left',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 14,
                            transition: 'all 0.15s ease',
                        }}
                    >
                        <div style={{ flexShrink: 0 }}>
                            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--color-burgundy)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                <circle cx="9" cy="7" r="4" />
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                            </svg>
                        </div>
                        <div>
                            <p style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: '1rem', color: 'var(--color-ink)', marginBottom: 2 }}>
                                Multiplayer
                            </p>
                            <p style={{ fontSize: '0.78rem', color: 'var(--color-ink-muted)' }}>
                                1-5 players, pass the phone
                            </p>
                        </div>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-ink-muted)" strokeWidth="2" style={{ marginLeft: 'auto' }}>
                            <polyline points="9 18 15 12 9 6" />
                        </svg>
                    </button>
                </div>

                {/* Stats */}
                {(ch.soloGamesPlayed > 0 || ch.multiplayerGamesPlayed > 0 || allTimeAccuracy !== null) && (
                    <div style={{
                        background: 'rgba(139, 65, 87, 0.04)',
                        borderRadius: 12,
                        padding: '14px 16px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 10,
                    }}>
                        {/* Top row: High Score + Accuracy */}
                        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                            <div style={{ textAlign: 'center' }}>
                                <p style={{ fontSize: '1.25rem', fontWeight: 700, fontFamily: 'var(--font-serif)', color: 'var(--color-burgundy)' }}>
                                    {ch.soloHighScore || 0}
                                </p>
                                <p style={{ fontSize: '0.7rem', color: 'var(--color-ink-muted)' }}>Solo Best</p>
                            </div>
                            {allTimeAccuracy !== null && (
                                <div style={{ textAlign: 'center' }}>
                                    <p style={{ fontSize: '1.25rem', fontWeight: 700, fontFamily: 'var(--font-serif)', color: 'var(--color-burgundy)' }}>
                                        {allTimeAccuracy}%
                                    </p>
                                    <p style={{ fontSize: '0.7rem', color: 'var(--color-ink-muted)' }}>Accuracy</p>
                                </div>
                            )}
                        </div>
                        {/* Bottom row: Games, Best Streak, Correct */}
                        {(ch.soloGamesPlayed > 0 || ch.multiplayerGamesPlayed > 0) && (
                            <div style={{ display: 'flex', justifyContent: 'space-around', borderTop: '1px solid rgba(139, 65, 87, 0.08)', paddingTop: 10 }}>
                                <div style={{ textAlign: 'center' }}>
                                    <p style={{ fontSize: '1rem', fontWeight: 700, fontFamily: 'var(--font-serif)', color: 'var(--color-burgundy)' }}>
                                        {(ch.soloGamesPlayed || 0) + (ch.multiplayerGamesPlayed || 0)}
                                    </p>
                                    <p style={{ fontSize: '0.7rem', color: 'var(--color-ink-muted)' }}>Games</p>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <p style={{ fontSize: '1rem', fontWeight: 700, fontFamily: 'var(--font-serif)', color: 'var(--color-burgundy)' }}>
                                        {ch.soloBestStreak || 0}
                                    </p>
                                    <p style={{ fontSize: '0.7rem', color: 'var(--color-ink-muted)' }}>Best Streak</p>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <p style={{ fontSize: '1rem', fontWeight: 700, fontFamily: 'var(--font-serif)', color: 'var(--color-burgundy)' }}>
                                        {ch.totalChallengeCorrect || 0}
                                    </p>
                                    <p style={{ fontSize: '0.7rem', color: 'var(--color-ink-muted)' }}>Correct</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }

    // ─── Multiplayer Setup ───────────────────────────

    if (view === VIEW.SETUP_MULTI) {
        return (
            <div style={{ padding: '16px 0' }} className="animate-fade-in">
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', fontWeight: 700, textAlign: 'center', color: 'var(--color-ink)', marginBottom: 16 }}>
                    Who's playing?
                </h2>

                {/* Player input */}
                <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                    <input
                        type="text"
                        value={newPlayerName}
                        onChange={e => setNewPlayerName(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && addPlayer()}
                        placeholder="Player name"
                        maxLength={20}
                        style={{
                            flex: 1,
                            padding: '10px 14px',
                            border: '1.5px solid var(--color-ink-faint, #E7E5E4)',
                            borderRadius: 10,
                            fontSize: '0.9rem',
                            fontFamily: 'var(--font-sans)',
                            background: 'var(--color-card)',
                            outline: 'none',
                        }}
                    />
                    <Button
                        onClick={addPlayer}
                        disabled={!newPlayerName.trim() || players.length >= 5}
                    >
                        Add
                    </Button>
                </div>

                {/* Player list */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
                    {players.length === 0 && (
                        <p style={{ textAlign: 'center', color: 'var(--color-ink-muted)', fontSize: '0.82rem', padding: 16 }}>
                            Add 1-5 players to get started
                        </p>
                    )}
                    {players.map((p, i) => (
                        <div key={i} style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            background: 'var(--color-card)',
                            border: '1.5px solid var(--color-ink-faint, #E7E5E4)',
                            borderRadius: 10,
                            padding: '10px 14px',
                        }}>
                            <span style={{ fontWeight: 600, color: 'var(--color-ink)' }}>{p.name}</span>
                            <button
                                onClick={() => removePlayer(i)}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-error)', fontSize: '1.2rem', padding: 4 }}
                            >
                                &times;
                            </button>
                        </div>
                    ))}
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                    <Button variant="ghost" onClick={() => setView(VIEW.HUB)}>
                        Back
                    </Button>
                    <Button
                        onClick={startMultiplayerGame}
                        disabled={players.length === 0}
                        style={{ flex: 1 }}
                    >
                        Start Game
                    </Button>
                </div>
            </div>
        );
    }

    // ─── Pass Phone Screen (Multiplayer) ─────────────

    if (view === VIEW.PASS_PHONE) {
        return (
            <div className="pass-phone-overlay animate-fade-in">
                <Mascot variant="quizmaster" mood="happy" size={70} />
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-ink)' }}>
                    Pass to {currentPlayer?.name}!
                </h2>
                <Hearts current={currentPlayer?.hearts || 0} />
                <p style={{ fontSize: '0.82rem', color: 'var(--color-ink-muted)' }}>
                    Score: {currentPlayer?.score || 0}
                </p>
                <Button onClick={() => setView(VIEW.GAME)} style={{ marginTop: 8, minWidth: 140 }}>
                    Ready!
                </Button>
            </div>
        );
    }

    // ─── Game View ───────────────────────────────────

    if (view === VIEW.GAME) {
        // Show tier transition overlay
        if (tierTransition) {
            return (
                <div style={{ padding: '12px 0', display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
                    <TierTransition tier={tierTransition} onContinue={handleTierTransitionDone} />
                </div>
            );
        }

        return (
            <div style={{ padding: '12px 0', display: 'flex', flexDirection: 'column', minHeight: '100%' }} className="animate-fade-in">
                {/* Tier badge + progress (solo) */}
                {mode === 'solo' && tierInfo && (
                    <div style={{ marginBottom: 8 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                            <span style={{
                                fontSize: '0.7rem', fontWeight: 700, color: tierInfo.tier.color,
                                background: `${tierInfo.tier.color}15`, padding: '2px 8px', borderRadius: 6,
                            }}>
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><TierIcon tierId={tierInfo.tier.id} size={14} color={tierInfo.tier.color} /> {tierInfo.tier.label}</span>
                            </span>
                            <span style={{ fontSize: '0.68rem', color: 'var(--color-ink-muted)' }}>
                                {questionIndex + 1} / {TOTAL_CHALLENGE_QUESTIONS}
                            </span>
                        </div>
                        {/* Progress bar */}
                        <div style={{ height: 3, borderRadius: 2, background: 'rgba(var(--color-ink-rgb), 0.06)', overflow: 'hidden' }}>
                            <div style={{
                                height: '100%', borderRadius: 2,
                                background: tierInfo.tier.color,
                                width: `${((questionIndex + 1) / TOTAL_CHALLENGE_QUESTIONS) * 100}%`,
                                transition: 'width 0.3s ease',
                            }} />
                        </div>
                    </div>
                )}

                {/* Top bar: hearts + score + streak */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <Hearts current={currentPlayer?.hearts || 0} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        {mode === 'multiplayer' && (
                            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-burgundy)' }}>
                                {currentPlayer?.name}
                            </span>
                        )}
                        <div style={{ textAlign: 'center' }}>
                            <span style={{ fontSize: '1.1rem', fontWeight: 700, fontFamily: 'var(--font-serif)', color: 'var(--color-ink)' }}>
                                {currentPlayer?.score || 0}
                            </span>
                            <span style={{ fontSize: '0.7rem', color: 'var(--color-ink-muted)', marginLeft: 2 }}>pts</span>
                        </div>
                        {consecutiveCorrect >= 2 && (
                            <span style={{
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                color: '#E05500',
                                background: 'rgba(224, 85, 0, 0.1)',
                                padding: '2px 8px',
                                borderRadius: 8,
                            }}>
                                {consecutiveCorrect}x
                            </span>
                        )}
                    </div>
                </div>

                {/* Quizmaster mascot */}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
                    <Mascot variant="quizmaster" mood={quizmasterMood} size={52} />
                </div>

                {/* Question card */}
                <div style={{
                    background: tierInfo?.tier.id === 'god' ? 'rgba(220, 38, 38, 0.06)' : 'var(--color-parchment-dark, #F3ECE2)',
                    borderRadius: 14,
                    padding: '20px 16px',
                    flex: 1,
                    border: tierInfo?.tier.id === 'god' ? '1.5px solid rgba(220, 38, 38, 0.2)' : 'none',
                }}>
                    <ChallengeQuestion
                        key={`q-${questionIndex}-${currentPlayerIndex}`}
                        question={currentQuestion}
                        onAnswer={handleAnswer}
                    />
                </div>

                {/* Reactor mascot */}
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: 12 }}>
                    <Mascot mood={reactorMood} size={44} />
                </div>
            </div>
        );
    }

    // ─── Results View ────────────────────────────────

    if (view === VIEW.RESULTS) {
        const soloScore = players[0]?.score || 0;
        const reachedTier = getTierForQuestion(Math.min(questionIndex, TOTAL_CHALLENGE_QUESTIONS - 1));
        const isPerfect = mode === 'solo' && soloScore === TOTAL_CHALLENGE_QUESTIONS;

        if (mode === 'solo') {
            return (
                <div style={{ padding: '20px 0', textAlign: 'center' }} className="animate-fade-in">
                    {/* Mascots */}
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 16 }}>
                        <Mascot variant="quizmaster" mood={soloScore >= 10 ? 'celebrating' : soloScore >= 5 ? 'happy' : 'thinking'} size={60} />
                        <Mascot mood={soloScore >= 10 ? 'celebrating' : soloScore >= 5 ? 'happy' : 'sad'} size={52} />
                    </div>

                    <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', fontWeight: 700, color: 'var(--color-ink)', marginBottom: 8 }}>
                        {isPerfect ? 'Perfect Run!' : 'Game Over!'}
                    </h2>

                    {/* Tier reached badge */}
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        background: `${reachedTier.color}12`, border: `1.5px solid ${reachedTier.color}30`,
                        borderRadius: 10, padding: '6px 14px', marginBottom: 16,
                    }}>
                        <TierIcon tierId={reachedTier.id} size={20} color={reachedTier.color} />
                        <span style={{ fontSize: '0.82rem', fontWeight: 700, color: reachedTier.color }}>
                            {reachedTier.label}
                        </span>
                    </div>

                    {/* Score */}
                    <div style={{ marginBottom: 16 }}>
                        <p style={{ fontSize: '2.5rem', fontWeight: 700, fontFamily: 'var(--font-serif)', color: 'var(--color-burgundy)' }}>
                            {soloScore}/{TOTAL_CHALLENGE_QUESTIONS}
                        </p>
                        <p style={{ fontSize: '0.82rem', color: 'var(--color-ink-muted)' }}>
                            questions answered correctly
                        </p>
                    </div>

                    {/* New high score banner */}
                    {isNewHighScore && (
                        <div style={{
                            background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                            borderRadius: 10,
                            padding: '10px 16px',
                            marginBottom: 16,
                            color: 'white',
                            fontWeight: 700,
                            fontFamily: 'var(--font-serif)',
                            fontSize: '0.95rem',
                        }}>
                            New High Score!
                        </div>
                    )}

                    {/* Tier progress visualization */}
                    <div style={{
                        display: 'flex', gap: 3, marginBottom: 16, padding: '0 4px',
                    }}>
                        {CHALLENGE_TIERS.map(tier => {
                            const tierIdx = CHALLENGE_TIERS.indexOf(tier);
                            const reachedIdx = CHALLENGE_TIERS.indexOf(reachedTier);
                            const isReached = tierIdx <= reachedIdx;
                            return (
                                <div key={tier.id} style={{
                                    flex: tier.questions, height: 6, borderRadius: 3,
                                    background: isReached ? tier.color : 'rgba(var(--color-ink-rgb), 0.06)',
                                    transition: 'background 0.3s',
                                }} title={tier.label} />
                            );
                        })}
                    </div>

                    {/* Stats row */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-around',
                        background: 'rgba(139, 65, 87, 0.04)',
                        borderRadius: 12,
                        padding: '14px 12px',
                        marginBottom: 20,
                    }}>
                        <div>
                            <p style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-burgundy)', fontFamily: 'var(--font-serif)' }}>
                                {bestStreak}
                            </p>
                            <p style={{ fontSize: '0.68rem', color: 'var(--color-ink-muted)' }}>Best Streak</p>
                        </div>
                        <div>
                            <p style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-burgundy)', fontFamily: 'var(--font-serif)' }}>
                                +{soloScore * 8}
                            </p>
                            <p style={{ fontSize: '0.68rem', color: 'var(--color-ink-muted)' }}>XP Earned</p>
                        </div>
                        <div>
                            <p style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-burgundy)', fontFamily: 'var(--font-serif)' }}>
                                {questionIndex + 1}
                            </p>
                            <p style={{ fontSize: '0.68rem', color: 'var(--color-ink-muted)' }}>Questions</p>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div style={{ display: 'flex', gap: 8 }}>
                        <Button variant="ghost" onClick={() => setView(VIEW.HUB)}>
                            Back
                        </Button>
                        <Button onClick={startSoloGame} style={{ flex: 1 }}>
                            Play Again
                        </Button>
                    </div>
                </div>
            );
        }

        // ─── Multiplayer Results ─────────────────────

        const sorted = [...players].sort((a, b) => {
            if (b.score !== a.score) return b.score - a.score;
            return b.hearts - a.hearts; // tiebreak: more hearts = higher
        });
        const podiumColors = ['podium-bar--gold', 'podium-bar--silver', 'podium-bar--bronze'];
        const podiumHeights = [120, 90, 70];

        return (
            <div style={{ padding: '20px 0', textAlign: 'center' }} className="animate-fade-in">
                {/* Mascots */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 16 }}>
                    <Mascot variant="quizmaster" mood="celebrating" size={56} />
                    <Mascot mood="celebrating" size={48} />
                </div>

                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', fontWeight: 700, color: 'var(--color-ink)', marginBottom: 16 }}>
                    {sorted[0]?.name} wins!
                </h2>

                {/* Podium */}
                <div className="podium-bars" style={{ marginBottom: 24 }}>
                    {sorted.slice(0, 3).map((player, i) => {
                        // Show 2nd, 1st, 3rd order for visual podium
                        const displayOrder = [1, 0, 2];
                        const displayIdx = displayOrder[i] !== undefined ? displayOrder[i] : i;
                        const p = sorted[displayIdx];
                        if (!p) return null;

                        return (
                            <div
                                key={displayIdx}
                                className={`podium-bar ${podiumColors[displayIdx] || ''}`}
                                style={{ height: podiumHeights[displayIdx] || 60, order: i }}
                            >
                                <span style={{ fontSize: '1.4rem' }}>
                                    {displayIdx === 0 ? '\uD83E\uDD47' : displayIdx === 1 ? '\uD83E\uDD48' : '\uD83E\uDD49'}
                                </span>
                                <span style={{ fontSize: '0.82rem', fontWeight: 700 }}>{p.name}</span>
                                <span style={{ fontSize: '0.75rem' }}>{p.score} pts</span>
                            </div>
                        );
                    })}
                </div>

                {/* Full leaderboard */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 20 }}>
                    {sorted.map((p, i) => (
                        <div key={i} style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            background: i === 0 ? 'rgba(255, 215, 0, 0.08)' : 'var(--color-card)',
                            border: '1px solid var(--color-ink-faint, #E7E5E4)',
                            borderRadius: 8,
                            padding: '8px 14px',
                        }}>
                            <span style={{ fontWeight: 600, color: 'var(--color-ink)' }}>
                                {i + 1}. {p.name}
                            </span>
                            <span style={{ fontWeight: 700, color: 'var(--color-burgundy)', fontFamily: 'var(--font-serif)' }}>
                                {p.score} pts
                            </span>
                        </div>
                    ))}
                </div>

                {/* Buttons */}
                <div style={{ display: 'flex', gap: 8 }}>
                    <Button variant="ghost" onClick={() => setView(VIEW.HUB)}>
                        Back
                    </Button>
                    <Button onClick={() => {
                        setPlayers(prev => prev.map(p => ({ ...p, hearts: MAX_HEARTS, score: 0, eliminated: false })));
                        startMultiplayerGame();
                    }} style={{ flex: 1 }}>
                        Play Again
                    </Button>
                </div>
            </div>
        );
    }

    return null;
}
