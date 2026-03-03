import { useState, useRef, useEffect, forwardRef } from 'react';
import { CATEGORY_CONFIG, getRelatedEvents } from '../data/events';

/** Truncates text to `lines` lines with a "Read more / Less" toggle. */
export function ExpandableText({ children, lines = 3, className = '', style = {} }) {
    const [expanded, setExpanded] = useState(false);
    const [needsTruncation, setNeedsTruncation] = useState(false);
    const textRef = useRef(null);

    useEffect(() => {
        const el = textRef.current;
        if (!el) return;
        // Compare full scrollHeight vs clamped height
        const lineHeight = parseFloat(getComputedStyle(el).lineHeight) || 20;
        setNeedsTruncation(el.scrollHeight > lineHeight * lines + 4);
    }, [children, lines]);

    return (
        <div>
            <p
                ref={textRef}
                className={className}
                style={{
                    ...style,
                    ...(!expanded && needsTruncation ? {
                        display: '-webkit-box',
                        WebkitLineClamp: lines,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                    } : {}),
                }}
            >
                {children}
            </p>
            {needsTruncation && (
                <div className="text-right">
                    <button
                        onClick={() => setExpanded(e => !e)}
                        className="text-xs font-medium mt-0.5"
                        style={{ color: 'var(--color-burgundy)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                    >
                        {expanded ? 'Show less' : 'Read more'}
                    </button>
                </div>
            )}
        </div>
    );
}

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

export function DiHBadge({ size = 'sm' }) {
    const isSmall = size === 'sm';
    return (
        <span
            className="inline-flex items-center gap-1 rounded-md font-semibold uppercase tracking-wider flex-shrink-0"
            style={{
                fontSize: isSmall ? '9px' : '11px',
                padding: isSmall ? '2px 6px' : '3px 8px',
                color: '#8B6914',
                backgroundColor: 'rgba(230, 168, 23, 0.12)',
                border: '1px solid rgba(230, 168, 23, 0.2)',
            }}
        >
            <svg width={isSmall ? 10 : 12} height={isSmall ? 10 : 12} viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            Bonus
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

    const labels = ['Where', 'When', 'What', 'Why'];
    const scores = [mastery?.locationScore, mastery?.dateScore, mastery?.whatScore, mastery?.descriptionScore];

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

export function ProgressBar({ value, max, color }) {
    const pct = Math.min((value / max) * 100, 100);
    return (
        <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(28, 25, 23, 0.06)' }}>
            <div
                className="h-full rounded-full transition-all duration-500 ease-out"
                style={{
                    width: `${pct}%`,
                    backgroundColor: color || 'var(--color-burgundy)',
                }}
            />
        </div>
    );
}

export const Button = forwardRef(function Button({ children, onClick, variant = 'primary', disabled = false, className = '' }, ref) {
    const base = 'px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 active:scale-[0.98] cursor-pointer';

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
            ref={ref}
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
});

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
            style={{ color: isStarred ? '#E6A817' : 'var(--color-ink-faint)', minWidth: '44px', minHeight: '44px' }}
            title={isStarred ? 'Remove from favorites' : 'Add to favorites'}
        >
            <svg width={size} height={size} viewBox="0 0 24 24" fill={isStarred ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
        </button>
    );
}

let _confirmModalCounter = 0;

export function ConfirmModal({ title, message, confirmLabel = 'Yes', cancelLabel = 'Cancel', onConfirm, onCancel, danger = false }) {
    const cancelRef = useRef(null);
    const [titleId] = useState(() => `confirm-title-${++_confirmModalCounter}`);

    useEffect(() => {
        cancelRef.current?.focus();
    }, []);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6" style={{ backgroundColor: 'rgba(28, 25, 23, 0.4)', backdropFilter: 'blur(4px)' }} onClick={onCancel}>
            <div role="dialog" aria-modal="true" aria-labelledby={titleId.current} className="w-full max-w-sm rounded-2xl p-6 animate-fade-in" style={{ backgroundColor: 'var(--color-card)', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }} onClick={e => e.stopPropagation()}>
                <h3 id={titleId.current} className="text-lg font-bold mb-2" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ink)' }}>
                    {title}
                </h3>
                <p className="text-sm mb-6" style={{ color: 'var(--color-ink-muted)' }}>
                    {message}
                </p>
                <div className="flex gap-3">
                    <Button ref={cancelRef} variant="secondary" className="flex-1" onClick={onCancel}>
                        {cancelLabel}
                    </Button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 active:scale-[0.98] cursor-pointer"
                        style={{
                            backgroundColor: danger ? 'var(--color-error)' : 'var(--color-burgundy)',
                            color: '#fff',
                            boxShadow: danger ? '0 2px 8px rgba(166, 61, 61, 0.25)' : '0 2px 8px rgba(139, 65, 87, 0.25)',
                        }}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}

export function ControversyNote({ note }) {
    const [expanded, setExpanded] = useState(false);
    if (!note) return null;

    return (
        <div className="mt-3 animate-fade-in">
            <button
                onClick={() => setExpanded(e => !e)}
                className="flex items-center gap-1.5 text-xs font-medium transition-colors duration-200"
                style={{ color: 'var(--color-ink-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            >
                <span className="w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold"
                    style={{ backgroundColor: 'rgba(139, 65, 87, 0.1)', color: 'var(--color-burgundy)' }}>
                    ?
                </span>
                {expanded ? 'Hide scholarly note' : 'Scholarly note on this answer'}
            </button>
            {expanded && (
                <div className="mt-2 px-3 py-2.5 rounded-lg text-xs leading-relaxed animate-fade-in"
                    style={{
                        backgroundColor: 'rgba(139, 65, 87, 0.04)',
                        borderLeft: '2px solid var(--color-burgundy)',
                        color: 'var(--color-ink-secondary)',
                        fontStyle: 'italic',
                    }}>
                    {note}
                </div>
            )}
        </div>
    );
}

export function AnimatedCounter({ value, prefix = '', duration = 600, delay = 0, className = '', style = {} }) {
    const [display, setDisplay] = useState(0);
    const hasStarted = useRef(false);

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (hasStarted.current) return;
            hasStarted.current = true;
            const startTime = Date.now();
            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                setDisplay(Math.round(value * eased));
                if (progress < 1) requestAnimationFrame(animate);
            };
            requestAnimationFrame(animate);
        }, delay);
        return () => clearTimeout(timeout);
    }, [value, duration, delay]);

    return <span className={className} style={style}>{prefix}{display}</span>;
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

/** Shows cause-and-effect connections for an event. */
export function EventConnections({ eventId, seenEventIds, onEventClick, showAll = false }) {
    const connections = getRelatedEvents(eventId, showAll ? null : seenEventIds);
    if (connections.length === 0) return null;

    return (
        <div className="mt-4 pt-3" style={{ borderTop: '1px solid rgba(28, 25, 23, 0.06)' }}>
            <p className="text-[11px] uppercase tracking-wider font-semibold mb-2" style={{ color: 'var(--color-ink-faint)' }}>
                Connected Events
            </p>
            {connections.map(conn => (
                <div
                    key={conn.id}
                    className={`flex items-start gap-2 text-xs py-1.5 ${onEventClick ? 'cursor-pointer active:opacity-70' : ''}`}
                    style={{ color: 'var(--color-ink-muted)' }}
                    onClick={onEventClick ? (e) => { e.stopPropagation(); onEventClick(conn.id); } : undefined}
                >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                         stroke={CATEGORY_CONFIG[conn.category]?.color || '#999'}
                         strokeWidth="2.5" strokeLinecap="round" className="flex-shrink-0 mt-0.5">
                        <polyline points="9 18 15 12 9 6" />
                    </svg>
                    <div>
                        <span className="font-medium" style={{ color: 'var(--color-ink)' }}>
                            {conn.title}
                        </span>
                        <span className="ml-1" style={{ color: 'var(--color-ink-faint)' }}>
                            ({conn.date})
                        </span>
                        <p className="text-[11px] leading-snug mt-0.5" style={{ color: 'var(--color-ink-muted)', fontStyle: 'italic' }}>
                            {conn.connectionLabel}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}
