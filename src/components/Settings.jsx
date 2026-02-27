import { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { ALL_EVENTS } from '../data/events';
import { LESSONS } from '../data/lessons';
import { Card, Button, Divider, ConfirmModal } from './shared';
import Mascot from './Mascot';

const STORAGE_KEY = 'chronos-state-v1';

function exportProgress(state) {
    const data = JSON.stringify(state, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chronos-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
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
                <div className="absolute inset-0" style={{ backgroundColor: 'rgba(28, 25, 23, 0.4)', backdropFilter: 'blur(4px)' }} />
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
            <div className="absolute inset-0" style={{ backgroundColor: 'rgba(28, 25, 23, 0.4)', backdropFilter: 'blur(4px)' }} />
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

                {/* Lesson Settings */}
                {(() => {
                    const cards = state.cardsPerLesson || 3;
                    const recap = state.recapPerCard ?? 2;
                    const totalQ = cards * (2 + recap);
                    const estMin = Math.max(1, Math.round(totalQ / 2));
                    return (
                        <>
                        <Card className="mb-3 p-4">
                            <div className="text-sm font-semibold mb-3" style={{ color: 'var(--color-ink-secondary)' }}>Cards per Lesson</div>
                            <div className="flex gap-2">
                                {[1, 2, 3].map(n => {
                                    const isActive = cards === n;
                                    return (
                                        <button
                                            key={n}
                                            onClick={() => dispatch({ type: 'SET_CARDS_PER_LESSON', value: n })}
                                            className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                                            style={{
                                                backgroundColor: isActive ? 'var(--color-burgundy)' : 'var(--color-card)',
                                                color: isActive ? 'white' : 'var(--color-ink-secondary)',
                                                border: isActive ? 'none' : '1px solid rgba(28, 25, 23, 0.08)',
                                            }}
                                        >
                                            {n} {n === 1 ? 'card' : 'cards'}
                                        </button>
                                    );
                                })}
                            </div>
                        </Card>
                        <Card className="mb-3 p-4">
                            <div className="text-sm font-semibold mb-3" style={{ color: 'var(--color-ink-secondary)' }}>Recap Intensity</div>
                            <div className="flex gap-2">
                                {[
                                    { value: 0, label: 'Off' },
                                    { value: 1, label: 'Light' },
                                    { value: 2, label: 'Full' },
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
                                                border: isActive ? 'none' : '1px solid rgba(28, 25, 23, 0.08)',
                                            }}
                                        >
                                            {label}
                                        </button>
                                    );
                                })}
                            </div>
                            <div className="flex gap-2 mt-1">
                                <span className="flex-1 text-center text-[11px]" style={{ color: 'var(--color-ink-faint)' }}>No recap</span>
                                <span className="flex-1 text-center text-[11px]" style={{ color: 'var(--color-ink-faint)' }}>1 per card</span>
                                <span className="flex-1 text-center text-[11px]" style={{ color: 'var(--color-ink-faint)' }}>2 per card</span>
                            </div>
                        </Card>
                        <p className="text-xs text-center mb-4" style={{ color: 'var(--color-ink-muted)' }}>
                            {totalQ} questions · ~{estMin} min per lesson
                        </p>
                        </>
                    );
                })()}

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
                        dispatch({ type: 'RESET_PROGRESS' });
                        dispatch({ type: 'TOGGLE_SETTINGS' });
                    }}
                    onCancel={() => setShowResetConfirm(false)}
                />
            )}
        </div>
    );
}
