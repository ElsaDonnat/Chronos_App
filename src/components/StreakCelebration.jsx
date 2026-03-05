import { useState, useEffect } from 'react';
import StreakFlame from './StreakFlame';

/**
 * Brief overlay shown when the user earns their streak for the day.
 * Shows the flame transitioning from its previous state to active,
 * with a checkmark appearing and streak count animating.
 *
 * @param {Object} props
 * @param {'at-risk'|'inactive'} props.previousStatus - Flame state before earning streak
 * @param {number} props.newStreak - The new streak count after earning
 * @param {function} props.onDismiss - Called when celebration finishes or is tapped
 */
export default function StreakCelebration({ previousStatus = 'inactive', newStreak = 1, onDismiss }) {
    const [phase, setPhase] = useState('enter'); // 'enter' | 'transition' | 'reveal' | 'exit'

    useEffect(() => {
        // Phase timeline: enter(0) → transition(400ms) → reveal(1000ms) → exit(2800ms) → dismiss(3200ms)
        const t1 = setTimeout(() => setPhase('transition'), 400);
        const t2 = setTimeout(() => setPhase('reveal'), 1000);
        const t3 = setTimeout(() => setPhase('exit'), 2800);
        const t4 = setTimeout(() => onDismiss?.(), 3200);
        return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
    }, [onDismiss]);

    const isNew = newStreak === 1;
    const title = isNew ? 'Streak started!' : 'Streak extended!';
    const subtitle = isNew ? 'Day 1' : `${newStreak} days`;

    return (
        <div
            className={`streak-celebration-backdrop ${phase === 'exit' ? 'streak-celebration--exit' : ''}`}
            onClick={() => onDismiss?.()}
        >
            <div
                className="streak-celebration-card"
                onClick={e => e.stopPropagation()}
            >
                {/* Flame container with crossfade */}
                <div className="streak-celebration-flame">
                    {/* Previous flame (fades out) */}
                    <div className={`streak-celebration-flame-layer ${phase !== 'enter' ? 'streak-celebration-flame--out' : ''}`}>
                        <StreakFlame status={previousStatus} size={72} />
                    </div>
                    {/* Active flame (fades in) */}
                    <div className={`streak-celebration-flame-layer ${phase !== 'enter' ? 'streak-celebration-flame--in' : 'streak-celebration-flame--hidden'}`}>
                        <StreakFlame status="active" size={72} />
                    </div>

                    {/* Checkmark badge — pops in during reveal phase */}
                    <div className={`streak-celebration-check ${phase === 'reveal' || phase === 'exit' ? 'streak-celebration-check--visible' : ''}`}>
                        <svg width="28" height="28" viewBox="0 0 28 28">
                            <circle cx="14" cy="14" r="13" fill="#5D4037"/>
                            <circle cx="14" cy="14" r="11" fill="#2E7D32"/>
                            <polyline points="8,14.5 12,18.5 20,10" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                </div>

                {/* Title */}
                <h2 className={`streak-celebration-title ${phase === 'reveal' || phase === 'exit' ? 'streak-celebration-title--visible' : ''}`}>
                    {title}
                </h2>

                {/* Streak count */}
                <div className={`streak-celebration-count ${phase === 'reveal' || phase === 'exit' ? 'streak-celebration-count--visible' : ''}`}>
                    <span className="streak-celebration-number">{newStreak}</span>
                    <span className="streak-celebration-label">{subtitle}</span>
                </div>
            </div>
        </div>
    );
}
