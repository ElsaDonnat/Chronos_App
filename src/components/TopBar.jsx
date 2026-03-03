import { useApp } from '../context/AppContext';
import { useState, useEffect, useRef } from 'react';
import AchievementsModal from './AchievementsModal';
import StreakFlame, { FLAME_COUNT_COLORS } from './StreakFlame';

const SECTION_NAMES = {
    learn: 'Chapter 1: The Story of Humanity',
    timeline: 'Timeline',
    practice: 'Practice',
    challenge: 'Challenge',
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

export default function TopBar({ activeTab }) {
    const { state, dispatch } = useApp();
    const [displayXP, setDisplayXP] = useState(state.totalXP);
    const [showAchievements, setShowAchievements] = useState(false);
    const prevXP = useRef(state.totalXP);
    const hasNewAchievements = (state.newAchievements || []).length > 0;

    const streakStatus = getStreakStatus(state.lastActiveDate, state.currentStreak);

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
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            {/* Hourglass silhouette - burgundy */}
                            <path d="M7 4 L17 4 C17.5 4 17.8 4.2 17.8 4.4 L17.8 4.4 C17.8 4.6 17.5 4.8 17 4.8 L16 4.8 C16 8 14.4 10.4 12 12 C14.4 13.6 16 16 16 19.2 L17 19.2 C17.5 19.2 17.8 19.4 17.8 19.6 L17.8 19.6 C17.8 19.8 17.5 20 17 20 L7 20 C6.5 20 6.2 19.8 6.2 19.6 L6.2 19.6 C6.2 19.4 6.5 19.2 7 19.2 L8 19.2 C8 16 9.6 13.6 12 12 C9.6 10.4 8 8 8 4.8 L7 4.8 C6.5 4.8 6.2 4.6 6.2 4.4 L6.2 4.4 C6.2 4.2 6.5 4 7 4 Z" fill="var(--color-burgundy)" />
                            {/* Glass interior top */}
                            <path d="M9.4 5.8 C9.4 8.4 10.5 10.6 12 12 C13.5 10.6 14.6 8.4 14.6 5.8 Z" fill="var(--color-parchment)" />
                            {/* Glass interior bottom */}
                            <path d="M9.4 18.2 C9.4 15.6 10.5 13.4 12 12 C13.5 13.4 14.6 15.6 14.6 18.2 Z" fill="var(--color-parchment)" />
                            {/* Sand pile at bottom */}
                            <path d="M9.7 18.2 Q12 15.3 14.3 18.2 Z" fill="#C8A882" />
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
                            onClick={() => window.dispatchEvent(new Event('openWeekTracker'))}
                            aria-label={`${state.currentStreak} day streak — click for details`}
                        >
                            <StreakFlame status={streakStatus} size={18} />
                            <span className="text-sm font-semibold" style={{ color: FLAME_COUNT_COLORS[streakStatus] }}>
                                {state.currentStreak}
                            </span>
                        </button>

                        {/* XP — key triggers animation replay on XP gain */}
                        <div id="xp-star-target" key={state.totalXP} className="topbar-stat animate-xp-glow"
                            onClick={() => window.dispatchEvent(new Event('openWeekTracker'))}
                            style={{ cursor: 'pointer' }}>
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

            {showAchievements && (
                <AchievementsModal onClose={() => setShowAchievements(false)} />
            )}
        </>
    );
}
