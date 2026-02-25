import { useApp } from '../../context/AppContext';
import { ALL_EVENTS } from '../../data/events';

const NAV_ITEMS = [
    {
        id: 'learn',
        label: 'Learn',
        icon: (active) => (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
        ),
    },
    {
        id: 'timeline',
        label: 'Timeline',
        icon: (active) => (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="2" x2="12" y2="22" />
                <circle cx="12" cy="6" r="2" fill={active ? 'currentColor' : 'none'} />
                <circle cx="12" cy="12" r="2" fill={active ? 'currentColor' : 'none'} />
                <circle cx="12" cy="18" r="2" fill={active ? 'currentColor' : 'none'} />
                <line x1="14" y1="6" x2="20" y2="6" />
                <line x1="4" y1="12" x2="10" y2="12" />
                <line x1="14" y1="18" x2="20" y2="18" />
            </svg>
        ),
    },
    {
        id: 'practice',
        label: 'Practice',
        icon: (active) => (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 4 23 10 17 10" />
                <polyline points="1 20 1 14 7 14" />
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
        ),
    },
];

export default function Sidebar({ activeTab, onTabChange }) {
    const { state } = useApp();
    const learnedCount = state.seenEvents?.length || 0;
    const totalEvents = ALL_EVENTS.length;
    const progressPct = totalEvents > 0 ? Math.round((learnedCount / totalEvents) * 100) : 0;

    return (
        <aside className="sidebar">
            <nav className="sidebar-nav">
                {NAV_ITEMS.map(item => {
                    const isActive = activeTab === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => onTabChange(item.id)}
                            className={`sidebar-nav-item ${isActive ? 'sidebar-nav-item--active' : ''}`}
                        >
                            <span className="sidebar-nav-icon">
                                {item.icon(isActive)}
                            </span>
                            <span className="sidebar-nav-label">{item.label}</span>
                        </button>
                    );
                })}
            </nav>

            <div className="sidebar-progress">
                <div className="sidebar-progress-label">
                    <span>Progress</span>
                    <span>{learnedCount}/{totalEvents}</span>
                </div>
                <div className="sidebar-progress-bar">
                    <div
                        className="sidebar-progress-fill"
                        style={{ width: `${progressPct}%` }}
                    />
                </div>
                <p className="sidebar-progress-text">
                    {learnedCount === 0
                        ? 'Start your first lesson'
                        : `${progressPct}% of events discovered`
                    }
                </p>
            </div>
        </aside>
    );
}

export function MobileTabBar({ activeTab, onTabChange }) {
    return (
        <div className="mobile-tab-bar">
            {NAV_ITEMS.map(item => {
                const isActive = activeTab === item.id;
                return (
                    <button
                        key={item.id}
                        onClick={() => onTabChange(item.id)}
                        className={`mobile-tab-item ${isActive ? 'mobile-tab-item--active' : ''}`}
                    >
                        {item.icon(isActive)}
                        <span className="mobile-tab-label">{item.label}</span>
                    </button>
                );
            })}
        </div>
    );
}
