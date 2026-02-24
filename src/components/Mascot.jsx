// Animated axolotl mascot — cute, simple, drawing-like style
import { useEffect, useState } from 'react';

export default function Mascot({ mood = 'happy', size = 80, className = '' }) {
    const [blink, setBlink] = useState(false);
    const [shakeHourglass, setShakeHourglass] = useState(false);

    // Auto-blink every 3-5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setBlink(true);
            setTimeout(() => setBlink(false), 150);
        }, 3000 + Math.random() * 2000);
        return () => clearInterval(interval);
    }, []);

    // Hourglass shake every 5-8s
    useEffect(() => {
        const interval = setInterval(() => {
            setShakeHourglass(true);
            setTimeout(() => setShakeHourglass(false), 500);
        }, 6000 + Math.random() * 6000);
        return () => clearInterval(interval);
    }, []);

    const animClass =
        mood === 'celebrating' ? 'mascot-bounce' :
            mood === 'sad' ? 'mascot-sad' :
                mood === 'thinking' ? 'mascot-wiggle' :
                    'mascot-float';

    const isCelebrating = mood === 'celebrating';
    const isThinking = mood === 'thinking';
    const isHappy = mood === 'happy' || mood === 'celebrating';

    // Mouth — neutral by default, smile only when happy/celebrating
    const mouthPaths = {
        happy: 'M -2 3.2 Q 0 4.8 2 3.2',
        thinking: 'M -1.5 3.8 L 1.5 3.8',
        celebrating: 'M -2.5 2.8 Q 0 5.5 2.5 2.8',
        sad: 'M -2 4.8 Q 0 3.5 2 4.8',
        surprised: 'M -1 3.5 Q 0 4.8 1 3.5',
    };
    // Neutral default — small soft line
    const defaultMouth = 'M -1.5 3.8 Q 0 4.2 1.5 3.8';

    return (
        <div className={`inline-flex items-center justify-center ${className} ${animClass}`}>
            <svg width={size} height={size} viewBox="-22 -22 44 46" fill="none">

                {/* === LEFT GILLS — 3 short cute stalks === */}
                <g style={{ transformOrigin: '-7px -7px', animation: 'gillWave 2.5s ease-in-out infinite' }}>
                    <line x1="-8" y1="-9" x2="-14" y2="-15" stroke="#E8A0B4" strokeWidth="2.2" strokeLinecap="round" />
                    <circle cx="-14" cy="-15" r="1.5" fill="#E8A0B4" />
                    <line x1="-9" y1="-6" x2="-16" y2="-9" stroke="#D48098" strokeWidth="2" strokeLinecap="round" />
                    <circle cx="-16" cy="-9" r="1.4" fill="#D48098" />
                    <line x1="-9" y1="-3" x2="-15" y2="-4" stroke="#F0B0C4" strokeWidth="1.8" strokeLinecap="round" />
                    <circle cx="-15" cy="-4" r="1.3" fill="#F0B0C4" />
                </g>

                {/* === RIGHT GILLS — 3 short cute stalks === */}
                <g style={{ transformOrigin: '7px -7px', animation: 'gillWaveRight 2.5s ease-in-out infinite' }}>
                    <line x1="8" y1="-9" x2="14" y2="-15" stroke="#E8A0B4" strokeWidth="2.2" strokeLinecap="round" />
                    <circle cx="14" cy="-15" r="1.5" fill="#E8A0B4" />
                    <line x1="9" y1="-6" x2="16" y2="-9" stroke="#D48098" strokeWidth="2" strokeLinecap="round" />
                    <circle cx="16" cy="-9" r="1.4" fill="#D48098" />
                    <line x1="9" y1="-3" x2="15" y2="-4" stroke="#F0B0C4" strokeWidth="1.8" strokeLinecap="round" />
                    <circle cx="15" cy="-4" r="1.3" fill="#F0B0C4" />
                </g>

                {/* Body — pale burgundy */}
                <ellipse cx="0" cy="2" rx="11" ry="13" fill="#F0D4D8" />

                {/* Belly — lighter oval */}
                <ellipse cx="0" cy="5" rx="7" ry="7" fill="#FAE8EA" opacity="0.75" />

                {/* Left arm */}
                <ellipse cx="-10.5" cy="8" rx="3" ry="1.6" fill="#E8C0C6" transform="rotate(-12 -10.5 8)">
                    {isCelebrating && (
                        <animateTransform attributeName="transform" type="rotate" values="-12 -10.5 8;-28 -10.5 6;-12 -10.5 8" dur="0.6s" repeatCount="indefinite" additive="replace" />
                    )}
                </ellipse>

                {/* Right arm + hourglass grip */}
                <g>
                    {/* Arm */}
                    <ellipse cx="10.5" cy="6.5" rx="3" ry="1.6" fill="#E8C0C6" transform="rotate(22 10.5 6.5)">
                        {isCelebrating && (
                            <animateTransform attributeName="transform" type="rotate" values="22 10.5 6.5;36 10.5 4.5;22 10.5 6.5" dur="0.6s" repeatCount="indefinite" additive="replace" />
                        )}
                    </ellipse>

                    {/* Hourglass — at hand, subtle shake */}
                    <g transform="translate(13, 4.5)" style={shakeHourglass ? { transformOrigin: '0px 0px', animation: 'hourglassShake 0.25s ease-in-out 2' } : {}}>
                        {/* Top cap */}
                        <line x1="-2.2" y1="-3.5" x2="2.2" y2="-3.5" stroke="#8B4157" strokeWidth="0.8" strokeLinecap="round" />
                        {/* Bottom cap */}
                        <line x1="-2.2" y1="3.5" x2="2.2" y2="3.5" stroke="#8B4157" strokeWidth="0.8" strokeLinecap="round" />
                        {/* Glass left */}
                        <path d="M -1.6 -3.5 Q -1.6 -0.5 0 0 Q -1.6 0.5 -1.6 3.5" stroke="#8B4157" strokeWidth="0.55" fill="none" strokeLinecap="round" />
                        {/* Glass right */}
                        <path d="M 1.6 -3.5 Q 1.6 -0.5 0 0 Q 1.6 0.5 1.6 3.5" stroke="#8B4157" strokeWidth="0.55" fill="none" strokeLinecap="round" />
                        {/* Sand */}
                        <circle cx="0" cy="2.2" r="0.5" fill="#A8596E" opacity="0.4" />
                    </g>

                    {/* Fingers wrapping around hourglass */}
                    <path d="M 11 5.5 Q 12 3.5 13 2" stroke="#E8C0C6" strokeWidth="1.1" fill="none" strokeLinecap="round" />
                    <path d="M 11.3 6.8 Q 12.5 5 13.3 3.5" stroke="#DBBCC2" strokeWidth="0.9" fill="none" strokeLinecap="round" />
                    {/* Thumb on other side */}
                    <path d="M 11.5 7.5 Q 13.5 5.5 14 5" stroke="#DBBCC2" strokeWidth="0.8" fill="none" strokeLinecap="round" />
                </g>

                {/* Feet — simple ovals */}
                <ellipse cx="-4.5" cy="14.5" rx="2.8" ry="1.2" fill="#E8C0C6" transform="rotate(-8 -4.5 14.5)" />
                <ellipse cx="4.5" cy="14.5" rx="2.8" ry="1.2" fill="#E8C0C6" transform="rotate(8 4.5 14.5)" />

                {/* Tail — short pointy wag */}
                <path d="M 0 14 Q 4 15.5 5 14" stroke="#E8C0C6" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.7">
                    <animate attributeName="d" values="M 0 14 Q 4 15.5 5 14;M 0 14 Q 6 15 7 13.5;M 0 14 Q 4 15.5 5 14" dur="2s" repeatCount="indefinite" />
                </path>

                {/* Eyes */}
                <g>
                    {/* Smiling eyes for happy/celebrating — cute arcs */}
                    {isHappy && !blink ? (
                        <>
                            <path d="M -7.5 -1.5 Q -5 -4 -2.5 -1.5" stroke="#1C1917" strokeWidth="0.9" fill="none" strokeLinecap="round" />
                            <path d="M 2.5 -1.5 Q 5 -4 7.5 -1.5" stroke="#1C1917" strokeWidth="0.9" fill="none" strokeLinecap="round" />
                        </>
                    ) : (
                        <>
                            {/* White base */}
                            <circle cx="-5" cy="-1" r="3.8" fill="white" />
                            <circle cx="5" cy="-1" r="3.8" fill="white" />

                            {/* Pupils */}
                            <ellipse cx="-5" cy="-1" rx="2.8" ry={blink ? 0.4 : 2.8} fill="#1C1917" style={{ transition: 'ry 0.08s ease' }}>
                                {isThinking && (
                                    <animate attributeName="cx" values="-5;-4;-5;-6;-5" dur="3s" repeatCount="indefinite" />
                                )}
                            </ellipse>
                            <ellipse cx="5" cy="-1" rx="2.8" ry={blink ? 0.4 : 2.8} fill="#1C1917" style={{ transition: 'ry 0.08s ease' }}>
                                {isThinking && (
                                    <animate attributeName="cx" values="5;6;5;4;5" dur="3s" repeatCount="indefinite" />
                                )}
                            </ellipse>

                            {/* Shine dots */}
                            {!blink && (
                                <>
                                    <circle cx="-3.8" cy="-2.5" r="1.3" fill="white" opacity="0.95" />
                                    <circle cx="-5.8" cy="0" r="0.5" fill="white" opacity="0.6" />
                                    <circle cx="6.2" cy="-2.5" r="1.3" fill="white" opacity="0.95" />
                                    <circle cx="4.2" cy="0" r="0.5" fill="white" opacity="0.6" />
                                </>
                            )}
                        </>
                    )}

                    {/* Eyebrows for thinking/sad */}
                    {mood === 'thinking' && (
                        <>
                            <line x1="-7.5" y1="-8.5" x2="-2.5" y2="-8" stroke="#C4A090" strokeWidth="0.8" strokeLinecap="round" />
                            <line x1="2.5" y1="-8" x2="7.5" y2="-8.5" stroke="#C4A090" strokeWidth="0.8" strokeLinecap="round" />
                        </>
                    )}
                    {mood === 'sad' && (
                        <>
                            <line x1="-7.5" y1="-7.5" x2="-2.5" y2="-9" stroke="#C4A090" strokeWidth="0.8" strokeLinecap="round" />
                            <line x1="2.5" y1="-9" x2="7.5" y2="-7.5" stroke="#C4A090" strokeWidth="0.8" strokeLinecap="round" />
                        </>
                    )}
                </g>

                {/* Blush — two simple pink circles */}
                <circle cx="-8" cy="1" r="2.2" fill="#FFB5A0" opacity="0.3">
                    {isCelebrating && (
                        <animate attributeName="opacity" values="0.3;0.5;0.3" dur="1s" repeatCount="indefinite" />
                    )}
                </circle>
                <circle cx="8" cy="1" r="2.2" fill="#FFB5A0" opacity="0.3">
                    {isCelebrating && (
                        <animate attributeName="opacity" values="0.3;0.5;0.3" dur="1s" repeatCount="indefinite" />
                    )}
                </circle>

                {/* Tiny nostrils */}
                <circle cx="-1" cy="0.5" r="0.35" fill="#B88A90" opacity="0.3" />
                <circle cx="1" cy="0.5" r="0.35" fill="#B88A90" opacity="0.3" />

                {/* Mouth — soft simple curve */}
                <path d={mouthPaths[mood] || defaultMouth} stroke="#8B4157" strokeWidth="0.6" fill="none" strokeLinecap="round">
                    {isCelebrating && (
                        <animate attributeName="d" values="M -2.5 2.8 Q 0 5.5 2.5 2.8;M -2.5 3.2 Q 0 5 2.5 3.2;M -2.5 2.8 Q 0 5.5 2.5 2.8" dur="0.8s" repeatCount="indefinite" />
                    )}
                </path>

                {/* Sparkles when celebrating */}
                {isCelebrating && (
                    <g>
                        <g style={{ transformOrigin: '-14px -12px', animation: 'sparkleRotate 3s linear infinite' }}>
                            <text x="-16" y="-10" fontSize="5" fill="var(--color-burgundy)" opacity="0.7">✦</text>
                        </g>
                        <g style={{ transformOrigin: '14px -14px', animation: 'sparkleRotate 4s linear infinite reverse' }}>
                            <text x="12" y="-12" fontSize="4" fill="var(--color-warning)" opacity="0.6">✦</text>
                        </g>
                        <text x="-15" y="4" fontSize="4" fill="#E8A0B4" opacity="0">
                            <animate attributeName="opacity" values="0;0.8;0" dur="2s" repeatCount="indefinite" begin="0.3s" />
                            <animate attributeName="y" values="4;-4" dur="2s" repeatCount="indefinite" begin="0.3s" />
                        </text>
                    </g>
                )}

                {/* Question mark when thinking */}
                {isThinking && (
                    <text x="10" y="-12" fontSize="7" fill="var(--color-ink-muted)" fontWeight="bold" opacity="0">
                        <animate attributeName="opacity" values="0;0.5;0.5;0" dur="3s" repeatCount="indefinite" />
                        <animate attributeName="y" values="-10;-14" dur="3s" repeatCount="indefinite" />
                    </text>
                )}

                {/* Sweat drop when sad */}
                {mood === 'sad' && (
                    <ellipse cx="7" cy="-6" rx="1" ry="1.5" fill="#A8D4E6" opacity="0">
                        <animate attributeName="opacity" values="0;0.6;0" dur="3s" repeatCount="indefinite" />
                        <animate attributeName="cy" values="-6;-2" dur="3s" repeatCount="indefinite" />
                    </ellipse>
                )}
            </svg>
        </div>
    );
}
