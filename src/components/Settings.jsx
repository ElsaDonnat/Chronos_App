import { useApp } from '../context/AppContext';
import { ALL_EVENTS } from '../data/events';
import { LESSONS } from '../data/lessons';
import { Card, Button, Divider } from './shared';
import Mascot from './Mascot';

export default function Settings() {
    const { state, dispatch } = useApp();

    const learnedCount = state.seenEvents.length;
    const totalEvents = ALL_EVENTS.length;
    const completedLessons = Object.keys(state.completedLessons).length;

    const masteryEntries = Object.values(state.eventMastery);
    const greenCount = masteryEntries.filter(m => m.overallMastery >= 7).length;
    const yellowCount = masteryEntries.filter(m => m.overallMastery >= 3 && m.overallMastery < 7).length;
    const redCount = masteryEntries.filter(m => m.overallMastery < 3 && m.overallMastery > 0).length;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center" onClick={() => dispatch({ type: 'TOGGLE_SETTINGS' })}>
            <div className="absolute inset-0" style={{ backgroundColor: 'rgba(28, 25, 23, 0.3)', backdropFilter: 'blur(4px)' }} />
            <div
                className="relative w-full max-w-lg rounded-2xl p-6 mx-4 animate-fade-in-up"
                style={{ backgroundColor: 'var(--color-parchment)', maxHeight: '80vh', overflowY: 'auto', boxShadow: 'var(--shadow-elevated)' }}
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ink)' }}>
                        Your Journey
                    </h2>
                    <button
                        onClick={() => dispatch({ type: 'TOGGLE_SETTINGS' })}
                        className="p-1 rounded-lg"
                        style={{ color: 'var(--color-ink-muted)' }}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                <div className="flex justify-center mb-4">
                    <Mascot mood="happy" size={64} />
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                    <Card className="text-center p-4">
                        <div className="text-2xl font-bold" style={{ color: 'var(--color-burgundy)' }}>{state.totalXP}</div>
                        <div className="text-xs mt-1" style={{ color: 'var(--color-ink-muted)' }}>Total XP</div>
                    </Card>
                    <Card className="text-center p-4">
                        <div className="text-2xl font-bold" style={{ color: 'var(--color-burgundy)' }}>{state.currentStreak}</div>
                        <div className="text-xs mt-1" style={{ color: 'var(--color-ink-muted)' }}>Day Streak</div>
                    </Card>
                    <Card className="text-center p-4">
                        <div className="text-2xl font-bold" style={{ color: 'var(--color-burgundy)' }}>{learnedCount}/{totalEvents}</div>
                        <div className="text-xs mt-1" style={{ color: 'var(--color-ink-muted)' }}>Events Learned</div>
                    </Card>
                    <Card className="text-center p-4">
                        <div className="text-2xl font-bold" style={{ color: 'var(--color-burgundy)' }}>{completedLessons}/{LESSONS.length}</div>
                        <div className="text-xs mt-1" style={{ color: 'var(--color-ink-muted)' }}>Lessons Complete</div>
                    </Card>
                </div>

                {masteryEntries.length > 0 && (
                    <Card className="mb-4 p-4">
                        <div className="text-sm font-semibold mb-2" style={{ color: 'var(--color-ink-secondary)' }}>Mastery Breakdown</div>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1.5">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'var(--color-success)' }} />
                                <span className="text-sm">{greenCount} mastered</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'var(--color-warning)' }} />
                                <span className="text-sm">{yellowCount} learning</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'var(--color-error)' }} />
                                <span className="text-sm">{redCount} needs work</span>
                            </div>
                        </div>
                    </Card>
                )}

                <Divider />

                <Button
                    variant="ghost"
                    onClick={() => {
                        if (window.confirm('Reset all progress? This cannot be undone.')) {
                            dispatch({ type: 'RESET_PROGRESS' });
                            dispatch({ type: 'TOGGLE_SETTINGS' });
                        }
                    }}
                    className="w-full text-center"
                    style={{ color: 'var(--color-error)' }}
                >
                    Reset All Progress
                </Button>

                <p className="text-center text-xs mt-4" style={{ color: 'var(--color-ink-faint)' }}>
                    Chronos v1.0 — The Story of Humanity
                </p>
            </div>
        </div>
    );
}
