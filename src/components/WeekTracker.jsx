import { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { getEventById, getEraForYear, ERA_RANGES } from '../data/events';
import { shareText } from '../services/share';

const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

function getStreakStatus(lastActiveDate, currentStreak) {
    if (!lastActiveDate || currentStreak === 0) return 'inactive';
    const today = new Date().toISOString().split('T')[0];
    if (lastActiveDate === today) return 'active';
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (lastActiveDate === yesterday.toISOString().split('T')[0]) return 'at-risk';
    return 'inactive';
}

const FLAME_COLORS = {
    active:    { stroke: '#E05500', fill: '#FF8C00', innerFill: '#FFB833', fillOpacity: 0.85, countColor: '#E05500' },
    'at-risk': { stroke: '#C8A000', fill: '#E8D44C', fillOpacity: 0.5, countColor: '#C8A000' },
    inactive:  { stroke: 'var(--color-ink-faint)', fill: 'var(--color-ink-faint)', fillOpacity: 0.3, countColor: 'var(--color-ink-faint)' },
};

export default function WeekTracker({ onClose }) {
    const { state } = useApp();

    const streakStatus = getStreakStatus(state.lastActiveDate, state.currentStreak);
    const flameColors = FLAME_COLORS[streakStatus];

    // Compute week start (Monday)
    const weekStart = useMemo(() => {
        const d = new Date();
        const day = d.getDay();
        const diff = day === 0 ? 6 : day - 1;
        d.setDate(d.getDate() - diff);
        return d.toISOString().split('T')[0];
    }, []);

    // Build per-day activity map for the week
    const { dayActivity, stats, strongest, weakest } = useMemo(() => {
        const sessions = (state.studySessions || []).filter(s => s.date >= weekStart);

        // Per-day map: { 'YYYY-MM-DD': { sessions, questions, seconds } }
        const dayMap = {};
        for (const s of sessions) {
            const d = s.date?.split('T')[0] || s.date;
            if (!dayMap[d]) dayMap[d] = { sessions: 0, questions: 0, seconds: 0 };
            dayMap[d].sessions++;
            dayMap[d].questions += s.questionsAnswered || 0;
            dayMap[d].seconds += s.duration || 0;
        }

        // Build 7-day array (Mon=0 ... Sun=6)
        const activity = [];
        for (let i = 0; i < 7; i++) {
            const d = new Date(weekStart);
            d.setDate(d.getDate() + i);
            const dateStr = d.toISOString().split('T')[0];
            const today = new Date().toISOString().split('T')[0];
            const isFuture = dateStr > today;
            const data = dayMap[dateStr];
            activity.push({
                label: DAY_LABELS[i],
                date: dateStr,
                isToday: dateStr === today,
                isFuture,
                sessions: data?.sessions || 0,
                questions: data?.questions || 0,
                seconds: data?.seconds || 0,
            });
        }

        const totalSessions = sessions.length;
        const totalQuestions = sessions.reduce((s, sess) => s + (sess.questionsAnswered || 0), 0);
        const totalSeconds = sessions.reduce((s, sess) => s + (sess.duration || 0), 0);
        const lessonSessions = sessions.filter(s => s.type === 'lesson').length;
        const practiceSessions = sessions.filter(s => s.type === 'practice').length;

        // Era mastery
        const eraScores = {};
        const eraCounts = {};
        for (const id of (state.seenEvents || [])) {
            const ev = getEventById(id);
            if (!ev) continue;
            const era = getEraForYear(ev.year);
            const mastery = state.eventMastery[id]?.overallMastery ?? 0;
            eraScores[era.id] = (eraScores[era.id] || 0) + mastery;
            eraCounts[era.id] = (eraCounts[era.id] || 0) + 1;
        }
        const eraAvgs = Object.entries(eraScores)
            .filter(([id]) => eraCounts[id] >= 2)
            .map(([id, total]) => ({
                id,
                label: ERA_RANGES.find(e => e.id === id)?.label || id,
                avg: total / eraCounts[id],
                count: eraCounts[id],
            }))
            .sort((a, b) => b.avg - a.avg);

        return {
            dayActivity: activity,
            stats: { totalSessions, totalQuestions, totalSeconds, lessonSessions, practiceSessions },
            strongest: eraAvgs[0] || null,
            weakest: eraAvgs.length > 1 ? eraAvgs[eraAvgs.length - 1] : null,
        };
    }, [state.studySessions, state.seenEvents, state.eventMastery, weekStart]);

    const activeDays = dayActivity.filter(d => d.sessions > 0).length;
    const eventsLearned = (state.seenEvents || []).length;

    function formatTime(secs) {
        if (secs >= 3600) return `${Math.floor(secs / 3600)}h ${Math.floor((secs % 3600) / 60)}m`;
        if (secs >= 60) return `${Math.floor(secs / 60)}m`;
        return `${secs}s`;
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-5"
            style={{ backgroundColor: 'rgba(var(--color-ink-rgb), 0.5)', backdropFilter: 'blur(4px)' }}
            onClick={onClose}>
            <div className="w-full max-w-sm rounded-2xl overflow-hidden animate-fade-in"
                style={{ backgroundColor: 'var(--color-card)', boxShadow: 'var(--shadow-elevated)' }}
                onClick={e => e.stopPropagation()}>

                {/* Header with streak */}
                <div className="px-5 pt-5 pb-3 text-center"
                    style={{ background: 'linear-gradient(to bottom, rgba(139, 65, 87, 0.06), transparent)' }}>
                    <div className="flex items-center justify-center gap-3 mb-2">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round"
                            className={streakStatus !== 'inactive' ? `streak-flame--${streakStatus}` : undefined}>
                            <path d="M12 2c0 4-4 6-4 10a4 4 0 0 0 8 0c0-4-4-6-4-10z"
                                stroke={flameColors.stroke} strokeWidth="1.5" fill={flameColors.fill} fillOpacity={flameColors.fillOpacity} />
                            <path d="M12 22c-1.5 0-3-1-3-3 0-2 3-3 3-5 0 2 3 3 3 5 0 2-1.5 3-3 3z"
                                fill={flameColors.innerFill || flameColors.fill} stroke="none" opacity="0.6" />
                        </svg>
                        <span className="text-3xl font-bold" style={{ color: flameColors.countColor }}>
                            {state.currentStreak}
                        </span>
                    </div>
                    <p className="text-sm font-semibold" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ink)' }}>
                        {state.currentStreak === 0 ? 'Start a streak!' :
                            `${state.currentStreak} day${state.currentStreak === 1 ? '' : 's'} in a row`}
                    </p>
                </div>

                {/* Day-by-day row */}
                <div className="px-5 pb-3">
                    <div className="flex justify-between items-center">
                        {dayActivity.map((day, i) => {
                            const hasActivity = day.sessions > 0;
                            const intensity = day.questions >= 10 ? 'high' : day.questions >= 3 ? 'med' : 'low';
                            return (
                                <div key={i} className="flex flex-col items-center gap-1">
                                    <span className="text-[10px] font-medium" style={{
                                        color: day.isToday ? 'var(--color-burgundy)' : 'var(--color-ink-faint)'
                                    }}>
                                        {day.label}
                                    </span>
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{
                                        backgroundColor: day.isFuture ? 'rgba(var(--color-ink-rgb), 0.03)' :
                                            hasActivity ? (
                                                intensity === 'high' ? 'rgba(5, 150, 105, 0.2)' :
                                                intensity === 'med' ? 'rgba(5, 150, 105, 0.12)' :
                                                'rgba(5, 150, 105, 0.07)'
                                            ) : 'rgba(var(--color-ink-rgb), 0.04)',
                                        border: day.isToday ? '2px solid var(--color-burgundy)' :
                                            hasActivity ? '2px solid rgba(5, 150, 105, 0.3)' : '2px solid transparent',
                                    }}>
                                        {hasActivity ? (
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="3">
                                                <polyline points="20 6 9 17 4 12" />
                                            </svg>
                                        ) : day.isFuture ? null : (
                                            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--color-ink-faint)', opacity: 0.3 }} />
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <p className="text-[11px] text-center mt-2" style={{ color: 'var(--color-ink-faint)' }}>
                        {activeDays === 0 ? 'No activity this week yet' :
                            `${activeDays}/7 days active this week`}
                    </p>
                </div>

                {/* Stats grid */}
                <div className="px-5 pb-3">
                    <div className="grid grid-cols-3 gap-2">
                        <div className="text-center p-2.5 rounded-xl" style={{ backgroundColor: 'rgba(139, 65, 87, 0.05)' }}>
                            <div className="text-lg font-bold" style={{ color: 'var(--color-burgundy)' }}>
                                {stats.totalSessions}
                            </div>
                            <div className="text-[10px]" style={{ color: 'var(--color-ink-muted)' }}>
                                {stats.totalSessions === 1 ? 'session' : 'sessions'}
                            </div>
                        </div>
                        <div className="text-center p-2.5 rounded-xl" style={{ backgroundColor: 'rgba(139, 65, 87, 0.05)' }}>
                            <div className="text-lg font-bold" style={{ color: 'var(--color-burgundy)' }}>
                                {stats.totalQuestions}
                            </div>
                            <div className="text-[10px]" style={{ color: 'var(--color-ink-muted)' }}>questions</div>
                        </div>
                        <div className="text-center p-2.5 rounded-xl" style={{ backgroundColor: 'rgba(139, 65, 87, 0.05)' }}>
                            <div className="text-lg font-bold" style={{ color: 'var(--color-burgundy)' }}>
                                {formatTime(stats.totalSeconds)}
                            </div>
                            <div className="text-[10px]" style={{ color: 'var(--color-ink-muted)' }}>study time</div>
                        </div>
                    </div>
                </div>

                {/* Overall progress row */}
                <div className="px-5 pb-3">
                    <div className="flex gap-2">
                        <div className="flex-1 flex items-center gap-2 p-2.5 rounded-xl" style={{ backgroundColor: 'rgba(184, 134, 11, 0.06)' }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-bronze)" strokeWidth="2" strokeLinecap="round">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="var(--color-bronze-light)" stroke="var(--color-bronze)" opacity="0.8" />
                            </svg>
                            <div>
                                <div className="text-sm font-bold" style={{ color: 'var(--color-bronze)' }}>{state.totalXP} XP</div>
                                <div className="text-[10px]" style={{ color: 'var(--color-ink-faint)' }}>total earned</div>
                            </div>
                        </div>
                        <div className="flex-1 flex items-center gap-2 p-2.5 rounded-xl" style={{ backgroundColor: 'rgba(139, 65, 87, 0.05)' }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-burgundy)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                            </svg>
                            <div>
                                <div className="text-sm font-bold" style={{ color: 'var(--color-burgundy)' }}>{eventsLearned}</div>
                                <div className="text-[10px]" style={{ color: 'var(--color-ink-faint)' }}>events learned</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Era insights */}
                {(strongest || weakest) && (
                    <div className="px-5 pb-3">
                        <div className="flex gap-2">
                            {strongest && (
                                <div className="flex-1 flex items-center gap-1.5 p-2.5 rounded-xl" style={{ backgroundColor: 'rgba(5, 150, 105, 0.06)' }}>
                                    <span className="text-sm">💪</span>
                                    <div>
                                        <div className="text-[10px] font-semibold" style={{ color: 'var(--color-success)' }}>Strongest</div>
                                        <div className="text-xs font-medium" style={{ color: 'var(--color-ink-secondary)' }}>{strongest.label}</div>
                                    </div>
                                </div>
                            )}
                            {weakest && (
                                <div className="flex-1 flex items-center gap-1.5 p-2.5 rounded-xl" style={{ backgroundColor: 'rgba(198, 134, 42, 0.06)' }}>
                                    <span className="text-sm">📖</span>
                                    <div>
                                        <div className="text-[10px] font-semibold" style={{ color: 'var(--color-warning)' }}>Focus on</div>
                                        <div className="text-xs font-medium" style={{ color: 'var(--color-ink-secondary)' }}>{weakest.label}</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="px-5 pb-5">
                    {state.currentStreak >= 1 && (
                        <button
                            onClick={async () => {
                                const lines = [
                                    `🔥 ${state.currentStreak}-day streak on Chronos!`,
                                    `📊 This week: ${stats.totalSessions} sessions, ${stats.totalQuestions} questions`,
                                    `📚 ${eventsLearned} historical events learned`,
                                ];
                                await shareText({ title: 'Chronos', text: lines.join('\n') });
                            }}
                            className="w-full flex items-center justify-center gap-2 mb-2 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer"
                            style={{ color: 'var(--color-burgundy)', backgroundColor: 'rgba(139, 65, 87, 0.08)' }}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                                <polyline points="16 6 12 2 8 6" />
                                <line x1="12" y1="2" x2="12" y2="15" />
                            </svg>
                            Share Progress
                        </button>
                    )}
                    <button
                        className="w-full py-2.5 rounded-xl text-sm font-semibold cursor-pointer"
                        style={{ color: 'var(--color-ink-muted)', backgroundColor: 'rgba(var(--color-ink-rgb), 0.04)' }}
                        onClick={onClose}
                    >
                        Got it
                    </button>
                </div>
            </div>
        </div>
    );
}
