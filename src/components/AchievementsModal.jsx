import { useApp } from '../context/AppContext';
import { ACHIEVEMENTS } from '../data/achievements';

const CATEGORY_LABELS = {
    learning: 'Learning',
    streaks: 'Streaks',
    xp: 'Experience',
    discovery: 'Discovery',
    collection: 'Collection',
    mastery: 'Mastery',
    daily: 'Daily Quiz',
};

export default function AchievementsModal({ onClose }) {
    const { state } = useApp();
    const unlocked = state.achievements || {};
    const unlockedCount = Object.keys(unlocked).length;

    // Group achievements by category
    const grouped = {};
    for (const a of ACHIEVEMENTS) {
        if (!grouped[a.category]) grouped[a.category] = [];
        grouped[a.category].push(a);
    }

    const categoryOrder = ['learning', 'streaks', 'xp', 'discovery', 'collection', 'mastery', 'daily'];

    return (
        <div className="achievement-modal-backdrop" onClick={onClose}>
            <div className="achievement-modal" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="achievement-modal-header">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ink)' }}>
                                Achievements
                            </h2>
                            <p className="text-xs mt-0.5" style={{ color: 'var(--color-ink-muted)' }}>
                                {unlockedCount} / {ACHIEVEMENTS.length} unlocked
                            </p>
                        </div>
                        <button onClick={onClose} className="achievement-close-btn" aria-label="Close">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    </div>

                    {/* Progress bar */}
                    <div className="mt-3 w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(28,25,23,0.06)' }}>
                        <div
                            className="h-full rounded-full transition-all duration-700 ease-out"
                            style={{
                                width: `${(unlockedCount / ACHIEVEMENTS.length) * 100}%`,
                                backgroundColor: '#B8860B',
                            }}
                        />
                    </div>
                </div>

                {/* Achievement grid by category */}
                <div className="achievement-modal-body">
                    {categoryOrder.map(cat => {
                        const items = grouped[cat];
                        if (!items) return null;

                        return (
                            <div key={cat} className="mb-5">
                                <h3 className="text-[10px] uppercase tracking-widest font-bold mb-2" style={{ color: 'var(--color-ink-faint)' }}>
                                    {CATEGORY_LABELS[cat]}
                                </h3>
                                <div className="achievement-grid">
                                    {items.map(a => {
                                        const isUnlocked = !!unlocked[a.id];
                                        const prog = a.progress(state);
                                        const pct = Math.min((prog.current / prog.target) * 100, 100);

                                        return (
                                            <div
                                                key={a.id}
                                                className={`achievement-tile ${isUnlocked ? 'achievement-tile--unlocked' : 'achievement-tile--locked'}`}
                                            >
                                                <div className={`achievement-emoji ${isUnlocked ? '' : 'achievement-emoji--locked'}`}>
                                                    {a.emoji}
                                                </div>
                                                <h4 className="achievement-title">{a.title}</h4>
                                                <p className="achievement-desc">{a.description}</p>
                                                {!isUnlocked && (
                                                    <div className="achievement-progress-bar">
                                                        <div className="achievement-progress-fill" style={{ width: `${pct}%` }} />
                                                    </div>
                                                )}
                                                {!isUnlocked && (
                                                    <p className="achievement-progress-text">
                                                        {prog.current}/{prog.target}
                                                    </p>
                                                )}
                                                {isUnlocked && (
                                                    <p className="achievement-unlock-date">
                                                        {new Date(unlocked[a.id]).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                    </p>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
