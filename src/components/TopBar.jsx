import { useApp } from '../context/AppContext';
import { useState, useEffect, useRef } from 'react';

export default function TopBar() {
    const { state, dispatch } = useApp();
    const [displayXP, setDisplayXP] = useState(state.totalXP);
    const prevXP = useRef(state.totalXP);

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
        <header className="flex-shrink-0 z-50 w-full relative" style={{
            backgroundColor: 'rgba(250, 246, 240, 0.92)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid rgba(28, 25, 23, 0.06)'
        }}>
            <div className="w-full px-4 h-14 flex items-center justify-between">
                {/* Logo */}
                <h1
                    className="text-xl font-bold tracking-tight flex items-center gap-1.5"
                    style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ink)' }}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-burgundy)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        {/* Top cap */}
                        <line x1="5" y1="3" x2="19" y2="3" />
                        {/* Bottom cap */}
                        <line x1="5" y1="21" x2="19" y2="21" />
                        {/* Left glass */}
                        <path d="M7 3 C7 3 7 9 12 12 C7 15 7 21 7 21" />
                        {/* Right glass */}
                        <path d="M17 3 C17 3 17 9 12 12 C17 15 17 21 17 21" />
                        {/* Sand top */}
                        <path d="M9.5 6.5 L14.5 6.5" strokeWidth="1.2" opacity="0.5" />
                        {/* Sand stream */}
                        <line x1="12" y1="12" x2="12" y2="15" strokeWidth="1" opacity="0.4" />
                        {/* Sand bottom pile */}
                        <path d="M9 19 Q12 16.5 15 19" strokeWidth="1.2" fill="var(--color-burgundy-light)" fillOpacity="0.25" opacity="0.6" />
                    </svg>
                    Chronos
                </h1>

                {/* Stats */}
                <div className="flex items-center gap-4">
                    {/* Streak */}
                    <div className="flex items-center gap-1.5">
                        <span className="text-lg" role="img" aria-label="streak">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-burgundy)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 2c0 4-4 6-4 10a4 4 0 0 0 8 0c0-4-4-6-4-10z" />
                                <path d="M12 22c-1.5 0-3-1-3-3 0-2 3-3 3-5 0 2 3 3 3 5 0 2-1.5 3-3 3z" fill="var(--color-burgundy-light)" stroke="none" opacity="0.5" />
                            </svg>
                        </span>
                        <span className="text-sm font-semibold" style={{ color: 'var(--color-burgundy)' }}>
                            {state.currentStreak}
                        </span>
                    </div>

                    {/* XP */}
                    <div className="flex items-center gap-1">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-bronze)" strokeWidth="2" strokeLinecap="round">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="var(--color-bronze-light)" stroke="var(--color-bronze)" opacity="0.8" />
                        </svg>
                        <span className="text-sm font-semibold" style={{ color: 'var(--color-bronze)' }}>
                            {displayXP}
                        </span>
                        <span className="text-xs" style={{ color: 'var(--color-ink-faint)' }}>XP</span>
                    </div>

                    {/* Settings gear */}
                    <button
                        onClick={() => dispatch({ type: 'TOGGLE_SETTINGS' })}
                        className="p-1 rounded-lg transition-colors duration-200"
                        style={{ color: 'var(--color-ink-muted)' }}
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
    );
}
