export default function BottomNav({ activeTab, onTabChange }) {
    const tabs = [
        {
            id: 'learn',
            label: 'Learn',
            icon: (active) => (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
            )
        },
        {
            id: 'timeline',
            label: 'Timeline',
            icon: (active) => (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="2" x2="12" y2="22" />
                    <circle cx="12" cy="6" r="2" fill={active ? 'currentColor' : 'none'} />
                    <circle cx="12" cy="12" r="2" fill={active ? 'currentColor' : 'none'} />
                    <circle cx="12" cy="18" r="2" fill={active ? 'currentColor' : 'none'} />
                    <line x1="14" y1="6" x2="20" y2="6" />
                    <line x1="4" y1="12" x2="10" y2="12" />
                    <line x1="14" y1="18" x2="20" y2="18" />
                </svg>
            )
        },
        {
            id: 'practice',
            label: 'Practice',
            icon: (active) => (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="23 4 23 10 17 10" />
                    <polyline points="1 20 1 14 7 14" />
                    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                </svg>
            )
        }
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50" style={{
            backgroundColor: 'rgba(250, 246, 240, 0.95)',
            backdropFilter: 'blur(12px)',
            borderTop: '1px solid rgba(28, 25, 23, 0.06)'
        }}>
            <div className="max-w-[440px] mx-auto flex items-center justify-around h-16 px-2">
                {tabs.map(tab => {
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            className="flex flex-col items-center justify-center gap-0.5 px-4 py-1 rounded-xl transition-all duration-200"
                            style={{
                                color: isActive ? 'var(--color-terracotta)' : 'var(--color-ink-muted)',
                                backgroundColor: isActive ? 'rgba(180, 83, 9, 0.08)' : 'transparent',
                                transform: isActive ? 'scale(1.02)' : 'scale(1)',
                            }}
                        >
                            {tab.icon(isActive)}
                            <span className="text-[11px] font-medium mt-0.5">{tab.label}</span>
                        </button>
                    );
                })}
            </div>
        </nav>
    );
}
