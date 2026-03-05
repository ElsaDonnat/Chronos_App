// SVG lesson icons — replace emoji to avoid rendering issues on Android
// Uses static <g> wrappers (not fragments) for Android WebView SVG stability
// Each icon is a function returning fresh JSX to prevent React element-reuse
// rendering glitches (especially on Android WebView with multiple instances)
// Warm golden sand for decorative fills — complements parchment palette
const FC = '#C89B5C';

const ICONS = [
    // 0: globe (era overview)
    () => <g><circle cx="12" cy="12" r="9" fill={FC} opacity="0.2" /><circle cx="12" cy="12" r="9" /><ellipse cx="12" cy="12" rx="4" ry="9" /><line x1="3" y1="12" x2="21" y2="12" /><path d="M4.5 7.5h15" /><path d="M4.5 16.5h15" /></g>,
    // 1: footprint
    () => <g><path d="M12 3c-1 0-2 1.5-2 4s1 4 2 5c1-1 2-2.5 2-5s-1-4-2-4z" fill={FC} opacity="0.35" /><ellipse cx="9" cy="16" rx="1.5" ry="2" transform="rotate(-10 9 16)" /><ellipse cx="15" cy="16" rx="1.5" ry="2" transform="rotate(10 15 16)" /><ellipse cx="12" cy="20" rx="3" ry="1.5" /></g>,
    // 2: brain
    () => <g><path d="M12 2C9 2 7 4 7 6c-2 0-3 2-3 4s1 3 2 3.5C6 15 7.5 17 9.5 18c1 .5 1.5 2 1.5 4h2c0-2 .5-3.5 1.5-4 2-1 3.5-3 3.5-4.5 1-.5 2-1.5 2-3.5s-1-4-3-4c0-2-2-4-5-4z" fill={FC} opacity="0.3" stroke="none" /><path d="M12 2C9 2 7 4 7 6c-2 0-3 2-3 4s1 3 2 3.5C6 15 7.5 17 9.5 18c1 .5 1.5 2 1.5 4h2c0-2 .5-3.5 1.5-4 2-1 3.5-3 3.5-4.5 1-.5 2-1.5 2-3.5s-1-4-3-4c0-2-2-4-5-4z" /><path d="M12 4v18" /><path d="M8.5 8c1.5 0 3 2 3.5 2" /><path d="M15.5 8c-1.5 0-3 2-3.5 2" /></g>,
    // 3: wheat
    () => <g><path d="M7 4c2 1 4 3 5 5c1-2 3-4 5-5" fill={FC} opacity="0.25" stroke="none" /><line x1="12" y1="22" x2="12" y2="8" /><path d="M8 8c2 0 4 2 4 4" /><path d="M16 8c-2 0-4 2-4 4" /><path d="M7 4c2 1 4 3 5 5" /><path d="M17 4c-2 1-4 3-5 5" /><path d="M9 12c1.5 0 3 1.5 3 3" /><path d="M15 12c-1.5 0-3 1.5-3 3" /></g>,
    // 4: scroll
    () => <g><path d="M8 3H6a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2h2" /><path d="M16 3h2a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V5" fill={FC} opacity="0.25" /><path d="M16 3h2a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2" /><path d="M6 19a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2" /><line x1="10" y1="9" x2="16" y2="9" /><line x1="10" y1="12" x2="16" y2="12" /><line x1="10" y1="15" x2="14" y2="15" /></g>,
    // 5: scales of justice
    () => <g><line x1="12" y1="3" x2="12" y2="21" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="5" y1="7" x2="19" y2="7" /><path d="M5 7l-2 6h6L5 7z" fill={FC} opacity="0.32" /><path d="M19 7l-2 6h6l-2-6z" fill={FC} opacity="0.32" /></g>,
    // 6: crossed swords
    () => <g><path d="M5 17l2 2 2-2z" fill={FC} opacity="0.3" stroke="none" /><path d="M19 17l-2 2-2-2z" fill={FC} opacity="0.3" stroke="none" /><path d="M5 3l14 14" /><path d="M9.5 7.5L5 3" /><path d="M19 3L5 17" /><path d="M14.5 7.5L19 3" /><path d="M5 17l2 2 2-2" /><path d="M19 17l-2 2-2-2" /></g>,
    // 7: temple columns
    () => <g><path d="M3 21h18" /><path d="M5 21V7l7-4 7 4v14" fill={FC} opacity="0.25" /><line x1="9" y1="21" x2="9" y2="10" /><line x1="15" y1="21" x2="15" y2="10" /><path d="M5 7l7-4 7 4" /><line x1="3" y1="21" x2="21" y2="21" /></g>,
    // 8: camel
    () => <g><path d="M4 18l2-8c.5-2 2-3 3-3h1c1 0 1.5 1 2 2l1 2c.5 1 1 2 2 2h2c1 0 2-1 2.5-2l1.5-3" fill={FC} opacity="0.25" stroke="none" /><path d="M4 18l2-8c.5-2 2-3 3-3h1c1 0 1.5 1 2 2l1 2c.5 1 1 2 2 2h2c1 0 2-1 2.5-2l1.5-3" /><line x1="4" y1="18" x2="4" y2="21" /><line x1="8" y1="18" x2="8" y2="21" /><line x1="16" y1="14" x2="16" y2="21" /><line x1="20" y1="12" x2="20" y2="21" /><circle cx="20" cy="7" r="1.5" /></g>,
    // 9: mosque dome — uses currentColor for crescent fill
    () => <g><path d="M4 21h16" /><path d="M6 21V12" /><path d="M18 21V12" /><path d="M6 12c0-4 3-7 6-8 3 1 6 4 6 8" fill={FC} opacity="0.25" /><path d="M6 12c0-4 3-7 6-8 3 1 6 4 6 8" /><line x1="12" y1="2" x2="12" y2="4" /><circle cx="12" cy="1.5" r="0.8" fill="currentColor" stroke="none" /></g>,
    // 10: castle
    () => <g><path d="M4 10h16v11H4z" fill={FC} opacity="0.28" /><path d="M4 21h16V10H4z" /><path d="M4 10V6h3v4" /><path d="M10 10V6h4v4" /><path d="M17 10V6h3v4" /><path d="M10 16h4v5h-4z" /></g>,
    // 11: dagger
    () => <g><line x1="12" y1="2" x2="12" y2="16" /><line x1="8" y1="7" x2="16" y2="7" /><path d="M10 16l2 6 2-6" fill={FC} opacity="0.32" /></g>,
    // 12: skull (plague)
    () => <g><path d="M12 3C7.5 3 4 6.5 4 10.5c0 3 2 5.5 4 6.5v2h8v-2c2-1 4-3.5 4-6.5C20 6.5 16.5 3 12 3z" fill={FC} opacity="0.28" /><path d="M12 3C7.5 3 4 6.5 4 10.5c0 3 2 5.5 4 6.5v2h8v-2c2-1 4-3.5 4-6.5C20 6.5 16.5 3 12 3z" /><circle cx="9" cy="10" r="2" fill={FC} opacity="0.35" /><circle cx="15" cy="10" r="2" fill={FC} opacity="0.35" /><path d="M10 16v2" /><path d="M12 16v2" /><path d="M14 16v2" /></g>,
    // 13: palette
    () => <g><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c1 0 2-.8 2-2 0-.5-.2-1-.5-1.3-.3-.3-.5-.8-.5-1.3 0-1.1.9-2 2-2h2.5c3 0 5.5-2.5 5.5-5.5C23 6 18 2 12 2z" fill={FC} opacity="0.22" stroke="none" /><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c1 0 2-.8 2-2 0-.5-.2-1-.5-1.3-.3-.3-.5-.8-.5-1.3 0-1.1.9-2 2-2h2.5c3 0 5.5-2.5 5.5-5.5C23 6 18 2 12 2z" /><circle cx="8" cy="8" r="1.5" fill={FC} opacity="0.6" stroke="none" /><circle cx="14" cy="7" r="1.5" fill={FC} opacity="0.5" stroke="none" /><circle cx="17" cy="11" r="1.5" fill={FC} opacity="0.4" stroke="none" /><circle cx="7" cy="13" r="1.5" fill={FC} opacity="0.45" stroke="none" /></g>,
    // 14: ship
    () => <g><path d="M3 18l2-4h14l2 4" fill={FC} opacity="0.25" /><path d="M3 18l2-4h14l2 4" /><line x1="12" y1="14" x2="12" y2="5" /><path d="M12 5l6 4H12z" fill={FC} opacity="0.32" /><path d="M12 5l6 4H12" /><path d="M2 21c2 -1 4 -1 5 0c1 1 3 1 5 0c2 -1 4 -1 5 0c1 1 3 1 5 0" /></g>,
    // 15: telescope
    () => <g><path d="M21 4l-9 9" /><circle cx="12" cy="13" r="2" /><line x1="12" y1="15" x2="8" y2="22" /><line x1="12" y1="15" x2="16" y2="22" /><path d="M18 2l4 4-2 2-4-4z" fill={FC} opacity="0.32" /></g>,
    // 16: lightning bolt
    () => <g><polygon points="13,2 3,14 12,14 11,22 21,10 12,10" fill={FC} opacity="0.26" /><polygon points="13,2 3,14 12,14 11,22 21,10 12,10" /></g>,
    // 17: factory
    () => <g><path d="M2 12h20v9H2z" fill={FC} opacity="0.26" /><path d="M2 21h20V12H2z" /><path d="M6 12V4l5 4V4l5 4V4l4 3v5" /><path d="M6 16h3v3H6z" /><path d="M12 16h3v3h-3z" /></g>,
    // 18: bomb
    () => <g><circle cx="11" cy="14" r="7" fill={FC} opacity="0.26" /><circle cx="11" cy="14" r="7" /><path d="M14 7l2-2" /><path d="M15 4l2 1" /><path d="M17 3l1 2" /><line x1="14" y1="7" x2="11" y2="10" /></g>,
    // 19: radioactive
    () => <g><circle cx="12" cy="12" r="2" fill={FC} opacity="0.4" /><path d="M12 2a10 10 0 0 1 8.66 5l-5 2.87A4 4 0 0 0 12 8z" fill={FC} opacity="0.28" stroke="none" /><path d="M12 2a10 10 0 0 1 8.66 5l-5 2.87A4 4 0 0 0 12 8z" /><path d="M20.66 7A10 10 0 0 1 12 22l0-5.74A4 4 0 0 0 15.64 14z" fill={FC} opacity="0.28" stroke="none" /><path d="M20.66 7A10 10 0 0 1 12 22l0-5.74A4 4 0 0 0 15.64 14z" /><path d="M12 22a10 10 0 0 1-8.66-15l5 2.87A4 4 0 0 0 8.36 14z" fill={FC} opacity="0.28" stroke="none" /><path d="M12 22a10 10 0 0 1-8.66-15l5 2.87A4 4 0 0 0 8.36 14z" /></g>,
    // 20: connected globe (modern world)
    () => <g><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="4" fill={FC} opacity="0.26" /><circle cx="12" cy="6" r="1.5" fill={FC} opacity="0.32" /><circle cx="6.5" cy="15" r="1.5" fill={FC} opacity="0.32" /><circle cx="17.5" cy="15" r="1.5" fill={FC} opacity="0.32" /><line x1="12" y1="8" x2="12" y2="7.5" /><line x1="10.5" y1="14" x2="8" y2="15" /><line x1="13.5" y1="14" x2="16" y2="15" /></g>,
];

const FALLBACK = () => <g><path d="M4 4h16v16H4z" /><line x1="8" y1="10" x2="16" y2="10" /><line x1="8" y1="14" x2="14" y2="14" /></g>;

export default function LessonIcon({ index, size = 20, color = 'var(--color-ink)' }) {
    const Icon = ICONS[index] || FALLBACK;
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
            stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
            style={{ color }}>
            <Icon />
        </svg>
    );
}
