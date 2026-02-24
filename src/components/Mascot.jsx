// Animated axolotl mascot with CSS-driven animations and emotional reactions
import { useEffect, useState } from 'react';

export default function Mascot({ mood = 'happy', size = 80, className = '' }) {
    const [blink, setBlink] = useState(false);

    // Auto-blink every 3-5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setBlink(true);
            setTimeout(() => setBlink(false), 150);
        }, 3000 + Math.random() * 2000);
        return () => clearInterval(interval);
    }, []);

    const animClass =
        mood === 'celebrating' ? 'mascot-bounce' :
            mood === 'sad' ? 'mascot-sad' :
                mood === 'thinking' ? 'mascot-wiggle' :
                    'mascot-float';

    // Eye shape based on mood & blink
    const eyeRY = blink ? 0.6 : (mood === 'celebrating' ? 2.2 : mood === 'sad' ? 2.0 : 2.8);
    const eyeRX = 2.8;
    const eyeOffY = mood === 'celebrating' ? -2 : mood === 'sad' ? 1 : mood === 'surprised' ? -1 : 0;

    // Mouth path based on mood
    const mouthPaths = {
        happy: 'M -4 3 Q 0 7 4 3',
        thinking: 'M -3 4.5 L 3 3.5',
        celebrating: 'M -5 2 Q 0 9 5 2',
        sad: 'M -4 6 Q 0 3 4 6',
        surprised: 'M -2.5 3 Q 0 7 2.5 3',
    };

    const isCelebrating = mood === 'celebrating';
    const isThinking = mood === 'thinking';

    return (
        <div className={`inline-flex items-center justify-center ${className} ${animClass}`}>
            <svg width={size} height={size} viewBox="-22 -24 44 48" fill="none">
                <defs>
                    {/* Soft body gradient */}
                    <radialGradient id="bodyGrad" cx="50%" cy="40%">
                        <stop offset="0%" stopColor="#FFF0E6" />
                        <stop offset="60%" stopColor="#FFD6C4" />
                        <stop offset="100%" stopColor="#F5C4B0" />
                    </radialGradient>
                    <radialGradient id="bellyGrad" cx="50%" cy="30%">
                        <stop offset="0%" stopColor="#FFF8F2" />
                        <stop offset="100%" stopColor="#FFEDE0" />
                    </radialGradient>
                    {/* Gill gradient */}
                    <radialGradient id="gillGrad" cx="50%" cy="50%">
                        <stop offset="0%" stopColor="#E8A0B4" />
                        <stop offset="100%" stopColor="#D48098" />
                    </radialGradient>
                </defs>

                {/* Left gill cluster — animated wave */}
                <g style={{ transformOrigin: '-6px -12px', animation: 'gillWave 2.5s ease-in-out infinite' }}>
                    <ellipse cx="-12" cy="-15" rx="5.5" ry="3" fill="url(#gillGrad)" opacity="0.75" transform="rotate(-30 -12 -15)" />
                    <ellipse cx="-15" cy="-11" rx="5" ry="2.5" fill="#E8A0B4" opacity="0.6" transform="rotate(-50 -15 -11)" />
                    <ellipse cx="-9" cy="-17.5" rx="4.5" ry="2.2" fill="#F0B0C4" opacity="0.55" transform="rotate(-10 -9 -17.5)" />
                    {/* Tiny dots on gills */}
                    <circle cx="-11" cy="-16" r="0.6" fill="#D48098" opacity="0.4" />
                    <circle cx="-14" cy="-12" r="0.5" fill="#D48098" opacity="0.35" />
                </g>

                {/* Right gill cluster — animated wave (opposite phase) */}
                <g style={{ transformOrigin: '6px -12px', animation: 'gillWaveRight 2.5s ease-in-out infinite' }}>
                    <ellipse cx="12" cy="-15" rx="5.5" ry="3" fill="url(#gillGrad)" opacity="0.75" transform="rotate(30 12 -15)" />
                    <ellipse cx="15" cy="-11" rx="5" ry="2.5" fill="#E8A0B4" opacity="0.6" transform="rotate(50 15 -11)" />
                    <ellipse cx="9" cy="-17.5" rx="4.5" ry="2.2" fill="#F0B0C4" opacity="0.55" transform="rotate(10 9 -17.5)" />
                    <circle cx="11" cy="-16" r="0.6" fill="#D48098" opacity="0.4" />
                    <circle cx="14" cy="-12" r="0.5" fill="#D48098" opacity="0.35" />
                </g>

                {/* Top crown frill */}
                <ellipse cx="0" cy="-18" rx="3.5" ry="4.5" fill="#E8A0B4" opacity="0.65" />
                <ellipse cx="0" cy="-19" rx="2" ry="3" fill="#F0B0C4" opacity="0.4" />

                {/* Body - main shape */}
                <ellipse cx="0" cy="2" rx="14" ry="15" fill="url(#bodyGrad)" />

                {/* Belly highlight */}
                <ellipse cx="0" cy="6" rx="9" ry="8" fill="url(#bellyGrad)" opacity="0.7" />

                {/* Subtle body spots */}
                <circle cx="-8" cy="-4" r="1.2" fill="#F0C0A8" opacity="0.3" />
                <circle cx="7" cy="-2" r="1" fill="#F0C0A8" opacity="0.25" />
                <circle cx="-5" cy="8" r="0.8" fill="#F0C0A8" opacity="0.2" />
                <circle cx="9" cy="5" r="0.9" fill="#F0C0A8" opacity="0.2" />

                {/* Arms */}
                <ellipse cx="-13" cy="8" rx="3.5" ry="2.2" fill="#FFD6C4" transform="rotate(-15 -13 8)">
                    {mood === 'celebrating' && (
                        <animateTransform attributeName="transform" type="rotate" values="-15 -13 8;-30 -13 6;-15 -13 8" dur="0.6s" repeatCount="indefinite" additive="replace" />
                    )}
                </ellipse>
                <ellipse cx="13" cy="8" rx="3.5" ry="2.2" fill="#FFD6C4" transform="rotate(15 13 8)">
                    {mood === 'celebrating' && (
                        <animateTransform attributeName="transform" type="rotate" values="15 13 8;30 13 6;15 13 8" dur="0.6s" repeatCount="indefinite" additive="replace" />
                    )}
                </ellipse>

                {/* Tiny fingers */}
                <circle cx="-16" cy="7.5" r="0.8" fill="#FFCAB3" opacity="0.6" />
                <circle cx="-16.5" cy="9" r="0.7" fill="#FFCAB3" opacity="0.5" />
                <circle cx="16" cy="7.5" r="0.8" fill="#FFCAB3" opacity="0.6" />
                <circle cx="16.5" cy="9" r="0.7" fill="#FFCAB3" opacity="0.5" />

                {/* Feet */}
                <ellipse cx="-6" cy="16" rx="3" ry="1.5" fill="#FFD0BA" transform="rotate(-10 -6 16)" />
                <ellipse cx="6" cy="16" rx="3" ry="1.5" fill="#FFD0BA" transform="rotate(10 6 16)" />

                {/* Tail — animated swish */}
                <path d="M 0 16 Q 5 19 3 22" stroke="#FFD0BA" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.7">
                    <animate attributeName="d"
                        values="M 0 16 Q 5 19 3 22;M 0 16 Q 8 18 6 21;M 0 16 Q 5 19 3 22"
                        dur="2s" repeatCount="indefinite" />
                </path>

                {/* Eyes */}
                <g transform={`translate(0, ${eyeOffY})`}>
                    {/* Eye whites */}
                    <ellipse cx="-5" cy="-3" rx="3.8" ry="3.6" fill="white" opacity="0.9" />
                    <ellipse cx="5" cy="-3" rx="3.8" ry="3.6" fill="white" opacity="0.9" />

                    {/* Pupils — with blink animation */}
                    <ellipse cx="-5" cy="-3" rx={eyeRX} ry={eyeRY} fill="#1C1917" style={{ transition: 'ry 0.08s ease' }}>
                        {isThinking && (
                            <animate attributeName="cx" values="-5;-4;-5;-6;-5" dur="3s" repeatCount="indefinite" />
                        )}
                    </ellipse>
                    <ellipse cx="5" cy="-3" rx={eyeRX} ry={eyeRY} fill="#1C1917" style={{ transition: 'ry 0.08s ease' }}>
                        {isThinking && (
                            <animate attributeName="cx" values="5;6;5;4;5" dur="3s" repeatCount="indefinite" />
                        )}
                    </ellipse>

                    {/* Eye shine */}
                    <circle cx="-3.8" cy="-4.5" r="1.2" fill="white" opacity="0.9" />
                    <circle cx="-5.5" cy="-2" r="0.6" fill="white" opacity="0.5" />
                    <circle cx="6.2" cy="-4.5" r="1.2" fill="white" opacity="0.9" />
                    <circle cx="4.5" cy="-2" r="0.6" fill="white" opacity="0.5" />

                    {/* Eyebrows for thinking/sad */}
                    {mood === 'thinking' && (
                        <>
                            <line x1="-7" y1="-7" x2="-3" y2="-6.5" stroke="#C4A090" strokeWidth="0.7" strokeLinecap="round" />
                            <line x1="3" y1="-6.5" x2="7" y2="-7" stroke="#C4A090" strokeWidth="0.7" strokeLinecap="round" />
                        </>
                    )}
                    {mood === 'sad' && (
                        <>
                            <line x1="-7" y1="-6" x2="-3" y2="-7.5" stroke="#C4A090" strokeWidth="0.7" strokeLinecap="round" />
                            <line x1="3" y1="-7.5" x2="7" y2="-6" stroke="#C4A090" strokeWidth="0.7" strokeLinecap="round" />
                        </>
                    )}
                </g>

                {/* Blush spots */}
                <circle cx="-9.5" cy="0.5" r="2.8" fill="#FFB5A0" opacity="0.3">
                    {isCelebrating && (
                        <animate attributeName="opacity" values="0.3;0.5;0.3" dur="1s" repeatCount="indefinite" />
                    )}
                </circle>
                <circle cx="9.5" cy="0.5" r="2.8" fill="#FFB5A0" opacity="0.3">
                    {isCelebrating && (
                        <animate attributeName="opacity" values="0.3;0.5;0.3" dur="1s" repeatCount="indefinite" />
                    )}
                </circle>

                {/* Nostrils */}
                <circle cx="-1.5" cy="0.5" r="0.5" fill="#D4A898" opacity="0.3" />
                <circle cx="1.5" cy="0.5" r="0.5" fill="#D4A898" opacity="0.3" />

                {/* Mouth */}
                <path d={mouthPaths[mood] || mouthPaths.happy} stroke="#8B4157" strokeWidth="0.9" fill="none" strokeLinecap="round">
                    {isCelebrating && (
                        <animate attributeName="d"
                            values="M -5 2 Q 0 9 5 2;M -5 2.5 Q 0 8 5 2.5;M -5 2 Q 0 9 5 2"
                            dur="0.8s" repeatCount="indefinite" />
                    )}
                </path>
                {/* Open mouth for celebrating/surprised */}
                {(mood === 'celebrating' || mood === 'surprised') && (
                    <ellipse cx="0" cy="5.5" rx="2" ry="1.5" fill="#E8A0B4" opacity="0.6" />
                )}

                {/* Sparkles when celebrating */}
                {isCelebrating && (
                    <g>
                        <g style={{ transformOrigin: '-16px -12px', animation: 'sparkleRotate 3s linear infinite' }}>
                            <text x="-18" y="-10" fontSize="5" fill="var(--color-burgundy)" opacity="0.7">✦</text>
                        </g>
                        <g style={{ transformOrigin: '16px -14px', animation: 'sparkleRotate 4s linear infinite reverse' }}>
                            <text x="14" y="-12" fontSize="4" fill="var(--color-warning)" opacity="0.6">✦</text>
                        </g>
                        <g style={{ transformOrigin: '17px 2px', animation: 'sparkleRotate 2.5s linear infinite' }}>
                            <text x="16" y="4" fontSize="3.5" fill="var(--color-burgundy-light)" opacity="0.6">✦</text>
                        </g>
                        {/* Floating hearts */}
                        <text x="-18" y="6" fontSize="4" fill="#E8A0B4" opacity="0">
                            <animate attributeName="opacity" values="0;0.8;0" dur="2s" repeatCount="indefinite" begin="0.3s" />
                            <animate attributeName="y" values="6;-2" dur="2s" repeatCount="indefinite" begin="0.3s" />
                        </text>
                        <text x="15" y="8" fontSize="3.5" fill="#E8A0B4" opacity="0">
                            <animate attributeName="opacity" values="0;0.7;0" dur="2.5s" repeatCount="indefinite" begin="0.8s" />
                            <animate attributeName="y" values="8;0" dur="2.5s" repeatCount="indefinite" begin="0.8s" />
                        </text>
                    </g>
                )}

                {/* Question marks when thinking */}
                {isThinking && (
                    <g>
                        <text x="12" y="-14" fontSize="7" fill="var(--color-ink-muted)" fontWeight="bold" opacity="0">
                            <animate attributeName="opacity" values="0;0.5;0.5;0" dur="3s" repeatCount="indefinite" />
                            <animate attributeName="y" values="-12;-16" dur="3s" repeatCount="indefinite" />
                        </text>
                    </g>
                )}

                {/* Sweat drop when sad */}
                {mood === 'sad' && (
                    <ellipse cx="8" cy="-6" rx="1" ry="1.5" fill="#A8D4E6" opacity="0">
                        <animate attributeName="opacity" values="0;0.6;0" dur="3s" repeatCount="indefinite" />
                        <animate attributeName="cy" values="-6;-2" dur="3s" repeatCount="indefinite" />
                    </ellipse>
                )}
            </svg>
        </div>
    );
}
