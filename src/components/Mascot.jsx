// Cute round axolotl mascot with different expressions
export default function Mascot({ mood = 'happy', size = 80, className = '' }) {
    const s = size;

    const expressions = {
        happy: { eyeY: 0, mouthD: 'M -4 3 Q 0 7 4 3', blush: true },
        thinking: { eyeY: -1, mouthD: 'M -3 4 Q 0 4 3 4', blush: false },
        celebrating: { eyeY: -2, mouthD: 'M -5 2 Q 0 9 5 2', blush: true },
        sad: { eyeY: 1, mouthD: 'M -4 5 Q 0 2 4 5', blush: false },
        surprised: { eyeY: -1, mouthD: 'M -3 3 Q 0 6 3 3', blush: true },
    };

    const expr = expressions[mood] || expressions.happy;
    const isCelebrating = mood === 'celebrating';

    return (
        <div className={`inline-flex items-center justify-center ${className}`}
            style={{ animation: isCelebrating ? 'celebrationPulse 0.8s ease-in-out infinite' : undefined }}
        >
            <svg width={s} height={s} viewBox="-20 -22 40 44" fill="none">
                {/* Crown/gills on top */}
                <g>
                    {/* Left gill/frill */}
                    <ellipse cx="-11" cy="-14" rx="5" ry="3" fill="#E8A0B4" opacity="0.7" transform="rotate(-30 -11 -14)" />
                    <ellipse cx="-14" cy="-10" rx="4.5" ry="2.5" fill="#F0B0C4" opacity="0.6" transform="rotate(-50 -14 -10)" />
                    <ellipse cx="-8" cy="-16" rx="4" ry="2" fill="#F5C0D0" opacity="0.5" transform="rotate(-10 -8 -16)" />

                    {/* Right gill/frill */}
                    <ellipse cx="11" cy="-14" rx="5" ry="3" fill="#E8A0B4" opacity="0.7" transform="rotate(30 11 -14)" />
                    <ellipse cx="14" cy="-10" rx="4.5" ry="2.5" fill="#F0B0C4" opacity="0.6" transform="rotate(50 14 -10)" />
                    <ellipse cx="8" cy="-16" rx="4" ry="2" fill="#F5C0D0" opacity="0.5" transform="rotate(10 8 -16)" />

                    {/* Top frill */}
                    <ellipse cx="0" cy="-17" rx="3" ry="4" fill="#E8A0B4" opacity="0.6" />
                </g>

                {/* Body */}
                <ellipse cx="0" cy="2" rx="13" ry="14" fill="#FFE4CC" />
                <ellipse cx="0" cy="4" rx="10" ry="10" fill="#FFEEDD" opacity="0.5" />

                {/* Belly */}
                <ellipse cx="0" cy="7" rx="8" ry="7" fill="#FFF5EB" opacity="0.6" />

                {/* Eyes */}
                <g transform={`translate(0, ${expr.eyeY})`}>
                    <circle cx="-5" cy="-3" r="2.8" fill="#1C1917" />
                    <circle cx="5" cy="-3" r="2.8" fill="#1C1917" />
                    {/* Eye shine */}
                    <circle cx="-4" cy="-4" r="1" fill="white" />
                    <circle cx="6" cy="-4" r="1" fill="white" />
                    {mood === 'surprised' && (
                        <>
                            <circle cx="-5" cy="-3" r="3.2" fill="#1C1917" />
                            <circle cx="5" cy="-3" r="3.2" fill="#1C1917" />
                            <circle cx="-4" cy="-4" r="1.3" fill="white" />
                            <circle cx="6" cy="-4" r="1.3" fill="white" />
                        </>
                    )}
                </g>

                {/* Blush */}
                {expr.blush && (
                    <>
                        <circle cx="-9" cy="0" r="2.5" fill="#FFB5A0" opacity="0.35" />
                        <circle cx="9" cy="0" r="2.5" fill="#FFB5A0" opacity="0.35" />
                    </>
                )}

                {/* Mouth */}
                <path d={expr.mouthD} stroke="#B45309" strokeWidth="0.8" fill="none" strokeLinecap="round" />

                {/* Little arms */}
                <ellipse cx="-12" cy="8" rx="3" ry="2" fill="#FFE4CC" transform="rotate(-20 -12 8)" />
                <ellipse cx="12" cy="8" rx="3" ry="2" fill="#FFE4CC" transform="rotate(20 12 8)" />

                {/* Tail (subtle) */}
                <path d="M 0 16 Q 5 19 3 22" stroke="#FFD4B0" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.6" />

                {/* Sparkles when celebrating */}
                {isCelebrating && (
                    <g opacity="0.8">
                        <text x="-16" y="-12" fontSize="5" fill="var(--color-terracotta)">✦</text>
                        <text x="14" y="-14" fontSize="4" fill="var(--color-warning)">✦</text>
                        <text x="16" y="2" fontSize="3" fill="var(--color-terracotta)">✦</text>
                        <text x="-17" y="5" fontSize="4" fill="var(--color-warning)">✦</text>
                    </g>
                )}
            </svg>
        </div>
    );
}
