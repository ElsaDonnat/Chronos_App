import { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ALL_EVENTS } from '../data/events';
import { LESSONS, ALL_LEVEL2_LESSONS } from '../data/lessons';
import { Card, Button, Divider, ConfirmModal } from './shared';
import Mascot from './Mascot';
import StreakFlame from './StreakFlame';
import {
    rescheduleNotifications,
    cancelAllReminders,
    requestNotificationPermission,
} from '../services/notifications';
import * as feedback from '../services/feedback';

const STORAGE_KEY = 'chronos-state-v1';

async function exportProgress(state) {
    const data = JSON.stringify(state, null, 2);
    const filename = `chronos-backup-${new Date().toISOString().split('T')[0]}.json`;

    // On Android / mobile, use Web Share API to let user save/send the file
    if (navigator.share && navigator.canShare) {
        const file = new File([data], filename, { type: 'application/json' });
        if (navigator.canShare({ files: [file] })) {
            try {
                await navigator.share({ files: [file], title: 'Chronos Backup' });
                return;
            } catch (e) {
                if (e.name === 'AbortError') return; // user cancelled, that's fine
            }
        }
    }

    // Fallback: blob download (works on desktop browsers)
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

export default function Settings() {
    const { state, dispatch } = useApp();
    const [showResetConfirm, setShowResetConfirm] = useState(false);
    const [showPrivacy, setShowPrivacy] = useState(false);
    const [importStatus, setImportStatus] = useState(null); // 'success' | 'error' | null
    const fileInputRef = useRef(null);

    const learnedCount = state.seenEvents.length;
    const totalEvents = ALL_EVENTS.length;
    const completedLessons = Object.keys(state.completedLessons).length;

    // Format study time
    const totalSeconds = state.totalStudyTime || 0;
    const formatTime = (secs) => {
        const h = Math.floor(secs / 3600);
        const m = Math.floor((secs % 3600) / 60);
        return h > 0 ? `${h}h ${m}m` : `${m}m`;
    };
    const studyTimeStr = formatTime(totalSeconds);

    // Today's study time
    const todayStr = new Date().toISOString().slice(0, 10);
    const todaySeconds = (state.studySessions || [])
        .filter(s => s.date && s.date.slice(0, 10) === todayStr)
        .reduce((sum, s) => sum + (s.duration || 0), 0);
    const todayTimeStr = formatTime(todaySeconds);

    // Play modal open sound on mount
    useEffect(() => { feedback.modalOpen(); }, []);

    // Reschedule notifications when settings change
    useEffect(() => {
        if (state.notificationsEnabled) {
            rescheduleNotifications(state, state.currentStreak);
        } else {
            cancelAllReminders();
        }
    }, [state.notificationsEnabled, state.dailyReminderTime, state.streakRemindersEnabled]); // eslint-disable-line react-hooks/exhaustive-deps

    const masteryEntries = Object.values(state.eventMastery);
    const greenCount = masteryEntries.filter(m => m.overallMastery >= 7).length;
    const yellowCount = masteryEntries.filter(m => m.overallMastery >= 3 && m.overallMastery < 7).length;
    const redCount = masteryEntries.filter(m => m.overallMastery < 3 && m.overallMastery > 0).length;

    const handleImport = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            try {
                const imported = JSON.parse(ev.target.result);
                // Basic validation
                if (typeof imported !== 'object' || !imported.completedLessons) {
                    setImportStatus('error');
                    return;
                }
                dispatch({ type: 'IMPORT_STATE', payload: imported });
                setImportStatus('success');
                setTimeout(() => setImportStatus(null), 3000);
            } catch {
                setImportStatus('error');
                setTimeout(() => setImportStatus(null), 3000);
            }
        };
        reader.readAsText(file);
        // Reset file input so the same file can be selected again
        e.target.value = '';
    };

    // Privacy policy modal
    if (showPrivacy) {
        return (
            <div className="fixed inset-0 z-[60] flex items-center justify-center" onClick={() => setShowPrivacy(false)}>
                <div className="absolute inset-0" style={{ backgroundColor: 'rgba(var(--color-ink-rgb), 0.4)', backdropFilter: 'blur(4px)' }} />
                <div
                    className="relative w-full max-w-lg rounded-2xl p-6 mx-4 animate-fade-in-up"
                    style={{ backgroundColor: 'var(--color-parchment)', maxHeight: '80vh', overflowY: 'auto', boxShadow: 'var(--shadow-elevated)' }}
                    onClick={e => e.stopPropagation()}
                >
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ink)' }}>
                            Privacy Policy
                        </h2>
                        <button onClick={() => setShowPrivacy(false)} className="p-1 rounded-lg" style={{ color: 'var(--color-ink-muted)' }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    </div>
                    <div className="text-sm leading-relaxed space-y-3" style={{ color: 'var(--color-ink-secondary)' }}>
                        <p><strong>Last updated:</strong> February 26, 2026</p>
                        <p>Chronos is a history learning app. Your privacy is important to us.</p>
                        <h3 className="font-bold mt-4" style={{ color: 'var(--color-ink)' }}>Data Collection</h3>
                        <p>Chronos does <strong>not</strong> collect, transmit, or share any personal data. The app works entirely offline.</p>
                        <h3 className="font-bold mt-4" style={{ color: 'var(--color-ink)' }}>Local Storage</h3>
                        <p>Your learning progress (completed lessons, mastery scores, XP, and streaks) is stored locally on your device using browser storage. This data never leaves your device.</p>
                        <h3 className="font-bold mt-4" style={{ color: 'var(--color-ink)' }}>No Analytics or Tracking</h3>
                        <p>Chronos does not use any analytics services, advertising SDKs, crash reporting tools, or tracking technologies.</p>
                        <h3 className="font-bold mt-4" style={{ color: 'var(--color-ink)' }}>No Network Requests</h3>
                        <p>The app makes zero network requests after installation. All content, fonts, and assets are bundled with the app.</p>
                        <h3 className="font-bold mt-4" style={{ color: 'var(--color-ink)' }}>Children{"'"}s Privacy</h3>
                        <p>Chronos is an educational app suitable for all ages. Since no data is collected, there are no special concerns regarding children{"'"}s privacy.</p>
                        <h3 className="font-bold mt-4" style={{ color: 'var(--color-ink)' }}>Data Deletion</h3>
                        <p>You can delete all your data at any time using the {"\""}Reset All Progress{"\""} button in Settings, or by clearing the app{"'"}s data in your device settings.</p>
                        <h3 className="font-bold mt-4" style={{ color: 'var(--color-ink)' }}>Contact</h3>
                        <p>If you have questions about this privacy policy, please contact us via the app{"'"}s GitHub repository.</p>
                    </div>
                    <div className="mt-6">
                        <Button className="w-full" onClick={() => setShowPrivacy(false)}>Close</Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center" onClick={() => dispatch({ type: 'TOGGLE_SETTINGS' })}>
            <div className="absolute inset-0" style={{ backgroundColor: 'rgba(var(--color-ink-rgb), 0.4)', backdropFilter: 'blur(4px)' }} />
            <div
                className="relative w-full max-w-lg rounded-2xl p-6 mx-4 animate-fade-in-up"
                style={{ backgroundColor: 'var(--color-parchment)', maxHeight: '80vh', overflowY: 'auto', boxShadow: 'var(--shadow-elevated)' }}
                onClick={e => e.stopPropagation()}
            >
                <div className="relative flex items-center justify-center mb-4">
                    <h2 className="text-lg font-bold" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ink)' }}>
                        Your &nbsp;Journey
                    </h2>
                    <button
                        onClick={() => dispatch({ type: 'TOGGLE_SETTINGS' })}
                        className="absolute right-0 p-1 rounded-lg"
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
                        <div className="flex items-center justify-center gap-1.5">
                            <StreakFlame status={(() => {
                                if (!state.lastActiveDate || state.currentStreak === 0) return 'inactive';
                                const today = new Date().toISOString().split('T')[0];
                                if (state.lastActiveDate === today) return 'active';
                                const yesterday = new Date();
                                yesterday.setDate(yesterday.getDate() - 1);
                                return state.lastActiveDate === yesterday.toISOString().split('T')[0] ? 'at-risk' : 'inactive';
                            })()} size={22} />
                            <div className="text-2xl font-bold" style={{ color: 'var(--color-burgundy)' }}>{state.currentStreak}</div>
                        </div>
                        <div className="text-xs mt-1" style={{ color: 'var(--color-ink-muted)' }}>Day Streak</div>
                    </Card>
                    <Card className="text-center p-4">
                        <div className="text-2xl font-bold" style={{ color: 'var(--color-burgundy)' }}>{learnedCount}/{totalEvents}</div>
                        <div className="text-xs mt-1" style={{ color: 'var(--color-ink-muted)' }}>Events Learned</div>
                    </Card>
                    <Card className="text-center p-4">
                        <div className="text-2xl font-bold" style={{ color: 'var(--color-burgundy)' }}>{completedLessons}/{LESSONS.length + ALL_LEVEL2_LESSONS.length}</div>
                        <div className="text-xs mt-1" style={{ color: 'var(--color-ink-muted)' }}>Lessons Complete</div>
                    </Card>
                </div>

                {(totalSeconds > 0 || todaySeconds > 0) && (
                    <Card className="mb-4 p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-burgundy)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                                <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                            </svg>
                            <span className="text-sm font-semibold" style={{ color: 'var(--color-ink-secondary)' }}>Study Time</span>
                        </div>
                        <div className="flex items-center justify-around">
                            <div className="flex flex-col items-center">
                                <span className="text-xl font-bold" style={{ color: 'var(--color-burgundy)' }}>{todayTimeStr}</span>
                                <span className="text-[11px]" style={{ color: 'var(--color-ink-muted)' }}>Today</span>
                            </div>
                            <div style={{ width: 1, height: 28, backgroundColor: 'rgba(var(--color-ink-rgb), 0.08)' }} />
                            <div className="flex flex-col items-center">
                                <span className="text-xl font-bold" style={{ color: 'var(--color-ink)' }}>{studyTimeStr}</span>
                                <span className="text-[11px]" style={{ color: 'var(--color-ink-muted)' }}>Total</span>
                            </div>
                        </div>
                    </Card>
                )}

                {masteryEntries.length > 0 && (
                    <Card className="mb-4 p-4">
                        <div className="text-sm font-semibold mb-2" style={{ color: 'var(--color-ink-secondary)' }}>Mastery Breakdown</div>
                        <div className="flex items-center justify-around w-full">
                            <div className="flex flex-col items-center">
                                <span className="text-xl font-bold" style={{ color: 'var(--color-success)' }}>{greenCount}</span>
                                <span className="text-[11px]" style={{ color: 'var(--color-ink-muted)' }}>Mastered</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="text-xl font-bold" style={{ color: 'var(--color-warning)' }}>{yellowCount}</span>
                                <span className="text-[11px]" style={{ color: 'var(--color-ink-muted)' }}>Learning</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="text-xl font-bold" style={{ color: 'var(--color-error)' }}>{redCount}</span>
                                <span className="text-[11px]" style={{ color: 'var(--color-ink-muted)' }}>Needs Work</span>
                            </div>
                        </div>
                    </Card>
                )}

                {/* Lesson Settings */}
                {(() => {
                    const recap = state.recapPerCard ?? 2;
                    const totalQ = 3 * (2 + recap);
                    const estMin = Math.max(1, Math.round(totalQ / 2));
                    return (
                        <>
                            <Card className="mb-3 p-4">
                                <div className="text-sm font-semibold mb-3" style={{ color: 'var(--color-ink-secondary)' }}>Recap intensity (lessons)</div>
                                <div className="flex gap-2">
                                    {[
                                        { value: 0, label: 'Off', sub: 'No recap' },
                                        { value: 1, label: '1', sub: '1 per card' },
                                        { value: 2, label: '2', sub: '2 per card' },
                                        { value: 3, label: '3', sub: '3 per card' },
                                    ].map(({ value, label }) => {
                                        const isActive = recap === value;
                                        return (
                                            <button
                                                key={value}
                                                onClick={() => dispatch({ type: 'SET_RECAP_PER_CARD', value })}
                                                className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                                                style={{
                                                    backgroundColor: isActive ? 'var(--color-burgundy)' : 'var(--color-card)',
                                                    color: isActive ? 'white' : 'var(--color-ink-secondary)',
                                                    border: isActive ? 'none' : '1px solid rgba(var(--color-ink-rgb), 0.08)',
                                                }}
                                            >
                                                {label}
                                            </button>
                                        );
                                    })}
                                </div>
                                <div className="flex gap-2 mt-1">
                                    {[
                                        'No recap',
                                        '1 per card',
                                        '2 per card',
                                        '3 per card',
                                    ].map(text => (
                                        <span key={text} className="flex-1 text-center text-[11px]" style={{ color: 'var(--color-ink-faint)' }}>{text}</span>
                                    ))}
                                </div>
                            </Card>
                            <p className="text-xs text-center mb-4" style={{ color: 'var(--color-ink-muted)' }}>
                                {totalQ} questions · ~{estMin} min per lesson
                            </p>
                        </>
                    );
                })()}

                {/* Notifications */}
                <Card className="mb-3 p-4">
                    <div className="flex items-center justify-between mb-1">
                        <div className="text-sm font-semibold" style={{ color: 'var(--color-ink-secondary)' }}>Daily reminders</div>
                        <button
                            type="button"
                            role="switch"
                            aria-checked={state.notificationsEnabled}
                            onClick={async () => {
                                feedback.toggleClick();
                                if (!state.notificationsEnabled) {
                                    const result = await requestNotificationPermission();
                                    if (result === 'denied') return;
                                }
                                dispatch({
                                    type: state.notificationsEnabled ? 'DISABLE_NOTIFICATIONS' : 'ENABLE_NOTIFICATIONS',
                                });
                            }}
                            className="relative w-11 h-6 rounded-full transition-colors"
                            style={{
                                backgroundColor: state.notificationsEnabled ? 'var(--color-burgundy)' : 'rgba(var(--color-ink-rgb), 0.15)',
                            }}
                        >
                            <span
                                className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform"
                                style={{
                                    transform: state.notificationsEnabled ? 'translateX(20px)' : 'translateX(0)',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                                }}
                            />
                        </button>
                    </div>
                    {state.notificationsEnabled && (
                        <div className="mt-2 space-y-2 animate-fade-in">
                            <div className="flex items-center justify-between">
                                <span className="text-xs" style={{ color: 'var(--color-ink-muted)' }}>
                                    Reminder time
                                </span>
                                <input
                                    type="time"
                                    value={state.dailyReminderTime}
                                    onChange={e => dispatch({ type: 'SET_DAILY_REMINDER_TIME', value: e.target.value })}
                                    className="rounded-lg px-2 py-1 text-xs"
                                    style={{
                                        backgroundColor: 'var(--color-parchment)',
                                        color: 'var(--color-ink)',
                                        border: '1px solid rgba(var(--color-ink-rgb), 0.08)',
                                    }}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs" style={{ color: 'var(--color-ink-muted)' }}>
                                    Streak reminders
                                </span>
                                <button
                                    type="button"
                                    role="switch"
                                    aria-checked={state.streakRemindersEnabled}
                                    onClick={() => { feedback.toggleClick(); dispatch({ type: 'SET_STREAK_REMINDERS', value: !state.streakRemindersEnabled }); }}
                                    className="relative w-9 h-5 rounded-full transition-colors"
                                    style={{
                                        backgroundColor: state.streakRemindersEnabled ? '#D4C5B0' : 'rgba(var(--color-ink-rgb), 0.12)',
                                    }}
                                >
                                    <span
                                        className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform"
                                        style={{
                                            transform: state.streakRemindersEnabled ? 'translateX(16px)' : 'translateX(0)',
                                            boxShadow: '0 1px 2px rgba(0,0,0,0.18)',
                                        }}
                                    />
                                </button>
                            </div>
                        </div>
                    )}
                </Card>

                {/* Appearance / Theme */}
                <Card className="mb-3 p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-ink-muted)' }}>
                                <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                            </svg>
                            <span className="text-sm font-semibold" style={{ color: 'var(--color-ink-secondary)' }}>Appearance</span>
                        </div>
                        <div className="flex rounded-lg overflow-hidden" style={{ border: '1px solid rgba(var(--color-ink-rgb), 0.1)' }}>
                            {[
                                { value: 'light', label: 'Light' },
                                { value: 'dark', label: 'Dark' },
                            ].map(opt => (
                                <button
                                    key={opt.value}
                                    onClick={() => dispatch({ type: 'SET_THEME', mode: opt.value })}
                                    className="px-3 py-1.5 text-xs font-semibold transition-colors"
                                    style={{
                                        backgroundColor: state.themeMode === opt.value ? 'var(--color-burgundy)' : 'transparent',
                                        color: state.themeMode === opt.value ? '#fff' : 'var(--color-ink-muted)',
                                        border: 'none',
                                        cursor: 'pointer',
                                    }}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </Card>

                {/* Sound & Haptics */}
                <Card className="mb-3 p-4 space-y-4" style={{ userSelect: 'none', WebkitUserSelect: 'none' }}>
                    {/* Sound effects volume */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <span style={{ fontSize: '16px' }}>{(state.soundVolume ?? 1) === 0 ? '🔇' : '🔊'}</span>
                                <span className="text-sm font-semibold" style={{ color: 'var(--color-ink-secondary)' }}>Sound effects</span>
                            </div>
                            <span className="text-xs tabular-nums" style={{ color: 'var(--color-ink-muted)', minWidth: '2.5rem', textAlign: 'right' }}>
                                {(state.soundVolume ?? 1) === 0 ? 'Off' : `${Math.round((state.soundVolume ?? 1) * 100)}%`}
                            </span>
                        </div>
                        <input
                            type="range" min="0" max="1" step="0.05"
                            value={state.soundVolume ?? 1}
                            onChange={e => dispatch({ type: 'SET_SOUND_VOLUME', value: parseFloat(e.target.value) })}
                            className="volume-slider"
                            style={{
                                background: `linear-gradient(to right, rgba(139, 65, 87, 0.45) ${(state.soundVolume ?? 1) * 100}%, rgba(var(--color-ink-rgb), 0.12) ${(state.soundVolume ?? 1) * 100}%)`
                            }}
                        />
                    </div>

                    {/* Ambient music volume */}
                    <div className="pt-3" style={{ borderTop: '1px solid rgba(var(--color-ink-rgb), 0.06)' }}>
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <span style={{ fontSize: '16px' }}>{(state.musicVolume ?? 1) === 0 ? '🔇' : '🎵'}</span>
                                <div>
                                    <span className="text-sm font-semibold" style={{ color: 'var(--color-ink-secondary)' }}>Ambient music</span>
                                    <div className="text-[11px]" style={{ color: 'var(--color-ink-muted)' }}>Relaxing antiquity soundscape</div>
                                </div>
                            </div>
                            <span className="text-xs tabular-nums" style={{ color: 'var(--color-ink-muted)', minWidth: '2.5rem', textAlign: 'right' }}>
                                {(state.musicVolume ?? 1) === 0 ? 'Off' : `${Math.round((state.musicVolume ?? 1) * 100)}%`}
                            </span>
                        </div>
                        <input
                            type="range" min="0" max="1" step="0.05"
                            value={state.musicVolume ?? 1}
                            onChange={e => dispatch({ type: 'SET_MUSIC_VOLUME', value: parseFloat(e.target.value) })}
                            className="volume-slider"
                            style={{
                                background: `linear-gradient(to right, rgba(139, 65, 87, 0.45) ${(state.musicVolume ?? 1) * 100}%, rgba(var(--color-ink-rgb), 0.12) ${(state.musicVolume ?? 1) * 100}%)`
                            }}
                        />
                    </div>

                    {/* Haptic feedback toggle */}
                    <div className="flex items-center justify-between pt-3" style={{ borderTop: '1px solid rgba(var(--color-ink-rgb), 0.06)' }}>
                        <div className="flex items-center gap-2">
                            <span style={{ fontSize: '16px' }}>&#x1F4F3;</span>
                            <span className="text-sm font-semibold" style={{ color: 'var(--color-ink-secondary)' }}>Haptic feedback</span>
                        </div>
                        <button
                            type="button"
                            role="switch"
                            aria-checked={state.hapticsEnabled}
                            onClick={() => { feedback.toggleClick(); dispatch({ type: 'TOGGLE_HAPTICS' }); }}
                            className="relative w-11 h-6 rounded-full transition-colors"
                            style={{ backgroundColor: state.hapticsEnabled ? 'var(--color-burgundy)' : 'rgba(var(--color-ink-rgb), 0.15)' }}
                        >
                            <span
                                className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform"
                                style={{ transform: state.hapticsEnabled ? 'translateX(20px)' : 'translateX(0)', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }}
                            />
                        </button>
                    </div>
                </Card>

                {/* Placement Quizzes */}
                <Card className="mb-3 p-4">
                    <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                            <div className="text-sm font-semibold" style={{ color: 'var(--color-ink-secondary)' }}>Placement Quizzes</div>
                            <div className="text-xs mt-0.5" style={{ color: 'var(--color-ink-muted)' }}>
                                {Object.values(state.placementQuizzes || {}).filter(q => q.passed).length > 0
                                    ? `${Object.values(state.placementQuizzes).filter(q => q.passed).length} era(s) skipped`
                                    : 'Skip eras you already know'}
                            </div>
                        </div>
                        <button
                            onClick={() => {
                                dispatch({ type: 'TOGGLE_SETTINGS' });
                                dispatch({ type: 'SET_ONBOARDING_STEP', step: 'placement_active' });
                            }}
                            className="flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold"
                            style={{
                                backgroundColor: 'var(--color-burgundy-soft)',
                                color: 'var(--color-burgundy)',
                                border: '1px solid rgba(139, 65, 87, 0.15)',
                            }}
                        >
                            Take Quiz
                        </button>
                    </div>
                </Card>

                <Divider />

                {/* Data Management */}
                <div className="flex gap-2 mb-3">
                    <Button variant="secondary" className="flex-1 text-center" onClick={() => exportProgress(state)}>
                        Export Progress
                    </Button>
                    <Button variant="secondary" className="flex-1 text-center" onClick={() => fileInputRef.current?.click()}>
                        Import Progress
                    </Button>
                    <input ref={fileInputRef} type="file" accept=".json" onChange={handleImport} className="hidden" />
                </div>
                {importStatus === 'success' && (
                    <p className="text-xs text-center mb-3" style={{ color: 'var(--color-success)' }}>Progress imported successfully!</p>
                )}
                {importStatus === 'error' && (
                    <p className="text-xs text-center mb-3" style={{ color: 'var(--color-error)' }}>Invalid backup file. Please try again.</p>
                )}

                <Button
                    variant="ghost"
                    onClick={() => setShowResetConfirm(true)}
                    className="w-full text-center"
                    style={{ color: 'var(--color-error)' }}
                >
                    Reset All Progress
                </Button>

                <Divider />

                {/* Feedback & Support */}
                <div className="flex gap-2 mb-3">
                    <button
                        onClick={() => window.open('https://forms.gle/JDUzvYqq5dVxo5vL9', '_blank')}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-medium"
                        style={{ color: 'var(--color-burgundy)', backgroundColor: 'var(--color-burgundy-soft)', border: '1px solid rgba(139, 65, 87, 0.15)' }}
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                        Give Feedback
                    </button>
                    <button
                        onClick={() => window.open('https://buymeacoffee.com/elsadonnat0', '_blank')}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-medium"
                        style={{ color: 'var(--color-ink-secondary)', backgroundColor: 'rgba(201, 169, 110, 0.12)', border: '1px solid rgba(201, 169, 110, 0.2)' }}
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 8h1a4 4 0 0 1 0 8h-1" /><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" /><line x1="6" y1="1" x2="6" y2="4" /><line x1="10" y1="1" x2="10" y2="4" /><line x1="14" y1="1" x2="14" y2="4" />
                        </svg>
                        Buy Me a Coffee
                    </button>
                </div>

                <button
                    onClick={() => setShowPrivacy(true)}
                    className="w-full text-center text-xs py-2"
                    style={{ color: 'var(--color-ink-muted)', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                    Privacy Policy
                </button>

                <p className="text-center text-xs mt-2" style={{ color: 'var(--color-ink-faint)' }}>
                    Chronos v{__APP_VERSION__} — The Story of Humanity
                </p>
            </div>

            {showResetConfirm && (
                <ConfirmModal
                    title="Reset all progress?"
                    message="This will erase all your lessons, XP, streaks, and mastery data. This cannot be undone."
                    confirmLabel="Reset Everything"
                    cancelLabel="Cancel"
                    danger
                    onConfirm={() => {
                        cancelAllReminders();
                        localStorage.removeItem('chronos-level2-unlock-seen');
                        localStorage.removeItem('chronos-learn-level');
                        localStorage.removeItem('chronos-settings-tip-seen');
                        dispatch({ type: 'RESET_PROGRESS' });
                        setShowResetConfirm(false);
                    }}
                    onCancel={() => setShowResetConfirm(false)}
                />
            )}
        </div>
    );
}
