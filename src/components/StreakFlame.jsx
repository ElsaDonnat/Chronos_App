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
            {/* Outer flame - muted steel blue, small */}
            <path d="M12,5 C12,5 8,9.5 8,12 C8,14 9.5,15.5 12,15.5 C14.5,15.5 16,14 16,12 C16,9.5 12,5 12,5 Z" fill="#5B8DB8" opacity="0.6"/>
            {/* Inner flame - lighter blue */}
            <path d="M12,7.5 C12,7.5 9.8,10.5 9.8,12 C9.8,13.2 10.7,14 12,14 C13.3,14 14.2,13.2 14.2,12 C14.2,10.5 12,7.5 12,7.5 Z" fill="#7BAFD4" opacity="0.5"/>
            {/* Core - pale blue wisp */}
            <path d="M12,10 C12,10 11.2,11.5 11.2,12.2 C11.2,12.8 11.5,13.2 12,13.2 C12.5,13.2 12.8,12.8 12.8,12.2 C12.8,11.5 12,10 12,10 Z" fill="#B8D8EA" opacity="0.4"/>
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
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
            {LOGS}
            {FLAMES[status]}
            {status === 'active' && (
                <>
                    {/* Green tick badge — bottom-right */}
                    <circle cx="19" cy="20" r="4.5" fill="#16A34A"/>
                    <circle cx="19" cy="20" r="3.5" fill="#22C55E"/>
                    <path d="M16.8,20 L18.2,21.3 L21.2,18.5" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </>
            )}
        </svg>
    );
}
