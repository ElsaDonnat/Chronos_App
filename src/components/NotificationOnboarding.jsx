import { useState } from 'react';
import { Button } from './shared';
import Mascot from './Mascot';
import { requestNotificationPermission } from '../services/notifications';

export default function NotificationOnboarding({ onEnable, onSkip }) {
    const [time, setTime] = useState('09:00');
    const [streakEnabled, setStreakEnabled] = useState(true);
    const [loading, setLoading] = useState(false);

    const handleEnable = async () => {
        setLoading(true);
        const result = await requestNotificationPermission();
        if (result === 'denied') {
            onSkip();
        } else {
            // 'granted', 'prompt', or 'unsupported' — save preference
            onEnable(time, streakEnabled);
        }
        setLoading(false);
    };

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center" onClick={onSkip}>
            <div className="absolute inset-0" style={{ backgroundColor: 'rgba(28, 25, 23, 0.4)', backdropFilter: 'blur(4px)' }} />
            <div
                className="relative w-full max-w-sm rounded-2xl p-6 mx-4 animate-fade-in-up"
                style={{ backgroundColor: 'var(--color-parchment)', boxShadow: 'var(--shadow-elevated)' }}
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-center mb-3">
                    <Mascot mood="happy" size={64} />
                </div>

                <h2
                    className="text-lg font-bold text-center mb-1"
                    style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ink)' }}
                >
                    Stay on track?
                </h2>
                <p
                    className="text-sm text-center mb-5"
                    style={{ color: 'var(--color-ink-secondary)' }}
                >
                    A gentle daily reminder helps build your history habit.
                </p>

                {/* Reminder time */}
                <div className="mb-4">
                    <label
                        className="text-xs font-semibold block mb-1.5"
                        style={{ color: 'var(--color-ink-secondary)' }}
                    >
                        Reminder time
                    </label>
                    <input
                        type="time"
                        value={time}
                        onChange={e => setTime(e.target.value)}
                        className="w-full rounded-xl px-3 py-2.5 text-sm"
                        style={{
                            backgroundColor: 'var(--color-card)',
                            color: 'var(--color-ink)',
                            border: '1px solid rgba(28, 25, 23, 0.08)',
                        }}
                    />
                </div>

                {/* Streak reminders toggle */}
                <div className="flex items-center justify-between mb-6">
                    <span className="text-sm" style={{ color: 'var(--color-ink-secondary)' }}>
                        Streak reminders
                    </span>
                    <button
                        type="button"
                        role="switch"
                        aria-checked={streakEnabled}
                        onClick={() => setStreakEnabled(!streakEnabled)}
                        className="relative w-11 h-6 rounded-full transition-colors"
                        style={{
                            backgroundColor: streakEnabled ? 'var(--color-burgundy)' : 'rgba(28, 25, 23, 0.15)',
                        }}
                    >
                        <span
                            className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform"
                            style={{
                                transform: streakEnabled ? 'translateX(20px)' : 'translateX(0)',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                            }}
                        />
                    </button>
                </div>

                {/* Action buttons */}
                <div className="flex gap-3">
                    <Button
                        variant="secondary"
                        className="flex-1 text-center"
                        onClick={onSkip}
                    >
                        Skip
                    </Button>
                    <Button
                        className="flex-1 text-center"
                        onClick={handleEnable}
                        disabled={loading}
                    >
                        {loading ? 'Enabling...' : 'Enable'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
