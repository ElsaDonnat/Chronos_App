// Animated axolotl mascot — cute, simple, drawing-like style
// Supports 'default' (pink) and 'quizmaster' (blue-purple with top hat) variants
import { useEffect, useState } from 'react';

const VARIANTS = {
    default: {
        body: '#F0D4D8', belly: '#FAE8EA', arms: '#E8C0C6',
        gillColors: ['#E8A0B4', '#D48098', '#F0B0C4'],
        blush: '#FFB5A0', fingers: '#DBBCC2',
        showHourglass: true, showHat: false,
    },
    quizmaster: {
        body: '#C8D4F0', belly: '#D8E4FA', arms: '#B0C0D8',
        gillColors: ['#A0B4E8', '#8098D4', '#B0C4F0'],
        blush: '#A0B0FF', fingers: '#9AACC8',
        showHourglass: false, showHat: true,
    },
};

export default function Mascot({ mood = 'happy', size = 80, className = '', variant = 'default' }) {
    const [blink, setBlink] = useState(false);
    const [shakeHourglass, setShakeHourglass] = useState(false);
    const v = VARIANTS[variant] || VARIANTS.default;

    // Auto-blink every 3-5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setBlink(true);
            setTimeout(() => setBlink(false), 150);
        }, 3000 + Math.random() * 2000);
        return () => clearInterval(interval);
    }, []);

    // Hourglass shake every 5-8s (only for default variant)
    useEffect(() => {
        if (!v.showHourglass) return;
        const interval = setInterval(() => {
            setShakeHourglass(true);
            setTimeout(() => setShakeHourglass(false), 500);
        }, 7000 + Math.random() * 3000);
        return () => clearInterval(interval);
    }, [v.showHourglass]);

    const animClass =
        mood === 'celebrating' ? 'mascot-bounce' :
            mood === 'sad' ? 'mascot-sad' :
                mood === 'thinking' ? 'mascot-wiggle' :
                    'mascot-float';

    const isCelebrating = mood === 'celebrating';
    const isThinking = mood === 'thinking';
    const isHappy = mood === 'happy' || mood === 'celebrating';
    const isQuizmaster = variant === 'quizmaster';

    // Mouth — quizmaster gets an asymmetric smirk, default gets symmetric smiles
    const mouthPaths = isQuizmaster ? {
        happy: 'M -2.5 3.5 Q -0.5 4.5 2 3 Q 2.5 2.8 3 3.2',       // confident smirk
        thinking: 'M -2 3.8 Q 0 4.2 2.5 3.5',                       // subtle knowing curve
        celebrating: 'M -2.5 3 Q 0 5.2 2.5 2.8 Q 3 2.6 3.2 3',     // big smirk
        sad: 'M -2 4.2 Q 0 3.6 2 4',                                 // composed frown
        surprised: 'M -1.5 3.2 Q 0 4.5 1.5 3.2',
    } : {
        happy: 'M -2 3.2 Q 0 4.8 2 3.2',
        thinking: 'M -1.5 3.8 L 1.5 3.8',
        celebrating: 'M -2.5 2.8 Q 0 5.5 2.5 2.8',
        sad: 'M -2 4.8 Q 0 3.5 2 4.8',
        surprised: 'M -1 3.5 Q 0 4.8 1 3.5',
    };
    // Neutral default — small soft line
    const defaultMouth = isQuizmaster
        ? 'M -2 3.8 Q 0 4.2 2.5 3.5'
        : 'M -1.5 3.8 Q 0 4.2 1.5 3.8';

    return (
        <div className={`inline-flex items-center justify-center ${className} ${animClass}`}>
            <svg width={size} height={size} viewBox="-22 -22 44 46" fill="none">

                {/* === LEFT GILLS — 3 short cute stalks === */}
                <g style={{ transformOrigin: '-7px -7px', animation: 'gillWave 2.5s ease-in-out infinite' }}>
                    <line x1="-8" y1="-9" x2="-14" y2="-15" stroke={v.gillColors[0]} strokeWidth="2.2" strokeLinecap="round" />
                    <circle cx="-14" cy="-15" r="1.5" fill={v.gillColors[0]} />
                    <line x1="-9" y1="-6" x2="-16" y2="-9" stroke={v.gillColors[1]} strokeWidth="2" strokeLinecap="round" />
                    <circle cx="-16" cy="-9" r="1.4" fill={v.gillColors[1]} />
                    <line x1="-9" y1="-3" x2="-15" y2="-4" stroke={v.gillColors[2]} strokeWidth="1.8" strokeLinecap="round" />
                    <circle cx="-15" cy="-4" r="1.3" fill={v.gillColors[2]} />
                </g>

                {/* === RIGHT GILLS — 3 short cute stalks === */}
                <g style={{ transformOrigin: '7px -7px', animation: 'gillWaveRight 2.5s ease-in-out infinite' }}>
                    <line x1="8" y1="-9" x2="14" y2="-15" stroke={v.gillColors[0]} strokeWidth="2.2" strokeLinecap="round" />
                    <circle cx="14" cy="-15" r="1.5" fill={v.gillColors[0]} />
                    <line x1="9" y1="-6" x2="16" y2="-9" stroke={v.gillColors[1]} strokeWidth="2" strokeLinecap="round" />
                    <circle cx="16" cy="-9" r="1.4" fill={v.gillColors[1]} />
                    <line x1="9" y1="-3" x2="15" y2="-4" stroke={v.gillColors[2]} strokeWidth="1.8" strokeLinecap="round" />
                    <circle cx="15" cy="-4" r="1.3" fill={v.gillColors[2]} />
                </g>

                {/* Top hat for quizmaster variant */}
                {v.showHat && (
                    <g transform="translate(0, -16)">
                        <rect x="-3.5" y="-5" width="7" height="5" rx="1" fill="#2C2420" />
                        <rect x="-5" y="0" width="10" height="1.5" rx="0.7" fill="#2C2420" />
                        <rect x="-4" y="-5.5" width="8" height="0.8" rx="0.4" fill="#8B4157" opacity="0.6" />
                    </g>
                )}

                {/* Body */}
                <ellipse cx="0" cy="2" rx="11" ry="13" fill={v.body} />

                {/* Belly — lighter oval */}
                <ellipse cx="0" cy="5" rx="7" ry="7" fill={v.belly} opacity="0.75" />

                {/* Left arm */}
                <ellipse cx="-10.5" cy="8" rx="3" ry="1.6" fill={v.arms} transform="rotate(-12 -10.5 8)">
                    {isCelebrating && (
                        <animateTransform attributeName="transform" type="rotate" values="-12 -10.5 8;-28 -10.5 6;-12 -10.5 8" dur="0.6s" repeatCount="indefinite" additive="replace" />
                    )}
                </ellipse>

                {/* Right arm + hourglass grip (default) OR simple arm (quizmaster) */}
                {v.showHourglass ? (
                    <g>
                        {/* Arm — extended to hold hourglass away from body */}
                        <ellipse cx="12" cy="7" rx="4.5" ry="1.4" fill={v.arms} transform="rotate(10 12 7)">
                            {isCelebrating && (
                                <animateTransform attributeName="transform" type="rotate" values="10 12 7;25 12 5;10 12 7" dur="0.6s" repeatCount="indefinite" additive="replace" />
                            )}
                        </ellipse>

                        {/* Hourglass — held out to the side, away from face */}
                        <g transform="translate(16, 7)">
                            {/* Logo-style hourglass, scaled to fit (0.55× of 24×24 logo, centered at origin) */}
                            <g transform="scale(0.55) translate(-12, -12)">
                            {shakeHourglass && (
                                <animateTransform attributeName="transform" type="rotate" values="0 12 12;8 12 12;-8 12 12;5 12 12;-5 12 12;0 12 12" dur="0.4s" repeatCount="1" additive="sum" />
                            )}
                                {/* Hourglass silhouette — filled body */}
                                <path d="M7 4 L17 4 C17.5 4 17.8 4.2 17.8 4.4 L17.8 4.4 C17.8 4.6 17.5 4.8 17 4.8 L16 4.8 C16 8 14.4 10.4 12 12 C14.4 13.6 16 16 16 19.2 L17 19.2 C17.5 19.2 17.8 19.4 17.8 19.6 L17.8 19.6 C17.8 19.8 17.5 20 17 20 L7 20 C6.5 20 6.2 19.8 6.2 19.6 L6.2 19.6 C6.2 19.4 6.5 19.2 7 19.2 L8 19.2 C8 16 9.6 13.6 12 12 C9.6 10.4 8 8 8 4.8 L7 4.8 C6.5 4.8 6.2 4.6 6.2 4.4 L6.2 4.4 C6.2 4.2 6.5 4 7 4 Z" fill="#8B4157" />
                                {/* Glass interior top */}
                                <path d="M9.4 5.8 C9.4 8.4 10.5 10.6 12 12 C13.5 10.6 14.6 8.4 14.6 5.8 Z" fill="#FAF6F0" />
                                {/* Glass interior bottom */}
                                <path d="M9.4 18.2 C9.4 15.6 10.5 13.4 12 12 C13.5 13.4 14.6 15.6 14.6 18.2 Z" fill="#FAF6F0" />
                                {/* Sand pile at bottom */}
                                <path d="M9.7 18.2 Q12 15.3 14.3 18.2 Z" fill="#C8A882" />
                            </g>
                        </g>

                        {/* Fingers wrapping around hourglass */}
                        <path d="M 15 7 Q 15.5 5 16 4" stroke={v.arms} strokeWidth="1.1" fill="none" strokeLinecap="round" />
                        <path d="M 15.5 7.8 Q 16 6 16.5 5" stroke={v.fingers} strokeWidth="0.9" fill="none" strokeLinecap="round" />
                        {/* Thumb on other side */}
                        <path d="M 15.5 8.5 Q 17 8 17.5 7" stroke={v.fingers} strokeWidth="0.8" fill="none" strokeLinecap="round" />
                    </g>
                ) : (
                    <ellipse cx="10.5" cy="8" rx="3" ry="1.6" fill={v.arms} transform="rotate(12 10.5 8)">
                        {isCelebrating && (
                            <animateTransform attributeName="transform" type="rotate" values="12 10.5 8;28 10.5 6;12 10.5 8" dur="0.6s" repeatCount="indefinite" additive="replace" />
                        )}
                    </ellipse>
                )}

                {/* Feet — simple ovals */}
                <ellipse cx="-4.5" cy="14.5" rx="2.8" ry="1.2" fill={v.arms} transform="rotate(-8 -4.5 14.5)" />
                <ellipse cx="4.5" cy="14.5" rx="2.8" ry="1.2" fill={v.arms} transform="rotate(8 4.5 14.5)" />

                {/* Tail — short pointy wag */}
                <path d="M 0 14 Q 4 15.5 5 14" stroke={v.arms} strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.7">
                    <animate attributeName="d" values="M 0 14 Q 4 15.5 5 14;M 0 14 Q 6 15 7 13.5;M 0 14 Q 4 15.5 5 14" dur="2s" repeatCount="indefinite" />
                </path>

                {/* Eyes */}
                <g>
                    {isQuizmaster ? (
                        /* ── Quizmaster: half-lidded confident eyes ── */
                        <>
                            {/* White base */}
                            <circle cx="-5" cy="-1" r="3.8" fill="white" />
                            <circle cx="5" cy="-1" r="3.8" fill="white" />

                            {/* Pupils — slightly smaller, positioned lower for half-lid look */}
                            <ellipse cx="-5" cy={isHappy ? 0 : -1} rx="2.5" ry={blink ? 0.4 : 2.5} fill="#1C1917" style={{ transition: 'ry 0.08s ease, cy 0.2s ease' }}>
                                {isThinking && (
                                    <animate attributeName="cx" values="-5;-4;-5;-6;-5" dur="3s" repeatCount="indefinite" />
                                )}
                            </ellipse>
                            <ellipse cx="5" cy={isHappy ? 0 : -1} rx="2.5" ry={blink ? 0.4 : 2.5} fill="#1C1917" style={{ transition: 'ry 0.08s ease, cy 0.2s ease' }}>
                                {isThinking && (
                                    <animate attributeName="cx" values="5;6;5;4;5" dur="3s" repeatCount="indefinite" />
                                )}
                            </ellipse>

                            {/* Shine dots */}
                            {!blink && (
                                <>
                                    <circle cx="-3.8" cy="-2" r="1.1" fill="white" opacity="0.95" />
                                    <circle cx="6.2" cy="-2" r="1.1" fill="white" opacity="0.95" />
                                </>
                            )}

                            {/* Half-lid overlays — body-colored arcs drooping over top of eyes */}
                            <ellipse cx="-5" cy="-4" rx="4.5" ry={isHappy ? 3.2 : mood === 'sad' ? 2.5 : 2.8} fill={v.body} />
                            <ellipse cx="5" cy="-4" rx="4.5" ry={isHappy ? 3.2 : mood === 'sad' ? 2.5 : 2.8} fill={v.body} />

                            {/* Monocle on right eye */}
                            <circle cx="5" cy="-1" r="5" fill="none" stroke="#8B7355" strokeWidth="0.5" opacity="0.7" />
                            {/* Monocle chain — short curve down to body */}
                            <path d="M 10 -1 Q 11.5 3 10 7" stroke="#8B7355" strokeWidth="0.4" fill="none" opacity="0.5" strokeLinecap="round" />

                            {/* Confident arched eyebrows — always visible */}
                            <path d={
                                mood === 'sad'
                                    ? 'M -7.5 -7.5 Q -5 -9.5 -2 -8'     /* concerned */
                                    : mood === 'celebrating'
                                        ? 'M -8 -8 Q -5 -11 -2 -8.5'     /* raised excited */
                                        : 'M -7.5 -8 Q -5 -10 -2 -7.5'   /* confident arch */
                            } stroke="#6B7BA0" strokeWidth="0.9" fill="none" strokeLinecap="round" />
                            <path d={
                                mood === 'sad'
                                    ? 'M 2 -8 Q 5 -9.5 7.5 -7.5'
                                    : mood === 'celebrating'
                                        ? 'M 2 -8.5 Q 5 -11 8 -8'
                                        : 'M 2 -7.5 Q 5 -10 7.5 -8'
                            } stroke="#6B7BA0" strokeWidth="0.9" fill="none" strokeLinecap="round" />
                        </>
                    ) : (
                        /* ── Default: cute round eyes ── */
                        <>
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
                        </>
                    )}
                </g>

                {/* Blush — two simple circles */}
                <circle cx="-8" cy="1" r="2.2" fill={v.blush} opacity="0.3">
                    {isCelebrating && (
                        <animate attributeName="opacity" values="0.3;0.5;0.3" dur="1s" repeatCount="indefinite" />
                    )}
                </circle>
                <circle cx="8" cy="1" r="2.2" fill={v.blush} opacity="0.3">
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
                        <text x="-15" y="4" fontSize="4" fill={v.gillColors[0]} opacity="0">
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
