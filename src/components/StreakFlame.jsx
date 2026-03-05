const LOGS = (
    <>
        {/* Log 1 - leaning right */}
        <path d="M6,21.5 L13,17.5" fill="none" stroke="#8B5E3C" strokeWidth="3" strokeLinecap="round"/>
        <path d="M7,21 L12.5,18" fill="none" stroke="#6D4534" strokeWidth="0.6" strokeLinecap="round"/>
        {/* Log 2 - leaning left */}
        <path d="M18,21.5 L11,17.5" fill="none" stroke="#8B5E3C" strokeWidth="3" strokeLinecap="round"/>
        <path d="M17,21 L11.5,18" fill="none" stroke="#6D4534" strokeWidth="0.6" strokeLinecap="round"/>
    </>
);

const FLAMES = {
    active: (
        <>
            {/* Outer flame - warm orange */}
            <path d="M12,0.5 C12,0.5 5,7.5 5,11.5 C5,14.7 8,17 12,17 C16,17 19,14.7 19,11.5 C19,7.5 12,0.5 12,0.5 Z" fill="#FF8C00"/>
            {/* Middle flame - golden */}
            <path d="M12,4 C12,4 7.5,9 7.5,11.5 C7.5,13.6 9.5,15.1 12,15.1 C14.5,15.1 16.5,13.6 16.5,11.5 C16.5,9 12,4 12,4 Z" fill="#FFA726"/>
            {/* Inner flame - yellow */}
            <path d="M12,6.5 C12,6.5 9.5,10 9.5,12 C9.5,13.3 10.5,14 12,14 C13.5,14 14.5,13.3 14.5,12 C14.5,10 12,6.5 12,6.5 Z" fill="#FFD54F"/>
            {/* Core - bright */}
            <path d="M12,9 C12,9 11,11 11,12 C11,12.7 11.4,13.1 12,13.1 C12.6,13.1 13,12.7 13,12 C13,11 12,9 12,9 Z" fill="#FFF8E1"/>
        </>
    ),
    'at-risk': (
        <>
            {/* Outer flame - deep red, BIG */}
            <path d="M12,0 C12,0 2.5,7 2.5,12 C2.5,15.5 6.5,17.5 12,17.5 C17.5,17.5 21.5,15.5 21.5,12 C21.5,7 12,0 12,0 Z" fill="#DC2626"/>
            {/* Middle flame - crimson */}
            <path d="M12,2.5 C12,2.5 5.5,8 5.5,11.5 C5.5,14.5 8,16.5 12,16.5 C16,16.5 18.5,14.5 18.5,11.5 C18.5,8 12,2.5 12,2.5 Z" fill="#EF4444"/>
            {/* Inner flame - orange-red */}
            <path d="M12,5.5 C12,5.5 8,9.5 8,12 C8,14 9.5,15.5 12,15.5 C14.5,15.5 16,14 16,12 C16,9.5 12,5.5 12,5.5 Z" fill="#F97316"/>
            {/* Core - warm yellow */}
            <path d="M12,8.5 C12,8.5 10,11 10,12.5 C10,13.5 10.8,14.2 12,14.2 C13.2,14.2 14,13.5 14,12.5 C14,11 12,8.5 12,8.5 Z" fill="#FBBF24"/>
        </>
    ),
    inactive: (
        <>
            {/* Outer flame - grey, full size */}
            <path d="M12,0.5 C12,0.5 5,7.5 5,11.5 C5,14.7 8,17 12,17 C16,17 19,14.7 19,11.5 C19,7.5 12,0.5 12,0.5 Z" fill="#9CA3AF" opacity="0.5"/>
            {/* Middle flame - lighter grey */}
            <path d="M12,4 C12,4 7.5,9 7.5,11.5 C7.5,13.6 9.5,15.1 12,15.1 C14.5,15.1 16.5,13.6 16.5,11.5 C16.5,9 12,4 12,4 Z" fill="#B0B8C4" opacity="0.45"/>
            {/* Inner flame - pale grey */}
            <path d="M12,6.5 C12,6.5 9.5,10 9.5,12 C9.5,13.3 10.5,14 12,14 C13.5,14 14.5,13.3 14.5,12 C14.5,10 12,6.5 12,6.5 Z" fill="#D1D5DB" opacity="0.4"/>
            {/* Core - light grey */}
            <path d="M12,9 C12,9 11,11 11,12 C11,12.7 11.4,13.1 12,13.1 C12.6,13.1 13,12.7 13,12 C13,11 12,9 12,9 Z" fill="#E5E7EB" opacity="0.35"/>
        </>
    ),
};

export const FLAME_COUNT_COLORS = {
    active: '#E05500',
    'at-risk': '#DC2626',
    inactive: '#A8A29E',
};

export default function StreakFlame({ status = 'inactive', size = 18 }) {
    const className = status !== 'inactive' ? `streak-flame--${status}` : undefined;
    return (
        <svg width={size} height={size} viewBox="-2 -2 28 28" fill="none" className={className}>
            {LOGS}
            {FLAMES[status]}
            {status === 'at-risk' && (
                <>
                    {/* Clock badge — upper-right, white clock, no background circle */}
                    <circle cx="20" cy="4" r="3.2" fill="none" stroke="white" strokeWidth="1.2"/>
                    {/* Hour hand (pointing to 12) */}
                    <line x1="20" y1="4" x2="20" y2="2" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
                    {/* Minute hand (pointing to 3) */}
                    <line x1="20" y1="4" x2="21.8" y2="4" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
                </>
            )}
        </svg>
    );
}
