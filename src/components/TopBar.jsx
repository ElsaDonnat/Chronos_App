import { useApp } from '../context/AppContext';
import { useState, useEffect, useRef, useMemo } from 'react';
import AchievementsModal from './AchievementsModal';
import { shareText, buildStreakShareText } from '../services/share';

const SECTION_NAMES = {
    learn: 'Chapter 1: The Story of Humanity',
    timeline: 'Timeline',
    practice: 'Practice',
};

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
    inactive:  { stroke: '#A8A29E', fill: '#D6D3D1', fillOpacity: 0.3, countColor: '#A8A29E' },
};

function StreakModal({ streakStatus, currentStreak, onClose }) {
    const colors = FLAME_COLORS[streakStatus];
    const [shareToast, setShareToast] = useState(false);

    useEffect(() => {
        if (shareToast) {
            const t = setTimeout(() => setShareToast(false), 2000);
            return () => clearTimeout(t);
        }
    }, [shareToast]);

    const { title, message } = useMemo(() => {
        if (streakStatus === 'active') {
            if (currentStreak >= 7) return {
                title: 'Unstoppable!',
                message: `${currentStreak} days in a row \— you\’re building a real habit. Keep the flame burning!`
            };
            if (currentStreak >= 3) return {
                title: 'Nice streak!',
                message: `${currentStreak} consecutive days of learning. You\’re on a roll!`
            };
            return {
                title: 'Streak alive!',
                message: `You\’ve studied ${currentStreak} day${currentStreak === 1 ? '' : 's'} in a row. Come back tomorrow to keep it going.`
            };
        }
        if (streakStatus === 'at-risk') return {
            title: 'Don\’t lose it!',
            message: `Your ${currentStreak}-day streak is still alive \— complete a lesson today to keep the flame burning.`
        };
        return {
            title: 'Start a streak',
            message: 'Complete a lesson to ignite your streak. Study daily to build momentum!'
        };
    }, [streakStatus, currentStreak]);

    return (
        <div className="streak-modal-backdrop" onClick={onClose}>
            <div className="streak-modal" onClick={e => e.stopPropagation()}>
                <div className="streak-modal-header">
                    <div className="streak-modal-flame">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round"
                            className={streakStatus !== 'inactive' ? `streak-flame--${streakStatus}` : undefined}
                        >
                            <path d="M12 2c0 4-4 6-4 10a4 4 0 0 0 8 0c0-4-4-6-4-10z"
                                stroke={colors.stroke} strokeWidth="1.5" fill={colors.fill} fillOpacity={colors.fillOpacity} />
                            <path d="M12 22c-1.5 0-3-1-3-3 0-2 3-3 3-5 0 2 3 3 3 5 0 2-1.5 3-3 3z"
                                fill={colors.innerFill || colors.fill} stroke="none" opacity="0.6" />
                        </svg>
                    </div>
                    <span className="streak-modal-count" style={{ color: colors.countColor }}>
                        {currentStreak}
                    </span>
                    <span className="streak-modal-label">{title}</span>
                </div>
                <div className="streak-modal-body">
                    <p className="streak-modal-message">{message}</p>
                    {currentStreak >= 1 && (
                        <button
                            onClick={async () => {
                                const text = buildStreakShareText({ currentStreak });
                                const result = await shareText({ title: 'Chronos', text });
                                if (result === 'copied') setShareToast(true);
                            }}
                            className="w-full flex items-center justify-center gap-2 mb-3 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer"
                            style={{ color: colors.countColor, backgroundColor: `${colors.fill}22` }}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                                <polyline points="16 6 12 2 8 6" />
                                <line x1="12" y1="2" x2="12" y2="15" />
                            </svg>
                            Share Streak
                        </button>
                    )}
                    {shareToast && (
                        <p className="text-xs text-center mb-2 animate-fade-in" style={{ color: 'var(--color-success)' }}>
                            Copied to clipboard!
                        </p>
                    )}
                    <button className="streak-modal-close" onClick={onClose}>Got it</button>
                </div>
            </div>
        </div>
    );
}

export default function TopBar({ activeTab }) {
    const { state, dispatch } = useApp();
    const [displayXP, setDisplayXP] = useState(state.totalXP);
    const [showStreakModal, setShowStreakModal] = useState(false);
    const [showAchievements, setShowAchievements] = useState(false);
    const prevXP = useRef(state.totalXP);
    const hasNewAchievements = (state.newAchievements || []).length > 0;

    const streakStatus = getStreakStatus(state.lastActiveDate, state.currentStreak);
    const flameColors = FLAME_COLORS[streakStatus];

    // Animate XP counter
    useEffect(() => {
        if (state.totalXP !== prevXP.current) {
            const start = prevXP.current;
            const end = state.totalXP;
            const duration = 600;
            const startTime = Date.now();

            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                setDisplayXP(Math.round(start + (end - start) * eased));

                if (progress < 1) {
                    requestAnimationFrame(animate);
                }
            };
            requestAnimationFrame(animate);
            prevXP.current = end;
        }
    }, [state.totalXP]);

    return (
        <>
            <header className="topbar">
                <div className="topbar-inner">
                    {/* Logo — left */}
                    <h1 className="topbar-logo">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-burgundy)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="5" y1="3" x2="19" y2="3" />
                            <line x1="5" y1="21" x2="19" y2="21" />
                            <path d="M7 3 C7 3 7 9 12 12 C7 15 7 21 7 21" />
                            <path d="M17 3 C17 3 17 9 12 12 C17 15 17 21 17 21" />
                            <path d="M9.5 6.5 L14.5 6.5" strokeWidth="1.2" opacity="0.5" />
                            <line x1="12" y1="12" x2="12" y2="15" strokeWidth="1" opacity="0.4" />
                            <path d="M9 19 Q12 16.5 15 19" strokeWidth="1.2" fill="var(--color-burgundy-light)" fillOpacity="0.25" opacity="0.6" />
                        </svg>
                        Chronos
                    </h1>

                    {/* Section name — center (hidden on small screens) */}
                    <div className="topbar-section-name">
                        {SECTION_NAMES[activeTab] || ''}
                    </div>

                    {/* Stats — right */}
                    <div className="topbar-stats">
                        {/* Streak */}
                        <button
                            className="streak-flame-btn"
                            onClick={() => setShowStreakModal(true)}
                            aria-label={`${state.currentStreak} day streak — click for details`}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round"
                                className={streakStatus !== 'inactive' ? `streak-flame--${streakStatus}` : undefined}
                            >
                                <path d="M12 2c0 4-4 6-4 10a4 4 0 0 0 8 0c0-4-4-6-4-10z"
                                    stroke={flameColors.stroke} strokeWidth="2" fill={flameColors.fill} fillOpacity={flameColors.fillOpacity} />
                                <path d="M12 22c-1.5 0-3-1-3-3 0-2 3-3 3-5 0 2 3 3 3 5 0 2-1.5 3-3 3z"
                                    fill={flameColors.innerFill || flameColors.fill} stroke="none" opacity="0.5" />
                            </svg>
                            <span className="text-sm font-semibold" style={{ color: flameColors.countColor }}>
                                {state.currentStreak}
                            </span>
                        </button>

                        {/* XP — key triggers animation replay on XP gain */}
                        <div key={state.totalXP} className="topbar-stat animate-xp-glow">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-bronze)" strokeWidth="2" strokeLinecap="round"
                                className="animate-number-pop">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="var(--color-bronze-light)" stroke="var(--color-bronze)" opacity="0.8" />
                            </svg>
                            <span className="text-sm font-semibold" style={{ color: 'var(--color-bronze)' }}>
                                {displayXP}
                            </span>
                            <span className="text-xs hidden sm:inline" style={{ color: 'var(--color-ink-faint)' }}>XP</span>
                        </div>

                        {/* Achievements trophy */}
                        <button
                            onClick={() => setShowAchievements(true)}
                            className="topbar-trophy-btn"
                            aria-label="Achievements"
                        >
                            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#B8860B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                                <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                                <path d="M4 22h16" />
                                <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20 7 22" />
                                <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20 17 22" />
                                <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
                            </svg>
                            {hasNewAchievements && <span className="achievement-dot" />}
                        </button>

                        {/* Settings gear */}
                        <button
                            onClick={() => dispatch({ type: 'TOGGLE_SETTINGS' })}
                            className="topbar-settings-btn"
                            aria-label="Settings"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="3" />
                                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                            </svg>
                        </button>
                    </div>
                </div>
            </header>

            {showStreakModal && (
                <StreakModal
                    streakStatus={streakStatus}
                    currentStreak={state.currentStreak}
                    onClose={() => setShowStreakModal(false)}
                />
            )}

            {showAchievements && (
                <AchievementsModal onClose={() => setShowAchievements(false)} />
            )}
        </>
    );
}
