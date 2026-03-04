import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ACHIEVEMENTS, BONUS_ACHIEVEMENTS } from '../data/achievements';
import { shareText, buildAchievementShareText } from '../services/share';

const CATEGORY_LABELS = {
    learning: 'Learning',
    streaks: 'Streaks',
    xp: 'Experience',
    discovery: 'Discovery',
    collection: 'Collection',
    mastery: 'Mastery',
    daily: 'Daily Quiz',
    challenge: 'Challenge',
};

function AchievementDetail({ achievement, isUnlocked, unlockDate, progress, onBack }) {
    const [shareToast, setShareToast] = useState(null);
    const pct = Math.min((progress.current / progress.target) * 100, 100);

    const handleShare = async () => {
        const text = buildAchievementShareText({ title: achievement.title, emoji: achievement.emoji });
        const result = await shareText({ title: `Chronos \u2014 ${achievement.title}`, text });
        if (result === 'copied') {
            setShareToast('Copied to clipboard!');
            setTimeout(() => setShareToast(null), 2000);
        } else if (result === 'shared') {
            setShareToast('Shared!');
            setTimeout(() => setShareToast(null), 2000);
        }
    };

    return (
        <div className="achievement-detail animate-fade-in">
            <button onClick={onBack} className="achievement-detail-back" aria-label="Back">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6" />
                </svg>
            </button>

            <div className="achievement-detail-content">
                <div
                    className="achievement-detail-emoji-wrap"
                    style={isUnlocked ? { background: 'rgba(230, 168, 23, 0.10)' } : { background: 'rgba(var(--color-ink-rgb), 0.04)' }}
                >
                    <span className={`achievement-detail-emoji ${isUnlocked ? '' : 'achievement-emoji--locked'}`}>
                        {achievement.emoji}
                    </span>
                </div>

                <h3 className="achievement-detail-title">{achievement.title}</h3>

                <p className="achievement-detail-desc">
                    {achievement.hint || achievement.description}
                </p>

                {isUnlocked ? (
                    <p className="achievement-detail-date">
                        Unlocked {new Date(unlockDate).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                ) : (
                    <div className="achievement-detail-progress">
                        <div className="achievement-detail-progress-bar">
                            <div className="achievement-progress-fill" style={{ width: `${pct}%` }} />
                        </div>
                        <p className="achievement-detail-progress-text">
                            {progress.current} / {progress.target}
                        </p>
                    </div>
                )}

                {isUnlocked && (
                    <button onClick={handleShare} className="achievement-detail-share">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                            <polyline points="16 6 12 2 8 6" />
                            <line x1="12" y1="2" x2="12" y2="15" />
                        </svg>
                        Share Achievement
                    </button>
                )}

                {shareToast && (
                    <p className="achievement-detail-toast">{shareToast}</p>
                )}
            </div>
        </div>
    );
}

export default function AchievementsModal({ onClose }) {
    const { state } = useApp();
    const unlocked = state.achievements || {};
    const unlockedRegular = ACHIEVEMENTS.filter(a => unlocked[a.id]).length;
    const unlockedBonus = BONUS_ACHIEVEMENTS.filter(a => unlocked[a.id]).length;
    const totalUnlocked = unlockedRegular + unlockedBonus;
    const [selected, setSelected] = useState(null);

    // Group achievements by category
    const grouped = {};
    for (const a of ACHIEVEMENTS) {
        if (!grouped[a.category]) grouped[a.category] = [];
        grouped[a.category].push(a);
    }

    const categoryOrder = ['learning', 'streaks', 'xp', 'discovery', 'collection', 'mastery', 'daily', 'challenge'];

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
                                {totalUnlocked} / {ACHIEVEMENTS.length + BONUS_ACHIEVEMENTS.length} unlocked
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
                    <div className="mt-3 w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(var(--color-ink-rgb), 0.06)' }}>
                        <div
                            className="h-full rounded-full transition-all duration-700 ease-out"
                            style={{
                                width: `${(totalUnlocked / (ACHIEVEMENTS.length + BONUS_ACHIEVEMENTS.length)) * 100}%`,
                                backgroundColor: '#B8860B',
                            }}
                        />
                    </div>
                </div>

                {/* Detail view or grid */}
                <div className="achievement-modal-body">
                    {selected ? (
                        <AchievementDetail
                            achievement={selected}
                            isUnlocked={!!unlocked[selected.id]}
                            unlockDate={unlocked[selected.id]}
                            progress={selected.progress ? selected.progress(state) : { current: 0, target: 1 }}
                            onBack={() => setSelected(null)}
                        />
                    ) : (
                        <>
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
                                                        onClick={() => setSelected(a)}
                                                        role="button"
                                                        tabIndex={0}
                                                        onKeyDown={e => e.key === 'Enter' && setSelected(a)}
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

                            {/* Bonus (Secret) Achievements */}
                            <div className="mb-5">
                                <h3 className="text-[10px] uppercase tracking-widest font-bold mb-2" style={{ color: '#B8860B' }}>
                                    Secret {unlockedBonus > 0 ? `\u2014 ${unlockedBonus}/${BONUS_ACHIEVEMENTS.length}` : ''}
                                </h3>
                                <div className="achievement-grid">
                                    {BONUS_ACHIEVEMENTS.map(a => {
                                        const isUnlocked = !!unlocked[a.id];

                                        if (isUnlocked) {
                                            return (
                                                <div
                                                    key={a.id}
                                                    className="achievement-tile achievement-tile--unlocked achievement-tile--bonus"
                                                    onClick={() => setSelected(a)}
                                                    role="button"
                                                    tabIndex={0}
                                                    onKeyDown={e => e.key === 'Enter' && setSelected(a)}
                                                >
                                                    <div className="achievement-emoji">
                                                        {a.emoji}
                                                    </div>
                                                    <h4 className="achievement-title">{a.title}</h4>
                                                    <p className="achievement-desc">{a.description}</p>
                                                    <p className="achievement-unlock-date">
                                                        {new Date(unlocked[a.id]).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                    </p>
                                                </div>
                                            );
                                        }

                                        // Hidden — show mystery tile (not clickable)
                                        return (
                                            <div key={a.id} className="achievement-tile achievement-tile--mystery">
                                                <div className="achievement-emoji achievement-emoji--mystery">
                                                    ?
                                                </div>
                                                <h4 className="achievement-title" style={{ color: 'var(--color-ink-faint)' }}>???</h4>
                                                <p className="achievement-desc" style={{ color: 'var(--color-ink-faint)', fontStyle: 'italic' }}>Keep exploring...</p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
