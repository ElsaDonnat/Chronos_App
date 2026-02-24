import { CATEGORY_CONFIG } from '../data/events';

export function CategoryTag({ category }) {
    const config = CATEGORY_CONFIG[category];
    if (!config) return null;

    return (
        <span
            className="inline-flex items-center px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider rounded-md"
            style={{ color: config.color, backgroundColor: config.bg }}
        >
            {config.label}
        </span>
    );
}

export function MasteryDots({ mastery, size = 'sm' }) {
    const dotSize = size === 'sm' ? 'w-2 h-2' : 'w-3 h-3';
    const gap = size === 'sm' ? 'gap-1' : 'gap-1.5';

    const getColor = (score) => {
        if (score === 'green') return 'var(--color-success)';
        if (score === 'yellow') return 'var(--color-warning)';
        if (score === 'red') return 'var(--color-error)';
        return 'var(--color-ink-faint)';
    };

    const labels = ['Where', 'When', 'What'];
    const scores = [mastery?.locationScore, mastery?.dateScore, mastery?.whatScore];

    return (
        <div className={`flex items-center ${gap}`} title={scores.map((s, i) => `${labels[i]}: ${s || 'not tested'}`).join(', ')}>
            {scores.map((score, i) => (
                <div
                    key={i}
                    className={`${dotSize} rounded-full transition-colors duration-300`}
                    style={{
                        backgroundColor: getColor(score),
                        opacity: score ? 1 : 0.3
                    }}
                />
            ))}
        </div>
    );
}

export function Divider() {
    return (
        <div className="flex items-center justify-center my-6">
            <div className="flex-1 h-px" style={{ backgroundColor: 'rgba(28, 25, 23, 0.08)' }} />
            <div className="mx-3">
                <div className="w-1.5 h-1.5 rotate-45" style={{ backgroundColor: 'var(--color-bronze-light)' }} />
            </div>
            <div className="flex-1 h-px" style={{ backgroundColor: 'rgba(28, 25, 23, 0.08)' }} />
        </div>
    );
}

export function ProgressBar({ value, max, colorClass = 'bg-burgundy' }) {
    const pct = Math.min((value / max) * 100, 100);
    return (
        <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(28, 25, 23, 0.06)' }}>
            <div
                className="h-full rounded-full transition-all duration-500 ease-out"
                style={{
                    width: `${pct}%`,
                    backgroundColor: 'var(--color-burgundy)',
                }}
            />
        </div>
    );
}

export function Button({ children, onClick, variant = 'primary', disabled = false, className = '' }) {
    const base = 'px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 active:scale-[0.98]';

    const variants = {
        primary: {
            backgroundColor: disabled ? 'var(--color-ink-faint)' : 'var(--color-burgundy)',
            color: '#fff',
            boxShadow: disabled ? 'none' : '0 2px 8px rgba(139, 65, 87, 0.25)'
        },
        secondary: {
            backgroundColor: 'rgba(139, 65, 87, 0.08)',
            color: 'var(--color-burgundy)',
        },
        ghost: {
            backgroundColor: 'transparent',
            color: 'var(--color-ink-muted)',
        }
    };

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`${base} ${className}`}
            style={{
                ...variants[variant],
                cursor: disabled ? 'not-allowed' : 'pointer',
                opacity: disabled ? 0.5 : 1,
            }}
        >
            {children}
        </button>
    );
}

export function Card({ children, className = '', onClick, style = {} }) {
    return (
        <div
            onClick={onClick}
            className={`rounded-[14px] p-5 transition-all duration-200 ${onClick ? 'cursor-pointer hover:shadow-lg active:scale-[0.99]' : ''} ${className}`}
            style={{
                backgroundColor: 'var(--color-card)',
                boxShadow: 'var(--shadow-card)',
                ...style
            }}
        >
            {children}
        </div>
    );
}

export function StarButton({ isStarred, onClick, size = 18 }) {
    return (
        <button
            onClick={(e) => { e.stopPropagation(); onClick(); }}
            className="flex items-center justify-center transition-all duration-200 active:scale-90"
            style={{ color: isStarred ? '#E6A817' : 'var(--color-ink-faint)' }}
            title={isStarred ? 'Remove from favorites' : 'Add to favorites'}
        >
            <svg width={size} height={size} viewBox="0 0 24 24" fill={isStarred ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
        </button>
    );
}

export function TabSelector({ tabs, activeTab, onChange }) {
    return (
        <div className="flex rounded-xl p-1" style={{ backgroundColor: 'rgba(28, 25, 23, 0.05)' }}>
            {tabs.map(tab => (
                <button
                    key={tab.id}
                    onClick={() => onChange(tab.id)}
                    className="flex-1 px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200"
                    style={{
                        backgroundColor: activeTab === tab.id ? 'var(--color-card)' : 'transparent',
                        color: activeTab === tab.id ? 'var(--color-ink)' : 'var(--color-ink-muted)',
                        boxShadow: activeTab === tab.id ? 'var(--shadow-card)' : 'none',
                    }}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
}
